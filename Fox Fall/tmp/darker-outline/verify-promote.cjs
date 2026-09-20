const fs=require('fs'),path=require('path'),crypto=require('crypto'),zlib=require('zlib');
const Jimp=require('../vector-tools/node_modules/jimp'),kits=require('./kits.json'),root=path.resolve(__dirname,'../../..');
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const assert=(v,msg)=>{if(!v)throw Error(msg);};
(async()=>{const reports=[];
for(const k of kits){
 const dir=path.join(root,k.folder),tmp=path.join(dir,'tmp/darker-outline'),base=k.slug+'-outline-8x10';
 const svg=fs.readFileSync(path.join(tmp,base+'.svg'),'utf8'),old=fs.readFileSync(path.join(tmp,'before-2pt/output/svg/8x10',base+'.svg'),'utf8');
 const geometry=s=>[...s.matchAll(/<path d="([^"]+)"/g)].map(m=>m[1]);
 assert(JSON.stringify(geometry(svg))===JSON.stringify(geometry(old)),'Changed geometry');
 assert(svg.includes(`stroke-width="${2/.24}"`)&&svg.includes(`stroke="${k.color}"`)&&!/<image|<rect|<filter|<mask|data:image/.test(svg),'SVG settings');
 const images=[];
 for(const [suffix,w,h,dpi] of [['',2400,3000,300],['-600dpi',4800,6000,600]]){
  const f=path.join(tmp,base+suffix+'.png'),im=await Jimp.read(f),d=im.bitmap.data,expected=parseInt(k.color.slice(1,3),16);let clear=0,opaque=0;
  assert(im.bitmap.width===w&&im.bitmap.height===h,'PNG size');
  for(let i=0;i<d.length;i+=4){if(d[i+3]===0)clear++;if(d[i+3]===255){opaque++;assert(d[i]===expected&&d[i+1]===expected&&d[i+2]===expected,'PNG color');}}
  assert(clear>w*h*.6&&opaque>20000,'Transparency');
  const b=fs.readFileSync(f);let ppu=0;for(let i=8;i<b.length;){const len=b.readUInt32BE(i);if(b.toString('ascii',i+4,i+8)==='pHYs')ppu=b.readUInt32BE(i+8);i+=len+12;}
  assert(ppu===Math.round(dpi/.0254),'DPI');images.push({dpi,width:w,height:h,clearPixels:clear,opaquePixels:opaque});
 }
 const pdf=fs.readFileSync(path.join(tmp,base+'.pdf')),s=pdf.toString('latin1');assert(s.includes('/MediaBox [0 0 576 720]')&&!s.includes('/Subtype /Image'),'PDF vector/size');
 const start=s.indexOf('stream\n')+7,end=s.indexOf('\nendstream'),stream=zlib.inflateSync(pdf.subarray(start,end)).toString();
 assert(stream.includes(`${2/.24} w`)&&stream.includes('0.24 0 0 -0.24 0 720 cm'),'PDF line weight');
 assert((stream.match(/\nS/g)||[]).length===geometry(svg).length,'PDF paths');
 reports.push({kit:k.folder,linePoints:2,lineMillimeters:2*25.4/72,color:k.color,geometryUnchanged:true,pdfVector:true,images,svgSha256:hash(path.join(tmp,base+'.svg'))});
 if(process.argv.includes('--promote')){
  const files=[['.svg','output/svg/8x10/'+base+'.svg'],['.svg',base+'.svg'],['.pdf','output/pdf/8x10/'+base+'.pdf'],['.png','output/pdf/8x10/'+base+'.png'],['.png',base+'.png'],['.png',k.slug+'-outline.png'],['-600dpi.png','output/pdf/8x10/'+base+'-600dpi.png'],['-600dpi.png',base+'-600dpi.png']];
  for(const [ext,rel]of files){const from=path.join(tmp,base+ext),to=path.join(dir,rel);fs.copyFileSync(from,to);assert(hash(from)===hash(to),'Copy hash');}
  fs.writeFileSync(path.join(dir,'TRANSFER-OUTLINE.md'),`# ${k.folder}: current transfer outline\n\nUse [the SVG](output/svg/8x10/${base}.svg) for vector uploads. It is exactly 8 x 10 inches with transparent background, 2-point lines (0.706 mm), round caps/joins, and ${k.color} ${k.kids?'gray for children':'gray for adults'}. Matching vector PDFs and transparent 300/600-DPI PNGs are in output/pdf/8x10. Print at Actual size / 100%.\n\nOnly line weight changed; all paths and artwork placement are preserved. Previous 1.4-point exports are archived in tmp/darker-outline/before-2pt. Color references and guides are unchanged. Current builder: Fox Fall/tmp/transfer-standard/prepare-2pt.cjs, followed by Fox Fall/tmp/darker-outline/export.cjs, render.ps1, review.cjs and verify-promote.cjs --promote. File settings were visually reviewed, not physically press-tested.\n\nDesktop delivery: darker outline, with SVGs at top level and PDF/PNG copies in format subfolders.\n`);
 }
 console.log(k.folder+': verified 2 pt, unchanged geometry, PDF vector, PNG color/alpha/DPI.');
}
fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify(reports,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
