const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'../../../..');
const {Resvg}=require(path.join(root,'Fox Fall/info/tmp/vector-tools/node_modules/@resvg/resvg-js'));
const svg=fs.readFileSync(path.join(root,'Cat in Pumpkin/cat-in-pumpkin-outline-8x10.svg'));
fs.writeFileSync(path.join(__dirname,'unchanged-outline-render.png'),new Resvg(svg,{fitTo:{mode:'width',value:2400}}).render().asPng());
