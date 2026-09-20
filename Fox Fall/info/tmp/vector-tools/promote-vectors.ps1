$ErrorActionPreference='Stop'
$kits=@(@('Fox Fall','fox-fall'),@('Ghost Fall','ghost-fall'),@('Cat in Pumpkin','cat-in-pumpkin'),@('pumpkin','pumpkin'))
$manifest=@()
foreach($k in $kits){
 $folder=Join-Path (Get-Location) $k[0];$slug=$k[1];$tmp=Join-Path $folder 'tmp/vector';$out=Join-Path $folder 'output/svg/8x10'
 $name=$slug+'-outline-8x10.svg';$src=Join-Path $tmp $name
 [xml]$svg=Get-Content -LiteralPath $src -Raw
 if($svg.DocumentElement.width -ne '8in' -or $svg.DocumentElement.height -ne '10in'){throw 'Wrong SVG dimensions'}
 if($svg.SelectNodes('//*[local-name()="image"]').Count -ne 0 -or $svg.SelectNodes('//*[local-name()="path"]').Count -eq 0){throw 'SVG must contain paths and no raster image'}
 New-Item -ItemType Directory -Force -Path $out | Out-Null
 Copy-Item -LiteralPath $src -Destination (Join-Path $out $name)
 Copy-Item -LiteralPath $src -Destination (Join-Path $folder $name)
 # Supersede the pending enlarged raster with a clean rendering of the verified vector.
 $png=$slug+'-outline-8x10-600dpi.png'
 Copy-Item -LiteralPath (Join-Path $tmp $png) -Destination (Join-Path $folder ('output/pdf/8x10/'+$png))
 Copy-Item -LiteralPath (Join-Path $tmp $png) -Destination (Join-Path $folder $png)
 $manifest+=@{kit=$k[0];path=(Join-Path $out $name);sha256=(Get-FileHash -Algorithm SHA256 -LiteralPath $src).Hash;format='SVG with vector curves only';size='8 x 10 inches';background='transparent'}
 Write-Output ('Verified and saved '+(Join-Path $out $name))
}
$manifest | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $PSScriptRoot 'deliverables.json')
