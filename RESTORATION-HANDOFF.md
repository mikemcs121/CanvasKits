# Canvas reference restoration - live handoff

Updated: September 21, 2026. Status: COMPLETE — reviewed, verified and promoted.

## Resume instruction for any new session/account

Open `C:/Projects/CanvasKits` and read this file, `AGENTS.md`, and `reference-restoration-review.md`. The approved restoration is finished; do not repeat it or rerun promotion. All final files are already in the kit roots. This file preserves the context if the user switches accounts. Any new changes require a new user request. Do not change any outline or transfer file: they have already been sent to the print house.

## Scope

- Restore reference paintings for Gnome Fall, Gnome Christmas Tree, Fall View, Starry-night Sunflower from Desktop `New folder` originals; fit the existing portrait SVG geometry.
- Rebuild their dependent guide stages, crops, previews, and flat-drying images.
- Flowers in Vase and Gnome Halloween references are pixel-identical to supplied originals. Preserve references; only justified guide detail-image cleanup.
- Fox Fall, Ghost Fall, Cat in Pumpkin, Pumpkin stay unchanged (no new originals).
- Preserve Desktop sources and backups. Maintain exactly three root production files per kit. Work and archives live under each kit's `info/`.

## Current status

| Kit/task | Status | Next step |
| --- | --- | --- |
| Review/plan | Complete; approved | See reference-restoration-plan.md |
| Original/production baseline | 434 source/transfer files verified unchanged after promotion | Optional read-only prepare.cjs --verify |
| Fall Gnome | Restored reference and dependent guide promoted | Complete |
| Christmas Gnome | Restored reference, local tree repair, registered bulbs and guide promoted | Complete |
| Fall View | Restored reference and dependent guide promoted | Complete |
| Sunflower | Restored reference and dependent guide promoted | Complete |
| Flowers/Halloween guide cleanup | Both guides promoted; both references unchanged | Complete |
| Final production verification | 10 PDF updates; no unexpected production changes | Complete; see completion-checks.json |

## Key paths and existing evidence

- Approved plan: `reference-restoration-plan.md`.
- Final review, comparisons and limitations: `reference-restoration-review.md`.
- Final checks: `assets/tools/reference-restoration/completion-checks.json` and `visual-approval.json`.
- Final restored masters: `<kit>/info/assets/reference-restoration/restored-master.png` for the four repainted kits. Candidate images are not the final masters.
- Current editable plans: `<kit>/info/tmp/template-refactor/plan.json`, synchronized with shared `assets/tools/guide-template/kits.json`.
- Current build/checks: `<kit>/info/tmp/reference-restoration/`; final supporting PDF/PNG exports: `<kit>/info/output/pdf/8x10/`.
- Rollback: `<kit>/info/archive/before-restoration-promotion-2026-09-21/`; exact old/new paths and hashes in each `info/tmp/reference-restoration/promotion-manifest.json`.
- Sources: `C:/Users/mmcsherry/Desktop/New folder` (7 PNGs, 6 kits).
- Review/hashes: `assets/tools/source-quality-review/2026-09-21/baseline-hashes.json`.
- Review comparisons/details: `assets/tools/source-quality-review/2026-09-21/<slug>/`.
- Current kit index: `canvas-kits.md`; kit provenance: `<kit>/info/README.md`.
- Shared guide builder: `assets/tools/guide-template/build.cjs`, reads **shared kits.json**, not the per-kit plan automatically. Keep shared entries and per-kit plans synchronized.
- Shared PDF renderer: `assets/tools/pdf-render/render-pdf.cjs`. NEVER use the historical PowerShell WinRT renderers.
- Existing gnome stages/masks: `<kit>/info/tmp/organization/`. Existing Fall View/Sunflower stages/masks: `<kit>/info/tmp/organization-repair/`.

## Original defects addressed / technical pitfalls

- Gnome Fall: missing chains/rings, brown blob around left branch/lantern, incomplete shoe soles, ghosted hand/boot outlines, jagged masked edges. Chains and complete shoes exist in the fixed SVG.
- Christmas: smeared lower trees and shoes, artificial vertical shoe fronts, unclear light cord, rough bulbs.
- Fall View: vertical smears at upper canopy, dark smear beside trunk, coarse cutout edges, flatter sky.
- Sunflower: softer/muddier greenery, coarse edges, lost fine brush texture.
- Old adapted masters were 800x1000 enlarged to 2400x3000. Gnome builder spreads color-classified pixels and averages some areas 45 times, producing smears. Do NOT rerun it over corrected art.
- Existing masks need inspection/repair; blindly reusing them may erase restored chains/soles again. Private paint-mask closures are allowed; editing transfer paths is not.
- SVG preview with sharp: use `.resize(2400,3000)` explicitly; density=300 alone produced 10000x12500 because of how the SVG is interpreted. Review preview scripts were corrected. Production SVGs were never edited.
- Flowers and Halloween original-vs-support-PNG and original-vs-root-PDF RGB differences are exactly zero (21,600,000 channels each).

## Verification requirements

Before promotion: unchanged SVG/support-transfer hashes; visual outline overlay matches all fixed objects/details; no missing shapes/added objects/smears/rough masks; guide stages cumulative and mapped to same master; exact final preview/drying picture; existing paint lists/recipes retained; reference PDF 576x720 pt, guide 612x792 pt, one page each; reference PNG 2400x3000 at 300 DPI; guide PNG rendered from final PDF. Archive previous reference/guide versions and preserve originals. Record real checks, no invented passes.

## Execution log (chronological; interim statements below are historical)

- User approved full plan and requested a persistent Markdown handoff.
- Created this handoff before artwork changes. Initial skill/source review in progress.
- Archived all four affected reference/guide pairs and current plans under each kit's `info/archive/before-reference-restoration-2026-09-21/`. Copied all seven originals unchanged to matching kit `info/assets/reference-restoration/sources/`; manifests under `info/tmp/reference-restoration/`.
- Protected baseline (434 supplied/transfer files): `assets/tools/reference-restoration/protected-files.json`. Check with `node assets/tools/reference-restoration/prepare.cjs --verify`. Do not rerun prepare without --verify after promotion (it expects old production baselines).
- Shared guide entries backed up at `assets/tools/reference-restoration/archive/shared-kits-before.json`.
- PDF authoring marker ran successfully once for 10 PDF outputs (4 references, 6 guides).
- Built-in generated candidates are saved, with prompts. Fall Gnome candidate01 selected for assembly; other three use candidate02. Candidate01 rejected for the latter three due geometry drift. Christmas has an additional local generated distant-tree repair and deterministic bulb-registration adjustment; source SVG paths are only copied into private paint masks, never edited.
- New deterministic assembly: `assets/tools/reference-restoration/build-art.cjs`. It stages lossless reference PDFs and dependent canonical guide images. First stage build exposed a grayscale-channel handling bug; fixed before promotion and rerunning all stages. No production files changed.
- Shared guide builder now accepts optional `CANVAS_KITS_PLAN` environment override for staged builds; normal default remains shared kits.json.
- Luna finished both guide-only candidates; staged two-kit array is `assets/tools/reference-restoration/guide-cleanup-kits.json`. Their page size/layout checks passed. Primary still needs final visual review and promotion.
- Guide stage QA corrected historical Sunflower right-edge star region64 (formerly mislabeled green), narrow Fall Gnome twig/chain and edge colors, and premature lantern glow. Guide-sized copies are derived by `guide-inputs.cjs` from full canonical stages, preventing oversized print-export image loads.
- Browser export: installed Chrome is x86, not original hardcoded Program Files path. Shared builder now detects installed Chrome/Edge and accepts CANVAS_BROWSER_EXE. Four-guide build succeeded using `C:/Users/mmcsherry/AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe`. Set that environment variable when rebuilding. `qa-build.cjs --build --render` builds and renders staged PDFs; requires approved execution when nested process spawning is denied by sandbox.
- Cheaper Luna agent assigned only Flowers/Halloween guide crop cleanup, staged proposals only; primary owns integration/promotion. Agent output should be `<kit>/info/tmp/reference-restoration/guide-plan.json` and assets alongside copied originals.

## Most recent next action

No production work remains. The user can review the comparisons and print the root PDFs. Print artwork at Actual size / 100%.

Final primary review covered all six rendered guides, four reference/transfer overlays, enlarged reference details and cumulative stage sheets. Christmas bulb registration uses a smooth Wendland transform with fixed face/perimeter anchors; an earlier pinching candidate was rejected. The small distant tree uses a private paint mask copied from existing geometry, with no SVG edits. Guide snow and pom-pom details have distinct crops. Sunflower retains intentional seed stippling.

Promotion completed successfully: four references plus six guides (10 PDFs), all copies hash-verified, 434 protected source/transfer files unchanged, and no unexpected production changes. Four references rendered with zero changed RGB channels relative to their selected masters. PDF pages, guide layout, image loading and stage sequencing checks passed. No physical press test was performed; painterly registration is not an exact pixel trace.

Independent post-promotion audit passed: all 10 kit roots have exactly three production files, all 42 promoted/archived records match their hashes, current shared/per-kit plans agree, and all 434 protected files remain unchanged. Safe read-only rerun: `node assets/tools/reference-restoration/verify-completed.cjs`. Project index and all six affected kit READMEs now point to this completed edition.

Prompts live under each `info/tmp/reference-restoration/`; generated candidates live under `info/assets/reference-restoration/`. Native generated images are roughly 1122x1402 (Sunflower 1121x1403), smoothly resampled to 2400x3000 at 300 DPI. Do not claim native print-resolution detail.

For a separately requested future rebuild: `build-art.cjs` stages artwork, `guide-inputs.cjs` derives guide copies, and `qa-build.cjs --build --render` exports/renders staged PDFs. Use the browser override recorded above. Review before any new promotion. **Do not rerun promote.cjs or prepare.cjs without --verify against the completed production set**: they intentionally expect the pre-restoration baseline. Read-only preservation check: `node assets/tools/reference-restoration/prepare.cjs --verify`.
