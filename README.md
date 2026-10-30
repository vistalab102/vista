# ViStA Lab website

A static site — plain HTML, CSS and JavaScript, no build step and no dependencies.

## Run locally

```bash
python -m http.server 8791
```

Then open http://localhost:8791. (Opening `index.html` directly also works.)

## Edit content

Everything shown on the page lives in `js/content.js`: lab details, hero stages,
research areas, publications, team, alumni and openings. Edit, save, refresh.

- **Team roles** are blank — fill in `role` for each member.
- **PI photo** — drop a file in `assets/team/` and set `pi.image`.
- **Google Sheets** — paste "Publish to web → CSV" links into `sheets` at the top
  of `content.js` to drive publications, team or opportunities from the same
  sheets the previous site used.

## Deploy

Upload the folder to any static host (GitHub Pages, Netlify, Vercel, campus server).

## Files

| Path | What it is |
| --- | --- |
| `index.html` | Page structure |
| `css/style.css` | All styling |
| `js/content.js` | All content |
| `js/gl.js` | WebGL particle sculpture in the hero |
| `js/scenes.js` | Canvas animations for research panels and the globe |
| `js/app.js` | Rendering, scroll choreography, interactions |
| `assets/` | Photos, videos, figures |
