---
phase: 01-authentication-system
plan: 06
subsystem: integration
tags: [api-e2e, playwright, auth-flow, reset-password, runbook]
requires:
  - phase: 01-authentication-system
    provides: Auth, profile, and reset endpoints plus frontend auth/profile UI
provides:
  - API end-to-end auth flow coverage in one spec
  - Browser auth/profile/reset flows with Playwright
  - Local auth runbook for setup and verification
affects: [auth, profile, onboarding, reset-password, docs]
key-files:
  created:
    - apps/api/test/auth-flow.e2e-spec.ts
    - apps/api/test/auth-flow.e2e.spec.ts
    - apps/api/src/mail/mailbox-test.controller.ts
    - apps/web/tests/e2e/auth-session.spec.ts
    - apps/web/tests/e2e/profile.spec.ts
    - apps/web/tests/e2e/reset-password.spec.ts
    - apps/web/tests/e2e/helpers/auth.ts
    - apps/web/tests/e2e/helpers/mailbox.ts
    - docs/auth-local-runbook.md
  modified:
    - apps/api/src/mail/mail.module.ts
requirements-completed: [AUTH-01, AUTH-02, AUTH-03, AUTH-04]
completed: 2026-05-25
---

# Phase 01 Plan 06 Summary

Completed Wave 5 execution artifacts for integration coverage and local operability.

## Implemented

- Added API e2e full flow in `auth-flow.e2e-spec.ts`:
  - register, duplicate register, login, `/auth/me`, profile update, refresh, logout, reset request, reset confirm, old-password rejection, new-password login, and password hash verification.
- Added test-discoverable wrapper `auth-flow.e2e.spec.ts` so `pnpm --filter @lenglish/api test -- auth-flow.e2e` resolves correctly.
- Added test-only mailbox endpoint `GET /test/mailbox/latest` gated by `NODE_ENV=test` for reset-password browser flow.
- Added Playwright specs:
  - `auth-session.spec.ts` for signup -> onboarding -> profile -> refresh persistence -> logout -> re-login.
  - `profile.spec.ts` for profile editing and protected-route redirect when signed out.
  - `reset-password.spec.ts` for forgot-password -> mailbox reset link -> reset confirm -> login with new password.
- Added `docs/auth-local-runbook.md` with startup, env, SMTP, migration, and verification commands.

## Verification

- Passed: `pnpm --filter @lenglish/api test -- auth-flow.e2e`
- Passed: `pnpm --filter @lenglish/api typecheck`
- Passed: `pnpm --filter @lenglish/web typecheck`
- Not executed in this run: Playwright e2e commands (requires local API + web runtime orchestration for browser run).
