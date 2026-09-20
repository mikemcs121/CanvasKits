Add-Type -AssemblyName System.Drawing
$ErrorActionPreference='Stop'
$kits=@(@('Fox Fall','fox-fall','download.png'),@('Ghost Fall','ghost-fall','exec-8b4604c1-f90d-4ddd-959b-56e4dd2b270f.png'),@('Cat in Pumpkin','cat-in-pumpkin','exec-01c35205-b359-4887-a7f9-a31e173a5e1f.png'),@('Pumkin','pumpkin','exec-dd3ad511-2377-40d8-bb15-dd9d9771fcbc.png'))
function Get-KitWorkRoot([string]$KitFolder){
 $root=Join-Path (Get-Location) $KitFolder;$relocated=Join-Path $root 'info'
 if(Test-Path -LiteralPath $relocated){return $relocated};return $root
}
function Find-KitSource([string]$KitFolder,[string]$Name){
 $root=Join-Path (Get-Location) $KitFolder;$work=Get-KitWorkRoot $KitFolder
 $candidates=@((Join-Path $root $Name),(Join-Path $work ('archive\previous-root-files\'+$Name)))
 foreach($candidate in $candidates){if(Test-Path -LiteralPath $candidate){return $candidate}}
 throw ('Required source not found. Checked: '+($candidates -join '; '))
}
foreach($k in $kits){
 $dir=Get-KitWorkRoot $k[0];$tmp=Join-Path $dir 'tmp/8x10-artwork';New-Item -ItemType Directory -Path $tmp -Force|Out-Null
 foreach($kind in @('outline','paint')){
  $src=if($kind -eq 'outline'){$k[2]}else{$k[1]+'-finished-reference.png'}
  $im=[Drawing.Image]::FromFile((Find-KitSource $k[0] $src));$b=New-Object Drawing.Bitmap(1254,1254,[Drawing.Imaging.PixelFormat]::Format24bppRgb);$g=[Drawing.Graphics]::FromImage($b);$g.Clear([Drawing.Color]::White);$g.DrawImageUnscaled($im,0,0);$b.Save((Join-Path $tmp ($kind+'.bmp')),[Drawing.Imaging.ImageFormat]::Bmp);$g.Dispose();$b.Dispose();$im.Dispose()
 }
}
