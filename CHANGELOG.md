# Changelog

All notable changes to this project are documented here. Format based on
[Keep a Changelog](https://keepachangelog.com/); this project uses semantic versioning.

## [0.1.0] — 2026-06-02

Initial release of the FPV Drone Academy learning platform.

### Added

- **Learn the hardware** — interactive Three.js / React Three Fiber drone explorer:
  click a part to highlight it and read what it does, how to choose it, how it
  connects, and common mistakes (11 parts). Synced with an accessible part list;
  lazy-loaded with a non-WebGL fallback and a 3D-quality control.
- **Learn to fly** — full Beginner → Intermediate → Advanced curriculum: 19 lessons
  (8 / 6 / 5) authored in Turkish as MDX, each with learning objectives,
  prerequisites, and an interactive mini quiz.
- **Lesson videos** — every lesson embeds a curated, oembed-verified YouTube tutorial
  (Turkish preferred, English fallback) via a lazy, accessible click-to-load player.
- **Türkiye SHGM / İHA regulations** page, web-verified against the official
  SHT-İHA source (dated, with sources and a change disclaimer).
- **Progress & badges** — persisted lesson progress, quiz scores, overall progress
  bar, and five achievement badges (first flight, per-level graduates, full pilot).
- **Design system** — Tailwind design tokens (motion, layout), accessible app shell
  with responsive navigation, skip link, and route focus management.
- **i18n** — Turkish (default) with a scaffolded English locale; type-checked keys.
- **Accessibility & performance** — `prefers-reduced-motion` support (OS + in-app
  override), code-split routes (~95 kB gzip entry), lazy 3D, axe checks in CI.

### Tooling

- Vite + React 18 + TypeScript (strict), ESLint + Prettier, Vitest + Testing Library
  (49 tests), GitHub Actions CI, and a Lighthouse CI config.

[0.1.0]: https://example.com/releases/0.1.0
