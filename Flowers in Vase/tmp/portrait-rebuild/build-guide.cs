using System;using System.IO;using System.Drawing;using System.Drawing.Drawing2D;using System.Drawing.Imaging;using System.Drawing.Text;
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
string[] titles={"Prepare your canvas","Turquoise background","Block in the greenery","Paint the vase bands","Soft blush blooms","Warm apricot petals","The rose-red flower","Golden buds & centers","Blend the petals","Leaf & vase highlights","Berries & final details","Dry flat & clean up"};
string[] captions={
"Start with the printed outline. Protect your table. Use thin coats; rinse and blot your brush between colors.",
"Mix turquoise with a little white. Paint around the bouquet and vase with short, loose strokes. Let dry.",
"Mix green with a little brown. Fill leaves and spaces between flowers. Keep the petals, centers and berries white.",
"Mix blue with a little black for navy. Alternate navy and white bands, starting at the top. Follow the curves; let dry.",
"Mix white with a little rose red for blush. Fill the upper-left and lower-right blooms. Leave their centers white.",
"Mix orange with white for apricot. Fill the upper-right flower with curved strokes. Leave its center white.",
"Use rose red for the five central petals. Pull strokes from each petal tip toward the center. Leave the center white.",
"Mix yellow with a touch of brown for gold. Paint the small buds and all flower centers. Let every base coat dry.",
"Shade pink with rose red; apricot with orange; red with rose red + brown. Add white to each for highlights. Feather wet edges with a clean, damp brush.",
"Mix green + yellow for leaf highlights; blue + a little black + white for vase streaks; white + a speck of brown for white-band shadows. Follow the curves.",
"Mix blue with a little black for berries. Add white to this mix for shine dots. Shade the yellow centers with brown; dot with yellow and white.",
"Let the completed canvas dry lying flat. Wash and reshape brushes, wipe your palette, and close the paint pots."};
File.WriteAllLines(root+"/tmp/portrait-rebuild/captions.txt",captions);
var page=new Bitmap(2550,3300);page.SetResolution(300,300);using(var g=Graphics.FromImage(page)){g.Clear(Color.White);g.ScaleTransform(2550f/612,3300f/792);g.SmoothingMode=SmoothingMode.AntiAlias;g.InterpolationMode=InterpolationMode.HighQualityBicubic;g.TextRenderingHint=TextRenderingHint.AntiAliasGridFit;
g.DrawImage(edition,38,27,64,80);g.FillEllipse(B(Color.FromArgb(239,247,247)),116,32,315,64);Txt(g,"P A I N T   N I G H T",133,24,275,8,true,teal);g.DrawString("Flowers in Vase",new Font("Gabriola",36,FontStyle.Regular,GraphicsUnit.Pixel),B(navy),117,35);Txt(g,"ACRYLIC PAINTING GUIDE",135,88,270,8,true);
string logoPath=root+"/assets/river-and-ridge-logo-page.png";var logo=new Bitmap(File.Exists(logoPath)?logoPath:Path.GetFullPath(root+"/../assets/images/river-and-ridge-logo.png"));g.DrawImage(logo,437,39,145,145f*logo.Height/logo.Width);
g.FillRectangle(B(Color.FromArgb(236,245,245)),30,119,552,71);Txt(g,"MATERIALS",40,126,105,9,true);Txt(g,"Preprinted 8 x 10 canvas, acrylic paints, large & small brushes,",122,125,449,8.5f);Txt(g,"water cup, paper towels, palette or paper plate.",122,138,449,8.5f);Txt(g,"PAINTS",40,157,80,9,true);Txt(g,"White, black, turquoise, blue, green, rose red, yellow, orange, brown",122,157,449,8.4f);Txt(g,"Use rose red from the paint list for all pink mixtures.",122,172,449,7.5f,false,teal);
for(int i=0;i<12;i++){int col=i%4,row=i/4;float x=30+col*141,y=202+row*178;float ratio=Math.Min(129f/panels[i].Width,101f/panels[i].Height);float pw=panels[i].Width*ratio,ph=panels[i].Height*ratio;g.DrawImage(panels[i],x+(129-pw)/2,y+(101-ph)/2,pw,ph);g.FillEllipse(B(navy),x+3,y+3,20,20);g.DrawString((i+1).ToString("00"),F(10,true),Brushes.White,x+6,y+6);Txt(g,titles[i],x,y+107,133,9,true);var f=F(8.3f);var sz=g.MeasureString(captions[i],f,129);if(sz.Height>61)throw new Exception("Caption overflow "+(i+1)+" "+sz.Height);g.DrawString(captions[i],f,B(navy),new RectangleF(x,y+123,129,61));if(row<2)g.DrawLine(new Pen(Color.FromArgb(217,231,231),.5f),x,y+174,x+129,y+174);}
g.FillRectangle(B(Color.FromArgb(236,245,245)),30,749,552,18);Txt(g,"Thin coats  /  Dry between layers  /  Let your brush follow each curve",94,752,480,8,false,teal);
}page.Save(root+"/tmp/portrait-rebuild/guide-page.png",ImageFormat.Png);var preview=new Bitmap(page,850,1100);preview.Save(root+"/tmp/portrait-rebuild/guide-preview.png",ImageFormat.Png);
Console.WriteLine("Portrait guide built with existing Flowers layout; captions fit.");
}
}
