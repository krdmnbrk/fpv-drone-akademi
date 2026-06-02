# Codebase — KAPI 1 (Review)

- **Module / scope:** Full `src/` codebase (store, content loader, curriculum, badges,
  Quiz, HardwareExplorer, R3F scenes, all pages, MDX components, layout, settings,
  hooks, lib, i18n) + configs.
- **Phase:** 6 (final review of the integrated codebase)
- **Owner agent:** code-reviewer (independent subagent)
- **Date:** 2026-06-02
- **Verdict:** PASS ✅ (APPROVE — no blockers; should-fixes and nits resolved)

## Checks run
- `tsc --noEmit` → clean (TypeScript strict, `noUncheckedIndexedAccess`).
- `eslint .` → 0 errors, 0 warnings.
- Independent read-through of all source for correctness, security, types, a11y,
  i18n, and consistency.

## Findings & resolutions (ordered by severity)
| # | Severity | Location | Issue | Resolution |
|---|---|---|---|---|
| 1 | Should-fix | `src/index.css`, `App.tsx` | In-app "reduced motion" override didn't suppress CSS/Tailwind transitions (only the OS media query did). | Fixed — `App` sets `data-reduced-motion` on `<html>` from the resolved preference; CSS mirrors the reset. |
| 2 | Should-fix | `src/lib/badges.ts` | `levelComplete` counted planned (unavailable) lessons — latent bug if a "coming soon" lesson is added. | Fixed — `levelComplete` now filters to `available` lessons. |
| 3 | Nit | `PartHighlight.tsx`, `DemoPlaceholder.tsx` | Two hardcoded Turkish strings (i18n leak). | Fixed — moved to `hardware.relatedHardware` / `lesson.demoComingSoon`. |
| 4 | Nit | `i18n/locales/*`, settings | Unused i18n keys; half-finished 3D-quality feature (no UI). | Fixed — removed unused keys; wired a `QualityToggle` on the hardware explorer. |
| 5 | Nit | `useAppStore.ts` | `recordQuizScore` status fallback assumption undocumented. | Fixed — added a clarifying comment. |

## Notable positives (verified by the reviewer)
- MDX pipeline omits `rehype-raw` → no raw-HTML passthrough / injection vector.
- Quiz scoring is closure-safe; empty-quiz guarded.
- `completeLesson` never clobbers a higher recorded quiz score (`mergeBestScore`).
- `startLesson` never downgrades a completed lesson; `awardBadge` idempotent.
- 3D scene is `aria-hidden` with an accessible part-list equivalent.
- HardwareExplorer deep-link sync is guarded; no render loops; stable list keys.

## Notes
No secrets, no unsafe casts, no `dangerouslySetInnerHTML`. After fixes: lint clean,
49 tests pass, build clean. Re-review of the fixes confirms the gate is green.
