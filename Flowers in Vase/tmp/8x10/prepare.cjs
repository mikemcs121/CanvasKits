const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'../..');
let reg=fs.readFileSync(path.join(root,'tmp/register.cs'),'utf8')
.replace('class RegisterPaint','class RegisterPaint8')
.replace('/assets/flowers-in-vase-generated-color.png','/assets/8x10/flowers-in-vase-repaired-generated.png')
.replace('case 5:return r>g*1.05&&r>b*.98&&r>135;','case 5:return r>=g*.98&&r>=b*.97&&r>135&&(b>g*.8);')
.replace('case 6:return r>g*1.06&&g>b*1.12&&r>135;','case 6:return r>=g*.98&&g>b*1.03&&r>135;')
.replace('if(gr==1&&!Good(c,gr))c=src.GetPixel(850+(i%w)%180,1050+(i/w)%180);','')
.replace('bool[] done=new bool[n];','bool[] done=new bool[n],changed=new bool[n];')
.replace('// Extend valid painted texture','for(int i=0;i<n;i++)changed[i]=!done[i];\n// Extend valid painted texture')
.replace('var dst=new Bitmap(w,h);',`// Smooth repaired strips inside each exact region; preserve all accepted brushwork.
for(int pass=0;pass<35;pass++){var next=(int[])cs.Clone();for(int i=0;i<n;i++)if(changed[i]&&ids[i]>0){int x=i%w,y=i/w,rr=0,gg=0,bb=0,count=0;int[] ns={x>0?i-1:-1,x<w-1?i+1:-1,y>0?i-w:-1,y<h-1?i+w:-1};foreach(int j in ns)if(j>=0&&ids[j]==ids[i]){var cc=Color.FromArgb(cs[j]);rr+=cc.R;gg+=cc.G;bb+=cc.B;count++;}if(count>0)next[i]=Color.FromArgb(rr/count,gg/count,bb/count).ToArgb();}cs=next;}
var dst=new Bitmap(w,h);`)
.replace('double f=.70+.30*line.GetPixel(x,y).R/255.0;','double f=.94+.06*line.GetPixel(x,y).R/255.0;')
.replace('/flowers-in-vase-finished-reference.png','/assets/8x10/flowers-in-vase-registered-reference.png');
fs.writeFileSync(path.join(__dirname,'register.cs'),reg);
let src=fs.readFileSync(path.join(root,'tmp/build.cs'),'utf8')
.replace('class KitBuild','class KitBuild8')
.replaceAll('/flowers-in-vase-finished-reference-blended.png','/assets/8x10/flowers-in-vase-registered-reference.png')
.replaceAll('root+"/assets/"','root+"/assets/8x10/"')
.replaceAll('root+"/assets/stage-"','root+"/assets/8x10/stage-"')
.replaceAll('root+"/tmp/','root+"/tmp/8x10/')
.replace('/tmp/8x10/regions.bin','/tmp/regions.bin')
.replace('/tmp/8x10/petal-blend-mask.bin','/tmp/petal-blend-mask.bin')
.replace('panels[i]=stages[i+1]','panels[i]=Edition(stages[i+1])')
.replace('Cue(cg,260,205,100,100)','Cue(cg,180,130,100,100)')
.replace('var dry=new Bitmap(600,500);','var edition=Edition(paint); var dry=new Bitmap(600,500);')
.replace('dg.DrawImage(paint,new PointF[]{new PointF(52,45),new PointF(420,73),new PointF(25,398)})','dg.DrawImage(edition,new PointF[]{new PointF(94,30),new PointF(376,53),new PointF(66,406)})')
.replace('new PointF(48,64),new PointF(415,91),new PointF(376,439),new PointF(20,413)','new PointF(90,47),new PointF(374,70),new PointF(347,434),new PointF(62,412)')
.replace('g.DrawImage(paint,30,27,80,80)','g.DrawImage(edition,38,27,64,80)')
.replace('Preprinted canvas, acrylic paints, large & small brushes, water cup,','Preprinted 8 x 10 canvas, acrylic paints, large & small brushes,')
.replace('paper towels, palette or paper plate.','water cup, paper towels, palette or paper plate.')
.replace('Mix green with yellow for leaf highlights. Add white to navy for vase streaks; white with a speck of brown shades white bands. Follow the curves.','Mix green + yellow for leaf highlights; blue + a little black + white for vase streaks; white + a speck of brown for white-band shadows. Follow the curves.')
.replace('Shade blush with rose red, apricot with orange, and rose red with a touch of brown. Add white for highlights. While wet, feather edges with a clean, damp brush.','Shade pink with rose red; apricot with orange; red with rose red + brown. Add white to each for highlights. Feather wet edges with a clean, damp brush.')
.replace('Shade gold with brown; dot with yellow and white.','Shade the yellow centers with brown; dot with yellow and white.');
const edition=`static Bitmap Edition(Bitmap src){var b=new Bitmap(2400,3000,PixelFormat.Format24bppRgb);b.SetResolution(300,300);using(var g=Graphics.FromImage(b)){g.Clear(Color.White);g.InterpolationMode=InterpolationMode.HighQualityBicubic;g.DrawImage(src,60,360,2280,2280);}return b;}
`;
src=src.replace('static void Save(Bitmap b,string name)',edition+'static void Save(Bitmap b,string name)');
src=src.replace('var panels=new Bitmap[12];',`foreach(var item in new[]{"outline","finished-reference"}){var eb=Edition(item=="outline"?outline:paint);string name="flowers-in-vase-"+item+"-8x10";eb.Save(root+"/tmp/8x10/"+name+".png",ImageFormat.Png);eb.Save(root+"/tmp/8x10/"+name+".bmp",ImageFormat.Bmp);eb.Dispose();}
var panels=new Bitmap[12];`);
fs.writeFileSync(path.join(__dirname,'build.cs'),src);
// Reuse the original editable composition and PDF mechanics; originals stay untouched.
let pdf=fs.readFileSync(path.join(root,'tmp/export-pdf.cjs'),'utf8').replace("path.resolve(__dirname, '..')","path.resolve(__dirname, '../..')").replace('tmp/guide-page.png','tmp/8x10/guide-page.png').replace('flowers-in-vase-painting-guide-illustrated.pdf','flowers-in-vase-painting-guide-8x10.pdf');
fs.writeFileSync(path.join(__dirname,'export-guide.cjs'),pdf);
let art=fs.readFileSync(path.resolve('Fox Fall/tmp/export-new-artwork-8x10.cjs'),'utf8').replace("require('./raster.cjs')","require('../../../Fox Fall/tmp/raster.cjs')").replace("const kits=[['Fox Fall','fox-fall'],['Ghost Fall','ghost-fall'],['Kat In Pumpkin','kat-in-pumpkin'],['pumpkin','pumpkin']];","const kits=[['Flowers in Vase','flowers-in-vase']];").replaceAll('tmp/8x10-artwork','tmp/8x10').replace("path.resolve(folder,'output/pdf/8x10',name+'.pdf')","path.resolve(folder,'tmp/8x10',name+'.pdf')");
art=art.replace("require('./transparent-outline-pdfs.cjs');",'');
fs.writeFileSync(path.join(__dirname,'export-art.cjs'),art);
let render=fs.readFileSync(path.resolve('Fox Fall/tmp/render-guides.ps1'),'utf8').replace("@('Fox Fall','Ghost Fall','Kat In Pumpkin','pumpkin')","@('Flowers in Vase')").replaceAll('tmp/8x10-artwork','tmp/8x10').replace("($folder+'/output/pdf/8x10')","($folder+'/tmp/8x10')");
fs.writeFileSync(path.join(__dirname,'render.ps1'),render);
