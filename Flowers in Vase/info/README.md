# Flowers in Vase: info/

The three files in the parent folder are the production set. This folder holds only what is needed to change them and the parent `assets/` folder, plus the supplied originals. Everything else was removed on September 25, 2026 and is in git history (`git checkout ee3dfae -- "<path>"`; older files: `bf75693`). See [the cleanup summary](../../assets/tools/cleanup/info-cleanup-2026-09-25-pass2.md).

## What is here

- `archive/previous-root-files/`: supplied originals (`flowers-in-vase-source-photo.png`).
- `output/pdf/8x10/flowers-in-vase-finished-reference-8x10.png`: the reference master PNG (2400 x 3000). The reference PDF, the guide's preview and its drying panel all come from it.
- `assets/template-refactor/river-and-ridge-logo.png`: page-colored logo for the guide; `tmp/template-refactor/logo-prompt.txt` is how it was made.
- `assets/portrait-rebuild/`: guide stages `stage-01..08.png`, the canonical painting and outline the stages are built from.
- `assets/reference-restoration/*-clean.png`: guide panels 9-11, cropped by `tmp/reference-restoration/build-clean-crops.cjs`.
- `tmp/portrait-rebuild/build-stages.cjs` with its region and group masks.

## How to change things (run from the project root)

- **Guide text or steps:** edit this kit's entry in `assets/tools/guide-template/kits.json`, then run `node assets/tools/guide-template/build.cjs flowers-in-vase`. The new PDF is written to `tmp/reference-restoration/`. Check it with `assets/tools/pdf-render/render-pdf.cjs` and copy it to the kit root.
- **Step pictures:** run `node "Flowers in Vase/info/tmp/portrait-rebuild/build-stages.cjs"`, then `node "Flowers in Vase/info/tmp/reference-restoration/build-clean-crops.cjs"`.
- **Reference:** edit the master PNG, then run `node assets/tools/reference-pdf/png-to-pdf.cjs "Flowers in Vase/info/output/pdf/8x10/flowers-in-vase-finished-reference-8x10.png" "Flowers in Vase/flowers-in-vase-finished-reference-8x10.pdf"` and rebuild the guide.
- **Outline:** edit the SVG in the kit root directly (2 pt, round caps/joins, the kit's gray). The stage masks were made from older rasters; a geometry change means the step pictures must be rebuilt to match.
- **Kit-root assets/:** after a guide change, empty `../assets/` and run `node Tools/guide-image-extractor.cjs "Flowers in Vase"`.
