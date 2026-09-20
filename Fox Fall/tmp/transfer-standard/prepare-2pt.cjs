const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {Resvg}=require('../vector-tools/node_modules/@resvg/resvg-js');
const root=path.resolve(__dirname,'../../..'),kits=require('./kits.json'),dest=path.join(__dirname,'../darker-outline');
fs.mkdirSync(dest,{recursive:true});
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
for(const name of ['export.cjs','render.ps1','review.cjs']) {
  let code=fs.readFileSync(path.join(__dirname,name),'utf8').replaceAll('transfer-standard','darker-outline').replaceAll('1.4','2');
  fs.writeFileSync(path.join(dest,name),code);
}
fs.copyFileSync(path.join(__dirname,'kits.json'),path.join(dest,'kits.json'));
const manifest=[];
for(const k of kits){
 const dir=path.join(root,k.folder),tmp=path.join(dir,'tmp/darker-outline'),backup=path.join(tmp,'before-2pt');
 fs.mkdirSync(backup,{recursive:true});
 const relatives=[`output/svg/8x10/${k.slug}-outline-8x10.svg`,`${k.slug}-outline-8x10.svg`,...['.pdf','.png','-600dpi.png'].map(ext=>`output/pdf/8x10/${k.slug}-outline-8x10${ext}`),`${k.slug}-outline.png`,`${k.slug}-outline-8x10.png`,`${k.slug}-outline-8x10-600dpi.png`,'TRANSFER-OUTLINE.md'];
 for(const relative of relatives){const from=path.join(dir,relative),to=path.join(backup,relative);if(fs.existsSync(from)&&!fs.existsSync(to)){fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(from,to);}}
 const original=fs.readFileSync(path.join(backup,relatives[0]),'utf8');
 if(!original.includes('viewBox="0 0 2400 3000"')||!original.includes(`stroke="${k.color}"`))throw Error('Unexpected SVG '+k.folder);
 const svg=original.replace(/stroke-width="[^"]+"/g,`stroke-width="${2/.24}"`).replace('Line weight 1.4 pt.','Line weight 2 pt.');
 const ds=[...original.matchAll(/<path d="([^"]+)"/g)].map(m=>m[1]);
 const paths=ds.map(d=>d.split(/M | L /).filter(Boolean).map(v=>v.trim().split(/\s+/).map(Number)));
 if(paths.some(p=>p.some(v=>v.length!==2||v.some(n=>!Number.isFinite(n)))))throw Error('Unsupported path');
 fs.writeFileSync(path.join(tmp,k.slug+'-outline-8x10.svg'),svg);
 fs.writeFileSync(path.join(tmp,'paths.json'),JSON.stringify(paths));
 fs.writeFileSync(path.join(tmp,'review-white.png'),new Resvg(svg,{background:'white',fitTo:{mode:'width',value:800}}).render().asPng());
 manifest.push({kit:k.folder,previousSvgSha256:hash(path.join(backup,relatives[0])),pathCount:ds.length,linePoints:2,color:k.color,geometryUnchanged:JSON.stringify(ds)===JSON.stringify([...svg.matchAll(/<path d="([^"]+)"/g)].map(m=>m[1]))});
}
fs.writeFileSync(path.join(dest,'geometry-checks.json'),JSON.stringify(manifest,null,2));
console.log('Archived previous outputs and prepared ten 2 pt SVGs with identical paths.');
