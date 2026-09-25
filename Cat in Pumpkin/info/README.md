# Cat in Pumpkin supporting files

## What is in info/

The three files in the parent folder are the current production set: SVG transfer, guide PDF, and color-reference PDF. Select those when printing or sending the transfer to a supplier.

On September 25, 2026 this folder was reduced to what is still used; see the [project cleanup summary](../../assets/tools/cleanup/info-cleanup-2026-09-25.md). Earlier editions, rollback copies, old build directories and caches were removed and remain in git history: `git checkout bf75693 -- "<path>"`.

- output/: supporting PDF/PNG exports matching the production files.
- assets/template-refactor/: page-colored logo used by the guide.
- tmp/template-refactor/plan.json: current guide plan (matches project `assets/tools/guide-template/kits.json`).
- tmp/template-refactor/: guide work directory for the shared builder (guide HTML, PDF, PNG and layout checks).
- tmp/8x10-artwork/: guide step pictures (`step-N.png`), step plan, region and line masks, and the `outline.bmp`/`paint.bmp` sources read by the stage-panel builder `Fox Fall/info/tmp/build-new-panels.cjs`.
- tmp/simplified/, assets/simplified/, output/simplified/: the simplified edition described below.
- archive/previous-root-files/: supplied original source image (`exec-01c35205-b359-4887-a7f9-a31e173a5e1f.png`).
- organization-manifest.json: record of the September 20 organization move (old path, new path, SHA-256). Many files it lists were removed in the September 25 cleanup.
- production-selection.json: selected source paths and hashes for the three promoted files.

Review: Existing matching centered composition preserved; children’s transfer gray.

Do not run old transfer exporters over the current 2-point gray SVG. Shared logo: project `assets/images/river-and-ridge-logo.png`. See the project canvas-kits.md and AGENTS.md for current instructions.

## Current guide template

The current guide uses the Fall View template, with logo and background accents matched to this painting. Shared builder: `assets/tools/guide-template/build.cjs` at the project root. Editable plan, HTML, logo prompt, layout checks and final verification: [tmp/template-refactor/](tmp/template-refactor/). Page-colored logo: [assets/template-refactor/river-and-ridge-logo.png](assets/template-refactor/river-and-ridge-logo.png). Earlier guide editions are in git history (`bf75693`). Current artwork and transfer are unchanged.

## Simplified edition for ages 8-14

The user-requested [simplified folder](../simplified/) holds a separate three-file edition: an unchanged copy of the approved SVG outline, a four-step Letter-size guide, and an 8 x 10 reference based on the original step 6. The original production files in the parent folder remain available.

The four guide panels retain original steps 1, 2, 3 and 6, renumbered 1-4. The last panel includes the pink inner ears, nose and tongue, and dark pumpkin openings already visible in the step-6 target. Per the user's latest September 23 revision, the formerly golden eye areas are left white in both the guide and reference. Later pumpkin shading and fur highlights are omitted. All required paint colors are provided ready to use: orange, gray, pink, dark brown, black and white. The simplified guide contains no color-mixing instructions. Its earlier mixing-based and golden-eye editions are in git history (`bf75693`).

Sources: `tmp/8x10-artwork/step-1.png`, `step-2.png`, `step-3.png`, and `step-6.png`; approved parent SVG; existing page-colored logo in `assets/template-refactor/`. The original centered placement is preserved without stretching. Editable build sources, checks and review records: [tmp/simplified/](tmp/simplified/). Matching PDF renders: [output/simplified/](output/simplified/).

The current final-stage artwork uses the original canonical eye-region mask to restore the white eye areas from the earlier unpainted stage. It keeps the original step-6 pixels everywhere else. The derived artwork is stored under `assets/simplified/`; supplied source stages remain unchanged.

Checks: [independent visual and wording review](tmp/simplified/independent-review.md), [geometry and preservation checks](tmp/simplified/verification.json), and [final file/hash manifest](tmp/simplified/promotion-manifest.json). The guide is one US Letter page, and the reference is one 8 x 10 page. Print the artwork at Actual size / 100%.

September 23 supplied-colors revision: [paint list, no-mixing and preservation checks](tmp/simplified/provided-paints-checks.json).

The latest white-eye revision is covered by the current [independent review](tmp/simplified/independent-review.md), [verification](tmp/simplified/verification.json) and [promotion manifest](tmp/simplified/promotion-manifest.json).
