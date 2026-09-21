const fs = require('fs');
const path = require('path');

const kitRoot = path.resolve(__dirname, '../..', '..');
const activePath = path.join(kitRoot, 'info/tmp/template-refactor/plan.json');
const outputPath = path.join(__dirname, 'guide-plan.json');
const plan = JSON.parse(fs.readFileSync(activePath, 'utf8'));
plan.work = 'Flowers in Vase/info/tmp/reference-restoration';
const replacements = [
  ['flowers-panel-09-petals-clean.png', [540, 480, 400, 340]],
  ['flowers-panel-10-leaf-vase-clean.png', [0, 650, 800, 730]],
  ['flowers-panel-11-berries-clean.png', [790, 740, 330, 480]],
];
for (let i = 0; i < replacements.length; i++) {
  plan.steps[8 + i].image = `Flowers in Vase/info/assets/reference-restoration/${replacements[i][0]}`;
}
plan.referenceRestoration = {
  source: 'Flowers in Vase/info/assets/portrait-rebuild/finished-reference-canonical.png',
  method: 'Exact deterministic crops from the unchanged canonical working reference; no redraw, overlay, or source replacement.',
  crops: replacements.map(([file, crop], i) => ({ step: i + 9, file: `Flowers in Vase/info/assets/reference-restoration/${file}`, crop }))
};
fs.writeFileSync(outputPath, `${JSON.stringify(plan, null, 2)}\n`);
console.log(outputPath);
