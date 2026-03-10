# PartsDex — Technical Requirements

> **Version:** 1.0 | **March 2026**
> Derived from PartsDex PRD v1.0 — Section 4 (Technical Architecture & Stack)

---

## 1. Tech Stack

| Layer | Technology | Version / Notes |
| :---- | :--------- | :-------------- |
| UI Framework | React | v18+ via Vite scaffold |
| Build Tool | Vite | Latest stable; use `vite-plugin-pwa` for PWA support |
| PWA Layer | vite-plugin-pwa + Workbox | Generates service worker and web manifest; enables offline mode and install-to-home-screen |
| Styling | Tailwind CSS | v3; configured via `tailwind.config.js` with custom design tokens |
| Routing | React Router | v6; client-side routing only (no SSR needed for MVP) |
| Search Engine | Fuse.js | Lightweight in-browser fuzzy search against local JSON |
| Icons | Lucide React | Consistent icon set; plumbing/HVAC adjacent icons available |
| Data Layer | Static JSON files | No backend for MVP; all data lives in `src/data/` |
| Deployment | Vercel | Free tier; auto-deploys on push to `main`; serves PWA manifest correctly |
| Version Control | GitHub | 2-developer workflow; feature branches per developer |

---

## 2. Project Structure

```
partsdex/
├── public/
│   ├── manifest.json          # PWA manifest (name, icons, theme color, display mode)
│   ├── icons/                 # PWA icons at required sizes (192×192, 512×512, maskable)
│   └── robots.txt
├── src/
│   ├── assets/
│   │   └── diagrams/          # Part diagrams — SVG or PNG, named by part slug ID
│   ├── components/            # Reusable UI components (Gary owns)
│   │   ├── SearchBar.tsx      # Search input (Michael owns — wired to search logic)
│   │   ├── PartCard.tsx       # Card used in grid/search results
│   │   ├── DiagramViewer.tsx  # Responsive diagram display component
│   │   ├── NavBar.tsx         # Persistent top + bottom navigation
│   │   ├── FilterPanel.tsx    # Filter sidebar/sheet for browse pages
│   │   └── AliasTable.tsx     # Two-column alias/context table on Part Detail
│   ├── data/                  # Static data files (Michael owns)
│   │   ├── parts.json         # Main parts database (100 parts at launch)
│   │   ├── categories.json    # Industry verticals and sub-categories
│   │   └── aliases.json       # Flat alias → part ID lookup for glossary
│   ├── hooks/                 # Custom React hooks (Michael owns)
│   │   ├── useSearch.ts       # Fuse.js search hook
│   │   ├── usePartById.ts     # Lookup a single part by slug ID
│   │   └── useCategory.ts     # Filter parts by vertical/sub-category
│   ├── pages/                 # Route-level page components
│   │   ├── Home.tsx           # Landing page (Gary)
│   │   ├── PartDetail.tsx     # Individual part page (Gary)
│   │   ├── Browse.tsx         # Category browser (Gary)
│   │   └── Glossary.tsx       # A–Z alias glossary (Michael)
│   ├── utils/                 # Search config and data helpers (Michael owns)
│   │   ├── fuseConfig.ts      # Fuse.js options (keys, threshold, weight)
│   │   └── dataHelpers.ts     # Utility functions for filtering and sorting
│   ├── App.tsx                # Root component with router setup (joint)
│   ├── main.tsx               # App entry point (joint)
│   └── index.css              # Global styles and Tailwind directives (Gary owns)
├── index.html
├── vite.config.ts             # Vite + PWA plugin config (joint)
├── tailwind.config.js         # Tailwind custom tokens (Gary leads)
├── tsconfig.json
└── package.json
```

---

## 3. Data Architecture

### 3.1 Part Schema (`parts.json`)

Each entry in `parts.json` is an object with the following structure:

```ts
interface Part {
  id: string;              // Unique slug, e.g. "compression-fitting-15mm"
  primaryName: string;     // Canonical, most widely recognized name
  aliases: string[];       // All trade names, regional names, slang, manufacturer terms
  category: "plumbing" | "hvac" | "boiler-heating";
  subCategory: string;     // e.g. "fittings", "valves", "ductwork", "controls"
  overview: string;        // Plain-English: what it is, what it does, typical applications
  diagramUrl: string;      // Path to diagram asset, e.g. "/assets/diagrams/compression-fitting-15mm.svg"
  compatibleWith: string[];// Array of part IDs this part connects to or is used with
  materials: string[];     // e.g. ["copper", "brass", "PVC", "stainless"]
  installationNotes: string;
  tags: string[];          // Free-form search tags e.g. ["compression", "push-fit", "solder"]
}
```

### 3.2 Category Schema (`categories.json`)

```ts
interface Category {
  id: string;              // e.g. "plumbing"
  label: string;           // Display name, e.g. "Plumbing"
  icon: string;            // Lucide icon name
  subCategories: {
    id: string;
    label: string;
  }[];
}
```

### 3.3 Alias Schema (`aliases.json`)

Flat lookup used to build the A–Z glossary:

```ts
interface AliasEntry {
  alias: string;           // The trade term or alias
  partId: string;          // The canonical part this alias belongs to
  context: string;         // e.g. "UK trade term", "Manufacturer brand name", "Old BS standard"
  vertical: "plumbing" | "hvac" | "boiler-heating";
}
```

---

## 4. Search Requirements

| Requirement | Detail |
| :---------- | :----- |
| Library | Fuse.js — in-browser, no server required |
| Search fields | `primaryName`, `aliases`, `id`, `category`, `subCategory`, `overview`, `tags` |
| Minimum query length | 2 characters before search triggers |
| Result latency | < 300ms for the 100-part local dataset |
| Fuzzy matching | Partial matches: "comp" → compression fitting, compression valve |
| Alias matching | "olive" → returns compression ring |
| Case sensitivity | Case-insensitive |
| Threshold | Fuse.js `threshold: 0.35` (tune after alias testing on Day 3) |
| Debounce | 200ms on the search input before firing Fuse.js query |
| Empty state | Show recently viewed parts or popular searches when query is empty |

---

## 5. PWA Requirements

| Requirement | Detail |
| :---------- | :----- |
| Manifest | `public/manifest.json` with `name`, `short_name`, `start_url`, `display: standalone`, `theme_color: #1B4F8A`, `background_color: #F5F5F5` |
| Icons | 192×192px and 512×512px PNG; include a maskable icon variant |
| Install prompt | Must be installable from Chrome (Android) and Safari (iOS) Add to Home Screen |
| Offline support | Service worker via Workbox caches: app shell + all parts JSON at install; diagrams cached on first view |
| Service worker strategy | `StaleWhileRevalidate` for data files; `CacheFirst` for static assets and diagrams |
| HTTPS | Vercel provides HTTPS by default; service workers require HTTPS — covered |

---

## 6. Performance Requirements

| Metric | Target | How to Measure |
| :----- | :----- | :------------- |
| Initial page load | < 2 seconds on 4G | Lighthouse "Performance" audit |
| Search results | < 300ms after 200ms debounce | Browser DevTools / manual test |
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse |
| Lighthouse PWA Score | 100 | Lighthouse PWA audit |
| Diagram lazy loading | Diagrams load on scroll-into-view, not on page load | IntersectionObserver or React lazy |

---

## 7. Responsive / Mobile Requirements

| Requirement | Detail |
| :---------- | :----- |
| Primary design target | 375px viewport width (iPhone SE) |
| Supported viewports | 375px → 1440px+ |
| Touch targets | Minimum 44×44px per WCAG 2.1 guidelines |
| Navigation | Bottom nav bar for mobile (thumb-friendly); top nav for tablet/desktop |
| Search bar | Pinned to top of viewport on scroll |
| Diagrams | Must scale and remain legible at 375px without horizontal scroll |
| Tested platforms | iPhone (Safari) and Android (Chrome) — same codebase, same experience |
| Desktop | Fully supported for parts counter, office, and instructor use |

---

## 8. Browser & Platform Support

| Platform | Browser | Required |
| :------- | :------ | :------- |
| iOS 15+ | Safari | ✅ Required (PWA install) |
| Android 10+ | Chrome | ✅ Required (PWA install) |
| macOS / Windows | Chrome | ✅ Required |
| macOS / Windows | Firefox | 🟡 Supported (no PWA install) |
| macOS / Windows | Edge | 🟡 Supported |
| macOS / Windows | Safari | 🟡 Supported |

---

## 9. Deployment

| Item | Detail |
| :--- | :----- |
| Host | Vercel — free tier |
| Trigger | Auto-deploy on push to `main` branch |
| Environment | Static site / SPA; no server-side rendering |
| Domain | Vercel default domain for MVP; custom domain optional post-MVP |
| Build command | `npm run build` (Vite) |
| Output directory | `dist/` |
| PWA manifest served | Vercel serves `public/manifest.json` at `/manifest.json` automatically |

---

## 10. Development Setup

### Prerequisites
- Node.js v18+
- npm v9+
- Git

### Initial Setup
```bash
git clone https://github.com/<org>/partsdex.git
cd partsdex
npm install
npm run dev        # starts Vite dev server at localhost:5173
```

### Available Scripts
```bash
npm run dev        # Development server with hot reload
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # ESLint check
```

### Environment
No `.env` file required for MVP — all data is local JSON. If API integrations are added in future phases, add a `.env.example` at that time.

---

## 11. Coding Standards

| Standard | Rule |
| :------- | :--- |
| Language | TypeScript — strict mode enabled |
| Component files | `.tsx` for components and pages; `.ts` for hooks, utils, and types |
| Naming | PascalCase for components; camelCase for hooks, utils, variables |
| Imports | Absolute imports from `src/` (configure `paths` in `tsconfig.json`) |
| Linting | ESLint with React + TypeScript rules; run before every PR |
| Formatting | Prettier with default config; format on save |
| Commits | Conventional Commits style: `feat:`, `fix:`, `data:`, `style:`, `docs:` |
| PRs | All PRs require review by the other developer before merging |

---

*Last updated: March 2026 — PartsDex Capstone Team*
