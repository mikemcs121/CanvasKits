Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System; using System.IO; using System.Drawing; using System.Drawing.Imaging; using System.Collections.Generic;
public class Regions {
 public static void Run(string root) {
 var im=new Bitmap(root+"/flowers-in-vase-outline.png"); int w=im.Width,h=im.Height; int[] ids=new int[w*h]; var q=new int[w*h]; int n=0; var rows=new List<string>();
 for(int y=0;y<h;y++)for(int x=0;x<w;x++) {var c=im.GetPixel(x,y); if(c.R<180)ids[y*w+x]=-1;}
 var dbg=new Bitmap(im); var g=Graphics.FromImage(dbg); var font=new Font("Arial",16,FontStyle.Bold); var rng=new Random(9);
 for(int i=0;i<ids.Length;i++)if(ids[i]==0){n++;int head=0,tail=1; q[0]=i;ids[i]=n; long sx=0,sy=0; int minx=w,miny=h,maxx=0,maxy=0;
 while(head<tail){int p=q[head++],x=p%w,y=p/w;sx+=x;sy+=y; minx=Math.Min(minx,x);maxx=Math.Max(maxx,x);miny=Math.Min(miny,y);maxy=Math.Max(maxy,y);
 int[] ns={x>0?p-1:-1,x<w-1?p+1:-1,y>0?p-w:-1,y<h-1?p+w:-1};foreach(int j in ns)if(j>=0&&ids[j]==0){ids[j]=n;q[tail++]=j;}}
 if(tail>60){int cx=(int)(sx/tail),cy=(int)(sy/tail); var col=Color.FromArgb(rng.Next(150,250),rng.Next(150,250),rng.Next(150,250));for(int k=0;k<tail;k++)dbg.SetPixel(q[k]%w,q[k]/w,col); rows.Add(n+","+tail+","+cx+","+cy+","+minx+","+miny+","+maxx+","+maxy);}
 }
 g.Dispose(); g=Graphics.FromImage(dbg); foreach(string row in rows){var a=row.Split(','); int cx=int.Parse(a[2]),cy=int.Parse(a[3]);g.FillRectangle(Brushes.White,cx-12,cy-10,30,22);g.DrawString(a[0],font,Brushes.Black,cx-12,cy-10);} g.Dispose();dbg.Save(root+"/tmp/regions.png",ImageFormat.Png);
 File.WriteAllLines(root+"/tmp/regions.csv",rows); using(var bw=new BinaryWriter(File.Create(root+"/tmp/regions.bin"))){bw.Write(w);bw.Write(h);foreach(int id in ids)bw.Write(id);} Console.WriteLine("Regions: "+n+"; dimensions "+w+" x "+h);
 }
}
'@
[Regions]::Run((Resolve-Path "$PSScriptRoot/..").Path)
