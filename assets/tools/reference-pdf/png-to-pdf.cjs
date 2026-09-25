// Writes a kit's finished-reference PDF from its 2400 x 3000 master PNG: one 576 x 720 pt (8 x 10 in)
// page holding the image losslessly, the same structure as every current root reference PDF.
// Run from the project root:
//   node assets/tools/reference-pdf/png-to-pdf.cjs <master.png> <out.pdf>
// Then check it with assets/tools/pdf-render/render-pdf.cjs ... --expect-pages 1 --expect-points 576x720.
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const Jimp = require(path.resolve(__dirname, '../vector-tools/node_modules/jimp'));

// Same writer as pdfRGB() in assets/tools/reference-restoration/build-art.cjs.
function pdfRGB(file, rgb) {
  const im = zlib.deflateSync(rgb), c = Buffer.from('q\n576 0 0 720 0 0 cm\n/Im0 Do\nQ');
  const objs = [
    Buffer.from('<< /Type /Catalog /Pages 2 0 R >>'),
    Buffer.from('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),
    Buffer.from('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 576 720] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>'),
    Buffer.concat([Buffer.from(`<< /Type /XObject /Subtype /Image /Width 2400 /Height 3000 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length ${im.length} >>\nstream\n`), im, Buffer.from('\nendstream')]),
    Buffer.concat([Buffer.from(`<< /Length ${c.length} >>\nstream\n`), c, Buffer.from('\nendstream')]),
  ];
  const a = [Buffer.from('%PDF-1.4\n% Canvas reference\n')], offsets = [];
  let n = a[0].length;
  objs.forEach((o, i) => { offsets.push(n); const b = Buffer.concat([Buffer.from(`${i + 1} 0 obj\n`), o, Buffer.from('\nendobj\n')]); a.push(b); n += b.length; });
  a.push(Buffer.from(`xref\n0 6\n0000000000 65535 f \n${offsets.map(o => String(o).padStart(10, '0') + ' 00000 n \n').join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${n}\n%%EOF`));
  fs.writeFileSync(file, Buffer.concat(a));
}

(async () => {
  const [input, output] = process.argv.slice(2);
  if (!input || !output) throw Error('Usage: node assets/tools/reference-pdf/png-to-pdf.cjs <master.png> <out.pdf>');
  const { width, height, data } = (await Jimp.read(input)).bitmap;
  if (width !== 2400 || height !== 3000) throw Error(`Master must be 2400 x 3000 pixels; ${input} is ${width} x ${height}.`);
  const rgb = Buffer.alloc(width * height * 3);
  for (let i = 0, j = 0; i < data.length; i += 4, j += 3) { rgb[j] = data[i]; rgb[j + 1] = data[i + 1]; rgb[j + 2] = data[i + 2]; }
  pdfRGB(output, rgb);
  console.log(`Wrote ${output} (576 x 720 pt, 2400 x 3000 image).`);
})().catch(e => { console.error(e.message); process.exitCode = 1; });
