// Equivalent checks for this skill's simple scalar YAML frontmatter.
// The bundled Python validator could not run because Python is not installed.
const fs=require('fs'),path=require('path');
const file=path.resolve(__dirname,'../../../.agents/skills/build-canvas/SKILL.md');
const s=fs.readFileSync(file,'utf8').replace(/\r/g,'');
const m=s.match(/^---\n([\s\S]*?)\n---/);if(!m)throw Error('Missing frontmatter');
const fields=Object.fromEntries(m[1].split('\n').map(line=>{const i=line.indexOf(':');return [line.slice(0,i),line.slice(i+1).trim()]}));
for(const k of Object.keys(fields))if(!['name','description','license','allowed-tools','metadata'].includes(k))throw Error('Unexpected field '+k);
if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fields.name)||fields.name.length>64)throw Error('Invalid name');
if(!fields.description||fields.description.length>1024||/[<>]/.test(fields.description))throw Error('Invalid description');
if(/^[ ]{0,3}\[TODO:[^\n]*\][ \t]*$/m.test(s))throw Error('Unfinished placeholder');
console.log('Skill frontmatter/name/description/placeholder validation passed (Node fallback).');
