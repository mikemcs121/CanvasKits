const fs=require('fs'),path=require('path'),zlib=require('zlib');
module.exports=function({root,out,art,palette,steps,Resvg,PNG}){
 const ops=[],images=[],esc=s=>s.replace(/([\\()])/g,'\\$1');
 const rgb=hex=>hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).join(' ');
 const ink='#344655',line='#BBD9D9';
 function rect(x,y,w,h,c){ops.push(`${rgb(c)} rg ${x} ${792-y-h} ${w} ${h} re f`);}
 function stroke(x,y,w,h){ops.push(`${rgb(line)} RG .6 w ${x} ${792-y-h} ${w} ${h} re S`);}
 function text(s,x,y,size=10,bold=false,color=ink){ops.push(`BT /${bold?'F2':'F1'} ${size} Tf ${rgb(color)} rg 1 0 0 1 ${x} ${792-y} Tm (${esc(s)}) Tj ET`);}
 const widths={i:.278,l:.278,j:.278,t:.278,f:.333,r:.333,I:.333,m:.778,w:.722,M:.889,W:.944,' ':.25,'.':.25,',':.25,':':.278,';':.278,'!':.333,'-':.333,'1':.5};
 function measure(s,size){return [...s].reduce((n,c)=>n+(widths[c]??(/[A-Z]/.test(c)?.667:.5))*size,0);}
 function center(s,y,size=10,bold=false){text(s,(612-measure(s,size))/2,y,size,bold);}
 function wrap(s,x,y,width,size=10,leading=11.5){let current='',lines=[];for(const w of s.split(' ')){if(current&&measure(current+' '+w,size)>width){lines.push(current);current=w;}else current+=(current?' ':'')+w;}if(current)lines.push(current);lines.forEach((l,i)=>text(l,x,y+i*leading,size));return y+(lines.length-1)*leading;}
 function image(input,x,y,w,h,angle=0){
  const p=PNG.sync.read(Buffer.isBuffer(input)?input:fs.readFileSync(input)),buf=Buffer.alloc(p.width*p.height*3);
  for(let i=0,j=0;i<p.data.length;i+=4,j+=3){const a=p.data[i+3]/255;for(let k=0;k<3;k++)buf[j+k]=p.data[i+k];}
  const name='Im'+images.length;const alpha=Buffer.alloc(p.width*p.height);let hasAlpha=false;for(let i=0,j=0;i<p.data.length;i+=4,j++){alpha[j]=p.data[i+3];if(alpha[j]!==255)hasAlpha=true;}
  images.push({name,width:p.width,height:p.height,data:zlib.deflateSync(buf),alpha:hasAlpha?zlib.deflateSync(alpha):null});
  const r=angle*Math.PI/180,co=Math.cos(r),si=Math.sin(r);ops.push(`q ${w*co} ${w*si} ${-h*si} ${h*co} ${x} ${792-y-h} cm /${name} Do Q`);
 }
 rect(0,0,612,792,'#FFFFFF');
 image(path.join(art,'reference-master.png'),27,28,68,85);stroke(27,28,68,85);
 rect(108,29,324,67,'#F3F9D5');
 const title=new Resvg('<svg xmlns="http://www.w3.org/2000/svg" width="1240" height="260"><text x="620" y="195" text-anchor="middle" font-family="Kaushan Script" font-size="150" fill="#344655">Sea Turtle</text></svg>',{font:{fontFiles:[path.join(root,'assets/fonts/KaushanScript-Regular.ttf')],loadSystemFonts:false}}).render().asPng();
 image(title,117,28,303,63.5);text('Kids Canvas Painting Guide',177,115,14,true);
 const logoPath=path.join(art,'page-logo.png'),logoSize=PNG.sync.read(fs.readFileSync(logoPath));
 image(logoPath,444,37,144,144*logoSize.height/logoSize.width);
 rect(24,131,564,35,'#E3F4FC');
 center('You will need: Preprinted 8 x 10 canvas, acrylic paints, large and small brushes',145,10.5);
 center('Water, paper towels, and a palette or paper plate',158,10.5);
 center('Ready-to-use paints: blue, lime green, green, dark green,',182,11);
 center('yellow, light blue, black, and white. No mixing needed.',196,11);
 const checks=[];
 steps.forEach(([heading,caption],i)=>{
  const col=i%2,row=Math.floor(i/2),x=24+col*287,y=214+row*169;
  if(col===0)rect(303,y,.55,153,line);
  if(row<2)rect(x,y+158,274,.55,line);
  if(i<5){image(path.join(art,`stage-${String(i+1).padStart(2,'0')}.png`),x+5,y+4,96,120);}
  else{
   // Top-down view of a canvas lying flat on the work table.
   ops.push(`q ${x+1} ${792-y-133} 106 133 re W n`);
   rect(x+1,y,106,133,'#EBDCC6');
   for(let dy=4;dy<133;dy+=8)rect(x+1,y+dy,106,.5,'#DDC8AB');
   rect(x+8,y+10,82,103,'#FFFFFF');image(path.join(art,'reference-master.png'),x+10,y+12,78,97.5);
   rect(x+95,y+78,2,37,'#7F6654');rect(x+95,y+72,2,6,'#C6AC82');
   palette.forEach((p,j)=>{rect(x+7+j*11,y+119,9,9,'#FFFFFF');rect(x+8+j*11,y+120,7,7,p.hex);});
   ops.push('Q');
  }
  text(`${i+1}. ${heading}`,x+116,y+19,11,true);
  const bottom=wrap(caption,x+116,y+37,153,11,12.5);
  checks.push({step:i+1,captionBottom:bottom,rowBottom:y+151});
  if(bottom>y+149)throw Error('Caption overflow step '+(i+1));
 });
 rect(24,731,564,24,'#F3F9D5');center('Thin coats - Dry between colors - Have fun!',747,11.5,true);
 center('Print artwork at Actual size / 100%. Guide: US Letter. Ages 8-14.',770,9.5);
 const footer='River and Ridge | Paint Your Own';center(footer,783,8.5);
 const content=zlib.deflateSync(Buffer.from(ops.join('\n'))),objs=[Buffer.from('<< /Type /Catalog /Pages 2 0 R >>'),Buffer.from('<< /Type /Pages /Kids [3 0 R] /Count 1 >>')];
 let nextObject=7;for(const im of images){im.object=nextObject++;if(im.alpha)im.maskObject=nextObject++;}
 const xobjects=images.map(im=>`/${im.name} ${im.object} 0 R`).join(' ');
 objs.push(Buffer.from(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> /XObject << ${xobjects} >> >> /Contents 6 0 R >>`));
 objs.push(Buffer.from('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>'),Buffer.from('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>'));
 objs.push(Buffer.concat([Buffer.from(`<< /Filter /FlateDecode /Length ${content.length} >>\nstream\n`),content,Buffer.from('\nendstream')]));
 for(const im of images){objs.push(Buffer.concat([Buffer.from(`<< /Type /XObject /Subtype /Image /Width ${im.width} /Height ${im.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 ${im.alpha?'/SMask '+im.maskObject+' 0 R ':''}/Filter /FlateDecode /Length ${im.data.length} >>\nstream\n`),im.data,Buffer.from('\nendstream')]));if(im.alpha)objs.push(Buffer.concat([Buffer.from(`<< /Type /XObject /Subtype /Image /Width ${im.width} /Height ${im.height} /ColorSpace /DeviceGray /BitsPerComponent 8 /Filter /FlateDecode /Length ${im.alpha.length} >>\nstream\n`),im.alpha,Buffer.from('\nendstream')]));}
 const chunks=[Buffer.from('%PDF-1.4\n')],offsets=[];let n=chunks[0].length;objs.forEach((o,i)=>{offsets.push(n);const b=Buffer.concat([Buffer.from(`${i+1} 0 obj\n`),o,Buffer.from('\nendobj\n')]);chunks.push(b);n+=b.length;});chunks.push(Buffer.from(`xref\n0 ${objs.length+1}\n0000000000 65535 f \n${offsets.map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')}trailer\n<< /Size ${objs.length+1} /Root 1 0 R >>\nstartxref\n${n}\n%%EOF`));
 fs.writeFileSync(path.join(out,'turtle-painting-guide-8x10.pdf'),Buffer.concat(chunks));return checks;
};
