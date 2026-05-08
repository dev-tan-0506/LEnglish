---
phase: 01-authentication-system
plan: 02
subsystem: auth
tags: [nestjs, jwt, cookies, prisma, postgres, vitest, supertest]
requires: []
provides:
  - Auth register/login/refresh/logout endpoints using backend-set httpOnly cookies.
  - Refresh token persistence with rotation and logout revocation.
  - Global JwtAuthGuard (cookie-based) with @Public / @CurrentUser and GET /auth/me.
affects: [authentication-system, api, web]
tech-stack:
  added: [@nestjs/config, @nestjs/jwt, prisma, @prisma/client, argon2, cookie-parser, zod, supertest, unplugin-swc, @swc/core]
  patterns:
    - Refresh tokens are stored as hashes and rotated on refresh.
    - Auth cookie flags centralized in a single service.
    - App-wide auth guard defaults to protected routes with explicit @Public opt-out.
key-files:
  created:
    - apps/api/prisma/schema.prisma
    - apps/api/src/auth/auth.controller.ts
    - apps/api/src/auth/auth.service.ts
    - apps/api/src/auth/jwt-auth.guard.ts
    - apps/api/test/auth.integration.spec.ts
  modified:
    - apps/api/src/app.module.ts
    - apps/api/src/main.ts
key-decisions:
  - "Use sha256 hashing for refresh token lookup (token is random high-entropy); password hashing uses argon2."
  - "Enable SWC for Vitest to preserve decorator metadata required by NestJS DI."
  - "Apply JwtAuthGuard globally and explicitly mark public endpoints via @Public()."
patterns-established:
  - "Cookie auth lifecycle: register/login set cookies, refresh rotates, logout revokes + clears."
  - "Session check endpoint: GET /auth/me for frontend bootstrap."
requirements-completed: [AUTH-01, AUTH-02]
duration: 60 min
completed: 2026-05-06
---

# Phase 1 Plan 02: Backend Auth Core Summary

**NestJS auth endpoints with httpOnly cookie sessions, refresh rotation, logout revocation, and a cookie-based JwtAuthGuard**

## Performance

- **Duration:** 60 min
- **Started:** 2026-05-06T16:45:00+07:00
- **Completed:** 2026-05-06T17:20:00+07:00
- **Tasks:** 3
- **Files modified:** 25

## Accomplishments

- Added Prisma auth schema + migration stubs for `User`, `Profile`, `RefreshToken`, and `PasswordResetToken`.
- Implemented `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, and `POST /auth/logout` using backend-set httpOnly cookies with D-03 TTLs.
- Implemented refresh token rotation (new token issued, old revoked) and logout revocation.
- Added global `JwtAuthGuard` reading the access cookie, `@Public()` opt-out, `@CurrentUser()`, and `GET /auth/me` for session bootstrap.
- Added `auth.integration` tests proving password policy, cookie setting/clearing, refresh rotation, and protected-route behavior.

## Task Commits

1. **Task 1: Add auth persistence and validation contracts** - `d8916d6`
2. **Task 2: Implement register, login, refresh, and logout cookies** - `8167c5b`
3. **Task 3: Add protected route guard and current-user plumbing** - `60e07eb`

## Decisions Made

None - followed plan intent; main adjustments are recorded under deviations below.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Prisma version mismatch fixed (generate failing)**
- **Issue:** `prisma generate` failed due to `prisma` and `@prisma/client` version mismatch.
- **Fix:** Pinned both to the same version so generation succeeds.
- **Verification:** `pnpm --filter @lenglish/api exec -- prisma generate` succeeds; tests pass.

**2. [Rule 3 - Blocking] NestJS DI failed in Vitest without decorator metadata**
- **Issue:** Vitest/esbuild does not emit decorator metadata, causing DI to inject `undefined`.
- **Fix:** Enabled SWC transpilation in `apps/api/vitest.config.ts`.
- **Verification:** `pnpm --filter @lenglish/api test -- auth.integration` passes.

**3. [Rule 2 - Missing Critical] Refresh token self-relation removed from schema**
- **Issue:** Prisma schema rejected the self-relation without a unique field for the replacement link.
- **Fix:** Kept `replacedById` as a raw reference field and enforced linkage in application logic.
- **Verification:** Prisma schema validates and client generates successfully.

---

**Total deviations:** 3 auto-fixed (3 blocking/missing-critical).  
**Impact on plan:** No scope creep; fixes were required to make the planned test + Prisma workflow viable.

## Issues Encountered

- `pnpm --filter @lenglish/api prisma migrate dev` was not run as part of this plan execution because it requires a live PostgreSQL and a real `.env` in the local environment. Run migrations when the DB is up.

## Verification

- `pnpm --filter @lenglish/api test -- auth.integration` - passed
- `pnpm test` - passed

## Next Phase Readiness

Ready for Wave 3 (`01-03-PLAN.md` and `01-04-PLAN.md`) to build profile, password reset email flow, and frontend auth UI using `/auth/me` for session checks.

---
*Phase: 01-authentication-system*
*Completed: 2026-05-06*

