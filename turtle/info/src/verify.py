from pathlib import Path
import hashlib,json,xml.etree.ElementTree as ET
import numpy as np
from PIL import Image,ImageDraw
from pypdf import PdfReader
R=Path(__file__).resolve().parents[3];A=R/'turtle/info/assets';O=R/'tmp/turtle'
g=json.loads((A/'geometry.json').read_text()); svg=ET.parse(O/'turtle-outline-8x10.svg').getroot(); ns={'s':'http://www.w3.org/2000/svg'}
assert svg.attrib['width']=='8in' and svg.attrib['height']=='10in'
assert not svg.findall('.//s:image',ns) and not svg.findall('.//s:rect',ns)
group=svg.find('s:g',ns);assert group.attrib['stroke']=='#000000';assert abs(float(group.attrib['stroke-width'])*g['scale']-3)<1e-8
assert group.attrib['fill']=='none' and group.attrib['stroke-linecap']=='round' and group.attrib['stroke-linejoin']=='round'
paths=g['centerlinePaths']+g['solidBoundaryPaths'];assert [p.attrib['d'] for p in group]==paths
for n in range(1,7):
 s=(O/f'stage-{n}.svg').read_text()
 assert all(f'd="{d}"' in s for d in paths)
 im=Image.open(A/f'stage-{n:02}.png');assert im.size==(2400,3000)
 assert all(abs(v-300)<.1 for v in im.info['dpi'])
master=Image.open(A/'reference-master.png').convert('RGB');m=np.asarray(master)
assert np.array_equal(m,np.asarray(Image.open(A/'stage-06.png').convert('RGB')))
assert np.array_equal(m,np.asarray(Image.open(A/'stage-05.png').convert('RGB')))
ref=PdfReader(O/'turtle-finished-reference-8x10.pdf');guide=PdfReader(O/'turtle-painting-guide-8x10.pdf')
assert len(ref.pages)==len(guide.pages)==1
assert list(ref.pages[0].mediabox)==[0,0,576,720] and list(guide.pages[0].mediabox)==[0,0,612,792]
embedded=ref.pages[0]['/Resources']['/XObject']['/Im0'].get_object();assert embedded.get_data()==m.tobytes()
txt=guide.pages[0].extract_text();assert all(f'{n}.' in txt for n in range(1,7));assert 'No mixing needed.' in txt
pink=(m[:,:,0]>160)&(m[:,:,2]>100)&(m[:,:,0]>m[:,:,1]*1.22)&(m[:,:,2]>m[:,:,1]*1.05);assert not pink.any()
alpha=np.asarray(Image.open(O/'outline-transparent.png'));assert alpha[0,0,3]==0
assert np.all(alpha[:,:,:3][alpha[:,:,3]>0]==0)
# Registration contact sheet uses the same outline and current finished master.
sheet=Image.new('RGB',(960,640),'white');d=ImageDraw.Draw(sheet)
for i,p in enumerate([O/'outline-preview.png',A/'reference-master.png']):
 im=Image.open(p).convert('RGB');im.thumbnail((480,600));sheet.paste(im,(i*480,30))
d.text((20,8),'Canonical transfer',fill='black');d.text((500,8),'Registered reference',fill='black');sheet.save(O/'geometry-check.png')
master.crop((250,520,1050,1500)).resize((800,980),Image.Resampling.LANCZOS).save(O/'face-shell-detail.png')
report={'pages':{'guide':[612,792],'reference':[576,720]},'masterPixels':[2400,3000],'dpi':300,'transfer':'black #000000 3 pt rounded vector paths, transparent interiors and margins','allStagesReuseGeometry':True,'referencePdfPixelsEqualMaster':True,'finalStagesEqualMaster':True,'pinkPixels':int(pink.sum()),'guideStepNumbers':6,'sourceHashes':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in (R/'turtle/info/archive/previous-root-files').iterdir()},'sceneBoundsPoints':[48+20*g['scale'],40*g['scale'],48+1024*g['scale'],720]}
(O/'verification.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
