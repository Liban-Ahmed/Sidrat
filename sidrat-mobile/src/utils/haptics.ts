/**
 * Haptic Feedback Helper
 *
 * Wraps expo-haptics with permission checks and
 * respects user settings.
 */

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useSettingsStore } from '../stores/settingsStore';

const isHapticsAvailable = Platform.OS === 'ios' || Platform.OS === 'android';

function isEnabled(): boolean {
    return useSettingsStore.getState().hapticsEnabled && isHapticsAvailable;
}

export const haptics = {
    /** Light tap — button press, selection */
    light() {
        if (isEnabled()) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    },

    /** Medium tap — significant action */
    medium() {
        if (isEnabled()) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
    },

    /** Heavy tap — destructive or important action */
    heavy() {
        if (isEnabled()) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
    },

    /** Success — correct answer, lesson complete */
    success() {
        if (isEnabled()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    },

    /** Error — wrong answer, invalid action */
    error() {
        if (isEnabled()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    },

    /** Warning — approaching streak end, etc. */
    warning() {
        if (isEnabled()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
    },

    /** Selection change — picker, toggle */
    selection() {
        if (isEnabled()) {
            Haptics.selectionAsync();
        }
    },
};
