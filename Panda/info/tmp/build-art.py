"""Paints the Panda finished reference and guide step pictures from the shared label map and outline.

Run from the project root after build-outline.py:
    python "Panda/info/tmp/build-art.py" <workDir>
Reads <workDir>/labels.png and <workDir>/outline.png (the SVG rendered at 2400 x 3000).
Writes <workDir>/panda-finished-reference-8x10.png (2400 x 3000, 300 DPI) and <workDir>/steps/step-N.png.
Promote the reference to info/output/pdf/8x10/ and the steps to info/tmp/steps/.
"""
import json, math, os, random, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from geometry import *  # noqa

WORK = os.path.abspath(sys.argv[1])
lab = np.asarray(Image.open(os.path.join(WORK, 'labels.png')))
R = REGIONS

# Paint colours. Every one is a listed paint (white, black, yellow, green) or a mix stated in the guide.
C = {
    'canvas': (255, 255, 255),
    'white': (244, 243, 237),
    'black': (35, 37, 38),
    'bg': (203, 206, 86),          # yellow + a little green
    'bg_light': (224, 228, 124),
    'bg_dark': (181, 188, 64),
    'stalk': (122, 160, 79),       # green + a little yellow
    'leaf': (76, 124, 68),         # green
    'shade': (52, 86, 46),         # green + a tiny dot of black
    'light': (176, 205, 136),      # green + yellow + white
    'gray': (200, 204, 206),       # white + a tiny dot of black
}
GROUPS = {
    'bg': ['bg'], 'face': ['face'], 'black1': ['earL', 'earR', 'body'], 'black2': ['patchL', 'patchR', 'nose'],
    'stalk': ['stalk', 'twig'], 'leaves': ['leafA', 'leafB', 'leafC', 'leafD', 'leafE'], 'dots': ['dotL', 'dotR'],
}


def mask(names, blur=0.0):
    m = Image.fromarray((np.isin(lab, [R[n] for n in names]) * 255).astype('uint8'))
    return m.filter(ImageFilter.GaussianBlur(blur)) if blur else m


def strokes(size, n, colors, width, length, angle, alpha, seed, area=None, curve=0.15):
    """Bristle-brush strokes on an RGBA layer: each stroke is a bundle of thin parallel hairs of varying
    opacity and length, so the paint reads as brushed acrylic. `area` (x0, y0, x1, y1) limits stroke centres."""
    rnd = random.Random(seed)
    layer = Image.new('RGBA', size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x0, y0, x1, y1 = area or (0, 0, size[0], size[1])
    for _ in range(n):
        cx, cy = rnd.uniform(x0, x1), rnd.uniform(y0, y1)
        a = angle(rnd)
        L = rnd.uniform(*length)
        wd = rnd.uniform(*width)
        bend = rnd.uniform(-curve, curve)
        col = rnd.choice(colors)
        base_alpha = rnd.uniform(*alpha)
        hairs = max(3, int(wd / 3))
        for h in range(hairs):
            o = (h / (hairs - 1) - 0.5) * wd
            l0, l1 = rnd.uniform(-0.5, -0.32), rnd.uniform(0.32, 0.5)
            fade = 1 - abs(o) / wd  # edges of the brush carry less paint
            av = int(255 * base_alpha * rnd.uniform(0.35, 1.0) * (0.5 + 0.5 * fade))
            pts = []
            for k in range(7):
                t = l0 + (l1 - l0) * k / 6
                off = bend * L * (0.25 - t * t) + o
                pts.append((cx + math.cos(a) * L * t - math.sin(a) * off, cy + math.sin(a) * L * t + math.cos(a) * off))
            d.line(pts, fill=col + (av,), width=rnd.choice((2, 3, 3, 4)), joint='curve')
    return layer


def grain(seed, amp):
    """Fine canvas-weave grain added to every painted area."""
    rng = np.random.default_rng(seed)
    g = Image.fromarray(np.clip(128 + rng.normal(0, amp, (H, W)), 0, 255).astype('uint8')).filter(ImageFilter.GaussianBlur(0.8))
    return np.asarray(g).astype(np.int16) - 128


def paint_region(base, names, color, texture=None, blur=1.2):
    m = mask(names, 0.7)  # feathered so painted edges are antialiased
    fill = Image.new('RGB', base.size, color)
    if texture is not None:
        fill = Image.alpha_composite(fill.convert('RGBA'), texture.filter(ImageFilter.GaussianBlur(blur))).convert('RGB')
    base.paste(fill, (0, 0), m)


def line_layer(lines, color, width, alpha=255, clip=None, taper=False, soft=1.0, ss=3):
    """Painted line(s), drawn 3x supersampled inside their bounding box for smooth edges."""
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    for pts in lines:
        p = line_points(pts)
        xs, ys = [q[0] for q in p], [q[1] for q in p]
        m = width + 4 * soft + 4
        x0, y0 = int(max(min(xs) - m, 0)), int(max(min(ys) - m, 0))
        x1, y1 = int(min(max(xs) + m, W)), int(min(max(ys) + m, H))
        if x1 <= x0 or y1 <= y0: continue
        big = Image.new('L', ((x1 - x0) * ss, (y1 - y0) * ss), 0)
        d = ImageDraw.Draw(big)
        q = [((x - x0) * ss, (y - y0) * ss) for x, y in p]
        n = len(q)
        for i in range(n):
            t = i / max(n - 1, 1)
            wd = width * ss * ((0.3 + 0.7 * math.sin(math.pi * t)) if taper else 1)
            if i < n - 1:
                d.line([q[i], q[i + 1]], fill=255, width=max(1, int(wd)))
            d.ellipse([q[i][0] - wd / 2, q[i][1] - wd / 2, q[i][0] + wd / 2, q[i][1] + wd / 2], fill=255)
        small = big.resize((x1 - x0, y1 - y0), Image.LANCZOS)
        cur = np.asarray(layer.crop((x0, y0, x1, y1)))[..., 3]
        a_ = np.maximum(cur, (np.asarray(small).astype(int) * alpha // 255).astype('uint8'))
        patch = Image.new('RGBA', small.size, color + (0,))
        patch.putalpha(Image.fromarray(a_))
        layer.paste(patch, (x0, y0))
    if soft > 1.0:
        layer = layer.filter(ImageFilter.GaussianBlur(soft))
    if clip is not None:
        a_ = np.asarray(layer).copy()
        a_[..., 3] = (a_[..., 3].astype(int) * np.asarray(clip).astype(int) // 255).astype('uint8')
        layer = Image.fromarray(a_)
    return layer


def band_strokes(band_lines, band_width, clip, n, colors, width, length, angle, alpha, seed, feather=10):
    """Bristle strokes kept inside a feathered band along the given lines (painted shading/highlight)."""
    band = line_layer(band_lines, (255, 255, 255), band_width, 255, None, soft=feather).split()[3]
    xs = [T(p)[0] for ln in band_lines for p in ln]; ys = [T(p)[1] for ln in band_lines for p in ln]
    area = (min(xs), min(ys), max(xs), max(ys))
    tex = strokes((W, H), n, colors, width, length, angle, alpha, seed, area, curve=0.04).filter(ImageFilter.GaussianBlur(1.2))
    a_ = np.asarray(tex).copy()
    a_[..., 3] = (a_[..., 3].astype(int) * np.asarray(band).astype(int) // 255 * np.asarray(clip).astype(int) // 255).astype('uint8')
    return Image.fromarray(a_)


def offset_line(pts, dy):
    return [(x, y + dy) for x, y in pts]


# ---------- base coats ----------
size = (W, H)
base = Image.new('RGB', size, C['canvas'])
ang = lambda lo, hi: (lambda r: math.radians(r.uniform(lo, hi)) if r.random() < 0.5 else math.radians(r.uniform(lo, hi) + 70))
bg_tex = Image.alpha_composite(
    strokes(size, 260, [C['bg_light'], C['bg_dark'], (216, 220, 104)], (110, 220), (380, 900), ang(-40, -15), (0.35, 0.7), 1, curve=0.25),
    strokes(size, 380, [C['bg_light'], (232, 234, 150), C['bg_dark']], (40, 100), (200, 520), ang(-40, -15), (0.25, 0.55), 2, curve=0.2))
paint_region(base, GROUPS['bg'], C['bg'], bg_tex, blur=1.6)
face_tex = strokes(size, 140, [(238, 238, 234), (251, 251, 249)], (110, 200), (300, 650), lambda r: math.radians(r.uniform(-60, 60)), (0.15, 0.35), 3, (300, 600, 2100, 2300), curve=0.3)
paint_region(base, GROUPS['face'], C['white'], face_tex, blur=2.5)
black_tex = strokes(size, 420, [(52, 55, 57), (26, 27, 28)], (70, 160), (260, 700), lambda r: math.radians(r.uniform(-75, 75)), (0.3, 0.6), 4, curve=0.3)
paint_region(base, GROUPS['black1'] + GROUPS['black2'], C['black'], black_tex, blur=1.6)
stalk_dir = math.atan2((358 - 476) * SY, (422 - 173) * SX)
stalk_tex = strokes(size, 300, [(138, 176, 92), (106, 144, 68)], (30, 70), (160, 420), lambda r: stalk_dir + r.uniform(-0.08, 0.08), (0.35, 0.65), 5, (900, 1950, 2400, 2850), curve=0.05)
paint_region(base, GROUPS['stalk'], C['stalk'], stalk_tex, blur=1.4)
leaf_tex = strokes(size, 380, [(92, 140, 80), (62, 106, 58)], (24, 50), (120, 300), lambda r: math.radians(r.uniform(-70, -20) if r.random() < 0.6 else r.uniform(-20, 20)), (0.35, 0.65), 6, (150, 1150, 2400, 3000), curve=0.1)
paint_region(base, GROUPS['leaves'], C['leaf'], leaf_tex, blur=1.4)
paint_region(base, GROUPS['dots'], C['canvas'])
painted = np.asarray(mask(sum(GROUPS.values(), []))) > 0
arr = np.asarray(base).astype(np.int16)
arr[painted] += grain(7, 5)[painted][:, None]
base = Image.fromarray(np.clip(arr, 0, 255).astype('uint8'))

# ---------- detail layers ----------
stalk_clip = mask(['stalk', 'twig'], 1.5)
leaf_clip = mask(GROUPS['leaves'], 1.5)
STALK_TOP = SHAPES['stalk'][1]
STALK_BOTTOM = SHAPES['stalk'][3][::-1]
stalk_along = lambda r: stalk_dir + r.uniform(-0.05, 0.05)
segs = [(171, 205), (210, 258), (263, 320), (325, 393), (398, 422)]
shade = [
    band_strokes([offset_line(STALK_BOTTOM[1:], -7)], 70, stalk_clip, 260, [C['shade'], (62, 98, 52)], (24, 50), (140, 360), stalk_along, (0.45, 0.8), 11),
    band_strokes([[(316, 392), (331, 366), (347, 338)]], 18, stalk_clip, 60, [C['shade']], (10, 20), (60, 140), lambda r: math.radians(-58), (0.4, 0.7), 12, feather=3),
    line_layer(JOINTS, C['shade'], 20, 255, stalk_clip),
    line_layer([[(x + 3.2, y) for x, y in j] for j in JOINTS], (150, 186, 108), 7, 200, stalk_clip),
    line_layer([[(342, 333), (362, 326), (380, 314), (396, 296), (404, 270)],  # shady side of each leaf
                [(331, 370), (352, 362), (380, 351), (420, 341)],
                [(274, 469), (312, 479), (352, 482), (386, 476)]], C['shade'], 34, 140, leaf_clip, soft=8),
]
MIDRIBS = [[(350, 333), (370, 290), (388, 250), (402, 218)], [(333, 369), (360, 353), (390, 340), (420, 332)],
           [(274, 467), (310, 460), (350, 464), (387, 476)], [(325, 491), (331, 508), (336, 527)],
           [(40, 526), (62, 512), (91, 504)]]
light = [
    line_layer(MIDRIBS, C['light'], 13, 240, leaf_clip, taper=True),
    line_layer([[(356, 318), (366, 285), (381, 252), (396, 226)], [(345, 352), (375, 340), (405, 333)],
                [(300, 452), (330, 449), (357, 455)]], (226, 236, 210), 6, 220, leaf_clip, taper=True),
]
for i, (a, b) in enumerate(segs):
    pts = [p for p in catmull(STALK_TOP) if a + 5 <= p[0] <= b - 5]
    light.append(band_strokes([offset_line(pts, 11)], 46, stalk_clip, 90, [C['light'], (196, 220, 156)], (16, 36), (90, 260), stalk_along, (0.45, 0.85), 20 + i, feather=8))
    light.append(line_layer([offset_line(pts[2:-2], 9)], (228, 238, 214), 6, 190, stalk_clip, taper=True))
body_clip = mask(['body'], 1.0)
ear_clip = mask(['earL', 'earR'], 1.0)
shine = [line_layer(EAR_SHINE, C['gray'], 30, 245, ear_clip, taper=True),
         line_layer([ARM_LINE[1:-1]], C['gray'], 20, 235, body_clip, taper=True)]
face_detail = [line_layer(FACE_LINES, C['black'], 14, 255, mask(['face', 'patchL', 'patchR', 'nose'], 0.5)),
               line_layer([NOSE_SHINE], C['gray'], 20, 245, mask(['nose'], 1.0), taper=True)]
dots_white = Image.new('RGBA', size, (0, 0, 0, 0))
dots_white.paste(Image.new('RGBA', size, C['white'] + (255,)), (0, 0), mask(GROUPS['dots'], 1.0))
face_detail.append(dots_white)
DETAILS = {8: shade, 9: light, 10: shine, 11: face_detail}


def compose(painted, upto, lines=True):
    img = Image.new('RGB', size, C['canvas'])
    img.paste(base, (0, 0), mask(sum((GROUPS[g] for g in painted), []), 0.7))
    img = img.convert('RGBA')
    if lines:
        img = Image.alpha_composite(img, outline)
    for k in sorted(DETAILS):
        if k <= upto:
            for layer in DETAILS[k]:
                img = Image.alpha_composite(img, layer)
    return img.convert('RGB')


outline = Image.open(os.path.join(WORK, 'outline.png')).convert('RGBA')

reference = compose(list(GROUPS), 11, lines=False)
reference.save(os.path.join(WORK, 'panda-finished-reference-8x10.png'), dpi=(300, 300))

# ---------- guide step pictures ----------
STAGES = [
    (1, [], None), (2, ['bg'], None), (3, ['bg', 'face'], None), (4, ['bg', 'face', 'black1'], None),
    (5, ['bg', 'face', 'black1', 'black2'], None), (6, ['bg', 'face', 'black1', 'black2', 'stalk'], None),
    (7, ['bg', 'face', 'black1', 'black2', 'stalk', 'leaves'], None),
    (8, ['bg', 'face', 'black1', 'black2', 'stalk', 'leaves'], (1080, 1880, 2400, 3000)),
    (9, ['bg', 'face', 'black1', 'black2', 'stalk', 'leaves'], (1460, 1480, 2400, 2280)),
    (10, ['bg', 'face', 'black1', 'black2', 'stalk', 'leaves'], (0, 650, 1300, 1750)),
    (11, ['bg', 'face', 'black1', 'black2', 'stalk', 'leaves'], (720, 1220, 1920, 2260)),
]
sdir = os.path.join(WORK, 'steps')
os.makedirs(sdir, exist_ok=True)
plan = []
for n, painted, crop in STAGES:
    img = compose(painted, n)
    if crop:
        img = img.crop(crop)
        img = img.resize((1000, round(1000 * img.height / img.width)), Image.LANCZOS)
    else:
        img = img.resize((960, 1200), Image.LANCZOS)
    img.save(os.path.join(sdir, f'step-{n}.png'), dpi=(300, 300))
    plan.append({'step': n, 'painted': painted, 'details': [k for k in DETAILS if k <= n], 'crop': crop})
json.dump(plan, open(os.path.join(WORK, 'stage-state.json'), 'w'), indent=1)
print('reference and', len(STAGES), 'step pictures written to', WORK)
