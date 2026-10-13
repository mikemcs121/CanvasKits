---
name: fabric-kit
description: Create or revise Kinusaiga fabric-tucking kits from an image, subject idea, or folder of artwork. Produce an exact-size vector transfer outline first, a matching finished color picture, and a printable assembly guide. Use for fabric art on foam, not acrylic canvas painting kits or sewn quilt patterns.
---

# Fabric Kit

Create a coordinated kit for tucking fabric into grooves in a foam block. Preserve the user's subject, composition and requested difficulty. The outline, finished picture and guide must describe the same design.

## Defaults and scope

- Default artwork size: **8 x 8 inches**, square, unless the user requests another size. The artwork itself must measure this size; a page-size setting alone is insufficient.
- Create the **outline first**, inspect it and make it available before completing the color picture and guide. Continue the rest of an authorized full kit without requiring approval of each stage. If the user asks for only the outline or explicitly wants to approve it first, respect that scope.
- Default guide: **six illustrated steps on one US Letter portrait page**, for pre-grooved foam and supplied fabric pieces ready to trim. Confirm a different or unknown supply arrangement when it would change the instructions. Do not assume scissors, tucking tools or adhesive are included.
- For this user's kits, prefer **the local Desktop** in `Fabric Kit <Subject>`, outside OneDrive, unless the user explicitly chooses a different output destination. A source path under OneDrive does not itself change this output preference. Resolve and check the actual path, including redirects/junctions. Preserve the source in its original location.
- These are fabric kits. Do not import canvas-kit requirements such as 8 x 10 portrait artwork, gray transfer lines, paint palettes, mixing recipes or drying steps.

## 1. Inspect the source

Read the named folder or image and visually inspect the artwork. If it cannot be located, ask for the correct path or attachment; do not invent a substitute. Distinguish a supplied pattern from a color reference or design inspiration.

Preserve supplied originals. For an existing pattern, keep its recognizable geometry and piece boundaries. Close accidental gaps and remove tracing noise without redesigning the subject. Do not add seams, eyes, ornaments or small details merely to make a reference look richer.

For a new subject, use broad fabric pieces, manageable curves, and enough detail to feel intentional. Avoid tiny slivers, crowded intersections and very narrow pieces. Let the user's references determine complexity; do not make all new kits copies of the sunflower or turtle.

## 2. Build the transfer outline first

Deliver a true-vector SVG with physical `width="8in"` and `height="8in"` (or the requested dimensions), black strokes, round joins/caps, transparent interior and no embedded raster. Use approximately 1.5-2 pt strokes at final size, adjusting if explicitly requested.

Trace from the supplied design rather than replacing it with an unrelated generated outline. Build a shared geometry source for regions and boundaries so the reference and guide stages can use the same shapes. Draw shared boundaries once. Check joins, closures, overlaps, duplicate strokes and intentional intersections at both page size and enlarged view. Do not reuse a fragile hand parser that silently ignores SVG commands.

Create a **printable vector PDF** on US Letter, with the exact 8-inch artwork square centered on the page. Letter is 612 x 792 points; 8 inches is 576 points. A square may occupy x=18 to 594 and y=108 to 684. Keep titles and print instructions outside the artwork. Measure the border/path bounds in the actual exported PDF, not just the page dimensions or declared SVG size. Define the transfer boundary as the border centerline and allow space for stroke thickness.

Include: **Print at Actual size / 100%. Turn off Fit to page. Check the square measures 8 inches on each side.** For sizes that do not fit, use suitable paper or an explicitly sized tiled layout instead of shrinking.

## 3. Create the finished picture

Match the outline exactly. Choose an appropriate color palette if none is supplied; honor a supplied reference. Use light/dark fabric choices within existing regions to give form without creating new cutting lines.

Vector region fills are appropriate for a clear color-placement reference. For a realistic fabric look or requested printed-fabric variations, use available image-generation/editing tools and the imagegen workflow. Keep the established geometry and palette constraints explicit. Mix printed and plain fabric only when requested or consistent with the user's design brief; avoid making every kit a busy patchwork.

Inspect generated references against the approved outline. If edges drift, align the fabric textures with canonical region masks or revise the output. Do not claim exact registration based on a prompt alone. New colorways must not silently replace the original target or transfer geometry.

Deliver a finished-picture PDF with the artwork at the same exact size. A PNG is useful for viewing and printing; set physical resolution metadata consistently if supplying it. If the user wants the color picture as SVG, prefer true vector regions when available. An SVG that embeds a detailed raster image is allowed for preserving texture, but clearly identify it as an embedded-image color reference; never call it true vector.

## 4. Write the six-step guide

Use the chosen final picture near the title, a compact materials strip, and six numbered panels in a readable two-column, three-row layout. Use a restrained palette taken from the artwork, dark text and white reading space. Include a logo only when requested or required by applicable project instructions. Avoid tiny captions and decorative clutter.

Adapt the steps to the actual piece layout, rather than copying a previous kit's subject words:

1. **Sort and plan:** match fabrics to the reference; place the pre-grooved foam flat.
2. **Trim one piece:** leave a tuck allowance, typically about 1/4 inch (6 mm), starting generous and adjusting for the supplied foam and fabric. Do not tell users to cut exactly on the finished outline.
3. **Fill background sections:** smooth fabric and tuck gently with a blunt tool, a little at a time on opposite sides; avoid stretching.
4. **Build the main subject:** choose a kit-specific order for large body parts, stems, leaves, flippers or comparable pieces. Explain curves and narrow ends.
5. **Complete remaining sections:** describe the actual remaining shell, petals, center or other details and their fabric colors. Explain shared grooves where helpful.
6. **Neaten and finish:** tuck loose edges and threads, inspect the outer border, reset loose fabric, replace pieces cut too small, clear scraps and display.

For pre-grooved kits, omit groove-cutting instructions. Only include adhesive, backing, wrapping or hanging hardware steps when those materials and methods are established. Do not introduce paint, sewing or drying instructions. Tailor trim allowance and outer-edge treatment if the actual kit requires them.

Use cumulative diagrams from canonical geometry when showing progress. Keep future regions visibly unfilled until introduced; the final panel and header preview must match the selected reference. Operation diagrams may show trimming or tucking instead of repeating the entire artwork. Keep the supplied piece boundaries visible and useful.

## 5. Verify, save and deliver

Use the PDF skill when creating PDFs and the bundled workspace runtime when available. In Canvas Kits, the shared renderer is `assets/tools/pdf-render/render-pdf.cjs`; run it from the project root with `--expect-pages 1 --expect-points 612x792` for Letter printouts. Do not use Windows Runtime PDF rendering through PowerShell. Elsewhere, use an available reliable PDF renderer.

Render and inspect the outline, color picture and guide together. Verify:

- Measured artwork bounds, SVG physical size, one-page PDF dimensions and print instructions.
- Transfer SVG/PDF truly contains vectors rather than a placed bitmap.
- Complete subject, closed intended pieces, clean joins and no unintended crossings.
- Registration among outline, reference and cumulative panels.
- Six useful steps, correct subject/color names, readable captions and no clipping.
- Final files were actually copied to the promised location; check their existence there.

Suggested customer files (honor a requested format or naming scheme):

```text
Fabric Kit <Subject>/
  <slug>-outline-8x8.svg
  <slug>-outline-8x8-printable.pdf
  <slug>-finished-picture-8x8-printable.pdf
  <slug>-six-step-guide.pdf
```

Add a color SVG or PNG when requested. Keep editable geometry, builders and source artwork in a supporting `info/` directory or the project working folder; keep temporary renders and check files outside the customer deliverables. Preserve previous user files and approved editions; use a versioned name if replacement is not authorized. Do not modify unrelated Desktop folders or the user's rollback copies.

Provide direct file links, the actual destination, and the Actual size / 100% printing instruction. State which checks passed and whether any color SVG embeds a raster image. A checked file size is not a claim that a physical print or foam-transfer test was performed.
