#!/usr/bin/env node
// Guide image extractor
// Copies every picture embedded in a painting-guide PDF into an assets/ folder beside that PDF,
// at exactly the quality stored in the guide: image streams are inflated and written as lossless
// PNG (alpha from /SMask, ICC profile as iCCP), then read back and compared pixel by pixel.
// The PDF is only read, never changed.
//
// Usage, from anywhere inside the project:
//   node Tools/guide-image-extractor.cjs                    prompts for a kit, then a folder, then a guide
//   node Tools/guide-image-extractor.cjs "Fox Fall"         a kit root or any folder holding a guide PDF
//   node Tools/guide-image-extractor.cjs "Fox Fall/simplified/fox-fall-painting-guide-8x10.pdf"
//   node Tools/guide-image-extractor.cjs --all              every guide in every kit, including subfolders
//                                                           such as simplified/ (info/ and assets/ are skipped)
//
// Names come from the PDF itself: the finished-painting preview, the logo, one file per step panel
// (numbered by panel, named from the alt text stored in the PDF, or from the numbered heading under
// the picture in untagged guides such as the ReportLab-built simplified editions) and the decorative
// washes. A step that reuses an earlier image still gets its own step file, so every panel is present.
//
// Some step panels are composed: the guide draws over the picture (a paintbrush on late steps) or
// places it in a scene (the drying panel's desk, paint pots and brushes around the tilted preview).
// Copying the embedded picture would lose that, so those panels are rendered from the page with the
// shared PDFium renderer at 600 DPI and cropped just inside the panel frame. The report marks them.
// Existing identical files are left alone; an existing file with different content stops the run.
const fs = require('fs'), path = require('path'), zlib = require('zlib'), readline = require('readline');
const root = path.resolve(__dirname, '..');
const { PNG } = require(path.join(root, 'assets/tools/pdf-render/node_modules/pngjs'));

const SKIP_DIRS = new Set(['info', 'assets', 'node_modules', 'Tools', '.git']);
const isGuide = f => /painting-guide.*\.pdf$/i.test(f);

// ---------- PDF reading ----------
function openPdf(file) {
  const b = fs.readFileSync(file), s = b.toString('latin1');
  if (/\/Type\s*\/ObjStm/.test(s)) throw Error('compressed object streams are not supported: ' + file);
  const offsets = {};
  for (const m of s.matchAll(/(?:^|[\r\n\s>])(\d+) 0 obj\b/g)) offsets[m[1]] = m.index + m[0].indexOf(m[1]);
  const cache = {};
  function get(n) {
    if (cache[n]) return cache[n];
    const at = offsets[n]; if (at == null) throw Error('missing PDF object ' + n);
    const end = s.indexOf('endobj', at), body = s.slice(at, end);
    const si = body.search(/>>\s*stream\r?\n/);
    const dict = si < 0 ? body : body.slice(0, si + 2);
    let data = null;
    if (si >= 0) {
      const m = body.slice(si).match(/^>>\s*stream(\r?\n)/), start = at + si + m[0].length;
      data = b.subarray(start, start + +dict.match(/\/Length (\d+)/)[1]);
    }
    return (cache[n] = { dict, data });
  }
  return { s, offsets, get };
}

function ascii85(buf) { // text wrapping only, so still lossless
  const t = buf.toString('latin1').replace(/\s/g, '').replace(/^<~/, '').replace(/~>$/, '').replace(/z/g, '!!!!!'), out = [];
  for (let i = 0; i < t.length; i += 5) {
    const g = t.slice(i, i + 5), n = g.length; let v = 0;
    for (const ch of g.padEnd(5, 'u')) v = v * 85 + ch.charCodeAt(0) - 33;
    out.push(...[v >>> 24, (v >>> 16) & 255, (v >>> 8) & 255, v & 255].slice(0, n - 1));
  }
  return Buffer.from(out);
}

// The zlib data of a stream: FlateDecode, optionally wrapped in ASCII85Decode (as ReportLab writes it)
function zlibData(o, what) {
  const f = (o.dict.match(/\/Filter\s*(\/\w+|\[[^\]]*\])/) || [, ''])[1], filters = f.match(/\/\w+/g) || [];
  if (/DecodeParms/.test(o.dict) || filters.at(-1) !== '/FlateDecode' || filters.slice(0, -1).some(x => x !== '/ASCII85Decode'))
    throw Error(`${what} uses an encoding this tool cannot copy losslessly (${f || 'none'})`);
  let d = o.data; for (let i = 1; i < filters.length; i++) d = ascii85(d);
  return d;
}
const inflate = (o, what) => zlib.inflateSync(zlibData(o, what));

function pdfString(raw) { // (literal) or <hex>, including UTF-16BE with BOM
  if (raw.startsWith('<')) {
    const hex = raw.slice(1, -1).replace(/\s/g, ''), bytes = Buffer.from(hex, 'hex');
    return bytes[0] === 0xfe && bytes[1] === 0xff ? bytes.subarray(2).swap16().toString('utf16le') : bytes.toString('latin1');
  }
  let out = '', t = raw.slice(1, -1);
  for (let i = 0; i < t.length; i++) {
    if (t[i] !== '\\') { out += t[i]; continue; }
    const c = t[++i], map = { n: '\n', r: '\r', t: '\t', b: '\b', f: '\f' };
    if (map[c]) out += map[c]; else if (/[0-7]/.test(c)) { const o = t.slice(i).match(/^[0-7]{1,3}/)[0]; out += String.fromCharCode(parseInt(o, 8)); i += o.length - 1; } else if (c !== '\n') out += c;
  }
  const bytes = Buffer.from(out, 'latin1');
  return bytes[0] === 0xfe && bytes[1] === 0xff ? bytes.subarray(2).swap16().toString('utf16le') : out;
}

// Alt text of /Figure structure elements, keyed by "<page obj>:<mcid>"
function figureAlts(pdf) {
  const alts = {};
  for (const n of Object.keys(pdf.offsets)) {
    const d = pdf.get(n).dict;
    if (!/\/Type\s*\/StructElem\b/.test(d) || !/\/S\s*\/Figure\b/.test(d)) continue;
    const alt = d.match(/\/Alt\s*(\((?:\\.|[^\\)])*\)|<[0-9A-Fa-f\s]*>)/), pg = d.match(/\/Pg\s+(\d+) 0 R/), k = d.match(/\/K\s*(\d+|\[[^\]]*\])/);
    if (!alt || !pg || !k) continue;
    for (const id of k[1].match(/\b\d+\b(?! 0 R)/g) || []) alts[pg[1] + ':' + id] = pdfString(alt[1]).trim();
  }
  return alts;
}

// Panel geometry: follows transforms and clipping through a content stream. For every XObject
// draw (in order) it returns the clip box in page points, and lists everything else painted, so
// a step picture with drawing on top (a brush, or the drying panel's desk scene) can be found.
function drawingState(cs) {
  const mul = (a, b) => [a[0] * b[0] + a[1] * b[2], a[0] * b[1] + a[1] * b[3], a[2] * b[0] + a[3] * b[2], a[2] * b[1] + a[3] * b[3], a[4] * b[0] + a[5] * b[2] + b[4], a[4] * b[1] + a[5] * b[3] + b[5]];
  const at = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
  const box = (m, pts) => { const p = pts.map(([x, y]) => at(m, x, y)), xs = p.map(q => q[0]), ys = p.map(q => q[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
  const meet = (a, b) => !a ? b : [Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.min(a[2], b[2]), Math.min(a[3], b[3])];
  let g = { ctm: [1, 0, 0, 1, 0, 0], clip: null }, path = { pts: [], rects: 0, other: false }, clipNext = false, ops = [];
  const stack = [], draws = [], paints = [];
  for (const [t] of cs.matchAll(/\bBT\b[\s\S]*?\bET\b|\bBI\b[\s\S]*?\bEI\b|\((?:\\.|[^\\)])*\)|<<[\s\S]*?>>|<[0-9A-Fa-f\s]*>|[[\]]|\/[^\s/[\]<>()]+|[-+]?(?:\d+\.?\d*|\.\d+)|[A-Za-z*'"]+/g)) {
    if (/^[-+.\d]/.test(t)) { ops.push(+t); continue; }
    if (/^[/(<[\]]/.test(t) || /^(BT|BI)\b/.test(t)) { ops.push(t); continue; }
    const n = ops.filter(v => typeof v === 'number');
    switch (t) {
      case 'q': stack.push(g); g = { ...g }; break;
      case 'Q': g = stack.pop() || g; break;
      case 'cm': g.ctm = mul(n.slice(-6), g.ctm); break;
      case 're': { const [x, y, w, h] = n.slice(-4); path.pts.push([x, y], [x + w, y + h]); path.rects++; break; }
      case 'm': case 'l': path.pts.push(n.slice(-2)); path.other = true; break;
      case 'c': case 'v': case 'y': for (let i = 0; i < n.length; i += 2) path.pts.push(n.slice(i, i + 2)); path.other = true; break;
      case 'W': case 'W*': clipNext = true; break;
      case 'n': case 'f': case 'F': case 'f*': case 'S': case 's': case 'B': case 'B*': case 'b': case 'b*':
        if (t !== 'n' && path.pts.length) paints.push({ clip: g.clip, frame: /^[Ss]$/.test(t) && path.rects === 1 && !path.other });
        if (clipNext && path.pts.length) g.clip = meet(g.clip, box(g.ctm, path.pts));
        path = { pts: [], rects: 0, other: false }; clipNext = false; break;
      case 'sh': paints.push({ clip: g.clip, frame: false }); break;
      case 'Do': draws.push({ name: String(ops.at(-1)).slice(1), clip: g.clip, ctm: g.ctm, box: box(g.ctm, [[0, 0], [1, 1], [0, 1], [1, 0]]) }); break;
    }
    ops = [];
  }
  return { draws, paints };
}
// Two clip boxes are the same panel when each covers most of the other (panels nest their
// picture a point or so inside the frame the overlay is clipped to)
const area = b => Math.max(0, b[2] - b[0]) * Math.max(0, b[3] - b[1]);
const samePanel = (a, b) => {
  if (!a || !b) return false;
  const shared = area([Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.min(a[2], b[2]), Math.min(a[3], b[3])]);
  return shared > 0.9 * area(a) && shared > 0.9 * area(b);
};
const outer = (a, b) => [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])];

// Top-level image draws on each page, in order, with the /Figure alt text they sit inside.
// Untagged guides (ReportLab) have no alt text, so each draw also records the first numbered
// heading ("3. Add the ivory fur") shown after it and before the next image.
// A draw whose panel (its clip box) has other drawing in it, or that is rotated or skewed,
// gets panel = { page, box }: the guide shows a composed panel, not just the picture.
function imageDraws(pdf) {
  const alts = figureAlts(pdf), draws = [];
  const pages = Object.keys(pdf.offsets).sort((a, b) => pdf.offsets[a] - pdf.offsets[b]).filter(n => /\/Type\s*\/Page\b/.test(pdf.get(n).dict));
  for (const [pageIndex, pg] of pages.entries()) {
    const page = pdf.get(pg).dict;
    const xo = page.match(/\/XObject\s*<<([^>]*)>>/); if (!xo) continue;
    const names = Object.fromEntries([...xo[1].matchAll(/\/([^\s/]+) (\d+) 0 R/g)].map(m => [m[1], m[2]]));
    const contents = page.match(/\/Contents\s*(\d+) 0 R/); if (!contents) throw Error('page contents array not supported');
    const cs = inflate(pdf.get(contents[1]), 'page content').toString('latin1');
    const stack = [], geo = drawingState(cs); let last = null, doIndex = 0;
    for (const t of cs.matchAll(/\/(\w+)\s*<<\/MCID (\d+)\s*>>\s*BDC|\/\w+\s+BMC|\/\w+\s*(?:<<[^>]*>>|\/\w+)\s*BDC|\bEMC\b|\/([^\s/]+)\s+Do\b|(\((?:\\.|[^\\)])*\))\s*Tj\b/g)) {
      if (t[4] != null) {
        const h = pdfString(t[4]).match(/^\s*(\d+)\.\s+(\S.*?)\s*$/);
        if (h && last && !last.heading) last.heading = { n: +h[1], text: h[2] };
      }
      else if (t[2] != null) stack.push({ tag: t[1], mcid: t[2] });
      else if (/BMC|BDC/.test(t[0])) stack.push({});
      else if (t[0] === 'EMC') stack.pop();
      else {
        const d = geo.draws[doIndex++];
        if (!d || d.name !== t[3]) throw Error('could not follow the page drawing order');
        const n = names[t[3]]; if (!n || !/\/Subtype\s*\/Image/.test(pdf.get(n).dict)) continue;
        const fig = [...stack].reverse().find(e => e.tag === 'Figure');
        const turned = Math.abs(d.ctm[1]) > 1e-6 || Math.abs(d.ctm[2]) > 1e-6;
        const over = d.clip ? [...geo.paints.filter(p => !p.frame), ...geo.draws.filter(o => o !== d)].filter(p => samePanel(p.clip, d.clip)) : [];
        const panel = d.clip && (turned || over.length) ? { page: pageIndex, box: over.reduce((b, p) => outer(b, p.clip), d.clip) } : null;
        draws.push(last = { obj: n, alt: fig ? alts[pg + ':' + fig.mcid] ?? '' : null, heading: null, panel });
      }
    }
  }
  return { draws, pages: pages.length };
}

// ---------- PNG writing ----------
const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc = buf => { let c = 0xffffffff; for (const x of buf) c = crcTable[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
function chunk(type, data) { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type, 'latin1'), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); }

function imagePng(pdf, n) {
  const d = pdf.get(n).dict;
  const w = +d.match(/\/Width (\d+)/)[1], h = +d.match(/\/Height (\d+)/)[1];
  if (!/\/BitsPerComponent 8\b/.test(d)) throw Error(`image object ${n} is not 8 bits per channel`);
  const icc = d.match(/\/ICCBased (\d+) 0 R/);
  const gray = /\/DeviceGray/.test(d) || (icc && /\/N 1\b/.test(pdf.get(icc[1]).dict));
  if (!gray && !/\/DeviceRGB/.test(d) && !(icc && /\/N 3\b/.test(pdf.get(icc[1]).dict))) throw Error(`image object ${n} has an unsupported color space`);
  const ch = gray ? 1 : 3, raw = inflate(pdf.get(n), `image object ${n}`);
  if (raw.length !== w * h * ch) throw Error(`image object ${n}: sample count does not match its size`);
  const sm = d.match(/\/SMask (\d+) 0 R/); let alpha = null;
  if (sm) {
    const a = pdf.get(sm[1]); alpha = inflate(a, `soft mask ${sm[1]}`);
    if (+a.dict.match(/\/Width (\d+)/)[1] !== w || +a.dict.match(/\/Height (\d+)/)[1] !== h || alpha.length !== w * h) throw Error(`soft mask ${sm[1]} does not match its image`);
  }
  const png = new PNG({ width: w, height: h });
  for (let p = 0; p < w * h; p++) {
    const r = raw[p * ch];
    png.data[p * 4] = r; png.data[p * 4 + 1] = gray ? r : raw[p * ch + 1]; png.data[p * 4 + 2] = gray ? r : raw[p * ch + 2];
    png.data[p * 4 + 3] = alpha ? alpha[p] : 255;
  }
  let buf = PNG.sync.write(png, { colorType: alpha ? 6 : 2, deflateLevel: 9 });
  if (icc) { // the PDF keeps the profile zlib-compressed, which is exactly what iCCP stores
    const p = pdf.get(icc[1]);
    let z = null; try { z = zlibData(p, 'ICC profile'); } catch { }
    if (z) buf = Buffer.concat([buf.subarray(0, 33), chunk('iCCP', Buffer.concat([Buffer.from('ICC profile\0\0', 'latin1'), z])), buf.subarray(33)]);
  }
  const verify = bytes => { // every pixel must equal the PDF's samples
    const back = PNG.sync.read(bytes);
    if (back.width !== w || back.height !== h) return false;
    for (let p = 0; p < w * h; p++) {
      for (let c = 0; c < 3; c++) if (back.data[p * 4 + c] !== (gray ? raw[p] : raw[p * ch + c])) return false;
      if (back.data[p * 4 + 3] !== (alpha ? alpha[p] : 255)) return false;
    }
    return true;
  };
  return { buf, w, h, alpha: !!alpha, icc: !!icc, verify };
}

// ---------- naming ----------
const slugify = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function planImages(pdf) {
  const { draws, pages } = imageDraws(pdf);
  const tagged = draws.some(d => d.alt != null);
  const images = [], seen = new Set(), deco = []; let step = 0;
  const stepName = (n, text) => `step-${String(n).padStart(2, '0')}${text ? '-' + slugify(text) : ''}`;
  for (const d of draws) {
    let name = null;
    if (tagged && d.alt != null) {
      if (/^finished painting$/i.test(d.alt)) name = 'finished-painting-preview';
      else if (/^river and ridge/i.test(d.alt)) name = 'river-and-ridge-logo';
      else name = stepName(++step, d.alt);
    } else if (!tagged && d.heading) name = stepName(step = d.heading.n, d.heading.text);
    // a step panel that reuses an earlier picture (the drying panel reuses the preview) still gets
    // its own step file; any other repeat was already named at first use
    if (seen.has(d.obj) && !(name && name.startsWith('step-'))) continue;
    seen.add(d.obj);
    const im = { obj: d.obj, name, panel: name && name.startsWith('step-') ? d.panel : null }; images.push(im); if (!name) deco.push(im);
  }
  if (tagged) {
    const decoNames = deco.length === 3 ? ['title-wash', 'materials-wash', 'footer-wash'] : deco.map((_, i) => `decoration-${String(i + 1).padStart(2, '0')}`);
    deco.forEach((im, i) => im.name = decoNames[i]);
  } else { // untagged: the logo is the one soft-masked picture; the preview is the first other one
    const alpha = deco.filter(im => /\/SMask\s+\d+ 0 R/.test(pdf.get(im.obj).dict));
    if (alpha.length === 1) alpha[0].name = 'river-and-ridge-logo';
    const preview = deco.find(im => !im.name); if (preview) preview.name = 'finished-painting-preview';
    deco.filter(im => !im.name).forEach((im, i) => im.name = `decoration-${String(i + 1).padStart(2, '0')}`);
  }
  if (images.some(im => !im.name)) throw Error('could not name every image');
  return { images, steps: images.filter(im => im.name.startsWith('step-')).length, pages };
}

// ---------- composed step panels ----------
// A step panel with drawing on top of its picture is rendered from the page (shared PDFium
// renderer) and cropped to the panel, just inside its frame line, so the file shows the panel
// as the guide prints it.
const PANEL_DPI = 600, FRAME_INSET = 1.25; // points trimmed from each side to drop the frame line
async function renderPanels(bytes, images) {
  const want = images.filter(im => im.panel); if (!want.length) return;
  const { PDFiumLibrary } = require('module').createRequire(path.join(root, 'assets/tools/pdf-render/package.json'))('@hyzyla/pdfium');
  const library = await PDFiumLibrary.init(), doc = await library.loadDocument(new Uint8Array(bytes));
  try {
    for (const pageIndex of new Set(want.map(im => im.panel.page))) {
      const page = doc.getPage(pageIndex), { originalWidth: W, originalHeight: H } = page.getOriginalSize();
      const s = PANEL_DPI / 72, pw = Math.round(W * s), ph = Math.round(H * s);
      const r = await page.render({ width: pw, height: ph, render: async ({ data }) => data }); // RGBA
      for (const im of want.filter(im => im.panel.page === pageIndex)) {
        const [x1, y1, x2, y2] = im.panel.box;
        const left = Math.round((x1 + FRAME_INSET) * s), top = Math.round((H - y2 + FRAME_INSET) * s);
        const w = Math.round((x2 - x1 - 2 * FRAME_INSET) * s), h = Math.round((y2 - y1 - 2 * FRAME_INSET) * s), png = new PNG({ width: w, height: h });
        for (let y = 0; y < h; y++) Buffer.from(r.data.buffer, r.data.byteOffset + ((top + y) * r.width + left) * 4, w * 4).copy(png.data, y * w * 4);
        for (let p = 3; p < png.data.length; p += 4) png.data[p] = 255;
        const buf = PNG.sync.write(png, { colorType: 2, deflateLevel: 9 });
        im.png = { buf, w, h, alpha: false, icc: false, rendered: true, verify: bytes => { const b = PNG.sync.read(bytes); return b.width === w && b.height === h && b.data.equals(png.data); } };
      }
    }
  } finally { doc.destroy(); library.destroy(); }
}

// ---------- one guide ----------
async function extract(pdfFile) {
  const rel = path.relative(root, pdfFile), dir = path.dirname(pdfFile), out = path.join(dir, 'assets');
  const prefix = path.basename(pdfFile, '.pdf').replace(/-painting-guide.*$/i, '');
  const before = fs.readFileSync(pdfFile);
  const pdf = openPdf(pdfFile), plan = planImages(pdf);
  await renderPanels(before, plan.images);
  const pngs = {}, results = plan.images.map(im => ({ ...im, file: `${prefix}-${im.name}.png`, png: im.png ?? (pngs[im.obj] ??= imagePng(pdf, im.obj)) }));
  // check every target before writing anything
  const names = results.map(r => r.file); if (new Set(names).size !== names.length) throw Error('two images would get the same file name');
  for (const r of results) {
    const f = path.join(out, r.file);
    r.state = !fs.existsSync(f) ? 'new' : fs.readFileSync(f).equals(r.png.buf) || r.png.verify(fs.readFileSync(f)) ? 'unchanged' : 'conflict';
  }
  const conflicts = results.filter(r => r.state === 'conflict');
  if (conflicts.length) throw Error(`these files already exist in ${path.relative(root, out)} with different pictures; nothing was written:\n  ` + conflicts.map(r => r.file).join('\n  '));
  fs.mkdirSync(out, { recursive: true });
  for (const r of results) if (r.state === 'new') {
    const f = path.join(out, r.file); fs.writeFileSync(f, r.png.buf);
    if (!r.png.verify(fs.readFileSync(f))) throw Error('pixel check failed for ' + f);
  }
  if (!before.equals(fs.readFileSync(pdfFile))) throw Error('guide PDF changed during extraction: ' + rel);
  console.log(`\n${rel}  (${plan.pages} page${plan.pages > 1 ? 's' : ''}, ${plan.steps} illustrated steps)`);
  for (const r of results) console.log(`  ${r.state === 'new' ? 'wrote    ' : 'unchanged'}  ${r.file}  ${r.png.w}x${r.png.h}${r.png.alpha ? ' alpha' : ''}${r.png.icc ? ' icc' : ''}${r.png.rendered ? ` panel rendered at ${PANEL_DPI} DPI` : ''}`);
  const rendered = results.filter(r => r.png.rendered).length;
  console.log(`  -> ${path.relative(root, out)}  (${results.length} images: ${results.length - rendered} copied losslessly` +
    (rendered ? `, ${rendered} step panel${rendered > 1 ? 's' : ''} rendered because the guide draws over the picture` : '') + `; every file read back and checked; guide PDF unchanged)`);
}

// ---------- choosing what to run on ----------
const kits = () => fs.readdirSync(root, { withFileTypes: true })
  .filter(e => e.isDirectory() && !SKIP_DIRS.has(e.name) && e.name !== 'assets' && guideFolders(path.join(root, e.name)).length)
  .map(e => e.name).sort();

function guideFolders(dir, depth = 0) { // folders at or below dir (not info/assets) holding a guide PDF
  let found = [];
  let entries; try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return found; }
  if (entries.some(e => e.isFile() && isGuide(e.name))) found.push(dir);
  if (depth < 3) for (const e of entries) if (e.isDirectory() && !SKIP_DIRS.has(e.name)) found = found.concat(guideFolders(path.join(dir, e.name), depth + 1));
  return found;
}

// Answers come from the terminal, or one per line from piped input
let lines = null; const waiting = [];
function answer() {
  if (!lines) {
    lines = []; const rl = readline.createInterface({ input: process.stdin });
    rl.on('line', l => waiting.length ? waiting.shift().res(l) : lines.push(l));
    rl.on('close', () => { lines.closed = true; while (waiting.length) waiting.shift().rej(Error('no answer given (run it in a terminal, or pass a folder or guide PDF)')); });
  }
  process.stdout.write('Number (or q to quit): ');
  if (lines.length) { const l = lines.shift(); if (!process.stdin.isTTY) console.log(l); return Promise.resolve(l); }
  if (lines.closed) return Promise.reject(Error('no answer given (run it in a terminal, or pass a folder or guide PDF)'));
  return new Promise((res, rej) => waiting.push({ res: l => { if (!process.stdin.isTTY) console.log(l); res(l); }, rej }));
}

async function choose(question, options, label = o => o) {
  if (!options.length) throw Error('nothing to choose from for: ' + question);
  if (options.length === 1) { console.log(`${question} ${label(options[0])}`); return options[0]; }
  console.log('\n' + question); options.forEach((o, i) => console.log(`  ${i + 1}. ${label(o)}`));
  for (;;) {
    const a = (await answer()).trim();
    if (/^q/i.test(a)) process.exit(0);
    const i = +a - 1; if (options[i] !== undefined) return options[i];
    console.log('  Enter a number from the list.');
  }
}

async function pickGuide(folder) {
  const pdfs = fs.readdirSync(folder).filter(isGuide).sort();
  if (!pdfs.length) throw Error('no painting-guide PDF in ' + path.relative(root, folder));
  return path.join(folder, await choose('Guide:', pdfs));
}

async function main() {
  const arg = process.argv[2];
  if (arg === '--all') { // every guide in every kit, including subfolders such as simplified/
    for (const k of kits()) for (const d of guideFolders(path.join(root, k))) for (const f of fs.readdirSync(d).filter(isGuide).sort()) await extract(path.join(d, f));
    return;
  }
  if (arg && /^-/.test(arg)) { console.log('Usage: node Tools/guide-image-extractor.cjs [kit folder | folder | guide.pdf | --all]'); return; }
  if (arg) {
    const p = path.resolve(process.cwd(), arg), target = fs.existsSync(p) ? p : path.resolve(root, arg);
    if (!fs.existsSync(target)) throw Error('not found: ' + arg);
    if (fs.statSync(target).isFile()) return extract(target);
    const folders = guideFolders(target); if (!folders.length) throw Error('no painting-guide PDF in or below ' + arg);
    return extract(await pickGuide(await choose('Folder:', folders, f => path.relative(target, f) || '(this folder)')));
  }
  const kit = await choose('Which kit?', kits());
  const folder = await choose('Which folder in ' + kit + '?', guideFolders(path.join(root, kit)), f => path.relative(path.join(root, kit), f) || '(kit root)');
  await extract(await pickGuide(folder));
}

main().then(() => process.exit(0), e => { console.error('\nStopped: ' + e.message); process.exit(1); });
