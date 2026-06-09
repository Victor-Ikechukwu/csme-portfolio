# Academic Portfolio of Dr. Agughasi Victor Ikechukwu

This repository now uses a **fully static, Python-based build** with [Pelican](https://docs.getpelican.com/en/latest/). The site is designed to stay portable, subscription-independent, and easy to mirror across free hosts.

## Why this setup

- No hosted database is required.
- No paid form backend is required.
- The appreciation wall is curated from repository data files.
- The entire site can be deployed to free static hosts such as:
  - Cloudflare Pages
  - GitHub Pages

## Stack

- `Pelican` for static site generation
- `Markdown` support through Python Markdown
- `Git` as the long-term archive for content and appreciation records
- `GitHub Actions` workflow for optional GitHub Pages deployment

## Project structure

```text
csme-portfolio/
|-- content/
|   |-- assets/
|   `-- data/
|       |-- appreciations.example.json
|       `-- appreciations.json
|-- theme/
|   |-- static/
|   |   |-- css/
|   |   `-- js/
|   `-- templates/
|       `-- index.html
|-- .github/
|   `-- workflows/
|       `-- deploy-pages.yml
|-- pelicanconf.py
|-- publishconf.py
`-- requirements.txt
```

## Local development

1. Create and activate a virtual environment if needed.
2. Install dependencies:

```powershell
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
```

3. Build the site:

```powershell
.\.venv\Scripts\pelican.exe content -o output -s pelicanconf.py
```

You can also use the deployment-ready build script:

```powershell
bash build.sh
```

4. Preview the generated site:

```powershell
python -m http.server 4173 --directory output
```

Then open:

```text
http://127.0.0.1:4173
```

## Appreciation workflow

The appreciation wall is curated manually.

### How new entries are added

1. Receive the message by email.
2. Upload any approved media into `content/assets/` if needed.
3. Add the published record to `content/data/appreciations.json`.
4. Rebuild and deploy the site.

Helper files included:

- intake checklist: `content/data/appreciation-intake-template.md`
- CLI helper: `tools/add_appreciation.py`

Example usage:

```powershell
python tools/add_appreciation.py ^
  --name "Full Name" ^
  --headline "A short title" ^
  --message "Public appreciation text" ^
  --created-at 2026-06-09 ^
  --relationship "Student" ^
  --batch "AIML 2024" ^
  --memory-place "DSU Research Lab"
```

### Appreciation data format

Use `content/data/appreciations.example.json` as the template.

The live site reads:

```text
content/data/appreciations.json
```

An empty file is valid:

```json
[]
```

## Free deployment options

### Recommended: Cloudflare Pages

Use these settings in Cloudflare Pages:

- Framework preset: `None`
- Build command:

```text
bash build.sh
```

- Build output directory:

```text
output
```

Optional helper file already included:

```text
wrangler.toml
```

It sets the Pages build output directory to `output`.

Why this is the primary recommendation:

- generous free static hosting
- easy GitHub integration
- easy rollback
- no dependency on Netlify credits

### Backup: GitHub Pages

A workflow is already included at:

```text
.github/workflows/deploy-pages.yml
```

To use it:

1. Push the repository to GitHub.
2. In repository settings, enable **GitHub Pages** with **GitHub Actions** as the source.
3. Push to `main`.

## Notes on permanence

No third-party host can promise literal "forever free." However, this repo is intentionally designed so that:

- the site is static
- the data is stored in plain files
- the archive is versioned in Git
- the site can move between free hosts with minimal change

That is the strongest practical protection against future pricing changes.
