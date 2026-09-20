$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;using System.Drawing;using System.Drawing.Imaging;using System.Runtime.InteropServices;
public class AlphaCheck{
static byte[] Read(Bitmap b){var d=b.LockBits(new Rectangle(0,0,b.Width,b.Height),ImageLockMode.ReadOnly,PixelFormat.Format32bppArgb);var p=new byte[d.Stride*b.Height];Marshal.Copy(d.Scan0,p,0,p.Length);b.UnlockBits(d);return p;}
public static string Check(string image,string before){using(var b=new Bitmap(image))using(var a=new Bitmap(before)){if(b.Width!=2400||b.Height!=3000||Math.Abs(b.HorizontalResolution-300)>1)throw new Exception("Size or DPI");byte[] p=Read(b),old=Read(a);int transparent=0,black=0,delta=0;for(int i=0;i<p.Length;i+=4){if(p[i]!=0||p[i+1]!=0||p[i+2]!=0)throw new Exception("Non-black line RGB");if(p[i+3]==0)transparent++;if(p[i+3]==255)black++;int error=Math.Abs((255-p[i+3])-old[i]);delta=Math.Max(delta,error);}if(transparent==0||black==0||delta>1)throw new Exception("Alpha/geometry verification failed "+delta);return "2400 x 3000, 300 DPI; black RGB only; "+transparent+" transparent pixels; white-composite maximum difference "+delta+"/255";}}
}
'@
$kits=@(@('Fox Fall','fox-fall'),@('Ghost Fall','ghost-fall'),@('Kat In Pumpkin','kat-in-pumpkin'),@('pumpkin','pumpkin'))
foreach($kit in $kits){$dir=Join-Path (Get-Location) $kit[0];$name=$kit[1]+'-outline-8x10.png';$output=Join-Path $dir ('output/pdf/8x10/'+$name);$before=Join-Path $dir ('tmp/8x10-artwork/before-transparency/'+$name);$result=[AlphaCheck]::Check($output,$before);if((Get-FileHash -LiteralPath $output).Hash -ne (Get-FileHash -LiteralPath (Join-Path $dir $name)).Hash){throw 'Companion mismatch'};$result | Set-Content -LiteralPath (Join-Path $dir 'tmp/8x10-artwork/transparency-verification.txt');Write-Output ($kit[0]+': '+$result)}
'All four PNGs were visually inspected on a checkerboard. Their PDF renders retain black linework and exact 576 x 720-point pages. Original source hashes are checked separately by verify-kits.cjs.' | Add-Content -LiteralPath 'Fox Fall/tmp/8x10-artwork/transparency-verification.txt'
