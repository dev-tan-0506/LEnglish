# Auth Local Runbook (Phase 01)

## 1) Prerequisites

- Node.js 22+
- pnpm 9+
- Docker Desktop

## 2) Install Dependencies

```bash
pnpm install
```

## 3) Start Local Infrastructure

```bash
docker compose up -d
```

## 4) Environment Variables

Set variables in root `.env` from `.env.example`:

- `DATABASE_URL` points to local Postgres.
- `API_PORT=4000`
- `CORS_ORIGIN=http://localhost:3000`
- `PUBLIC_WEB_URL=http://localhost:3000`
- `NEXT_PUBLIC_API_URL=http://localhost:4000`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- `AUTH_ACCESS_COOKIE_NAME`, `AUTH_REFRESH_COOKIE_NAME`

SMTP for reset flow:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS` (or `SMTP_PASSWORD`)
- `SMTP_FROM`

Note:
- In `NODE_ENV=test`, API stores reset emails in in-memory mailbox and exposes `GET /test/mailbox/latest`.

## 5) Run Database Migration

```bash
pnpm --filter @lenglish/api db:migrate
```

## 6) Start Applications

Terminal 1:

```bash
pnpm --filter @lenglish/api dev
```

Terminal 2:

```bash
pnpm --filter @lenglish/web dev
```

## 7) Verify Auth Flows

API flow test:

```bash
pnpm --filter @lenglish/api test -- auth-flow.e2e
```

Browser flows:

```bash
pnpm --filter @lenglish/web e2e -- auth-session
pnpm --filter @lenglish/web e2e -- profile
pnpm --filter @lenglish/web e2e -- reset-password
```

Optional full checks:

```bash
pnpm test
pnpm e2e
pnpm build
```
