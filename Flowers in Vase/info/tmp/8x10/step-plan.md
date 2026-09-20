# Flowers in Vase: 8 x 10 edition

Geometry: unchanged 1254 x 1254 outline; region IDs from ../regions.bin and groups.csv. Each artwork edition fits that square at x=60, y=360, width=2280, height=2280 on a 2400 x 3000 white canvas. No source design is stretched or cropped. This intentionally retains white space above and below the square design.

Target: assets/8x10/flowers-in-vase-registered-reference.png, derived from the repaired generated image using the original region masks. The original blended painting is retained. Texture is resampled for print, not native 300-DPI generation.

Materials: preprinted 8 x 10 canvas, acrylic paints, large and small brushes, water cup, paper towels, palette or paper plate. Paints: white, black, turquoise, blue, green, rose red, yellow, orange, brown.

| Stage | New paint/action | Regions remaining white |
|---|---|---|
| 1 | Printed outline; thin coats, rinse and blot | All |
| 2 | Turquoise + white background; dry | All subject shapes |
| 3 | Green + brown foliage base | Vase, petals, buds, centers, berries |
| 4 | Blue + black navy and white vase bands; dry | Petals, buds, centers, berries |
| 5 | White + rose red blush blooms | Apricot/red petals, buds, centers, berries |
| 6 | Orange + white apricot bloom | Red petals, buds, centers, berries |
| 7 | Rose red central five petals | Buds, centers, berries |
| 8 | Yellow + brown golden buds and centers; dry | Berries |
| 9 | Soft petal shading and white highlights; feather wet edges | Berries |
| 10 | Green + yellow leaf lights; blue + black + white vase lights; white + brown white-band shadows | Berries |
| 11 | Blue + black berries, white shine; brown center shadows, yellow/white dots | None |
| 12 | Exact finished 8 x 10 reference on flat canvas; cleanup | None |

Full-canvas stages reuse the original line layer and closed region masks. Internal petal lines are softened only from stage 9 using ../petal-blend-mask.bin. Berries 172,186,188,189,191,193 remain white until stage 11. Close-ups: stage 9 [595,390,425,365], stage 10 [0,570,790,680], stage 11 [935,655,315,420]. The petal brush cue points into a petal rather than the center.

Layout preserves the prior Flowers guide: Gabriola title, Segoe UI captions, teal ellipse accent, materials banner, circular numbers, 4 x 3 grid, dividers and footer. The existing Flowers page logo matches the retained navy, turquoise, green and golden palette; its full lettering, silhouette and aspect ratio are preserved.

Editable captions are in captions.txt and build.cs. prepare.cjs derives the edition builder from the original without modifying the original. build.ps1 builds artwork and panels; build-guide.ps1 rebuilds only the guide from saved stages. export-guide.cjs and export-art.cjs write the PDFs; render.ps1 verifies page sizes and renders them through Windows.Data.Pdf. finalize.ps1 copies the verified pairs and re-encodes the guide render as a true PNG.
