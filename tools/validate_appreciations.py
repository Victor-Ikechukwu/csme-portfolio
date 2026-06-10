from __future__ import annotations

import json
import sys
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "content" / "data" / "appreciations.json"
REQUIRED_FIELDS = ("name", "headline", "created_at", "message")
VALID_MEDIA_KINDS = {"image", "video"}
SUSPICIOUS_FRAGMENTS = ("â€™", "â€œ", "â€\x9d", "â€”", "â\x9d¤", "ðŸ", "ï¸")


def find_suspicious_strings(value, path: str = "root") -> list[str]:
    findings: list[str] = []

    if isinstance(value, dict):
        for key, child in value.items():
            findings.extend(find_suspicious_strings(child, f"{path}.{key}"))
        return findings

    if isinstance(value, list):
        for index, child in enumerate(value):
            findings.extend(find_suspicious_strings(child, f"{path}[{index}]"))
        return findings

    if isinstance(value, str) and any(fragment in value for fragment in SUSPICIOUS_FRAGMENTS):
        findings.append(f"{path}: suspicious mojibake-like text detected")

    return findings


def main() -> int:
    try:
        with DATA_FILE.open("r", encoding="utf-8") as handle:
            entries = json.load(handle)
    except FileNotFoundError:
        print(f"Missing appreciation file: {DATA_FILE}")
        return 1
    except json.JSONDecodeError as exc:
        print(f"Invalid JSON in {DATA_FILE}: {exc}")
        return 1

    if not isinstance(entries, list):
        print("Appreciations data must be a JSON array.")
        return 1

    errors: list[str] = []

    for index, entry in enumerate(entries):
        location = f"entry[{index}]"
        if not isinstance(entry, dict):
            errors.append(f"{location}: each appreciation must be an object")
            continue

        for field in REQUIRED_FIELDS:
            value = str(entry.get(field, "")).strip()
            if not value:
                errors.append(f"{location}.{field}: required value is missing")

        created_at = str(entry.get("created_at", "")).strip()
        if created_at:
            try:
                datetime.strptime(created_at, "%Y-%m-%d")
            except ValueError:
                errors.append(f"{location}.created_at: expected YYYY-MM-DD")

        media_items = entry.get("media", [])
        if media_items is None:
            media_items = []
        if not isinstance(media_items, list):
            errors.append(f"{location}.media: expected a list")
            continue

        for media_index, media in enumerate(media_items):
            media_location = f"{location}.media[{media_index}]"
            if not isinstance(media, dict):
                errors.append(f"{media_location}: media item must be an object")
                continue

            kind = str(media.get("kind", "")).strip().lower()
            url = str(media.get("url", "")).strip()
            if kind not in VALID_MEDIA_KINDS:
                errors.append(f"{media_location}.kind: expected one of {sorted(VALID_MEDIA_KINDS)}")
            if not url:
                errors.append(f"{media_location}.url: media URL is required")

    errors.extend(find_suspicious_strings(entries))

    if errors:
        print("Appreciation validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"Validated {len(entries)} appreciation entries in {DATA_FILE}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
