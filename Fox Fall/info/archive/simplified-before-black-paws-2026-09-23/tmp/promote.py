from pathlib import Path
import hashlib
import json
import shutil


ROOT = Path(__file__).resolve().parents[4]
KIT = ROOT / "Fox Fall"
WORK = KIT / "info/tmp/simplified"
DEST = KIT / "simplified"
SLUG = "fox-fall"


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


checks = json.loads((WORK / "verification.json").read_text(encoding="utf-8"))
required = [
    "referenceEmbeddedPixelsExactlyOriginalStep7",
    "mixingLanguageAbsent",
    "providedPaintsPresent",
    "originalProductionHashesUnchanged",
    "outlineTrueVectorNoBackground",
]
assert all(checks[key] for key in required)

before = json.loads((WORK / "original-hashes.json").read_text(encoding="utf-8"))
assert all(sha256(ROOT / path) == digest for path, digest in before.items())

DEST.mkdir(parents=True, exist_ok=True)
manifest = []
names = [
    f"{SLUG}-outline-8x10.svg",
    f"{SLUG}-painting-guide-8x10.pdf",
    f"{SLUG}-finished-reference-8x10.pdf",
]
for name in names:
    source = KIT / name if name.endswith(".svg") else WORK / name
    destination = DEST / name
    if destination.exists() and sha256(destination) != sha256(source):
        raise RuntimeError(
            "Preserve the existing alternate before replacing: " + str(destination)
        )
    shutil.copy2(source, destination)
    assert sha256(source) == sha256(destination)
    manifest.append(
        {
            "source": str(source.relative_to(ROOT)),
            "destination": str(destination.relative_to(ROOT)),
            "sha256": sha256(destination),
            "bytes": destination.stat().st_size,
        }
    )

assert len(list(DEST.iterdir())) == 3
assert sha256(DEST / f"{SLUG}-outline-8x10.svg") == sha256(
    KIT / f"{SLUG}-outline-8x10.svg"
)
assert all(sha256(ROOT / path) == digest for path, digest in before.items())

promotion = {
    "files": manifest,
    "originalsUnchanged": before,
    "review": "Final PDF renders and the outline-registration contact sheet passed visual review.",
    "print": "Print artwork at Actual size / 100%; the guide is US Letter.",
}
(WORK / "promotion-manifest.json").write_text(
    json.dumps(promotion, indent=2), encoding="utf-8"
)
print(json.dumps(promotion, indent=2))
