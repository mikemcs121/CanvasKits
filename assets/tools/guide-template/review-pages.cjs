const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'../../..'),Jimp=require(path.join(root,'Fox Fall/info/tmp/vector-tools/node_modules/jimp'));
const kits=require('./kits.json');
(async()=>{
 for(let i=0;i<kits.length;i+=2){
  const sheet=new Jimp(1700,1100,0xffffffff);
  for(let j=0;j<2;j++){const k=kits[i+j];const p=await Jimp.read(path.join(root,k.work,k.slug+'-painting-guide-8x10.png'));p.resize(850,1100,Jimp.RESIZE_BICUBIC);sheet.composite(p,j*850,0);}
  await sheet.writeAsync(path.join(__dirname,'review-pair-'+(i/2+1)+'.png'));
 }
 console.log('Saved five final-page comparison sheets.');
})();
