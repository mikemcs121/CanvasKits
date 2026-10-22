from pathlib import Path
import hashlib,json,math,shutil,subprocess
import xml.etree.ElementTree as ET
from PIL import Image
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[2]
before=json.loads((ROOT/'tmp/kids-black-3pt/before.json').read_text())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
ns={'s':'http://www.w3.org/2000/svg'}
specs=[('Owl','owl','tmp/owl','Owl'),('Axolotl','axolotl','tmp/axolotl','Axolotl'),('Ghost kids','ghost-fall','tmp/ghost-kids-black-3pt','Ghost Fall/simplified')]
checks=[]
for label,slug,work,dest in specs:
 work=ROOT/work;dest=ROOT/dest
 outline=work/f'{slug}-outline-8x10.svg';new=ET.parse(outline).getroot()
 old=ET.fromstring(subprocess.check_output(['git','-c','safe.directory='+ROOT.as_posix(),'show','da6f20a:'+str((dest/outline.name).relative_to(ROOT)).replace('\\','/')]))
 assert [p.attrib['d'] for p in old.findall('.//s:path',ns)]==[p.attrib['d'] for p in new.findall('.//s:path',ns)],label+' path drift'
 assert [g.get('transform') for g in old.findall('.//s:g',ns)]==[g.get('transform') for g in new.findall('.//s:g',ns)],label+' placement drift'
 assert new.get('width')=='8in' and new.get('height')=='10in'
 assert not new.findall('.//s:image',ns) and not new.findall('.//s:rect',ns)
 group=new.find('s:g',ns);scale=.45 if label!='Ghost kids' else 576/2400
 assert group.get('stroke')=='#000000' and math.isclose(float(group.get('stroke-width'))*scale,3)
 assert group.get('fill')=='none' and group.get('stroke-linecap')=='round' and group.get('stroke-linejoin')=='round'
 transparent=Image.open(work/'outline-transparent.png').convert('RGBA')
 assert transparent.size==(2400,3000) and transparent.getchannel('A').getextrema()==(0,255)
 assert all(rgb==(0,0,0) for rgb in {color[:3] for count,color in transparent.getcolors(1000) if color[3]})
 for kind,size in [('painting-guide',(612,792)),('finished-reference',(576,720))]:
  pdf=PdfReader(work/f'{slug}-{kind}-8x10.pdf')
  assert len(pdf.pages)==1 and (float(pdf.pages[0].mediabox.width),float(pdf.pages[0].mediabox.height))==size
 master=ROOT/(('Ghost Fall/info/assets/simplified/reference-master.png') if label=='Ghost kids' else f'{label}/info/assets/reference-master.png')
 image=Image.open(master).convert('RGB');reference=PdfReader(work/f'{slug}-finished-reference-8x10.pdf')
 assert reference.pages[0].images[0].image.convert('RGB').tobytes()==image.tobytes(),label+' reference mismatch'
 assert image.size==(2400,3000)
 assert abs(Image.open(master).info['dpi'][0]-300)<.1
 if label!='Ghost kids':
  assert sha(ROOT/f'{label}/info/assets/geometry.json')==before[label]['geometry']
  assert image.tobytes()==Image.open(ROOT/f'{label}/info/assets/stage-06.png').convert('RGB').tobytes()
 for name in [f'{slug}-outline-8x10.svg',f'{slug}-painting-guide-8x10.pdf',f'{slug}-finished-reference-8x10.pdf']:
  shutil.copy2(work/name,dest/name);assert sha(work/name)==sha(dest/name)
 assert (work/'assets').is_dir(),'Guide extraction incomplete for '+label
 assets=dest/'assets';assets.mkdir(exist_ok=True)
 for f in (work/'assets').glob('*.png'):
  shutil.copy2(f,assets/f.name);assert sha(f)==sha(assets/f.name)
 checks.append(dict(kit=label,pathsPreserved=True,placementPreserved=True,lineColor='#000000',strokePoints=3,pdfPagesAndSizes=True,transparentVector=True,referencePixelsMatchMaster=True,guideImagesRefreshed=True))
for name,value in before['Ghost adult'].items():assert sha(ROOT/'Ghost Fall'/name)==value,'Adult Ghost changed'
(ROOT/'tmp/kids-black-3pt/final-checks.json').write_text(json.dumps(checks,indent=2))
print(json.dumps(checks,indent=2))
