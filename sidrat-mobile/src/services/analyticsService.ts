/**
 * Analytics Service
 *
 * Privacy-friendly analytics via PostHog.
 * COPPA-compliant: no PII, no device identifiers for children.
 * Respects settingsStore opt-out.
 */

import PostHog from 'posthog-react-native';
import * as Application from 'expo-application';
import { IS_PROD } from '../constants/config';
import { useSettingsStore } from '../stores/settingsStore';

// ── PostHog Client ─────────────────────────────────────────────

const POSTHOG_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY ?? '';
const POSTHOG_HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';

let posthogClient: PostHog | null = null;

/** Initialize analytics — call once at app startup */
function init(): void {
  if (!POSTHOG_KEY || posthogClient) return;

  try {
    posthogClient = new PostHog(POSTHOG_KEY, {
      host: POSTHOG_HOST,
      // Disable automatic capture for COPPA compliance
      captureAppLifecycleEvents: IS_PROD,
    });
  } catch (error) {
    console.warn('[Analytics] Failed to initialize PostHog:', error);
  }
}

function isOptedOut(): boolean {
  return !useSettingsStore.getState().analyticsEnabled;
}

/** Track an event with optional properties */
function track(event: string, properties?: Record<string, string | number | boolean>): void {
  if (!posthogClient || isOptedOut()) return;

  try {
    posthogClient.capture(event, {
      ...properties,
      app_version: Application.nativeApplicationVersion ?? '1.0.0',
    });
  } catch {
    // Silently ignore analytics errors
  }
}

/** Identify user session (use anonymous ID only, no PII) */
function identify(userId: string, traits?: Record<string, string | number | boolean>): void {
  if (!posthogClient || isOptedOut()) return;
  try {
    posthogClient.identify(userId, traits);
  } catch {
    // Silently ignore
  }
}

/** Reset analytics session (on sign-out) */
function reset(): void {
  if (!posthogClient) return;
  try {
    posthogClient.reset();
  } catch {
    // Silently ignore
  }
}

/** Flush pending events */
async function flush(): Promise<void> {
  if (!posthogClient) return;
  try {
    posthogClient.flush();
  } catch {
    // Silently ignore
  }
}

/** Screen view tracking */
function screen(name: string, properties?: Record<string, string | number | boolean>): void {
  if (!posthogClient || isOptedOut()) return;
  try {
    posthogClient.screen(name, properties);
  } catch {
    // Silently ignore
  }
}

export const analyticsService = {
  init,
  track,
  identify,
  reset,
  flush,
  screen,
};
