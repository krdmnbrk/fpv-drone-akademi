# ADR 0001 — Technology stack

- **Status:** Accepted (pending Phase 0 sign-off)
- **Date:** 2026-06-02
- **Deciders:** Lead Orchestrator, `product-architect`

## Context
We are building a Turkish-first, i18n-ready, animated FPV learning platform with an
interactive 3D hardware explorer and a Beginner→Advanced flight curriculum. We need a
stack that supports rich content, 3D + motion, strict typing, and enforceable quality
gates (review/test/a11y/perf), deployable as a static SPA.

## Decision
Adopt the proposed stack:
- **React 18 + TypeScript (strict) + Vite** — app framework & build.
- **Tailwind CSS + design tokens** — styling/design system.
- **Framer Motion** (UI motion), **Lottie** (illustration), **Three.js + React Three
  Fiber + drei** (interactive 3D).
- **React Router** (routing), **Zustand + persist** (state: progress/badges/settings).
- **MDX** — lesson content decoupled from code.
- **Vitest + React Testing Library** (unit/integration), **Playwright** (E2E),
  **Storybook** (component isolation).
- **ESLint + Prettier + TS strict + Husky + GitHub Actions** (quality/CI),
  **axe-core + Lighthouse CI** (a11y/perf gates).

## Rationale
- Vite + React + TS is the most ergonomic, well-supported base for R3F/Framer/MDX.
- R3F expresses 3D in the React model the rest of the app already uses.
- Zustand keeps progress/badge state typed and boilerplate-free; persist covers the
  no-backend v1.
- MDX keeps the content authorable by `curriculum-author` without touching app code.
- The test/quality tools map 1:1 onto the three gates, making "done" objectively
  checkable in CI.

## Consequences
- 3D/animation libraries are heavy → they **must** be lazy-loaded into separate
  chunks and kept out of the entry bundle (enforced by the bundle budget, PLAN §6).
- `prefers-reduced-motion` and a non-WebGL fallback are mandatory, not optional.
- Strict TS and lint are commit-blocking via Husky + CI.

## Alternatives considered (brief)
- **Next.js** instead of Vite SPA — more than v1 needs (no server/SSR requirement);
  revisit if SEO/SSR or a backend becomes a priority.
- **Redux Toolkit / Jotai** instead of Zustand — heavier / different ergonomics for
  this small, persisted state surface.
- **GSAP** instead of Framer Motion — powerful, but Framer integrates more naturally
  with React and reduced-motion handling. Revisit per-need in an ADR if required.

A change to any of the above should be recorded as a new ADR superseding this one.
