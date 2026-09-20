# Vector review

Four final SVG files were parsed as XML and visually inspected on a checkerboard. All have physical width 8in, height 10in, viewBox 0 0 2400 3000, black filled paths, no background rectangle, and no raster image element. Geometry uses the existing 60,360 / 2280-square placement on the portrait page.

The source for each trace is its preserved canonical white-background outline, not an enlarged PNG. Potrace 2.1.8 uses threshold 128, turdSize 0, alphaMax 1, optTolerance 0.1; resvg 2.6.2 renders the verification images. Dependencies are local to this temporary tool folder and were installed with package scripts disabled. See their bundled licenses.

Native-resolution shape comparisons are recorded in verification.json. Differences are almost entirely antialiased boundary smoothing. The cat has three isolated discrepant pixels outside a one-pixel edge neighborhood; visual inspection confirms the ears, whiskers, eyes, paws, tail, and carved pumpkin openings remain present. The other three traces have zero such discrepant pixels.

Each kit's output/svg/8x10 folder and root SVG copy are byte-identical to the verified trace. deliverables.json records SHA-256 hashes. Desktop copying checks these hashes again. Companion 600-DPI PNGs are rendered from the vector and carry correct pHYs metadata; original 300-DPI edition PNGs remain in place.

The vector PDF candidates in tmp/vector are intermediate files and are not the delivered files for this request. Existing kit guide and artwork PDFs are retained.
