# PartsDex — Project Roadmap

> **Version:** 1.0 | **March 2026**
> **Format:** 2-week MVP sprint → future phases

---

## MVP Timeline Overview

```
Week 1: Core Build (Days 1–7)   ████████████████████ Michael + Gary in parallel
Week 2: Polish & Finalize (Days 8–11) █████████ Both working together
March 17 (Early): FINAL COMPLETION DEADLINE 🏁
March 17 (Afternoon): Presentation Preparation 🎤
March 18: Final Capstone Presentation 🚀
```

---

## Week 1 — Core Build (Days 1–7)

### Day 1 — Project Setup *(Both)*
- [x] Create GitHub repo; set up branches (`michael/integration-test`)
- [x] Initialize Vite + React + Tailwind CSS + vite-plugin-pwa
- [x] Configure PWA manifest and service worker (offline baseline)
- [x] Deploy pipeline to Vercel (connected to `main` branch)
- [x] Confirm both devs can run `npm run dev` locally

### Day 2 — Data Layer + UI Foundation
**Michael (Data Layer)**
- [x] Finalize `parts.json` schema
- [x] Seed initial 25 parts across 3 verticals
- [x] Integrate Fuse.js for fuzzy search

**Gary (UI Foundation)**
- [x] Configure Tailwind color system and branding
- [x] Set typography scale (Inter/Outfit)
- [x] Build persistent navigation bar
- [x] Create base layout shell

### Day 3 — Search Feature + Home Page
**Michael (Search Feature)**
- [x] Build `SearchBar` component with Fuse.js
- [x] Search results page rendering
- [x] Alias matching logic (e.g., "olive" → compression ring)

**Gary (Home Page)**
- [x] Hero section and search CTA
- [x] 3 industry vertical cards with part counts
- [x] Popular parts section

### Day 4 — Part Detail Page + API Data Expansion
**Michael (Data Expansion & AI API)**
- [/] Expand `parts.json` to 60 total parts (Currently 54)
- [ ] Source or create diagrams for first 25 parts
- [/] Implement Gemini API (Nano Banana) for dynamic visualizations (Service created)

**Gary (Part Detail Page)**
- [x] Part header and category badges
- [x] Diagram viewer with `react-parallax-tilt`
- [x] Aliases table and installation notes

### Day 5 — Category Browser + Data Completion
**Michael (Data Completion)**
- [ ] Complete all 100 parts in `parts.json`
- [x] All entries include aliases and compatibility data

**Gary (Category Browser)**
- [x] Vertical landing pages and sub-category grids
- [x] Part grid with thumbnails and descriptions
- [ ] Filter panel UI (to be wired to logic)

### Day 6 — Filters + Compatible Parts
**Michael (Filter System & Tests)**
- [ ] Category, material, and vertical filters working
- [ ] Write automated unit tests (Vitest)

**Gary (Compatible Parts)**
- [x] Compatible parts section on detail page
- [x] Related parts section links

### Day 7 — Glossary + Mobile Pass + **MERGE**
**Michael (Glossary Page)**
- [x] A–Z alphabetical glossary of all aliases
- [x] Links to canonical part detail pages

**Gary (Mobile Pass)**
- [x] Bottom navigation bar finalized for one-handed use
- [x] All touch targets ≥ 44×44px

---

## Week 2 — Polish & Finalize (Days 8–11)

### Day 8 — UI Polish *(COMPLETE)*
- [x] Consistent spacing, color, and typography (Outfit font)
- [x] Diagram styling (3D Viewer)
- [x] Category badge and card layout uniformity

### Day 9 — PWA & Mobile Finalize *(CURRENT)*
- [ ] Full mobile audit on every page
- [ ] Fix overflow or scrolling regressions
- [ ] Verify offline mode (service worker) works end-to-end
- [ ] Test manifest.webmanifest (icons, start_url, theme_color)

### Day 10 — Empty States & AI Fallbacks
- [ ] No-results search state
- [ ] Loading states for Gemini API calls
- [ ] Graceful fallbacks for missing diagrams

### Day 11 — Content & Prep
- [ ] Content audit (100 parts accuracy check)
- [ ] Optimize images and load times
- [ ] Final production build and QA walkthrough

### March 17 (Early AM) — Final Feature Freeze
- [ ] Project Locked and ready for presentation

### March 17 (Afternoon) — Presentation Prep
- [ ] Demo script and presentation materials (Michael & Gary)

### March 18 — Capstone Presentation
- [ ] Live demo and project delivery

---

*Last updated: March 13, 2026 — Deadline synchronization*
