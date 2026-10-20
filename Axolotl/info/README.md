# Axolotl kids canvas kit

Created October 19, 2026 from the user's supplied `Copy of axolotl_coloring_page.png`. The black rectangular frame is removed. The axolotl, starfish, bubbles and seaweed are retained in their original proportions, uniformly fitted onto an 8 x 10 portrait canvas with modest transparent margins in the transfer. The heavy raster drawing was converted into smooth centerline vector strokes; solid eyes and freckles became paintable closed outlines. Small traced details are adaptations of the raster source, not original editable vectors.

## Production

- `../axolotl-outline-8x10.svg`: 8 x 10 inches, true vector paths, no frame, no background, no raster image; #808080 with 2-point rounded strokes. Interiors are transparent.
- `../axolotl-finished-reference-8x10.pdf`: one 576 x 720-point page, containing the exact 2400 x 3000 master.
- `../axolotl-painting-guide-8x10.pdf`: one US Letter page, six illustrated steps for ages 8-14, two columns by three rows.
- `../assets/`: images extracted from the production guide, including its complete flat drying scene.

Eight ready-to-use paints: turquoise, light blue, green, yellow, light pink, pink, black and white. No mixing. Fine gray contours in the reference represent the preprinted transfer, not an extra paint. Stages: water/bubbles; plants; starfish; light pink body; pink gills/details; faces, shines, drying and cleanup.

## Preserved source and edit assets

- `archive/previous-root-files/Copy of axolotl_coloring_page.png`: unchanged supplied original; SHA-256 `7bdac4507889ca811040abe27239c9191b5696b8c5ba3f31062059d4a5c23dd0`.
- `assets/geometry.json`: canonical smoothed centerlines, closed pupil/freckle boundaries, uniform scale and placement.
- `assets/paint-plan.json`, `assets/paint-layers.json`: source-derived region assignments, editable paint colors and cumulative vector layers.
- `assets/reference-master.svg`, `assets/reference-master.png`: matching color master; PNG is 2400 x 3000 at 300 DPI.
- `assets/stage-01.png` through `stage-06.png`: registered cumulative guide stages, 300 DPI. Stage 6 equals the reference master.
- `assets/page-logo.png`: full shared logo, recolored in pink and turquoise; original shared logo unchanged.
- `src/build.cjs`: normal build and promotion; reads the saved geometry and paint layers.
- `src/trace.py`, `src/build-outline.cjs`, `src/regions.py`, `src/paint-masks.py`: explicit source re-tracing and region construction. Temporary edge closures separate seaweed paint masks at the former frame; these closures never enter the transfer.
- `src/paint.cjs`, `src/finish-images.py`, `src/guide-pdf.cjs`: deterministic reference, stages, print metadata and editable guide layout.
- Shared caption/paint plan: project `assets/tools/guide-template/kits.json`, entry `axolotl`.

Run from the project root:

```powershell
node Axolotl/info/src/build.cjs
# Inspect tmp/axolotl/outline-preview.png, finished-reference.png,
# painting-guide.png and stages.png, then promote:
node Axolotl/info/src/build.cjs --promote
node Tools/guide-image-extractor.cjs Axolotl/axolotl-painting-guide-8x10.pdf
```

Use `--retrace` only for an intentional source-geometry revision, then review all three files together. Scratch files and review checks stay in `tmp/axolotl/`. The builder uses the bundled Python path; update its `python` variable if the runtime moves. Existing guide image extractions must be regenerated in scratch before replacing changed copies.

## Review

Reviewed the complete transparent outline, colored reference, six-stage sheet and rendered guide. Checked the SVG's physical size, vector-only content, transparent background and interiors, gray and effective stroke weight; one-page PDF dimensions; 300-DPI master/stages; final-stage identity; cumulative paint order, readable captions, full logo, spelling and exact reference in the flat drying scene. The supplied original is unchanged. These are digital file checks, not a physical painting or press test.
