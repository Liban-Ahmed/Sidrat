/**
 * SalahReminder — Gentle ambient prayer-time awareness card.
 *
 * Shows the next upcoming salah with:
 *   • Prayer name
 *   • Approximate time
 *   • Soft countdown ("in 2 hours")
 *   • All 5 prayer dots (active one highlighted)
 *
 * Uses approximate fixed times for simplicity — no GPS or API needed.
 * Times can be overridden per-user in future settings.
 *
 * Design: Slim, calming card with warm navy gradient accent.
 * Non-intrusive — acts as a gentle spiritual nudge, not a full tracker.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

// ── Prayer Definitions ──────────────────────────────────────────

interface Prayer {
    name: string;
    /** Arabic name */
    arabic: string;
    /** Default hour (24h) — approximate for most locations */
    defaultHour: number;
    /** Default minute */
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

// ── Helpers ──────────────────────────────────────────────────────

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
    if (diffMinutes < 60) return `in ${diffMinutes} min`;
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

    // All prayers passed — next is Fajr tomorrow
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

// ── Component ───────────────────────────────────────────────────

export function SalahReminder() {
    const { brand, colors, typography, spacing, radius, shadows, isDark } = useTheme();

    const [next, setNext] = useState<NextPrayerInfo>(() => getNextPrayer());

    // Refresh every minute to keep countdown accurate
    useEffect(() => {
        const interval = setInterval(() => {
            setNext(getNextPrayer());
        }, 60_000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Animated.View entering={FadeInDown.duration(500).springify().damping(18)}>
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: colors.surface,
                        borderRadius: radius.lg,
                        borderWidth: 1,
                        borderColor: isDark ? colors.border : brand.primary + '12',
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm + 2,
                        ...shadows.card,
                    },
                ]}
            >
                <View style={styles.row}>
                    {/* Prayer icon */}
                    <View
                        style={[
                            styles.iconCircle,
                            { backgroundColor: brand.primary + '10', borderRadius: radius.full },
                        ]}
                    >
                        <Ionicons name={next.prayer.icon as any} size={18} color={brand.primary} />
                    </View>

                    {/* Prayer info */}
                    <View style={{ flex: 1, marginLeft: spacing.sm }}>
                        <View style={styles.nameRow}>
                            <Text style={[typography.label, { color: colors.text }]}>
                                {next.prayer.name}
                            </Text>
                            <Text style={[typography.caption, { color: colors.textTertiary, marginLeft: spacing.xs }]}>
                                {next.prayer.arabic}
                            </Text>
                        </View>
                        <Text style={[typography.caption, { color: colors.textTertiary, marginTop: 1 }]}>
                            {next.timeLabel}
                        </Text>
                    </View>

                    {/* Countdown badge */}
                    <View
                        style={[
                            styles.countdownBadge,
                            {
                                backgroundColor: brand.primary + '10',
                                borderRadius: radius.full,
                                paddingHorizontal: spacing.sm,
                                paddingVertical: spacing.xxs,
                            },
                        ]}
                    >
                        <Text style={[typography.captionBold, { color: brand.primary }]}>
                            {next.relativeLabel}
                        </Text>
                    </View>
                </View>

                {/* Prayer dots — all 5, active one highlighted */}
                <View style={[styles.dotsRow, { marginTop: spacing.xs }]}>
                    {PRAYERS.map((prayer, i) => {
                        const isPast = i < next.index;
                        const isNext = i === next.index;
                        return (
                            <View key={prayer.name} style={styles.dotItem}>
                                <View
                                    style={[
                                        styles.dot,
                                        {
                                            backgroundColor: isNext
                                                ? brand.primary
                                                : isPast
                                                    ? brand.secondary + '60'
                                                    : colors.textTertiary + '30',
                                            width: isNext ? 8 : 6,
                                            height: isNext ? 8 : 6,
                                            borderRadius: radius.full,
                                        },
                                    ]}
                                />
                                <Text
                                    style={[
                                        typography.caption,
                                        {
                                            color: isNext ? brand.primary : colors.textTertiary,
                                            fontSize: 9,
                                            marginTop: 2,
                                            fontWeight: isNext ? ('600' as const) : ('400' as const),
                                        },
                                    ]}
                                >
                                    {prayer.name.substring(0, 3)}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {},
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    countdownBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dotsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    dotItem: {
        alignItems: 'center',
    },
    dot: {},
});
