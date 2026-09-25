#!/usr/bin/env node
// Guide image extractor
// Copies every picture embedded in a painting-guide PDF into an assets/ folder beside that PDF,
// at exactly the quality stored in the guide: image streams are inflated and written as lossless
// PNG (alpha from /SMask, ICC profile as iCCP), then read back and compared pixel by pixel.
// The PDF is only read, never changed.
//
// Usage, from anywhere inside the project:
//   node Tools/guide-image-extractor.cjs                    prompts for a kit, then a folder, then a guide
//   node Tools/guide-image-extractor.cjs "Fox Fall"         a kit root or any folder holding a guide PDF
//   node Tools/guide-image-extractor.cjs "Fox Fall/simplified/fox-fall-painting-guide-8x10.pdf"
//   node Tools/guide-image-extractor.cjs --all              every guide in every kit, including subfolders
//                                                           such as simplified/ (info/ and assets/ are skipped)
//
// Names come from the PDF itself: the finished-painting preview, the logo, one file per step panel
// (numbered by panel, named from the alt text stored in the PDF) and the decorative washes. A step
// that reuses an earlier image (the drying panel reuses the preview) gets no second copy.
// Existing identical files are left alone; an existing file with different content stops the run.
const fs = require('fs'), path = require('path'), zlib = require('zlib'), readline = require('readline');
const root = path.resolve(__dirname, '..');
const { PNG } = require(path.join(root, 'assets/tools/pdf-render/node_modules/pngjs'));

const SKIP_DIRS = new Set(['info', 'assets', 'node_modules', 'Tools', '.git']);
const isGuide = f => /painting-guide.*\.pdf$/i.test(f);

// ---------- PDF reading ----------
function openPdf(file) {
  const b = fs.readFileSync(file), s = b.toString('latin1');
  if (/\/Type\s*\/ObjStm/.test(s)) throw Error('compressed object streams are not supported: ' + file);
  const offsets = {};
  for (const m of s.matchAll(/(?:^|[\r\n\s>])(\d+) 0 obj\b/g)) offsets[m[1]] = m.index + m[0].indexOf(m[1]);
  const cache = {};
  function get(n) {
    if (cache[n]) return cache[n];
    const at = offsets[n]; if (at == null) throw Error('missing PDF object ' + n);
    const end = s.indexOf('endobj', at), body = s.slice(at, end);
    const si = body.search(/>>\s*stream\r?\n/);
    const dict = si < 0 ? body : body.slice(0, si + 2);
    let data = null;
    if (si >= 0) {
      const m = body.slice(si).match(/^>>\s*stream(\r?\n)/), start = at + si + m[0].length;
      data = b.subarray(start, start + +dict.match(/\/Length (\d+)/)[1]);
    }
    return (cache[n] = { dict, data });
  }
  return { s, offsets, get };
}

function inflate(o, what) {
  if (!/\/Filter\s*\/FlateDecode/.test(o.dict) || /DecodeParms/.test(o.dict))
    throw Error(`${what} uses an encoding this tool cannot copy losslessly (${(o.dict.match(/\/Filter\s*(\/\w+|\[[^\]]*\])/) || [, 'none'])[1]})`);
  return zlib.inflateSync(o.data);
}

function pdfString(raw) { // (literal) or <hex>, including UTF-16BE with BOM
  if (raw.startsWith('<')) {
    const hex = raw.slice(1, -1).replace(/\s/g, ''), bytes = Buffer.from(hex, 'hex');
    return bytes[0] === 0xfe && bytes[1] === 0xff ? bytes.subarray(2).swap16().toString('utf16le') : bytes.toString('latin1');
  }
  let out = '', t = raw.slice(1, -1);
  for (let i = 0; i < t.length; i++) {
    if (t[i] !== '\\') { out += t[i]; continue; }
    const c = t[++i], map = { n: '\n', r: '\r', t: '\t', b: '\b', f: '\f' };
    if (map[c]) out += map[c]; else if (/[0-7]/.test(c)) { const o = t.slice(i).match(/^[0-7]{1,3}/)[0]; out += String.fromCharCode(parseInt(o, 8)); i += o.length - 1; } else if (c !== '\n') out += c;
  }
  const bytes = Buffer.from(out, 'latin1');
  return bytes[0] === 0xfe && bytes[1] === 0xff ? bytes.subarray(2).swap16().toString('utf16le') : out;
}

// Alt text of /Figure structure elements, keyed by "<page obj>:<mcid>"
function figureAlts(pdf) {
  const alts = {};
  for (const n of Object.keys(pdf.offsets)) {
    const d = pdf.get(n).dict;
    if (!/\/Type\s*\/StructElem\b/.test(d) || !/\/S\s*\/Figure\b/.test(d)) continue;
    const alt = d.match(/\/Alt\s*(\((?:\\.|[^\\)])*\)|<[0-9A-Fa-f\s]*>)/), pg = d.match(/\/Pg\s+(\d+) 0 R/), k = d.match(/\/K\s*(\d+|\[[^\]]*\])/);
    if (!alt || !pg || !k) continue;
    for (const id of k[1].match(/\b\d+\b(?! 0 R)/g) || []) alts[pg[1] + ':' + id] = pdfString(alt[1]).trim();
  }
  return alts;
}

// Top-level image draws on each page, in order, with the /Figure alt text they sit inside
function imageDraws(pdf) {
  const alts = figureAlts(pdf), draws = [];
  const pages = [...pdf.s.matchAll(/(\d+) 0 obj\s*<<\/Type \/Page\b/g)].map(m => m[1]);
  for (const pg of pages) {
    const page = pdf.get(pg).dict;
    const xo = page.match(/\/XObject\s*<<([^>]*)>>/); if (!xo) continue;
    const names = Object.fromEntries([...xo[1].matchAll(/\/([^\s/]+) (\d+) 0 R/g)].map(m => [m[1], m[2]]));
    const contents = page.match(/\/Contents\s*(\d+) 0 R/); if (!contents) throw Error('page contents array not supported');
    const cs = inflate(pdf.get(contents[1]), 'page content').toString('latin1');
    const stack = [];
    for (const t of cs.matchAll(/\/(\w+)\s*<<\/MCID (\d+)\s*>>\s*BDC|\/\w+\s+BMC|\/\w+\s*(?:<<[^>]*>>|\/\w+)\s*BDC|\bEMC\b|\/([^\s/]+) Do\b/g)) {
      if (t[2] != null) stack.push({ tag: t[1], mcid: t[2] });
      else if (/BMC|BDC/.test(t[0])) stack.push({});
      else if (t[0] === 'EMC') stack.pop();
      else {
        const n = names[t[3]]; if (!n || !/\/Subtype\s*\/Image/.test(pdf.get(n).dict)) continue;
        const fig = [...stack].reverse().find(e => e.tag === 'Figure');
        draws.push({ obj: n, alt: fig ? alts[pg + ':' + fig.mcid] ?? '' : null });
      }
    }
  }
  return { draws, pages: pages.length };
}

// ---------- PNG writing ----------
const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc = buf => { let c = 0xffffffff; for (const x of buf) c = crcTable[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
function chunk(type, data) { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type, 'latin1'), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); }

function imagePng(pdf, n) {
  const d = pdf.get(n).dict;
  const w = +d.match(/\/Width (\d+)/)[1], h = +d.match(/\/Height (\d+)/)[1];
  if (!/\/BitsPerComponent 8\b/.test(d)) throw Error(`image object ${n} is not 8 bits per channel`);
  const icc = d.match(/\/ICCBased (\d+) 0 R/);
  const gray = /\/DeviceGray/.test(d) || (icc && /\/N 1\b/.test(pdf.get(icc[1]).dict));
  if (!gray && !/\/DeviceRGB/.test(d) && !(icc && /\/N 3\b/.test(pdf.get(icc[1]).dict))) throw Error(`image object ${n} has an unsupported color space`);
  const ch = gray ? 1 : 3, raw = inflate(pdf.get(n), `image object ${n}`);
  if (raw.length !== w * h * ch) throw Error(`image object ${n}: sample count does not match its size`);
  const sm = d.match(/\/SMask (\d+) 0 R/); let alpha = null;
  if (sm) {
    const a = pdf.get(sm[1]); alpha = inflate(a, `soft mask ${sm[1]}`);
    if (+a.dict.match(/\/Width (\d+)/)[1] !== w || +a.dict.match(/\/Height (\d+)/)[1] !== h || alpha.length !== w * h) throw Error(`soft mask ${sm[1]} does not match its image`);
  }
  const png = new PNG({ width: w, height: h });
  for (let p = 0; p < w * h; p++) {
    const r = raw[p * ch];
    png.data[p * 4] = r; png.data[p * 4 + 1] = gray ? r : raw[p * ch + 1]; png.data[p * 4 + 2] = gray ? r : raw[p * ch + 2];
    png.data[p * 4 + 3] = alpha ? alpha[p] : 255;
  }
  let buf = PNG.sync.write(png, { colorType: alpha ? 6 : 2, deflateLevel: 9 });
  if (icc) { // the PDF keeps the profile zlib-compressed, which is exactly what iCCP stores
    const p = pdf.get(icc[1]);
    if (/\/Filter\s*\/FlateDecode/.test(p.dict) && !/DecodeParms/.test(p.dict))
      buf = Buffer.concat([buf.subarray(0, 33), chunk('iCCP', Buffer.concat([Buffer.from('ICC profile\0\0', 'latin1'), p.data])), buf.subarray(33)]);
  }
  const verify = bytes => { // every pixel must equal the PDF's samples
    const back = PNG.sync.read(bytes);
    if (back.width !== w || back.height !== h) return false;
    for (let p = 0; p < w * h; p++) {
      for (let c = 0; c < 3; c++) if (back.data[p * 4 + c] !== (gray ? raw[p] : raw[p * ch + c])) return false;
      if (back.data[p * 4 + 3] !== (alpha ? alpha[p] : 255)) return false;
    }
    return true;
  };
  return { buf, w, h, alpha: !!alpha, icc: !!icc, verify };
}

// ---------- naming ----------
const slugify = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function planImages(pdf) {
  const { draws, pages } = imageDraws(pdf);
  const named = new Map(); let step = 0, deco = [];
  for (const d of draws) {
    let name = null;
    if (d.alt != null) {
      if (/^finished painting$/i.test(d.alt)) name = 'finished-painting-preview';
      else if (/^river and ridge/i.test(d.alt)) name = 'river-and-ridge-logo';
      else { step++; name = `step-${String(step).padStart(2, '0')}${d.alt ? '-' + slugify(d.alt) : ''}`; }
    }
    if (named.has(d.obj)) continue; // reused image, already named at first use
    if (name) named.set(d.obj, name); else { named.set(d.obj, null); deco.push(d.obj); }
  }
  const decoNames = deco.length === 3 ? ['title-wash', 'materials-wash', 'footer-wash'] : deco.map((_, i) => `decoration-${String(i + 1).padStart(2, '0')}`);
  deco.forEach((o, i) => named.set(o, decoNames[i]));
  const unnamed = [...named.values()].filter(v => !v).length;
  if (unnamed) throw Error('could not name every image');
  return { images: [...named].map(([obj, name]) => ({ obj, name })), steps: step, pages };
}

// ---------- one guide ----------
function extract(pdfFile) {
  const rel = path.relative(root, pdfFile), dir = path.dirname(pdfFile), out = path.join(dir, 'assets');
  const prefix = path.basename(pdfFile, '.pdf').replace(/-painting-guide.*$/i, '');
  const before = fs.readFileSync(pdfFile);
  const pdf = openPdf(pdfFile), plan = planImages(pdf);
  const results = plan.images.map(im => ({ ...im, file: `${prefix}-${im.name}.png`, png: imagePng(pdf, im.obj) }));
  // check every target before writing anything
  const names = results.map(r => r.file); if (new Set(names).size !== names.length) throw Error('two images would get the same file name');
  for (const r of results) {
    const f = path.join(out, r.file);
    r.state = !fs.existsSync(f) ? 'new' : fs.readFileSync(f).equals(r.png.buf) || r.png.verify(fs.readFileSync(f)) ? 'unchanged' : 'conflict';
  }
  const conflicts = results.filter(r => r.state === 'conflict');
  if (conflicts.length) throw Error(`these files already exist in ${path.relative(root, out)} with different pictures; nothing was written:\n  ` + conflicts.map(r => r.file).join('\n  '));
  fs.mkdirSync(out, { recursive: true });
  for (const r of results) if (r.state === 'new') {
    const f = path.join(out, r.file); fs.writeFileSync(f, r.png.buf);
    if (!r.png.verify(fs.readFileSync(f))) throw Error('pixel check failed for ' + f);
  }
  if (!before.equals(fs.readFileSync(pdfFile))) throw Error('guide PDF changed during extraction: ' + rel);
  console.log(`\n${rel}  (${plan.pages} page${plan.pages > 1 ? 's' : ''}, ${plan.steps} illustrated steps)`);
  for (const r of results) console.log(`  ${r.state === 'new' ? 'wrote    ' : 'unchanged'}  ${r.file}  ${r.png.w}x${r.png.h}${r.png.alpha ? ' alpha' : ''}${r.png.icc ? ' icc' : ''}`);
  console.log(`  -> ${path.relative(root, out)}  (${results.length} images, every pixel verified; guide PDF unchanged)`);
}

// ---------- choosing what to run on ----------
const kits = () => fs.readdirSync(root, { withFileTypes: true })
  .filter(e => e.isDirectory() && !SKIP_DIRS.has(e.name) && e.name !== 'assets' && guideFolders(path.join(root, e.name)).length)
  .map(e => e.name).sort();

function guideFolders(dir, depth = 0) { // folders at or below dir (not info/assets) holding a guide PDF
  let found = [];
  let entries; try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return found; }
  if (entries.some(e => e.isFile() && isGuide(e.name))) found.push(dir);
  if (depth < 3) for (const e of entries) if (e.isDirectory() && !SKIP_DIRS.has(e.name)) found = found.concat(guideFolders(path.join(dir, e.name), depth + 1));
  return found;
}

// Answers come from the terminal, or one per line from piped input
let lines = null; const waiting = [];
function answer() {
  if (!lines) {
    lines = []; const rl = readline.createInterface({ input: process.stdin });
    rl.on('line', l => waiting.length ? waiting.shift().res(l) : lines.push(l));
    rl.on('close', () => { lines.closed = true; while (waiting.length) waiting.shift().rej(Error('no answer given (run it in a terminal, or pass a folder or guide PDF)')); });
  }
  process.stdout.write('Number (or q to quit): ');
  if (lines.length) { const l = lines.shift(); if (!process.stdin.isTTY) console.log(l); return Promise.resolve(l); }
  if (lines.closed) return Promise.reject(Error('no answer given (run it in a terminal, or pass a folder or guide PDF)'));
  return new Promise((res, rej) => waiting.push({ res: l => { if (!process.stdin.isTTY) console.log(l); res(l); }, rej }));
}

async function choose(question, options, label = o => o) {
  if (!options.length) throw Error('nothing to choose from for: ' + question);
  if (options.length === 1) { console.log(`${question} ${label(options[0])}`); return options[0]; }
  console.log('\n' + question); options.forEach((o, i) => console.log(`  ${i + 1}. ${label(o)}`));
  for (;;) {
    const a = (await answer()).trim();
    if (/^q/i.test(a)) process.exit(0);
    const i = +a - 1; if (options[i] !== undefined) return options[i];
    console.log('  Enter a number from the list.');
  }
}

async function pickGuide(folder) {
  const pdfs = fs.readdirSync(folder).filter(isGuide).sort();
  if (!pdfs.length) throw Error('no painting-guide PDF in ' + path.relative(root, folder));
  return path.join(folder, await choose('Guide:', pdfs));
}

async function main() {
  const arg = process.argv[2];
  if (arg === '--all') { // every guide in every kit, including subfolders such as simplified/
    for (const k of kits()) for (const d of guideFolders(path.join(root, k))) for (const f of fs.readdirSync(d).filter(isGuide).sort()) extract(path.join(d, f));
    return;
  }
  if (arg && /^-/.test(arg)) { console.log('Usage: node Tools/guide-image-extractor.cjs [kit folder | folder | guide.pdf | --all]'); return; }
  if (arg) {
    const p = path.resolve(process.cwd(), arg), target = fs.existsSync(p) ? p : path.resolve(root, arg);
    if (!fs.existsSync(target)) throw Error('not found: ' + arg);
    if (fs.statSync(target).isFile()) return extract(target);
    const folders = guideFolders(target); if (!folders.length) throw Error('no painting-guide PDF in or below ' + arg);
    return extract(await pickGuide(await choose('Folder:', folders, f => path.relative(target, f) || '(this folder)')));
  }
  const kit = await choose('Which kit?', kits());
  const folder = await choose('Which folder in ' + kit + '?', guideFolders(path.join(root, kit)), f => path.relative(path.join(root, kit), f) || '(kit root)');
  extract(await pickGuide(folder));
}

main().then(() => process.exit(0), e => { console.error('\nStopped: ' + e.message); process.exit(1); });
