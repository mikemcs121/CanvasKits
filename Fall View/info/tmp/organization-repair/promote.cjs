const fs=require('fs'),path=require('path');
for(const [folder,slug] of [['fall view','fall-view'],['Starry-night Sunflower','starry-night-sunflower']]){
 const kit=path.resolve(folder),base=fs.existsSync(path.join(kit,'info/tmp/organization-repair'))?path.join(kit,'info'):kit,d=path.join(base,'tmp/organization-repair'),out=path.join(base,'output/pdf/8x10');fs.mkdirSync(out,{recursive:true});
 const checks=JSON.parse(fs.readFileSync(d+'/pdf-checks.json')),layout=JSON.parse(fs.readFileSync(d+'/layout-checks.json'));
 if(checks.length!==2||checks.some(c=>c.pages!==1)||layout.cells.length!==12||layout.cells.some(c=>c.captionOverflow>0||c.headingOverflow>0))throw Error('Preflight failed');
 for(const role of ['painting-guide','finished-reference']){const stem=slug+'-'+role+'-8x10';fs.copyFileSync(d+'/'+stem+'.pdf',out+'/'+stem+'.pdf');fs.copyFileSync(d+'/'+stem+(role==='painting-guide'?'-render':'')+'.png',out+'/'+stem+'.png');if(base!==kit)fs.copyFileSync(d+'/'+stem+'.pdf',path.join(kit,stem+'.pdf'));}
 console.log(folder+' verified exports promoted'+(base!==kit?' including root production PDFs':''));
}
