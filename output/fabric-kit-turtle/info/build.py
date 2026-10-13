from pathlib import Path
import xml.etree.ElementTree as ET
import re
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from pypdf import PdfReader

ROOT=Path('C:/Projects/Canvas Kits/output/fabric-kit-turtle')
# Shared geometry, traced from the supplied 600-pixel turtle pattern.
paths=[
('water','#D3ECE8','M0 0H600V600H0Z'),
('water-top-left','#A9D7DB','M0 146 C47 106 97 109 140 128 L247 82 L232 0 H0Z'),
('water-top-right','#7ABBC9','M414 0 L415 40 L485 112 L600 148 V0Z'),
('water-middle','#71B6C4','M0 287 C61 267 105 272 163 292 L470 226 C510 235 533 255 541 287 C570 284 589 298 600 321 V600H0Z'),
('water-bottom','#B4DCD6','M0 467 C34 441 63 442 99 461 C130 477 167 485 199 473 L356 472 C410 471 455 468 496 455 L600 473 V600H0Z'),
('head','#95AD61','M357 111 C363 69 389 44 424 38 C463 30 482 62 486 105 C489 127 477 151 455 166 L427 181Z'),
('front-left-flipper','#79964F','M226 176 C207 164 190 165 175 174 C158 181 135 179 129 170 C119 154 136 128 151 111 C173 87 199 78 229 77 C257 80 285 94 305 113 L294 157Z'),
('right-flipper','#91A85B','M470 226 C510 235 533 255 541 287 C550 323 541 375 526 397 C512 412 495 424 496 409 C493 382 479 355 457 339Z'),
('left-flipper','#91A85B','M165 332 C115 351 91 382 101 419 C126 438 157 440 188 420 L209 386Z'),
('tail','#79964F','M204 446 C202 462 196 493 208 495 C219 496 233 480 244 466Z'),
('lower-flipper','#95AD61','M279 474 C273 513 280 543 301 548 C326 555 350 521 355 483 L357 456Z'),
('shell','#A1A55F','M327 112 C379 106 412 122 438 153 C469 190 477 230 473 273 C469 326 450 372 418 408 C380 448 334 470 286 474 C245 477 218 465 203 445 C181 418 170 387 165 353 C157 316 164 274 181 240 C208 186 267 127 327 112Z'),
('shell-top','#B5AF64','M327 112 C379 106 412 122 438 153 C449 166 457 182 463 199 L402 241 L328 199Z'),
('shell-upper-left','#8B9A53','M327 112 L328 199 L258 251 L199 209 C231 161 282 123 327 112Z'),
('shell-left','#B5AF64','M199 209 L258 251 L245 332 L172 370 C160 333 160 302 169 271 C176 246 185 227 199 209Z'),
('shell-bottom-left','#8B9A53','M172 370 L245 332 L316 378 L306 472 C260 479 222 473 203 445 C188 426 178 400 172 370Z'),
('shell-bottom-right','#B5AF64','M306 472 L316 378 L382 333 L436 378 C401 430 354 459 306 472Z'),
('shell-right','#8B9A53','M436 378 L382 333 L402 241 L463 199 C483 257 474 315 436 378Z'),
('shell-center','#C6BC75','M328 199 L402 241 L382 333 L316 378 L245 332 L258 251Z')]
outline=[
 'M0 0H600V600H0Z',
 'M232 0L247 82 M414 0L415 40 M486 112L600 148 M0 146C47 106 97 109 140 128 M0 287C61 267 105 272 163 292 M541 287C570 284 589 298 600 321 M0 467C34 441 63 442 99 461 C130 477 167 485 199 473 M356 472C410 471 455 468 496 455 L600 473 M496 409L496 455 M316 549V600',
 'M357 111C363 69 389 44 424 38 C463 30 482 62 486 105 C489 127 477 151 455 166',
 'M226 176C207 164 190 165 175 174 C158 181 135 179 129 170 C119 154 136 128 151 111 C173 87 199 78 229 77 C257 80 285 94 305 113',
 'M470 226C510 235 533 255 541 287 C550 323 541 375 526 397 C512 412 495 424 496 409 C493 382 479 355 457 339',
 'M165 332C115 351 91 382 101 419 C126 438 157 440 188 420',
 'M204 446C202 462 196 493 208 495 C219 496 233 480 244 466',
 'M279 474C273 513 280 543 301 548 C326 555 350 521 355 483 L357 456',
 paths[11][2],
 'M327 112L328 199L258 251L199 209 M258 251L245 332L172 370 M245 332L316 378L306 472 M316 378L382 333L436 378 M382 333L402 241L463 199 M402 241L328 199']

# Join the original sketch's open endpoints to the shell contour.
def shell_samples():
 ts=re.findall(r'[A-Za-z]|-?\d+(?:\.\d+)?',paths[11][2]);i=0;x=y=0;points=[]
 while i<len(ts):
  cmd=ts[i];i+=1
  if cmd=='M':x,y=map(float,ts[i:i+2]);i+=2
  elif cmd=='C':
   a,b,e,f,g,h=map(float,ts[i:i+6]);i+=6
   for j in range(301):
    t=j/300;u=1-t;points.append((u*u*u*x+3*u*u*t*a+3*u*t*t*e+t*t*t*g,u*u*u*y+3*u*u*t*b+3*u*t*t*f+t*t*t*h))
   x,y=g,h
 return points
shellpoints=shell_samples()
def snap(d):
 def segment(m):
  text=m.group(0);nums=re.findall(r'-?\d+(?:\.\d+)?',text)
  if len(nums)<2:return text
  x,y=map(float,nums[-2:]);p=min(shellpoints,key=lambda p:(p[0]-x)**2+(p[1]-y)**2)
  if (p[0]-x)**2+(p[1]-y)**2<15**2:
   return re.sub(r'-?\d+(?:\.\d+)?\s+-?\d+(?:\.\d+)?\s*$',f'{p[0]:.3f} {p[1]:.3f}',text)
  return text
 return re.sub(r'[MLC][^MLCHVZ]*',segment,d)
outline=[d if i in (0,8) else snap(d) for i,d in enumerate(outline)]

def svg(color=False):
 s='<svg xmlns="http://www.w3.org/2000/svg" width="8in" height="8in" viewBox="0 0 600 600"><title>Turtle fabric kit - 8 x 8 inches</title>'
 if color:
  for name,co,d in paths:s+=f'<path fill="{co}" d="{d}"/>'
 s+='<g fill="none" stroke="#000000" stroke-width="1.5625" stroke-linecap="round" stroke-linejoin="round">'
 for d in outline:s+=f'<path d="{d}"/>'
 return s+'</g></svg>'

def draw_path(c,d,fill=False):
 ts=re.findall(r'[A-Za-z]|-?\d+(?:\.\d+)?',d);i=0;x=y=0;p=c.beginPath()
 while i<len(ts):
  cmd=ts[i];i+=1
  if cmd in ('M','L'):
   x,y=map(float,ts[i:i+2]);i+=2;(p.moveTo if cmd=='M' else p.lineTo)(x,y)
  elif cmd=='C':
   v=list(map(float,ts[i:i+6]));i+=6;p.curveTo(*v);x,y=v[-2:]
  elif cmd=='H':x=float(ts[i]);i+=1;p.lineTo(x,y)
  elif cmd=='V':y=float(ts[i]);i+=1;p.lineTo(x,y)
  elif cmd=='Z':p.close()
  else:raise ValueError(cmd)
 c.drawPath(p,fill=int(fill),stroke=int(not fill))

def art(c,x,y,size,color=False,stage=99):
 c.saveState();c.translate(x,y+size);c.scale(size/600,-size/600)
 if color:
  for j,(name,co,d) in enumerate(paths):
   keep=(stage>=3 and j<5) or (stage>=4 and 5<=j<11) or (stage>=5 and j>=11)
   c.setFillColor(HexColor(co) if keep else white);draw_path(c,d,True)
 c.setStrokeColor(HexColor('#000000'));c.setLineWidth(1.5625);c.setLineCap(1);c.setLineJoin(1)
 for d in outline:draw_path(c,d)
 c.restoreState()

def printable(color=False):
 kind='finished-picture' if color else 'outline'
 out=ROOT/f'turtle-{kind}-8x8-printable.pdf';c=canvas.Canvas(str(out),pagesize=(612,792))
 c.setTitle('Turtle '+kind+' - 8 x 8 inches')
 c.setFont('Helvetica-Bold',16);c.drawCentredString(306,740,'Turtle | '+('Finished picture' if color else 'Transfer outline'))
 c.setFont('Helvetica',10);c.drawCentredString(306,720,'The square artwork measures exactly 8 x 8 inches')
 art(c,18,108,576,color)
 c.setFont('Helvetica-Bold',11);c.drawCentredString(306,64,'Print at Actual size / 100%. Turn off Fit to page.')
 c.setFont('Helvetica',9);c.drawCentredString(306,46,'US Letter paper | Check the square measures 8 inches on each side.')
 c.showPage();c.save()

if __name__=='__main__':
 import sys
 color='--color' in sys.argv
 (ROOT/('turtle-finished-picture-8x8.svg' if color else 'turtle-outline-8x8.svg')).write_text(svg(color),encoding='utf-8')
 printable(color)

