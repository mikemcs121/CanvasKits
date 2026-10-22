// UVA source-derived kit. No production file is replaced without --promote.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),cp=require('child_process');
const root=path.resolve(__dirname,'../../..'),A=path.join(root,'UVA/info/assets'),out=path.join(root,'tmp/uva-kit/candidate'),art=path.join(out,'source-assets'),review=path.join(out,'review');
const Jimp=require(path.join(root,'assets/tools/vector-tools/node_modules/jimp'));
const {Resvg}=require(path.join(root,'assets/tools/vector-tools/node_modules/@resvg/resvg-js'));
const {PNG}=require(path.join(root,'assets/tools/vector-tools/node_modules/pngjs'));
const {clean,boundaries}=require('./geometry-tools.cjs');
const {outline}=require('./outline-paths.cjs');
const plan=JSON.parse(fs.readFileSync(path.join(root,'assets/tools/guide-template/kits.json'),'utf8')).find(k=>k.slug==='uva'),palette=plan.suppliedPaints;
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),read=f=>fs.readFileSync(f),W=1000,H=800;
const sourcePath=path.join(root,'UVA/info/archive/previous-root-files/UVA.jpg');
const wrap=body=>`<svg xmlns="http://www.w3.org/2000/svg" width="10in" height="8in" viewBox="0 0 1000 800">${body}</svg>`;
function png(svg,file,width=3000){
 const b=new Resvg(svg,{fitTo:{mode:'width',value:width}}).render().asPng(),data=Buffer.alloc(9);data.writeUInt32BE(11811,0);data.writeUInt32BE(11811,4);data[8]=1;
 const payload=Buffer.concat([Buffer.from('pHYs'),data]);let crc=0xffffffff;for(const x of payload){crc^=x;for(let k=0;k<8;k++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}const chunk=Buffer.alloc(21);chunk.writeUInt32BE(9,0);payload.copy(chunk,4);chunk.writeUInt32BE((crc^0xffffffff)>>>0,17);
 fs.writeFileSync(file,Buffer.concat([b.subarray(0,33),chunk,b.subarray(33)]));
}
async function geometry(){
 const source=await Jimp.read(sourcePath),labels=new Uint8Array(W*H);
 // Map the complete V-and-sabres subject from the supplied JPEG; omit its navy rectangle and tiny registration mark.
 // Coordinates are in source pixels; source geometry is not independently redrawn.
 for(let y=90;y<644;y++)for(let x=155;x<845;x++){
  const sx=140+(x-155)/690*416,sy=26+(y-90)/554*334;
  if(sx>510&&sy>339)continue;
  const i=(Math.min(source.bitmap.height-1,Math.round(sy))*source.bitmap.width+Math.min(source.bitmap.width-1,Math.round(sx)))*4,d=source.bitmap.data,r=d[i],g=d[i+1],b=d[i+2];
  let label=0;
  if(r>155&&g>155&&b>145&&Math.max(r,g,b)-Math.min(r,g,b)<65)label=Math.min(r,g,b)>218?4:3;
  else if(r>150&&r>g*1.25&&b<130)label=g<100?1:2;
  labels[y*W+x]=label;
 }
 clean(labels,35);
 const lines=boundaries(labels);
 function smooth(points){let d='M'+points[0].join(' ');for(let i=1;i<points.length-1;i++){const a=points[i-1],b=points[i],c=points[i+1],u=[b[0]-a[0],b[1]-a[1]],v=[c[0]-b[0],c[1]-b[1]],cos=(u[0]*v[0]+u[1]*v[1])/(Math.hypot(...u)*Math.hypot(...v));if(cos<.6)d+=' L'+b.join(' ');else d+=' L'+[(a[0]+b[0])/2,(a[1]+b[1])/2].join(' ')+' Q'+b.join(' ')+' '+[(b[0]+c[0])/2,(b[1]+c[1])/2].join(' ');}return d+' L'+points.at(-1).join(' ');}
 for(const line of lines)line.d=smooth(line.pts);
 function regionPath(id){const chosen=lines.filter(l=>l.pair.includes(id)),used=new Set(),key=p=>p.join(','),at=new Map();chosen.forEach((l,i)=>{for(const end of l.ends){const k=key(end);if(!at.has(k))at.set(k,[]);at.get(k).push(i);}});let result='';for(let i=0;i<chosen.length;i++){if(used.has(i))continue;let n=i,start=key(chosen[i].ends[0]),point=start,first=true,d='',limit=0;while(!used.has(n)){if(++limit>chosen.length+1)throw Error('Contour loop');used.add(n);const l=chosen[n],forward=key(l.ends[0])===point,pts=forward?l.pts:[...l.pts].reverse(),part=smooth(pts);d+=first?part:part.replace(/^M/,' L');first=false;point=key(l.ends[forward?1:0]);if(point===start)break;const next=(at.get(point)||[]).find(j=>!used.has(j));if(next===undefined)throw Error('Open canonical contour');n=next;}result+=d+'Z ';}return result;}
 const colors=['','#E8471B','#F87818','#BEC4C0','#FFFFFF'],regions=[];
 for(let id=1;id<=4;id++){let count=0;for(const v of labels)if(v===id)count++;regions.push({id,name:['','vermilion edge','orange body','gray V face','white V face'][id],color:colors[id],start:id<=2?6:7,pixels:count,d:regionPath(id)});}
 const silhouette=regionPath(0),background=JSON.parse(read(path.join(A,'background-source.json'))),ridges=[];
 for(let ridge=0;ridge<3;ridge++){
  const pair=[ridge,ridge+1],paths=background.ridgeLines.filter(l=>JSON.stringify(l.pair)===JSON.stringify(pair));
  const b=new Resvg(wrap(`<g fill="none" stroke="black" stroke-width="1">${paths.map(p=>`<path d="${p.d}"/>`).join('')}</g>`),{fitTo:{mode:'width',value:W}}).render().asPng(),im=PNG.sync.read(b),ys=[];
  for(let x=0;x<W;x++){let sum=0,weight=0;for(let y=0;y<H;y++){const a=im.data[(y*W+x)*4+3];if(a>20){sum+=y*a;weight+=a;}}ys[x]=weight?sum/weight:null;}
  const known=ys.map((y,x)=>y===null?null:x).filter(x=>x!==null);if(known.length<100)throw Error('Missing VT ridge source');
  for(let x=0;x<known[0];x++)ys[x]=ys[known[0]];
  for(let i=0;i<known.length-1;i++){const a=known[i],b=known[i+1];for(let x=a+1;x<b;x++)ys[x]=ys[a]+(ys[b]-ys[a])*(x-a)/(b-a);}
  for(let x=known.at(-1)+1;x<W;x++)ys[x]=ys[known.at(-1)];
  const seam='M'+ys.map((y,x)=>`${x} ${y.toFixed(2)}`).join(' L');ridges.push({d:seam+' L1000 800 L0 800Z',seam,color:palette[ridge+3].hex,start:ridge+3,sourceSegments:paths.length});
 }
 return {width:W,height:H,sourceSha256:hash(read(sourcePath)),sourceCrop:[140,26,416,334],placement:[155,90,690,554],omitted:'navy rectangle and tiny registration symbol',backgroundSourceSha256:hash(read(path.join(A,'background-source.json'))),regions,silhouette,lines:lines.map(({d,pair})=>({d,pair})),ridges};
}
function paths(lines){return lines.map(l=>`<path d="${l.d}"/>`).join('');}
function legacyOutline(g){return `<svg xmlns="http://www.w3.org/2000/svg" width="10in" height="8in" viewBox="0 0 720 576"><defs><clipPath id="outside"><path d="M0 0H1000V800H0Z ${g.silhouette}" clip-rule="evenodd" fill-rule="evenodd"/></clipPath></defs><g transform="scale(.72)" fill="none" stroke="#A6A6A6" stroke-width="${2/.72}" stroke-linecap="round" stroke-linejoin="round"><g clip-path="url(#outside)">${g.ridges.map(r=>`<path d="${r.seam}"/>`).join('')}</g>${paths(g.lines)}</g></svg>`;}
function painting(g,stage){
 const sky=`<defs><linearGradient id="sky" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="580"><stop offset="0" stop-color="#FFF0CF"/><stop offset=".48" stop-color="#FFF0CF"/><stop offset=".63" stop-color="#F5BB7D"/><stop offset=".75" stop-color="#F5BB7D"/><stop offset=".93" stop-color="#F87818"/><stop offset="1" stop-color="#F87818"/></linearGradient><clipPath id="outside"><path d="M0 0H1000V800H0Z ${g.silhouette}" clip-rule="evenodd"/></clipPath></defs>`;
 let body=sky+`<rect width="1000" height="800" fill="${stage===1?'#FFF0CF':'url(#sky)'}"/>`;
 body+=g.ridges.map(r=>`<path d="${r.d}" fill="${r.start<=stage?r.color:'white'}"/>`).join('');
 body+=`<path d="${g.silhouette}" fill="white" fill-rule="evenodd"/>`;
 body+=g.regions.filter(r=>r.start<=stage).map(r=>`<path d="${r.d}" fill="${r.color}" fill-rule="evenodd"/>`).join('');
 if(stage<7){const start=id=>id===0?0:g.regions.find(r=>r.id===id).start;body+=`<g fill="none" stroke="#A6A6A6" stroke-width="${2/.72}" stroke-linecap="round" stroke-linejoin="round"><g clip-path="url(#outside)">${g.ridges.filter(r=>r.start>stage).map(r=>`<path d="${r.seam}"/>`).join('')}</g>${paths(g.lines.filter(l=>l.pair.some(id=>start(id)>stage)))}</g>`;}
 return wrap(body);
}
function run(script,args){const r=cp.spawnSync(process.execPath,[path.join(root,script),...args],{cwd:root,stdio:'inherit',windowsHide:true});if(r.status!==0)throw Error('Failed: '+script);}
async function main(){
 fs.mkdirSync(art,{recursive:true});fs.mkdirSync(review,{recursive:true});
 const geometryPath=path.join(A,'geometry.json'),bindingPath=path.join(A,'outline-binding.json'),productionOutline=path.join(root,'UVA/uva-outline-10x8.svg');
 const savedG=fs.existsSync(geometryPath)?JSON.parse(read(geometryPath)):await geometry();
 const proposalAt=process.argv.indexOf('--geometry-proposal');
 if(process.argv.includes('--outline-only')&&proposalAt>=0)throw Error('Outline-only repair must preserve saved geometry.');
 const g=proposalAt>=0?JSON.parse(read(path.resolve(root,process.argv[proposalAt+1]))):savedG;
 if(proposalAt>=0&&['regions','silhouette','lines'].some(k=>JSON.stringify(g[k])!==JSON.stringify(savedG[k])))throw Error('This background proposal must preserve all emblem contours.');
 if(g.sourceSha256!==hash(read(sourcePath))||g.backgroundSourceSha256!==hash(read(path.join(A,'background-source.json'))))throw Error('Source changed independently of canonical geometry');
 const svg=outline(g);
 if(fs.existsSync(productionOutline)){const binding=JSON.parse(read(bindingPath));if(hash(read(productionOutline))!==binding.outlineSha256||hash(Buffer.from((binding.rendererVersion===2?outline:legacyOutline)(savedG)))!==binding.outlineSha256||(hash(read(geometryPath))!==binding.geometrySha256&&hash(read(geometryPath).toString('utf8').replace(/\r\n/g,'\n'))!==binding.geometrySha256))throw Error('Saved outline binding changed');}
 fs.writeFileSync(path.join(out,'uva-outline-10x8.svg'),svg);fs.writeFileSync(path.join(out,'geometry.json'),JSON.stringify(g,null,2));
 png(svg,path.join(review,'outline-transparent.png'));png(svg.replace('<g transform=', '<rect width="720" height="576" fill="white"/><g transform='),path.join(review,'outline-preview.png'));
 if(process.argv.includes('--outline-only')){
  if(process.argv.includes('--promote')){
   fs.copyFileSync(path.join(out,'uva-outline-10x8.svg'),productionOutline);
   fs.writeFileSync(bindingPath,JSON.stringify({rendererVersion:2,outlineSha256:hash(read(productionOutline)),geometrySha256:hash(read(geometryPath)),sourceSha256:g.sourceSha256},null,2));
  }
  console.log('UVA outline-only repair complete; reference, guide and canonical geometry preserved.');return;
 }
 for(let stage=1;stage<=7;stage++)png(painting(g,stage),path.join(art,`stage-${String(stage).padStart(2,'0')}.png`));
 fs.writeFileSync(path.join(art,'reference-master.svg'),painting(g,7));fs.copyFileSync(path.join(art,'stage-07.png'),path.join(art,'reference-master.png'));
 fs.copyFileSync(path.join(A,'page-logo.png'),path.join(art,'page-logo.png'));
 require('./reference-pdf.cjs')({art,out,PNG});
 const checks=require('./guide-pdf.cjs')({root,out,art,palette,steps:plan.steps.map(s=>[s.heading,s.caption]),Resvg,PNG});fs.writeFileSync(path.join(review,'layout-checks.json'),JSON.stringify(checks,null,2));
 for(const [kind,size]of [['painting-guide','612x792'],['finished-reference','720x576']])run('assets/tools/pdf-render/render-pdf.cjs',[path.join(out,`uva-${kind}-10x8.pdf`),path.join(review,kind+'.png'),'--expect-pages','1','--expect-points',size,'--checks',path.join(review,'pdf-checks.json')]);
 const contact=new Jimp(2400,960,0xffffffff);for(let i=0;i<8;i++){const f=i===0?'reference-master.png':`stage-${String(i).padStart(2,'0')}.png`,im=await Jimp.read(path.join(art,f));im.resize(600,480,Jimp.RESIZE_BICUBIC);contact.composite(im,i%4*600,Math.floor(i/4)*480);}await contact.writeAsync(path.join(review,'stages.png'));
 const overlay=await Jimp.read(path.join(art,'reference-master.png')),line=await Jimp.read(path.join(review,'outline-transparent.png'));line.scan(0,0,line.bitmap.width,line.bitmap.height,function(x,y,j){if(this.bitmap.data[j+3]){this.bitmap.data[j]=255;this.bitmap.data[j+1]=0;this.bitmap.data[j+2]=180;}});overlay.composite(line,0,0);await overlay.resize(1500,1200,Jimp.RESIZE_BICUBIC).writeAsync(path.join(review,'registration.png'));
 const rgba=PNG.sync.read(read(path.join(review,'outline-transparent.png')));let transparent=0;for(let i=3;i<rgba.data.length;i+=4)if(rgba.data[i]===0)transparent++;
 const measured={outlinePixels:[rgba.width,rgba.height],transparentPixels:transparent,vector:!/<image\b/.test(svg),strokePoints:2,color:'#A6A6A6',paletteCount:palette.length,sourceSha256:g.sourceSha256,stageDependencies:g.regions.map(({name,start,pixels})=>({name,start,pixels}))};if(!transparent||!measured.vector||palette.length>12)throw Error('Preflight failed');fs.writeFileSync(path.join(review,'art-checks.json'),JSON.stringify(measured,null,2));
 if(process.argv.includes('--promote')){
  for(const name of ['uva-outline-10x8.svg','uva-painting-guide-10x8.pdf','uva-finished-reference-10x8.pdf'])fs.copyFileSync(path.join(out,name),path.join(root,'UVA',name));
  fs.copyFileSync(path.join(out,'geometry.json'),geometryPath);for(const name of fs.readdirSync(art))if(name!=='page-logo.png')fs.copyFileSync(path.join(art,name),path.join(A,name));
  fs.writeFileSync(bindingPath,JSON.stringify({rendererVersion:2,outlineSha256:hash(read(productionOutline)),geometrySha256:hash(read(geometryPath)),sourceSha256:g.sourceSha256},null,2));console.log('UVA kit promoted.');
 }else console.log('UVA candidates ready for review; production unchanged.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
