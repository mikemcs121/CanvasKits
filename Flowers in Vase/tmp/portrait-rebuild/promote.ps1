$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$kit=(Resolve-Path "$PSScriptRoot/../..").Path
$backup=Join-Path $PSScriptRoot 'previous-edition';$original=Join-Path $kit 'assets/original-square'
New-Item -ItemType Directory -Force -Path $backup,$original | Out-Null
# Keep byte-identical source and previous edition files before updating the folder's working copies.
foreach($name in @('flowers-in-vase-outline.png','flowers-in-vase-finished-reference-blended.png')){
 $src=Join-Path $kit $name;$dst=Join-Path $original $name
 if((Test-Path -LiteralPath $src) -and -not(Test-Path -LiteralPath $dst)){Copy-Item -LiteralPath $src -Destination $dst;if((Get-FileHash -LiteralPath $src).Hash -ne (Get-FileHash -LiteralPath $dst).Hash){throw 'Original archive mismatch'}}
}
$oldPaths=@('output/pdf/8x10','output/svg/8x10')
foreach($rel in $oldPaths){$src=Join-Path $kit $rel;$dst=Join-Path $backup $rel;New-Item -ItemType Directory -Force -Path $dst | Out-Null;if(Test-Path -LiteralPath $src){foreach($f in Get-ChildItem -LiteralPath $src -File){if(-not(Test-Path -LiteralPath (Join-Path $dst $f.Name))){Copy-Item -LiteralPath $f.FullName -Destination (Join-Path $dst $f.Name)}}}}
foreach($f in Get-ChildItem -LiteralPath $kit -File | Where-Object {$_.Name -match '^flowers-in-vase-.*\.(png|svg)$'}){if(-not(Test-Path -LiteralPath (Join-Path $backup $f.Name))){Copy-Item -LiteralPath $f.FullName -Destination (Join-Path $backup $f.Name)}}
$out=Join-Path $kit 'output/pdf/8x10';$svgout=Join-Path $kit 'output/svg/8x10';New-Item -ItemType Directory -Force -Path $out,$svgout | Out-Null
foreach($kind in @('outline','finished-reference','painting-guide')){
 $name='flowers-in-vase-'+$kind+'-8x10';Copy-Item -LiteralPath (Join-Path $PSScriptRoot ($name+'.pdf')) -Destination (Join-Path $out ($name+'.pdf'))
 if($kind -eq 'painting-guide'){$im=[Drawing.Bitmap]::FromFile((Join-Path $PSScriptRoot ($name+'-render.png')));$im.SetResolution(300,300);$im.Save((Join-Path $out ($name+'.png')),[Drawing.Imaging.ImageFormat]::Png);$im.Dispose()}else{Copy-Item -LiteralPath (Join-Path $PSScriptRoot ($name+'.png')) -Destination (Join-Path $out ($name+'.png'));Copy-Item -LiteralPath (Join-Path $out ($name+'.png')) -Destination (Join-Path $kit ($name+'.png'))}
 $im=[Drawing.Bitmap]::FromFile((Join-Path $PSScriptRoot ($name+'-render.png')));$pw=if($kind -eq 'painting-guide'){1020}else{720};$ph=if($kind -eq 'painting-guide'){1320}else{900};$pv=[Drawing.Bitmap]::new($im,$pw,$ph);$pv.Save((Join-Path $PSScriptRoot ($name+'-final-review.png')),[Drawing.Imaging.ImageFormat]::Png);$pv.Dispose();$im.Dispose()
}
$svg='flowers-in-vase-outline-8x10.svg';Copy-Item -LiteralPath (Join-Path $PSScriptRoot $svg) -Destination (Join-Path $svgout $svg);Copy-Item -LiteralPath (Join-Path $PSScriptRoot $svg) -Destination (Join-Path $kit $svg)
$hi='flowers-in-vase-outline-8x10-600dpi.png';Copy-Item -LiteralPath (Join-Path $PSScriptRoot $hi) -Destination (Join-Path $out $hi);Copy-Item -LiteralPath (Join-Path $PSScriptRoot $hi) -Destination (Join-Path $kit $hi)
Copy-Item -LiteralPath (Join-Path $out 'flowers-in-vase-outline-8x10.png') -Destination (Join-Path $kit 'flowers-in-vase-outline.png')
Copy-Item -LiteralPath (Join-Path $out 'flowers-in-vase-finished-reference-8x10.png') -Destination (Join-Path $kit 'flowers-in-vase-finished-reference.png')
# The old square color source remains archived and is removed from the current working-file list.
$old=Join-Path $kit 'flowers-in-vase-finished-reference-blended.png'
if(Test-Path -LiteralPath $old){$moveTarget=Join-Path $backup 'flowers-in-vase-finished-reference-blended-source.png';if(-not(Test-Path -LiteralPath $moveTarget)){Move-Item -LiteralPath $old -Destination $moveTarget}}
# Keep the familiar guide filename current; its prior square-art edition is archived first.
foreach($ext in @('pdf','png')){$legacy=Join-Path $kit ('output/pdf/flowers-in-vase-painting-guide-illustrated.'+$ext);$dest=Join-Path $backup ('flowers-in-vase-painting-guide-illustrated.'+$ext);if((Test-Path -LiteralPath $legacy) -and -not(Test-Path -LiteralPath $dest)){Copy-Item -LiteralPath $legacy -Destination $dest};Copy-Item -LiteralPath (Join-Path $out ('flowers-in-vase-painting-guide-8x10.'+$ext)) -Destination $legacy}
Write-Output 'Promoted true portrait guide, reference and vector outline. Original square sources and previous exports archived.'
