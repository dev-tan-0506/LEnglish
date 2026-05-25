# Project Roadmap: LEnglish

**Project:** LEnglish
**Total Phases:** 7
**Status:** In Progress
**Granularity:** Fine
**Architecture:** Next.js (Frontend) + NestJS (Backend) Separated

## Phases

### Phase 1: Authentication System
**Status:** In Progress
**Goal:** End-to-end user registration, login, and profile management across NestJS and Next.js.
**Requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04
**UI hint:** yes
**Plans:** 5/6 plans complete
**Success Criteria:**
1. User can register and log in to the application, receiving a JWT token.
2. User can view and update their profile details (name, target TOEIC score).
3. Session is maintained across browser refreshes.

Plans:
- [x] 01-01-PLAN.md - Workspace and separated app foundation. (completed 2026-05-06)
- [x] 01-02-PLAN.md - Backend registration, login, refresh, logout, and session guard. (completed 2026-05-06)
- [x] 01-03-PLAN.md - Backend profile management and password reset email flow. (completed 2026-05-14)
- [x] 01-04-PLAN.md - Frontend auth, session, and reset password UI. (completed 2026-05-14)
- [x] 01-05-PLAN.md - Frontend onboarding and profile management UI.
- [ ] 01-06-PLAN.md - API/browser e2e tests and local auth runbook.

Wave 1:
- 01-01-PLAN.md

Wave 2 (blocked on Wave 1 completion):
- 01-02-PLAN.md

Wave 3 (blocked on Wave 2 completion where listed):
- 01-03-PLAN.md
- 01-04-PLAN.md

Wave 4 (blocked on Wave 3 completion):
- 01-05-PLAN.md

Wave 5 (blocked on Wave 4 completion):
- 01-06-PLAN.md

Cross-cutting constraints:
- Auth tokens must be stored in backend-set httpOnly cookies, never localStorage.
- Access token TTL is about 15 minutes; refresh token TTL is about 7 days.
- Passwords and reset/refresh tokens must be stored only as hashes.
- UI must follow the approved Phase 1 UI-SPEC visual contract.

### Phase 2: Vocabulary Database & Browsing
**Status:** Pending
**Goal:** Build the core vocabulary database schema and the browsing interface.
**Requirements:** VOCB-01, VOCB-02, VOCB-03, VOCB-04
**UI hint:** yes
**Success Criteria:**
1. Admin (or seed script) can populate TOEIC vocabulary organized by level and topic.
2. User can browse words by level and topic in the UI.
3. User can view word details and play pronunciation audio.

### Phase 3: Core SRS Engine & Flashcards
**Status:** Pending
**Goal:** Implement the FSRS algorithm in NestJS and flashcard learning loop in Next.js.
**Requirements:** LRN-01, LRN-02
**UI hint:** yes
**Success Criteria:**
1. User sees a daily queue of words to review based on their individual learning history.
2. User can flip a flashcard and grade their memory (e.g., Again, Hard, Good, Easy).
3. SRS algorithm correctly schedules the next review date based on the grade.

### Phase 4: Gamification Framework
**Status:** Pending
**Goal:** Implement the core gamification mechanics (XP, streaks, leveling).
**Requirements:** GAME-01, GAME-02, GAME-06
**UI hint:** yes
**Success Criteria:**
1. User earns XP and levels up when completing flashcard reviews.
2. User's daily streak increments upon completing the daily queue.
3. User can activate a streak freeze.

### Phase 5: Interactive Learning Games
**Status:** Pending
**Goal:** Add varied mini-games for vocabulary practice beyond standard flashcards.
**Requirements:** LRN-03, LRN-04, LRN-05, LRN-06, LRN-07
**UI hint:** yes
**Success Criteria:**
1. User can play fill-in-the-blank, matching, and picture-word games.
2. User can play listening exercises and timed quizzes.
3. Game completions feed data back to the SRS engine and award XP.

### Phase 6: Social & Leaderboard
**Status:** Pending
**Goal:** Introduce global/friends leaderboards and achievements.
**Requirements:** GAME-03, GAME-04, GAME-05
**UI hint:** yes
**Success Criteria:**
1. User can see their XP rank on a global leaderboard.
2. User can add friends and view a friend-specific leaderboard.
3. User earns and views badges for specific milestones.

### Phase 7: AI Integrations
**Status:** Pending
**Goal:** Integrate Gemini AI for sentence generation, grading, and translation.
**Requirements:** AI-01, AI-02, AI-03
**UI hint:** yes
**Success Criteria:**
1. Word details show AI-generated contextual example sentences.
2. User can write a sentence and receive AI grades and feedback.
3. User can highlight text in the UI to see translations.

---
*Roadmap generated: 2026-05-05*
