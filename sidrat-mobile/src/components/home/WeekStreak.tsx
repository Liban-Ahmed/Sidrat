/**
 * WeekStreak — 7-day crescent tracker (Islamic motif).
 *
 * Features:
 *  • Today is highlighted with a ring + bold label
 *  • Active days show a filled crescent
 *  • Subtle divider from content above
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MiniCrescent } from './MiniCrescent';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

interface WeekStreakProps {
    streak: number;
    parentBg: string;
}

export function WeekStreak({ streak, parentBg }: WeekStreakProps) {
    const today = new Date().getDay(); // 0=Sun
    return (
        <View style={styles.row} accessible accessibilityLabel={`Weekly streak: ${streak} days active`}>
            {WEEKDAYS.map((day, i) => {
                const daysAgo = (today - i + 7) % 7;
                const isActive = daysAgo < streak && daysAgo >= 0;
                const isToday = i === today;
                return (
                    <View key={i} style={styles.item}>
                        <Text
                            style={[
                                styles.label,
                                {
                                    color: isToday
                                        ? '#FFFFFF'
                                        : 'rgba(255,255,255,0.35)',
                                    fontWeight: isToday ? '700' : '600',
                                },
                            ]}
                        >
                            {day}
                        </Text>
                        <View style={styles.indicatorWrap}>
                            {isToday && <View style={styles.todayRing} />}
                            <MiniCrescent
                                active={isActive || isToday}
                                parentBg={parentBg}
                            />
                        </View>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingTop: 14,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgba(255,255,255,0.08)',
    },
    item: {
        alignItems: 'center',
        gap: 6,
    },
    label: {
        fontSize: 10,
        letterSpacing: 0.5,
    },
    indicatorWrap: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    todayRing: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.2)',
    },
});
