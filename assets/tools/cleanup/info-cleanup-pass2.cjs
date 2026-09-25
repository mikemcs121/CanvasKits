// Second info/ cleanup (September 25, 2026): each kit's info/ keeps only archive/previous-root-files/
// and files that help change the kit-root reference PDF, outline SVG, guide PDF and assets/.
// Dry run by default: writes info-cleanup-pass2-manifest.json and info-cleanup-2026-09-25-pass2.md
// beside this script. --apply first moves unique supplied originals into previous-root-files, then
// deletes the files marked remove. Removed files stay in git history at ee3dfae.
// Run from the project root: node assets/tools/cleanup/info-cleanup-pass2.cjs [--apply]
const fs = require('fs'), path = require('path'), crypto = require('crypto');

const root = path.resolve(__dirname, '../../..');
const apply = process.argv.includes('--apply');
const baseCommit = 'ee3dfae';
const manifestFile = path.join(__dirname, 'info-cleanup-pass2-manifest.json');
if (fs.existsSync(manifestFile) && JSON.parse(fs.readFileSync(manifestFile, 'utf8')).applied) {
  console.error('info-cleanup-pass2-manifest.json records an applied cleanup; not overwriting it.');
  process.exit(1);
}
const slash = p => p.split(path.sep).join('/');
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');

// Unique supplied originals that live outside previous-root-files (duplicates were checked by hash).
const moves = [
  ['Fall View', 'assets/reference-restoration/sources/fall-view-finished-reference.png'],
  ['Gnome Fall', 'assets/reference-restoration/sources/gnome-fall-finished-reference.png'],
  ['Gnome Christmas Tree', 'assets/reference-restoration/sources/gnome-christmas-tree-finished-reference.png'],
  ['Starry-night Sunflower', 'archive/original-square-kit/starry-night-sunflower-source-composite.png'],
  ['Starry-night Sunflower', 'archive/original-square-kit/starry-night-sunflower-finished-reference.png'],
].map(([kit, rel]) => ({ kit, from: `${kit}/info/${rel}`, to: `${kit}/info/archive/previous-root-files/${path.basename(rel)}` }));

const autumn = ['Cat in Pumpkin', 'Fox Fall', 'Ghost Fall', 'Pumpkin'];
const restored = ['Fall View', 'Gnome Christmas Tree', 'Gnome Fall', 'Starry-night Sunflower'];

// Paths are relative to the kit's info/ folder. A file is kept if any rule matches.
const common = [
  [/^README\.md$/, 'kit notes'],
  [/^archive\/previous-root-files\//, 'supplied originals'],
  [/^assets\/template-refactor\/river-and-ridge-logo\.png$/, 'guide logo'],
  [/^tmp\/template-refactor\/logo-prompt\.txt$/, 'logo prompt'],
];
const perKit = {};
for (const k of autumn) perKit[k] = [
  [/^output\/pdf\/8x10\/[^/]*-finished-reference-8x10\.png$/, 'reference master (guide preview; png-to-pdf input)'],
  [/^tmp\/8x10-artwork\/(step-\d+\.png|outline\.bmp|paint\.bmp|registered-reference\.png|group-mask\.bin|line-mask\.bin|step-plan\.json)$/, 'guide steps and stage-builder sources'],
  [/^assets\/simplified\//, 'simplified edition art'],
  [/^tmp\/simplified\/(build\.py|verify\.py|verify_promote\.py|promote\.py|black-paws-layer\.py|white-eye-layer\.cjs|render-outline\.cjs|plan\.json|original-hashes\.json)$/, 'simplified edition builder'],
];
perKit['Fox Fall'].push([/^tmp\/(build-new-panels|kit-paths|new-kits|raster)\.cjs$/, 'autumn stage-panel builder']);
perKit['Pumpkin'].push([/^tmp\/transfer-standard\/pumpkin-outline-8x10-render\.png$/, 'read by simplified verify.py']);
for (const k of restored) perKit[k] = [
  [/^assets\/reference-restoration\/(restored-master\.png|guide-step-\d+\.png|step-\d+\.png)$/, 'reference master and guide steps'],
  [/^tmp\/reference-restoration\/(guide-plan\.json|image-prompt[^/]*\.txt)$/, 'restoration plan and prompts'],
  [/^tmp\/organization\/(labels\.bin|regions\.json)$/, 'region maps for build-art.cjs'],
  [/^tmp\/organization-repair\/(labels\.bin|regions\.json|group-assignments\.json)$/, 'region maps for build-art.cjs'],
];
perKit['Gnome Fall'].push([/^assets\/reference-restoration\/candidate-01\.png$/, 'build-art.cjs candidate']);
for (const k of ['Fall View', 'Gnome Christmas Tree', 'Starry-night Sunflower']) perKit[k].push([/^assets\/reference-restoration\/candidate-02\.png$/, 'build-art.cjs candidate']);
perKit['Gnome Christmas Tree'].push(
  [/^assets\/reference-restoration\/tree-detail-candidate\.png$/, 'build-art.cjs tree detail'],
  [/^tmp\/reference-restoration\/(detected-bulbs\.json|christmas-geometry-repairs\.json|tree-edit-prompt\.txt)$/, 'build-art.cjs tree inputs'],
);
perKit['Flowers in Vase'] = [
  [/^output\/pdf\/8x10\/flowers-in-vase-finished-reference-8x10\.png$/, 'reference master (guide preview; png-to-pdf input)'],
  [/^assets\/portrait-rebuild\/(stage-0[1-8]\.png|finished-reference-canonical\.png|outline-canonical-white\.png|painting-normalized\.png)$/, 'guide stages and stage-builder sources'],
  [/^assets\/reference-restoration\/[^/]*-clean\.png$/, 'guide crop panels'],
  [/^tmp\/reference-restoration\/build-clean-crops\.cjs$/, 'crop-panel builder'],
  [/^tmp\/portrait-rebuild\/(build-stages\.cjs|regions\.bin|group-mask\.bin)$/, 'stage builder'],
];
perKit['Gnome Halloween'] = [
  [/^output\/pdf\/8x10\/gnome-halloween-finished-reference-8x10\.png$/, 'reference master (guide preview; png-to-pdf input)'],
  [/^assets\/full-portrait\/(stage-0[1-9]\.png|finished-reference-canonical\.png|outline-canonical-white\.png|painting-final-texture\.png)$/, 'guide stages and stage-builder sources'],
  [/^assets\/reference-restoration\/[^/]*-clean\.png$/, 'guide crop panels'],
  [/^tmp\/reference-restoration\/build-clean-crops\.cjs$/, 'crop-panel builder'],
  [/^tmp\/full-portrait\/(build-stages\.cjs|regions\.bin|group-mask\.bin)$/, 'stage builder'],
];

// Everything the guide builder reads is always kept.
const forced = new Set();
const kits = JSON.parse(fs.readFileSync(path.join(root, 'assets/tools/guide-template/kits.json'), 'utf8').replace(/^﻿/, ''));
const addForced = p => { if (p) forced.add(slash(path.relative(root, path.resolve(root, p))).toLowerCase()); };
for (const k of kits) { addForced(k.reference); addForced(k.logo); for (const s of k.steps) addForced(s.image); }

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}
const kitFolders = fs.readdirSync(root, { withFileTypes: true })
  .filter(e => e.isDirectory() && !e.name.startsWith('.') && fs.existsSync(path.join(root, e.name, 'info'))
    && fs.readdirSync(path.join(root, e.name)).some(n => n.endsWith('-outline-8x10.svg')))
  .map(e => e.name).sort();

const movedFrom = new Set(moves.map(m => m.from.toLowerCase()));
const entries = [];
for (const kit of kitFolders) {
  const info = path.join(root, kit, 'info');
  for (const file of walk(info)) {
    const rel = slash(path.relative(info, file)), projectRel = slash(path.relative(root, file));
    let action = 'remove', reason = 'not needed to change the root reference, outline, guide or assets';
    if (movedFrom.has(projectRel.toLowerCase())) { action = 'move'; reason = 'supplied original moved into previous-root-files'; }
    else if (forced.has(projectRel.toLowerCase())) { action = 'keep'; reason = 'read by guide-template/kits.json'; }
    else for (const [re, why] of [...common, ...(perKit[kit] || [])]) if (re.test(rel)) { action = 'keep'; reason = why; break; }
    entries.push({ kit, path: projectRel, action, reason, bytes: fs.statSync(file).size, sha256: sha(file) });
  }
}
for (const m of moves) {
  const e = entries.find(x => x.path.toLowerCase() === m.from.toLowerCase());
  const done = entries.find(x => x.path.toLowerCase() === m.to.toLowerCase());
  if (!e && done) { Object.assign(done, { reason: 'supplied original moved into previous-root-files', movedFrom: m.from }); continue; }
  if (!e) throw Error('Original to move not found: ' + m.from);
  if (fs.existsSync(path.join(root, m.to))) throw Error('Move target already exists: ' + m.to);
  e.movedTo = m.to;
}

const mb = b => (b / 1048576).toFixed(1) + ' MB';
const lines = ['# info/ cleanup, pass 2, September 25, 2026', '',
  `Each kit's \`info/\` now keeps only \`archive/previous-root-files/\` and the files that help change the kit-root reference PDF, outline SVG, guide PDF and \`assets/\`. Unique supplied originals from \`assets/reference-restoration/sources/\` and Sunflower's \`archive/original-square-kit/\` were moved into \`previous-root-files\`. Removed files remain in git history: \`git checkout ${baseCommit} -- "<path>"\`. Full list with SHA-256: [info-cleanup-pass2-manifest.json](info-cleanup-pass2-manifest.json); rules: [info-cleanup-pass2.cjs](info-cleanup-pass2.cjs).`, '',
  '| Kit | Files before | Size before | Kept (incl. moved) | Size kept | Removed | Size removed |', '|---|---:|---:|---:|---:|---:|---:|'];
const total = { n: 0, b: 0, kn: 0, kb: 0 };
for (const kit of kitFolders) {
  const all = entries.filter(e => e.kit === kit), kept = all.filter(e => e.action !== 'remove');
  const b = all.reduce((s, e) => s + e.bytes, 0), kb = kept.reduce((s, e) => s + e.bytes, 0);
  Object.assign(total, { n: total.n + all.length, b: total.b + b, kn: total.kn + kept.length, kb: total.kb + kb });
  lines.push(`| ${kit} | ${all.length} | ${mb(b)} | ${kept.length} | ${mb(kb)} | ${all.length - kept.length} | ${mb(b - kb)} |`);
}
lines.push(`| **All kits** | ${total.n} | ${mb(total.b)} | ${total.kn} | ${mb(total.kb)} | ${total.n - total.kn} | ${mb(total.b - total.kb)} |`, '');
for (const kit of kitFolders) {
  lines.push(`## ${kit}`, '');
  for (const e of entries.filter(x => x.kit === kit && x.action !== 'remove'))
    lines.push(`- ${e.action === 'move' ? 'moved' : 'kept'}: \`${e.movedTo || e.path}\` (${e.reason})`);
  const g = {};
  for (const e of entries.filter(x => x.kit === kit && x.action === 'remove')) {
    const key = e.path.split('/').slice(1, -1).slice(0, 4).join('/') + '/';
    (g[key] ??= { n: 0, b: 0 }); g[key].n++; g[key].b += e.bytes;
  }
  for (const [k, v] of Object.entries(g).sort()) lines.push(`- removed: \`${k}\`: ${v.n} files, ${mb(v.b)}`);
  lines.push('');
}
fs.writeFileSync(manifestFile, JSON.stringify({ baseCommit, applied: apply, entries }, null, 1));
fs.writeFileSync(path.join(__dirname, 'info-cleanup-2026-09-25-pass2.md'), lines.join('\n'));
console.log(`${apply ? 'Applying' : 'Dry run'}: keep ${total.kn} files (${mb(total.kb)}), remove ${total.n - total.kn} files (${mb(total.b - total.kb)}).`);

if (apply) {
  for (const e of entries) if (e.action === 'move') {
    fs.mkdirSync(path.dirname(path.join(root, e.movedTo)), { recursive: true });
    fs.renameSync(path.join(root, e.path), path.join(root, e.movedTo));
    if (sha(path.join(root, e.movedTo)) !== e.sha256) throw Error('Hash changed moving ' + e.path);
  }
  for (const e of entries) if (e.action === 'remove') fs.rmSync(path.join(root, e.path), { force: true });
  const prune = dir => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) if (e.isDirectory()) prune(path.join(dir, e.name));
    if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
  };
  for (const kit of kitFolders) prune(path.join(root, kit, 'info'));
  console.log('Moved originals, removed files and empty folders.');
}
