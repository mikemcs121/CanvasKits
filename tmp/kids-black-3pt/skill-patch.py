from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
print('*** Begin Patch')
for rel in ['.agents/skills/build-canvas/SKILL.md','.agents/skills/simplify/SKILL.md']:
 f=ROOT/rel;old=f.read_text(encoding='utf8')
 new=old.replace('same gray lines','same audience-specific lines').replace('same gray linework','same audience-specific linework').replace('containing gray vector paths',"containing vector paths in the audience's specified color and weight").replace('audience-appropriate gray at the specified fine line weight','audience-appropriate color and weight (kids: black #000000 at 3 pt; adults: #A6A6A6 at 2 pt)').replace('matching gray vector paths','matching vector paths in the specified line color and weight').replace('an unfilled gray transfer','an unfilled transfer')
 if new==old:continue
 print('*** Update File: '+str(f).replace('\\','/'))
 for a,b in zip(old.splitlines(),new.splitlines()):
  if a!=b:print('@@\n-'+a+'\n+'+b)
print('*** End Patch')
