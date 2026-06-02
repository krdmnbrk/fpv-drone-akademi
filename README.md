# FPV Drone Academy (FPV Drone Akademi)

An interactive, animated learning platform that takes a complete beginner to an
advanced FPV pilot. Two tracks:

- **Learn the hardware** — explore every part of an FPV drone in an interactive 3D
  model (click a part for what it does, how to choose it, how it connects, and
  common mistakes).
- **Learn to fly** — a staged Beginner → Intermediate → Advanced curriculum: short
  theory, visual explanations, interactive demos, mini quizzes, and progress tracking.

The product UI and educational content are in **Turkish**; the codebase is in English
and the app is **i18n-ready** (an English locale is scaffolded).

> ⚠️ Educational use only. Verify current Türkiye SHGM/İHA regulations from official
> sources before flying. See `src/content/regulations/shgm.mdx`.

## Tech stack

React 18 · TypeScript (strict) · Vite · Tailwind CSS (design tokens) · Framer Motion ·
Three.js + React Three Fiber (interactive 3D) · React Router · Zustand (persisted
progress/badges) · MDX content · Vitest + Testing Library · ESLint + Prettier.

See [`docs/adr/0001-tech-stack.md`](docs/adr/0001-tech-stack.md) for rationale.

## Getting started

```bash
npm install
npm run dev        # start the dev server
```

### Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck (`tsc --noEmit`) + production build |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | TypeScript only |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |
| `npm test` | Unit/integration tests (Vitest) |
| `npm run test:coverage` | Tests with coverage (enforced thresholds) |

## Project structure

```
src/
  app/ (root)          App.tsx, router.tsx — providers + routing
  components/          UI primitives, layout, settings, MDX components, quiz
  content/             MDX lessons + quizzes + parts.json + loader/types/manifest
  design/              design tokens (motion, layout) — source for Tailwind
  features/hardware/   3D part-explorer feature (list + detail + lazy 3D)
  hooks/               usePrefersReducedMotion, ...
  i18n/                i18next setup + tr (default) / en locales
  pages/               route views (Home, Hardware, Flight, Lesson, Progress, 404)
  scenes/              Three.js / R3F scene (lazy-loaded)
  store/               Zustand store + selectors (progress, badges, settings)
docs/                  PLAN.md, PROGRESS.md, ADRs, gate reports
.claude/agents/        subagent role definitions used by the orchestration workflow
```

## How content works

Lessons are MDX files under `src/content/flight/<level>/` with typed frontmatter
(`id, track, level, order, title, summary, estimatedMinutes, objectives,
prerequisites, quizId`). Lesson bodies may use four approved components:
`<Callout>`, `<KeyTerm>`, `<PartHighlight>`, `<DemoPlaceholder>`. Quizzes live in
`src/content/quizzes/<quizId>.json`; hardware parts in
`src/content/hardware/parts.json`. The loader (`src/content/index.ts`) eager-loads
frontmatter for listings and lazy-loads lesson components to keep the entry bundle
small.

## Accessibility & performance

- `prefers-reduced-motion` is respected globally and per-feature (a user override
  lives in Settings). The 3D scene disables auto-rotation/spin when motion is reduced.
- The 3D scene is lazy-loaded and has an accessible part-list equivalent plus a
  non-WebGL fallback.
- i18n: no hardcoded user-facing strings; Turkish default, English scaffolded.

## Development workflow & quality gates

Each module passes three gates before it is considered done — review (lint + types),
test (coverage), and QA (accessibility + performance). See
[`docs/PLAN.md`](docs/PLAN.md) and [`docs/gate-reports/`](docs/gate-reports/).

## License

MIT.
