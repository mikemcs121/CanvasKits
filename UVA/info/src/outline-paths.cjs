// Export real visible mountain segments, avoiding SVG clipping interoperability.
// Geometry remains in the canonical 1000 x 800 coordinate system.
function contours(d) {
 const tokens=d.match(/[MLQHVZ]|[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi), loops=[];
 let i=0,p=[0,0],start,loop;
 const point=()=>[+tokens[i++],+tokens[i++]];
 function quad(a,b,c) {
  const dx=c[0]-a[0],dy=c[1]-a[1];
  const distance=Math.abs(dx*(a[1]-b[1])-(a[0]-b[0])*dy)/(Math.hypot(dx,dy)||1);
  if(distance<=.002){loop.push(c);return;}
  const ab=a.map((v,k)=>(v+b[k])/2),bc=b.map((v,k)=>(v+c[k])/2),m=ab.map((v,k)=>(v+bc[k])/2);
  quad(a,ab,m);quad(m,bc,c);
 }
 while(i<tokens.length){
  const command=tokens[i++];
  if(command==='M'){p=point();start=p;loop=[p];loops.push(loop);}
  else if(command==='L'){p=point();loop.push(p);}
  else if(command==='H'){p=[+tokens[i++],p[1]];loop.push(p);}
  else if(command==='V'){p=[p[0],+tokens[i++]];loop.push(p);}
  else if(command==='Q'){const b=point(),c=point();quad(p,b,c);p=c;}
  else if(command==='Z'){loop.push(start);p=start;}
  else throw Error('Unsupported canonical path command: '+command);
 }
 return loops;
}
const cross=(a,b)=>a[0]*b[1]-a[1]*b[0],sub=(a,b)=>a.map((v,k)=>v-b[k]);
function visibleRidges(g){
 const loops=contours(g.silhouette),edges=loops.flatMap(loop=>loop.slice(1).map((p,i)=>[loop[i],p]));
 function inside(p){let yes=false;for(const [a,b]of edges)if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])yes=!yes;return yes;}
 const fmt=p=>p.map(v=>+v.toFixed(6)).join(' ');
 return g.ridges.map(r=>{
  const points=contours(r.seam)[0];let d='',last=null;
  for(let i=1;i<points.length;i++){
   const a=points[i-1],b=points[i],v=sub(b,a),cuts=[0,1],at=t=>a.map((n,k)=>n+v[k]*t);
   for(const [c,e]of edges){const w=sub(e,c),den=cross(v,w);if(Math.abs(den)<1e-12)continue;const ca=sub(c,a),t=cross(ca,w)/den,u=cross(ca,v)/den;if(t>0&&t<1&&u>=0&&u<=1)cuts.push(t);}
   cuts.sort((a,b)=>a-b);
   for(let j=1;j<cuts.length;j++){
    const lo=cuts[j-1],hi=cuts[j];if(hi-lo<1e-10)continue;
    if(inside(at((lo+hi)/2))){last=null;continue;}
    const from=at(lo),to=at(hi);
    if(!last||Math.hypot(...sub(from,last))>1e-5)d+='M'+fmt(from);
    d+=' L'+fmt(to);last=to;
   }
  }
  return d;
 });
}
function outline(g){
 const mountains=visibleRidges(g).map(d=>`<path d="${d}"/>`).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" width="10in" height="8in" viewBox="0 0 720 576"><title>UVA Sunset — 10 by 8 inch landscape transfer</title><path id="canvas-size-10x8-inches" d="M0 0H720V576H0Z" fill="none" stroke="none"/><g transform="scale(.72)" fill="none" stroke="#A6A6A6" stroke-width="${2/.72}" stroke-linecap="round" stroke-linejoin="round"><g id="visible-mountains">${mountains}</g><g id="uva-emblem">${g.lines.map(l=>`<path d="${l.d}"/>`).join('')}</g></g></svg>`;
}
module.exports={outline,visibleRidges,contours};
