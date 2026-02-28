/**
 * Notification Service
 *
 * Handles local daily reminder notifications.
 * No push server needed — expo-notifications local scheduling.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { APP_CONFIG } from '../constants/config';

// ── Configure notification handler ───────────────────────────────

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ── Notification messages (randomized for variety) ───────────────

const REMINDER_MESSAGES = [
  { title: 'Bismillah!', body: "Today's lesson is waiting for you" },
  { title: 'Time to learn!', body: 'Just 5 minutes to keep your streak going' },
  { title: "Don't break your streak!", body: 'Your learning adventure continues' },
  { title: 'New lesson ready!', body: 'Come explore something amazing today' },
  { title: 'Assalamu Alaikum!', body: "Let's learn something new together" },
] as const;

export const notificationService = {
  /**
   * Request notification permissions from the user.
   * Should be called during onboarding (with context).
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily-reminder', {
        name: 'Daily Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    if (existingStatus === 'granted') return true;

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  /**
   * Schedule a daily reminder notification.
   * Cancels any existing scheduled notifications first.
   */
  async scheduleDailyReminder(
    hour: number = APP_CONFIG.defaultReminderHour,
    minute = 0,
  ): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const msg = REMINDER_MESSAGES[Math.floor(Math.random() * REMINDER_MESSAGES.length)];

    // TypeScript guard — msg is guaranteed to exist since array is non-empty
    if (!msg) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: msg.title,
        body: msg.body,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  },

  /**
   * Cancel all scheduled notifications.
   */
  async cancelAll(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  /**
   * Check if permissions are currently granted.
   */
  async hasPermission(): Promise<boolean> {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  },
};
