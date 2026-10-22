const fs=require('fs'),path=require('path'),cp=require('child_process');
const root=path.resolve(__dirname,'../..'),{Resvg}=require(path.join(root,'assets/tools/vector-tools/node_modules/@resvg/resvg-js'));
const before=JSON.parse(fs.readFileSync(path.join(__dirname,'before-geometry.json'))),g=JSON.parse(fs.readFileSync(path.join(root,'Owl/info/assets/geometry.json'))),removed=JSON.parse(fs.readFileSync(path.join(__dirname,'removed-paths.json')));
if(JSON.stringify(before.centerlinePaths.filter(d=>!removed.includes(d)))!==JSON.stringify(g.centerlinePaths))throw Error('Unexpected path edit');
for(const k of ['sourceSize','scale','translate','solidBoundaryPaths'])if(JSON.stringify(before[k])!==JSON.stringify(g[k]))throw Error('Unexpected geometry change: '+k);
for(const pt of [2,3]){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="8in" height="10in" viewBox="0 0 576 720"><g transform="translate(${g.translate.join(' ')}) scale(${g.scale})" fill="none" stroke="black" stroke-width="${pt/g.scale}" stroke-linecap="round" stroke-linejoin="round">${removed.map(d=>`<path d="${d}"/>`).join('')}</g></svg>`;
 fs.writeFileSync(path.join(__dirname,`allowed-${pt}pt.png`),new Resvg(svg,{fitTo:{mode:'width',value:2400}}).render().asPng());
}
const previous=cp.execFileSync('git',['-c','safe.directory='+root.replaceAll('\\','/'),'show','f9d0faf:Owl/owl-outline-8x10.svg'],{cwd:root});
fs.writeFileSync(path.join(__dirname,'before-outline.png'),new Resvg(previous,{fitTo:{mode:'width',value:2400}}).render().asPng());
console.log('Only the eight selected woodgrain paths were removed.');
