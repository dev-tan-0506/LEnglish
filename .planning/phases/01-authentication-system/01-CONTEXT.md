# Phase 1: Authentication System - Context

**Gathered:** 2026-05-05
**Status:** Ready for planning

<domain>
## Phase Boundary

End-to-end user registration, login, session management, and profile management across NestJS and Next.js.
</domain>

<decisions>
## Implementation Decisions

### Authentication Strategy
- **D-01:** Email/Password authentication only for MVP.
- **D-02:** Use httpOnly cookies for session/token storage to prevent XSS (set directly by backend).
- **D-03:** Use short-lived Access token (~15 mins) + long-lived Refresh token (~7 days).
- **D-04:** Password policy: Minimum 8 characters, must include uppercase, number, and special character.

### Registration & Onboarding Flow
- **D-05:** Allow immediate app access after signup; prompt for email verification later (non-blocking).
- **D-06:** Signup form collects Email, Password, and Name.
- **D-07:** Post-login onboarding is a single step: Target TOEIC score selection screen.
- **D-08:** Password reset uses standard email link flow redirecting to a new password page.

### Profile & Avatar
- **D-09:** Support both preset avatars (cartoon/emoji in Drops style) and custom image uploads.
- **D-10:** Profile fields: Name, Avatar, Target TOEIC Score, Bio, Birthdate, and Current English Level.
- **D-11:** Target TOEIC Score selection UI uses large visual cards with icons and short descriptions.
- **D-12:** Current English Level has 5 options: Newbie / Beginner / Intermediate / Upper-Intermediate / Advanced.

### Auth UI Style
- **D-13:** Full-screen immersive layout (animated/video background with floating form).
- **D-14:** 3D Flip card animation when switching between Login and Signup forms.
- **D-15:** Input fields use pill shape (fully rounded) with soft shadows.
- **D-16:** Primary buttons use press-down (physical button) micro-interaction and hover scale.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Definitions
- `.planning/ROADMAP.md` — Defines phase boundaries and success criteria.
- `.planning/PROJECT.md` — Defines core value, design constraints (Drops-style, GenZ, Gamified), and architecture.
- `.planning/REQUIREMENTS.md` — Defines specific requirements (AUTH-01 to AUTH-04).

No external specs — requirements fully captured in decisions above.
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — Greenfield project.

### Established Patterns
- Architecture is Next.js (Frontend) + NestJS (Backend) separated.
- UI Style is vibrant, Gamified, Drops-inspired, GenZ-focused.

### Integration Points
- Frontend will need to integrate with backend Auth and Profile endpoints via cookies.
</code_context>

<specifics>
## Specific Ideas

- Visuals: Use playful 3D flips, soft shadows, pill-shaped inputs, and physical button press effects to make it feel like a game.
- Layout: The auth screen should feel immersive with a full-screen animated background.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.
</deferred>

---

*Phase: 01-Authentication System*
*Context gathered: 2026-05-05*
