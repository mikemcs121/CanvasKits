const fs=require('fs'),crypto=require('crypto'),path=require('path'),vm=require('vm');
const src='C:/Users/mikem/.codex/sessions/2026/09/19/rollout-2026-09-19T15-58-35-01a0bb3f-cb47-72c2-993e-9c1699da6300.jsonl';
const raw=fs.readFileSync(src,'utf8');
const targets={
 '8ee7d70dd292d8507da00bc5147ccea085bf73b1e41bea074fa27e731ed03235':'Fox Fall/download.png',
 'dd9ae2a4e43f2086aeeeae0542a30c19bd0eb8d22cc44d5122f91a2acfa8ee31':'Ghost Fall/exec-8b4604c1-f90d-4ddd-959b-56e4dd2b270f.png',
 'c2405666e63782ab141c099676c662730aad23e61fe1bd1a7384a11fca629e4b':'Cat in Pumpkin/exec-01c35205-b359-4887-a7f9-a31e173a5e1f.png',
 '9145ea5e5dd21347feb775d0e89d0cffce4cf82010c2333b2ccfba7551f73167':'pumpkin/exec-dd3ad511-2377-40d8-bb15-dd9d9771fcbc.png'};
let found=new Set(),images=0,types={};
for(const m of raw.matchAll(/data:image\/\w+;base64,([A-Za-z0-9+/=]+)/g)){
 const b=Buffer.from(m[1],'base64'),hash=crypto.createHash('sha256').update(b).digest('hex');images++;
 if(targets[hash]&&!found.has(hash)){const dest=path.resolve(targets[hash]);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,b);found.add(hash);console.log('Recovered exact source: '+targets[hash]);}
}
const records=raw.split('\n').filter(Boolean).map(x=>{try{return JSON.parse(x)}catch{return {}}});
for(const r of records){const p=r.payload||{};const key=r.type+'/'+p.type;types[key]=(types[key]||0)+1;}
console.log(JSON.stringify({images,recovered:found.size,recordTypes:types}));
for(const r of records){const p=r.payload||{};if(p.type==='custom_tool_call')console.log('CALL '+JSON.stringify({name:p.name,keys:Object.keys(p),prefix:String(p.input).slice(0,130)}));}
