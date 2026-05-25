---
phase: 01-authentication-system
plan: 05
subsystem: web
tags: [nextjs, profile-ui, onboarding, avatar, forms]
requires:
  - phase: 01-authentication-system
    provides: Backend profile and avatar endpoints
provides:
  - Target TOEIC onboarding step
  - Profile editing UI for D-10 fields
  - Preset/custom avatar picker integration
affects: [onboarding, profile, auth]
tech-stack:
  added: []
  patterns:
    - Credentialed profile API client
    - Shared option constants aligned with backend enum values
key-files:
  created:
    - apps/web/src/lib/api/profile.ts
    - apps/web/src/lib/profile/options.ts
    - apps/web/src/components/profile/OnboardingScoreSelector.tsx
    - apps/web/src/components/profile/AvatarPicker.tsx
    - apps/web/src/components/profile/EnglishLevelSelector.tsx
    - apps/web/src/components/profile/ProfileForm.tsx
    - apps/web/src/components/profile/profile.test.tsx
    - apps/web/src/app/(app)/onboarding/page.tsx
    - apps/web/src/app/(app)/profile/page.tsx
key-decisions:
  - "TOEIC and English-level options are centralized in shared constants and tested against backend-expected values."
  - "Avatar updates support both preset id and multipart file upload via the same profile avatar endpoint."
requirements-completed: [AUTH-03]
duration: 45m
completed: 2026-05-25
---

# Phase 01 Plan 05: Frontend Onboarding And Profile Summary

Implemented frontend onboarding/profile flow for Phase 1 Wave 4:

- Added profile API client (`getMyProfile`, `updateMyProfile`, `uploadAvatar`) with cookie credentials.
- Added shared option constants for TOEIC targets, English levels, and preset avatars.
- Built one-step onboarding score selector at `/onboarding` with save and redirect to `/profile`.
- Built profile editing page at `/profile` covering name, avatar, target TOEIC score, bio, birthdate, and English level.
- Added profile test suite verifying credentialed API requests, backend-aligned option values, and component exports.

## Verification

- `pnpm --filter @lenglish/web test -- profile` passed (3/3 tests).
