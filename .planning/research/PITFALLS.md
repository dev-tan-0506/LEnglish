# Pitfalls Research: LEnglish

**Researched:** 2026-05-05
**Domain:** TOEIC Vocabulary Learning Web App

## Critical Pitfalls

### 1. Over-Gamification — Games Without Learning
**Risk:** HIGH
**Warning signs:** Users play games but don't retain vocabulary; high engagement but low learning outcomes
**What goes wrong:** Focusing too much on game mechanics (points, animations, rewards) while the actual learning loop (spaced repetition, active recall) is weak or missing
**Prevention:**
- Every game interaction MUST feed into the SRS engine
- Track "words actually learned" not just "games played"
- Games should test recall, not recognition (harder but more effective)
**Phase to address:** Learning Module + Games Module design

### 2. Poor Vocabulary Content Quality
**Risk:** HIGH
**Warning signs:** Users learn words that never appear on TOEIC; definitions are inaccurate or confusing
**What goes wrong:** Using unverified word lists, machine-translated definitions, or vocabulary not actually relevant to TOEIC
**Prevention:**
- Source from established TOEIC word lists (600 Essential Words, official ETS materials)
- Cross-reference with actual TOEIC exam frequency data
- Vietnamese translations must be contextually accurate, not literal
- Have example sentences that reflect TOEIC business/office contexts
**Phase to address:** Vocabulary data sourcing (early phase)

### 3. SRS Implementation Errors
**Risk:** HIGH
**Warning signs:** Users review too many or too few words daily; "easy" words keep appearing; review pile-up
**What goes wrong:** Incorrect FSRS parameter tuning; not handling edge cases (long absence, first review, bulk imports)
**Prevention:**
- Use reference FSRS implementation (open source available)
- Implement "new cards per day" limit (default: 20)
- Handle re-entry after absence gracefully (don't dump 500 reviews)
- Test with simulated user histories before launch
**Phase to address:** SRS Engine implementation

### 4. AI Feature Unreliability
**Risk:** MEDIUM
**Warning signs:** AI generates wrong example sentences; AI grading is inconsistent; high API costs
**What goes wrong:** LLM hallucinations in language context; no output validation; unconstrained API usage
**Prevention:**
- Validate AI outputs before showing to users (grammar check, relevance check)
- Cache AI-generated examples (same word → reuse good examples)
- Set clear prompts with TOEIC context constraints
- Implement rate limiting per user for AI features
- Have fallback static examples for common words
**Phase to address:** AI Module implementation

### 5. User Retention Drop-Off
**Risk:** HIGH
**Warning signs:** Users sign up but stop after 3-7 days; streak system doesn't motivate
**What goes wrong:** Initial experience is overwhelming; no clear progression path; gamification feels shallow
**Prevention:**
- Smooth onboarding: target score → first 10 words → first streak
- Visual progress that feels meaningful (knowledge map, not just numbers)
- Streak freeze mechanic (forgive 1 missed day)
- Daily dose is manageable (5-10 minutes, not 30)
- Push notifications / email reminders (future)
**Phase to address:** Onboarding + Gamification design

### 6. Performance Issues in Games
**Risk:** MEDIUM
**Warning signs:** Games feel laggy; timer-based games are unfair due to latency; animations stutter
**What goes wrong:** Heavy re-renders; API calls during gameplay; unoptimized animations
**Prevention:**
- Pre-load game data before session starts
- No network calls during active gameplay (except AI features)
- Use requestAnimationFrame for smooth animations
- Test on low-end devices and slow connections
- Target sub-200ms response for all game interactions
**Phase to address:** Games Module implementation

### 7. Leaderboard Gaming / Exploits
**Risk:** LOW (for v1)
**Warning signs:** Users find ways to earn XP without actually learning; fake accounts on leaderboard
**What goes wrong:** XP system rewards quantity over quality; no anti-cheat measures
**Prevention:**
- XP formula weights accuracy over speed
- Diminishing returns for repeated reviews of same word
- Minimum response time thresholds (can't spam through)
- Consider friends-only leaderboard for v1 (smaller, more meaningful)
**Phase to address:** Gamification Module

## Common EdTech Mistakes to Avoid

| Mistake | Why It Fails | Our Approach |
|---------|-------------|--------------|
| Building everything before launch | No user feedback; months of wasted work | Ship vocabulary + flashcards first, iterate |
| Skipping mobile responsive | GenZ users switch between devices constantly | Desktop-first BUT responsive from day 1 |
| One-size-fits-all difficulty | Beginners get overwhelmed, advanced get bored | FSRS adapts per user; target score selection |
| Ignoring Vietnamese UX | UI text awkward in Vietnamese; cultural mismatch | Consider bilingual UI; natural Vietnamese translations |
| Over-engineering the AI | Complex AI features that are unreliable | Simple, well-constrained AI prompts; cache aggressively |

---
*Pitfalls sourced from edtech failure analysis, language learning app reviews, and SRS community discussions*
