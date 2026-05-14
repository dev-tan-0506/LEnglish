# Phase 1: User Setup Required

**Generated:** 2026-05-14
**Phase:** 01-authentication-system
**Status:** Incomplete

Complete these items for real password reset email delivery outside automated tests.

## Environment Variables

| Status | Variable | Source | Add to |
|--------|----------|--------|--------|
| [ ] | `SMTP_HOST` | SMTP provider host | `.env` or `.env.local` |
| [ ] | `SMTP_PORT` | SMTP provider port | `.env` or `.env.local` |
| [ ] | `SMTP_USER` | SMTP provider username | `.env` or `.env.local` |
| [ ] | `SMTP_PASS` | SMTP provider password or app password | `.env` or `.env.local` |
| [ ] | `SMTP_FROM` | Verified sender email address | `.env` or `.env.local` |
| [ ] | `PUBLIC_WEB_URL` | Public web app origin, for example `https://app.example.com` | `.env` or `.env.local` |

## Account Setup

- [ ] **Prepare an SMTP provider account**
  - Skip if: You already have SMTP credentials for this app.
  - Notes: Use a provider-supported app password or API SMTP credential, not a personal mailbox password.

## Dashboard Configuration

- [ ] **Verify sender identity**
  - Location: SMTP provider dashboard
  - Set to: The same address configured in `SMTP_FROM`

## Verification

After completing setup, verify with:

```bash
pnpm --filter @lenglish/api test -- password-reset.integration
pnpm --filter @lenglish/api dev
```

Expected results:
- Password reset requests still return a generic accepted response.
- A real mailbox receives a link shaped like `${PUBLIC_WEB_URL}/reset-password?token=...`.

---

**Once all items complete:** Mark status as "Complete" at top of file.
