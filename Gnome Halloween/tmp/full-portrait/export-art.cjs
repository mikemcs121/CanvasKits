const fs=require('fs'),path=require('path'),zlib=require('zlib'),vm=require('vm');
const dep='../../../Fox Fall/tmp/vector-tools/node_modules/',Jimp=require(dep+'jimp'),{Resvg}=require(dep+'@resvg/resvg-js');
const source=fs.readFileSync(path.resolve(__dirname,'../../../Fox Fall/tmp/vector-tools/build-vectors.cjs'),'utf8');
const functions=source.slice(source.indexOf('function vectorPdf'),source.indexOf('(async()=>')).replace('const scale=2280/1254*.24','const scale=576/2400').replace('14.4 633.6 cm','0 720 cm');
const context={fs,zlib,Buffer};vm.createContext(context);vm.runInContext(functions+';this.vectorPdf=vectorPdf;this.pngDpi=pngDpi;',context);
const kit=path.resolve(__dirname,'../..'),slug='gnome-halloween';
function imagePdf(file,b){const w=b.bitmap.width,h=b.bitmap.height,rgb=Buffer.alloc(w*h*3);for(let i=0;i<w*h;i++)for(let c=0;c<3;c++)rgb[i*3+c]=b.bitmap.data[i*4+c];
 const stream=(dict,data)=>Buffer.concat([Buffer.from(`<< ${dict} /Length ${data.length} >>\nstream\n`),data,Buffer.from('\nendstream')]);
 const objs=[Buffer.from('<< /Type /Catalog /Pages 2 0 R >>'),Buffer.from('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),Buffer.from('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 576 720] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>'),stream(`/Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode`,zlib.deflateSync(rgb)),stream('',Buffer.from('q\n576 0 0 720 0 0 cm\n/Im0 Do\nQ\n'))];
 const parts=[Buffer.from('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n','binary')],offsets=[];let off=parts[0].length;objs.forEach((o,i)=>{offsets.push(off);const b=Buffer.concat([Buffer.from(`${i+1} 0 obj\n`),o,Buffer.from('\nendobj\n')]);parts.push(b);off+=b.length});parts.push(Buffer.from(`xref\n0 6\n0000000000 65535 f \n${offsets.map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${off}\n%%EOF\n`));fs.writeFileSync(file,Buffer.concat(parts));
}
(async()=>{
 const svg=fs.readFileSync(path.join(__dirname,slug+'-outline-8x10.svg'),'utf8'),d=svg.match(/\bd="([^"]+)"/)[1];
 context.vectorPdf(path.join(__dirname,slug+'-outline-8x10.pdf'),d);
 for(const [dpi,width] of [[300,2400],[600,4800]]){const p=new Resvg(svg,{font:{loadSystemFonts:false},fitTo:{mode:'width',value:width}}).render();const name=slug+'-outline-8x10'+(dpi===600?'-600dpi':'')+'.png';if(p.width!==width||p.height!==width*1.25)throw Error('Wrong proportions');fs.writeFileSync(path.join(__dirname,name),context.pngDpi(p.asPng(),dpi));}
 const paint=await Jimp.read(path.join(kit,'assets/full-portrait/finished-reference-canonical.png'));paint.resize(2400,3000,Jimp.RESIZE_BICUBIC);fs.writeFileSync(path.join(__dirname,slug+'-finished-reference-8x10.png'),context.pngDpi(await paint.getBufferAsync(Jimp.MIME_PNG),300));imagePdf(path.join(__dirname,slug+'-finished-reference-8x10.pdf'),paint);
 console.log('Full-frame portrait artwork exported: vector SVG/PDF, transparent PNGs and painted reference PNG/PDF.');
})().catch(e=>{console.error(e);process.exit(1)});


