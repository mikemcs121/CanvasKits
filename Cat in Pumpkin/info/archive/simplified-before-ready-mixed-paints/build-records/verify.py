from pathlib import Path
import json, hashlib
import numpy as np
from PIL import Image, ImageFilter
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[4]
KIT=ROOT/'Cat in Pumpkin'; WORK=KIT/'info/tmp/simplified'; OUT=KIT/'info/output/simplified'
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
source=Image.open(KIT/'info/tmp/8x10-artwork/step-6.png').convert('RGB')
pdf=PdfReader(WORK/'cat-in-pumpkin-finished-reference-8x10.pdf')
embedded=pdf.pages[0].images[0].image.convert('RGB')
exact=np.array_equal(np.array(source),np.array(embedded))
assert exact, 'Reference PDF image differs from step 6'
ref=Image.open(OUT/'cat-in-pumpkin-finished-reference-8x10.png').convert('RGB')
outline=Image.open(WORK/'unchanged-outline-render.png').convert('RGBA')
a=np.array(outline)[:,:,3]; ink=(np.array(ref).max(axis=2)<45)
support=np.array(Image.fromarray(ink.astype('uint8')*255).filter(ImageFilter.MaxFilter(7)))>0
stroke=a>128
ratio=float(support[stroke].mean())
assert ratio>.98, f'Outline support only {ratio}'
cyan=Image.new('RGBA',outline.size,(0,155,205,255)); cyan.putalpha(Image.fromarray(a))
overlay=Image.alpha_composite(ref.convert('RGBA'),cyan)
overlay.save(WORK/'outline-registration-overlay.png')
sheet=Image.new('RGB',(1800,750),'white')
white=Image.new('RGBA',outline.size,'white'); white.alpha_composite(outline)
for i,im in enumerate([white.convert('RGB'),ref,overlay.convert('RGB')]):
    sheet.paste(im.resize((600,750),Image.Resampling.LANCZOS),(i*600,0))
sheet.save(WORK/'geometry-contact-sheet.png')
hashes=json.loads((WORK/'original-hashes.json').read_text())
assert all(sha(ROOT/p)==h for p,h in hashes.items())
svg=(KIT/'cat-in-pumpkin-outline-8x10.svg').read_text()
assert 'width="8in" height="10in" viewBox="0 0 2400 3000"' in svg
assert 'stroke="#808080"' in svg and 'stroke-width="8.333333333333334"' in svg
assert '<image' not in svg and '<rect' not in svg
checks={'referenceEmbeddedPixelsExactlyOriginalStep6':exact,'sourcePixels':list(source.size),'sourcePlacementOn2400x3000':[60,360,2280,2280],'outlineStrokePixels':int(stroke.sum()),'outlineStrokePixelsSupportedWithin3pxByReferenceBlackLineworkFraction':ratio,'originalProductionHashesUnchanged':True,'outlineTrueVectorNoBackground':True,'outlineInches':[8,10],'outlineColor':'#808080','outlineStrokePt':2,'sourceStageMapping':[1,2,3,6],'note':'Existing heavier source teaching linework retained. Transfer geometry and centered composition unchanged. Exact original 1254px source embedded; renderer resamples smoothly to 300 DPI, without claiming added detail.'}
(WORK/'verification.json').write_text(json.dumps(checks,indent=2))
print(json.dumps(checks,indent=2))
