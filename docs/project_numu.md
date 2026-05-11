---
name: NUMU Website Project
description: Full website build for NUMU, a UAE-based bio-engineered materials company replacing synthetic foams
type: project
originSessionId: 0c4b6e82-9730-451e-8471-78bdf447bdbc
---
NUMU is a UAE-based material company developing a bio-engineered material platform that replaces synthetic foams. Entry product: acoustic panels. Expansion: thermal insulation and packaging. Long-term: broader construction materials.

The website has been fully built from scratch (Next.js 14 App Router, TypeScript, Tailwind, Framer Motion, React Three Fiber). It runs on `npm run dev` from the project directory.

**Core feature:** Dual mode toggle — "Explore" (visitor/architect/client) vs "Investor View" — transforms navigation labels, section order, CTAs, and content hierarchy. Mode switch uses a sand-colored curtain wipe animation.

**Why:** The site must serve two audiences: premium architects/designers who care about material quality and aesthetics, and investors who need a credible business narrative.

**How to apply:** When making changes, always consider both modes. Content must come from `/content/` files — no invented data, metrics, or fake projects.

**3D model:** `/public/models/acoustic_tile.glb` — acoustic tile rendered in the hero via React Three Fiber. Preserve existing GLB materials.

**Assets:** Founder portraits at `/public/images/founder/`, textures at `/public/images/textures/`, logo variants at `/public/branding/`.
