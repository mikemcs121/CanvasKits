$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$kit=(Resolve-Path "$PSScriptRoot/../..").Path
$dest=Join-Path $kit 'output/pdf/8x10'
foreach($kind in @('outline','finished-reference','painting-guide')){
 $name='flowers-in-vase-'+$kind+'-8x10'
 $source=Join-Path $PSScriptRoot ($name+$(if($kind -eq 'painting-guide'){'-render.png'}else{'.png'}))
 $im=[Drawing.Bitmap]::FromFile($source)
 if($kind -ne 'painting-guide' -and ($im.Width -ne 2400 -or $im.Height -ne 3000 -or [Math]::Abs($im.HorizontalResolution-300) -gt 1)){throw ('Artwork dimensions/DPI failed '+$name)}
 $im.SetResolution(300,300)
 $im.Save((Join-Path $dest ($name+'.png')),[Drawing.Imaging.ImageFormat]::Png)
 $im.Dispose()
 Copy-Item -LiteralPath (Join-Path $PSScriptRoot ($name+'.pdf')) -Destination (Join-Path $dest ($name+'.pdf'))
 if($kind -ne 'painting-guide'){Copy-Item -LiteralPath (Join-Path $dest ($name+'.png')) -Destination (Join-Path $kit ($name+'.png'))}
 $render=[Drawing.Bitmap]::FromFile((Join-Path $PSScriptRoot ($name+'-render.png')))
 $pw=if($kind -eq 'painting-guide'){1020}else{640};$ph=if($kind -eq 'painting-guide'){1320}else{800}
 $preview=[Drawing.Bitmap]::new($render,$pw,$ph)
 $preview.Save((Join-Path $PSScriptRoot ($name+'-review.png')),[Drawing.Imaging.ImageFormat]::Png)
 $preview.Dispose();$render.Dispose()
}
$originals=Get-Content -LiteralPath (Join-Path $PSScriptRoot 'source-hashes.json') -Raw | ConvertFrom-Json
foreach($record in $originals){if((Get-FileHash -Algorithm SHA256 -LiteralPath $record.Path).Hash -ne $record.Hash){throw ('Source changed '+$record.Path)}}
Write-Output 'Six final files saved; artwork size and DPI passed; original source hashes unchanged.'
