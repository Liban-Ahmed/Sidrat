/**
 * SalahReminderOasis — Slim prayer-time banner using Oasis tokens.
 *
 * Shows the next upcoming salah as a single-line inline row
 * with prayer dots below. Uses olive400 as primary accent,
 * Oasis semantic colors for all UI.
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useOasisColors } from '../../hooks/useOasisColors';
import { SPACING, RADIUS } from '../../theme/tokens';

interface Prayer {
  name: string;
  arabic: string;
  defaultHour: number;
  defaultMinute: number;
  icon: keyof typeof Ionicons.glyphMap;
}

const PRAYERS: Prayer[] = [
  { name: 'Fajr', arabic: 'الفجر', defaultHour: 5, defaultMinute: 30, icon: 'sunny-outline' },
  { name: 'Dhuhr', arabic: 'الظهر', defaultHour: 12, defaultMinute: 30, icon: 'sunny' },
  {
    name: 'Asr',
    arabic: 'العصر',
    defaultHour: 15,
    defaultMinute: 45,
    icon: 'partly-sunny-outline',
  },
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
  const minutesUntil = 24 * 60 - currentMinutes + fajrMins;
  return {
    prayer: fajr,
    index: 0,
    minutesUntil,
    timeLabel: formatTime(fajr.defaultHour, fajr.defaultMinute),
    relativeLabel: getRelativeTimeLabel(minutesUntil),
  };
}

export function SalahReminderOasis() {
  const { colors: oasis, t, isDark } = useOasisColors();
  const [next, setNext] = useState<NextPrayerInfo>(() => getNextPrayer());

  useEffect(() => {
    const interval = setInterval(() => {
      setNext(getNextPrayer());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.View
      entering={FadeInDown.duration(500).springify().damping(18)}
      accessible
      accessibilityLabel={`Next prayer: ${next.prayer.name} at ${next.timeLabel}, ${next.relativeLabel}`}
      accessibilityRole="text"
    >
      <View style={styles.row}>
        <Ionicons name={next.prayer.icon} size={16} color={oasis.primary} />
        <Text style={[styles.prayerName, { color: oasis.textPrimary }]}>{next.prayer.name}</Text>
        <Text style={[styles.prayerArabic, { color: oasis.textMuted }]}>{next.prayer.arabic}</Text>
        <View style={{ flex: 1 }} />
        <Text style={[styles.timeLabel, { color: oasis.textMuted }]}>{next.timeLabel}</Text>
        <View
          style={[
            styles.countdownPill,
            {
              backgroundColor: isDark ? oasis.primaryLight : t.olive50,
            },
          ]}
        >
          <Text style={[styles.countdownText, { color: oasis.primary }]}>{next.relativeLabel}</Text>
        </View>
      </View>

      <View style={styles.dotsRow}>
        {PRAYERS.map((prayer, i) => {
          const isPast = i < next.index;
          const isNext = i === next.index;
          return (
            <View key={prayer.name} style={styles.dotItem}>
              <View
                style={{
                  backgroundColor: isNext
                    ? oasis.primary
                    : isPast
                      ? oasis.primaryBorder
                      : isDark
                        ? oasis.surfaceBorder
                        : t.sand200,
                  width: isNext ? 6 : 5,
                  height: isNext ? 6 : 5,
                  borderRadius: RADIUS.full,
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
  prayerName: {
    fontFamily: 'Nunito-Bold',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: SPACING.xs,
  },
  prayerArabic: {
    fontFamily: 'Amiri-Regular',
    fontSize: 14,
    marginLeft: 4,
  },
  timeLabel: {
    fontFamily: 'Nunito-Regular',
    fontSize: 13,
  },
  countdownPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    marginLeft: SPACING.xs,
  },
  countdownText: {
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    fontSize: 11,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: SPACING.xs,
  },
  dotItem: {
    alignItems: 'center',
  },
});
