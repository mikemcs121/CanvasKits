using System;using System.IO;using System.Drawing;using System.Drawing.Imaging;using System.Runtime.InteropServices;
public class TransparentOutlines {
public static void Convert(string source,string dest,string alphaPath){
using(var input=new Bitmap(source))using(var rgba=input.Clone(new Rectangle(0,0,input.Width,input.Height),PixelFormat.Format32bppArgb)){
rgba.SetResolution(300,300);
int w=rgba.Width,h=rgba.Height;var data=rgba.LockBits(new Rectangle(0,0,w,h),ImageLockMode.ReadWrite,PixelFormat.Format32bppArgb);byte[] pixels=new byte[data.Stride*h],alpha=new byte[w*h];Marshal.Copy(data.Scan0,pixels,0,pixels.Length);int clear=0,solid=0;
for(int y=0;y<h;y++)for(int x=0;x<w;x++){int p=y*data.Stride+x*4;int lum=(pixels[p]+pixels[p+1]+pixels[p+2]+1)/3;byte a=(byte)((pixels[p+3]*(255-lum)+127)/255);pixels[p]=pixels[p+1]=pixels[p+2]=0;pixels[p+3]=a;alpha[y*w+x]=a;if(a==0)clear++;if(a==255)solid++;}
Marshal.Copy(pixels,0,data.Scan0,pixels.Length);rgba.UnlockBits(data);if(clear==0||solid==0)throw new Exception("Missing transparency or opaque black lines");rgba.Save(dest,ImageFormat.Png);if(!String.IsNullOrEmpty(alphaPath))File.WriteAllBytes(alphaPath,alpha);Console.WriteLine(Path.GetFileName(dest)+": "+w+" x "+h+", "+clear+" transparent pixels; "+solid+" solid black pixels.");
}}
public static void Preview(string source,string destination){using(var im=new Bitmap(source))using(var b=new Bitmap(400,500)){using(var g=Graphics.FromImage(b)){g.Clear(Color.White);for(int y=0;y<500;y+=20)for(int x=0;x<400;x+=20)if((x/20+y/20)%2==0)g.FillRectangle(Brushes.LightGray,x,y,20,20);g.InterpolationMode=System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;g.DrawImage(im,0,0,400,500);}b.Save(destination,ImageFormat.Png);}}
}
