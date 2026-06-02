# Gate Reports

Every module passes three gates before it is "done". Each gate writes one report
here so the decision trail is auditable.

**Workflow:** `Plan → Implement → [KAPI 1: Review] → [KAPI 2: Test] → [KAPI 3: QA/a11y/perf] → Integrate`

## Naming
`<phase>-<module>-<gate>.md` — e.g. `p3-esc-kapi1-review.md`,
`p3-esc-kapi2-test.md`, `p3-esc-kapi3-qa.md`.

## Gate owners & pass criteria (summary — full criteria in `../PLAN.md` §5–6)
- **KAPI 1 — Review** (`code-reviewer`): TS strict clean, lint clean,
  correctness/security/consistency OK → **APPROVE**.
- **KAPI 2 — Test** (`qa-test-engineer`): unit/integration for new logic, E2E for
  critical flows, coverage ≥ 80% (≥ 90% logic-heavy), all green.
- **KAPI 3 — QA/a11y/perf** (`a11y-perf-auditor`): 0 axe critical/serious, Lighthouse
  a11y ≥ 95 & perf ≥ 90, reduced-motion + fallback verified, manual QA passes.

---

## Report template

```markdown
# <Module> — KAPI <n> (<Review|Test|QA/a11y/perf>)

- **Module / scope:** <what was evaluated, files/areas>
- **Phase:** <0–6>
- **Owner agent:** <code-reviewer | qa-test-engineer | a11y-perf-auditor>
- **Date:** <YYYY-MM-DD>
- **Verdict:** PASS ✅ | CHANGES REQUESTED ❌ | RE-AUDIT PENDING ⏳

## Checks run (commands + results)
- `tsc --noEmit` → …
- `eslint …` → …
- `vitest run --coverage` → coverage % …
- `playwright test …` → …
- axe / Lighthouse → scores …

## Findings (ordered by severity)
| # | Severity (Blocker/Should/Nit) | Location (file:line) | Issue | Suggested fix |
|---|---|---|---|---|

## Notes
<manual QA scenarios checked, reduced-motion/fallback observations, follow-ups>
```
