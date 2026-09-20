$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;using System.Drawing;using System.Drawing.Drawing2D;using System.Drawing.Imaging;using System.Runtime.InteropServices;
public class Outline600 {
public static void Export(string source,string output,string preview){
using(var src=new Bitmap(source))using(var target=new Bitmap(4800,6000,PixelFormat.Format32bppArgb)){
target.SetResolution(600,600);
using(var g=Graphics.FromImage(target)){g.Clear(Color.Transparent);g.CompositingMode=CompositingMode.SourceCopy;g.CompositingQuality=CompositingQuality.HighQuality;g.InterpolationMode=InterpolationMode.HighQualityBicubic;g.PixelOffsetMode=PixelOffsetMode.HighQuality;g.DrawImage(src,new Rectangle(120,720,4560,4560),0,0,src.Width,src.Height,GraphicsUnit.Pixel);}
// Black RGB with alpha edges prevents white halos against any upload preview background.
var data=target.LockBits(new Rectangle(0,0,target.Width,target.Height),ImageLockMode.ReadWrite,PixelFormat.Format32bppArgb);var row=new byte[data.Stride];long clear=0,ink=0;
for(int y=0;y<target.Height;y++){var ptr=IntPtr.Add(data.Scan0,y*data.Stride);Marshal.Copy(ptr,row,0,row.Length);for(int x=0;x<target.Width;x++){int p=x*4;row[p]=row[p+1]=row[p+2]=0;if(row[p+3]==0)clear++;if(row[p+3]==255)ink++;}Marshal.Copy(row,0,ptr,row.Length);}target.UnlockBits(data);if(clear==0||ink==0)throw new Exception("Transparency/line polarity failed");target.Save(output,ImageFormat.Png);
using(var p=new Bitmap(400,500)){using(var g=Graphics.FromImage(p)){g.Clear(Color.White);for(int y=0;y<500;y+=20)for(int x=0;x<400;x+=20)if((x/20+y/20)%2==0)g.FillRectangle(Brushes.LightGray,x,y,20,20);g.InterpolationMode=InterpolationMode.HighQualityBicubic;g.DrawImage(target,new Rectangle(0,0,400,500),0,0,target.Width,target.Height,GraphicsUnit.Pixel);}p.Save(preview,ImageFormat.Png);}
Console.WriteLine("Verified "+clear+" transparent pixels and "+ink+" solid black pixels.");
}
using(var check=new Bitmap(output)){if(check.Width!=4800||check.Height!=6000||Math.Abs(check.HorizontalResolution-600)>1||Math.Abs(check.VerticalResolution-600)>1||check.GetPixel(0,0).A!=0)throw new Exception("Saved PNG dimensions/DPI/alpha failed");}
}
}
'@
$kits=@(@('Fox Fall','fox-fall'),@('Ghost Fall','ghost-fall'),@('Kat In Pumpkin','kat-in-pumpkin'),@('pumpkin','pumpkin'))
$checks=@()
foreach($k in $kits){
 $folder=Join-Path (Get-Location) $k[0];$slug=$k[1];$name=$slug+'-outline-8x10-600dpi.png'
 $source=Join-Path $folder ($slug+'-outline.png');$output=Join-Path $folder ('output/pdf/8x10/'+$name);$preview=Join-Path $folder 'tmp/8x10-artwork/outline-600dpi-review.png'
 [Outline600]::Export($source,$output,$preview)
 Copy-Item -LiteralPath $output -Destination (Join-Path $folder $name)
 $checks+=@{kit=$k[0];file=$output;source=$source;sourceSha256=(Get-FileHash -LiteralPath $source).Hash;pixels=@(4800,6000);dpi=600;inches=@(8,10);placementPixels=@(120,720,4560,4560);background='transparent';lineRGB=@(0,0,0);detail='Resampled directly from canonical outline; no new design detail';bytes=(Get-Item -LiteralPath $output).Length}
 Write-Output ($k[0]+': saved '+$name)
}
$checks | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $PSScriptRoot 'outline-600dpi-checks.json')
$sheet=[Drawing.Bitmap]::new(800,1000);$g=[Drawing.Graphics]::FromImage($sheet)
for($i=0;$i -lt 4;$i++){$im=[Drawing.Bitmap]::FromFile((Join-Path (Get-Location) ($kits[$i][0]+'/tmp/8x10-artwork/outline-600dpi-review.png')));$g.DrawImage($im,[Drawing.Rectangle]::new(($i%2)*400,([int][Math]::Floor($i/2))*500,400,500));$im.Dispose()}
$sheet.Save((Join-Path $PSScriptRoot 'outlines-600dpi-review.png'),[Drawing.Imaging.ImageFormat]::Png);$g.Dispose();$sheet.Dispose()
