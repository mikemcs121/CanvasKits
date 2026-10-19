const fs=require('fs'),path=require('path'),zlib=require('zlib');
module.exports=function({art,out,PNG}){
function pdfReference(){
 const {width,height,data}=PNG.sync.read(fs.readFileSync(path.join(art,'reference-master.png'))),rgb=Buffer.alloc(width*height*3);
 for(let i=0,j=0;i<data.length;i+=4,j+=3){rgb[j]=data[i];rgb[j+1]=data[i+1];rgb[j+2]=data[i+2];}
 const im=zlib.deflateSync(rgb),c=Buffer.from('q\n720 0 0 576 0 0 cm\n/Im0 Do\nQ');
 const objects=[Buffer.from('<< /Type /Catalog /Pages 2 0 R >>'),Buffer.from('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),Buffer.from('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 720 576] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>'),Buffer.concat([Buffer.from(`<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length ${im.length} >>\nstream\n`),im,Buffer.from('\nendstream')]),Buffer.concat([Buffer.from(`<< /Length ${c.length} >>\nstream\n`),c,Buffer.from('\nendstream')])];
 const a=[Buffer.from('%PDF-1.4\n% UVA Sunset approved eight-color reference\n')],offsets=[];let n=a[0].length;
 objects.forEach((o,i)=>{offsets.push(n);const b=Buffer.concat([Buffer.from(`${i+1} 0 obj\n`),o,Buffer.from('\nendobj\n')]);a.push(b);n+=b.length;});
 a.push(Buffer.from(`xref\n0 6\n0000000000 65535 f \n${offsets.map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${n}\n%%EOF`));fs.writeFileSync(path.join(out,'uva-finished-reference-10x8.pdf'),Buffer.concat(a));
}
pdfReference();
};
