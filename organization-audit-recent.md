# Organization audit: six recent kits

Organization completed: current production files are at each kit root; old kit assets/tmp/output/test paths below now live under info/. Source selections below document the pre-move audit. See canvas-kits.md for current links and each info/organization-manifest.json for exact mappings.

Audited 2026-09-20. This covers only Flowers in Vase, Gnome Halloween, Fox Fall, Ghost Fall, Cat in Pumpkin, and Pumkin. The Desktop backup was read only and was not changed.

## Production selections

| Kit | Outline SVG source | Guide PDF source | Reference PDF source | Review result |
|---|---|---|---|---|
| Flowers in Vase | `Flowers in Vase/output/svg/8x10/flowers-in-vase-outline-8x10.svg` | `Flowers in Vase/output/pdf/8x10/flowers-in-vase-painting-guide-8x10.pdf` | `Flowers in Vase/output/pdf/8x10/flowers-in-vase-finished-reference-8x10.pdf` | Pass. Correct full-portrait geometry, reference and 12-step guide agree. |
| Gnome Halloween | `Gnome Halloween/output/svg/8x10/gnome-halloween-outline-8x10.svg` | `Gnome Halloween/output/pdf/8x10/gnome-halloween-painting-guide-8x10.pdf` | `Gnome Halloween/output/pdf/8x10/gnome-halloween-finished-reference-8x10.pdf` | Pass. Corrected full-height composition, reference and 12-step guide agree. |
| Fox Fall | `Fox Fall/output/svg/8x10/fox-fall-outline-8x10.svg` | `Fox Fall/output/pdf/8x10/fox-fall-painting-guide-8x10.pdf` | `Fox Fall/output/pdf/8x10/fox-fall-finished-reference-8x10.pdf` | Pass. Guide and reference match the production outline. Composition is the intentionally centered square design on an 8 x 10 page, not a new full-height recomposition. |
| Ghost Fall | `Ghost Fall/output/svg/8x10/ghost-fall-outline-8x10.svg` | `Ghost Fall/output/pdf/8x10/ghost-fall-painting-guide-8x10.pdf` | `Ghost Fall/output/pdf/8x10/ghost-fall-finished-reference-8x10.pdf` | Pass. A second single-image review confirmed the complete header, logo, all four columns and steps 01-12 are present; the earlier apparent crop was a multi-image viewer display artifact. Composition remains the centered square design on an 8 x 10 page. |
| Cat in Pumpkin | `Cat in Pumpkin/output/svg/8x10/cat-in-pumpkin-outline-8x10.svg` | `Cat in Pumpkin/output/pdf/8x10/cat-in-pumpkin-painting-guide-8x10.pdf` | `Cat in Pumpkin/output/pdf/8x10/cat-in-pumpkin-finished-reference-8x10.pdf` | Pass. Guide and reference match the production outline. Composition remains the centered square design on an 8 x 10 page. |
| Pumkin | `Pumkin/output/svg/8x10/pumpkin-outline-8x10.svg` | `Pumkin/output/pdf/8x10/pumpkin-painting-guide-8x10.pdf` | `Pumkin/output/pdf/8x10/pumpkin-finished-reference-8x10.pdf` | Pass after guide repair. Composition remains the centered square design on an 8 x 10 page. |

The selected artwork PDFs are each one page at exactly 576 x 720 points (8 x 10 inches). The selected guides are each one US Letter page at 612 x 792 points. Current PNG renders were visually reviewed at page scale. Materials, ordered steps, distinct finishing panels, flat drying scene, logo placement and caption clearance pass for these selections.

All six selected SVGs are genuine vectors with `width="8in"`, `height="10in"`, `viewBox="0 0 2400 3000"`, no embedded raster and no background rectangle. Their 8.333333-unit strokes equal 2 points at 300 units per inch. Flowers in Vase, Gnome Halloween, Ghost Fall and Pumkin use `#A6A6A6`; Fox Fall and Cat in Pumpkin use the children's `#808080`. Path-by-path comparison against each kit's archived pre-2-point SVG confirms geometry is identical; only the approved line standard differs.

## Repair completed

The existing Pumkin guide PDF was visibly clipped: the logo and materials area were missing and steps 01-04 lost a digit. The shared guide builder still pointed to a nonexistent `pumpkin` folder even though the project folder is `Pumkin`, which prevented a clean rebuild. The folder spelling is corrected in:

- `Fox Fall/tmp/new-kits.cjs`
- `Fox Fall/tmp/prepare-guides.ps1`
- `Fox Fall/tmp/render-guides.ps1`
- `Fox Fall/tmp/promote-guides.ps1`

The guide was rebuilt from the same canonical stages/reference, rendered and visually inspected. The corrected PDF is one Letter page and now shows the full header, complete logo/materials banner, steps 01-08, readable captions and footer. The previous PDF and PNG are preserved at `Pumkin/tmp/8x10-artwork/before-guide-repair-2026-09-20/`. Current repaired guide SHA-256: `DC692D7291593E0C58C1D07542A21E269C34FAB19D7471E4F23513A37F55C804`.

No outline SVG was modified. Pumkin's selected outline hash remains `73D4FADCACE1D4E9BAC071FA14667C31FE3084211429235B059A0321DC7485FC`.

## Active build paths to retain under `info/`

- Flowers in Vase: `assets/portrait-rebuild/` and `tmp/portrait-rebuild/` are the current art/guide build. Keep `tmp/8x10/` beside them because `tmp/portrait-rebuild/prepare-guide.cjs` depends on `tmp/8x10/build.cs`. The current transfer provenance is in `tmp/transfer-standard/` and `tmp/darker-outline/`.
- Gnome Halloween: `assets/full-portrait/`, `tmp/full-portrait/`, and `tmp/vector-8x10/recompose.cjs` are current dependencies. Keep `tmp/vector-8x10/` together to avoid breaking relative references. The current transfer provenance is in `tmp/transfer-standard/` and `tmp/darker-outline/`.
- Fox Fall, Ghost Fall, Cat in Pumpkin and Pumkin: each kit's `assets/8x10/` and `tmp/8x10-artwork/` are current. Shared builders live in `Fox Fall/tmp/`, especially `new-kits.cjs`, `build-guides.cjs`, `prepare-guides.ps1`, `render-guides.ps1`, `promote-guides.ps1`, `export-new-artwork-8x10.*`, and the transparent/vector/transfer tools. Preserve these paths together under `info/`.
- The six `tmp/transfer-standard/` and `tmp/darker-outline/` folders contain source/path verification for the current gray 2-point production transfers. They are provenance, not production root files.

## Internal archive handling

Move each kit's existing `assets/`, `output/`, `tmp/`, and `test/` trees intact to the same relative names under `info/`. Do not deepen or regroup their historical subdirectories during this organization pass; current rebuilds use cross-folder relative dependencies. Folders already named `before-transfer`, `before-2pt`, `before-transparency`, `original-square`, and `previous-edition` remain historical records in their present relative locations. Generated `chrome-profile-*` folders are disposable, but leaving them in place under `info/tmp/8x10-artwork/` is safest for this move.

Root aliases, source screenshots, PNG compatibility exports, notes, `assets/`, `output/`, `tmp/`, and `test/` should leave the kit root during organization. Keep only the three selected production files at each root; retain the current subject-based filenames.

## Shared autumn guide rebuild after relocation

The shared autumn guide scripts now resolve either the legacy kit layout or the relocated `kit/info/` layout. After relocation, run these commands from the project root:

```powershell
& 'Fox Fall/info/tmp/prepare-guides.ps1'
node 'Fox Fall/info/tmp/build-new-panels.cjs'
node 'Fox Fall/info/tmp/build-guides.cjs'
& 'Fox Fall/info/tmp/render-guides.ps1'
& 'Fox Fall/info/tmp/promote-guides.ps1'
```

`promote-guides.ps1` updates only each production-root guide PDF. It keeps the matching guide PNG and working PDF under `info/output/pdf/8x10/`; it does not overwrite the production SVG or recreate root outline/reference PNG aliases. The source resolver reads original inputs from `info/archive/previous-root-files/`, while stage files, logos, outputs and checks remain under the corresponding `info/` trees.

## Flowers and Halloween guide rebuilds after relocation

The current Flowers portrait and Halloween full-height guide entrypoints also support the relocated layout. Run these from the project root after organization.

Flowers in Vase:

```powershell
# Optional only when regenerating the current generated guide entrypoints:
node 'Flowers in Vase/info/tmp/portrait-rebuild/prepare-guide.cjs'

# Rebuild the current stages and guide:
node 'Flowers in Vase/info/tmp/portrait-rebuild/build-stages.cjs'
& 'Flowers in Vase/info/tmp/portrait-rebuild/build-guide.ps1'
node 'Flowers in Vase/info/tmp/portrait-rebuild/export-guide.cjs'
& 'Flowers in Vase/info/tmp/portrait-rebuild/render.ps1'
```

Keep `Flowers in Vase/info/tmp/8x10/` intact: `prepare-guide.cjs` reads its approved layout source and exporter/renderer templates. The Flowers guide builder first uses its page-colored logo in `info/assets/`; its fallback resolves the shared master at project `assets/images/river-and-ridge-logo.png`.

Gnome Halloween:

```powershell
node 'Gnome Halloween/info/tmp/full-portrait/build-stages.cjs'
& 'Gnome Halloween/info/tmp/full-portrait/build-guide.ps1'
node 'Gnome Halloween/info/tmp/full-portrait/export-guide.cjs'
& 'Gnome Halloween/info/tmp/full-portrait/render.ps1'
```

Keep `Gnome Halloween/info/tmp/vector-8x10/` intact because the current full-portrait sources and provenance depend on it. Both stage builders locate shared modules under `Fox Fall/info/tmp/vector-tools/node_modules/` after the move and retain the legacy-path fallback before the move. These commands rebuild working guide files under each kit's `info/tmp/` tree; review the render before replacing the production-root guide PDF. Archived builders, artwork exporters, SVG exporters and promotion scripts were not changed.
