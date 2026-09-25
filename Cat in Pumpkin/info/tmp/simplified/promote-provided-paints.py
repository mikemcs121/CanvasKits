from pathlib import Path
import json, hashlib, shutil, re
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[4]
KIT=ROOT/'Cat in Pumpkin'; WORK=KIT/'info/tmp/simplified'; DEST=KIT/'simplified'
ARCHIVE=KIT/'info/archive/simplified-before-ready-mixed-paints'
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
plan=json.loads((WORK/'plan.json').read_text())
name='cat-in-pumpkin-painting-guide-8x10.pdf'
src=WORK/name; dest=DEST/name
old=json.loads((ARCHIVE/'build-records/promotion-manifest.json').read_text())
for entry in old['files']:
    p=ROOT/entry['destination']
    assert sha(p)==entry['sha256'], 'Existing simplified production changed unexpectedly'
originals=json.loads((ARCHIVE/'build-records/original-hashes.json').read_text())
assert all(sha(ROOT/p)==h for p,h in originals.items())
assert sha(ARCHIVE/name)==sha(dest)
pdf=PdfReader(src); text=pdf.pages[0].extract_text()
assert len(pdf.pages)==1 and [float(pdf.pages[0].mediabox.width),float(pdf.pages[0].mediabox.height)]==[612,792]
assert not re.search(r'\bmix\w*\b|\brecipe\w*\b',text,re.I)
assert 'Paint colors provided:' in text
assert plan['paints']==['orange','gray','pink','golden yellow','dark brown','black','white']
for color in plan['paints']: assert color in text.lower()
shutil.copy2(src,dest)
assert sha(src)==sha(dest)
files=[]
for entry in old['files']:
    p=ROOT/entry['destination']
    if p.name!=name: assert sha(p)==entry['sha256']
    files.append({**entry,'sha256':sha(p),'bytes':p.stat().st_size})
checks={'revision':'Provided paint colors; no mixing instructions','palette':plan['paints'],'noMixingOrRecipeLanguage':True,'pageCount':1,'pagePoints':[612,792],'visualReview':'Astra inspected final rendered guide: supplied paint list fits, all captions legible, four panels unchanged, no overlap or clipping.','unchangedSimplifiedReferenceAndOutline':True,'unchangedOriginalProduction':originals,'archivedPreviousGuideHash':sha(ARCHIVE/name),'guideHash':sha(dest)}
(WORK/'provided-paints-checks.json').write_text(json.dumps(checks,indent=2))
(WORK/'promotion-manifest.json').write_text(json.dumps({'files':files,'originalsUnchanged':originals,'review':'Provided-paints revision: see provided-paints-checks.json. Original geometry/reference review retained in verification.json and archive.','archive':str(ARCHIVE.relative_to(ROOT)),'print':'Artwork at Actual size / 100%; guide is US Letter.'},indent=2))
print(json.dumps(checks,indent=2))
