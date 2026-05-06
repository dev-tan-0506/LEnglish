# LEnglish

LEnglish is a web application for Vietnamese learners preparing for TOEIC vocabulary. The product goal is to make vocabulary practice feel fast, visual, and game-like while keeping AI features as learning support rather than the core loop.

## Current Status

Phase 1 is in progress. The repository currently contains the workspace foundation:

- `apps/api` - NestJS API scaffold with a health endpoint.
- `apps/web` - Next.js App Router scaffold with Tailwind CSS.
- `docker-compose.yml` - Local PostgreSQL service for later Prisma work.
- `.planning/` - GSD planning artifacts, phase plans, and execution summaries.

No authentication feature logic has been implemented yet. The next planned work is backend registration, login, refresh, logout, and session guard.

## Tech Stack

- Package manager: pnpm workspaces
- Frontend: Next.js, React, Tailwind CSS
- Backend: NestJS
- Testing: Vitest, Playwright
- Database service: PostgreSQL via Docker Compose

## Prerequisites

- Node.js with Corepack/pnpm available
- Docker Desktop or compatible Docker runtime for PostgreSQL

## Setup

Install dependencies:

```bash
pnpm install
```

Create a local environment file when feature work needs runtime configuration:

```bash
cp .env.example .env
```

Start PostgreSQL:

```bash
pnpm db:up
```

## Development

Run both apps:

```bash
pnpm dev
```

Run API only:

```bash
pnpm dev:api
```

Run web only:

```bash
pnpm dev:web
```

Default local URLs:

- Web: `http://localhost:3000`
- API: `http://localhost:4000`
- API health: `http://localhost:4000/health`

## Verification

Run unit tests:

```bash
pnpm test
```

Run browser smoke tests:

```bash
pnpm e2e
```

Run build, typecheck, and lint:

```bash
pnpm build
pnpm typecheck
pnpm lint
```

Package-specific checks:

```bash
pnpm --filter @lenglish/api test -- health
pnpm --filter @lenglish/web test -- health
pnpm --filter @lenglish/web e2e
```

## Project Structure

```text
apps/
  api/
    src/
      app.module.ts
      health.controller.ts
      main.ts
    test/
  web/
    src/app/
      globals.css
      layout.tsx
      page.tsx
    tests/e2e/
packages/
.planning/
```

## Styling

The web app uses Tailwind CSS through `@tailwindcss/postcss` and imports Tailwind from `apps/web/src/app/globals.css`.

Global CSS should stay minimal. Prefer Tailwind utility classes in React components for layout, spacing, color, and interaction states.

## Planning Workflow

GSD phase artifacts live under `.planning/`.

Current next step:

```text
$gsd-execute-phase 1 --wave 2
```

Run that only after reviewing the current foundation changes and deciding to continue Phase 1.
