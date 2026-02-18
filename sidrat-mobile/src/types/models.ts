/**
 * Sidrat TypeScript Models
 *
 * Ported from Swift models with improvements:
 * - Discriminated unions instead of raw string enums
 * - Utility types for creation (omit computed fields)
 * - Strict readonly where appropriate
 * - No SwiftData constraints — clean data shapes
 */

// ── Enums / Unions ───────────────────────────────────────────────

export type LessonCategory =
    | 'aqeedah'
    | 'salah'
    | 'wudu'
    | 'quran'
    | 'seerah'
    | 'adab'
    | 'duaa'
    | 'stories';

export const LESSON_CATEGORIES: readonly LessonCategory[] = [
    'aqeedah',
    'salah',
    'wudu',
    'quran',
    'seerah',
    'adab',
    'duaa',
    'stories',
] as const;

export const categoryMeta: Record<
    LessonCategory,
    { label: string; icon: string }
> = {
    aqeedah: { label: 'Aqeedah', icon: 'star' },
    salah: { label: 'Salah', icon: 'person-outline' },
    wudu: { label: 'Wudu', icon: 'water-outline' },
    quran: { label: 'Quran', icon: 'book-outline' },
    seerah: { label: 'Seerah', icon: 'people-outline' },
    adab: { label: 'Adab', icon: 'heart-outline' },
    duaa: { label: "Du'a", icon: 'hand-left-outline' },
    stories: { label: 'Stories', icon: 'library-outline' },
};

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type AvatarId =
    | 'cat'
    | 'lion'
    | 'butterfly'
    | 'owl'
    | 'rabbit'
    | 'panda'
    | 'fox'
    | 'deer';

export type AchievementCategory =
    | 'progress'
    | 'mastery'
    | 'special'
    | 'social';

export type AchievementRarity = 'bronze' | 'silver' | 'gold' | 'platinum';

// ── Lesson Content (discriminated union — improvement over iOS) ──

export type LessonContent =
    | StoryContent
    | QuizContent
    | MatchingContent
    | AudioContent
    | InteractiveContent;

interface BaseContent {
    id: string;
    title?: string;
}

export interface StoryContent extends BaseContent {
    type: 'story';
    text: string;
    imageUrl?: string;
}

export interface QuizContent extends BaseContent {
    type: 'quiz';
    question: string;
    options: string[];
    correctAnswer: number;
}

export interface MatchingContent extends BaseContent {
    type: 'matching';
    pairs: { left: string; right: string }[];
}

export interface AudioContent extends BaseContent {
    type: 'audio';
    audioUrl: string;
    text?: string;
}

export interface InteractiveContent extends BaseContent {
    type: 'interactive';
    interactionType: string;
    data: Record<string, unknown>;
}

// ── Core Data Models ─────────────────────────────────────────────

export interface Child {
    id: string;
    name: string;
    birthYear: number;
    avatarId: AvatarId;
    createdAt: string; // ISO date
    lastAccessedAt: string;

    // Progress
    currentStreak: number;
    longestStreak: number;
    totalLessonsCompleted: number;
    totalXP: number;
    lastLessonCompletedDate?: string;
    currentWeekNumber: number;
}

export interface Lesson {
    id: string;
    title: string;
    description: string;
    category: LessonCategory;
    difficulty: Difficulty;
    durationMinutes: number;
    xpReward: number;
    order: number;
    weekNumber: number;
    content: LessonContent[];
}

export type LessonPhase = 'hook' | 'teach' | 'practice' | 'reward';

export interface LessonProgress {
    id: string;
    lessonId: string;
    childId: string;
    isCompleted: boolean;
    completedAt?: string;
    score: number;
    xpEarned: number;
    attempts: number;

    // Phase-level tracking (improvement: typed phase keys)
    lastCompletedPhase?: LessonPhase;
    phaseProgress: Partial<Record<LessonPhase, string>>; // phase → ISO date
    lastAccessedAt?: string;
}

export interface Achievement {
    id: string;
    type: string; // AchievementType key
    category: AchievementCategory;
    rarity: AchievementRarity;
    title: string;
    description: string;
    icon: string;
    unlockedAt?: string;
    isNew: boolean;
}

export interface FamilyActivity {
    id: string;
    title: string;
    description: string;
    instructions: string[];
    durationMinutes: number;
    weekNumber: number;
    relatedCategory: LessonCategory;
    parentTips: string[];
    conversationPrompts: string[];
    isCompleted: boolean;
    completedAt?: string;
}

// ── Utility types ────────────────────────────────────────────────

/** Fields needed to create a new child profile */
export type CreateChild = Pick<Child, 'name' | 'birthYear' | 'avatarId'>;

/** Computed helper: age from birthYear */
export function getAge(birthYear: number): number {
    return new Date().getFullYear() - birthYear;
}
