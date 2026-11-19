# Vivek Patric — Creative Developer Portfolio

A React + TypeScript + Vite portfolio with a GSAP-powered project rail, interactive work carousel, profile skill cards, scroll progress indicator, and a Three.js / React Three Fiber transition using the supplied gold-chain GLB model.

## Requirements

- Node.js compatible with the Vite version declared in `package.json`
- npm

## Run locally

```bash
npm install
npm run dev
```

## Validate a production build

```bash
npm run build
npm run lint
```

## Project structure

- `src/pages/landing/` — original landing intro and hero; preserved from the existing project
- `src/components/FluidCursor.tsx` and `src/pages/lib/FluidCursor/` — original fluid cursor and shader files; preserved
- `src/pages/home/` — home featured-project journey
- `src/pages/work/` — in-page project carousel
- `src/pages/profile/` — profile and interactive skill cards
- `src/components/projects/` — project data, glare cards, horizontal project rail
- `src/components/navigation/` — single-page navigation and animated 3D transition
- `src/components/scroll/` — scroll progress indicator
- `src/components/SiteFooter.tsx` — shared footer
- `src/portfolio.css` — styles for the new portfolio views
- `public/models/gold-chain.glb` — transition model

## Customise project details

Edit `src/components/projects/projectData.ts` to update the temporary dog-image URLs, project text, tech tags, and add your GitHub / live-demo URLs. The current project descriptions use the details supplied for AI Traffic Navigator, Cryptocurrency Tracker and Personal Finance Tracker. The fourth home card is an in-progress creative-coding experiment for the existing fluid cursor work.

## Integration notes

- Existing landing-page source files and fluid cursor code have been retained.
- `src/App.tsx` is the integration point that mounts the original landing page with the new home rail, work/profile pages, shared footer, scroll indicator and transition overlay.
- `.git` metadata is not included in this portable ZIP. Extract it into a working folder or copy the source into your existing Git checkout.
