from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color, white
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from pypdf import PdfReader
from pathlib import Path

ROOT=Path('C:/Projects/Canvas Kits')
OUT=ROOT/'output/kinusaiga-flower/guide/sunflower-six-step-guide.pdf'
IMG=ROOT/'output/kinusaiga-flower/examples/sunflower.png'
c=canvas.Canvas(str(OUT),pagesize=(612,792))
c.setTitle('Sunflower Fabric Kit | Six-Step Assembly Guide')
c.setAuthor('River and Ridge')
ink=HexColor('#3B3024'); rust=HexColor('#A75130'); gold=HexColor('#D7A332'); green=HexColor('#66724B'); pale=HexColor('#F6F1E6')
def para(text,x,top,w,size=10.5,leading=14,color=ink):
    p=Paragraph(text,ParagraphStyle('p',fontName='Helvetica',fontSize=size,leading=leading,textColor=color))
    _,h=p.wrap(w,500);p.drawOn(c,x,top-h);return h
def line(x1,y1,x2,y2,color=ink,width=1):
    c.setStrokeColor(color);c.setLineWidth(width);c.line(x1,y1,x2,y2)
def label(t,x,y):
    c.setFillColor(ink);c.setFont('Helvetica',7.8);c.drawCentredString(x,y,t)
def leaf(x,y,scale=1,fill=green):
    c.saveState();c.translate(x,y);c.scale(scale,scale);c.setFillColor(fill);c.setStrokeColor(ink);c.setLineWidth(1)
    p=c.beginPath();p.moveTo(0,0);p.curveTo(0,33,22,53,53,55);p.curveTo(47,27,31,3,0,0);c.drawPath(p,fill=1,stroke=1)
    p=c.beginPath();p.moveTo(0,0);p.curveTo(18,21,30,28,53,55);c.drawPath(p,stroke=1)
    c.restoreState()
def visual(n,x,y):
    if n==1:
        cols=['#EEE3C8','#B76139','#E4B336','#8D522F','#83905E','#4D6039']
        for i,co in enumerate(cols):
            c.setFillColor(HexColor(co));c.setStrokeColor(white);c.rect(x+(i%3)*25,y+25-(i//3)*25,23,23,fill=1,stroke=1)
        label('Match the colors',x+36,y-14)
    elif n==2:
        c.setFillColor(HexColor('#EDD184'));c.setStrokeColor(rust);c.setDash(3,2);c.roundRect(x+2,y-2,70,62,15,fill=1,stroke=1);c.setDash()
        c.setStrokeColor(ink);c.roundRect(x+13,y+9,48,40,9,fill=0,stroke=1)
        line(x+61,y+29,x+72,y+29);line(x+61,y+25,x+61,y+33);line(x+72,y+25,x+72,y+33)
        label('Leave 1/4 in extra',x+37,y-17)
    elif n==3:
        c.setFillColor(HexColor('#E5DED1'));c.setStrokeColor(ink);c.rect(x,y+3,75,22,fill=1,stroke=1)
        c.setFillColor(white);c.rect(x+35,y+10,5,15,fill=1,stroke=0)
        c.setStrokeColor(rust);c.setLineWidth(3);p=c.beginPath();p.moveTo(x+3,y+28);p.lineTo(x+32,y+28);p.curveTo(x+37,y+28,x+37,y+19,x+37,y+15);c.drawPath(p)
        c.setStrokeColor(ink);c.setLineWidth(4);c.line(x+40,y+35,x+53,y+59);c.setLineWidth(1)
        line(x+20,y+50,x+20,y+35,rust);line(x+20,y+35,x+16,y+41,rust);line(x+20,y+35,x+24,y+41,rust)
        label('Side view: tuck gently',x+37,y-15)
    elif n==4:
        leaf(x+10,y+2,1.04);label('Follow each groove',x+37,y-15)
    elif n==5:
        c.saveState();c.translate(x+36,y+31);c.setStrokeColor(ink)
        for i in range(6):
            c.saveState();c.rotate(i*60);c.setFillColor(gold);c.ellipse(-9,8,9,34,fill=1,stroke=1);c.restoreState()
        c.setFillColor(HexColor('#925533'));c.circle(0,0,13,fill=1,stroke=1);c.restoreState()
        label('Petals, then center',x+37,y-15)
    else:
        c.drawImage(str(IMG),x+4,y-5,width=68,height=68)
        label('Check the finished picture',x+38,y-18)

c.setFillColor(pale);c.rect(0,610,612,182,fill=1,stroke=0)
c.drawImage(str(IMG),36,632,width=124,height=124)
c.setFillColor(rust);c.setFont('Helvetica-Bold',10);c.drawString(182,749,'FABRIC KIT  /  8 x 8 INCHES')
c.setFillColor(ink);c.setFont('Times-Bold',35);c.drawString(180,709,'Sunflower')
c.setFont('Helvetica',16);c.drawString(182,681,'Your six-step assembly guide')
para('Create the original golden sunflower by tucking fabric into the grooves. No sewing needed.',182,663,384,10.5,14)
para('<b>Gather:</b> your pre-grooved foam, supplied fabrics and color reference, plus small scissors and a blunt fabric-tucking tool.',36,594,540,10.7,14)

steps=[
('Sort & plan','Lay the foam flat. Match the fabrics to the reference: cream sky, rust ground, green stem and leaves, gold petals and a brown center. Keep each fabric beside its section.'),
('Trim one piece','Lay fabric over its section. Trim around the shape, leaving about <b>1/4 inch (6 mm) extra</b> on every side for tucking. Start generous; you can trim more later.'),
('Fill the background','Start with the cream sky, then the rust ground. Hold a piece smooth and gently tuck its edges into the grooves with a <b>blunt tool</b>. Work a little at a time on opposite sides; do not stretch.'),
('Add the greens','Cover the stem, then each leaf section, using the light and dark greens in the picture. Smooth from the middle outward. At curves and points, tuck small amounts; trim bulky excess carefully.'),
('Build the flower','Add the gold petal sections, alternating lighter and darker fabrics to match the reference. Follow each groove. Cover the brown center last. Keep fabric smooth while leaving enough edge to tuck securely.'),
('Neaten & finish','Check every groove and tuck in loose threads and edges, including the outside border. If an edge pulls out, lift and reset it; replace a piece cut too small. Brush away scraps and display your sunflower.')
]
for i,(title,body) in enumerate(steps):
    col=i%2;row=i//2;x=36+col*276;top=543-row*158
    c.setFillColor(HexColor('#FCFAF5'));c.setStrokeColor(HexColor('#DED4C3'));c.setLineWidth(.6);c.roundRect(x,top-148,264,148,9,fill=1,stroke=1)
    c.setFillColor(rust);c.circle(x+19,top-20,10,fill=1,stroke=0)
    c.setFillColor(white);c.setFont('Helvetica-Bold',11);c.drawCentredString(x+19,top-24,str(i+1))
    c.setFillColor(ink);c.setFont('Times-Bold',16);c.drawString(x+37,top-25,title)
    visual(i+1,x+12,top-109)
    h=para(body,x+98,top-41,154,10,13)
    assert h<=101,(i,h)

line(36,63,576,63,HexColor('#D5C5AB'),.6)
para('<b>Helpful tip:</b> Tuck with gentle pressure. If a groove feels crowded, lift the fabric and trim a little of the hidden allowance. Never force the tool or cut through the foam.',36,52,540,9.3,12)
c.showPage();c.save()
r=PdfReader(str(OUT));assert len(r.pages)==1;assert tuple(float(v) for v in r.pages[0].mediabox[2:])==(612,792)
print(OUT)
