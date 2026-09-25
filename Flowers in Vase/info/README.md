# Flowers in Vase supporting files

## Current production — September 21, 2026

The guide-only detail cleanup is promoted. The reference remains unchanged and matches the supplied original. The approved outline/transfer is unchanged. Parent-folder PDFs are authoritative.

- Current guide plan: [plan.json](tmp/template-refactor/plan.json), synchronized with project `assets/tools/guide-template/kits.json`.
- Current build, rendered reviews and measured checks: [reference-restoration](tmp/reference-restoration/).
- Exact promoted/archived paths and hashes: [promotion manifest](tmp/reference-restoration/promotion-manifest.json).
- Supporting final PDF/PNG copies: `output/pdf/8x10/`.
- Rollback copies of the pre-restoration files are in git history (`bf75693`).
- Project restoration review and handoff notes: git history (`git show bf75693:reference-restoration-review.md`, `RESTORATION-HANDOFF.md`).

## What is in info/

The three files in the parent folder are the current production set: SVG transfer, guide PDF, and color-reference PDF. Select those when printing or sending the transfer to a supplier.

On September 25, 2026 this folder was reduced to what is still used; see the [project cleanup summary](../../assets/tools/cleanup/info-cleanup-2026-09-25.md). Earlier editions, rollback copies, old build directories and caches were removed and remain in git history: `git checkout bf75693 -- "<path>"`.

- output/: supporting PDF/PNG exports matching the production files.
- assets/template-refactor/: page-colored logo used by the guide.
- tmp/template-refactor/plan.json: current guide plan (matches project `assets/tools/guide-template/kits.json`).
- assets/portrait-rebuild/: stage pictures and canonical artwork; tmp/portrait-rebuild/: stage builders (`prepare-art.cjs`, `build-stages.cjs`) with their regions, masks and prompts.
- assets/reference-restoration/: clean crop panels 9-11 and `sources/` (supplied reference); tmp/reference-restoration/: current guide work directory, checks and promotion manifest.
- assets/original-square/: the original square artwork.
- archive/previous-root-files/: supplied original source image (`flowers-in-vase-source-photo.png`).
- organization-manifest.json: record of the September 20 organization move (old path, new path, SHA-256). Many files it lists were removed in the September 25 cleanup.
- production-selection.json: selected source paths and hashes for the three promoted files.

Review: Existing full-portrait reference and guide reviewed; unchanged.

Do not run old transfer exporters over the current 2-point gray SVG. Shared logo: project `assets/images/river-and-ridge-logo.png`. See the project canvas-kits.md and AGENTS.md for current instructions.

## Current guide template

The current guide uses the Fall View template, with logo and background accents matched to this painting. Shared builder: `assets/tools/guide-template/build.cjs` at the project root. Editable plan and logo prompt: [tmp/template-refactor/](tmp/template-refactor/). Current guide HTML, layout checks and verification: [tmp/reference-restoration/](tmp/reference-restoration/). Page-colored logo: [assets/template-refactor/river-and-ridge-logo.png](assets/template-refactor/river-and-ridge-logo.png). Earlier guide editions are in git history (`bf75693`). Current artwork and transfer are unchanged.
