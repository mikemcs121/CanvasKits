# Reference restoration review - September 21, 2026

Completed and promoted September 21, 2026: four painted references and six guides. Verification found 434 protected source/transfer files unchanged and no unexpected production changes. The authoritative files remain the three production files in each kit root. **No outline or transfer file was changed.** The completed handoff is [RESTORATION-HANDOFF.md](RESTORATION-HANDOFF.md).

## Changes reviewed

| Kit | Reference work | Guide work |
| --- | --- | --- |
| Gnome Fall | Restored distinct left branches, both chains/rings, warm lantern glass, complete brown shoes, smooth beard and leaf edges | All dependent stages, detail crops, preview and drying image refreshed; chain painting explicitly included |
| Gnome Christmas Tree | Replaced smeared lower foliage and shoe fronts; restored missing distant tree; aligned hat lights and clarified cord | All dependent illustrations refreshed; separate snow and pom-pom finishing close-ups; existing paint set retained |
| Fall View | Repaired stretched top canopy, dark branch/trunk smears, coarse bark edges and flat sky texture | Cumulative masks, canopy/bark/ledge details, preview and drying image refreshed |
| Starry-night Sunflower | Cleaner petals, curled greenery and coherent brushwork; intentional seed stippling retained | All dependent illustrations refreshed; historical right-edge star misclassification corrected; seed details withheld until stippling step |
| Flowers in Vase | Unchanged: supplied original is pixel-identical to current reference | Replaced late heavy-overlay crops with clean mapped petal, leaf/vase and berry details |
| Gnome Halloween | Unchanged: supplied original is pixel-identical to current reference | Cleaner finishing crops; pumpkin face remains unpainted until its stated step |

Fox Fall, Ghost Fall, Cat in Pumpkin and Pumpkin were left unchanged because there are no replacement originals for them in New folder. All seven supplied files remain unchanged, including the Fall View source composite (secondary reference only).

## Evidence and limitations

- [Completion and preservation checks](assets/tools/reference-restoration/completion-checks.json) records actual promoted targets and protected-file hashes after promotion.
- [Visual review record](assets/tools/reference-restoration/visual-approval.json) records the inspection performed.
- Independent post-promotion audit passed for all 10 root layouts, 42 promoted/archived records, shared/per-kit plan synchronization and all 434 protected files. It can be repeated read-only with `node assets/tools/reference-restoration/verify-completed.cjs`.
- Each affected kit's `info/tmp/reference-restoration/` holds PDF measurements, layout checks, staged renders, editable plan and promotion manifest. The four repainted kits also contain canonical stage checks, before/after comparisons, enlarged details and magenta registration overlays.
- Reference PDFs are lossless, one 576 x 720-point page. Their 300-DPI renders have **zero changed RGB channels** compared with the selected 2400 x 3000 master (21,600,000 channels checked per image). Guides are one 612 x 792-point page, rendered at 2550 x 3300 pixels and 300 DPI.
- Built-in image generation was used, with prompts under each kit's `info/tmp/reference-restoration/`. Selected native output is about 1122 x 1402 (Sunflower 1121 x 1403); final print images use smooth Lanczos resampling. This is improved reconstructed painted artwork, **not a claim of native 2400 x 3000 detail**.
- Registration is a visual feature/placement check against the fixed transfer, not a claim that every painterly edge is a pixel-identical trace. The transfer geometry, stroke weight, gray and files remain unchanged. These are file checks, not physical sublimation press tests.
- Guide panels are deterministic masks/crops of the selected masters, not independent generated redraws. The original paint lists and shared template/logo assets remain in use. A lower-cost Luna agent handled only the two guide-only crop cleanups and staging; the primary agent reviewed the final pages and reference artwork.

## Before/after comparisons

- [Gnome Fall](<Gnome Fall/info/tmp/reference-restoration/before-after.jpg>)
- [Christmas Gnome](<Gnome Christmas Tree/info/tmp/reference-restoration/before-after.jpg>)
- [Fall View](<fall view/info/tmp/reference-restoration/before-after.jpg>)
- [Sunflower](<Starry-night Sunflower/info/tmp/reference-restoration/before-after.jpg>)

## Rebuild and rollback

The shared guide builder is `assets/tools/guide-template/build.cjs`. Its shared `kits.json` entries and each kit's `info/tmp/template-refactor/plan.json` are synchronized at promotion. Current work files are in `info/tmp/reference-restoration/`; restored masters, full-resolution stages, guide-sized copies and source copies are in `info/assets/reference-restoration/`.

Restoration assembly lives in `assets/tools/reference-restoration/build-art.cjs`. Follow it with `guide-inputs.cjs` and the staged `qa-build.cjs` workflow documented in the handoff. Do not run historical exporters over the current artwork or any transfer.

Previous production and support editions are preserved in each kit's `info/archive/before-restoration-promotion-2026-09-21/`, with additional pre-restoration archives. Promotion manifests record the old and new hashes and exact rollback paths. The untouched Desktop backup was not used as an output destination.
