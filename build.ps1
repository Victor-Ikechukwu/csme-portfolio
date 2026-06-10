$ErrorActionPreference = "Stop"

$python = if (Test-Path ".\.venv\Scripts\python.exe") {
  ".\.venv\Scripts\python.exe"
} else {
  "python"
}

& $python "tools\validate_appreciations.py"
& $python -m pelican content -o output -s pelicanconf.py
