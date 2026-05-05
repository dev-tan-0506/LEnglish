# Features Research: LEnglish

**Researched:** 2026-05-05
**Domain:** TOEIC Vocabulary Learning Web App

## Table Stakes (Must Have — Users Expect These)

### Vocabulary Content
- **Targeted TOEIC word lists** — Business, office, travel contexts from actual exam
- **Contextual learning** — Words presented in TOEIC-style sentences, not isolation
- **Native pronunciation audio** — American + British English variants
- **Dual organization** — By proficiency level AND by topic
- **Word details** — Definition, part of speech, pronunciation (IPA), example sentences

### Learning Mechanics
- **Spaced Repetition System** — FSRS-based intelligent review scheduling
- **Flashcards** — Core learning method with flip animation
- **Multiple choice quizzes** — Standard vocabulary testing
- **Progress tracking** — Words learned, mastery level, study streaks
- **Daily review queue** — "What to study today" based on SRS

### User Management
- **Account system** — Signup, login, profile
- **Progress persistence** — Learning state saved across sessions
- **Target score selection** — User picks their TOEIC goal

| Feature | Complexity | Dependencies |
|---------|-----------|-------------|
| TOEIC word database | Medium | Data sourcing |
| SRS engine (FSRS) | High | Algorithm implementation |
| Flashcard system | Low | Word database |
| Auth system | Low | Supabase Auth |
| Progress dashboard | Medium | SRS data |

## Differentiators (Competitive Advantage)

### Gamification
- **XP points system** — Earn XP for every activity
- **Daily streaks** — Consecutive day tracking with streak freeze
- **Leaderboard** — Global + friends ranking
- **Achievement badges** — Milestones (100 words, 7-day streak, etc.)
- **Level progression** — Visual level-up system

### Interactive Games
- **Matching game** — Connect words with meanings (drag-and-drop)
- **Picture-word association** — Visual vocabulary building
- **Timed quiz** — Speed-based challenges with countdown
- **Fill-in-the-blank** — Complete sentences with correct word
- **Listening exercise** — Hear and identify/type the word

### AI Features
- **AI example sentences** — Generated contextual examples per word
- **AI sentence grading** — User writes sentences, AI evaluates grammar and usage
- **Highlight-to-translate** — Select any text for instant AI translation
- **Adaptive difficulty** — AI adjusts based on performance (future)

| Feature | Complexity | Dependencies |
|---------|-----------|-------------|
| Gamification (XP/streaks/leaderboard) | Medium | User system |
| Matching game | Medium | Word database |
| Picture-word game | Medium | Image assets |
| Timed quiz | Low | Word database |
| AI sentence generation | Medium | AI API |
| AI sentence grading | High | AI API, NLP |
| Highlight-to-translate | Medium | AI API |

## Anti-Features (Do NOT Build)

| Feature | Why Not |
|---------|---------|
| User-generated content | Quality control nightmare; curated content is more reliable for TOEIC prep |
| Real-time multiplayer games | High complexity for MVP; async leaderboard provides social element |
| Grammar courses | Out of scope; vocabulary focus only; grammar only via AI sentence practice |
| Video lessons | Storage/bandwidth costs; not aligned with vocabulary-first approach |
| Offline mode | Adds significant complexity; web-first approach; defer to mobile app |
| Payment system | Not needed for v1; focus on learning experience first |

---
*Features ranked by user expectation research across Drops, Duolingo, WordUp, Memrise, and TOEIC-specific apps*
