# Canvas kit production and organization

## Current layout — September 20, 2026

The project root holds shared assets, project-wide Markdown notes, and one folder per kit. Each kit root contains exactly three production files and one supporting directory:

- `<slug>-outline-8x10.svg`: existing approved true vector transfer, 8 by 10 inches, transparent background.
- `<slug>-painting-guide-8x10.pdf`: customer instructions, one US Letter portrait page.
- `<slug>-finished-reference-8x10.pdf`: matching color target, one 8 by 10-inch page.
- `info/`: everything else, with a README describing the current sources, checks, and build locations.

By the user's September 25 request, a kit root (and any kit subfolder with its own guide, such as `simplified/`) may also hold `assets/`: lossless copies of the images embedded in that folder's painting guide, produced by `Tools/guide-image-extractor.cjs`. Do not move these into info/. The project-root `Tools/` folder holds that extractor and `Tools/KitViewer/` (double-click `Kit Viewer.cmd` to browse kits in an Edge/Chrome app window); shared build tools stay in `assets/tools/`.

Keep matching PNGs, compatibility PDFs, canonical images, masks, prompts, builders and review notes inside info/. Use info/assets/ for working artwork, info/tmp/ for builds and reviews, info/output/ for supporting exports, and info/test/ for retained supplied test art. Keep original supplied material unchanged. Archive superseded root aliases and notes in info/archive/previous-root-files/; preserve older build directories when current scripts depend on them. Do not delete old files merely to tidy the view. New obsolete editions belong in info/archive/ with descriptive names.

Production files at the kit root are the authoritative customer/transfer deliverables. Do not leave additional aliases, README files, PNGs, or alternate PDFs there. Do not select files by modification date alone. Review the outline, reference, and guide together before promoting them. Preserve file hashes and an old-to-new path manifest when reorganizing. Keep supporting PNGs rendered from the current PDF under info/output/.

The Desktop Canvas Kits folder is the user's untouched rollback copy. The Desktop Flowers In Vase folder was the organization example. Do not modify either during this organization. Normal future work takes place in this project.

Use [canvas-kits.md](canvas-kits.md) to find current production files and review status. [canvas-kit-history.md](canvas-kit-history.md) preserves earlier decisions and provenance; its paths and superseded standards are historical, not current instructions.

## Artwork and production standards

September 21, 2026 restoration is complete: see `reference-restoration-review.md` and `RESTORATION-HANDOFF.md`. Four restored masters live in their kits' `info/assets/reference-restoration/restored-master.png`; six current guide plans are synchronized with shared `assets/tools/guide-template/kits.json`. Current checks and promotion manifests are in `info/tmp/reference-restoration/`. Earlier organization/sky-repair exporters are historical and must not overwrite these selected masters. All approved transfer files remain unchanged; preserve them in future work. Existing paint sets and template palettes were retained.

Use the project build-canvas skill for full kits. Its output layout must follow the three-file root structure above. A full kit includes the three production files plus supporting artwork PDFs/PNGs and guide PNG stored under info/.

Preserve each current SVG's approved geometry. This organization request authorizes bringing references and guides into alignment with those SVGs, not redesigning the transfer. Specific future rejections of a composition authorize replacing it after archiving the rejected edition and updating all three production files together.

For new designs or requested recompositions, the actual subject must read as a natural 4:5 portrait, with complete features and natural proportions. Extra background around a square design does not satisfy this. Existing centered Fox Fall, Ghost Fall, Cat in Pumpkin, and Pumpkin arrangements remain preserved unless separately revised.

Current transfer standard is **2 pt (0.706 mm)** at 8 by 10 inches, round caps/joins, **#A6A6A6 for adults**, **#808080 for children's Fox Fall and Cat in Pumpkin**. SVGs contain true vector paths, no raster or background. Supporting outline PDFs remain vector. PNGs have transparent interiors and margins, 2400 by 3000 at 300 DPI; optional 600-DPI compatibility copies are 4800 by 6000. Artwork PDFs are 576 by 720 points; guides are 612 by 792 points. Print artwork at Actual size / 100%. These are file standards, not claims of physical press testing.

Never overwrite supplied originals. The approved outline determines shapes and placement; the matching reference determines the target. Build guide stages with canonical masks, layers, and mapped crops. Full-canvas panels use the portrait artwork dimensions, and the final preview and drying panel show the selected current reference. Keep colors unpainted until their stated step. A drying scene shows a canvas lying flat.

## Guide design and beginner instructions

Default to adult acrylic paint-night kits; Fox Fall and Cat in Pumpkin are children's kits. Preserve recognizable subjects and current painting stages. The user's September 20 request establishes the Fall View illustrated draft as the shared layout template for all guides, superseding earlier instructions to retain different per-kit layouts. The local reference is `assets/templates/fall-view-guide/reference.pdf`. Use a large brush-script title, finished painting at top left, full logo at top right, centered materials strip, four-column picture grid, numbered serif headings beneath images, short readable captions, thin dividers and a restrained footer. Use twelve useful steps, or eight for Pumpkin. The editable shared builder is `assets/tools/guide-template/build.cjs`; each kit's plan lives in `info/tmp/template-refactor/plan.json`.

Match each guide's logo and background accents to its own painting. Derive dark title/caption tones, pale title wash, materials banner, footer wash and dividers from the artwork; do not apply Fall View's blue palette to every subject. Keep white reading space and enough contrast for printing. Preserve the existing kit's paint list and explicit mixing recipes. Avoid childlike decoration in adult kits.

Use a small finished-reference preview near the title, a compact materials banner, and numbered illustrated panels with short directions. Default to twelve useful steps in a four-column by three-row grid; use fewer if twelve would be repetitive. Late stages should show useful distinct crops or brush actions. Ensure readable print-size captions, safe margins and no overlap.

List canvas, acrylic paints, large and small brushes, water, paper towels and a palette or paper plate without assuming everything is included. Start with the preprinted canvas, not a drawing lesson. Explain thin coats, rinsing and blotting, drying between layers and cleanup. Every color must be a listed paint or have a recipe using listed paints in the step before use. Do not add paint pots silently. Explain practical mixing, layering, brush direction, blending, shadows and highlights. Floral outlines may separate petals, but painted transitions should blend softly rather than follow dark internal seams.

Load the unchanged shared logo from assets/images/river-and-ridge-logo.png. Save page-colored variants in the kit's info/assets/. Preserve the full lettering, silhouette, landscape, transparency and wide aspect ratio. Place the logo in the top-right header without overlap; derive its colors and subtle seasonal details from the current painting and page. Current template variants belong in `info/assets/template-refactor/`. Keep lettering dark and readable, ribbons light, and landscape colors complementary to that painting; snowy details belong only on winter pages.

## Verification and completion

Review all three files together, including rendered SVG/reference/guide images. Verify exact SVG size, vector content, gray and 2-point weight; one-page PDF sizes; outline/reference registration; cumulative painting sequence; distinct finishing panels; all recipes and spelling; legible text; logo integrity; and matching final PDF/PNG revisions. Save checks actually performed in info/tmp/ and link them from info/README.md. Do not equate correct page dimensions with correct geometry.

Rasterize PDFs with the shared renderer `assets/tools/pdf-render/render-pdf.cjs`, run from the project root:

```
node assets/tools/pdf-render/render-pdf.cjs "<kit>/<slug>-painting-guide-8x10.pdf" "<kit>/info/tmp/<build>/<slug>-painting-guide-8x10.png" --expect-pages 1 --expect-points 612x792 --checks "<kit>/info/tmp/<build>/pdf-checks.json"
```

It renders at 300 DPI by default (612 by 792-point guides become 2550 by 3300 pixels; 576 by 720-point artwork becomes 2400 by 3000), writes that DPI into the PNG, exits non-zero when `--expect-pages`/`--expect-points` fail, and records only page counts and sizes it actually measured. Loop over kits in the calling `.cjs` builder, one invocation per PDF.

Never rasterize PDFs by calling the WinRT `Windows.Data.Pdf` APIs from PowerShell (`Add-Type -AssemblyName System.Runtime.WindowsRuntime` plus a reflected `AsTask`/`Await` helper). That interop is unsupported in Windows PowerShell 5.1 and access-violates part way through a multi-kit loop, which raises a blocking `powershell.exe - Application Error` dialog and hangs the agent thread waiting on the command. The `render.ps1` scripts under older `info/tmp/` build directories are that broken pattern; leave them in place for provenance, but do not copy or rerun them.

References should have smooth, continuous painted texture, without digital square blocks, tiled samples or pixel-grid artifacts. Inspect enlarged sky and subject details as well as page-size previews. Do not magnify tiny texture patches using integer/nearest-neighbor sampling. Use appropriate smooth resampling and keep replacements constrained to canonical masks. After any reference correction, refresh its guide illustrations, preview and drying image together. Current two-gnome sky repair and all-kit review: reference-texture-review.md.

Full-kit and guide-repair requests authorize finishing and promoting verified files. Repair ordinary generated drift using canonical layers and crops. Use draft status only for a concrete unresolved source/tool blocker; identify the failed gate. Keep any printable unresolved draft clearly labeled under info/output/, not under a misleading production filename. Do not overwrite a usable production file with an unverified draft.

Builders inherited from before the organization may contain old absolute paths or assumptions about project depth. Consult info/README.md and the organization manifest before running them; update paths to info/ and the shared project assets deliberately. Do not run historical exporters over current SVGs or restore obsolete 1.4-point/black outlines.

## Simplify rule for children's editions

When asked to simplify an existing kit for children, use the project [simplify rule](.agents/skills/simplify/SKILL.md). It creates a separate edition for ages 8-14, with directions an 8-year-old can understand. Retained steps and the final target are chosen for each kit; Cat in Pumpkin's step numbers and palette are examples, not defaults for other kits.

For this workflow, preserve the approved outline byte-for-byte and keep the original production set intact. Put an unchanged SVG copy, a new guide PDF and a matching reference PDF in the kit's `simplified/` folder; this is an authorized exception to the normal root layout. Use only the ready-to-use paint colors needed for the simplified target, list them as provided, and include no mixing recipes. This overrides the usual instruction to retain the original paint list and mixing recipes for the simplified edition only. Follow the skill for stage dependencies, matching illustrations, readable layout, archives and verification. Apply it only to requested kits.

## Cat in Pumpkin simplified edition

The user's separate simplified edition for ages 8-14 lives in `Cat in Pumpkin/simplified/`, an explicitly requested exception to the usual root folder structure. It contains a byte-identical copy of the approved `cat-in-pumpkin-outline-8x10.svg` plus a new `cat-in-pumpkin-painting-guide-8x10.pdf` and `cat-in-pumpkin-finished-reference-8x10.pdf`. Preserve the original kit-root files. Retain original guide stages 1, 2, 3 and 6, renumbered 1-4, with age-8-readable directions and a step-6 reference target; include painting the inner ears and the other visible facial details in the final instruction. Sources are the existing `info/tmp/8x10-artwork/step-*.png` stages, the approved SVG, and the current logo. The user's latest September 23 correction removes golden yellow and leaves the formerly golden eye areas white in both guide and reference, using the existing canonical eye-region mask. Provided ready-to-use paints are orange, gray, pink, dark brown, black and white. Do not include color mixing in this simplified guide. Derived white-eye artwork lives in `info/assets/simplified/`. Supporting build and review files live in `info/tmp/simplified/`; matching PDF renders live in `info/output/simplified/`.
