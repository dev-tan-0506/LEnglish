# Stack Research: LEnglish

**Researched:** 2026-05-05
**Domain:** TOEIC Vocabulary Learning Web App

## Recommended Stack

### Frontend
| Layer | Technology | Rationale | Confidence |
|-------|-----------|-----------|------------|
| **Framework** | Next.js 15 (App Router) | Industry standard for React; SSR/SSG for SEO; client-side interactivity for games | High |
| **Language** | TypeScript | Type safety; shared types with backend | High |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid UI development; customizable components; perfect for gamified interfaces | High |
| **HTTP Client** | Axios / Fetch | API communication with NestJS backend | High |
| **State Management** | Zustand or TanStack Query | Lightweight state; TanStack Query for server state caching | High |
| **Deployment** | Vercel | Native Next.js support; edge-optimized | High |

### Backend
| Layer | Technology | Rationale | Confidence |
|-------|-----------|-----------|------------|
| **Framework** | NestJS | Structured, modular architecture; dependency injection; guards/pipes for auth; enterprise-grade | High |
| **Language** | TypeScript | End-to-end type safety with frontend | High |
| **Database** | PostgreSQL | Robust relational DB; handles structured learning data (words, progress, relationships) | High |
| **ORM** | Prisma | Mature TypeScript integration; good migration system; works great with NestJS | High |
| **Authentication** | Passport.js + JWT (via NestJS) | NestJS native auth guards; JWT for stateless API auth; extensible for OAuth | High |
| **AI Provider** | Google Gemini API | Cost-effective; strong multilingual support (Vietnamese + English); good for sentence generation | Medium |
| **SRS Algorithm** | FSRS (Free Spaced Repetition Scheduler) | Modern ML-based; 20-30% fewer reviews than SM-2 for same retention; personalized learning curves | High |
| **Caching** | Redis | In-memory cache for "due today" flashcards, leaderboard data, session/token cache | Medium |
| **Real-time** | WebSocket (NestJS Gateway) | Built-in NestJS WebSocket support for live leaderboards | Medium |
| **Deployment** | Railway / Render / VPS | Node.js hosting for NestJS; easy PostgreSQL + Redis provisioning | Medium |

## What NOT to Use

| Technology | Why Not |
|-----------|---------|
| MongoDB/NoSQL | Vocabulary data is highly relational (words ↔ topics ↔ levels ↔ user progress); PostgreSQL is better fit |
| SM-2 Algorithm | Legacy (1987); leads to "Ease Hell"; FSRS is strictly better for modern apps |
| Custom Auth | Security risk; massive development overhead; Supabase Auth handles this |
| REST API manually | Next.js Server Actions + tRPC provide better DX with full type safety |
| CSS Modules | Slower development; Tailwind + shadcn/ui provides consistent design system faster |

## Key Technical Notes

- **FSRS** models memory using 3 variables: Stability, Difficulty, Retrievability — much more accurate than SM-2's simple ease factor
- **Supabase** provides PostgreSQL + Auth + Realtime + Storage in one platform — reduces infrastructure complexity
- **Next.js App Router** enables React Server Components — better performance for vocabulary content pages
- **pgvector** extension (Supabase) available if AI-powered semantic search for vocabulary is needed later

---
*Confidence: High = industry consensus | Medium = strong recommendation with alternatives | Low = experimental*
