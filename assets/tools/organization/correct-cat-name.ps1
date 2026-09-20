$ErrorActionPreference='Stop'
$projectRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../..'))
$oldName='K'+'at In Pumpkin'
$newName='Cat in Pumpkin'
$oldSlug='k'+'at-in-pumpkin'
$newSlug='cat-in-pumpkin'
function Correct([string]$s) {
    $s=[regex]::Replace($s,'(?i)'+[regex]::Escape($oldName),$newName)
    return [regex]::Replace($s,'(?i)'+[regex]::Escape($oldSlug),$newSlug)
}
function Checked([string]$p) {
    $full=[IO.Path]::GetFullPath($p)
    if(-not $full.StartsWith($projectRoot+'\',[StringComparison]::OrdinalIgnoreCase)){throw "Outside project: $full"}
    return $full
}
$from=Checked (Join-Path $projectRoot $oldName)
$to=Checked (Join-Path $projectRoot $newName)
if(Test-Path -LiteralPath $to){throw 'Destination already exists'}
Move-Item -LiteralPath $from -Destination $to
# Rename all matching file/directory basenames, deepest first, within the project.
$renames=@()
$items=@(Get-ChildItem -LiteralPath $projectRoot -Recurse -Force | Where-Object { $_.FullName -notmatch '\\(\.git|node_modules|\.agents)\\' -and (Correct $_.Name) -cne $_.Name } | Sort-Object { $_.FullName.Length } -Descending)
foreach($item in $items){
    $source=Checked $item.FullName
    $target=Checked (Join-Path $item.DirectoryName (Correct $item.Name))
    if($item.PSIsContainer){$target=Checked (Join-Path $item.Parent.FullName (Correct $item.Name))}
    if(Test-Path -LiteralPath $target){throw "Collision: $target"}
    Move-Item -LiteralPath $source -Destination $target
    $renames += $target.Substring($projectRoot.Length+1)
}
$archive=Join-Path $to 'info/archive/name-correction-original-text'
New-Item -ItemType Directory -Path $archive -Force | Out-Null
$changed=@()
$extensions=@('.md','.txt','.json','.cjs','.js','.mjs','.ps1','.cs','.html','.htm','.svg','.yaml','.yml','.xml','.csv','.log','.css')
$files=@(Get-ChildItem -LiteralPath $projectRoot -Recurse -File -Force | Where-Object { $_.FullName -notmatch '\\(\.git|node_modules|\.agents|build-caches|npm-cache|name-correction-original-text)\\' -and $_.Extension.ToLowerInvariant() -in $extensions })
foreach($file in $files){
    $bytes=[IO.File]::ReadAllBytes($file.FullName)
    $encoding=New-Object Text.UTF8Encoding($false,$true)
    if($bytes.Length -ge 2 -and $bytes[0] -eq 255 -and $bytes[1] -eq 254){$encoding=[Text.Encoding]::Unicode}
    try{$text=$encoding.GetString($bytes)}catch{continue}
    $updated=Correct $text
    if($updated -ceq $text){continue}
    $oldHash=(Get-FileHash -LiteralPath $file.FullName).Hash
    $backup=Join-Path $archive ($oldHash+'.gz')
    if(-not(Test-Path -LiteralPath $backup)){
        $stream=[IO.File]::Create($backup)
        $gzip=New-Object IO.Compression.GZipStream($stream,[IO.Compression.CompressionMode]::Compress)
        $gzip.Write($bytes,0,$bytes.Length);$gzip.Dispose();$stream.Dispose()
    }
    [IO.File]::WriteAllBytes($file.FullName,$encoding.GetBytes($updated))
    $changed += [pscustomobject]@{file=$file.FullName.Substring($projectRoot.Length+1);beforeSha256=$oldHash;afterSha256=(Get-FileHash -LiteralPath $file.FullName).Hash}
}
[pscustomobject]@{folder=$newName;renamedFiles=$renames;updatedText=$changed;note='Original text bytes retained as SHA-256-named gzip files. Artwork content unchanged.'} | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $to 'info/name-correction.json') -Encoding UTF8
Write-Output "Renamed kit and $($renames.Count) supporting files; corrected $($changed.Count) text files. Protected skill staged separately."
