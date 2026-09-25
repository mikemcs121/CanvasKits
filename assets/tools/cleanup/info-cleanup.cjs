// Sorts every file under each kit's info/ folder into keep or remove.
// Dry run by default: writes assets/tools/cleanup/info-cleanup-manifest.json and
// info-cleanup-2026-09-25.md beside it. Pass --apply to delete the
// files marked remove (they stay recoverable from git history at bf75693).
// Run from the project root: node assets/tools/cleanup/info-cleanup.cjs [--apply] [--no-hash]
const fs = require('fs'), path = require('path'), crypto = require('crypto');

const root = path.resolve(__dirname, '../../..');
const apply = process.argv.includes('--apply');
const hashFiles = !process.argv.includes('--no-hash');
const manifestFile = path.join(__dirname, 'info-cleanup-manifest.json');
// The September 25 manifest is the record of what was removed; do not overwrite it by rerunning.
if (fs.existsSync(manifestFile) && JSON.parse(fs.readFileSync(manifestFile, 'utf8')).applied && !process.argv.includes('--force')) {
  console.error('info-cleanup-manifest.json records an applied cleanup. Pass --force to overwrite it and info-cleanup-2026-09-25.md.');
  process.exit(1);
}
const baseCommit = 'bf75693';
const slash = p => p.split(path.sep).join('/');

const autumn = ['Cat in Pumpkin', 'Fox Fall', 'Ghost Fall', 'Pumpkin'];
const restored = ['Fall View', 'Gnome Christmas Tree', 'Gnome Fall', 'Starry-night Sunflower'];

// Paths are relative to the kit's info/ folder. First matching rule wins.
const junk = [
  [/(^|\/)browser-cache\//, 'browser cache'],
  [/(^|\/)chrome-profile-[^/]*\//, 'Chrome profile'],
  [/(^|\/)chrome-organization\//, 'Chrome profile'],
  [/^archive\/build-caches\//, 'archived build cache'],
  [/^cache-archive-moves\.json$/, 'record of moved caches'],
];

const common = [
  [/^(README\.md|production-selection\.json|organization-manifest\.json|sunflower-consolidation-manifest\.json)$/, 'current record'],
  [/^output\//, 'production-matching export'],
  [/^test\//, 'supplied test art'],
  [/^assets\/template-refactor\//, 'page-colored logo'],
  [/^tmp\/template-refactor\/(plan\.json|logo-prompt\.txt)$/, 'current guide plan'],
  [/^assets\/reference-restoration\//, 'current guide art and supplied sources'],
  [/^tmp\/reference-restoration\//, 'current guide work directory and checks'],
  [/^archive\/original-square-kit\//, 'supplied original'],
  [/^assets\/original-square\//, 'supplied original'],
  [/^archive\/previous-root-files\/(exec-[^/]*\.png|download\.png|Screenshot|[^/]*-source-(composite|photo)\.png)$/, 'supplied original'],
];

const perKit = {};
for (const k of autumn) perKit[k] = [
  [/^tmp\/template-refactor\//, 'current guide work directory'],
  [/^tmp\/8x10-artwork\/(step-\d+\.png|step-plan\.json|group-mask\.bin|line-mask\.bin|outline-alpha\.bin|outline\.bmp|paint\.bmp|canonical-outline\.png|registered-reference\.png|geometry-checks\.json)$/, 'guide step art and rebuild source'],
  [/^tmp\/simplified\//, 'simplified edition build and checks'],
  [/^assets\/simplified\//, 'simplified edition art'],
];
perKit['Pumpkin'].push([/^tmp\/transfer-standard\/pumpkin-outline-8x10-render\.png$/, 'read by simplified verify.py']);
perKit['Fox Fall'].push(
  [/^tmp\/(build-new-panels|kit-paths|new-kits|raster)\.cjs$/, 'stage-panel rebuild source'],
  [/^tmp\/vector-tools\//, 'shared jimp/resvg used by current tools'],
);
for (const k of restored) perKit[k] = [
  [/^tmp\/organization\/(labels\.bin|regions\.json|regions\.png)$/, 'restoration rebuild source'],
  [/^tmp\/organization-repair\/(labels\.bin|regions\.json|group-assignments\.json)$/, 'restoration rebuild source'],
];
perKit['Flowers in Vase'] = [
  [/^assets\/portrait-rebuild\//, 'stage art and rebuild source'],
  [/^tmp\/portrait-rebuild\/(prepare-art\.cjs|build-stages\.cjs|flowers-in-vase-outline-8x10\.svg|group-mask\.bin|groups\.csv|region-overrides\.json|regions\.bin|regions\.json|stage-checks\.json|final-checks\.json|captions\.txt|outline-prompt\.txt|painting-prompt\.txt|review-notes\.md)$/, 'stage rebuild source'],
];
perKit['Gnome Halloween'] = [
  [/^assets\/full-portrait\//, 'stage art and rebuild source'],
  [/^tmp\/full-portrait\/(prepare\.cjs|build-stages\.cjs|gnome-halloween-outline-8x10\.svg|group-mask\.bin|regions\.bin|regions\.json|source-record\.json|composition-plan\.json|stage-checks\.json|verification\.json|captions\.txt|headings\.txt|painting-prompt\.txt|review-notes\.md)$/, 'stage rebuild source'],
];

// Anything the shared guide builder or the restoration audit reads is always kept.
const forced = new Set();
const addForced = p => { if (p) forced.add(slash(path.relative(root, path.resolve(root, p))).toLowerCase()); };
const kits = JSON.parse(fs.readFileSync(path.join(root, 'assets/tools/guide-template/kits.json'), 'utf8').replace(/^﻿/, ''));
for (const k of kits) {
  addForced(k.reference); addForced(k.logo);
  for (const s of k.steps || []) { addForced(s.image); addForced(s.canonicalStage); }
}
const completion = JSON.parse(fs.readFileSync(path.join(root, 'assets/tools/reference-restoration/completion-checks.json'), 'utf8').replace(/^﻿/, ''));
for (const f of completion.files) addForced(f.target);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

function classify(kit, rel, projectRel) {
  for (const [re, why] of junk) if (re.test(rel)) return ['remove', why];
  if (forced.has(projectRel.toLowerCase())) return ['keep', 'read by kits.json or restoration audit'];
  for (const [re, why] of [...common, ...(perKit[kit] || [])]) if (re.test(rel)) return ['keep', why];
  return ['remove', 'superseded build, review or archived edition'];
}

const kitFolders = fs.readdirSync(root, { withFileTypes: true })
  .filter(e => e.isDirectory() && !e.name.startsWith('.') && fs.existsSync(path.join(root, e.name, 'info'))
    && fs.readdirSync(path.join(root, e.name)).some(n => n.endsWith('-outline-8x10.svg')))
  .map(e => e.name).sort();

const entries = [];
for (const kit of kitFolders) {
  const info = path.join(root, kit, 'info');
  for (const file of walk(info)) {
    const rel = slash(path.relative(info, file));
    const projectRel = slash(path.relative(root, file));
    const [action, reason] = classify(kit, rel, projectRel);
    const bytes = fs.statSync(file).size;
    const sha256 = hashFiles ? crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') : undefined;
    entries.push({ kit, path: projectRel, action, reason, bytes, sha256 });
  }
}

// Summaries: per kit totals, and removals grouped by folder (first three levels under info/).
const mb = b => (b / 1048576).toFixed(1) + ' MB';
const group = p => p.split('/').slice(1, -1).slice(0, 4).join('/') + '/';
const lines = ['# info/ cleanup, September 25, 2026', '',
  `Every kit's \`info/\` folder was reduced to the files that current tools read, the sources needed to rebuild guide steps, simplified editions and restored references, current checks and records, and supplied originals. Removed files remain in git history: restore any of them with \`git checkout ${baseCommit} -- "<path>"\`. The full file list with sizes, SHA-256 and reasons is \`assets/tools/cleanup/info-cleanup-manifest.json\`; the rules are in \`assets/tools/cleanup/info-cleanup.cjs\`.`, '',
  '| Kit | Files before | Size before | Files kept | Size kept | Files removed | Size removed |', '|---|---:|---:|---:|---:|---:|---:|'];
const total = { n: 0, b: 0, kn: 0, kb: 0 };
for (const kit of kitFolders) {
  const all = entries.filter(e => e.kit === kit), kept = all.filter(e => e.action === 'keep');
  const b = all.reduce((s, e) => s + e.bytes, 0), kb = kept.reduce((s, e) => s + e.bytes, 0);
  total.n += all.length; total.b += b; total.kn += kept.length; total.kb += kb;
  lines.push(`| ${kit} | ${all.length} | ${mb(b)} | ${kept.length} | ${mb(kb)} | ${all.length - kept.length} | ${mb(b - kb)} |`);
}
lines.push(`| **All kits** | ${total.n} | ${mb(total.b)} | ${total.kn} | ${mb(total.kb)} | ${total.n - total.kn} | ${mb(total.b - total.kb)} |`, '');
for (const kit of kitFolders) {
  lines.push(`## ${kit}`, '', 'Kept:', '');
  const summarize = action => {
    const g = {};
    for (const e of entries.filter(x => x.kit === kit && x.action === action)) {
      const key = group(e.path) + ' (' + e.reason + ')';
      (g[key] ??= { n: 0, b: 0 }); g[key].n++; g[key].b += e.bytes;
    }
    return Object.entries(g).sort().map(([k, v]) => `- \`${k.replace(' (', '` (')}: ${v.n} files, ${mb(v.b)}`);
  };
  lines.push(...summarize('keep'), '', 'Removed:', '', ...summarize('remove'), '');
}

fs.writeFileSync(manifestFile, JSON.stringify({ baseCommit, applied: apply, entries }, null, 1));
fs.writeFileSync(path.join(__dirname, 'info-cleanup-2026-09-25.md'), lines.join('\n'));
console.log(`${apply ? 'Applying' : 'Dry run'}: keep ${total.kn} files (${mb(total.kb)}), remove ${total.n - total.kn} files (${mb(total.b - total.kb)}).`);

if (apply) {
  for (const e of entries) if (e.action === 'remove') fs.rmSync(path.join(root, e.path), { force: true });
  const prune = dir => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) if (e.isDirectory()) prune(path.join(dir, e.name));
    if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
  };
  for (const kit of kitFolders) prune(path.join(root, kit, 'info'));
  console.log('Removed files and empty folders.');
}
