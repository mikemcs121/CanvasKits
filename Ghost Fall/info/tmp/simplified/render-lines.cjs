// Kids' styling migration: retain every approved path and its placement.
const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'../../../..');
const out=path.join(root,'tmp/ghost-kids-black-3pt');fs.mkdirSync(out,{recursive:true});
const {Resvg}=require(path.join(root,'assets/tools/vector-tools/node_modules/@resvg/resvg-js'));
const original=fs.readFileSync(path.join(root,'Ghost Fall/ghost-fall-outline-8x10.svg'),'utf8');
const svg=original.replaceAll('#A6A6A6','#000000').replaceAll('8.333333333333334','12.5').replace('fine adult transfer outline','kids black transfer outline').replace('Line weight 2 pt.','Line weight 3 pt.');
fs.writeFileSync(path.join(out,'ghost-fall-outline-8x10.svg'),svg);
fs.writeFileSync(path.join(out,'outline-transparent.png'),new Resvg(svg,{fitTo:{mode:'width',value:2400}}).render().asPng());
fs.writeFileSync(path.join(out,'outline-preview.png'),new Resvg(svg,{fitTo:{mode:'width',value:2400},background:'white'}).render().asPng());
const paths=[...svg.matchAll(/<path d="([^"]+)"/g)].map(m=>m[1]);
const face=`<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="3000" viewBox="0 0 2400 3000"><g fill="black">${paths.slice(-5,-2).map(d=>`<path d="${d}"/>`).join('')}</g></svg>`;
fs.writeFileSync(path.join(out,'face-fill-mask.png'),new Resvg(face).render().asPng());
