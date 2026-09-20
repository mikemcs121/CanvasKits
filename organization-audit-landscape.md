# Fall View and Starry Night Sunflower organization audit

Organization completed: current production files are at each kit root; old kit assets/tmp/output/test paths below now live under info/. Source selections below document the pre-move audit. See canvas-kits.md for current links and each info/organization-manifest.json for exact mappings.

Reviewed the Desktop instruction file, project AGENTS.md, and build-canvas skill. No Desktop backup files were modified. Final subject-folder moves are handled by the main organization pass.

## Selected production transfers

- `fall view/output/svg/8x10/fall-view-outline-8x10.svg`; SHA-256 `a10351797e8408d49cab2512b702912e130b0506deda2a27024720dc82113460`.
- `Starry-night Sunflower/output/svg/8x10/starry-night-sunflower-outline-8x10.svg`; SHA-256 `59c71e68a18b715a00662d03a800a353badd3472a6e2bff5fd9099e8d87d4299`.

Both remain byte-identical to their latest `tmp/darker-outline/` copies. Existing 8 × 10 portrait geometry and 2-point adult-gray vector transfers were preserved. No new outline was created.

## Repairs completed

The old color references were square and the old flattened guides were drafts with geometry discrepancies. They were preserved. New portrait texture references were made from the actual portrait outline plus the corresponding earlier painting's color/style reference, then registered through closed-region masks. New editable twelve-panel guides use cumulative masked stages and mapped finishing crops. This is a portrait adaptation, not merely a square painting placed on a taller page.

Fall View uses white, black, red, yellow, blue, green, brown, orange. Sunflower uses white, black, blue, yellow, orange, green, brown. Recipes remain explicit in the corresponding captions; all ingredients appear in the materials list. The header and drying scene use the same registered final target. Drying is shown flat, with closed pots and clean brushes. Guides retain the familiar handwritten title, serif captions, pale-blue banner, numbered four-column layout, and complete master branding.

Final exports available for the main organization pass:

- `fall view/output/pdf/8x10/fall-view-painting-guide-8x10.pdf`
- `fall view/output/pdf/8x10/fall-view-finished-reference-8x10.pdf`
- `Starry-night Sunflower/output/pdf/8x10/starry-night-sunflower-painting-guide-8x10.pdf`
- `Starry-night Sunflower/output/pdf/8x10/starry-night-sunflower-finished-reference-8x10.pdf`

Matching PNGs are next to the PDFs. Guide PNGs are rendered from the latest PDF. Working data, masks, exact crop coordinates, source texture attempts, editable HTML, layout checks, and PDF dimension checks are in each kit's `tmp/organization-repair/`. After organization these locations become `info/output/...` and `info/tmp/...`; the root will hold the chosen SVG plus these guide/reference PDFs.

## Verification and limits

- Rendered and visually inspected both latest guide PDFs, including captions, distinct finishing panels, and flat-drying scenes.
- Each guide is exactly one US Letter page, 612 × 792 points. Each reference PDF is exactly one 8 × 10 page, 576 × 720 points. Both guide layouts pass twelve-cell heading/caption overflow checks.
- Fall View sky masks were specifically repaired after review found premature canopy and sun fragments: step 2 now leaves canopy, clouds, sun, mountains, trees, and rocks white. The sky uses a blended field with source brush texture inside the exact sky mask.
- Sunflower seed stippling is withheld until step 11, including the step 10 detail crop. Crowded headings were shortened.
- Stage shapes are controlled by masks from the preserved portrait outline. Painterly surface texture is adapted and interpolated, rather than a claim of pixel-identical generated boundaries. The current target is `registered-reference.png`, not the unregistered generation result.
- Painting compatibility PNGs are 2400 × 3000, resampled from an 800 × 1000 registered working master. Do not describe these as native high-detail 300-DPI paintings. SVG transfer geometry remains resolution-independent.
- These checks concern files and visual consistency, not a physical sublimation/press test.

## Sunflower duplicate-folder disposition

`Starry-night Sunflower` is canonical because it owns the current production transfer and portrait test source. `Starry Night Sunflower` contains original source/composite, square painting, and old draft-guide history. Preserve the latter whole under `Starry-night Sunflower/info/archive/original-square-kit/`; do not merge identically named source PNGs by overwriting.

## Rebuild entrypoints

The shared two-kit entrypoints are `fall view/tmp/organization-repair/{build.cjs,guide.cjs,export.cjs,render.ps1,promote.cjs}` (under `info/tmp` after organization). Run from the project root. `build.cjs` detects organized kit roots and relocated shared Fox Fall dependencies. `guide.cjs` reads its freshly written `kits.json`. `export.cjs` also detects relocated shared dependencies. Render detects `info`. After visual review, `promote.cjs` updates supporting outputs and organized root production PDFs together, without touching SVGs. The original `inspect.cjs` is a historical extraction helper; retained masks are already built. README in that directory explains provenance and workflow.
