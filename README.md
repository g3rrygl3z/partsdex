# PartsDex

**Plumbing, HVAC & Boiler Parts Identifier**

PartsDex is a mobile-first Progressive Web App (PWA) designed for on-site crews and trade professionals. Built primarily for field use on smartphones, PartsDex helps technicians and apprentices cross-reference industry slang, regional part names, and primary part definitions across three major trades.

The application allows you to search by name, alias, part number, or keyword, providing you with a complete profile of a part: what it is, what it does, compatible parts, and installation context.

## MVP Features
- **Global PWA Offline Search:** Instant, indexed fuzzy search (via Fuse.js).
- **Category Browsing:** Browse by Plumbing, HVAC, and Boiler & Heating verticals.
- **Glossary:** Full A–Z glossary of trade terminology and aliases.
- **Installable:** Progressive Web App (PWA) that can be installed to your device home screen and works offline.

## Tech Stack
- **Framework:** React 18 / Vite
- **Styling:** Tailwind CSS v3
- **Routing:** React Router v6
- **Cache/Offline:** vite-plugin-pwa (Workbox)
- **Search:** Fuse.js
- **Data:** Static JSON

## Project Setup & Development

First, clear out `node_modules` if you are migrating branches to avoid missing dependency linking, then run:

```bash
# Install all dependencies
npm install

# Start the local development server on port 5173
npm run dev

# Run TypeScript compilation and build for production
npm run build
```

## Team Structure & Development Rules

PartsDex is developed with isolated feature ownership before the merge. See `TeamRules.md` to review Michael and Gary's file ownership. If you are modifying the foundational structures, review `TechnicalRequirements.md` and the original `PartsDex_PRD.md`.
