const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const kit = path.resolve(__dirname, '..');
const png = fs.readFileSync(path.join(kit, 'tmp/guide-page.png'));
const chunks=[]; let width, height, depth, type, interlace;
for(let p=8;p<png.length;){const len=png.readUInt32BE(p),name=png.toString('ascii',p+4,p+8),data=png.subarray(p+8,p+8+len);if(name==='IHDR'){width=data.readUInt32BE(0);height=data.readUInt32BE(4);depth=data[8];type=data[9];interlace=data[12];}if(name==='IDAT')chunks.push(data);p+=len+12;}
if(depth!==8||![2,6].includes(type)||interlace!==0)throw Error('Unsupported PNG format');
const components=type===6?4:3,stride=width*components,raw=zlib.inflateSync(Buffer.concat(chunks)),pixels=Buffer.alloc(stride*height);
const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
for(let y=0;y<height;y++){const filter=raw[y*(stride+1)];for(let x=0;x<stride;x++){const i=y*stride+x,a=x>=components?pixels[i-components]:0,b=y?pixels[i-stride]:0,c=y&&x>=components?pixels[i-stride-components]:0;const predictor=[0,a,b,Math.floor((a+b)/2),paeth(a,b,c)][filter];if(predictor===undefined)throw Error('Invalid PNG filter');pixels[i]=(raw[y*(stride+1)+x+1]+predictor)&255;}}
const rgb=Buffer.alloc(width*height*3);for(let i=0;i<width*height;i++){const a=components===4?pixels[i*4+3]/255:1;for(let k=0;k<3;k++)rgb[i*3+k]=Math.round(pixels[i*components+k]*a+255*(1-a));}
const imageData=zlib.deflateSync(rgb);
const scale=Math.min(612/width,792/height),w=width*scale,h=height*scale,x=(612-w)/2,y=(792-h)/2;
const content=Buffer.from(`q\n${w.toFixed(5)} 0 0 ${h.toFixed(5)} ${x.toFixed(5)} ${y.toFixed(5)} cm\n/Im0 Do\nQ\n`);
const stream=(dict,data)=>Buffer.concat([Buffer.from(`<< ${dict} /Length ${data.length} >>\nstream\n`),data,Buffer.from('\nendstream')]);
const objects=[Buffer.from('<< /Type /Catalog /Pages 2 0 R >>'),Buffer.from('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),Buffer.from('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>'),stream(`/Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode`,imageData),stream('',content),Buffer.from('<< /Title (Flowers in Vase Painting Guide) /Author (River and Ridge) >>')];
const parts=[Buffer.from('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n','binary')],offsets=[0];let offset=parts[0].length;
objects.forEach((obj,i)=>{offsets.push(offset);const b=Buffer.concat([Buffer.from(`${i+1} 0 obj\n`),obj,Buffer.from('\nendobj\n')]);parts.push(b);offset+=b.length;});
parts.push(Buffer.from(`xref\n0 ${objects.length+1}\n0000000000 65535 f \n${offsets.slice(1).map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')}trailer\n<< /Size ${objects.length+1} /Root 1 0 R /Info 6 0 R >>\nstartxref\n${offset}\n%%EOF\n`));
const destination=path.join(__dirname,'flowers-in-vase-painting-guide-illustrated.pdf');fs.writeFileSync(destination,Buffer.concat(parts));
console.log(JSON.stringify({destination,sourcePixels:[width,height],pagePoints:[612,792],marginsPoints:[x,y],pages:1}));


