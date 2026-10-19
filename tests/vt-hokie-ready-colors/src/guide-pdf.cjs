const fs=require('fs'),path=require('path'),zlib=require('zlib');
module.exports=function({root,out,art,palette,steps,Resvg,PNG}){
 const ops=[],images=[],esc=s=>s.replace(/([\\()])/g,'\\$1');
 const rgb=hex=>hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).join(' ');
 const ink='#592232',line='#E9BD9E';
 function rect(x,y,w,h,c){ops.push(`${rgb(c)} rg ${x} ${792-y-h} ${w} ${h} re f`);}
 function stroke(x,y,w,h){ops.push(`${rgb(line)} RG .6 w ${x} ${792-y-h} ${w} ${h} re S`);}
 function text(s,x,y,size=10,bold=false,color=ink){ops.push(`BT /${bold?'F2':'F1'} ${size} Tf ${rgb(color)} rg 1 0 0 1 ${x} ${792-y} Tm (${esc(s)}) Tj ET`);}
 const widths={i:.278,l:.278,j:.278,t:.278,f:.333,r:.333,I:.333,m:.778,w:.722,M:.889,W:.944,' ':.25,'.':.25,',':.25,':':.278,';':.278,'!':.333,'-':.333,'1':.5};
 function measure(s,size){return [...s].reduce((n,c)=>n+(widths[c]??(/[A-Z]/.test(c)?.667:.5))*size,0);}
 function center(s,y,size=10,bold=false){text(s,(612-measure(s,size))/2,y,size,bold);}
 function wrap(s,x,y,width,size=10,leading=11.5){let current='',lines=[];for(const w of s.split(' ')){if(current&&measure(current+' '+w,size)>width){lines.push(current);current=w;}else current+=(current?' ':'')+w;}if(current)lines.push(current);lines.forEach((l,i)=>text(l,x,y+i*leading,size));return y+(lines.length-1)*leading;}
 function image(input,x,y,w,h,angle=0){
  const p=PNG.sync.read(Buffer.isBuffer(input)?input:fs.readFileSync(input)),buf=Buffer.alloc(p.width*p.height*3);
  for(let i=0,j=0;i<p.data.length;i+=4,j+=3){const a=p.data[i+3]/255;for(let k=0;k<3;k++)buf[j+k]=Math.round(p.data[i+k]*a+255*(1-a));}
  const name='Im'+images.length;images.push({name,width:p.width,height:p.height,data:zlib.deflateSync(buf)});
  const r=angle*Math.PI/180,co=Math.cos(r),si=Math.sin(r);ops.push(`q ${w*co} ${w*si} ${-h*si} ${h*co} ${x} ${792-y-h} cm /${name} Do Q`);
 }
 rect(0,0,612,792,'#FFFFFF');
 image(path.join(art,'reference.png'),24,44,92,73.6);stroke(24,44,92,73.6);
 rect(125,40,307,72,'#FBE9D2');
 const title=new Resvg('<svg xmlns="http://www.w3.org/2000/svg" width="1240" height="260"><rect width="1240" height="260" fill="#FBE9D2"/><text x="620" y="195" text-anchor="middle" font-family="Kaushan Script" font-size="180" fill="#592232">Hokie Sunset</text></svg>',{font:{fontFiles:[path.join(root,'assets/fonts/KaushanScript-Regular.ttf')],loadSystemFonts:false}}).render().asPng();
 image(title,128,38,300,62.9);text('8-Color Test Guide',212,121,14,true);
 const logoPath=path.join(art,'page-logo.png'),logoSize=PNG.sync.read(fs.readFileSync(logoPath));
 image(logoPath,444,48,144,144*logoSize.height/logoSize.width);
 rect(24,139,564,35,'#FBE9D2');
 center('Materials: Preprinted 10 x 8 horizontal canvas, acrylic paints, large and small brushes',152,10);
 center('Water cup, paper towels, palette or paper plate',165,10);
 center('Paints: cream, peach, orange, light blue, medium blue, dark blue, maroon and white',193,10);
 center('Ready-to-use colors supplied - no mixing recipes.',207,10);
 const checks=[];
 steps.forEach(([heading,caption],i)=>{
  const col=i%4,row=Math.floor(i/4),x=24+col*143,y=226+row*246,w=135;
  if(col<3)rect(x+139,y,.55,237,line);
  if(i<7){image(path.join(art,`stage-${i+1}.png`),x,y+6,w,108);stroke(x,y+6,w,108);}
  else{rect(x,y,135,120,'#EAD4B8');for(let dy=3;dy<120;dy+=5)rect(x,y+dy,135,.5,'#E1C8AA');rect(x+10,y+33,99,81,'#FFFFFF');image(path.join(art,'reference.png'),x+12,y+35,95,76);palette.forEach((p,j)=>{rect(x+111+(j%2)*10,y+6+Math.floor(j/2)*11,8,8,'#FFFFFF');rect(x+112+(j%2)*10,y+7+Math.floor(j/2)*11,6,6,p.hex);});rect(x+119,y+79,2,30,'#775034');rect(x+119,y+73,2,6,'#BD9B6A');stroke(x,y,135,120);}
  text(`${i+1}. ${heading}`,x+1,y+133,10,true);
  const bottom=wrap(caption,x+1,y+147,133,10,11.5);checks.push({step:i+1,captionBottom:bottom,rowBottom:y+231});if(bottom>y+227)throw Error('Caption overflow step '+(i+1));
 });
 rect(24,735,564,20,'#FBE9D2');center('TEST EDITION - Thin coats - Let layers dry - Enjoy painting',749,11,true);
 center('www.randrpaintyourown.com | @randrpaintyourown | info@randrpaintyourown.com',771,9);
 const content=Buffer.from(ops.join('\n')),objs=[Buffer.from('<< /Type /Catalog /Pages 2 0 R >>'),Buffer.from('<< /Type /Pages /Kids [3 0 R] /Count 1 >>')];
 const xobjects=images.map((im,i)=>`/${im.name} ${7+i} 0 R`).join(' ');
 objs.push(Buffer.from(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> /XObject << ${xobjects} >> >> /Contents 6 0 R >>`));
 objs.push(Buffer.from('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>'),Buffer.from('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>'));
 objs.push(Buffer.concat([Buffer.from(`<< /Length ${content.length} >>\nstream\n`),content,Buffer.from('\nendstream')]));
 for(const im of images)objs.push(Buffer.concat([Buffer.from(`<< /Type /XObject /Subtype /Image /Width ${im.width} /Height ${im.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length ${im.data.length} >>\nstream\n`),im.data,Buffer.from('\nendstream')]));
 const chunks=[Buffer.from('%PDF-1.4\n')],offsets=[];let n=chunks[0].length;objs.forEach((o,i)=>{offsets.push(n);const b=Buffer.concat([Buffer.from(`${i+1} 0 obj\n`),o,Buffer.from('\nendobj\n')]);chunks.push(b);n+=b.length;});chunks.push(Buffer.from(`xref\n0 ${objs.length+1}\n0000000000 65535 f \n${offsets.map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')}trailer\n<< /Size ${objs.length+1} /Root 1 0 R >>\nstartxref\n${n}\n%%EOF`));
 fs.writeFileSync(path.join(out,'vt-hokie-test-painting-guide-10x8.pdf'),Buffer.concat(chunks));return checks;
};
