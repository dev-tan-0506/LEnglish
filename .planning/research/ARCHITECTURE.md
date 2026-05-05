# Architecture Research: LEnglish

**Researched:** 2026-05-05
**Domain:** TOEIC Vocabulary Learning Web App

## System Architecture

### Approach: Separated Frontend + Backend (Next.js + NestJS)

A **separated architecture** with Next.js handling the frontend and NestJS as a dedicated backend API. NestJS provides structured module system with dependency injection, guards, pipes, and interceptors — ideal for complex business logic like SRS algorithms and AI integration.

```
┌─────────────────────────────────────────────────┐
│              Client (Browser)                    │
│  Next.js — React Components + Games + UI        │
│  Tailwind CSS + shadcn/ui                       │
│  TanStack Query (API state) + Zustand (UI state)│
└──────────────────────┬──────────────────────────┘
                       │ REST API + WebSocket
                       │ JWT Auth Headers
┌──────────────────────▼──────────────────────────┐
│              NestJS Backend API                  │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │   Auth   │ │  Vocab   │ │   Learning       │ │
│  │  Module  │ │  Module  │ │   Module (SRS)   │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │  Games   │ │    AI    │ │  Gamification    │ │
│  │  Module  │ │  Module  │ │   Module         │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
│                                                  │
│  Passport.js + JWT Guards                        │
│  Prisma ORM                                      │
│  WebSocket Gateway (leaderboard)                 │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│              Data Layer                          │
│                                                  │
│  ┌─────────────┐  ┌───────┐  ┌───────────────┐ │
│  │ PostgreSQL  │  │ Redis │  │  AI API       │ │
│  │             │  │(Cache)│  │ (Gemini)      │ │
│  └─────────────┘  └───────┘  └───────────────┘ │
└─────────────────────────────────────────────────┘
```

## Module Boundaries

### 1. Auth Module
- User registration, login, session management
- Profile management (display name, avatar, target score)
- Powered by Supabase Auth
- **Data:** users, profiles, settings

### 2. Vocabulary Module
- TOEIC word database management
- Word details: definition, pronunciation, part of speech, audio
- Organization by level (beginner → advanced) and topic (business, travel, etc.)
- **Data:** words, topics, levels, word_audio

### 3. Learning Module (SRS Engine)
- FSRS algorithm implementation
- Daily review queue calculation
- Progress tracking per user per word
- Mastery levels per word
- **Data:** user_word_progress, review_history, study_sessions

### 4. Games Module
- Flashcard engine
- Matching game logic
- Picture-word game logic
- Timed quiz engine
- Fill-in-the-blank generator
- Listening exercise handler
- **Data:** game_sessions, game_scores

### 5. AI Module
- Example sentence generation (per word)
- Sentence grading (user writes, AI evaluates)
- Highlight-to-translate functionality
- AI response caching (avoid redundant API calls)
- **Data:** ai_cache, sentence_attempts, ai_feedback

### 6. Gamification Module
- XP point system
- Streak tracking
- Leaderboard management
- Achievement/badge system
- Level progression
- **Data:** user_xp, streaks, achievements, leaderboard

## Database Schema (Core Tables)

```
words
├── id (PK)
├── english (text)
├── vietnamese (text)
├── part_of_speech (enum)
├── pronunciation_ipa (text)
├── audio_url (text)
├── level_id (FK → levels)
└── topic_id (FK → topics)

levels
├── id (PK)
├── name (text) -- e.g., "Beginner", "Intermediate", "Advanced"
├── toeic_score_range (text) -- e.g., "0-450", "450-600"
└── order (int)

topics
├── id (PK)
├── name (text) -- e.g., "Business", "Travel", "Technology"
├── icon (text)
└── description (text)

user_word_progress
├── user_id (FK → users)
├── word_id (FK → words)
├── state (enum: new, learning, reviewing, mastered)
├── stability (float) -- FSRS
├── difficulty (float) -- FSRS
├── due_date (timestamp)
├── last_reviewed (timestamp)
└── repetitions (int)

review_history
├── id (PK)
├── user_id (FK)
├── word_id (FK)
├── timestamp (timestamp)
├── rating (int: 1-4, again/hard/good/easy)
├── response_time_ms (int)
└── method (enum: flashcard, game, fill_blank, listening)

user_gamification
├── user_id (FK → users)
├── total_xp (int)
├── current_level (int)
├── current_streak (int)
├── longest_streak (int)
├── last_active_date (date)
└── streak_freeze_count (int)
```

## Data Flow

```
User opens app
  → Auth check (Supabase)
  → Fetch daily review queue (SRS Engine → user_word_progress WHERE due_date <= now)
  → User selects learning method
  → Learning session begins
    → Each word interaction → SRS update (stability, difficulty, due_date)
    → Each correct answer → XP awarded → Gamification update
    → AI features triggered on demand (example sentences, grading)
  → Session ends → Stats updated → Leaderboard refreshed
```

## Build Order (Dependencies)

1. **Auth + Database setup** — Foundation for everything
2. **Vocabulary Module** — Core data that all learning methods depend on
3. **Learning Module (SRS)** — Core learning engine
4. **Flashcard Method** — Simplest learning method, validates SRS integration
5. **Games Module** — Builds on vocabulary + SRS
6. **Gamification Module** — Layers on top of learning activities
7. **AI Module** — Enhancement layer, works independently
8. **Dashboard + Analytics** — Requires data from all modules

---
*Architecture designed for Next.js modular monolith with clear upgrade path to microservices if needed*
