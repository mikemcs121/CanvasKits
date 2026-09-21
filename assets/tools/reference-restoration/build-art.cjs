// Fixed-geometry restoration assembly. Never writes any outline or original file.
const fs=require('fs'),path=require('path'),zlib=require('zlib'),crypto=require('crypto');
const sharp=require('C:/Users/mmcsherry/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.resolve(__dirname,'../../..'),W=800,H=1000,N=W*H;
const kits=JSON.parse(fs.readFileSync(path.join(root,'assets/tools/reference-restoration/archive/shared-kits-before.json')));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const full=p=>path.join(root,p);
function pdfRGB(file,rgb){const im=zlib.deflateSync(rgb),c=Buffer.from('q\n576 0 0 720 0 0 cm\n/Im0 Do\nQ');const objs=[Buffer.from('<< /Type /Catalog /Pages 2 0 R >>'),Buffer.from('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),Buffer.from('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 576 720] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>'),Buffer.concat([Buffer.from(`<< /Type /XObject /Subtype /Image /Width 2400 /Height 3000 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length ${im.length} >>\nstream\n`),im,Buffer.from('\nendstream')]),Buffer.concat([Buffer.from(`<< /Length ${c.length} >>\nstream\n`),c,Buffer.from('\nendstream')])];let a=[Buffer.from('%PDF-1.4\n% Canvas reference\n')],n=a[0].length,offsets=[];objs.forEach((o,i)=>{offsets.push(n);const b=Buffer.concat([Buffer.from(`${i+1} 0 obj\n`),o,Buffer.from('\nendobj\n')]);a.push(b);n+=b.length});a.push(Buffer.from(`xref\n0 6\n0000000000 65535 f \n${offsets.map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${n}\n%%EOF`));fs.writeFileSync(file,Buffer.concat(a));}
async function christmas(k,src){
 const f=full(k.folder),d=f+'/info/tmp/reference-restoration',a=f+'/info/assets/reference-restoration';
 const rgb=await sharp(src).resize(2400,3000,{fit:'fill',kernel:'lanczos3'}).removeAlpha().raw().toBuffer();
 const regions=JSON.parse(fs.readFileSync(f+'/info/tmp/organization/regions.json'));
 const detections=JSON.parse(fs.readFileSync(d+'/detected-bulbs.json')).filter(r=>r.n<2000);
 const ids=[10,17,18,19,22,29,31,35,38,41,49,52],controls=[];
 for(const id of ids){const r=regions.find(r=>r.id===id),tx=(r.x0+r.x1)/2,ty=(r.y0+r.y1)/2;const s=detections.map(s=>({...s,dist:Math.hypot(tx-s.cx,ty-s.cy)})).sort((a,b)=>a.dist-b.dist)[0];const tr=Math.max(r.x1-r.x0,r.y1-r.y0)/2+4,sr=Math.max(s.x1-s.x0,s.y1-s.y0)/2;controls.push({id,tx:tx*3,ty:ty*3,sx:s.cx*3,sy:s.cy*3,tr:tr*3,scale:sr/tr});}
 const out=Buffer.from(rgb),bilinear=(x,y,c)=>{x=Math.max(0,Math.min(2398.999,x));y=Math.max(0,Math.min(2998.999,y));const X=x|0,Y=y|0,u=x-X,v=y-Y,i=(Y*2400+X)*3+c;return rgb[i]*(1-u)*(1-v)+rgb[i+3]*u*(1-v)+rgb[i+7200]*(1-u)*v+rgb[i+7203]*u*v;};
 // Smooth, interpolating displacement instead of compact per-bulb warps, which pinched
 // nearby red strokes. Fixed anchors keep the nose, beard and hat perimeter in place.
 const nodes=[];for(const c of controls){const x=c.tx/3,y=c.ty/3,dx=(c.sx-c.tx)/3,dy=(c.sy-c.ty)/3,r=c.tr/3+2,scale=(c.scale*c.tr/3)/r;nodes.push({x,y,dx,dy});for(const [u,v] of [[r*.7,0],[-r*.7,0],[0,r*.7],[0,-r*.7]])nodes.push({x:x+u,y:y+v,dx:dx+u*(scale-1),dy:dy+v*(scale-1)});}
 for(const [x,y] of [[150,330],[600,330],[150,450],[600,450],[150,610],[600,610],[200,300],[300,300],[400,300],[500,300],[200,630],[300,630],[400,630],[500,630],[388,515],[337,515],[440,515],[265,360],[529,410],[190,560],[570,555]])nodes.push({x,y,dx:0,dy:0});
 const phi=(x,y,n)=>{const r=Math.hypot(x-n.x,y-n.y)/110;return r>=1?0:(1-r)**4*(4*r+1);};
 function solve(axis){const m=nodes.map((n,i)=>[...nodes.map((v,j)=>phi(n.x,n.y,v)+(i===j?1e-8:0)),n[axis]]),n=m.length;for(let i=0;i<n;i++){let p=i;for(let j=i+1;j<n;j++)if(Math.abs(m[j][i])>Math.abs(m[p][i]))p=j;[m[p],m[i]]=[m[i],m[p]];const q=m[i][i];for(let j=i;j<=n;j++)m[i][j]/=q;for(let r=0;r<n;r++)if(r!==i){const v=m[r][i];for(let j=i;j<=n;j++)m[r][j]-=v*m[i][j];}}return m.map(r=>r[n]);}
 const coeffX=solve('dx'),coeffY=solve('dy'),field=(x,y)=>{let dx=0,dy=0;for(let j=0;j<nodes.length;j++){const w=phi(x,y,nodes[j]);dx+=w*coeffX[j];dy+=w*coeffY[j];}return[dx,dy];};
 let minJacobian=1;for(let y=280;y<660;y+=3)for(let x=120;x<640;x+=3){const f0=field(x,y),fx=field(x+1,y),fy=field(x,y+1);const det=(1+fx[0]-f0[0])*(1+fy[1]-f0[1])-(fx[1]-f0[1])*(fy[0]-f0[0]);minJacobian=Math.min(minJacobian,det);}if(minJacobian<.15)throw Error('Registration warp folds: '+minJacobian);
 for(let y=750;y<2010;y++)for(let x=300;x<1950;x++){const[dx,dy]=field(x/3,y/3),i=(y*2400+x)*3;for(let c=0;c<3;c++)out[i+c]=bilinear(x+dx*3,y+dy*3,c);}
 // Restore missing distant tree only inside a private mask copied from fixed transfer paths.
 const svg=fs.readFileSync(f+'/'+k.slug+'-outline-8x10.svg','utf8'),paths=[...svg.matchAll(/<path d="([^"]+)"/g)].map(m=>m[1]);
 const treeD=paths[57]+' '+paths[74].replace(/^M 2219 1726/,'L 2219 1726')+' L 2394 2720 L 2400 2730 L 2400 1610 L 2382 1560 Z';
 const mask=await sharp(Buffer.from(`<svg width="2400" height="3000" xmlns="http://www.w3.org/2000/svg"><path d="${treeD}" fill="white"/></svg>`)).ensureAlpha().raw().toBuffer();
 const patch=await sharp(a+'/tree-detail-candidate.png').resize(660,1830,{fit:'fill'}).removeAlpha().raw().toBuffer();
 for(let y=900;y<2730;y++)for(let x=1740;x<2400;x++){const i=y*2400+x,alpha=mask[i*4+3]/255;if(!alpha)continue;const py=Math.max(0,Math.min(1829,y-900-8)),pi=(py*660+x-1740)*3;for(let c=0;c<3;c++)out[i*3+c]=out[i*3+c]*(1-alpha)+patch[pi+c]*alpha;}
 fs.writeFileSync(d+'/christmas-geometry-repairs.json',JSON.stringify({method:'Smooth Wendland RBF center/rim registration with fixed perimeter/face anchors',minimumSampledJacobian:minJacobian,bulbControlsAt2400:controls,treeMaskSourcePaths:[57,74],treePatchSource:'tree-detail-candidate.png',privateMaskOnly:true},null,2));
 await sharp(mask,{raw:{width:2400,height:3000,channels:4}}).png().toFile(a+'/distant-tree-mask.png');
 return out;
}
function classify(r,g,b,fall){if(r>170&&g>165&&b>150)return'ivory';if(r>170&&g>120&&b>75&&r>g*1.09)return'skin';if(r>140&&r>g*1.9)return'red';if(r>155&&g>145&&b<110)return'gold';if(r>140&&r>g*1.2&&g>b*1.5)return'orange';if(g>r*1.12&&b>r*1.15)return fall?'sky':'blue';if(g>r*.8&&g>b*1.05)return'green';if(r>g*1.1&&r>b*1.15)return'brown';return'dark';}
function ownerMap(labels,regions,min=30){const own=new Int32Array(N),q=new Int32Array(N);let h=0,t=0;for(let i=0;i<N;i++)if(labels[i]>0&&regions[labels[i]-1].count>=min){own[i]=labels[i];q[t++]=i;}while(h<t){const i=q[h++],x=i%W;for(const j of[x?i-1:-1,x<W-1?i+1:-1,i-W,i+W])if(j>=0&&j<N&&!own[j]){own[j]=own[i];q[t++]=j;}}return own;}
function gnomeGroups(k,labels,regions,src){const fall=k.slug==='gnome-fall',groups={},votes={};for(let i=0;i<N;i++)if(labels[i]>0){let id=labels[i],g=classify(...src.subarray(i*3,i*3+3),fall);(votes[id]??={})[g]=(votes[id][g]||0)+1;}for(const r of regions)groups[r.id]=Object.entries(votes[r.id]||{}).sort((a,b)=>b[1]-a[1])[0]?.[0]||'dark';const set=(g,ids)=>ids.forEach(id=>groups[id]=g);
 if(fall){set('sky',[1,3,5,8,10,11,124,120]);set('brown',[4,54,101]);set('red',[157,178,205,222,271,259,277,236]);set('ivory',[251,253,341,335]);set('skin',[238,310,314,319,313]);set('green',[283,287]);set('boots',[358,361,416,417,336,337]);set('orange',[280,329,325,355,356,352,339,371,378,373,377,381,368,366,363,338,395,400,418,397,402,401,398,419,403,396]);set('brown',[297,309,315,323]);for(const r of regions){if(r.cy>865&&!['orange','boots'].includes(groups[r.id]))groups[r.id]=(r.count>180&&r.cx>25&&r.cx<775)?'goldLeaves':'greenGround';else if(r.cy<600&&r.count<1700&&groups[r.id]==='gold')groups[r.id]='goldLeaves';}for(const r of regions)if(groups[r.id]==='red'&&![157,178,205,222,236,271,259,277].includes(r.id))groups[r.id]='orange';set('greenGround',[423]);for(const r of regions)if(r.cx>113&&r.cx<207&&r.cy>90&&r.cy<304||r.cx>593&&r.cx<687&&r.cy>84&&r.cy<288)groups[r.id]='dark';set('sky',[124,120]);set('gold',[162,163,164,171,172,173,175,177,179,181]);}
 else{set('sky',[1]);set('red',[2,14,20,21,26,30,41,61,64]);set('green',[5,6,7,8]);set('ivory',[4,45,57]);set('skin',[34]);set('brown',[69,71]);set('gold',[10,17,18,19,22,29,31,35,38,41,49,52]);set('blue',[13,24,33,36,40,54,56,59,60,65,67]);set('treeGold',[13,33,40,59]);}
 return groups;
}
const defs={
 'gnome-fall':{candidate:'candidate-01.png',old:'organization',sequence:[[],['sky'],['brown','greenGround'],['red'],['green','boots'],['orange','goldLeaves'],['skin','ivory'],['dark','gold']],crops:{9:[230,140,370,340],10:[260,700,330,265],11:[230,420,370,300]}},
 'gnome-christmas-tree':{candidate:'candidate-02.png',old:'organization',sequence:[[],['sky','snow'],['green'],['red'],['skin','brown'],['ivory'],[],['gold','dark'],['blue','treeGold']],crops:{7:[280,85,270,350],9:[15,440,210,320],10:[0,820,230,180],11:[470,135,130,150]}},
 'fall-view':{candidate:'candidate-02.png',old:'organization-repair',sequence:[[],['sky'],['cloud','sun'],['ridge'],['forest'],['rock'],['trunk'],['foliage'],['fallen']],crops:{9:[220,0,540,420],10:[580,410,220,450],11:[0,765,800,235]}},
 'starry-night-sunflower':{candidate:'candidate-02.png',old:'organization-repair',sequence:[[],['sky'],[],['star'],['petals'],[],['green'],['seed']],crops:{9:[0,510,340,490],10:[270,320,340,295],11:[160,160,270,220]}}
};
const base={sky:[28,75,139],cloud:[250,194,131],sun:[255,239,151],ridge:[51,109,151],forest:[26,67,71],trunk:[70,48,31],rock:[78,74,74],foliage:[190,81,29],fallen:[233,138,35],petals:[247,181,35],green:[38,91,62],seed:[64,41,24],star:[252,230,148]};
(async()=>{const plans=[];for(const k of kits){const def=defs[k.slug];if(!def||process.argv[2]&&process.argv[2]!==k.slug)continue;const f=full(k.folder),a=f+'/info/assets/reference-restoration',d=f+'/info/tmp/reference-restoration',old=f+'/info/tmp/'+def.old,src=a+'/'+def.candidate;
 let rgb=k.slug==='gnome-christmas-tree'?await christmas(k,src):await sharp(src).resize(2400,3000,{fit:'fill',kernel:'lanczos3'}).removeAlpha().raw().toBuffer();
 const master=a+'/restored-master.png';await sharp(rgb,{raw:{width:2400,height:3000,channels:3}}).withMetadata({density:300}).png().toFile(master);
 await sharp(master).resize(1000).jpeg({quality:95}).toFile(d+'/restored-preview.jpg');
 pdfRGB(d+'/'+k.slug+'-finished-reference-8x10.pdf',rgb);
 const low=await sharp(master).resize(W,H,{fit:'fill'}).removeAlpha().raw().toBuffer(),bb=fs.readFileSync(old+'/labels.bin'),labels=new Int32Array(bb.buffer,bb.byteOffset,bb.length/4),regions=JSON.parse(fs.readFileSync(old+'/regions.json')),own=ownerMap(labels,regions,k.slug.startsWith('gnome')?25:60),groups=k.slug.startsWith('gnome')?gnomeGroups(k,labels,regions,low):JSON.parse(fs.readFileSync(old+'/group-assignments.json'));
 if(k.slug==='starry-night-sunflower')groups[64]='star'; // Right-edge star was incorrectly labeled green by the historical color-vote builder.
 const map=Array.from(own,id=>groups[id]);for(let i=0;i<N;i++){let x=i%800,y=i/800|0,[r,g,b]=low.subarray(i*3,i*3+3);
  if(k.slug==='gnome-fall'){
   if(own[i]===8&&y>345&&y<418&&x>270&&x<530&&classify(r,g,b,true)==='red')map[i]='red';
   // Single-line twigs/chains and narrow painted edge strokes are not closed flood-fill regions.
   // Assign their actual canonical-master pixels to the correct later painting operation.
   if(map[i]==='sky'){
    const lantern=(x>108&&x<217&&y>48&&y<317)||(x>590&&x<698&&y>44&&y<307);
    if(lantern&&r<100&&g<105&&b<95)map[i]='dark';
    else if(r>95&&r>g*1.45&&g>b*1.25)map[i]=(x>205&&x<600&&y<510)?'red':'orange';
    else if(r<175&&g<135&&r>g*1.07&&g>b*1.12)map[i]=y>650&&x>200&&x<600?'boots':'brown';
    else if(g>r*.85&&g>b*1.18&&g<135)map[i]=x>210&&x<595&&y>450&&y<700?'green':y>650?'greenGround':'sky';
   }
   if(map[i]==='brown'&&x>205&&x<590&&y>665&&y<800)map[i]='boots';
   if(map[i]==='greenGround'&&r>125&&r>g*1.28&&g>b*1.2)map[i]='goldLeaves';
  }
  if(k.slug==='gnome-christmas-tree'){if(own[i]===1&&y>865)map[i]='snow';else if(map[i]==='sky'&&g>r*.85&&g>b*1.05&&g<155)map[i]='green';}
 }
 const treeMask=k.slug==='gnome-christmas-tree'?await sharp(a+'/distant-tree-mask.png').resize(W,H).ensureAlpha().raw().toBuffer():null;if(treeMask)for(let i=0;i<N;i++)if(treeMask[i*4+3]>127)map[i]='green';
 const line=await sharp(f+'/'+k.slug+'-outline-8x10.svg').resize(2400,3000,{fit:'fill'}).ensureAlpha().raw().toBuffer();
 const active=new Set(),records=[];for(let step=1;step<=11;step++){
  (def.sequence[step-1]||[]).forEach(g=>active.add(g));if((step>=9&&k.slug.startsWith('gnome'))||(step>=8&&k.slug==='gnome-fall'))new Set(map).forEach(g=>active.add(g));
  const reveal=Buffer.alloc(N),style=Buffer.alloc(N);for(let i=0;i<N;i++){const g=map[i];reveal[i]=active.has(g)?255:0;let flat=false;
   if(k.slug==='starry-night-sunflower')flat=g==='sky'&&step===2||g==='petals'&&step===5||g==='seed'&&step<11||g==='green'&&step<9;
   if(k.slug==='fall-view')flat=['rock','trunk'].includes(g)&&step<9;
   style[i]=flat?255:0;
  }
  // Small safety inset prevents a future object's brush-edge color leaking into an earlier stage.
  for(let pass=0;pass<2;pass++){const prev=Buffer.from(reveal);for(let y=1;y<999;y++)for(let x=1;x<799;x++){const i=y*800+x;if(prev[i]&&(!prev[i-1]||!prev[i+1]||!prev[i-800]||!prev[i+800]))reveal[i]=0;}}
  const alpha=await sharp(reveal,{raw:{width:W,height:H,channels:1}}).resize(2400,3000,{kernel:'cubic'}).greyscale().raw().toBuffer();
  const out=Buffer.alloc(rgb.length,255);let whiteCoreErrors=0;for(let y=0;y<3000;y++)for(let x=0;x<2400;x++){let i=y*2400+x,j=(Math.floor(y/3)*800+Math.floor(x/3)),al=alpha[i]/255,g=map[j];for(let c=0;c<3;c++){let paint=style[j]?(base[g]||[255,255,255])[c]:rgb[i*3+c];out[i*3+c]=Math.round(255*(1-al)+paint*al);}
   if(k.slug==='gnome-fall'&&step<8&&g==='sky'&&al>0){const R=rgb[i*3],G=rgb[i*3+1],B=rgb[i*3+2];if(R>G*.75&&G>B*1.1){const lum=(R+G+B)/3;const c=[Math.max(22,lum*.30),Math.min(205,lum*.78+28),Math.min(215,lum*.86+32)];for(let z=0;z<3;z++)out[i*3+z]=255*(1-al)+c[z]*al;}}
   if(k.slug==='starry-night-sunflower'&&step<7&&g==='sky'&&al>0&&!style[j]){const R=rgb[i*3],G=rgb[i*3+1],B=rgb[i*3+2];if(G>R*1.02&&G>B*1.1){const lum=(R+G+B)/3,c=[Math.max(16,lum*.32),Math.min(170,lum*.75),Math.min(225,lum*1.4)];for(let z=0;z<3;z++)out[i*3+z]=255*(1-al)+c[z]*al;}}
   // Only unrevealed regions retain gray transfer lines; do not draw a heavy overlay over paint.
   const la=line[i*4+3]/255*(1-al);if(la)for(let c=0;c<3;c++)out[i*3+c]=out[i*3+c]*(1-la)+line[i*4+c]*la;
   if(alpha[i]===0&&line[i*4+3]===0&&(out[i*3]!==255||out[i*3+1]!==255||out[i*3+2]!==255))whiteCoreErrors++;
  }
  const rawFull=sharp(out,{raw:{width:2400,height:3000,channels:3}});let crop=def.crops[step];const file=a+'/step-'+String(step).padStart(2,'0')+'.png';
  if(crop)rawFull.extract({left:crop[0]*3,top:crop[1]*3,width:crop[2]*3,height:crop[3]*3});await rawFull.withMetadata({density:300}).png().toFile(file);
  k.steps[step-1].image=path.relative(root,file).replaceAll('\\','/');k.steps[step-1].detail=!!crop;records.push({step,painted:[...active],cropAt2400:crop?crop.map(v=>v*3):null,unpaintedCoreErrors:whiteCoreErrors});
 }
 k.reference=path.relative(root,master).replaceAll('\\','/');k.work=k.folder+'/info/tmp/reference-restoration';
 // Explicit missing fine details now illustrated and mentioned without changing paint supplies.
 if(k.slug==='gnome-fall')k.steps[7].caption='Paint frames, chains and rings black + a little brown. Use yellow in the glass; add white to yellow for flames and a soft glow.';
 if(k.slug==='gnome-christmas-tree')k.steps[2].caption='Paint trees green; keep lights white. Mix green + blue + white for the small distant tree. Use downward strokes; add green + yellow highlights.';
 if(k.slug==='gnome-christmas-tree'){k.steps[10].heading='Refine the pom-pom';k.steps[10].caption='Dab white over the pom-pom\'s blue shadows. Let dry before fixing edges. Add a few white snow dots to the hat if you like.';}
 fs.writeFileSync(d+'/guide-plan.json',JSON.stringify(k,null,2));fs.writeFileSync(d+'/stage-checks.json',JSON.stringify({outlineHash:hash(f+'/'+k.slug+'-outline-8x10.svg'),masterHash:hash(master),nativeCandidateSize:await sharp(src).metadata(),printSize:[2400,3000],resampling:'Lanczos3 from built-in generated native image; no claim of native 300-DPI new detail',maskSource:old+'/labels.bin',records},null,2));fs.writeFileSync(d+'/paint-group-map.json',JSON.stringify(groups,null,2));plans.push(k);console.log(k.slug+': reference and 11 dependent images staged');
 }
 const allPlans=kits.filter(k=>defs[k.slug]).map(k=>plans.find(p=>p.slug===k.slug)||JSON.parse(fs.readFileSync(full(k.folder+'/info/tmp/reference-restoration/guide-plan.json'))));
 fs.writeFileSync(full('assets/tools/reference-restoration/restored-kits.json'),JSON.stringify(allPlans,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
