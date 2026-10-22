from pathlib import Path
import json,subprocess
from io import BytesIO
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'tmp/owl-branch-cleanup'
p=ROOT/'Owl/info/README.md';t=p.read_text()
t=t.replace('one nearby woodgrain tip was shortened to remain inside it.',"the internal woodgrain marks were subsequently removed at the user's request.")
if '## Branch cleanup' not in t:
 t+='''
## Branch cleanup — October 19, 2026

Removed eight internal woodgrain paths from the canonical centerlines, transfer outline, all six guide stages, header preview, reference and drying picture. The branch edge, leaf veins, stems, feet and all other paths are preserved. `omittedCenterlinePaths` records the excluded paths and the source-outline builder retains those exclusions on retrace. The transfer remains black 3 pt; approved gray 2-point illustration styling is unchanged. A pixel comparison against snapshot `f9d0faf` confirmed zero changes outside the deleted strokes in every stage and reference master. Previous same-day byte-identical restoration notes describe the prior edition; this branch-only correction is the current artwork.
'''
p.write_text(t)
p=ROOT/'AGENTS.md';t=p.read_text()
if "Owl's later October 19 branch correction" not in t:
 a=t.index('## Owl kids kit');b=t.index('## Panda kit',a)
 t=t[:b]+"Owl's later October 19 branch correction removes all eight internal woodgrain paths in the outline, guide stages, preview, reference and drying picture. Keep the branch edge, feet, stems and leaf veins unchanged. Preserve `omittedCenterlinePaths` in its canonical geometry so retracing does not restore those marks. Transfer styling remains black 3 pt; guide/reference illustration styling remains as approved.\n\n"+t[b:]
p.write_text(t)
p=ROOT/'canvas-kits.md';t=p.read_text()
note='Owl: internal branch woodgrain removed from the outline, guide illustrations and reference on October 19; branch edge, leaf veins and all other artwork preserved.'
if note not in t:
 a=t.index('## Review and repairs');a=t.index('\n',a)+1;t=t[:a]+'\n'+note+'\n'+t[a:]
p.write_text(t)
git=['git','-c','safe.directory='+ROOT.as_posix()]
old=PdfReader(BytesIO(subprocess.check_output(git+['show','f9d0faf:Owl/owl-painting-guide-8x10.pdf'])))
new=PdfReader(ROOT/'tmp/owl/owl-painting-guide-8x10.pdf')
assert old.pages[0].extract_text()==new.pages[0].extract_text(),'Guide text changed'
new=None;old=None
def replace(source,dest):
 data=source.read_bytes();temp=dest.with_name(dest.name+'.promote-tmp');temp.write_bytes(data);temp.replace(dest)
 assert dest.read_bytes()==data
for kind,ext in [('outline','svg'),('painting-guide','pdf'),('finished-reference','pdf')]:
 name=f'owl-{kind}-8x10.{ext}';replace(ROOT/'tmp/owl'/name,ROOT/'Owl'/name)
for source in (OUT/'candidate/assets').glob('*.png'):replace(source,ROOT/'Owl/assets'/source.name)
print('Published matching outline, guide, reference and extracted pictures. Guide text unchanged.')
