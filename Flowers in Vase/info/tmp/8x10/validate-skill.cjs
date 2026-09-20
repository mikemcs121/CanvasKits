const fs=require('fs');
const s=fs.readFileSync('.agents/skills/build-canvas/SKILL.md','utf8').replace(/\r/g,'');
const m=s.match(/^---\n([\s\S]*?)\n---/);if(!m)throw Error('frontmatter');
const fields=Object.fromEntries(m[1].split('\n').map(l=>{const p=l.indexOf(':');return[l.slice(0,p),l.slice(p+1).trim()]}));
if(Object.keys(fields).some(k=>!['name','description','license','allowed-tools','metadata'].includes(k)))throw Error('field');
if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fields.name)||fields.name.length>64)throw Error('name');
if(!fields.description||fields.description.length>1024||/[<>]/.test(fields.description)||s.includes('[TODO:'))throw Error('description');
for(const t of ['2400 x 3000','300-DPI','576 x 720','612 x 792','six files','output/pdf/8x10/'])if(!s.includes(t))throw Error(t);
console.log('Skill frontmatter and 8x10 deliverable checks passed. Node equivalent used because Python is unavailable.');
