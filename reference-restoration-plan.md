# Reference restoration plan - approved September 21, 2026

Reviewed September 21, 2026. User approved implementation. Live progress and restart instructions: [RESTORATION-HANDOFF.md](RESTORATION-HANDOFF.md).

## The fixed requirement

The ten SVG outlines already sent to the print house are the binding geometry. All proposed work is on painted references, guide illustrations, and their supporting build files. Do not edit, retrace, simplify, resize, replace, or re-export any production outline or supporting transfer file. An attractive new painting fails if its objects move away from the printed shapes.

The customer reference remains a full 8 x 10 portrait. Where an original is square, adapt its color, brushwork, lighting, and object detail to the existing portrait outline. Do not stretch the entire original, crop away required objects, or change the outline to fit the original. The approved portrait arrangement takes precedence over the square source arrangement.

## What I reviewed

- All seven supplied files in `C:/Users/mmcsherry/Desktop/New folder`, including the Fall View composite.
- All ten current root reference PDFs, guide PDFs, and SVG outlines, rendered for comparison.
- Enlarged details in the six kits represented by the supplied originals.
- Current guide plans, the shared guide builder, and the older gnome registration builder and related provenance notes.
- SHA-256 baselines for all 30 production files and all seven supplied originals. All were unchanged at the end of the review.
- The 20 production PDFs were each measured as one page: references 576 x 720 points; guides 612 x 792 points. This verifies their page sizes, not the correctness of painted detail.

The review files and measured results are in [the review directory](assets/tools/source-quality-review/2026-09-21/). [Baseline hashes](assets/tools/source-quality-review/2026-09-21/baseline-hashes.json), [PDF measurements](assets/tools/source-quality-review/2026-09-21/pdf-checks.json), and [pixel comparisons](assets/tools/source-quality-review/2026-09-21/source-pixel-comparison.json) are retained there.

## File-by-file findings and proposed treatment

| Supplied file | Size | Finding and proposed work |
| --- | --- | --- |
| `gnome-fall-finished-reference.png` | 1254 x 1254 | Highest priority. Current portrait has a broad brown smear between the left branch and lantern, absent chains/rings, incomplete shoe soles, ghosted hand/boot boundaries, and coarse leaf/beard edges. Restore these using the original's painted treatment within the existing outline. Restore the lantern frames and restrained light around them. Keep every branch, leaf, pumpkin, lantern, hand, boot, and hat in its current printed position. |
| `gnome-christmas-tree-finished-reference.png` | 2500 x 2500 | High priority. Current portrait has vertically smeared tree bottoms and shoe fronts, blunt shoe shading, uneven light-bulb edges, and poorly defined cord detail. Recover the original's clearer foliage, beard, leather, and lighting treatment while fitting the fixed portrait. Use the printed bulb locations/count; do not introduce new lights. Retain the current winter palette and compatible background. |
| `fall-view-finished-reference.png` | 1254 x 1254 | High priority. Original has more continuous sky strokes, clearer bark and rock texture, and natural foliage depth. Current reference has visible vertical color smears at the canopy's top edge, a dark smeared patch beside the trunk, hard cutout transitions, and a flatter sky. Restore texture and depth within the exact printed canopy, cloud, sun, ridge, tree, rock, and leaf shapes. |
| `fall-view-source-composite.png` | 910 x 607 | Same kit, supplementary evidence. Shows the original painting beside a tilted outline and branding. Use it to confirm the intended appearance; use the standalone painting above as the better artwork source. Do not import the composite's shadow, border, logo fragment, or tilted outline into the painting. |
| `starry-night-sunflower-finished-reference.png` | 1254 x 1254 | Medium priority. Current portrait remains recognizable but has softer/muddier green transitions, coarser petal boundaries, and reduced fine stroke detail. Restore the original's clean directional strokes and seed-head texture while preserving all printed petals, stems, leaves, both flower heads, and sky swirls. Keep intentional stippled seeds and painted strokes; those are not noise to blur away. |
| `flowers-in-vase-finished-reference-8x10.png` | 2400 x 3000 | The supplied original, current supporting PNG, and current root PDF render are exactly identical in RGB pixels. There is no quality loss to repair by swapping sources. Preserve this reference. Review guide finishing panels for heavy line overlays and abrupt transitions, keeping the original's softly blended petals. |
| `gnome-halloween-finished-reference-8x10.png` | 2400 x 3000 | Also exactly identical in RGB pixels to the current supporting PNG and root PDF render. Preserve the reference. Review guide detail panels for unnecessary heavy outlines/rough crop presentation without changing the painting, geometry, palette, or order of instruction. |

Fox Fall, Ghost Fall, Cat in Pumpkin, and Pumpkin have no matching original in this delivery. I inspected their current production sets at page scale; propose retaining them in this pass. They should not be regenerated using unrelated source art. Their existing centered arrangements remain as approved.

### Comparison evidence

Each comparison shows the supplied original in its native proportions, the current production reference, and the fixed production outline. These are review previews, not replacement artwork.

- [Fall Gnome comparison](assets/tools/source-quality-review/2026-09-21/gnome-fall/comparison.png) - [left branch/lantern defect](assets/tools/source-quality-review/2026-09-21/gnome-fall/branch-chain-detail.png) - [same area in the fixed outline](assets/tools/source-quality-review/2026-09-21/gnome-fall/branch-chain-outline.png).
- [Christmas Gnome comparison](assets/tools/source-quality-review/2026-09-21/gnome-christmas-tree/comparison.png) - [tree and shoe smears](assets/tools/source-quality-review/2026-09-21/gnome-christmas-tree/tree-bottom-shoes-detail.png).
- [Fall View comparison](assets/tools/source-quality-review/2026-09-21/fall-view/comparison.png) - [canopy smears](assets/tools/source-quality-review/2026-09-21/fall-view/canopy-smear-detail.png).
- [Sunflower comparison](assets/tools/source-quality-review/2026-09-21/starry-night-sunflower/comparison.png).
- [Flowers comparison](assets/tools/source-quality-review/2026-09-21/flowers-in-vase/comparison.png).
- [Halloween Gnome comparison](assets/tools/source-quality-review/2026-09-21/gnome-halloween/comparison.png).

## Why the current repairs need a different approach

The four adapted references were processed through 800 x 1000 working masters and enlarged to 2400 x 3000. That reduces available detail. The gnome builder also classifies regions by color, spreads nearby accepted pixels into other areas, and averages some areas over 45 passes. The visible smears are consistent with these operations. The prior sky-only repair did not fix these subject defects.

The proposed repair must therefore improve both artwork and the paint masks that control placement. Reusing the old masks without inspection could erase chains and shoe parts again. Open outline endpoints can be closed in a private paint mask for compositing, without adding or changing any transfer path.

## Work sequence after approval

1. **Protect and stage.** Recheck all baseline hashes; archive the current references, guides, and affected supporting sources before replacements. Copy each supplied source unchanged into its kit's supporting source area and verify its hash. Desktop originals and rollback folders remain untouched. New work stays in `info/assets/reference-restoration/` and `info/tmp/reference-restoration/` until it passes review.
2. **Start with Fall Gnome.** Create a fixed 2400 x 3000 geometry view from the existing SVG. Build and inspect masks for the left branch, chains/rings, lantern frames, hands, complete boot shapes, beard, leaves, and pumpkins. Use source-aware image editing for painted detail where necessary, then constrain the result to the approved shapes. Inspect a before/after proof and an outline overlay before extending the method to the other kits.
3. **Restore the remaining three adapted references.** Christmas Gnome next, then Fall View, then Sunflower. Preserve source brushwork where it can be aligned cleanly; reconstruct detail where the portrait differs. Use local edits and individually checked regions. Avoid whole-image smoothing and repeated enlargement. Record actual generated/source resolution; a 300-DPI export alone is not evidence of restored detail.
4. **Refresh every affected guide image from the accepted master.** Rebuild cumulative painting panels, mapped finishing crops, title previews, and the flat-drying image. Keep unpainted regions white until their stated step. Fall Gnome directions must explicitly cover the chains/rings and complete boots; Christmas directions must clearly show the light cord. Use the current paint list and explicit mixing recipes. Retain the shared Fall View layout, full logo, readable captions, and each kit's page colors.
5. **Check the two already-matching kits.** Retain Flowers and Halloween reference artwork. Make only supported guide-image cleanup, such as removing an unnecessary heavy overlay from a finishing crop; do not regenerate matching reference art merely to produce a changed file.
6. **Verify and promote together.** Once a reference and its guide both pass the checks below, replace only those two root PDFs. Refresh their corresponding supporting PNGs and working plans, including the shared builder's active kit entries. Record provenance and results in each kit's `info/README.md` and update the project index. Keep exactly the existing three production files at each kit root.

No image generation, production replacement, or guide rebuilding has been started. Approval of this plan authorizes the work above; the first Fall Gnome proof is a quality check within that work, not a request to change the outline.

## Acceptance checks

- Every production SVG hash must equal the recorded baseline before and after each kit's work. Also preserve all supporting transfer files. Any mismatch stops promotion.
- Overlay the current SVG on the candidate reference at identical scale and position. Check object silhouettes, placement, counts, branch connections, lantern chains, boot soles, faces, petals, and thin details. A file hash protects the SVG; this separate visual check protects painting-to-transfer alignment.
- No added objects or missing printed shapes. Paint-only highlights and texture may be added within the existing design. If the original has a feature inconsistent with the transfer, keep the transfer's geometry and document the conflict.
- Inspect page-size, native-resolution, and enlarged crops for unintended grain, blocks, smears, halos, stray shadows, doubled lines, missing detail, and ragged cutout edges. Preserve natural acrylic brush texture and intentional shadows.
- All guide panels must follow the same master and stage plan; finishing crops must map back to it. The final preview and drying panel must display that exact reference.
- Render final PDFs with the shared renderer and measure one 8 x 10 reference page and one US Letter guide page. Inspect the rendered pages and compare them to the matching current PNGs. Check caption readability, recipes, stage order, full logo, and safe margins.

## Cost-conscious delegation

GPT-5.6 Luna was assigned routine source/dependency inventory for this review. After approval, use it for bounded file matching, manifests, path updates, caption cross-checks, and measured export checks. Keep art direction, defect diagnosis, geometry acceptance, and final enlarged visual review with the primary agent. Use image generation only where it adds missing painted detail; avoid spending generations on the two references already identical to your originals. A cheaper text agent does not determine the quality setting of the image-generation service.

## Decision requested

Approve restoration of the four adapted references and their guides, starting with Fall Gnome; retain the two pixel-identical references with only justified guide cleanup; retain the four kits with no newly supplied original. All outlines remain fixed.
