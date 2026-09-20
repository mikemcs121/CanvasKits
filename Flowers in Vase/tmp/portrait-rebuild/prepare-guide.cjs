const fs=require('fs'),path=require('path');
const kit=path.resolve(__dirname,'../..');
const old=fs.readFileSync(path.join(kit,'tmp/8x10/build.cs'),'utf8');
const layout=old.slice(old.indexOf('string[] titles='),old.indexOf('// Geometry evidence:')).replaceAll('/tmp/8x10/','/tmp/portrait-rebuild/');
const prefix=`using System;using System.IO;using System.Drawing;using System.Drawing.Drawing2D;using System.Drawing.Imaging;using System.Drawing.Text;
public class PortraitGuide{
static string root;static Color navy=Color.FromArgb(27,57,75),teal=Color.FromArgb(52,137,139);
static Brush B(Color c){return new SolidBrush(c);}static Font F(float s,bool bold=false){return new Font("Segoe UI",s,bold?FontStyle.Bold:FontStyle.Regular,GraphicsUnit.Pixel);}
static void Txt(Graphics g,string s,float x,float y,float width,float size,bool bold=false,Color? col=null){g.DrawString(s,F(size,bold),B(col??navy),new RectangleF(x,y,width,100));}
static void Cue(Graphics g,float x,float y,float dx,float dy){var pen=new Pen(Color.FromArgb(108,68,37),5);pen.StartCap=LineCap.Round;g.DrawLine(pen,x+dx,y+dy,x,y);g.DrawLine(new Pen(Color.Silver,5),x,y,x-dx*.18f,y-dy*.18f);g.DrawLine(new Pen(Color.FromArgb(230,201,148),3),x-dx*.18f,y-dy*.18f,x-dx*.32f,y-dy*.32f);}
static Bitmap Crop(Bitmap b,Rectangle r){return b.Clone(r,PixelFormat.Format32bppArgb);}
public static void Run(string r){root=r;var paint=new Bitmap(root+"/assets/portrait-rebuild/finished-reference-canonical.png");var edition=paint;var stages=new Bitmap[12];for(int s=1;s<=11;s++)stages[s]=new Bitmap(root+"/assets/portrait-rebuild/stage-"+s.ToString("00")+".png");
var panels=new Bitmap[12];for(int i=0;i<8;i++)panels[i]=stages[i+1];panels[8]=Crop(stages[9],new Rectangle(540,480,400,340));panels[9]=Crop(stages[10],new Rectangle(0,650,800,730));panels[10]=Crop(stages[11],new Rectangle(790,740,330,480));
for(int i=8;i<11;i++){using(var cg=Graphics.FromImage(panels[i])){cg.SmoothingMode=SmoothingMode.AntiAlias;if(i==8)Cue(cg,192,122,100,100);if(i==9)Cue(cg,400,370,200,140);if(i==10)Cue(cg,108,245,100,100);}panels[i].Save(root+"/assets/portrait-rebuild/panel-"+(i+1)+".png",ImageFormat.Png);}
var dry=new Bitmap(600,500);using(var dg=Graphics.FromImage(dry)){dg.Clear(Color.FromArgb(235,231,222));dg.SmoothingMode=SmoothingMode.AntiAlias;dg.InterpolationMode=InterpolationMode.HighQualityBicubic;dg.FillPolygon(B(Color.FromArgb(198,194,184)),new PointF[]{new PointF(90,47),new PointF(374,70),new PointF(347,434),new PointF(62,412)});dg.DrawImage(paint,new PointF[]{new PointF(94,30),new PointF(376,53),new PointF(66,406)},new RectangleF(0,0,paint.Width,paint.Height),GraphicsUnit.Pixel);for(int i=0;i<4;i++){dg.FillEllipse(B(new[]{teal,navy,Color.FromArgb(217,150,51),Color.FromArgb(176,63,92)}[i]),460,80+i*72,52,52);dg.DrawEllipse(new Pen(Color.White,4),460,80+i*72,52,52);dg.DrawEllipse(new Pen(Color.FromArgb(110,110,100),2),465,85+i*72,42,42);}Cue(dg,462,381,92,50);Cue(dg,450,414,92,50);}panels[11]=dry;dry.Save(root+"/assets/portrait-rebuild/panel-12.png",ImageFormat.Png);
`;
fs.writeFileSync(path.join(__dirname,'build-guide.cs'),prefix+layout+'Console.WriteLine("Portrait guide built with existing Flowers layout; captions fit.");\n}\n}\n');
let pdf=fs.readFileSync(path.join(kit,'tmp/8x10/export-guide.cjs'),'utf8').replaceAll('tmp/8x10/guide-page.png','tmp/portrait-rebuild/guide-page.png');fs.writeFileSync(path.join(__dirname,'export-guide.cjs'),pdf);
let render=fs.readFileSync(path.join(kit,'tmp/8x10/render.ps1'),'utf8').replaceAll('/tmp/8x10','/tmp/portrait-rebuild');fs.writeFileSync(path.join(__dirname,'render.ps1'),render);
