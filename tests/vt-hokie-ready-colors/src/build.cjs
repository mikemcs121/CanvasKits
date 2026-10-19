// Separate color test. Reads approved geometry; never writes production files.
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto'),zlib=require('zlib');
const {pathToFileURL}=require('url');
const root=path.resolve(__dirname,'../../..'),out=path.resolve(__dirname,'..'),art=path.join(out,'assets'),scratch=path.join(root,'tmp/vt-palette-review');
const {Resvg}=require(path.join(root,'assets/tools/vector-tools/node_modules/@resvg/resvg-js'));
const {PNG}=require(path.join(root,'assets/tools/vector-tools/node_modules/pngjs'));
const palette=require('../palette.json'),authority=require(path.join(root,'VT Hokie/info/src/outline-master.cjs')).load(root),g=authority.g;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const prod=fs.readdirSync(path.join(root,'VT Hokie')).filter(f=>/\.(pdf|svg)$/.test(f));
const hashes=()=>Object.fromEntries(prod.map(f=>[f,sha(fs.readFileSync(path.join(root,'VT Hokie',f)))]));
const before=hashes();fs.mkdirSync(art,{recursive:true});fs.mkdirSync(scratch,{recursive:true});
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
for(let stage=1;stage<=7;stage++)fs.writeFileSync(path.join(art,`stage-${stage}.png`),new Resvg(svg(stage),{fitTo:{mode:'width',value:3000}}).render().asPng());
fs.writeFileSync(path.join(art,'reference.svg'),svg());
fs.copyFileSync(path.join(art,'stage-7.png'),path.join(art,'reference.png'));
function pdfReference(){
 const {width,height,data}=PNG.sync.read(fs.readFileSync(path.join(art,'reference.png'))),rgb=Buffer.alloc(width*height*3);
 for(let i=0,j=0;i<data.length;i+=4,j+=3){rgb[j]=data[i];rgb[j+1]=data[i+1];rgb[j+2]=data[i+2];}
 const im=zlib.deflateSync(rgb),c=Buffer.from('q\n720 0 0 576 0 0 cm\n/Im0 Do\nQ');
 const objects=[Buffer.from('<< /Type /Catalog /Pages 2 0 R >>'),Buffer.from('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),Buffer.from('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 720 576] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>'),Buffer.concat([Buffer.from(`<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length ${im.length} >>\nstream\n`),im,Buffer.from('\nendstream')]),Buffer.concat([Buffer.from(`<< /Length ${c.length} >>\nstream\n`),c,Buffer.from('\nendstream')])];
 const a=[Buffer.from('%PDF-1.4\n% Hokie eight-color TEST reference\n')],offsets=[];let n=a[0].length;
 objects.forEach((o,i)=>{offsets.push(n);const b=Buffer.concat([Buffer.from(`${i+1} 0 obj\n`),o,Buffer.from('\nendobj\n')]);a.push(b);n+=b.length;});
 a.push(Buffer.from(`xref\n0 6\n0000000000 65535 f \n${offsets.map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${n}\n%%EOF`));fs.writeFileSync(path.join(out,'vt-hokie-test-finished-reference-10x8.pdf'),Buffer.concat(a));
}
pdfReference();
const steps=[
 ['Paint the cream sky','Start with the preprinted canvas. Use cream around the emblem, above the mountains. Keep the emblem and mountain bands white. Brush thin coats. Rinse and blot between colors.'],
 ['Add the ready sunset','Use peach across the middle sky and orange just above the mountains. Feather the touching edges with light sideways strokes. Let dry.'],
 ['Paint the far ridge','Use light blue for the highest mountain band. Fill to the next line. Keep the lower bands and emblem white. Let dry.'],
 ['Add the middle ridge','Fill the middle mountain band with medium blue. Follow the curves with sideways strokes. Keep the nearest mountain and emblem white. Let dry before painting beside it.'],
 ['Fill the nearest ridge','Use dark blue in the lowest mountain band, right to the bottom edge. Keep its upper edge clear. Let dry.'],
 ['Paint the maroon','Use maroon in the emblem and its small inner marks. Leave the HokieBird details and narrow border white. Use two thin coats, drying between them. Turn the canvas for control.'],
 ['Frame and finish','Paint the narrow border with orange. Let dry. Fill the HokieBird details with white.'],
 ['Dry and clean up','Lay the finished canvas flat until fully dry. Wash and reshape both brushes, wipe your palette and close the paints.']
];
const layout=require('./guide-pdf.cjs')({root,out,art,palette,steps,Resvg,PNG});
fs.writeFileSync(path.join(scratch,'test-layout-checks.json'),JSON.stringify(layout,null,2));
for(const [kind,size] of [['painting-guide','612x792'],['finished-reference','720x576']]){const r=cp.spawnSync(process.execPath,[path.join(root,'assets/tools/pdf-render/render-pdf.cjs'),path.join(out,`vt-hokie-test-${kind}-10x8.pdf`),path.join(scratch,'test-'+kind+'.png'),'--expect-pages','1','--expect-points',size,'--checks',path.join(scratch,'test-pdf-checks.json')],{cwd:root,stdio:'inherit',windowsHide:true});if(r.status)throw Error('Render failed');}
const after=hashes();if(JSON.stringify(before)!==JSON.stringify(after))throw Error('Production files changed');
fs.writeFileSync(path.join(scratch,'test-preservation-checks.json'),JSON.stringify({productionUnchanged:true,before,after,paletteCount:palette.length,canonicalMasks:true,outlineBinding:authority.manifest},null,2));
console.log('Eight-color test complete; production files unchanged.');
