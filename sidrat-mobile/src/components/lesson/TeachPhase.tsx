/**
 * TeachPhase — Displays a teach block with narration, key terms, and Arabic text.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
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
    const { brand, colors, typography, radius } = useTheme();

    // Auto-narrate on mount
    useEffect(() => {
        const timer = setTimeout(() => onNarrate(block.narration), 400);
        return () => clearTimeout(timer);
    }, [block.narration, onNarrate]);

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Progress indicator */}
                <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.progressRow}>
                    <Text style={[typography.caption, { color: colors.textTertiary }]}>
                        {index + 1} of {total}
                    </Text>
                    <View style={styles.dots}>
                        {Array.from({ length: total }).map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.dot,
                                    {
                                        backgroundColor: i <= index ? brand.primary : colors.surfaceTertiary,
                                    },
                                ]}
                            />
                        ))}
                    </View>
                </Animated.View>

                {/* Title */}
                <Animated.View entering={FadeInDown.delay(200).duration(600)}>
                    <Text style={[typography.title2, { color: colors.text, marginBottom: 16 }]}>
                        {block.title}
                    </Text>
                </Animated.View>

                {/* Body text */}
                <Animated.View entering={FadeInDown.delay(300).duration(600)}>
                    <Text style={[typography.body, { color: colors.text, lineHeight: 26 }]}>
                        {block.body}
                    </Text>
                </Animated.View>

                {/* Speaker button */}
                <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.speakerRow}>
                    <Pressable
                        onPress={() => onNarrate(block.narration)}
                        style={[
                            styles.speakerPill,
                            {
                                backgroundColor: isNarrating ? brand.primary : brand.primary + '12',
                                borderRadius: radius.full,
                            },
                        ]}
                    >
                        <Ionicons
                            name={isNarrating ? 'volume-high' : 'volume-medium-outline'}
                            size={18}
                            color={isNarrating ? '#FFF' : brand.primary}
                        />
                        <Text
                            style={[
                                typography.caption,
                                { color: isNarrating ? '#FFF' : brand.primary, fontWeight: '600' },
                            ]}
                        >
                            {isNarrating ? 'Playing...' : 'Listen'}
                        </Text>
                    </Pressable>
                </Animated.View>

                {/* Arabic text card */}
                {block.arabic && (
                    <Animated.View
                        entering={FadeInRight.delay(500).duration(600)}
                        style={[
                            styles.arabicCard,
                            {
                                backgroundColor: brand.primary + '08',
                                borderRadius: radius.lg,
                                borderColor: brand.primary + '20',
                            },
                        ]}
                    >
                        <Text style={[styles.arabicText, { color: colors.text }]}>
                            {block.arabic.text}
                        </Text>
                        <Text style={[typography.callout, { color: brand.primary, fontStyle: 'italic' }]}>
                            {block.arabic.transliteration}
                        </Text>
                        <Text style={[typography.caption, { color: colors.textSecondary }]}>
                            {block.arabic.translation}
                        </Text>
                    </Animated.View>
                )}

                {/* Key terms */}
                {block.keyTerms && block.keyTerms.length > 0 && (
                    <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.termsSection}>
                        <Text style={[typography.calloutBold, { color: colors.text, marginBottom: 8 }]}>
                            Key Terms
                        </Text>
                        {block.keyTerms.map((term, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.termRow,
                                    {
                                        backgroundColor: colors.surfaceSecondary,
                                        borderRadius: radius.sm,
                                    },
                                ]}
                            >
                                <Text style={[typography.calloutBold, { color: brand.primary }]}>
                                    {term.term}
                                </Text>
                                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                                    {term.definition}
                                </Text>
                            </View>
                        ))}
                    </Animated.View>
                )}
            </ScrollView>

            {/* Next button */}
            <View style={[styles.footer, { borderTopColor: colors.separator }]}>
                <Pressable
                    onPress={onNext}
                    style={[styles.nextButton, { backgroundColor: brand.primary, borderRadius: radius.lg }]}
                >
                    <Text style={[typography.headlineBold, { color: '#FFF' }]}>
                        {isLast ? 'Start Practice' : 'Next'}
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFF" />
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
        paddingBottom: 100,
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    dots: { flexDirection: 'row', gap: 6 },
    dot: { width: 8, height: 8, borderRadius: 4 },
    speakerRow: { marginTop: 16, marginBottom: 20 },
    speakerPill: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    arabicCard: {
        padding: 20,
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        marginBottom: 20,
    },
    arabicText: {
        fontSize: 28,
        fontWeight: '300',
        textAlign: 'center',
        lineHeight: 44,
    },
    termsSection: { marginTop: 4 },
    termRow: {
        padding: 12,
        marginBottom: 8,
        gap: 2,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingBottom: 36,
        paddingTop: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    nextButton: {
        height: 52,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
});
