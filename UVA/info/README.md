# UVA Sunset canvas kit

Created October 19, 2026 from the user-selected Desktop `UVA.jpg`, with the approved VT Hokie sunset and blue mountain concept. The user requested a matching horizontal kit: artwork is **10 x 8 inches**, not the usual portrait format. Preserve the complete V and both sabres without stretching or clipping.

## Production files

- `../uva-outline-10x8.svg`: true vector paths, transparent background and interiors, #A6A6A6, 2-point rounded strokes. Hidden mountain segments are removed as actual vector geometry, without clipping masks. A nonprinting path with no fill or stroke marks the full 10 x 8-inch canvas bounds.
- `../uva-finished-reference-10x8.pdf`: one 720 x 576-point landscape page.
- `../uva-painting-guide-10x8.pdf`: one US Letter portrait page, eight illustrated steps.
- `../assets/`: extracted final-guide pictures, including a 600-DPI rendered crop of the complete drying scene.

The finished target keeps the supplied image's white-and-gray V, orange/reddish-orange border and orange crossed sabres. Its navy rectangle and tiny registration symbol are omitted so the emblem sits over the cream/peach/orange sky and three blue mountain bands. The reference uses clean continuous color areas, with soft sunset transitions. The user's Desktop original is untouched.

Nine ready-to-use colors: cream, peach, orange, light blue, medium blue, dark blue, reddish-orange, light gray and white. No mixing recipes or numbered paint swatches. Logo colors are decorative and do not add paints to the canvas palette.

## Sources and rebuild

- `archive/previous-root-files/UVA.jpg`: byte-identical supplied original, SHA-256 `36303e3bb44768bad200e7dcfbef320b3ab747961c4d0ab5fe4334c0ecab0964`.
- `assets/geometry.json`: canonical source-derived region contours, color boundaries and stage dependencies. JPEG pixel stair-steps were cleaned into shared smooth vector contours; the emblem was not independently redrawn or regenerated.
- `assets/outline-binding.json`: hashes binding the saved SVG and geometry to the supplied JPEG. Normal rebuilds refuse changed bindings.
- `assets/background-source.json`: the VT kit's visible ridge paths and exact sky color stops. Ridge paths continue behind the new emblem by interpolation across portions formerly covered by VT; visible source mountain contours and the three blue shades are retained.
- `assets/reference-master.svg` and `.png`: current color master, 3000 x 2400 at 300 DPI.
- `assets/stage-01.png` through `stage-07.png`: cumulative layers from the same canonical geometry.
- `assets/page-logo.png`: transparent, naturally proportioned River and Ridge logo variant featuring the sunset, blue mountains, river and the supplied white/gray V with orange sabres. The shared master logo is unchanged.
- `src/build.cjs`, `src/geometry-tools.cjs`: geometry construction, bound-source validation, stage rendering, review images and promotion.
- `src/outline-paths.cjs`: clips mountain centerlines against the saved emblem contours and exports only the visible segments for reliable vector imports; preserves all emblem paths.
- `src/guide-pdf.cjs`, `src/reference-pdf.cjs`: editable deterministic PDF builders.
- Shared palette and ordered directions: `../../assets/tools/guide-template/kits.json`, entry `uva`.

Run from the project root:

```powershell
node UVA/info/src/build.cjs
```

Default builds produce candidates and review/check files in `tmp/uva-kit/candidate/`. They do not replace production. Normal builds read the saved geometry and verify the SVG binding; they do not retrace the supplied source. For an intentional geometry revision, first preserve the current edition in Git, then revise and review all three deliverables together before recording a new binding.

After visual review:

```powershell
node UVA/info/src/build.cjs --promote
node Tools/guide-image-extractor.cjs UVA/uva-painting-guide-10x8.pdf
```

The extractor refuses changed existing pictures; extract into a scratch candidate folder before replacing a previous assets set. Do not recover old WinRT PDF renderers.

For an outline export repair that preserves the existing canonical geometry, reference, guide and extracted pictures:

```powershell
node UVA/info/src/build.cjs --outline-only
# Review the candidate first, then:
node UVA/info/src/build.cjs --outline-only --promote
```

October 19 Illustrator import repair: replaced the mountain clipping mask with permanently trimmed vector paths and added the invisible full-canvas sizing path. The artboard remains landscape, 10 inches wide by 8 inches high. The visible marks alone measure roughly 10 x 6.4 inches because the composition has transparent top and bottom margins. Do not stretch those marks to fill the canvas. Digital review verified unchanged emblem paths, zero mountain strokes inside the emblem away from its boundary, 2-point gray strokes, transparency, and agreement with the existing reference and guide. Illustrator itself was not available for an application-level import test. Geometry binding checks accept equivalent LF/CRLF line endings from Git while still rejecting substantive changes.

## Review performed

Reviewed the source JPEG, complete outline, reference, guide, cumulative stages and magenta registration overlay. Verified the one-page PDF dimensions, artwork pixel dimensions, PNG 300-DPI encoding, vector-only SVG with transparent interiors and rounded 2-point gray strokes, readable text, full logo, matching final preview and flat drying scene. Guide images are extracted losslessly, with the composed drying panel rendered at 600 DPI. These checks are digital, not physical painting or press testing. Digital colors do not specify tested commercial paint-brand matches.

## Center mountain correction - October 19

At the user's request, the small light-blue mountain sliver between the sabres was raised into a gentle peak. The local far-ridge lift is 14 artwork units (0.14 inch) centered at x=510, tapering to zero outside x=430..590. All emblem contours, other mountain bands, paint colors and captions are unchanged. The canonical geometry, SVG, reference, guide stages, preview, drying panel and extracted pictures are updated together. The prior complete edition is preserved in rollback Git commit fc9e26e and tmp/uva-kit/before-mountain-adjustment.bundle at the project root.

For reviewed background-only adjustments, the builder accepts --geometry-proposal <scratch-json>. It validates the current saved binding first and refuses proposals that change any emblem region, silhouette or line. Default builds remain locked to the current saved geometry; --promote records the new binding after review.
