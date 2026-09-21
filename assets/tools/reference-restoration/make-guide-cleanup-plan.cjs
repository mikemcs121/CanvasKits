const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../../..');
const plans = [
  path.join(root, 'Flowers in Vase/info/tmp/reference-restoration/guide-plan.json'),
  path.join(root, 'Gnome Halloween/info/tmp/reference-restoration/guide-plan.json'),
];
const kits = plans.map(file => {
  const plan = JSON.parse(fs.readFileSync(file, 'utf8'));
  plan.work = `${plan.folder}/info/tmp/reference-restoration`;
  // Keep the existing page-colored logo in the template-refactor asset folder.
  return plan;
});
const output = path.join(__dirname, 'guide-cleanup-kits.json');
fs.writeFileSync(output, `${JSON.stringify(kits, null, 2)}\n`);
console.log(output);
