from pathlib import Path
from PIL import Image,ImageDraw,ImageOps
import numpy as np,json
R=Path.cwd();A=R/'Kids Highland Cow/info/assets';O=R/'tmp/kids-highland-cow';base=np.load(A/'paint-regions.npy');h,w=base.shape
source=np.asarray(Image.open(A/'source-ink.png').convert('L'));ink=source<150
color=np.asarray(Image.open(R/'Kids Highland Cow/info/archive/previous-root-files/Highland cow color female.png').convert('RGB').resize((w,h),Image.Resampling.LANCZOS)).astype(float)
labels=np.load(O/'labels.npy');pink=(color[:,:,0]>180)&(color[:,:,2]>color[:,:,1]*.97)&(color[:,:,2]>145)&(color[:,:,1]<205)
base[pink&np.isin(labels,[7,16])]=3
for c in range(7):Image.fromarray(np.where(base==c,0,255).astype('uint8')).save(O/f'paint-mask-{c}.png')
pupil=np.load(A/'pupil-mask.npy');Image.fromarray(np.where(ink&~pupil,0,255).astype('uint8')).save(O/'stage-ink.png')
colors=['#35B4EF','#DD9440','#FCECCA','#F49BB7','#A56F43','#171717','#FFFFFF']
palette=np.array([tuple(bytes.fromhex(c[1:])) for c in colors],dtype='uint8')
# Source images already contain the artwork. All stages reuse these masks and
# the locked vector transfer, with no independent redraws.
line=Image.open(O/'illustration-lines.png').convert('RGBA')
for stage in range(1,7):
 painted=np.full((h,w,3),255,dtype='uint8')
 unlocked=[0] if stage==1 else [0,1] if stage==2 else [0,1,2] if stage==3 else [0,1,2,3] if stage==4 else list(range(7))
 for c in unlocked:painted[base==c]=palette[c]
 if stage<5:painted[np.load(A/'pupil-mask.npy')]=palette[6]
 if stage>=5:
  alpha=(1-source.astype(float)/255)[:,:,None];painted=(painted*(1-alpha)+palette[5]*alpha).astype('uint8')
 else:
  pupil=np.load(A/'pupil-mask.npy');gray=np.full((h,w),255,dtype='uint8');gray[~pupil]=source[~pupil];alpha=(1-gray.astype(float)/255)[:,:,None];painted=(painted*(1-alpha)+166*alpha).astype('uint8')
 # Lock source aspect ratio; the supplied edge-cropped bust is retained.
 img=Image.fromarray(painted).resize((2400,2978),Image.Resampling.LANCZOS)
 full=Image.new('RGB',(2400,3000),colors[0] if stage>=1 else 'white');full.paste(img,(0,11))
 if stage<5:full=Image.alpha_composite(full.convert('RGBA'),line).convert('RGB')
 full.save(A/f'stage-{stage:02}.png',dpi=(300,300))
 if stage==6:full.save(A/'reference-master.png',dpi=(300,300))
# Preserve the selected cow-themed page logo on rebuilds.
assert (A/'page-logo.png').exists()
print('Six cumulative images and matched reference created')
