# Sidrat Mobile

Islamic education app for children, built with Expo and React Native.

## Architecture

```bash
app/                  Expo Router file-based navigation
  (tabs)/             Tab screens: home, learn, family, progress, settings
  lesson/[id].tsx     Dynamic lesson player (4-phase flow)
  onboarding/         First-launch onboarding flow
  review/             Spaced repetition review sessions
src/
  components/         UI components (common, home, lesson, progress, etc.)
  constants/          App config, environment variables
  data/curriculum/    Bundled lesson content (aqeedah, wudu, salah, quran)
  hooks/              Custom hooks (useLessonPlayer, useReviewQueue, etc.)
  services/           Backend integration
    auth.ts           Supabase Auth (Apple Sign-In, anonymous)
    syncService.ts    Bidirectional sync (SQLite ↔ Supabase)
    localDatabase.ts  SQLite offline database
    analyticsService.ts  PostHog analytics (opt-out supported)
    quranService.ts   Quran API and audio playback
  stores/             Zustand state (auth, app, child, lesson, settings)
  theme/              Design tokens, colors, typography
  types/              TypeScript interfaces
  utils/              Helpers (spaced repetition, haptics, UUID)
supabase/migrations/  SQL schema with RLS policies
```

### Lesson Flow

Each lesson follows a 4-phase structure: **Hook** (engagement question) → **Teach** (content delivery) → **Practice** (interactive exercises) → **Reward** (celebration + XP).

### Data Flow

- **MMKV** (Zustand persist): primary read/write for UI state and progress
- **SQLite**: offline sync queue, staged for Supabase push
- **Supabase**: remote persistence with RLS (Row Level Security)
- On mutation, MMKV updates immediately; a sync bridge queues the change to SQLite for eventual cloud push

### Authentication

- **Anonymous auth**: instant start, no account needed
- **Apple Sign-In**: upgrade anonymous session without data loss
- **Session rehydration**: auto-refreshes JWT on app launch via `onAuthStateChange`

## Setup

### Prerequisites

- Node.js 20+
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode 16+ with Command Line Tools
- Android: Android Studio with SDK 34+

### Installation

```bash
cd sidrat-mobile
npm install
```

### Environment

Copy the example env and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:

- `EXPO_PUBLIC_SUPABASE_URL` — Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/public key
- `EXPO_PUBLIC_SENTRY_DSN` — Sentry error tracking DSN
- `EXPO_PUBLIC_POSTHOG_KEY` — PostHog analytics key

### Supabase

Run the initial schema migration in your Supabase SQL Editor:

```bash
supabase/migrations/001_initial_schema.sql
```

This creates tables, RLS policies, triggers, and the account deletion function.

### Running

```bash
# Development server
npm start

# iOS simulator
npm run ios

# Android emulator
npm run android
```

### Building

Uses [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
# Development build (includes dev client)
npm run build:dev

# Preview build (TestFlight/internal testing)
npm run build:preview

# Production build
npm run build:prod
```

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

Test suites cover:

- Curriculum data integrity
- Spaced repetition scheduling
- Lesson store (phase completion, scoring, review flow)
- Auth store state management
- Sync retry/backoff logic

## Code Quality

```bash
# Lint
npm run lint

# Type check
npm run typecheck

# Format
npm run format
```

## COPPA Compliance

- No PII collected beyond child's first name
- Parental gate protects parent-only settings
- Analytics opt-out toggle in settings
- Account and data deletion available in settings
- No email or social login (Apple ID only, or anonymous)
- Sentry configured with `sendDefaultPii: false`

## Key Dependencies

| Package                 | Purpose                           |
| ----------------------- | --------------------------------- |
| expo ~54                | Framework and build system        |
| expo-router ~6          | File-based navigation             |
| @supabase/supabase-js   | Backend (auth, database, storage) |
| zustand 5               | State management                  |
| react-native-mmkv       | Fast synchronous persistence      |
| expo-sqlite             | Offline-first local database      |
| react-native-reanimated | Animations                        |
| posthog-react-native    | Analytics                         |
| @sentry/react-native    | Error tracking                    |
