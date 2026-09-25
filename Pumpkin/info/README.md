# Pumpkin supporting files

The three files in the parent folder are the current production set: SVG transfer, guide PDF, and color-reference PDF. Select those when printing or sending the transfer to a supplier.

- assets/: canonical artwork, guide stages, masks and logo variants.
- tmp/: editable build sources, prompts, renders and verification records. Older dependencies are retained together to preserve provenance.
- output/: supporting exports, including matching PNGs and compatibility outline PDFs. Historical drafts may also be present; the parent folder is authoritative.
- test/ (when present): preserved supplied/test artwork.
- archive/previous-root-files/: previous root image aliases, original supplied images and old notes. These are retained unchanged, not current production choices.
- archive/build-caches/: old browser export profiles and package-download caches, preserved separately from working sources.
- organization-manifest.json: every moved file's original path, new path, size and SHA-256. All moved files were hash-verified.
- production-selection.json: selected source paths and hashes for the three promoted files.

Review: Guide repaired to restore clipped header, materials and step numbers; centered composition preserved.

Active build/provenance: assets/8x10/ and tmp/8x10-artwork/; shared autumn builders in Fox Fall/info/tmp/.

Old instructions in preserved files describe the former layout. Old kit-relative assets/, tmp/, output/ and test/ paths now begin with info/. Old root image aliases live in archive/previous-root-files/. Builders that have not been adapted must have their paths reviewed before use; do not run old transfer exporters over the current 2-point gray SVG. Shared logo remains at project assets/images/river-and-ridge-logo.png. See the project canvas-kits.md and AGENTS.md for current instructions.

## Current guide template

The current guide uses the Fall View template, with logo and background accents matched to this painting. Shared builder: `assets/tools/guide-template/build.cjs` at the project root. Editable plan, HTML, logo prompt, layout checks and final verification: [tmp/template-refactor/](tmp/template-refactor/). Page-colored logo: [assets/template-refactor/river-and-ridge-logo.png](assets/template-refactor/river-and-ridge-logo.png). Earlier guide PDF/PNG: `archive/before-fall-view-template/`. Current artwork and transfer are unchanged.

## Name correction

The kit folder is now `Pumpkin`. Current project links, build configuration and SVG title use the corrected spelling. The guide already reads **Autumn Pumpkin** on the page and in its PDF title; both production PDFs are unchanged. Original archives and historical verification records retain their original paths and spelling. Resolve their former kit-folder prefix through the [rename manifest](tmp/name-correction/path-manifest.json).

[Verification](tmp/name-correction/verification.json) ? [PDF page checks](tmp/name-correction/pdf-checks.json) ? [Rendered guide](tmp/name-correction/guide-review.png) ? [Updated files](tmp/name-correction/updated-files.json). Pre-edit copies are preserved in `archive/before-name-correction/`.

## Simplified edition

A separate edition for ages 8-14 is in `../simplified/`. It preserves the approved outline byte-for-byte and keeps the original production set above unchanged. The four child-friendly panels retain original stages 1-4: get ready, paint the pumpkin orange, paint the olive-green stem, and finish the face in black. Mixing, groove shadows, texture and highlights are omitted. The only ready-to-use paint colors are orange, olive green and black.

- [Simplified outline](../simplified/pumpkin-outline-8x10.svg)
- [Simplified guide](../simplified/pumpkin-painting-guide-8x10.pdf)
- [Simplified reference](../simplified/pumpkin-finished-reference-8x10.pdf)
- [Editable plan](tmp/simplified/plan.json)
- [Builder](tmp/simplified/build.py)
- [Verification](tmp/simplified/verification.json)
- [Registration review](tmp/simplified/registration-review.png)
- [Source-to-output manifest](tmp/simplified/source-to-output-manifest.json)
- Matching final PDF renders are in [output/simplified/](output/simplified/).
