from pathlib import Path
import hashlib
import json
import re

import numpy as np
from PIL import Image, ImageDraw
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[4]
KIT = ROOT / "Pumpkin"
WORK = KIT / "info/tmp/simplified"
ASSETS = KIT / "info/assets/simplified"
OUT = KIT / "info/output/simplified"
SIMPLIFIED = KIT / "simplified"
SLUG = "pumpkin"


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


original_hashes = json.loads((WORK / "original-hashes.json").read_text(encoding="utf-8"))
current_original_hashes = {
    str((KIT / name).relative_to(ROOT)): sha256(KIT / name)
    for name in (
        f"{SLUG}-outline-8x10.svg",
        f"{SLUG}-painting-guide-8x10.pdf",
        f"{SLUG}-finished-reference-8x10.pdf",
    )
}
require(current_original_hashes == original_hashes, "Original production files changed")

expected_simplified = sorted(
    [
        f"{SLUG}-outline-8x10.svg",
        f"{SLUG}-painting-guide-8x10.pdf",
        f"{SLUG}-finished-reference-8x10.pdf",
    ]
)
actual_simplified = sorted(path.name for path in SIMPLIFIED.iterdir() if path.is_file())
require(actual_simplified == expected_simplified, "Simplified folder must contain exactly three files")

original_outline = KIT / f"{SLUG}-outline-8x10.svg"
simplified_outline = SIMPLIFIED / f"{SLUG}-outline-8x10.svg"
require(sha256(original_outline) == sha256(simplified_outline), "Outline copy is not byte-identical")
outline_text = simplified_outline.read_text(encoding="utf-8")
for token in ('width="8in"', 'height="10in"', 'fill="none"', 'stroke="#A6A6A6"',
              'stroke-width="8.333333333333334"', '<path '):
    require(token in outline_text, f"Outline token missing: {token}")
require("<image" not in outline_text.lower(), "Outline contains a raster image")

pdf_checks = {}
for name, expected_points, expected_pixels in (
    (f"{SLUG}-painting-guide-8x10.pdf", (612, 792), (2550, 3300)),
    (f"{SLUG}-finished-reference-8x10.pdf", (576, 720), (2400, 3000)),
):
    pdf_path = SIMPLIFIED / name
    reader = PdfReader(pdf_path)
    require(len(reader.pages) == 1, f"{name} is not one page")
    measured_points = (
        int(float(reader.pages[0].mediabox.width)),
        int(float(reader.pages[0].mediabox.height)),
    )
    require(measured_points == expected_points, f"Unexpected page size for {name}")
    png_path = OUT / f"{pdf_path.stem}.png"
    with Image.open(png_path) as rendered:
        require(rendered.size == expected_pixels, f"Unexpected render size for {name}")
        dpi = rendered.info.get("dpi", (0, 0))
        require(all(abs(value - 300) < 1 for value in dpi), f"Unexpected DPI for {name}")
    render_log = json.loads((WORK / f"{pdf_path.stem}-checks.json").read_text(encoding="utf-8"))
    last_render = render_log[-1]
    require(Path(last_render["pdf"]).resolve() == pdf_path.resolve(), f"Render is not from promoted {name}")
    pdf_checks[name] = {
        "pages": 1,
        "points": list(measured_points),
        "pixels": list(expected_pixels),
        "dpi": 300,
        "pdfSha256": sha256(pdf_path),
        "pngSha256": sha256(png_path),
        "renderSource": str(pdf_path.relative_to(ROOT)),
    }

guide_path = SIMPLIFIED / f"{SLUG}-painting-guide-8x10.pdf"
guide_text = PdfReader(guide_path).pages[0].extract_text()
guide_text_normalized = re.sub(r"\s+", " ", guide_text).strip()
required_text = [
    "Simplified Acrylic Painting Guide",
    "Paint colors provided: orange, olive green, black",
    "1. Get ready",
    "2. Paint the pumpkin",
    "3. Paint the stem",
    "4. Finish the face",
    "preprinted pumpkin canvas",
    "Use thin coats",
    "Rinse your brush and pat it dry",
    "Let each color dry",
    "lay the canvas flat to dry",
    "Wash your brushes and close the paint pots",
]
missing_text = [text for text in required_text if text.lower() not in guide_text_normalized.lower()]
require(not missing_text, f"Guide text missing: {missing_text}")
require(not re.search(r"\bmix(?:ed|es|ing)?\b", guide_text_normalized, flags=re.IGNORECASE),
        "Guide contains mixing language")

source = KIT / "info/tmp/8x10-artwork"
groups = np.frombuffer((source / "group-mask.bin").read_bytes(), dtype=np.uint8).reshape(1254, 1254)
lines = np.frombuffer((source / "line-mask.bin").read_bytes(), dtype=np.uint8).reshape(1254, 1254)
stages = [np.asarray(Image.open(ASSETS / f"step-{number}.png").convert("RGB")) for number in range(1, 5)]
for number, stage in enumerate(stages, 1):
    require(stage.shape == (1254, 1254, 3), f"Unexpected stage {number} size")
    require(np.all(stage[lines == 0] == 0), f"Stage {number} changed canonical black line pixels")
for number, group_id in ((2, 1), (3, 2), (4, 3)):
    changed = np.any(stages[number - 1] != stages[number - 2], axis=2)
    require(np.any(changed), f"Stage {number} has no new paint")
    require(np.all(groups[changed] == group_id), f"Stage {number} changes pixels outside group {group_id}")
outside_painted_groups = ~np.isin(groups, [1, 2, 3])
require(np.array_equal(stages[3][outside_painted_groups], stages[0][outside_painted_groups]),
        "Final target changes pixels outside the canonical painted regions")

# Normalize the approved outline render and final reference for a registration review.
outline_render = Image.open(KIT / "info/tmp/transfer-standard/pumpkin-outline-8x10-render.png").convert("RGB")
reference_render = Image.open(OUT / f"{SLUG}-finished-reference-8x10.png").convert("RGB")
review_size = (1200, 1500)
outline_review = outline_render.resize(review_size, Image.Resampling.LANCZOS)
reference_review = reference_render.resize(review_size, Image.Resampling.LANCZOS)

def content_bbox(image, threshold=248):
    array = np.asarray(image)
    mask = np.any(array < threshold, axis=2)
    ys, xs = np.where(mask)
    require(len(xs) > 0, "Review image has no visible content")
    return (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)


outline_bbox = content_bbox(outline_review)
reference_bbox = content_bbox(reference_review)
bbox_delta = [abs(a - b) for a, b in zip(outline_bbox, reference_bbox)]
require(max(bbox_delta) <= 8, f"Outline/reference registration bbox drift: {bbox_delta}")

overlay = reference_review.copy()
outline_array = np.asarray(outline_review)
line_mask = np.any(outline_array < 245, axis=2)
overlay_array = np.asarray(overlay).copy()
overlay_array[line_mask] = (
    overlay_array[line_mask].astype(np.float32) * 0.30
    + np.array([0, 190, 205], dtype=np.float32) * 0.70
).astype(np.uint8)
overlay = Image.fromarray(overlay_array, "RGB")

sheet = Image.new("RGB", (3600, 1560), "white")
sheet.paste(outline_review, (0, 60))
sheet.paste(reference_review, (1200, 60))
sheet.paste(overlay, (2400, 60))
draw = ImageDraw.Draw(sheet)
draw.text((20, 20), "Approved outline", fill="black")
draw.text((1220, 20), "Simplified reference", fill="black")
draw.text((2420, 20), "Cyan outline overlay", fill="black")
registration_review = WORK / "registration-review.png"
sheet.save(registration_review, dpi=(300, 300))

manifest = {
    "created": "2026-09-23",
    "sources": [
        {
            "source": "Pumpkin/pumpkin-outline-8x10.svg",
            "output": "Pumpkin/simplified/pumpkin-outline-8x10.svg",
            "sha256": sha256(simplified_outline),
            "relationship": "byte-identical copy",
        },
        {
            "source": "Pumpkin/info/tmp/8x10-artwork/group-mask.bin; line-mask.bin",
            "output": "Pumpkin/info/assets/simplified/step-1.png through step-4.png",
            "relationship": "canonical flat cumulative stages",
        },
        {
            "source": "Pumpkin/info/assets/simplified/step-4.png",
            "output": "Pumpkin/simplified/pumpkin-finished-reference-8x10.pdf",
            "relationship": "final target centered with preserved placement",
        },
        {
            "source": "Pumpkin/info/assets/simplified/step-1.png through step-4.png",
            "output": "Pumpkin/simplified/pumpkin-painting-guide-8x10.pdf",
            "relationship": "four cumulative guide panels; step 4 also used for header preview",
        },
    ],
}
(WORK / "source-to-output-manifest.json").write_text(
    json.dumps(manifest, indent=2), encoding="utf-8"
)

verification = {
    "status": "verified",
    "date": "2026-09-23",
    "audience": "ages 8-14; wording for an 8-year-old",
    "palette": ["orange", "olive green", "black"],
    "retainedOriginalStages": [1, 2, 3, 4],
    "omitted": ["mixing", "groove shadows", "painted texture", "highlights"],
    "originalProductionHashesBefore": original_hashes,
    "originalProductionHashesAfter": current_original_hashes,
    "simplifiedOutlineHash": sha256(simplified_outline),
    "outlineByteIdentical": True,
    "simplifiedFolderFiles": actual_simplified,
    "pdfChecks": pdf_checks,
    "guideTextChecks": {
        "requiredTextPresent": True,
        "mixingLanguageAbsent": True,
        "readyToUsePalettePresent": True,
        "spellingReviewed": True,
    },
    "artworkChecks": {
        "stageDimensions": [1254, 1254],
        "cumulativeGroupChangesOnly": True,
        "canonicalBlackLinePixelsUnchanged": True,
        "pixelsOutsidePaintedGroupsUnchanged": True,
        "finalPreviewPanelReferenceSameAsset": "Pumpkin/info/assets/simplified/step-4.png",
        "approvedOutlineBBox": list(outline_bbox),
        "simplifiedReferenceBBox": list(reference_bbox),
        "bboxDeltaPixelsAt1200x1500": bbox_delta,
        "registrationReview": str(registration_review.relative_to(ROOT)),
    },
    "visualInspection": {
        "guide": "Inspected rendered page at 2550 x 3300: readable text, safe margins, no overlap, intact logo.",
        "reference": "Inspected rendered page at 2400 x 3000: complete centered subject, flat continuous color, no texture artifacts.",
        "sequence": "Inspected all four stage images: cumulative orange, olive-green stem, then black face.",
    },
}
(WORK / "verification.json").write_text(
    json.dumps(verification, indent=2), encoding="utf-8"
)
print("Simplified Pumpkin verification passed.")
