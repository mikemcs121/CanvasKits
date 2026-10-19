"""Shared Panda geometry: source-to-canvas mapping, region ids and the hand-drawn shapes.

Source coordinates are pixels of the supplied 418 x 525 painting (info/archive/previous-root-files/Panda.jpg).
The canvas is 2400 x 3000 (8 x 10 in at 300 DPI). Bamboo, eye dots, face lines, joints and the arm line are
drawn here by hand because they cannot be separated by colour; the parts hidden under the supplied logo and
signature (bottom centre and bottom right) are reconstructions.
"""
import math

W, H = 2400, 3000
SX = W / 418
SY = 3014 / 525
OY = 7  # rows cropped from the top of the 2400 x 3014 upscale to give 4:5


def T(p):
    return (p[0] * SX, p[1] * SY - OY)


REGIONS = {
    'bg': 0, 'face': 1, 'earL': 2, 'earR': 3, 'patchL': 4, 'patchR': 5, 'nose': 6, 'body': 7,
    'stalk': 8, 'twig': 9, 'leafA': 10, 'leafB': 11, 'leafC': 12, 'leafD': 13, 'leafE': 14,
    'dotL': 15, 'dotR': 16,
}

# Seeds (source px) for the black components found by colour.
BLACK_SEEDS = {'earL': (85, 185), 'earR': (290, 125), 'patchL': (140, 300), 'patchR': (270, 255),
               'nose': (228, 335), 'body': (60, 480)}

# Supplied logo and signature: painted over as panda body before the bamboo is drawn.
COVER_RECTS = [(198, 449, 418, 525), (360, 462, 418, 525)]

# Painted shine inside the nose: treated as nose black so the nose keeps its full outline.
FORCE_BLACK = [[(197, 334), (211, 322), (234, 312), (253, 305), (256, 312), (238, 320), (215, 329), (201, 339)]]

# Green paint behind the bamboo is background above this edge of the body and body below it.
BODY_TOP_RIGHT = [(340, 299), (370, 302), (388, 306), (405, 315), (420, 322)]

# Shapes are lists of edges; each edge is smoothed separately so leaf tips stay pointed.
SHAPES = {
    'leafA': [[(348, 336), (350, 320), (352, 300), (358, 280), (366, 262), (374, 248), (384, 232), (395, 220), (403, 214)],
              [(403, 214), (406, 225), (405, 245), (401, 270), (395, 290), (387, 306), (377, 319), (364, 330), (348, 336)]],
    'twig': [[(311, 391), (322, 374), (333, 356), (346, 330)],
             [(346, 330), (352, 332)],
             [(352, 332), (339, 359), (328, 377), (318, 393)]],
    'leafB': [[(329, 371), (337, 360), (349, 345), (365, 337), (382, 332), (400, 327), (422, 323)],
              [(422, 323), (422, 342)],
              [(422, 342), (401, 344), (382, 350), (365, 356), (350, 363), (338, 369), (329, 371)]],
    'leafC': [[(270, 468), (290, 449), (312, 441), (331, 443), (350, 450), (370, 462), (389, 476)],
              [(389, 476), (375, 480), (355, 483), (335, 483), (312, 480), (291, 475), (270, 468)]],
    'leafD': [[(324, 487), (329, 498), (336, 510), (344, 527)],
              [(344, 527), (325, 527)],
              [(325, 527), (323, 506), (324, 487)]],
    'leafE': [[(37, 527), (49, 513), (64, 504), (81, 500), (93, 504)],
              [(93, 504), (89, 516), (80, 527)],
              [(80, 527), (37, 527)]],
    'stalk': [[(173, 476), (168, 458), (167, 440), (171, 428)],
              [(171, 428), (186, 424), (207, 419), (235, 410), (262, 402), (292, 393), (322, 384), (355, 375), (395, 364), (422, 358)],
              [(422, 358), (422, 398)],
              [(422, 398), (400, 402), (375, 408), (350, 414), (322, 421), (300, 426), (275, 433), (255, 438), (232, 443), (212, 449), (196, 459), (183, 469), (173, 476)]],
}
DRAW_ORDER = ['twig', 'leafA', 'leafB', 'leafC', 'leafD', 'leafE', 'stalk']

DOTS = {'dotL': ((159.3, 261.7), 3.4), 'dotR': ((250.7, 236.2), 3.4)}

# Open lines (source px). Face lines become black paint in step 11; joints and the arm guide later details.
FACE_LINES = [
    [(161, 340), (165, 346), (170, 353), (175, 360), (180, 366), (185, 371), (190, 375), (195, 379), (200, 382),
     (206, 383.8), (212, 383.6), (218, 382), (223, 379), (228, 375.5), (232, 371), (235.5, 366.5), (237.5, 364.5)],
    [(234, 348), (234.5, 356), (236, 362), (237.5, 364.5)],
    [(237.5, 364.5), (241, 367.5), (246, 368.5), (251, 368), (256, 366.3), (261, 364.3), (264.5, 362.5)],
    [(288, 305), (287.5, 318), (286, 328), (284, 338), (281, 346), (277, 352), (272, 357.5), (267, 361), (264.5, 362.5)],
    [(266, 362), (270, 366), (273, 370)],
    [(209, 383.7), (209.8, 387), (210.6, 391)],
]
JOINTS = [
    [(205, 416), (208, 426), (210, 438), (210, 452)],
    [(258, 399), (261, 410), (262, 422), (260, 440)],
    [(320, 381), (323, 392), (324, 404), (322, 424)],
    [(393, 361), (396, 372), (397, 384), (395, 405)],
]
ARM_LINE = [(14, 526), (18, 505), (25, 484), (37, 464), (51, 447), (70, 431), (98, 418), (122, 414), (140, 418),
            (152, 427), (163, 440), (171, 458), (175, 470)]

# Painted-only details for the reference (not printed on the transfer).
EAR_SHINE = [[(48, 206), (51, 182), (59, 162), (72, 146), (88, 136), (104, 132)],
             [(301, 94), (315, 100), (325, 112), (330, 125), (331, 139)]]
NOSE_SHINE = [(203, 331), (212, 324), (222, 318), (235, 314), (251, 309)]


def catmull(points, samples=10):
    """Open Catmull-Rom spline through the points (endpoints kept)."""
    if len(points) < 3:
        return list(points)
    p = [points[0]] + list(points) + [points[-1]]
    out = []
    for i in range(1, len(p) - 2):
        p0, p1, p2, p3 = p[i - 1], p[i], p[i + 1], p[i + 2]
        for s in range(samples):
            t = s / samples
            t2, t3 = t * t, t * t * t
            out.append(tuple(0.5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2
                                    + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3) for k in range(2)))
    out.append(points[-1])
    return out


def shape_polygon(name):
    """Canvas-space polygon for a hand-drawn shape."""
    pts = []
    for edge in SHAPES[name]:
        e = catmull(edge)
        pts.extend(e if not pts else e[1:])
    return [T(p) for p in pts]


def line_points(pts):
    return [T(p) for p in catmull(pts)]


def dot_polygon(name, n=48):
    (cx, cy), r = DOTS[name]
    return [T((cx + r * math.cos(2 * math.pi * i / n), cy + r * math.sin(2 * math.pi * i / n) * SX / SY)) for i in range(n)]
