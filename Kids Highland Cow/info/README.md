# Kids Highland Cow

Ages 8-14. Six illustrated steps, two columns by three rows. Seven ready-to-use paints: light blue, caramel tan, cream, pink, brown, black and white. No mixing. The target follows the supplied portrait cow bust with a pink bow and blue background. Its original crop at the left and bottom is preserved; the source is uniformly scaled, without stretching.

## Production files

- `../kids-highland-cow-outline-8x10.svg`: transparent true vector transfer, black #000000, rounded 3-point strokes, 8 x 10 inches. Black pupils become paintable boundaries with white-shine outlines.
- `../kids-highland-cow-painting-guide-8x10.pdf`: one US Letter page.
- `../kids-highland-cow-finished-reference-8x10.pdf`: one 8 x 10 page, losslessly embedding the 2400 x 3000, 300-DPI color master.
- `../assets/`: lossless guide-image extraction, including the full drying panel.

## Sources and edit assets

The three supplied files are unchanged under `archive/previous-root-files/`. The black-and-white PNG controls the line geometry; its Illustrator companion is also preserved. The color PNG supplies the palette, body/background distinction where the cropped bust is open, and inner-ear color placement. The resulting target is a clean flat-color adaptation, with the supplied linework retained, rather than the original shaded raster.

- `Highland cow black and white female.ai`: SHA-256 `173728482d46cc8bd5e151ebc687243ab857d5e168142c5fd32c3942f777ba66`.
- `Highland cow black and white female.png`: SHA-256 `1844ca46404ed0192ee54ac8ffb4207ca6cbc9c701597fa4193faa7992b496ec`.
- `Highland cow color female.png`: SHA-256 `97b38f11e3410a2723857aba845100d32c86c8c780a9eb3069825db0d9318ed8`.

`assets/geometry.json` saves the smoothed source centerlines, pupil boundaries and uniform placement. `assets/paint-layers.json` saves the matching filled color regions and source ink paths. `paint-regions.npy`, `pupil-mask.npy` and `source-ink.png` support intentional mask edits. `reference-master.svg`, `reference-master.png` and `stage-01.png` through `stage-06.png` are the shared reference/stage masters. Stages 5 and 6 show the same finished painting; the guide uses a separate flat tabletop scene for step 6. `page-logo.png` is the selected built-in imagegen edit: the complete transparent ribbon logo has cream/blush ribbons, dark brown lettering, green riverbanks, a turquoise river, and a small caramel Highland calf with a pink bow. Preserve it on rebuilds; `logo-prompt.txt` records the edit brief.

`src/build.cjs` rebuilds from the saved canonical geometry and paint layers. `src/guide-pdf.cjs` is the editable layout. The shared guide plan is the `kids-highland-cow` entry in `assets/tools/guide-template/kits.json`. `prepare.py`, `trace.py`, `vector.cjs`, `outline.cjs`, `paint.py` and `paint-vector.cjs` are the deliberate source-reconstruction pipeline; normal rebuilds do not re-trace or reclassify the artwork.

Run from the project root:

```powershell
node "Kids Highland Cow/info/src/build.cjs"
# Inspect the outline, reference, guide and stages in tmp/kids-highland-cow/.
node "Kids Highland Cow/info/src/build.cjs" --promote
node Tools/guide-image-extractor.cjs "Kids Highland Cow/kids-highland-cow-painting-guide-8x10.pdf"
```

Use `--retrace` only for an intentional geometry/mask revision; it rebuilds source region labels, centerlines and color layers before the normal build. Scratch exports and checks stay in `tmp/kids-highland-cow/`.

## Review

Visually reviewed the transparent transfer on white, finished reference, middle stage, six-stage contact sheet, enlarged face, geometry overlay and rendered guide. Checked black 3-point vector-only transfer styling, transparent interiors/margins, source registration, cumulative color order, matching final-stage/reference pixels, 2400 x 3000 masters at 300 DPI, single-page Letter/8 x 10 PDF sizes, legible captions, full logo, paint names, no mixing, and the exact finished reference in the flat drying scene. Supplied source hashes were checked after relocation. The original raster ink and masks were traced into smooth vector paint layers before print rendering; no new raster detail is claimed. Print artwork at Actual size / 100%. Digital file checks only.

## October 21 guide correction

The guide no longer asks children to repaint the outline, fur lines, eyebrows or smile. The fixed gray illustration line layer represents the preprinted lines showing through thin paint, as in the early stages. Only the dark eye areas receive black paint. The guide preview, final stages, flat drying picture and reference PDF all follow this target. The separate production transfer stays byte-for-byte unchanged at black #000000, 3 pt. The colored cow-themed logo was added to the guide and all extracted pictures refreshed. The previous edition is preserved in Git commit `0adcdcc`. Rechecked single-page PDF sizes, 300-DPI masters, matching final stage/reference, transparent complete logo and unchanged transfer hash.
