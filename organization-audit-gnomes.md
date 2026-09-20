# Gnome Christmas Tree and Gnome Fall organization review

Organization completed: current production files are at each kit root; old kit assets/tmp/output/test paths below now live under info/. Source selections below document the pre-move audit. See canvas-kits.md for current links and each info/organization-manifest.json for exact mappings.

Reviewed September 20, 2026 against the Desktop `orginize canvas kits.txt` instructions. No Desktop backup files were changed. This review covers these two kits only; the main organization process controls final moves.

## Findings and selected production files

Both folders had recent 8 × 10 gray SVG transfers, but only older square color references and flattened illustrated guides. Neither had a matching portrait reference PDF or current portrait guide. Merely placing the old square reference on a portrait PDF would not match the existing transfers.

Existing SVGs were retained unchanged:

- `Gnome Christmas Tree/output/svg/8x10/gnome-christmas-tree-outline-8x10.svg` (identical root alias)
- `Gnome Fall/output/svg/8x10/gnome-fall-outline-8x10.svg` (identical root alias)

The files to promote to the three-file kit roots are those SVGs and these newly built PDFs:

- `Gnome Christmas Tree/output/pdf/8x10/gnome-christmas-tree-painting-guide-8x10.pdf`
- `Gnome Christmas Tree/output/pdf/8x10/gnome-christmas-tree-finished-reference-8x10.pdf`
- `Gnome Fall/output/pdf/8x10/gnome-fall-painting-guide-8x10.pdf`
- `Gnome Fall/output/pdf/8x10/gnome-fall-finished-reference-8x10.pdf`

After organization, the support copies above move beneath each kit's `info/output/`; the same PDF basenames and SVG basename remain directly in its root. Matching PNGs remain support files beneath `info/output/pdf/8x10/`.

## Repairs and provenance

Original square inputs and old guides were preserved. New portrait painting textures were generated from each kit's `test/<slug>-outline-8x10.png` and existing `<slug>-finished-reference.png` palette reference. Generated attempts are saved in `tmp/organization/generated-reference.png`; they were not adopted blindly as transfer geometry.

Registration uses closed region masks from the original outline geometry. Current production SVG linework is directly rendered and reused over all full-canvas instruction stages. The Christmas drawing has open tree/shoe endpoints: only the internal paint masks close these gaps, with rounded shoe bottoms. The production SVG itself was never edited. Clean sky texture is sampled within the canonical background mask to remove generated foliage silhouettes outside printed contours. New sources are reconstructed painting companions, not recovered original paintings. Masked painting texture is processed at 800 × 1000 and resampled to 2400 × 3000 for print; the outline remains vector.

Each rebuilt guide has twelve editable captioned panels, restrained navy/blue-gray styling, the complete shared River and Ridge logo, portrait reference preview, practical materials, distinct finishing crops and the exact new reference on the final flat drying canvas. Christmas step 7 is a separate hat-fold detail; it does not repeat step 6. Fall lanterns remain unpainted until their lantern step.

Palettes are unchanged:

- Christmas: white, black, red, yellow, blue, green, brown.
- Fall: white, black, red, yellow, teal, green, brown, orange.

Caption mixtures use these listed paints. Background, skin, beard, hat shadows and highlights are described before use. The guide is a practical painting example: brush texture and optional highlights are painterly; it is not a paint-by-number guarantee that every texture pixel is reproduced.

## Build and verification records

`Gnome Fall/tmp/organization/build.cjs` builds both kits and detects the future `info/` support layout and relocated `Fox Fall/info/tmp/` dependencies. It creates support PDFs and PNGs. Run from the project root:

```powershell
node 'Gnome Fall/info/tmp/organization/build.cjs'
powershell -ExecutionPolicy Bypass -File 'Gnome Fall/info/tmp/organization/render.ps1'
```

For a deliberate later refresh of the customer root PDFs, append `--promote` to the Node command. This copies only the guide and reference PDFs to the kit roots; support PNGs stay under `info/`. The initial organization pass performs this promotion itself. An optional slug argument restricts the build to one kit.

`inspect.cjs` recreates geometry masks, original contour previews and numbered region maps. Both kits retain editable `guide.html`, `step-plan.json`, `labels.bin`, `regions.json`, canonical and registered reference images, the eleven staged/cropped pictures and `layout-checks.json`. These paths move from `tmp/organization/` to `info/tmp/organization/`.

Verification performed:

- Exported PDFs loaded and rendered through Windows PDF. Each guide is one US Letter page (612 × 792 points); each reference is one 8 × 10 page (576 × 720 points). Actual results are in `Gnome Fall/tmp/organization/pdf-checks.json`.
- Each matching guide PNG is rendered directly from its final PDF at 2550 × 3300. Reference PNGs are 2400 × 3000; a separate PDF render is retained for comparison.
- The actual rendered pages were visually inspected for complete numbered steps, caption spacing, readable text, correct paint recipes, full logo, distinct finishing views and flat drying view.
- Per-panel DOM checks verify caption bottoms stay within their cells. Step plans record cumulative painted groups and zero writes of paint into unrevealed mask regions.
- No original reference, test outline or production SVG was overwritten. The final transfer hash check belongs to the main organization manifest, which compares selected sources before/after movement.

No pending source or tool blocker remains for these two kits.
