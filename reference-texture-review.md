# Reference texture review — September 20, 2026

Reviewed all ten current color-reference PNGs at page scale and with enlarged texture/detail crops. Gnome Fall and Christmas Gnome had square sky artifacts caused by integer sampling of small texture patches. Both have been repaired; the other eight did not show the same square-grid defect and were left unchanged.

## Updated files

- Gnome Fall: [reference PDF](<Gnome Fall/gnome-fall-finished-reference-8x10.pdf>) · [guide PDF](<Gnome Fall/gnome-fall-painting-guide-8x10.pdf>) · [before/after comparison](assets/tools/texture-review/gnome-fall-before-after.png).
- Christmas Gnome: [reference PDF](<Gnome Christmas Tree/gnome-christmas-tree-finished-reference-8x10.pdf>) · [guide PDF](<Gnome Christmas Tree/gnome-christmas-tree-painting-guide-8x10.pdf>) · [before/after comparison](assets/tools/texture-review/gnome-christmas-tree-before-after.png).

Matching support PNGs are in each kit's info/output/pdf/8x10/. Previous versions are preserved under info/archive/before-sky-smoothing/.

## Repair and verification

Built-in imagegen supplied smooth painted sky layers based on each reference's palette. The existing geometry mask limits the replacement to the sky. The shared gnome builder now uses bicubic resampling instead of whole-pixel lookups from a tiny patch. Foreground pixels in both registered masters are exactly unchanged; SVG transfers are byte-identical to their pre-repair files. Step illustrations, header previews and flat-drying pictures use the corrected reference.

Reference PDFs remain one 8 x 10-inch page; guide PDFs remain one US Letter page. Matching guide PNGs were rendered directly from the final PDFs. Rendered artwork and guide pages were visually checked, alongside background close-ups. Existing acrylic brush texture is retained; this is not a global blur or a claim that resampled images gained native print-resolution detail.

[All-kit findings](assets/tools/texture-review/all-kits-review.json) · [Pixel/outline checks](assets/tools/texture-review/repair-checks.json) · [Original contact sheet](assets/tools/texture-review/references-before.png) · [Enlarged original details](assets/tools/texture-review/details-before.png) · [Exact imagegen prompts and source resolution](assets/tools/texture-review/prompts.md).
