"""Paints the Panda finished reference and guide step pictures from the shared label map and outline.

Run from the project root after build-outline.py:
    python "Panda/info/tmp/build-art.py" <workDir>
Reads <workDir>/labels.png and <workDir>/outline.png (the SVG rendered at 2400 x 3000).
Writes <workDir>/panda-finished-reference-8x10.png (2400 x 3000, 300 DPI) and <workDir>/steps/step-1..3.png
(step 4 of the kids guide is the drying scene, which shows the reference).
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

# Ready-to-use paint colours for the 4-step kids guide (no mixing): yellow-green, white, black,
# light green, dark green. bg_light/bg_dark only vary the brushed texture of the yellow-green coat.
C = {
    'canvas': (255, 255, 255),
    'white': (244, 243, 237),
    'black': (35, 37, 38),
    'bg': (203, 206, 86),          # yellow-green
    'bg_light': (224, 228, 124),
    'bg_dark': (181, 188, 64),
    'stalk': (122, 160, 79),       # light green
    'leaf': (76, 124, 68),         # dark green (leaves and bamboo rings)
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
# Step 4 finishing touches, all in ready-to-use colours: dark green rings, black smile lines,
# white shine on the ears and nose, white eye dots. (No shading, highlights or mixed colours.)
ear_clip = mask(['earL', 'earR'], 1.0)
finish = [
    line_layer(JOINTS, C['leaf'], 20, 255, stalk_clip),
    line_layer(FACE_LINES, C['black'], 14, 255, mask(['face', 'patchL', 'patchR', 'nose'], 0.5)),
    line_layer(EAR_SHINE, C['white'], 30, 250, ear_clip, taper=True),
    line_layer([NOSE_SHINE], C['white'], 20, 250, mask(['nose'], 1.0), taper=True),
]
dots_white = Image.new('RGBA', size, (0, 0, 0, 0))
dots_white.paste(Image.new('RGBA', size, C['white'] + (255,)), (0, 0), mask(GROUPS['dots'], 1.0))
finish.append(dots_white)
DETAILS = {4: finish}


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

reference = compose(list(GROUPS), 4, lines=False)
reference.save(os.path.join(WORK, 'panda-finished-reference-8x10.png'), dpi=(300, 300))

# ---------- guide step pictures ----------
# Step 4 is the drying scene, which shows the reference itself.
STAGES = [
    (1, ['bg'], None),
    (2, ['bg', 'face', 'black1', 'black2'], None),
    (3, ['bg', 'face', 'black1', 'black2', 'stalk', 'leaves'], None),
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
