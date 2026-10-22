// Rebuild from the saved vector geometry and paint layers. --promote publishes
// the three reviewed files. --retrace explicitly re-derives them from the source.
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto');
const root=path.resolve(__dirname,'../../..'),A=path.join(root,'Owl/info/assets'),out=path.join(root,'tmp/owl');
const {Resvg}=require(path.join(root,'assets/tools/vector-tools/node_modules/@resvg/resvg-js'));
const {PNG}=require(path.join(root,'assets/tools/vector-tools/node_modules/pngjs'));
const python='C:/Users/mikem/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe';
function run(exe,args){const r=cp.spawnSync(exe,args,{cwd:root,stdio:'inherit',windowsHide:true});if(r.status!==0)throw Error('Build step failed: '+args[0]);}
const node=(f,args=[])=>run(process.execPath,[f,...args]);
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
fs.mkdirSync(out,{recursive:true});
const source=path.join(root,'Owl/info/archive/previous-root-files/owl-coloring-page.png');
if(hash(source)!=='fd47be7ed66f4bb3609d5f54e9fb869e110bade6743a1e86e92a3d9f3c48ba5f')throw Error('Supplied source changed');
if(process.argv.includes('--retrace')){
 for(const f of ['trace.py'])run(python,['Owl/info/src/'+f]);
 node('Owl/info/src/build-outline.cjs');
 for(const f of ['regions.py','paint-masks.py'])run(python,['Owl/info/src/'+f]);
}
const g=JSON.parse(fs.readFileSync(path.join(A,'geometry.json')));
const body=[...g.centerlinePaths,...g.solidBoundaryPaths].map(d=>`<path d="${d}"/>`).join('');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="8in" height="10in" viewBox="0 0 576 720"><title>Owl kids canvas — black transfer</title><g transform="translate(${g.translate.join(' ')}) scale(${g.scale})" fill="none" stroke="#000000" stroke-width="${3/g.scale}" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
fs.writeFileSync(path.join(out,'owl-outline-8x10.svg'),svg);
fs.writeFileSync(path.join(out,'outline-transparent.png'),new Resvg(svg,{fitTo:{mode:'width',value:2400}}).render().asPng());
fs.writeFileSync(path.join(out,'outline-preview.png'),new Resvg(svg,{fitTo:{mode:'width',value:2400},background:'white'}).render().asPng());
node('Owl/info/src/paint.cjs',process.argv.includes('--retrace')?['--retrace']:[]);
run(python,['Owl/info/src/finish-images.py']);
const plan=JSON.parse(fs.readFileSync(path.join(root,'assets/tools/guide-template/kits.json'))).find(k=>k.slug==='owl');
if(!plan)throw Error('Missing shared guide plan');
const checks=require('./guide-pdf.cjs')({root,out,art:A,palette:plan.suppliedPaints,steps:plan.steps.map(s=>[s.heading,s.caption]),Resvg,PNG});
fs.writeFileSync(path.join(out,'layout-checks.json'),JSON.stringify(checks,null,2));
node('assets/tools/reference-pdf/png-to-pdf.cjs',[path.join(A,'reference-master.png'),path.join(out,'owl-finished-reference-8x10.pdf')]);
for(const [kind,size]of [['painting-guide','612x792'],['finished-reference','576x720']])node('assets/tools/pdf-render/render-pdf.cjs',[path.join(out,`owl-${kind}-8x10.pdf`),path.join(out,kind+'.png'),'--expect-pages','1','--expect-points',size,'--checks',path.join(out,'pdf-checks.json')]);
const p=PNG.sync.read(fs.readFileSync(path.join(out,'outline-transparent.png')));
if(p.width!==2400||p.height!==3000||/<image\b|<rect\b/.test(svg))throw Error('Transfer preflight failed');
const colors=new Set();let transparent=0;for(let i=0;i<p.data.length;i+=4){if(!p.data[i+3])transparent++;else{if(p.data[i]!==p.data[i+1]||p.data[i]!==p.data[i+2])throw Error('Non-neutral transfer pixel');if(p.data[i+3]===255)colors.add(p.data.subarray(i,i+3).join(','));}}
if(colors.size!==1||!colors.has('0,0,0')||!transparent)throw Error('Transfer black or transparency mismatch');
if(hash(path.join(A,'reference-master.png'))!==hash(path.join(A,'stage-06.png')))throw Error('Final stage mismatch');
fs.writeFileSync(path.join(out,'art-checks.json'),JSON.stringify({pixels:[p.width,p.height],physicalInches:[8,10],strokePoints:3,lineColor:'#000000',vectorOnly:true,transparentPixels:transparent,framePresent:false,sourceProportionsPreserved:true,finalStageEqualsReference:true},null,2));
if(process.argv.includes('--promote'))for(const name of ['owl-outline-8x10.svg','owl-painting-guide-8x10.pdf','owl-finished-reference-8x10.pdf'])fs.copyFileSync(path.join(out,name),path.join(root,'Owl',name));
console.log(process.argv.includes('--promote')?'Owl kit promoted.':'Owl candidates ready for visual review.');
