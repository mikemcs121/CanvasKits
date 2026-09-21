const fs = require('fs');
const path = require('path');
const Jimp = require(path.resolve(__dirname, '../../../../assets/tools/pdf-render/node_modules/jimp'));

const kitRoot = path.resolve(__dirname, '../..', '..');
const source = path.join(kitRoot, 'info/assets/full-portrait/finished-reference-canonical.png');
const step09 = path.join(kitRoot, 'info/assets/full-portrait/stage-09.png');
const outDir = path.join(kitRoot, 'info/assets/reference-restoration');
const crops = [
  // Step 9 combines a clean finished-reference hat/fold crop with a small step-9
  // pumpkin-groove crop. It preserves the caption's two actions without the old
  // brush cues or a heavy inset outline; the pumpkin's printed face remains white.
  { name: 'gnome-panel-09-depth-clean.png', x: 360, y: 30, w: 520, h: 680, composite: true },
  { name: 'gnome-panel-10-lanterns-clean.png', x: 25, y: 1060, w: 315, h: 325 },
  { name: 'gnome-panel-11-light-clean.png', x: 300, y: 940, w: 560, h: 530 },
];

function inside(point, polygon) {
  let hit = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i], [xj, yj] = polygon[j];
    const cross = ((yi > point[1]) !== (yj > point[1])) && (point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi);
    if (cross) hit = !hit;
  }
  return hit;
}

function isolatePumpkin(crop) {
  // Keep only the printed pumpkin/stem, white face interiors, and nearby dark
  // printed features. This removes the old square crop edge and adjacent gnome.
  const contour = [[14, 122], [27, 87], [55, 67], [83, 58], [99, 60], [106, 12], [131, 2], [154, 6], [158, 48], [185, 62], [219, 62], [245, 78], [265, 106], [280, 150], [288, 230], [268, 279], [244, 295], [48, 295], [24, 273], [14, 231]];
  const { width, height, data } = crop.bitmap;
  const base = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    const orange = r > 100 && r > g * 1.2 && r > b * 1.45;
    const stem = g > 58 && g >= b * 1.1 && r < 180;
    const white = r > 155 && g > 155 && b > 145;
    if (inside([x, y], contour) && (orange || stem || white)) base[y * width + x] = 1;
  }
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const p = y * width + x, idx = p * 4;
    if (!base[p]) {
      let near = false;
      for (let dy = -8; dy <= 8 && !near; dy++) for (let dx = -8; dx <= 8; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx >= 0 && yy >= 0 && xx < width && yy < height && base[yy * width + xx]) { near = true; break; }
      }
      if (!near) data[idx + 3] = 0;
    }
  }
  return crop;
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const image = await Jimp.read(source);
  const stage = await Jimp.read(step09);
  if (image.bitmap.width !== 1200 || image.bitmap.height !== 1500) {
    throw new Error(`Unexpected canonical size ${image.bitmap.width}x${image.bitmap.height}`);
  }
  for (const crop of crops) {
    const out = path.join(outDir, crop.name);
    const panel = image.clone().crop(crop.x, crop.y, crop.w, crop.h);
    if (crop.composite) {
      // The source inset is a canonical stage-09 crop, resized only for the
      // existing panel layout. No line, border, or brush cue is added.
      const pumpkin = isolatePumpkin(stage.clone().crop(35, 1080, 300, 305)).resize(215, 220, Jimp.RESIZE_BICUBIC);
      await panel.composite(pumpkin, 290, 345).writeAsync(out);
      console.log(JSON.stringify({ output: out, source, crop: [crop.x, crop.y, crop.w, crop.h], insetSource: 'info/assets/full-portrait/stage-09.png', insetCrop: [35, 1080, 300, 305], insetPlacement: [290, 345, 215, 220] }));
    } else {
      await panel.writeAsync(out);
      console.log(JSON.stringify({ output: out, source, crop: [crop.x, crop.y, crop.w, crop.h] }));
    }
  }
})();
