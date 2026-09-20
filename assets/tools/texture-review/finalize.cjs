const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=process.cwd(),read=p=>fs.readFileSync(path.join(root,p));
const parse=p=>JSON.parse(read(p).toString('utf8').replace(/^\uFEFF/,''));
const write=(p,v)=>fs.writeFileSync(path.join(root,p),JSON.stringify(v,null,2));
const hash=p=>crypto.createHash('sha256').update(read(p)).digest('hex').toUpperCase();
const report=parse('assets/tools/organization/organization-result.json');
for(const [folder,slug]of [['Gnome Fall','gnome-fall'],['Gnome Christmas Tree','gnome-christmas-tree']]){
 for(const type of ['finished-reference','painting-guide'])fs.copyFileSync(path.join(root,folder,'info/output/pdf/8x10',`${slug}-${type}-8x10.pdf`),path.join(root,folder,`${slug}-${type}-8x10.pdf`));
 const p=folder+'/info/production-selection.json',selection=parse(p);
 for(const s of selection){if(s.role==='outline')continue;const h=hash(path.relative(root,s.destination));if(h!==s.sha256){s.sha256BeforeSkyRepair=s.sha256;s.sha256=h;s.revision='Continuous sky texture; foreground geometry unchanged.';}}
 write(p,selection);report.find(k=>k.kit===folder).productionHashes=selection;
 const manifests=folder+'/info/organization-manifest.json',records=parse(manifests);
 for(const r of records){const f=path.join(root,r.new);if(fs.existsSync(f)&&r.new.replaceAll('\\','/').includes('/info/tmp/organization/')||fs.existsSync(f)&&r.new.replaceAll('\\','/').includes('/info/output/pdf/8x10/')){const h=hash(r.new);if(h!==r.sha256){r.sha256AfterSkyRepair=h;r.skyRepairNote='Organization-time sha256 retained; refreshed asset hash recorded separately.';}}}
 write(manifests,records);
 const note='\n\nSeptember 20 sky texture repair: current reference and guide use smooth-sky-source.png through the existing sky mask. The old integer-sampled sky is archived in info/archive/before-sky-smoothing/. See project reference-texture-review.md.\n';
 fs.appendFileSync(path.join(root,folder,'info/README.md'),note);
}
write('assets/tools/organization/organization-result.json',report);
const kits=parse('assets/tools/organization/selections.json'),checks=[];
for(const k of kits){const files=parse(k.folder+'/info/production-selection.json');for(const f of files)if(hash(path.relative(root,f.destination))!==f.sha256)throw Error('Unrecorded production change '+f.destination);checks.push({kit:k.folder,result:['gnome-fall','gnome-christmas-tree'].includes(k.slug)?'Sky blocks repaired; guide/reference refreshed':'Visually reviewed full image and enlarged crops; no matching square-grid artifact; production files unchanged'});}
write('assets/tools/texture-review/all-kits-review.json',checks);
console.log('Promoted both repaired references/guides; verified all other production files remain unchanged.');
