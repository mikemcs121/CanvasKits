const fs=require('fs'),sharp=require('C:/Users/mmcsherry/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
(async()=>{
const folder='Gnome Christmas Tree',svg=fs.readFileSync(folder+'/gnome-christmas-tree-outline-8x10.svg','utf8');
const paths=[...svg.matchAll(/<path d="([^"]+)"/g)].map(m=>m[1]);
paths.forEach((d,i)=>{let n=d.match(/-?[\d.]+/g).map(Number);let xs=n.filter((_,i)=>!(i%2)),ys=n.filter((_,i)=>i%2);if(Math.min(...xs)>2150&&Math.min(...ys)<1800)console.log('small-tree',i,d);});
const {data}=await sharp(folder+'/info/assets/reference-restoration/candidate-02.png').resize(800,1000,{fit:'fill'}).removeAlpha().raw().toBuffer({resolveWithObject:true});
const mask=new Uint8Array(800000);for(let y=310;y<620;y++)for(let x=150;x<590;x++){let i=y*800+x,[r,g,b]=data.subarray(i*3,i*3+3);mask[i]=r>155&&g>115&&b<140&&g>r*.53?1:0;}
let comps=[];for(let i=0;i<mask.length;i++)if(mask[i]){let q=[i],n=0,x0=800,y0=1000,x1=0,y1=0;mask[i]=0;for(let h=0;h<q.length;h++){let j=q[h],x=j%800,y=j/800|0;n++;x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);for(let k of [x?j-1:-1,x<799?j+1:-1,j-800,j+800])if(k>=0&&k<mask.length&&mask[k]){mask[k]=0;q.push(k)}}if(n>200)comps.push({n,x0,y0,x1,y1,cx:(x0+x1)/2,cy:(y0+y1)/2});}
console.log('bulbs',JSON.stringify(comps));fs.writeFileSync(folder+'/info/tmp/reference-restoration/detected-bulbs.json',JSON.stringify(comps,null,2));
await sharp('Gnome Fall/info/tmp/organization/regions.png').jpeg({quality:95}).toFile('Gnome Fall/info/tmp/reference-restoration/old-region-map.jpg');
})();
