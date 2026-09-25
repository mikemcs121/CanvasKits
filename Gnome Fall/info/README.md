# Gnome Fall: info/

The three files in the parent folder are the production set. This folder holds only what is needed to change them and the parent `assets/` folder, plus the supplied originals. Everything else was removed on September 25, 2026 and is in git history (`git checkout ee3dfae -- "<path>"`; older files: `bf75693`). See [the cleanup summary](../../assets/tools/cleanup/info-cleanup-2026-09-25-pass2.md).

## What is here

- `archive/previous-root-files/`: supplied originals (`gnome-fall-finished-reference.png`, `gnome-fall-source-composite.png`).
- `assets/reference-restoration/restored-master.png`: the reference master PNG (2400 x 3000). The reference PDF, the guide's preview and its drying panel all come from it.
- `assets/template-refactor/river-and-ridge-logo.png`: page-colored logo for the guide; `tmp/template-refactor/logo-prompt.txt` is how it was made.
- `assets/reference-restoration/`: `restored-master.png` (reference master), `step-NN.png` (canonical stages), `guide-step-NN.png` (the pictures the guide uses) and the candidate painting `build-art.cjs` starts from.
- `tmp/reference-restoration/guide-plan.json` and image prompts; `tmp/organization/`: region maps read by `build-art.cjs`.

## How to change things (run from the project root)

- **Guide text or steps:** edit this kit's entry in `assets/tools/guide-template/kits.json`, then run `node assets/tools/guide-template/build.cjs gnome-fall`. The new PDF is written to `tmp/reference-restoration/`. Check it with `assets/tools/pdf-render/render-pdf.cjs` and copy it to the kit root.
- **Step pictures:** `node assets/tools/reference-restoration/guide-inputs.cjs` rebuilds `guide-step-NN.png` from `step-NN.png`. `build-art.cjs gnome-fall` regenerates the master and stages from the candidate; it overwrites `restored-master.png`, so run it only for a full repaint.
- **Reference:** edit the master PNG, then run `node assets/tools/reference-pdf/png-to-pdf.cjs "Gnome Fall/info/assets/reference-restoration/restored-master.png" "Gnome Fall/gnome-fall-finished-reference-8x10.pdf"` and rebuild the guide.
- **Outline:** edit the SVG in the kit root directly (2 pt, round caps/joins, the kit's gray). The stage masks were made from older rasters; a geometry change means the step pictures must be rebuilt to match.
- **Kit-root assets/:** after a guide change, empty `../assets/` and run `node Tools/guide-image-extractor.cjs "Gnome Fall"`.
