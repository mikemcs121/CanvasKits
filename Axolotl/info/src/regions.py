from pathlib import Path
from collections import deque
import numpy as np,json
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parents[3];OUT=ROOT/'tmp/axolotl'
im=Image.open(OUT/'source-lines.png').convert('L');a=np.asarray(im)>150
# Temporary mask closures at the old page edges separate the plants from water.
# These edges never appear in the transfer or finished illustration.
a=a.copy();a[1504:1514,24:1001]=False;a[24:1514,999:1003]=False
h,w=a.shape;labels=np.full((h,w),-1,dtype='int32');labels[~a]=-2
regions=[]
for y,x in zip(*np.nonzero(a)):
 if labels[y,x]>=0:continue
 n=len(regions);q=deque([(y,x)]);labels[y,x]=n;points=[]
 while q:
  yy,xx=q.popleft();points.append((yy,xx))
  for dy,dx in ((-1,0),(1,0),(0,-1),(0,1)):
   ny,nx=yy+dy,xx+dx
   if 0<=ny<h and 0<=nx<w and labels[ny,nx]==-1:labels[ny,nx]=n;q.append((ny,nx))
 yy,xx=zip(*points);p=points[len(points)//2]
 regions.append(dict(id=n,area=len(points),box=[min(xx),min(yy),max(xx),max(yy)],label=[p[1],p[0]]))
np.save(OUT/'labels.npy',labels)
(OUT/'regions.json').write_text(json.dumps(regions,indent=2,default=int))
rgb=np.full((h,w,3),255,dtype='uint8');rng=np.random.default_rng(2)
for r in regions:
 if r['area']>60:rgb[labels==r['id']]=rng.integers(130,245,3)
preview=Image.fromarray(rgb);d=ImageDraw.Draw(preview);font=ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf',17)
for r in regions:
 if r['area']>60:
  x,y=r['label'];d.text((x,y),str(r['id']),font=font,fill='black',stroke_width=2,stroke_fill='white')
preview.save(OUT/'region-labels.png')
print([(r['id'],r['area'],r['box']) for r in regions if r['area']>60])
