# Dhananjay Kumar — Personal Website

A modern, responsive single-page personal website. No build step, no dependencies to install — everything is in one `index.html`.

## Features
- Dark / light theme toggle (remembers your choice)
- Fully responsive (desktop, tablet, mobile)
- Animated scroll reveals, glow accents, hover effects
- Sections: Hero, About, Research areas, Journey, Tools, Beyond the lab, Contact
- Tabler icons + Google Fonts (Inter / Sora) loaded via CDN

## Preview locally
Just open the file:
```bash
open index.html
```
Or run a tiny local server:
```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy free with GitHub Pages
1. Create a repo named `<your-username>.github.io` (or any repo).
2. Push these files:
   ```bash
   git init
   git add .
   git commit -m "Personal website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo>.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Source: main / root → Save**.
4. Your site goes live at `https://<your-username>.github.io/` in ~1 minute.

Alternatives: drag the folder onto [Netlify Drop](https://app.netlify.com/drop) or [Vercel](https://vercel.com) for instant hosting + a custom domain.

## Customize
Everything you'd want to edit is plain HTML/CSS in `index.html`:
- **Colors** — the `:root` CSS variables at the top (`--accent`, etc.)
- **Text** — search for the section headings (About, Research, Journey…)
- **Links** — replace the `href="#"` placeholders in the social icons and tool cards with your real URLs (Google Scholar, ResearchGate, LinkedIn, AgniCycle, Spray Calculator).
- **Photo** — to use a real photo instead of the "DK" monogram, replace the `<div class="avatar">DK</div>` with `<img src="photo.jpg" class="avatar" alt="Dhananjay Kumar">`.
