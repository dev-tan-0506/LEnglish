# Research Summary: LEnglish

**Synthesized:** 2026-05-05
**Domain:** TOEIC Vocabulary Learning Web App

## Key Findings

### Stack
Full-stack TypeScript with **Next.js 15 (App Router)** + **Supabase** (PostgreSQL + Auth + Realtime) + **Tailwind CSS/shadcn/ui**. Use **FSRS** algorithm for spaced repetition (modern, ML-based, 20-30% more efficient than legacy SM-2). **Google Gemini API** for AI features. Deploy on **Vercel**.

### Table Stakes
- TOEIC-targeted vocabulary with contextual sentences and native audio
- Spaced repetition system (FSRS) for scientifically-backed retention
- Flashcards as core learning method
- User accounts with progress tracking
- Target score selection

### Differentiators
- Multiple interactive games (matching, picture-word, timed quiz)
- AI-powered sentence grading (user writes, AI evaluates)
- AI highlight-to-translate
- Full gamification suite (XP, streaks, leaderboard, achievements)
- Drops-inspired visual-first GenZ design

### Watch Out For
1. **Over-gamification** — Games must feed into SRS; track learning, not just play
2. **Poor vocab quality** — Source from established TOEIC lists; verify Vietnamese translations
3. **SRS bugs** — Use reference FSRS implementation; handle edge cases (absence, pile-up)
4. **AI unreliability** — Validate outputs; cache examples; rate limit; have fallbacks
5. **Retention drop-off** — Smooth onboarding; manageable daily dose; streak freeze

## Architecture Decision

**Modular monolith** via Next.js — 6 clear modules (Auth, Vocabulary, Learning/SRS, Games, AI, Gamification). Build order follows dependency chain: Auth → Vocab → SRS → Flashcards → Games → Gamification → AI → Dashboard.

## Build-Order Implications

| Order | Module | Why First |
|-------|--------|-----------|
| 1 | Auth + DB Setup | Foundation — everything needs users and database |
| 2 | Vocabulary Data | Core content — all learning methods need words |
| 3 | SRS Engine | Core algorithm — determines what users study when |
| 4 | Flashcard Method | Simplest method — validates SRS integration end-to-end |
| 5 | Interactive Games | Builds on vocabulary + SRS — multiple methods |
| 6 | Gamification | Layers on top — XP, streaks, leaderboard |
| 7 | AI Features | Enhancement — works independently, can be toggled |
| 8 | Dashboard | Requires data from all modules to visualize |

## Confidence Assessment

| Area | Confidence | Notes |
|------|-----------|-------|
| Stack (Next.js + Supabase) | High | Industry consensus for this type of app |
| FSRS over SM-2 | High | Clear winner; open source reference implementations |
| Gamification mechanics | High | Well-studied; Duolingo/Drops patterns proven |
| AI integration approach | Medium | LLM quality varies; need robust prompting + caching |
| Vocabulary data sourcing | Medium | Need to verify TOEIC word list quality |

---
*Research complete. Ready for requirements definition.*
