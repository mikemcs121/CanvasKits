# Cat in Pumpkin supporting files

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

## Simplified edition for ages 8-14

The user-requested [simplified folder](../simplified/) holds a separate three-file edition: an unchanged copy of the approved SVG outline, a four-step Letter-size guide, and an 8 x 10 reference based on the original step 6. The original production files in the parent folder remain available.

The four guide panels retain original steps 1, 2, 3 and 6, renumbered 1-4. The last panel includes the pink inner ears, nose and tongue, and dark pumpkin openings already visible in the step-6 target. Per the user's latest September 23 revision, the formerly golden eye areas are left white in both the guide and reference. Later pumpkin shading and fur highlights are omitted. All required paint colors are provided ready to use: orange, gray, pink, dark brown, black and white. The simplified guide contains no color-mixing instructions. Its earlier mixing-based edition is preserved under `archive/simplified-before-ready-mixed-paints/`; the supplied-colors edition with golden eyes is preserved under `archive/simplified-before-white-eyes/`.

Sources: `tmp/8x10-artwork/step-1.png`, `step-2.png`, `step-3.png`, and `step-6.png`; approved parent SVG; existing page-colored logo in `assets/template-refactor/`. The original centered placement is preserved without stretching. Editable build sources, checks and review records: [tmp/simplified/](tmp/simplified/). Matching PDF renders: [output/simplified/](output/simplified/).

The current final-stage artwork uses the original canonical eye-region mask to restore the white eye areas from the earlier unpainted stage. It keeps the original step-6 pixels everywhere else. The derived artwork is stored under `assets/simplified/`; supplied source stages remain unchanged.

Checks: [independent visual and wording review](tmp/simplified/independent-review.md), [geometry and preservation checks](tmp/simplified/verification.json), and [final file/hash manifest](tmp/simplified/promotion-manifest.json). The guide is one US Letter page, and the reference is one 8 x 10 page. Print the artwork at Actual size / 100%.

September 23 supplied-colors revision: [paint list, no-mixing and preservation checks](tmp/simplified/provided-paints-checks.json).

The latest white-eye revision is covered by the current [independent review](tmp/simplified/independent-review.md), [verification](tmp/simplified/verification.json) and [promotion manifest](tmp/simplified/promotion-manifest.json).
