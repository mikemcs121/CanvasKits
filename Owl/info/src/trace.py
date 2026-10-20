"""Extract border-free centerlines from the preserved coloring page.
Run from the project root with the bundled Python; outputs stay in tmp/owl.
"""
from pathlib import Path
from collections import deque
import json
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT/'tmp/owl'
OUT.mkdir(parents=True, exist_ok=True)
im = Image.open(ROOT/'Owl/info/archive/previous-root-files/owl-coloring-page.png').convert('L')
a = np.asarray(im) < 135
# The owl source has no rectangular frame.
# Retain the complete source, including the branch and leaves.


# Broad black pupils and eyelashes become closed paintable outlines, rather
# than medial-axis scribbles. Thin strokes elsewhere become single centerlines.
seeds = np.asarray(Image.fromarray(a.astype('uint8')*255).filter(ImageFilter.MinFilter(25))) > 0
# Keep small isolated solid marks as paintable outlines.
seen=np.zeros_like(a)
for sy,sx in zip(*np.nonzero(a)):
    if seen[sy,sx]:continue
    queue=deque([(sy,sx)]);seen[sy,sx]=True;component=[]
    while queue:
        yy,xx=queue.popleft();component.append((yy,xx))
        for dy,dx in ((-1,0),(1,0),(0,-1),(0,1)):
            ny,nx=yy+dy,xx+dx
            if 0<=ny<a.shape[0] and 0<=nx<a.shape[1] and a[ny,nx] and not seen[ny,nx]:
                seen[ny,nx]=True;queue.append((ny,nx))
    if 8<=len(component)<160:
        yy,xx=zip(*component)
        if max(xx)-min(xx)<17 and max(yy)-min(yy)<17:seeds[sy,sx]=True
solid = np.zeros_like(a)
h,w = a.shape
for y,x in zip(*np.nonzero(seeds)):
    if solid[y,x]: continue
    queue=deque([(y,x)]); solid[y,x]=True
    while queue:
        yy,xx=queue.popleft()
        for dy,dx in ((-1,0),(1,0),(0,-1),(0,1)):
            ny,nx=yy+dy,xx+dx
            if 0<=ny<h and 0<=nx<w and a[ny,nx] and not solid[ny,nx]:
                solid[ny,nx]=True;queue.append((ny,nx))
Image.fromarray(np.where(solid,0,255).astype('uint8')).save(OUT/'solid-regions.png')

# Zhang-Suen thinning preserves loops and junctions of the source linework.
s=(a & ~solid).astype('uint8')
while True:
    removed=0
    for phase in (0,1):
        p=np.pad(s,1)
        n=[p[:-2,1:-1],p[:-2,2:],p[1:-1,2:],p[2:,2:],p[2:,1:-1],p[2:,:-2],p[1:-1,:-2],p[:-2,:-2]]
        count=sum(n)
        transitions=sum((n[i]==0)&(n[(i+1)%8]==1) for i in range(8))
        cond=((n[0]*n[2]*n[4]==0)&(n[2]*n[4]*n[6]==0)) if phase==0 else ((n[0]*n[2]*n[6]==0)&(n[0]*n[4]*n[6]==0))
        remove=(s==1)&(count>=2)&(count<=6)&(transitions==1)&cond
        removed+=int(remove.sum());s[remove]=0
    if not removed:break

pixels=set(zip(*np.nonzero(s)))
def neighbors(p):
    y,x=p
    result=[]
    for dy in (-1,0,1):
        for dx in (-1,0,1):
            q=(y+dy,x+dx)
            if (dy or dx) and q in pixels:
                # Suppress redundant diagonal edges across a pixel corner.
                if dy and dx and ((y+dy,x) in pixels or (y,x+dx) in pixels):continue
                result.append(q)
    return result
adj={p:neighbors(p) for p in pixels};visited=set();chains=[]
def edge(a,b):return tuple(sorted((a,b)))
def walk(start,nxt):
    path=[start];prev=start;cur=nxt
    while edge(prev,cur) not in visited:
        visited.add(edge(prev,cur));path.append(cur)
        if len(adj[cur])!=2:break
        after=adj[cur][0] if adj[cur][1]==prev else adj[cur][1]
        prev,cur=cur,after
    if len(path)>4 or (len(path)>1 and len(adj[path[0]])>1 and len(adj[path[-1]])>1):chains.append([[int(x),int(y)] for y,x in path])
for p,ns in adj.items():
    if len(ns)!=2:
        for q in ns:
            if edge(p,q) not in visited:walk(p,q)
for p,ns in adj.items():
    for q in ns:
        if edge(p,q) not in visited:walk(p,q)
(OUT/'centerlines.json').write_text(json.dumps(chains))
Image.fromarray(np.where(a,0,255).astype('uint8')).save(OUT/'border-free-source.png')
print(f'{len(chains)} source-derived centerline chains; {solid.sum()} solid-region pixels')
