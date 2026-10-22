const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto');
const root=path.resolve(__dirname,'../../..'),A=path.join(root,'turtle/info/assets'),out=path.join(root,'tmp/turtle');
const python='C:/Users/mikem/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe';
const {Resvg}=require(path.join(root,'assets/tools/vector-tools/node_modules/@resvg/resvg-js'));
const {PNG}=require(path.join(root,'assets/tools/vector-tools/node_modules/pngjs'));
function run(exe,args){const r=cp.spawnSync(exe,args,{cwd:root,stdio:'inherit',windowsHide:true});if(r.status)throw Error('Build failed: '+args.join(' '));}
const node=(f,args=[])=>run(process.execPath,[f,...args]);const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
fs.mkdirSync(out,{recursive:true});
if(process.argv.includes('--retrace')){run(python,['turtle/info/src/trace.py']);node('turtle/info/src/build-outline.cjs');run(python,['turtle/info/src/regions.py']);fs.copyFileSync(path.join(out,'labels.npy'),path.join(A,'region-map.npy'));fs.copyFileSync(path.join(out,'regions.json'),path.join(A,'regions.json'));}
const g=JSON.parse(fs.readFileSync(path.join(A,'geometry.json')));
const body=[...g.centerlinePaths,...g.solidBoundaryPaths].map(d=>`<path d="${d}"/>`).join('');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="8in" height="10in" viewBox="0 0 576 720"><title>Sea Turtle kids canvas transfer</title><g transform="translate(${g.translate.join(' ')}) scale(${g.scale})" fill="none" stroke="#000000" stroke-width="${3/g.scale}" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
fs.writeFileSync(path.join(out,'turtle-outline-8x10.svg'),svg);
for(const [name,bg]of [['outline-transparent.png',undefined],['outline-preview.png','white']])fs.writeFileSync(path.join(out,name),new Resvg(svg,{fitTo:{mode:'width',value:2400},background:bg}).render().asPng());
run(python,['turtle/info/src/paint.py']);node('turtle/info/src/art.cjs');
run(python,['turtle/info/src/finish.py']);
const plan=JSON.parse(fs.readFileSync(path.join(root,'assets/tools/guide-template/kits.json'))).find(k=>k.slug==='turtle');
const checks=require('./guide-pdf.cjs')({root,out,art:A,palette:plan.suppliedPaints,steps:plan.steps.map(s=>[s.heading,s.caption]),Resvg,PNG});
fs.writeFileSync(path.join(out,'layout-checks.json'),JSON.stringify(checks,null,2));
node('assets/tools/reference-pdf/png-to-pdf.cjs',[path.join(A,'reference-master.png'),path.join(out,'turtle-finished-reference-8x10.pdf')]);
for(const [kind,size]of [['painting-guide','612x792'],['finished-reference','576x720']])node('assets/tools/pdf-render/render-pdf.cjs',[path.join(out,`turtle-${kind}-8x10.pdf`),path.join(out,kind+'.png'),'--expect-pages','1','--expect-points',size,'--checks',path.join(out,'pdf-checks.json')]);
const p=PNG.sync.read(fs.readFileSync(path.join(out,'outline-transparent.png')));let transparent=0,black=0;for(let i=0;i<p.data.length;i+=4){if(!p.data[i+3])transparent++;else{if(p.data[i]||p.data[i+1]||p.data[i+2])throw Error('Nonblack transfer pixel');if(p.data[i+3]===255)black++;}}
if(p.width!==2400||p.height!==3000||!transparent||!black||/<image\b|<rect\b/.test(svg))throw Error('Transfer validation failed');
if(hash(path.join(A,'reference-master.png'))!==hash(path.join(A,'stage-06.png')))throw Error('Final stage mismatch');
fs.writeFileSync(path.join(out,'art-checks.json'),JSON.stringify({vectorOnly:true,sizeInches:[8,10],pixels:[2400,3000],strokePoints:3,lineColor:'#000000',transparentPixels:transparent,sourceBounds:[1024,1536],scale:g.scale,translate:g.translate,finalStageEqualsMaster:true,texture:'Generated at 1024x1536 then smoothly resampled; region-clipped to canonical source geometry.'},null,2));
if(process.argv.includes('--promote'))for(const name of ['turtle-outline-8x10.svg','turtle-painting-guide-8x10.pdf','turtle-finished-reference-8x10.pdf'])fs.copyFileSync(path.join(out,name),path.join(root,'turtle',name));
console.log(process.argv.includes('--promote')?'Turtle kit promoted.':'Turtle candidates ready for review.');
