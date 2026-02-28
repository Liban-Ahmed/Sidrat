/**
 * useQuranAudio — Hook for Quran audio playback
 *
 * Manages playing/pausing ayah audio with the quranService.
 * Supports single-ayah and sequential multi-ayah playback.
 * Auto-resets state when playback finishes naturally.
 * Respects sound settings.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { quranService } from '../services/quranService';
import { useSettingsStore } from '../stores';

interface QuranAudioState {
  /** Currently playing ayah number (global) */
  playingAyah: number | null;
  /** Whether audio is actively playing */
  isPlaying: boolean;
  /** Loading state (downloading / buffering) */
  isLoading: boolean;
  /** Whether a multi-ayah sequence is in progress */
  isSequence: boolean;
}

export function useQuranAudio() {
  const [state, setState] = useState<QuranAudioState>({
    playingAyah: null,
    isPlaying: false,
    isLoading: false,
    isSequence: false,
  });

  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const abortRef = useRef(false);
  const sequenceRef = useRef<{ active: boolean }>({ active: false });

  // Stop audio on unmount to prevent orphaned sound objects
  useEffect(() => {
    return () => {
      sequenceRef.current.active = false;
      quranService.stopAudio().catch(() => {});
    };
  }, []);

  const play = useCallback(
    async (globalAyahNumber: number, onFinish?: () => void) => {
      if (!soundEnabled) return;

      abortRef.current = false;
      sequenceRef.current.active = false;
      setState({
        playingAyah: globalAyahNumber,
        isPlaying: false,
        isLoading: true,
        isSequence: false,
      });

      try {
        await quranService.playAyah(globalAyahNumber, () => {
          // Auto-reset state when playback finishes naturally
          if (!abortRef.current) {
            setState({ playingAyah: null, isPlaying: false, isLoading: false, isSequence: false });
          }
          onFinish?.();
        });
        if (abortRef.current) return;
        setState({
          playingAyah: globalAyahNumber,
          isPlaying: true,
          isLoading: false,
          isSequence: false,
        });
      } catch (err) {
        console.warn('[useQuranAudio] play() failed:', err);
        setState({ playingAyah: null, isPlaying: false, isLoading: false, isSequence: false });
      }
    },
    [soundEnabled],
  );

  /**
   * Play a sequence of ayahs (by global number) one after another.
   * Automatically advances through the list when each ayah finishes.
   */
  const playSequence = useCallback(
    async (globalAyahNumbers: number[]) => {
      if (!soundEnabled || globalAyahNumbers.length === 0) return;
      if (globalAyahNumbers.length === 1) {
        return play(globalAyahNumbers[0]!);
      }

      abortRef.current = false;
      const seq = { active: true };
      sequenceRef.current = seq;

      let currentIdx = 0;

      const playNext = async () => {
        if (!seq.active || abortRef.current || currentIdx >= globalAyahNumbers.length) {
          if (seq.active && !abortRef.current) {
            setState({ playingAyah: null, isPlaying: false, isLoading: false, isSequence: false });
          }
          seq.active = false;
          return;
        }

        const num = globalAyahNumbers[currentIdx]!;
        setState({ playingAyah: num, isPlaying: false, isLoading: true, isSequence: true });

        try {
          await quranService.playAyah(num, () => {
            currentIdx++;
            playNext();
          });
          if (seq.active && !abortRef.current) {
            setState({ playingAyah: num, isPlaying: true, isLoading: false, isSequence: true });
          }
        } catch (err) {
          console.warn('[useQuranAudio] playSequence() failed at ayah', num, ':', err);
          seq.active = false;
          setState({ playingAyah: null, isPlaying: false, isLoading: false, isSequence: false });
        }
      };

      await playNext();
    },
    [soundEnabled, play],
  );

  const stop = useCallback(async () => {
    abortRef.current = true;
    sequenceRef.current.active = false;
    await quranService.stopAudio();
    setState({ playingAyah: null, isPlaying: false, isLoading: false, isSequence: false });
  }, []);

  const pause = useCallback(async () => {
    await quranService.pauseAudio();
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const resume = useCallback(async () => {
    await quranService.resumeAudio();
    setState((prev) => ({ ...prev, isPlaying: true }));
  }, []);

  const toggle = useCallback(
    async (globalAyahNumber: number) => {
      if (state.playingAyah === globalAyahNumber && state.isPlaying) {
        await pause();
      } else if (state.playingAyah === globalAyahNumber && !state.isPlaying) {
        await resume();
      } else {
        await play(globalAyahNumber);
      }
    },
    [state.playingAyah, state.isPlaying, pause, resume, play],
  );

  return {
    ...state,
    play,
    playSequence,
    stop,
    pause,
    resume,
    toggle,
  };
}
