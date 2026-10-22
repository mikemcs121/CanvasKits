# Sea Turtle kids canvas kit

Created October 21, 2026 for ages 8-14. The user's corrected `Cute Sea Turtle Underwater Coloring Scene.png` governs the shapes: left-facing turtle, corrected shell, bubbles, starfish, coral and seaweed. The native Illustrator file is preserved as supplied; it was not substituted for the requested PNG template. Source proportions are retained with uniform scaling to the 8 x 10 portrait scene. Plants finish at the bottom canvas edge.

## Production files

- `../turtle-outline-8x10.svg`: true vector transfer, 8 x 10 inches, black #000000, 3 pt, round caps/joins, transparent background and interiors.
- `../turtle-finished-reference-8x10.pdf`: one 576 x 720-point page, losslessly embedding the saved 2400 x 3000 master.
- `../turtle-painting-guide-8x10.pdf`: one US Letter page, six illustrated panels in two columns and three rows.
- `../assets/`: lossless guide pictures; composed drying panel rendered and cropped from the guide.

Eight ready-to-use paints: blue, lime green, green, dark green, yellow, light blue, black and white. No mixing. The attached painting supplies the color/style direction, not the geometry. Pink cheeks are omitted; the template's cheek oval remains lime green. The guide stages are water; lime turtle/coral; greens/spots; yellow bands/starfish; bubbles/face; drying/cleanup.

## Sources and editable assets

- `archive/previous-root-files/`: unchanged PNG, AI, and attached painted style reference. PNG SHA-256: `281770130d8cd4ae33ab3b76aabd21474ed7be2ae5325afdda26bb18188149b8`; AI: `ba9d804f1a367c9b10560519e62e1f7393057fabf709150414c5e73de34b446c`.
- `assets/geometry.json`: saved source-derived centerlines, eye contours, and placement. Normal builds reuse this geometry.
- `assets/region-map.npy`, `regions.json`, `paint-map.npy`, `paint-plan.json`: canonical region boundaries, editable color assignments and cumulative stage dependencies.
- `assets/generated-color-source.png`, `generation-prompt.txt`: generated painting study following the two supplied images. Brush texture is clipped and recolored into the canonical regions; generated object boundaries do not control the transfer or stages.
- `assets/painted-regions.png`, `water-background.png`: registered paint layers with continuous blue water.
- `assets/reference-master.svg`, `reference-master.png`, `stage-01.png` through `stage-06.png`: saved reference and cumulative guide artwork. PNGs are 2400 x 3000 at 300 DPI. Generated texture began at 1024 x 1536 and was smoothly resampled; this is not native 300-DPI detail.
- `assets/page-logo.png`: selected full logo with a small green turtle emerging from the river, complementary pale lime ribbons and blue water. Preserve this version on rebuild; the shared original logo remains unchanged.
- `src/`: trace, region, artwork, guide, build and verification sources. Shared guide plan: project `assets/tools/guide-template/kits.json`, entry `turtle`.

Run from the project root:

```powershell
node turtle/info/src/build.cjs
# Review tmp/turtle/outline-preview.png, finished-reference.png,
# painting-guide.png, stages.png and geometry-check.png.
& 'C:/Users/mikem/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe' turtle/info/src/verify.py
node turtle/info/src/build.cjs --promote
node Tools/guide-image-extractor.cjs turtle/turtle-painting-guide-8x10.pdf
```

For logo/guide-only repairs, run `node turtle/info/src/rebuild-guide.cjs`; it writes a candidate and rendered preview in `tmp/turtle-logo/` without rebuilding canvas artwork. The October 21 logo addition leaves all outline/reference/step artwork unchanged.

`--retrace` intentionally reconstructs geometry and region maps from the supplied PNG. Do not use it for ordinary guide changes. After changing paint groups, update the shared guide plan and review all stages. The sources use the bundled Python path; adjust it if the runtime moves. Build candidates and measured review records stay in project `tmp/turtle/`.

## Completed digital review

Reviewed the transparent transfer, all cumulative stages, the rendered guide and reference, and enlarged face/shell details. Verified exact page sizes, effective black 3-point transfer strokes, vector-only content, transparent interiors/margins, six numbered readable guide steps, final-stage identity, reference-PDF/master pixel identity, and zero pink pixels. Every stage reuses the same saved vector paths and placement. No physical printing, pressing or painting tests are claimed. Print the artwork at Actual size / 100%.
