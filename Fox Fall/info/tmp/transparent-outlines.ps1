$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition (Get-Content "$PSScriptRoot/transparent-outlines.cs" -Raw)
$kits=@(@('Fox Fall','fox-fall'),@('Ghost Fall','ghost-fall'),@('Cat in Pumpkin','cat-in-pumpkin'),@('pumpkin','pumpkin'))
foreach($kit in $kits){
 $folder=Join-Path (Get-Location) $kit[0];$slug=$kit[1];$tmp=Join-Path $folder 'tmp/8x10-artwork';$out=Join-Path $folder 'output/pdf/8x10'
 $backup=Join-Path $tmp 'before-transparency';New-Item -ItemType Directory -Force -Path $backup | Out-Null
 foreach($name in @(($slug+'-outline.png'),($slug+'-outline-8x10.png'))){if(-not(Test-Path -LiteralPath (Join-Path $backup $name))){Copy-Item -LiteralPath (Join-Path $folder $name) -Destination (Join-Path $backup $name)}}
 $name=$slug+'-outline-8x10';if(-not(Test-Path -LiteralPath (Join-Path $backup ($name+'.pdf')))){Copy-Item -LiteralPath (Join-Path $out ($name+'.pdf')) -Destination (Join-Path $backup ($name+'.pdf'))}
 [TransparentOutlines]::Convert((Join-Path $tmp 'canonical-outline.png'),(Join-Path $folder ($slug+'-outline.png')),$null)
 [TransparentOutlines]::Convert((Join-Path $tmp ($name+'.bmp')),(Join-Path $out ($name+'.png')),(Join-Path $tmp 'outline-alpha.bin'))
 Copy-Item -LiteralPath (Join-Path $out ($name+'.png')) -Destination (Join-Path $folder ($name+'.png'))
 [TransparentOutlines]::Preview((Join-Path $out ($name+'.png')),(Join-Path $tmp 'transparent-outline-review.png'))
}
