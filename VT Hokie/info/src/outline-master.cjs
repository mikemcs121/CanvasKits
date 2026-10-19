// The production SVG is authoritative. Geometry JSON is a pinned derivative cache.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function paths(svg){return [...svg.matchAll(/<path\b[^>]*\bd="([^"]+)"[^>]*\/?>/g)].map(m=>m[1]);}
function fingerprint(g){return hash(JSON.stringify({w:g.w,h:g.h,regions:g.regions,border:g.border,lines:g.lines}));}
function samePaths(svg,g){const p=paths(svg);if(p.length!==g.lines.length||p.some((d,i)=>d!==g.lines[i].d))throw Error('SVG master and geometry cache disagree. Repair the derivative masks against the SVG; do not regenerate the production outline.');return p;}
function structural(svg,g){
 if(!/width="10in"/.test(svg)||!/height="8in"/.test(svg)||!/viewBox="0 0 720 576"/.test(svg))throw Error('Master must remain 10 x 8 inches horizontally.');
 if(/<(image|rect|foreignObject)\b/i.test(svg))throw Error('Master must contain transparent vector linework only.');
 if(!svg.includes('stroke="#A6A6A6"')||!svg.includes('stroke-width="'+(2*1000/720)+'"'))throw Error('Master transfer color or 2-point weight changed.');
 if(g.regions[5].d!==g.border.outerD+' '+g.border.innerD||g.regions[4].d!==g.border.innerD+' '+g.regions[6].d)throw Error('Guide masks do not use the master border contours.');
 if(!g.lines.some(l=>l.d===g.border.outerD)||!g.lines.some(l=>l.d===g.border.innerD)||!g.lines.some(l=>l.d===g.regions[6].d))throw Error('Guide mask contours are missing from the master.');
}
function validate({svg,g,selectedSource,manifest}){
 structural(svg,g);const p=samePaths(svg,g);
 if(hash(svg)!==manifest.masterSvgSha256)throw Error('The approved SVG master changed. Align and review the guide/reference before updating the approved binding.');
 if(hash(selectedSource)!==manifest.selectedPaintingSha256||g.sourceHash!==manifest.selectedPaintingSha256)throw Error('Selected painting no longer matches the approved outline registration.');
 if(fingerprint(g)!==manifest.derivativeGeometrySha256)throw Error('Guide geometry/mask cache changed independently of the SVG master.');
 return {...g,lines:p.map((d,i)=>({...g.lines[i],d}))};
}
function load(root){
 const A=path.join(root,'VT Hokie/info/assets'),masterFile=path.join(root,'VT Hokie/vt-hokie-outline-10x8.svg'),svg=fs.readFileSync(masterFile,'utf8'),g=JSON.parse(fs.readFileSync(path.join(A,'geometry.json'))),selectedSource=fs.readFileSync(path.join(A,'border-continuation-source.png')),manifest=JSON.parse(fs.readFileSync(path.join(A,'outline-master.json')));
 return {svg,g:validate({svg,g,selectedSource,manifest}),manifest,masterFile};
}
function record(root){
 const A=path.join(root,'VT Hokie/info/assets'),svg=fs.readFileSync(path.join(root,'VT Hokie/vt-hokie-outline-10x8.svg'),'utf8'),g=JSON.parse(fs.readFileSync(path.join(A,'geometry.json'))),source=fs.readFileSync(path.join(A,'border-continuation-source.png'));
 structural(svg,g);samePaths(svg,g);if(hash(source)!==g.sourceHash)throw Error('Painting and derivative geometry are not registered.');
 return {schema:1,authority:'production SVG outline',masterFile:'VT Hokie/vt-hokie-outline-10x8.svg',masterSvgSha256:hash(svg),selectedPaintingFile:'VT Hokie/info/assets/border-continuation-source.png',selectedPaintingSha256:hash(source),derivativeGeometryFile:'VT Hokie/info/assets/geometry.json',derivativeGeometrySha256:fingerprint(g),policy:'Normal builds read the saved SVG and never regenerate it. Independent changes to the selected painting or derivative masks stop the build before outputs are written. Geometry proposals stay in scratch until the complete kit has been reviewed.'};
}
module.exports={load,validate,record,hash,paths};
