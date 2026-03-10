  
**PRODUCT REQUIREMENTS DOCUMENT**

**PartsDex**

Plumbing, HVAC & Boiler Parts Identifier

*MVP Build — Capstone Project*

Version 1.0  |  March 2026

| Status | DRAFT — ACTIVE |
| :---: | :---: |
| **Timeline** | 2 Weeks (MVP) |
| **Team Size** | 2 Developers |

# **1\. Executive Summary**

PartsDex is a mobile-first Progressive Web App (PWA) designed for on-site crews and trade professionals in the plumbing, HVAC, and boiler & heating industries. Built primarily for field use on smartphones, PartsDex also works seamlessly on desktop browsers — install it once from the browser, and it lives on your phone like a native app. The application solves a persistent real-world problem: in these trades, the same physical part can have dozens of different names, part numbers, and regional aliases — making identification, ordering, and communication extremely difficult for both experienced technicians and new entrants to the field.

PartsDex provides a clean, searchable database of parts with detailed information including industry names and aliases, technical diagrams, compatibility guides, and use-case overviews. The MVP is scoped for a 2-week build by a 2-person frontend-focused team, with a clear path to a future AR integration phase.

## **1.1 Problem Statement**

Tradespeople and apprentices in plumbing, HVAC, and boiler & heating regularly encounter the following friction points:

* A single part (e.g., a compression fitting) may be called by 6+ different names depending on region, manufacturer, and trade era

* New technicians waste time and money ordering wrong parts due to naming confusion

* There is no single, visual, searchable reference that bridges old and new terminology

* Existing resources (manufacturer PDFs, trade catalogs) are fragmented, offline, and not user-friendly

## **1.2 Solution**

PartsDex centralizes part knowledge in a fast, visual, PWA built for the job site. A technician pulls out their phone, searches or browses, and instantly has a complete part profile in hand — what it is, what it does, what it's compatible with, how it's installed, and every name it goes by in the industry. No app store download required; it installs directly from the browser and works offline.

## **1.3 Target Users**

| User Type | Background | Primary Need |
| :---- | :---- | :---- |
| Field Technician | 5–20+ years in the trade | Fast part ID and alias lookup on-site |
| Apprentice / New Hire | 0–2 years experience | Learning part names, uses, and compatibility |
| Parts Counter Staff | Supply house / distributor | Cross-referencing customer descriptions to SKUs |
| HVAC/Plumbing Instructor | Trade school educator | Visual teaching aids and reference material |

# **2\. Product Overview**

## **2.1 Product Vision**

To be the definitive on-the-job reference tool for trade professionals — the app you open when you're holding a part and don't know what it's called, where it goes, or what it connects to.

## **2.2 MVP Scope**

The MVP focuses on delivering a complete, polished core experience across three industry verticals. Feature scope has been deliberately constrained to ensure a shippable, high-quality product within 2 weeks.

### **In Scope for MVP**

* Part search (by name, alias, part number, keyword)

* Part detail pages (overview, diagram, aliases, compatibility, use cases)

* Category browsing by industry vertical (Plumbing, HVAC, Boiler & Heating)

* Progressive Web App (PWA) — installable on iPhone and Android, works offline, no App Store required

* Static data layer with curated initial parts library

* Filter and sort by category, type, and material

### **Out of Scope for MVP (Future Phases)**

* AR part identification via camera

* User accounts and saved parts

* Community-submitted parts or edits

* Native iOS / Android app (PWA covers this need for MVP; native app is a future phase if needed)

* API integrations with supplier catalogs (e.g., Ferguson, Grainger)

* AI-powered part identification from photo input

## **2.3 Success Metrics for MVP**

| Metric | MVP Target |
| :---- | :---- |
| Parts in database at launch | 100+ curated parts across 3 verticals |
| Search result accuracy | Correct part returned in top 3 results for all seeded queries |
| Mobile usability | All core flows usable on a 375px wide viewport |
| Page load time | \< 2 seconds on 4G connection |
| Capstone evaluation | Demonstrates real-world usefulness to non-technical evaluators |

# **3\. Feature Specifications**

## **3.1 Feature 1 — Global Search**

The search bar is the primary entry point for the app and must support flexible, forgiving queries.

### **Functional Requirements**

* Search input is visible on every page (persistent header)

* Searches run across: part name, all aliases, part number, category, and description text

* Results display within 300ms for the seeded local dataset

* Results show part thumbnail, primary name, and category badge

* 'Did you mean?' suggestion for near-matches and typos

* Empty state shows recently viewed parts or popular searches

### **Search Behavior**

* Partial match: searching 'comp' should surface 'compression fitting', 'compression valve'

* Alias match: searching 'olive' should return 'compression ring' (olive is a common alias)

* Case-insensitive, accent-insensitive

* Minimum 2 characters to trigger search

## **3.2 Feature 2 — Part Detail Page**

The part detail page is the core product experience. Every part has a dedicated page structured into clear, scannable sections.

### **Page Sections**

| Section | Content | Priority |
| :---- | :---- | :---- |
| Part Header | Primary name, category badge, short tagline description | P0 — Must Have |
| Diagram | Technical illustration or photo showing the part clearly labeled | P0 — Must Have |
| Overview | What the part is, what it does, typical applications | P0 — Must Have |
| Industry Names & Aliases | All known names: trade slang, regional terms, manufacturer names, old vs. new terminology | P0 — Must Have |
| Compatible Parts | Parts this component connects to or is used with | P1 — Should Have |
| Installation Notes | Brief overview of typical installation context | P1 — Should Have |
| Available Materials | Copper, PVC, brass, stainless, etc. | P1 — Should Have |
| Related Parts | Similar or commonly confused parts with link to their detail pages | P2 — Nice to Have |

## **3.3 Feature 3 — Category Browser**

Users who don't know the part name can browse by industry vertical and part category.

### **Industry Verticals**

* Plumbing — pipes, fittings, valves, fixtures, drainage, supply

* HVAC — ductwork, air handlers, refrigerant components, thermostats, filters, dampers

* Boiler & Heating — boiler components, expansion tanks, circulators, radiators, controls, heat exchangers

### **Browse UX**

* Landing page displays 3 vertical cards with icons and part counts

* Selecting a vertical shows part type sub-categories (e.g., under Plumbing: Fittings, Valves, Pipes, Fixtures)

* Part grid view shows thumbnail, name, and short description

* Filter panel allows narrowing by material, size range, and connection type

## **3.4 Feature 4 — Alias & Terminology Glossary**

A standalone glossary section for users who want to explore terminology without a specific part in mind.

* Alphabetical list of all known aliases and trade terms in the database

* Each alias entry links to its canonical part detail page

* Helpful for new technicians learning trade vocabulary

* Filterable by industry vertical

## **3.5 Feature 5 — PWA & Mobile-First Experience**

PartsDex is built as a Progressive Web App (PWA) with a mobile-first design philosophy. The primary use case is a field technician on a job site pulling out their phone to identify an unfamiliar part or look up what they need to complete a job. The app installs directly from Chrome or Safari onto any smartphone home screen — no App Store, no friction.

* Designed and tested at 375px viewport width (iPhone SE — the smallest common smartphone) as the primary design target; scales up for tablet and desktop

* Diagrams scale and remain legible on small screens

* Touch targets minimum 44x44px per WCAG guidelines

* Bottom navigation bar for one-handed, thumb-friendly access on phones

* Search bar stays pinned to top on scroll

* PWA installable directly from Chrome or Safari — appears on phone home screen like a native app, no App Store required

* Offline mode via service worker — critical parts data cached locally so crews can use the app in basements, mechanical rooms, and areas with no cell signal

* Works on both iPhone (Safari) and Android (Chrome) — same codebase, same experience

* Desktop web also fully supported for office staff, instructors, and parts counter use

# **4\. Technical Architecture & Stack**

## **4.1 Recommended Tech Stack**

The stack is chosen to maximize velocity for a frontend-focused team while delivering a polished, performant result.

| Layer | Technology | Rationale |
| :---- | :---- | :---- |
| UI Framework | React (Vite) \+ PWA Plugin | Fast dev server, component reuse, both teammates likely familiar |
| PWA Layer | vite-plugin-pwa \+ Workbox | Generates service worker and web manifest; enables offline mode, install-to-home-screen on iOS and Android |
| Styling | Tailwind CSS | Rapid, consistent styling without writing custom CSS files |
| Routing | React Router v6 | Client-side routing for part detail pages and category pages |
| Data Layer | Local JSON / static files | No backend needed for MVP; fast to seed and update |
| Search Engine | Fuse.js | Lightweight fuzzy search library — works entirely in-browser on JSON |
| Icons | Lucide React | Clean, consistent icon set with plumbing/HVAC adjacent icons |
| Deployment | Vercel | Free tier, instant deploys from GitHub, zero config for Vite/PWA apps; serves the installable PWA manifest |
| Version Control | GitHub | Collaboration between 2 developers |

## **4.2 Data Architecture**

Each part is stored as a structured JSON object in a flat file. This eliminates backend complexity while keeping the data easy to edit, extend, and eventually migrate to a real database.

### **Part Data Schema**

| Field | Type | Description |
| :---- | :---- | :---- |
| id | string | Unique slug identifier (e.g., 'compression-fitting-15mm') |
| primaryName | string | The canonical, most widely recognized name |
| aliases | string\[\] | All known trade names, regional names, slang, and manufacturer terms |
| category | string | Top-level: 'plumbing' | 'hvac' | 'boiler-heating' |
| subCategory | string | e.g., 'fittings', 'valves', 'ductwork', 'controls' |
| overview | string | Plain-English description of what the part is and does |
| diagramUrl | string | Path to diagram SVG or PNG image asset |
| compatibleWith | string\[\] | Array of part IDs that this part connects with |
| materials | string\[\] | e.g., \['copper', 'brass', 'PVC', 'stainless'\] |
| installationNotes | string | Brief installation context |
| tags | string\[\] | Free-form tags for improved search (e.g., 'compression', 'push-fit', 'solder') |

## **4.3 Project Structure**

Recommended folder structure for the React/Vite project:

**src/**  components/   — reusable UI components (SearchBar, PartCard, DiagramViewer)

  pages/        — route-level pages (Home, PartDetail, Browse, Glossary)

  data/         — parts.json, categories.json, aliases.json

  assets/        — diagrams, icons, images

  hooks/         — useSearch, usePartById, useCategory

  utils/         — search config (Fuse.js), data helpers

# **5\. 2-Week Build Plan**

## **5.1 Sprint Overview**

The 2-week sprint is divided into two focused phases: build week and polish week. Each day has defined deliverables to prevent scope drift and ensure a shippable product at the end of Week 2\.

## **5.2 Week 1 — Core Build (Days 1–7)**

| Day | Focus | Deliverables | Owner Suggestion |
| :---- | :---- | :---- | :---- |
| Day 1 | Project Setup | Repo, Vite \+ React \+ Tailwind \+ vite-plugin-pwa, routing scaffold, PWA manifest & service worker configured, deploy pipeline to Vercel | Both |
| Day 2 | Data Layer | parts.json schema finalized, 25 parts seeded across all 3 verticals, Fuse.js integrated | Dev 1 |
| Day 2 | UI Foundation | Color system, typography scale, navigation bar, layout shell | Dev 2 |
| Day 3 | Search Feature | Search bar component, results page, fuzzy match working, alias search confirmed | Dev 1 |
| Day 3 | Home Page | Hero section, 3 vertical cards, search CTA, recent/popular parts | Dev 2 |
| Day 4 | Part Detail Page | All P0 sections live: header, diagram, overview, aliases table | Dev 2 |
| Day 4 | Data Expansion | Expand to 60 parts total; add diagrams/images for first 25 | Dev 1 |
| Day 5 | Category Browser | Vertical landing pages, sub-category grid, part cards | Dev 2 |
| Day 5 | Data Expansion | Complete 100 parts; all with aliases and compatibility data | Dev 1 |
| Day 6 | Compatible Parts | Compatible parts section on detail page; related parts links | Dev 2 |
| Day 6 | Filter System | Category filter, material filter, vertical filter on browse page | Dev 1 |
| Day 7 | Glossary Page | Alias glossary A–Z, filter by vertical, links to part pages | Dev 1 |
| Day 7 | Mobile Pass | First full mobile pass; bottom nav, touch targets, test install-to-home-screen on iOS and Android | Dev 2 |

## **5.3 Week 2 — Polish & Finalize (Days 8–14)**

| Day | Focus | Deliverables |
| :---- | :---- | :---- |
| Day 8 | UI Polish | Consistent spacing, color, typography across all pages; diagram styling |
| Day 9 | PWA & Mobile Finalize | Full mobile audit on all pages; fix overflow issues, verify offline mode works, test on real iOS and Android devices |
| Day 10 | Empty States & Errors | No-results state, loading states, graceful fallbacks for missing images |
| Day 11 | Content Audit | Review all 100 parts for accuracy, completeness, and clear writing |
| Day 12 | Performance | Optimize images, lazy load diagrams, verify \<2s load time |
| Day 13 | QA & Bug Fix | Full walkthrough of all user flows; fix any remaining bugs |
| Day 14 | Demo Prep | Final deploy, demo script prepared, capstone presentation materials |

## **5.4 Risk Register**

| Risk | Severity | Mitigation |
| :---- | :---- | :---- |
| Data sourcing: finding 100 accurate, well-described parts | High | Start data entry Day 1; use trade catalogs (e.g., Wolseley, Ferguson) as reference; prioritize depth over breadth |
| Diagram/image quality: finding clear technical diagrams | Medium | Use royalty-free SVGs; create simple labeled diagrams in Figma or Excalidraw if needed |
| Scope creep: adding features mid-sprint | Medium | Strictly follow this PRD; log new ideas in a backlog doc, do not build during MVP sprint |
| Search accuracy on aliases | Low | Fuse.js threshold tuning; test with 20 real-world alias queries before Day 5 |

# **6\. UX & Design Guidelines**

## **6.1 Design Principles**

* Clarity over cleverness — field technicians need information fast, not beautiful animations

* Mobile-first — design for a phone screen in a dirty hand, not a desktop browser

* Scannable — use clear labels, visual hierarchy, and whitespace so users find info without reading

* Trust through accuracy — every part entry must be factually correct; wrong info destroys credibility

## **6.2 Color System**

| Role | Hex Value | Usage |
| :---- | :---- | :---- |
| Primary Blue | \#1B4F8A | Navigation, headings, primary CTAs, category badges |
| Success Green | \#2E7D32 | Compatibility indicators, active states, status labels |
| Background Gray | \#F5F5F5 | Page background, card backgrounds, alternate rows |
| Text Dark | \#1A1A2E | Body text, part names, primary labels |
| Text Muted | \#555555 | Secondary text, metadata, timestamps |

## **6.3 Key UI Components**

### **Part Card (used in grid/search results)**

* Part thumbnail diagram (square, 1:1 ratio)

* Primary name (bold, 16px)

* Category badge (color-coded pill)

* One-line description excerpt

* Tap/click navigates to Part Detail page

### **Search Bar**

* Full-width, persistent in header

* Placeholder: 'Search by name, alias, or part number...'

* Results dropdown appears below as user types (debounced 200ms)

* Shows part thumbnail \+ name \+ category in dropdown

### **Alias Table (on Part Detail page)**

* Two columns: 'Name / Alias' and 'Context'

* Context explains where that name is used (e.g., 'UK trade term', 'Old BS standard', 'Manufacturer brand name')

* Highlighted row for the primary/canonical name

# **7\. Future Phases (Post-MVP)**

## **7.1 Phase 2 — AR Part Identification**

The most compelling differentiator for PartsDex's long-term roadmap. A technician points their phone camera at an unknown part, and the app identifies it.

* Implement camera access via browser MediaDevices API (already supported in PWA context on iOS and Android)

* Build or integrate a parts image classification model (TensorFlow.js for in-browser, or API call to a hosted model)

* Initial training data: photos of the 100 MVP parts from multiple angles

* AR overlay displays part name, aliases, and compatibility hints directly on camera feed

* Estimated complexity: 4–6 weeks additional development

## **7.2 Phase 3 — Backend & User Accounts**

* Migrate from static JSON to a hosted database (Supabase or Firebase recommended)

* User accounts with saved/favorited parts

* Technician-submitted aliases and notes (community knowledge layer)

* Admin dashboard for content management

## **7.3 Phase 4 — Supplier Integration**

* Real-time inventory and pricing from major distributors (Ferguson, Grainger, Wolseley)

* 'Where to buy this part' links with local availability

* Part number cross-reference between manufacturer catalogs

## **7.4 Phase 5 — Native Mobile App**

* iOS and Android native apps via React Native if PWA experience needs improvement on specific platforms (large logic reuse from PWA MVP)

* Offline mode for use in basements, mechanical rooms, and areas without cell signal

* Push notifications for new parts in a technician's saved categories

# **8\. Appendix**

## **8.1 Sample Parts List for MVP Seeding**

The following is a starter list of parts to seed across all three verticals. Each should have a full entry including aliases, overview, and compatibility.

### **Plumbing (suggested: 40 parts)**

* Compression fitting (olive, compression ring, compression nut)

* Push-fit fitting (Speedfit, SharkBite, push-to-connect)

* Gate valve (sluice valve, full-bore valve)

* Ball valve (quarter-turn valve, shut-off valve)

* Stop valve (service valve, mini valve)

* P-trap (waste trap, sink trap, bottle trap)

* Pipe coupling, elbow (street elbow, sweep elbow), tee, reducer

* Float valve (ball cock, ballvalve, toilet fill valve)

* Isolation valve, check valve (one-way valve, non-return valve)

* Flexible tap connector, basin wrench, pipe clip/bracket

### **HVAC (suggested: 35 parts)**

* Schrader valve (service valve, charging valve, AC valve)

* TXV — thermostatic expansion valve (metering device, expansion valve)

* Filter drier (liquid line drier, moisture indicator)

* Air handler unit (fan coil unit, AHU, air handling unit)

* Damper (volume control damper, fire damper, VAV box)

* Duct elbow, duct reducer, plenum, diffuser, register

* Condenser fan motor, evaporator coil, compressor

* Refrigerant sight glass, service port, Schrader core remover

### **Boiler & Heating (suggested: 25 parts)**

* Expansion vessel (expansion tank, pressure vessel, diaphragm tank)

* Circulator pump (heating pump, zone pump, wet rotor pump)

* Pressure relief valve (PRV, safety valve, T\&P valve)

* Zone valve (motorized valve, 2-port valve, mid-position valve)

* Heat exchanger (plate heat exchanger, PHE, brazed plate)

* Lockshield valve (balancing valve, radiator lockshield)

* TRV — thermostatic radiator valve (rad valve, room thermostat valve)

* Filling loop (filling link, bypass link, system filler)

## **8.2 Useful Reference Resources for Data Entry**

* CIPHE (Chartered Institute of Plumbing and Heating Engineering) — parts glossaries

* Ferguson Enterprises product catalog — cross-reference part numbers

* Grainger industrial catalog — HVAC and boiler component descriptions

* ASHRAE Handbook — authoritative HVAC terminology

* BS EN standards documentation — European/UK part naming conventions

## **8.3 Document Revision History**

| Version | Date | Author | Changes |
| :---- | :---- | :---- | :---- |
| 1.0 | March 2026 | Capstone Team | Initial PRD — full MVP specification |

