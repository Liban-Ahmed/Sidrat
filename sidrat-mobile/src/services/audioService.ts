/**
 * Audio Service
 *
 * Manages text-to-speech playback for lesson narration.
 * Uses expo-speech (system TTS) — free, works offline,
 * no API keys needed.
 *
 * Respects `narrationEnabled` and `soundEnabled` from settingsStore:
 *   - speak()   → skipped when narrationEnabled is false
 *   - stop()    → always honoured regardless of settings
 *
 * Future: swap individual lessons to pre-recorded mp3 via expo-av
 * without changing the interface.
 */

import * as Speech from 'expo-speech';
import { useSettingsStore } from '../stores/settingsStore';

export interface SpeechOptions {
  /** Speech rate: 0.5 (slow) to 2.0 (fast). Default: falls back to settingsStore.speechRate. */
  rate?: number;
  /** Voice pitch: 0.5 to 2.0. Default: 1.1 (slightly higher for kids). */
  pitch?: number;
  /** Language code. Default: 'en-US'. */
  language?: string;
  /** Callback when speech finishes. */
  onDone?: () => void;
  /** Callback on error. */
  onError?: (error: Error) => void;
}

const CHILD_DEFAULTS = {
  pitch: 1.1,
  language: 'en-US',
};

export const audioService = {
  /**
   * Speak text using system TTS.
   * Silently returns if narration or sound is disabled in settings.
   * Stops any currently playing speech first.
   */
  async speak(text: string, options: SpeechOptions = {}): Promise<void> {
    const { narrationEnabled, soundEnabled, speechRate } = useSettingsStore.getState();
    if (!narrationEnabled || !soundEnabled) return;

    await this.stop();

    const rate = options.rate ?? speechRate;
    const { pitch, language, onDone, onError } = { ...CHILD_DEFAULTS, ...options };

    Speech.speak(text, {
      rate,
      pitch,
      language,
      onDone,
      onError: (error) => onError?.(error instanceof Error ? error : new Error(String(error))),
    });
  },

  /**
   * Stop any current speech.
   */
  async stop(): Promise<void> {
    const isSpeaking = await Speech.isSpeakingAsync();
    if (isSpeaking) {
      Speech.stop();
    }
  },

  /**
   * Pause current speech (iOS only).
   */
  async pause(): Promise<void> {
    Speech.pause();
  },

  /**
   * Resume paused speech (iOS only).
   */
  async resume(): Promise<void> {
    Speech.resume();
  },

  /**
   * Check if currently speaking.
   */
  async isSpeaking(): Promise<boolean> {
    return Speech.isSpeakingAsync();
  },

  /**
   * Get available voices for a language.
   */
  async getVoices(language = 'en'): Promise<Speech.Voice[]> {
    const voices = await Speech.getAvailableVoicesAsync();
    return voices.filter((v) => v.language.startsWith(language));
  },
};
