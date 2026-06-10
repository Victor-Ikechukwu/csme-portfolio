#!/usr/bin/env bash
set -euo pipefail

python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python tools/validate_appreciations.py
python -m pelican content -o output -s publishconf.py
