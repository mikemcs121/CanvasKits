Add-Type -AssemblyName System.Runtime.WindowsRuntime
[Windows.Data.Pdf.PdfDocument, Windows.Data.Pdf, ContentType=WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile, Windows.Storage, ContentType=WindowsRuntime] | Out-Null
[Windows.Storage.Streams.InMemoryRandomAccessStream, Windows.Storage.Streams, ContentType=WindowsRuntime] | Out-Null
$asTask = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' } | Select-Object -First 1
function Await-Result($operation, $type) {
  $task = $asTask.MakeGenericMethod($type).Invoke($null, @($operation))
  $task.Wait()
  $task.Result
}
function Await-Action($operation) {
  $method = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and -not $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 } | Select-Object -First 1
  $task = $method.Invoke($null, @($operation))
  $task.Wait()
}
$pdfToRender = if ($env:FALL_VIEW_PDF_PATH) { $env:FALL_VIEW_PDF_PATH } else { 'tmp/pdfs/fall-view-painting-guide-illustrated.pdf' }
$filePath = (Resolve-Path $pdfToRender).Path
$file = Await-Result ([Windows.Storage.StorageFile]::GetFileFromPathAsync($filePath)) ([Windows.Storage.StorageFile])
$doc = Await-Result ([Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)) ([Windows.Data.Pdf.PdfDocument])
Write-Output ('Pages: ' + $doc.PageCount)
for ($i=0; $i -lt $doc.PageCount; $i++) {
  $page = $doc.GetPage($i)
  $memoryStream = New-Object Windows.Storage.Streams.InMemoryRandomAccessStream
  $options = New-Object Windows.Data.Pdf.PdfPageRenderOptions
  $options.DestinationWidth = 2550
  $options.DestinationHeight = 3300
  Await-Action ($page.RenderToStreamAsync($memoryStream,$options))
  $inputStream = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($memoryStream)
  $outputStream = [System.IO.File]::Create((Join-Path (Get-Location) ('tmp/pdfs/page-' + ($i+1) + '.png')))
  $inputStream.CopyTo($outputStream)
  $outputStream.Dispose()
  $inputStream.Dispose()
  $page.Dispose()
}


