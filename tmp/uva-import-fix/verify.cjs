const fs=require('fs'),crypto=require('crypto'),assert=require('assert');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const root=process.cwd(),g=JSON.parse(fs.readFileSync('UVA/info/assets/geometry.json'));
const {outline,visibleRidges,contours}=require(root+'/UVA/info/src/outline-paths.cjs');
const old=fs.readFileSync('UVA/uva-outline-10x8.svg','utf8'),svg=outline(g);
const source=fs.readFileSync('UVA/info/src/build.cjs','utf8');
const paths=lines=>lines.map(l=>`<path d="${l.d}"/>`).join('');
const legacy=eval('('+source.match(/function legacyOutline\(g\)\{[^\n]+/)[0]+')');
const geometryText=fs.readFileSync('UVA/info/assets/geometry.json','utf8');
console.log({legacy:hash(legacy(g)),geometryLF:hash(geometryText.replace(/\r\n/g,'\n'))});
assert(!/clipPath|clip-path|<image/.test(svg));
assert(svg.includes('width="10in" height="8in" viewBox="0 0 720 576"'));
assert(svg.includes('d="M0 0H720V576H0Z" fill="none" stroke="none"'));
for(const l of g.lines)assert(svg.includes(`<path d="${l.d}"/>`));
const {Resvg}=require(root+'/assets/tools/vector-tools/node_modules/@resvg/resvg-js');
const {PNG}=require(root+'/assets/tools/vector-tools/node_modules/pngjs');
const render=s=>PNG.sync.read(new Resvg(s,{fitTo:{mode:'width',value:3000}}).render().asPng());
const before=render(old),after=render(svg);let changed=0,total=0,deepInside=0;
const mountainSvg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 800"><g fill="none" stroke="black" stroke-width="2.7777777777777777">${visibleRidges(g).map(d=>`<path d="${d}"/>`).join('')}</g></svg>`;
const mountains=render(mountainSvg),mask=render(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 800"><path d="${g.silhouette}" fill-rule="evenodd"/></svg>`);
for(let y=0;y<2400;y++)for(let x=0;x<3000;x++){
 const i=(y*3000+x)*4;
 if(before.data[i+3]!==after.data[i+3])changed++;
 if(after.data[i+3])total++;
 if(mountains.data[i+3]&&x>6&&x<2994&&y>6&&y<2394){
  let interior=true;for(const [dx,dy]of [[0,0],[-6,0],[6,0],[0,-6],[0,6]])if(mask.data[((y+dy)*3000+x+dx)*4+3]!==255)interior=false;
  if(interior)deepInside++;
 }
}
assert.equal(deepInside,0,'Mountain strokes inside emblem');
assert(changed<1000,'Unexpected visible geometry change');
console.log({outlinePixels:[after.width,after.height],changedAlphaPixels:changed,visiblePixels:total,mountainPixelsInsideEmblem:deepInside,allEmblemPathsPreserved:true});
