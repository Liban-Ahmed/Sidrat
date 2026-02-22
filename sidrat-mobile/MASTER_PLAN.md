# Sidrat — Master Plan: World-Class Islamic Learning App

> **Goal:** Make Sidrat one of the best Islamic education apps for children ages 3–14.
> **Timeline:** MVP in 6–8 weeks (solo developer), iterate post-launch.
> **Philosophy:** Production-ready from day one. Free-first. Offline-first. COPPA-compliant.

---

## Table of Contents

1. [What "Best" Means — Competitive Analysis](#1-what-best-means)
2. [Current State Audit](#2-current-state-audit)
3. [Gap Analysis](#3-gap-analysis)
4. [Architecture & Tech Stack](#4-architecture--tech-stack)
5. [Setup Guide — Everything You Need](#5-setup-guide)
6. [Phase 1: Foundation (Weeks 1–2)](#6-phase-1-foundation)
7. [Phase 2: Core Experience (Weeks 3–4)](#7-phase-2-core-experience)
8. [Phase 3: Engagement & Polish (Weeks 5–6)](#8-phase-3-engagement--polish)
9. [Phase 4: Launch Prep (Weeks 7–8)](#9-phase-4-launch-prep)
10. [Post-MVP Roadmap](#10-post-mvp-roadmap)
11. [Free Resources & Services](#11-free-resources--services)
12. [Content Strategy](#12-content-strategy)
13. [Monetization Architecture](#13-monetization-architecture)
14. [Quality Standards Checklist](#14-quality-standards)

---

## 1. What "Best" Means

### The Top Islamic Learning Apps (Competitive Landscape)

| App | Strengths | Weaknesses | Users |
|-----|-----------|------------|-------|
| **Noor Kids** | Beautiful illustrations, story-driven, Islamic values focus | Subscription-only, no Quran learning, no offline | 100K+ |
| **Quran Companion** | Gamified Quran memorization, social features | Adults-focused, complex UI for kids | 500K+ |
| **Islamic Quiz** | Broad knowledge coverage | Ugly UI, ad-heavy, no structured curriculum | 1M+ |
| **Yassarnal Quran** | Structured Quran reading progression | Outdated design, no gamification | 100K+ |
| **Pillars (by Pocketfun)** | Beautiful design, prayer/salah focus | Very limited content scope | 50K+ |
| **MyDuaa** | Daily dua collection with audio | No learning structure, just reference | 100K+ |

### What Makes a "Best-in-Class" Children's Islamic App

1. **Authentic Content** — Sahih sources, proper Arabic rendering, real Quran recitation audio
2. **Age-Adaptive** — Content difficulty, vocabulary, and UI complexity adjust per age group
3. **Engaging Pedagogy** — Spaced repetition, gamification, multi-modal learning (visual + audio + interactive)
4. **Beautiful Design** — Modern, playful but respectful, smooth animations, delightful micro-interactions
5. **Structured Curriculum** — Not random quizzes — a progressive learning path with mastery tracking
6. **Offline-First** — Works without internet (critical for global Muslim audience)
7. **Family-Centered** — Parental insights, multi-child profiles, family activities
8. **COPPA/GDPR-K Compliant** — No ads, no tracking, no PII collection for children
9. **Accessibility** — RTL Arabic support, dyslexia-friendly fonts, VoiceOver, text scaling
10. **Retention Mechanics** — Streaks, achievements, daily goals, review scheduling

### Sidrat's Unique Differentiators (What Makes Us Stand Out)

- **Full curriculum across 8 Islamic pillars** (not just Quran or just stories)
- **4-phase lesson model** (Hook → Teach → Practice → Reward) — pedagogically sound
- **Age 3–14 with real age adaptation** — one app for the whole family
- **Offline-first architecture** — works in areas with poor connectivity
- **Open/free core content** with optional premium
- **Privacy-first** — COPPA-compliant from the ground up

---

## 2. Current State Audit

### ✅ What's Working Well
- **Architecture** — Clean Expo Router + Zustand + MMKV. Well-typed. Good separation of concerns.
- **Type System** — Comprehensive discriminated unions for content types, age groups, curriculum phases.
- **Lesson Player** — Complete 4-phase state machine with scoring, narration, haptic feedback.
- **6 Practice Types** — Quiz, true/false, ordering, matching, fill-blank (+ typed but unbuilt: tap-word).
- **Onboarding Flow** — Complete 4-screen flow creating child profiles with avatars.
- **Home Screen** — Polished with staggered animations, streak display, stat cards.
- **Streak System** — Fully implemented and tested with grace period logic.
- **Spaced Repetition** — SM-2 algorithm implemented and unit-tested.
- **Theme System** — Full light/dark mode with brand colors and typography scale.
- **CI Pipeline** — GitHub Actions running lint, typecheck, and tests.
- **Database Schema** — Supabase migration with RLS policies and COPPA compliance.
- **Auth** — Apple Sign-In + anonymous auth with account linking path.

### ⚠️ Partially Implemented
- **Curriculum Content** — Only 2 of 8 categories have lessons (aqeedah: 3, wudu: 5 = **8 total lessons**).
- **Sync Service** — Push works, pull is a TODO stub.
- **Settings Screen** — UI laid out but all actions are `() => {}`.
- **Family Screen** — Hardcoded sample data, not connected to stores.
- **Progress Screen** — Stats work, achievements section is a placeholder emoji.
- **SQLite Database** — Schema created, queries built, but completely orphaned (app uses MMKV only).

### ❌ Not Implemented At All
- Achievement/badge system (types defined, no logic)
- Spaced repetition UI/store integration
- Analytics/event tracking
- Sentry error monitoring integration
- Subscription/paywall/IAP
- Quran recitation audio (only TTS)
- Arabic text rendering with proper fonts
- TapWordCard practice component
- Age-adaptive content branching
- Review queue scheduling
- App Store assets (screenshots, description, privacy policy)
- Push notifications (remote — local only)
- Accessibility (VoiceOver, Dynamic Type)
- Component/integration tests
- Content Management — no easy way to author lessons

---

## 3. Gap Analysis — Priority Matrix

### 🔴 MVP Blockers (Must have for launch)

| Gap | Impact | Effort | Notes |
|-----|--------|--------|-------|
| More curriculum content (≥20 lessons) | Critical — no app without content | High | Need at least 3-4 lessons per category for MVP |
| Settings wiring | High — broken UX | Low | Connect toggles to settingsStore |
| Achievements system | High — key retention mechanic | Medium | Trigger on lesson completion, streaks, milestones |
| Sentry integration | High — blind without crash reports | Low | SDK already installed, just needs init |
| Progress screen completion | Medium — promise of tracking | Low | Wire achievement cards, add streak calendar |
| Privacy policy & Terms | Required for App Store | Low | Template + customization |
| App Store assets | Required for submission | Medium | Screenshots, description, keywords |
| Apple Developer enrollment | Required for iOS launch | N/A | $99/year |

### 🟡 High-Value Features (Should have for competitive launch)

| Gap | Impact | Effort | Notes |
|-----|--------|--------|-------|
| Quran API integration (audio) | High — authenticity | Medium | Free API, cache audio files |
| Arabic font rendering | High — Islamic content quality | Low | Bundle Amiri/Scheherazade font |
| Family screen with real data | Medium — differentiator | Medium | Data-driven activities |
| Spaced repetition integration | High — learning effectiveness | Medium | Wire existing utility into stores/UI |
| Review queue UI | Medium — retention | Medium | "Review" tab or daily review prompt |
| Freemium content gating | Medium — monetization path | Medium | Abstract content access layer |
| TapWordCard component | Low — completeness | Low | One more practice type |

### 🟢 Polish & Growth (Nice to have)

| Gap | Impact | Effort | Notes |
|-----|--------|--------|-------|
| Analytics (PostHog/Mixpanel free tier) | Medium — data-driven decisions | Low | Events already defined |
| Accessibility (VoiceOver, Dynamic Type) | Medium — inclusivity | Medium | Gradual rollout |
| Component tests | Medium — reliability | Medium | Testing Library setup exists |
| OTA updates (EAS Update) | Medium — fast iteration | Low | Already configured |
| RTL layout mode | Medium — Arabic UI | Medium | Native RTL support |
| Remote push notifications | Low — re-engagement | Medium | Supabase Edge Functions |

---

## 4. Architecture & Tech Stack

### Current Stack (Keep — All Excellent Choices)

| Layer | Technology | Cost | Notes |
|-------|-----------|------|-------|
| **Framework** | Expo SDK 54 + React Native 0.81 | Free | New Architecture enabled ✅ |
| **Navigation** | Expo Router 6 (file-based) | Free | Clean routing with type safety |
| **State** | Zustand 5 + MMKV | Free | Fast persistence, small bundle |
| **Backend** | Supabase (Auth + DB + Storage) | Free tier | 50K MAU, 500MB DB, 1GB storage |
| **Local DB** | expo-sqlite (WAL mode) | Free | Offline-first data store |
| **Audio** | expo-speech (TTS) + expo-av | Free | TTS for narration |
| **Animations** | react-native-reanimated 4 | Free | 60fps native animations |
| **Error Tracking** | Sentry | Free tier | 5K events/month |
| **CI/CD** | GitHub Actions + EAS Build | Free tier | 30 builds/month on free |
| **OTA Updates** | EAS Update | Free tier | 1K monthly users |
| **Build** | EAS Build | Free tier | Queue-based, ~30 min |

### New Additions for MVP

| Addition | Technology | Cost | Why |
|----------|-----------|------|-----|
| **Quran Data** | AlQuran.cloud API | Free | Arabic text, translations, audio URLs |
| **Quran Audio** | quran.com CDN + local cache | Free | Ayah-level MP3 recitations |
| **Arabic Fonts** | Amiri + Scheherazade New | Free (OFL) | Proper Naskh rendering |
| **Analytics** | PostHog Cloud | Free (1M events/mo) | Privacy-friendly, self-hostable |
| **IAP** | expo-iap (RevenueCat free tier) | Free <$2.5K MRR | In-app subscriptions |
| **Icons** | Custom Islamic icon set | Free | Consistent visual language |
| **Lottie Animations** | LottieFiles free assets | Free | Celebration, loading states |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         SIDRAT APP                               │
├─────────────────────────────────────────────────────────────────┤
│  UI Layer (Expo Router)                                          │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌────────┐ ┌────────┐ ┌──────────┐│
│  │ Home │ │Learn │ │Family│ │Progress│ │Settings│ │LessonPlay││
│  └──┬───┘ └──┬───┘ └──┬───┘ └───┬────┘ └───┬────┘ └────┬─────┘│
├─────┼────────┼────────┼─────────┼──────────┼───────────┼───────┤
│  Hooks Layer                                                     │
│  ┌─────────────┐ ┌───────────┐ ┌──────────────┐ ┌────────────┐ │
│  │useLessonPlay│ │useParental│ │useQuranAudio │ │useReviewQ  │ │
│  └──────┬──────┘ └─────┬─────┘ └──────┬───────┘ └─────┬──────┘ │
├─────────┼──────────────┼──────────────┼────────────────┼────────┤
│  State Layer (Zustand + MMKV Persistence)                        │
│  ┌──────┐ ┌──────┐ ┌───────┐ ┌────────┐ ┌────────┐ ┌────────┐ │
│  │AppSt.│ │Child │ │Lesson │ │Achieve │ │Auth    │ │Settings│ │
│  └──────┘ └──────┘ └───────┘ └────────┘ └────────┘ └────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  Service Layer                                                   │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌───────┐ ┌────────┐ ┌──────────┐ │
│  │Audio │ │Sync  │ │Auth  │ │Quran  │ │Notific.│ │Analytics │ │
│  └──────┘ └──────┘ └──────┘ └───────┘ └────────┘ └──────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  Data Layer                                                      │
│  ┌──────────┐  ┌───────────┐  ┌──────────────┐  ┌────────────┐ │
│  │MMKV (hot)│  │SQLite(sync│  │Bundled JSON  │  │AlQuran API │ │
│  │state)    │  │queue/cache│  │(curriculum)  │  │(Quran data)│ │
│  └──────────┘  └───────────┘  └──────────────┘  └────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  Backend (Supabase)                                              │
│  ┌──────┐ ┌────────────┐ ┌─────────┐ ┌──────────┐              │
│  │Auth  │ │PostgreSQL  │ │Storage  │ │Edge Func.│              │
│  │(anon)│ │(RLS + sync)│ │(audio $)│ │(webhooks)│              │
│  └──────┘ └────────────┘ └─────────┘ └──────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Setup Guide — Everything You Need

### Accounts to Create (All Free)

| Service | URL | Free Tier | What For |
|---------|-----|-----------|----------|
| **Apple Developer** | developer.apple.com | $99/year (required) | App Store submission, Apple Sign-In |
| **Expo / EAS** | expo.dev | Free (30 builds/mo) | Builds, OTA updates, submissions |
| **Supabase** | supabase.com | Free (2 projects) | Auth, database, storage, edge functions |
| **Sentry** | sentry.io | Free (5K events/mo) | Crash reporting, performance monitoring |
| **PostHog** | posthog.com | Free (1M events/mo) | Product analytics (privacy-friendly) |
| **GitHub** | github.com | Free | Code hosting, CI/CD, project management |
| **RevenueCat** | revenuecat.com | Free (<$2.5K MRR) | IAP management, subscription analytics |

### Local Development Environment

```bash
# 1. Prerequisites
brew install node@22 watchman
npm install -g eas-cli@latest expo-cli@latest

# 2. Clone & Install
cd /Users/liban/Developer/Sidrat/sidrat-mobile
npm install --legacy-peer-deps

# 3. Environment Variables
cp .env.example .env
# Fill in values from Supabase dashboard (see below)

# 4. iOS Development
sudo xcode-select --install  # If not already done
cd ios && pod install && cd ..

# 5. Run
npx expo run:ios
# Or for dev client:
npx expo start --dev-client
```

### Supabase Project Setup

```bash
# 1. Create project at supabase.com
# 2. Get credentials from Settings → API:
#    - EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
#    - EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# 3. Run initial migration
# Go to SQL Editor in Supabase Dashboard
# Paste contents of supabase/migrations/001_initial_schema.sql
# Click "Run"

# 4. (Optional) Seed development data
# Paste contents of supabase/seed.sql
# Click "Run"

# 5. Enable Auth Providers:
#    - Authentication → Providers → Enable "Anonymous"
#    - Authentication → Providers → Enable "Apple" (needs Apple Dev creds)
```

### EAS Build Setup

```bash
# 1. Login to Expo
eas login

# 2. Configure project
eas build:configure

# 3. First development build (iOS)
eas build --profile development --platform ios

# 4. Install on simulator or device
# EAS will provide a QR code or download link
```

### Apple Developer Setup (When Ready)

```
1. Enroll at developer.apple.com ($99/year)
2. Create App ID: com.sidrat.app
3. Create Sign In With Apple service ID
4. Configure in EAS:
   - eas.json → production → submit → apple → appleId, ascAppId, appleTeamId
5. Create App Store Connect listing (draft)
```

### Sentry Setup

```bash
# 1. Create project at sentry.io → React Native
# 2. Get DSN: https://xxxx@sentry.io/xxxxx
# 3. Add to .env:
#    SENTRY_DSN=https://xxxx@sentry.io/xxxxx
# 4. Already wired in app.json plugins
```

### PostHog Setup (Analytics)

```bash
# 1. Sign up at posthog.com (EU or US cloud)
# 2. Get API key from Project Settings
# 3. Install SDK:
#    npx expo install posthog-react-native
# 4. Add to .env:
#    EXPO_PUBLIC_POSTHOG_KEY=phc_xxxxx
#    EXPO_PUBLIC_POSTHOG_HOST=https://eu.posthog.com
```

---

## 6. Phase 1: Foundation (Weeks 1–2)

> **Goal:** Fix all broken/stubbed features, wire services, establish production readiness.

### Week 1: Wire Everything

#### 1.1 — Settings Screen (Day 1) — 2 hours
- [ ] Connect all toggles to `settingsStore`
- [ ] Wire sound on/off toggle (reads `settingsStore.soundEnabled`)
- [ ] Wire haptics on/off toggle
- [ ] Wire narration on/off toggle + speech rate slider
- [ ] Wire theme toggle (light/dark/system)
- [ ] Wire "Add Child" → navigates to onboarding child-profile
- [ ] Wire "Switch Profile" → shows child picker from childStore
- [ ] Wire "Daily Reminder" → calls notificationService.scheduleDaily()
- [ ] Wire "Screen Time" → simple time-limit config with countdown

#### 1.2 — Sentry Integration (Day 1) — 1 hour
- [ ] Initialize Sentry in root `_layout.tsx` with DSN from env
- [ ] Wrap app in `Sentry.wrap()`
- [ ] Add `Sentry.captureException()` in ErrorBoundary
- [ ] Add navigation instrumentation for performance
- [ ] Tag sessions with child age group (no PII)

#### 1.3 — Progress Screen Completion (Day 2) — 3 hours
- [ ] Create `achievementStore.ts` with achievement definitions
- [ ] Define 15-20 achievements across categories:
  - **Learning:** First Lesson, 5 Lessons, 10 Lessons, Perfect Score, All Categories
  - **Streak:** 3-Day Streak, 7-Day Streak, 30-Day Streak
  - **Mastery:** First Review, Wudu Master, Aqeedah Scholar
  - **Social:** First Family Activity, Share With Sibling
- [ ] Trigger achievement checks in `childStore.recordLessonCompletion()`
- [ ] Render achievement cards on Progress screen with rarity badges
- [ ] Add streak calendar view (7-day grid with completion dots)
- [ ] Add "Lessons Completed by Category" pie/bar chart (simple)

#### 1.4 — Family Screen with Real Data (Day 2–3) — 4 hours
- [ ] Create `familyStore.ts` with family activities data
- [ ] Design 5 starter activities:
  - "Bedtime Dua Together" — guided dua recitation
  - "Quran Listening Circle" — play a surah and discuss
  - "Acts of Kindness Tracker" — log daily good deeds
  - "Prophet Stories Storytime" — guided storytelling prompts
  - "Ramadan Countdown" — seasonal activity
- [ ] Track completion per family, store in childStore
- [ ] Render dynamic activity cards with progress indicators
- [ ] Add "Weekly Family Tip" section with Islamic parenting advice

#### 1.5 — Arabic Font Integration (Day 3) — 1 hour
- [ ] Download Amiri font (free, OFL license) — best for Naskh Quran rendering
- [ ] Download Scheherazade New (SIL) — backup Arabic font
- [ ] Bundle via `expo-font` in app.json
- [ ] Create `ArabicText` component with proper `writingDirection: 'rtl'`
- [ ] Apply across all Arabic content in lessons

### Week 2: Data & Content Foundation

#### 1.6 — Quran Service Integration (Day 4–5) — 6 hours
- [ ] Create `src/services/quranService.ts`
  - Fetch surah list, ayah text (Arabic + English), audio URLs from AlQuran.cloud API
  - Cache responses in SQLite (use existing local DB)
  - Offline fallback to cached data
  - Audio download & cache for offline playback
- [ ] Create `src/hooks/useQuranAudio.ts`
  - Play/pause/stop ayah audio via `expo-av` (not TTS)
  - Pre-cache next ayah while current plays
  - Respect `settingsStore.soundEnabled`
- [ ] Integrate into TeachPhase for Quran-category lessons
- [ ] Add reciter selection (default: Al-Husary Muallim — best for learning)

#### 1.7 — Spaced Repetition Integration (Day 5–6) — 4 hours
- [ ] Add `reviewSchedule` map to `lessonStore`:
  ```ts
  reviewSchedule: Record<string, { nextReview: string; interval: number; ease: number }>
  ```
- [ ] After lesson completion, call `calculateNextReview()` and persist
- [ ] Create `useReviewQueue()` hook that returns lessons due for review
- [ ] Add "Review" section on Home screen showing count of due reviews
- [ ] Add "Review" mode in lesson player (shorter — skip Hook, go straight to Practice)

#### 1.8 — Content Authoring — Salah Curriculum (Day 6–7) — 8 hours
- [ ] Create `src/data/curriculum/salah.ts` — 4 lessons minimum:
  - "Why Do We Pray?" — importance of salah
  - "Getting Ready to Pray" — conditions, wudu recap
  - "The Steps of Salah" — standing, bowing, prostrating
  - "What We Say in Salah" — Al-Fatiha, tashahhud basics
- [ ] Each lesson: full Hook (story/question), Teach (with Arabic text), Practice (2-3 exercises), Reward
- [ ] Age-adaptive: different vocabulary for toddler vs preteen

#### 1.9 — Content Authoring — Quran Basics (Day 7) — 4 hours
- [ ] Create `src/data/curriculum/quran.ts` — 3 lessons minimum:
  - "The Quran — Allah's Book" — what is the Quran, how it was revealed
  - "Surah Al-Fatiha" — learn the opening, meaning, when we recite it
  - "Short Surahs" — Al-Ikhlas, Al-Falaq, An-Nas with audio
- [ ] Integrate Quran API audio for actual recitation playback

---

## 7. Phase 2: Core Experience (Weeks 3–4)

> **Goal:** Complete content for all 8 categories, build TapWordCard, polish lesson player.

### Week 3: Content & Practice

#### 2.1 — TapWordCard Component (Day 1) — 3 hours
- [ ] Build `src/components/lesson/TapWordCard.tsx`
  - Display a sentence with tappable word tokens
  - Child taps words in correct order to build sentence
  - Shake animation on wrong selection
  - Highlight completed words
  - Hint: show first/next word on hint press
- [ ] Add to PracticePhase routing switch
- [ ] Add practice blocks using `tap-word` type to existing lessons

#### 2.2 — Content: Seerah (Days 1–2) — 6 hours
- [ ] Create `src/data/curriculum/seerah.ts` — 3 lessons:
  - "Prophet Muhammad ﷺ — The Best Example"
  - "The Night Journey (Isra & Mi'raj)"
  - "Kindness of the Prophet ﷺ"

#### 2.3 — Content: Adab/Manners (Day 2–3) — 6 hours
- [ ] Create `src/data/curriculum/adab.ts` — 3 lessons:
  - "Saying Bismillah & Alhamdulillah"
  - "Being Kind to Parents"
  - "Good Manners with Friends"

#### 2.4 — Content: Du'a (Day 3–4) — 6 hours
- [ ] Create `src/data/curriculum/duaa.ts` — 3 lessons:
  - "What is Du'a?" — talking to Allah
  - "Morning & Evening Du'as"
  - "Du'a Before Eating & Sleeping"
- [ ] Include Arabic text + transliteration + audio for each du'a

#### 2.5 — Content: Islamic Stories (Day 4–5) — 6 hours
- [ ] Create `src/data/curriculum/stories.ts` — 3 lessons:
  - "Prophet Nuh and the Great Flood"
  - "Prophet Ibrahim — Friend of Allah"
  - "The People of the Elephant (Surah Al-Fil)"

### Week 4: Age Adaptation & Polish

#### 2.6 — Age-Adaptive Content System (Days 1–2) — 6 hours
- [ ] Implement content branching based on `child.ageGroup`:
  - **Toddler (3–4):** Shorter text, more images/audio, simpler vocabulary, 1-2 practice items
  - **Early (5–7):** Guided reading, basic Arabic letters, 2-3 practice items
  - **Middle (8–10):** Full text, Arabic with transliteration, 3-4 practice items
  - **Preteen (11–14):** Advanced concepts, Quran tafsir basics, 4-5 practice items
- [ ] Add `ageVariants` field to CurriculumLesson type
- [ ] Lesson player selects appropriate variant based on active child's age
- [ ] Fallback gracefully to default content if no variant exists

#### 2.7 — Lesson Player Polish (Days 2–3) — 4 hours
- [ ] Add phase transition animations (cross-fade between phases)
- [ ] Add confetti animation on lesson completion (Lottie)
- [ ] Add "thinking time" prompt before practice (3-second countdown)
- [ ] Improve score display with animated counter, star rating (1-3 stars based on %)
- [ ] Add skip button for review mode (skip Hook)

#### 2.8 — Home Screen Enhancement (Day 3) — 3 hours
- [ ] Add "Review Queue" card showing count of lessons due
- [ ] Add "Continue Learning" card for partially completed lessons
- [ ] Add "Daily Challenge" card with a random practice question
- [ ] Add Islamic greeting based on time of day (Assalamu Alaikum + contextual message)
- [ ] Add Hijri date display (calculate from Gregorian — no API needed)

#### 2.9 — Learn Screen Enhancement (Days 4–5) — 4 hours
- [ ] Add unit completion badges (checkmark overlay on completed units)
- [ ] Add mastery percentage per category (completion ring)
- [ ] Add "Locked" state for premium content (future-proof)
- [ ] Improve lesson card design with category colors, difficulty indicator
- [ ] Add search/filter by category

---

## 8. Phase 3: Engagement & Polish (Weeks 5–6)

> **Goal:** Achievements, analytics, monetization hooks, visual polish.

### Week 5: Engagement Systems

#### 3.1 — Achievement System Implementation (Days 1–2) — 6 hours
- [ ] Finalize achievement definitions (20 achievements):

  **Category: Learning**
  | ID | Name | Description | Trigger | Rarity |
  |----|------|-------------|---------|--------|
  | first_lesson | First Step | Complete your first lesson | 1 lesson completed | common |
  | five_lessons | Knowledge Seeker | Complete 5 lessons | 5 lessons completed | common |
  | ten_lessons | Rising Scholar | Complete 10 lessons | 10 lessons completed | uncommon |
  | twenty_lessons | Dedicated Learner | Complete 20 lessons | 20 lessons completed | rare |
  | perfect_score | Star Student | Get a perfect score | 100% on any lesson | uncommon |
  | all_categories | Explorer | Try all 8 categories | 1+ lesson per category | rare |

  **Category: Streaks**
  | ID | Name | Description | Trigger | Rarity |
  |----|------|-------------|---------|--------|
  | streak_3 | Consistent | 3-day streak | streakCount ≥ 3 | common |
  | streak_7 | Dedicated | 7-day streak | streakCount ≥ 7 | uncommon |
  | streak_14 | Committed | 14-day streak | streakCount ≥ 14 | rare |
  | streak_30 | Unstoppable | 30-day streak | streakCount ≥ 30 | legendary |

  **Category: Mastery**
  | ID | Name | Description | Trigger | Rarity |
  |----|------|-------------|---------|--------|
  | first_review | Reviewer | Complete first review | review count ≥ 1 | common |
  | wudu_master | Wudu Master | Complete all wudu lessons | all wudu lessons done | rare |
  | quran_reader | Quran Reader | Listen to 5 surahs | 5 surahs played | rare |

- [ ] Create `achievementStore.ts` with:
  - Achievement definitions array
  - `unlockedAchievements` set per child
  - `checkAchievements(childId)` — evaluates all triggers, returns newly unlocked
  - Persist to MMKV
- [ ] Create `AchievementToast` component — animated overlay when achievement unlocked
- [ ] Trigger achievement checks in `childStore.recordLessonCompletion()` and streak updates

#### 3.2 — Analytics Integration (Day 2) — 2 hours
- [ ] Install `posthog-react-native`
- [ ] Create `src/services/analyticsService.ts`:
  - Initialize with env key
  - `track(event, properties)` — wraps PostHog with settings check
  - COPPA compliance: no PII, only aggregate metrics (age group, lesson category, completion %)
  - Respect `settingsStore` analytics opt-out
- [ ] Track existing `ANALYTICS_EVENTS`:
  - `lesson_started`, `lesson_completed`, `streak_continued`, `onboarding_completed`
  - `achievement_unlocked`, `review_completed`, `app_opened`
  - Screen views via navigation instrumentation

#### 3.3 — Freemium Content Gating (Days 3–4) — 6 hours
- [ ] Create `src/services/entitlementService.ts`:
  - `isContentFree(lessonId): boolean`
  - `canAccessLesson(lessonId): boolean`
  - First 2 lessons per category = FREE (16 lessons total)
  - Remaining lessons = PREMIUM
  - All achievements/streaks = FREE
  - Review of free lessons = FREE
- [ ] Add `isPremium` flag to `CurriculumLesson` type
- [ ] Create `PaywallScreen` component:
  - Show when user taps locked content
  - Feature comparison (Free vs Premium)
  - Family plan messaging
  - "Try 7 days free" CTA
- [ ] **Do NOT integrate actual IAP yet** — just the gating logic and UI
  - Use a `__DEV__` override to unlock everything in development
  - RevenueCat integration deferred to post-launch (needs Apple Developer account)

### Week 6: Visual Polish & Accessibility

#### 3.4 — Animation & Micro-interaction Polish (Days 1–2) — 6 hours
- [ ] Add Lottie animations:
  - Star burst on correct answer
  - Confetti on lesson completion
  - Trophy celebration on achievement unlock
  - Crescent moon loading spinner
  - Gentle pulse on streaks
- [ ] Source free Lottie files from LottieFiles.com
- [ ] Polish navigation transitions:
  - Shared element transition for lesson card → lesson screen
  - Tab bar spring animation
- [ ] Add skeleton loading states for data-dependent screens

#### 3.5 — Accessibility Pass (Days 2–3) — 4 hours
- [ ] Add `accessibilityLabel` and `accessibilityHint` to all interactive elements
- [ ] Add `accessibilityRole` to buttons, headings, images
- [ ] Test with VoiceOver on iOS simulator
- [ ] Support Dynamic Type (use relative font sizes)
- [ ] Ensure minimum touch targets (44×44pt)
- [ ] Verify color contrast ratios (WCAG AA minimum)
- [ ] Add `reduceMotion` preference check for animations

#### 3.6 — Error States & Edge Cases (Day 3) — 3 hours
- [ ] Add empty states for:
  - No lessons completed yet
  - No achievements yet
  - No children created
  - No internet (offline mode indicator)
- [ ] Add retry logic for API failures
- [ ] Handle corrupted MMKV data gracefully (reset to defaults)
- [ ] Add "What's New" modal for post-update communication

#### 3.7 — Component Tests (Days 4–5) — 4 hours
- [ ] Test lesson player phase transitions
- [ ] Test achievement trigger logic
- [ ] Test spaced repetition integration
- [ ] Test settings store ↔ UI binding
- [ ] Test navigation guards (onboarding redirect)
- [ ] Goal: 60%+ code coverage on critical paths

---

## 9. Phase 4: Launch Prep (Weeks 7–8)

> **Goal:** App Store submission, final QA, marketing assets.

### Week 7: Build & Submit

#### 4.1 — App Store Assets (Days 1–2) — 6 hours
- [ ] **App Icon:** Finalize 1024×1024 icon (Sidrat tree + crescent motif)
- [ ] **Screenshots:** 5 screenshots per device size:
  1. Home screen with streak
  2. Lesson player (teach phase with Arabic)
  3. Practice quiz in action
  4. Progress with achievements
  5. Family activity
- [ ] **App Store Description:**
  ```
  Sidrat — Islamic Learning for the Whole Family 🌳

  Beautiful, engaging Islamic education for children ages 3–14.
  
  ✨ 8 Categories: Quran, Salah, Wudu, Aqeedah, Du'a, Seerah, Adab & Stories
  📖 Structured Curriculum with progressive difficulty
  🎮 Interactive lessons: quizzes, matching, ordering & more
  🏆 Achievements, streaks & rewards to keep kids motivated
  👨‍👩‍👧‍👦 Multi-child profiles & family activities
  🔒 COPPA-compliant — safe for children
  📱 Works offline — learn anywhere
  🌙 Beautiful dark mode
  
  Start your child's Islamic learning journey today. Bismillah!
  ```
- [ ] **Keywords:** islamic kids, quran learning, muslim children, islamic education, dua, salah, wudu, islamic stories, quran for kids
- [ ] **Privacy Policy** — Host on sidrat landing page or GitHub Pages
- [ ] **Terms of Service**

#### 4.2 — Production Build Configuration (Day 2) — 2 hours
- [ ] Update `eas.json` with real Apple Team ID and App Store Connect IDs
- [ ] Configure production environment variables in EAS secrets
- [ ] Set up Sentry release tracking with source maps
- [ ] Enable OTA updates channel for production
- [ ] Verify bundle identifier: `com.sidrat.app`
- [ ] Set minimum iOS version: 16.0 (covers 95%+ of devices)

#### 4.3 — QA & Testing (Days 3–5) — 8 hours
- [ ] Full end-to-end flow testing:
  - Fresh install → welcome → onboarding → first lesson → completion
  - Second child → profile switching
  - Streak continuation across days
  - Offline mode: airplane mode → complete lesson → reconnect → sync
  - Settings changes persist across app restarts
- [ ] Device testing:
  - iPhone SE (small screen)
  - iPhone 15 Pro
  - iPad (tablet layout)
- [ ] Test all 8 lesson categories
- [ ] Test all 6 practice types
- [ ] Test dark mode throughout
- [ ] Memory/performance profiling (React DevTools Profiler)
- [ ] Fix all Sentry-reported crashes

### Week 8: Submit & Launch

#### 4.4 — App Store Submission (Days 1–2)
- [ ] Build final production binary: `eas build --profile production --platform ios`
- [ ] Submit to App Store: `eas submit --platform ios`
- [ ] Fill App Store Connect:
  - Age rating: 4+ (no objectionable content)
  - Privacy Nutrition Labels (no data collection for children)
  - App Review notes: "This is an Islamic education app for children..."
- [ ] Submit for review (expect 1-3 day review)

#### 4.5 — Android Submission (Days 2–3)
- [ ] Build: `eas build --profile production --platform android`
- [ ] Create Google Play Developer account ($25 one-time)
- [ ] Create Play Store listing (reuse iOS assets)
- [ ] Target as "Designed for Families" (additional review)
- [ ] Submit AAB to Google Play Console

#### 4.6 — Launch Day (Day 5)
- [ ] Soft launch — don't market heavily, gather initial feedback
- [ ] Monitor Sentry for crash reports
- [ ] Monitor PostHog for usage patterns
- [ ] Set up in-app feedback mechanism (simple email link)
- [ ] Post on relevant communities (with permission):
  - r/islam, r/MuslimParenting
  - Islamic homeschool Facebook groups
  - Local masjid WhatsApp groups

---

## 10. Post-MVP Roadmap

### V1.1 — Retention (Month 2-3)
- [ ] RevenueCat IAP integration (monthly/yearly subscription)
- [ ] Remote push notifications via Supabase Edge Functions
- [ ] Weekly learning report for parents (email via Supabase Functions)
- [ ] Leaderboard between siblings (family-only, not public)
- [ ] Daily challenge system with bonus XP

### V1.2 — Content Expansion (Month 3-4)
- [ ] 50+ total lessons across all categories
- [ ] Ramadan special content module
- [ ] Hajj learning module (seasonal)
- [ ] Arabic alphabet learning track (Nooraniyah-inspired)
- [ ] Quran memorization mode (Juz Amma — surah by surah)

### V1.3 — Social & Community (Month 4-6)
- [ ] Classroom mode for Islamic schools / weekend school
- [ ] Teacher dashboard (web)
- [ ] Parent dashboard with learning analytics
- [ ] Shared family progress board
- [ ] Community challenges (global streak counter)

### V1.4 — Advanced Features (Month 6+)
- [ ] AI-powered content personalization (adjust difficulty based on performance)
- [ ] Voice recognition for Quran recitation practice
- [ ] AR prayer mat / qibla direction
- [ ] Multi-language support (Arabic, Urdu, Malay, Turkish, French)
- [ ] Widget for home screen (daily du'a / verse)

---

## 11. Free Resources & Services — Complete List

### APIs & Data Sources

| Resource | URL | What It Provides | Limitations |
|----------|-----|------------------|-------------|
| **AlQuran.cloud API** | api.alquran.cloud | Full Quran text (Arabic + 100+ translations), 14 reciters, audio URLs | Rate limited, no SLA |
| **Quran.com API v4** | api.quran.com | Higher quality audio, word-by-word, tafsir | Requires API key (free) |
| **Aladhan API** | aladhan.com/prayer-times-api | Prayer times, Hijri calendar conversion | Free, reliable |
| **Sunnah.com API** | sunnah.com | Hadith collections (Bukhari, Muslim, etc.) | Rate limited |

### Design & Assets

| Resource | URL | What It Provides | License |
|----------|-----|------------------|---------|
| **Google Fonts — Amiri** | fonts.google.com/specimen/Amiri | Beautiful Naskh Arabic typeface | OFL (free) |
| **Scheherazade New** | fonts.google.com/specimen/Scheherazade+New | Alternative Arabic font | SIL OFL |
| **LottieFiles** | lottiefiles.com | Free animated illustrations (stars, confetti, etc.) | Free tier |
| **Lucide Icons** | lucide.dev | Beautiful open-source icon set | ISC license |
| **unDraw** | undraw.co | Open-source illustrations | Free |
| **Heroicons** | heroicons.com | UI icons (Tailwind team) | MIT |

### Infrastructure (Free Tiers)

| Service | Free Tier Limits | Enough for MVP? |
|---------|------------------|-----------------|
| **Supabase** | 50K MAU, 500MB DB, 1GB storage, 2M Edge Function invocations | ✅ Yes |
| **Vercel** (landing page) | 100GB bandwidth, serverless functions | ✅ Yes |
| **EAS Build** | 30 builds/month (priority queue) | ✅ Yes |
| **EAS Update** | 1K monthly active users | ✅ For MVP |
| **Sentry** | 5K errors/month, 10K transactions | ✅ Yes |
| **PostHog** | 1M events/month | ✅ Yes |
| **RevenueCat** | Free under $2.5K MRR | ✅ Yes |
| **GitHub Actions** | 2K minutes/month | ✅ Yes |

### Content Sources (Islamic Knowledge)

| Source | What | Notes |
|--------|------|-------|
| **Seerah (IslamQA.info)** | Prophet stories, Islamic rulings | Must paraphrase, not copy |
| **Fortress of the Muslim** | Du'a collection with Arabic/transliteration | Public domain duas |
| **IslamicFinder.org** | Prayer times, Qibla, Islamic calendar | Free API |
| **QuranExplorer** | Word-by-word Quran with tajweed | Reference for content accuracy |

---

## 12. Content Strategy

### MVP Content Matrix (Minimum 25 Lessons)

| Category | # Free | # Premium | Total | Status |
|----------|--------|-----------|-------|--------|
| Aqeedah (Belief) | 2 | 1 | 3 | ✅ Done |
| Wudu (Purification) | 2 | 3 | 5 | ✅ Done |
| Salah (Prayer) | 2 | 2 | 4 | 📝 Needs authoring |
| Quran Basics | 2 | 1 | 3 | 📝 Needs authoring |
| Du'a (Supplications) | 2 | 1 | 3 | 📝 Needs authoring |
| Seerah (Prophet's Life) | 2 | 1 | 3 | 📝 Needs authoring |
| Adab (Manners) | 2 | 1 | 3 | 📝 Needs authoring |
| Islamic Stories | 2 | 1 | 3 | 📝 Needs authoring |
| **TOTAL** | **16** | **11** | **27** | |

### Content Quality Standards

Every lesson MUST have:
1. **Authentic sources** — Quran verses with surah:ayah reference, Sahih hadith only
2. **Arabic text** — rendered with Amiri font, with transliteration and translation
3. **Age-appropriate language** — reviewed for each age group
4. **2-3 practice exercises** — variety of types (never just quiz)
5. **Reward wisdom** — fun fact or bonus du'a related to topic
6. **Proofread** — Islamic content reviewed for accuracy

### Content Authoring Workflow

```
1. Choose topic + target age group(s)
2. Research: Quran verses, hadith, scholarly sources
3. Write Hook (engaging question or story opener)
4. Write Teach blocks (3-5 teaching segments with key terms)
5. Create Practice blocks (2-3 varied types)
6. Add Reward config (fun fact, du'a, XP/star values)
7. Review for Islamic accuracy
8. Add Arabic text + transliteration
9. Add to curriculum index
10. Test in lesson player (all phases)
```

---

## 13. Monetization Architecture

### Freemium Model

```
┌─────────────────────────────────────────────────┐
│                    FREE TIER                      │
│                                                   │
│  ✅ First 2 lessons per category (16 lessons)    │
│  ✅ All practice types                            │
│  ✅ Streaks & daily goals                         │
│  ✅ Basic achievements                            │
│  ✅ 1 child profile                               │
│  ✅ Offline mode                                  │
│  ✅ TTS narration                                 │
│  ✅ Review of free lessons                        │
│  ✅ Dark mode                                     │
│                                                   │
├─────────────────────────────────────────────────┤
│              PREMIUM — "Sidrat Plus"              │
│            $4.99/mo or $29.99/year                │
│                                                   │
│  ✨ All 27+ lessons (growing monthly)            │
│  ✨ Up to 4 child profiles                       │
│  ✨ All achievements & rare badges               │
│  ✨ Family activities                             │
│  ✨ Weekly learning reports                       │
│  ✨ Premium Quran reciter audio                   │
│  ✨ Priority new content                          │
│  ✨ No content limitations                        │
│                                                   │
│            7-day free trial included               │
└─────────────────────────────────────────────────┘
```

### Implementation Order

1. **Phase 1 (MVP):** Build content gating logic + paywall UI, no actual payment
2. **Phase 2 (Post-launch):** Integrate RevenueCat + Apple IAP
3. **Phase 3:** Add Google Play billing
4. **Phase 4:** Subscription management, family sharing

---

## 14. Quality Standards Checklist

### Before Every Release ✅

- [ ] `npm run typecheck` — zero errors
- [ ] `npm run lint` — zero warnings
- [ ] `npm run test` — all tests pass
- [ ] Test on iPhone SE (smallest supported screen)
- [ ] Test on iPad (tablet layout not broken)
- [ ] Test dark mode on all screens
- [ ] Test offline mode (airplane mode flow)
- [ ] Test fresh install flow (welcome → first lesson)
- [ ] No console.log/warn in production build
- [ ] Sentry initialized and reporting
- [ ] All Arabic text renders correctly with proper font
- [ ] All audio plays correctly (TTS + Quran recitation)
- [ ] Pull-to-refresh works on Home screen
- [ ] Navigation back buttons work everywhere
- [ ] Keyboard dismisses properly on all input screens
- [ ] No layout jumps or flickers on navigation
- [ ] Memory usage stable (no leaks during lesson play)

### Production Readiness Criteria

- [ ] Error boundary catches and reports crashes
- [ ] Network failures handled gracefully with user-facing messages
- [ ] All sensitive data in Secure Store (not MMKV)
- [ ] Auth tokens auto-refresh
- [ ] App handles backgrounding/foregrounding correctly
- [ ] Streak logic handles timezone edge cases
- [ ] Content loads within 500ms of screen mount
- [ ] Animations run at 60fps (check with Perf Monitor)
- [ ] Bundle size < 30MB (excluding audio assets)
- [ ] Cold start < 2 seconds

---

## Appendix: File Structure After Implementation

```
sidrat-mobile/
├── src/
│   ├── components/
│   │   ├── lesson/
│   │   │   ├── TapWordCard.tsx          ← NEW
│   │   │   └── ... (existing 9)
│   │   ├── common/
│   │   │   ├── AchievementToast.tsx     ← NEW
│   │   │   ├── ArabicText.tsx           ← NEW
│   │   │   ├── EmptyState.tsx           ← NEW
│   │   │   ├── PaywallModal.tsx         ← NEW
│   │   │   └── ... (existing)
│   │   └── home/
│   │       ├── ReviewQueueCard.tsx      ← NEW
│   │       ├── DailyChallenge.tsx       ← NEW
│   │       └── ... (existing)
│   ├── services/
│   │   ├── quranService.ts             ← NEW
│   │   ├── analyticsService.ts         ← NEW
│   │   ├── entitlementService.ts       ← NEW
│   │   └── ... (existing)
│   ├── stores/
│   │   ├── achievementStore.ts         ← NEW
│   │   ├── familyStore.ts             ← NEW
│   │   └── ... (existing)
│   ├── hooks/
│   │   ├── useQuranAudio.ts           ← NEW
│   │   ├── useReviewQueue.ts          ← NEW
│   │   └── ... (existing)
│   ├── data/
│   │   └── curriculum/
│   │       ├── salah.ts               ← NEW
│   │       ├── quran.ts               ← NEW
│   │       ├── seerah.ts             ← NEW
│   │       ├── adab.ts               ← NEW
│   │       ├── duaa.ts               ← NEW
│   │       ├── stories.ts            ← NEW
│   │       └── ... (existing: aqeedah, wudu, index)
│   └── utils/
│       └── hijriDate.ts              ← NEW
├── assets/
│   ├── fonts/
│   │   ├── Amiri-Regular.ttf         ← NEW
│   │   ├── Amiri-Bold.ttf            ← NEW
│   │   └── Scheherazade-Regular.ttf  ← NEW
│   └── animations/
│       ├── confetti.json             ← NEW (Lottie)
│       ├── star-burst.json           ← NEW (Lottie)
│       └── trophy.json              ← NEW (Lottie)
└── docs/
    ├── PRIVACY_POLICY.md             ← NEW
    └── TERMS_OF_SERVICE.md           ← NEW
```

---

## Summary: What You Need to Do Right Now

### Immediate Setup (Today)
1. **Create Supabase account** → supabase.com → New project "sidrat-prod"
2. **Run the initial migration SQL** in Supabase SQL Editor
3. **Fill `.env`** with Supabase URL + Anon Key
4. **Create Sentry account** → sentry.io → New React Native project
5. **Create PostHog account** → posthog.com → Get API key

### This Week
6. **Enroll in Apple Developer Program** ($99/year) — takes 24-48h to process
7. **Create EAS account** → `eas login` → `eas build:configure`
8. Start Phase 1 implementation (settings wiring, Sentry, progress screen)

### Content Work (Can Happen in Parallel)
9. Start authoring Salah curriculum (highest demand topic)
10. Start authoring Quran basics curriculum

---

*Bismillah — let's build something beautiful. 🌳*
