/**
 * Family Store
 *
 * Manages weekly family activities — rotation, completion tracking,
 * and activity data. Persisted to MMKV via Zustand middleware.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './persist';
import type { Ionicons } from '@expo/vector-icons';

// ── Types ──

export interface FamilyActivity {
    id: string;
    title: string;
    emoji: string;
    description: string;
    duration: number; // minutes
    category: 'quran' | 'dua' | 'character' | 'worship' | 'knowledge';
    tips: string[];
    prompts: string[];
}

// ── Static Data ──

export const ACTIVITIES: FamilyActivity[] = [
    {
        id: 'wudu-together',
        title: 'Practice Wudu Together',
        emoji: '💧',
        description:
            'Go through each step of Wudu together slowly and make it fun! Let them lead and gently guide when needed.',
        duration: 15,
        category: 'worship',
        tips: [
            'Make it playful — use a fun timer or sing a simple nasheed',
            "Let them splash a little — it's about learning, not perfection",
            'Praise effort, not just getting it right',
        ],
        prompts: [
            'Why do you think we clean ourselves before talking to Allah?',
            "What's your favorite part of making Wudu?",
            'How do you feel after making Wudu?',
        ],
    },
    {
        id: 'bedtime-dua',
        title: 'Bedtime Dua Together',
        emoji: '🌙',
        description:
            'End the day by reciting bedtime duas together. Teach your child to speak to Allah before sleep.',
        duration: 10,
        category: 'dua',
        tips: [
            'Start with just one dua and add more each week',
            'Make it cozy — dim lights, get comfy',
            "Explain the meaning in simple words they'll understand",
        ],
        prompts: [
            'What was the best thing that happened today?',
            "What would you like to ask Allah for tonight?",
            'Why do we say Bismillah before sleeping?',
        ],
    },
    {
        id: 'quran-listening',
        title: 'Quran Listening Circle',
        emoji: '🎧',
        description:
            'Sit together as a family and listen to a short surah. Talk about what it means and how beautiful it sounds.',
        duration: 15,
        category: 'quran',
        tips: [
            'Start with short surahs like Al-Fatiha or Al-Ikhlas',
            'Play a beautiful recitation — Mishary Al-Afasy is great for kids',
            'Ask them to close their eyes and just listen first',
        ],
        prompts: [
            'How did it make you feel when you heard the Quran?',
            "What words did you recognize?",
            'Why do you think the Quran sounds so beautiful?',
        ],
    },
    {
        id: 'kindness-tracker',
        title: 'Acts of Kindness Challenge',
        emoji: '💚',
        description:
            'Challenge each family member to do 3 kind things today. Share your acts of kindness at dinner!',
        duration: 20,
        category: 'character',
        tips: [
            'Give examples: help a sibling, share a toy, say something nice',
            'Make a simple chart they can draw check marks on',
            'Remind them the Prophet ﷺ said the best people are those most kind',
        ],
        prompts: [
            'What kind thing did you do today?',
            'How did it make the other person feel?',
            'What kind thing would you like to do tomorrow?',
        ],
    },
    {
        id: 'prophet-stories',
        title: 'Prophet Stories Storytime',
        emoji: '📖',
        description:
            'Read or tell a story about one of the Prophets (peace be upon them). Discuss the lessons we can learn.',
        duration: 20,
        category: 'knowledge',
        tips: [
            'Use age-appropriate language and keep it engaging',
            'Ask questions during the story to keep them involved',
            'Connect the story to something in their daily life',
        ],
        prompts: [
            'Which prophet did we learn about? What did they teach?',
            'What would you do if you were in their situation?',
            'How can we be like this prophet in our daily life?',
        ],
    },
    {
        id: 'morning-adhkar',
        title: 'Morning Adhkar Together',
        emoji: '☀️',
        description:
            'Start the day with morning remembrances of Allah. Say them together over breakfast!',
        duration: 10,
        category: 'dua',
        tips: [
            'Pick 3-5 short adhkar to start with',
            'Say them during breakfast so it becomes a routine',
            'Use repetition — kids love saying things together',
        ],
        prompts: [
            'How does it feel to start the day remembering Allah?',
            'What does this dua mean in your own words?',
            'When else during the day can we remember Allah?',
        ],
    },
];

export const ACTIVITY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
    'wudu-together': 'water-outline',
    'bedtime-dua': 'moon-outline',
    'quran-listening': 'musical-notes-outline',
    'kindness-tracker': 'heart-outline',
    'prophet-stories': 'book-outline',
    'morning-adhkar': 'sunny-outline',
};

// ── Helpers ──

export function getWeekOfYear(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
}

/** Build the key used to track completion for a given week + child */
function completionKey(weekNum: number, childId: string | null): string {
    return `family-${weekNum}-${childId ?? 'default'}`;
}

/** Get the activity for a given week (rotating through the bank) */
export function getActivityForWeek(weekNum: number): FamilyActivity {
    return ACTIVITIES[weekNum % ACTIVITIES.length]!;
}

/** Get the next week's activity */
export function getNextActivity(weekNum: number): FamilyActivity {
    return ACTIVITIES[(weekNum + 1) % ACTIVITIES.length]!;
}

// ── Store ──

interface FamilyState {
    /** Map of "family-{weekNum}-{childId}" → true for completed activities */
    completions: Record<string, boolean>;

    /** Mark the current week's activity as completed for a child */
    markComplete: (weekNum: number, childId: string | null) => void;

    /** Check if a specific week's activity is completed for a child */
    isCompleted: (weekNum: number, childId: string | null) => boolean;

    /** Reset all completions (for testing / debug) */
    resetCompletions: () => void;
}

export const useFamilyStore = create<FamilyState>()(
    persist(
        (set, get) => ({
            completions: {},

            markComplete: (weekNum, childId) => {
                const key = completionKey(weekNum, childId);
                set((state) => ({
                    completions: { ...state.completions, [key]: true },
                }));
            },

            isCompleted: (weekNum, childId) => {
                const key = completionKey(weekNum, childId);
                return get().completions[key] ?? false;
            },

            resetCompletions: () => set({ completions: {} }),
        }),
        {
            name: 'sidrat-family',
            storage: createJSONStorage(() => mmkvStorage),
        },
    ),
);
