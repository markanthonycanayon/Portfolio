# Portfolio refactor

## Files
- `index.html` — homepage.
- `project.html` — complete projects page.
- `style.css` — original visual stylesheet, retained for visual continuity, plus a small accessibility/interaction patch.
- `js/portfolio-data.js` — shared project data (featured and full portfolio lists).
- `js/main.js` — project rendering, accessible mobile navigation, scroll reveal, active navigation, and laptop preview scrolling.

## Deployment
Upload the contents of this folder to the same directory in your existing GitHub Pages site. Keep your existing `assets/` directory alongside `index.html`, `project.html`, `style.css`, and `js/`.

## Notes
- The source HTML referenced `style.css` while the uploaded stylesheet was named `style(3).css`; the output uses the expected `style.css` filename.
- Existing image paths and website URLs are preserved. The `assets/` directory was not included in the upload, so verify that each referenced asset exists in your deployed site.
- The original load-more code was removed because it targeted selectors and controls that were not present. The project page now renders all 30 supplied entries; the homepage renders the original 6 featured entries.
- The contact phone number and email values were not changed.
