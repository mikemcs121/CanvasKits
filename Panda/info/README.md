# Panda: info/

The three files in the parent folder are the production set: a children's kit with a #808080 transfer and a four-step guide using five ready-to-use paints, with no mixing. The earlier 12-step edition is in git (`f90aae1`). This folder holds only what is needed to change them and the parent `assets/` folder, plus the supplied original.

The source painting is by Robyn Smith Art Adventures (signed "Robyn '22"). The user confirmed on October 12, 2026 that they have permission to adapt it. Her logo and signature are not reproduced. The panda body and bamboo hidden under them (bottom centre and bottom right) are reconstructions.

## What is here

- `archive/previous-root-files/Panda.jpg`: supplied original (418 x 525), unchanged.
- `output/pdf/8x10/panda-finished-reference-8x10.png`: the reference master (2400 x 3000, 300 DPI). The reference PDF, the guide preview and the drying panel come from it.
- `assets/template-refactor/river-and-ridge-logo.png`: page-coloured logo with a small panda holding bamboo on the right riverbank. `tmp/make-logo.py` makes it with a deterministic hue shift of the shared master plus a vector panda rendered with resvg; no image generation was used.
- `tmp/geometry.py`: source-to-canvas mapping, region ids and the hand-drawn shapes: bamboo stalk, twig, five leaves, eye dots, face lines, bamboo joints, arm line, ear/nose shine.
- `tmp/build-outline.py` + `tmp/trace-masks.cjs`: colour-segments the original into regions, adds the hand-drawn shapes, traces each region with potrace and strokes every shared edge once (2 pt, #808080). Writes `labels.png` and the SVG into a work folder.
- `tmp/build-art.py`: paints the reference and step pictures 1-3 from `labels.png` and the rendered outline. Step 1 is the background; step 2 the white face and black ears, patches, nose and body; step 3 the light-green stalk and dark-green leaves. Step 4 adds dark-green rings, black smile lines, white ear and nose shine and the white eye dots. It is the guide's drying scene and shows the reference itself.
- `tmp/steps/step-1..3.png`: the guide's step pictures (full canvas, 960 x 1200).

Paints (ready to use, no mixing): yellow-green, white, black, light green, dark green. The printed arm line is covered by the black body coat and is not used in the four-step guide.

## How to change things (run from the project root)

Use a scratch work folder outside info/, for example `%TEMP%/panda-work`.

- **Outline:** edit `tmp/geometry.py`, then run `python "Panda/info/tmp/build-outline.py" <work>`. Render `<work>/panda-outline-8x10.svg` to `<work>/outline.png` at 2400 x 3000 with resvg (`assets/tools/vector-tools`). Review it, then copy the SVG to the kit root. A geometry change means the reference and steps must be rebuilt too.
- **Reference and step pictures:** `python "Panda/info/tmp/build-art.py" <work>`, then copy `<work>/panda-finished-reference-8x10.png` to `output/pdf/8x10/` and `<work>/steps/*.png` to `tmp/steps/`. Then run `node assets/tools/reference-pdf/png-to-pdf.cjs "Panda/info/output/pdf/8x10/panda-finished-reference-8x10.png" "Panda/panda-finished-reference-8x10.pdf"` and rebuild the guide.
- **Logo:** `python "Panda/info/tmp/make-logo.py"`, then rebuild the guide.
- **Guide text or steps:** edit the `panda` entry in `assets/tools/guide-template/kits.json`, run `node assets/tools/guide-template/build.cjs panda`, check `Panda/info/tmp/template-refactor/panda-painting-guide-8x10.pdf` with `assets/tools/pdf-render/render-pdf.cjs`, copy it to the kit root, then delete `tmp/template-refactor/`.
- **Kit-root assets/:** after a guide change, empty `../assets/` and run `node Tools/guide-image-extractor.cjs "Panda"`.

Requires Python with Pillow, NumPy and Shapely, and Node with the shared `assets/tools/vector-tools` modules.
