---
name: build-canvas
description: Build a complete River and Ridge canvas paint kit from artwork in a new project folder, including missing companion references and a printable illustrated instruction guide. Use when asked to build a canvas kit or turn a new subject folder into a full paint kit.
---

# Build Canvas

Turn the user's subject folder into a complete paint kit: a clean outline for the preprinted canvas, a finished painting reference, and a one-page illustrated US Letter portrait guide delivered as a PDF and matching image. Complete the work, including visual review, rather than stopping with a plan. Do not add packaging, sales copy, or other products unless requested.

## Locate the kit and its instructions

Read the project's current `AGENTS.md` and applicable folder instructions. They are the source of truth for preferences, branding, source preservation, and current reference guides. Locate the project from the active workspace, not a hardcoded absolute path.

Use the named folder. If the user says only "the new folder," inspect immediate subject folders and identify one with incoming artwork and no current guide. Exclude shared assets, hidden configuration, and temporary folders. If several candidates remain, ask which folder while inspecting their inventories; do not guess from modification time alone.

Inspect every candidate source image visually; arbitrary filenames do not identify their role. Inspect the current approved guide artwork identified by project instructions as the style reference. Skip browser profiles and caches when inventorying files. Use existing guides as design references, not as sources of another subject's palette or imagery.

## Establish the source artwork

Keep all kit-specific work inside the subject folder. Use a readable subject slug for filenames:

- `<subject>-outline.png`
- `<subject>-finished-reference.png`
- `assets/` for generated illustration assets and seasonal logo variants
- `tmp/` for drafts, prompts, generation records, exports, and review notes
- `output/pdf/<subject>-painting-guide-illustrated.pdf` and `.png` for the finished guide

Rename positively identified arbitrary source names as directed by the project, without changing their image content. Do not overwrite existing canonical artwork. Keep supplied composites and earlier reference versions unchanged.

Choose the appropriate input route:

- **Outline and painting supplied:** treat the outline as the fixed geometry and the painting as the target. Preserve both. If their compositions differ materially, ask which design governs before generating dependent illustrations.
- **Painting only:** create a clean black-on-white companion outline following its shapes and placement, and verify the pair visually.
- **Outline only:** create an adult-beginner acrylic painting target that retains its geometry and subject. Derive the palette from the subject and any supplied direction.
- **Composite only:** retain the source composite; reconstruct a clean front-facing painting and companion outline. Record that these are generated reconstructions, not extracted standalone original production files.
- **No usable artwork or subject:** request the missing source or subject. Do not invent an unrelated kit.

Creating missing companion assets is part of a full-kit request. Do not pause for routine design choices. A requested style change to an existing painting must be saved as a separate reference version; record which version the guide follows.

Use the available imagegen skill and image-generation tool when creating or editing raster artwork. Inspect references before edits and provide the actual outline and painting as image references. Use the PDF skill for PDF creation and verification. Read these skills when entering the relevant phase; do not assume their paths or tool interfaces remain unchanged.

## Plan the painting progression

Choose an approachable paint palette suited to this subject. Existing kits' seven- or eight-paint palettes are examples, not universal requirements. State the actual paint pots explicitly. Every other color named in directions must have a recipe using only those paints, written before its first use in that step.

Save an editable step plan in `tmp/` containing the materials, paint list, ordered headings and captions, and illustration brief for each step. For every stage, record what becomes painted, what was already painted, and what remains white. This makes premature coloring and missing operations checkable.

Start with the preprinted outline, not a sketching lesson. Sequence background, base coats, shadows, texture, highlights, drying, and cleanup appropriately. Include thin coats, rinsing and blotting brushes, and drying between relevant layers. Do not invent canvas dimensions or claim supplies are included.

Use twelve panels in a four-column by three-row grid when there are twelve useful stages, following project preferences. Do not pad with repetitive stages. Use distinct close-ups or visible brush actions for subtle finishing steps. The final illustration shows the completed painting lying flat to dry with closed paints and clean brushes.

## Build the illustrated guide

Follow the current project design direction: adult paint-night presentation, graceful title, readable captions, restrained accents, a small finished-painting preview, compact materials banner, numbered illustrations, and short practical directions. Derive seasonal colors and details from this subject.

Every full-canvas illustration must retain the outline's geometry. Unpainted regions remain white with printed lines until their step. Compare stages against the actual outline; a visually similar generated character is not enough. Correct inconsistent placement, missing objects, premature colors, or mismatched actions before export. If exact agreement cannot be achieved, report the specific limitation and keep the affected result a draft rather than claiming it is production-ready.

Load the shared master logo from `assets/images/river-and-ridge-logo.png` at the project root. Preserve the original. Derive any recoloring from the actual current page and save the variant in the kit's assets. Preserve all lettering, ribbon silhouette, landscape arrangement, transparency, and aspect ratio. Place it comfortably in the top-right header. Apply only appropriate subtle seasonal details.

Keep captions editable in the saved step plan even when the page is generated as raster artwork. Review generated lettering against that plan word for word. Retain generation prompts and useful build sources in the kit folder. Reuse an existing exporter only after verifying its input paths and page settings for this kit.

## Verify and deliver

Export a draft PDF in `tmp/`, render it, and inspect the whole page and caption details. Confirm:

1. Exactly one US Letter portrait page (612 by 792 points), with safe margins and no clipping.
2. All step numbers are present, ordered, and matched to their images and captions.
3. Each paint is listed or explicitly mixed from the listed paints; no generated wording silently adds a paint pot.
4. Geometry matches the outline, progression follows the stage plan, and the final artwork matches the selected reference.
5. Finishing illustrations teach distinct actions; drying shows the canvas lying flat.
6. Text is correctly spelled, readable at printed size, and separated from images, dividers, and footer.
7. The full logo remains recognizable and readable, with page-derived colors and appropriate seasonal details.
8. The matching PNG is rendered from the final PDF, including margins. Verify its actual file encoding is PNG, not merely a `.png` filename. Do not describe an upscaled raster as newly detailed high-resolution artwork.

Correct problems and rerender before delivery. Apply the project's complete final-review checklist as well. Record checks actually performed and any remaining limitations in `tmp/`; do not copy a previous kit's verification claims.

Once checks pass, place the completed PDF and matching PNG in `output/pdf/`. The user's build request authorizes completing these files without another routine approval step. Keep failed or unresolved versions in `tmp/` and explain any blocker accurately.

Update the project `AGENTS.md` with a concise kit-specific section identifying sources, the current target, palette, and final paths. Add reusable preferences only when the user has expressed them; do not elevate one kit's design choices into project-wide rules.

Finish with links to the guide PDF, matching image, and newly created companion references. Briefly state the palette, verification outcome, and any reconstruction or fidelity limitations.
