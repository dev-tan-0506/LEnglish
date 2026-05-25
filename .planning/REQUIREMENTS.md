# Requirements: LEnglish

**Defined:** 2026-05-05
**Core Value:** Users can learn TOEIC vocabulary through engaging, gamified methods with AI assistance that makes every word stick — turning boring memorization into an addictive daily habit.

## v1 Requirements

### Authentication

- [x] **AUTH-01**: User can sign up with email and password
- [x] **AUTH-02**: User can log in and maintain active session
- [x] **AUTH-03**: User can view and edit profile (name, avatar, target TOEIC score)
- [x] **AUTH-04**: User can reset password via email

### Vocabulary Content

- [ ] **VOCB-01**: User can browse vocabulary grouped by proficiency level
- [ ] **VOCB-02**: User can browse vocabulary grouped by topic
- [ ] **VOCB-03**: User can view word details (definition, part of speech, IPA, example sentences)
- [ ] **VOCB-04**: User can listen to native pronunciation audio for words

### Learning Methods

- [ ] **LRN-01**: User can study words using flashcards (spaced repetition via FSRS)
- [ ] **LRN-02**: User can view and complete their daily review queue based on SRS algorithm
- [ ] **LRN-03**: User can play fill-in-the-blank games to practice vocabulary in context
- [ ] **LRN-04**: User can play listening exercises (hear word/sentence and type)
- [ ] **LRN-05**: User can play matching games (connect word to meaning/image)
- [ ] **LRN-06**: User can play picture-word association games
- [ ] **LRN-07**: User can play timed vocabulary quizzes for speed

### AI Features

- [ ] **AI-01**: User can view AI-generated contextual example sentences for words
- [ ] **AI-02**: User can write sentences (affirmative/negative/interrogative) with target words and receive AI grading/feedback
- [ ] **AI-03**: User can highlight text in the app to get instant AI translation

### Gamification

- [ ] **GAME-01**: User can earn XP points for completing learning activities
- [ ] **GAME-02**: User can maintain a daily learning streak and use a streak freeze
- [ ] **GAME-03**: User can view their ranking on a global leaderboard
- [ ] **GAME-04**: User can view their ranking on a friends leaderboard
- [ ] **GAME-05**: User can earn achievement badges for learning milestones
- [ ] **GAME-06**: User can level up based on accumulated XP

## v2 Requirements

### Advanced AI

- **AI-04**: User can practice conversation with an AI chatbot using learned vocabulary
- **AI-05**: App dynamically adjusts game difficulty using AI based on user performance

### Social Features

- **SOCL-01**: Real-time multiplayer vocabulary battles

## Out of Scope

| Feature | Reason |
|---------|--------|
| Grammar courses | Focus is solely on vocabulary; grammar is only touched through AI sentence practice |
| Video lessons | Storage/bandwidth costs; not aligned with the fast-paced, vocabulary-first approach |
| Mobile native app | Web-first approach is prioritized; mobile will be supported via responsive browser |
| Payment/Subscription system | Not needed for initial release; focus on building learning experience first |
| User-generated content | Quality control for TOEIC material; curated content is more reliable |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Complete |
| AUTH-02 | Phase 1 | Complete |
| AUTH-03 | Phase 1 | Complete |
| AUTH-04 | Phase 1 | Complete |
| VOCB-01 | Phase 2 | Pending |
| VOCB-02 | Phase 2 | Pending |
| VOCB-03 | Phase 2 | Pending |
| VOCB-04 | Phase 2 | Pending |
| LRN-01 | Phase 3 | Pending |
| LRN-02 | Phase 3 | Pending |
| LRN-03 | Phase 5 | Pending |
| LRN-04 | Phase 5 | Pending |
| LRN-05 | Phase 5 | Pending |
| LRN-06 | Phase 5 | Pending |
| LRN-07 | Phase 5 | Pending |
| AI-01 | Phase 7 | Pending |
| AI-02 | Phase 7 | Pending |
| AI-03 | Phase 7 | Pending |
| GAME-01 | Phase 4 | Pending |
| GAME-02 | Phase 4 | Pending |
| GAME-03 | Phase 6 | Pending |
| GAME-04 | Phase 6 | Pending |
| GAME-05 | Phase 6 | Pending |
| GAME-06 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-05*
*Last updated: 2026-05-05 after initial definition*
