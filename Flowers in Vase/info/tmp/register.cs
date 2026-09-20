using System;using System.IO;using System.Drawing;using System.Drawing.Imaging;
public class RegisterPaint{
static bool Good(Color c,int gr){int r=c.R,g=c.G,b=c.B;switch(gr){case 1:return g>r*1.13&&b>r*1.08&&g>140&&b>115;case 2:return g>r*.87&&g>b*1.14&&r<235;case 3:return b>r*1.3&&b>g*1.03;case 4:return r>145&&g>145&&b>130&&Math.Abs(r-g)<32;case 5:return r>g*1.05&&r>b*.98&&r>135;case 6:return r>g*1.06&&g>b*1.12&&r>135;case 7:return r>g*1.4&&r>b*1.05;case 8:return r>g*.96&&g>b*1.28;}return true;}
public static void Run(string root){var src=new Bitmap(root+"/assets/flowers-in-vase-generated-color.png");var line=new Bitmap(root+"/flowers-in-vase-outline.png");int w=line.Width,h=line.Height,n=w*h;int[] ids=new int[n],groups=new int[300];using(var br=new BinaryReader(File.OpenRead(root+"/tmp/regions.bin"))){br.ReadInt32();br.ReadInt32();for(int i=0;i<n;i++)ids[i]=br.ReadInt32();}foreach(var row in File.ReadAllLines(root+"/tmp/groups.csv")){var a=row.Split(',');groups[int.Parse(a[0])]=int.Parse(a[1]);}int[] cs=new int[n],q=new int[n];bool[] done=new bool[n];int head=0,tail=0;
for(int i=0;i<n;i++){int id=ids[i],gr=id>0?groups[id]:0;var c=src.GetPixel(i%w,i/w);if(gr==1&&!Good(c,gr))c=src.GetPixel(850+(i%w)%180,1050+(i/w)%180);if(id>0&&gr>0&&Good(c,gr)){cs[i]=c.ToArgb();done[i]=true;q[tail++]=i;}}
// Extend valid painted texture to the exact boundary of each named region.
while(head<tail){int p=q[head++],x=p%w,y=p/w;int[] ns={x>0?p-1:-1,x<w-1?p+1:-1,y>0?p-w:-1,y<h-1?p+w:-1};foreach(int j in ns)if(j>=0&&!done[j]&&ids[j]==ids[p]){cs[j]=cs[p];done[j]=true;q[tail++]=j;}}
// Tiny antialias islands and printed line pixels borrow only adjacent registered color.
head=0;tail=0;for(int i=0;i<n;i++)if(done[i])q[tail++]=i;
while(head<tail){int p=q[head++],x=p%w,y=p/w;int[] ns={x>0?p-1:-1,x<w-1?p+1:-1,y>0?p-w:-1,y<h-1?p+w:-1};foreach(int j in ns)if(j>=0&&!done[j]){cs[j]=cs[p];done[j]=true;q[tail++]=j;}}
var dst=new Bitmap(w,h);for(int y=0;y<h;y++)for(int x=0;x<w;x++){int i=y*w+x;var c=Color.FromArgb(cs[i]);if(ids[i]==-1){double f=.70+.30*line.GetPixel(x,y).R/255.0;c=Color.FromArgb((int)(c.R*f),(int)(c.G*f),(int)(c.B*f));}dst.SetPixel(x,y,c);}dst.Save(root+"/flowers-in-vase-finished-reference.png",ImageFormat.Png);Console.WriteLine("Registered painted textures to locked masks.");}
}
