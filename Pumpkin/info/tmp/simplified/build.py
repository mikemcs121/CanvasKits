from pathlib import Path
import hashlib
import json
import subprocess

import numpy as np
from PIL import Image
from pypdf import PdfReader
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[4]
KIT = ROOT / "Pumpkin"
WORK = KIT / "info/tmp/simplified"
ASSETS = KIT / "info/assets/simplified"
OUT = KIT / "info/output/simplified"
PLAN = json.loads((WORK / "plan.json").read_text(encoding="utf-8"))
SLUG = "pumpkin"

for folder in (ASSETS, OUT):
    folder.mkdir(parents=True, exist_ok=True)


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


original_names = [
    f"{SLUG}-outline-8x10.svg",
    f"{SLUG}-painting-guide-8x10.pdf",
    f"{SLUG}-finished-reference-8x10.pdf",
]
originals = {
    str((KIT / name).relative_to(ROOT)): sha256(KIT / name)
    for name in original_names
}
(WORK / "original-hashes.json").write_text(
    json.dumps(originals, indent=2), encoding="utf-8"
)

# Build four flat cumulative stages from the current native region and line masks.
source = KIT / "info/tmp/8x10-artwork"
width = height = 1254
groups = np.frombuffer((source / "group-mask.bin").read_bytes(), dtype=np.uint8)
lines = np.frombuffer((source / "line-mask.bin").read_bytes(), dtype=np.uint8)
if groups.size != width * height or lines.size != width * height:
    raise RuntimeError("Unexpected Pumpkin native mask dimensions")

colors = {
    1: np.array([239, 101, 13], dtype=np.float32),  # orange
    2: np.array([126, 108, 55], dtype=np.float32),  # olive green
    3: np.array([25, 20, 18], dtype=np.float32),    # black
}
stage_groups = [(), (1,), (1, 2), (1, 2, 3)]
line_scale = lines.astype(np.float32)[:, None] / 255.0

for number, painted in enumerate(stage_groups, 1):
    image = np.repeat(lines[:, None], 3, axis=1).astype(np.float32)
    for group_id in painted:
        selected = groups == group_id
        image[selected] = colors[group_id] * line_scale[selected]
    image = np.clip(np.rint(image), 0, 255).astype(np.uint8).reshape(height, width, 3)
    Image.fromarray(image, "RGB").save(
        ASSETS / f"step-{number}.png", dpi=(300, 300)
    )

final_target = ASSETS / "step-4.png"

pdfmetrics.registerFont(
    TTFont("BrushTitle", str(ROOT / "assets/fonts/KaushanScript-Regular.ttf"))
)

ink = HexColor("#513922")
accent = HexColor("#c9813e")
wash = HexColor("#f7ead8")
ribbon = HexColor("#f5e3c3")
body = ParagraphStyle(
    "body",
    fontName="Helvetica",
    fontSize=11.0,
    leading=13.2,
    textColor=ink,
    spaceAfter=3,
)
small = ParagraphStyle(
    "small",
    fontName="Helvetica",
    fontSize=9.8,
    leading=11.8,
    alignment=1,
    textColor=ink,
)

layout = []


def draw_paragraph(pdf, text, x, top, width_points, style=body):
    paragraph = Paragraph(text, style)
    _, paragraph_height = paragraph.wrap(width_points, 1000)
    paragraph.drawOn(pdf, x, top - paragraph_height)
    return top - paragraph_height


def draw_stage(pdf, step_number, x, y, width_points, height_points, border=True):
    image_path = ASSETS / f"step-{step_number}.png"
    # Preserve the established centered square artwork on the 4:5 canvas.
    pdf.drawImage(
        str(image_path),
        x + width_points * 0.025,
        y + height_points * 0.12,
        width=width_points * 0.95,
        height=height_points * 0.76,
    )
    if border:
        pdf.setStrokeColor(accent)
        pdf.setLineWidth(0.45)
        pdf.rect(x, y, width_points, height_points)


reference = WORK / f"{SLUG}-finished-reference-8x10.pdf"
pdf = canvas.Canvas(str(reference), pagesize=(576, 720), pageCompression=1)
pdf.setTitle("Autumn Pumpkin - simplified finished reference")
pdf.setAuthor("River and Ridge")
draw_stage(pdf, 4, 0, 0, 576, 720, False)
pdf.showPage()
pdf.save()

guide = WORK / f"{SLUG}-painting-guide-8x10.pdf"
pdf = canvas.Canvas(str(guide), pagesize=(612, 792), pageCompression=1)
pdf.setTitle("Autumn Pumpkin - simplified painting guide")
pdf.setAuthor("River and Ridge")

draw_stage(pdf, 4, 24, 682, 68, 85)
pdf.setFillColor(wash)
pdf.roundRect(102, 690, 330, 70, 12, fill=1, stroke=0)
pdf.setFillColor(ink)
pdf.setFont("BrushTitle", 33)
pdf.drawCentredString(267, 722, "Autumn Pumpkin")
pdf.setFont("Times-Bold", 15)
pdf.drawCentredString(267, 700, "Simplified Acrylic Painting Guide")

logo = KIT / "info/assets/template-refactor/river-and-ridge-logo.png"
logo_width, logo_height = Image.open(logo).size
pdf.drawImage(
    str(logo),
    442,
    710,
    146,
    146 * logo_height / logo_width,
    mask="auto",
)

pdf.setFillColor(ribbon)
pdf.roundRect(24, 620, 564, 52, 8, fill=1, stroke=0)
materials = (
    "<b>Materials:</b> Preprinted 8 x 10 canvas, acrylic paints, large and small brushes<br/>"
    "Water cup, paper towels, palette or paper plate<br/>"
    "<b>Paint colors provided:</b> " + ", ".join(PLAN["paints"])
)
draw_paragraph(pdf, materials, 31, 666, 550, small)
draw_paragraph(pdf, PLAN["care"], 24, 607, 564, small)

pdf.setStrokeColor(accent)
pdf.setLineWidth(0.4)
pdf.line(306, 70, 306, 574)
pdf.line(24, 316, 588, 316)

cells = [
    (24, 574, 270, 326),
    (318, 574, 270, 326),
    (24, 306, 270, 66),
    (318, 306, 270, 66),
]

for index, step in enumerate(PLAN["steps"]):
    x, top, cell_width, safe_minimum = cells[index]
    art_height = 130
    art_width = art_height * 0.8
    draw_stage(
        pdf,
        index + 1,
        x + (cell_width - art_width) / 2,
        top - art_height,
        art_width,
        art_height,
    )
    pdf.setFillColor(ink)
    pdf.setFont("Times-Bold", 14.2)
    pdf.drawString(x, top - art_height - 19, f"{index + 1}. {step['heading']}")
    cursor = top - art_height - 30
    for paragraph_text in step["paragraphs"]:
        cursor = draw_paragraph(pdf, paragraph_text, x, cursor, cell_width) - 4
    if cursor < safe_minimum:
        raise RuntimeError(
            f"Step {index + 1} overflows: {cursor:.1f} < {safe_minimum}"
        )
    layout.append(
        {
            "step": index + 1,
            "sourceStages": step["sourceStages"],
            "captionBottom": round(cursor, 2),
            "safeMinimum": safe_minimum,
            "fontPoints": body.fontSize,
            "artPoints": [art_width, art_height],
        }
    )

pdf.setFillColor(wash)
pdf.roundRect(24, 32, 564, 28, 8, fill=1, stroke=0)
draw_paragraph(pdf, PLAN["cleanup"], 29, 53, 554, small)
pdf.setFillColor(ink)
pdf.setFont("Helvetica", 9.5)
pdf.drawCentredString(306, 18, "www.randrpaintyourown.com | @randrpaintyourown | info@randrpaintyourown.com")
pdf.showPage()
pdf.save()

node = ROOT / "assets/tools/pdf-render/render-pdf.cjs"
for pdf_path, size in ((guide, (612, 792)), (reference, (576, 720))):
    reader = PdfReader(pdf_path)
    measured = (
        float(reader.pages[0].mediabox.width),
        float(reader.pages[0].mediabox.height),
    )
    if len(reader.pages) != 1 or measured != size:
        raise RuntimeError(f"Unexpected PDF page geometry for {pdf_path.name}")
    (WORK / f"{pdf_path.stem}-text.txt").write_text(
        reader.pages[0].extract_text(), encoding="utf-8"
    )
    subprocess.run(
        [
            "node",
            str(node),
            str(pdf_path),
            str(OUT / f"{pdf_path.stem}.png"),
            "--expect-pages",
            "1",
            "--expect-points",
            f"{size[0]}x{size[1]}",
            "--checks",
            str(WORK / f"{pdf_path.stem}-checks.json"),
        ],
        cwd=ROOT,
        check=True,
    )

(WORK / "layout-checks.json").write_text(
    json.dumps(layout, indent=2), encoding="utf-8"
)
print("Simplified Pumpkin candidates built and rendered. Inspect before promotion.")
