# info/ cleanup, pass 2, September 25, 2026

Each kit's `info/` now keeps only `archive/previous-root-files/` and the files that help change the kit-root reference PDF, outline SVG, guide PDF and `assets/`. Unique supplied originals from `assets/reference-restoration/sources/` and Sunflower's `archive/original-square-kit/` were moved into `previous-root-files`. Removed files remain in git history: `git checkout ee3dfae -- "<path>"`. Full list with SHA-256: [info-cleanup-pass2-manifest.json](info-cleanup-pass2-manifest.json); rules: [info-cleanup-pass2.cjs](info-cleanup-pass2.cjs).

| Kit | Files before | Size before | Kept (incl. moved) | Size kept | Removed | Size removed |
|---|---:|---:|---:|---:|---:|---:|
| Cat in Pumpkin | 70 | 92.5 MB | 31 | 31.8 MB | 39 | 60.7 MB |
| Fall View | 80 | 248.3 MB | 35 | 94.6 MB | 45 | 153.7 MB |
| Flowers in Vase | 73 | 165.3 MB | 23 | 36.8 MB | 50 | 128.5 MB |
| Fox Fall | 76 | 73.9 MB | 35 | 25.7 MB | 41 | 48.2 MB |
| Ghost Fall | 62 | 80.0 MB | 32 | 28.6 MB | 30 | 51.3 MB |
| Gnome Christmas Tree | 88 | 251.2 MB | 37 | 111.5 MB | 51 | 139.8 MB |
| Gnome Fall | 75 | 284.6 MB | 33 | 129.5 MB | 42 | 155.1 MB |
| Gnome Halloween | 73 | 181.9 MB | 23 | 41.5 MB | 50 | 140.3 MB |
| Pumpkin | 59 | 83.5 MB | 28 | 30.2 MB | 31 | 53.3 MB |
| Starry-night Sunflower | 96 | 277.6 MB | 35 | 95.2 MB | 61 | 182.4 MB |
| **All kits** | 752 | 1738.7 MB | 312 | 625.3 MB | 440 | 1113.4 MB |

## Cat in Pumpkin

- kept: `Cat in Pumpkin/info/archive/previous-root-files/exec-01c35205-b359-4887-a7f9-a31e173a5e1f.png` (supplied originals)
- kept: `Cat in Pumpkin/info/assets/simplified/step-6-white-eyes.png` (simplified edition art)
- kept: `Cat in Pumpkin/info/assets/template-refactor/river-and-ridge-logo.png` (read by guide-template/kits.json)
- kept: `Cat in Pumpkin/info/output/pdf/8x10/cat-in-pumpkin-finished-reference-8x10.png` (read by guide-template/kits.json)
- kept: `Cat in Pumpkin/info/README.md` (kit notes)
- kept: `Cat in Pumpkin/info/tmp/8x10-artwork/group-mask.bin` (guide steps and stage-builder sources)
- kept: `Cat in Pumpkin/info/tmp/8x10-artwork/line-mask.bin` (guide steps and stage-builder sources)
- kept: `Cat in Pumpkin/info/tmp/8x10-artwork/outline.bmp` (guide steps and stage-builder sources)
- kept: `Cat in Pumpkin/info/tmp/8x10-artwork/paint.bmp` (guide steps and stage-builder sources)
- kept: `Cat in Pumpkin/info/tmp/8x10-artwork/registered-reference.png` (guide steps and stage-builder sources)
- kept: `Cat in Pumpkin/info/tmp/8x10-artwork/step-1.png` (read by guide-template/kits.json)
- kept: `Cat in Pumpkin/info/tmp/8x10-artwork/step-10.png` (read by guide-template/kits.json)
- kept: `Cat in Pumpkin/info/tmp/8x10-artwork/step-11.png` (read by guide-template/kits.json)
- kept: `Cat in Pumpkin/info/tmp/8x10-artwork/step-12.png` (guide steps and stage-builder sources)
- kept: `Cat in Pumpkin/info/tmp/8x10-artwork/step-2.png` (read by guide-template/kits.json)
- kept: `Cat in Pumpkin/info/tmp/8x10-artwork/step-3.png` (read by guide-template/kits.json)
- kept: `Cat in Pumpkin/info/tmp/8x10-artwork/step-4.png` (read by guide-template/kits.json)
- kept: `Cat in Pumpkin/info/tmp/8x10-artwork/step-5.png` (read by guide-template/kits.json)
- kept: `Cat in Pumpkin/info/tmp/8x10-artwork/step-6.png` (read by guide-template/kits.json)
- kept: `Cat in Pumpkin/info/tmp/8x10-artwork/step-7.png` (read by guide-template/kits.json)
- kept: `Cat in Pumpkin/info/tmp/8x10-artwork/step-8.png` (read by guide-template/kits.json)
- kept: `Cat in Pumpkin/info/tmp/8x10-artwork/step-9.png` (read by guide-template/kits.json)
- kept: `Cat in Pumpkin/info/tmp/8x10-artwork/step-plan.json` (guide steps and stage-builder sources)
- kept: `Cat in Pumpkin/info/tmp/simplified/build.py` (simplified edition builder)
- kept: `Cat in Pumpkin/info/tmp/simplified/original-hashes.json` (simplified edition builder)
- kept: `Cat in Pumpkin/info/tmp/simplified/plan.json` (simplified edition builder)
- kept: `Cat in Pumpkin/info/tmp/simplified/promote.py` (simplified edition builder)
- kept: `Cat in Pumpkin/info/tmp/simplified/render-outline.cjs` (simplified edition builder)
- kept: `Cat in Pumpkin/info/tmp/simplified/verify.py` (simplified edition builder)
- kept: `Cat in Pumpkin/info/tmp/simplified/white-eye-layer.cjs` (simplified edition builder)
- kept: `Cat in Pumpkin/info/tmp/template-refactor/logo-prompt.txt` (logo prompt)
- removed: `info/`: 2 files, 0.4 MB
- removed: `info/output/pdf/8x10/`: 6 files, 26.0 MB
- removed: `info/output/simplified/`: 2 files, 2.5 MB
- removed: `info/output/svg/8x10/`: 1 files, 0.0 MB
- removed: `info/tmp/8x10-artwork/`: 3 files, 7.0 MB
- removed: `info/tmp/simplified/`: 18 files, 6.3 MB
- removed: `info/tmp/template-refactor/`: 7 files, 18.4 MB

## Fall View

- kept: `Fall View/info/archive/previous-root-files/fall-view-finished-reference.png` (supplied original moved into previous-root-files)
- kept: `Fall View/info/archive/previous-root-files/fall-view-source-composite.png` (supplied originals)
- kept: `Fall View/info/assets/reference-restoration/candidate-02.png` (build-art.cjs candidate)
- kept: `Fall View/info/assets/reference-restoration/guide-step-01.png` (read by guide-template/kits.json)
- kept: `Fall View/info/assets/reference-restoration/guide-step-02.png` (read by guide-template/kits.json)
- kept: `Fall View/info/assets/reference-restoration/guide-step-03.png` (read by guide-template/kits.json)
- kept: `Fall View/info/assets/reference-restoration/guide-step-04.png` (read by guide-template/kits.json)
- kept: `Fall View/info/assets/reference-restoration/guide-step-05.png` (read by guide-template/kits.json)
- kept: `Fall View/info/assets/reference-restoration/guide-step-06.png` (read by guide-template/kits.json)
- kept: `Fall View/info/assets/reference-restoration/guide-step-07.png` (read by guide-template/kits.json)
- kept: `Fall View/info/assets/reference-restoration/guide-step-08.png` (read by guide-template/kits.json)
- kept: `Fall View/info/assets/reference-restoration/guide-step-09.png` (read by guide-template/kits.json)
- kept: `Fall View/info/assets/reference-restoration/guide-step-10.png` (read by guide-template/kits.json)
- kept: `Fall View/info/assets/reference-restoration/guide-step-11.png` (read by guide-template/kits.json)
- kept: `Fall View/info/assets/reference-restoration/restored-master.png` (read by guide-template/kits.json)
- kept: `Fall View/info/assets/reference-restoration/step-01.png` (reference master and guide steps)
- kept: `Fall View/info/assets/reference-restoration/step-02.png` (reference master and guide steps)
- kept: `Fall View/info/assets/reference-restoration/step-03.png` (reference master and guide steps)
- kept: `Fall View/info/assets/reference-restoration/step-04.png` (reference master and guide steps)
- kept: `Fall View/info/assets/reference-restoration/step-05.png` (reference master and guide steps)
- kept: `Fall View/info/assets/reference-restoration/step-06.png` (reference master and guide steps)
- kept: `Fall View/info/assets/reference-restoration/step-07.png` (reference master and guide steps)
- kept: `Fall View/info/assets/reference-restoration/step-08.png` (reference master and guide steps)
- kept: `Fall View/info/assets/reference-restoration/step-09.png` (reference master and guide steps)
- kept: `Fall View/info/assets/reference-restoration/step-10.png` (reference master and guide steps)
- kept: `Fall View/info/assets/reference-restoration/step-11.png` (reference master and guide steps)
- kept: `Fall View/info/assets/template-refactor/river-and-ridge-logo.png` (read by guide-template/kits.json)
- kept: `Fall View/info/README.md` (kit notes)
- kept: `Fall View/info/tmp/organization-repair/group-assignments.json` (region maps for build-art.cjs)
- kept: `Fall View/info/tmp/organization-repair/labels.bin` (region maps for build-art.cjs)
- kept: `Fall View/info/tmp/organization-repair/regions.json` (region maps for build-art.cjs)
- kept: `Fall View/info/tmp/reference-restoration/guide-plan.json` (restoration plan and prompts)
- kept: `Fall View/info/tmp/reference-restoration/image-prompt-02.txt` (restoration plan and prompts)
- kept: `Fall View/info/tmp/reference-restoration/image-prompt.txt` (restoration plan and prompts)
- kept: `Fall View/info/tmp/template-refactor/logo-prompt.txt` (logo prompt)
- removed: `info/`: 2 files, 1.0 MB
- removed: `info/assets/reference-restoration/`: 2 files, 3.4 MB
- removed: `info/assets/reference-restoration/sources/`: 1 files, 0.8 MB
- removed: `info/output/pdf/`: 2 files, 7.9 MB
- removed: `info/output/pdf/8x10/`: 7 files, 60.9 MB
- removed: `info/output/svg/8x10/`: 1 files, 0.1 MB
- removed: `info/test/`: 2 files, 6.4 MB
- removed: `info/tmp/reference-restoration/`: 27 files, 73.2 MB
- removed: `info/tmp/template-refactor/`: 1 files, 0.0 MB

## Flowers in Vase

- kept: `Flowers in Vase/info/archive/previous-root-files/flowers-in-vase-source-photo.png` (supplied originals)
- kept: `Flowers in Vase/info/assets/portrait-rebuild/finished-reference-canonical.png` (guide stages and stage-builder sources)
- kept: `Flowers in Vase/info/assets/portrait-rebuild/outline-canonical-white.png` (guide stages and stage-builder sources)
- kept: `Flowers in Vase/info/assets/portrait-rebuild/painting-normalized.png` (guide stages and stage-builder sources)
- kept: `Flowers in Vase/info/assets/portrait-rebuild/stage-01.png` (read by guide-template/kits.json)
- kept: `Flowers in Vase/info/assets/portrait-rebuild/stage-02.png` (read by guide-template/kits.json)
- kept: `Flowers in Vase/info/assets/portrait-rebuild/stage-03.png` (read by guide-template/kits.json)
- kept: `Flowers in Vase/info/assets/portrait-rebuild/stage-04.png` (read by guide-template/kits.json)
- kept: `Flowers in Vase/info/assets/portrait-rebuild/stage-05.png` (read by guide-template/kits.json)
- kept: `Flowers in Vase/info/assets/portrait-rebuild/stage-06.png` (read by guide-template/kits.json)
- kept: `Flowers in Vase/info/assets/portrait-rebuild/stage-07.png` (read by guide-template/kits.json)
- kept: `Flowers in Vase/info/assets/portrait-rebuild/stage-08.png` (read by guide-template/kits.json)
- kept: `Flowers in Vase/info/assets/reference-restoration/flowers-panel-09-petals-clean.png` (read by guide-template/kits.json)
- kept: `Flowers in Vase/info/assets/reference-restoration/flowers-panel-10-leaf-vase-clean.png` (read by guide-template/kits.json)
- kept: `Flowers in Vase/info/assets/reference-restoration/flowers-panel-11-berries-clean.png` (read by guide-template/kits.json)
- kept: `Flowers in Vase/info/assets/template-refactor/river-and-ridge-logo.png` (read by guide-template/kits.json)
- kept: `Flowers in Vase/info/output/pdf/8x10/flowers-in-vase-finished-reference-8x10.png` (read by guide-template/kits.json)
- kept: `Flowers in Vase/info/README.md` (kit notes)
- kept: `Flowers in Vase/info/tmp/portrait-rebuild/build-stages.cjs` (stage builder)
- kept: `Flowers in Vase/info/tmp/portrait-rebuild/group-mask.bin` (stage builder)
- kept: `Flowers in Vase/info/tmp/portrait-rebuild/regions.bin` (stage builder)
- kept: `Flowers in Vase/info/tmp/reference-restoration/build-clean-crops.cjs` (crop-panel builder)
- kept: `Flowers in Vase/info/tmp/template-refactor/logo-prompt.txt` (logo prompt)
- removed: `info/`: 2 files, 0.1 MB
- removed: `info/assets/original-square/`: 2 files, 5.4 MB
- removed: `info/assets/portrait-rebuild/`: 9 files, 14.2 MB
- removed: `info/assets/reference-restoration/sources/`: 1 files, 10.3 MB
- removed: `info/output/pdf/`: 2 files, 10.1 MB
- removed: `info/output/pdf/8x10/`: 6 files, 52.7 MB
- removed: `info/output/svg/8x10/`: 1 files, 0.0 MB
- removed: `info/tmp/portrait-rebuild/`: 11 files, 0.2 MB
- removed: `info/tmp/reference-restoration/`: 15 files, 35.3 MB
- removed: `info/tmp/template-refactor/`: 1 files, 0.0 MB

## Fox Fall

- kept: `Fox Fall/info/archive/previous-root-files/download.png` (supplied originals)
- kept: `Fox Fall/info/assets/simplified/fox-fall-final-step-7-black-paws.png` (simplified edition art)
- kept: `Fox Fall/info/assets/template-refactor/river-and-ridge-logo.png` (read by guide-template/kits.json)
- kept: `Fox Fall/info/output/pdf/8x10/fox-fall-finished-reference-8x10.png` (read by guide-template/kits.json)
- kept: `Fox Fall/info/README.md` (kit notes)
- kept: `Fox Fall/info/tmp/8x10-artwork/group-mask.bin` (guide steps and stage-builder sources)
- kept: `Fox Fall/info/tmp/8x10-artwork/line-mask.bin` (guide steps and stage-builder sources)
- kept: `Fox Fall/info/tmp/8x10-artwork/outline.bmp` (guide steps and stage-builder sources)
- kept: `Fox Fall/info/tmp/8x10-artwork/paint.bmp` (guide steps and stage-builder sources)
- kept: `Fox Fall/info/tmp/8x10-artwork/registered-reference.png` (guide steps and stage-builder sources)
- kept: `Fox Fall/info/tmp/8x10-artwork/step-1.png` (read by guide-template/kits.json)
- kept: `Fox Fall/info/tmp/8x10-artwork/step-10.png` (read by guide-template/kits.json)
- kept: `Fox Fall/info/tmp/8x10-artwork/step-11.png` (read by guide-template/kits.json)
- kept: `Fox Fall/info/tmp/8x10-artwork/step-12.png` (guide steps and stage-builder sources)
- kept: `Fox Fall/info/tmp/8x10-artwork/step-2.png` (read by guide-template/kits.json)
- kept: `Fox Fall/info/tmp/8x10-artwork/step-3.png` (read by guide-template/kits.json)
- kept: `Fox Fall/info/tmp/8x10-artwork/step-4.png` (read by guide-template/kits.json)
- kept: `Fox Fall/info/tmp/8x10-artwork/step-5.png` (read by guide-template/kits.json)
- kept: `Fox Fall/info/tmp/8x10-artwork/step-6.png` (read by guide-template/kits.json)
- kept: `Fox Fall/info/tmp/8x10-artwork/step-7.png` (read by guide-template/kits.json)
- kept: `Fox Fall/info/tmp/8x10-artwork/step-8.png` (read by guide-template/kits.json)
- kept: `Fox Fall/info/tmp/8x10-artwork/step-9.png` (read by guide-template/kits.json)
- kept: `Fox Fall/info/tmp/8x10-artwork/step-plan.json` (guide steps and stage-builder sources)
- kept: `Fox Fall/info/tmp/build-new-panels.cjs` (autumn stage-panel builder)
- kept: `Fox Fall/info/tmp/kit-paths.cjs` (autumn stage-panel builder)
- kept: `Fox Fall/info/tmp/new-kits.cjs` (autumn stage-panel builder)
- kept: `Fox Fall/info/tmp/raster.cjs` (autumn stage-panel builder)
- kept: `Fox Fall/info/tmp/simplified/black-paws-layer.py` (simplified edition builder)
- kept: `Fox Fall/info/tmp/simplified/build.py` (simplified edition builder)
- kept: `Fox Fall/info/tmp/simplified/original-hashes.json` (simplified edition builder)
- kept: `Fox Fall/info/tmp/simplified/plan.json` (simplified edition builder)
- kept: `Fox Fall/info/tmp/simplified/promote.py` (simplified edition builder)
- kept: `Fox Fall/info/tmp/simplified/render-outline.cjs` (simplified edition builder)
- kept: `Fox Fall/info/tmp/simplified/verify.py` (simplified edition builder)
- kept: `Fox Fall/info/tmp/template-refactor/logo-prompt.txt` (logo prompt)
- removed: `info/`: 2 files, 1.0 MB
- removed: `info/output/pdf/8x10/`: 6 files, 18.9 MB
- removed: `info/output/simplified/`: 2 files, 2.2 MB
- removed: `info/output/svg/8x10/`: 1 files, 0.0 MB
- removed: `info/tmp/8x10-artwork/`: 3 files, 7.0 MB
- removed: `info/tmp/simplified/`: 14 files, 5.8 MB
- removed: `info/tmp/template-refactor/`: 7 files, 13.1 MB
- removed: `info/tmp/vector-tools/`: 6 files, 0.2 MB

## Ghost Fall

- kept: `Ghost Fall/info/archive/previous-root-files/exec-8b4604c1-f90d-4ddd-959b-56e4dd2b270f.png` (supplied originals)
- kept: `Ghost Fall/info/assets/simplified/step-1.png` (simplified edition art)
- kept: `Ghost Fall/info/assets/simplified/step-2.png` (simplified edition art)
- kept: `Ghost Fall/info/assets/simplified/step-3.png` (simplified edition art)
- kept: `Ghost Fall/info/assets/simplified/step-4.png` (simplified edition art)
- kept: `Ghost Fall/info/assets/simplified/step-5.png` (simplified edition art)
- kept: `Ghost Fall/info/assets/template-refactor/river-and-ridge-logo.png` (read by guide-template/kits.json)
- kept: `Ghost Fall/info/output/pdf/8x10/ghost-fall-finished-reference-8x10.png` (read by guide-template/kits.json)
- kept: `Ghost Fall/info/README.md` (kit notes)
- kept: `Ghost Fall/info/tmp/8x10-artwork/group-mask.bin` (guide steps and stage-builder sources)
- kept: `Ghost Fall/info/tmp/8x10-artwork/line-mask.bin` (guide steps and stage-builder sources)
- kept: `Ghost Fall/info/tmp/8x10-artwork/outline.bmp` (guide steps and stage-builder sources)
- kept: `Ghost Fall/info/tmp/8x10-artwork/paint.bmp` (guide steps and stage-builder sources)
- kept: `Ghost Fall/info/tmp/8x10-artwork/registered-reference.png` (guide steps and stage-builder sources)
- kept: `Ghost Fall/info/tmp/8x10-artwork/step-1.png` (read by guide-template/kits.json)
- kept: `Ghost Fall/info/tmp/8x10-artwork/step-10.png` (read by guide-template/kits.json)
- kept: `Ghost Fall/info/tmp/8x10-artwork/step-11.png` (read by guide-template/kits.json)
- kept: `Ghost Fall/info/tmp/8x10-artwork/step-12.png` (guide steps and stage-builder sources)
- kept: `Ghost Fall/info/tmp/8x10-artwork/step-2.png` (read by guide-template/kits.json)
- kept: `Ghost Fall/info/tmp/8x10-artwork/step-3.png` (read by guide-template/kits.json)
- kept: `Ghost Fall/info/tmp/8x10-artwork/step-4.png` (read by guide-template/kits.json)
- kept: `Ghost Fall/info/tmp/8x10-artwork/step-5.png` (read by guide-template/kits.json)
- kept: `Ghost Fall/info/tmp/8x10-artwork/step-6.png` (read by guide-template/kits.json)
- kept: `Ghost Fall/info/tmp/8x10-artwork/step-7.png` (read by guide-template/kits.json)
- kept: `Ghost Fall/info/tmp/8x10-artwork/step-8.png` (read by guide-template/kits.json)
- kept: `Ghost Fall/info/tmp/8x10-artwork/step-9.png` (read by guide-template/kits.json)
- kept: `Ghost Fall/info/tmp/8x10-artwork/step-plan.json` (guide steps and stage-builder sources)
- kept: `Ghost Fall/info/tmp/simplified/build.py` (simplified edition builder)
- kept: `Ghost Fall/info/tmp/simplified/original-hashes.json` (simplified edition builder)
- kept: `Ghost Fall/info/tmp/simplified/plan.json` (simplified edition builder)
- kept: `Ghost Fall/info/tmp/simplified/verify_promote.py` (simplified edition builder)
- kept: `Ghost Fall/info/tmp/template-refactor/logo-prompt.txt` (logo prompt)
- removed: `info/`: 2 files, 0.4 MB
- removed: `info/output/pdf/8x10/`: 6 files, 21.7 MB
- removed: `info/output/simplified/`: 2 files, 1.8 MB
- removed: `info/output/svg/8x10/`: 1 files, 0.0 MB
- removed: `info/tmp/8x10-artwork/`: 3 files, 7.0 MB
- removed: `info/tmp/simplified/`: 9 files, 3.7 MB
- removed: `info/tmp/template-refactor/`: 7 files, 16.9 MB

## Gnome Christmas Tree

- kept: `Gnome Christmas Tree/info/assets/reference-restoration/candidate-02.png` (build-art.cjs candidate)
- kept: `Gnome Christmas Tree/info/assets/reference-restoration/guide-step-01.png` (read by guide-template/kits.json)
- kept: `Gnome Christmas Tree/info/assets/reference-restoration/guide-step-02.png` (read by guide-template/kits.json)
- kept: `Gnome Christmas Tree/info/assets/reference-restoration/guide-step-03.png` (read by guide-template/kits.json)
- kept: `Gnome Christmas Tree/info/assets/reference-restoration/guide-step-04.png` (read by guide-template/kits.json)
- kept: `Gnome Christmas Tree/info/assets/reference-restoration/guide-step-05.png` (read by guide-template/kits.json)
- kept: `Gnome Christmas Tree/info/assets/reference-restoration/guide-step-06.png` (read by guide-template/kits.json)
- kept: `Gnome Christmas Tree/info/assets/reference-restoration/guide-step-07.png` (read by guide-template/kits.json)
- kept: `Gnome Christmas Tree/info/assets/reference-restoration/guide-step-08.png` (read by guide-template/kits.json)
- kept: `Gnome Christmas Tree/info/assets/reference-restoration/guide-step-09.png` (read by guide-template/kits.json)
- kept: `Gnome Christmas Tree/info/assets/reference-restoration/guide-step-10.png` (read by guide-template/kits.json)
- kept: `Gnome Christmas Tree/info/assets/reference-restoration/guide-step-11.png` (read by guide-template/kits.json)
- kept: `Gnome Christmas Tree/info/assets/reference-restoration/restored-master.png` (read by guide-template/kits.json)
- moved: `Gnome Christmas Tree/info/archive/previous-root-files/gnome-christmas-tree-finished-reference.png` (supplied original moved into previous-root-files)
- kept: `Gnome Christmas Tree/info/assets/reference-restoration/step-01.png` (reference master and guide steps)
- kept: `Gnome Christmas Tree/info/assets/reference-restoration/step-02.png` (reference master and guide steps)
- kept: `Gnome Christmas Tree/info/assets/reference-restoration/step-03.png` (reference master and guide steps)
- kept: `Gnome Christmas Tree/info/assets/reference-restoration/step-04.png` (reference master and guide steps)
- kept: `Gnome Christmas Tree/info/assets/reference-restoration/step-05.png` (reference master and guide steps)
- kept: `Gnome Christmas Tree/info/assets/reference-restoration/step-06.png` (reference master and guide steps)
- kept: `Gnome Christmas Tree/info/assets/reference-restoration/step-07.png` (reference master and guide steps)
- kept: `Gnome Christmas Tree/info/assets/reference-restoration/step-08.png` (reference master and guide steps)
- kept: `Gnome Christmas Tree/info/assets/reference-restoration/step-09.png` (reference master and guide steps)
- kept: `Gnome Christmas Tree/info/assets/reference-restoration/step-10.png` (reference master and guide steps)
- kept: `Gnome Christmas Tree/info/assets/reference-restoration/step-11.png` (reference master and guide steps)
- kept: `Gnome Christmas Tree/info/assets/reference-restoration/tree-detail-candidate.png` (build-art.cjs tree detail)
- kept: `Gnome Christmas Tree/info/assets/template-refactor/river-and-ridge-logo.png` (read by guide-template/kits.json)
- kept: `Gnome Christmas Tree/info/README.md` (kit notes)
- kept: `Gnome Christmas Tree/info/tmp/organization/labels.bin` (region maps for build-art.cjs)
- kept: `Gnome Christmas Tree/info/tmp/organization/regions.json` (region maps for build-art.cjs)
- kept: `Gnome Christmas Tree/info/tmp/reference-restoration/christmas-geometry-repairs.json` (build-art.cjs tree inputs)
- kept: `Gnome Christmas Tree/info/tmp/reference-restoration/detected-bulbs.json` (build-art.cjs tree inputs)
- kept: `Gnome Christmas Tree/info/tmp/reference-restoration/guide-plan.json` (restoration plan and prompts)
- kept: `Gnome Christmas Tree/info/tmp/reference-restoration/image-prompt-02.txt` (restoration plan and prompts)
- kept: `Gnome Christmas Tree/info/tmp/reference-restoration/image-prompt.txt` (restoration plan and prompts)
- kept: `Gnome Christmas Tree/info/tmp/reference-restoration/tree-edit-prompt.txt` (build-art.cjs tree inputs)
- kept: `Gnome Christmas Tree/info/tmp/template-refactor/logo-prompt.txt` (logo prompt)
- removed: `info/`: 2 files, 0.2 MB
- removed: `info/assets/reference-restoration/`: 3 files, 3.0 MB
- removed: `info/output/pdf/`: 2 files, 4.8 MB
- removed: `info/output/pdf/8x10/`: 7 files, 54.3 MB
- removed: `info/output/svg/8x10/`: 1 files, 0.0 MB
- removed: `info/test/`: 2 files, 3.9 MB
- removed: `info/tmp/organization/`: 1 files, 0.1 MB
- removed: `info/tmp/reference-restoration/`: 32 files, 73.4 MB
- removed: `info/tmp/template-refactor/`: 1 files, 0.0 MB

## Gnome Fall

- kept: `Gnome Fall/info/archive/previous-root-files/gnome-fall-source-composite.png` (supplied originals)
- kept: `Gnome Fall/info/assets/reference-restoration/candidate-01.png` (build-art.cjs candidate)
- kept: `Gnome Fall/info/assets/reference-restoration/guide-step-01.png` (read by guide-template/kits.json)
- kept: `Gnome Fall/info/assets/reference-restoration/guide-step-02.png` (read by guide-template/kits.json)
- kept: `Gnome Fall/info/assets/reference-restoration/guide-step-03.png` (read by guide-template/kits.json)
- kept: `Gnome Fall/info/assets/reference-restoration/guide-step-04.png` (read by guide-template/kits.json)
- kept: `Gnome Fall/info/assets/reference-restoration/guide-step-05.png` (read by guide-template/kits.json)
- kept: `Gnome Fall/info/assets/reference-restoration/guide-step-06.png` (read by guide-template/kits.json)
- kept: `Gnome Fall/info/assets/reference-restoration/guide-step-07.png` (read by guide-template/kits.json)
- kept: `Gnome Fall/info/assets/reference-restoration/guide-step-08.png` (read by guide-template/kits.json)
- kept: `Gnome Fall/info/assets/reference-restoration/guide-step-09.png` (read by guide-template/kits.json)
- kept: `Gnome Fall/info/assets/reference-restoration/guide-step-10.png` (read by guide-template/kits.json)
- kept: `Gnome Fall/info/assets/reference-restoration/guide-step-11.png` (read by guide-template/kits.json)
- kept: `Gnome Fall/info/assets/reference-restoration/restored-master.png` (read by guide-template/kits.json)
- moved: `Gnome Fall/info/archive/previous-root-files/gnome-fall-finished-reference.png` (supplied original moved into previous-root-files)
- kept: `Gnome Fall/info/assets/reference-restoration/step-01.png` (reference master and guide steps)
- kept: `Gnome Fall/info/assets/reference-restoration/step-02.png` (reference master and guide steps)
- kept: `Gnome Fall/info/assets/reference-restoration/step-03.png` (reference master and guide steps)
- kept: `Gnome Fall/info/assets/reference-restoration/step-04.png` (reference master and guide steps)
- kept: `Gnome Fall/info/assets/reference-restoration/step-05.png` (reference master and guide steps)
- kept: `Gnome Fall/info/assets/reference-restoration/step-06.png` (reference master and guide steps)
- kept: `Gnome Fall/info/assets/reference-restoration/step-07.png` (reference master and guide steps)
- kept: `Gnome Fall/info/assets/reference-restoration/step-08.png` (reference master and guide steps)
- kept: `Gnome Fall/info/assets/reference-restoration/step-09.png` (reference master and guide steps)
- kept: `Gnome Fall/info/assets/reference-restoration/step-10.png` (reference master and guide steps)
- kept: `Gnome Fall/info/assets/reference-restoration/step-11.png` (reference master and guide steps)
- kept: `Gnome Fall/info/assets/template-refactor/river-and-ridge-logo.png` (read by guide-template/kits.json)
- kept: `Gnome Fall/info/README.md` (kit notes)
- kept: `Gnome Fall/info/tmp/organization/labels.bin` (region maps for build-art.cjs)
- kept: `Gnome Fall/info/tmp/organization/regions.json` (region maps for build-art.cjs)
- kept: `Gnome Fall/info/tmp/reference-restoration/guide-plan.json` (restoration plan and prompts)
- kept: `Gnome Fall/info/tmp/reference-restoration/image-prompt.txt` (restoration plan and prompts)
- kept: `Gnome Fall/info/tmp/template-refactor/logo-prompt.txt` (logo prompt)
- removed: `info/`: 2 files, 0.1 MB
- removed: `info/assets/reference-restoration/`: 1 files, 0.8 MB
- removed: `info/output/pdf/`: 2 files, 7.4 MB
- removed: `info/output/pdf/8x10/`: 7 files, 66.5 MB
- removed: `info/output/svg/8x10/`: 1 files, 0.1 MB
- removed: `info/test/`: 1 files, 6.4 MB
- removed: `info/tmp/organization/`: 1 files, 0.2 MB
- removed: `info/tmp/reference-restoration/`: 26 files, 73.7 MB
- removed: `info/tmp/template-refactor/`: 1 files, 0.0 MB

## Gnome Halloween

- kept: `Gnome Halloween/info/assets/full-portrait/finished-reference-canonical.png` (guide stages and stage-builder sources)
- kept: `Gnome Halloween/info/assets/full-portrait/outline-canonical-white.png` (guide stages and stage-builder sources)
- kept: `Gnome Halloween/info/assets/full-portrait/painting-final-texture.png` (guide stages and stage-builder sources)
- kept: `Gnome Halloween/info/assets/full-portrait/stage-01.png` (read by guide-template/kits.json)
- kept: `Gnome Halloween/info/assets/full-portrait/stage-02.png` (read by guide-template/kits.json)
- kept: `Gnome Halloween/info/assets/full-portrait/stage-03.png` (read by guide-template/kits.json)
- kept: `Gnome Halloween/info/assets/full-portrait/stage-04.png` (read by guide-template/kits.json)
- kept: `Gnome Halloween/info/assets/full-portrait/stage-05.png` (read by guide-template/kits.json)
- kept: `Gnome Halloween/info/assets/full-portrait/stage-06.png` (read by guide-template/kits.json)
- kept: `Gnome Halloween/info/assets/full-portrait/stage-07.png` (read by guide-template/kits.json)
- kept: `Gnome Halloween/info/assets/full-portrait/stage-08.png` (read by guide-template/kits.json)
- kept: `Gnome Halloween/info/assets/full-portrait/stage-09.png` (guide stages and stage-builder sources)
- kept: `Gnome Halloween/info/assets/reference-restoration/gnome-panel-09-depth-clean.png` (read by guide-template/kits.json)
- kept: `Gnome Halloween/info/assets/reference-restoration/gnome-panel-10-lanterns-clean.png` (read by guide-template/kits.json)
- kept: `Gnome Halloween/info/assets/reference-restoration/gnome-panel-11-light-clean.png` (read by guide-template/kits.json)
- kept: `Gnome Halloween/info/assets/template-refactor/river-and-ridge-logo.png` (read by guide-template/kits.json)
- kept: `Gnome Halloween/info/output/pdf/8x10/gnome-halloween-finished-reference-8x10.png` (read by guide-template/kits.json)
- kept: `Gnome Halloween/info/README.md` (kit notes)
- kept: `Gnome Halloween/info/tmp/full-portrait/build-stages.cjs` (stage builder)
- kept: `Gnome Halloween/info/tmp/full-portrait/group-mask.bin` (stage builder)
- kept: `Gnome Halloween/info/tmp/full-portrait/regions.bin` (stage builder)
- kept: `Gnome Halloween/info/tmp/reference-restoration/build-clean-crops.cjs` (crop-panel builder)
- kept: `Gnome Halloween/info/tmp/template-refactor/logo-prompt.txt` (logo prompt)
- removed: `info/`: 2 files, 0.1 MB
- removed: `info/assets/full-portrait/`: 8 files, 10.7 MB
- removed: `info/assets/reference-restoration/sources/`: 1 files, 8.8 MB
- removed: `info/output/pdf/`: 2 files, 13.3 MB
- removed: `info/output/pdf/8x10/`: 6 files, 59.4 MB
- removed: `info/output/svg/8x10/`: 1 files, 0.0 MB
- removed: `info/test/`: 2 files, 3.9 MB
- removed: `info/tmp/full-portrait/`: 11 files, 0.1 MB
- removed: `info/tmp/reference-restoration/`: 16 files, 44.0 MB
- removed: `info/tmp/template-refactor/`: 1 files, 0.0 MB

## Pumpkin

- kept: `Pumpkin/info/archive/previous-root-files/exec-dd3ad511-2377-40d8-bb15-dd9d9771fcbc.png` (supplied originals)
- kept: `Pumpkin/info/assets/simplified/step-1.png` (simplified edition art)
- kept: `Pumpkin/info/assets/simplified/step-2.png` (simplified edition art)
- kept: `Pumpkin/info/assets/simplified/step-3.png` (simplified edition art)
- kept: `Pumpkin/info/assets/simplified/step-4.png` (simplified edition art)
- kept: `Pumpkin/info/assets/template-refactor/river-and-ridge-logo.png` (read by guide-template/kits.json)
- kept: `Pumpkin/info/output/pdf/8x10/pumpkin-finished-reference-8x10.png` (read by guide-template/kits.json)
- kept: `Pumpkin/info/README.md` (kit notes)
- kept: `Pumpkin/info/tmp/8x10-artwork/group-mask.bin` (guide steps and stage-builder sources)
- kept: `Pumpkin/info/tmp/8x10-artwork/line-mask.bin` (guide steps and stage-builder sources)
- kept: `Pumpkin/info/tmp/8x10-artwork/outline.bmp` (guide steps and stage-builder sources)
- kept: `Pumpkin/info/tmp/8x10-artwork/paint.bmp` (guide steps and stage-builder sources)
- kept: `Pumpkin/info/tmp/8x10-artwork/registered-reference.png` (guide steps and stage-builder sources)
- kept: `Pumpkin/info/tmp/8x10-artwork/step-1.png` (read by guide-template/kits.json)
- kept: `Pumpkin/info/tmp/8x10-artwork/step-2.png` (read by guide-template/kits.json)
- kept: `Pumpkin/info/tmp/8x10-artwork/step-3.png` (read by guide-template/kits.json)
- kept: `Pumpkin/info/tmp/8x10-artwork/step-4.png` (read by guide-template/kits.json)
- kept: `Pumpkin/info/tmp/8x10-artwork/step-5.png` (read by guide-template/kits.json)
- kept: `Pumpkin/info/tmp/8x10-artwork/step-6.png` (read by guide-template/kits.json)
- kept: `Pumpkin/info/tmp/8x10-artwork/step-7.png` (read by guide-template/kits.json)
- kept: `Pumpkin/info/tmp/8x10-artwork/step-8.png` (guide steps and stage-builder sources)
- kept: `Pumpkin/info/tmp/8x10-artwork/step-plan.json` (guide steps and stage-builder sources)
- kept: `Pumpkin/info/tmp/simplified/build.py` (simplified edition builder)
- kept: `Pumpkin/info/tmp/simplified/original-hashes.json` (simplified edition builder)
- kept: `Pumpkin/info/tmp/simplified/plan.json` (simplified edition builder)
- kept: `Pumpkin/info/tmp/simplified/verify.py` (simplified edition builder)
- kept: `Pumpkin/info/tmp/template-refactor/logo-prompt.txt` (logo prompt)
- kept: `Pumpkin/info/tmp/transfer-standard/pumpkin-outline-8x10-render.png` (read by simplified verify.py)
- removed: `info/`: 2 files, 0.9 MB
- removed: `info/output/pdf/8x10/`: 6 files, 23.7 MB
- removed: `info/output/simplified/`: 2 files, 1.7 MB
- removed: `info/output/svg/8x10/`: 1 files, 0.0 MB
- removed: `info/tmp/8x10-artwork/`: 3 files, 7.0 MB
- removed: `info/tmp/simplified/`: 10 files, 4.1 MB
- removed: `info/tmp/template-refactor/`: 7 files, 16.0 MB

## Starry-night Sunflower

- moved: `Starry-night Sunflower/info/archive/previous-root-files/starry-night-sunflower-finished-reference.png` (supplied original moved into previous-root-files)
- moved: `Starry-night Sunflower/info/archive/previous-root-files/starry-night-sunflower-source-composite.png` (supplied original moved into previous-root-files)
- kept: `Starry-night Sunflower/info/assets/reference-restoration/candidate-02.png` (build-art.cjs candidate)
- kept: `Starry-night Sunflower/info/assets/reference-restoration/guide-step-01.png` (read by guide-template/kits.json)
- kept: `Starry-night Sunflower/info/assets/reference-restoration/guide-step-02.png` (read by guide-template/kits.json)
- kept: `Starry-night Sunflower/info/assets/reference-restoration/guide-step-03.png` (read by guide-template/kits.json)
- kept: `Starry-night Sunflower/info/assets/reference-restoration/guide-step-04.png` (read by guide-template/kits.json)
- kept: `Starry-night Sunflower/info/assets/reference-restoration/guide-step-05.png` (read by guide-template/kits.json)
- kept: `Starry-night Sunflower/info/assets/reference-restoration/guide-step-06.png` (read by guide-template/kits.json)
- kept: `Starry-night Sunflower/info/assets/reference-restoration/guide-step-07.png` (read by guide-template/kits.json)
- kept: `Starry-night Sunflower/info/assets/reference-restoration/guide-step-08.png` (read by guide-template/kits.json)
- kept: `Starry-night Sunflower/info/assets/reference-restoration/guide-step-09.png` (read by guide-template/kits.json)
- kept: `Starry-night Sunflower/info/assets/reference-restoration/guide-step-10.png` (read by guide-template/kits.json)
- kept: `Starry-night Sunflower/info/assets/reference-restoration/guide-step-11.png` (read by guide-template/kits.json)
- kept: `Starry-night Sunflower/info/assets/reference-restoration/restored-master.png` (read by guide-template/kits.json)
- kept: `Starry-night Sunflower/info/assets/reference-restoration/step-01.png` (reference master and guide steps)
- kept: `Starry-night Sunflower/info/assets/reference-restoration/step-02.png` (reference master and guide steps)
- kept: `Starry-night Sunflower/info/assets/reference-restoration/step-03.png` (reference master and guide steps)
- kept: `Starry-night Sunflower/info/assets/reference-restoration/step-04.png` (reference master and guide steps)
- kept: `Starry-night Sunflower/info/assets/reference-restoration/step-05.png` (reference master and guide steps)
- kept: `Starry-night Sunflower/info/assets/reference-restoration/step-06.png` (reference master and guide steps)
- kept: `Starry-night Sunflower/info/assets/reference-restoration/step-07.png` (reference master and guide steps)
- kept: `Starry-night Sunflower/info/assets/reference-restoration/step-08.png` (reference master and guide steps)
- kept: `Starry-night Sunflower/info/assets/reference-restoration/step-09.png` (reference master and guide steps)
- kept: `Starry-night Sunflower/info/assets/reference-restoration/step-10.png` (reference master and guide steps)
- kept: `Starry-night Sunflower/info/assets/reference-restoration/step-11.png` (reference master and guide steps)
- kept: `Starry-night Sunflower/info/assets/template-refactor/river-and-ridge-logo.png` (read by guide-template/kits.json)
- kept: `Starry-night Sunflower/info/README.md` (kit notes)
- kept: `Starry-night Sunflower/info/tmp/organization-repair/group-assignments.json` (region maps for build-art.cjs)
- kept: `Starry-night Sunflower/info/tmp/organization-repair/labels.bin` (region maps for build-art.cjs)
- kept: `Starry-night Sunflower/info/tmp/organization-repair/regions.json` (region maps for build-art.cjs)
- kept: `Starry-night Sunflower/info/tmp/reference-restoration/guide-plan.json` (restoration plan and prompts)
- kept: `Starry-night Sunflower/info/tmp/reference-restoration/image-prompt-02.txt` (restoration plan and prompts)
- kept: `Starry-night Sunflower/info/tmp/reference-restoration/image-prompt.txt` (restoration plan and prompts)
- kept: `Starry-night Sunflower/info/tmp/template-refactor/logo-prompt.txt` (logo prompt)
- removed: `info/`: 3 files, 1.0 MB
- removed: `info/archive/original-square-kit/`: 2 files, 2.2 MB
- removed: `info/archive/original-square-kit/assets/`: 1 files, 2.5 MB
- removed: `info/archive/original-square-kit/output/`: 2 files, 8.2 MB
- removed: `info/archive/original-square-kit/tmp/`: 12 files, 14.3 MB
- removed: `info/assets/reference-restoration/`: 2 files, 3.8 MB
- removed: `info/assets/reference-restoration/sources/`: 1 files, 2.9 MB
- removed: `info/output/pdf/8x10/`: 7 files, 63.7 MB
- removed: `info/output/svg/8x10/`: 1 files, 0.1 MB
- removed: `info/test/`: 2 files, 6.5 MB
- removed: `info/tmp/reference-restoration/`: 27 files, 77.3 MB
- removed: `info/tmp/template-refactor/`: 1 files, 0.0 MB

## Verification (September 25, 2026)

- **Guides:** all 10 guides were rebuilt from the reduced folders with `assets/tools/guide-template/build.cjs` into a scratch folder, and every layout check passed. Rendered at 2550 x 3300, they match the kit-root guides; the largest difference is 5 of 255, which is anti-aliasing.
- **Reference PDFs:** the new `assets/tools/reference-pdf/png-to-pdf.cjs` rebuilds every kit-root reference PDF from its master PNG.
  - Byte-identical for the four restored kits.
  - Pixel-identical when rendered for the other six, whose PDFs came from an older exporter with a different header.
- **Step pictures:**
  - `Fox Fall/info/tmp/build-new-panels.cjs`, run in a scratch copy with only `outline.bmp` and `paint.bmp`, reproduced every autumn step picture, mask and `registered-reference.png` byte for byte. `step-plan.json` matched in content; only whitespace differed.
  - The Flowers in Vase and Gnome Halloween `build-stages.cjs` and `build-clean-crops.cjs` reproduced every kept stage image, crop panel and canonical painting byte for byte.
  - The restoration inputs are all present: the candidates, region maps and the `guide-plan.json` stage paths.
- **Assets:** `Tools/guide-image-extractor.cjs` run on a rebuilt Fox Fall guide produced 17 images, all byte-identical to the current `Fox Fall/assets/`.
- **Libraries:** jimp and resvg load from their new location, `assets/tools/vector-tools/`. Eight scripts were repointed there.
- **Audit:** `node assets/tools/reference-restoration/verify-completed.cjs` passes: 13 protected files, 10 kit roots, 10 promotion records, and every `kits.json` guide input present.
- **Files outside `info/`:** unchanged, apart from the edited tools and docs, the moved libraries and the new cleanup and reference-PDF tools.
- **Not run:** the simplified `build.py` scripts need Python, which is not installed on this machine. That was already the case before the cleanup. Their inputs are kept.
