# Stack Research: LEnglish

**Researched:** 2026-05-05
**Domain:** TOEIC Vocabulary Learning Web App

## Recommended Stack

| Layer | Technology | Rationale | Confidence |
|-------|-----------|-----------|------------|
| **Framework** | Next.js 15 (App Router) | Industry standard for React; SSR/SSG for SEO; Server Actions for backend logic; edge-optimized | High |
| **Language** | TypeScript | Type safety across full stack; essential for maintainability in complex apps | High |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid UI development; customizable components; perfect for gamified interfaces | High |
| **Database** | PostgreSQL (via Supabase) | Robust relational DB; handles structured learning data well; Supabase provides auth + realtime | High |
| **ORM** | Prisma | Mature, excellent TypeScript integration; good migration system; large ecosystem | High |
| **Authentication** | Supabase Auth | Built-in with Supabase; handles social logins, sessions, security; no need to build custom | High |
| **AI Provider** | Google Gemini API | Cost-effective; strong multilingual support (Vietnamese + English); good for sentence generation | Medium |
| **SRS Algorithm** | FSRS (Free Spaced Repetition Scheduler) | Modern ML-based; 20-30% fewer reviews than SM-2 for same retention; personalized learning curves | High |
| **Caching** | Redis (via Upstash) | Serverless Redis for "due today" flashcards, leaderboard data, session cache | Medium |
| **Deployment** | Vercel | Native Next.js support; edge functions; zero-config deployments | High |
| **Real-time** | Supabase Realtime | Built-in with Supabase; WebSocket support for live leaderboards | Medium |

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
