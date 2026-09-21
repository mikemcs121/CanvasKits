// Read-only audit of the completed restoration. Safe to rerun.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.resolve(__dirname, '../../..');
const abs = p => path.isAbsolute(p) ? p : path.join(root, p);
const read = p => JSON.parse(fs.readFileSync(abs(p), 'utf8').replace(/^\uFEFF/, ''));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(abs(p))).digest('hex');
const completion = read('assets/tools/reference-restoration/completion-checks.json');
const shared = read('assets/tools/guide-template/kits.json');
const protectedFiles = read('assets/tools/reference-restoration/protected-files.json');
const failures = [];
for (const f of protectedFiles) if (hash(f.path) !== f.sha256) failures.push('Protected: ' + f.path);
for (const f of completion.files) {
  if (hash(f.target) !== f.newSha256) failures.push('Promoted: ' + f.target);
  if (f.archivedAt && hash(f.archivedAt) !== f.oldSha256) failures.push('Archive: ' + f.archivedAt);
}
for (const k of shared) {
  const files = fs.readdirSync(abs(k.folder)).filter(n => fs.statSync(abs(k.folder + '/' + n)).isFile());
  const expected = ['outline-8x10.svg', 'painting-guide-8x10.pdf', 'finished-reference-8x10.pdf'].map(t => k.slug + '-' + t);
  if (files.length !== 3 || expected.some(n => !files.includes(n))) failures.push('Root layout: ' + k.folder);
  if (!k.work.includes('reference-restoration')) continue;
  const plan = read(k.folder + '/info/tmp/template-refactor/plan.json');
  if (JSON.stringify(plan) !== JSON.stringify(k)) failures.push('Plan sync: ' + k.folder);
  const selection = read(k.folder + '/info/production-selection.json');
  for (const f of selection.production) if (hash(f.path) !== f.sha256) failures.push('Selection: ' + f.path);
}
console.log(JSON.stringify({ status: failures.length ? 'failed' : 'passed', protectedFiles: protectedFiles.length, kitRoots: shared.length, promotedAndArchivedRecords: completion.files.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
