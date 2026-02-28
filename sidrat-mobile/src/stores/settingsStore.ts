/**
 * Settings Store
 *
 * User preferences, persisted to MMKV.
 * Behind parental gate.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './persist';

interface SettingsState {
    /** Daily reminder enabled */
    dailyReminderEnabled: boolean;

    /** Reminder hour (24h format) */
    reminderHour: number;

    /** Sound effects enabled */
    soundEnabled: boolean;

    /** Haptic feedback enabled */
    hapticsEnabled: boolean;

    /** TTS narration enabled */
    narrationEnabled: boolean;

    /** TTS speech rate (0.5 – 2.0) */
    speechRate: number;

    /** Dark mode preference: 'system' | 'light' | 'dark' */
    themePreference: 'system' | 'light' | 'dark';

    /** Whether the user has seen the onboarding tutorial */
    hasSeenTutorial: boolean;

    /** Analytics opt-out (COPPA: parents can disable analytics) */
    analyticsEnabled: boolean;

    // Actions
    setDailyReminder: (enabled: boolean) => void;
    setReminderHour: (hour: number) => void;
    setSoundEnabled: (enabled: boolean) => void;
    setHapticsEnabled: (enabled: boolean) => void;
    setNarrationEnabled: (enabled: boolean) => void;
    setSpeechRate: (rate: number) => void;
    setThemePreference: (pref: 'system' | 'light' | 'dark') => void;
    setAnalyticsEnabled: (enabled: boolean) => void;
    markTutorialSeen: () => void;
    resetSettings: () => void;
}

const DEFAULT_SETTINGS = {
    dailyReminderEnabled: true,
    reminderHour: 17,
    soundEnabled: true,
    hapticsEnabled: true,
    narrationEnabled: true,
    speechRate: 0.85,
    themePreference: 'system' as const,
    hasSeenTutorial: false,
    analyticsEnabled: true,
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            ...DEFAULT_SETTINGS,

            setDailyReminder: (enabled) => set({ dailyReminderEnabled: enabled }),
            setReminderHour: (hour) => set({ reminderHour: hour }),
            setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
            setHapticsEnabled: (enabled) => set({ hapticsEnabled: enabled }),
            setNarrationEnabled: (enabled) => set({ narrationEnabled: enabled }),
            setSpeechRate: (rate) => set({ speechRate: rate }),
            setThemePreference: (pref) => set({ themePreference: pref }),
            setAnalyticsEnabled: (enabled) => set({ analyticsEnabled: enabled }),
            markTutorialSeen: () => set({ hasSeenTutorial: true }),
            resetSettings: () => set(DEFAULT_SETTINGS),
        }),
        {
            name: 'sidrat-settings',
            storage: createJSONStorage(() => mmkvStorage),
        },
    ),
);
