---
phase: 1
slug: authentication-system
status: approved
nyquist_compliant: true
wave_0_complete: false
created: 2026-05-06
---

# Phase 1 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest, Nest testing/Supertest, Playwright |
| **Config file** | Wave 1 creates `apps/api/vitest.config.ts`, `apps/web/vitest.config.ts`, `apps/web/playwright.config.ts` |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm test && pnpm e2e` |
| **Estimated runtime** | ~60 seconds after dependencies are installed |

---

## Sampling Rate

- **After every task commit:** Run the task's `<automated>` command.
- **After every plan wave:** Run `pnpm test`.
- **Before `$gsd-verify-work`:** Run `pnpm test && pnpm e2e`.
- **Max feedback latency:** 60 seconds for quick checks.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | AUTH-01..04 | T-1-01 | Workspace can run tests before feature code lands | smoke | `pnpm test` | W0 | pending |
| 1-02-01 | 02 | 2 | AUTH-01 | T-1-02 | Passwords are hashed; invalid input rejected | integration | `pnpm --filter @lenglish/api test -- auth.integration` | W2 | pending |
| 1-02-02 | 02 | 2 | AUTH-02 | T-1-03 | Access/refresh cookies are httpOnly and rotated | integration | `pnpm --filter @lenglish/api test -- auth.integration` | W2 | pending |
| 1-03-01 | 03 | 3 | AUTH-03 | T-1-04 | Profile updates require authenticated user | integration | `pnpm --filter @lenglish/api test -- profile.integration` | W3 | pending |
| 1-03-02 | 03 | 3 | AUTH-04 | T-1-05 | Reset tokens are hashed and single-use | integration | `pnpm --filter @lenglish/api test -- password-reset.integration` | W3 | pending |
| 1-04-01 | 04 | 3 | AUTH-01, AUTH-02 | T-1-06 | Browser never reads auth token values | unit/e2e | `pnpm --filter @lenglish/web test -- auth && pnpm --filter @lenglish/web e2e -- auth-session` | W3 | pending |
| 1-05-01 | 05 | 4 | AUTH-03 | T-1-07 | Profile/onboarding UI persists allowed fields only | unit/e2e | `pnpm --filter @lenglish/web test -- profile && pnpm --filter @lenglish/web e2e -- profile` | W4 | pending |
| 1-06-01 | 06 | 5 | AUTH-01..04 | T-1-08 | Full auth flow survives refresh and logout | e2e | `pnpm test && pnpm e2e` | W5 | pending |

---

## Wave 0 Requirements

- [ ] `apps/api/vitest.config.ts` and `apps/api/test/` helpers.
- [ ] `apps/web/vitest.config.ts`, `apps/web/playwright.config.ts`, and `apps/web/tests/e2e/` helpers.
- [ ] Root `pnpm test` and `pnpm e2e` scripts.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual polish of auth flip animation and Drops-inspired profile UI | AUTH-01, AUTH-03 | Automated tests can prove behavior, not design quality | Run app locally and inspect login/signup, onboarding, and profile at desktop and mobile widths. |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies.
- [x] Sampling continuity: no 3 consecutive tasks without automated verify.
- [x] Wave 0 covers all MISSING references.
- [x] No watch-mode flags.
- [x] Feedback latency target < 60s.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** approved 2026-05-06
