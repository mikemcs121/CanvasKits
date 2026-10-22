// Guide-only repair: preserve all canvas artwork and current selected logo.
const fs=require('fs'),path=require('path'),cp=require('child_process');
const root=path.resolve(__dirname,'../../..'),art=path.join(root,'turtle/info/assets'),out=path.join(root,'tmp/turtle-logo');
fs.mkdirSync(out,{recursive:true});
const {Resvg}=require(path.join(root,'assets/tools/vector-tools/node_modules/@resvg/resvg-js'));
const {PNG}=require(path.join(root,'assets/tools/vector-tools/node_modules/pngjs'));
const p=JSON.parse(fs.readFileSync(path.join(root,'assets/tools/guide-template/kits.json'))).find(p=>p.slug==='turtle');
const checks=require('./guide-pdf.cjs')({root,out,art,palette:p.suppliedPaints,steps:p.steps.map(s=>[s.heading,s.caption]),Resvg,PNG});
fs.writeFileSync(path.join(out,'layout-checks.json'),JSON.stringify(checks,null,2));
const r=cp.spawnSync(process.execPath,['assets/tools/pdf-render/render-pdf.cjs',path.join(out,'turtle-painting-guide-8x10.pdf'),path.join(out,'guide.png'),'--expect-pages','1','--expect-points','612x792','--checks',path.join(out,'pdf-checks.json')],{cwd:root,stdio:'inherit',windowsHide:true});if(r.status)throw Error('Guide check failed');
