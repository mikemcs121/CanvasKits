# Cat in Pumpkin: info/

The three files in the parent folder are the production set. This folder holds only what is needed to change them and the parent `assets/` folder, plus the supplied originals. Everything else was removed on September 25, 2026 and is in git history (`git checkout ee3dfae -- "<path>"`; older files: `bf75693`). See [the cleanup summary](../../assets/tools/cleanup/info-cleanup-2026-09-25-pass2.md).

## What is here

- `archive/previous-root-files/`: supplied originals (`exec-01c35205-b359-4887-a7f9-a31e173a5e1f.png`).
- `output/pdf/8x10/cat-in-pumpkin-finished-reference-8x10.png`: the reference master PNG (2400 x 3000). The reference PDF, the guide's preview and its drying panel all come from it.
- `assets/template-refactor/river-and-ridge-logo.png`: page-colored logo for the guide; `tmp/template-refactor/logo-prompt.txt` is how it was made.
- `tmp/8x10-artwork/`: guide step pictures (`step-N.png`), plus `outline.bmp` and `paint.bmp`, the sources `Fox Fall/info/tmp/build-new-panels.cjs` rebuilds them from. That builder also writes `registered-reference.png`, the masks and `step-plan.json`.
- `tmp/simplified/`, `assets/simplified/`: builder, plan and artwork for the `../simplified/` edition.

## How to change things (run from the project root)

- **Guide text or steps:** edit this kit's entry in `assets/tools/guide-template/kits.json`, then run `node assets/tools/guide-template/build.cjs cat-in-pumpkin`. The new PDF is written to `tmp/template-refactor/`. Check it with `assets/tools/pdf-render/render-pdf.cjs` and copy it to the kit root.
- **Step pictures:** `node "Fox Fall/info/tmp/build-new-panels.cjs"` rebuilds the steps of all four autumn kits from `outline.bmp` and `paint.bmp`.
- **Reference:** edit the master PNG, then run `node assets/tools/reference-pdf/png-to-pdf.cjs "Cat in Pumpkin/info/output/pdf/8x10/cat-in-pumpkin-finished-reference-8x10.png" "Cat in Pumpkin/cat-in-pumpkin-finished-reference-8x10.pdf"` and rebuild the guide.
- **Outline:** edit the SVG in the kit root directly (2 pt, round caps/joins, the kit's gray). The stage masks were made from older rasters; a geometry change means the step pictures must be rebuilt to match.
- **Kit-root assets/:** after a guide change, empty `../assets/` and run `node Tools/guide-image-extractor.cjs "Cat in Pumpkin"`.
- **Simplified edition:** `python "Cat in Pumpkin/info/tmp/simplified/build.py"` (requires Python with reportlab), then `promote.py` in the same folder copies the result into `../simplified/`.
