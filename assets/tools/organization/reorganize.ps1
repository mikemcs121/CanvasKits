param([switch]$Apply)
$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../..'))
$selections = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'selections.json') -Raw | ConvertFrom-Json
function CheckedPath([string]$relative) {
    $absolute = [IO.Path]::GetFullPath((Join-Path $projectRoot $relative))
    if (-not $absolute.StartsWith($projectRoot.TrimEnd('\') + '\', [StringComparison]::OrdinalIgnoreCase)) { throw "Path outside project: $absolute" }
    return $absolute
}
function Hash([string]$p) { return (Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash }
$plans = @()
foreach ($kit in $selections) {
    $kitRoot = CheckedPath $kit.folder
    if (Test-Path -LiteralPath (Join-Path $kitRoot 'info')) { throw "Already organized or existing info requires review: $kitRoot" }
    $selected = @()
    foreach ($role in @('outline','guide','reference')) {
        $source = CheckedPath ($kit.folder + '/' + $kit.$role)
        if (-not (Test-Path -LiteralPath $source -PathType Leaf)) { throw "Missing $source" }
        $suffix = @{outline='outline-8x10.svg';guide='painting-guide-8x10.pdf';reference='finished-reference-8x10.pdf'}[$role]
        $selected += [pscustomobject]@{role=$role;source=$source;destination=(Join-Path $kitRoot ($kit.slug+'-'+$suffix));sha256=(Hash $source)}
    }
    $moves = @()
    foreach ($item in Get-ChildItem -LiteralPath $kitRoot -Force) {
        $relativeDestination = if ($item.PSIsContainer) {'info/' + $item.Name} else {'info/archive/previous-root-files/' + $item.Name}
        $moves += [pscustomobject]@{from=$item.FullName;to=(CheckedPath ($kit.folder+'/'+$relativeDestination));directory=$item.PSIsContainer}
    }
    $plans += [pscustomobject]@{kit=$kit;root=$kitRoot;selected=$selected;moves=$moves}
}
$plans | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath (Join-Path $PSScriptRoot 'move-plan.json') -Encoding UTF8
if (-not $Apply) { Write-Output "Prepared plan for $($plans.Count) kits; no kit files moved."; exit }
$report = @()
foreach ($plan in $plans) {
    $info = Join-Path $plan.root 'info'
    New-Item -ItemType Directory -Path (Join-Path $info 'archive/previous-root-files') -Force | Out-Null
    $before = @()
    foreach ($move in $plan.moves) {
        $files = if ($move.directory) { Get-ChildItem -LiteralPath $move.from -File -Recurse -Force } else { Get-Item -LiteralPath $move.from }
        foreach ($file in $files) {
            $newPath = if ($move.directory) { $move.to + $file.FullName.Substring($move.from.Length) } else { $move.to }
            $before += [pscustomobject]@{old=$file.FullName.Substring($projectRoot.Length+1);new=$newPath.Substring($projectRoot.Length+1);bytes=$file.Length;sha256=(Hash $file.FullName)}
        }
        # Both resolved absolute endpoints were validated inside the project before any move.
        if (Test-Path -LiteralPath $move.to) { throw "Destination collision: $($move.to)" }
        Move-Item -LiteralPath $move.from -Destination $move.to
    }
    # Archive regenerable browser/package caches separately; retain all source dependency trees.
    $tmpPath = Join-Path $info 'tmp'
    $cacheMoves = @()
    if (Test-Path -LiteralPath $tmpPath) {
        $caches = @(Get-ChildItem -LiteralPath $tmpPath -Directory -Recurse -Force | Where-Object { $_.Name -like 'chrome-profile*' -or $_.Name -eq 'npm-cache' })
        foreach ($cache in $caches) {
            $cacheFrom = CheckedPath $cache.FullName.Substring($projectRoot.Length+1)
            $cacheTo = CheckedPath ($plan.kit.folder + '/info/archive/build-caches/' + $cacheFrom.Substring($tmpPath.Length+1))
            if (Test-Path -LiteralPath $cacheTo) { throw "Cache destination collision: $cacheTo" }
            New-Item -ItemType Directory -Path ([IO.Path]::GetDirectoryName($cacheTo)) -Force | Out-Null
            Move-Item -LiteralPath $cacheFrom -Destination $cacheTo
            $fromRel = $cacheFrom.Substring($projectRoot.Length+1)
            $toRel = $cacheTo.Substring($projectRoot.Length+1)
            foreach ($record in $before) {
                if ($record.new.StartsWith($fromRel+'\',[StringComparison]::OrdinalIgnoreCase)) { $record.new = $toRel + $record.new.Substring($fromRel.Length) }
            }
            $cacheMoves += [pscustomobject]@{from=$fromRel;to=$toRel}
        }
    }
    foreach ($record in $before) {
        $p = CheckedPath $record.new
        if ((Hash $p) -ne $record.sha256) { throw "Preservation failed: $p" }
    }
    foreach ($file in $plan.selected) {
        $sourceRecord = $before | Where-Object { (CheckedPath $_.old) -eq $file.source }
        if (@($sourceRecord).Count -ne 1) { throw "No unique source mapping: $($file.source)" }
        Copy-Item -LiteralPath (CheckedPath $sourceRecord.new) -Destination $file.destination
        if ((Hash $file.destination) -ne $file.sha256) { throw "Production copy mismatch" }
    }
    $before | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $info 'organization-manifest.json') -Encoding UTF8
    $plan.selected | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $info 'production-selection.json') -Encoding UTF8
    $cacheMoves | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $info 'cache-archive-moves.json') -Encoding UTF8
    $rootFiles = @(Get-ChildItem -LiteralPath $plan.root -File -Force)
    if ($rootFiles.Count -ne 3) { throw "Expected 3 root files: $($plan.root)" }
    $kitName=$plan.kit.folder
    $readme=@"
# $kitName supporting files

The three files in the parent folder are the current production set: SVG transfer, guide PDF, and color-reference PDF. Select those when printing or sending the transfer to a supplier.

- assets/: canonical artwork, guide stages, masks and logo variants.
- tmp/: editable build sources, prompts, renders and verification records. Older dependencies are retained together to preserve provenance.
- output/: supporting exports, including matching PNGs and compatibility outline PDFs. Historical drafts may also be present; the parent folder is authoritative.
- test/ (when present): preserved supplied/test artwork.
- archive/previous-root-files/: previous root image aliases, original supplied images and old notes. These are retained unchanged, not current production choices.
- archive/build-caches/: old browser export profiles and package-download caches, preserved separately from working sources.
- organization-manifest.json: every moved file's original path, new path, size and SHA-256. All moved files were hash-verified.
- production-selection.json: selected source paths and hashes for the three promoted files.

Review: $($plan.kit.review)

Active build/provenance: $($plan.kit.build)

Old instructions in preserved files describe the former layout. Old kit-relative assets/, tmp/, output/ and test/ paths now begin with info/. Old root image aliases live in archive/previous-root-files/. Builders that have not been adapted must have their paths reviewed before use; do not run old transfer exporters over the current 2-point gray SVG. Shared logo remains at project assets/images/river-and-ridge-logo.png. See the project canvas-kits.md and AGENTS.md for current instructions.
"@
    Set-Content -LiteralPath (Join-Path $info 'README.md') -Value $readme -Encoding UTF8
    $report += [pscustomobject]@{kit=$kitName;preservedFiles=$before.Count;productionFiles=$rootFiles.Name;productionHashes=$plan.selected;verified=$true}
    Write-Output "$kitName`: preserved and verified $($before.Count) files; exactly 3 production files."
}
$report | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath (Join-Path $PSScriptRoot 'organization-result.json') -Encoding UTF8
