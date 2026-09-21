const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const root = path.resolve(__dirname, '../../..');
const shared = fs.readFileSync(path.join(root, 'assets/tools/guide-template/build.cjs'), 'utf8');
const staged = path.join(root, 'assets/tools/reference-restoration/build-guide-cleanup-staged.cjs');
// The shared builder is unchanged; this staged copy only points at the installed
// 32-bit Chrome path available on this host.
fs.writeFileSync(staged, shared.replaceAll('C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'));
const env = { ...process.env, CANVAS_KITS_PLAN: 'assets/tools/reference-restoration/guide-cleanup-kits.json' };
for (const slug of ['flowers-in-vase', 'gnome-halloween']) {
  const result = cp.spawnSync(process.execPath, [staged, slug], { cwd: root, env, encoding: 'utf8', windowsHide: true, maxBuffer: 10e6 });
  process.stdout.write(result.stdout || '');
  process.stderr.write(result.stderr || '');
  if (result.error || result.status) process.exit(result.status || 1);
}
