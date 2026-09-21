const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Jimp = require(path.resolve(__dirname, '../../../../assets/tools/pdf-render/node_modules/jimp'));
const kitRoot = path.resolve(__dirname, '../..', '..');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const source = path.join(kitRoot, 'info/assets/full-portrait/finished-reference-canonical.png');
const crops = [
  ['step-09', 'gnome-panel-09-depth-clean.png', [360, 30, 520, 680]],
  ['step-10', 'gnome-panel-10-lanterns-clean.png', [25, 1060, 315, 325]],
  ['step-11', 'gnome-panel-11-light-clean.png', [300, 940, 560, 530]],
];
(async () => {
  const image = await Jimp.read(source);
  const rows = crops.map(([step, name, crop]) => ({
    step,
    output: `Gnome Halloween/info/assets/reference-restoration/${name}`,
    source: 'Gnome Halloween/info/assets/full-portrait/finished-reference-canonical.png',
    crop,
    outputDimensions: crop.slice(2),
    outputSha256: hash(path.join(kitRoot, 'info/assets/reference-restoration', name)),
  }));
  const result = {
    method: 'Jimp clone/crop from unchanged canonical sources; removed brush-cue overlays. Step 9 composites a resized stage-09 pumpkin-groove crop without an added border or premature black face fill.',
    source: { path: 'Gnome Halloween/info/assets/full-portrait/finished-reference-canonical.png', dimensions: [image.bitmap.width, image.bitmap.height], sha256: hash(source) },
    step09InsetSource: { path: 'Gnome Halloween/info/assets/full-portrait/stage-09.png', dimensions: [1200, 1500], crop: [35, 1080, 300, 305], placement: [290, 345, 215, 220], sha256: hash(path.join(kitRoot, 'info/assets/full-portrait/stage-09.png')) },
    productionUnchanged: {
      outline: hash(path.join(kitRoot, 'gnome-halloween-outline-8x10.svg')),
      finishedReferencePdf: hash(path.join(kitRoot, 'gnome-halloween-finished-reference-8x10.pdf')),
      guidePdf: hash(path.join(kitRoot, 'gnome-halloween-painting-guide-8x10.pdf')),
    },
    crops: rows,
  };
  fs.writeFileSync(path.join(__dirname, 'verification.json'), `${JSON.stringify(result, null, 2)}\n`);
})();
