# Codebase — KAPI 3 (QA / a11y / perf)

- **Module / scope:** Whole app — accessibility, performance budget, motion safety,
  graceful degradation, and manual QA of the key journeys.
- **Phase:** 6
- **Owner agent:** a11y-perf-auditor
- **Date:** 2026-06-02
- **Verdict:** PASS ✅ (with one documented follow-up: live Lighthouse run in CI)

> **Addendum (2026-06-03) — "Cockpit HUD" re-theme + interactive explorer.**
> The app moved to the cyan "Cockpit HUD" palette and the hardware explorer gained a
> select-to-isolate interaction (the picked part lifts out, scales and glows; others
> stay visible). The 3D-quality and motion toggles were removed (3D is always on when
> WebGL is available; motion follows the OS and is reasserted via `data-reduced-motion`).
> Follow-ups from this report are now addressed: CI runs **Lighthouse CI** (throttled
> mobile profile) and an **entry-chunk bundle budget** (`scripts/check-bundle-size.mjs`,
> ≤200 KB gzip). Manual contrast spot-checks on the new palette (dark `brand-950`
> background): `brand-300` ≈13:1, `brand-400` ≈11:1, primary button (dark text on
> `brand-500`) ≈8:1 — all pass WCAG AA. The new palette should be re-confirmed by the
> live Lighthouse run.

## Accessibility
- **axe-core (automated):** 0 violations on HomePage, HardwareExplorer (list +
  fallback), and Quiz (jsdom; component-level rules). Page-composition rules are the
  layout's responsibility.
- Semantic structure: skip link, route focus management, `<main>` landmark, labelled
  nav, `aria-pressed` part buttons, `role="progressbar"` with values, fieldset/legend
  + labelled radios in the quiz, `aria-expanded`/`aria-controls` mobile menu.
- 3D canvas is `aria-hidden`; the accessible part list is the keyboard/SR equivalent.
- **Note:** jsdom-axe cannot compute color-contrast; contrast was designed against the
  dark brand palette (light text on `brand-950`) and should be confirmed by Lighthouse.

## Performance (bundle budget)
| Chunk | gzip | Notes |
|---|---|---|
| **Entry** | **~95 KB** | Within the ≤200 KB budget |
| Content (lessons + parts) | ~67 KB | Lazy — loads only on content routes |
| Three.js scene | ~226 KB | Lazy — loads only on `/hardware` (opt-in 3D) |
| Route chunks (Home/Flight/Lesson/…) | <1–37 KB each | Code-split per route |

Route-based code-splitting keeps the initial payload lean; Three.js and lesson
content are off the critical path.

## Motion safety & graceful degradation
- `prefers-reduced-motion` honored at the OS level (CSS) **and** via the in-app
  override (Settings → motion), now applied to CSS transitions too (`data-reduced-motion`).
- 3D scene disables auto-rotate and propeller spin under reduced motion.
- Non-WebGL / low-quality path renders an accessible fallback (no crash); a 3D-quality
  control lets users force the lightweight path.

## Manual QA (against the running dev server)
Verified working: home, hardware explorer (3D canvas mounts; 11 parts; detail panel),
flight curriculum (19 lessons, 3 levels), lesson rendering (MDX + GFM table + quiz),
lesson completion → persisted progress + awarded badge, regulations page. Zero console
errors. Turkish UI throughout.

## Follow-up
- Run Lighthouse CI (`lighthouserc.json` provided; `npx @lhci/cli autorun`) in CI to
  confirm Performance ≥ 90 and Accessibility ≥ 95 with real-browser metrics — not run
  locally because headless capture is unavailable in this environment.
