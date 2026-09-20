const fs=require('fs'),path=require('path'),zlib=require('zlib'),crypto=require('crypto');
const kits=require('./new-kits.cjs');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const expected=['8ee7d70dd292d8507da00bc5147ccea085bf73b1e41bea074fa27e731ed03235','dd9ae2a4e43f2086aeeeae0542a30c19bd0eb8d22cc44d5122f91a2acfa8ee31','c2405666e63782ab141c099676c662730aad23e61fe1bd1a7384a11fca629e4b','9145ea5e5dd21347feb775d0e89d0cffce4cf82010c2333b2ccfba7551f73167'];
function readSimplePng(p){const b=fs.readFileSync(p),w=b.readUInt32BE(16),h=b.readUInt32BE(20),parts=[];for(let o=8;o<b.length;){let len=b.readUInt32BE(o),type=b.toString('ascii',o+4,o+8);if(type==='IDAT')parts.push(b.subarray(o+8,o+8+len));o+=len+12;}const raw=zlib.inflateSync(Buffer.concat(parts)),a=Buffer.alloc(w*h*3);for(let y=0;y<h;y++){if(raw[y*(w*3+1)]!==0)throw Error('Unsupported filter');raw.copy(a,y*w*3,y*(w*3+1)+1,(y+1)*(w*3+1));}return{w,h,a};}
for(const [ki,k]of kits.entries()){
 const d=path.resolve(k.folder,'tmp/8x10-artwork'),plan=JSON.parse(fs.readFileSync(d+'/step-plan.json')),line=fs.readFileSync(d+'/line-mask.bin'),groups=fs.readFileSync(d+'/group-mask.bin');
 if(hash(path.resolve(k.folder,k.source))!==expected[ki])throw Error('Original changed '+k.folder);
 const checks=[];
 for(const s of plan.stages){const p=readSimplePng(d+'/step-'+s.number+'.png');let invalidLines=0,earlyColor=0;if(s.fullCanvas){if(p.w!==1254||p.h!==1254)throw Error('Wrong canonical dimensions');for(let i=0;i<line.length;i++){if(line[i]===0&&(p.a[i*3]||p.a[i*3+1]||p.a[i*3+2]))invalidLines++;if(s.number<k.steps.length&&line[i]===255&&s.whiteGroups.includes(plan.groupNames[groups[i]])&&(p.a[i*3]!==255||p.a[i*3+1]!==255||p.a[i*3+2]!==255))earlyColor++;}}if(invalidLines||earlyColor)throw Error('Stage failure '+k.folder+' '+s.number);checks.push({step:s.number,canonicalLinesPass:invalidLines===0,noPrematureColor:earlyColor===0,crop:s.crop});}
 if(hash(d+'/step-'+k.steps.length+'.png')!==hash(d+'/registered-reference.png'))throw Error('Final stage mismatch');
 const qa=JSON.parse(fs.readFileSync(d+'/layout-checks.json'));if(qa.cells.length!==k.steps.length||qa.cells.some(c=>c.captionOverflow>0||c.headingOverflow>0))throw Error('Layout failure');
 fs.writeFileSync(d+'/geometry-checks.json',JSON.stringify({originalRecoveredByteForByte:true,sourceSha256:expected[ki],stages:checks,finalStageExactlyMatchesReference:true},null,2));
 console.log(k.folder+': original hash, '+checks.length+' stage checks, final reference and layout passed');
}
