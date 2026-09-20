$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
[Windows.Data.Pdf.PdfDocument,Windows.Data.Pdf,ContentType=WindowsRuntime]|Out-Null
[Windows.Storage.StorageFile,Windows.Storage,ContentType=WindowsRuntime]|Out-Null
[Windows.Storage.Streams.InMemoryRandomAccessStream,Windows.Storage.Streams,ContentType=WindowsRuntime]|Out-Null
$asTask=[System.WindowsRuntimeSystemExtensions].GetMethods()|Where-Object {$_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'}|Select-Object -First 1
function Await-Result($op,$type){$t=$asTask.MakeGenericMethod($type).Invoke($null,@($op));$t.Wait();$t.Result}
function Await-Action($op){$m=[System.WindowsRuntimeSystemExtensions].GetMethods()|Where-Object {$_.Name -eq 'AsTask' -and -not $_.IsGenericMethod -and $_.GetParameters().Count -eq 1}|Select-Object -First 1;$t=$m.Invoke($null,@($op));$t.Wait()}
foreach($folder in @('Gnome Halloween','Gnome Christmas Tree','Gnome Fall','Flowers in Vase','Fall View','Starry-night Sunflower','Fox Fall','Ghost Fall','Cat in Pumpkin','Pumpkin')){
 $d=Join-Path (Get-Location) ($folder+'/tmp/transfer-standard');$out=Join-Path (Get-Location) ($folder+'/tmp/transfer-standard');$checks=@()
 $files=@(Get-ChildItem -LiteralPath $d -Filter '*painting-guide-8x10.pdf')+@(Get-ChildItem -LiteralPath $out -Filter '*.pdf'|Where-Object {$_.Name -notmatch 'painting-guide'})
 foreach($f in $files){
  $file=Await-Result ([Windows.Storage.StorageFile]::GetFileFromPathAsync($f.FullName)) ([Windows.Storage.StorageFile]);$doc=Await-Result ([Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)) ([Windows.Data.Pdf.PdfDocument]);if($doc.PageCount -ne 1){throw ('Unexpected page count '+$f.Name)}
  $page=$doc.GetPage(0);$mem=New-Object Windows.Storage.Streams.InMemoryRandomAccessStream;$opts=New-Object Windows.Data.Pdf.PdfPageRenderOptions
  $guide=$f.Name -match 'painting-guide';if($guide){$opts.DestinationWidth=2550;$opts.DestinationHeight=3300;$ew=816;$eh=1056}else{$opts.DestinationWidth=1200;$opts.DestinationHeight=1500;$ew=768;$eh=960}
  if([Math]::Abs($page.Size.Width-$ew)-gt .1 -or [Math]::Abs($page.Size.Height-$eh)-gt .1){throw ('Wrong dimensions '+$f.Name)}
  Await-Action ($page.RenderToStreamAsync($mem,$opts));$input=[IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($mem);$stream=[IO.File]::Create((Join-Path $d ($f.BaseName+'-render.png')));$input.CopyTo($stream);$stream.Dispose();$input.Dispose()
  $checks+=@{file=$f.Name;pages=$doc.PageCount;widthPoints=($page.Size.Width*.75);heightPoints=($page.Size.Height*.75);render=(Join-Path $d ($f.BaseName+'-render.png'))};$page.Dispose();Write-Output ($folder+': '+$f.Name+' rendered')
 }
 $checks|ConvertTo-Json|Set-Content -LiteralPath (Join-Path $d 'pdf-checks.json')
}



