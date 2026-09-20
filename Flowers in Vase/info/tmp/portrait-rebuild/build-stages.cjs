const fs=require('fs'),path=require('path');
let project=__dirname;while(!fs.existsSync(path.join(project,'AGENTS.md'))){const parent=path.dirname(project);if(parent===project)throw Error('Project root not found');project=parent;}
const foxRoot=path.join(project,'Fox Fall'),foxWork=fs.existsSync(path.join(foxRoot,'info'))?path.join(foxRoot,'info'):foxRoot;
const Jimp=require(path.join(foxWork,'tmp','vector-tools','node_modules','jimp'));
const root=path.resolve(__dirname,'../..'),asset=path.join(root,'assets/portrait-rebuild');
const palette=[[255,255,255],[98,194,183],[69,112,58],[26,65,105],[244,239,224],[245,195,192],[246,166,79],[181,46,85],[235,187,51],[26,65,105]];
function good(r,g,b,k){switch(k){case 1:return g>r*1.12&&b>g*.7;case 2:return g>r*.78&&g>b*1.1&&r<240;case 3:return b>r*1.2&&b>g*1.05&&g<175;case 4:return r>135&&g>135&&b>115&&Math.abs(r-g)<38;case 5:return r>135&&r>=g*.98&&r>=b*.97&&b>g*.74;case 6:return r>135&&r>=g*.98&&g>=b;case 7:return r>g*1.45&&r>b*1.08;case 8:return r>g*.92&&g>b*1.23;case 9:return (b>r*1.15&&b>g*.99)||(r>170&&g>175&&b>175);}return true;}
(async()=>{
 const outline=await Jimp.read(path.join(asset,'outline-canonical-white.png')),raw=await Jimp.read(path.join(asset,'painting-normalized.png'));
 const w=outline.bitmap.width,h=outline.bitmap.height,n=w*h,source=raw.bitmap.data,line=outline.bitmap.data;
 const bin=fs.readFileSync(path.join(__dirname,'regions.bin')),ids=new Int32Array(n);for(let i=0;i<n;i++)ids[i]=bin.readInt32LE(8+i*4);
 const groups=fs.readFileSync(path.join(__dirname,'group-mask.bin')),done=new Uint8Array(n),repair=new Uint8Array(n),q=new Int32Array(n),rgb=Buffer.alloc(n*3);let head=0,tail=0;
 for(let i=0;i<n;i++){let k=groups[i],p=i*4;if(k&&good(source[p],source[p+1],source[p+2],k)){done[i]=1;q[tail++]=i;for(let c=0;c<3;c++)rgb[i*3+c]=source[p+c];}else repair[i]=1;}
 const adjacent=p=>{const x=p%w,y=(p/w)|0;return[x?p-1:-1,x<w-1?p+1:-1,y?p-w:-1,y<h-1?p+w:-1]};
 while(head<tail){const p=q[head++];for(const j of adjacent(p))if(j>=0&&!done[j]&&groups[j]===groups[p]){done[j]=1;q[tail++]=j;for(let c=0;c<3;c++)rgb[j*3+c]=rgb[p*3+c];}}
 // Tiny isolated regions use their group's base color only if no valid texture seed exists.
 for(let i=0;i<n;i++)if(groups[i]&&!done[i]){done[i]=1;for(let c=0;c<3;c++)rgb[i*3+c]=palette[groups[i]][c];}
 head=0;tail=0;for(let i=0;i<n;i++)if(done[i])q[tail++]=i;
 while(head<tail){const p=q[head++];for(const j of adjacent(p))if(j>=0&&!done[j]){done[j]=1;q[tail++]=j;for(let c=0;c<3;c++)rgb[j*3+c]=rgb[p*3+c];}}
 for(let pass=0;pass<18;pass++){const next=Buffer.from(rgb);for(let i=0;i<n;i++)if(repair[i]&&groups[i]){const ns=adjacent(i).filter(j=>j>=0&&groups[j]===groups[i]);if(ns.length)for(let c=0;c<3;c++){let sum=0;for(const j of ns)sum+=rgb[j*3+c];next[i*3+c]=Math.round(sum/ns.length);}}next.copy(rgb);}
 const soften=new Uint8Array(n);for(let i=0;i<n;i++)if(ids[i]===-1){const x=i%w,y=(i/w)|0,set=new Set();for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const xx=x+dx,yy=y+dy;if(xx>=0&&xx<w&&yy>=0&&yy<h){let k=groups[yy*w+xx];if(k)set.add(k);}}if(set.size===1){const k=[...set][0];soften[i]=k;if(good(source[i*4],source[i*4+1],source[i*4+2],k))for(let c=0;c<3;c++)rgb[i*3+c]=source[i*4+c];}}
 const painting=new Jimp(w,h,0xffffffff);for(let i=0;i<n;i++)for(let c=0;c<3;c++)painting.bitmap.data[i*4+c]=rgb[i*3+c];await painting.writeAsync(path.join(asset,'finished-reference-canonical.png'));
 const start=[99,2,3,4,4,5,6,7,8,11],texture=[99,2,10,10,10,9,9,9,11,11],checks=[];
 for(let s=1;s<=11;s++){const img=new Jimp(w,h,0xffffffff);let lineErrors=0,earlyColor=0;for(let i=0;i<n;i++){let k=groups[i],color=palette[0];if(k&&s>=start[k])color=s>=texture[k]?rgb.subarray(i*3,i*3+3):palette[k];if(ids[i]===-1){color=line.subarray(i*4,i*4+3);const sk=soften[i];if(s>=9&&sk&&s>=texture[sk])color=rgb.subarray(i*3,i*3+3);}for(let c=0;c<3;c++)img.bitmap.data[i*4+c]=color[c];if(s<=8&&ids[i]===-1)for(let c=0;c<3;c++)if(img.bitmap.data[i*4+c]!==line[i*4+c])lineErrors++;if(k&&s<start[k]&&img.bitmap.data[i*4]!==255)earlyColor++;}
 if(lineErrors||earlyColor)throw Error('Progression failed '+s);await img.writeAsync(path.join(asset,`stage-${String(s).padStart(2,'0')}.png`));checks.push({step:s,lineErrors,earlyColor});}
 fs.writeFileSync(path.join(__dirname,'stage-checks.json'),JSON.stringify(checks,null,2));console.log('Registered painting and 11 masked stages built; original line layer and unpainted regions verified.');
 const sheet=new Jimp(w*2,h,0xffffffff);sheet.composite(outline,0,0);sheet.composite(await Jimp.read(path.join(asset,'stage-06.png')),w,0);await sheet.resize(1120,700).writeAsync(path.join(__dirname,'geometry-review.png'));
 await painting.clone().resize(720,900).writeAsync(path.join(__dirname,'registered-painting-review.png'));
})().catch(e=>{console.error(e);process.exit(1)});
