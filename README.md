<div align="center">

# Dr. Victor Agughasi Academic Portfolio

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
- Downloadable CV and direct contact actions
- Static hosting friendly setup with Netlify configuration included

## Tech Stack

| Layer | Details |
| --- | --- |
| Markup | `HTML5` |
| Styling | `CSS3` |
| Interactivity | `Vanilla JavaScript` |
| Hosting | `Netlify` or any static host |

## Project Structure

```text
csme-portfolio/
|-- assets/
|   |-- csme-logo.png
|   |-- profile.png
|   `-- Dr_Victor_Agughasi_CV.pdf
|-- index.html
|-- styles.css
|-- script.js
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

## License

This project is intended for portfolio and academic presentation use. Update the content and licensing terms as needed for public reuse.
