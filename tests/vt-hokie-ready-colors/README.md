# Hokie Sunset: ready-to-use color test

Requested October 19, 2026. This is a separate adult-kit experiment, not a replacement for the approved VT Hokie production set. The original outline, guide, reference and editable assets remain unchanged.

## Review files

- [Test guide](vt-hokie-test-painting-guide-10x8.pdf): one US Letter page, eight illustrated steps and a plain list of the eight supplied colors.
- [Test reference](vt-hokie-test-finished-reference-10x8.pdf): one 10 x 8-inch landscape page. Print at Actual size / 100%.
- The existing transfer remains `../../VT Hokie/vt-hokie-outline-10x8.svg`; no new transfer is required.

The original seven ready-to-use paints become eight by adding peach as a supplied sunset transition. Three separate blues are supplied for the three mountain bands. There are no palette-mixing recipes, additional shadow paints or highlight paints. Light feathering where cream, peach and orange meet on the canvas is still used; an exact smooth gradient is not required.

| Supplied color | Use |
| --- | --- |
| Cream | Upper sky |
| Peach | Middle sunset |
| Orange | Lower sunset and complete emblem border |
| Light blue | Highest, farthest mountain band |
| Medium blue | Middle mountain band |
| Dark blue | Lowest, nearest mountain band |
| Maroon | Emblem and small inner marks |
| White | HokieBird details |

`palette.json` records digital swatch targets, not a tested physical paint-brand match. The reference is a clean vector color study rendered from the approved outline's registered canonical masks, rather than a modified copy of the textured approved painting. Its mountains and emblem deliberately show even base colors. The sky uses only the three supplied warm color endpoints with soft transitions. Composition, closed border contours, white features and horizontal proportions follow the approved geometry.

## Rebuild

Run from the project root:

```powershell
node tests/vt-hokie-ready-colors/src/build.cjs
```

The builder validates the approved outline binding before generating test artwork. `src/guide-pdf.cjs` writes the illustrated guide with vector serif text and a rendered brush-script title; no browser is required. All seven cumulative stages, the guide preview and the drying panel use the same test artwork. `assets/` holds the rebuildable test reference and stage pictures. `assets/page-logo.png` is the transparent Hokie Sunset logo variant, generated from the unchanged shared logo and this test reference: cream ribbons, maroon lettering, orange trim, sunset, blue mountain bands, river and a small Hokie emblem. The guide preserves its native aspect ratio. The original shared and production logos are unchanged; retain this image as the editable replacement source for the guide.

Measured PDF page checks, production-file hashes and review renders are written outside the kit to `tmp/vt-palette-review/`. Original root deliverables are hashed before and after each build; any change fails the build. This is a digital review, not a physical painting or transfer trial.
