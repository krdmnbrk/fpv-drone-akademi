# Codebase — KAPI 2 (Test)

- **Module / scope:** Whole app (logic + components + pages + content loader).
- **Phase:** 6
- **Owner agent:** qa-test-engineer
- **Date:** 2026-06-02
- **Verdict:** PASS ✅

## Checks run (commands + results)
- `npm test` → **49 tests, all passing** (12 files).
- `npm run test:coverage` → see below. The `src/store/**` per-module threshold
  (≥90% lines/functions/statements, ≥85% branches) is enforced and met.

## Coverage (v8)
| Area | Statements | Notes |
|---|---|---|
| **All files** | **86.5%** | Above the ≥80% overall target |
| `src/store` | 94.8% | Logic core (progress/badges/settings + selectors) — enforced ≥90% |
| `src/content` | 98.1% | Loader, curriculum, parts |
| `src/lib` | 95.1% | badges, cn (webgl exercised via fallback path) |
| `src/components/ui` | 100% | |
| `src/pages` | 80.2% | Home, Flight, Lesson, Progress integration tests |
| `src/hooks`, `src/i18n`, `src/design` | 100% / 100% / 96% | |

`src/scenes/**` (R3F) is excluded from coverage — it requires a real WebGL context
and is verified via the live preview (see KAPI 3).

## Test inventory
- Unit: store actions/selectors, `clampPct`/`mergeBestScore`, `evaluateBadges`,
  content loader, MDX components.
- Integration (RTL): HomePage, FlightPage (19 lessons / 3 levels), LessonPage
  (MDX + objectives + quiz; not-found path), ProgressPage (progress bar + badges),
  HardwareExplorer (part list + detail + non-WebGL fallback), Header (nav + mobile
  menu + settings), Quiz (full answer→score flow), a11y (axe).

## Notes
Critical user journeys (start lesson → quiz → progress → badge; browse curriculum;
explore hardware) were additionally exercised end-to-end against the running dev
server (DOM-level), since headless screenshot capture is unavailable in this
environment. Playwright E2E is a recommended follow-up for CI durability.
