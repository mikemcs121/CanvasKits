from pathlib import Path
import subprocess,json
from io import BytesIO
from PIL import Image,ImageChops
import numpy as np
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'tmp/owl-branch-cleanup';A=ROOT/'Owl/info/assets'
git=['git','-c','safe.directory='+ROOT.as_posix()]
mask=np.asarray(Image.open(OUT/'allowed-2pt.png').getchannel('A'))>0
checks=[]
for name in [f'stage-{i:02}.png' for i in range(1,7)]+['reference-master.png']:
 old=Image.open(BytesIO(subprocess.check_output(git+['show','f9d0faf:Owl/info/assets/'+name]))).convert('RGB')
 new=Image.open(A/name).convert('RGB')
 changed=np.asarray(ImageChops.difference(old,new)).max(axis=2)>0
 assert not (changed&~mask).any(),name+' changed outside woodgrain'
 checks.append(dict(file=name,changedPixels=int(changed.sum()),outsideWoodgrain=0))
old=Image.open(OUT/'before-outline.png').convert('RGBA');new=Image.open(ROOT/'tmp/owl/outline-transparent.png').convert('RGBA')
changed=np.asarray(ImageChops.difference(old,new)).max(axis=2)>0
mask3=np.asarray(Image.open(OUT/'allowed-3pt.png').getchannel('A'))>0
assert not (changed&~mask3).any(),'Outline changed outside woodgrain'
assert Image.open(A/'stage-06.png').tobytes()==Image.open(A/'reference-master.png').tobytes()
for kind,size in [('painting-guide',(612,792)),('finished-reference',(576,720))]:
 pdf=PdfReader(ROOT/f'tmp/owl/owl-{kind}-8x10.pdf');assert len(pdf.pages)==1
 assert (float(pdf.pages[0].mediabox.width),float(pdf.pages[0].mediabox.height))==size
 if kind=='finished-reference':assert pdf.pages[0].images[0].image.convert('RGB').tobytes()==Image.open(A/'reference-master.png').convert('RGB').tobytes()
(OUT/'checks.json').write_text(json.dumps(checks,indent=2))
print(json.dumps(checks,indent=2))
