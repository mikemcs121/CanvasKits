# Hokie Sunset horizontal canvas kit

## Current approved edition - October 19, 2026

The user approved the eight-color study and subsequent guide revisions for production. The 10 x 8-inch horizontal composition and saved transfer SVG are unchanged. The reference is now the clean canonical color study: cream/peach/orange sunset, three single-color blue mountain bands, maroon emblem, white HokieBird details and continuous orange border. The guide uses the approved shorter wording, a plain color list and the Hokie Sunset River and Ridge logo. No test labels or numbered paint swatches appear in production.

Production files:

- `../vt-hokie-outline-10x8.svg`: unchanged transparent vector master; 10 x 8 inches, #A6A6A6, 2-point rounded strokes.
- `../vt-hokie-finished-reference-10x8.pdf`: one 720 x 576-point landscape page.
- `../vt-hokie-painting-guide-10x8.pdf`: one 612 x 792-point US Letter page; eight illustrated stages.
- `../assets/`: final guide images extracted losslessly by `Tools/guide-image-extractor.cjs`; the composed drying desk is rendered at 600 DPI.

Ready-to-use paints: cream, peach, orange, light blue, medium blue, dark blue, maroon and white. No mixing recipes. The sunset uses light feathering between supplied colors. Digital swatches are color targets, not tested paint-brand matches.

## Sources and authority

- `archive/previous-root-files/`: supplied originals, unchanged.
- `assets/geometry.json` and `assets/outline-master.json`: approved canonical paths, region dependencies and binding to the saved SVG and original registered painting. The original `assets/border-continuation-source.png` is retained as the registration source; it is no longer the finished target.
- `assets/generated-source.png`: original reconstruction input and provenance.
- `assets/reference-master.svg` and `.png`: current canonical color master; 3000 x 2400 pixels, matching the 10 x 8 artwork.
- `assets/stage-01.png` through `stage-07.png`: matching cumulative guide panels.
- `assets/page-logo.png`: transparent wide landscape logo with maroon lettering, orange trim, blue mountains, sunset, river and a Hokie emblem. Preserve the shared original logo unchanged.
- `src/build.cjs`: current artwork and production builder, preserving the saved outline.
- `src/guide-pdf.cjs`: deterministic Letter-page writer with vector serif text, brush-script title and native transparent logo embedding.
- `src/outline-master.cjs`: validates the saved geometry binding; normal builds do not retrace.
- `src/border-geometry.cjs`: geometry proposal support only; must not overwrite the master.
- `src/image-prompts.txt`: original reconstruction provenance.
- `../../assets/tools/guide-template/kits.json`, entry `vt-hokie`: current paint palette and guide plan. The shared guide builder routes this landscape kit to its dedicated builder.

## Rebuild

Run from the project root:

```powershell
node "VT Hokie/info/src/build.cjs"
```

Candidates, review renders and checks go to `tmp/vt-hokie-approved/`; production PDFs are not changed by default. After reviewing them together with the saved SVG:

```powershell
node "VT Hokie/info/src/build.cjs" --promote
```

`--audit-only` checks the approved outline binding without rebuilding. Candidate reference and stage pictures are in `tmp/vt-hokie-approved/source-assets/`. The guide uses the same current reference in its preview and drying scene. The builder checks PDF page counts/sizes and unchanged production hashes before promotion; promotion changes the guide/reference and their editable masters, never the transfer.

Extract candidate pictures first, then replace the previous extracted set after review (the extractor refuses changed files in an existing assets folder):

```powershell
node Tools/guide-image-extractor.cjs "tmp/vt-hokie-approved/vt-hokie-painting-guide-10x8.pdf"
```

## Preservation and review

The primary project Git metadata was read-only during this promotion. Before replacing production, the previous complete VT kit was committed in a separate rollback repository as `b6a45aa`; its portable Git bundle is `../../tmp/vt-hokie-promotion/previous-edition.bundle`. It includes supplied originals, masters, guides, references and extracted pictures. A file-hash manifest for replaced extracted assets is alongside it. No superseded edition was added to info/archive.

The approved SVG SHA-256 remains `5fe65c65e5763f3535a78e4e6509024ce54d4b0b92cbba39b4354b9dfbe424b0`. Actual reviewed checks: rendered outline/reference registration, cumulative painting sequence, current logo and wording, one-page Letter guide, one-page 10 x 8 reference, and lossless extracted pictures with a 600-DPI drying-panel crop. These are digital checks, not physical painting or press tests.
