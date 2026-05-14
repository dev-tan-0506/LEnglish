---
phase: 01-authentication-system
plan: 04
subsystem: web
tags: [nextjs, react, auth-ui, middleware, password-reset]
requires:
  - phase: 01-authentication-system
    provides: Backend auth endpoints, password reset endpoints, httpOnly cookie session contract
provides:
  - Credentialed frontend auth API client
  - Login/signup/forgot/reset auth UI
  - Protected-route middleware using backend session checks
  - Component and client tests for auth behavior
affects: [auth, onboarding, profile, e2e]
tech-stack:
  added: []
  patterns:
    - API client always uses credentials include
    - Session helper checks `/auth/me` without reading token values
    - Auth forms keep validation and routing helpers testable
key-files:
  created:
    - apps/web/src/lib/api/client.ts
    - apps/web/src/lib/api/auth.ts
    - apps/web/src/lib/auth/session.ts
    - apps/web/src/middleware.ts
    - apps/web/src/components/auth/AuthCard.tsx
    - apps/web/src/components/auth/LoginForm.tsx
    - apps/web/src/components/auth/SignupForm.tsx
    - apps/web/src/components/auth/ForgotPasswordForm.tsx
    - apps/web/src/components/auth/ResetPasswordForm.tsx
    - apps/web/src/components/auth/auth.test.tsx
  modified:
    - apps/web/src/app/globals.css
key-decisions:
  - "Middleware treats backend `/auth/me` as the session source of truth and does not parse JWT cookies."
  - "Auth routing sends incomplete profiles to `/onboarding` and complete profiles to `/profile`."
  - "The reset form keeps the token only long enough to submit the backend confirm request."
patterns-established:
  - "Typed auth API functions wrap the shared credentialed fetch client."
  - "Auth UI components are client components with pure helper functions for testable policy checks."
requirements-completed: [AUTH-01, AUTH-02, AUTH-04]
duration: 1h 8m
completed: 2026-05-14
---

# Phase 01 Plan 04: Frontend Auth Experience Summary

**Next.js auth screens with credentialed backend calls, reset-password UI, and cookie-safe route middleware**

## Performance

- **Duration:** 1h 8m
- **Started:** 2026-05-14T00:08:00Z
- **Completed:** 2026-05-14T01:16:22Z
- **Tasks:** 3 completed
- **Files modified:** 17

## Accomplishments

- Added a typed API client that includes cookies for register, login, logout, me, reset request, and reset confirm calls.
- Built the login/signup glass auth card with flip-state interaction and shared button/input primitives.
- Added forgot-password and reset-password screens wired to the backend reset endpoints.
- Added middleware for protected app routes that calls `/auth/me` instead of reading token values.
- Added frontend tests proving credential inclusion, password policy behavior, auth routing, and component exports.

## Task Commits

1. **Tasks 1-3: Frontend auth API, auth UI, reset UI, and middleware** - `3ff50af` (feat)

## Files Created/Modified

- `apps/web/src/lib/api/client.ts` - Shared credentialed JSON fetch wrapper.
- `apps/web/src/lib/api/auth.ts` - Typed auth and password-reset API functions.
- `apps/web/src/lib/auth/session.ts` - Backend session helper and post-auth destination helper.
- `apps/web/src/middleware.ts` - Protected route redirect middleware.
- `apps/web/src/components/auth/AuthCard.tsx` - Login/signup/forgot auth card shell.
- `apps/web/src/components/auth/LoginForm.tsx` - Login form and route handling.
- `apps/web/src/components/auth/SignupForm.tsx` - Signup form and password policy checks.
- `apps/web/src/components/auth/ForgotPasswordForm.tsx` - Generic reset request form.
- `apps/web/src/components/auth/ResetPasswordForm.tsx` - Token confirm form.
- `apps/web/src/app/(auth)/login/page.tsx` - Auth entry route.
- `apps/web/src/app/(auth)/reset-password/page.tsx` - Reset password route.

## Decisions Made

- Used a credentialed fetch wrapper rather than per-function fetch options, making cookie inclusion harder to miss.
- Kept middleware as UX protection only; backend guards remain authoritative.
- Used the existing Tailwind setup and local React components instead of adding a UI library.

## Deviations from Plan

None - plan executed exactly as written.

**Total deviations:** 0 auto-fixed.
**Impact on plan:** No scope change.

## Issues Encountered

- The web Vitest command needed the package-local shim because root PATH did not expose pnpm/node consistently inside the sandbox.

## User Setup Required

None for the frontend itself. Password reset email delivery depends on the SMTP setup from Plan 03.

## Next Phase Readiness

The browser can now register, log in, request password reset, and confirm reset; Plan 05 can build onboarding/profile screens on top of the route and session helpers.

---
*Phase: 01-authentication-system*
*Completed: 2026-05-14*
