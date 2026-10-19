"""Page-coloured River and Ridge logo for the Panda guide (deterministic hue shift of the shared master),
with a small sitting panda holding bamboo on the right riverbank.

Run from the project root:  python "Panda/info/tmp/make-logo.py"
Tan ribbon and mountains move toward the painting's lime/olive, brown lettering toward its dark green;
trees, river, transparency, lettering shapes and the 756 x 322 aspect ratio are unchanged. The panda is
drawn as vector shapes, rendered with resvg (assets/tools/vector-tools) and placed in the open meadow
between the river and the right-hand pine, clear of the lettering.
"""
import colorsys, os, subprocess, tempfile
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '../../..'))
src = Image.open(os.path.join(ROOT, 'assets/images/river-and-ridge-logo.png')).convert('RGBA')
a = np.asarray(src).astype(np.float32) / 255
rgb = a[..., :3]
mx, mn = rgb.max(2), rgb.min(2)
v = mx
s = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
h = np.vectorize(lambda r, g, b: colorsys.rgb_to_hsv(r, g, b)[0], otypes=[np.float32])(rgb[..., 0], rgb[..., 1], rgb[..., 2])
warm = ((h < 0.15) | (h > 0.93)) & (s > 0.06)       # tan, orange, brown and reddish-brown
dark = warm & (v < 0.6)                             # lettering and outlines
h2 = np.where(warm, np.where(dark, 0.27, 0.17), h)   # light warm tones become one lime/olive hue
s2 = np.where(dark, np.minimum(s * 0.85, 0.6), np.where(warm, s * 0.8, s))
v2 = np.where(dark, v * 0.8, v)
out = np.stack(np.vectorize(colorsys.hsv_to_rgb, otypes=[np.float32, np.float32, np.float32])(h2, s2, v2), -1)
res = np.concatenate([out, a[..., 3:]], -1)
logo = Image.fromarray((np.clip(res, 0, 1) * 255).round().astype('uint8'), 'RGBA')

# Small panda (local 100 x 110 units), ink outline in the recoloured lettering green.
INK, BLK, WHT = '#2b3a24', '#262828', '#f7f5ec'
PANDA_SVG = f"""<svg xmlns="http://www.w3.org/2000/svg" width="800" height="880" viewBox="0 0 100 110">
<g stroke="{INK}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">
 <path d="M10 106 Q30 100 50 104 Q72 100 92 106" fill="none" stroke="#5d7f3a" stroke-width="3"/>
 <ellipse cx="50" cy="80" rx="27" ry="24" fill="{WHT}"/>
 <ellipse cx="31" cy="98" rx="13" ry="8.5" fill="{BLK}"/>
 <ellipse cx="69" cy="98" rx="13" ry="8.5" fill="{BLK}"/>
 <path d="M84 104 L90 30" stroke="#4f7f3c" stroke-width="5.5"/>
 <path d="M84.2 102 L89.8 32" stroke="#8fbf5a" stroke-width="2.6"/>
 <path d="M86.5 74 L91 75 M88.4 52 L93 53" stroke="{INK}" stroke-width="1.6"/>
 <path d="M90 34 Q99 24 98 12 Q89 20 90 34 Z" fill="#5f9446" stroke-width="1.6"/>
 <path d="M89 44 Q78 38 74 28 Q86 31 89 44 Z" fill="#5f9446" stroke-width="1.6"/>
 <ellipse cx="27" cy="74" rx="9" ry="15" transform="rotate(18 27 74)" fill="{BLK}"/>
 <ellipse cx="76" cy="70" rx="9" ry="15" transform="rotate(-38 76 70)" fill="{BLK}"/>
 <circle cx="30" cy="21" r="9" fill="{BLK}"/>
 <circle cx="70" cy="21" r="9" fill="{BLK}"/>
 <ellipse cx="50" cy="41" rx="26" ry="22" fill="{WHT}"/>
 <ellipse cx="39.5" cy="41" rx="6" ry="8.5" transform="rotate(28 39.5 41)" fill="{BLK}" stroke="none"/>
 <ellipse cx="60.5" cy="41" rx="6" ry="8.5" transform="rotate(-28 60.5 41)" fill="{BLK}" stroke="none"/>
 <circle cx="40.5" cy="39.5" r="1.7" fill="#ffffff" stroke="none"/>
 <circle cx="59.5" cy="39.5" r="1.7" fill="#ffffff" stroke="none"/>
 <ellipse cx="50" cy="50.5" rx="4.2" ry="3" fill="{BLK}" stroke="none"/>
 <path d="M50 53.5 L50 56 M46 57 Q50 59.5 54 57" fill="none" stroke="{BLK}" stroke-width="1.6"/>
</g></svg>"""
with tempfile.TemporaryDirectory() as tmp:
    svg, png = os.path.join(tmp, 'panda.svg'), os.path.join(tmp, 'panda.png')
    open(svg, 'w', encoding='utf-8').write(PANDA_SVG)
    resvg = os.path.join(ROOT, 'assets/tools/vector-tools/node_modules/@resvg/resvg-js').replace(os.sep, '/')
    subprocess.run(['node', '-e', f"const fs=require('fs'),{{Resvg}}=require('{resvg}');fs.writeFileSync(process.argv[2],new Resvg(fs.readFileSync(process.argv[1],'utf8')).render().asPng())", svg, png], check=True)
    panda = Image.open(png).convert('RGBA').resize((35, 39), Image.LANCZOS)
logo.alpha_composite(panda, (419, 203))
dst = os.path.join(HERE, '../assets/template-refactor/river-and-ridge-logo.png')
logo.save(dst)
print('wrote', os.path.normpath(dst))
