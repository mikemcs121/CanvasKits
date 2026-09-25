const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=process.cwd(),Jimp=require(path.join(root,'assets/tools/vector-tools/node_modules/jimp'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(async()=>{const checks=[],font=await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
for(const [folder,slug]of [['Gnome Fall','gnome-fall'],['Gnome Christmas Tree','gnome-christmas-tree']]){
 const base=path.join(root,folder),d=base+'/info/tmp/organization',archive=base+'/info/archive/before-sky-smoothing';
 const before=await Jimp.read(archive+'/info/tmp/organization/registered-reference.png'),after=await Jimp.read(d+'/registered-reference.png'),mask=await Jimp.read(d+'/sky-mask.png');
 let foregroundPixels=0,foregroundChanges=0,skyChanges=0,pairs=0,oldRepeated=0,newRepeated=0;
 for(let i=0;i<800000;i++){const changed=[0,1,2].some(c=>before.bitmap.data[i*4+c]!==after.bitmap.data[i*4+c]);if(mask.bitmap.data[i*4]===255){if(changed)skyChanges++;if(i%800&&mask.bitmap.data[(i-1)*4]===255){pairs++;if([0,1,2].every(c=>before.bitmap.data[i*4+c]===before.bitmap.data[(i-1)*4+c]))oldRepeated++;if([0,1,2].every(c=>after.bitmap.data[i*4+c]===after.bitmap.data[(i-1)*4+c]))newRepeated++;}}else{foregroundPixels++;if(changed)foregroundChanges++;}}
 if(foregroundChanges)throw Error(folder+': foreground changed');
 const svg=base+'/'+slug+'-outline-8x10.svg';if(hash(svg)!==hash(archive+'/'+slug+'-outline-8x10.svg'))throw Error('SVG modified');
 const full=await Jimp.read(base+'/info/output/pdf/8x10/'+slug+'-finished-reference-8x10.png');if(full.bitmap.width!==2400||full.bitmap.height!==3000)throw Error('Print size');
 const sheet=new Jimp(1050,930,0xffffffff);sheet.print(font,5,5,'Before - enlarged sky pixels');sheet.print(font,535,5,'After - continuous brush texture');sheet.composite(before.clone().resize(500,625),10,30);sheet.composite(after.clone().resize(500,625),535,30);
 const crop=slug==='gnome-fall'?[320,20,180,95]:[10,20,180,95];sheet.composite(before.clone().crop(...crop).resize(500,264,Jimp.RESIZE_NEAREST_NEIGHBOR),10,660);sheet.composite(after.clone().crop(...crop).resize(500,264,Jimp.RESIZE_NEAREST_NEIGHBOR),535,660);
 await sheet.writeAsync('assets/tools/texture-review/'+slug+'-before-after.png');
 checks.push({kit:folder,foregroundPixels,foregroundChanges,skyChanges,svgUnchanged:true,printPng:[2400,3000],identicalAdjacentSkyPixelsBefore:oldRepeated/pairs,identicalAdjacentSkyPixelsAfter:newRepeated/pairs});
}
fs.writeFileSync('assets/tools/texture-review/repair-checks.json',JSON.stringify(checks,null,2));console.log(checks);
})();
