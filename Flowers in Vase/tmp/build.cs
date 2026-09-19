using System; using System.IO; using System.Drawing; using System.Drawing.Drawing2D; using System.Drawing.Imaging; using System.Drawing.Text; using System.Collections.Generic;
public class KitBuild {
static string root; static int w,h; static int[] ids,group; static byte[] petalMask; static Bitmap outline,paint; static Color navy=Color.FromArgb(27,57,75), teal=Color.FromArgb(52,137,139);
static void Set(int gr,string list){foreach(var s in list.Split(','))group[int.Parse(s)]=gr;}
static Brush B(Color c){return new SolidBrush(c);} static Font F(float s,bool bold=false){return new Font("Segoe UI",s,bold?FontStyle.Bold:FontStyle.Regular,GraphicsUnit.Pixel);}
static void Txt(Graphics g,string s,float x,float y,float width,float size,bool bold=false,Color? col=null){var f=F(size,bold); var r=new RectangleF(x,y,width,100);g.DrawString(s,f,B(col??navy),r);}
static Bitmap Stage(int stage){var b=new Bitmap(w,h); var cs=new[]{Color.White,Color.FromArgb(98,194,183),Color.FromArgb(69,112,58),Color.FromArgb(26,65,105),Color.FromArgb(244,239,224),Color.FromArgb(245,195,192),Color.FromArgb(246,166,79),Color.FromArgb(181,46,85),Color.FromArgb(235,187,51)};
for(int y=0;y<h;y++)for(int x=0;x<w;x++){int i=y*w+x, id=ids[i], gr=id>0?group[id]:0;int start=gr==1?2:gr==2?3:gr==3||gr==4?4:gr==5?5:gr==6?6:gr==7?7:gr==8?8:99;
bool textured=(gr==1&&stage>=2)||(gr>=5&&gr<=7&&stage>=9)||(gr>=2&&gr<=4&&stage>=10)||(gr==8&&stage>=11);
Color c=gr>0&&stage>=start?(textured?paint.GetPixel(x,y):cs[gr]):Color.White;
if(id==-1){var oc=outline.GetPixel(x,y); c=oc;} if(petalMask[i]>0 && stage>=petalMask[i])c=paint.GetPixel(x,y);
b.SetPixel(x,y,c);}return b;}
static void Cue(Graphics g,float x,float y,float dx,float dy){var pen=new Pen(Color.FromArgb(108,68,37),5);pen.StartCap=LineCap.Round;g.DrawLine(pen,x+dx,y+dy,x,y);g.DrawLine(new Pen(Color.Silver,5),x,y,x-dx*.18f,y-dy*.18f);g.DrawLine(new Pen(Color.FromArgb(230,201,148),3),x-dx*.18f,y-dy*.18f,x-dx*.32f,y-dy*.32f);}
static Bitmap Crop(Bitmap b,Rectangle r){return b.Clone(r,PixelFormat.Format32bppArgb);}
static void Save(Bitmap b,string name){b.Save(root+"/assets/"+name+".png",ImageFormat.Png);}
public static void Run(string r){root=r;outline=new Bitmap(root+"/flowers-in-vase-outline.png");paint=new Bitmap(root+"/flowers-in-vase-finished-reference-blended.png");w=outline.Width;h=outline.Height;petalMask=File.ReadAllBytes(root+"/tmp/petal-blend-mask.bin");group=new int[300];using(var br=new BinaryReader(File.OpenRead(root+"/tmp/regions.bin"))){br.ReadInt32();br.ReadInt32();ids=new int[w*h];for(int i=0;i<ids.Length;i++)ids[i]=br.ReadInt32();}
Set(1,"1,4,6,11,89,94,109");
Set(2,"3,5,7,8,9,13,29,33,34,58,71,78,80,81,82,84,85,92,97,98,100,102,103,106,107,112,113,116,118,123,124,128,132,135,139,140,144,147,148,153,155,156,162,165,167,179");
Set(3,"151,171,190,194,196");Set(4,"161,184,192,195");
Set(5,"2,15,16,18,23,30,46,73,86,88,108,111,115,126,138,145,157");
Set(6,"10,12,14,20,22,25,27,28,40,45,75,76");Set(7,"17,31,50,70,77");
Set(8,"32,36,37,39,41,42,43,44,51,52,53,54,55,57,59,60,61,62,63,66,67,69,74,79,83,87,90,91,96,105,119,120,122,130,131,133,136,137,141,143,146,149,150");
// Berries stay white until detail step 11. Their closed masks are revealed from the reference.
int[] berries={172,186,188,189,191,193};
var stages=new Bitmap[12]; for(int s=1;s<=11;s++){string sp=root+"/assets/stage-"+s.ToString("00")+".png";if(File.Exists(sp)&&File.GetLastWriteTimeUtc(sp)>File.GetLastWriteTimeUtc(root+"/flowers-in-vase-finished-reference-blended.png")){stages[s]=new Bitmap(sp);}else{stages[s]=Stage(s);if(s>=11)foreach(int id in berries)for(int y=0;y<h;y++)for(int x=0;x<w;x++)if(ids[y*w+x]==id)stages[s].SetPixel(x,y,paint.GetPixel(x,y));Save(stages[s],"stage-"+s.ToString("00"));}}
var panels=new Bitmap[12];for(int i=0;i<8;i++)panels[i]=stages[i+1];panels[8]=Crop(stages[9],new Rectangle(595,390,425,365));panels[9]=Crop(stages[10],new Rectangle(0,570,790,680));panels[10]=Crop(stages[11],new Rectangle(935,655,315,420));
for(int i=8;i<11;i++){var cg=Graphics.FromImage(panels[i]);cg.SmoothingMode=SmoothingMode.AntiAlias; if(i==8)Cue(cg,260,205,100,100);if(i==9)Cue(cg,380,300,230,170);if(i==10)Cue(cg,167,209,105,90);cg.Dispose();Save(panels[i],"panel-"+(i+1));}
var dry=new Bitmap(600,500);using(var dg=Graphics.FromImage(dry)){dg.Clear(Color.FromArgb(235,231,222));dg.SmoothingMode=SmoothingMode.AntiAlias;dg.FillPolygon(B(Color.FromArgb(198,194,184)),new PointF[]{new PointF(48,64),new PointF(415,91),new PointF(376,439),new PointF(20,413)});dg.DrawImage(paint,new PointF[]{new PointF(52,45),new PointF(420,73),new PointF(25,398)});for(int i=0;i<4;i++){dg.FillEllipse(B(new[]{teal,navy,Color.FromArgb(217,150,51),Color.FromArgb(176,63,92)}[i]),460,80+i*72,52,52);dg.DrawEllipse(new Pen(Color.White,4),460,80+i*72,52,52);dg.DrawEllipse(new Pen(Color.FromArgb(110,110,100),2),465,85+i*72,42,42);}Cue(dg,462,381,92,50);Cue(dg,450,414,92,50);} panels[11]=dry;Save(dry,"panel-12");
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
"Shade blush with rose red, apricot with orange, and rose red with a touch of brown. Add white for highlights. While wet, feather edges with a clean, damp brush.",
"Mix green with yellow for leaf highlights. Add white to navy for vase streaks; white with a speck of brown shades white bands. Follow the curves.",
"Mix blue with a little black for berries. Add white to this mix for shine dots. Shade gold with brown; dot with yellow and white.",
"Let the completed canvas dry lying flat. Wash and reshape brushes, wipe your palette, and close the paint pots."};
File.WriteAllLines(root+"/tmp/captions.txt",captions);
var page=new Bitmap(2550,3300);page.SetResolution(300,300);using(var g=Graphics.FromImage(page)){g.Clear(Color.White);g.ScaleTransform(2550f/612,3300f/792);g.SmoothingMode=SmoothingMode.AntiAlias;g.InterpolationMode=InterpolationMode.HighQualityBicubic;g.TextRenderingHint=TextRenderingHint.AntiAliasGridFit;
g.DrawImage(paint,30,27,80,80);g.FillEllipse(B(Color.FromArgb(239,247,247)),116,32,315,64);Txt(g,"P A I N T   N I G H T",133,24,275,8,true,teal);g.DrawString("Flowers in Vase",new Font("Gabriola",36,FontStyle.Regular,GraphicsUnit.Pixel),B(navy),117,35);Txt(g,"ACRYLIC PAINTING GUIDE",135,88,270,8,true);
string logoPath=root+"/assets/river-and-ridge-logo-page.png";var logo=new Bitmap(File.Exists(logoPath)?logoPath:Path.GetFullPath(root+"/../assets/images/river-and-ridge-logo.png"));g.DrawImage(logo,437,39,145,145f*logo.Height/logo.Width);
g.FillRectangle(B(Color.FromArgb(236,245,245)),30,119,552,71);Txt(g,"MATERIALS",40,126,105,9,true);Txt(g,"Preprinted canvas, acrylic paints, large & small brushes, water cup,",122,125,449,8.5f);Txt(g,"paper towels, palette or paper plate.",122,138,449,8.5f);Txt(g,"PAINTS",40,157,80,9,true);Txt(g,"White, black, turquoise, blue, green, rose red, yellow, orange, brown",122,157,449,8.4f);Txt(g,"Use rose red from the paint list for all pink mixtures.",122,172,449,7.5f,false,teal);
for(int i=0;i<12;i++){int col=i%4,row=i/4;float x=30+col*141,y=202+row*178;float ratio=Math.Min(129f/panels[i].Width,101f/panels[i].Height);float pw=panels[i].Width*ratio,ph=panels[i].Height*ratio;g.DrawImage(panels[i],x+(129-pw)/2,y+(101-ph)/2,pw,ph);g.FillEllipse(B(navy),x+3,y+3,20,20);g.DrawString((i+1).ToString("00"),F(10,true),Brushes.White,x+6,y+6);Txt(g,titles[i],x,y+107,133,9,true);var f=F(8.3f);var sz=g.MeasureString(captions[i],f,129);if(sz.Height>61)throw new Exception("Caption overflow "+(i+1)+" "+sz.Height);g.DrawString(captions[i],f,B(navy),new RectangleF(x,y+123,129,61));if(row<2)g.DrawLine(new Pen(Color.FromArgb(217,231,231),.5f),x,y+174,x+129,y+174);}
g.FillRectangle(B(Color.FromArgb(236,245,245)),30,749,552,18);Txt(g,"Thin coats  /  Dry between layers  /  Let your brush follow each curve",94,752,480,8,false,teal);
}page.Save(root+"/tmp/guide-page.png",ImageFormat.Png);var preview=new Bitmap(page,850,1100);preview.Save(root+"/tmp/guide-preview.png",ImageFormat.Png);
// Geometry evidence: the exact outline and representative middle stage share dimensions and line pixels.
var check=new Bitmap(w*2,h);using(var cg=Graphics.FromImage(check)){cg.DrawImage(outline,0,0,w,h);cg.DrawImage(stages[6],w,0,w,h);}check.Save(root+"/tmp/geometry-check.png",ImageFormat.Png);int bad=0;for(int y=0;y<h;y++)for(int x=0;x<w;x++)if(ids[y*w+x]==-1&&stages[6].GetPixel(x,y)!=outline.GetPixel(x,y))bad++;File.WriteAllText(root+"/tmp/geometry-result.txt","Locked dimensions: "+w+" x "+h+"\nMiddle-stage line pixel differences: "+bad+"\nClose-ups: step 9 [595,390,425,365]; step 10 [0,570,790,680]; step 11 [935,655,315,420].\nStep 12 uses the exact finished reference mapped to a flat canvas.\n");Console.WriteLine("Built guide and stages. Canonical line mismatches: "+bad);
}
}

