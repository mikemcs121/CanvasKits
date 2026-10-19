// Clean, shared transfer/stage geometry measured from the selected painting.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const W=1000,H=800,EDITION='vt-hokie-clean-border-2026-10-18';
function area(p){return p.reduce((a,v,i)=>{const n=p[(i+1)%p.length];return a+v[0]*n[1]-n[0]*v[1];},0)/2;}
function rdp(p,t=2.6){if(p.length<=2)return p;const a=p[0],b=p.at(-1),dx=b[0]-a[0],dy=b[1]-a[1],len=dx*dx+dy*dy;let best=-1,k=0;for(let i=1;i<p.length-1;i++){const v=p[i],u=len?Math.max(0,Math.min(1,((v[0]-a[0])*dx+(v[1]-a[1])*dy)/len)):0,d=(v[0]-a[0]-u*dx)**2+(v[1]-a[1]-u*dy)**2;if(d>best){best=d;k=i;}}return best>t*t?[...rdp(p.slice(0,k+1),t).slice(0,-1),...rdp(p.slice(k),t)]:[a,b];}
function contour(binary){
 const edges=new Map(),key=(x,y)=>y*(W+1)+x,xy=n=>[n%(W+1),Math.floor(n/(W+1))];
 function add(x,y,xx,yy){const k=key(x,y);if(!edges.has(k))edges.set(k,[]);edges.get(k).push(key(xx,yy));}
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(binary[y*W+x]){
  if(!y||!binary[(y-1)*W+x])add(x,y,x+1,y);
  if(x===W-1||!binary[y*W+x+1])add(x+1,y,x+1,y+1);
  if(y===H-1||!binary[(y+1)*W+x])add(x+1,y+1,x,y+1);
  if(!x||!binary[y*W+x-1])add(x,y+1,x,y);
 }
 const loops=[];
 while(edges.size){const start=edges.keys().next().value,pts=[];let n=start;do{pts.push(xy(n));const next=edges.get(n);if(!next?.length)break;const target=next.pop();if(!next.length)edges.delete(n);n=target;}while(n!==start&&pts.length<100000);if(pts.length>20)loops.push(pts);}
 loops.sort((a,b)=>Math.abs(area(b))-Math.abs(area(a)));const loop=loops[0];
 const first=loop.reduce((best,p,i)=>p[0]+p[1]<loop[best][0]+loop[best][1]?i:best,0),p=[...loop.slice(first),...loop.slice(0,first)];
 let far=1;for(let i=2;i<p.length;i++)if((p[i][0]-p[0][0])**2+(p[i][1]-p[0][1])**2>(p[far][0]-p[0][0])**2+(p[far][1]-p[0][1])**2)far=i;
 let poly=[...rdp(p.slice(0,far+1)).slice(0,-1),...rdp([...p.slice(far),p[0]]).slice(0,-1)];if(area(poly)<0)poly.reverse();return poly;
}
function offset(poly,d){return poly.map((b,i)=>{const a=poly[(i+poly.length-1)%poly.length],c=poly[(i+1)%poly.length];const ux=b[0]-a[0],uy=b[1]-a[1],vx=c[0]-b[0],vy=c[1]-b[1],ul=Math.hypot(ux,uy),vl=Math.hypot(vx,vy);const p=[b[0]+uy/ul*d,b[1]-ux/ul*d],q=[b[0]+vy/vl*d,b[1]-vx/vl*d],cross=ux*vy-uy*vx;if(Math.abs(cross)<1e-8)return p;const t=((q[0]-p[0])*vy-(q[1]-p[1])*vx)/cross;return [+(p[0]+ux*t).toFixed(3),+(p[1]+uy*t).toFixed(3)];});}
function polygonPath(poly){return 'M'+poly.map(p=>p.join(' ')).join(' L')+' Z';}
function roundedPath(poly,radius){const corners=poly.map((b,i)=>{const a=poly[(i+poly.length-1)%poly.length],c=poly[(i+1)%poly.length],al=Math.hypot(a[0]-b[0],a[1]-b[1]),cl=Math.hypot(c[0]-b[0],c[1]-b[1]),r=Math.min(radius,al/4,cl/4);return {b,in:[b[0]+(a[0]-b[0])*r/al,b[1]+(a[1]-b[1])*r/al],out:[b[0]+(c[0]-b[0])*r/cl,b[1]+(c[1]-b[1])*r/cl]};});const fmt=p=>p.map(n=>+n.toFixed(3)).join(' ');return 'M'+fmt(corners[0].in)+corners.map((c,i)=>' Q'+fmt(c.b)+' '+fmt(c.out)+' L'+fmt(corners[(i+1)%corners.length].in)).join('')+' Z';}
async function build(source,{A,Jimp,Resvg,trace,clean,boundaries,ridgeSeam,save,retrace=false,diagnose=false}){
 const gp=path.join(A,'geometry.json'),sourceHash=crypto.createHash('sha256').update(source).digest('hex');
 if(!retrace&&!diagnose&&fs.existsSync(gp)){const g=JSON.parse(fs.readFileSync(gp));if(g.edition===EDITION&&g.sourceHash===sourceHash)return g;}
 const im=await Jimp.read(source);im.resize(W,H,Jimp.RESIZE_BICUBIC).blur(1);const data=im.bitmap.data;
 const maroon=new Uint8Array(W*H),exterior=new Uint8Array(W*H),q=[];
 for(let i=0;i<W*H;i++){const j=i*4,r=data[j],g=data[j+1],b=data[j+2];if(r>g*1.7&&r>b*1.25&&g<110&&r<220)maroon[i]=1;}
 for(let x=0;x<W;x++)q.push(x,(H-1)*W+x);for(let y=1;y<H-1;y++)q.push(y*W,y*W+W-1);for(const i of q)exterior[i]=1;
 for(let n=0;n<q.length;n++){const i=q[n],x=i%W,y=(i/W)|0;for(const k of [x?i-1:-1,x<W-1?i+1:-1,y?i-W:-1,y<H-1?i+W:-1])if(k>=0&&!maroon[k]&&!exterior[k]){exterior[k]=1;q.push(k);}}
 const filled=Uint8Array.from(exterior,v=>1-v),measured=contour(filled);
 if(sourceHash!=='22fcb88ca788707b5ddd254cd2a3cee9f8d5da5f229b4c2435ff80b3facdb108')throw Error('Border landmarks require review against this changed painting.');
 // Landmarks measured from the selected image; omit tiny paint-edge shadows and corner nubs.
 const inner=[[66,145.5],[267,145.5],[317,242],[374,145.5],[944,145.5],[856,312],[728,312],[592,571],[413,571],[535,320],[474,320],[328,571],[291,571]];
 const outer=offset(inner,9.5),innerD=roundedPath(inner,1.5),outerD=roundedPath(outer,3);
 if(diagnose)return {measured,inner,outer,innerD,outerD};
 function raster(d){return new Resvg(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="800"><path d="${d}" fill="white" fill-rule="evenodd"/></svg>`).render().asPng();}
 const innerIm=await Jimp.read(raster(innerD)),outerIm=await Jimp.read(raster(outerD));
 const white=new Jimp(W,H,0xffffffff),labels=new Uint8Array(W*H);
 const middle=ridgeSeam(data,[[0,575],[50,561],[150,544],[250,561],[350,584],[500,589],[650,612],[750,598],[850,569],[950,573],[999,584]]);
 const near=ridgeSeam(data,[[0,650],[50,640],[150,620],[250,620],[300,634],[400,660],[500,662],[650,691],[750,713],[850,725],[950,734],[999,739]]);
 for(let i=0;i<W*H;i++){
  const j=i*4,r=data[j],g=data[j+1],b=data[j+2],x=i%W,y=(i/W)|0;
  if(outerIm.bitmap.data[j+3]>127)labels[i]=5;
  else if(b>r*1.3&&g>r*1.15&&b>g*1.08)labels[i]=y<middle[x]?1:y<near[x]?2:3;
  if(innerIm.bitmap.data[j+3]>127){labels[i]=4;if(r>205&&g>185&&b>160){labels[i]=6;white.bitmap.data[j]=white.bitmap.data[j+1]=white.bitmap.data[j+2]=0;}}
 }
 clean(labels,60);
 const whiteD=await trace(white),names=['sky','far ridge','middle ridge','near ridge','maroon emblem','orange border','white turkey details'],colors=['#FFF0CF','#508AB6','#285E8C','#083A65','#6A1026','#E5751F','#FFFFFF'],starts=[1,3,4,5,6,7,7],regions=[];
 for(let n=0;n<7;n++){
  const mask=new Jimp(W,H,0xffffffff);let pixels=0;for(let i=0;i<labels.length;i++)if(labels[i]===n){let j=i*4;mask.bitmap.data[j]=mask.bitmap.data[j+1]=mask.bitmap.data[j+2]=0;pixels++;}
  const d=n===4?innerD+' '+whiteD:n===5?outerD+' '+innerD:n===6?whiteD:await trace(mask);
  regions.push({id:n,name:names[n],color:colors[n],start:starts[n],pixels,d});
 }
 const backgroundLines=boundaries(labels).filter(l=>l.pair.every(id=>id<4));
 const lines=[...backgroundLines,{d:outerD,pair:[0,5],role:'continuous outer orange edge'},{d:innerD,pair:[4,5],role:'continuous inner orange edge'},{d:whiteD,pair:[4,6],role:'turkey details'}];
 const g={edition:EDITION,w:W,h:H,sourceHash,orientation:'landscape',printInches:[10,8],border:{measured,inner,outer,widthSourceUnits:9.5,innerD,outerD},regions,lines,notes:'Selected corrected chat painting is unchanged. Border consists of two clean closed contours measured from its maroon silhouette, including the complete central V/T gap. Tiny paint-edge shadows are omitted. Mountains stop at the emblem; guide masks reuse these exact contours. No dilation-generated hooks, broken seams or doubled contour fragments.'};
 save(gp,JSON.stringify(g,null,2));return g;
}
module.exports={build,polygonPath};
