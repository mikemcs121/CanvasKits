const fs=require('fs'),path=require('path');
const {bmp,segment,png}=require('./raster.cjs');
for(const folder of ['Fox Fall','Ghost Fall','Kat In Pumpkin','pumpkin']){
 const d=path.resolve(folder,'tmp/8x10-artwork'),o=bmp(d+'/outline.bmp'),s=segment(o);
 fs.writeFileSync(d+'/regions.json',JSON.stringify(s.regions.filter(r=>r.count>50),null,2));
 fs.writeFileSync(d+'/labels.bin',Buffer.from(s.labels.buffer));
 console.log(folder,JSON.stringify(s.regions.filter(r=>r.count>150).map(({id,count,cx,cy,x0,y0,x1,y1})=>({id,count,cx,cy,box:[x0,y0,x1,y1]}))));
}
