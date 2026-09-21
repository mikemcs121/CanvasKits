const fs=require('fs'),path=require('path');
const sharp=require('C:/Users/mmcsherry/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const out=path.join(__dirname,'2026-09-21');
const jobs=[
 ['gnome-fall','branch-chain',[0,80,920,930]],
 ['gnome-fall','boots-hands',[650,1810,1120,640]],
 ['gnome-christmas-tree','tree-bottom-shoes',[0,2250,1900,700]],
 ['gnome-christmas-tree','hat-lights',[600,1000,1150,730]],
 ['fall-view','canopy-smear',[1300,0,1000,900]],
 ['fall-view','trunk-ledge',[1670,1530,710,1100]],
 ['starry-night-sunflower','petals-stem',[0,880,1000,950]],
 ['starry-night-sunflower','seed-head',[350,330,1100,800]],
 ['flowers-in-vase','petals',[0,150,1050,950]],
 ['gnome-halloween','beard-shoes',[530,1700,1300,1100]]
];
(async()=>{
 const kitsForLines=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../guide-template/kits.json')));
 for(const k of kitsForLines){await sharp(path.resolve(__dirname,'../../..',k.folder,k.slug+'-outline-8x10.svg')).resize(2400,3000,{fit:'fill'}).png().toFile(path.join(out,k.slug,'outline-8x10.png'));}
 for(const [slug,name,box] of jobs){
  const dir=path.join(out,slug),crop={left:box[0],top:box[1],width:box[2],height:box[3]};
  const ref=await sharp(path.join(dir,'finished-reference-8x10.png')).extract(crop).png().toBuffer();
  const line=await sharp(path.join(dir,'outline-8x10.png')).extract(crop).png().toBuffer();
  await sharp(ref).resize({width:850,withoutEnlargement:true}).png().toFile(path.join(dir,name+'-detail.png'));
  await sharp(line).flatten({background:'white'}).resize({width:850,withoutEnlargement:true}).png().toFile(path.join(dir,name+'-outline.png'));
 }
 const matches=[];
 const kits=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../guide-template/kits.json')));
 for(const slug of ['flowers-in-vase','gnome-halloween']){
  const k=kits.find(k=>k.slug===slug);
  const a=await sharp('C:/Users/mmcsherry/Desktop/New folder/'+slug+'-finished-reference-8x10.png').removeAlpha().raw().toBuffer();
  const b=await sharp(path.resolve(__dirname,'../../..',k.reference)).removeAlpha().raw().toBuffer();
  const c=await sharp(path.join(out,slug,'finished-reference-8x10.png')).removeAlpha().raw().toBuffer();
  const metric=(a,b)=>{if(a.length!==b.length)return null;let sum=0,max=0,count=0;for(let i=0;i<a.length;i++){const d=Math.abs(a[i]-b[i]);sum+=d;max=Math.max(max,d);if(d)count++;}return{meanAbsoluteChannelDifference:sum/a.length,maxChannelDifference:max,changedChannels:count,totalChannels:a.length};};
  matches.push({slug,sourceVsSupportingPng:metric(a,b),sourceVsRootPdfRender:metric(a,c)});
 }
 fs.writeFileSync(path.join(out,'source-pixel-comparison.json'),JSON.stringify(matches,null,2));console.log(JSON.stringify(matches));
})();
