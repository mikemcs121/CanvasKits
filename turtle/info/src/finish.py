from pathlib import Path
from PIL import Image
R=Path(__file__).resolve().parents[3];A=R/'turtle/info/assets'
for p in list(A.glob('stage-*.png'))+[A/'reference-master.png']:
 im=Image.open(p);im.save(p,dpi=(300,300))
