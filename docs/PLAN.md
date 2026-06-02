# FPV Drone Learning Platform — Master Plan (`PLAN.md`)

> **Status:** Phase 0 draft, awaiting approval.
> **Owner:** Lead Orchestrator (with `product-architect`).
> **Languages:** Code & commits in **English**; UI & educational content in
> **Turkish** (i18n-ready so English can be added).
> **Last updated:** 2026-06-02.

A staged, gated build of a dynamic, animated learning platform that takes an
absolute beginner to an advanced FPV pilot, across two arms: **Learn the Hardware**
(interactive 3D part exploration) and **Learn to Fly** (Beginner → Intermediate →
Advanced curriculum). Animation enhances learning; it never blocks it or harms
performance/accessibility.

---

## 1. Working assumptions (explicit)

We proceed on these assumptions and will revise as needed. Items marked **[VERIFY]**
must be confirmed before the related content/feature ships.

1. **Audience:** Turkish-speaking newcomers to FPV; UI in Turkish, English-ready.
2. **Delivery:** Client-side SPA (static hosting friendly). No backend/accounts in
   v1 — progress persists locally (`localStorage`). A backend can be added later
   without rearchitecting the content model.
3. **Scope of v1:** the full Beginner→Advanced curriculum + the hardware 3D explorer,
   progress/badge tracking, i18n (TR complete, EN scaffolded), accessibility and
   performance to budget. No real flight-sim physics engine in v1 — flight concepts
   are taught via guided visual simulations/animations, not a controllable simulator.
4. **3D assets:** a single representative 5-inch freestyle/racing quad model is enough
   for v1's part explorer. Assets are optimized glTF; a Blender MCP toolset may be
   available to author/inspect geometry. **[VERIFY]** licensing of any external model.
5. **Türkiye SHGM / İHA regulation [VERIFY — owned by `curriculum-author`]:** current
   working understanding (must be re-confirmed against SHGM's live rules and dated):
   - Weight categories by max takeoff weight: **İHA0** 500 g–4 kg, **İHA1** 4–25 kg,
     **İHA2** 25–150 kg, **İHA3** >150 kg. Sub-500 g typically lighter obligations
     but rules still apply.
   - Device **and** pilot registration via SHGM's İHA registration system for İHA0+.
   - FPV is flown through goggles (not direct line of sight), so a **spotter/observer
     maintaining VLOS** is generally required — a key safety + legal point for the
     Beginner module.
   - Altitude limits, no-fly zones (airports/military/crowds), and possible insurance
     for some categories.
   - **All of the above must be verified live, dated, and shipped with a "rules can
     change" disclaimer.** Most 5-inch FPV builds land in İHA0 once a battery is
     fitted, so registration almost always applies — make this explicit to learners.
6. **Browser/device targets:** evergreen Chrome/Edge/Firefox/Safari; mobile-first
   responsive; must remain usable without WebGL (3D fallback) and with reduced motion.

---

## 2. Tech stack & rationale

Accepting the proposed stack; rationale below. Any later deviation gets an ADR in
`docs/adr/`.

| Concern | Choice | Why |
|---|---|---|
| Framework | **React 18 + TypeScript (strict) + Vite** | Fast DX/HMR, first-class ecosystem for R3F/Framer/MDX, strict typing is a gate. |
| Styling | **Tailwind CSS + design tokens** | Token-driven consistency, small CSS, fast iteration. |
| UI motion | **Framer Motion** | Declarative, `prefers-reduced-motion` aware, ergonomic variants. |
| Illustration | **Lottie** | Lightweight vector micro-illustrations/icons. |
| 3D | **Three.js + React Three Fiber + drei** | Interactive part explorer; R3F fits React model; drei for helpers/loaders. |
| Routing | **React Router** | Standard nested routing + code-splitting. |
| State | **Zustand (+ persist)** | Minimal, typed, great for progress/badges; no boilerplate. |
| Content | **MDX** | Authors write rich lessons in Markdown + components; content stays out of code. |
| Unit/Integration tests | **Vitest + React Testing Library** | Vite-native, fast; RTL drives behavior-first testing. |
| E2E | **Playwright** | Reliable cross-browser journeys for critical flows. |
| Component isolation | **Storybook** | Build/review components + a11y addon in isolation. |
| Quality | **ESLint + Prettier + TS strict + Husky (pre-commit) + GitHub Actions CI** | Automated, enforced on every commit/PR. |
| A11y/Perf | **axe-core + Lighthouse (CI)** | Gate 3 enforcement with budgets. |

---

## 3. Architecture & conventions

### Proposed folder structure
```
drone/
├─ .claude/agents/         # subagent definitions (done)
├─ docs/
│  ├─ PLAN.md  PROGRESS.md
│  ├─ adr/                 # architecture decision records
│  └─ gate-reports/        # KAPI 1/2/3 reports
├─ public/assets/          # optimized 3D (glTF), lottie, images
├─ src/
│  ├─ app/                 # shell, providers, router, error/suspense boundaries
│  ├─ pages/               # route-level views
│  ├─ components/          # shared, token-driven UI primitives
│  ├─ features/
│  │  ├─ hardware/         # 3D part-explorer feature glue
│  │  └─ flight/           # flight-curriculum feature glue
│  ├─ content/             # MDX lessons + structured data  → curriculum-author
│  │  ├─ hardware/
│  │  └─ flight/{beginner,intermediate,advanced}/
│  ├─ scenes/              # Three.js / R3F scenes          → animation-3d-specialist
│  ├─ motion/              # Framer variants, Lottie wrappers→ animation-3d-specialist
│  ├─ store/               # Zustand slices (progress/badges/settings)
│  ├─ i18n/                # locales: tr (default), en
│  ├─ design/             # tokens + theme (source of truth for Tailwind)
│  ├─ lib/                 # content loader, schema/types, utils
│  └─ test/                # test utils, fixtures, mocks
├─ e2e/                    # Playwright specs
├─ .storybook/
├─ .github/workflows/      # CI
└─ config: vite, tsconfig, tailwind, eslint, prettier, vitest, playwright, lighthouserc
```

### Content model contract (the seam between content and code)
- **Lesson** = one `.mdx` file with typed frontmatter: `id, level
  (beginner|intermediate|advanced|hardware), order, title, summary, objectives[],
  prerequisites[], estimatedMinutes, quizId?`. Body uses a small set of approved
  components (e.g. `<PartHighlight part="esc" />`, `<Demo id="..." />`, callouts).
- **Quiz** = structured data: `id, questions[{ prompt, options[], answerIndex,
  explanation }]`.
- **Hardware part** = typed registry entry: `id, name, meshName (binds to 3D mesh),
  whatItDoes, howToChoose, howItConnects, commonMistakes[], relatedLessonIds[]`.
- `src/lib` exposes typed loaders so the UI never reaches into raw files. This lets
  `curriculum-author` add content without touching app code.

### State (Zustand slices, persisted)
`progress` (lesson status + quiz scores) · `badges` (earned) · `settings` (locale,
reduced-motion override, 3D quality). All typed; selectors memoized.

### i18n
UI strings via i18n keys (TR default, EN keys present). Lesson content is per-locale
MDX (`content/<locale>/…`); TR complete in v1, EN structurally supported.

### Design system / motion
Single token source in `src/design` (color "sky/flight" palette, spacing, radii,
type scale, **motion durations & easings**, z-index, breakpoints, dark mode) → feeds
`tailwind.config`. All motion uses token durations/easings and respects reduced motion.

---

## 4. Subagents & ownership boundaries

| Agent | Owns | Must not touch |
|---|---|---|
| `product-architect` | PLAN/ADRs, structure, contracts, tokens spec, CI/gate defs | Feature code, content |
| `curriculum-author` | MDX lessons, quizzes, part metadata, SHGM content | App code, styling, 3D logic |
| `frontend-engineer` | components/pages/routing/store/i18n/MDX pipeline | Content wording, 3D scenes, deep animation |
| `animation-3d-specialist` | R3F scenes, Framer/Lottie, reduced-motion + fallbacks | Content, general app UI/state |
| `qa-test-engineer` | Vitest/RTL, Playwright, Storybook, coverage (KAPI 2) | Editing product code to pass tests |
| `a11y-perf-auditor` | axe, Lighthouse, budgets (KAPI 3) | Editing feature code (reports only) |
| `code-reviewer` | Review verdicts, KAPI 1 gate | Implementing code |

The **orchestrator** sequences work, resolves cross-agent dependencies and conflicts,
and runs the gates. Definitions live in `.claude/agents/`.

---

## 5. Workflow & quality gates

Every module flows through:

```
Plan → Implement → [KAPI 1: Code Review] → [KAPI 2: Test] → [KAPI 3: QA + a11y/perf] → Integrate
```

A module is **not "done"** until all three gates are green. Each gate writes a short
report to `docs/gate-reports/` (see that folder's README for the template).

- **KAPI 1 — Review** (`code-reviewer`): TypeScript strict clean, lint clean,
  correctness/security/consistency OK, reviewer **APPROVE**. Blockers stop progress.
- **KAPI 2 — Test** (`qa-test-engineer`): new/changed logic has unit/integration
  tests; critical flows have E2E; **coverage ≥ 80%** (higher on logic-heavy code);
  all green in CI; no `.only`/skipped leftovers.
- **KAPI 3 — QA / a11y / perf** (`a11y-perf-auditor`): **0 axe critical/serious**;
  **Lighthouse a11y ≥ 95, performance ≥ 90**; `prefers-reduced-motion` works; WebGL/
  low-end fallback works; manual QA scenarios pass.

---

## 6. Quality budgets (concrete numbers)

| Metric | Target |
|---|---|
| Test coverage (overall) | ≥ 80% |
| Test coverage (store, scoring, content loader) | ≥ 90% |
| Lighthouse — Performance | ≥ 90 (throttled mobile) |
| Lighthouse — Accessibility | ≥ 95 |
| Lighthouse — Best Practices / SEO | ≥ 95 / ≥ 90 |
| axe-core | 0 critical / serious |
| Initial (entry) JS, gzip | ≤ 200 KB (3D/animation libs in lazy chunks) |
| Core Web Vitals | LCP < 2.5s, CLS < 0.1, TBT low; verified throttled |

`a11y-perf-auditor` may refine these in an ADR; the orchestrator must approve changes.

---

## 7. Roadmap (phases, deliverables, exit criteria)

- **Phase 0 — Setup (current):** agent definitions + this PLAN + PROGRESS + gate-report
  scaffolding. **Exit:** user approves agents & PLAN. *(Repo scaffold/CI/design-system/
  Storybook begin only after approval — treated as the first implementation step.)*
- **Phase 1 — Architecture & curriculum design:** `product-architect` finalizes
  contracts/ADRs; `curriculum-author` delivers the full curriculum outline + content
  schema sample + verified SHGM section. **Exit:** review gate on the design docs.
- **Phase 2 — Design system + app shell:** tokens, Tailwind, layout, navigation,
  routing, i18n bootstrap, Zustand progress/badge skeleton, Storybook, CI green.
  **Exit:** shell passes all three gates.
- **Phase 3 — Hardware module (3D part explorer):** iterative; each part (frame,
  motors, ESC, FC, FPV cam, VTX+antenna, RX, props, LiPo, goggles, radio) passes the
  gates. Includes accessible non-3D fallback. **Exit:** all parts gated + integrated.
- **Phase 4 — Flight curriculum (Beginner→Advanced):** module by module, each through
  the gates; progress/badges wired. **Exit:** all curriculum modules gated.
- **Phase 5 — Integration & polish:** end-to-end flow, empty/edge/error states,
  mobile, full reduced-motion/fallback pass. **Exit:** E2E journeys + gates green.
- **Phase 6 — Final QA & release:** all gates green; `README.md`, `CHANGELOG.md`,
  version tag, meaningful commit history. **Exit:** Definition of Done met.

---

## 8. Curriculum outline (to be detailed by `curriculum-author`)

**Hardware (interactive 3D explorer):** Frame · Motors · ESC · Flight Controller (FC)
· FPV Camera · VTX + Antenna · Receiver (RX) · Propellers · LiPo Battery · FPV Goggles/
Screen · Radio Transmitter. Each: what it does · how to choose · how it connects ·
common mistakes; click a part in 3D → highlight + explanation (with a keyboard/SR-
accessible list equivalent).

**Flight — Beginner:** what FPV is; line-of-sight vs FPV (+ spotter rule); flight
modes (Angle/Horizon/Acro); starting in a simulator (Liftoff/Velocidrone); arming;
throttle control; first hover; safety + **Türkiye SHGM** registration/permits.
**Intermediate:** stable hover & yaw/turns; coordinated turns; intro to Betaflight;
PID/rates basics; battery care; basic troubleshooting.
**Advanced:** freestyle (power loop, dive, split-S); race lines; building & soldering
your own quad; tuning; long-range basics.

Each lesson: short theory → visual/animated explanation → interactive demo → mini quiz
→ progress checkpoint.

---

## 9. Risks & mitigations

| Risk | Mitigation |
|---|---|
| 3D perf on low-end/mobile | Lazy-load, budgets, instancing/compressed glTF, capped pixel ratio, mandatory fallback |
| Animation harming a11y | `prefers-reduced-motion` + accessible non-animated equivalents are required, gated |
| Regulation content stale/wrong | Live verification + dated note + disclaimer; owned by `curriculum-author` |
| Scope creep | Strict module-by-module gating; content separated from code |
| Agent collisions | Hard ownership boundaries (§4); orchestrator manages dependencies |
| Flaky E2E/3D tests | Deterministic mocks, no real network, stable selectors |

---

## 10. Definition of Done (project acceptance)

- Complete, working Beginner→Advanced curriculum with progress/badge tracking.
- Interactive 3D/animated hardware exploration, smooth on mobile, with fallback.
- All tests green, running automatically in CI.
- Accessible, performant (budgets met), i18n-ready (TR complete, EN scaffolded).
- `README` (setup/dev/architecture), `PLAN.md`, gate reports, `CHANGELOG` present.
- Strictly typed, lint-clean codebase with meaningful commit history.

---

## 11. Open decisions (will assume defaults if no input)

1. **Repo & commits:** initialize git now and commit per gated module? *(Default
   assumption: yes — meaningful history is in the DoD; awaiting go-ahead to `git init`.)*
2. **i18n library:** `react-i18next` vs. a minimal custom layer. *(Default: react-i18next.)*
3. **Hosting target:** static host (e.g. GitHub Pages/Netlify/Vercel). *(Default:
   static-host-agnostic build.)*
4. **EN content depth in v1:** scaffolded keys only vs. translated. *(Default:
   scaffolded; TR is the shipping language.)*
