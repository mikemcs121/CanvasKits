"""Canonical region masks, generated brush texture, and cumulative kids stages."""
from pathlib import Path
import json
import numpy as np
from PIL import Image,ImageFilter,ImageDraw
R=Path(__file__).resolve().parents[3]; A=R/'turtle/info/assets'; O=R/'tmp/turtle'
labels=np.load(A/'region-map.npy'); regions=json.loads((A/'regions.json').read_text())
colors={'blue':'#1389EE','lime':'#D5F544','green':'#42AF32','dark-green':'#167745','yellow':'#FFF16A','light-blue':'#73D9F2','black':'#151E1B','white':'#FFFFFF'}
stages={'blue':1,'lime':2,'green':3,'dark-green':3,'yellow':4,'light-blue':5,'black':5,'white':5}
groups={'blue':[0], 'light-blue':[1,2,3,4,5,9,37,41,58,61,64,66,67,72],
 'lime':[6,34,39,40,45,51,65,82,83,91,92],
 'green':[7,8,11,12,19,33,42,43,47,48,49,50,52,53,54,55,56,57,59,60,62,15,18,36,38],
 'dark-green':[35,63,69,71,81,84], 'yellow':[17,68], 'black':[10], 'white':[13,14]}
assigned={i:k for k,ids in groups.items() for i in ids}
for r in regions:
 if r['id'] not in assigned:
  x0,y0,x1,y1=r['box'];x=(x0+x1)/2;y=(y0+y1)/2
  assigned[r['id']]='green' if y>1190 and x<400 else 'white' if 190<x<300 and 430<y<540 else 'lime'
names=list(colors); ids={n:i for i,n in enumerate(names)}; paint=np.full(labels.shape,-1,dtype='int16')
for i,k in assigned.items():paint[labels==i]=ids[k]
while (paint<0).any():
 old=paint.copy()
 for dy,dx in ((-1,0),(1,0),(0,-1),(0,1)):
  moved=np.roll(old,(dy,dx),(0,1));take=(paint<0)&(moved>=0);paint[take]=moved[take]
 if np.array_equal(old,paint):raise RuntimeError('Unfilled junction')
np.save(A/'paint-map.npy',paint)
(A/'paint-plan.json').write_text(json.dumps(dict(colors=colors,stages=stages,regions=assigned),indent=2))
generated=Image.open(A/'generated-color-source.png').convert('RGB').resize((1024,1536),Image.Resampling.LANCZOS)
g=np.asarray(generated,dtype=float);lum=g.mean(2)
blur=np.asarray(generated.filter(ImageFilter.GaussianBlur(15)),dtype=float).mean(2)
# Broad generated brush variations are clipped to fixed source regions. No
# generated boundaries or independently redrawn stage shapes are retained.
detail=np.clip((lum-blur)/240,-.07,.07)
texture=np.zeros_like(g,dtype=np.uint8)
for name in names:
 m=paint==ids[name];base=np.array(tuple(bytes.fromhex(colors[name][1:])),float)
 factor=1+(detail*.45 if name=='blue' else detail)
 if name=='green':factor=np.clip(.70+(lum/255)*.52,.68,1.1)
 if name=='dark-green':factor=np.clip(.8+(lum/255)*.4,.8,1.12)
 if name in ('black','white'):factor=np.ones_like(lum)
 texture[m]=np.clip(base[None,:]*factor[m,None],0,255).astype('uint8')
Image.fromarray(texture).save(A/'painted-regions.png',dpi=(300,300))
# Reflect only the blue brush texture into side margins, then keep the entire
# canvas on this continuous background. Foreground stage PNGs use alpha there.
base=np.array(tuple(bytes.fromhex(colors['blue'][1:])),float)
blue_only=(g[:,:,2]>g[:,:,1]*1.4)&(g[:,:,2]>g[:,:,0]*1.6)&(g[:,:,1]<185)
blue_only=np.asarray(Image.fromarray((blue_only*255).astype('uint8')).filter(ImageFilter.MinFilter(15)))>0
water_detail=np.where(blue_only,np.clip(detail,-.025,.025)*.25,0)
water=np.clip(base[None,None,:]*(1+water_detail[:,:,None]),0,255).astype('uint8')
water=np.pad(water,((0,0),(103,103),(0,0)),mode='reflect')
Image.fromarray(water).resize((2400,3000),Image.Resampling.LANCZOS).save(A/'water-background.png',dpi=(300,300))
for stage in range(1,7):
 rgb=np.full_like(texture,255)
 for name in names:
  if stages[name]<=stage:rgb[paint==ids[name]]=texture[paint==ids[name]]
 rgba=np.dstack([rgb,np.where(paint==ids['blue'],0,255).astype('uint8')])
 Image.fromarray(rgba).save(O/f'paint-{stage}.png')
print('Canonical region colors and stage masks built.')
