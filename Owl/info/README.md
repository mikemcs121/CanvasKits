# Owl kids canvas kit

Created October 19, 2026 from the supplied `ChatGPT Image Oct 14, 2026, 06_04_48 PM.png`. The owl, both wings, branch, five leaves and four stars retain their source proportions and arrangement in an 8 x 10 portrait canvas. Heavy black raster strokes were converted to smooth black vector centerlines and closed eye contours. The branch's open left end was given a rounded end so it can be painted as one shape; the internal woodgrain marks were subsequently removed at the user's request. Fine raster junctions are traced adaptations, not original editable vectors.

## Production files

- `../owl-outline-8x10.svg`: 8 x 10 inches, #000000, 3-point rounded strokes, true vector paths, transparent background and interiors, no frame or embedded raster.
- `../owl-finished-reference-8x10.pdf`: one 576 x 720-point page with the exact saved 2400 x 3000 reference master.
- `../owl-painting-guide-8x10.pdf`: one US Letter page, six illustrated steps in two columns and three rows, for ages 8-14.
- `../assets/`: final guide pictures, including the complete drying scene cropped from a 600-DPI render.

Nine ready-to-use paints: light blue, tan, cream, brown, green, yellow, pink, black and white. No mixing. The guide and reference retain their approved gray illustration lines. The black 3-point standard applies to the separate transfer SVG only. Stages: sky; branch/leaves; tan feathers; cream face; yellow/pink accents; eyes, shines, drying and cleanup.

## Preserved source and editable files

- `archive/previous-root-files/owl-coloring-page.png`: unchanged supplied source, SHA-256 `fd47be7ed66f4bb3609d5f54e9fb869e110bade6743a1e86e92a3d9f3c48ba5f`.
- `assets/geometry.json`: canonical centerlines, compound eye contours and uniform placement. Normal builds reuse these paths.
- `assets/paint-plan.json`, `assets/paint-layers.json`: editable colors, source-derived region assignments and vector color layers. Paint-region extraction bridges narrow feather junctions and fills shared line bands to avoid background pinholes. Eye fills reuse the exact compound source contours, retaining smooth white rings and shine marks.
- `assets/reference-master.svg`, `assets/reference-master.png`: matching current reference; PNG is 2400 x 3000 at 300 DPI.
- `assets/stage-01.png` through `stage-06.png`: cumulative stages with the same canonical line layer; stage 6 equals the reference master.
- `assets/page-logo.png`: full shared logo with cream ribbons and complementary landscape colors; shared original unchanged.
- `src/build.cjs`: normal candidate builds, PDF size checks and promotion.
- `src/trace.py`, `src/build-outline.cjs`, `src/regions.py`, `src/paint-masks.py`: explicit raster-to-vector and region reconstruction.
- `src/paint.cjs`, `src/finish-images.py`, `src/guide-pdf.cjs`: deterministic stages, reference, print metadata and guide layout.
- Shared guide plan: `assets/tools/guide-template/kits.json`, entry `owl` at the project root.

Run from the project root:

```powershell
node Owl/info/src/build.cjs
# Review tmp/owl/outline-preview.png, finished-reference.png,
# painting-guide.png and stages.png, then:
node Owl/info/src/build.cjs --promote
node Tools/guide-image-extractor.cjs Owl/owl-painting-guide-8x10.pdf
```

Use `--retrace` only for an intentional reconstruction from the supplied source, then review all three deliverables together. Scratch masks, previews and check files stay in `tmp/owl/`. The builder uses the bundled Python runtime path; update its `python` variable if that runtime moves. For changed guides, extract images into scratch before replacing an existing extracted asset set.

## Review

Reviewed the complete transparent outline, colored reference, enlarged eye details, six cumulative stages and rendered guide. Verified the 8 x 10 vector transfer, #000000 and effective 3-point stroke, transparent interior/background, one-page Letter guide and 8 x 10 reference, 300-DPI master/stages, final-stage identity, exact master pixels embedded in the reference PDF, readable captions, full logo and the exact reference lying flat in the drying scene. The original source remains byte-identical. These are digital checks, not physical painting or press testing.

October 19 correction: guide PDF, reference PDF, stage artwork and extracted guide pictures were restored byte-for-byte from pre-change commit da6f20a. Only the transfer SVG uses the new black 3-point styling; illustration builders retain their prior treatment.

## Branch cleanup — October 19, 2026

Removed eight internal woodgrain paths from the canonical centerlines, transfer outline, all six guide stages, header preview, reference and drying picture. The branch edge, leaf veins, stems, feet and all other paths are preserved. `omittedCenterlinePaths` records the excluded paths and the source-outline builder retains those exclusions on retrace. The transfer remains black 3 pt; approved gray 2-point illustration styling is unchanged. A pixel comparison against snapshot `f9d0faf` confirmed zero changes outside the deleted strokes in every stage and reference master. Previous same-day byte-identical restoration notes describe the prior edition; this branch-only correction is the current artwork.
