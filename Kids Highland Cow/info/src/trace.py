from pathlib import Path
from collections import deque
from PIL import Image,ImageDraw
import numpy as np,json
R=Path.cwd();K=R/'Kids Highland Cow';A=K/'info/assets';O=R/'tmp/kids-highland-cow'
im=Image.open(K/'info/archive/previous-root-files/Highland cow black and white female.png').convert('L');bw=np.asarray(im)<150;h,w=bw.shape
labels=np.load(O/'labels.npy');color=np.asarray(Image.open(K/'info/archive/previous-root-files/Highland cow color female.png').convert('RGB').resize((w,h),Image.Resampling.LANCZOS)).astype(float)
# The supplied bust is open where it meets the left canvas edge. Use the color
# example only to distinguish body/background within that exterior white region.
tan=~((color[:,:,2]>color[:,:,0]*1.4)&(color[:,:,2]>color[:,:,1]*1.05))
base=np.full((h,w),255,dtype='uint8');base[labels==0]=0;body=np.asarray(Image.fromarray((tan*255).astype('uint8')).filter(__import__('PIL.ImageFilter',fromlist=['ImageFilter']).MedianFilter(9)))>128
body[:590]=False;body[:,600:]=False
base[(labels==0)&body]=1
assign={1:2,2:1,3:3,5:1,6:1,7:1,8:2,9:3,10:3,11:1,12:1,13:3,14:1,16:1,17:6,19:6,20:6,22:6,23:2,24:6,25:4,26:6,28:4}
for idx,c in assign.items():base[labels==idx]=c
# All source-black pixels belong to the exact locked ink layer, revealed at step 6.
# Fill below it using nearest neighboring regions so there are no white seams.
base[bw]=255
for k in range(30):
 missing=base==255
 if not missing.any():break
 for dy,dx in ((-1,0),(1,0),(0,-1),(0,1)):
  neigh=np.roll(base,(dy,dx),(0,1));take=missing&(neigh!=255);base[take]=neigh[take];missing=base==255
base[base==255]=1
np.save(A/'paint-regions.npy',base)
# Separate pupils from line strokes before skeletonizing the transfer.
solid=np.zeros_like(bw)
for seed in [(650,350),(780,675)]:
 y,x=seed
 if not bw[y,x]:raise ValueError('Pupil seed is not on source black')
 q=deque([seed]);solid[y,x]=True
 while q:
  yy,xx=q.popleft()
  for dy,dx in ((-1,0),(1,0),(0,-1),(0,1)):
   ny,nx=yy+dy,xx+dx
   if 0<=ny<h and 0<=nx<w and bw[ny,nx] and not solid[ny,nx]:solid[ny,nx]=True;q.append((ny,nx))
Image.fromarray(np.where(solid,0,255).astype('uint8')).save(O/'pupils.png');np.save(A/'pupil-mask.npy',solid)
Image.fromarray(np.where(bw,0,255).astype('uint8')).save(A/'source-ink.png')
s=(bw&~solid).astype('uint8')
while True:
 removed=0
 for phase in (0,1):
  p=np.pad(s,1);n=[p[:-2,1:-1],p[:-2,2:],p[1:-1,2:],p[2:,2:],p[2:,1:-1],p[2:,:-2],p[1:-1,:-2],p[:-2,:-2]]
  count=sum(n);transitions=sum((n[i]==0)&(n[(i+1)%8]==1) for i in range(8))
  cond=((n[0]*n[2]*n[4]==0)&(n[2]*n[4]*n[6]==0)) if phase==0 else ((n[0]*n[2]*n[6]==0)&(n[0]*n[4]*n[6]==0))
  remove=(s==1)&(count>=2)&(count<=6)&(transitions==1)&cond;removed+=int(remove.sum());s[remove]=0
 if not removed:break
pixels=set(zip(*np.nonzero(s)))
def neighbors(p):
 y,x=p;result=[]
 for dy in (-1,0,1):
  for dx in (-1,0,1):
   q=(y+dy,x+dx)
   if (dy or dx) and q in pixels:
    if dy and dx and ((y+dy,x) in pixels or (y,x+dx) in pixels):continue
    result.append(q)
 return result
adj={p:neighbors(p) for p in pixels};visited=set();chains=[]
def edge(a,b):return tuple(sorted((a,b)))
def walk(start,nxt):
 chain=[start];prev=start;cur=nxt
 while edge(prev,cur) not in visited:
  visited.add(edge(prev,cur));chain.append(cur)
  if len(adj[cur])!=2:break
  after=adj[cur][0] if adj[cur][1]==prev else adj[cur][1];prev,cur=cur,after
 if len(chain)>5:
  # Remove tiny medial-axis spurs at pointed fur joins.
  if len(chain)<18 and (len(adj[chain[0]])==1 or len(adj[chain[-1]])==1):return
  chains.append([[int(x),int(y)] for y,x in chain])
for p,ns in adj.items():
 if len(ns)!=2:
  for q in ns:
   if edge(p,q) not in visited:walk(p,q)
for p,ns in adj.items():
 for q in ns:
  if edge(p,q) not in visited:walk(p,q)
(O/'centerlines.json').write_text(json.dumps(chains))
print('Source size',w,h,'centerline chains',len(chains),'pupil pixels',solid.sum())
