# Historical kit notes — superseded paths

Snapshot before the September 20, 2026 organization. Current production paths and rules are in AGENTS.md and canvas-kits.md. Old kit assets/, tmp/, output/, and test/ paths now start with info/. Old root companion images and notes are in info/archive/previous-root-files/. The unhyphenated Sunflower folder is archived in Starry-night Sunflower/info/archive/original-square-kit/. Do not use historical filenames to choose production editions.

# Paint Kit Instruction Guide Preferences

Apply these preferences when creating or revising paint kit instruction sheets in this project. Carry them forward to new subjects unless the user requests a change. These preferences reflect the user's review of the Christmas gnome guide and the request to make the Halloween kit more adult-focused.

## Project layout

- For requests to build a full canvas kit from a new subject folder, use the project skill at `.agents/skills/build-canvas/SKILL.md` (`$build-canvas`). It covers source inspection, missing companion artwork, illustrated instructions, export and visual review. Read this file for current preferences when running the skill.

- This folder (`Canvas Kits`) is the project root. Project-wide notes and preference files (`.md`) live here.
- Each canvas kit lives in its own subfolder named after the subject, for example `Gnome Christmas Tree/`. Put a kit's reference images, `assets/`, `output/` and `tmp/` inside its own folder.
- Shared images used by every kit (the brand logo, any future common graphics) live in `assets/images/` at the project root. Load them from there rather than copying them into each kit.
- When starting a new kit, create a new subfolder; do not put kit files at the project root.

## How a kit is produced (workflow)

Every kit follows the same pipeline. Understand these three pieces before doing any work on a kit:

1. **Outline (the preprinted canvas).** A fine gray line-art drawing transferred onto the blank canvas before the customer receives the kit. Production transfers use true SVG paths on transparency; white backgrounds are only for previews. The current standard is 2 pt (about 0.706 mm) at 8 x 10 inches, gray #A6A6A6 for adults and darker #808080 for the children's Fox Fall and Cat in Pumpkin kits. Earlier black source art is preserved in archives. In the Gnome Christmas Tree kit the current PNG alias is `Gnome Christmas Tree/gnome-christmas-tree-outline.png`.
2. **Finished reference (the goal).** A full-color painting of the same design, showing what the customer should try to create by painting inside the printed outline. In the Gnome Christmas Tree kit this is `Gnome Christmas Tree/gnome-christmas-tree-finished-reference.png`.
3. **Instructions (the `output/` folder).** The one-page illustrated instruction sheet that teaches the customer how to get from the outline to the finished reference, step by step. This is what we produce. It is saved as a PDF plus a matching image under the kit's `output/pdf/` folder.

Rules that follow from this pipeline:

- The outline and finished reference are the inputs. Never modify them; they define the design the customer already has on the canvas and the result they are aiming for.
- Every step illustration in the instructions must match the outline's shapes and placement exactly, because those lines are already on the customer's canvas.
- The final step of the instructions should arrive at the finished reference, and the reference is the image shown near the title as the finished-painting preview.
- Always move exported draft guides (PDF plus matching image) into the kit's `output/pdf/` folder, even when review finds unresolved issues. Use clearly labeled `-draft` filenames and retain the draft status and review notes; output placement does not imply production approval. Keep intermediate artwork, generation attempts, scripts, prompts and review notes in `tmp/`. This preference overrides any skill instruction to leave unresolved draft deliverables in `tmp/`.
- Kit source files often arrive with arbitrary numbered names (for example `46.png`, `47.png`). Open each image to confirm which one is the outline and which is the finished reference, then rename them to `<subject>-outline.png` and `<subject>-finished-reference.png` inside the kit folder before starting work.

## Purpose and deliverables

- Create a finished one-page instruction sheet to package with a preprinted canvas paint kit.
- Write for an adult beginner using acrylic paints. Default future projects to an adult paint-night audience unless the user requests a different audience.
- Deliver a printable US Letter portrait PDF with safe print margins. Keep a matching image version in the project.
- Keep original source artwork unchanged. The latest approved guide is the visual starting point for future guides.
- Save final deliverables under the kit's `output/pdf/` folder using clear subject-based filenames.
- Treat a full canvas-kit request as authorization to finish and promote the verified guide to `output/pdf/`; do not stop at draft quality for routine generated-art drift. Rebuild mismatched panels from the canonical outline/reference using masks, layers or crops. Use draft status only for a concrete unresolved source or tool blocker, and identify the failed production gate.

## Visual direction

- Follow the illustrated paint-night handout style, rather than a mostly text-based document.
- Use a graceful handwritten-style title, readable navy or dark neutral lettering, a white background and restrained pale blue or blue-gray watercolor accents. Pair the title with clean, highly legible serif or sans-serif captions rather than childlike handwriting throughout.
- Include a small finished-painting reference near the title and a compact materials banner.
- Use numbered picture panels with short headings and brief directions beneath each image.
- The current guide uses twelve panels in a four-column by three-row grid. Use this as the default when the subject supports twelve useful steps; do not invent repetitive steps just to fill the grid.
- Keep decorative motifs sparse and appropriate to the subject. Do not automatically carry the Christmas guide's hearts, snowflakes or playful doodles into future guides.
- Keep captions readable at actual printed page size, with space between text, pictures, dividers and the footer.

## Adult audience direction (applies to future kits)

- Keep the original subject, character and concept recognizable when making a kit more mature. The user specifically wants to retain the gnome and Halloween concept, not replace them to reach an older audience.
- Aim for an artisan adult paint-night handout and artwork suitable for seasonal home decor: a restrained palette, natural shading, visible acrylic brush texture and thoughtful highlights.
- Avoid a children's coloring-sheet or classroom look in adult finished paintings and guides: overly bright colors, heavy cartoon borders, bubbly typography, oversized playful icons and abundant cute doodles. The preprinted transfer needs clear fine gray lines. Fox Fall and Cat in Pumpkin are specifically children's kits; retain their child-friendly direction and use their darker gray transfer setting.
- Use adult, practical language and short technique-focused headings. Explain mixing, layering, brush direction, blending, shadows and highlights clearly without assuming prior painting experience.
- A more mature audience does not automatically mean a harder project. Keep the process approachable, the steps useful and the paint recipes explicit.
- Derive the palette and seasonal details from each new subject. Do not reuse the Halloween kit's moody palette automatically for unrelated subjects.
- Preserve supplied source artwork and outline geometry. Save a revised finished-reference treatment as a separate version when the user requests a style change; identify which reference the current guide follows.

## Branding

- Use the user's River and Ridge Paint-Your-Own logo in the top-right header area in place of the generic Relax Paint Create decoration.
- The reusable master logo file is `assets/images/river-and-ridge-logo.png` at the project root. Reference it from there for every kit; a kit's own `assets/` folder only holds that kit's recolored or seasonal variants.
- Preserve the complete logo, exact lettering, ribbon silhouette, landscape arrangement, transparent background and wide aspect ratio. Do not crop, stretch or distort it.
- Always adapt the logo colors to the actual page while retaining its recognizable design. Inspect the finished page and derive the logo palette from its title lettering, backgrounds, accents and artwork. Do not prescribe fixed color names or reuse a previous guide's palette automatically.
- Use the page's darker tones for readable logo lettering and outlines, lighter tones for the ribbon, and complementary colors already present on the page for the landscape. When prompting an image edit, provide the page as the color reference and ask it to derive the colors directly from that page.
- Match subtle seasonal details to the page's theme. For a snowy winter page, add light snow to the logo's tree branches and tips while leaving foliage visible. For other themes, use only appropriate subtle details; do not automatically carry snow into every guide.
- Keep the original supplied logo file unchanged as the master. Seasonal recoloring should preserve the brand's overall look rather than redesigning the logo.
- Size the logo to fit comfortably without overlapping the title, subtitle or materials banner.
- Retain this branding placement in future guides unless the user requests a change.

## Paint colors and mixing instructions

- Choose each new kit's paint palette to suit its artwork and beginner-friendly techniques. Future kits do not have to use the same paint colors or number of paints as earlier kits; dedicated colors may simplify mixing. The seven-color lists below are specific to their existing kits.
- Check every color named in every instruction against the materials list.
- Each paint color must either be listed as a required paint or have an explicit mixing recipe using only listed paints.
- Put each recipe directly in the step that needs it. Do not assume a beginner knows how to make peach, pale blue, gray or lighter green.
- Explain the mixture before asking the painter to use the resulting shade.
- Do not silently add extra paint pots to solve a wording mismatch. Keep directions consistent with the intended kit palette.
- For the current gnome kit, the seven paint colors are white, black, red, yellow, blue, green and brown.
- Current mixtures: peach uses white, a little yellow and a tiny touch of red; pale blue uses white and a touch of blue; beard shading uses white, a touch of blue and a speck of black; hat shadows use red and a little brown; tree highlights use green and a little yellow.
- Recheck the rendered artwork as well as the written prompt: generated text can introduce errors or omit parts of a recipe.

## Step illustrations

- Keep clear petal separations in floral line drawings, but blend those transitions in the finished color painting. Use soft tonal shading rather than dark traced seams between painted petals.

- Each image must teach the action described in its caption.
- Keep the subject's shape, placement and recognizable details consistent with the supplied outline and finished reference.
- Show a clear progression for the main painting stages. Unpainted regions remain white with printed outlines until their painting step.
- Avoid repeating the same nearly finished image across several steps with only different captions. The user specifically requested distinct pictures for steps 9 through 12.
- Use close-ups, visible brush actions or a different useful view when a change would otherwise be too subtle to see.
- For the current guide, step 9 shows a close-up of tree ornaments and a brush adding a shine dot; step 10 shows the lower beard, shoes and snow with a brush adding highlights; step 11 shows a close-up of the hat with a fine brush adding snow dots; step 12 shows the completed canvas lying flat to dry with closed paint pots and clean brushes nearby.
- A drying instruction should show the canvas lying flat, not standing on an easel.
- Do not show features painted before their corresponding step. For example, shoes remain white until the nose-and-shoes step.

## Instruction content

- Start with the supplied preprinted outline. Do not instruct the customer to sketch the whole design again.
- List the canvas, acrylic paints, large and small brushes, water cup, paper towels and a palette or paper plate as materials. Do not claim these are all included unless the kit contents are confirmed.
- Do not invent canvas dimensions or copy a size from a style reference.
- Use short, practical instructions describing where to paint, which listed colors to use and how to apply them.
- Include thin-coat guidance, rinsing and blotting brushes, drying between layers where needed, and cleanup.
- Keep optional decorative details clearly optional.

## Final review

Before delivering a guide, check all of the following:

1. The PDF contains exactly one page and has been rendered and visually inspected.
2. Every color in the captions is listed or explicitly mixed from listed paints.
3. All text is spelled correctly and matches the intended instructions, including text generated inside images.
4. The step numbers are complete and in order; each caption matches its picture.
5. Final-stage illustrations are visibly distinct and useful rather than repeated finished paintings.
6. Captions have comfortable spacing and do not overlap pictures, dividers or the footer.
7. The PDF and matching image contain the same latest revision.
8. The logo colors come from the current page, its lettering remains readable, and any seasonal details suit the page without changing the logo's recognizable design.

## Current reference files (Gnome Christmas Tree kit)

- `Gnome Christmas Tree/gnome-christmas-tree-finished-reference.png`: finished gnome color reference. This is the goal image, the example of what the customer should try to create.
- `Gnome Christmas Tree/gnome-christmas-tree-outline.png`: gnome line outline. This is the first frame of the project and is transferred onto the canvas before the customer receives the kit.
- `.hivemind/attachments/1123f095-4c06-4b38-8e69-b52152a2cb0b.png`: user's preferred illustrated handout style.
- `assets/images/river-and-ridge-logo.png`: user's supplied brand logo (project-wide master). `Gnome Christmas Tree/assets/river-and-ridge-logo.png` is the Gnome Christmas Tree kit's local copy.
- `Gnome Christmas Tree/output/pdf/gnome-christmas-tree-painting-guide-illustrated.pdf`: current printable guide, the instructions for painting from the outline to the finished reference.
- `Gnome Christmas Tree/output/pdf/gnome-christmas-tree-painting-guide-illustrated.png`: matching image.

## Current reference files and direction (Gnome Halloween kit)

- `Gnome Halloween/gnome-halloween-outline.png`: unchanged preprinted design.
- `Gnome Halloween/gnome-halloween-finished-reference-adult.png`: current adult-focused painting target. The original `gnome-halloween-finished-reference.png` is retained as the earlier version.
- `Gnome Halloween/output/pdf/gnome-halloween-painting-guide-illustrated.pdf`: current printable guide, with a matching PNG in the same folder.
- This kit retains the gnome, witch hat, two pumpkins, crescent moon and bats. Its mature treatment uses a smoky blue-gray sky, plum clothing, russet pumpkins, muted stems and buckle, ivory highlights and textured acrylic brushwork. These colors are specific to this painting, not a mandatory palette for future kits.
- This kit uses the same seven paints: white, black, red, yellow, blue, green and brown. Follow the current guide's recipes; do not copy the Christmas kit's mixtures into this version.

## Current reference files and direction (Gnome Fall kit)

- `Gnome Fall/gnome-fall-source-composite.png`: unchanged copy of the supplied `halloween gnome 3.png` attachment, showing a painting and an overlapping tilted outline.
- `Gnome Fall/gnome-fall-finished-reference.png`: clean reconstructed painting reference based on that composite.
- `Gnome Fall/gnome-fall-outline.png`: clean line-art companion generated from the reconstructed painting. These are newly created kit assets, not original standalone production artwork extracted from the composite.
- `Gnome Fall/output/pdf/gnome-fall-painting-guide-illustrated.pdf`: one-page US Letter guide; the matching PNG in the same folder is rendered directly from this PDF.
- The fall composition includes a curling rust hat, ivory beard, green sleeves, a held maple leaf, three pumpkins, autumn branches and two glowing lanterns against a teal sky.
- This kit uses eight paints: white, black, red, yellow, teal, green, brown and orange. Dedicated teal and orange paints simplify the background and pumpkin steps. Recipes are written directly in each relevant step.
- Generated artwork and prompts are retained in the kit's `assets/` and `tmp/pdfs/` folders. The source composite and project-wide master logo remain unchanged.

## Current reference files and status (Fall View kit)

- `Fall View/fall-view-source-composite.png`: unchanged copy of `Screenshot 2026-09-16 220212.png`, showing an autumn mountain sunset painting and partly hidden outline.
- `Fall View/fall-view-finished-reference.png` and `Fall View/fall-view-outline.png`: generated clean companion reconstructions, not extracted original standalone production artwork.
- Palette: white, black, red, yellow, blue, green, brown and orange. The painting features a sunset, layered blue ridges, dark conifer slopes, a right-side autumn tree and foreground rock ledges.
- `Fall View/tmp/pdfs/fall-view-painting-guide-illustrated-draft.pdf` and matching PNG: reviewed one-page US Letter draft with twelve panels. Progression and text have been checked, but generated leaf clusters and some branch/forest contours differ from the canonical outline; exact registration remains unresolved. Keep this guide labeled as a draft in `output/pdf/` until the contour differences are corrected; its location does not imply production approval.
- At the user's request, clearly labeled draft PDF and PNG copies are also available in `Fall View/output/pdf/` as `fall-view-painting-guide-illustrated-draft.pdf` and `.png`. This placement does not change their draft status or resolve the contour differences described above.
- Editable steps, generation prompts, exporter, renderer and verification notes are retained under `Fall View/tmp/`. Source composite and shared master logo are unchanged.

## Current reference files and status (Starry Night Sunflower kit)

- `Starry night sunflower/starry-night-sunflower-source-composite.png`: unchanged copy of supplied `Screenshot 2026-09-16 223534.png`.
- `Starry night sunflower/starry-night-sunflower-finished-reference.png` and `starry-night-sunflower-outline.png`: generated companion reconstructions, not extracted standalone original production artwork.
- Composition: two nodding golden sunflowers, curling green stems and leaves, swirling blue night sky and pale yellow star lights.
- Seven paints: white, black, blue, yellow, orange, green and brown.
- `Starry night sunflower/output/pdf/starry-night-sunflower-painting-guide-illustrated-draft.pdf` and matching PNG: one-page US Letter twelve-panel draft, rendered and visually inspected. Caption recipes checked; seed-stippling sequence corrected. Exact petal, leaf and sky contour registration remains unresolved, and some foliage highlights appear early. The PDF and matching PNG are in `output/pdf/` at the user's request and remain drafts until corrected.
- Editable plan, built-in imagegen prompts, corrections, export/render scripts and review notes remain under the kit's `tmp/`; generated guide artwork is in its `assets/`. Source screenshot and shared master logo remain unchanged.

## Earlier reference files and direction (Flowers in Vase square edition, superseded September 19, 2026)

- Historical notes for the original 1254 x 1254 square edition. The current kit is the corrected full portrait edition described later in this file; these notes are retained for the archived square sources.
- `Flowers in Vase/flowers-in-vase-source-photo.png`: unchanged copy of `Screenshot 2026-09-18 184331.png`, a photograph of a textured floral painting.
- User requested smoother, more rounded and precise lines for this kit. The reconstructed design retains the bouquet, turquoise background, hanging berries and striped vase, with rounded petals and clean curved vase bands.
- `Flowers in Vase/flowers-in-vase-outline.png`: canonical 1254 x 1254 outline. `Flowers in Vase/flowers-in-vase-finished-reference.png`: matching painted target. These are new companion reconstructions, not extracted original standalone production artwork. Generated paint textures were registered to the outline masks before final instruction panels were built; the unregistered generated treatment is retained in the kit's `assets/`.
- Nine paints: white, black, turquoise, blue, green, rose red, yellow, orange and brown. Recipes are included in the relevant captions.
- Current target: `Flowers in Vase/flowers-in-vase-finished-reference-blended.png`. At the user's request, petals have soft blended transitions instead of dark internal seams; the separate petal shapes in `flowers-in-vase-outline.png` remain unchanged. The earlier color reference is retained. The guide preview, finishing panel and final canvas now follow the blended reference, with wet-edge feathering instructions in step 9.
- `Flowers in Vase/output/pdf/flowers-in-vase-painting-guide-illustrated.pdf` and `.png`: one-page US Letter twelve-panel guide; PNG rendered from the PDF. Full stages share the exact outline, final detail panels use mapped crops, and the completed canvas lies flat for drying.
- Editable masks, stage plan, prompts, layout/export/render sources and review notes are retained in `Flowers in Vase/tmp/`; illustration stages and the page-colored logo are in `assets/`. Original photograph and project-wide master logo remain unchanged.

## Color continuity and 8 x 10 artwork

- **Subject composition, not just file size:** The user again rejected Gnome Halloween because the design still appeared square inside an 8 x 10 background. All future 8 x 10 builds must read as portrait when viewed as black outlines on transparency, with the subject and supporting objects using the portrait height naturally. Extra sky, ground, white space or transparent margins do not turn a square arrangement into an acceptable 8 x 10 design. Review the outline and subject bounds before coloring; page-size checks alone cannot pass this requirement.
- A specific user rejection of the layout authorizes replacing the earlier geometry master. Preserve that source and superseded deliverables in an archive, then update the outline, color reference, guide stages, current root aliases, final exports and any requested Desktop copies together. Keep natural proportions and complete features; recompose rather than globally stretch or arbitrarily crop. Do not continue treating a rejected test outline as fixed geometry.

- New full canvas-kit requests default to an 8 x 10 portrait outline and matching finished reference, each in PDF and PNG, plus a one-page US Letter guide PDF and matching PNG. Save all six under the kit's `output/pdf/8x10/` unless the user requests another size or narrower scope. This default is also recorded in the build-canvas skill.
- The artwork itself must compose the requested 8 x 10 portrait canvas. The user rejected a square painting merely centered on an 8 x 10 background. For new or explicitly rebuilt editions, create a genuine 4:5 composition and update the outline, reference and guide together; retain the original art in an archive. Do not stretch the whole square or quietly remove important objects. Padded source framing is appropriate only when explicitly requested. This correction was applied to Flowers in Vase; it does not retrospectively rebuild other kits.

- Review existing canvas-kit paintings when choosing new colors, and use similar oranges, ivory, greens, browns and seasonal accents where they suit the subject. Preserve the supplied subject and any specific color example.
- Incoming outline images define the geometry transferred to the customer's canvas. Keep their shapes and proportions when creating colored targets and instructional stages. Current transfer SVGs/PNGs use fine gray lines on transparent backgrounds, including interiors and margins: #A6A6A6 for adults, #808080 for Fox Fall and Cat in Pumpkin, 2 pt at actual 8 x 10 size. Outline PDFs print matching gray vector paths. White backgrounds are appropriate for guide previews. Preserve original incoming files and superseded bold exports in archives.
- For these 8 x 10 kits, artwork PDFs are exactly 576 x 720 points; artwork PNGs are 2400 x 3000 at 300 DPI. Guide sheets remain one-page US Letter, with a matching PNG rendered from the final PDF. Print artwork at Actual size / 100%.

## Fox Fall, Ghost Fall, Cat in Pumpkin, and pumpkin (September 19, 2026)

- All four folders were recreated after disappearing from the workspace. Original incoming PNGs were recovered byte-for-byte from this conversation's saved image data and checked against their earlier SHA-256 hashes; they are not reconstructed drawings.
- Original sources remain `Fox Fall/download.png`, `Ghost Fall/exec-8b4604c1-f90d-4ddd-959b-56e4dd2b270f.png`, `Cat in Pumpkin/exec-01c35205-b359-4887-a7f9-a31e173a5e1f.png`, and `pumpkin/exec-dd3ad511-2377-40d8-bb15-dd9d9771fcbc.png`.
- Slugs are `fox-fall`, `ghost-fall`, `cat-in-pumpkin`, and `pumpkin`. Each folder has a clean `<slug>-outline.png`, the earlier generated square `<slug>-finished-reference.png`, and current `<slug>-outline-8x10.png` / `<slug>-finished-reference-8x10.png` companions. Use the 8 x 10 reference for the current guide. It has been fitted to the canonical outline using masks; the earlier square reference remains unchanged.
- Each `output/pdf/8x10/` contains six deliverables: `<slug>-painting-guide-8x10.pdf` and PNG, `<slug>-outline-8x10.pdf` and PNG, and `<slug>-finished-reference-8x10.pdf` and PNG. The square composition is centered proportionally on the portrait artwork page, without stretching or cropping; white space is intentional.
- Fox Fall / Autumn Fox: orange fur, ivory markings, green/gold scarf and autumn leaves. Six paints: white, black, yellow, orange, green, brown. Twelve stages.
- Ghost Fall / Autumn Ghost: ivory body, blue-gray fold shadows, plum bow, orange pumpkin. Eight paints: white, black, red, yellow, blue, green, brown, orange. Twelve stages.
- Cat in Pumpkin / Cat in a Pumpkin: charcoal/blue-gray kitten, rose details, gold eyes and orange jack-o-lantern. Seven paints: white, black, red, yellow, blue, brown, orange. Twelve stages.
- pumpkin / Autumn Pumpkin: orange/russet pumpkin, dark carved face, olive/brown stem. Six paints: white, black, yellow, green, brown, orange. Eight useful stages in a four-column, two-row grid.
- These guides use editable navy calligraphic titles, serif captions, pale blue materials banners, numbered picture panels, distinct finishing close-ups, and flat drying scenes. The seasonal logo is derived from the shared master, with colors taken from the actual page; its variant lives in each kit's `assets/8x10/`.
- Shared build and recovery scripts live in `Fox Fall/tmp/`. Each kit's `tmp/8x10-artwork/` retains canonical images, masks, stage plan, HTML, geometry checks, PDF checks, and visual verification notes. `new-autumn-kits-8x10.md` links to the deliverables.
- Transparency correction: each root `<slug>-outline.png`, root `<slug>-outline-8x10.png`, and output outline PNG now uses black RGB linework with a transparent background/interiors. The output outline PDFs use the matching alpha mask on an unpainted 8 x 10 page. The old opaque exports are backed up under `tmp/8x10-artwork/before-transparency/`; original incoming artwork and guide/painting files are unchanged. Rebuild with `Fox Fall/tmp/transparent-outlines.ps1` followed by `transparent-outline-pdfs.cjs`. Both standard artwork exporters include these finishing steps.
- Vector upload editions: after the sublimation website rated the PNGs only "good," the user requested true vector versions of these four outlines. Each kit now has `output/svg/8x10/<slug>-outline-8x10.svg` and a root copy. These contain black filled Bezier paths with transparent backgrounds, no embedded raster, and physical dimensions of 8 x 10 inches. Copies are in the user's Desktop `Canvas Kit Vector Outlines` folder. These are the preferred uploads when the website accepts SVG; do not claim a particular website's quality rating without checking its requirements.
- The vectors were traced from unchanged `tmp/8x10-artwork/canonical-outline.png` masters using Potrace, rendered, and compared at native dimensions. Saved edge comparisons and checkerboard reviews are in each kit's `tmp/vector/`. The renderer reports 96.7-97.8% black-mask overlap, with 0-3 discrepant pixels beyond a one-pixel native edge neighborhood; traced antialiasing is not pixel-identical to the raster. Small openings and complete contours were visually inspected. Builder and delivery manifest: `Fox Fall/tmp/vector-tools/`.
- Optional `<slug>-outline-8x10-600dpi.png` copies are now rendered from the vector at 4800 x 6000, 600 DPI. They supersede the intermediate raster enlargements. These are compatibility exports; the SVG itself is resolution-independent. The smaller root transparent PNG conversion now clones pixels directly before setting DPI to avoid physical-size scaling during conversion.

## Flowers in Vase: corrected full portrait edition (September 19, 2026)

- The user rejected the earlier square artwork placed on a portrait page and explicitly requested rebuilding this entire kit as actual 8 x 10 artwork. The current version is a newly composed 4:5 painting with a taller striped vase, four round flowers, golden buds, descending foliage and six berries. Artwork reaches every canvas edge with no added blank bands or square frame.
- The original square outline and blended painting are preserved byte-for-byte in `Flowers in Vase/assets/original-square/`. Earlier guides, padded exports and root companions are archived under `tmp/portrait-rebuild/previous-edition/`. Earlier `tmp/8x10/` and `tmp/vector/` builders are superseded; use `tmp/portrait-rebuild/` for the current kit.
- Current geometry: `assets/portrait-rebuild/outline-canonical-white.png`, 1120 x 1400, traced into the true SVG. Current painting: `assets/portrait-rebuild/finished-reference-canonical.png`, registered to its closed region masks. Generated portrait inputs and both prompts are retained. This recomposition was authorized by the user's size correction.
- Root `flowers-in-vase-outline.png` and `flowers-in-vase-outline-8x10.png` are current transparent black-line PNGs. Root `flowers-in-vase-finished-reference.png` and `flowers-in-vase-finished-reference-8x10.png` are the current painting. These current aliases replace the old working paths; original source bytes remain in the archive above.
- Current SVG: `output/svg/8x10/flowers-in-vase-outline-8x10.svg`, plus a root copy and updated Desktop copy. It has black paths, no background rectangle, no embedded image, physical size 8in by 10in, and viewBox 0 0 1120 1400. The outline PDF also contains genuine vector paths. Outline PNGs use transparency, 2400 x 3000 at 300 DPI; optional 600-DPI copies are 4800 x 6000.
- Current PDFs and matching PNGs are under `output/pdf/8x10/`, with the same subject-based filenames. Artwork PDFs are exactly 576 x 720 points; the guide remains one-page US Letter. The familiar `output/pdf/flowers-in-vase-painting-guide-illustrated.pdf` and PNG now also show this corrected edition.
- Nine paints remain white, black, turquoise, blue, green, rose red, yellow, orange and brown. Twelve stages retain the existing Flowers title, caption fonts, logo, banner, numbers, dividers and footer. Exact outline masks control progression; berries remain unpainted until step 11. Steps 9-11 use distinct finishing crops, and step 12 shows the current painting lying flat.
- `tmp/portrait-rebuild/` holds the current builders, region overrides, masks, captions, prompts, stage checks, PDF checks, final checks and visual reviews. Checks confirm artwork spans all four edges, reference pixels are fully opaque with no blank edge bands, outline pixels are black/transparent, PDFs have correct single-page sizes, and stage line/early-paint checks pass.

## Gnome Halloween portrait vector refresh — superseded layout (September 19, 2026)

- The initial 8 x 10 geometry used `Gnome Halloween/test/gnome-halloween-outline-8x10.png`. The user rejected its still-square subject arrangement. This input remains unchanged as a source but is no longer the production geometry master.
- True black-on-transparent SVG: `Gnome Halloween/output/svg/8x10/gnome-halloween-outline-8x10.svg`; matching vector PDF, transparent 300/600-DPI PNGs, portrait reference PDF/PNG and updated illustrated guide PDF/PNG are in `Gnome Halloween/output/pdf/8x10/`.
- Reference retains the adult plum, russet, ivory and smoky blue-gray treatment with the original seven paints. Generated texture is registered with canonical region masks. Original square sources and guide remain unchanged.
- Superseded builder and checks: `Gnome Halloween/tmp/vector-8x10/`. Use the full-portrait revision below for production. The Desktop SVG copy belongs in `Canvas Kit Vector Outlines`.

## Gnome Halloween corrected full-height composition (September 19, 2026)

- The user rejected the earlier 8 x 10 outline because its subject arrangement still read as square. The current geometry is `Gnome Halloween/tmp/full-portrait/gnome-halloween-outline-8x10.svg`, rendered into `assets/full-portrait/outline-canonical-white.png`. It has a taller hat crown, extended beard/lower silhouette, raised moon and bats, and lowered pumpkins/shoes. Visible outline bounds now occupy 95.7% of page height (previously 82.3%); the subject bounding-box aspect ratio is 0.818 (previously 0.950).
- Current builders and checks are in `tmp/full-portrait/`, with the native vector recomposition source at `tmp/vector-8x10/recompose.cjs`. Old vector-8x10 exporters are superseded. `tmp/full-portrait/previous-edition/` preserves the earlier square sources, guide and rejected outputs. The original test outline remains unchanged as a historical source.
- The current black-on-transparent SVG is under `output/svg/8x10/`, with root and Desktop copies. Matching vector PDF, transparent PNGs, reference PDF/PNG and illustrated guide PDF/PNG are under `output/pdf/8x10/`. Root outline/reference filenames and the familiar `output/pdf/gnome-halloween-painting-guide-illustrated` aliases now point to the corrected portrait edition, so opening the familiar files does not show an old square source.
- The adult palette, title, branding, materials banner and serif guide styling remain. Stages use the new geometry masks; original geometry is not reused as the production master. Paint texture is generated and resampled for print, while the outline is resolution-independent vector artwork.

## Current gray transfer standard � all ten kits (September 19, 2026)

- The user requested every kit outline be changed to the Flowers in Vase line thickness in medium-light gray. This supersedes earlier black-line production-export preferences in historical kit notes. Production SVGs now use approximately 1.4-point centerline strokes at the final 8 x 10-inch size, round caps and joins, and no background.
- Adult gray: #A6A6A6. Fox Fall and Cat in Pumpkin (Cat in a Pumpkin) are children's kits and use darker gray #808080 at the same line weight. Treat those two as children's designs moving forward.
- All ten kits have a true vector `output/svg/8x10/<slug>-outline-8x10.svg` plus a root copy. Matching vector PDF and transparent 300/600-DPI PNGs are under `output/pdf/8x10/`. Current root outline PNG aliases are refreshed. A copy of each SVG is in the user's Desktop `Canvas Kit Vector Outlines` folder.
- This is a linework-only revision: current artwork placements and color references/guides remain aligned. Fox Fall, Ghost Fall, Cat in Pumpkin and Pumkin retain their older centered arrangements pending a separate recomposition decision. Do not describe these four as freshly recomposed full-height portraits. All transfer file pages are 8 x 10 inches.
- Shared current transfer builder, exporter, verification and comparison sheets: `Fox Fall/tmp/transfer-standard/`. Each kit's `tmp/transfer-standard/before-transfer/` archives the source and superseded production outline files. Original test sources remain unchanged. Do not overwrite the gray production transfers by rerunning older black-line exporters without applying this standard afterward.
- SVG paths are genuine vector geometry, with no embedded raster or background shape. PDFs are also vector, one page at 576 x 720 points. PNGs are 2400 x 3000 at 300 DPI (4800 x 6000 at 600 DPI for compatibility), with the specified gray and transparent backgrounds/interiors. Values are visually reviewed file settings, not physically press-tested results.
- `canvas-transfer-outlines.md` is the current index; each kit has `TRANSFER-OUTLINE.md`. Guides may use darker outline previews for readability while following the same design. Preserve archived source geometry/masks when building guide stages.

## Current 2-point transfer standard (September 19, 2026)

- The user accepted increasing all ten production outlines from 1.4 pt (0.494 mm) to 2 pt (0.706 mm) for clearer canvas transfers. This supersedes the 1.4-point line weight in earlier historical notes. Use 2 pt for future outlines unless requested otherwise.
- Adult outlines remain #A6A6A6; Fox Fall and Cat in Pumpkin remain #808080. SVG path geometry, placement, 8 x 10 dimensions, round caps/joins and transparent backgrounds are preserved. Only line weight changed.
- Current output SVGs, vector PDFs, transparent 300/600-DPI PNGs and root outline aliases have been refreshed. Previous 1.4-point files are archived under each kit's tmp/darker-outline/before-2pt/.
- Desktop delivery is the folder darker outline on the current Windows Desktop, containing ten SVGs at the top level, plus PDF, PNG 300 DPI and PNG 600 DPI subfolders. Earlier Desktop Canvas Kit Vector Outlines copies remain the earlier edition.
- Current preparation: Fox Fall/tmp/transfer-standard/prepare-2pt.cjs. It preserves the existing vector paths. Export, render, verification and delivery tools are under Fox Fall/tmp/darker-outline/. Do not rerun the old 1.4-point exporter over current production files.
- Visually reviewed all ten PDF renders and enlarged Gnome Fall/Flowers details; checked identical path geometry, exact vector PDF size/weight, PNG color/transparency/resolution and delivery hashes. These are file checks, not physical press-test results.

Update this file as the user provides more preferences. Record reusable preferences separately from details specific to one painting.
