const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'../../..'),out=path.join(root,'tmp/owl'),A=path.join(root,'Owl/info/assets');
const {Resvg}=require(path.join(root,'assets/tools/vector-tools/node_modules/@resvg/resvg-js'));
const potrace=require(path.join(root,'assets/tools/vector-tools/node_modules/potrace'));
const Jimp=require(path.join(root,'assets/tools/vector-tools/node_modules/jimp'));
const g=JSON.parse(fs.readFileSync(path.join(A,'geometry.json'))),plan=JSON.parse(fs.readFileSync(path.join(A,'paint-plan.json')));
const trace=file=>new Promise((resolve,reject)=>potrace.trace(file,{threshold:128,turdSize:1,optTolerance:.2},(e,s)=>e?reject(e):resolve([...s.matchAll(/<path d="([^"]+)"/g)].map(m=>m[1]).join(' '))));
const png=(s,f)=>fs.writeFileSync(f,new Resvg(s,{fitTo:{mode:'width',value:2400}}).render().asPng());
async function main(){
 const layers=fs.existsSync(path.join(A,'paint-layers.json'))&&!process.argv.includes('--retrace')?JSON.parse(fs.readFileSync(path.join(A,'paint-layers.json'))):[];
 if(!layers.length)for(const name of Object.keys(plan.colors))if(name!=='light-blue')layers.push({name,color:plan.colors[name],stage:plan.stages[name],d:await trace(path.join(out,name+'-mask.png'))});
 fs.writeFileSync(path.join(A,'paint-layers.json'),JSON.stringify(layers,null,2));
 const bodyLines=[...g.centerlinePaths,...g.solidBoundaryPaths].map(d=>`<path d="${d}"/>`).join('');
 for(let stage=1;stage<=6;stage++){
  const colored=layers.filter(l=>!['black','white'].includes(l.name)).map(l=>`<path d="${l.d}" fill="${l.stage<=stage?l.color:'white'}" fill-rule="evenodd"/>`).join('');
  // Fill the exact traced eye contours, preserving their smooth white rings and
  // shine holes rather than reconstructing the narrow iris bands from pixels.
  const eyeBase=g.solidBoundaryPaths.flatMap(d=>d.split(/(?=M)/).filter(Boolean)).map(d=>`<path d="${d}" fill="white"/>`).join('');
  const eyes=stage===6?g.solidBoundaryPaths.map(d=>`<path d="${d}" fill="${plan.colors.black}" fill-rule="evenodd"/>`).join(''):'';
  const stems=stage>=2?`<g fill="none" stroke="${plan.colors.brown}" stroke-width="6" stroke-linecap="round"><path d="M135 1174 Q151 1212 179 1247 M136 1238 Q155 1249 179 1254 M800 1268 Q825 1256 840 1238 M814 1302 Q839 1298 861 1305 M793 1310 Q808 1320 813 1334"/></g>`:'';
  // Small face strokes use the supplied black paint in the final step.
  const face=g.centerlinePaths.filter(d=>{const n=d.match(/[-+]?\d*\.?\d+/g).map(Number),xs=n.filter((_,i)=>i%2===0),ys=n.filter((_,i)=>i%2===1),x=xs.reduce((a,b)=>a+b)/xs.length,y=ys.reduce((a,b)=>a+b)/ys.length;return (x>260&&x<345&&y>395&&y<450)||(x>580&&x<670&&y>300&&y<345);}).map(d=>`<path d="${d}"/>`).join('');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="8in" height="10in" viewBox="0 0 576 720"><rect width="576" height="720" fill="${plan.colors['light-blue']}"/><g transform="translate(${g.translate.join(' ')}) scale(${g.scale})">${colored}${stems}${eyeBase}${eyes}<g fill="none" stroke="#808080" stroke-width="${2/g.scale}" stroke-linecap="round" stroke-linejoin="round">${bodyLines}${stage===6?`<g stroke="${plan.colors.black}">${face}</g>`:''}</g></g></svg>`;
  fs.writeFileSync(path.join(out,`stage-${stage}.svg`),svg);png(svg,path.join(A,`stage-${String(stage).padStart(2,'0')}.png`));
  if(stage===6){fs.writeFileSync(path.join(A,'reference-master.svg'),svg);fs.copyFileSync(path.join(A,'stage-06.png'),path.join(A,'reference-master.png'));}
 }
 // Recolor only the shared logo's light ribbons and saturated landscape hues.
 const logo=await Jimp.read(path.join(root,'assets/images/river-and-ridge-logo.png'));
 logo.scan(0,0,logo.bitmap.width,logo.bitmap.height,function(x,y,i){const d=this.bitmap.data,r=d[i],gg=d[i+1],b=d[i+2];if(!d[i+3])return;if(r>210&&gg>180&&b<r-20){d[i]=250;d[i+1]=237;d[i+2]=209;}else if(b>r*1.3&&b>gg*.95){d[i]=96;d[i+1]=175;d[i+2]=191;}});
 await logo.writeAsync(path.join(A,'page-logo.png'));
 const contact=new Jimp(1440,1200,0xffffffff);for(let i=1;i<=6;i++){const im=await Jimp.read(path.join(A,`stage-${String(i).padStart(2,'0')}.png`));im.resize(480,600,Jimp.RESIZE_BICUBIC);contact.composite(im,((i-1)%3)*480,Math.floor((i-1)/3)*600);}await contact.writeAsync(path.join(out,'stages.png'));
 console.log('Six registered stages and reference ready.');
}
main().catch(e=>{console.error(e);process.exitCode=1});
