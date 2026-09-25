from pathlib import Path
import hashlib
import json
import re

import numpy as np
from PIL import Image, ImageFilter
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[4]
KIT = ROOT / "Fox Fall"
WORK = KIT / "info/tmp/simplified"
ASSETS = KIT / "info/assets/simplified"
OUT = KIT / "info/output/simplified"
SLUG = "fox-fall"


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def page_size(reader):
    page = reader.pages[0]
    return [float(page.mediabox.width), float(page.mediabox.height)]


source = Image.open(ASSETS / f"{SLUG}-final-step-7.png").convert("RGB")
reference_pdf = PdfReader(WORK / f"{SLUG}-finished-reference-8x10.pdf")
reference_images = reference_pdf.pages[0].images
assert len(reference_images) == 1, "Reference should contain exactly one image"
embedded = reference_images[0].image.convert("RGB")
embedded_exact = np.array_equal(np.array(source), np.array(embedded))
assert embedded_exact, "Reference PDF image differs from original stage 7"

guide_pdf = PdfReader(WORK / f"{SLUG}-painting-guide-8x10.pdf")
assert len(guide_pdf.pages) == 1 and page_size(guide_pdf) == [612.0, 792.0]
assert len(reference_pdf.pages) == 1 and page_size(reference_pdf) == [576.0, 720.0]

guide_text = guide_pdf.pages[0].extract_text()
guide_text_lower = guide_text.lower()
assert not re.search(r"\bmix(?:ing|ed|es)?\b", guide_text_lower), "Mixing language found"
assert "paint colors provided:" in guide_text_lower
for color in [
    "orange",
    "ivory",
    "forest green",
    "golden yellow",
    "dark brown",
    "black",
    "white",
]:
    assert color in guide_text_lower, f"Missing provided color: {color}"
for step_number in range(1, 7):
    assert f"{step_number}." in guide_text, f"Missing step {step_number}"

reference_render = Image.open(
    OUT / f"{SLUG}-finished-reference-8x10.png"
).convert("RGB")
guide_render = Image.open(OUT / f"{SLUG}-painting-guide-8x10.png")
assert reference_render.size == (2400, 3000)
assert guide_render.size == (2550, 3300)

outline = Image.open(WORK / "unchanged-outline-render.png").convert("RGBA")
assert outline.size == reference_render.size
outline_alpha = np.array(outline)[:, :, 3]
reference_array = np.array(reference_render)
dark_linework = reference_array.max(axis=2) < 90
support = np.array(
    Image.fromarray(dark_linework.astype("uint8") * 255).filter(ImageFilter.MaxFilter(9))
) > 0
stroke = outline_alpha > 128
registration_fraction = float(support[stroke].mean())
assert registration_fraction > 0.97, (
    f"Outline support only {registration_fraction:.4f}"
)

cyan = Image.new("RGBA", outline.size, (0, 155, 205, 255))
cyan.putalpha(Image.fromarray(outline_alpha))
overlay = Image.alpha_composite(reference_render.convert("RGBA"), cyan)
overlay.save(WORK / "outline-registration-overlay.png")

sheet = Image.new("RGB", (1800, 750), "white")
white_outline = Image.new("RGBA", outline.size, "white")
white_outline.alpha_composite(outline)
for index, image in enumerate(
    [white_outline.convert("RGB"), reference_render, overlay.convert("RGB")]
):
    sheet.paste(
        image.resize((600, 750), Image.Resampling.LANCZOS),
        (index * 600, 0),
    )
sheet.save(WORK / "geometry-contact-sheet.png")

original_hashes = json.loads((WORK / "original-hashes.json").read_text())
assert all(sha256(ROOT / path) == digest for path, digest in original_hashes.items())

svg = (KIT / f"{SLUG}-outline-8x10.svg").read_text(encoding="utf-8")
assert 'width="8in" height="10in" viewBox="0 0 2400 3000"' in svg
assert 'stroke="#808080"' in svg
assert 'stroke-width="8.333333333333334"' in svg
assert "<image" not in svg and "<rect" not in svg

checks = {
    "referenceEmbeddedPixelsExactlyOriginalStep7": embedded_exact,
    "sourcePixels": list(source.size),
    "sourcePlacementOn2400x3000": [60, 360, 2280, 2280],
    "guidePagePoints": [612, 792],
    "referencePagePoints": [576, 720],
    "guideRenderPixels": list(guide_render.size),
    "referenceRenderPixels": list(reference_render.size),
    "outlineStrokePixels": int(stroke.sum()),
    "outlineStrokePixelsSupportedWithin4pxByReferenceLineworkFraction": registration_fraction,
    "sourceStageMapping": [1, 2, 3, 5, 6, 7],
    "mixingLanguageAbsent": True,
    "providedPaintsPresent": True,
    "originalProductionHashesUnchanged": True,
    "outlineTrueVectorNoBackground": True,
    "outlineInches": [8, 10],
    "outlineColor": "#808080",
    "outlineStrokePt": 2,
    "note": "Stage 7 is the exact simplified target. Texture and highlight stages 8-11 are omitted. The established square artwork remains centered without stretching. Existing teaching linework is retained; the approved transfer remains unchanged.",
}
(WORK / "verification.json").write_text(
    json.dumps(checks, indent=2), encoding="utf-8"
)
print(json.dumps(checks, indent=2))
