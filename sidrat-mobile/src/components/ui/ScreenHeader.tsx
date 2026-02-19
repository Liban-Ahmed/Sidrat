/**
 * ScreenHeader — Premium screen header with gradient hero option.
 *
 * Two modes:
 *  • Standard — Amiri title with decorative accent motif
 *  • Hero — Full-width gradient header with light text, decorative orbs
 *
 * The hero variant gives each screen a distinctive branded feel
 * inspired by Apple Health / Headspace warm headers.
 */

import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';

interface ScreenHeaderProps {
    /** Main title (rendered in Amiri display font via largeTitle) */
    title: string;
    /** Optional subtitle below the title */
    subtitle?: string;
    /** Show decorative accent bar below title */
    accent?: boolean;
    /** Accent color — defaults to brand primary */
    accentColor?: string;
    /** Right-side accessory (e.g. notification bell, avatar) */
    rightAccessory?: React.ReactNode;
    /** Additional styles */
    style?: ViewStyle;
    /** Enable gradient hero mode */
    hero?: boolean;
    /** Gradient colors for hero mode — defaults to theme primary gradient */
    heroColors?: readonly string[] | string[];
    /** Hero mode: emit indicator icon (e.g. a crescent or star) */
    heroIcon?: React.ReactNode;
}

export function ScreenHeader({
    title,
    subtitle,
    accent = true,
    accentColor,
    rightAccessory,
    style,
    hero = false,
    heroColors,
    heroIcon,
}: ScreenHeaderProps) {
    const { colors, brand, typography, spacing, gradients } = useTheme();
    const barColor = accentColor ?? brand.primary;

    if (hero) {
        const gradientPalette = (heroColors ?? gradients.primary) as [string, string, ...string[]];
        return (
            <View style={[styles.heroContainer, style]}>
                <LinearGradient
                    colors={gradientPalette}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
                {/* Decorative orbs for depth */}
                <View style={styles.orbContainer}>
                    <View style={[styles.orb, styles.orbLarge]} />
                    <View style={[styles.orb, styles.orbMedium]} />
                    <View style={[styles.orb, styles.orbSmall]} />
                </View>
                <View style={[styles.heroContent, { paddingHorizontal: spacing.lg }]}>
                    <View style={styles.heroRow}>
                        <View style={styles.textArea}>
                            <Text style={[typography.largeTitle, { color: '#FFFFFF' }]}>
                                {title}
                            </Text>
                            {subtitle && (
                                <Text
                                    style={[
                                        typography.body,
                                        { color: 'rgba(255,255,255,0.75)', marginTop: 2 },
                                    ]}
                                >
                                    {subtitle}
                                </Text>
                            )}
                        </View>
                        {rightAccessory && <View style={styles.heroRight}>{rightAccessory}</View>}
                        {heroIcon && !rightAccessory && <View style={styles.heroRight}>{heroIcon}</View>}
                    </View>
                </View>
                {/* Bottom curve for smooth transition */}
                <View style={[styles.heroCurve, { backgroundColor: colors.background }]} />
            </View>
        );
    }

    // Standard mode
    return (
        <View
            style={[
                styles.container,
                { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xs },
                style,
            ]}
        >
            <View style={styles.row}>
                <View style={styles.textArea}>
                    <Text style={[typography.largeTitle, { color: colors.text }]}>
                        {title}
                    </Text>
                    {accent && (
                        <View style={styles.accentRow}>
                            <View style={[styles.accentBar, { backgroundColor: barColor }]} />
                            <View style={[styles.accentDot, { backgroundColor: barColor + '60' }]} />
                            <View style={[styles.accentDotSm, { backgroundColor: barColor + '30' }]} />
                        </View>
                    )}
                    {subtitle && (
                        <Text
                            style={[
                                typography.body,
                                { color: colors.textSecondary, marginTop: 2 },
                            ]}
                        >
                            {subtitle}
                        </Text>
                    )}
                </View>
                {rightAccessory && <View style={styles.rightSlot}>{rightAccessory}</View>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    textArea: { flex: 1 },
    rightSlot: { marginLeft: 12 },
    accentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 2,
    },
    accentBar: {
        width: 24,
        height: 3,
        borderRadius: 2,
    },
    accentDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
        marginLeft: 5,
        transform: [{ rotate: '45deg' }],
    },
    accentDotSm: {
        width: 3,
        height: 3,
        borderRadius: 2,
        marginLeft: 4,
        transform: [{ rotate: '45deg' }],
    },
    // Hero mode styles
    heroContainer: {
        overflow: 'hidden',
        paddingTop: 16,
        paddingBottom: 28,
    },
    orbContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    orb: {
        position: 'absolute',
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    orbLarge: { width: 200, height: 200, top: -80, right: -50 },
    orbMedium: { width: 120, height: 120, bottom: -30, left: -30 },
    orbSmall: { width: 60, height: 60, top: 20, right: 80 },
    heroContent: {
        paddingTop: 8,
        paddingBottom: 12,
    },
    heroRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    heroRight: { marginLeft: 12 },
    heroCurve: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
});
