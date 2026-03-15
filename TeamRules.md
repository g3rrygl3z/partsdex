# PartsDex — Team Rules & Ownership

> **Version:** 1.0 | **Date:** March 2026
> **DO NOT work outside your lane until the merge on Day 7 (end of Week 1).**

---

## Team Split

| Developer | Role Label in PRD |
| :-------- | :---------------- |
| **Michael** | Dev 1 — Data & Search |
| **Gary** | Dev 2 — UI & Pages |

---

## Michael's Scope (Dev 1)

Michael owns everything related to **data architecture, search functionality, and filtering**. This is the backend-of-the-frontend: the data that powers the app and the logic that lets users find it.

### Files & Directories Owned by Michael
- `src/data/` — all JSON files (`parts.json`, `categories.json`, `aliases.json`)
- `src/hooks/` — custom React hooks (`useSearch`, `usePartById`, `useCategory`)
- `src/utils/` — Fuse.js search config, data helper functions
- `src/components/SearchBar.tsx` — search bar component only (wired to search logic)
- `src/pages/Glossary.tsx` — the A–Z alias glossary page

### Michael's Tasks by Day

| Day | Task | Deliverable |
| :-- | :--- | :---------- |
| Day 1 | Project Setup (joint) | Repo initialized, Vite + React + Tailwind + vite-plugin-pwa configured, Vercel deploy pipeline live |
| Day 2 | Data Layer | `parts.json` schema finalized; 25 parts seeded across all 3 verticals; Fuse.js integrated and working |
| Day 3 | Search Feature | Fuzzy search logic wired; alias search confirmed; results page rendering data correctly (even if Gary's UI isn't final yet) |
| Day 4 | Data Expansion | Expand to 60 total parts; source/add diagrams for first 25 parts |
| Day 5 | Data Expansion | Complete 100 total parts; all entries include aliases and compatibility data |
| Day 6 | Filter System & Tests | Category, material, and vertical filters working on the browse page; write automated unit tests for search/filters |
| Day 7 | Glossary Page | A–Z glossary built; filterable by vertical; each alias entry links to its part detail page |

### Rules for Michael's Work
1. **Do not touch Gary's pages** — `Home.tsx`, `Browse.tsx`, `PartDetail.tsx`, `src/components/` (except `SearchBar`) — until the merge.
2. Stub out the data shape early (Day 2) so Gary can code against a known structure.
3. Communicate any schema changes to Gary immediately (they affect the UI he's building).
4. Diagrams go in `src/assets/diagrams/` — name files using the part's slug ID (e.g., `compression-fitting-15mm.svg`).
5. Keep `parts.json` clean and valid — it's the single source of truth for the whole app.
6. If a conflict comes up on `App.tsx` or `index.css`, resolve with Gary before committing.

---

## Gary's Scope (Dev 2)

Gary owns all **UI components, pages, and the mobile experience**. This includes the visual design system, every route-level page except the Glossary, and the final mobile polish pass.

### Files & Directories Owned by Gary
- `src/pages/Home.tsx` — home page
- `src/pages/Browse.tsx` — category browser
- `src/pages/PartDetail.tsx` — part detail page
- `src/components/` — all shared UI components **except** `SearchBar` (PartCard, DiagramViewer, NavBar, FilterPanel, etc.)
- `index.css` — global styles, design tokens, typography
- `public/` — PWA manifest, icons, splash screens

### Gary's Tasks by Day

| Day | Task | Deliverable |
| :-- | :--- | :---------- |
| Day 1 | Project Setup (joint) | Repo initialized, Vite + React + Tailwind + vite-plugin-pwa configured, Vercel deploy pipeline live |
| Day 2 | UI Foundation | Color system and Tailwind config, typography scale, navigation bar, layout shell, mobile viewport set |
| Day 3 | Home Page | Hero section, 3 vertical cards, search CTA, recent/popular parts section |
| Day 4 | Part Detail Page | All P0 sections live: header, diagram viewer, overview, aliases table |
| Day 5 | Category Browser | Vertical landing pages, sub-category grid, part card components |
| Day 6 | Compatible Parts | Compatible parts section on the detail page; related parts links |
| Day 7 | Mobile Pass | Full mobile audit; bottom nav working; touch targets ≥44px; test install-to-home-screen on iOS and Android |

### Rules for Gary's Work
1. **Do not touch Michael's data files or search logic** — no edits to `src/data/`, `src/hooks/`, or `src/utils/`.
2. Use the stubbed `parts.json` schema Michael provides on Day 2 — import data from `src/data/` only, never hardcode part data into components.
3. Keep design tokens (colors, type scale) in `tailwind.config.js` so both developers stay visually consistent.
4. If the search bar needs UI changes, coordinate with Michael — he owns `SearchBar.tsx`.

---

## Shared / Joint Ownership

| Area | Notes |
| :--- | :---- |
| `App.tsx` + `main.tsx` | Routing and app entry point — coordinate before editing, don't both touch at the same time |
| `vite.config.ts` / `tailwind.config.js` | Config files — communicate before changing |
| `public/manifest.json` | PWA manifest — Gary leads, Michael reviews |
| `README.md` | Both contribute; finalize together on Day 13–14 |
| PR Reviews | All PRs require review from the other developer before merge |

---

## Merge Point

**End of Day 7 (Week 1 complete):** Michael and Gary open a pull request to merge their branches into `main`. At this point:
- Michael's search logic plugs into Gary's UI components.
- The filter system wires to the browse page.
- Glossary links resolve to Part Detail pages.
- Both developers work together on all files from Day 8 onward (Week 2 polish).

---

*Last updated: March 2026 — Michael Chabler & Gary [Last Name]*
