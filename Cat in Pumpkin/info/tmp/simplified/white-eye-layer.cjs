// Recompose one region in the existing editable staged-artwork system.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'../../../..');
const Jimp=require(path.join(root,'Fox Fall/info/tmp/vector-tools/node_modules/jimp'));
const src=path.join(root,'Cat in Pumpkin/info/tmp/8x10-artwork');
const out=path.join(root,'Cat in Pumpkin/info/assets/simplified');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(async()=>{
const plan=JSON.parse(fs.readFileSync(path.join(src,'step-plan.json')));
const group=plan.groupNames.indexOf('gold'); if(group<0)throw Error('Missing eye group');
const mask=fs.readFileSync(path.join(src,'group-mask.bin'));
const target=await Jimp.read(path.join(src,'step-6.png'));
const white=await Jimp.read(path.join(src,'step-4.png'));
const original=Buffer.from(target.bitmap.data); let changed=0,region=0;
for(let i=0;i<mask.length;i++){
 if(mask[i]!==group)continue;
 region++;
 for(let c=0;c<4;c++)target.bitmap.data[i*4+c]=white.bitmap.data[i*4+c];
 if(!target.bitmap.data.subarray(i*4,i*4+4).equals(original.subarray(i*4,i*4+4)))changed++;
}
for(let i=0;i<mask.length;i++)if(mask[i]!==group&&!target.bitmap.data.subarray(i*4,i*4+4).equals(original.subarray(i*4,i*4+4)))throw Error('Changed outside eye group');
fs.mkdirSync(out,{recursive:true});
await target.writeAsync(path.join(out,'step-6-white-eyes.png'));
fs.writeFileSync(path.join(__dirname,'white-eye-layer-checks.json'),JSON.stringify({nativeGroupName:'gold',nativeGroupIndex:group,regionPixels:region,changedPixels:changed,outsideRegionChangedPixels:0,whitePixelsSource:'step-4.png',sourcePreservedHashes:Object.fromEntries(['step-4.png','step-6.png','group-mask.bin','step-plan.json'].map(n=>[n,hash(path.join(src,n))])),derivedHash:hash(path.join(out,'step-6-white-eyes.png'))},null,2));
})();
