const fs=require('fs'),path=require('path'),crypto=require('crypto');
const Jimp=require('../../../Fox Fall/tmp/vector-tools/node_modules/jimp');
const {Resvg}=require('../../../Fox Fall/tmp/vector-tools/node_modules/@resvg/resvg-js');
const kit=path.resolve(__dirname,'../..'),slug='flowers-in-vase';
(async()=>{
 const name=slug+'-outline-8x10.svg',file=path.join(__dirname,name),svg=fs.readFileSync(file,'utf8');
 if(!svg.includes('width="8in" height="10in"')||!svg.includes('<path')||/<image|data:image|<rect/i.test(svg))throw Error('Vector structure failed');
 const render=new Resvg(svg,{font:{loadSystemFonts:false},background:'white',fitTo:{mode:'width',value:800}}).render();fs.writeFileSync(path.join(__dirname,'vector-white-review.png'),render.asPng());
 const source=await Jimp.read(path.join(kit,slug+'-outline.png')),vector=await Jimp.read(path.join(__dirname,'vector-native-review.png'));
 const comparison=new Jimp(1254,627,0xffffffff);source.resize(627,627);vector.resize(627,627);comparison.composite(source,0,0);comparison.composite(vector,627,0);await comparison.writeAsync(path.join(__dirname,'source-vector-comparison.png'));
 const out=path.join(kit,'output/svg/8x10');fs.mkdirSync(out,{recursive:true});fs.copyFileSync(file,path.join(out,name));fs.copyFileSync(file,path.join(kit,name));
 const png=slug+'-outline-8x10-600dpi.png';fs.copyFileSync(path.join(__dirname,png),path.join(kit,'output/pdf/8x10',png));fs.copyFileSync(path.join(__dirname,png),path.join(kit,png));
 const hash=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');fs.writeFileSync(path.join(__dirname,'deliverable.json'),JSON.stringify({path:path.join(out,name),sha256:hash},null,2));console.log('Validated SVG saved: '+path.join(out,name));
})().catch(e=>{console.error(e);process.exit(1)});
