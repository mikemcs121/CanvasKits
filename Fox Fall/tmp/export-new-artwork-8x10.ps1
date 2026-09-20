Add-Type -AssemblyName System.Drawing
$ErrorActionPreference='Stop'
$root=(Get-Location).Path
$kits=@(
 @{folder='Fox Fall';slug='fox-fall';source='download.png'},
 @{folder='Ghost Fall';slug='ghost-fall';source='exec-8b4604c1-f90d-4ddd-959b-56e4dd2b270f.png'},
 @{folder='Kat In Pumpkin';slug='kat-in-pumpkin';source='exec-01c35205-b359-4887-a7f9-a31e173a5e1f.png'},
 @{folder='pumpkin';slug='pumpkin';source='exec-dd3ad511-2377-40d8-bb15-dd9d9771fcbc.png'}
)
foreach($kit in $kits){
 $dir=Join-Path $root $kit.folder
 $tmp=Join-Path $dir 'tmp/8x10-artwork'
 $out=Join-Path $dir 'output/pdf/8x10'
 New-Item -ItemType Directory -Path $tmp,$out -Force | Out-Null
 $checks=@()
 foreach($kind in @('outline','finished-reference')){
  $source=if($kind -eq 'outline'){Join-Path $tmp 'canonical-outline.png'}else{Join-Path $tmp 'registered-reference.png'}
  $im=[Drawing.Image]::FromFile($source)
  $canvas=New-Object Drawing.Bitmap(2400,3000,[Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $canvas.SetResolution(300,300)
  $g=[Drawing.Graphics]::FromImage($canvas)
  $g.Clear([Drawing.Color]::White)
  $g.InterpolationMode=[Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode=[Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  # Identical proportional placement for both companions; retain the complete source frame.
  # 7.6-inch-wide square centered on 8 x 10, without cropping or stretching.
  $g.DrawImage($im,[Drawing.Rectangle]::new(60,360,2280,2280),0,0,$im.Width,$im.Height,[Drawing.GraphicsUnit]::Pixel)
  $name=$kit.slug+'-'+$kind+'-8x10'
  $canvas.Save((Join-Path $tmp ($name+'.bmp')),[Drawing.Imaging.ImageFormat]::Bmp)
  $canvas.Save((Join-Path $out ($name+'.png')),[Drawing.Imaging.ImageFormat]::Png)
  Copy-Item -LiteralPath (Join-Path $out ($name+'.png')) -Destination (Join-Path $dir ($name+'.png'))
  $checks+=@{kind=$kind;source=$source;sourceHash=(Get-FileHash -LiteralPath $source).Hash;output=$name+'.png';pixels=@(2400,3000);dpi=300;placementPixels=@(60,360,2280,2280);sourcePixels=@($im.Width,$im.Height)}
  $g.Dispose();$canvas.Dispose();$im.Dispose()
 }
 $checks | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $tmp 'export-checks.json')
 Write-Output ($kit.folder+': 8 x 10 PNG pair exported')
}
# Transfer PNGs use black linework and alpha, while BMP intermediates stay white for print previews.
& powershell -NoProfile -ExecutionPolicy Bypass -File "$PSScriptRoot/transparent-outlines.ps1"
if($LASTEXITCODE -ne 0){throw 'Transparent outline export failed'}
