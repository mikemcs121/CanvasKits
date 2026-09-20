const fs=require('fs'),path=require('path'),crypto=require('crypto'),zlib=require('zlib');
const potrace=require('../../../Fox Fall/tmp/vector-tools/node_modules/potrace'),Jimp=require('../../../Fox Fall/tmp/vector-tools/node_modules/jimp'),{Resvg}=require('../../../Fox Fall/tmp/vector-tools/node_modules/@resvg/resvg-js');
const root=path.resolve(__dirname,'../../..');
const kits=[['Flowers in Vase','flowers-in-vase']];
const trace=source=>new Promise((resolve,reject)=>potrace.trace(source,{threshold:128,turdSize:0,alphaMax:1,optCurve:true,optTolerance:.1,blackOnWhite:true,color:'#000000',background:'transparent'},(e,svg)=>e?reject(e):resolve(svg)));
function vectorPdf(filename,d){
 const tokens=d.match(/[A-Za-z]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?/g),ops=[];let i=0,cmd;
 while(i<tokens.length){if(/^[A-Za-z]$/.test(tokens[i]))cmd=tokens[i++];if(cmd==='Z'||cmd==='z'){ops.push('h');cmd=null;continue;}const n={M:2,L:2,C:6}[cmd];if(!n)throw Error('Unsupported SVG path command '+cmd);const args=tokens.slice(i,i+n);if(args.length!==n||args.some(v=>isNaN(Number(v))))throw Error('Bad path');i+=n;ops.push(args.join(' ')+' '+{M:'m',L:'l',C:'c'}[cmd]);if(cmd==='M')cmd='L';}
 const scale=2280/1254*.24,content=Buffer.from(`q\n0 g\n${scale} 0 0 ${-scale} 14.4 633.6 cm\n${ops.join('\n')}\nf*\nQ\n`);
 const zipped=zlib.deflateSync(content),stream=Buffer.concat([Buffer.from(`<< /Length ${zipped.length} /Filter /FlateDecode >>\nstream\n`),zipped,Buffer.from('\nendstream')]);
 const objs=[Buffer.from('<< /Type /Catalog /Pages 2 0 R >>'),Buffer.from('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),Buffer.from('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 576 720] /Resources << >> /Contents 4 0 R >>'),stream];
 const pieces=[Buffer.from('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n','binary')],offsets=[];let offset=pieces[0].length;objs.forEach((o,i)=>{offsets.push(offset);const b=Buffer.concat([Buffer.from(`${i+1} 0 obj\n`),o,Buffer.from('\nendobj\n')]);pieces.push(b);offset+=b.length});pieces.push(Buffer.from(`xref\n0 5\n0000000000 65535 f \n${offsets.map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')}trailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n${offset}\n%%EOF\n`));fs.writeFileSync(filename,Buffer.concat(pieces));
}
const table=Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0});
function chunk(type,data){const b=Buffer.alloc(data.length+12);b.writeUInt32BE(data.length);b.write(type,4);data.copy(b,8);let n=0xffffffff;for(const x of b.subarray(4,b.length-4))n=table[(n^x)&255]^(n>>>8);b.writeUInt32BE((n^0xffffffff)>>>0,b.length-4);return b;}
function pngDpi(b,dpi){const d=Buffer.alloc(9);d.writeUInt32BE(Math.round(dpi/0.0254));d.writeUInt32BE(Math.round(dpi/0.0254),4);d[8]=1;const parts=[b.subarray(0,33),chunk('pHYs',d)];for(let p=33;p<b.length;){let len=b.readUInt32BE(p);if(b.toString('ascii',p+4,p+8)!=='pHYs')parts.push(b.subarray(p,p+len+12));p+=len+12;}return Buffer.concat(parts);}
(async()=>{
 const sheet=new Jimp(800,1000,0xffffffff),checks=[];
 for(const [index,[folder,slug]] of kits.entries()){
  const kit=path.join(root,folder),tmp=path.join(kit,'tmp/vector');fs.mkdirSync(tmp,{recursive:true});
  const source=path.join(kit,'flowers-in-vase-outline.png'),raw=await trace(source),tag=raw.match(/<path\b[^>]+\/>/)[0],d=tag.match(/\bd="([^"]+)"/)[1];
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="8in" height="10in" viewBox="0 0 2400 3000"><title>${folder} - 8 x 10 transfer outline</title><g transform="translate(60 360) scale(${2280/1254})">${tag}</g></svg>\n`;
  if(/<image|data:image|<rect|<script|<foreignObject/i.test(svg))throw Error('Non-vector content');
  fs.writeFileSync(path.join(tmp,slug+'-outline-8x10.svg'),svg);
  const native=new Resvg(raw,{font:{loadSystemFonts:false},fitTo:{mode:'width',value:1254}}).render(),src=await Jimp.read(source),a=src.bitmap.data,b=native.pixels,w=1254,h=1254;
  const sourceMask=new Uint8Array(w*h),vectorMask=new Uint8Array(w*h);let intersection=0,union=0,sourceInk=0,vectorInk=0;
  for(let i=0;i<w*h;i++){sourceMask[i]=a[i*4]<128?1:0;vectorMask[i]=b[i*4+3]>=128?1:0;sourceInk+=sourceMask[i];vectorInk+=vectorMask[i];if(sourceMask[i]&&vectorMask[i])intersection++;if(sourceMask[i]||vectorMask[i])union++;}
  let farDifferences=0;for(let i=0;i<w*h;i++)if(sourceMask[i]!==vectorMask[i]){const mask=sourceMask[i]?vectorMask:sourceMask,x=i%w,y=(i/w)|0;let near=false;for(let dy=-1;dy<=1&&!near;dy++)for(let dx=-1;dx<=1&&!near;dx++){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<w&&yy>=0&&yy<h&&mask[yy*w+xx])near=true;}if(!near)farDifferences++;}
  // This source has finer lines: mask overlap is more sensitive to subpixel smoothing. Reject any change beyond one native pixel, changed interiors or
  // dropped features separately from expected boundary smoothing at native resolution.
  const iou=intersection/union;if(iou<.93||farDifferences>0)throw Error(`Trace mismatch ${folder}: IoU ${iou}; far differences ${farDifferences}`);
  fs.writeFileSync(path.join(tmp,'vector-native-review.png'),native.asPng());
  const reviewRender=new Resvg(svg,{font:{loadSystemFonts:false},fitTo:{mode:'width',value:400}}).render(),review=await Jimp.read(reviewRender.asPng());
  const checker=new Jimp(400,500,0xffffffff);checker.scan(0,0,400,500,function(x,y,p){if(((x/20|0)+(y/20|0))%2===0){this.bitmap.data[p]=this.bitmap.data[p+1]=this.bitmap.data[p+2]=220}});checker.composite(review,0,0);await checker.writeAsync(path.join(tmp,'vector-review.png'));sheet.composite(checker,(index%2)*400,Math.floor(index/2)*500);
  // Replace the pending higher-resolution raster copy with a clean render of the actual vector.
  for(const [dpi,width] of [[600,4800]]){const rendered=new Resvg(svg,{font:{loadSystemFonts:false},fitTo:{mode:'width',value:width}}).render();if(rendered.width!==4800||rendered.height!==6000)throw Error('Raster dimensions');fs.writeFileSync(path.join(tmp,`${slug}-outline-8x10-${dpi}dpi.png`),pngDpi(rendered.asPng(),dpi));}
  const check={kit:folder,sourceSha256:crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'),trueVector:true,embeddedRasterImages:0,background:'transparent',fill:'#000000',physicalInches:[8,10],viewBox:[0,0,2400,3000],nativePixels:[w,h],sourceInk,vectorInk,intersectionOverUnion:iou,differencesBeyondOnePixel:farDifferences,subpaths:(d.match(/M/g)||[]).length,svgBytes:Buffer.byteLength(svg)};
  checks.push(check);fs.writeFileSync(path.join(tmp,'verification.json'),JSON.stringify(check,null,2));console.log(JSON.stringify(check));
 }
 await sheet.writeAsync(path.join(__dirname,'vector-review-contact.png'));fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify(checks,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
