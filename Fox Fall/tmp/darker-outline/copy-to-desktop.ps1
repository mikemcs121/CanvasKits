$ErrorActionPreference = 'Stop'
$projectRoot = 'C:\Projects\Canvas Kits'
$desktopRoot = [Environment]::GetFolderPath('Desktop')
$targetFolder = Join-Path $desktopRoot 'darker outline'
$kits = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'kits.json') -Raw | ConvertFrom-Json
New-Item -ItemType Directory -Path $targetFolder -Force | Out-Null
$manifest = @()
foreach ($kit in $kits) {
 $kitRoot = Join-Path $projectRoot $kit.folder
 $base = $kit.slug + '-outline-8x10'
 $items = @(
  @{ Source = ('output/svg/8x10/' + $base + '.svg'); Destination = ($base + '.svg') },
  @{ Source = ('output/pdf/8x10/' + $base + '.pdf'); Destination = ('PDF/' + $base + '.pdf') },
  @{ Source = ('output/pdf/8x10/' + $base + '.png'); Destination = ('PNG 300 DPI/' + $base + '.png') },
  @{ Source = ('output/pdf/8x10/' + $base + '-600dpi.png'); Destination = ('PNG 600 DPI/' + $base + '-600dpi.png') }
 )
 foreach ($item in $items) {
  $sourcePath = Join-Path $kitRoot $item.Source
  $destinationPath = Join-Path $targetFolder $item.Destination
  New-Item -ItemType Directory -Path (Split-Path -Parent $destinationPath) -Force | Out-Null
  Copy-Item -LiteralPath $sourcePath -Destination $destinationPath -Force
  $expectedHash = (Get-FileHash -LiteralPath $sourcePath -Algorithm SHA256).Hash
  if ((Get-FileHash -LiteralPath $destinationPath -Algorithm SHA256).Hash -ne $expectedHash) { throw 'Desktop copy mismatch' }
  $manifest += @{ kit = $kit.folder; destination = $destinationPath; sha256 = $expectedHash }
 }
}
@'
All 10 outlines: 8 x 10 inches, 2-point lines (0.706 mm).
Adult outlines: #A6A6A6. Fox Fall and Kat In Pumpkin: #808080.
SVG files at the top level are true vectors with transparent backgrounds.
PDF contains matching vector print files. Print at Actual size / 100%.
PNG subfolders contain transparent 300 and 600 DPI compatibility copies.
Only line thickness changed. The previous 1.4-point versions are archived in the project.
Reviewed on screen; test press on your actual canvas before a production batch.
'@ | Set-Content -LiteralPath (Join-Path $targetFolder 'Read me.txt') -Encoding UTF8
$manifest | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $PSScriptRoot 'desktop-manifest.json') -Encoding UTF8
Write-Output ('Copied and hash-verified ' + $manifest.Count + ' outline files to ' + $targetFolder)
