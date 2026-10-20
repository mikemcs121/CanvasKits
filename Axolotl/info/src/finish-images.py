from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[3];A=ROOT/'Axolotl/info/assets'
for f in list(A.glob('stage-*.png'))+[A/'reference-master.png']:
 im=Image.open(f);im.save(f,dpi=(300,300))
