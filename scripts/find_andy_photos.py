#!/Users/Andy/Desktop/NUMU_WEBSITE_RESCUE/.venv-face/bin/python3
"""
find_andy_photos.py — Local face-recognition workflow
Finds photos of Andy Cartier by comparing face embeddings.
100% local: no cloud APIs. All models run on-device.

Usage:
  python3 scripts/find_andy_photos.py --test    # trial run on 100 images
  python3 scripts/find_andy_photos.py --run     # full scan
  python3 scripts/find_andy_photos.py --zip     # zip the output folder
"""

import sys
import os
import csv
import hashlib
import shutil
import zipfile
import argparse
from pathlib import Path
from datetime import datetime

# ── Dependency check ──────────────────────────────────────────────────────────
MISSING = []
try:
    import numpy as np
except ImportError:
    MISSING.append("numpy")

try:
    from PIL import Image, ImageOps
    from PIL.ExifTags import TAGS
except ImportError:
    MISSING.append("Pillow")

try:
    from tqdm import tqdm
except ImportError:
    MISSING.append("tqdm")

try:
    import cv2
except ImportError:
    MISSING.append("opencv-python")

if MISSING:
    print(f"\n  Missing packages: {', '.join(MISSING)}")
    print("  Run: pip3 install insightface onnxruntime pillow-heif tqdm\n")
    sys.exit(1)

try:
    from insightface.app import FaceAnalysis
    INSIGHTFACE_OK = True
except ImportError:
    INSIGHTFACE_OK = False
    print("  insightface not installed. Run: pip3 install insightface onnxruntime\n")
    sys.exit(1)

try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
    HEIC_OK = True
except ImportError:
    HEIC_OK = False

# ── Configuration ─────────────────────────────────────────────────────────────
HOME        = Path.home()
SCRIPT_DIR  = Path(__file__).parent

REFERENCE_DIR = SCRIPT_DIR / "reference_photos"
OUTPUT_BASE   = HOME / "Desktop" / "Photos of Andy"
CONFIRMED_DIR = OUTPUT_BASE / "Confirmed"
UNCERTAIN_DIR = OUTPUT_BASE / "Review manually"
CSV_PATH      = OUTPUT_BASE / "results.csv"
ZIP_PATH      = HOME / "Downloads" / f"Photos_of_Andy_{datetime.now().strftime('%Y%m%d')}.zip"

SCAN_DIRS = [HOME / "Desktop", HOME / "Downloads"]

EXTS = {".jpg", ".jpeg", ".png", ".webp", ".tiff", ".tif"}
if HEIC_OK:
    EXTS |= {".heic", ".heif"}

# Cosine similarity thresholds (higher = more similar, range 0–1)
MATCH_THRESHOLD     = 0.45   # ≥ this → Confirmed
UNCERTAIN_THRESHOLD = 0.30   # ≥ this but < MATCH_THRESHOLD → Review manually

MAX_DIM = 1280   # resize long edge before face detection (speed vs accuracy)


# ── Image helpers ─────────────────────────────────────────────────────────────
def file_hash(path: Path) -> str:
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def get_image_date(path: Path) -> str:
    try:
        with Image.open(path) as img:
            exif = img._getexif() if hasattr(img, "_getexif") else None
            if exif:
                for tag_id, value in exif.items():
                    if TAGS.get(tag_id) == "DateTimeOriginal":
                        return str(value)
    except Exception:
        pass
    return datetime.fromtimestamp(path.stat().st_mtime).strftime("%Y-%m-%d %H:%M:%S")


def pil_to_bgr(img: Image.Image) -> np.ndarray:
    """Convert PIL RGB image to BGR numpy array for insightface."""
    arr = np.array(img.convert("RGB"))
    return arr[:, :, ::-1].copy()


def load_image_bgr(path: Path):
    """Load an image from path, auto-rotating via EXIF, return BGR array."""
    with Image.open(path) as img:
        img.load()
        img = ImageOps.exif_transpose(img)
        return pil_to_bgr(img)


def resize_for_detection(arr: np.ndarray, max_dim: int = MAX_DIM) -> np.ndarray:
    h, w = arr.shape[:2]
    if max(h, w) <= max_dim:
        return arr
    scale = max_dim / max(h, w)
    return cv2.resize(arr, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)


def find_images(dirs):
    """Yield Path objects for all supported images in the given directories."""
    for d in dirs:
        for root, subdirs, files in os.walk(d):
            root_p = Path(root)
            # Skip hidden directories
            subdirs[:] = [s for s in subdirs if not s.startswith(".")]
            # Skip the output folder to avoid scanning results
            if OUTPUT_BASE == root_p or OUTPUT_BASE in root_p.parents:
                continue
            for fname in files:
                if Path(fname).suffix.lower() in EXTS and not fname.startswith("."):
                    yield root_p / fname


def copy_preserving_structure(src: Path, dst_base: Path) -> Path:
    """
    Copy src into dst_base, preserving its path relative to HOME.
    ~/Desktop/trip/photo.jpg → dst_base/Desktop/trip/photo.jpg
    """
    try:
        rel = src.relative_to(HOME)
    except ValueError:
        rel = Path(src.name)
    dst = dst_base / rel
    dst.parent.mkdir(parents=True, exist_ok=True)
    if dst.exists():
        # Avoid collision: append stem suffix
        dst = dst.parent / f"{dst.stem}__{src.parent.name}{dst.suffix}"
    shutil.copy2(src, dst)
    return dst


# ── Face recognition ──────────────────────────────────────────────────────────
def init_analyser():
    """Initialise insightface — downloads model (~180 MB) on first run only."""
    print("  Initialising face model (first run downloads ~180 MB to ~/.insightface/)…")
    analyser = FaceAnalysis(name="buffalo_sc", providers=["CPUExecutionProvider"])
    analyser.prepare(ctx_id=0, det_size=(640, 640))
    return analyser


def build_reference_embeddings(analyser) -> list:
    """Load all reference photos and extract face embeddings."""
    ref_files = sorted(
        p for p in REFERENCE_DIR.iterdir()
        if p.suffix.lower() in EXTS and not p.name.startswith(".")
    )
    if not ref_files:
        print(f"\n  ⚠  No reference photos found in {REFERENCE_DIR}")
        print("     Add frontal face photos of Andy there and re-run.\n")
        sys.exit(1)

    embeddings = []
    print(f"\n  Loading {len(ref_files)} reference photo(s) from {REFERENCE_DIR.name}/")
    for path in ref_files:
        try:
            bgr = load_image_bgr(path)
            faces = analyser.get(bgr)
            if not faces:
                print(f"    ⚠  No face detected: {path.name}")
                continue
            best = max(faces, key=lambda f: f.det_score)
            embeddings.append(best.normed_embedding)
            print(f"    ✓  {path.name}  (confidence={best.det_score:.2f})")
        except Exception as e:
            print(f"    ✗  {path.name}: {e}")

    if not embeddings:
        print("\n  No embeddings built — check that reference photos have clear frontal faces.\n")
        sys.exit(1)

    print(f"\n  Reference profile: {len(embeddings)} embedding(s) ready.\n")
    return embeddings


def best_similarity(face_emb: np.ndarray, ref_embeddings: list) -> float:
    """Highest cosine similarity between a detected face and any reference."""
    return float(max(np.dot(face_emb, ref) for ref in ref_embeddings))


def check_image(path: Path, ref_embeddings: list, analyser) -> tuple[float, bool]:
    """
    Returns (best_similarity, found_match).
    found_match is True if similarity >= UNCERTAIN_THRESHOLD.
    """
    try:
        bgr = load_image_bgr(path)
        bgr_small = resize_for_detection(bgr)
        faces = analyser.get(bgr_small)
        if not faces:
            return 0.0, False
        sims = [best_similarity(f.normed_embedding, ref_embeddings) for f in faces]
        best = max(sims)
        return best, best >= UNCERTAIN_THRESHOLD
    except Exception:
        return 0.0, False


# ── Main workflow ─────────────────────────────────────────────────────────────
def run_scan(test_mode: bool = False, limit: int = 100):
    label = "TEST RUN — first 100 images" if test_mode else "FULL SCAN"
    print(f"\n  NUMU · Face Finder  [{label}]")
    print(f"  {'─' * 54}")
    print(f"  Scanning : {', '.join(str(d) for d in SCAN_DIRS)}")
    print(f"  Output   : {OUTPUT_BASE}")
    print(f"  HEIC     : {'enabled' if HEIC_OK else 'disabled (pip install pillow-heif)'}\n")

    analyser = init_analyser()
    ref_embeddings = build_reference_embeddings(analyser)

    print("  Collecting images…")
    all_images = list(find_images(SCAN_DIRS))
    print(f"  Found {len(all_images):,} images total.")

    if test_mode:
        all_images = all_images[:limit]
        print(f"  → Limited to first {limit} for test.\n")
    else:
        print()

    CONFIRMED_DIR.mkdir(parents=True, exist_ok=True)
    UNCERTAIN_DIR.mkdir(parents=True, exist_ok=True)

    seen_hashes: dict[str, Path] = {}
    csv_rows = []
    confirmed = 0
    uncertain = 0

    for path in tqdm(all_images, unit="img", ncols=72, desc="  Scanning"):
        sim, found = check_image(path, ref_embeddings, analyser)
        if not found:
            continue

        img_date = get_image_date(path)
        img_hash = file_hash(path)

        if img_hash in seen_hashes:
            csv_rows.append({
                "original_path": str(path),
                "copied_path": str(seen_hashes[img_hash]),
                "similarity": f"{sim:.4f}",
                "image_date": img_date,
                "note": "duplicate — not copied again",
            })
            continue

        if sim >= MATCH_THRESHOLD:
            dst = copy_preserving_structure(path, CONFIRMED_DIR)
            note = "confirmed"
            confirmed += 1
        else:
            dst = copy_preserving_structure(path, UNCERTAIN_DIR)
            note = "review manually"
            uncertain += 1

        seen_hashes[img_hash] = dst
        csv_rows.append({
            "original_path": str(path),
            "copied_path": str(dst),
            "similarity": f"{sim:.4f}",
            "image_date": img_date,
            "note": note,
        })

    # Write CSV
    CSV_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f, fieldnames=["original_path", "copied_path", "similarity", "image_date", "note"]
        )
        writer.writeheader()
        writer.writerows(csv_rows)

    total = confirmed + uncertain
    print(f"\n  {'─' * 54}")
    print(f"  Scanned          : {len(all_images):,} images")
    print(f"  ✓ Confirmed      : {confirmed}   (similarity ≥ {MATCH_THRESHOLD})")
    print(f"  ? Review manually: {uncertain}   (similarity {UNCERTAIN_THRESHOLD}–{MATCH_THRESHOLD})")
    print(f"  Total matched    : {total}")
    print(f"  CSV log          : {CSV_PATH}")
    if test_mode:
        print(f"\n  → Review '{OUTPUT_BASE.name}' on your Desktop.")
        print(f"  → If results look right, run with --run for the full scan.\n")
    else:
        print(f"\n  → Run with --zip to create a ZIP archive.\n")

    return total


def create_zip():
    if not OUTPUT_BASE.exists():
        print(f"\n  '{OUTPUT_BASE}' not found. Run --run first.\n")
        sys.exit(1)

    print(f"\n  Creating ZIP archive…")
    print(f"  Source : {OUTPUT_BASE}")
    print(f"  Output : {ZIP_PATH}\n")

    with zipfile.ZipFile(ZIP_PATH, "w", zipfile.ZIP_DEFLATED) as zf:
        for f in tqdm(list(OUTPUT_BASE.rglob("*")), unit="file", ncols=72, desc="  Zipping"):
            if f.is_file():
                zf.write(f, f.relative_to(OUTPUT_BASE.parent))

    size_mb = ZIP_PATH.stat().st_size / 1_048_576
    print(f"\n  ✓ ZIP saved: {ZIP_PATH}  ({size_mb:.1f} MB)\n")


# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Find photos of Andy Cartier using local face recognition.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Steps:\n"
            "  1. python3 scripts/find_andy_photos.py --test   # trial on 100 images\n"
            "  2. Review 'Photos of Andy' folder on your Desktop\n"
            "  3. python3 scripts/find_andy_photos.py --run    # full scan\n"
            "  4. python3 scripts/find_andy_photos.py --zip    # archive results\n\n"
            "Reference photos go in: scripts/reference_photos/\n"
        ),
    )
    parser.add_argument("--test", action="store_true", help="Trial run on first 100 images")
    parser.add_argument("--run",  action="store_true", help="Full scan of Desktop + Downloads")
    parser.add_argument("--zip",  action="store_true", help="Create ZIP archive of output folder")
    args = parser.parse_args()

    if args.zip:
        create_zip()
    elif args.test:
        run_scan(test_mode=True, limit=100)
    elif args.run:
        run_scan(test_mode=False)
    else:
        parser.print_help()
