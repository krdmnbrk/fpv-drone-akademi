# Progress Log

Reverse-chronological log of what happened, decisions made, and what's next.
Updated by the orchestrator at each meaningful step.

## Phase status

| Phase | Title | Status |
|---|---|---|
| 0 | Setup (agents, PLAN, scaffolding docs) | ✅ Done |
| 1 | Architecture & curriculum design | ✅ Done (schema + full outline + verified SHGM) |
| 2 | Design system + app shell | ✅ Core done (tokens, shell, routing, i18n, store, tests, CI); Husky/Storybook pending |
| 3 | Hardware module (3D part explorer) | 🔄 Built; verifying gates |
| 4 | Flight curriculum (Beginner→Advanced) | 🔄 Pipeline done; 19 lessons authored, integrating |
| 5 | Integration & polish | ⏳ Not started |
| 6 | Final QA & release | ⏳ Not started |

---

## 2026-06-02 — Phases 1–4 (autonomous build)

The user granted full autonomy ("define all phases yourself, don't ask for approval,
review at the end") and approved `git init`. Building incrementally with per-module
gates and commits.

**Foundation & shell (Phase 2 core)**
- Vite + React 18 + TS strict + Tailwind scaffold; ESLint + Prettier.
- Design tokens → Tailwind; i18n (TR default, EN scaffold, typed keys).
- Persisted Zustand store (progress/badges/settings) + selectors; 18 tests, ~97% store coverage.
- Accessible app shell: router, layout, responsive nav, skip link, route focus manager,
  language + motion controls. HomePage tests.
- GitHub Actions CI (lint, typecheck, test+coverage, build).

**Content & curriculum (Phases 1 & 4)**
- `curriculum-author` subagent verified Türkiye SHGM/İHA rules against the official
  SHT-İHA REV1 source (dated, with sources + disclaimer) and wrote the outline, the
  first 3 beginner lessons, quizzes, and `parts.json` (11 parts).
- MDX content pipeline: typed loader (eager frontmatter, lazy lesson components),
  approved MDX components, accessible Quiz wired to the progress store.
- Three parallel `curriculum-author` subagents authored the remaining 16 lessons
  (5 beginner, 6 intermediate, 5 advanced) + quizzes — integrating now.

**Hardware 3D explorer (Phase 3)**
- Interactive R3F drone (procedural), per-part highlight synced with an accessible
  part list; lazy-loaded (Three.js in its own chunk), reduced-motion aware, with a
  non-WebGL fallback. Part detail cross-links to related lessons.

**Decisions logged**
- Custom `.claude/agents` aren't spawnable as subagent types in this runtime, so each
  role is realized via a briefed `general-purpose` agent (definitions still document
  the roles/contracts).
- Production dependency tree has 0 known vulnerabilities; the 6 npm-audit advisories
  are all dev-only (esbuild/vite/vitest). Not forcing breaking upgrades.
- Lesson components are lazy-loaded so the entry bundle stays within the ≤200 KB gzip
  budget as the curriculum grows.

**Next**
- Integrate the 16 new lessons, run all gates on the stable tree, commit Phase 3 + 4.
- Independent code-review gate (subagent) on the stabilized codebase.
- Phase 5 polish (regulations page, E2E, mobile/reduced-motion/fallback pass) and
  Phase 6 (a11y/perf audit to budget, CHANGELOG, gate reports, version tag, Husky).
