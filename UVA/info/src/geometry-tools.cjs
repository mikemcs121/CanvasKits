const W=1000,H=800;
function clean(labels,minSize=30){
 for(let pass=0;pass<2;pass++){
  const seen=new Uint8Array(W*H);
  for(let i=0;i<labels.length;i++)if(!seen[i]){
   const old=labels[i],q=[i],neighbors=new Map();seen[i]=1;
   for(let n=0;n<q.length;n++){const p=q[n],x=p%W,y=(p/W)|0;
    for(const j of [x?p-1:-1,x<W-1?p+1:-1,y?p-W:-1,y<H-1?p+W:-1])if(j>=0){if(labels[j]===old){if(!seen[j]){seen[j]=1;q.push(j);}}else neighbors.set(labels[j],(neighbors.get(labels[j])||0)+1);}
   }
   const limit=old>=4?4:minSize;
   if(q.length<limit&&neighbors.size){const next=[...neighbors].sort((a,b)=>b[1]-a[1])[0][0];for(const p of q)labels[p]=next;}
  }
 }
 return labels;
}
function simplify(p,t=4.5){if(p.length<=2)return p;const a=p[0],b=p.at(-1),dx=b[0]-a[0],dy=b[1]-a[1],len=dx*dx+dy*dy;let m=-1,ix=0;for(let i=1;i<p.length-1;i++){const v=p[i],u=len?Math.max(0,Math.min(1,((v[0]-a[0])*dx+(v[1]-a[1])*dy)/len)):0,d=(v[0]-a[0]-u*dx)**2+(v[1]-a[1]-u*dy)**2;if(d>m){m=d;ix=i;}}return m>t*t?[...simplify(p.slice(0,ix+1),t).slice(0,-1),...simplify(p.slice(ix),t)]:[a,b];}
function boundaries(labels){
 const nodes=new Map(),edges=[],key=(x,y)=>y*(W+1)+x,xy=k=>[k%(W+1),Math.floor(k/(W+1))];
 function edge(a,b,pair){let id=edges.length;edges.push({a,b,pair});for(const n of [a,b]){if(!nodes.has(n))nodes.set(n,[]);nodes.get(n).push(id);}}
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(x<W-1&&labels[i]!==labels[i+1])edge(key(x+1,y),key(x+1,y+1),[labels[i],labels[i+1]].sort());if(y<H-1&&labels[i]!==labels[i+W])edge(key(x,y+1),key(x+1,y+1),[labels[i],labels[i+W]].sort());}
 const used=new Set(),chains=[];
 function walk(start,id){const pts=[xy(start)],pair=edges[id].pair;let n=start;while(!used.has(id)){used.add(id);const e=edges[id];n=e.a===n?e.b:e.a;pts.push(xy(n));if(n===start||nodes.get(n).length!==2)break;id=nodes.get(n).find(i=>!used.has(i));if(id===undefined)break;}if(pts.length>2)chains.push({pts,pair});}
 for(const [n,ids]of nodes)if(ids.length!==2)for(const id of ids)if(!used.has(id))walk(n,id);
 for(let id=0;id<edges.length;id++)if(!used.has(id))walk(edges[id].a,id);
 return chains.map(({pts,pair})=>{const p=simplify(pts);let d='M'+p[0].join(' ');for(let i=1;i<p.length-1;i++){
  const a=p[i-1],b=p[i],c=p[i+1],ux=b[0]-a[0],uy=b[1]-a[1],vx=c[0]-b[0],vy=c[1]-b[1],cos=(ux*vx+uy*vy)/(Math.hypot(ux,uy)*Math.hypot(vx,vy));
  d+=cos<.92?' L'+b.join(' '):' Q'+b.join(' ')+' '+[(b[0]+c[0])/2,(b[1]+c[1])/2].join(' ');
 }return {d:d+' L'+p.at(-1).join(' '),pair,pts:p,ends:[pts[0],pts.at(-1)]};});
}

module.exports={clean,boundaries};
