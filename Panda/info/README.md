# Panda: info/

The three files in the parent folder are the production set (children's kit, #808080 transfer). This folder holds only what is needed to change them and the parent `assets/` folder, plus the supplied original.

The source painting is by Robyn Smith Art Adventures (signed "Robyn '22"). The user confirmed on October 12, 2026 that they have permission to adapt it. Her logo and signature are not reproduced. The panda body and bamboo hidden under them (bottom centre and bottom right) are reconstructions.

## What is here

- `archive/previous-root-files/Panda.jpg`: supplied original (418 x 525), unchanged.
- `output/pdf/8x10/panda-finished-reference-8x10.png`: the reference master (2400 x 3000, 300 DPI). The reference PDF, the guide preview and the drying panel come from it.
- `assets/template-refactor/river-and-ridge-logo.png`: page-coloured logo, made by `tmp/make-logo.py` (deterministic hue shift of the shared master; no image generation).
- `tmp/geometry.py`: source-to-canvas mapping, region ids and the hand-drawn shapes: bamboo stalk, twig, five leaves, eye dots, face lines, bamboo joints, arm line, ear/nose shine.
- `tmp/build-outline.py` + `tmp/trace-masks.cjs`: colour-segments the original into regions, adds the hand-drawn shapes, traces each region with potrace and strokes every shared edge once (2 pt, #808080). Writes `labels.png` and the SVG into a work folder.
- `tmp/build-art.py`: paints the reference and the eleven step pictures from `labels.png` and the rendered outline. Base coats, then detail layers: step 8 shading, 9 highlights, 10 shine, 11 face lines and eye dots.
- `tmp/steps/step-N.png`: the guide's step pictures (1-7 full canvas at 960 x 1200, 8-11 crops).

Paints: white, black, yellow, green. Mixes stated in the guide: background = yellow + a little green; stalk = green + a little yellow; shading = green + a tiny dot of black; highlights = green + yellow + white; shine = white + a tiny dot of black.

## How to change things (run from the project root)

Use a scratch work folder outside info/, for example `%TEMP%/panda-work`.

- **Outline:** edit `tmp/geometry.py`, then run `python "Panda/info/tmp/build-outline.py" <work>`. Render `<work>/panda-outline-8x10.svg` to `<work>/outline.png` at 2400 x 3000 with resvg (`assets/tools/vector-tools`). Review it, then copy the SVG to the kit root. A geometry change means the reference and steps must be rebuilt too.
- **Reference and step pictures:** `python "Panda/info/tmp/build-art.py" <work>`, then copy `<work>/panda-finished-reference-8x10.png` to `output/pdf/8x10/` and `<work>/steps/*.png` to `tmp/steps/`. Then run `node assets/tools/reference-pdf/png-to-pdf.cjs "Panda/info/output/pdf/8x10/panda-finished-reference-8x10.png" "Panda/panda-finished-reference-8x10.pdf"` and rebuild the guide.
- **Guide text or steps:** edit the `panda` entry in `assets/tools/guide-template/kits.json`, run `node assets/tools/guide-template/build.cjs panda`, check `Panda/info/tmp/template-refactor/panda-painting-guide-8x10.pdf` with `assets/tools/pdf-render/render-pdf.cjs`, copy it to the kit root, then delete `tmp/template-refactor/`.
- **Kit-root assets/:** after a guide change, empty `../assets/` and run `node Tools/guide-image-extractor.cjs "Panda"`.

Requires Python with Pillow, NumPy and Shapely, and Node with the shared `assets/tools/vector-tools` modules.
