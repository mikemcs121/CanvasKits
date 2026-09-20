$ErrorActionPreference='Stop'
$projectRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../..'))
$old=[IO.Path]::GetFullPath((Join-Path $projectRoot 'Starry Night Sunflower'))
$dest=[IO.Path]::GetFullPath((Join-Path $projectRoot 'Starry-night Sunflower/info/archive/original-square-kit'))
foreach($p in @($old,$dest)) { if(-not $p.StartsWith($projectRoot.TrimEnd('\')+'\',[StringComparison]::OrdinalIgnoreCase)){throw 'Outside project'} }
if(Test-Path -LiteralPath $dest){throw 'Archive already exists'}
$records=@(Get-ChildItem -LiteralPath $old -File -Recurse -Force | ForEach-Object {
    [pscustomobject]@{old=$_.FullName.Substring($projectRoot.Length+1);new=($dest+$_.FullName.Substring($old.Length)).Substring($projectRoot.Length+1);sha256=(Get-FileHash -LiteralPath $_.FullName).Hash;bytes=$_.Length}
})
Move-Item -LiteralPath $old -Destination $dest
foreach($r in $records){if((Get-FileHash -LiteralPath (Join-Path $projectRoot $r.new)).Hash -ne $r.sha256){throw "Hash mismatch: $($r.new)"}}
$records | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $projectRoot 'Starry-night Sunflower/info/sunflower-consolidation-manifest.json') -Encoding UTF8
Write-Output "Consolidated original Sunflower folder intact; verified $($records.Count) files."
