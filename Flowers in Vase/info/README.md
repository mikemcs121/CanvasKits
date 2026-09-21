# Flowers in Vase supporting files

## Current production — September 21, 2026

The guide-only detail cleanup is promoted. The reference remains unchanged and matches the supplied original. The approved outline/transfer is unchanged. Parent-folder PDFs are authoritative.

- Current guide plan: [plan.json](tmp/template-refactor/plan.json), synchronized with project `assets/tools/guide-template/kits.json`.
- Current build, rendered reviews and measured checks: [reference-restoration](tmp/reference-restoration/).
- Exact promoted/archived paths and hashes: [promotion manifest](tmp/reference-restoration/promotion-manifest.json).
- Supporting final PDF/PNG copies: `output/pdf/8x10/`.
- Rollback copies: `archive/before-restoration-promotion-2026-09-21/`.
- Project [review and comparisons](../../reference-restoration-review.md) and [completed handoff](../../RESTORATION-HANDOFF.md).

## Earlier organization and template provenance

The dated build selections below describe earlier editions, not the current restoration. Preserve them for dependencies and provenance; do not rerun historical exporters over current production. The shared template/logo remains in use, but current plan/check paths above take precedence.

The three files in the parent folder are the current production set: SVG transfer, guide PDF, and color-reference PDF. Select those when printing or sending the transfer to a supplier.

- assets/: canonical artwork, guide stages, masks and logo variants.
- tmp/: editable build sources, prompts, renders and verification records. Older dependencies are retained together to preserve provenance.
- output/: supporting exports, including matching PNGs and compatibility outline PDFs. Historical drafts may also be present; the parent folder is authoritative.
- test/ (when present): preserved supplied/test artwork.
- archive/previous-root-files/: previous root image aliases, original supplied images and old notes. These are retained unchanged, not current production choices.
- archive/build-caches/: old browser export profiles and package-download caches, preserved separately from working sources.
- organization-manifest.json: every moved file's original path, new path, size and SHA-256. All moved files were hash-verified.
- production-selection.json: selected source paths and hashes for the three promoted files.

Review: Existing full-portrait reference and guide reviewed; unchanged.

Active build/provenance: assets/portrait-rebuild/ and tmp/portrait-rebuild/; tmp/8x10/ remains a builder dependency.

Old instructions in preserved files describe the former layout. Old kit-relative assets/, tmp/, output/ and test/ paths now begin with info/. Old root image aliases live in archive/previous-root-files/. Builders that have not been adapted must have their paths reviewed before use; do not run old transfer exporters over the current 2-point gray SVG. Shared logo remains at project assets/images/river-and-ridge-logo.png. See the project canvas-kits.md and AGENTS.md for current instructions.

## Current guide template

The current guide uses the Fall View template, with logo and background accents matched to this painting. Shared builder: `assets/tools/guide-template/build.cjs` at the project root. Editable plan, HTML, logo prompt, layout checks and final verification: [tmp/template-refactor/](tmp/template-refactor/). Page-colored logo: [assets/template-refactor/river-and-ridge-logo.png](assets/template-refactor/river-and-ridge-logo.png). Earlier guide PDF/PNG: `archive/before-fall-view-template/`. Current artwork and transfer are unchanged.
