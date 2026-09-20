const fs=require('fs'),path=require('path'),zlib=require('zlib');
const {bmp}=require('./raster.cjs');
const kits=[['Fox Fall','fox-fall'],['Ghost Fall','ghost-fall'],['Cat in Pumpkin','cat-in-pumpkin'],['pumpkin','pumpkin']];
function imagePdf(out,b,title){
 const w=576,h=720,img=zlib.deflateSync(b.a),content=Buffer.from(`q\n${w} 0 0 ${h} 0 0 cm\n/Im0 Do\nQ\n`);
 const stream=(dict,data)=>Buffer.concat([Buffer.from(`<< ${dict} /Length ${data.length} >>\nstream\n`),data,Buffer.from('\nendstream')]);
 const objs=[Buffer.from('<< /Type /Catalog /Pages 2 0 R >>'),Buffer.from('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),Buffer.from(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`),stream(`/Type /XObject /Subtype /Image /Width ${b.w} /Height ${b.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode`,img),stream('',content),Buffer.from(`<< /Title (${title}) /Author (River and Ridge) >>`)];
 const parts=[Buffer.from('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n','binary')],offsets=[];let offset=parts[0].length;
 objs.forEach((obj,i)=>{offsets.push(offset);const item=Buffer.concat([Buffer.from(`${i+1} 0 obj\n`),obj,Buffer.from('\nendobj\n')]);parts.push(item);offset+=item.length;});
 parts.push(Buffer.from(`xref\n0 ${objs.length+1}\n0000000000 65535 f \n${offsets.map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')}trailer\n<< /Size ${objs.length+1} /Root 1 0 R /Info 6 0 R >>\nstartxref\n${offset}\n%%EOF\n`));
 fs.writeFileSync(out,Buffer.concat(parts));
}
for(const [folder,slug] of kits)for(const kind of ['outline','finished-reference']){
 const name=`${slug}-${kind}-8x10`,src=path.resolve(folder,'tmp/8x10-artwork',name+'.bmp'),out=path.resolve(folder,'output/pdf/8x10',name+'.pdf');
 imagePdf(out,bmp(src),`${folder} - 8 x 10 ${kind}`);console.log(out);
}
// Replace the temporary opaque outline PDFs with the exact black/alpha transfer versions.
require('./transparent-outline-pdfs.cjs');
