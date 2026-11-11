# Roadmap

## Done (Nov 2026)
- Index with 55 awards (11 dated, 3 verified on official pages; 44 annual-window listings), Scholio Score v1.0 with per-award eligibility, research map, academy with one complete certified course, resources (4 test guides, 3 sample letters, CV designer with print-to-PDF, sample papers), deadline calendar with .ics export, saved awards, compare, application tracker, document locker, award deep links, funders page, about with competitor comparison, SEO/PWA basics, GitHub Actions deploy to Pages.

## Phase 1: multipage + verification (next)
- Astro conversion; routes: /, /awards/[id], /map, /countries/[slug], /rankings, /fit, /academy, /academy/[course], /resources/*, /events, /funders, /about, /signin
- Per-award pages with JSON-LD (EducationalOccupationalCredential / Event for deadlines) for search traffic
- Verify all 55 listings on official pages (52 still to do); log in VERIFY.md; run `scripts/verify.mjs` monthly
- GitHub Actions: add the Astro build step to the existing Pages deploy; link checker

## Phase 2: accounts
- Supabase auth, saved awards, profile sync, certificate verify endpoint (needs the domain registered first)
- Email alerts 14 and 3 days before saved deadlines
- Reviews with "applied/awarded" gating moved from GitHub Issues to the app

## Phase 3: growth
- Listing submission form for funders; moderation queue
- Remaining Academy courses written (IELTS 7, Research Proposal Lab, Outreach Sprint, Interview Prep, Paper to Publication)
- Languages; Bachelor's and postdoc
