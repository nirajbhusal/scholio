# Scholio (repo: nirajbhusal/scholio)

Global index of Master's and PhD scholarships. Live site: https://nirajbhusal.github.io/scholio/ (GitHub Pages, deployed by the Actions workflow `.github/workflows/pages.yml` on every push to `main`; it runs `node scripts/build.mjs` and publishes `_site/`).

Owner: Niraj Bhusal (NB). Brand: **Scholio** (domain still to be registered). If the name ever changes, it is a find-and-replace across `index.html`, `README.md`, `manifest.webmanifest`, `scripts/build.mjs`, `og.png`. The domain is not owned yet, so nothing on the site may print a `scholio.org` address.

## Non-negotiables (from the owner)
- Live product, not a prototype: **no invented numbers, reviews, events or stats**. Anything shown must be real data, computed from real data, or clearly an empty state.
- A listing shows "Verified" only when a human has checked the official page; record it in `VERIFY.md` and set `checked:"YYYY-MM-DD"` in `DATA`. Otherwise the card says "Confirm on official page".
- Listings with no fixed date use `deadline:null` plus `window:"..."` (typical annual window) and are never shown as a countdown.
- We never host application forms; every award links out to the funder's official page.
- Light by default, dark only when the visitor picks it with the header toggle (`sc_theme`), Inter, blue accent `#2563eb` with violet `#7c3aed`. No em dashes in copy. Mascot: rounded badge, two eyes, mortarboard, gold tassel (`#logo` symbol).
- Header: brand, icon+label nav in one scrollable row, theme toggle, Sign in, then the "Closing soon" strip. Under 700px the nav becomes a bottom tab bar with a "More" sheet.
- Master's and PhD only for now. Assessment is a 14-step wizard that produces the Scholio Score (v1.0, public weights, deterministic, score ID) and per-award eligibility by nationality and age (`elig` on each listing; keep it in step with the `who` text; `age` is the oldest eligible age, and `ageUnder:true` means the rule reads "under N", so N itself is flagged, not ruled out).

## Structure (single file today, multipage next)
`index.html` holds everything: CSS, markup for views (`#view-home`, `map`, `countries`, `rank`, `assess`, `score`, `academy`, `course`, `cert`, `resources`, `compare`, `tracker`, `locker`, `award`, `events`, `funders`, `about`, `signup`), and JS. `404.html` is a byte-for-byte copy (GitHub Pages fallback so clean paths and `/award/<id>/` deep links resolve). After every edit run `cp index.html 404.html`.
`scripts/build.mjs` writes `_site/`: a copy of the page for every view and every award (own title, description, canonical) so those URLs return 200 instead of the 404 fallback, plus `sitemap.xml`. View titles come from `TITLES` in the script. `_site/` is git-ignored; there is no committed sitemap.
Data constants in the script: `UNI` (university DB), `DATA` (55 listings), `COUNTRIES` (curated cards; `ALLC` adds a generated card for every other destination in `DATA`), `COURSES` (Academy; `sop` is a complete course with lessons+quizzes, others are outlines with `soon:true`), `GUIDES` (English test guides), `WSTEPS` (wizard questions).
Client state in localStorage: `sc_profile` (`done:false` while the wizard is unfinished), `sc_course_<id>`, `sc_certs`, `sc_saved`, `sc_cv`, `sc_theme`, `sc_cmp` (compare, max 3), `sc_trk` (tracker: {id:{done:[],target}}), `sc_sop`, `sc_ref`, `sc_files` (locker, base64, 2 MB each), `sc_session` (sign-in token when accounts are on). `sessionStorage.sc_intro` keeps the intro splash to once per session, home page only.
`data/awards.json` is an export of `DATA` (regenerate when DATA changes; `scripts/verify.mjs` reads it to fetch every official URL and flag changed pages).
Rankings: `UNI` carries `rank` (QS 2026), `the` (THE 2025), `arwu` (ARWU 2024); bands like "101-150" are strings.
Accounts: `SUPABASE={url,key}` in the script; empty = sign-in card hidden, "coming soon" shown. Fill both to enable magic-link sign-in (`/auth/v1/otp`, the link returns to `/signup/#access_token=...`; the token is kept for its lifetime, there is no refresh yet). Tested only against a mocked backend.
PWA: `manifest.webmanifest` + `sw.js` (network first, cache fallback), registered only on https.
Map: Leaflet 1.9.4 self-hosted at `vendor/leaflet.js` (unmodified npm build), fetched the first time the map view opens; awards sharing coordinates are fanned out by `pinPos`; OpenStreetMap tiles (no key) with CARTO fallback after 4 tile errors and a visible notice. Trimmed Leaflet CSS is inlined.

## Submissions and feedback (no backend yet)
Reviews, corrections, new listings and session proposals open prefilled GitHub Issues with labels `review`, `correction`, `listing`, `event`, `funder`. Issue forms for `listing` and `correction` live in `.github/ISSUE_TEMPLATE/` and the site links to them with `?template=`; the other three use plain prefilled issues. The labels do not exist in the repo yet: create them, or GitHub silently drops them.

## QA bar
Playwright: every view at 1366 and 390 widths, zero console errors, zero horizontal overflow, and the course flow (all quizzes to certificate) runs end to end. Keep it.

## Next (agreed direction)
1. Convert to a multipage static site with **Astro** (static output to GitHub Pages via Actions, one route per section and per award, data in `src/data/*.json`, interactive islands only for search, fit wizard, map, course player, CV designer). A React SPA is not recommended: worse SEO and first paint for a content site with no backend.
2. Verification pipeline: a script that opens each official URL and flags changes, plus the `VERIFY.md` log.
3. Backend when accounts are needed (Supabase or similar): profiles, saved awards, certificates with a public verify endpoint, alerts.
4. Grow listings through submissions; keep the template strict.
