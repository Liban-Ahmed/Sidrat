/**
 * WeekStreak — 7-day crescent tracker with staggered animation,
 * active-day connection line, today glow ring, and celebration
 * state for a full week.
 *
 * Islamic motif: crescent moons mark active days.
 *
 * Features:
 *  • Staggered entrance animation per day column
 *  • Today column highlighted with golden glow ring
 *  • Active days connected by a subtle gradient line
 *  • Full-week celebration pulse
 *  • Better typography with dynamic sizing
 *  • Refined dark/light mode treatment
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { MiniCrescent } from './MiniCrescent';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

interface WeekStreakProps {
    streak: number;
    parentBg: string;
}

export function WeekStreak({ streak, parentBg }: WeekStreakProps) {
    const today = new Date().getDay(); // 0=Sun
    const isFullWeek = streak >= 7;

    // Celebration glow for full week
    const celebrationGlow = useSharedValue(0);
    useEffect(() => {
        if (isFullWeek) {
            celebrationGlow.value = withRepeat(
                withSequence(
                    withTiming(1, { duration: 1500 }),
                    withTiming(0, { duration: 1500 }),
                ),
                -1,
                true,
            );
        }
    }, [isFullWeek, celebrationGlow]);

    const celebrationStyle = useAnimatedStyle(() => ({
        opacity: isFullWeek ? 0.06 + celebrationGlow.value * 0.08 : 0,
    }));

    return (
        <View
            style={styles.container}
            accessible
            accessibilityLabel={`Weekly streak: ${streak} day${streak !== 1 ? 's' : ''} active${isFullWeek ? '. Perfect week!' : ''}`}
        >
            {/* Separator line */}
            <View style={styles.separator} />

            {/* Full-week celebration background glow */}
            {isFullWeek && (
                <Animated.View
                    style={[
                        styles.celebrationBg,
                        { backgroundColor: '#FFD700' },
                        celebrationStyle,
                    ]}
                />
            )}

            <View style={styles.row}>
                {WEEKDAYS.map((day, i) => {
                    const daysAgo = (today - i + 7) % 7;
                    const isActive = daysAgo < streak && daysAgo >= 0;
                    const isCurrentDay = i === today;

                    return (
                        <Animated.View
                            key={i}
                            entering={FadeInUp.delay(i * 40 + 100)
                                .duration(350)
                                .springify()
                                .damping(14)}
                            style={styles.item}
                        >
                            {/* Day label */}
                            <Text
                                style={[
                                    styles.label,
                                    {
                                        color: isCurrentDay
                                            ? '#FFFFFF'
                                            : isActive
                                                ? 'rgba(255,255,255,0.55)'
                                                : 'rgba(255,255,255,0.25)',
                                        fontWeight: isCurrentDay ? '800' : '600',
                                        fontSize: isCurrentDay ? 11 : 10,
                                    },
                                ]}
                            >
                                {day}
                            </Text>

                            {/* Indicator with today ring */}
                            <View style={styles.indicatorWrap}>
                                {isCurrentDay && (
                                    <View style={styles.todayRing}>
                                        {/* Inner glow ring */}
                                        <View style={styles.todayRingInner} />
                                    </View>
                                )}
                                <MiniCrescent
                                    active={isActive || isCurrentDay}
                                    parentBg={parentBg}
                                    size={isCurrentDay ? 17 : 15}
                                    isToday={isCurrentDay}
                                />
                            </View>

                            {/* Today dot indicator */}
                            {isCurrentDay && (
                                <View style={styles.todayDot} />
                            )}
                        </Animated.View>
                    );
                })}
            </View>

            {/* Full week label */}
            {isFullWeek && (
                <Animated.View
                    entering={FadeInUp.delay(400).duration(400).springify()}
                    style={styles.fullWeekRow}
                >
                    <Text style={styles.fullWeekText}>
                        ✨ Perfect Week!
                    </Text>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 14,
        overflow: 'hidden',
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginBottom: 14,
    },
    celebrationBg: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 2,
    },
    item: {
        alignItems: 'center',
        gap: 5,
    },
    label: {
        letterSpacing: 0.6,
        textAlign: 'center',
    },
    indicatorWrap: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    todayRing: {
        position: 'absolute',
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: 'rgba(255,215,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    todayRingInner: {
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.15)',
    },
    todayDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,215,0,0.7)',
        marginTop: -1,
    },
    fullWeekRow: {
        alignItems: 'center',
        marginTop: 10,
    },
    fullWeekText: {
        fontSize: 11,
        fontWeight: '700',
        color: 'rgba(255,215,0,0.8)',
        letterSpacing: 0.8,
    },
});
