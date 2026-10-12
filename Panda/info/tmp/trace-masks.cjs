// Traces each region mask PNG (black = region) with potrace and writes {name: pathData} JSON.
// Called by build-art.py:  node trace-masks.cjs <maskDir> <out.json>
const fs = require('fs'), path = require('path');
const potrace = require(path.resolve(__dirname, '../../../assets/tools/vector-tools/node_modules/potrace'));
const [dir, out] = process.argv.slice(2);
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
const result = {};
let left = files.length;
for (const f of files) {
  const t = new potrace.Potrace({ turdSize: 400, alphaMax: 0.9, optCurve: true, optTolerance: 0.3, threshold: 128 });
  t.loadImage(path.join(dir, f), err => {
    if (err) throw err;
    result[f.replace(/\.png$/, '')] = t.getPathTag().match(/ d="([^"]+)"/)[1];
    if (--left === 0) fs.writeFileSync(out, JSON.stringify(result));
  });
}
