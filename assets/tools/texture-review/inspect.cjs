const fs=require('fs'),path=require('path');
const root=process.cwd(),Jimp=require(path.join(root,'assets/tools/vector-tools/node_modules/jimp'));
(async()=>{const kits=JSON.parse(fs.readFileSync('assets/tools/organization/selections.json','utf8'));const font=await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);const sheet=new Jimp(1600,1500,0xffffffff),crops=new Jimp(1600,1250,0xffffffff),report=[];
for(let n=0;n<kits.length;n++){const k=kits[n],p=path.join(root,k.folder,'info/output/pdf/8x10',k.slug+'-finished-reference-8x10.png'),im=await Jimp.read(p),x=n%5*320,y=Math.floor(n/5)*750;sheet.print(font,x+4,y+4,k.folder);sheet.composite(im.clone().contain(310,700),x+5,y+28);
 const box=k.slug==='gnome-fall'?[880,140,400,400]:k.slug==='gnome-christmas-tree'?[60,30,400,400]:[600,300,400,400];
 const crop=im.clone().crop(...box);crops.print(font,x+4,Math.floor(n/5)*625+4,k.folder);crops.composite(crop.resize(310,310,Jimp.RESIZE_NEAREST_NEIGHBOR),x+5,Math.floor(n/5)*625+28);crops.composite(im.clone().crop(950,1500,400,350).resize(310,270),x+5,Math.floor(n/5)*625+350);
 report.push({kit:k.folder,path:p,width:im.bitmap.width,height:im.bitmap.height});}
await sheet.writeAsync('assets/tools/texture-review/references-before.png');await crops.writeAsync('assets/tools/texture-review/details-before.png');fs.writeFileSync('assets/tools/texture-review/inventory.json',JSON.stringify(report,null,2));})();
