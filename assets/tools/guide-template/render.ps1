param([string]$Slug='')
node assets/tools/guide-template/render.cjs $Slug
exit $LASTEXITCODE
