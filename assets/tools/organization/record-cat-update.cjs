const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'../../..');
const parse=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8').replace(/^\uFEFF/,''));
const write=(p,v)=>fs.writeFileSync(path.join(root,p),JSON.stringify(v,null,2));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex').toUpperCase();
const selectionPath='Cat in Pumpkin/info/production-selection.json';
const selected=parse(selectionPath);
for(const f of selected){const h=hash(f.destination);if(h!==f.sha256){f.sha256BeforeTitleUpdate=f.sha256;f.sha256=h;}}
write(selectionPath,selected);
const report=parse('assets/tools/organization/organization-result.json');
const cat=report.find(k=>k.kit==='Cat in Pumpkin');cat.productionHashes=selected;
write('assets/tools/organization/organization-result.json',report);
const changes=parse('Cat in Pumpkin/info/name-correction.json');
const changed=new Set(changes.updatedText.map(r=>r.file.replaceAll('\\','/')));
for(const suffix of ['.pdf','.png'])changed.add('Cat in Pumpkin/info/output/pdf/8x10/cat-in-pumpkin-painting-guide-8x10'+suffix);
for(const p of ['Cat in Pumpkin/info/tmp/8x10-artwork/guide.html','Cat in Pumpkin/info/tmp/8x10-artwork/cat-in-pumpkin-painting-guide-8x10.pdf','Cat in Pumpkin/info/tmp/8x10-artwork/cat-in-pumpkin-painting-guide-8x10-render.png','Cat in Pumpkin/info/tmp/8x10-artwork/pdf-checks.json','Fox Fall/info/tmp/new-kits.cjs','Fox Fall/info/tmp/render-guides.ps1','Fox Fall/info/tmp/promote-guides.ps1'])changed.add(p);
const kits=parse('assets/tools/organization/selections.json');
for(const k of kits){const p=k.folder+'/info/organization-manifest.json',records=parse(p);let edited=false;
 for(const r of records){if(changed.has(r.new.replaceAll('\\','/'))){r.sha256AfterNameCorrection=hash(path.join(root,r.new));r.note='sha256 records the organization-time bytes; the name correction/revised guide is recorded separately.';edited=true;}}
 if(edited)write(p,records);
}
changes.guideTitle='Cat in Pumpkin';changes.guidePdfSha256=selected.find(f=>f.role==='guide').sha256;changes.guideVisuallyReviewed=true;
write('Cat in Pumpkin/info/name-correction.json',changes);
console.log('Updated production guide hash; retained historical hashes and recorded name correction separately.');
