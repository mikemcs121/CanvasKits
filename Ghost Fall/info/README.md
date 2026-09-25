# Ghost Fall supporting files

## What is in info/

The three files in the parent folder are the current production set: SVG transfer, guide PDF, and color-reference PDF. Select those when printing or sending the transfer to a supplier.

On September 25, 2026 this folder was reduced to what is still used; see the [project cleanup summary](../../assets/tools/cleanup/info-cleanup-2026-09-25.md). Earlier editions, rollback copies, old build directories and caches were removed and remain in git history: `git checkout bf75693 -- "<path>"`.

- output/: supporting PDF/PNG exports matching the production files.
- assets/template-refactor/: page-colored logo used by the guide.
- tmp/template-refactor/plan.json: current guide plan (matches project `assets/tools/guide-template/kits.json`).
- tmp/template-refactor/: guide work directory for the shared builder (guide HTML, PDF, PNG and layout checks).
- tmp/8x10-artwork/: guide step pictures (`step-N.png`), step plan, region and line masks, and the `outline.bmp`/`paint.bmp` sources read by the stage-panel builder `Fox Fall/info/tmp/build-new-panels.cjs`.
- tmp/simplified/, assets/simplified/, output/simplified/: the simplified edition described below.
- archive/previous-root-files/: supplied original source image (`exec-8b4604c1-f90d-4ddd-959b-56e4dd2b270f.png`).
- organization-manifest.json: record of the September 20 organization move (old path, new path, SHA-256). Many files it lists were removed in the September 25 cleanup.
- production-selection.json: selected source paths and hashes for the three promoted files.

Review: Existing matching centered composition preserved.

Do not run old transfer exporters over the current 2-point gray SVG. Shared logo: project `assets/images/river-and-ridge-logo.png`. See the project canvas-kits.md and AGENTS.md for current instructions.

## Current guide template

The current guide uses the Fall View template, with logo and background accents matched to this painting. Shared builder: `assets/tools/guide-template/build.cjs` at the project root. Editable plan, HTML, logo prompt, layout checks and final verification: [tmp/template-refactor/](tmp/template-refactor/). Page-colored logo: [assets/template-refactor/river-and-ridge-logo.png](assets/template-refactor/river-and-ridge-logo.png). Earlier guide editions are in git history (`bf75693`). Current artwork and transfer are unchanged.

## Simplified children's edition

A separate five-step edition for ages 8-14 is in `../simplified/`. It keeps a byte-identical copy of the approved outline and leaves the production files in the kit root unchanged. The flat target omits mixing, fold shading, texture and highlights while preserving the centered composition. Ready-to-use paint colors are ivory, plum purple, orange, olive green, coral pink and black.

Editable plan and builders: [tmp/simplified/](tmp/simplified/). Derived cumulative artwork: [assets/simplified/](assets/simplified/). Final PDF renders: [output/simplified/](output/simplified/). Current verification, original hashes and registration results: [tmp/simplified/verification.json](tmp/simplified/verification.json). Source-to-output paths and promoted hashes: [tmp/simplified/promotion-manifest.json](tmp/simplified/promotion-manifest.json).
