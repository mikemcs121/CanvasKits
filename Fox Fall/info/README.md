# Fox Fall supporting files

The three files in the parent folder are the current production set: SVG transfer, guide PDF, and color-reference PDF. Select those when printing or sending the transfer to a supplier.

- assets/: canonical artwork, guide stages, masks and logo variants.
- tmp/: editable build sources, prompts, renders and verification records. Older dependencies are retained together to preserve provenance.
- output/: supporting exports, including matching PNGs and compatibility outline PDFs. Historical drafts may also be present; the parent folder is authoritative.
- test/ (when present): preserved supplied/test artwork.
- archive/previous-root-files/: previous root image aliases, original supplied images and old notes. These are retained unchanged, not current production choices.
- archive/build-caches/: old browser export profiles and package-download caches, preserved separately from working sources.
- organization-manifest.json: every moved file's original path, new path, size and SHA-256. All moved files were hash-verified.
- production-selection.json: selected source paths and hashes for the three promoted files.

Review: Existing matching centered composition preserved; childrenâ€™s transfer gray.

Active build/provenance: assets/8x10/ and tmp/8x10-artwork/; shared autumn builders in Fox Fall/info/tmp/.

Old instructions in preserved files describe the former layout. Old kit-relative assets/, tmp/, output/ and test/ paths now begin with info/. Old root image aliases live in archive/previous-root-files/. Builders that have not been adapted must have their paths reviewed before use; do not run old transfer exporters over the current 2-point gray SVG. Shared logo remains at project assets/images/river-and-ridge-logo.png. See the project canvas-kits.md and AGENTS.md for current instructions.

## Current guide template

The current guide uses the Fall View template, with logo and background accents matched to this painting. Shared builder: `assets/tools/guide-template/build.cjs` at the project root. Editable plan, HTML, logo prompt, layout checks and final verification: [tmp/template-refactor/](tmp/template-refactor/). Page-colored logo: [assets/template-refactor/river-and-ridge-logo.png](assets/template-refactor/river-and-ridge-logo.png). Earlier guide PDF/PNG: `archive/before-fall-view-template/`. Current artwork and transfer are unchanged.

## Simplified children's edition

The separate [simplified edition](../simplified/) is for ages 8-14, with wording an 8-year-old can follow. It keeps original artwork stages 1, 2, 3, 5, 6 and 7 as six numbered panels. In the simplified reference, only the native stage-7 paws group is changed: the paws and ear tips are black instead of dark brown. Every pixel outside that mask remains unchanged. Advanced texture, shading and highlight stages 8-11 are omitted. The approved production outline is copied byte-for-byte, and the three kit-root production files remain unchanged.

Ready-to-use paints are orange, ivory, forest green, golden yellow, black and white. Dark brown is not used. The guide contains no mixing directions. Final files: [outline copy](../simplified/fox-fall-outline-8x10.svg), [six-step guide](../simplified/fox-fall-painting-guide-8x10.pdf), and [matching reference](../simplified/fox-fall-finished-reference-8x10.pdf).

Editable mapping and directions: [tmp/simplified/plan.json](tmp/simplified/plan.json). Builder, native-mask color-layer script, page-size checks, constrained-pixel check, registration overlay, original hashes and promotion manifest: [tmp/simplified/](tmp/simplified/). Matching 300-DPI PDF renders: [output/simplified/](output/simplified/). Derived target: [assets/simplified/fox-fall-final-step-7-black-paws.png](assets/simplified/fox-fall-final-step-7-black-paws.png). The prior dark-brown revision is preserved in [archive/simplified-before-black-paws-2026-09-23/](archive/simplified-before-black-paws-2026-09-23/).
