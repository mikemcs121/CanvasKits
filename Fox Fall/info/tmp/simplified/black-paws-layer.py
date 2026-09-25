from pathlib import Path
import hashlib
import json

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[4]
KIT = ROOT / "Fox Fall"
SOURCE_DIR = KIT / "info/tmp/8x10-artwork"
ASSETS = KIT / "info/assets/simplified"
SOURCE = SOURCE_DIR / "step-7.png"
MASK_FILE = SOURCE_DIR / "group-mask.bin"
OUTPUT = ASSETS / "fox-fall-final-step-7-black-paws.png"

ASSETS.mkdir(parents=True, exist_ok=True)


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


source = np.array(Image.open(SOURCE).convert("RGB"))
height, width = source.shape[:2]
groups = np.frombuffer(MASK_FILE.read_bytes(), dtype=np.uint8).reshape(height, width)

# groupNames in step-plan.json: white, orange, ivory, green, gold,
# leafOrange, leafGold, paws. Therefore paws is native group index 7.
paws_mask = groups == 7
result = source.copy()
result[paws_mask] = [0, 0, 0]

changed = np.any(result != source, axis=2)
assert np.array_equal(changed, paws_mask)
assert np.all(result[paws_mask] == 0)
assert np.array_equal(result[~paws_mask], source[~paws_mask])

Image.fromarray(result, "RGB").save(OUTPUT)

checks = {
    "source": str(SOURCE.relative_to(ROOT)),
    "sourceSha256": sha256(SOURCE),
    "mask": str(MASK_FILE.relative_to(ROOT)),
    "nativeGroupIndex": 7,
    "nativeGroupName": "paws",
    "maskPixels": int(paws_mask.sum()),
    "changedPixels": int(changed.sum()),
    "allChangedPixelsExactlyMask": True,
    "allMaskPixelsBlack": True,
    "allPixelsOutsideMaskUnchanged": True,
    "output": str(OUTPUT.relative_to(ROOT)),
    "outputSha256": sha256(OUTPUT),
}
(KIT / "info/tmp/simplified/black-paws-layer-checks.json").write_text(
    json.dumps(checks, indent=2), encoding="utf-8"
)
print(json.dumps(checks, indent=2))
