from pathlib import Path
import hashlib,json,re,subprocess
ROOT=Path(__file__).resolve().parents[2]
GIT=['git','-c','safe.directory='+ROOT.as_posix()]
BASE='da6f20a'
kept={}
for folder,slug in [('Owl','owl'),('Axolotl','axolotl'),('Ghost Fall/simplified','ghost-fall')]:
 p=ROOT/folder/f'{slug}-outline-8x10.svg';kept[str(p.relative_to(ROOT))]=hashlib.sha256(p.read_bytes()).hexdigest()
paths=[]
for kit,slug in [('Owl','owl'),('Axolotl','axolotl')]:
 paths += [f'{kit}/{slug}-painting-guide-8x10.pdf',f'{kit}/{slug}-finished-reference-8x10.pdf']
 paths += subprocess.check_output(GIT+['ls-tree','-r','--name-only',BASE,'--',kit+'/assets',kit+'/info/assets'],text=True).splitlines()
 paths += [f'{kit}/info/src/paint.cjs',f'{kit}/info/src/guide-pdf.cjs']
paths += ['Ghost Fall/simplified/ghost-fall-painting-guide-8x10.pdf','Ghost Fall/simplified/ghost-fall-finished-reference-8x10.pdf','Ghost Fall/info/tmp/simplified/plan.json']
paths += subprocess.check_output(GIT+['ls-tree','-r','--name-only',BASE,'--','Ghost Fall/simplified/assets','Ghost Fall/info/assets/simplified'],text=True).splitlines()
restored=[]
for name in sorted(set(paths)):
 data=subprocess.check_output(GIT+['show',BASE+':'+name]);p=ROOT/name;p.parent.mkdir(parents=True,exist_ok=True)
 temp=p.with_name(p.name+'.restore-tmp');temp.write_bytes(data);temp.replace(p)
 assert p.read_bytes()==data;restored.append(name)
# Restore the old square-stage painting workflow while retaining scratch exports
# and the independent black 3-pt transfer candidate.
build=ROOT/'Ghost Fall/info/tmp/simplified/build.py'
current=build.read_text();old=subprocess.check_output(GIT+['show',BASE+':Ghost Fall/info/tmp/simplified/build.py'],text=True)
start=current.index('# Build flat cumulative stages');end=current.index('pdfmetrics.registerFont(')
chunk=old[old.index('# Build flat cumulative stages'):old.index('pdfmetrics.registerFont(')]
chunk=chunk.replace('line_scale = lines.astype(np.float32)[:, None] / 255.0','line_scale = lines.astype(np.float32)[:, None] / 255.0\n# Transfer styling is independent of the preserved guide illustrations.\nsubprocess.run(["node", str(WORK / "render-lines.cjs")], cwd=ROOT, check=True)')
current=current[:start]+chunk+current[end:]
a=current.index('def draw_stage(');b=current.index('reference = ',a)
aa=old.index('def draw_stage(');bb=old.index('reference = ',aa)
current=current[:a]+old[aa:bb]+current[b:];build.write_text(current)
verify=ROOT/'Ghost Fall/info/tmp/simplified/verify_promote.py';t=verify.read_text()
t=t.replace('expected = Image.open(ASSETS / "step-5.png").convert("RGB")','expected = Image.new("RGB", (2400, 3000), "white")\nsubject = Image.open(ASSETS / "step-5.png").convert("RGB").resize((2280,2280), Image.Resampling.LANCZOS)\nexpected.paste(subject,(60,360))')
verify.write_text(t)
extra=ROOT/'Ghost Fall/info/assets/simplified/reference-master.png'
if extra.exists():extra.unlink()
for name,digest in kept.items():assert hashlib.sha256((ROOT/name).read_bytes()).hexdigest()==digest,'Outline changed: '+name
(ROOT/'tmp/kids-black-3pt/guide-revert-checks.json').write_text(json.dumps({'baseline':BASE,'restoredFiles':restored,'outlinesRetained':kept},indent=2))
print('Restored '+str(len(restored))+' guide/reference/source image files byte-for-byte; all three black 3-pt SVG outlines retained.')
