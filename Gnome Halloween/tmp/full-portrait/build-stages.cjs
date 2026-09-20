const fs=require('fs'),path=require('path'),Jimp=require('../../../Fox Fall/tmp/vector-tools/node_modules/jimp');
const kit=path.resolve(__dirname,'../..'),asset=path.join(kit,'assets/full-portrait'),w=1200,h=1500,n=w*h;
// sky, ground, moon, bats, plum, orange, nose, shoes, beard, stems, buckle, carved faces.
const palette=[[255,255,255],[64,86,111],[111,77,45],[246,232,173],[28,27,28],[88,36,73],[195,90,34],[238,163,108],[104,63,33],[239,232,213],[112,101,40],[205,157,59],[24,24,25]];
const mapping={1:1,2:5,3:3,4:4,5:4,6:11,7:6,8:6,9:6,10:5,11:7,12:9,13:9,14:5,15:9,16:9,17:9,18:9,19:10,20:10,21:5,22:9,23:9,24:6,25:6,26:6,27:12,28:12,29:12,30:12,31:12,32:12,33:8,34:8,35:2,36:2};
function good(r,g,b,k){switch(k){case 1:return b>r*1.08&&g>r*.95&&b>g*.94;case 2:return r>g*1.05&&g>b*1.05;case 3:return r>160&&g>140&&b>65&&r>=g*.94&&g>b*.99;case 4:case 12:return Math.max(r,g,b)<100&&r>b*.9&&Math.max(r,g,b)-Math.min(r,g,b)<38;case 5:return r>g*1.15&&b>g*.9&&r>b*.7;case 6:return r>g*1.12&&g>b*1.1;case 7:return r>160&&g>95&&b>50&&r>g*1.1&&b>g*.35;case 8:return r>g*1.15&&g>b*1.1&&r<225;case 9:return r>125&&g>120&&b>100&&r>=g*.96&&b<g*1.12;case 10:return r>50&&g>40&&g>b*1.3&&r<g*1.75;case 11:return r>145&&r>g*.99&&g>b*1.2;}return false;}
(async()=>{
 const line=await Jimp.read(path.join(asset,'outline-canonical-white.png')),paint=await Jimp.read(path.join(asset,'painting-final-texture.png')).then(p=>p.resize(w,h)),raw=paint.bitmap.data,bin=fs.readFileSync(path.join(__dirname,'regions.bin')),ids=new Int32Array(n),groups=new Uint8Array(n),rgb=Buffer.alloc(n*3),samples=Buffer.alloc(n*3),done=new Uint8Array(n),repair=new Uint8Array(n),q=new Int32Array(n);
 for(let i=0;i<n;i++){ids[i]=bin.readInt32LE(8+i*4);let k=mapping[ids[i]]||0,x=i%w,y=(i/w)|0;if(k===1){const ground=x<300?1400-.068*x:x>900?1380+.068*(x-900):1380;if(y>ground)k=2;}groups[i]=k;}
 const adj=p=>{let x=p%w,y=(p/w)|0;return[x?p-1:-1,x<w-1?p+1:-1,y?p-w:-1,y<h-1?p+w:-1]};
 let mx0=w,my0=h,mx1=0,my1=0;for(let y=30;y<500;y++)for(let x=20;x<440;x++){const p=(y*w+x)*4;if(raw[p]>180&&raw[p+1]>160&&raw[p+2]>75&&raw[p]>raw[p+2]*1.08){mx0=Math.min(mx0,x);mx1=Math.max(mx1,x);my0=Math.min(my0,y);my1=Math.max(my1,y);}}
 let head=0,tail=0;for(let i=0;i<n;i++){const x=i%w,y=(i/w)|0,k=groups[i];let sx=x,sy=y;if(false){sx=mx0+(x-75)/270*(mx1-mx0);sy=my0+(y-65)/354*(my1-my0);} if(false){sx=848+(x-864)/285*312;sy=141+(y-159)/157*180;} if(false){sx=913+(x-943)/192*231;sy=404+(y-424)/106*144;}sx=Math.max(0,Math.min(w-1,Math.round(sx)));sy=Math.max(0,Math.min(h-1,Math.round(sy)));let p=(sy*w+sx)*4;let r=raw[p],g=raw[p+1],b=raw[p+2];
 // Reuse coherent blue-sky texture to remove the earlier generated moon position from the backdrop.
 if(k===1&&!good(r,g,b,k)){for(const shift of [[220,-140],[-220,120],[340,0],[-340,0],[0,-280],[0,260]]){let xx=(x+shift[0]+w)%w,yy=Math.max(0,Math.min(h-1,sy+shift[1])),z=(yy*w+xx)*4;if(good(raw[z],raw[z+1],raw[z+2],1)){r=raw[z];g=raw[z+1];b=raw[z+2];break;}}}
 if((ids[i]===12||ids[i]===13)&&y<800&&(r<185||g<170)){const z=(Math.min(h-1,y+42)*w+x)*4;if(good(raw[z],raw[z+1],raw[z+2],9)){r=raw[z];g=raw[z+1];b=raw[z+2];}} samples[i*3]=r;samples[i*3+1]=g;samples[i*3+2]=b;if(k&&good(r,g,b,k)){done[i]=1;q[tail++]=i;rgb[i*3]=r;rgb[i*3+1]=g;rgb[i*3+2]=b;}else repair[i]=1;}
 while(head<tail){const p=q[head++];for(const j of adj(p))if(j>=0&&!done[j]&&groups[j]===groups[p]){done[j]=1;q[tail++]=j;for(let c=0;c<3;c++)rgb[j*3+c]=rgb[p*3+c];}}
 for(let i=0;i<n;i++)if(groups[i]&&!done[i]){done[i]=1;for(let c=0;c<3;c++)rgb[i*3+c]=palette[groups[i]][c];}
 head=0;tail=0;for(let i=0;i<n;i++)if(done[i])q[tail++]=i;while(head<tail){const p=q[head++];for(const j of adj(p))if(j>=0&&!done[j]){done[j]=1;q[tail++]=j;for(let c=0;c<3;c++)rgb[j*3+c]=rgb[p*3+c];}}
 for(let pass=0;pass<18;pass++){const next=Buffer.from(rgb);for(let i=0;i<n;i++)if(repair[i]&&groups[i]){const ns=adj(i).filter(j=>j>=0&&groups[j]===groups[i]);if(ns.length)for(let c=0;c<3;c++){let sum=0;for(const j of ns)sum+=rgb[j*3+c];next[i*3+c]=Math.round(sum/ns.length);}}next.copy(rgb);}
 const soften=new Uint8Array(n);for(let i=0;i<n;i++)if(ids[i]===-1){let x=i%w,y=(i/w)|0,set=new Set();for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){let xx=x+dx,yy=y+dy;if(xx>=0&&xx<w&&yy>=0&&yy<h){let k=groups[yy*w+xx];if(k)set.add(k);}}if(set.size===1){let k=[...set][0];soften[i]=k;if(good(samples[i*3],samples[i*3+1],samples[i*3+2],k))for(let c=0;c<3;c++)rgb[i*3+c]=samples[i*3+c];}}
 for(let i=0;i<n;i++)if(groups[i]===4){const shade=Math.min(62,Math.round((rgb[i*3]+rgb[i*3+1]+rgb[i*3+2])/3*.75));rgb[i*3]=shade;rgb[i*3+1]=Math.round(shade*.94);rgb[i*3+2]=Math.round(shade*.89);} const reference=new Jimp(w,h,0xffffffff);for(let i=0;i<n;i++)for(let c=0;c<3;c++)reference.bitmap.data[i*4+c]=rgb[i*3+c];await reference.writeAsync(path.join(asset,'finished-reference-canonical.png'));await reference.clone().resize(720,900).writeAsync(path.join(__dirname,'registered-reference-review.png'));
 const start=[99,2,3,3,3,4,5,6,6,7,8,8,10],texture=[99,2,3,3,3,9,9,6,11,11,8,8,10],checks=[];
 for(let s=1;s<=11;s++){const stage=new Jimp(w,h,0xffffffff);let lines=0,early=0;for(let i=0;i<n;i++){const k=groups[i];let c=palette[0];if(k&&s>=start[k])c=s>=texture[k]?rgb.subarray(i*3,i*3+3):palette[k];if(k===9&&s>=7&&s<11)c=[Math.round(rgb[i*3]*.48+239*.52),Math.round(rgb[i*3+1]*.48+232*.52),Math.round(rgb[i*3+2]*.48+213*.52)];if(ids[i]===-1){c=line.bitmap.data.subarray(i*4,i*4+3);let sk=soften[i];if(s>=9&&sk&&s>=texture[sk])c=rgb.subarray(i*3,i*3+3);}for(let j=0;j<3;j++){stage.bitmap.data[i*4+j]=c[j];if(s<=8&&ids[i]===-1&&c[j]!==line.bitmap.data[i*4+j])lines++;if(k&&s<start[k]&&c[j]!==255)early++;}}
 if(lines||early)throw Error('Stage failure');await stage.writeAsync(path.join(asset,`stage-${String(s).padStart(2,'0')}.png`));checks.push({step:s,lineErrors:lines,prematureColorErrors:early});}
 fs.writeFileSync(path.join(__dirname,'group-mask.bin'),groups);fs.writeFileSync(path.join(__dirname,'stage-checks.json'),JSON.stringify(checks,null,2));const proof=new Jimp(w*2,h,0xffffffff);proof.composite(line,0,0);proof.composite(await Jimp.read(path.join(asset,'stage-06.png')),w,0);await proof.resize(960,600).writeAsync(path.join(__dirname,'geometry-review.png'));
 console.log('Registered reference and eleven stages complete; source lines and painting order verified.');
})().catch(e=>{console.error(e);process.exit(1)});







