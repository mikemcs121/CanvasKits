Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition (Get-Content "$PSScriptRoot/register.cs" -Raw)
[RegisterPaint]::Run((Resolve-Path "$PSScriptRoot/..").Path)
