from pathlib import Path
import json,hashlib
ROOT=Path(__file__).resolve().parents[2]
def sha(f):return hashlib.sha256(f.read_bytes()).hexdigest()
records={}
for name,slug in [('Owl','owl'),('Axolotl','axolotl')]:
 kit=ROOT/name;g=kit/'info/assets/geometry.json'
 records[name]={'geometry':sha(g),'paths':json.loads(g.read_text())}
 for f in (kit/'info/src').glob('*.cjs'):
  t=f.read_text(encoding='utf8').replace('#808080','#000000').replace('${2/g.scale}','${3/g.scale}').replace('${2/scale}','${3/scale}')
  t=t.replace("'128,128,128'","'0,0,0'").replace('strokePoints:2','strokePoints:3').replace("gray:'#000000'","lineColor:'#000000'")
  f.write_text(t,encoding='utf8')
 readme=kit/'info/README.md';t=readme.read_text(encoding='utf8').replace('#808080','#000000').replace('2-point','3-point').replace('gray vector centerlines','black vector centerlines').replace('gray vector','black vector').replace('gray contours','black contours').replace('gray transfer','black transfer')
 readme.write_text(t,encoding='utf8')
ghost=ROOT/'Ghost Fall';records['Ghost adult']={f.name:sha(f) for f in ghost.iterdir() if f.is_file()}
(ROOT/'tmp/kids-black-3pt/before.json').write_text(json.dumps(records,indent=2))

f=ROOT/'AGENTS.md';t=f.read_text(encoding='utf8')
old='Current transfer standard is **2 pt (0.706 mm)** at 8 by 10 inches, round caps/joins, **#A6A6A6 for adults**, **#808080 for children\'s Fox Fall and Cat in Pumpkin**.'
new="Current transfer standard: **children's canvases use black #000000 at 3 pt (1.058 mm)** with round caps/joins, per the October 19, 2026 request. This supersedes the former children's #808080 / 2 pt rule. Adults remain **#A6A6A6 at 2 pt (0.706 mm)**. Apply the children's rule to new kits and requested migrations; do not silently migrate other existing editions. Owl, Axolotl and Ghost Fall's simplified kids' edition have been migrated; preserve adult originals and all approved path geometry."
assert old in t;t=t.replace(old,new)
t=t.replace('Verify exact SVG size, vector content, gray and 2-point weight','Verify exact SVG size, vector content, audience-specific line color and weight (kids: black 3 pt; adults: gray 2 pt)')
for header,nextheader in [('## Axolotl kids kit','## Owl kids kit'),('## Owl kids kit','## Panda kit')]:
 start=t.index(header);end=t.index(nextheader,start+1)
 section=t[start:end].replace('#808080 rounded 2-point','#000000 rounded 3-point').replace('gray reference contours','black reference contours')
 t=t[:start]+section+t[end:]
t=t.replace('For this workflow, preserve the approved outline byte-for-byte and keep the original production set intact. Put an unchanged SVG copy, a new guide PDF and a matching reference PDF',"For this workflow, preserve approved outline geometry and keep the original production set intact. New children's editions and requested migrations use black #000000, 3 pt strokes; this supersedes byte-identical gray styling. Put the styled SVG copy, a new guide PDF and a matching reference PDF")
f.write_text(t,encoding='utf8')
for rel in ['.agents/skills/build-canvas/SKILL.md','.agents/skills/simplify/SKILL.md']:
 f=ROOT/rel;t=f.read_text(encoding='utf8')
 t=t.replace('same gray lines','same audience-specific lines').replace('same gray linework','same audience-specific linework').replace('containing gray vector paths','containing vector paths in the audience\'s specified color and weight').replace('audience-appropriate gray at the specified fine line weight','audience-appropriate color and weight (kids: black #000000 at 3 pt; adults: #A6A6A6 at 2 pt)')
 f.write_text(t,encoding='utf8')
