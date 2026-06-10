from __future__ import annotations

import argparse
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "content" / "data" / "appreciations.json"


def load_entries() -> list[dict]:
    if not DATA_FILE.exists():
        return []
    with DATA_FILE.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def save_entries(entries: list[dict]) -> None:
    with DATA_FILE.open("w", encoding="utf-8") as handle:
        json.dump(entries, handle, indent=2, ensure_ascii=False)
        handle.write("\n")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Add a curated appreciation entry.")
    parser.add_argument("--name", required=True, help="Public name to display")
    parser.add_argument("--headline", required=True, help="Short title for the appreciation")
    parser.add_argument("--message", required=True, help="Main public appreciation text")
    parser.add_argument("--created-at", required=True, help="Date in YYYY-MM-DD format")
    parser.add_argument("--relationship", default="", help="Student, Mentee, Colleague, etc.")
    parser.add_argument("--batch", default="", help="Batch, year, or cohort")
    parser.add_argument("--memory-place", default="", help="DSU lab, workshop, campus, etc.")
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    entries = load_entries()
    entries.append(
        {
            "name": args.name,
            "headline": args.headline,
            "relationship": args.relationship,
            "batch": args.batch,
            "memory_place": args.memory_place,
            "created_at": args.created_at,
            "message": args.message,
            "media": [],
        }
    )
    save_entries(entries)
    print(f"Added appreciation for {args.name} to {DATA_FILE}")


if __name__ == "__main__":
    main()
