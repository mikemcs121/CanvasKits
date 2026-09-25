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
KIT = ROOT / "Ghost Fall"
WORK = KIT / "info/tmp/simplified"
ASSETS = KIT / "info/assets/simplified"
OUT = KIT / "info/output/simplified"
PLAN = json.loads((WORK / "plan.json").read_text(encoding="utf-8"))
SLUG = "ghost-fall"

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

# Build flat cumulative stages from the existing native region and line masks.
source = KIT / "info/tmp/8x10-artwork"
width = height = 1254
groups = np.frombuffer((source / "group-mask.bin").read_bytes(), dtype=np.uint8)
lines = np.frombuffer((source / "line-mask.bin").read_bytes(), dtype=np.uint8)
if groups.size != width * height or lines.size != width * height:
    raise RuntimeError("Unexpected Ghost native mask dimensions")

colors = {
    1: np.array([248, 242, 224], dtype=np.float32),  # ivory
    2: np.array([111, 54, 105], dtype=np.float32),   # plum purple
    3: np.array([239, 117, 24], dtype=np.float32),   # orange
    4: np.array([99, 99, 46], dtype=np.float32),     # olive green
    5: np.array([227, 146, 127], dtype=np.float32),  # coral pink
}
stage_groups = [(), (1,), (1, 2), (1, 2, 3, 4), (1, 2, 3, 4, 5)]
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

final_target = ASSETS / "step-5.png"

pdfmetrics.registerFont(
    TTFont("BrushTitle", str(ROOT / "assets/fonts/KaushanScript-Regular.ttf"))
)

ink = HexColor("#4f3b53")
accent = HexColor("#8b7088")
wash = HexColor("#f0e9ef")
ribbon = HexColor("#eee4ee")
body = ParagraphStyle(
    "body",
    fontName="Helvetica",
    fontSize=10.8,
    leading=13.1,
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


def draw_paragraph(pdf, text, x, top, width, style=body):
    paragraph = Paragraph(text, style)
    _, paragraph_height = paragraph.wrap(width, 1000)
    paragraph.drawOn(pdf, x, top - paragraph_height)
    return top - paragraph_height


def draw_stage(pdf, step_number, x, y, width_points, height_points, border=True):
    image_path = ASSETS / f"step-{step_number}.png"
    # Place the established square subject inside the approved 4:5 canvas.
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
pdf.setTitle("Autumn Ghost - simplified finished reference")
pdf.setAuthor("River and Ridge")
draw_stage(pdf, 5, 0, 0, 576, 720, False)
pdf.showPage()
pdf.save()

guide = WORK / f"{SLUG}-painting-guide-8x10.pdf"
pdf = canvas.Canvas(str(guide), pagesize=(612, 792), pageCompression=1)
pdf.setTitle("Autumn Ghost - simplified painting guide")
pdf.setAuthor("River and Ridge")

draw_stage(pdf, 5, 24, 682, 68, 85)
pdf.setFillColor(wash)
pdf.roundRect(102, 690, 330, 70, 12, fill=1, stroke=0)
pdf.setFillColor(ink)
pdf.setFont("BrushTitle", 34)
pdf.drawCentredString(267, 722, "Autumn Ghost")
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
draw_paragraph(pdf, PLAN["care"], 24, 608, 564, small)

pdf.setStrokeColor(accent)
pdf.setLineWidth(0.4)
pdf.line(207, 324, 207, 584)
pdf.line(397, 324, 397, 584)
pdf.line(24, 318, 588, 318)
pdf.line(306, 58, 306, 312)

cells = [
    (24, 584, 174, 316),
    (214, 584, 174, 316),
    (404, 584, 174, 316),
    (24, 306, 270, 54),
    (318, 306, 270, 54),
]

for index, step in enumerate(PLAN["steps"]):
    x, top, cell_width, safe_minimum = cells[index]
    art_height = 128 if index < 3 else 136
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
    pdf.setFont("Times-Bold", 13.4 if index < 3 else 14.2)
    pdf.drawString(x, top - art_height - 19, f"{index + 1}. {step['heading']}")
    cursor = top - art_height - 29
    for paragraph_text in step["paragraphs"]:
        cursor = draw_paragraph(pdf, paragraph_text, x, cursor, cell_width) - 3
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
pdf.roundRect(24, 20, 564, 28, 8, fill=1, stroke=0)
draw_paragraph(pdf, PLAN["cleanup"], 29, 41, 554, small)
pdf.showPage()
pdf.save()

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
            str(ROOT / "assets/tools/pdf-render/render-pdf.cjs"),
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
print("Simplified Ghost candidates built and rendered. Inspect before promotion.")
