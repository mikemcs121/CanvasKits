$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition (Get-Content "$PSScriptRoot/build-guide.cs" -Raw)
[HalloweenGuide]::Run((Resolve-Path "$PSScriptRoot/../..").Path)


