const fs=require('fs'),path=require('path'),crypto=require('crypto'),cp=require('child_process');
const sharp=require('C:/Users/mmcsherry/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.resolve(__dirname,'../../..'),out=path.join(__dirname,'2026-09-21');
const source='C:/Users/mmcsherry/Desktop/New folder';
const kits=JSON.parse(fs.readFileSync(path.join(root,'assets/tools/guide-template/kits.json')));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
async function sheet(items,file,width=600,height=760){
 const layers=[];
 for(let i=0;i<items.length;i++){
  const im=await sharp(items[i].file).flatten({background:'#fff'}).resize(width,height,{fit:'inside'}).png().toBuffer({resolveWithObject:true});
  layers.push({input:im.data,left:i*width+Math.floor((width-im.info.width)/2),top:45+Math.floor((height-im.info.height)/2)});
  layers.push({input:Buffer.from(`<svg width="${width}" height="40"><text x="12" y="27" font-family="Arial" font-size="19">${esc(items[i].label)}</text></svg>`),left:i*width,top:0});
 }
 await sharp({create:{width:width*items.length,height:height+45,channels:3,background:'#ffffff'}}).composite(layers).png().toFile(file);
}
async function main(){
 fs.mkdirSync(out,{recursive:true});
 const manifest={date:'2026-09-21',purpose:'Read-only production review; previews only',sources:[],production:[]};
 for(const name of fs.readdirSync(source)){
  const p=path.join(source,name);if(!fs.statSync(p).isFile())continue;
  const m=await sharp(p).metadata();manifest.sources.push({path:p,sha256:hash(p),width:m.width,height:m.height});
 }
 for(const k of kits){
  const dir=path.join(out,k.slug);fs.mkdirSync(dir,{recursive:true});
  for(const type of ['outline-8x10.svg','finished-reference-8x10.pdf','painting-guide-8x10.pdf']){
   const p=path.join(root,k.folder,k.slug+'-'+type);manifest.production.push({path:p,sha256:hash(p)});
   const target=path.join(dir,type.replace(/\.(svg|pdf)$/,'.png'));
   if(type.endsWith('pdf')){
    const r=cp.spawnSync(process.execPath,[path.join(root,'assets/tools/pdf-render/render-pdf.cjs'),p,target,'--expect-pages','1','--expect-points',type.startsWith('painting')?'612x792':'576x720','--checks',path.join(out,'pdf-checks.json')],{cwd:root,encoding:'utf8',windowsHide:true});
    if(r.status!==0)throw Error(JSON.stringify({error:r.error?.message,status:r.status,signal:r.signal,stderr:r.stderr,stdout:r.stdout}));console.log(r.stdout.trim());
   }else await sharp(p).resize(2400,3000,{fit:'fill'}).png().toFile(target);
  }
  const src=manifest.sources.find(s=>path.basename(s.path).startsWith(k.slug+'-finished-reference'));
  const items=[];if(src)items.push({file:src.path,label:'Desktop original (native proportions)'});
  items.push({file:path.join(dir,'finished-reference-8x10.png'),label:'Current root reference PDF'});
  items.push({file:path.join(dir,'outline-8x10.png'),label:'Fixed root SVG (unaltered)'});
  await sheet(items,path.join(dir,'comparison.png'));
  await sharp(path.join(dir,'painting-guide-8x10.png')).resize({width:1200}).png().toFile(path.join(dir,'guide-preview.png'));
 }
 fs.writeFileSync(path.join(out,'baseline-hashes.json'),JSON.stringify(manifest,null,2));
 const unchanged=manifest.production.every(p=>hash(p.path)===p.sha256)&&manifest.sources.every(p=>hash(p.path)===p.sha256);
 console.log('All production files and supplied originals unchanged:',unchanged);
}
main().catch(e=>{console.error(e);process.exit(1)});
