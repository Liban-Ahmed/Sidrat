/**
 * Haptic Feedback Service — Sidrat Design Spec §2
 *
 * Centralized haptic utility. Every interactive element in the app
 * must call the appropriate method here — no silent taps.
 *
 * All methods respect settingsStore.hapticsEnabled.
 */

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useSettingsStore } from '../stores/settingsStore';

const isHapticsAvailable = Platform.OS === 'ios' || Platform.OS === 'android';

function isEnabled(): boolean {
  return useSettingsStore.getState().hapticsEnabled && isHapticsAvailable;
}

const haptic = {
  /** Light impact — button press, card selection, phase transition, pull-to-refresh, swipe */
  light: () => {
    if (!isEnabled()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },

  /** Medium impact — correct answer, Barakah Box tap */
  medium: () => {
    if (!isEnabled()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },

  /** Heavy impact — long press, achievement unlock (first part), Barakah Box opens */
  heavy: () => {
    if (!isEnabled()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },

  /** Success notification — lesson complete, achievement unlock (second part) */
  success: () => {
    if (!isEnabled()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },

  /** Warning notification — wrong answer */
  warning: () => {
    if (!isEnabled()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },

  /** Error notification — form validation failure, blocked action */
  error: () => {
    if (!isEnabled()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },

  /** Selection feedback — tab switch, toggle/switch */
  selection: () => {
    if (!isEnabled()) return;
    Haptics.selectionAsync();
  },

  /**
   * Streak milestone celebration (Istiqamah).
   *
   * Pulses heavy impact n times based on streak count, then fires
   * a success notification:
   *   count < 7  → 2 pulses
   *   count ≥ 7  → 3 pulses
   *   count ≥ 14 → 4 pulses
   *   count ≥ 30 → 5 pulses
   *
   * Each pulse is separated by a 100 ms gap.
   */
  streak: async (count: number) => {
    if (!isEnabled()) return;
    const pulses = count >= 30 ? 5 : count >= 14 ? 4 : count >= 7 ? 3 : 2;
    for (let i = 0; i < pulses; i++) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      await new Promise<void>((r) => setTimeout(r, 100));
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
};

export default haptic;
