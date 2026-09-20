#!/usr/bin/env node
// Shared PDF -> PNG rasterizer for Canvas Kits verification renders.
//
// Replaces the per-kit render.ps1 scripts that drove Windows.Data.Pdf through
// System.Runtime.WindowsRuntime. That WinRT interop is unsupported in Windows
// PowerShell 5.1 and access-violates (0xC0000005) part way through a multi-kit
// loop, which pops a blocking "powershell.exe - Application Error" box and
// hangs whichever agent thread is waiting on the command.
//
// Usage:
//   node assets/tools/pdf-render/render-pdf.cjs <pdf> [png] [options]
//
//   --pdf <path>            input PDF (or the first positional argument)
//   --out <path>            output PNG (default: the PDF's path with .png)
//   --page <n>              1-based page to render (default 1)
//   --all                   render every page to <out stem>-<n>.png
//   --dpi <n>               render at n DPI (default 300)
//   --width <px>            explicit pixel width (overrides --dpi)
//   --height <px>           explicit pixel height (overrides --dpi)
//   --expect-pages <n>      fail unless the page count matches
//   --expect-points <WxH>   fail unless the page size matches, +/- 0.1 pt
//   --checks <path>         write/append measured results to a JSON array
//   --json                  print the measured results to stdout
//
// Every number written to --checks is measured from the file, never assumed.

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const opts = { page: 1, all: false, dpi: 300, json: false };
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const value = () => {
      const next = argv[i + 1];
      if (next === undefined) throw new Error(`${arg} needs a value`);
      i += 1;
      return next;
    };
    switch (arg) {
      case '--pdf': opts.pdf = value(); break;
      case '--out': case '--image': opts.out = value(); break;
      case '--page': opts.page = Number(value()); break;
      case '--all': opts.all = true; break;
      case '--dpi': opts.dpi = Number(value()); break;
      case '--width': opts.width = Number(value()); break;
      case '--height': opts.height = Number(value()); break;
      case '--expect-pages': opts.expectPages = Number(value()); break;
      case '--expect-points': opts.expectPoints = value(); break;
      case '--checks': opts.checks = value(); break;
      case '--json': opts.json = true; break;
      default:
        if (arg.startsWith('--')) throw new Error(`Unknown option ${arg}`);
        positional.push(arg);
    }
  }
  if (!opts.pdf) opts.pdf = positional.shift();
  if (!opts.out) opts.out = positional.shift();
  if (!opts.pdf) throw new Error('No PDF given. Usage: render-pdf.cjs <pdf> [png] [options]');
  opts.pdf = path.resolve(opts.pdf);
  opts.out = opts.out
    ? path.resolve(opts.out)
    : opts.pdf.replace(/\.pdf$/i, '') + '.png';
  return opts;
}

let crcTable = null;
function crc32(buf) {
  if (!crcTable) {
    crcTable = new Int32Array(256);
    for (let n = 0; n < 256; n += 1) {
      let c = n;
      for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crcTable[n] = c;
    }
  }
  let c = -1;
  for (let i = 0; i < buf.length; i += 1) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

// PNG carries physical resolution in a pHYs chunk; jimp writes none, so splice
// ours in right after IHDR. Canvas Kits treats 300 DPI as the print standard.
function withDpi(png, dpi) {
  const perMetre = Math.round(dpi / 0.0254);
  const body = Buffer.alloc(13);
  body.write('pHYs', 0, 'ascii');
  body.writeUInt32BE(perMetre, 4);
  body.writeUInt32BE(perMetre, 8);
  body.writeUInt8(1, 12); // unit specifier: metres
  const chunk = Buffer.alloc(21);
  chunk.writeUInt32BE(9, 0); // data length, excluding type and CRC
  body.copy(chunk, 4);
  chunk.writeUInt32BE(crc32(body), 17);
  const ihdrEnd = 8 + 4 + 4 + 13 + 4; // signature + IHDR length/type/data/CRC
  return Buffer.concat([png.subarray(0, ihdrEnd), chunk, png.subarray(ihdrEnd)]);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const { PDFiumLibrary } = require('@hyzyla/pdfium');
  const Jimp = require('jimp');

  if (!fs.existsSync(opts.pdf)) throw new Error(`No such PDF: ${opts.pdf}`);

  const library = await PDFiumLibrary.init();
  const doc = await library.loadDocument(new Uint8Array(fs.readFileSync(opts.pdf)));
  const results = [];
  try {
    const pageCount = doc.getPageCount();
    if (opts.expectPages !== undefined && pageCount !== opts.expectPages) {
      throw new Error(`Expected ${opts.expectPages} page(s), found ${pageCount}: ${opts.pdf}`);
    }

    const indexes = opts.all
      ? Array.from({ length: pageCount }, (_, i) => i)
      : [opts.page - 1];

    for (const index of indexes) {
      if (index < 0 || index >= pageCount) {
        throw new Error(`Page ${index + 1} is out of range (${pageCount} page(s)): ${opts.pdf}`);
      }
      const page = doc.getPage(index);
      const { originalWidth, originalHeight } = page.getOriginalSize();

      if (opts.expectPoints) {
        const [w, h] = opts.expectPoints.split(/[x,]/i).map(Number);
        if (Math.abs(originalWidth - w) > 0.1 || Math.abs(originalHeight - h) > 0.1) {
          throw new Error(
            `Expected ${w} x ${h} pt, page ${index + 1} is ` +
            `${originalWidth} x ${originalHeight} pt: ${opts.pdf}`,
          );
        }
      }

      const width = opts.width || Math.round((originalWidth / 72) * opts.dpi);
      const height = opts.height || Math.round((originalHeight / 72) * opts.dpi);

      const rendered = await page.render({
        width,
        height,
        render: async ({ data, width: w, height: h }) => {
          // The bitmap already arrives in the byte order jimp reads as RGBA --
          // verified against known-orange artwork, so do not swap channels.
          const image = new Jimp({ data: Buffer.from(data), width: w, height: h });
          return image.getBufferAsync(Jimp.MIME_PNG);
        },
      });

      const out = opts.all && indexes.length > 1
        ? opts.out.replace(/\.png$/i, '') + `-${index + 1}.png`
        : opts.out;
      fs.mkdirSync(path.dirname(out), { recursive: true });
      const dpi = opts.width || opts.height
        ? Math.round((rendered.width / originalWidth) * 72)
        : opts.dpi;
      fs.writeFileSync(out, withDpi(Buffer.from(rendered.data), dpi));

      results.push({
        pdf: opts.pdf,
        image: out,
        page: index + 1,
        pages: pageCount,
        widthPoints: originalWidth,
        heightPoints: originalHeight,
        pixelWidth: rendered.width,
        pixelHeight: rendered.height,
        dpi,
        renderedAt: new Date().toISOString(),
      });
      process.stdout.write(
        `Rendered ${path.relative(process.cwd(), opts.pdf)} page ${index + 1} ` +
        `(${originalWidth} x ${originalHeight} pt) -> ` +
        `${path.relative(process.cwd(), out)} ` +
        `(${rendered.width} x ${rendered.height} px @ ${dpi} DPI)\n`,
      );
    }
  } finally {
    doc.destroy();
    library.destroy();
  }

  if (opts.checks) {
    const checksPath = path.resolve(opts.checks);
    let existing = [];
    if (fs.existsSync(checksPath)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(checksPath, 'utf8'));
        existing = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        existing = [];
      }
    }
    const kept = existing.filter(
      (entry) => !results.some((r) => r.pdf === entry.pdf && r.page === entry.page),
    );
    fs.mkdirSync(path.dirname(checksPath), { recursive: true });
    fs.writeFileSync(checksPath, JSON.stringify(kept.concat(results), null, 2) + '\n');
  }

  if (opts.json) process.stdout.write(JSON.stringify(results, null, 2) + '\n');
}

main().catch((err) => {
  process.stderr.write(`render-pdf: ${err.message}\n`);
  process.exit(1);
});
