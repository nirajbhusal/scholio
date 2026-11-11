# Scholio

Global index of Master's and PhD scholarships. Live at https://nirajbhusal.github.io/scholio/ (repository `nirajbhusal/scholio`, deployed to GitHub Pages by `.github/workflows/pages.yml` on every push to `main`).

## Run locally
Open `index.html` straight from disk; views then switch with `#hash` instead of clean paths. The page uses `<base href="/scholio/">`, so to test clean paths, the service worker or `/award/<id>/` links, serve the repo under a `/scholio/` path with `404.html` as the not-found page, which is what GitHub Pages does.

## What's inside (single file today)
- Home: search with live suggestions, closing-soon strip, live counts, path cards, "picked for you" (from the saved profile), catalogue with segmented filters
- Research map (Leaflet, loaded on first open), Countries, Rankings (QS, THE, ARWU)
- Scholio Score: 14-step assessment with public weights and a methodology page, eligibility per award by nationality and age
- Academy: Statement of Purpose Studio is a complete course (5 lessons, a quiz per lesson, certificate with ID, PNG download). Other courses are outlines marked "Coming soon".
- Resources: English test guides, sample letters, CV designer, sample papers
- Compare (up to 3), application tracker, document locker, deadline calendar with .ics export
- Funders, About, Sign in (off until Supabase keys are set)

Everything a visitor saves stays in their browser (localStorage) until accounts exist.

## Files
- `index.html`: all CSS, markup and JS. Data constants: `UNI`, `DATA`, `COUNTRIES`, `COURSES`, `GUIDES`, `WSTEPS`.
- `404.html`: byte-for-byte copy of `index.html` so clean paths and `/award/<id>/` links resolve. After any edit: `cp index.html 404.html`.
- `data/awards.json`: export of `DATA`. Regenerate whenever `DATA` changes.
- `scripts/verify.mjs`: fetches every official URL and flags pages that changed. `VERIFY.md` is the human verification log.
- `sw.js`, `manifest.webmanifest`, icons: PWA shell.

## Data rules
No invented numbers. A listing shows "Verified" only after a person has checked the official page and logged it in `VERIFY.md`; everything else says "Confirm on official page". Listings without a fixed date carry a typical annual window and never a countdown. See `CLAUDE.md` for the full handoff notes.
