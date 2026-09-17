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

1. **Outline (the preprinted canvas).** A black line-art drawing of the design on a white background. This is the first frame of the project. It is transferred onto the blank canvas before the customer receives the kit, so the customer starts with these lines already printed on their canvas. In the Gnome Christmas Tree kit this is `Gnome Christmas Tree/gnome-christmas-tree-outline.png`.
2. **Finished reference (the goal).** A full-color painting of the same design, showing what the customer should try to create by painting inside the printed outline. In the Gnome Christmas Tree kit this is `Gnome Christmas Tree/gnome-christmas-tree-finished-reference.png`.
3. **Instructions (the `output/` folder).** The one-page illustrated instruction sheet that teaches the customer how to get from the outline to the finished reference, step by step. This is what we produce. It is saved as a PDF plus a matching image under the kit's `output/pdf/` folder.

Rules that follow from this pipeline:

- The outline and finished reference are the inputs. Never modify them; they define the design the customer already has on the canvas and the result they are aiming for.
- Every step illustration in the instructions must match the outline's shapes and placement exactly, because those lines are already on the customer's canvas.
- The final step of the instructions should arrive at the finished reference, and the reference is the image shown near the title as the finished-painting preview.
- The `tmp/` folder holds intermediate generated images and drafts; only approved deliverables go in `output/`.
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
- Avoid a children's coloring-sheet or classroom look in the finished painting and guide: overly bright colors, heavy cartoon borders, bubbly typography, oversized playful icons and abundant cute doodles. The preprinted outline still needs clear black lines for transfer and painting.
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
- `Fall View/tmp/pdfs/fall-view-painting-guide-illustrated-draft.pdf` and matching PNG: reviewed one-page US Letter draft with twelve panels. Progression and text have been checked, but generated leaf clusters and some branch/forest contours differ from the canonical outline; exact registration remains unresolved. Do not treat this draft as production-approved or promote it to `output/pdf/` until corrected.
- At the user's request, clearly labeled draft PDF and PNG copies are also available in `Fall View/output/pdf/` as `fall-view-painting-guide-illustrated-draft.pdf` and `.png`. This placement does not change their draft status or resolve the contour differences described above.
- Editable steps, generation prompts, exporter, renderer and verification notes are retained under `Fall View/tmp/`. Source composite and shared master logo are unchanged.

Update this file as the user provides more preferences. Record reusable preferences separately from details specific to one painting.
