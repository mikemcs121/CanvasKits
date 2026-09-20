const fs=require('fs'),path=require('path');
const deps='../../../Fox Fall/tmp/vector-tools/node_modules/';
const Jimp=require(deps+'jimp'),potrace=require(deps+'potrace'),{Resvg}=require(deps+'@resvg/resvg-js');
const root=path.resolve(__dirname,'../..'),asset=path.join(root,'assets/portrait-rebuild');
const w=1120,h=1400,n=w*h;
const colors=[[255,255,255],[98,194,183],[69,112,58],[26,65,105],[244,239,224],[245,195,192],[246,166,79],[181,46,85],[235,187,51],[26,65,105]];
function classify(r,g,b,x,y){
 if(g>r*1.12&&b>g*.72&&b<g*1.3)return 1;
 if(b>r*1.2&&b>g*.97)return x>.69*w&&y>.50*h?9:3;
 if(g>r*.95&&g>b*1.17)return 2;
 if(r>g*.94&&g>b*1.28)return 8;
 if(r>g*1.09&&g>b*1.13)return 6;
 if(r>g*1.04&&r>b*.94)return x>.33*w&&x<.73*w&&y<.43*h&&r>g*1.55?7:5;
 if(y>.51*h&&x>.25*w&&x<.71*w&&r>130&&g>130)return 4;
 if(g>b*1.1)return 2;
 return 1;
}
(async()=>{
 const line=await Jimp.read(path.join(asset,'flowers-in-vase-portrait-outline-generated.png')),paint=await Jimp.read(path.join(asset,'flowers-in-vase-portrait-painting-generated.png'));
 line.resize(w,h,Jimp.RESIZE_BICUBIC);paint.resize(w,h,Jimp.RESIZE_BICUBIC);await paint.writeAsync(path.join(asset,'painting-normalized.png'));
 const raw=await new Promise((resolve,reject)=>potrace.trace(line,{threshold:150,turdSize:0,alphaMax:1,optCurve:true,optTolerance:.08,color:'#000000',background:'transparent'},(e,s)=>e?reject(e):resolve(s)));
 const tag=raw.match(/<path\b[^>]+\/>/)[0],svg=`<svg xmlns="http://www.w3.org/2000/svg" width="8in" height="10in" viewBox="0 0 ${w} ${h}"><title>Flowers in Vase - full portrait 8 x 10 outline</title>${tag}</svg>`;
 fs.writeFileSync(path.join(__dirname,'flowers-in-vase-outline-8x10.svg'),svg);
 const rr=new Resvg(raw,{background:'white',font:{loadSystemFonts:false}}).render();const outline=await Jimp.read(rr.asPng());await outline.writeAsync(path.join(asset,'outline-canonical-white.png'));
 const ids=new Int32Array(n),q=new Int32Array(n),regions=[];for(let i=0;i<n;i++)if(outline.bitmap.data[i*4]<165)ids[i]=-1;
 for(let i=0;i<n;i++){if(ids[i])continue;let id=regions.length+1,head=0,tail=1;q[0]=i;ids[i]=id;let count=0,sx=0,sy=0,sr=0,sg=0,sb=0,x0=w,y0=h,x1=0,y1=0;
 while(head<tail){const p=q[head++],x=p%w,y=(p/w)|0;count++;sx+=x;sy+=y;sr+=paint.bitmap.data[p*4];sg+=paint.bitmap.data[p*4+1];sb+=paint.bitmap.data[p*4+2];x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);for(const j of [x?p-1:-1,x<w-1?p+1:-1,y?p-w:-1,y<h-1?p+w:-1])if(j>=0&&!ids[j]){ids[j]=id;q[tail++]=j;}}
 const cx=sx/count,cy=sy/count,r=sr/count,g=sg/count,b=sb/count;regions.push({id,count,cx,cy,box:[x0,y0,x1,y1],rgb:[r,g,b],group:classify(r,g,b,cx,cy)});
 }
 const overridesPath=path.join(__dirname,'region-overrides.json'),overrides=fs.existsSync(overridesPath)?JSON.parse(fs.readFileSync(overridesPath)):{};for(const r of regions)if(overrides[r.id]!==undefined)r.group=overrides[r.id];
 const flat=new Jimp(w,h,0xffffffff),label=flat.clone(),groups=new Uint8Array(n);for(let i=0;i<n;i++){const gr=ids[i]>0?regions[ids[i]-1].group:0;groups[i]=gr;const c=ids[i]===-1?[0,0,0]:colors[gr];for(let k=0;k<3;k++)flat.bitmap.data[i*4+k]=c[k];}
 await flat.writeAsync(path.join(__dirname,'region-color-review.png'));
 const font=await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);label.bitmap.data=Buffer.from(flat.bitmap.data);for(const r of regions)if(r.count>40)label.print(font,Math.round(r.cx)-8,Math.round(r.cy)-8,String(r.id));await label.writeAsync(path.join(__dirname,'region-label-review.png'));
 const bin=Buffer.alloc(8+n*4);bin.writeInt32LE(w);bin.writeInt32LE(h,4);for(let i=0;i<n;i++)bin.writeInt32LE(ids[i],8+i*4);fs.writeFileSync(path.join(__dirname,'regions.bin'),bin);fs.writeFileSync(path.join(__dirname,'group-mask.bin'),groups);fs.writeFileSync(path.join(__dirname,'regions.json'),JSON.stringify(regions,null,2));
 fs.writeFileSync(path.join(__dirname,'groups.csv'),regions.map(r=>r.id+','+r.group).join('\n'));console.log(JSON.stringify({dimensions:[w,h],regions:regions.length,large:regions.filter(r=>r.count>500).length,svgBytes:svg.length}));
})().catch(e=>{console.error(e);process.exit(1)});
