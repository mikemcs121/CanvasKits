Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;using System.IO;using System.Drawing;using System.Drawing.Imaging;using System.Collections.Generic;
public class BlendPetals{
public static void Run(string root){var old=new Bitmap(root+"/flowers-in-vase-finished-reference.png");var gen=new Bitmap(root+"/assets/flowers-in-vase-blended-generated.png");int w=old.Width,h=old.Height;var edit=new Bitmap(gen,w,h);var result=new Bitmap(old);int[] ids=new int[w*h],group=new int[300];using(var br=new BinaryReader(File.OpenRead(root+"/tmp/regions.bin"))){br.ReadInt32();br.ReadInt32();for(int i=0;i<ids.Length;i++)ids[i]=br.ReadInt32();}foreach(var row in File.ReadAllLines(root+"/tmp/groups.csv")){var a=row.Split(',');group[int.Parse(a[0])]=int.Parse(a[1]);}var buds=new HashSet<int>(new[]{67,79,83,87,90,91,96,105,119,120,122,130,131});byte[] mask=new byte[w*h];for(int i=0;i<ids.Length;i++){int id=ids[i];if(id>0){if(group[id]>=5&&group[id]<=7)mask[i]=9;else if(buds.Contains(id))mask[i]=11;}}
for(int y=0;y<h;y++)for(int x=0;x<w;x++){int i=y*w+x;if(ids[i]==-1 || (ids[i]>0 && group[ids[i]]==0)){int stage=0;bool other=false;for(int dy=-5;dy<=5;dy++)for(int dx=-5;dx<=5;dx++){int xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=w||yy>=h)continue;int j=yy*w+xx;if(ids[j]<=0 || group[ids[j]]==0)continue;if(mask[j]==0)other=true;else stage=Math.Max(stage,mask[j]);}if(!other&&stage>0)mask[i]=(byte)stage;}if(mask[i]>0)result.SetPixel(x,y,edit.GetPixel(x,y));}
result.Save(root+"/flowers-in-vase-finished-reference-blended.png",ImageFormat.Png);File.WriteAllBytes(root+"/tmp/petal-blend-mask.bin",mask);var preview=new Bitmap(result,850,850);preview.Save(root+"/tmp/blended-reference-preview.png",ImageFormat.Png);Console.WriteLine("Blended petal treatment composited within original flower masks; other pixels preserved.");}
}
'@
[BlendPetals]::Run((Resolve-Path "$PSScriptRoot/..").Path)

