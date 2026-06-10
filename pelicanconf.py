from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path


BASE_DIR = Path(__file__).parent
CONTENT_DIR = BASE_DIR / "content"
DATA_DIR = CONTENT_DIR / "data"


def load_json(filename: str, default):
    path = DATA_DIR / filename
    if not path.exists():
        return default
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def build_google_form_embed_url(url: str) -> str:
    if not url:
        return ""
    url = url.replace("/preview", "/viewform")
    if "embedded=true" in url:
        return url
    separator = "&" if "?" in url else "?"
    return f"{url}{separator}embedded=true"


def normalize_google_form_url(url: str) -> str:
    if not url:
        return ""
    return url.replace("/preview", "/viewform")


def load_appreciations():
    entries = load_json("appreciations.json", [])
    normalized = []
    for entry in entries:
        item = dict(entry)
        created_at = item.get("created_at", "")
        display_date = ""
        if created_at:
            try:
                display_date = datetime.strptime(created_at, "%Y-%m-%d").strftime("%d %b %Y")
            except ValueError:
                display_date = created_at
        item["display_date"] = display_date
        item["media"] = [
            media
            for media in item.get("media", [])
            if media.get("url") and media.get("kind") in {"image", "video"}
        ]
        normalized.append(item)
    return normalized


AUTHOR = "Dr. Agughasi Victor Ikechukwu"
SITENAME = "Dr. Agughasi Victor Ikechukwu"
SITETITLE = "Dr. Agughasi Victor Ikechukwu | Academic Portfolio"
SITESUBTITLE = "AI for Healthcare"
SITEURL = ""
SITE_DESCRIPTION = (
    "Academic portfolio of Dr. Agughasi Victor Ikechukwu, Senior Assistant Professor, "
    "Department of Computer Science and Medical Engineering, School of Engineering, "
    "Dayananda Sagar University, Bangalore, Karnataka-India."
)

PATH = "content"
TIMEZONE = "Asia/Calcutta"
DEFAULT_LANG = "en"

THEME = "theme"
DIRECT_TEMPLATES = []
TEMPLATE_PAGES = {"index.html": "index.html"}

ARTICLE_PATHS = []
PAGE_PATHS = []
STATIC_PATHS = ["assets"]

DELETE_OUTPUT_DIRECTORY = True
DEFAULT_PAGINATION = False
RELATIVE_URLS = True
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

CURRENT_YEAR = datetime.now().year
GOOGLE_DRIVE_URL = "https://drive.google.com/drive/folders/1gpqrk9WKei1q4uIv2ijzWXWO1vQawtdc?usp=sharing"
GOOGLE_FORM_URL = normalize_google_form_url(
    "https://docs.google.com/forms/d/12Fx4Bqw3XzyIiRsjnuhJRJ4vxhbHpolPXP74soG6k8o/preview"
)
GOOGLE_FORM_EMBED_URL = build_google_form_embed_url(GOOGLE_FORM_URL)
INSTITUTE_EMAIL = "victor-csme@dsu.edu.in"
PERSONAL_EMAIL = "victor.agughasi@gmail.com"
APPRECIATION_EMAILS = [INSTITUTE_EMAIL, PERSONAL_EMAIL]
APPRECIATIONS = load_appreciations()
