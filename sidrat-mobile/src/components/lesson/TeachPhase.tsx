/**
 * TeachPhase — Premium teaching card with animated step dots, narration,
 * Arabic calligraphy showcase, and glossy key-term cards.
 *
 * Features:
 *  • Animated step indicator with filled-dot progress
 *  • Staggered content entrance per section
 *  • Pill-shaped narration button with waveform pulse
 *  • Arabic text on subtle gradient card with ornamental divider
 *  • Key terms rendered as glossy accent-bordered chips
 *  • Sticky footer with gradient fade + primary CTA
 *  • Full dark mode support
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Animated, {
    FadeInDown,
    FadeInRight,
    FadeIn,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    Easing,
    interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { haptics } from '../../utils/haptics';
import type { TeachBlock } from '../../types/curriculum';

interface Props {
    block: TeachBlock;
    index: number;
    total: number;
    isNarrating: boolean;
    onNarrate: (text: string) => void;
    onNext: () => void;
    isLast: boolean;
}

export function TeachPhase({ block, index, total, isNarrating, onNarrate, onNext, isLast }: Props) {
    const { brand, colors, typography, radius, isDark, shadows } = useTheme();

    // Auto-narrate on mount
    useEffect(() => {
        const timer = setTimeout(() => onNarrate(block.narration), 400);
        return () => clearTimeout(timer);
    }, [block.narration, onNarrate]);

    // ── Narration pulse ──
    const narratePulse = useSharedValue(1);
    useEffect(() => {
        if (isNarrating) {
            narratePulse.value = withRepeat(
                withSequence(
                    withTiming(1.06, { duration: 500, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) }),
                ),
                -1,
                true,
            );
        } else {
            narratePulse.value = withTiming(1, { duration: 150 });
        }
    }, [isNarrating, narratePulse]);

    const narratePulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: narratePulse.value }],
    }));

    // ── Waveform ring ──
    const waveRing = useSharedValue(1);
    useEffect(() => {
        if (isNarrating) {
            waveRing.value = withRepeat(
                withSequence(
                    withTiming(1.5, { duration: 700 }),
                    withTiming(1, { duration: 700 }),
                ),
                -1,
                true,
            );
        }
    }, [isNarrating, waveRing]);

    const waveStyle = useAnimatedStyle(() => ({
        transform: [{ scale: waveRing.value }],
        opacity: isNarrating ? interpolate(waveRing.value, [1, 1.5], [0.35, 0]) : 0,
    }));

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Step indicator ── */}
                <Animated.View entering={FadeInDown.delay(50).duration(400)} style={styles.stepRow}>
                    <View style={styles.stepDots}>
                        {Array.from({ length: total }).map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.stepDot,
                                    {
                                        backgroundColor:
                                            i < index
                                                ? brand.primary
                                                : i === index
                                                    ? brand.primary
                                                    : isDark
                                                        ? colors.surfaceTertiary
                                                        : colors.backgroundTertiary,
                                        width: i === index ? 20 : 8,
                                        borderRadius: 4,
                                    },
                                ]}
                            />
                        ))}
                    </View>
                    <View
                        style={[
                            styles.stepBadge,
                            {
                                backgroundColor: isDark ? colors.surfaceTertiary : colors.backgroundSecondary,
                                borderRadius: radius.full,
                            },
                        ]}
                    >
                        <Text style={[typography.labelXs, { color: colors.textSecondary }]}>
                            {index + 1}/{total}
                        </Text>
                    </View>
                </Animated.View>

                {/* ── Title ── */}
                <Animated.View entering={FadeInDown.delay(150).duration(500)}>
                    <Text
                        style={[
                            typography.title1,
                            { color: colors.text, marginBottom: 14 },
                        ]}
                    >
                        {block.title}
                    </Text>
                </Animated.View>

                {/* ── Body text ── */}
                <Animated.View entering={FadeInDown.delay(250).duration(500)}>
                    <Text
                        style={[
                            typography.body,
                            {
                                color: colors.textSecondary,
                                lineHeight: 28,
                            },
                        ]}
                    >
                        {block.body}
                    </Text>
                </Animated.View>

                {/* ── Speaker pill ── */}
                <Animated.View entering={FadeIn.delay(400).duration(400)} style={styles.speakerRow}>
                    <Pressable
                        onPress={() => {
                            haptics.light();
                            onNarrate(block.narration);
                        }}
                        style={styles.speakerOuter}
                    >
                        {/* Wave ring */}
                        <Animated.View
                            style={[
                                styles.speakerWave,
                                { borderColor: brand.primary },
                                waveStyle,
                            ]}
                        />
                        <Animated.View
                            style={[
                                styles.speakerPill,
                                {
                                    backgroundColor: isNarrating
                                        ? brand.primary
                                        : isDark
                                            ? brand.primary + '22'
                                            : brand.primary + '10',
                                    borderRadius: radius.full,
                                    shadowColor: isNarrating ? brand.primary : 'transparent',
                                    shadowOffset: { width: 0, height: 3 },
                                    shadowOpacity: isNarrating ? 0.25 : 0,
                                    shadowRadius: 8,
                                },
                                narratePulseStyle,
                            ]}
                        >
                            <Ionicons
                                name={isNarrating ? 'volume-high' : 'volume-medium-outline'}
                                size={16}
                                color={isNarrating ? '#FFF' : brand.primary}
                            />
                            <Text
                                style={[
                                    typography.labelSmall,
                                    {
                                        color: isNarrating ? '#FFF' : brand.primary,
                                    },
                                ]}
                            >
                                {isNarrating ? 'Playing...' : 'Listen'}
                            </Text>
                        </Animated.View>
                    </Pressable>
                </Animated.View>

                {/* ── Arabic text showcase ── */}
                {block.arabic && (
                    <Animated.View
                        entering={FadeInRight.delay(500).duration(600).springify().damping(16)}
                        style={[
                            styles.arabicCard,
                            {
                                backgroundColor: isDark
                                    ? brand.primary + '10'
                                    : brand.primary + '06',
                                borderRadius: radius.xl,
                                borderWidth: 1,
                                borderColor: brand.primary + (isDark ? '20' : '12'),
                                ...shadows.card,
                            },
                        ]}
                    >
                        {/* Decorative corner accent */}
                        <View
                            style={[
                                styles.arabicCorner,
                                { backgroundColor: brand.primary + '15' },
                            ]}
                        />

                        <Text
                            style={[
                                styles.arabicText,
                                { color: colors.text },
                            ]}
                        >
                            {block.arabic.text}
                        </Text>

                        {/* Ornamental divider */}
                        <View style={styles.dividerRow}>
                            <View style={[styles.dividerLine, { backgroundColor: brand.primary + '20' }]} />
                            <Ionicons name="diamond" size={8} color={brand.primary + '40'} />
                            <View style={[styles.dividerLine, { backgroundColor: brand.primary + '20' }]} />
                        </View>

                        <Text
                            style={[
                                typography.callout,
                                {
                                    color: brand.primary,
                                    fontStyle: 'italic',
                                    textAlign: 'center',
                                },
                            ]}
                        >
                            {block.arabic.transliteration}
                        </Text>
                        <Text
                            style={[
                                typography.bodySmall,
                                {
                                    color: colors.textSecondary,
                                    textAlign: 'center',
                                    marginTop: 2,
                                },
                            ]}
                        >
                            {block.arabic.translation}
                        </Text>
                    </Animated.View>
                )}

                {/* ── Key terms ── */}
                {block.keyTerms && block.keyTerms.length > 0 && (
                    <Animated.View
                        entering={FadeInDown.delay(600).duration(500)}
                        style={styles.termsSection}
                    >
                        <View style={styles.termsTitleRow}>
                            <Ionicons name="bookmark" size={16} color={brand.secondary} />
                            <Text
                                style={[
                                    typography.label,
                                    { color: colors.text, marginLeft: 6 },
                                ]}
                            >
                                Key Terms
                            </Text>
                        </View>
                        {block.keyTerms.map((term, i) => (
                            <Animated.View
                                key={i}
                                entering={FadeInDown.delay(650 + i * 80).duration(400)}
                            >
                                <View
                                    style={[
                                        styles.termCard,
                                        {
                                            backgroundColor: isDark
                                                ? colors.surfaceSecondary
                                                : colors.surface,
                                            borderRadius: radius.md,
                                            borderLeftWidth: 3,
                                            borderLeftColor: brand.secondary,
                                            ...shadows.subtle,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            typography.calloutBold,
                                            { color: brand.secondary },
                                        ]}
                                    >
                                        {term.term}
                                    </Text>
                                    <Text
                                        style={[
                                            typography.bodySmall,
                                            {
                                                color: colors.textSecondary,
                                                marginTop: 2,
                                                lineHeight: 20,
                                            },
                                        ]}
                                    >
                                        {term.definition}
                                    </Text>
                                </View>
                            </Animated.View>
                        ))}
                    </Animated.View>
                )}
            </ScrollView>

            {/* ── Sticky footer ── */}
            <View
                style={[
                    styles.footer,
                    {
                        borderTopColor: colors.separator,
                        backgroundColor: colors.background,
                    },
                ]}
            >
                <Pressable
                    onPress={() => {
                        haptics.medium();
                        onNext();
                    }}
                    style={({ pressed }) => [
                        styles.nextButton,
                        {
                            backgroundColor: brand.primary,
                            borderRadius: radius.lg,
                            shadowColor: brand.primary,
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: pressed ? 0.15 : 0.25,
                            shadowRadius: 12,
                            elevation: 4,
                            transform: [{ scale: pressed ? 0.97 : 1 }],
                        },
                    ]}
                >
                    <Text style={[typography.headlineBold, { color: '#FFF' }]}>
                        {isLast ? 'Start Practice' : 'Continue'}
                    </Text>
                    <Ionicons
                        name={isLast ? 'school' : 'arrow-forward'}
                        size={20}
                        color="rgba(255,255,255,0.8)"
                    />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 110,
    },

    /* Step indicator */
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 22,
    },
    stepDots: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    stepDot: { height: 8 },
    stepBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
    },

    /* Speaker */
    speakerRow: { marginTop: 18, marginBottom: 22 },
    speakerOuter: {
        alignSelf: 'flex-start',
        alignItems: 'center',
        justifyContent: 'center',
    },
    speakerWave: {
        position: 'absolute',
        width: 38,
        height: 38,
        borderRadius: 19,
        borderWidth: 1.5,
    },
    speakerPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },

    /* Arabic card */
    arabicCard: {
        padding: 24,
        alignItems: 'center',
        gap: 8,
        marginBottom: 22,
        overflow: 'hidden',
    },
    arabicCorner: {
        position: 'absolute',
        top: -20,
        right: -20,
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    arabicText: {
        fontSize: 30,
        fontWeight: '300',
        textAlign: 'center',
        lineHeight: 48,
        letterSpacing: 1,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginVertical: 4,
    },
    dividerLine: { flex: 1, height: 1 },

    /* Key terms */
    termsSection: { marginTop: 4 },
    termsTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    termCard: {
        padding: 14,
        marginBottom: 8,
    },

    /* Footer */
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingBottom: 36,
        paddingTop: 14,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    nextButton: {
        height: 54,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
});
