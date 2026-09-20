# Portrait guide repair — September 20, 2026

The existing production transfer SVGs were preserved byte-for-byte. The old square painting and flattened draft guides did not match the current portrait geometry. New texture paintings were generated using the existing portrait outline as the geometry reference and the original square paintings as color/style references. `portrait-texture-generated.png` retains that intermediate output. Closed-region masks from the existing outline constrain the working painting and cumulative panels. Color texture is resampled from an 800 × 1000 working master into the 2400 × 3000 compatibility PNG, not newly detailed 300-DPI painting.

`labels.bin`, `regions.json`, `group-assignments.json`, and `outline.png` are the editable mask/geometry data. `registered-reference.png` is the chosen portrait target. Steps 9–11 are mapped crops; stage 12 and header use the same target. Sunflower seed texture is withheld until step 11. Fall View's sky is rebuilt inside its sky mask to eliminate source leaf and sun fragments outside their correct regions. Paint recipes are inherited and checked against each palette.

Run commands from the project root. Shared dependencies are in Fox Fall's `tmp/vector-tools/node_modules` (or `info/tmp/vector-tools/node_modules` after organization). Run `build.cjs`, `guide.cjs`, `export.cjs`, and `render.ps1` in this directory, inspect both rendered PDFs, then run `promote.cjs`. The latter checks the recorded PDF/layout gates and updates the supporting exports AND the two root production PDFs after organization. It never changes the production SVG. Do not run the old flattened guide exporter.

The builder automatically detects the organized `info` directories. The first `inspect.cjs` is a historical mask-extraction helper; labels are already retained and do not need rebuilding. Sunflower's original plan is read from the archived original-square-kit directory after consolidation.

These are file and visual checks, not physical sublimation/press tests. Earlier square artwork, rejected registration attempts, and generated texture intermediates remain as history.
