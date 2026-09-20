const fs=require('fs'),path=require('path');
const log='C:/Users/mikem/.codex/sessions/2026/09/19/rollout-2026-09-19T15-58-35-01a0bb3f-cb47-72c2-993e-9c1699da6300.jsonl';
for(const line of fs.readFileSync(log,'utf8').split('\n')){
 let p;try{p=JSON.parse(line).payload}catch{continue}
 if(p?.type!=='custom_tool_call'||p.name!=='exec')continue;
 for(const match of p.input.matchAll(/tools\.apply_patch\(("(?:\\.|[^"\\])*")\)/g)){
  const patch=JSON.parse(match[1]);
  for(const block of patch.split(/(?=^\*\*\* (?:Add|Update) File: )/m).slice(1)){
   const lines=block.split('\n'),head=lines.shift(),m=head.match(/^\*\*\* (Add|Update) File: (.+)$/);if(!m)continue;
   const dest=m[2];if(!/^C:\/Projects\/Canvas Kits\/(Fox Fall|Ghost Fall|Cat in Pumpkin|pumpkin)\/tmp\//i.test(dest)||dest.includes('/recover-'))continue;
   fs.mkdirSync(path.dirname(dest),{recursive:true});
   if(m[1]==='Add'){fs.writeFileSync(dest,lines.filter(l=>l.startsWith('+')).map(l=>l.slice(1)).join('\n')+'\n');}
   else if(fs.existsSync(dest)){let content=fs.readFileSync(dest,'utf8');for(const hunk of lines.join('\n').split(/^@@.*$/m).slice(1)){
    const ls=hunk.split('\n').filter(l=>l.length&&[' ','+','-'].includes(l[0]));const before=ls.filter(l=>l[0]!=='+').map(l=>l.slice(1)).join('\n');const after=ls.filter(l=>l[0]!=='-').map(l=>l.slice(1)).join('\n');if(before&&!content.includes(before))throw Error('Patch context missing '+dest);content=content.replace(before,after);
   }fs.writeFileSync(dest,content);}
   console.log('Recovered build file: '+path.basename(dest));
  }
 }
}
