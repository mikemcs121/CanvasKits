const fs=require('fs'),path=require('path'),zlib=require('zlib');
const kits=[['Fox Fall','fox-fall'],['Ghost Fall','ghost-fall'],['Kat In Pumpkin','kat-in-pumpkin'],['pumpkin','pumpkin']];
for(const [folder,slug] of kits){
 const alpha=fs.readFileSync(path.resolve(folder,'tmp/8x10-artwork/outline-alpha.bin'));if(alpha.length!==2400*3000)throw Error('Wrong alpha dimensions');
 const stream=(dict,data)=>Buffer.concat([Buffer.from(`<< ${dict} /Length ${data.length} >>\nstream\n`),data,Buffer.from('\nendstream')]);
 const objs=[Buffer.from('<< /Type /Catalog /Pages 2 0 R >>'),Buffer.from('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),Buffer.from('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 576 720] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>'),stream('/Type /XObject /Subtype /Image /Width 2400 /Height 3000 /ColorSpace /DeviceGray /BitsPerComponent 8 /Filter /FlateDecode /SMask 6 0 R',zlib.deflateSync(Buffer.alloc(alpha.length))),stream('',Buffer.from('q\n576 0 0 720 0 0 cm\n/Im0 Do\nQ\n')),stream('/Type /XObject /Subtype /Image /Width 2400 /Height 3000 /ColorSpace /DeviceGray /BitsPerComponent 8 /Filter /FlateDecode',zlib.deflateSync(alpha)),Buffer.from(`<< /Title (${folder} - black transparent outline - 8 x 10) /Author (River and Ridge) >>`)];
 const parts=[Buffer.from('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n','binary')],offsets=[];let offset=parts[0].length;
 objs.forEach((obj,i)=>{offsets.push(offset);const b=Buffer.concat([Buffer.from(`${i+1} 0 obj\n`),obj,Buffer.from('\nendobj\n')]);parts.push(b);offset+=b.length});
 parts.push(Buffer.from(`xref\n0 ${objs.length+1}\n0000000000 65535 f \n${offsets.map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')}trailer\n<< /Size ${objs.length+1} /Root 1 0 R /Info 7 0 R >>\nstartxref\n${offset}\n%%EOF\n`));
 fs.writeFileSync(path.resolve(folder,'output/pdf/8x10',`${slug}-outline-8x10.pdf`),Buffer.concat(parts));console.log(folder+': transparent black outline PDF saved');
}
