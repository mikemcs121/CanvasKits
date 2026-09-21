const fs=require('fs'),path=require('path'),crypto=require('crypto');
const sharp=require('C:/Users/mmcsherry/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.resolve(__dirname,'../../..'),review=path.join(root,'assets/tools/source-quality-review/2026-09-21');
const base=JSON.parse(fs.readFileSync(path.join(review,'baseline-hashes.json')));
const kits=JSON.parse(fs.readFileSync(path.join(root,'assets/tools/guide-template/kits.json')));
const selected=['gnome-fall','gnome-christmas-tree','fall-view','starry-night-sunflower'];
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function copy(a,b){fs.mkdirSync(path.dirname(b),{recursive:true});if(!fs.existsSync(b))fs.copyFileSync(a,b,fs.constants.COPYFILE_EXCL);if(hash(a)!==hash(b))throw Error('Backup differs: '+b);return{source:a,archive:b,sha256:hash(a)};}
function walk(d,out=[]){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(['node_modules','.git','browser-cache','chrome-organization','build-caches'].includes(e.name))continue;const p=path.join(d,e.name);if(e.isDirectory())walk(p,out);else if(/outline/i.test(e.name)&&/\.(svg|png|pdf)$/i.test(e.name))out.push(p);}return out;}
(async()=>{
 if(process.argv.includes('--verify')){
  const b=JSON.parse(fs.readFileSync(path.join(__dirname,'protected-files.json')));const changed=b.filter(p=>!fs.existsSync(p.path)||hash(p.path)!==p.sha256);console.log(JSON.stringify({protectedFiles:b.length,changed},null,2));if(changed.length)process.exit(1);return;
 }
 for(const p of [...base.production,...base.sources])if(hash(p.path)!==p.sha256)throw Error('Baseline changed before work: '+p.path);
 const protectedFiles=[...base.sources,...kits.flatMap(k=>walk(path.join(root,k.folder)).map(p=>({path:p,sha256:hash(p)})))];
 const pp=path.join(__dirname,'protected-files.json');if(!fs.existsSync(pp))fs.writeFileSync(pp,JSON.stringify(protectedFiles,null,2));
 copy(path.join(root,'assets/tools/guide-template/kits.json'),path.join(__dirname,'archive/shared-kits-before.json'));
 for(const k of kits){
  const src=base.sources.filter(s=>path.basename(s.path).startsWith(k.slug+'-'));if(!src.length)continue;
  const assets=path.join(root,k.folder,'info/assets/reference-restoration'),work=path.join(root,k.folder,'info/tmp/reference-restoration');fs.mkdirSync(work,{recursive:true});fs.mkdirSync(assets,{recursive:true});
  const records=src.map(s=>copy(s.path,path.join(assets,'sources',path.basename(s.path))));
  if(selected.includes(k.slug)){
   const archive=path.join(root,k.folder,'info/archive/before-reference-restoration-2026-09-21');
   for(const type of ['finished-reference','painting-guide']){
    records.push(copy(path.join(root,k.folder,k.slug+'-'+type+'-8x10.pdf'),path.join(archive,k.slug+'-'+type+'-8x10.pdf')));
    records.push(copy(path.join(root,k.folder,'info/output/pdf/8x10',k.slug+'-'+type+'-8x10.png'),path.join(archive,k.slug+'-'+type+'-8x10.png')));
   }
   records.push(copy(path.join(root,k.work,'plan.json'),path.join(archive,'guide-plan.json')));
   await sharp(path.join(root,k.folder,k.slug+'-outline-8x10.svg')).resize(2400,3000).flatten({background:'#fff'}).png().toFile(path.join(assets,'geometry-view.png'));
   await sharp(path.join(assets,'geometry-view.png')).resize(1200,1500).png().toFile(path.join(work,'geometry-preview.png'));
  }
  fs.writeFileSync(path.join(work,'preservation-manifest.json'),JSON.stringify(records,null,2));
 }
 console.log('Prepared sources/backups; protected '+protectedFiles.length+' source/transfer files. No production changes.');
})();
