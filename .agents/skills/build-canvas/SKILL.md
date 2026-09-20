---
name: build-canvas
description: Build a complete River and Ridge canvas paint kit with 8 x 10 outline and color-reference images/PDFs plus a printable illustrated instruction guide. Use when asked to build a canvas kit or turn a subject folder into a full paint kit.
---

# Build Canvas

Turn the user's subject folder into a complete paint kit: an 8 x 10-inch outline for the preprinted canvas, a matching 8 x 10-inch finished painting reference, and a one-page illustrated US Letter portrait guide. Deliver each as a PDF and matching PNG. Use 8 x 10 portrait artwork by default unless the user specifies another size. Complete the work, including visual review, rather than stopping with a plan. Do not add packaging, sales copy, or other products unless requested.

## Locate the kit and its instructions

Read the project's current `AGENTS.md` and applicable folder instructions. They are the source of truth for preferences, branding, source preservation, and current reference guides. Locate the project from the active workspace, not a hardcoded absolute path.

Use the named folder. If the user says only "the new folder," inspect immediate subject folders and identify one with incoming artwork and no current guide. Exclude shared assets, hidden configuration, and temporary folders. If several candidates remain, ask which folder while inspecting their inventories; do not guess from modification time alone.

Inspect every candidate source image visually; arbitrary filenames do not identify their role. Inspect the current approved guide artwork identified by project instructions as the style reference. Skip browser profiles and caches when inventorying files. Use existing guides as design references, not as sources of another subject's palette or imagery.

## Organize the kit files

Keep all kit-specific work inside the subject folder. Use a readable subject slug for filenames:

- `<subject>-outline.png`
- `<subject>-finished-reference.png`
- `assets/` for generated illustration assets and seasonal logo variants
- `tmp/` for drafts, prompts, generation records, exports, and review notes
- `output/pdf/8x10/<subject>-painting-guide-8x10.pdf` and `.png` for the finished US Letter guide
- `output/pdf/8x10/<subject>-outline-8x10.pdf` and `.png` for the 8 x 10 transfer outline
- `output/pdf/8x10/<subject>-finished-reference-8x10.pdf` and `.png` for the 8 x 10 painting target

These six files are the default deliverable set. Keep convenient `<subject>-outline-8x10.png` and `<subject>-finished-reference-8x10.png` companion copies in the subject folder. Existing source artwork and earlier editions remain unchanged.

## Set the artwork size

### Composition check — required before production

The user has rejected files whose pixel dimensions were 8 x 10 but whose subject still looked square inside extra background. Treat this as a composition requirement, not an export setting. Recompose the actual subject and supporting objects vertically so the design reads as an 8 x 10 portrait even with the background hidden. Adding sky, ground, blank space or transparent margins around a square arrangement does not meet the request. Do not claim success based only on page dimensions or an edge-to-edge painted background.

Inspect the outline on transparency before coloring: the main subject and supporting details must occupy the portrait height naturally, with balanced modest margins. Also inspect the combined subject's bounding box and compare the arrangement to the old version; report measurements as evidence, not a substitute for visual judgment. Retain complete features and natural proportions. Adjust object placement and redesign appropriate features instead of globally stretching or arbitrarily cropping the picture.

If the user rejects the composition of an existing 8 x 10 outline, that correction authorizes a new geometry master. Archive the old edition, redesign the composition, and rebuild the matching color reference, all guide panels, root current aliases and output files together. Refresh a previously requested Desktop copy. An earlier test outline is not binding after the user explicitly rejects its layout. Keep the rejected outline as a source/archive, not as the current production master.

Export artwork PNGs at 2400 x 3000 pixels with 300-DPI metadata, and artwork PDFs at exactly 576 x 720 points (8 x 10 inches). Both outline and reference use the same placement and scale. The requested size describes the artwork composition itself: an 8 x 10 edition must be a genuine 4:5 portrait design, not a square picture placed on an 8 x 10 background. Adapt the arrangement naturally when the source has a different aspect ratio, preserving the recognizable subject and saving original artwork unchanged in an archive. Do not stretch the whole design or silently crop away important shapes. Use an explicitly supplied 8 x 10 outline as the geometry master when available. Use padded artwork only when the user explicitly requests preserving the source framing.

### Transfer line weight and audience

The current transfer standard supersedes the earlier black-line export preference. Use fine lines comparable to the approved Flowers in Vase outline: approximately **1.4 pt at the final 8 x 10-inch print size**. Use **medium-light neutral gray #A6A6A6** for adult kits. Fox Fall and Kat In Pumpkin (Cat in a Pumpkin) are children's kits and use **slightly darker neutral gray #808080**, at the same line weight. Do not silently turn either into an adult kit. Future children's kits should use this darker transfer treatment unless the user chooses otherwise.

These are starting production file settings, not a verified heat-transfer result. Do not claim they were physically press-tested. Keep small details readable; inspect endpoints, intersections, closed shapes, faces, leaves and ornaments after thinning. Prefer clean centerline vector paths with rounded joins/caps; simply changing a heavy line's color does not satisfy the thickness request. Preserve original bold sources and previous exports in each kit's archive. A linework-only revision keeps source geometry and existing references aligned unless recomposition is separately requested.

Export transfer-outline PNGs with the same gray lines on a transparent background, including transparent interiors and margins. Use alpha for antialiased edges; do not add a white or black background. Outline PDFs retain the same gray linework and placement on an unpainted page. White canvas previews in the guide are appropriate. Verify actual color, opacity and transparency from pixel data and on a checkerboard preview rather than trusting the viewer's background.

Provide each production transfer outline as a true SVG containing gray vector paths with no background shape or embedded raster image. Set its physical size to 8 x 10 inches and its viewBox to the actual 4:5 composition. Save it under `output/svg/8x10/`, keep a convenient root copy, and keep the matching outline PDF as vector paths. Matching PNGs are compatibility exports, not substitutes for the SVG. Update current outline aliases together after archiving previous versions. When requested, copy every current SVG into the user's Desktop `Canvas Kit Vector Outlines` folder and verify its hash; use the system's actual Desktop location, including OneDrive redirection.

The instruction sheet remains US Letter (612 x 792 points), even though its filename and folder identify the 8 x 10 kit. Use the exact 8 x 10 reference in its preview and flat-drying illustration, and show the matching canvas proportions in full-canvas stages. Tell the user to print artwork at Actual size / 100%. Record when paint texture has been resampled instead of generated at native print resolution.

When adapting an existing kit, retain its established title, lettering style, materials banner, numbering, caption treatment, decorations and footer. Change only the artwork placement, size references and instructions needed for that edition.

## Establish the source artwork

Rename positively identified arbitrary source names as directed by the project, without changing their image content. Do not overwrite existing canonical artwork. Keep supplied composites and earlier reference versions unchanged.

Choose the appropriate input route:

- **Outline and painting supplied:** treat the outline as the fixed geometry and the painting as the target. Preserve both. If their compositions differ materially, ask which design governs before generating dependent illustrations.
- **Painting only:** create a clean black-on-white companion outline following its shapes and placement, and verify the pair visually.
- **Outline only:** create an adult-beginner acrylic painting target that retains its geometry and subject. Derive the palette from the subject and any supplied direction.
- **Composite only:** retain the source composite; reconstruct a clean front-facing painting and companion outline. Record that these are generated reconstructions, not extracted standalone original production files.
- **No usable artwork or subject:** request the missing source or subject. Do not invent an unrelated kit.

Creating missing companion assets is part of a full-kit request. Do not pause for routine design choices. A requested style change to an existing painting must be saved as a separate reference version; record which version the guide follows.

Before building any guide panels, establish one **canonical geometry master** and lock its pixel dimensions. When both an outline and painting exist, align them once and record any unavoidable differences. When reconstructing from a painting or composite, create the finished reference and outline as a matched pair from the same master composition; do not generate them independently and then ask later panels to reconcile their differences. After the pair is accepted for the build, do not regenerate either one while making the instructions.

Use the available imagegen skill and image-generation tool when creating or editing raster artwork. Inspect references before edits and provide the actual outline and painting as image references. Use the PDF skill for PDF creation and verification. Read these skills when entering the relevant phase; do not assume their paths or tool interfaces remain unchanged.

## Plan the painting progression

Choose an approachable paint palette suited to this subject. Existing kits' seven- or eight-paint palettes are examples, not universal requirements. State the actual paint pots explicitly. Every other color named in directions must have a recipe using only those paints, written before its first use in that step.

Save an editable step plan in `tmp/` containing the materials, paint list, ordered headings and captions, and illustration brief for each step. For every stage, record what becomes painted, what was already painted, and what remains white. This makes premature coloring and missing operations checkable.

Start with the preprinted outline, not a sketching lesson. Sequence background, base coats, shadows, texture, highlights, drying, and cleanup appropriately. Include thin coats, rinsing and blotting brushes, and drying between relevant layers. Do not invent canvas dimensions or claim supplies are included.

Use twelve panels in a four-column by three-row grid when there are twelve useful stages, following project preferences. Do not pad with repetitive stages. Use distinct close-ups or visible brush actions for subtle finishing steps. The final illustration shows the completed painting lying flat to dry with closed paints and clean brushes.

Plan the stages as reusable layers or masks against the canonical geometry. Name the region or crop used by each step, not only the visual result. Validate one representative middle stage before producing every panel; this catches alignment and progression mistakes early.

## Preserve geometry with a layered panel workflow

Build instructional panels from the locked source assets instead of asking image generation to redraw the entire painting at every step.

- Use the exact outline as the common base for full-canvas stages. Keep every full-canvas panel at the canonical pixel dimensions and reuse the same line layer rather than tracing it again.
- Reveal or composite painted regions from the canonical finished reference with editable masks. Keep unrevealed regions white, and reapply the canonical black line layer above the paint when useful.
- Derive close-ups by cropping the canonical outline, staged panel, or finished reference. Add a brush or motion cue separately without redrawing the underlying subject.
- In the drying panel, place the exact finished-reference image onto the flat canvas; do not substitute a newly interpreted version of the painting.
- Use image generation for a missing companion reference, texture treatment, isolated brush/hand cues, or corrections that cannot be built deterministically. Do not use it to generate the complete handout, its typography, or twelve independent versions of the composition.

Exact pixel identity is not required for painterly texture, but the printed boundaries, major branches, facial/features, objects, and their positions must register to the canonical outline. Texture may cross or soften a line naturally only where it does not change what the customer is meant to paint.

## Build the illustrated guide

Follow the current project design direction: adult paint-night presentation, graceful title, readable captions, restrained accents, a small finished-painting preview, compact materials banner, numbered illustrations, and short practical directions. Derive seasonal colors and details from this subject.

Every full-canvas illustration must retain the outline's geometry. Unpainted regions remain white with printed lines until their step. Compare stages against the actual outline; a visually similar generated character is not enough. Correct inconsistent placement, missing objects, premature colors, or mismatched actions before export. If an image-generation correction drifts again, switch to the layered/cropped construction above instead of repeating whole-page generations.

Load the shared master logo from `assets/images/river-and-ridge-logo.png` at the project root. Preserve the original. Derive any recoloring from the actual current page and save the variant in the kit's assets. Preserve all lettering, ribbon silhouette, landscape arrangement, transparency, and aspect ratio. Place it comfortably in the top-right header. Apply only appropriate subtle seasonal details.

Compose the page in an editable deterministic layout such as HTML/CSS or another document source. Keep titles, materials, captions, step numbers, footer, and logo out of generated artwork so spelling and revisions do not require regenerating the page. Retain the step plan, masks/layers, generation prompts, and useful build sources in the kit folder. Reuse proven page measurements and exporter mechanics from an approved guide, but do not reuse a flattened raster page as the editable template. Replace subject-specific paths, colors, and copy, and verify page settings for this kit. Keep browser/export caches temporary and out of the deliverables.

## Verify and deliver

Run a fast preflight on a low-resolution page first: complete text, ordered steps, expected cumulative state, canonical geometry, and no overflow. Fix structural problems there before the print-resolution export. Then export a candidate PDF in `tmp/`, render it, and inspect the whole page and caption details. Confirm:

1. For new compositions and requested recompositions, inspect the actual outline without its painted background: the subject and supporting objects must read as portrait and naturally occupy the 8 x 10 height. A square arrangement with extra background fails even when export dimensions are correct. For a linework-only revision, preserve the existing geometry unless recomposition is requested and disclose any existing padded edition. Confirm guide PDFs are one US Letter page (612 by 792 points), artwork PDFs are one 8 x 10 page (576 by 720 points), and artwork PNGs are 2400 x 3000 with 300-DPI metadata. Transfer outlines use the audience-appropriate gray at the specified fine line weight, with transparent SVG/PNG backgrounds and interiors. Outline PDFs use matching gray vector paths.
2. All step numbers are present, ordered, and matched to their images and captions.
3. Each paint is listed or explicitly mixed from the listed paints; no generated wording silently adds a paint pot.
4. Geometry matches the outline, progression follows the stage plan, and the final artwork matches the selected reference.
5. Finishing illustrations teach distinct actions; drying shows the canvas lying flat.
6. Text is correctly spelled, readable at printed size, and separated from images, dividers, and footer.
7. The full logo remains recognizable and readable, with page-derived colors and appropriate seasonal details.
8. The guide PNG is rendered from the final guide PDF, including margins. Each artwork PDF/PNG pair contains the same latest composition, placement and colors. Verify actual PNG encoding, not merely `.png` filenames. Do not describe an upscaled raster as newly detailed high-resolution artwork.

For item 4, save a geometry-check contact sheet or difference overlay in `tmp/`. Full-canvas stages pass when they retain the canonical dimensions and exact reused line layer; close-ups pass when their crop can be mapped back to the canonical image. This replaces subjective judgments about whether a redraw is "close enough."

Correct problems and rerender before delivery. Apply the project's complete final-review checklist as well. Record checks actually performed and any remaining limitations in `tmp/`; do not copy a previous kit's verification claims.

For a full-kit request, the expected result is all six production files in `output/pdf/8x10/`, not a draft awaiting routine approval. Do not stop after the first generated-art mismatch: repair the affected panels, rebuild them from canonical layers/crops, and rerun verification. Once checks pass, place the guide, outline and reference PDFs/PNGs under the canonical filenames in `output/pdf/8x10/`; no extra approval step is needed.

Use draft status only for a concrete unresolved blocker such as incompatible supplied source geometry, missing essential source artwork, or a tool failure that prevents a deterministic rebuild. Aesthetic variation alone is not a blocker. Keep blocked drafts in `tmp/` by default. Put a clearly suffixed `-draft` copy in `output/pdf/` only when the user explicitly asks for a printable draft, and state the exact failed production gate and the next corrective action.

Update the project `AGENTS.md` with a concise kit-specific section identifying sources, the current target, palette, and final paths. Add reusable preferences only when the user has expressed them; do not elevate one kit's design choices into project-wide rules.

Finish with links to the guide PDF, matching image, and newly created companion references. Briefly state the palette, verification outcome, and any reconstruction or fidelity limitations.
