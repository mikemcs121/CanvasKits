# Fox Fall supporting files

## What is in info/

The three files in the parent folder are the current production set: SVG transfer, guide PDF, and color-reference PDF. Select those when printing or sending the transfer to a supplier.

On September 25, 2026 this folder was reduced to what is still used; see the [project cleanup summary](../../assets/tools/cleanup/info-cleanup-2026-09-25.md). Earlier editions, rollback copies, old build directories and caches were removed and remain in git history: `git checkout bf75693 -- "<path>"`.

- output/: supporting PDF/PNG exports matching the production files.
- assets/template-refactor/: page-colored logo used by the guide.
- tmp/template-refactor/plan.json: current guide plan (matches project `assets/tools/guide-template/kits.json`).
- tmp/template-refactor/: guide work directory for the shared builder (guide HTML, PDF, PNG and layout checks).
- tmp/8x10-artwork/: guide step pictures (`step-N.png`), step plan, region and line masks, and the `outline.bmp`/`paint.bmp` sources read by the stage-panel builder `Fox Fall/info/tmp/build-new-panels.cjs`.
- tmp/build-new-panels.cjs, kit-paths.cjs, new-kits.cjs, raster.cjs: shared stage-panel builder for the four autumn kits.
- tmp/vector-tools/: shared jimp and resvg packages loaded by project tools and the simplified builders. Keep it.
- tmp/simplified/, assets/simplified/, output/simplified/: the simplified edition described below.
- archive/previous-root-files/: supplied original source image (`download.png`).
- organization-manifest.json: record of the September 20 organization move (old path, new path, SHA-256). Many files it lists were removed in the September 25 cleanup.
- production-selection.json: selected source paths and hashes for the three promoted files.

Review: Existing matching centered composition preserved; children’s transfer gray.

Do not run old transfer exporters over the current 2-point gray SVG. Shared logo: project `assets/images/river-and-ridge-logo.png`. See the project canvas-kits.md and AGENTS.md for current instructions.

## Current guide template

The current guide uses the Fall View template, with logo and background accents matched to this painting. Shared builder: `assets/tools/guide-template/build.cjs` at the project root. Editable plan, HTML, logo prompt, layout checks and final verification: [tmp/template-refactor/](tmp/template-refactor/). Page-colored logo: [assets/template-refactor/river-and-ridge-logo.png](assets/template-refactor/river-and-ridge-logo.png). Earlier guide editions are in git history (`bf75693`). Current artwork and transfer are unchanged.

## Simplified children's edition

The separate [simplified edition](../simplified/) is for ages 8-14, with wording an 8-year-old can follow. It keeps original artwork stages 1, 2, 3, 5, 6 and 7 as six numbered panels. In the simplified reference, only the native stage-7 paws group is changed: the paws and ear tips are black instead of dark brown. Every pixel outside that mask remains unchanged. Advanced texture, shading and highlight stages 8-11 are omitted. The approved production outline is copied byte-for-byte, and the three kit-root production files remain unchanged.

Ready-to-use paints are orange, ivory, forest green, golden yellow, black and white. Dark brown is not used. The guide contains no mixing directions. Final files: [outline copy](../simplified/fox-fall-outline-8x10.svg), [six-step guide](../simplified/fox-fall-painting-guide-8x10.pdf), and [matching reference](../simplified/fox-fall-finished-reference-8x10.pdf).

Editable mapping and directions: [tmp/simplified/plan.json](tmp/simplified/plan.json). Builder, native-mask color-layer script, page-size checks, constrained-pixel check, registration overlay, original hashes and promotion manifest: [tmp/simplified/](tmp/simplified/). Matching 300-DPI PDF renders: [output/simplified/](output/simplified/). Derived target: [assets/simplified/fox-fall-final-step-7-black-paws.png](assets/simplified/fox-fall-final-step-7-black-paws.png). The prior dark-brown revision is in git history (`bf75693`).
