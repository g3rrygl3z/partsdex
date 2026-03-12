# PartsDex — Project Roadmap

> **Version:** 1.0 | **March 2026**
> **Format:** 2-week MVP sprint → future phases

---

## MVP Timeline Overview

```
Week 1: Core Build (Days 1–7)   ████████████████████ Michael + Gary in parallel
Week 2: Polish & Finalize (Days 8–14)   ████████████ Both working together
```

---

## Week 1 — Core Build (Days 1–7)

### Day 1 — Project Setup *(Both)*
- [x] Create GitHub repo; set up branches (`michael/data-search`, `gary/ui-pages`)
- [x] Initialize Vite + React + Tailwind CSS + vite-plugin-pwa
- [x] Configure PWA manifest and service worker (offline baseline)
- [x] Deploy pipeline to Vercel (connected to `main` branch)
- [x] Confirm both devs can run `npm run dev` locally and see a working app shell

---

### Day 2 — Data Layer + UI Foundation

**Michael (Data Layer)**
- [x] Finalize `parts.json` schema (shared with Gary by end of day so he can code against it)
- [x] Seed 25 parts across all 3 verticals (Plumbing, HVAC, Boiler & Heating)
- [x] Integrate Fuse.js for fuzzy search; confirm it indexes and returns results from the local JSON

**Gary (UI Foundation)**
- [ ] Configure Tailwind color system (Primary Blue `#1B4F8A`, Success Green `#2E7D32`, Background Gray `#F5F5F5`, etc.)
- [ ] Set typography scale (heading, body, muted text)
- [ ] Build persistent navigation bar (bottom nav for mobile, standard nav for desktop)
- [ ] Create base layout shell that all pages will use

---

### Day 3 — Search Feature + Home Page

**Michael (Search Feature)**
- [x] Build `SearchBar` component wired to Fuse.js logic
- [x] Search results page renders part cards from search output
- [x] Fuzzy matching confirmed: partial matches (e.g., "comp" → compression fitting)
- [x] Alias matching confirmed: e.g., "olive" → compression ring
- [x] Minimum 2-character trigger, 300ms result threshold

**Gary (Home Page)**
- [ ] Hero section with app name, tagline, and search CTA
- [ ] 3 industry vertical cards (Plumbing, HVAC, Boiler & Heating) with icons and part counts
- [ ] Recent / popular parts section (placeholder data fine for now)

---

### Day 4 — Part Detail Page + API Data Expansion

**Michael (Data Expansion & AI API)**
- [ ] Expand `parts.json` to 60 total parts
- [ ] Source or create diagrams/images for the first 25 parts; place in `src/assets/diagrams/`
- [ ] Implement Gemini API integration (via Nano Banana 2 / Firebase AI plugin) to dynamically pull visualization data for Expansion Tanks, Booster Pumps, and Heating Units

**Gary (Part Detail Page)**
- [ ] Part header: primary name, category badge, tagline
- [ ] Diagram viewer component (scales on mobile, remains legible)
- [ ] Add `react-parallax-tilt` to the diagram viewer for a 3D hover/tilt effect (fake 3D)
- [ ] Overview section (plain-English description)
- [ ] Aliases table: two columns — Name/Alias and Context

---

### Day 5 — Category Browser + Data Completion

**Michael (Data Completion)**
- [ ] Complete all 100 parts in `parts.json`
- [ ] All entries include: aliases, overview, compatibility data, materials, installation notes

**Gary (Category Browser)**
- [ ] Vertical landing pages for Plumbing, HVAC, Boiler & Heating
- [ ] Sub-category grid (e.g., under Plumbing: Fittings, Valves, Pipes, Fixtures)
- [ ] Part grid with thumbnail, name, short description
- [ ] Filter panel UI (wires to Michael's filter logic on Day 6)

---

### Day 6 — Filters + Compatible Parts

**Michael (Filter System & Tests)**
- [ ] Category filter, material filter, vertical filter — all working on the browse page
- [ ] Filter logic lives in hooks/utils; Gary's filter panel UI plugs into it
- [ ] Write automated unit tests for search logic, data hooks, and filters (Vitest)

**Gary (Compatible Parts)**
- [ ] Compatible parts section on Part Detail page (displays linked parts this part connects with)
- [ ] Related parts section (similar/commonly confused parts, links to their detail pages)

---

### Day 7 — Glossary + Mobile Pass + **MERGE**

**Michael (Glossary Page)**
- [ ] A–Z alphabetical glossary of all aliases and trade terms
- [ ] Each entry links to its canonical part detail page
- [ ] Filterable by industry vertical

**Gary (Mobile Pass)**
- [ ] Full mobile audit across all pages at 375px viewport
- [ ] Bottom navigation bar finalized for one-handed use
- [ ] All touch targets ≥ 44×44px (WCAG)
- [ ] Test install-to-home-screen on iOS (Safari) and Android (Chrome)
- [ ] Confirm service worker caches critical parts data for offline use

### 🔀 END OF WEEK 1 — MERGE
> Michael and Gary merge their feature branches into `main`. Search logic plugs into UI. Polish sprint begins.

---

## Week 2 — Polish & Finalize (Days 8–14)

*Both developers work together across all files from here on.*

### Day 8 — UI Polish
- [ ] Consistent spacing, color, and typography across all pages
- [ ] Diagram and image styling finalized
- [ ] Category badge colors consistent; part card layout uniform

### Day 9 — PWA & Mobile Finalize
- [ ] Full mobile audit on every page
- [ ] Fix any overflow or scroll issues
- [ ] Verify offline mode (service worker) works end-to-end on real devices
- [ ] Test on physical iOS and Android devices

### Day 10 — Empty States & Error Handling
- [ ] No-results state for search (helpful message + suggestions)
- [ ] Loading states for any async operations
- [ ] Graceful fallbacks for missing diagrams/images

### Day 11 — Content Audit
- [ ] Review all 100 parts for factual accuracy
- [ ] Verify all aliases are correctly attributed (no wrong regional/trade context)
- [ ] Clear, plain-English writing across all overview fields

### Day 12 — Performance
- [ ] Optimize and compress all diagram images
- [ ] Lazy-load diagrams on Part Detail pages
- [ ] Verify < 2 second load time on a simulated 4G connection (Lighthouse)

### Day 13 — QA & Bug Fix
- [ ] Full walkthrough of all user flows end-to-end
- [ ] Search → Result → Part Detail → Related Part → Glossary → Browse
- [ ] Fix all remaining bugs and visual regressions

### Day 14 — Demo Prep
- [ ] Final production deploy to Vercel
- [ ] Demo script prepared (key user flows to walk through)
- [ ] Capstone presentation materials ready
- [ ] README finalized

---

## Future Phases (Post-MVP)

| Phase | Focus | Est. Additional Time |
| :---- | :---- | :------------------- |
| **Phase 2** | AR Part Identification — camera-based part recognition with TensorFlow.js or hosted ML model | 4–6 weeks |
| **Phase 3** | Backend & User Accounts — migrate to Supabase/Firebase, saved parts, community-submitted aliases | 4–6 weeks |
| **Phase 4** | Supplier Integration — real-time inventory and pricing from Ferguson, Grainger, Wolseley | 3–4 weeks |
| **Phase 5** | Native Mobile App — React Native iOS & Android if PWA gaps emerge | 6–8 weeks |

---

## Key Constraints & Risks

| Risk | Severity | Mitigation |
| :--- | :------- | :--------- |
| Sourcing 100 accurate, well-described parts | High | Start Day 1; use Ferguson, Grainger, and CIPHE catalogs as references |
| Finding clear technical diagrams for all 100 parts | Medium | Use royalty-free SVGs; create simple labeled diagrams in Figma/Excalidraw if needed |
| Scope creep during sprint | Medium | Strictly follow this roadmap; log new ideas in `BACKLOG.md`, do not build during MVP |
| Search accuracy on aliases | Low | Tune Fuse.js threshold early; test with 20 real-world alias queries by Day 4 |

---

*Last updated: March 2026 — PartsDex Capstone Team*
