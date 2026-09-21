const fs = require('fs');
const path = require('path');
const Jimp = require(path.resolve(__dirname, '../../../../assets/tools/pdf-render/node_modules/jimp'));

const kitRoot = path.resolve(__dirname, '../..', '..');
const source = path.join(kitRoot, 'info/assets/portrait-rebuild/finished-reference-canonical.png');
const outDir = path.join(kitRoot, 'info/assets/reference-restoration');
const crops = [
  { name: 'flowers-panel-09-petals-clean.png', x: 540, y: 480, w: 400, h: 340 },
  { name: 'flowers-panel-10-leaf-vase-clean.png', x: 0, y: 650, w: 800, h: 730 },
  { name: 'flowers-panel-11-berries-clean.png', x: 790, y: 740, w: 330, h: 480 },
];

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const image = await Jimp.read(source);
  if (image.bitmap.width !== 1120 || image.bitmap.height !== 1400) {
    throw new Error(`Unexpected canonical size ${image.bitmap.width}x${image.bitmap.height}`);
  }
  for (const crop of crops) {
    const out = path.join(outDir, crop.name);
    await image.clone().crop(crop.x, crop.y, crop.w, crop.h).writeAsync(out);
    console.log(JSON.stringify({ output: out, source, crop: [crop.x, crop.y, crop.w, crop.h] }));
  }
})();
