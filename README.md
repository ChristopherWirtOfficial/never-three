# Never Three 🎲

An incremental idle dice game where rolling multiples of 3 is dangerous.

## Quick Start

```bash
npm install
npm run dev       # local dev server (Vite)
npm run build     # typecheck + production bundle → dist/
npm run preview   # serve production build locally
```

### GitHub Pages

The repo includes [`.github/workflows/deploy-github-pages.yml`](.github/workflows/deploy-github-pages.yml). On each push to `master` or `main`, it typechecks, runs `vite build` with `base` set to `/<repository-name>/`, and deploys `dist/` to Pages.

1. On GitHub: **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).
2. Push these workflow files; the **Deploy to GitHub Pages** action should appear under **Actions**.
3. The site URL will be `https://<user>.github.io/<repo>/` (for this fork, `never-three` in the path).

To sanity-check a Pages build locally:

```bash
VITE_BASE_PATH=/never-three npm run build   # use your real repo name
npm run preview
```

## Docs

- **[DESIGN.md](DESIGN.md)** — Full game design document
- **[ARCHITECTURE.md](ARCHITECTURE.md)** — Codebase guide and technical architecture
- **[PROGRESS.md](PROGRESS.md)** — What's done, what's not, known issues
- **[SESSION_NOTES.md](SESSION_NOTES.md)** — Design decisions and rationale from prototyping

## Status

Phases 1–3 complete (core danger rule, reforging, hex resource).
Phases 4–6 planned (hex shop, multiple dice, prestige rework).
See PROGRESS.md for details.
