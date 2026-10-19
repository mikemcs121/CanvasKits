"""Builds the Panda region label map and the 2-pt kids transfer outline.

Run from the project root:  python "Panda/info/tmp/build-outline.py" <workDir>
Writes <workDir>/labels.png (2400 x 3000 region ids, read by build-art.py) and
<workDir>/panda-outline-8x10.svg (promote to the kit root after review).
"""
import json, os, re, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from shapely.geometry import LineString, MultiLineString, Point, Polygon, box
from shapely.ops import nearest_points, unary_union

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from geometry import *  # noqa

ROOT = os.path.abspath(os.path.join(HERE, '../../..'))
SOURCE = os.path.join(HERE, '../archive/previous-root-files/Panda.jpg')
WORK = os.path.abspath(sys.argv[1])
os.makedirs(WORK, exist_ok=True)

STROKE = 2 / 72 * 300  # 2 pt in 300-DPI canvas units
GRAY = '#808080'       # children's transfer gray


def source_labels():
    im = np.asarray(Image.open(SOURCE).convert('RGB')).astype(int)
    h, w, _ = im.shape
    r, g, b = im[..., 0], im[..., 1], im[..., 2]
    mx, mn = im.max(2), im.min(2)
    cls = np.full((h, w), -1)
    cls[(r > 135) & (g > 135) & ((r + g) / 2 - b > 45)] = 0       # yellow-green background
    cls[(mn > 165) & (mx - mn < 45)] = 1                         # white face
    cls[mx < 100] = 2                                            # black
    for x0, y0, x1, y1 in COVER_RECTS:
        cls[y0:y1, x0:x1] = 2
    force = Image.new('L', (w, h), 0)
    for poly in FORCE_BLACK:
        ImageDraw.Draw(force).polygon(poly, fill=255)
    cls[np.asarray(force) > 0] = 2
    # Green bamboo paint: the hand-drawn shapes cover it later; decide what lies behind it.
    green = (cls == -1) & (g >= r - 5) & (g > b + 5)
    yy, xx = np.mgrid[0:h, 0:w]
    edge = np.interp(xx, [p[0] for p in BODY_TOP_RIGHT], [p[1] for p in BODY_TOP_RIGHT])
    cls[green & (xx >= 340) & (yy < edge)] = 0
    cls[green & ~((xx >= 340) & (yy < edge)) & ((xx >= 150) | (yy > 480))] = 2
    # Thin black face lines become face; they are drawn as open strokes instead.
    black = Image.fromarray(((cls == 2) * 255).astype('uint8'))
    opened = np.asarray(black.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.MaxFilter(5))) > 0
    thin = (cls == 2) & ~opened
    thin[:, :150] = False; thin[:, 300:] = False; thin[:295, :] = False; thin[400:, :] = False
    thin[298:349, 190:263] = False  # keep the nose's thin dark rim above its shine
    cls[thin] = -1
    # Keep only the connected face as white; ear/nose/arm shine and eye dots fall back to their surroundings.
    # The flood passes through the removed lines so the chin below the mouth stays part of the face.
    white = Image.fromarray((((cls == 1) | thin) * 255).astype('uint8')).copy()  # copy: floodfill ignores array-backed images
    ImageDraw.floodfill(white, (200, 200), 128)
    face = np.asarray(white) == 128
    cls[(cls == 1) & ~face] = -1
    cls[thin & face] = 1
    # Fill unknown pixels (green paint, shine, signature edges) from neighbouring labels.
    while (cls == -1).any():
        for v in (1, 2, 0):
            grown = np.asarray(Image.fromarray(((cls == v) * 255).astype('uint8')).filter(ImageFilter.MaxFilter(3))) > 0
            cls[(cls == -1) & grown] = v
    lab = np.zeros((h, w), np.uint8)
    lab[cls == 1] = REGIONS['face']
    black = Image.fromarray(((cls == 2) * 255).astype('uint8')).copy()
    for name, seed in BLACK_SEEDS.items():
        ImageDraw.floodfill(black, seed, 10 + REGIONS[name])
    b = np.asarray(black)
    for name in BLACK_SEEDS:
        lab[b == 10 + REGIONS[name]] = REGIONS[name]
    # Black specks not reached from any seed (dark leaf edges) take the label of their neighbours.
    stray = b == 255
    lab[stray] = 255
    while stray.any():
        for v in np.unique(lab[~stray]):
            grown = np.asarray(Image.fromarray(((lab == v) * 255).astype('uint8')).filter(ImageFilter.MaxFilter(3))) > 0
            hit = stray & grown
            lab[hit] = v
            stray &= ~hit
    return lab


def upscale(lab):
    best = np.full((3014, W), -1.0, np.float32)
    out = np.zeros((3014, W), np.uint8)
    for v in np.unique(lab):
        m = Image.fromarray(((lab == v) * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.5))
        f = np.asarray(m.resize((W, 3014), Image.BICUBIC), np.float32)
        sel = f > best
        best[sel] = f[sel]
        out[sel] = v
    return out[OY:OY + H]


def build_labels():
    lab = upscale(source_labels())
    img = Image.fromarray(lab)
    d = ImageDraw.Draw(img)
    for name in DRAW_ORDER:
        d.polygon(shape_polygon(name), fill=REGIONS[name])
    for name in DOTS:
        d.polygon(dot_polygon(name), fill=REGIONS[name])
    # Remove isolated islands smaller than a few pixels left by the upscale.
    img = img.filter(ImageFilter.ModeFilter(5))
    img.save(os.path.join(WORK, 'labels.png'))
    return np.asarray(img)


def parse_path(d):
    """Flatten potrace path data into rings of canvas points."""
    tokens = re.findall(r'[MCLZ]|-?\d+(?:\.\d+)?', d)
    rings, cur, i, cmd = [], [], 0, None
    pos = (0, 0)
    while i < len(tokens):
        t = tokens[i]
        if t in 'MCLZ':
            cmd = t; i += 1
            if cmd == 'Z':
                if cur: rings.append(cur)
                cur = []
            continue
        n = lambda k: float(tokens[i + k])
        if cmd == 'M':
            if cur: rings.append(cur)
            pos = (n(0), n(1)); cur = [pos]; i += 2
        elif cmd == 'L':
            pos = (n(0), n(1)); cur.append(pos); i += 2
        elif cmd == 'C':
            p0, p1, p2, p3 = pos, (n(0), n(1)), (n(2), n(3)), (n(4), n(5))
            for s in range(1, 9):
                t_ = s / 8
                cur.append(tuple((1 - t_) ** 3 * p0[k] + 3 * (1 - t_) ** 2 * t_ * p1[k] + 3 * (1 - t_) * t_ ** 2 * p2[k] + t_ ** 3 * p3[k] for k in range(2)))
            pos = p3; i += 6
    if cur: rings.append(cur)
    return rings


def smooth_ring(ring, sigma=9.0, step=3.0):
    """Resample a closed ring evenly and Gaussian-smooth it (removes JPEG segmentation wobble)."""
    ls = LineString(ring + [ring[0]])
    n = max(int(ls.length / step), 8)
    pts = np.array([ls.interpolate(i / n, normalized=True).coords[0] for i in range(n)])
    k = int(3 * sigma / step) + 1
    wts = np.exp(-0.5 * (np.arange(-k, k + 1) * step / sigma) ** 2); wts /= wts.sum()
    padded = np.concatenate([pts[-k:], pts, pts[:k]])
    sm = np.stack([np.convolve(padded[:, j], wts, mode='valid') for j in range(2)], 1)
    return [tuple(p) for p in sm]


HAND = set(SHAPES) | set(DOTS)


def pieces(geom):
    if geom.is_empty: return []
    if isinstance(geom, LineString): return [geom]
    return [g for g in getattr(geom, 'geoms', []) if isinstance(g, LineString)]


def build_outline(lab):
    mdir = os.path.join(WORK, 'masks')
    os.makedirs(mdir, exist_ok=True)
    for f in os.listdir(mdir): os.remove(os.path.join(mdir, f))
    order = ['dotL', 'dotR', 'nose', 'patchL', 'patchR', 'face', 'earL', 'earR', 'stalk', 'leafB', 'twig',
             'leafA', 'leafC', 'leafD', 'leafE', 'body']
    for name in order:
        Image.fromarray(np.where(lab == REGIONS[name], 0, 255).astype('uint8')).save(os.path.join(mdir, name + '.png'))
    out = os.path.join(WORK, 'traces.json')
    subprocess.run(['node', os.path.join(HERE, 'trace-masks.cjs'), mdir, out], check=True)
    traces = json.load(open(out))

    tol = STROKE * 1.4
    border = box(0, 0, W, H).exterior.buffer(4)
    drawn = []
    result = []

    def add(line, snap=True):
        line = line.simplify(0.5)
        if line.length < (45 if snap else 14): return  # drops stray ticks left between near-coincident edges
        if snap and drawn:
            u = unary_union(drawn)
            coords = list(line.coords)
            for end in (0, -1):
                p = Point(coords[end])
                if 0 < p.distance(u) <= tol + 4:
                    q = nearest_points(p, u)[1]
                    if end == 0: coords.insert(0, (q.x, q.y))
                    else: coords.append((q.x, q.y))
            line = LineString(coords)
        drawn.append(line)
        result.append(line)

    for name in order:
        rings = parse_path(traces[name])
        before = unary_union(drawn).buffer(tol) if drawn else None
        for ring in rings:
            if len(ring) < 4: continue
            if name not in HAND: ring = smooth_ring(ring)
            ls = LineString(ring + [ring[0]])
            keep = ls.difference(border)
            if before is not None: keep = keep.difference(before)
            for p in pieces(keep):
                add(p)
    # Open lines: face lines, bamboo joints, arm guide.
    stalk = Polygon(shape_polygon('stalk'))
    for pts in FACE_LINES:
        add(LineString(line_points(pts)), snap=False)
    for pts in JOINTS:
        for p in pieces(LineString(line_points(pts)).intersection(stalk.buffer(STROKE * 0.2))):
            add(p, snap=False)
    covered = unary_union([Polygon(shape_polygon(n)).buffer(STROKE) for n in ('stalk', 'leafE')])
    for p in pieces(LineString(line_points(ARM_LINE)).difference(covered).difference(border)):
        add(p, snap=False)
    return result


def write_svg(lines):
    from shapely.ops import linemerge
    merged = linemerge(MultiLineString(lines))
    lines = pieces(merged) if merged.geom_type != 'LineString' else [merged]
    paths = []
    for ln in lines:
        c = list(ln.coords)
        paths.append('<path d="M ' + ' L '.join(f'{x:.1f} {y:.1f}' for x, y in c) + '"/>')
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="8in" height="10in" viewBox="0 0 {W} {H}">'
           '<title>Panda - fine kids transfer outline</title>'
           f'<desc>8 x 10 inches. True vector paths, no background. Line weight 2 pt. {GRAY}.</desc>'
           f'<g fill="none" stroke="{GRAY}" stroke-width="{STROKE}" stroke-linecap="round" stroke-linejoin="round">'
           + ''.join(paths) + '</g></svg>')
    p = os.path.join(WORK, 'panda-outline-8x10.svg')
    open(p, 'w', encoding='utf-8').write(svg)
    print(f'{len(paths)} paths -> {p}')


if __name__ == '__main__':
    write_svg(build_outline(build_labels()))
