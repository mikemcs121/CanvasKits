from pathlib import Path
import json, hashlib, shutil, re
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[4]
KIT=ROOT/'Cat in Pumpkin'; WORK=KIT/'info/tmp/simplified'; DEST=KIT/'simplified'
ARCHIVE=KIT/'info/archive/simplified-before-white-eyes'
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
plan=json.loads((WORK/'plan.json').read_text())
before=json.loads((ARCHIVE/'build-records/promotion-manifest.json').read_text())
for entry in before['files']:
    p=ROOT/entry['destination']
    assert sha(p)==entry['sha256'] and sha(ARCHIVE/'production'/p.name)==sha(p)
originals=before['originalsUnchanged']
assert all(sha(ROOT/p)==h for p,h in originals.items())
layer=json.loads((WORK/'white-eye-layer-checks.json').read_text())
assert layer['changedPixels']==2669 and layer['outsideRegionChangedPixels']==0
assert all(sha(KIT/'info/tmp/8x10-artwork'/p)==h for p,h in layer['sourcePreservedHashes'].items())
text=PdfReader(WORK/'cat-in-pumpkin-painting-guide-8x10.pdf').pages[0].extract_text()
assert not re.search(r'\bmix\w*\b|\brecipe\w*\b|\bgold\w*\b|\byellow\b',text,re.I)
assert 'Leave the curved eye edges white.' in text
assert plan['paints']==['orange','gray','pink','dark brown','black','white']
checks=json.loads((WORK/'verification.json').read_text())
assert checks['referenceEmbeddedPixelsExactlyWhiteEyeStep6']
files=[]
for entry in before['files']:
    p=ROOT/entry['destination']
    if p.suffix=='.pdf': shutil.copy2(WORK/p.name,p)
    else: assert sha(p)==entry['sha256']
    files.append({**entry,'sha256':sha(p),'bytes':p.stat().st_size})
(WORK/'white-eyes-revision-checks.json').write_text(json.dumps({'palette':plan['paints'],'noGoldYellowOrMixingDirections':True,'eyeEdgesWhite':True,'outsideEyeRegionUnchanged':True,'sourceFilesUnchanged':True,'originalProductionUnchanged':True,'outlineCopyUnchanged':True,'archive':str(ARCHIVE.relative_to(ROOT))},indent=2))
(WORK/'promotion-manifest.json').write_text(json.dumps({'files':files,'originalsUnchanged':originals,'review':'White-eye native-layer revision. See white-eyes-revision-checks.json, white-eye-layer-checks.json and verification.json.','archive':str(ARCHIVE.relative_to(ROOT)),'print':'Artwork at Actual size / 100%; guide is US Letter.'},indent=2))
print(json.dumps(files,indent=2))
