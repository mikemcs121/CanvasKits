from pathlib import Path
import numpy as np,json
from PIL import Image,ImageFilter
ROOT=Path(__file__).resolve().parents[3];OUT=ROOT/'tmp/axolotl';A=ROOT/'Axolotl/info/assets'
labels=np.load(OUT/'labels.npy');regions=json.loads((OUT/'regions.json').read_text())
groups={
 'light-blue':[1,3,5,8,10,12,15,16,62,65,72,79],
 'white':[2,4,6,9,13,14,28,29,31,46,48,52,63,67,74,75],
 'green':[49,70,73,80,82,85,94,96,99,100,101],
 'yellow':[83],
 'light-pink':[18,50,69,77],
 'pink':[7,11,17,21,23,30,60,19,20,22,24,47,61,64,66,68,71,76,78,51],
 'black':[26,32,84,86,88,89,90,91,92,93,95,97,98,103,104,105,106,108,109],
}
assigned={n:name for name,ids in groups.items() for n in ids}
# Microscopic enclosed junctions follow their surrounding subject, not a new paint.
for r in regions:
 n=r['id']
 if n in assigned or n==0:continue
 x0,y0,x1,y1=r['box'];cx=(x0+x1)/2;cy=(y0+y1)/2
 if r['area']<80 and 300<cx<710 and 490<cy<685:assigned[n]='black'
 elif r['area']<80 and 680<cx<800 and 650<cy<730:assigned[n]='pink'
 else:assigned[n]='turquoise'
colors={'turquoise':'#A2DCE4','light-blue':'#D6F0FA','green':'#70BC79','yellow':'#FFD56B','light-pink':'#F6B5D0','pink':'#E67BA6','black':'#20252B','white':'#FFFFFF'}
stages={'turquoise':1,'light-blue':1,'green':2,'yellow':3,'light-pink':4,'pink':5,'black':6,'white':1}
for name in colors:
 if name=='turquoise':continue
 mask=np.isin(labels,[n for n,c in assigned.items() if c==name])
 # Fill right up to the canonical strokes; the exact stroke layer remains shared.
 m=Image.fromarray((mask*255).astype('uint8')).filter(ImageFilter.MaxFilter(7))
 Image.fromarray(255-np.asarray(m)).save(OUT/(name+'-mask.png'))
(A/'paint-plan.json').write_text(json.dumps(dict(colors=colors,stages=stages,regions=assigned),indent=2))
print('Saved canonical paint masks and six-stage plan.')
