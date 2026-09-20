$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition (Get-Content "$PSScriptRoot/build.cs" -Raw)
[KitBuild8]::Run((Resolve-Path "$PSScriptRoot/../..").Path)
