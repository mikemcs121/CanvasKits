const fs=require('fs'),path=require('path'),cp=require('child_process');
const root=path.resolve(__dirname,'../../..'),kits=require('./kits.json');
const renderer=path.join(root,'assets/tools/pdf-render/render-pdf.cjs');
const checks=[];
for(const k of kits){
 if(process.argv[2]&&process.argv[2]!==k.slug)continue;
 const stem=k.work+'/'+k.slug+'-painting-guide-8x10',check=k.work+'/pdf-render-checks.json';
 fs.writeFileSync(path.join(root,check),'[]');
 const r=cp.spawnSync(process.execPath,[renderer,stem+'.pdf',stem+'.png','--expect-pages','1','--expect-points','612x792','--checks',check],{cwd:root,encoding:'utf8',windowsHide:true,timeout:60000});
 if(r.error||r.status)throw Error(r.error||r.stderr||r.stdout);
 checks.push(...JSON.parse(fs.readFileSync(path.join(root,check),'utf8').replace(/^\uFEFF/,'')));
 console.log(k.folder+': rendered using shared PDF renderer.');
}
fs.writeFileSync(path.join(__dirname,'pdf-checks.json'),JSON.stringify(checks,null,2));
