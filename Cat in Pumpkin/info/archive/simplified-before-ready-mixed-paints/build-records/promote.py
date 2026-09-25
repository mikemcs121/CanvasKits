from pathlib import Path
import json, hashlib, shutil
ROOT=Path(__file__).resolve().parents[4]
KIT=ROOT/'Cat in Pumpkin'; WORK=KIT/'info/tmp/simplified'; DEST=KIT/'simplified'
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
checks=json.loads((WORK/'verification.json').read_text())
assert checks['referenceEmbeddedPixelsExactlyOriginalStep6'] and checks['originalProductionHashesUnchanged']
before=json.loads((WORK/'original-hashes.json').read_text())
assert all(sha(ROOT/p)==h for p,h in before.items())
manifest=[]
for name in ['cat-in-pumpkin-outline-8x10.svg','cat-in-pumpkin-painting-guide-8x10.pdf','cat-in-pumpkin-finished-reference-8x10.pdf']:
    src=(KIT if name.endswith('.svg') else WORK)/name
    dest=DEST/name
    if dest.exists() and sha(dest)!=sha(src): raise RuntimeError('Preserve existing alternate before replacing: '+str(dest))
    shutil.copy2(src,dest)
    assert sha(src)==sha(dest)
    manifest.append({'source':str(src.relative_to(ROOT)),'destination':str(dest.relative_to(ROOT)),'sha256':sha(dest),'bytes':dest.stat().st_size})
assert len(list(DEST.iterdir()))==3
assert all(sha(ROOT/p)==h for p,h in before.items())
(WORK/'promotion-manifest.json').write_text(json.dumps({'files':manifest,'originalsUnchanged':before,'review':'Astra and parent visually reviewed final PDF-rendered guide/reference; Astra reviewed outline registration contact sheet. All pass.','print':'Artwork at Actual size / 100%; guide is US Letter.'},indent=2))
print(json.dumps(manifest,indent=2))
