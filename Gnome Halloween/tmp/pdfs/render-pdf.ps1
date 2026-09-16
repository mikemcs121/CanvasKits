param([string]$PdfPath, [string]$ImagePath, [uint32]$Width=2550, [uint32]$Height=3300)
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
$file = Await-Result ([Windows.Storage.StorageFile]::GetFileFromPathAsync((Resolve-Path $PdfPath).Path)) ([Windows.Storage.StorageFile])
$doc = Await-Result ([Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)) ([Windows.Data.Pdf.PdfDocument])
if ($doc.PageCount -ne 1) { throw "Expected exactly one page, found $($doc.PageCount)" }
$page = $doc.GetPage(0)
Write-Output ('Pages: ' + $doc.PageCount + '; page size: ' + $page.Size.Width + ' x ' + $page.Size.Height)
$memoryStream = New-Object Windows.Storage.Streams.InMemoryRandomAccessStream
$options = New-Object Windows.Data.Pdf.PdfPageRenderOptions
$options.DestinationWidth = $Width
$options.DestinationHeight = $Height
Await-Action ($page.RenderToStreamAsync($memoryStream,$options))
$inputStream = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($memoryStream)
$outputStream = [System.IO.File]::Create([System.IO.Path]::GetFullPath($ImagePath))
$inputStream.CopyTo($outputStream)
$outputStream.Dispose()
$inputStream.Dispose()
$page.Dispose()
