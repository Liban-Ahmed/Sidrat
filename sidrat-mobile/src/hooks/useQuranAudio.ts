/**
 * useQuranAudio — Hook for Quran audio playback
 *
 * Manages playing/pausing ayah audio with the quranService.
 * Respects sound settings.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { quranService } from '../services/quranService';
import { useSettingsStore } from '../stores';

interface QuranAudioState {
    /** Currently playing ayah number (global) */
    playingAyah: number | null;
    /** Whether audio is playing */
    isPlaying: boolean;
    /** Loading state */
    isLoading: boolean;
}

export function useQuranAudio() {
    const [state, setState] = useState<QuranAudioState>({
        playingAyah: null,
        isPlaying: false,
        isLoading: false,
    });

    const soundEnabled = useSettingsStore((s) => s.soundEnabled);
    const abortRef = useRef(false);

    // Stop audio on unmount to prevent orphaned sound objects
    useEffect(() => {
        return () => {
            quranService.stopAudio().catch(() => { });
        };
    }, []);

    const play = useCallback(
        async (globalAyahNumber: number) => {
            if (!soundEnabled) return;

            abortRef.current = false;
            setState({ playingAyah: globalAyahNumber, isPlaying: false, isLoading: true });

            try {
                await quranService.playAyah(globalAyahNumber);
                if (abortRef.current) return;
                setState({ playingAyah: globalAyahNumber, isPlaying: true, isLoading: false });
            } catch {
                setState({ playingAyah: null, isPlaying: false, isLoading: false });
            }
        },
        [soundEnabled],
    );

    const stop = useCallback(async () => {
        abortRef.current = true;
        await quranService.stopAudio();
        setState({ playingAyah: null, isPlaying: false, isLoading: false });
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
        stop,
        pause,
        resume,
        toggle,
    };
}
