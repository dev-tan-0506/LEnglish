# LEnglish

## What This Is

LEnglish is a web application for learning English vocabulary, specifically targeting TOEIC preparation. It offers multiple interactive learning methods — flashcards, mini-games, fill-in-the-blank exercises, and listening practice — combined with AI-powered features to help Vietnamese learners build vocabulary effectively and enjoyably. The platform is designed with a vibrant, GenZ-friendly aesthetic inspired by apps like Drops, making learning feel like play rather than study.

## Core Value

Users can learn TOEIC vocabulary through engaging, gamified methods with AI assistance that makes every word stick — turning boring memorization into an addictive daily habit.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet — ship to validate)

### Active

<!-- Current scope. Building toward these. -->

- [ ] User authentication (signup, login, session management)
- [ ] TOEIC vocabulary database organized by level and by topic
- [ ] Target score selection (users choose their TOEIC goal: 450, 600, 750, 900+)
- [ ] Flashcard learning method with spaced repetition
- [ ] Fill-in-the-blank exercises
- [ ] Listening exercises (hear word/sentence, identify or type)
- [ ] Matching game (connect words with meanings)
- [ ] Picture-word game (visual association)
- [ ] Timed quiz game (speed-based vocabulary challenge)
- [ ] AI-generated example sentences for each vocabulary word
- [ ] AI sentence practice — user writes affirmative, negative, interrogative sentences; AI grades, corrects, and provides feedback
- [ ] AI highlight-to-translate — select text anywhere to get instant translation
- [ ] Gamification: daily streaks, XP points, experience levels
- [ ] Leaderboard among friends/all users
- [ ] User progress tracking and vocabulary mastery dashboard
- [ ] Desktop-first responsive design (mobile browser compatible)
- [ ] GenZ-friendly, vibrant, engaging UI (inspired by Drops app aesthetic)

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- AI chatbot for conversation practice — separate feature for future milestone, not vocabulary-focused
- Mobile native app — web-first approach, mobile via responsive browser
- Grammar courses — focus is vocabulary; grammar is only touched through AI sentence practice
- Payment/subscription system — not needed for initial release
- Content creation by users — vocabulary content is curated, not user-generated

## Context

- **Target audience:** Vietnamese learners preparing for TOEIC, primarily young adults (GenZ demographic)
- **Learning approach:** Multiple vocabulary methods that users can mix-and-match or choose individually
- **AI integration:** AI enhances learning through example generation, sentence grading, and contextual translation — not as a standalone chatbot
- **Design reference:** Drops app (visual-first, arcade-style mini-games, minimalist aesthetic), Duolingo (gamification mechanics), WordUp (progress visualization)
- **Vocabulary source:** TOEIC word lists organized dual-axis — by proficiency level (beginner to advanced) and by topic (Business, Travel, Technology, Finance, etc.)
- **Platform:** Desktop-first web application with responsive design for mobile browsers

## Constraints

- **Tech stack**: To be determined during research phase — web application (likely Next.js or similar modern framework)
- **AI provider**: Requires AI API integration (e.g., Google Gemini, OpenAI) for sentence generation, grading, and translation features
- **Vocabulary data**: Need to research and compile comprehensive TOEIC vocabulary sets before content features can work
- **Performance**: Vocabulary exercises and games must feel instant — sub-200ms response for non-AI interactions
- **Accessibility**: Must work on modern browsers (Chrome, Firefox, Safari, Edge)

## Execution Policy (Manual Review)

For phase execution, the developer will review and approve changes **after each task** before any commit and before moving to the next task.

Practical rules:
- Prefer running execution in interactive mode: `$gsd-execute-phase <phase> --wave <N> --interactive`
- After completing a task: stop for manual review (`git diff`, run the task's verification command)
- Apply any local edits requested by the developer
- Commit only after the developer explicitly approves
- Then continue to the next task in the wave

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vocabulary-first approach | Core skill for TOEIC; builds foundation before grammar/reading/listening comprehension | — Pending |
| Multiple learning methods as options | Different learners prefer different methods; flexibility increases engagement and retention | — Pending |
| Desktop-first, responsive mobile | Primary use case is focused study sessions at desk; mobile is supplementary | — Pending |
| Drops-inspired UI aesthetic | Visual-first, arcade-style design proven to engage GenZ demographic | — Pending |
| Dual-axis vocabulary organization (level + topic) | Users can approach from either angle depending on their learning style and needs | — Pending |
| AI for enhancement, not core teaching | AI adds value through examples and feedback but core learning loop works without it | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-05 after initialization*
