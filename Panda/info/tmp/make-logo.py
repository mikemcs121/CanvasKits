"""Page-coloured River and Ridge logo for the Panda guide (deterministic hue shift of the shared master).

Run from the project root:  python "Panda/info/tmp/make-logo.py"
Tan ribbon and mountains move toward the painting's lime/olive, brown lettering toward its dark green;
trees, river, transparency, lettering shapes and the 756 x 322 aspect ratio are unchanged.
"""
import colorsys, os
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
dst = os.path.join(HERE, '../assets/template-refactor/river-and-ridge-logo.png')
Image.fromarray((np.clip(res, 0, 1) * 255).round().astype('uint8'), 'RGBA').save(dst)
print('wrote', os.path.normpath(dst))
