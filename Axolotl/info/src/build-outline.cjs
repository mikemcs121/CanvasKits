const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'../../..'),out=path.join(root,'tmp/axolotl');
const {Resvg}=require(path.join(root,'assets/tools/vector-tools/node_modules/@resvg/resvg-js'));
const potrace=require(path.join(root,'assets/tools/vector-tools/node_modules/potrace'));
const chains=JSON.parse(fs.readFileSync(path.join(out,'centerlines.json')));
function simplify(p,t=.65){
 if(p.length<3)return p;
 const a=p[0],b=p.at(-1),dx=b[0]-a[0],dy=b[1]-a[1],len=dx*dx+dy*dy;let max=0,index=0;
 for(let i=1;i<p.length-1;i++){const q=p[i],u=len?Math.max(0,Math.min(1,((q[0]-a[0])*dx+(q[1]-a[1])*dy)/len)):0,d=(q[0]-a[0]-u*dx)**2+(q[1]-a[1]-u*dy)**2;if(d>max){max=d;index=i;}}
 return max>t*t?[...simplify(p.slice(0,index+1),t).slice(0,-1),...simplify(p.slice(index),t)]:[a,b];
}
function line(points){
 // Average only along each chain to remove pixel-grid bumps, retaining endpoints.
 const smooth=points.map((p,i)=>i<2||i>=points.length-2?p:[0,1].map(k=>(points[i-2][k]+2*points[i-1][k]+3*p[k]+2*points[i+1][k]+points[i+2][k])/9));
 const p=simplify(smooth,.45),fmt=q=>q.map(v=>+v.toFixed(3)).join(' ');let d='M'+fmt(p[0]);
 for(let i=1;i<p.length;i++){
  const a=p[Math.max(0,i-2)],b=p[i-1],c=p[i],e=p[Math.min(p.length-1,i+1)];
  const c1=b.map((v,k)=>v+(c[k]-a[k])/6),c2=c.map((v,k)=>v-(e[k]-b[k])/6);
  d+=' C'+fmt(c1)+' '+fmt(c2)+' '+fmt(c);
 }
 return d;
}
potrace.trace(path.join(out,'solid-regions.png'),{threshold:128,turdSize:3,optTolerance:.25},(err,result)=>{
 if(err)throw err;
 const solids=[...result.matchAll(/<path d="([^"]+)"/g)].map(m=>m[1]);
 // Preserve source proportions. The tall scene fits within a modest unprinted margin.
 const scale=.45,dx=(576-1024*scale)/2,dy=(720-1536*scale)/2;
 const body=[...chains.map(line),...solids].map(d=>`<path d="${d}"/>`).join('');
 fs.writeFileSync(path.join(out,'source-lines.svg'),`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1536" viewBox="0 0 1024 1536"><rect width="1024" height="1536" fill="white"/><g fill="none" stroke="black" stroke-width="${3/scale}" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`);
 fs.writeFileSync(path.join(out,'source-lines.png'),new Resvg(fs.readFileSync(path.join(out,'source-lines.svg'))).render().asPng());
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="8in" height="10in" viewBox="0 0 576 720"><title>Axolotl kids canvas — border-free transfer</title><g transform="translate(${dx} ${dy}) scale(${scale})" fill="none" stroke="#000000" stroke-width="${3/scale}" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
 fs.writeFileSync(path.join(out,'axolotl-outline-8x10.svg'),svg);
 for(const [name,bg]of [['outline-preview.png','white'],['outline-transparent.png',undefined]])fs.writeFileSync(path.join(out,name),new Resvg(svg,{fitTo:{mode:'width',value:2400},background:bg}).render().asPng());
 fs.writeFileSync(path.join(root,'Axolotl/info/assets/geometry.json'),JSON.stringify({sourceSize:[1024,1536],scale,translate:[dx,dy],centerlinePaths:chains.map(line),solidBoundaryPaths:solids},null,2));
 console.log('Axolotl vector candidate built.');
});
