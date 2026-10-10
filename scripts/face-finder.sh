#!/bin/bash
# Wrapper — activates the face-recognition venv and runs find_andy_photos.py
# Usage:  ./scripts/face-finder.sh --test | --run | --zip
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PYTHON="$ROOT/.venv-face/bin/python3"

if [ ! -f "$PYTHON" ]; then
  echo "venv not found. Run: /opt/homebrew/bin/python3 -m venv .venv-face && .venv-face/bin/pip install insightface onnxruntime pillow-heif tqdm"
  exit 1
fi

exec "$PYTHON" "$ROOT/scripts/find_andy_photos.py" "$@"
