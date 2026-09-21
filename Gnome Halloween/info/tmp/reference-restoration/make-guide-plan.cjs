const fs = require('fs');
const path = require('path');

const kitRoot = path.resolve(__dirname, '../..', '..');
const activePath = path.join(kitRoot, 'info/tmp/template-refactor/plan.json');
const outputPath = path.join(__dirname, 'guide-plan.json');
const plan = JSON.parse(fs.readFileSync(activePath, 'utf8'));
plan.work = 'Gnome Halloween/info/tmp/reference-restoration';
const replacements = [
  ['gnome-panel-09-depth-clean.png', [360, 30, 520, 680]],
  ['gnome-panel-10-lanterns-clean.png', [25, 1060, 315, 325]],
  ['gnome-panel-11-light-clean.png', [300, 940, 560, 530]],
];
for (let i = 0; i < replacements.length; i++) {
  plan.steps[8 + i].image = `Gnome Halloween/info/assets/reference-restoration/${replacements[i][0]}`;
}
plan.referenceRestoration = {
  source: 'Gnome Halloween/info/assets/full-portrait/finished-reference-canonical.png',
  method: 'Deterministic canonical crops; removed old drawn brush cues. Step 9 combines a finished-reference hat/fold crop with a resized stage-09 pumpkin-groove crop, without a heavy inset outline or premature black face fill.',
  crops: replacements.map(([file, crop], i) => ({ step: i + 9, file: `Gnome Halloween/info/assets/reference-restoration/${file}`, crop }))
};
plan.referenceRestoration.crops[0].inset = {
  source: 'Gnome Halloween/info/assets/full-portrait/stage-09.png',
  crop: [35, 1080, 300, 305],
  placement: [290, 345, 215, 220],
  note: 'Canonical step-09 pumpkin grooves; face interiors remain white until step 10.'
};
fs.writeFileSync(outputPath, `${JSON.stringify(plan, null, 2)}\n`);
console.log(outputPath);
