# Corrected portrait edition: production review

User direction: the image itself must be 8 x 10; remove the square-on-portrait treatment. The outline must be a black-on-transparent vector. Rebuild the matching reference and instructions, and update the previously requested Desktop copy.

The built-in image-generation tool recomposed the existing painting into a 4:5 portrait arrangement and generated its matching line-art companion. Inputs and exact prompts are retained in this folder and assets/portrait-rebuild. The generated 1122 x 1402 pair was normalized to an exact 1120 x 1400 master, then the line art was traced into SVG. The reference was registered to the vector-rendered outline's closed regions. Paint texture is resampled for print; no claim of native 300-DPI generated detail is made.

All three PDFs were rendered through Windows.Data.Pdf and visually inspected. The guide is one US Letter page (612 x 792 points); artwork PDFs are one 576 x 720-point page each. The guide PNG is rendered directly from its PDF and explicitly encoded as PNG. Both reference outputs contain the same composition. The outline PDF contains vector paths with no raster image object.

Final checks confirm vector bounds [0,0,1119,1399] on a [1120,1400] canvas, no embedded raster or background rectangle in SVG, black outline RGB with transparent interiors, 2400 x 3000 / 300-DPI artwork PNGs, and a 4800 x 6000 / 600-DPI outline PNG. The painting has 7,200,000 opaque pixels and zero near-white pixels in the checked outer edge bands: no square inset or white padding remains.

Eleven staged images use the same vector-rendered line master and masks. Unpainted regions stay white; all line and premature-color checks pass. The group plan assigns background at 2, leaves at 3, vase at 4, blush at 5, apricot at 6, red petals at 7, yellow buds/centers at 8, petal blending at 9, leaf/vase texture at 10, and berries/center details at 11. Six berries and their shine regions were explicitly checked. Step 12 uses the exact finished painting on a flat canvas.

The original guide's title, fonts, branding, palette, materials banner, numbers, dividers and footer are retained. All nine paint names and recipes were reviewed. Step 9 uses crop [540,480,400,340]; step 10 [0,650,800,730]; step 11 [790,740,330,480]. Each has a separate brush cue. Captions fit their original measured areas and do not overlap the footer. The existing logo retains its matching navy, teal, green and gold page colors and original aspect ratio.

Original source bytes and earlier editions were archived before replacement. The original outline's SHA-256 remains 40547b6bec5fbdc82f2f59f174ab63ce017aa5310e25800ccde64220622668e6. Current source/output paths are listed in START-HERE.md and AGENTS.md. Old square/padded builders are superseded.

Rebuild order: prepare-art.cjs, build-stages.cjs, prepare-guide.cjs, build-guide.ps1, export-art.cjs, export-guide.cjs, render.ps1, visual review, promote.ps1, verify-final.cjs. Inspect before updating the Desktop copy.
