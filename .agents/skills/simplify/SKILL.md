---
name: simplify
description: Create or revise a simpler children's edition of an existing Canvas Kits painting kit, with fewer kit-specific steps, ready-to-use paint colors, and matching guide/reference artwork in a simplified folder. Preserve the approved outline and original production files. Not for designing a new kit.
---

# Simplify a canvas kit

Create a complete, verified alternate edition that children can follow. Default to ages 8-14 and wording an 8-year-old can understand. Honor the user's chosen age range, steps, colors and details; the Cat in Pumpkin example is not a universal design.

## Inspect and select

1. Read the project's current `AGENTS.md`, `canvas-kits.md` and the selected kit's `info/README.md`. Inspect the approved outline, current guide, reference and retained stage sources together. Resolve paths from the active project root.
2. Record hashes of the three original production files before working. Preserve supplied originals and source assets.
3. Use the steps the user identifies. Retained step numbers and the final number of panels vary by kit; never default all kits to steps 1, 2, 3 and 6. If no steps are specified, choose and explain a short sequence that teaches the essential painting actions; ask only when missing information materially prevents a sensible choice.
4. Save an editable plan mapping new sequential step numbers to original stages. Record newly painted regions, earlier paint and areas still white. Identify dependencies hidden in omitted steps: fold needed actions into a retained step using simple directions, or omit unnecessary detail consistently from both instructions and artwork.

## Preserve the transfer and simplify the target

- Copy the approved outline SVG byte-for-byte. Do not regenerate, recolor, thicken, resize or otherwise edit it, even if an existing adult outline uses a lighter gray than the children's default.
- Keep the original composition and placement. A square source may have an established centered placement on the 8 x 10 canvas; recover that transform from the current builder or provenance instead of stretching the image to 4:5.
- Make the reference match the selected simplified final stage. Prefer the exact retained stage when suitable. Keep essential subject features and remove advanced shading, texture or small accents only as the requested simplification warrants.
- Use existing editable native masks, layers and stage builders for small deterministic changes. Toggle only the intended region, save a derived asset, and verify that other regions and canonical linework stay unchanged. Follow the imagegen skill when a task actually requires generated raster artwork; inspect local inputs first.
- Leaving an omitted accent white can be appropriate when authorized by the user's simplification choices. Do not impose Cat in Pumpkin's white eye treatment, palette or other subject-specific choices on another kit.
- The header preview, final guide panel and reference must show the same target. All earlier panels must accurately show the cumulative steps and use the same registered geometry. Include any black fills or defining lines that the pictures require; do not assume an unfilled gray transfer already supplies painted black details.

## Write and lay out the guide

- Use ready-to-use paint colors. Remove all mixing recipes and directions. List the actual colors needed as **Paint colors provided:** and make every named color agree with the pictures and instructions. Do not retain unused primary paints from an older mixing palette.
- Aim for six or fewer provided paint colors. Prefer reusing a suitable listed color or consistently omitting a nonessential accent when that keeps the target clear and recognizable. Honor explicit user color choices, and do not force a confusing substitution merely to reach six; when more colors are genuinely needed, use the smallest sensible palette and document the reason in the editable plan and verification notes.
- Use familiar words, short sentences and direct actions. For example, use "rinse and pat dry" rather than "rinse and blot." Break a busy finishing step into short directions by color.
- Keep preparation, thin coats, brush rinsing, drying between layers and cleanup brief. Start from the preprinted canvas. List needed materials without claiming supplies other than the explicitly provided paint colors are included.
- Keep the existing kit's branding, full logo, artwork-derived page colors and illustrated-guide character. Adapt the panel layout to the actual step count; use generous, readable print-size directions rather than preserving an unnecessarily dense grid. Renumber the retained sequence clearly from 1.
- Produce one US Letter portrait guide (612 x 792 points) and one 8 x 10 reference (576 x 720 points). Keep the editable plan and builder with the supporting files. Read the PDF skill when authoring PDFs.

## Save the alternate edition

The selected kit's `simplified/` folder contains exactly these three files, using that kit's existing slug:

- `<slug>-outline-8x10.svg` — unchanged copy of the approved transfer.
- `<slug>-painting-guide-8x10.pdf` — simplified instructions.
- `<slug>-finished-reference-8x10.pdf` — matching simplified target.

Keep the root production set unchanged. Use `info/assets/simplified/` for derived artwork, `info/tmp/simplified/` for plans, builders and checks, and `info/output/simplified/` for PNGs rendered from the final PDFs. Do not place extra files in `simplified/`.

Before replacing an existing simplified edition, preserve the affected PDFs, renders, editable files and verification records in a descriptively named folder under `info/archive/`. Record hashes and source-to-output paths. Rebuild only affected deliverables; a wording-only edit does not require replacing the reference.

## Verify and finish

1. Render PDFs with the project's `assets/tools/pdf-render/render-pdf.cjs`, from the project root. Check one page and exact page dimensions; keep 300-DPI PNGs (guide 2550 x 3300, reference 2400 x 3000). Never use the historical WinRT PowerShell PDF renderers.
2. Inspect the final rendered guide and reference with the SVG render. Verify registration using an overlay/contact sheet or native-layer comparison, not dimensions alone. Inspect changed details at useful magnification.
3. Confirm the retained sequence, cumulative pictures, finished preview, required colors, no mixing language, simple spelling, readable text, intact logo, safe margins and no overlap. Verify the reference uses the intended final-stage pixels or the documented constrained edits.
4. Confirm the outline copy's hash equals the original and all three original production hashes remain unchanged. Confirm PDF/PNG revision agreement and exactly three files in `simplified/`. Save checks actually performed; distinguish prior review records from current results.
5. Promote verified alternates to `simplified/` without an extra approval step. If a concrete source/tool blocker prevents verification, keep clearly labeled candidates under `info/output/` and report the exact unresolved issue instead of replacing a usable edition.
6. Update the kit's `info/README.md` and relevant project index entry with the alternate paths, palette, sources and checks. Deliver links to the simplified files and briefly identify what was simplified.

## Existing example

For a working example, inspect `Cat in Pumpkin/info/tmp/simplified/plan.json`, `build.py`, and the associated revision checks from the project root. Its native eye-layer toggle is in `white-eye-layer.cjs`. Use these as references for layout, provenance and verification only: inspect dependencies and adapt paths, stages, colors and geometry for the selected kit. Never run a historical or example builder blindly over another kit.
