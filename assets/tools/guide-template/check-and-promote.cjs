const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'../../..');
const Jimp=require(path.join(root,'assets/tools/vector-tools/node_modules/jimp'));
const read=p=>fs.readFileSync(path.join(root,p)),json=p=>JSON.parse(read(p).toString('utf8').replace(/^\uFEFF/,''));
const hash=p=>crypto.createHash('sha256').update(read(p)).digest('hex').toUpperCase();
const assert=(v,m)=>{if(!v)throw Error(m)};
const kits=json('assets/tools/guide-template/kits.json');
(async()=>{
 const checks=[];
 for(const k of kits){
  const pdf=k.work+'/'+k.slug+'-painting-guide-8x10.pdf',png=pdf.replace(/pdf$/,'png'),qa=json(k.work+'/layout-checks.json');
  const pdfText=read(pdf).toString('latin1');
  assert((pdfText.match(/\/Type\s*\/Page\b/g)||[]).length===1,k.slug+' page count');
  assert(/\/MediaBox\s*\[0 0 612 792\]/.test(pdfText),k.slug+' Letter size');
  assert(!qa.imageFailures.length&&qa.cells.length===k.steps.length,k.slug+' image/step count');
  assert(qa.cells.every(c=>c.caption.bottom<c.bounds.bottom-2&&c.headingOverflow<=1&&c.font>=12),k.slug+' text fit');
  assert(qa.title.right<qa.logo.left&&qa.title.left>=qa.titleBox.left,k.slug+' title/logo separation');
  assert(fs.statSync(path.join(root,png)).mtimeMs>=fs.statSync(path.join(root,pdf)).mtimeMs,k.slug+' stale PNG');
  const page=await Jimp.read(path.join(root,png));assert(page.bitmap.width===2550&&page.bitmap.height===3300,k.slug+' raster size');
  assert(read(png).subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),k.slug+' PNG encoding');
  const logo=await Jimp.read(path.join(root,k.logo));let clear=0,visible=0;for(let i=3;i<logo.bitmap.data.length;i+=4){if(logo.bitmap.data[i]===0)clear++;if(logo.bitmap.data[i]>128)visible++;}
  assert(clear>logo.bitmap.width*logo.bitmap.height*.12&&visible>logo.bitmap.width*logo.bitmap.height*.2,k.slug+' logo transparency/content');
  assert(logo.bitmap.width/logo.bitmap.height>2.2&&logo.bitmap.width/logo.bitmap.height<2.6,k.slug+' logo aspect');
  for(const [file,sha]of Object.entries(k.unchanged))assert(hash(file)===sha.toUpperCase(),k.slug+' changed source '+file);
  checks.push({kit:k.folder,slug:k.slug,steps:k.steps.length,guidePdf:pdf,guidePng:png,guideSha256:hash(pdf),imageSha256:hash(png),onePageLetter:true,rasterSize:[2550,3300],layoutPassed:true,logoTransparent:true,palette:k.palette,unchangedArtworkHashes:k.unchanged});
 }
 fs.writeFileSync(path.join(__dirname,'final-checks.json'),JSON.stringify(checks,null,2));
 if(!process.argv.includes('--promote')){console.log('All ten guides passed page, text, PNG, logo and unchanged-artwork checks.');return;}
 const reviews=json('assets/tools/guide-template/visual-review.json');
 for(const k of kits)assert(reviews[k.slug]===true,'Visual review not recorded '+k.slug);
 const organization=json('assets/tools/organization/organization-result.json');
 for(const k of kits){
  const c=checks.find(c=>c.slug===k.slug),name=k.slug+'-painting-guide-8x10',support=k.folder+'/info/output/pdf/8x10/';
  fs.copyFileSync(path.join(root,c.guidePdf),path.join(root,k.folder,name+'.pdf'));
  fs.copyFileSync(path.join(root,c.guidePdf),path.join(root,support,name+'.pdf'));
  fs.copyFileSync(path.join(root,c.guidePng),path.join(root,support,name+'.png'));
  const file=k.folder+'/info/production-selection.json',selection=json(file),guide=selection.find(s=>s.role==='guide');
  guide.sha256BeforeTemplateRefactor??=guide.sha256;guide.sha256=c.guideSha256;guide.source=path.join(root,c.guidePdf);guide.revision='Fall View template, painting-matched logo and page accents, September 20 2026';
  fs.writeFileSync(path.join(root,file),JSON.stringify(selection,null,2));
  organization.find(o=>o.kit.toLowerCase()===k.folder.toLowerCase()).productionHashes=selection;
  fs.writeFileSync(path.join(root,k.work,'verification.json'),JSON.stringify({...c,visuallyReviewed:true,promoted:true},null,2));
  const readme=k.folder+'/info/README.md';let s=read(readme).toString('utf8');if(!s.includes('## Current guide template'))s+='\n## Current guide template\n\nThe current guide uses the Fall View template, with logo and background accents matched to this painting. Shared builder: `assets/tools/guide-template/build.cjs` at the project root. Editable plan, HTML, logo prompt, layout checks and final verification: [tmp/template-refactor/](tmp/template-refactor/). Page-colored logo: [assets/template-refactor/river-and-ridge-logo.png](assets/template-refactor/river-and-ridge-logo.png). Earlier guide PDF/PNG: `archive/before-fall-view-template/`. Current artwork and transfer are unchanged.\n';fs.writeFileSync(path.join(root,readme),s);
 }
 fs.writeFileSync(path.join(root,'assets/tools/organization/organization-result.json'),JSON.stringify(organization,null,2));
 console.log('Promoted all ten reviewed guides and matching supporting PNGs; production hashes updated.');
})().catch(e=>{console.error(e);process.exit(1)});
