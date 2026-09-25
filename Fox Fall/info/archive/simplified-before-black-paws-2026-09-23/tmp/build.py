from pathlib import Path
import hashlib
import json
import shutil
import subprocess

from PIL import Image
from pypdf import PdfReader
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[4]
KIT = ROOT / "Fox Fall"
WORK = KIT / "info/tmp/simplified"
ASSETS = KIT / "info/assets/simplified"
OUT = KIT / "info/output/simplified"
PLAN = json.loads((WORK / "plan.json").read_text(encoding="utf-8"))
SLUG = "fox-fall"

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

final_target = ASSETS / f"{SLUG}-final-step-7.png"
shutil.copy2(KIT / "info/tmp/8x10-artwork/step-7.png", final_target)

pdfmetrics.registerFont(
    TTFont("BrushTitle", str(ROOT / "assets/fonts/KaushanScript-Regular.ttf"))
)

ink = HexColor("#4f3b26")
accent = HexColor("#ba773a")
wash = HexColor("#f6ebd6")
ribbon = HexColor("#f7e4bd")
body = ParagraphStyle(
    "body",
    fontName="Helvetica",
    fontSize=10.2,
    leading=12.2,
    textColor=ink,
    spaceAfter=3,
)
small = ParagraphStyle(
    "small",
    fontName="Helvetica",
    fontSize=9.6,
    leading=11.5,
    alignment=1,
    textColor=ink,
)

layout = []


def draw_paragraph(pdf, text, x, top, width, style=body):
    paragraph = Paragraph(text, style)
    _, height = paragraph.wrap(width, 1000)
    paragraph.drawOn(pdf, x, top - height)
    return top - height


def source_for_step(source_step):
    if source_step == 7:
        return final_target
    return KIT / f"info/tmp/8x10-artwork/step-{source_step}.png"


def draw_stage(pdf, source_step, x, y, width, height, border=True):
    # Place the established square source inside the 4:5 canvas without stretching.
    image_path = source_for_step(source_step)
    pdf.drawImage(
        str(image_path),
        x + width * 0.025,
        y + height * 0.12,
        width=width * 0.95,
        height=height * 0.76,
    )
    if border:
        pdf.setStrokeColor(accent)
        pdf.setLineWidth(0.45)
        pdf.rect(x, y, width, height)


reference = WORK / f"{SLUG}-finished-reference-8x10.pdf"
pdf = canvas.Canvas(str(reference), pagesize=(576, 720), pageCompression=1)
pdf.setTitle("Autumn Fox - simplified finished reference")
pdf.setAuthor("River and Ridge")
draw_stage(pdf, 7, 0, 0, 576, 720, False)
pdf.showPage()
pdf.save()

guide = WORK / f"{SLUG}-painting-guide-8x10.pdf"
pdf = canvas.Canvas(str(guide), pagesize=(612, 792), pageCompression=1)
pdf.setTitle("Autumn Fox - simplified painting guide")
pdf.setAuthor("River and Ridge")

draw_stage(pdf, 7, 24, 682, 68, 85)
pdf.setFillColor(wash)
pdf.roundRect(102, 690, 330, 70, 12, fill=1, stroke=0)
pdf.setFillColor(ink)
pdf.setFont("BrushTitle", 34)
pdf.drawCentredString(267, 722, "Autumn Fox")
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
pdf.roundRect(24, 621, 564, 51, 8, fill=1, stroke=0)
materials = (
    "<b>Materials:</b> Preprinted 8 x 10 canvas, acrylic paints, large and small brushes<br/>"
    "Water cup, paper towels, palette or paper plate<br/>"
    "<b>Paint colors provided:</b> " + ", ".join(PLAN["paints"])
)
draw_paragraph(pdf, materials, 31, 666, 550, small)
draw_paragraph(pdf, PLAN["care"], 24, 609, 564, small)

pdf.setStrokeColor(accent)
pdf.setLineWidth(0.4)
pdf.line(207, 58, 207, 584)
pdf.line(397, 58, 397, 584)
pdf.line(24, 330, 588, 330)

cell_x = [24, 214, 404]
row_tops = [584, 318]
cell_width = 174
art_height = 126
art_width = art_height * 0.8

for index, step in enumerate(PLAN["steps"]):
    column = index % 3
    row = index // 3
    x = cell_x[column]
    top = row_tops[row]
    draw_stage(
        pdf,
        step["sourceStep"],
        x + (cell_width - art_width) / 2,
        top - art_height,
        art_width,
        art_height,
    )
    pdf.setFillColor(ink)
    pdf.setFont("Times-Bold", 13.2)
    pdf.drawString(x, top - art_height - 18, f"{index + 1}. {step['heading']}")
    cursor = top - art_height - 28
    for paragraph_text in step["paragraphs"]:
        cursor = draw_paragraph(pdf, paragraph_text, x, cursor, cell_width) - 3
    safe_minimum = 339 if row == 0 else 56
    if cursor < safe_minimum:
        raise RuntimeError(
            f"Step {index + 1} overflows: {cursor:.1f} < {safe_minimum}"
        )
    layout.append(
        {
            "step": index + 1,
            "originalStep": step["sourceStep"],
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
    assert len(reader.pages) == 1 and measured == size
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
print("Candidates built and rendered. Inspect them before promotion.")
