# Painting guides â€” shared Fall View template

All ten current guides use the user's Fall View illustrated draft as their layout reference. The source PDF was copied from the Desktop backup to [the local template](assets/templates/fall-view-guide/reference.pdf); the Desktop files were not modified.

The rebuilt layout uses a large brush-script title, painting preview at left, complete logo at right, centered materials strip, numbered headings below the pictures, readable serif captions, thin column dividers and a light footer wash. Each guide keeps its current painting stages and paint recipes. Pumpkin has eight useful steps; the others have twelve. Kaushan Script is an editable approximation of the reference's brush lettering, with its [license retained](assets/fonts/KaushanScript-OFL.txt).

| Guide | Painting-derived page and logo colors |
| --- | --- |
| [Flowers in Vase](<Flowers in Vase/flowers-in-vase-painting-guide-8x10.pdf>) | Deep teal, pale turquoise, ivory and rose accents |
| [Gnome Halloween](<Gnome Halloween/gnome-halloween-painting-guide-8x10.pdf>) | Plum, pale lavender, slate blue and russet |
| [Autumn Fox](<Fox Fall/fox-fall-painting-guide-8x10.pdf>) | Warm brown, cream gold, orange and moss green |
| [Autumn Ghost](<Ghost Fall/ghost-fall-painting-guide-8x10.pdf>) | Plum, pale lavender, ivory and muted orange |
| [Cat in Pumpkin](<Cat in Pumpkin/cat-in-pumpkin-painting-guide-8x10.pdf>) | Charcoal blue, pale peach, ivory and pumpkin gold |
| [Autumn Pumpkin](<Pumkin/pumpkin-painting-guide-8x10.pdf>) | Dark brown, cream, russet orange and olive |
| [Christmas Gnome](<Gnome Christmas Tree/gnome-christmas-tree-painting-guide-8x10.pdf>) | Evergreen, pale cool green, ivory, snowy blue and red accents |
| [Gnome Fall](<Gnome Fall/gnome-fall-painting-guide-8x10.pdf>) | Deep teal, pale teal, green and autumn gold |
| [Fall View](<Fall View/fall-view-painting-guide-8x10.pdf>) | Navy, pale blue, evergreen and autumn gold |
| [Starry Night Sunflower](<Starry-night Sunflower/starry-night-sunflower-painting-guide-8x10.pdf>) | Navy, pale blue, sunflower gold and leafy green |

All final PDFs were rendered and visually inspected. Checks cover one-page US Letter size, complete step numbering, readable captions, no text overflow, logo transparency and wide proportions, current painting previews, distinct finishing details and complete flat drying scenes. Matching 2550 Ã— 3300 PNGs are rendered directly from the final PDFs under each kit's `info/output/pdf/8x10/`. Outline SVGs and reference PDFs remain byte-for-byte unchanged by this refactor; the earlier gnome texture corrections are preserved.

The master logo remains unchanged. Painting-specific logo variants were made with the built-in imagegen tool, using the master and each page as references. The [logo generation record](assets/tools/guide-template/logo-generations-final.json) records the prompts and generated source paths; final project copies are in each kit's `info/assets/template-refactor/river-and-ridge-logo.png`. Prior guide PDF/PNG pairs are archived in `info/archive/before-fall-view-template/`.

Shared editable [builder](assets/tools/guide-template/build.cjs), [kit plans and palettes](assets/tools/guide-template/kits.json), [final automated checks](assets/tools/guide-template/final-checks.json), and [visual review record](assets/tools/guide-template/visual-review.json) are retained. Each kit also has its plan, HTML, prompt and verification under `info/tmp/template-refactor/`. Run the builder, then `render.cjs`, then `check-and-promote.cjs`; visually review before using its `--promote` option. Future guide preferences are recorded in AGENTS.md and the build-canvas skill.

