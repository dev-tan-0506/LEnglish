# Phase 1: Authentication System - Research

**Researched:** 2026-05-06
**Domain:** Next.js + NestJS authentication, profile management, and session security
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Email/Password authentication only for MVP.
- **D-02:** Use httpOnly cookies for session/token storage to prevent XSS (set directly by backend).
- **D-03:** Use short-lived Access token (~15 mins) + long-lived Refresh token (~7 days).
- **D-04:** Password policy: Minimum 8 characters, must include uppercase, number, and special character.
- **D-05:** Allow immediate app access after signup; prompt for email verification later (non-blocking).
- **D-06:** Signup form collects Email, Password, and Name.
- **D-07:** Post-login onboarding is a single step: Target TOEIC score selection screen.
- **D-08:** Password reset uses standard email link flow redirecting to a new password page.
- **D-09:** Support both preset avatars (cartoon/emoji in Drops style) and custom image uploads.
- **D-10:** Profile fields: Name, Avatar, Target TOEIC Score, Bio, Birthdate, and Current English Level.
- **D-11:** Target TOEIC Score selection UI uses large visual cards with icons and short descriptions.
- **D-12:** Current English Level has 5 options: Newbie / Beginner / Intermediate / Upper-Intermediate / Advanced.
- **D-13:** Full-screen immersive layout (animated/video background with floating form).
- **D-14:** 3D Flip card animation when switching between Login and Signup forms.
- **D-15:** Input fields use pill shape (fully rounded) with soft shadows.
- **D-16:** Primary buttons use press-down (physical button) micro-interaction and hover scale.

### the agent's Discretion
- No explicit discretion section was captured. Implementation choices must follow ROADMAP.md, REQUIREMENTS.md, and the locked decisions above.

### Deferred Ideas (OUT OF SCOPE)
- None.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AUTH-01 | User can sign up with email and password | NestJS auth controller/service, DTO validation, password hashing, Prisma persistence |
| AUTH-02 | User can log in and maintain active session | NestJS JWT issuing/verification, httpOnly cookies, refresh token rotation, Next.js credentialed fetch |
| AUTH-03 | User can view and edit profile (name, avatar, target TOEIC score) | Guarded profile endpoints, Prisma profile model, Next.js profile/onboarding UI |
| AUTH-04 | User can reset password via email | Password reset token model, mailer abstraction, reset request/confirm endpoints, reset UI |
</phase_requirements>

<architectural_responsibility_map>
## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Register/login/logout/refresh | API / Backend | Database / Storage | Credentials, token signing, cookie headers, and revocation belong in the trusted API tier. |
| Password hashing and reset tokens | API / Backend | Database / Storage | Hashing, token creation, and token invalidation must not run in the browser. |
| Session persistence across refreshes | API / Backend | Frontend Server | API owns cookies and token verification; Next.js reads session state and redirects UI routes. |
| Auth and profile forms | Browser / Client | Frontend Server | React owns interaction, validation display, animation, and submit flows. |
| Profile persistence | API / Backend | Database / Storage | Profile updates are authenticated mutations stored in PostgreSQL via Prisma. |
| Avatar uploads | API / Backend | Database / Storage | Upload validation/storage path is server-owned; browser only selects files. |
</architectural_responsibility_map>

<research_summary>
## Summary

Phase 1 should implement auth as a first-class backend capability in NestJS, not as a client-only or third-party auth shortcut. The earlier project research mentioned Supabase Auth, but Phase 1 decisions explicitly require backend-set httpOnly cookies, access/refresh JWT lifetimes, and password reset email flow. Those locked decisions override the older generic stack note.

The standard implementation is NestJS modules for auth/users/profile, Prisma for PostgreSQL persistence, class-validator DTOs with a global ValidationPipe, secure password hashing with argon2 or bcrypt, and httpOnly secure cookies with CORS credentials enabled. Next.js should treat the API as the source of truth, submit forms with `credentials: "include"`, and use server/client route guards based on `/auth/me`.

**Primary recommendation:** Build a separated pnpm workspace with `apps/api` (NestJS + Prisma + JWT cookies) and `apps/web` (Next.js App Router + shadcn UI), then prove the phase with API integration tests and Playwright session persistence tests.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.x | Frontend App Router application | Official docs show current async `cookies()` behavior in Next.js 15. [CITED: nextjs.org/docs/app/api-reference/functions/cookies] |
| NestJS | 11.x | Backend API framework | Official auth docs show modular auth service/controller/guard patterns and JWT support. [CITED: docs.nestjs.com/security/authentication] |
| Prisma | 6.x | Type-safe ORM and migrations | Official NestJS recipe documents Prisma as a TypeScript ORM option for Nest apps. [CITED: docs.nestjs.com/recipes/prisma] |
| PostgreSQL | 16.x compatible | Relational persistence | User, profile, refresh token, and reset token data are relational. [ASSUMED] |
| @nestjs/jwt | 11.x-compatible | JWT signing and verification | Official NestJS auth docs use JwtService for issuing/verifying JWTs. [CITED: docs.nestjs.com/security/authentication] |
| class-validator + class-transformer | current | Request DTO validation | Official NestJS validation docs recommend ValidationPipe with these packages. [CITED: docs.nestjs.com/techniques/validation] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| argon2 | current | Password hashing | Prefer for new password storage; OWASP recommends Argon2id where available. [CITED: cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html] |
| cookie-parser | current | Read cookies in Nest/Express requests | Needed for refresh/access cookie extraction if using Express adapter. |
| nodemailer | current | SMTP email sending | Password reset email transport; tests can use a mocked transport. |
| zod | current | Frontend form schema validation | Keeps UI validation aligned with API DTO rules. [ASSUMED] |
| React Hook Form | current | Client form state | Efficient form state for auth/profile forms. [ASSUMED] |
| Playwright | current | Browser smoke tests | Required to prove refresh/session persistence from the user perspective. [ASSUMED] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Backend-owned JWT cookies | Supabase Auth | Conflicts with D-02 and D-03 for backend-set access/refresh cookies. |
| argon2 | bcrypt | Nest docs mention bcrypt, but OWASP prefers Argon2id where available; bcrypt is acceptable fallback. |
| Separate API | Next.js route handlers only | Conflicts with ROADMAP architecture: separated Next.js frontend + NestJS backend. |

**Installation:**
```bash
pnpm add -F @lenglish/api @nestjs/jwt @nestjs/config cookie-parser argon2 nodemailer
pnpm add -F @lenglish/api -D @types/cookie-parser @types/nodemailer prisma
pnpm add -F @lenglish/api @prisma/client class-validator class-transformer
pnpm add -F @lenglish/web zod react-hook-form @hookform/resolvers @tanstack/react-query lucide-react
pnpm add -D playwright vitest
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### System Architecture Diagram

```text
Browser form
  -> Next.js client component validates input and submits with credentials: include
  -> NestJS AuthController validates DTOs
  -> AuthService hashes/checks password, signs access JWT, rotates refresh token
  -> NestJS sets httpOnly cookies on response
  -> Browser stores cookies automatically
  -> Protected Next.js route calls /auth/me with credentials
  -> NestJS guard verifies access cookie or refreshes using refresh cookie
  -> Prisma reads/writes User/Profile/Token records in PostgreSQL
```

### Recommended Project Structure
```text
apps/
  api/
    prisma/schema.prisma
    src/auth/
    src/users/
    src/profile/
    src/mail/
    src/common/
    test/
  web/
    src/app/(auth)/
    src/app/(app)/onboarding/
    src/app/(app)/profile/
    src/components/auth/
    src/components/profile/
    src/lib/api/
    tests/e2e/
packages/
  shared/
    src/auth-contracts.ts
```

### Pattern 1: NestJS JWT guard with request user
**What:** Guard verifies token, rejects invalid requests, and attaches payload to request.
**When to use:** All protected API endpoints.
**Source:** Official NestJS authentication docs.

### Pattern 2: DTO validation with ValidationPipe
**What:** Use class-validator decorators on DTO classes and enable global ValidationPipe.
**When to use:** Register/login/profile/reset inputs.
**Source:** Official NestJS validation docs.

### Pattern 3: httpOnly secure cookies
**What:** Backend sets `HttpOnly`, `Secure` in production, `SameSite=Lax`, `Path=/`, and bounded maxAge for tokens.
**When to use:** Access and refresh token storage.
**Source:** MDN secure cookie guide.

### Anti-Patterns to Avoid
- **JWT in localStorage:** Contradicts D-02 and exposes tokens to XSS.
- **Plaintext or reversible password storage:** OWASP and Nest docs warn against plaintext passwords; use one-way password hashing.
- **Client-side auth enforcement only:** Browser route guards are UX only; NestJS guards must protect data.
- **Non-rotating refresh tokens:** Makes stolen refresh cookies useful for their full lifetime.
- **Reset token stored plaintext:** Store only a hash of the reset token.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Password hashing | Custom SHA/hash logic | argon2, bcrypt fallback | Adaptive password hashing is security-sensitive. |
| JWT signing/verification | Custom token crypto | @nestjs/jwt | Handles standard JWT claims and expiration checks. |
| DTO validation | Manual `if` chains in controllers | ValidationPipe + class-validator | Centralized, testable request validation. |
| ORM/query builder | Raw SQL auth persistence | Prisma | Typed schema, migrations, and generated client. |
| Browser e2e harness | Manual screenshots only | Playwright | Proves cookies/session behavior across real navigation. |

**Key insight:** Auth has security edge cases that look small but are not. Use framework primitives and explicit tests rather than custom primitives.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Cookies not sent across ports
**What goes wrong:** Login works, but `/auth/me` returns 401 from the browser.
**Why it happens:** Missing `credentials: "include"` on fetch or missing Nest CORS `credentials: true`.
**How to avoid:** Configure frontend fetch helper and Nest `enableCors({ origin, credentials: true })`.
**Warning signs:** Cookies visible in response but absent from later requests.

### Pitfall 2: Refresh endpoint never rotates tokens
**What goes wrong:** A stolen refresh token remains valid until expiry.
**Why it happens:** Refresh token rows are not hashed, revoked, and replaced.
**How to avoid:** Store refresh token hash, revoke old token on refresh/logout, issue new refresh cookie.
**Warning signs:** Multiple refresh requests with the same cookie keep succeeding.

### Pitfall 3: Profile UI drifts from API schema
**What goes wrong:** UI lets users select values the backend rejects.
**Why it happens:** Profile fields and enums are duplicated without a shared contract.
**How to avoid:** Put target TOEIC scores and English levels in shared constants or mirrored schemas.
**Warning signs:** 400 errors on valid-looking profile form submissions.

### Pitfall 4: Password reset leaks account existence
**What goes wrong:** Reset request reveals whether an email is registered.
**Why it happens:** API returns different responses for known vs unknown email.
**How to avoid:** Always return a generic accepted response while sending email only if account exists.
**Warning signs:** Tests assert different public messages for known/unknown emails.
</common_pitfalls>

<validation_architecture>
## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest for shared/frontend units, Nest testing + Supertest for API integration, Playwright for browser e2e |
| Config file | Wave 1 creates `apps/api/vitest.config.ts`, `apps/web/vitest.config.ts`, `apps/web/playwright.config.ts` |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test && pnpm e2e` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| AUTH-01 | Register creates user/profile and sets cookies | API integration | `pnpm --filter @lenglish/api test -- auth.integration` | Wave 2 |
| AUTH-02 | Login, refresh, logout, and session persistence work | API + browser e2e | `pnpm --filter @lenglish/api test -- auth.integration && pnpm --filter @lenglish/web e2e -- auth-session` | Wave 2/4 |
| AUTH-03 | Profile view/update persists name/avatar/score/bio/birthdate/level | API + UI e2e | `pnpm --filter @lenglish/api test -- profile.integration && pnpm --filter @lenglish/web e2e -- profile` | Wave 3/4 |
| AUTH-04 | Reset request emails link and reset confirmation changes password | API integration | `pnpm --filter @lenglish/api test -- password-reset.integration` | Wave 3 |

### Sampling Rate
- **Per task commit:** Run the plan-specific test command.
- **Per wave merge:** Run `pnpm test`.
- **Phase gate:** Run `pnpm test && pnpm e2e`.

### Wave 0 Gaps
- [ ] `apps/api/vitest.config.ts` and `apps/api/test/` helpers.
- [ ] `apps/web/vitest.config.ts`, `apps/web/playwright.config.ts`, and `apps/web/tests/e2e/` helpers.
- [ ] Root `pnpm test` and `pnpm e2e` scripts.
</validation_architecture>

<security_domain>
## Security Domain

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | yes | Password hashing, generic reset responses, account lookup by normalized email |
| V3 Session Management | yes | httpOnly cookies, short access JWT, refresh token rotation/revocation |
| V4 Access Control | yes | NestJS guards on profile endpoints |
| V5 Input Validation | yes | DTO validation with ValidationPipe |
| V6 Cryptography | yes | argon2/bcrypt, @nestjs/jwt, strong env secrets |

### Known Threat Patterns
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Stolen access token | Spoofing | 15-minute access cookie, httpOnly, Secure in production |
| Stolen refresh token | Spoofing | Hash refresh tokens, rotate on refresh, revoke on logout |
| Credential stuffing | Denial of Service | Add rate limiting in auth routes if available in execution environment |
| XSS token theft | Information Disclosure | No localStorage tokens; httpOnly cookies |
| CSRF on cookie auth | Tampering | SameSite=Lax, JSON APIs, future CSRF token if cross-site embedding appears |
</security_domain>

<sources>
## Sources

### Primary (HIGH confidence)
- https://docs.nestjs.com/security/authentication - NestJS modules, JWT issuing, guards, and protected routes.
- https://docs.nestjs.com/security/cors - NestJS CORS configuration via `enableCors`.
- https://docs.nestjs.com/techniques/validation - ValidationPipe and class-validator DTO patterns.
- https://docs.nestjs.com/security/encryption-and-hashing - NestJS guidance to use bcrypt/argon2 instead of custom hashing.
- https://docs.nestjs.com/recipes/prisma - Prisma with NestJS.
- https://nextjs.org/docs/app/api-reference/functions/cookies - Current Next.js cookie API behavior.
- https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/Cookies - secure cookie attributes.
- https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html - password hashing recommendations.

### Secondary (MEDIUM confidence)
- https://www.npmjs.com/package/next - package version context.
- https://www.npmjs.com/package/@nestjs/core - package version context.
- https://www.npmjs.com/package/prisma - package version context.
- https://www.npmjs.com/package/@prisma/client - package version context.

### Tertiary (LOW confidence)
- None.
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: Next.js App Router, NestJS auth, Prisma persistence.
- Ecosystem: JWT, cookies, DTO validation, password hashing, reset email, browser e2e.
- Patterns: separated frontend/backend, backend-owned auth, guarded profile APIs.
- Pitfalls: CORS/cookies, refresh rotation, reset token leakage, schema drift.

**Confidence breakdown:**
- Standard stack: HIGH - verified against official framework docs and npm package pages.
- Architecture: HIGH - follows locked project architecture and official NestJS patterns.
- Pitfalls: HIGH - derived from official security docs and common cookie/JWT failure modes.
- Code examples: MEDIUM - examples are pattern descriptions rather than copied code to keep plan concise.

**Research date:** 2026-05-06
**Valid until:** 2026-06-05
</metadata>

---

*Phase: 01-authentication-system*
*Research completed: 2026-05-06*
*Ready for planning: yes*
