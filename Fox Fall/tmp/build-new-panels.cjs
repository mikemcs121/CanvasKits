const fs=require('fs'),path=require('path');
const {bmp,segment,png}=require('./raster.cjs');
const kits=require('./new-kits.cjs');
const bases={orange:[239,117,24],ivory:[248,242,224],green:[62,103,40],gold:[238,179,40],leafOrange:[225,104,21],leafGold:[230,164,38],paws:[77,52,36],plum:[111,54,105],stem:[99,99,46],pink:[227,146,127],cat:[91,97,108],dark:[39,28,21],white:[255,255,255]};
function valid(g,r,v,b){let lo=Math.min(r,v,b),hi=Math.max(r,v,b);switch(g){case'orange':case'leafOrange':return r>135&&r>v*1.28&&v>b*1.3;case'ivory':return lo>120&&hi-lo<105;case'green':return v>r*1.02&&v>b*1.2;case'gold':case'leafGold':return r>150&&v>105&&v>b*1.3;case'paws':return r>v*1.02&&r>b*1.1&&r<145;case'plum':return r>v*1.15&&b>v*1.1&&r>60;case'stem':return r<190&&v<180&&v>b*1.2;case'pink':return r>150&&r>v*1.18&&v>b*.9;case'cat':return hi-lo<75&&hi>65&&hi<230;case'dark':return hi<95;default:return true;}}
function neighbors(i,w,h){let x=i%w,y=(i/w)|0;return[x?i-1:-1,x<w-1?i+1:-1,y?i-w:-1,y<h-1?i+w:-1];}
for(const k of kits){
 const d=path.resolve(k.folder,'tmp/8x10-artwork'),o=bmp(d+'/outline.bmp'),p=bmp(d+'/paint.bmp'),{w,h}=o,N=w*h,s=segment(o),names=['white',...Object.keys(k.groups)],rid={};
 for(const [g,ids]of Object.entries(k.groups))for(const id of ids)rid[id]=names.indexOf(g);
 const groups=new Uint8Array(N),line=Buffer.alloc(N),q=new Int32Array(N);
 for(let i=0;i<N;i++){
  const luminance=(o.a[i*3]+o.a[i*3+1]+o.a[i*3+2])/3;
  line[i]=Math.round(Math.max(0,Math.min(1,(luminance-45)/175))*255); // exact existing stroke locations, clean paper white
  if(s.labels[i]>0)groups[i]=rid[s.labels[i]]||0;
  const x=i%w,y=(i/w)|0,r=p.a[i*3],v=p.a[i*3+1],b=p.a[i*3+2];
  if(k.slug==='kat-in-pumpkin'&&s.labels[i]===2&&y<300&&r>145&&r>v*1.25&&v>b*.95)groups[i]=names.indexOf('pink');
  if(k.slug==='fox-fall'&&[2,4].includes(s.labels[i])&&y<200&&r<125&&r>v*1.05)groups[i]=names.indexOf('paws');
 }
 let head=0,tail=0;const nearest=new Int32Array(N);nearest.fill(-1);
 for(let i=0;i<N;i++)if(s.labels[i]>0&&valid(names[groups[i]],p.a[i*3],p.a[i*3+1],p.a[i*3+2])){nearest[i]=i;q[tail++]=i;}
 while(head<tail){const i=q[head++];for(const j of neighbors(i,w,h))if(j>=0&&nearest[j]<0&&groups[j]===groups[i]&&s.labels[j]===s.labels[i]){nearest[j]=nearest[i];q[tail++]=j;}}
 let final=Buffer.alloc(N*3),canonical=Buffer.alloc(N*3),fix=[];
 for(let i=0;i<N;i++){const g=names[groups[i]],j=nearest[i];for(let c=0;c<3;c++){canonical[i*3+c]=line[i];final[i*3+c]=g==='white'?255:j>=0?p.a[j*3+c]:bases[g][c];}if(j!==i&&s.labels[i]>0&&g!=='white')fix.push(i);}
 // Interpolate missing texture within canonical regions rather than propagating foreign contours.
 for(let iter=0;iter<18;iter++){let prev=Buffer.from(final);for(const i of fix){let ns=neighbors(i,w,h).filter(j=>j>=0&&s.labels[j]===s.labels[i]&&groups[j]===groups[i]);if(!ns.length)continue;for(let c=0;c<3;c++)final[i*3+c]=ns.reduce((sum,j)=>sum+prev[j*3+c],0)/ns.length;}}
 for(let i=0;i<N;i++)for(let c=0;c<3;c++)final[i*3+c]=Math.round(final[i*3+c]*line[i]/255);
 png(d+'/canonical-outline.png',w,h,canonical);png(d+'/registered-reference.png',w,h,final);
 const colors={},counts={};for(let i=0;i<N;i++)if(s.labels[i]>0&&groups[i]){const g=names[groups[i]];colors[g]??=[0,0,0];counts[g]=(counts[g]||0)+1;for(let c=0;c<3;c++)colors[g][c]+=final[i*3+c];}
 for(const g of Object.keys(colors))colors[g]=colors[g].map(x=>Math.round(x/counts[g]));
 const painted=new Set(),textured=new Set(),stageRecords=[];
 for(let sn=1;sn<=k.steps.length;sn++){
  const step=k.steps[sn-1];for(const op of step.paint){if(op.startsWith('texture:'))textured.add(op.slice(8));else painted.add(op);}
  const isDry=sn===k.steps.length;let a=Buffer.from(canonical);
  if(isDry)a=Buffer.from(final);else for(let i=0;i<N;i++){const g=names[groups[i]];if(!painted.has(g))continue;for(let c=0;c<3;c++)a[i*3+c]=textured.has(g)?final[i*3+c]:Math.round((colors[g]||bases[g])[c]*line[i]/255);}
  const crop=step.crop;if(crop){const[x0,y0,x1,y1]=crop,cw=x1-x0,ch=y1-y0,b=Buffer.alloc(cw*ch*3);for(let y=0;y<ch;y++)a.copy(b,y*cw*3,((y+y0)*w+x0)*3,((y+y0)*w+x1)*3);png(d+`/step-${sn}.png`,cw,ch,b);}else png(d+`/step-${sn}.png`,w,h,a);
  stageRecords.push({number:sn,heading:step.heading,caption:step.caption,fullCanvas:!crop,crop:crop||null,paintedGroups:[...painted],texturedGroups:[...textured],whiteGroups:names.filter(g=>g!=='white'&&!painted.has(g)),exactCanonicalLines:true});
 }
 fs.writeFileSync(d+'/group-mask.bin',groups);fs.writeFileSync(d+'/line-mask.bin',line);
 fs.writeFileSync(d+'/step-plan.json',JSON.stringify({...k,dimensions:[w,h],groupNames:names,materials:'Preprinted 8 x 10 canvas; acrylic paints; large and small brushes; water cup; paper towels; palette or paper plate.',stages:stageRecords},null,2));
 console.log(k.folder+': registered reference and '+k.steps.length+' stages ready');
}
