// Approved October 19 eight-color edition. Saved SVG remains authoritative.
// Default: rebuild candidates in scratch. --promote copies verified candidates to production.
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto'),zlib=require('zlib');
const root=path.resolve(__dirname,'../../..'),out=path.join(root,'tmp/vt-hokie-approved'),art=path.join(out,'source-assets'),scratch=path.join(out,'review'),sourceA=path.join(root,'VT Hokie/info/assets');
const {Resvg}=require(path.join(root,'assets/tools/vector-tools/node_modules/@resvg/resvg-js'));
const {PNG}=require(path.join(root,'assets/tools/vector-tools/node_modules/pngjs'));
const plan=JSON.parse(fs.readFileSync(path.join(root,'assets/tools/guide-template/kits.json'),'utf8')).find(k=>k.slug==='vt-hokie');
const palette=plan.suppliedPaints,authority=require(path.join(root,'VT Hokie/info/src/outline-master.cjs')).load(root),g=authority.g;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const prod=fs.readdirSync(path.join(root,'VT Hokie')).filter(f=>/\.(pdf|svg)$/.test(f));
const hashes=()=>Object.fromEntries(prod.map(f=>[f,sha(fs.readFileSync(path.join(root,'VT Hokie',f)))]));
const before=hashes();
if(process.argv.includes('--audit-only')){console.log('Approved outline binding passed.');process.exit(0);}
if(process.argv.includes('--retrace')||process.argv.includes('--propose-outline'))throw Error('This builder preserves the saved SVG. Geometry proposals require a separate reviewed workflow.');
fs.mkdirSync(art,{recursive:true});fs.mkdirSync(scratch,{recursive:true});
fs.copyFileSync(path.join(sourceA,'page-logo.png'),path.join(art,'page-logo.png'));
const p=(r,fill)=>`<path d="${r.d}" fill="${fill}" fill-rule="evenodd"/>`;
function svg(stage=7){
 const fills=['url(#sunset)',palette[3].hex,palette[4].hex,palette[5].hex,palette[6].hex,palette[2].hex,palette[7].hex];
 let content=g.regions.slice(0,4).map((r,i)=>p(r,r.start<=stage?(stage===1&&i===0?palette[0].hex:fills[i]):'#FFFFFF')).join('');
 content+=p({d:g.border.outerD},stage>=7?palette[2].hex:'#FFFFFF');
 content+=p({d:g.border.innerD},stage>=6?palette[6].hex:'#FFFFFF');
 if(stage>=6)content+='<g clip-path="url(#inner-emblem)">'+p(g.regions[6],'#FFFFFF')+'</g>';
 if(stage<7)content+=`<g fill="none" stroke="#A6A6A6" stroke-width="${2*1000/720}" stroke-linecap="round" stroke-linejoin="round">${g.lines.filter(l=>l.pair.some(id=>g.regions[id].start>stage)).map(l=>`<path d="${l.d}"/>`).join('')}</g>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="10in" height="8in" viewBox="0 0 1000 800"><defs><clipPath id="inner-emblem"><path d="${g.border.innerD}"/></clipPath><linearGradient id="sunset" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="580"><stop offset="0" stop-color="${palette[0].hex}"/><stop offset=".48" stop-color="${palette[0].hex}"/><stop offset=".63" stop-color="${palette[1].hex}"/><stop offset=".75" stop-color="${palette[1].hex}"/><stop offset=".93" stop-color="${palette[2].hex}"/><stop offset="1" stop-color="${palette[2].hex}"/></linearGradient></defs><rect width="1000" height="800" fill="${stage===1?palette[0].hex:'url(#sunset)'}"/>${content}</svg>`;
}
// Native canonical paths generate the new color study; no source painting pixels are altered.
for(let stage=1;stage<=7;stage++)fs.writeFileSync(path.join(art,`stage-${String(stage).padStart(2,'0')}.png`),new Resvg(svg(stage),{fitTo:{mode:'width',value:3000}}).render().asPng());
fs.writeFileSync(path.join(art,'reference-master.svg'),svg());
fs.copyFileSync(path.join(art,'stage-07.png'),path.join(art,'reference-master.png'));
function pdfReference(){
 const {width,height,data}=PNG.sync.read(fs.readFileSync(path.join(art,'reference-master.png'))),rgb=Buffer.alloc(width*height*3);
 for(let i=0,j=0;i<data.length;i+=4,j+=3){rgb[j]=data[i];rgb[j+1]=data[i+1];rgb[j+2]=data[i+2];}
 const im=zlib.deflateSync(rgb),c=Buffer.from('q\n720 0 0 576 0 0 cm\n/Im0 Do\nQ');
 const objects=[Buffer.from('<< /Type /Catalog /Pages 2 0 R >>'),Buffer.from('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),Buffer.from('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 720 576] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>'),Buffer.concat([Buffer.from(`<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length ${im.length} >>\nstream\n`),im,Buffer.from('\nendstream')]),Buffer.concat([Buffer.from(`<< /Length ${c.length} >>\nstream\n`),c,Buffer.from('\nendstream')])];
 const a=[Buffer.from('%PDF-1.4\n% Hokie Sunset approved eight-color reference\n')],offsets=[];let n=a[0].length;
 objects.forEach((o,i)=>{offsets.push(n);const b=Buffer.concat([Buffer.from(`${i+1} 0 obj\n`),o,Buffer.from('\nendobj\n')]);a.push(b);n+=b.length;});
 a.push(Buffer.from(`xref\n0 6\n0000000000 65535 f \n${offsets.map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${n}\n%%EOF`));fs.writeFileSync(path.join(out,'vt-hokie-finished-reference-10x8.pdf'),Buffer.concat(a));
}
pdfReference();
const steps=plan.steps.map(s=>[s.heading,s.caption]);
const layout=require('./guide-pdf.cjs')({root,out,art,palette,steps,Resvg,PNG});
fs.writeFileSync(path.join(scratch,'layout-checks.json'),JSON.stringify(layout,null,2));
for(const [kind,size] of [['painting-guide','612x792'],['finished-reference','720x576']]){const r=cp.spawnSync(process.execPath,[path.join(root,'assets/tools/pdf-render/render-pdf.cjs'),path.join(out,`vt-hokie-${kind}-10x8.pdf`),path.join(scratch,kind+'.png'),'--expect-pages','1','--expect-points',size,'--checks',path.join(scratch,'pdf-checks.json')],{cwd:root,stdio:'inherit',windowsHide:true});if(r.status)throw Error('Render failed');}
const after=hashes();if(JSON.stringify(before)!==JSON.stringify(after))throw Error('Production files changed');
fs.writeFileSync(path.join(scratch,'preservation-checks.json'),JSON.stringify({productionUnchanged:true,before,after,paletteCount:palette.length,canonicalMasks:true,outlineBinding:authority.manifest},null,2));
if(process.argv.includes('--promote')){
 for(const kind of ['painting-guide','finished-reference'])fs.copyFileSync(path.join(out,`vt-hokie-${kind}-10x8.pdf`),path.join(root,'VT Hokie',`vt-hokie-${kind}-10x8.pdf`));
 for(const name of ['reference-master.png','reference-master.svg',...Array.from({length:7},(_,i)=>`stage-${String(i+1).padStart(2,'0')}.png`)])fs.copyFileSync(path.join(art,name),path.join(sourceA,name));
 if(hashes()['vt-hokie-outline-10x8.svg']!==before['vt-hokie-outline-10x8.svg'])throw Error('Outline changed');
 console.log('Approved guide/reference and editable masters promoted; outline unchanged.');
}else console.log('Approved-edition candidates ready for visual review; production PDFs unchanged.');
