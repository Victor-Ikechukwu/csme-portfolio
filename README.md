<div align="center">

# Welcome to the official Academic Portfolio of Dr. Agughasi Victor Ikechukwu

Responsive academic portfolio website for **Dr. Agughasi Victor Ikechukwu**, built as a clean static site for research visibility, academic outreach, and straightforward Netlify deployment.

<p>
  <img src="https://img.shields.io/badge/HTML-5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5 badge" />
  <img src="https://img.shields.io/badge/CSS-3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3 badge" />
  <img src="https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111111" alt="JavaScript badge" />
  <img src="https://img.shields.io/badge/Netlify-Ready-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Netlify badge" />
</p>

</div>

## Overview

This repository contains a lightweight portfolio site designed to present:

- Academic background and professional profile
- Research focus areas and scholarly outputs
- Teaching and mentorship interests
- Key achievements, proposals, and collaborations
- Contact details and downloadable CV

The project uses plain HTML, CSS, and JavaScript, making it easy to maintain, fast to load, and simple to deploy.

## Highlights

- Responsive single-page layout for desktop, tablet, and mobile
- Sticky navigation with active section highlighting
- Clean hero section with profile and institution card
- Research, publications, achievements, and teaching sections
- Public appreciation portal with text, image, and short-video submissions
- Memory wall powered by Netlify Forms plus a serverless gallery endpoint
- Downloadable CV and direct contact actions
- Static hosting friendly setup with Netlify configuration included

## Tech Stack

| Layer | Details |
| --- | --- |
| Markup | `HTML5` |
| Styling | `CSS3` |
| Interactivity | `Vanilla JavaScript` |
| Hosting | `Netlify` or any static host |
| Public submission gallery | `Netlify Forms` + `Netlify Functions` |

## Project Structure

```text
csme-portfolio/
|-- assets/
|   |-- csme-logo.png
|   |-- profile.png
|   `-- Dr_Victor_Agughasi_DSU_ATS_CV.pdf
|-- index.html
|-- styles.css
|-- script.js
|-- netlify/
|   `-- functions/
|       `-- appreciations.js
|-- netlify.toml
`-- README.md
```

## Local Preview

Run a simple local server from the project root:

```powershell
python -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173
```

## Deploying to Netlify

This site is fully static, so no build step is required.

### Option 1: Netlify Drop

1. Open [Netlify Drop](https://app.netlify.com/drop).
2. Drag the full project folder or the site contents into the upload area.
3. Netlify will publish the site automatically.

### Option 2: GitHub + Netlify

1. Push this repository to GitHub.
2. In Netlify, choose **Add new site** -> **Import an existing project**.
3. Select the repository.
4. Use these settings:

| Setting | Value |
| --- | --- |
| Build command | leave empty |
| Publish directory | `.` |

The included `netlify.toml` already reflects the correct publish directory.

## Appreciation Portal Setup

The new appreciation portal uses:

- A Netlify HTML form named `student-appreciation` for public submissions
- Built-in Netlify file uploads for up to 3 images and 1 short video
- A serverless function at `/api/appreciations` that reads verified submissions and renders the public memory wall

### Required Netlify configuration

Add this environment variable in your Netlify site settings:

```text
NETLIFY_AUTH_TOKEN=your_personal_access_token
```

Optional environment variables:

```text
NETLIFY_SITE_ID=your-site-id-or-site-domain
NETLIFY_APPRECIATION_FORM_NAME=student-appreciation
```

Notes:

- If `NETLIFY_SITE_ID` is omitted, the function will fall back to Netlify's runtime `SITE_ID` when available.
- The function only returns verified submissions, which means Netlify's spam filtering gives you a basic moderation layer out of the box.

### Form detection

In the Netlify dashboard:

1. Go to `Forms`.
2. Enable form detection if it is currently disabled.
3. Redeploy the site after enabling it.

### Upload limits

Netlify Forms currently supports:

- One file per file field
- A maximum request size of `8 MB`
- File uploads that should complete within `30 seconds`

This is why the portal is structured as:

- `photo_1`
- `photo_2`
- `photo_3`
- `video_1`

### Local development with functions

To test the appreciation wall locally with functions enabled, use Netlify Dev:

```powershell
npx netlify dev
```

Then open:

```text
http://127.0.0.1:8888
```

## Customization

To adapt this portfolio for future updates:

- Update personal content in `index.html`
- Refine colors, spacing, and layout in `styles.css`
- Adjust navigation or animation behavior in `script.js`
- Replace files inside `assets/` for profile image, logo, or CV updates

## Why This Setup Works Well

- No framework overhead
- Fast initial load
- Easy to edit without a build pipeline
- Reliable deployment on static hosting platforms
- Simple repo structure for long-term maintenance


## License and Usage

© 2026 Dr. Victor Ikechukwu Agughasi. All rights reserved.

This website is created for personal academic, professional, and portfolio presentation purposes.

The personal content on this website, including the biography, CV, photographs, academic profile, achievements, grants, patents, publications list, and institutional references, may not be copied, reproduced, modified, or redistributed without prior written permission.

The institutional names, logos, and affiliations displayed on this website are used only for identification and academic representation purposes. All related trademarks, logos, and institutional identities remain the property of their respective owners.

The website structure and code may be used as inspiration for academic portfolio development, but direct reuse of personal content, images, logos, or documents is strictly prohibited.
