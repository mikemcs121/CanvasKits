from pathlib import Path
import hashlib
import json
import shutil


ROOT = Path(__file__).resolve().parents[3]
KIT = ROOT / "Fox Fall"
ARCHIVE = KIT / "info/archive/simplified-before-black-paws-2026-09-23"

if ARCHIVE.exists():
    raise RuntimeError(f"Archive already exists: {ARCHIVE}")


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


scopes = [
    (KIT / "simplified", ARCHIVE / "simplified"),
    (KIT / "info/assets/simplified", ARCHIVE / "assets"),
    (KIT / "info/output/simplified", ARCHIVE / "output"),
    (KIT / "info/tmp/simplified", ARCHIVE / "tmp"),
]

manifest = []
for source_root, destination_root in scopes:
    for source in sorted(path for path in source_root.rglob("*") if path.is_file()):
        relative = source.relative_to(source_root)
        destination = destination_root / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)
        digest = sha256(source)
        assert sha256(destination) == digest
        manifest.append(
            {
                "source": str(source.relative_to(ROOT)),
                "archive": str(destination.relative_to(ROOT)),
                "sha256": digest,
                "bytes": source.stat().st_size,
            }
        )

production = {}
for name in [
    "fox-fall-outline-8x10.svg",
    "fox-fall-painting-guide-8x10.pdf",
    "fox-fall-finished-reference-8x10.pdf",
]:
    path = KIT / name
    production[str(path.relative_to(ROOT))] = sha256(path)

record = {
    "archivedRevision": "Fox Fall simplified edition with dark-brown paws and ear tips",
    "reason": "User requested changing dark brown to black",
    "files": manifest,
    "productionHashesAtArchive": production,
}
(ARCHIVE / "archive-manifest.json").write_text(
    json.dumps(record, indent=2), encoding="utf-8"
)
print(json.dumps({"archive": str(ARCHIVE), "fileCount": len(manifest)}, indent=2))
