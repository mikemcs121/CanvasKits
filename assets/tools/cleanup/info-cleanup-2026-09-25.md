# info/ cleanup, September 25, 2026

Every kit's `info/` folder was reduced to the files that current tools read, the sources needed to rebuild guide steps, simplified editions and restored references, current checks and records, and supplied originals. Removed files remain in git history: restore any of them with `git checkout bf75693 -- "<path>"`. The full file list with sizes, SHA-256 and reasons is [info-cleanup-manifest.json](info-cleanup-manifest.json); the rules are in [info-cleanup.cjs](info-cleanup.cjs).

| Kit | Files before | Size before | Files kept | Size kept | Files removed | Size removed |
|---|---:|---:|---:|---:|---:|---:|
| Cat in Pumpkin | 2106 | 301.5 MB | 70 | 92.5 MB | 2036 | 209.0 MB |
| Fall View | 3024 | 605.7 MB | 80 | 248.3 MB | 2944 | 357.5 MB |
| Flowers in Vase | 1825 | 710.9 MB | 73 | 165.3 MB | 1752 | 545.6 MB |
| Fox Fall | 3312 | 310.0 MB | 1583 | 100.6 MB | 1729 | 209.4 MB |
| Ghost Fall | 1381 | 219.5 MB | 62 | 80.0 MB | 1319 | 139.5 MB |
| Gnome Christmas Tree | 2302 | 588.8 MB | 88 | 251.2 MB | 2214 | 337.5 MB |
| Gnome Fall | 915 | 625.7 MB | 75 | 284.6 MB | 840 | 341.1 MB |
| Gnome Halloween | 1941 | 684.9 MB | 73 | 181.9 MB | 1868 | 503.1 MB |
| Pumpkin | 2575 | 274.5 MB | 59 | 83.5 MB | 2516 | 191.0 MB |
| Starry-night Sunflower | 2762 | 646.9 MB | 96 | 277.6 MB | 2666 | 369.3 MB |
| **All kits** | 22143 | 4968.4 MB | 2259 | 1765.4 MB | 19884 | 3203.0 MB |

## What was kept

- Everything outside `info/`, unchanged. SHA-256 of all 1,864 files outside `info/` was checked before and after. The only changes are the deliberate tool and doc edits listed below.
- Files the shared guide builder reads (`assets/tools/guide-template/kits.json`) and files the restoration audit hashes.
- Guide work directories: `tmp/template-refactor/` for the autumn kits, `tmp/reference-restoration/` for the others.
- Rebuild sources:
  - Autumn step art, masks, and the `outline.bmp`/`paint.bmp` inputs to `Fox Fall/info/tmp/build-new-panels.cjs`.
  - The Flowers in Vase `portrait-rebuild` and Gnome Halloween `full-portrait` stage builders and their inputs.
  - Restoration candidates, masks and region labels used by `build-art.cjs`.
  - The simplified-edition builders, art and checks.
- `Fox Fall/info/tmp/vector-tools/`: the jimp and resvg packages that project tools load.
- Supplied originals:
  - `archive/previous-root-files/` source images
  - `assets/reference-restoration/sources/`
  - `Starry-night Sunflower/info/archive/original-square-kit/`
  - `Flowers in Vase/info/assets/original-square/`
  - `test/`
- `output/`, `README.md`, `production-selection.json` and `organization-manifest.json`.

## Verification (September 25, 2026)

- **Guide rebuild.** All 10 guides were rebuilt from the cleaned folders with `assets/tools/guide-template/build.cjs` into a scratch directory. Every layout check passed.
- **Pixel comparison.** The rebuilt guides and the current kit-root guides were rendered with `assets/tools/pdf-render/render-pdf.cjs` at 2550 x 3300 (1 page, 612 x 792 points each). They were identical except for anti-aliasing noise: 0 channels differed by more than 8 of 255, and the largest difference was 5.
- **Restoration audit.** `node assets/tools/reference-restoration/verify-completed.cjs` passes: 67 protected files, 10 kit roots, 42 promotion records.
- **Rebuild inputs.** Every input read by the simplified builders, the autumn stage builder and the restoration `build-art.cjs` was confirmed present.

## Tool and doc changes made with the cleanup

- **`assets/tools/reference-restoration/protected-files.json`:** entries for removed files were dropped (434 → 67), including 7 stale `Desktop/New folder` entries.
- **`verify-completed.cjs`:** the rollback-copy hash is checked only when the archived copy still exists.
- **`assets/tools/guide-template/prepare.cjs` and `assets/tools/organization/verify-final.cjs`:** marked historical.
- **Docs:** `AGENTS.md`, the `build-canvas` and `simplify` skills, `canvas-kits.md` and every kit's `info/README.md` were updated. Earlier editions now live in git history, not in `info/archive/`.
- **`.gitignore`:** now ignores `browser-cache/` and `chrome-profile-*/` folders that builds create.

## Cat in Pumpkin

Kept:

- `info/` (current record): 3 files, 0.4 MB
- `info/archive/previous-root-files/` (supplied original): 1 files, 1.0 MB
- `info/assets/simplified/` (simplified edition art): 1 files, 0.4 MB
- `info/assets/template-refactor/` (read by kits.json or restoration audit): 1 files, 1.9 MB
- `info/output/pdf/8x10/` (production-matching export): 6 files, 26.0 MB
- `info/output/pdf/8x10/` (read by kits.json or restoration audit): 1 files, 6.8 MB
- `info/output/simplified/` (production-matching export): 2 files, 2.5 MB
- `info/output/svg/8x10/` (production-matching export): 1 files, 0.0 MB
- `info/tmp/8x10-artwork/` (guide step art and rebuild source): 10 files, 23.2 MB
- `info/tmp/8x10-artwork/` (read by kits.json or restoration audit): 11 files, 5.5 MB
- `info/tmp/simplified/` (simplified edition build and checks): 25 files, 6.3 MB
- `info/tmp/template-refactor/` (current guide plan): 2 files, 0.0 MB
- `info/tmp/template-refactor/` (current guide work directory): 6 files, 18.4 MB

Removed:

- `info/` (record of moved caches): 1 files, 0.0 MB
- `info/` (superseded build, review or archived edition): 1 files, 0.0 MB
- `info/archive/before-fall-view-template/` (superseded build, review or archived edition): 2 files, 16.8 MB
- `info/archive/before-guide-title-update/` (superseded build, review or archived edition): 2 files, 17.6 MB
- `info/archive/build-caches/8x10-artwork/` (Chrome profile): 596 files, 12.6 MB
- `info/archive/build-caches/8x10-artwork/` (archived build cache): 324 files, 6.4 MB
- `info/archive/name-correction-original-text/` (superseded build, review or archived edition): 71 files, 0.2 MB
- `info/archive/previous-root-files/` (superseded build, review or archived edition): 7 files, 10.1 MB
- `info/archive/simplified-before-ready-mixed-paints/` (superseded build, review or archived edition): 2 files, 5.3 MB
- `info/archive/simplified-before-ready-mixed-paints/build-records/` (superseded build, review or archived edition): 19 files, 6.4 MB
- `info/archive/simplified-before-white-eyes/build-records/` (superseded build, review or archived edition): 21 files, 6.4 MB
- `info/archive/simplified-before-white-eyes/production/` (superseded build, review or archived edition): 3 files, 4.4 MB
- `info/archive/simplified-before-white-eyes/renders/` (superseded build, review or archived edition): 2 files, 2.5 MB
- `info/assets/8x10/` (superseded build, review or archived edition): 1 files, 1.7 MB
- `info/tmp/` (superseded build, review or archived edition): 1 files, 0.0 MB
- `info/tmp/8x10-artwork/` (superseded build, review or archived edition): 16 files, 90.3 MB
- `info/tmp/8x10-artwork/before-transparency/` (superseded build, review or archived edition): 3 files, 1.4 MB
- `info/tmp/8x10-artwork/chrome-profile-1789927848847-pdf/` (Chrome profile): 298 files, 6.3 MB
- `info/tmp/8x10-artwork/chrome-profile-1789927848847/` (Chrome profile): 298 files, 6.3 MB
- `info/tmp/darker-outline/` (superseded build, review or archived edition): 9 files, 1.2 MB
- `info/tmp/darker-outline/before-2pt/` (superseded build, review or archived edition): 9 files, 1.9 MB
- `info/tmp/template-refactor/browser-cache/` (browser cache): 324 files, 6.3 MB
- `info/tmp/transfer-standard/` (superseded build, review or archived edition): 11 files, 1.2 MB
- `info/tmp/transfer-standard/before-transfer/` (superseded build, review or archived edition): 9 files, 3.0 MB
- `info/tmp/vector/` (superseded build, review or archived edition): 6 files, 0.7 MB

## Fall View

Kept:

- `info/` (current record): 2 files, 1.1 MB
- `info/` (read by kits.json or restoration audit): 1 files, 0.0 MB
- `info/archive/previous-root-files/` (supplied original): 1 files, 0.8 MB
- `info/assets/reference-restoration/` (current guide art and supplied sources): 3 files, 6.1 MB
- `info/assets/reference-restoration/` (read by kits.json or restoration audit): 23 files, 83.6 MB
- `info/assets/reference-restoration/sources/` (current guide art and supplied sources): 2 files, 3.3 MB
- `info/assets/template-refactor/` (read by kits.json or restoration audit): 1 files, 1.9 MB
- `info/output/pdf/` (production-matching export): 2 files, 7.9 MB
- `info/output/pdf/8x10/` (production-matching export): 3 files, 2.8 MB
- `info/output/pdf/8x10/` (read by kits.json or restoration audit): 4 files, 58.1 MB
- `info/output/svg/8x10/` (production-matching export): 1 files, 0.1 MB
- `info/test/` (supplied test art): 2 files, 6.4 MB
- `info/tmp/organization-repair/` (restoration rebuild source): 3 files, 3.1 MB
- `info/tmp/reference-restoration/` (current guide work directory and checks): 30 files, 73.2 MB
- `info/tmp/template-refactor/` (current guide plan): 1 files, 0.0 MB
- `info/tmp/template-refactor/` (read by kits.json or restoration audit): 1 files, 0.0 MB

Removed:

- `info/` (record of moved caches): 1 files, 0.0 MB
- `info/archive/before-fall-view-template/` (superseded build, review or archived edition): 2 files, 13.4 MB
- `info/archive/before-reference-restoration-2026-09-21/` (superseded build, review or archived edition): 5 files, 46.2 MB
- `info/archive/before-restoration-promotion-2026-09-21/` (superseded build, review or archived edition): 2 files, 34.0 MB
- `info/archive/before-restoration-promotion-2026-09-21/info/` (superseded build, review or archived edition): 6 files, 46.2 MB
- `info/archive/build-caches/organization-repair/` (Chrome profile): 2458 files, 55.0 MB
- `info/archive/previous-root-files/` (superseded build, review or archived edition): 7 files, 7.0 MB
- `info/assets/` (superseded build, review or archived edition): 1 files, 2.5 MB
- `info/tmp/` (superseded build, review or archived edition): 4 files, 0.0 MB
- `info/tmp/darker-outline/` (superseded build, review or archived edition): 9 files, 4.1 MB
- `info/tmp/darker-outline/before-2pt/` (superseded build, review or archived edition): 9 files, 6.7 MB
- `info/tmp/organization-repair/` (superseded build, review or archived edition): 35 files, 68.8 MB
- `info/tmp/pdfs/` (superseded build, review or archived edition): 9 files, 25.8 MB
- `info/tmp/reference-restoration/browser-cache/` (browser cache): 53 files, 1.7 MB
- `info/tmp/template-refactor/` (superseded build, review or archived edition): 6 files, 27.5 MB
- `info/tmp/template-refactor/browser-cache/` (browser cache): 324 files, 6.4 MB
- `info/tmp/transfer-standard/` (superseded build, review or archived edition): 11 files, 4.1 MB
- `info/tmp/transfer-standard/before-transfer/` (superseded build, review or archived edition): 2 files, 8.0 MB

## Flowers in Vase

Kept:

- `info/` (current record): 2 files, 0.1 MB
- `info/` (read by kits.json or restoration audit): 1 files, 0.0 MB
- `info/archive/previous-root-files/` (supplied original): 1 files, 0.8 MB
- `info/assets/original-square/` (supplied original): 2 files, 5.4 MB
- `info/assets/portrait-rebuild/` (read by kits.json or restoration audit): 8 files, 8.2 MB
- `info/assets/portrait-rebuild/` (stage art and rebuild source): 12 files, 20.5 MB
- `info/assets/reference-restoration/` (read by kits.json or restoration audit): 3 files, 1.6 MB
- `info/assets/reference-restoration/sources/` (current guide art and supplied sources): 1 files, 10.3 MB
- `info/assets/template-refactor/` (read by kits.json or restoration audit): 1 files, 2.0 MB
- `info/output/pdf/` (production-matching export): 2 files, 10.1 MB
- `info/output/pdf/8x10/` (production-matching export): 4 files, 19.2 MB
- `info/output/pdf/8x10/` (read by kits.json or restoration audit): 3 files, 43.9 MB
- `info/output/svg/8x10/` (production-matching export): 1 files, 0.0 MB
- `info/tmp/portrait-rebuild/` (stage rebuild source): 14 files, 7.7 MB
- `info/tmp/reference-restoration/` (current guide work directory and checks): 16 files, 35.3 MB
- `info/tmp/template-refactor/` (current guide plan): 1 files, 0.0 MB
- `info/tmp/template-refactor/` (read by kits.json or restoration audit): 1 files, 0.0 MB

Removed:

- `info/archive/before-fall-view-template/` (superseded build, review or archived edition): 2 files, 10.1 MB
- `info/archive/before-restoration-promotion-2026-09-21/` (superseded build, review or archived edition): 1 files, 28.4 MB
- `info/archive/before-restoration-promotion-2026-09-21/info/` (superseded build, review or archived edition): 4 files, 33.2 MB
- `info/archive/previous-root-files/` (superseded build, review or archived edition): 10 files, 28.5 MB
- `info/archive/reference-restoration-2026-09-21/` (superseded build, review or archived edition): 3 files, 28.4 MB
- `info/assets/` (superseded build, review or archived edition): 18 files, 29.7 MB
- `info/assets/8x10/` (superseded build, review or archived edition): 17 files, 28.3 MB
- `info/tmp/` (superseded build, review or archived edition): 29 files, 33.7 MB
- `info/tmp/8x10/` (superseded build, review or archived edition): 35 files, 94.8 MB
- `info/tmp/darker-outline/` (superseded build, review or archived edition): 9 files, 3.0 MB
- `info/tmp/darker-outline/before-2pt/` (superseded build, review or archived edition): 9 files, 5.1 MB
- `info/tmp/portrait-rebuild/` (superseded build, review or archived edition): 30 files, 54.4 MB
- `info/tmp/portrait-rebuild/previous-edition/` (superseded build, review or archived edition): 17 files, 78.5 MB
- `info/tmp/prior-guide/` (superseded build, review or archived edition): 2 files, 13.8 MB
- `info/tmp/reference-restoration/browser-cache/` (browser cache): 1204 files, 26.3 MB
- `info/tmp/template-refactor/` (superseded build, review or archived edition): 6 files, 33.2 MB
- `info/tmp/template-refactor/browser-cache/` (browser cache): 324 files, 6.3 MB
- `info/tmp/transfer-standard/` (superseded build, review or archived edition): 11 files, 3.0 MB
- `info/tmp/transfer-standard/before-transfer/` (superseded build, review or archived edition): 9 files, 4.6 MB
- `info/tmp/vector/` (superseded build, review or archived edition): 12 files, 2.1 MB

## Fox Fall

Kept:

- `info/` (current record): 3 files, 1.0 MB
- `info/archive/previous-root-files/` (supplied original): 1 files, 0.9 MB
- `info/assets/simplified/` (simplified edition art): 1 files, 0.2 MB
- `info/assets/template-refactor/` (read by kits.json or restoration audit): 1 files, 2.1 MB
- `info/output/pdf/8x10/` (production-matching export): 6 files, 18.9 MB
- `info/output/pdf/8x10/` (read by kits.json or restoration audit): 1 files, 5.0 MB
- `info/output/simplified/` (production-matching export): 2 files, 2.2 MB
- `info/output/svg/8x10/` (production-matching export): 1 files, 0.0 MB
- `info/tmp/` (stage-panel rebuild source): 4 files, 0.0 MB
- `info/tmp/8x10-artwork/` (guide step art and rebuild source): 10 files, 22.1 MB
- `info/tmp/8x10-artwork/` (read by kits.json or restoration audit): 11 files, 2.4 MB
- `info/tmp/simplified/` (simplified edition build and checks): 21 files, 5.9 MB
- `info/tmp/template-refactor/` (current guide plan): 2 files, 0.0 MB
- `info/tmp/template-refactor/` (current guide work directory): 6 files, 13.1 MB
- `info/tmp/vector-tools/` (shared jimp/resvg used by current tools): 8 files, 0.2 MB
- `info/tmp/vector-tools/node_modules/` (shared jimp/resvg used by current tools): 1505 files, 26.7 MB

Removed:

- `info/` (record of moved caches): 1 files, 0.0 MB
- `info/archive/before-fall-view-template/` (superseded build, review or archived edition): 2 files, 12.6 MB
- `info/archive/build-caches/8x10-artwork/` (Chrome profile): 596 files, 12.6 MB
- `info/archive/build-caches/8x10-artwork/` (archived build cache): 324 files, 6.4 MB
- `info/archive/build-caches/vector-tools/` (archived build cache): 339 files, 58.1 MB
- `info/archive/previous-root-files/` (superseded build, review or archived edition): 7 files, 7.7 MB
- `info/archive/simplified-before-black-paws-2026-09-23/` (superseded build, review or archived edition): 1 files, 0.0 MB
- `info/archive/simplified-before-black-paws-2026-09-23/assets/` (superseded build, review or archived edition): 1 files, 0.1 MB
- `info/archive/simplified-before-black-paws-2026-09-23/output/` (superseded build, review or archived edition): 2 files, 2.2 MB
- `info/archive/simplified-before-black-paws-2026-09-23/simplified/` (superseded build, review or archived edition): 3 files, 4.4 MB
- `info/archive/simplified-before-black-paws-2026-09-23/tmp/` (superseded build, review or archived edition): 19 files, 5.9 MB
- `info/assets/8x10/` (superseded build, review or archived edition): 1 files, 1.7 MB
- `info/tmp/` (superseded build, review or archived edition): 24 files, 2.7 MB
- `info/tmp/8x10-artwork/` (superseded build, review or archived edition): 16 files, 75.8 MB
- `info/tmp/8x10-artwork/before-transparency/` (superseded build, review or archived edition): 3 files, 1.3 MB
- `info/tmp/darker-outline/` (superseded build, review or archived edition): 20 files, 3.2 MB
- `info/tmp/darker-outline/before-2pt/` (superseded build, review or archived edition): 9 files, 1.9 MB
- `info/tmp/template-refactor/browser-cache/` (browser cache): 324 files, 6.3 MB
- `info/tmp/transfer-standard/` (superseded build, review or archived edition): 22 files, 3.0 MB
- `info/tmp/transfer-standard/before-transfer/` (superseded build, review or archived edition): 9 files, 2.8 MB
- `info/tmp/vector/` (superseded build, review or archived edition): 6 files, 0.7 MB

## Ghost Fall

Kept:

- `info/` (current record): 3 files, 0.4 MB
- `info/archive/previous-root-files/` (supplied original): 1 files, 0.7 MB
- `info/assets/simplified/` (simplified edition art): 5 files, 0.6 MB
- `info/assets/template-refactor/` (read by kits.json or restoration audit): 1 files, 1.9 MB
- `info/output/pdf/8x10/` (production-matching export): 6 files, 21.7 MB
- `info/output/pdf/8x10/` (read by kits.json or restoration audit): 1 files, 4.2 MB
- `info/output/simplified/` (production-matching export): 2 files, 1.8 MB
- `info/output/svg/8x10/` (production-matching export): 1 files, 0.0 MB
- `info/tmp/8x10-artwork/` (guide step art and rebuild source): 10 files, 21.5 MB
- `info/tmp/8x10-artwork/` (read by kits.json or restoration audit): 11 files, 6.6 MB
- `info/tmp/simplified/` (simplified edition build and checks): 13 files, 3.7 MB
- `info/tmp/template-refactor/` (current guide plan): 2 files, 0.0 MB
- `info/tmp/template-refactor/` (current guide work directory): 6 files, 16.9 MB

Removed:

- `info/` (record of moved caches): 1 files, 0.0 MB
- `info/archive/before-fall-view-template/` (superseded build, review or archived edition): 2 files, 16.3 MB
- `info/archive/build-caches/8x10-artwork/` (Chrome profile): 596 files, 12.6 MB
- `info/archive/build-caches/8x10-artwork/` (archived build cache): 324 files, 6.4 MB
- `info/archive/previous-root-files/` (superseded build, review or archived edition): 7 files, 6.6 MB
- `info/assets/8x10/` (superseded build, review or archived edition): 1 files, 1.7 MB
- `info/tmp/` (superseded build, review or archived edition): 1 files, 0.0 MB
- `info/tmp/8x10-artwork/` (superseded build, review or archived edition): 16 files, 82.5 MB
- `info/tmp/8x10-artwork/before-transparency/` (superseded build, review or archived edition): 3 files, 1.0 MB
- `info/tmp/darker-outline/` (superseded build, review or archived edition): 9 files, 0.9 MB
- `info/tmp/darker-outline/before-2pt/` (superseded build, review or archived edition): 9 files, 1.7 MB
- `info/tmp/template-refactor/browser-cache/` (browser cache): 324 files, 6.3 MB
- `info/tmp/transfer-standard/` (superseded build, review or archived edition): 11 files, 0.9 MB
- `info/tmp/transfer-standard/before-transfer/` (superseded build, review or archived edition): 9 files, 2.1 MB
- `info/tmp/vector/` (superseded build, review or archived edition): 6 files, 0.5 MB

## Gnome Christmas Tree

Kept:

- `info/` (current record): 2 files, 0.2 MB
- `info/` (read by kits.json or restoration audit): 1 files, 0.0 MB
- `info/assets/reference-restoration/` (current guide art and supplied sources): 5 files, 7.2 MB
- `info/assets/reference-restoration/` (read by kits.json or restoration audit): 23 files, 92.5 MB
- `info/assets/reference-restoration/sources/` (current guide art and supplied sources): 1 files, 9.7 MB
- `info/assets/template-refactor/` (read by kits.json or restoration audit): 1 files, 2.0 MB
- `info/output/pdf/` (production-matching export): 2 files, 4.8 MB
- `info/output/pdf/8x10/` (production-matching export): 3 files, 1.1 MB
- `info/output/pdf/8x10/` (read by kits.json or restoration audit): 4 files, 53.2 MB
- `info/output/svg/8x10/` (production-matching export): 1 files, 0.0 MB
- `info/test/` (supplied test art): 2 files, 3.9 MB
- `info/tmp/organization/` (restoration rebuild source): 3 files, 3.1 MB
- `info/tmp/reference-restoration/` (current guide work directory and checks): 38 files, 73.4 MB
- `info/tmp/template-refactor/` (current guide plan): 1 files, 0.0 MB
- `info/tmp/template-refactor/` (read by kits.json or restoration audit): 1 files, 0.0 MB

Removed:

- `info/` (record of moved caches): 1 files, 0.0 MB
- `info/archive/before-fall-view-template/` (superseded build, review or archived edition): 2 files, 13.6 MB
- `info/archive/before-reference-restoration-2026-09-21/` (superseded build, review or archived edition): 5 files, 36.0 MB
- `info/archive/before-restoration-promotion-2026-09-21/` (superseded build, review or archived edition): 2 files, 24.5 MB
- `info/archive/before-restoration-promotion-2026-09-21/info/` (superseded build, review or archived edition): 6 files, 36.0 MB
- `info/archive/before-sky-smoothing/` (superseded build, review or archived edition): 3 files, 9.0 MB
- `info/archive/before-sky-smoothing/info/` (superseded build, review or archived edition): 35 files, 62.0 MB
- `info/archive/build-caches/pdfs/` (archived build cache): 239 files, 8.2 MB
- `info/archive/previous-root-files/` (superseded build, review or archived edition): 6 files, 11.2 MB
- `info/assets/` (superseded build, review or archived edition): 1 files, 0.4 MB
- `info/tmp/darker-outline/` (superseded build, review or archived edition): 9 files, 1.5 MB
- `info/tmp/darker-outline/before-2pt/` (superseded build, review or archived edition): 9 files, 2.6 MB
- `info/tmp/organization/` (superseded build, review or archived edition): 27 files, 52.0 MB
- `info/tmp/organization/chrome-organization/` (Chrome profile): 324 files, 6.4 MB
- `info/tmp/pdfs/` (superseded build, review or archived edition): 10 files, 7.2 MB
- `info/tmp/reference-restoration/browser-cache/` (browser cache): 1192 files, 27.3 MB
- `info/tmp/template-refactor/` (superseded build, review or archived edition): 6 files, 27.1 MB
- `info/tmp/template-refactor/browser-cache/` (browser cache): 324 files, 6.3 MB
- `info/tmp/transfer-standard/` (superseded build, review or archived edition): 11 files, 1.5 MB
- `info/tmp/transfer-standard/before-transfer/` (superseded build, review or archived edition): 2 files, 4.5 MB

## Gnome Fall

Kept:

- `info/` (current record): 2 files, 0.2 MB
- `info/` (read by kits.json or restoration audit): 1 files, 0.0 MB
- `info/archive/previous-root-files/` (supplied original): 1 files, 0.7 MB
- `info/assets/reference-restoration/` (current guide art and supplied sources): 2 files, 3.5 MB
- `info/assets/reference-restoration/` (read by kits.json or restoration audit): 23 files, 118.5 MB
- `info/assets/reference-restoration/sources/` (current guide art and supplied sources): 1 files, 2.5 MB
- `info/assets/template-refactor/` (read by kits.json or restoration audit): 1 files, 1.9 MB
- `info/output/pdf/` (production-matching export): 2 files, 7.4 MB
- `info/output/pdf/8x10/` (production-matching export): 3 files, 3.1 MB
- `info/output/pdf/8x10/` (read by kits.json or restoration audit): 4 files, 63.3 MB
- `info/output/svg/8x10/` (production-matching export): 1 files, 0.1 MB
- `info/test/` (supplied test art): 1 files, 6.4 MB
- `info/tmp/organization/` (restoration rebuild source): 3 files, 3.3 MB
- `info/tmp/reference-restoration/` (current guide work directory and checks): 28 files, 73.7 MB
- `info/tmp/template-refactor/` (current guide plan): 1 files, 0.0 MB
- `info/tmp/template-refactor/` (read by kits.json or restoration audit): 1 files, 0.0 MB

Removed:

- `info/archive/before-fall-view-template/` (superseded build, review or archived edition): 2 files, 16.4 MB
- `info/archive/before-reference-restoration-2026-09-21/` (superseded build, review or archived edition): 5 files, 42.1 MB
- `info/archive/before-restoration-promotion-2026-09-21/` (superseded build, review or archived edition): 2 files, 29.2 MB
- `info/archive/before-restoration-promotion-2026-09-21/info/` (superseded build, review or archived edition): 6 files, 42.1 MB
- `info/archive/before-sky-smoothing/` (superseded build, review or archived edition): 3 files, 9.6 MB
- `info/archive/before-sky-smoothing/info/` (superseded build, review or archived edition): 38 files, 58.7 MB
- `info/archive/previous-root-files/` (superseded build, review or archived edition): 7 files, 7.0 MB
- `info/assets/` (superseded build, review or archived edition): 1 files, 2.4 MB
- `info/tmp/darker-outline/` (superseded build, review or archived edition): 9 files, 4.4 MB
- `info/tmp/darker-outline/before-2pt/` (superseded build, review or archived edition): 9 files, 7.5 MB
- `info/tmp/organization/` (superseded build, review or archived edition): 30 files, 50.7 MB
- `info/tmp/organization/chrome-organization/` (Chrome profile): 324 files, 6.4 MB
- `info/tmp/pdfs/` (superseded build, review or archived edition): 8 files, 12.4 MB
- `info/tmp/reference-restoration/browser-cache/` (browser cache): 53 files, 1.7 MB
- `info/tmp/template-refactor/` (superseded build, review or archived edition): 6 files, 31.8 MB
- `info/tmp/template-refactor/browser-cache/` (browser cache): 324 files, 6.3 MB
- `info/tmp/transfer-standard/` (superseded build, review or archived edition): 11 files, 4.4 MB
- `info/tmp/transfer-standard/before-transfer/` (superseded build, review or archived edition): 2 files, 8.0 MB

## Gnome Halloween

Kept:

- `info/` (current record): 2 files, 0.1 MB
- `info/` (read by kits.json or restoration audit): 1 files, 0.0 MB
- `info/assets/full-portrait/` (read by kits.json or restoration audit): 8 files, 12.9 MB
- `info/assets/full-portrait/` (stage art and rebuild source): 12 files, 18.9 MB
- `info/assets/reference-restoration/` (read by kits.json or restoration audit): 3 files, 1.2 MB
- `info/assets/reference-restoration/sources/` (current guide art and supplied sources): 1 files, 8.8 MB
- `info/assets/template-refactor/` (read by kits.json or restoration audit): 1 files, 1.9 MB
- `info/output/pdf/` (production-matching export): 2 files, 13.3 MB
- `info/output/pdf/8x10/` (production-matching export): 4 files, 17.2 MB
- `info/output/pdf/8x10/` (read by kits.json or restoration audit): 3 files, 50.9 MB
- `info/output/svg/8x10/` (production-matching export): 1 files, 0.0 MB
- `info/test/` (supplied test art): 2 files, 3.9 MB
- `info/tmp/full-portrait/` (stage rebuild source): 14 files, 8.7 MB
- `info/tmp/reference-restoration/` (current guide work directory and checks): 17 files, 44.0 MB
- `info/tmp/template-refactor/` (current guide plan): 1 files, 0.0 MB
- `info/tmp/template-refactor/` (read by kits.json or restoration audit): 1 files, 0.0 MB

Removed:

- `info/` (record of moved caches): 1 files, 0.0 MB
- `info/archive/before-fall-view-template/` (superseded build, review or archived edition): 2 files, 13.3 MB
- `info/archive/before-restoration-promotion-2026-09-21/` (superseded build, review or archived edition): 1 files, 37.1 MB
- `info/archive/before-restoration-promotion-2026-09-21/info/` (superseded build, review or archived edition): 4 files, 42.0 MB
- `info/archive/build-caches/pdfs/` (archived build cache): 147 files, 6.3 MB
- `info/archive/previous-root-files/` (superseded build, review or archived edition): 9 files, 27.8 MB
- `info/archive/reference-restoration-2026-09-21/` (superseded build, review or archived edition): 3 files, 37.1 MB
- `info/assets/` (superseded build, review or archived edition): 1 files, 2.3 MB
- `info/assets/8x10/` (superseded build, review or archived edition): 20 files, 38.5 MB
- `info/tmp/darker-outline/` (superseded build, review or archived edition): 9 files, 1.6 MB
- `info/tmp/darker-outline/before-2pt/` (superseded build, review or archived edition): 9 files, 2.7 MB
- `info/tmp/earlier-guide/` (superseded build, review or archived edition): 3 files, 8.7 MB
- `info/tmp/full-portrait/` (superseded build, review or archived edition): 26 files, 53.2 MB
- `info/tmp/full-portrait/previous-edition/` (superseded build, review or archived edition): 14 files, 53.8 MB
- `info/tmp/imagegen/` (superseded build, review or archived edition): 8 files, 11.6 MB
- `info/tmp/outline-comparison/` (superseded build, review or archived edition): 3 files, 1.8 MB
- `info/tmp/pdfs/` (superseded build, review or archived edition): 10 files, 18.7 MB
- `info/tmp/reference-restoration/browser-cache/` (browser cache): 1207 files, 26.3 MB
- `info/tmp/template-refactor/` (superseded build, review or archived edition): 6 files, 42.0 MB
- `info/tmp/template-refactor/browser-cache/` (browser cache): 324 files, 6.3 MB
- `info/tmp/transfer-standard/` (superseded build, review or archived edition): 11 files, 1.6 MB
- `info/tmp/transfer-standard/before-transfer/` (superseded build, review or archived edition): 8 files, 2.0 MB
- `info/tmp/vector-8x10/` (superseded build, review or archived edition): 42 files, 68.3 MB

## Pumpkin

Kept:

- `info/` (current record): 3 files, 0.9 MB
- `info/archive/previous-root-files/` (supplied original): 1 files, 0.9 MB
- `info/assets/simplified/` (simplified edition art): 4 files, 0.5 MB
- `info/assets/template-refactor/` (read by kits.json or restoration audit): 1 files, 1.9 MB
- `info/output/pdf/8x10/` (production-matching export): 6 files, 23.7 MB
- `info/output/pdf/8x10/` (read by kits.json or restoration audit): 1 files, 6.9 MB
- `info/output/simplified/` (production-matching export): 2 files, 1.7 MB
- `info/output/svg/8x10/` (production-matching export): 1 files, 0.0 MB
- `info/tmp/8x10-artwork/` (guide step art and rebuild source): 10 files, 23.3 MB
- `info/tmp/8x10-artwork/` (read by kits.json or restoration audit): 7 files, 3.5 MB
- `info/tmp/simplified/` (simplified edition build and checks): 14 files, 4.1 MB
- `info/tmp/template-refactor/` (current guide plan): 2 files, 0.0 MB
- `info/tmp/template-refactor/` (current guide work directory): 6 files, 16.0 MB
- `info/tmp/transfer-standard/` (read by simplified verify.py): 1 files, 0.1 MB

Removed:

- `info/` (record of moved caches): 1 files, 0.0 MB
- `info/archive/before-fall-view-template/` (superseded build, review or archived edition): 2 files, 15.1 MB
- `info/archive/before-name-correction/` (superseded build, review or archived edition): 5 files, 0.0 MB
- `info/archive/before-name-correction/Fox Fall/` (superseded build, review or archived edition): 9 files, 0.0 MB
- `info/archive/before-name-correction/Gnome Halloween/` (superseded build, review or archived edition): 1 files, 0.0 MB
- `info/archive/before-name-correction/Pumpkin/` (superseded build, review or archived edition): 6 files, 0.0 MB
- `info/archive/before-name-correction/assets/` (superseded build, review or archived edition): 6 files, 0.1 MB
- `info/archive/build-caches/8x10-artwork/` (Chrome profile): 1760 files, 37.6 MB
- `info/archive/build-caches/8x10-artwork/` (archived build cache): 324 files, 6.4 MB
- `info/archive/previous-root-files/` (superseded build, review or archived edition): 7 files, 10.0 MB
- `info/assets/8x10/` (superseded build, review or archived edition): 1 files, 1.7 MB
- `info/tmp/` (superseded build, review or archived edition): 1 files, 0.0 MB
- `info/tmp/8x10-artwork/` (superseded build, review or archived edition): 16 files, 86.0 MB
- `info/tmp/8x10-artwork/before-guide-repair-2026-09-20/` (superseded build, review or archived edition): 2 files, 15.8 MB
- `info/tmp/8x10-artwork/before-transparency/` (superseded build, review or archived edition): 3 files, 1.1 MB
- `info/tmp/darker-outline/` (superseded build, review or archived edition): 9 files, 1.0 MB
- `info/tmp/darker-outline/before-2pt/` (superseded build, review or archived edition): 9 files, 1.8 MB
- `info/tmp/name-correction/` (superseded build, review or archived edition): 5 files, 4.4 MB
- `info/tmp/template-refactor/browser-cache/` (browser cache): 324 files, 6.3 MB
- `info/tmp/transfer-standard/` (superseded build, review or archived edition): 10 files, 0.9 MB
- `info/tmp/transfer-standard/before-transfer/` (superseded build, review or archived edition): 9 files, 2.3 MB
- `info/tmp/vector/` (superseded build, review or archived edition): 6 files, 0.6 MB

## Starry-night Sunflower

Kept:

- `info/` (current record): 3 files, 1.0 MB
- `info/` (read by kits.json or restoration audit): 1 files, 0.0 MB
- `info/archive/original-square-kit/` (supplied original): 4 files, 5.7 MB
- `info/archive/original-square-kit/assets/` (supplied original): 1 files, 2.5 MB
- `info/archive/original-square-kit/output/` (supplied original): 2 files, 8.2 MB
- `info/archive/original-square-kit/tmp/` (supplied original): 12 files, 14.3 MB
- `info/assets/reference-restoration/` (current guide art and supplied sources): 3 files, 6.5 MB
- `info/assets/reference-restoration/` (read by kits.json or restoration audit): 23 files, 83.8 MB
- `info/assets/reference-restoration/sources/` (current guide art and supplied sources): 1 files, 2.9 MB
- `info/assets/template-refactor/` (read by kits.json or restoration audit): 1 files, 2.0 MB
- `info/output/pdf/8x10/` (production-matching export): 3 files, 2.9 MB
- `info/output/pdf/8x10/` (read by kits.json or restoration audit): 4 files, 60.7 MB
- `info/output/svg/8x10/` (production-matching export): 1 files, 0.1 MB
- `info/test/` (supplied test art): 2 files, 6.5 MB
- `info/tmp/organization-repair/` (restoration rebuild source): 3 files, 3.1 MB
- `info/tmp/reference-restoration/` (current guide work directory and checks): 30 files, 77.3 MB
- `info/tmp/template-refactor/` (current guide plan): 1 files, 0.0 MB
- `info/tmp/template-refactor/` (read by kits.json or restoration audit): 1 files, 0.0 MB

Removed:

- `info/` (record of moved caches): 1 files, 0.0 MB
- `info/archive/before-fall-view-template/` (superseded build, review or archived edition): 2 files, 15.1 MB
- `info/archive/before-reference-restoration-2026-09-21/` (superseded build, review or archived edition): 5 files, 55.8 MB
- `info/archive/before-restoration-promotion-2026-09-21/` (superseded build, review or archived edition): 2 files, 42.2 MB
- `info/archive/before-restoration-promotion-2026-09-21/info/` (superseded build, review or archived edition): 6 files, 55.8 MB
- `info/archive/build-caches/organization-repair/` (Chrome profile): 2202 files, 49.0 MB
- `info/archive/previous-root-files/` (superseded build, review or archived edition): 6 files, 6.8 MB
- `info/tmp/` (superseded build, review or archived edition): 1 files, 0.9 MB
- `info/tmp/darker-outline/` (superseded build, review or archived edition): 9 files, 4.1 MB
- `info/tmp/darker-outline/before-2pt/` (superseded build, review or archived edition): 9 files, 6.9 MB
- `info/tmp/organization-repair/` (superseded build, review or archived edition): 27 files, 80.5 MB
- `info/tmp/reference-restoration/browser-cache/` (browser cache): 53 files, 1.7 MB
- `info/tmp/template-refactor/` (superseded build, review or archived edition): 6 files, 32.3 MB
- `info/tmp/template-refactor/browser-cache/` (browser cache): 324 files, 6.3 MB
- `info/tmp/transfer-standard/` (superseded build, review or archived edition): 11 files, 4.1 MB
- `info/tmp/transfer-standard/before-transfer/` (superseded build, review or archived edition): 2 files, 8.0 MB

## Root notes retired

Also on September 25, eleven root Markdown notes describing finished work were removed. They were written records only; no script or build read them. The notes were `canvas-kit-history.md`, `canvas-transfer-outlines.md`, `guide-template-refactor.md`, `new-autumn-kits-8x10.md`, the three `organization-audit-*.md` files, `reference-restoration-plan.md`, `reference-restoration-review.md`, `RESTORATION-HANDOFF.md` and `reference-texture-review.md`. Their standing rules were already in `AGENTS.md`. Read any of them with `git show bf75693:"<file>"`.
