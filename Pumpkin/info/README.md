# Pumpkin supporting files

## What is in info/

The three files in the parent folder are the current production set: SVG transfer, guide PDF, and color-reference PDF. Select those when printing or sending the transfer to a supplier.

On September 25, 2026 this folder was reduced to what is still used; see the [project cleanup summary](../../assets/tools/cleanup/info-cleanup-2026-09-25.md). Earlier editions, rollback copies, old build directories and caches were removed and remain in git history: `git checkout bf75693 -- "<path>"`.

- output/: supporting PDF/PNG exports matching the production files.
- assets/template-refactor/: page-colored logo used by the guide.
- tmp/template-refactor/plan.json: current guide plan (matches project `assets/tools/guide-template/kits.json`).
- tmp/template-refactor/: guide work directory for the shared builder (guide HTML, PDF, PNG and layout checks).
- tmp/8x10-artwork/: guide step pictures (`step-N.png`), step plan, region and line masks, and the `outline.bmp`/`paint.bmp` sources read by the stage-panel builder `Fox Fall/info/tmp/build-new-panels.cjs`.
- tmp/transfer-standard/pumpkin-outline-8x10-render.png: read by `tmp/simplified/verify.py`.
- tmp/simplified/, assets/simplified/, output/simplified/: the simplified edition described below.
- archive/previous-root-files/: supplied original source image (`exec-dd3ad511-2377-40d8-bb15-dd9d9771fcbc.png`).
- organization-manifest.json: record of the September 20 organization move (old path, new path, SHA-256). Many files it lists were removed in the September 25 cleanup.
- production-selection.json: selected source paths and hashes for the three promoted files.

Review: Guide repaired to restore clipped header, materials and step numbers; centered composition preserved.

Do not run old transfer exporters over the current 2-point gray SVG. Shared logo: project `assets/images/river-and-ridge-logo.png`. See the project canvas-kits.md and AGENTS.md for current instructions.

## Current guide template

The current guide uses the Fall View template, with logo and background accents matched to this painting. Shared builder: `assets/tools/guide-template/build.cjs` at the project root. Editable plan, HTML, logo prompt, layout checks and final verification: [tmp/template-refactor/](tmp/template-refactor/). Page-colored logo: [assets/template-refactor/river-and-ridge-logo.png](assets/template-refactor/river-and-ridge-logo.png). Earlier guide editions are in git history (`bf75693`). Current artwork and transfer are unchanged.

## Name correction

The kit folder is now `Pumpkin`. Current project links, build configuration and SVG title use the corrected spelling. The guide already reads **Autumn Pumpkin** on the page and in its PDF title; both production PDFs are unchanged. Historical records still use the former `Pumkin` spelling. The rename manifest, verification records and pre-edit copies (`info/tmp/name-correction/` and `info/archive/before-name-correction/`) are in git history (`bf75693`).

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
