$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$kits=@(@('Fox Fall','fox-fall'),@('Ghost Fall','ghost-fall'),@('Kat In Pumpkin','kat-in-pumpkin'),@('pumpkin','pumpkin'))
foreach($k in $kits){
 $dir=Join-Path (Get-Location) $k[0];$tmp=Join-Path $dir 'tmp/8x10-artwork';$out=Join-Path $dir 'output/pdf/8x10';$base=$k[1]+'-painting-guide-8x10'
 $render=Join-Path $tmp ($base+'-render.png');$bytes=[IO.File]::ReadAllBytes($render);if([BitConverter]::ToString($bytes,0,8) -ne '89-50-4E-47-0D-0A-1A-0A'){throw 'Renderer did not produce PNG'}
 Copy-Item -LiteralPath (Join-Path $tmp ($base+'.pdf')) -Destination (Join-Path $out ($base+'.pdf'))
 Copy-Item -LiteralPath $render -Destination (Join-Path $out ($base+'.png'))
 Copy-Item -LiteralPath (Join-Path $tmp 'canonical-outline.png') -Destination (Join-Path $dir ($k[1]+'-outline.png'))
 $sheet=New-Object Drawing.Bitmap(1200,400);$g=[Drawing.Graphics]::FromImage($sheet);$g.Clear([Drawing.Color]::White);$x=0
 foreach($name in @('canonical-outline.png','step-5.png','registered-reference.png')){$im=[Drawing.Image]::FromFile((Join-Path $tmp $name));$g.DrawImage($im,$x,0,400,400);$im.Dispose();$x+=400};$sheet.Save((Join-Path $tmp 'geometry-contact-sheet.png'),[Drawing.Imaging.ImageFormat]::Png);$g.Dispose();$sheet.Dispose()
 foreach($kind in @('outline','finished-reference')){$p=Join-Path $out ($k[1]+'-'+$kind+'-8x10.png');$im=[Drawing.Image]::FromFile($p);if($im.Width -ne 2400 -or $im.Height -ne 3000 -or [Math]::Abs($im.HorizontalResolution-300)-gt .1){throw ('Wrong print PNG '+$p)};$im.Dispose()}
 Write-Output ($k[0]+': six deliverables verified and saved')
}
