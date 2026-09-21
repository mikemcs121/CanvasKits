const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Jimp = require(path.resolve(__dirname, '../../../../assets/tools/pdf-render/node_modules/jimp'));
const kitRoot = path.resolve(__dirname, '../..', '..');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const source = path.join(kitRoot, 'info/assets/portrait-rebuild/finished-reference-canonical.png');
const crops = [
  ['step-09', 'flowers-panel-09-petals-clean.png', [540, 480, 400, 340]],
  ['step-10', 'flowers-panel-10-leaf-vase-clean.png', [0, 650, 800, 730]],
  ['step-11', 'flowers-panel-11-berries-clean.png', [790, 740, 330, 480]],
];
(async () => {
  const image = await Jimp.read(source);
  const rows = crops.map(([step, name, crop]) => ({
    step,
    output: `Flowers in Vase/info/assets/reference-restoration/${name}`,
    source: 'Flowers in Vase/info/assets/portrait-rebuild/finished-reference-canonical.png',
    crop,
    outputDimensions: crop.slice(2),
    outputSha256: hash(path.join(kitRoot, 'info/assets/reference-restoration', name)),
  }));
  const result = {
    method: 'Jimp clone/crop from the unchanged canonical working reference; no raster redraw or compositing.',
    source: { path: 'Flowers in Vase/info/assets/portrait-rebuild/finished-reference-canonical.png', dimensions: [image.bitmap.width, image.bitmap.height], sha256: hash(source) },
    productionUnchanged: {
      outline: hash(path.join(kitRoot, 'flowers-in-vase-outline-8x10.svg')),
      finishedReferencePdf: hash(path.join(kitRoot, 'flowers-in-vase-finished-reference-8x10.pdf')),
      guidePdf: hash(path.join(kitRoot, 'flowers-in-vase-painting-guide-8x10.pdf')),
    },
    crops: rows,
  };
  fs.writeFileSync(path.join(__dirname, 'verification.json'), `${JSON.stringify(result, null, 2)}\n`);
})();
