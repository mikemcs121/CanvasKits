from pathlib import Path
import json, hashlib, shutil, subprocess
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from PIL import Image
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[4]
KIT = ROOT / 'Cat in Pumpkin'
WORK = KIT / 'info/tmp/simplified'
OUT = KIT / 'info/output/simplified'
DEST = KIT / 'simplified'
PLAN = json.loads((WORK / 'plan.json').read_text())
SLUG = 'cat-in-pumpkin'
for p in [OUT, DEST]: p.mkdir(parents=True, exist_ok=True)
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
originals = {str(p.relative_to(ROOT)): sha(p) for p in KIT.iterdir() if p.is_file()}
pdfmetrics.registerFont(TTFont('BrushTitle', str(ROOT / 'assets/fonts/KaushanScript-Regular.ttf')))
ink, accent, wash = [HexColor(s) for s in ['#343e4a', '#c77b47', '#faecdc']]
body = ParagraphStyle('body', fontName='Helvetica', fontSize=11.5, leading=14, textColor=ink, spaceAfter=4)
small = ParagraphStyle('small', fontName='Helvetica', fontSize=10, leading=12, alignment=1, textColor=ink)
layout = []
def paragraph(c, text, x, top, width, style=body):
    p=Paragraph(text, style); w,h=p.wrap(width, 1000); p.drawOn(c,x,top-h); return top-h
def stage(c, n, x, y, w, h, border=True):
    # Original square is mapped into the approved 4:5 canvas without distortion.
    c.drawImage(str(KIT / f'info/tmp/8x10-artwork/step-{n}.png'), x+w*.025, y+h*.12, width=w*.95, height=h*.76)
    if border:
        c.setStrokeColor(accent); c.setLineWidth(.45); c.rect(x,y,w,h)

# The approved simplified reference remains byte-for-byte unchanged.

guide=WORK/f'{SLUG}-painting-guide-8x10.pdf'
c=canvas.Canvas(str(guide),pagesize=(612,792),pageCompression=1)
c.setTitle('Cat in Pumpkin - simplified painting guide'); c.setAuthor('River and Ridge')
stage(c,6,24,682,68,85)
c.setFillColor(wash); c.roundRect(102,690,330,70,12,fill=1,stroke=0)
c.setFillColor(ink); c.setFont('BrushTitle',34); c.drawCentredString(267,722,'Cat in Pumpkin')
c.setFont('Times-Bold',15); c.drawCentredString(267,700,'Acrylic Painting Guide')
logo=KIT/'info/assets/template-refactor/river-and-ridge-logo.png'
lw,lh=Image.open(logo).size
c.drawImage(str(logo),442,709,146,146*lh/lw,mask='auto')
c.setFillColor(wash); c.roundRect(24,617,564,53,8,fill=1,stroke=0)
paragraph(c,'<b>Materials:</b> Preprinted 8 x 10 canvas, acrylic paints, large and small brushes<br/>Water cup, paper towels, palette or paper plate<br/><b>Paint colors provided:</b> '+', '.join(PLAN['paints']),32,663,548,small)
paragraph(c,PLAN['care'],24,606,564,small)
c.setStrokeColor(accent); c.setLineWidth(.4); c.line(306,64,306,584); c.line(24,356,588,356)
for i,s in enumerate(PLAN['steps']):
    x=24+(i%2)*294; top=584 if i<2 else 343; artH=112
    artW=artH*.8
    stage(c,s['sourceStep'],x+(270-artW)/2,top-artH,artW,artH)
    c.setFillColor(ink); c.setFont('Times-Bold',15)
    c.drawString(x,top-artH-20,f"{i+1}. {s['heading']}")
    cy=top-artH-29
    for text in s['paragraphs']: cy=paragraph(c,text,x,cy,270)-4
    minimum=364 if i<2 else 55
    if cy<minimum: raise RuntimeError(f'Step {i+1} overflows: {cy} < {minimum}')
    layout.append({'step':i+1,'originalStep':s['sourceStep'],'captionBottom':cy,'safeMinimum':minimum,'fontPoints':body.fontSize,'artPoints':[artW,artH]})
c.setFillColor(wash); c.roundRect(24,20,564,28,8,fill=1,stroke=0)
paragraph(c,PLAN['cleanup'],29,41,554,small)
c.showPage(); c.save()
for pdf,size in [(guide,[612,792])]:
    r=PdfReader(pdf)
    assert len(r.pages)==1 and [float(r.pages[0].mediabox.width),float(r.pages[0].mediabox.height)]==size
    (WORK/(pdf.stem+'-text.txt')).write_text(r.pages[0].extract_text())
    subprocess.run(['node',str(ROOT/'assets/tools/pdf-render/render-pdf.cjs'),str(pdf),str(OUT/(pdf.stem+'.png')),'--expect-pages','1','--expect-points',f'{size[0]}x{size[1]}','--checks',str(WORK/(pdf.stem+'-checks.json'))],cwd=ROOT,check=True)
(WORK/'layout-checks.json').write_text(json.dumps(layout,indent=2))
(WORK/'original-hashes.json').write_text(json.dumps(originals,indent=2))
print('Candidates rendered. Inspect before running promote.py.')
