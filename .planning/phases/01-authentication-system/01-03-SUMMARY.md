---
phase: 01-authentication-system
plan: 03
subsystem: api
tags: [nestjs, prisma, profile, password-reset, smtp, auth]
requires:
  - phase: 01-authentication-system
    provides: Backend auth cookies, CurrentUser decorator, JwtAuthGuard, UsersService, AuthRepository
provides:
  - Guarded profile view/update API
  - Preset and custom avatar backend support
  - Password reset request/confirm flow with hashed single-use tokens
  - MailService abstraction and SMTP setup documentation
affects: [auth, profile, password-reset, onboarding, frontend-auth]
tech-stack:
  added: []
  patterns:
    - Nest controllers delegate to services
    - Prisma access isolated in repository providers
    - Module messages/types split into dedicated files
key-files:
  created:
    - apps/api/src/profile/profile.controller.ts
    - apps/api/src/profile/profile.service.ts
    - apps/api/src/profile/profile.repository.ts
    - apps/api/src/profile/avatar.service.ts
    - apps/api/src/password-reset/password-reset.controller.ts
    - apps/api/src/password-reset/password-reset.service.ts
    - apps/api/src/password-reset/password-reset.repository.ts
    - apps/api/src/mail/mail.service.ts
    - apps/api/test/profile.integration.spec.ts
    - apps/api/test/password-reset.integration.spec.ts
    - apps/api/prisma/migrations/000002_profile_fields/migration.sql
    - .planning/phases/01-authentication-system/01-USER-SETUP.md
  modified:
    - apps/api/prisma/schema.prisma
    - apps/api/src/app.module.ts
    - apps/api/src/auth/auth.repository.ts
    - apps/api/src/auth/auth.module.ts
    - apps/api/src/users/users.service.ts
    - apps/api/src/users/users.repository.ts
    - apps/api/src/common/config/env.schema.ts
key-decisions:
  - "Password reset tokens use random opaque values and sha256 lookup hashes, matching the existing refresh-token storage pattern."
  - "Avatar storage is kept behind AvatarService with local uploads for development, so future cloud storage does not affect controllers."
  - "Password reset request responses are identical for known and unknown emails to avoid account enumeration."
patterns-established:
  - "Repository-backed feature modules for profile and password reset persistence."
  - "MailService records messages in test mode and owns provider-specific details."
requirements-completed: [AUTH-03, AUTH-04]
duration: 1h 8m
completed: 2026-05-14
---

# Phase 01 Plan 03: Backend Profile And Password Reset Summary

**Guarded profile management, avatar persistence, and hashed single-use password reset tokens for the NestJS API**

## Performance

- **Duration:** 1h 8m
- **Started:** 2026-05-14T00:08:00Z
- **Completed:** 2026-05-14T01:16:22Z
- **Tasks:** 3 completed
- **Files modified:** 32

## Accomplishments

- Added `GET /profile/me`, `PATCH /profile/me`, and `POST /profile/avatar` behind the existing JWT cookie guard.
- Extended `Profile` persistence for avatar, target score, bio, birthdate, and English level fields.
- Added password reset request/confirm endpoints with generic request responses, hashed tokens, expiry, single-use consumption, password replacement, and refresh-token revocation.
- Added integration tests covering profile scoping, profile validation, avatar preset/upload validation, reset request parity, token hashing/expiry/reuse, and login with the new password.

## Task Commits

1. **Tasks 1-3: Backend profile, avatar, and password reset flow** - `463b3e2` (feat)
2. **SMTP setup alias alignment** - `b2859ab` (fix)
3. **Profile fields database migration** - `9b5a0a6` (fix)

## Files Created/Modified

- `apps/api/src/profile/profile.controller.ts` - Profile and avatar HTTP endpoints.
- `apps/api/src/profile/profile.service.ts` - Authenticated profile update and response shaping.
- `apps/api/src/profile/profile.repository.ts` - Prisma profile persistence access.
- `apps/api/src/profile/avatar.service.ts` - Preset allowlist and local avatar upload validation/storage.
- `apps/api/src/password-reset/password-reset.controller.ts` - Public reset request/confirm endpoints.
- `apps/api/src/password-reset/password-reset.service.ts` - Token generation, hashing, email link creation, password update, and session revocation.
- `apps/api/src/password-reset/password-reset.repository.ts` - Prisma reset-token persistence access.
- `apps/api/src/mail/mail.service.ts` - Test-friendly mail abstraction for reset links.
- `apps/api/prisma/schema.prisma` - Profile model extended for D-10/D-12 fields.
- `apps/api/prisma/migrations/000002_profile_fields/migration.sql` - Database migration for profile fields.
- `apps/api/test/profile.integration.spec.ts` - Profile and avatar integration coverage.
- `apps/api/test/password-reset.integration.spec.ts` - Password reset integration coverage.

## Decisions Made

- Used profile-scoped repository methods keyed by `CurrentUser.id`; profile endpoints never accept a user id from request bodies.
- Stored custom avatars under `uploads/avatars` for development and persisted only generated URL references.
- Kept email sending as a MailService abstraction without adding a new provider dependency in this wave.

## Deviations from Plan

None - plan executed as written, with one compatibility fix to accept the plan's `SMTP_PASS` setup variable alongside the existing `SMTP_PASSWORD` name.

**Total deviations:** 0 auto-fixed.
**Impact on plan:** No scope change.

## Issues Encountered

- The local `gsd-sdk query` command expected by the workflow was unavailable; execution proceeded inline using the plan files directly.
- Type/test commands needed the escalated PowerShell pnpm environment because sandbox PATH did not consistently expose Node.

## User Setup Required

External SMTP configuration is required for real password reset delivery. See `.planning/phases/01-authentication-system/01-USER-SETUP.md`.

## Next Phase Readiness

Backend auth reset and profile APIs are ready for frontend onboarding/profile screens in Plan 05.

---
*Phase: 01-authentication-system*
*Completed: 2026-05-14*
