/**
 * SalahReminder — Slim ambient prayer-time banner.
 *
 * Shows the next upcoming salah as a single-line inline row
 * with prayer dots below. No card wrapper -- renders directly on background.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface Prayer {
    name: string;
    arabic: string;
    defaultHour: number;
    defaultMinute: number;
    icon: string;
}

const PRAYERS: Prayer[] = [
    { name: 'Fajr', arabic: 'الفجر', defaultHour: 5, defaultMinute: 30, icon: 'sunny-outline' },
    { name: 'Dhuhr', arabic: 'الظهر', defaultHour: 12, defaultMinute: 30, icon: 'sunny' },
    { name: 'Asr', arabic: 'العصر', defaultHour: 15, defaultMinute: 45, icon: 'partly-sunny-outline' },
    { name: 'Maghrib', arabic: 'المغرب', defaultHour: 18, defaultMinute: 15, icon: 'moon-outline' },
    { name: 'Isha', arabic: 'العشاء', defaultHour: 20, defaultMinute: 0, icon: 'moon' },
];

function getPrayerMinutes(prayer: Prayer): number {
    return prayer.defaultHour * 60 + prayer.defaultMinute;
}

function formatTime(hour: number, minute: number): string {
    const h = hour % 12 || 12;
    const period = hour < 12 ? 'AM' : 'PM';
    return `${h}:${minute.toString().padStart(2, '0')} ${period}`;
}

function getRelativeTimeLabel(diffMinutes: number): string {
    if (diffMinutes <= 0) return 'Now';
    if (diffMinutes < 60) return `in ${diffMinutes}m`;
    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    if (mins === 0) return `in ${hours}h`;
    return `in ${hours}h ${mins}m`;
}

interface NextPrayerInfo {
    prayer: Prayer;
    index: number;
    minutesUntil: number;
    timeLabel: string;
    relativeLabel: string;
}

function getNextPrayer(): NextPrayerInfo {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (let i = 0; i < PRAYERS.length; i++) {
        const prayer = PRAYERS[i]!;
        const prayerMins = getPrayerMinutes(prayer);
        if (prayerMins > currentMinutes) {
            return {
                prayer,
                index: i,
                minutesUntil: prayerMins - currentMinutes,
                timeLabel: formatTime(prayer.defaultHour, prayer.defaultMinute),
                relativeLabel: getRelativeTimeLabel(prayerMins - currentMinutes),
            };
        }
    }

    const fajr = PRAYERS[0]!;
    const fajrMins = getPrayerMinutes(fajr);
    const minutesUntil = (24 * 60 - currentMinutes) + fajrMins;
    return {
        prayer: fajr,
        index: 0,
        minutesUntil,
        timeLabel: formatTime(fajr.defaultHour, fajr.defaultMinute),
        relativeLabel: getRelativeTimeLabel(minutesUntil),
    };
}

export function SalahReminder() {
    const { brand, colors, typography, spacing, radius, isDark } = useTheme();

    const [next, setNext] = useState<NextPrayerInfo>(() => getNextPrayer());

    useEffect(() => {
        const interval = setInterval(() => {
            setNext(getNextPrayer());
        }, 60_000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Animated.View entering={FadeInDown.duration(500).springify().damping(18)}>
            <View style={styles.row}>
                <Ionicons name={next.prayer.icon as any} size={16} color={brand.primary} />
                <Text style={[typography.label, { color: colors.text, marginLeft: spacing.xs }]}>
                    {next.prayer.name}
                </Text>
                <Text style={[typography.caption, { color: colors.textTertiary, marginLeft: 4 }]}>
                    {next.prayer.arabic}
                </Text>
                <View style={{ flex: 1 }} />
                <Text style={[typography.caption, { color: colors.textTertiary }]}>
                    {next.timeLabel}
                </Text>
                <View
                    style={[
                        styles.countdownPill,
                        {
                            backgroundColor: brand.primary + '10',
                            borderRadius: radius.full,
                            marginLeft: spacing.xs,
                        },
                    ]}
                >
                    <Text style={[typography.captionBold, { color: brand.primary, fontSize: 11 }]}>
                        {next.relativeLabel}
                    </Text>
                </View>
            </View>

            <View style={[styles.dotsRow, { marginTop: spacing.xs }]}>
                {PRAYERS.map((prayer, i) => {
                    const isPast = i < next.index;
                    const isNext = i === next.index;
                    return (
                        <View key={prayer.name} style={styles.dotItem}>
                            <View
                                style={{
                                    backgroundColor: isNext
                                        ? brand.primary
                                        : isPast
                                            ? brand.secondary + (isDark ? '80' : '60')
                                            : isDark ? 'rgba(255,255,255,0.18)' : colors.textTertiary + '30',
                                    width: isNext ? 6 : 5,
                                    height: isNext ? 6 : 5,
                                    borderRadius: radius.full,
                                }}
                            />
                        </View>
                    );
                })}
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    countdownPill: {
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    dotsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    dotItem: {
        alignItems: 'center',
    },
});
