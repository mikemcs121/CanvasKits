from pathlib import Path
from collections import deque
from PIL import Image,ImageDraw,ImageFont
import numpy as np,json,hashlib,shutil
R=Path.cwd(); K=R/'Kids Highland Cow'; A=K/'info/assets'; O=R/'tmp/kids-highland-cow'
manifest=[]
for name in ['Highland cow black and white female.ai','Highland cow black and white female.png','Highland cow color female.png']:
 p=K/name;dest=K/'info/archive/previous-root-files'/name
 if p.exists():
  h=hashlib.sha256(p.read_bytes()).hexdigest();shutil.move(str(p),str(dest));assert hashlib.sha256(dest.read_bytes()).hexdigest()==h
 h=hashlib.sha256(dest.read_bytes()).hexdigest()
 manifest.append({'old':str(p.relative_to(R)),'new':str(dest.relative_to(R)),'sha256':h})
(O/'source-manifest.json').write_text(json.dumps(manifest,indent=2))
im=Image.open(K/'info/archive/previous-root-files/Highland cow black and white female.png').convert('L');a=np.asarray(im)>160
h,w=a.shape;labels=np.full((h,w),-1,dtype='int32'); labels[~a]=-2;regions=[]
for y,x in zip(*np.nonzero(a)):
 if labels[y,x]>=0:continue
 n=len(regions);q=deque([(y,x)]);labels[y,x]=n;pts=[]
 while q:
  yy,xx=q.popleft();pts.append((yy,xx))
  for dy,dx in ((-1,0),(1,0),(0,-1),(0,1)):
   ny,nx=yy+dy,xx+dx
   if 0<=ny<h and 0<=nx<w and labels[ny,nx]==-1:labels[ny,nx]=n;q.append((ny,nx))
 yy,xx=zip(*pts);p=pts[len(pts)//2];regions.append(dict(id=n,area=len(pts),box=[min(xx),min(yy),max(xx),max(yy)],label=[p[1],p[0]]))
np.save(O/'labels.npy',labels);(O/'regions.json').write_text(json.dumps(regions,indent=2,default=int))
rgb=np.full((h,w,3),255,dtype='uint8');rng=np.random.default_rng(2)
for r in regions:
 if r['area']>80:rgb[labels==r['id']]=rng.integers(130,245,3)
prev=Image.fromarray(rgb);d=ImageDraw.Draw(prev);font=ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf',24)
for r in regions:
 if r['area']>80:d.text(r['label'],str(r['id']),font=font,fill='black',stroke_width=2,stroke_fill='white')
prev.save(O/'regions.png');print([(r['id'],r['area'],r['box']) for r in regions if r['area']>80])
