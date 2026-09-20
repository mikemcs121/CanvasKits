const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '../../..');
const read = p => fs.readFileSync(path.join(root,p),'utf8');
const write = (p,s) => fs.writeFileSync(path.join(root,p),s,'utf8');
const old = read('AGENTS.md');
if (!fs.existsSync(path.join(root,'canvas-kit-history.md'))) write('canvas-kit-history.md', '# Historical kit notes — superseded paths\n\nSnapshot before the September 20, 2026 organization. Current production paths and rules are in AGENTS.md and canvas-kits.md. Old kit assets/, tmp/, output/, and test/ paths now start with info/. Old root companion images and notes are in info/archive/previous-root-files/. The unhyphenated Sunflower folder is archived in Starry-night Sunflower/info/archive/original-square-kit/. Do not use historical filenames to choose production editions.\n\n'+old);
const policy = `# Canvas kit production and organization

## Current layout — September 20, 2026

The project root holds shared assets, project-wide Markdown notes, and one folder per kit. Each kit root contains exactly three production files and one supporting directory:

- \`<slug>-outline-8x10.svg\`: existing approved true vector transfer, 8 by 10 inches, transparent background.
- \`<slug>-painting-guide-8x10.pdf\`: customer instructions, one US Letter portrait page.
- \`<slug>-finished-reference-8x10.pdf\`: matching color target, one 8 by 10-inch page.
- \`info/\`: everything else, with a README describing the current sources, checks, and build locations.

Keep matching PNGs, compatibility PDFs, canonical images, masks, prompts, builders and review notes inside info/. Use info/assets/ for working artwork, info/tmp/ for builds and reviews, info/output/ for supporting exports, and info/test/ for retained supplied test art. Keep original supplied material unchanged. Archive superseded root aliases and notes in info/archive/previous-root-files/; preserve older build directories when current scripts depend on them. Do not delete old files merely to tidy the view. New obsolete editions belong in info/archive/ with descriptive names.

Production files at the kit root are the authoritative customer/transfer deliverables. Do not leave additional aliases, README files, PNGs, or alternate PDFs there. Do not select files by modification date alone. Review the outline, reference, and guide together before promoting them. Preserve file hashes and an old-to-new path manifest when reorganizing. Keep supporting PNGs rendered from the current PDF under info/output/.

The Desktop Canvas Kits folder is the user's untouched rollback copy. The Desktop Flowers In Vase folder was the organization example. Do not modify either during this organization. Normal future work takes place in this project.

Use [canvas-kits.md](canvas-kits.md) to find current production files and review status. [canvas-kit-history.md](canvas-kit-history.md) preserves earlier decisions and provenance; its paths and superseded standards are historical, not current instructions.

## Artwork and production standards

Use the project build-canvas skill for full kits. Its output layout must follow the three-file root structure above. A full kit includes the three production files plus supporting artwork PDFs/PNGs and guide PNG stored under info/.

Preserve each current SVG's approved geometry. This organization request authorizes bringing references and guides into alignment with those SVGs, not redesigning the transfer. Specific future rejections of a composition authorize replacing it after archiving the rejected edition and updating all three production files together.

For new designs or requested recompositions, the actual subject must read as a natural 4:5 portrait, with complete features and natural proportions. Extra background around a square design does not satisfy this. Existing centered Fox Fall, Ghost Fall, Cat in Pumpkin, and Pumkin arrangements remain preserved unless separately revised.

Current transfer standard is **2 pt (0.706 mm)** at 8 by 10 inches, round caps/joins, **#A6A6A6 for adults**, **#808080 for children's Fox Fall and Cat in Pumpkin**. SVGs contain true vector paths, no raster or background. Supporting outline PDFs remain vector. PNGs have transparent interiors and margins, 2400 by 3000 at 300 DPI; optional 600-DPI compatibility copies are 4800 by 6000. Artwork PDFs are 576 by 720 points; guides are 612 by 792 points. Print artwork at Actual size / 100%. These are file standards, not claims of physical press testing.

Never overwrite supplied originals. The approved outline determines shapes and placement; the matching reference determines the target. Build guide stages with canonical masks, layers, and mapped crops. Full-canvas panels use the portrait artwork dimensions, and the final preview and drying panel show the selected current reference. Keep colors unpainted until their stated step. A drying scene shows a canvas lying flat.

## Guide design and beginner instructions

Default to adult acrylic paint-night kits; Fox Fall and Cat in Pumpkin are children's kits. Preserve recognizable subjects and each existing guide's title, typography, banner, numbering and overall style when updating artwork. Use graceful handwritten titles, readable dark lettering, restrained page accents and practical captions. Avoid childlike decoration in adult kits. Derive the palette from the actual subject.

Use a small finished-reference preview near the title, a compact materials banner, and numbered illustrated panels with short directions. Default to twelve useful steps in a four-column by three-row grid; use fewer if twelve would be repetitive. Late stages should show useful distinct crops or brush actions. Ensure readable print-size captions, safe margins and no overlap.

List canvas, acrylic paints, large and small brushes, water, paper towels and a palette or paper plate without assuming everything is included. Start with the preprinted canvas, not a drawing lesson. Explain thin coats, rinsing and blotting, drying between layers and cleanup. Every color must be a listed paint or have a recipe using listed paints in the step before use. Do not add paint pots silently. Explain practical mixing, layering, brush direction, blending, shadows and highlights. Floral outlines may separate petals, but painted transitions should blend softly rather than follow dark internal seams.

Load the unchanged shared logo from assets/images/river-and-ridge-logo.png. Save page-colored variants in the kit's info/assets/. Preserve the full lettering, silhouette, landscape, transparency and wide aspect ratio. Place the logo in the top-right header without overlap; derive its colors and subtle seasonal details from the current page.

## Verification and completion

Review all three files together, including rendered SVG/reference/guide images. Verify exact SVG size, vector content, gray and 2-point weight; one-page PDF sizes; outline/reference registration; cumulative painting sequence; distinct finishing panels; all recipes and spelling; legible text; logo integrity; and matching final PDF/PNG revisions. Save checks actually performed in info/tmp/ and link them from info/README.md. Do not equate correct page dimensions with correct geometry.

Full-kit and guide-repair requests authorize finishing and promoting verified files. Repair ordinary generated drift using canonical layers and crops. Use draft status only for a concrete unresolved source/tool blocker; identify the failed gate. Keep any printable unresolved draft clearly labeled under info/output/, not under a misleading production filename. Do not overwrite a usable production file with an unverified draft.

Builders inherited from before the organization may contain old absolute paths or assumptions about project depth. Consult info/README.md and the organization manifest before running them; update paths to info/ and the shared project assets deliberately. Do not run historical exporters over current SVGs or restore obsolete 1.4-point/black outlines.
`;
write('AGENTS.md', policy);
let skill=read('.agents/skills/build-canvas/SKILL.md');
skill=skill.replace('Deliver each as a PDF and matching PNG.', 'Keep exactly three production files at the kit root: the SVG transfer, the guide PDF, and the reference PDF. Store matching PNGs and compatibility exports under info/.');
const start=skill.indexOf('## Organize the kit files'), end=skill.indexOf('## Set the artwork size');
skill=skill.slice(0,start)+`## Organize the kit files

Each subject root holds exactly three production files: \`<slug>-outline-8x10.svg\`, \`<slug>-painting-guide-8x10.pdf\` and \`<slug>-finished-reference-8x10.pdf\`. The guide is US Letter; the SVG and reference are 8 by 10 inches. Put all other kit files inside \`info/\`.

Use \`info/assets/\` for canonical images, stages and logo variants; \`info/tmp/\` for editable plans, masks, prompts, builders and reviews; \`info/output/pdf/8x10/\` for matching PNGs and compatibility PDFs; and \`info/archive/\` for obsolete editions and preserved sources. Keep an \`info/README.md\` pointing to the active source and builder. Preserve prior dependency trees when moving files, and record a path/hash manifest. Treat project-root production indexes as the entrypoint instead of leaving extra notes in each kit root.

In the workflow below, kit-relative assets/, tmp/ and output/ mean directories beneath info/. The shared logo remains at the project root's assets/images/. Resolve these locations explicitly; do not rely on old absolute paths or folder depth. Existing approved SVGs govern guide/reference repairs and must not be regenerated just to reorganize files. Preserve supplied originals and old editions.

`+skill.slice(end);
skill=skill.replace('**1.4 pt at the final 8 x 10-inch print size**','**2 pt (0.706 mm) at the final 8 x 10-inch print size**');
skill=skill.replace('Use the PDF skill for PDF creation and verification. Read these skills when entering the relevant phase; do not assume their paths or tool interfaces remain unchanged.','Use available local PDF export and rendering tools for verification. Read the imagegen skill when image generation is needed; do not assume tool interfaces remain unchanged.');
skill=skill.replace('Save it under `output/svg/8x10/`, keep a convenient root copy,','Save the production SVG at the kit root, keep any supporting copy under `info/output/svg/8x10/`,');
const finalStart=skill.indexOf('For a full-kit request, the expected result is all six production files');
const finalEnd=skill.indexOf('Update the project `AGENTS.md`',finalStart);
skill=skill.slice(0,finalStart)+`For a full-kit request, finish and verify the SVG outline, guide PDF and reference PDF, then promote exactly these three files to the kit root. Put matching PNGs and compatibility PDFs under info/output/pdf/8x10/. No extra approval is needed. Repair routine stage mismatches using canonical masks/layers and rerun checks.

Use draft status only for a concrete unresolved source or tool blocker. Keep clearly labeled printable draft PDFs and matching PNGs in info/output/pdf/, report the exact failed gate, and do not replace current production files with unverified drafts.

`+skill.slice(finalEnd);
skill=skill.replace('Finish with links to the guide PDF, matching image, and newly created companion references.','Finish with links to the three production files and the kit index; include supporting image links only when useful.');
write('assets/tools/organization/build-canvas-SKILL.md',skill);
console.log('Updated project instructions; staged skill update for installation.');
