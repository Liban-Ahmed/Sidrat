/**
 * QuranAudioButton — Premium Quran recitation play button
 *
 * A beautiful, animated button placed inside the Arabic card in TeachPhase.
 * Plays Quran ayah audio from a professional reciter (Sheikh Mishary al-Afasy).
 *
 * Features:
 *  • Resolves surah+ayah → global ayah number via quranService
 *  • Sequential multi-ayah playback for ranges
 *  • Animated waveform bars when playing
 *  • Loading spinner state
 *  • Pause/resume support
 *  • Emerald green Quran-branded color scheme
 *  • Haptic feedback
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  FadeIn,
  interpolate,
} from 'react-native-reanimated';
import { quranService } from '../../services/quranService';
import { useTheme } from '../../theme';
import { brand } from '../../theme/colors';
import { haptics } from '../../utils/haptics';

interface QuranRef {
  surah: number;
  ayah: number;
  endAyah?: number;
  /** Pre-computed global ayah numbers — skips API resolution when provided */
  globalAyahNumbers?: number[];
}

interface QuranAudioButtonProps {
  quranRef: QuranRef;
  /** Audio state from useQuranAudio */
  isPlaying: boolean;
  isLoading: boolean;
  playingAyah: number | null;
  /** Called to play audio — receives array of global ayah numbers */
  onPlay: (globalAyahNumbers: number[]) => void;
  /** Called to pause audio */
  onPause: () => void;
  /** Called to resume audio */
  onResume: () => void;
  /** Called right before playback starts (to stop TTS narration) */
  onPlayStart?: () => void;
}

export function QuranAudioButton({
  quranRef,
  isPlaying,
  isLoading,
  playingAyah,
  onPlay,
  onPause,
  onResume,
  onPlayStart,
}: QuranAudioButtonProps) {
  const { typography, radius, isDark } = useTheme();

  // Resolved global ayah numbers
  const [globalAyahNumbers, setGlobalAyahNumbers] = useState<number[]>([]);
  const [resolveError, setResolveError] = useState(false);
  const [resolving, setResolving] = useState(true);
  const mountedRef = useRef(true);

  // Quran-specific colors (emerald green — brand.secondary)
  const quranColor = brand.secondary;

  // ── Resolve quranRef → global ayah numbers on mount ──
  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    // If pre-computed numbers are provided, use them immediately (no API call needed)
    if (quranRef.globalAyahNumbers && quranRef.globalAyahNumbers.length > 0) {
      setGlobalAyahNumbers(quranRef.globalAyahNumbers);
      setResolving(false);
      return;
    }

    // Fallback: resolve via API
    async function resolve() {
      setResolving(true);
      setResolveError(false);

      try {
        const start = quranRef.ayah;
        const end = quranRef.endAyah ?? quranRef.ayah;
        const numbers: number[] = [];

        for (let i = start; i <= end; i++) {
          const ayah = await quranService.getAyah(quranRef.surah, i);
          if (cancelled) return;
          if (ayah) {
            numbers.push(ayah.number);
          }
        }

        if (!cancelled && mountedRef.current) {
          setGlobalAyahNumbers(numbers);
          setResolving(false);
        }
      } catch (err) {
        console.warn('[QuranAudioButton] Resolution failed:', err);
        if (!cancelled && mountedRef.current) {
          setResolveError(true);
          setResolving(false);
        }
      }
    }

    resolve();
    return () => {
      cancelled = true;
      mountedRef.current = false;
    };
  }, [quranRef.surah, quranRef.ayah, quranRef.endAyah, quranRef.globalAyahNumbers]);

  // ── Determine active state ──
  const isActive = globalAyahNumbers.length > 0 && globalAyahNumbers.includes(playingAyah ?? -1);
  const isActivelyPlaying = isActive && isPlaying;
  const isActivelyLoading = isActive && isLoading;
  const isPaused = isActive && !isPlaying && !isLoading && playingAyah !== null;

  // ── Animations ──

  // Button scale on press
  const buttonScale = useSharedValue(1);

  // Waveform animation — single driver value
  const waveDriver = useSharedValue(0);

  useEffect(() => {
    if (isActivelyPlaying) {
      waveDriver.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 600, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      );
    } else {
      waveDriver.value = withTiming(0, { duration: 250 });
    }
  }, [isActivelyPlaying, waveDriver]);

  // Glow pulse for playing state
  const glowPulse = useSharedValue(1);
  useEffect(() => {
    if (isActivelyPlaying) {
      glowPulse.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );
    } else {
      glowPulse.value = withTiming(1, { duration: 200 });
    }
  }, [isActivelyPlaying, glowPulse]);

  // Waveform bar styles
  const bar1Style = useAnimatedStyle(() => ({
    height: interpolate(waveDriver.value, [0, 0.5, 1], [4, 14, 6]),
  }));
  const bar2Style = useAnimatedStyle(() => ({
    height: interpolate(waveDriver.value, [0, 0.3, 0.7, 1], [6, 4, 16, 8]),
  }));
  const bar3Style = useAnimatedStyle(() => ({
    height: interpolate(waveDriver.value, [0, 0.4, 0.8, 1], [4, 18, 6, 12]),
  }));
  const bar4Style = useAnimatedStyle(() => ({
    height: interpolate(waveDriver.value, [0, 0.5, 1], [8, 4, 14]),
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowPulse.value }],
  }));

  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // ── Handlers ──

  const handlePress = useCallback(() => {
    haptics.light();

    if (isActivelyPlaying) {
      onPause();
    } else if (isPaused) {
      onResume();
    } else {
      // Start fresh playback
      onPlayStart?.();
      // Short delay to let TTS stop before Quran audio starts
      setTimeout(() => {
        onPlay(globalAyahNumbers);
      }, 100);
    }
  }, [isActivelyPlaying, isPaused, globalAyahNumbers, onPlay, onPause, onResume, onPlayStart]);

  const handlePressIn = useCallback(() => {
    buttonScale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  }, [buttonScale]);

  const handlePressOut = useCallback(() => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, [buttonScale]);

  // ── Render ──

  // Still resolving or error
  if (resolving) {
    return (
      <Animated.View entering={FadeIn.delay(300).duration(400)} style={styles.container}>
        <View
          style={[
            styles.button,
            {
              backgroundColor: isDark ? quranColor + '15' : quranColor + '08',
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: quranColor + '20',
            },
          ]}
        >
          <ActivityIndicator size="small" color={quranColor + '60'} />
          <Text style={[typography.caption, { color: quranColor + '60' }]}>
            Preparing recitation...
          </Text>
        </View>
      </Animated.View>
    );
  }

  if (resolveError || globalAyahNumbers.length === 0) {
    return (
      <Animated.View entering={FadeIn.delay(300).duration(400)} style={styles.container}>
        <Pressable
          onPress={() => {
            // Retry resolution
            setResolveError(false);
            setResolving(true);
            setGlobalAyahNumbers([]);
            (async () => {
              try {
                const start = quranRef.ayah;
                const end = quranRef.endAyah ?? quranRef.ayah;
                const numbers: number[] = [];
                for (let i = start; i <= end; i++) {
                  const ayah = await quranService.getAyah(quranRef.surah, i);
                  if (ayah) numbers.push(ayah.number);
                }
                if (mountedRef.current) {
                  setGlobalAyahNumbers(numbers);
                  setResolving(false);
                }
              } catch {
                if (mountedRef.current) {
                  setResolveError(true);
                  setResolving(false);
                }
              }
            })();
          }}
        >
          <View
            style={[
              styles.button,
              {
                backgroundColor: isDark ? quranColor + '15' : quranColor + '08',
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor: quranColor + '20',
              },
            ]}
          >
            <Ionicons name="refresh" size={16} color={quranColor + '80'} />
            <Text style={[typography.caption, { color: quranColor + '80' }]}>
              Tap to retry loading recitation
            </Text>
          </View>
        </Pressable>
      </Animated.View>
    );
  }

  // Button label & icon
  let label: string;
  let sublabel: string;
  let iconName: keyof typeof Ionicons.glyphMap;

  if (isActivelyLoading) {
    label = 'Loading...';
    sublabel = 'Sheikh Mishary al-Afasy';
    iconName = 'hourglass-outline';
  } else if (isActivelyPlaying) {
    label = 'Playing...';
    sublabel = 'Tap to pause';
    iconName = 'pause';
  } else if (isPaused) {
    label = 'Resume';
    sublabel = 'Sheikh Mishary al-Afasy';
    iconName = 'play';
  } else {
    label = 'Listen to Recitation';
    sublabel = 'Sheikh Mishary al-Afasy';
    iconName = 'play';
  }

  return (
    <Animated.View entering={FadeIn.delay(400).duration(500)} style={styles.container}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isActivelyLoading || resolving}
      >
        <Animated.View
          style={[
            styles.button,
            {
              backgroundColor: isActivelyPlaying
                ? quranColor
                : isDark
                  ? quranColor + '18'
                  : quranColor + '0C',
              borderRadius: radius.lg,
              borderWidth: 1.5,
              borderColor: isActivelyPlaying ? quranColor : quranColor + (isDark ? '35' : '25'),
              shadowColor: isActivelyPlaying ? quranColor : 'transparent',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isActivelyPlaying ? 0.3 : 0,
              shadowRadius: 12,
              elevation: isActivelyPlaying ? 6 : 0,
            },
            glowStyle,
            buttonAnimStyle,
          ]}
        >
          {/* Left: Icon */}
          <View style={styles.iconContainer}>
            {isActivelyLoading ? (
              <ActivityIndicator size="small" color={isActivelyPlaying ? '#FFF' : quranColor} />
            ) : (
              <View
                style={[
                  styles.playIconCircle,
                  {
                    backgroundColor: isActivelyPlaying
                      ? 'rgba(255,255,255,0.2)'
                      : quranColor + '15',
                  },
                ]}
              >
                <Ionicons
                  name={iconName}
                  size={16}
                  color={isActivelyPlaying ? '#FFF' : quranColor}
                />
              </View>
            )}
          </View>

          {/* Center: Labels */}
          <View style={styles.labelContainer}>
            <Text
              style={[
                typography.labelSmall,
                {
                  color: isActivelyPlaying ? '#FFF' : quranColor,
                  letterSpacing: 0.3,
                },
              ]}
            >
              {label}
            </Text>
            <Text
              style={[
                styles.sublabel,
                {
                  color: isActivelyPlaying ? 'rgba(255,255,255,0.7)' : quranColor + '80',
                },
              ]}
            >
              {sublabel}
            </Text>
          </View>

          {/* Right: Waveform bars (visible when playing) */}
          {isActivelyPlaying && (
            <View style={styles.waveformContainer}>
              <Animated.View
                style={[styles.waveBar, { backgroundColor: 'rgba(255,255,255,0.8)' }, bar1Style]}
              />
              <Animated.View
                style={[styles.waveBar, { backgroundColor: 'rgba(255,255,255,0.9)' }, bar2Style]}
              />
              <Animated.View style={[styles.waveBar, { backgroundColor: '#FFF' }, bar3Style]} />
              <Animated.View
                style={[styles.waveBar, { backgroundColor: 'rgba(255,255,255,0.8)' }, bar4Style]}
              />
            </View>
          )}

          {/* Quran icon on right for idle state */}
          {!isActivelyPlaying && !isActivelyLoading && (
            <Ionicons
              name="book-outline"
              size={14}
              color={quranColor + '50'}
              style={styles.trailingIcon}
            />
          )}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    flex: 1,
    gap: 1,
  },
  sublabel: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2.5,
    height: 20,
    paddingRight: 2,
  },
  waveBar: {
    width: 3,
    borderRadius: 1.5,
    minHeight: 3,
  },
  trailingIcon: {
    marginLeft: 'auto',
  },
});
