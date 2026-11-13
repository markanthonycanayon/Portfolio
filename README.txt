# Portfolio Website — Refactored Files

Replace the corresponding website files with the files in this package:

- `index.html` — homepage
- `project.html` — full projects page (the uploaded `project(5).html` is normalized to the filename already referenced by the homepage)
- `style.css` — existing visual styles, cleaned of selectors that were not used by either page, with a shared global layout system
- `main.js` — shared project rendering and site interactions
- `portfolio-data.js` — shared featured and full project data

Keep your existing `assets/` directory and its image filenames/paths unchanged.

Both HTML pages load `portfolio-data.js` before `main.js`. The homepage uses `data-page="home"`; the projects page uses `data-page="projects"`.

Global layout tokens are in `style.css`:
- Content max width: 1440px
- Desktop section spacing: 75px vertical / 65px horizontal
- Tablet: 65px vertical / 35px horizontal
- Mobile: 55px vertical / 20px horizontal
- Small mobile horizontal padding: 16px

The copy, visible link labels, link destinations, project names, categories, URLs, and image paths were preserved.
