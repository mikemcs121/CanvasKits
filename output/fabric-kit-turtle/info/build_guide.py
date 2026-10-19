from build import *
c=canvas.Canvas(str(ROOT/'turtle-six-step-guide.pdf'),pagesize=(612,792))
c.setTitle('Turtle Fabric Kit - Six-Step Assembly Guide')
ink=HexColor('#243C3C');accent=HexColor('#357B82')
def text(s,x,top,w,size=10,leading=13):
 p=Paragraph(s,ParagraphStyle('p',fontName='Helvetica',fontSize=size,leading=leading,textColor=ink));_,h=p.wrap(w,500);p.drawOn(c,x,top-h);return h
c.setFillColor(HexColor('#EBF3ED'));c.rect(0,610,612,182,fill=1,stroke=0)
art(c,36,632,124,True)
c.setFillColor(accent);c.setFont('Helvetica-Bold',10);c.drawString(182,749,'FABRIC KIT / 8 x 8 INCHES')
c.setFillColor(ink);c.setFont('Times-Bold',35);c.drawString(180,709,'Sea Turtle')
c.setFont('Helvetica',16);c.drawString(182,681,'Your six-step assembly guide')
text('Build a peaceful turtle picture by tucking fabric into the grooves. No sewing needed.',182,663,380,10.5,14)
text('<b>Gather:</b> your pre-grooved foam, supplied fabrics and color reference, plus small scissors and a blunt fabric-tucking tool.',36,594,540,10.7,14)
steps=[
('Sort & plan','Lay the foam flat. Match the blue and aqua fabrics to the water. Set aside green fabrics for the head, flippers and tail, and olive and gold-green fabrics for the shell.'),
('Trim one piece','Lay fabric over its section. Trim around it, leaving about <b>1/4 inch (6 mm) extra</b> on every side for tucking. Start generous and trim more only if needed.'),
('Fill the water','Start with the large water sections. Hold each fabric piece smooth and gently tuck the edges into the grooves with a <b>blunt tool</b>. Work a little at a time on opposite sides. Do not stretch.'),
('Add the turtle','Cover the head, four flippers and small tail with the green fabrics. Smooth from the middle outward. Around curves and narrow ends, tuck small amounts and trim bulky excess carefully.'),
('Fill the shell','Cover the six outer shell sections, alternating olive and gold-green as shown. Finish with the lighter center section. Tuck both neighboring fabric edges into their shared groove, keeping the joins neat.'),
('Neaten & finish','Check every groove and tuck in loose threads and edges, including the outside border. Lift and reset any loose edge. Replace a piece cut too small. Brush away scraps and display your turtle.')]
for i,(title,body) in enumerate(steps):
 x=36+(i%2)*276;top=543-(i//2)*158
 c.setFillColor(HexColor('#F8FBF8'));c.setStrokeColor(HexColor('#CEDDD7'));c.setLineWidth(.6);c.roundRect(x,top-148,264,148,9,fill=1,stroke=1)
 c.setFillColor(accent);c.circle(x+19,top-20,10,fill=1,stroke=0)
 c.setFillColor(white);c.setFont('Helvetica-Bold',11);c.drawCentredString(x+19,top-24,str(i+1))
 c.setFillColor(ink);c.setFont('Times-Bold',16);c.drawString(x+37,top-25,title)
 if i==0:
  for j,co in enumerate(['#D3ECE8','#71B6C4','#B4DCD6','#95AD61','#8B9A53','#C6BC75']):
   c.setFillColor(HexColor(co));c.rect(x+12+(j%3)*25,top-72-(j//3)*25,23,23,fill=1,stroke=0)
 elif i==1:
  c.setFillColor(HexColor('#C6BC75'));c.setStrokeColor(accent);c.setDash(3,2);c.roundRect(x+14,top-108,70,62,14,fill=1,stroke=1);c.setDash()
  c.setStrokeColor(ink);c.roundRect(x+25,top-97,48,40,9,fill=0,stroke=1)
 else:art(c,x+12,top-118,74,True,stage=i+1)
 c.setFillColor(ink);c.setFont('Helvetica',7.5);c.drawCentredString(x+49,top-132,['Match the colors','Leave extra for tucking','Water first','Add the greens','Complete the shell','Finished picture'][i])
 assert text(body,x+98,top-41,154)<=104
c.setStrokeColor(HexColor('#CEDDD7'));c.line(36,63,576,63)
text('<b>Helpful tip:</b> If a groove feels crowded, lift the fabric and trim a little of the hidden allowance. Use gentle pressure; never force the tool or cut through the foam.',36,52,540,9.3,12)
c.showPage();c.save()
