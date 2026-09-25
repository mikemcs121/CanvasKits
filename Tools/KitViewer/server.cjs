// Kit Viewer: a portable Chromium app for browsing the canvas kits.
// Serves the project over loopback HTTP and opens viewer.html in an Edge or
// Chrome app window. Start it with "Kit Viewer.cmd".
//
//   node server.cjs            relaunch hidden in the background, then exit
//   node server.cjs --serve    run the server and open the app window
//   node server.cjs --serve --no-browser   server only; prints the URL
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawn, execFile } = require('child_process');

const args = process.argv.slice(2);

if (!args.includes('--serve')) {
  // Detach so the launching console window can close straight away.
  spawn(process.execPath, [__filename, '--serve', ...args], {
    detached: true, stdio: 'ignore', windowsHide: true,
  }).unref();
  process.exit(0);
}

const ROOT = findRoot();
const PAGE = path.join(__dirname, 'viewer.html');
const ICON = path.join(__dirname, 'icon.svg');
const EXTRACTOR = path.join(ROOT, 'Tools', 'guide-image-extractor.cjs');
const TYPES = {
  '.pdf': 'application/pdf', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
  '.json': 'application/json; charset=utf-8', '.html': 'text/html; charset=utf-8',
  '.md': 'text/plain; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.csv': 'text/plain; charset=utf-8', '.cjs': 'text/plain; charset=utf-8', '.js': 'text/plain; charset=utf-8',
};

let lastPing = Date.now();
let byeAt = 0;

function findRoot() {
  for (let d = __dirname; ; d = path.dirname(d)) {
    if (fs.existsSync(path.join(d, 'AGENTS.md')) && fs.existsSync(path.join(d, 'Tools'))) return d;
    if (path.dirname(d) === d) throw new Error('Kit Viewer must live inside the Canvas Kits project.');
  }
}

function findBrowser() {
  const env = process.env;
  const candidates = [
    [env['ProgramFiles(x86)'], 'Microsoft/Edge/Application/msedge.exe'],
    [env.ProgramFiles, 'Microsoft/Edge/Application/msedge.exe'],
    [env.ProgramFiles, 'Google/Chrome/Application/chrome.exe'],
    [env['ProgramFiles(x86)'], 'Google/Chrome/Application/chrome.exe'],
    [env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe'],
    [env.LOCALAPPDATA, 'Chromium/Application/chrome.exe'],
  ];
  for (const [base, rel] of candidates) {
    if (base && fs.existsSync(path.join(base, rel))) return path.join(base, rel);
  }
  return null;
}

// Maps a project-relative path to a full path, refusing anything outside the project.
function resolve(rel) {
  if (!rel) return null;
  const full = path.resolve(ROOT, rel);
  return full.toLowerCase().startsWith(ROOT.toLowerCase() + path.sep) ? full : null;
}

const rel = full => full && path.relative(ROOT, full).split(path.sep).join('/');
const byName = (a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' });

function entries(dir) {
  try { return fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => byName(a.name, b.name)); }
  catch { return []; }
}

function findOne(dir, re) {
  const hit = entries(dir).find(e => e.isFile() && re.test(e.name));
  return hit ? path.join(dir, hit.name) : null;
}

function listFiles(dir) {
  const out = [];
  for (const e of entries(dir)) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listFiles(full));
    else if (e.isFile()) out.push(rel(full));
  }
  return out;
}

function scanKits() {
  const kits = [];
  for (const e of entries(ROOT)) {
    if (!e.isDirectory()) continue;
    const dir = path.join(ROOT, e.name);
    const reference = findOne(dir, /-finished-reference-.*\.pdf$/i);
    const guide = findOne(dir, /-painting-guide-.*\.pdf$/i);
    const outline = findOne(dir, /-outline-.*\.svg$/i);
    if (!reference && !guide && !outline) continue;

    let simplified = null;
    const simp = entries(dir).find(s => s.isDirectory() && /^simpl/i.test(s.name));
    if (simp) {
      const sdir = path.join(dir, simp.name);
      simplified = {
        name: simp.name,
        path: rel(sdir),
        files: entries(sdir).filter(s => s.isFile()).map(s => rel(path.join(sdir, s.name))),
        guide: rel(findOne(sdir, /-painting-guide-.*\.pdf$/i)),
        // info/ holds working files, not kit content.
        folders: entries(sdir).filter(s => s.isDirectory() && s.name.toLowerCase() !== 'info').map(s => ({
          name: s.name, path: rel(path.join(sdir, s.name)), files: listFiles(path.join(sdir, s.name)),
        })),
      };
    }

    kits.push({
      name: e.name, path: rel(dir),
      reference: rel(reference), guide: rel(guide), outline: rel(outline),
      assets: listFiles(path.join(dir, 'assets')),
      simplified,
    });
  }
  return kits;
}

function send(res, status, type, body) {
  const headers = { 'Cache-Control': 'no-store' };
  if (type) headers['Content-Type'] = type;
  res.writeHead(status, headers);
  res.end(body);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const p = url.pathname;
  try {
    if (p === '/' || p === '/index.html') {
      send(res, 200, 'text/html; charset=utf-8', fs.readFileSync(PAGE));
    } else if (p === '/icon.svg' || p === '/favicon.ico') {
      send(res, 200, 'image/svg+xml', fs.readFileSync(ICON));
    } else if (p === '/api/extract' && req.method === 'POST') {
      // Runs the guide image extractor on one guide PDF and returns its console output.
      const full = resolve(url.searchParams.get('path'));
      if (!full || !/painting-guide.*\.pdf$/i.test(full) || !fs.existsSync(full)) return send(res, 400, 'text/plain', 'Not a painting-guide PDF in the project.');
      execFile(process.execPath, [EXTRACTOR, full], { cwd: ROOT, timeout: 5 * 60000, windowsHide: true }, (err, stdout, stderr) => {
        send(res, 200, 'application/json; charset=utf-8', JSON.stringify({ ok: !err, output: (stdout + stderr).trim() }));
      });
    } else if (p === '/api/kits') {
      send(res, 200, 'application/json; charset=utf-8', JSON.stringify(scanKits()));
    } else if (p === '/api/ping') {
      lastPing = Date.now();
      byeAt = 0;
      send(res, 204);
    } else if (p === '/api/bye') {
      byeAt = Date.now();
      send(res, 204);
    } else if (p === '/api/reveal') {
      const full = resolve(url.searchParams.get('path'));
      if (full && fs.existsSync(full)) {
        const target = fs.statSync(full).isFile() ? `/select,"${full}"` : `"${full}"`;
        spawn('explorer.exe', [target], { windowsVerbatimArguments: true, detached: true, stdio: 'ignore' }).unref();
      }
      send(res, 204);
    } else if (p.startsWith('/files/')) {
      const full = resolve(decodeURIComponent(p.slice(7)));
      if (!full || !fs.existsSync(full) || !fs.statSync(full).isFile()) return send(res, 404, 'text/plain', 'Not found');
      res.writeHead(200, {
        'Content-Type': TYPES[path.extname(full).toLowerCase()] || 'application/octet-stream',
        'Content-Length': fs.statSync(full).size,
        'Cache-Control': 'no-store',
      });
      fs.createReadStream(full).pipe(res);
    } else {
      send(res, 404, 'text/plain', 'Not found');
    }
  } catch (err) {
    send(res, 500, 'text/plain', String(err));
  }
});

server.listen(0, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${server.address().port}/`;
  if (args.includes('--no-browser')) {
    console.log(url);
    return;
  }

  const browser = findBrowser();
  if (!browser) {
    spawn('msg.exe', ['*', 'Kit Viewer needs Microsoft Edge or Google Chrome.'], { stdio: 'ignore' });
    process.exit(1);
  }
  // A dedicated profile keeps the app window separate from normal browsing.
  const profile = path.join(process.env.LOCALAPPDATA || __dirname, 'KitViewer', 'BrowserProfile');
  const started = Date.now();
  let exitedAt = 0;
  const child = spawn(browser, [
    `--app=${url}`, `--user-data-dir=${profile}`,
    '--no-first-run', '--no-default-browser-check', '--window-size=1500,1000',
  ], { detached: true, stdio: 'ignore' });
  child.on('exit', () => { exitedAt = Date.now(); });
  child.unref();

  // Stay alive while the window is open. The page pings every few seconds and
  // sends a beacon when it closes; the browser process exit is a backstop.
  setInterval(() => {
    const now = Date.now();
    if (byeAt && now - byeAt > 4000) process.exit(0);
    if (exitedAt) {
      // A quick exit means the launch was handed to an already running browser.
      const handedOff = exitedAt - started < 5000;
      if (!handedOff || now - lastPing > 90000) process.exit(0);
    }
  }, 1000);
});
