const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'../../..'),A=path.join(root,'turtle/info/assets'),out=path.join(root,'tmp/turtle');
const {Resvg}=require(path.join(root,'assets/tools/vector-tools/node_modules/@resvg/resvg-js'));
const Jimp=require(path.join(root,'assets/tools/vector-tools/node_modules/jimp'));
const g=JSON.parse(fs.readFileSync(path.join(A,'geometry.json'))),p=JSON.parse(fs.readFileSync(path.join(A,'paint-plan.json')));
const lines=g.centerlinePaths.map(d=>`<path d="${d}"/>`).join(''),eyes=g.solidBoundaryPaths.map(d=>`<path d="${d}" fill-rule="evenodd"/>`).join('');
const uri=f=>'data:image/png;base64,'+fs.readFileSync(f).toString('base64');
const regions=JSON.parse(fs.readFileSync(path.join(A,'regions.json'))),bubbleIds=[1,2,3,4,5,9,37,41,58,61,64,66,67,72];
const bubbles=regions.filter(r=>bubbleIds.includes(r.id)).map(r=>{const [x0,y0,x1,y1]=r.box,cx=(x0+x1)/2,cy=(y0+y1)/2,rx=(x1-x0)/2+4,ry=(y1-y0)/2+4;return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="white" stroke-width="4"/><path d="M${cx-rx*.65} ${cy-ry*.12} Q${cx-rx*.68} ${cy-ry*.6} ${cx-rx*.18} ${cy-ry*.72}" fill="none" stroke="white" stroke-width="7" stroke-linecap="round"/>`;}).join('');
const face=g.centerlinePaths.filter(d=>{const v=d.match(/[-+]?\d*\.?\d+/g).map(Number),xs=v.filter((_,i)=>i%2===0),ys=v.filter((_,i)=>i%2);const x=Math.min(...xs),xx=Math.max(...xs),y=Math.min(...ys),yy=Math.max(...ys);return (x<195&&xx<200&&y>420&&yy<575)||(x>260&&xx<310&&y>392&&yy<430);}).map(d=>`<path d="${d}"/>`).join('');
async function main(){
for(let stage=1;stage<=6;stage++){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="8in" height="10in" viewBox="0 0 576 720"><image width="576" height="720" href="${uri(path.join(A,'water-background.png'))}"/><g transform="translate(${g.translate.join(' ')}) scale(${g.scale})"><image width="1024" height="1536" href="${uri(path.join(out,'paint-'+stage+'.png'))}"/><g fill="none" stroke="${stage>=5?p.colors['dark-green']:'#808080'}" stroke-width="${1.1/g.scale}" stroke-linecap="round" stroke-linejoin="round">${lines}${eyes}</g>${stage>=5?`<g fill="${p.colors.black}">${eyes}</g><g fill="none" stroke="${p.colors.black}" stroke-width="${1.8/g.scale}" stroke-linecap="round">${face}</g>${bubbles}`:''}</g></svg>`;
 fs.writeFileSync(path.join(out,`stage-${stage}.svg`),svg);
 fs.writeFileSync(path.join(A,`stage-${String(stage).padStart(2,'0')}.png`),new Resvg(svg,{fitTo:{mode:'width',value:2400}}).render().asPng());
 if(stage===6){fs.writeFileSync(path.join(A,'reference-master.svg'),svg);fs.copyFileSync(path.join(A,'stage-06.png'),path.join(A,'reference-master.png'));}
}
// Preserve the user-selected river-turtle logo on every ordinary rebuild.
if(!fs.existsSync(path.join(A,'page-logo.png'))){
const logo=await Jimp.read(path.join(root,'assets/images/river-and-ridge-logo.png'));
logo.scan(0,0,logo.bitmap.width,logo.bitmap.height,function(x,y,i){const d=this.bitmap.data,r=d[i],g=d[i+1],b=d[i+2];if(!d[i+3])return;if(r>210&&g>180&&b<r-20){d[i]=243;d[i+1]=250;d[i+2]=205;}else if(b>r*1.3&&b>g*.95){d[i]=45;d[i+1]=155;d[i+2]=200;}});
await logo.writeAsync(path.join(A,'page-logo.png'));
}
const sheet=new Jimp(1440,1200,0xffffffff);for(let i=1;i<=6;i++){const im=await Jimp.read(path.join(A,`stage-${String(i).padStart(2,'0')}.png`));im.resize(480,600,Jimp.RESIZE_BICUBIC);sheet.composite(im,((i-1)%3)*480,Math.floor((i-1)/3)*600);}await sheet.writeAsync(path.join(out,'stages.png'));
}
main().catch(e=>{console.error(e);process.exitCode=1});
