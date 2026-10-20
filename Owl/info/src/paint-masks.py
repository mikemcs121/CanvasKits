from pathlib import Path
import numpy as np,json
from PIL import Image,ImageFilter
ROOT=Path(__file__).resolve().parents[3];OUT=ROOT/'tmp/owl';A=ROOT/'Owl/info/assets'
labels=np.load(OUT/'labels.npy');regions=json.loads((OUT/'regions.json').read_text())
# Paint areas are flood regions of the saved centerlines. Slight mask expansion
# restores the narrow safety band used to bridge tapered feather junctions.
groups={
 'tan':[1,2,4,8,32,90,95,98,99,102],
 'cream':[5],
 'brown':[109,116,117,118],
 'yellow':[9,41,81,93,96,104,105,106,107,110],
 'pink':[45,48,86],
 'black':[15,16,18,21,26,28,29,30,31,33,34,35],
 'white':[19,20,22,23,24,25,36,37,38,39,40,47],
 'green':[97,101,103,121,125],
}
assigned={n:name for name,ids in groups.items() for n in ids}
for r in regions:
 if r['id'] in assigned or r['id']==0 or r['area']<15:continue
 x0,y0,x1,y1=r['box'];cx=(x0+x1)/2;cy=(y0+y1)/2
 if 300<cx<450 and 480<cy<670:assigned[r['id']]='black'
 elif 590<cx<750 and 370<cy<550:assigned[r['id']]='black'
 elif cy>1180:assigned[r['id']]='brown'
 else:assigned[r['id']]='tan'
colors={'light-blue':'#D4EBF5','brown':'#9A6948','green':'#79B66E','tan':'#D4A777','cream':'#FFF0D1','yellow':'#F9CB57','pink':'#ECA0B7','black':'#25282B','white':'#FFFFFF'}
stages={'light-blue':1,'brown':2,'green':2,'tan':3,'cream':4,'yellow':5,'pink':5,'black':6,'white':6}
names=list(colors);color_ids={name:i for i,name in enumerate(names)}
paint=np.full(labels.shape,-1,dtype='int16');paint[labels==0]=color_ids['light-blue']
for n,name in assigned.items():paint[labels==n]=color_ids[name]
# Extend every neighboring region to the center of the shared line band. This
# fills feather junctions without leaving background-colored pinholes in the owl.
while (paint<0).any():
 before=int((paint<0).sum());old=paint.copy()
 for dy,dx in ((-1,0),(1,0),(0,-1),(0,1)):
  moved=np.roll(old,(dy,dx),(0,1));take=(paint<0)&(moved>=0);paint[take]=moved[take]
 if int((paint<0).sum())==before:raise RuntimeError('Unfilled color junction')
for name in colors:
 if name=='light-blue':continue
 mask=paint==color_ids[name]
 m=Image.fromarray((mask*255).astype('uint8')).filter(ImageFilter.MaxFilter(3))
 Image.fromarray(255-np.asarray(m)).save(OUT/(name+'-mask.png'))
(A/'paint-plan.json').write_text(json.dumps(dict(colors=colors,stages=stages,regions=assigned),indent=2))
print('Saved owl paint masks and six-stage plan.')
