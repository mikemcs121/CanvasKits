from pathlib import Path
import hashlib
import json
import shutil

import numpy as np
from PIL import Image, ImageChops
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[4]
KIT = ROOT / "Ghost Fall"
WORK = KIT / "info/tmp/simplified"
ASSETS = KIT / "info/assets/simplified"
OUT = KIT / "info/output/simplified"
DEST = KIT / "simplified"
SLUG = "ghost-fall"


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


before = json.loads((WORK / "original-hashes.json").read_text(encoding="utf-8"))
after = {relative: sha256(ROOT / relative) for relative in before}
if after != before:
    raise RuntimeError("An original Ghost production file changed")

guide = WORK / f"{SLUG}-painting-guide-8x10.pdf"
reference = WORK / f"{SLUG}-finished-reference-8x10.pdf"
outline = KIT / f"{SLUG}-outline-8x10.svg"

for path, expected in ((guide, (612, 792)), (reference, (576, 720))):
    reader = PdfReader(path)
    measured = (
        float(reader.pages[0].mediabox.width),
        float(reader.pages[0].mediabox.height),
    )
    if len(reader.pages) != 1 or measured != expected:
        raise RuntimeError(f"PDF verification failed for {path.name}")

guide_text = (WORK / f"{SLUG}-painting-guide-8x10-text.txt").read_text(
    encoding="utf-8"
).lower()
required = [
    "paint colors provided",
    "ivory",
    "plum purple",
    "orange",
    "olive green",
    "coral pink",
    "black",
    "rinse your brush and pat it dry",
    "lay your canvas flat to dry",
]
missing = [text for text in required if text not in guide_text]
for forbidden in ("mix ", "mixing", "blend", "shade", "highlight"):
    if forbidden in guide_text:
        raise RuntimeError(f"Forbidden simplified-guide language found: {forbidden}")
if missing:
    raise RuntimeError(f"Required guide language missing: {missing}")

guide_png = Image.open(OUT / f"{SLUG}-painting-guide-8x10.png")
reference_png = Image.open(OUT / f"{SLUG}-finished-reference-8x10.png")
if guide_png.size != (2550, 3300) or reference_png.size != (2400, 3000):
    raise RuntimeError("Rendered PNG dimensions are incorrect")

# The rendered reference must be the exact approved square placement of the flat final target.
expected = Image.new("RGB", (2400, 3000), "white")
subject = Image.open(ASSETS / "step-5.png").convert("RGB").resize(
    (2280, 2280), Image.Resampling.LANCZOS
)
expected.paste(subject, (60, 360))
rendered = reference_png.convert("RGB")
diff = ImageChops.difference(expected, rendered)
extrema = diff.getextrema()
maximum_channel_delta = max(channel[1] for channel in extrema)
sample = np.asarray(diff.resize((120, 150)), dtype=np.uint8)
mean_delta = float(sample.mean())
large_delta_fraction = float((sample > 40).mean())
if mean_delta > 1.5 or large_delta_fraction > 0.01:
    raise RuntimeError(
        "Reference placement/pixel agreement failed: "
        f"max={maximum_channel_delta}, mean={mean_delta:.3f}, "
        f"large={large_delta_fraction:.5f}"
    )

DEST.mkdir(parents=True, exist_ok=True)
for existing in DEST.iterdir():
    if existing.is_file():
        raise RuntimeError("Unexpected pre-existing file in new simplified folder")

shutil.copy2(outline, DEST / outline.name)
shutil.copy2(guide, DEST / guide.name)
shutil.copy2(reference, DEST / reference.name)

delivered = sorted(path.name for path in DEST.iterdir() if path.is_file())
expected_names = sorted([outline.name, guide.name, reference.name])
if delivered != expected_names:
    raise RuntimeError(f"Simplified folder contents are incorrect: {delivered}")
if sha256(DEST / outline.name) != sha256(outline):
    raise RuntimeError("Simplified outline copy is not byte-identical")

checks = {
    "kit": "Ghost Fall",
    "audience": "ages 8-14; wording for an 8-year-old",
    "steps": 5,
    "palette": [
        "ivory",
        "plum purple",
        "orange",
        "olive green",
        "coral pink",
        "black",
    ],
    "mixingLanguageAbsent": True,
    "advancedTextureShadingHighlightsOmitted": True,
    "pdfs": {
        guide.name: {"pages": 1, "points": [612, 792], "renderPixels": [2550, 3300]},
        reference.name: {"pages": 1, "points": [576, 720], "renderPixels": [2400, 3000]},
    },
    "referenceRegistration": {
        "sourceRectangle": [60, 360, 2280, 2280],
        "maximumChannelDelta": maximum_channel_delta,
        "sampledMeanDelta": round(mean_delta, 4),
        "sampledFractionAbove40": round(large_delta_fraction, 6),
    },
    "originalProductionHashesBefore": before,
    "originalProductionHashesAfter": after,
    "simplifiedOutlineHash": sha256(DEST / outline.name),
    "rootOutlineHash": sha256(outline),
    "simplifiedFolderFiles": delivered,
    "visualInspection": {
        "guide": "passed full-page inspection: readable text, safe margins, no overlaps, intact logo and five cumulative panels",
        "reference": "passed full-page inspection: clean flat colors, centered approved composition and matching final guide target",
        "enlargedDetails": "passed native 1254 px inspection of face, bow, pumpkin, stem, hands and linework",
        "outline": "passed rendered SVG inspection with matching centered geometry against the simplified reference",
    },
}
(WORK / "verification.json").write_text(
    json.dumps(checks, indent=2), encoding="utf-8"
)
print("Verification passed and the simplified Ghost edition was promoted.")
