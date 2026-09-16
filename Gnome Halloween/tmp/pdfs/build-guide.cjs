const fs = require('fs');
const path = require('path');
const kit = path.resolve(__dirname, '../..');
const artwork = fs.readFileSync(path.join(kit, 'assets/gnome-halloween-guide-artwork.png')).toString('base64');
const html = `<!doctype html><html><head><meta charset="utf-8"><title>Halloween Gnome Painting Guide</title><style>@page{size:Letter;margin:0}*{box-sizing:border-box}html,body{margin:0;width:8.5in;height:11in;background:white}.page{width:8.5in;height:11in;padding:.25in;display:flex;align-items:center;justify-content:center}img{display:block;width:100%;height:100%;object-fit:contain}</style></head><body><div class="page"><img alt="Twelve illustrated steps for painting a Halloween gnome" src="data:image/png;base64,${artwork}"></div></body></html>`;
fs.writeFileSync(path.join(__dirname, 'guide.html'), html);
