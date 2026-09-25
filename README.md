# Dhananjay Kumar — Personal Website

Academic portfolio at <https://dhkrnl.github.io/>. Plain static HTML/CSS/JS — no build step, no dependencies to install. `main` deploys to GitHub Pages.

## Structure
| Path | What it is |
|---|---|
| `index.html` | Home: hero, interactive research graph, metrics, recent publications |
| `<page>/index.html` | One folder per page: `projects`, `experience`, `skills`, `publications`, `awards`, `agnicycle`, `teaching`, `tools`, `phd`, `collaborate`, `misc`, `contact` |
| `404.html` | Not-found page |
| `style.css` | The single stylesheet for every page (dark theme is the default; variables are at the top) |
| `main.js` | Shared JS: theme, English/Hindi toggle, nav, app launcher, publication filters, command palette |
| `home.js` | Homepage-only JS: the research graph |
| `images/` | Photos and icons; photos ship as WebP with a JPG fallback via `<picture>` |
| `sitemap.xml`, `robots.txt`, `site.webmanifest` | SEO and PWA metadata |
| `google4a5d….html` | Google Search Console verification — leave in place |

The sidebar, top bar and footer are repeated in every HTML file (there is no templating), so a nav change means editing all pages.

## Everyday tasks
**Preview locally**
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

**After changing `style.css`, `main.js` or `home.js`**, cache-bust the references on every page:
```bash
python3 bump-version.py
```

**Refresh citations / h-index / i10 / publication count** (shown on every page):
```bash
python3 update-metrics.py            # pulls from Google Scholar; publication count = entries on /publications/
python3 update-metrics.py --check    # dry run
python3 update-metrics.py 432 11 13  # manual values if Scholar blocks the request
```

**Add a publication:** add a `pub-item` link inside the matching `pub-section` (`data-type` = journal / conference / book / patent) in `publications/index.html`, then run `update-metrics.py` so the count updates everywhere.

**Deploy**
```bash
git add -A && git commit -m "..." && git push origin main
```
GitHub Pages publishes in about a minute.

## Notes
- Contact form: [Web3Forms](https://web3forms.com) (free tier). The access key in `contact/index.html` is a public key by design; submissions go to the owner's inbox.
- Icons come from the Tabler webfont on jsDelivr and fonts from Google Fonts; both load from CDNs.
- Update `sitemap.xml` `lastmod` dates when pages change.
