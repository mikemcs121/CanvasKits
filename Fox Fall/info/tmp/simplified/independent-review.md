# Fox Fall simplified edition review

Reviewed September 23, 2026 after rendering the final candidate PDFs at 300 DPI.

- Guide: one US Letter portrait page, 2550 x 3300 render. All six panels, headings and directions are legible, inside safe margins and free of overlap. The finished preview, full logo, materials strip, provided-paint list and cleanup footer are intact.
- Reference: one 8 x 10-inch page, 2400 x 3000 render. It uses the retained stage-7 pixels with only the native paws group changed to black, centered in the established square placement without stretching.
- Sequence: original stages 1, 2, 3, 5, 6 and 7 are cumulative. Stage 5 combines both ready-to-use scarf colors. The final step uses black for the paws, ear tips, facial details and leaf stems, plus white eye dots.
- Simplification: texture, shading and highlight stages 8-11 are omitted. The guide contains no mixing directions. Listed paints are orange, ivory, forest green, golden yellow, black and white. Dark brown is not used.
- Constrained artwork edit: the native `paws` mask contains 40,928 pixels. All 40,928 are black in the revised target, every changed pixel belongs to that mask, and every pixel outside it remains identical to original stage 7.
- Registration: the rendered unchanged SVG and the simplified reference linework align across the fox, scarf, leaves and facial details. The measured outline-support fraction within four pixels is 1.0.
- Transfer: the simplified SVG hash matches the approved production SVG (`b00e01e6c48aafe705fb421d7a66a175c8f6921ff480ef3f35287f507d74db85`). It remains a true 8 x 10 vector with #808080, 2-point round strokes and no raster image or background.
- Preservation: all three kit-root production hashes match their pre-build values. The simplified folder contains exactly the outline, guide and reference.

Machine-readable results are in `verification.json`, PDF renderer measurements are in the two `*-checks.json` files, layout clearance is in `layout-checks.json`, and final file hashes are in `promotion-manifest.json`.
