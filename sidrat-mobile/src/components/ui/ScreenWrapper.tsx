import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, StatusBar as RNStatusBar, Platform } from 'react-native';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../theme';

interface ScreenWrapperProps extends SafeAreaViewProps {
    children: ReactNode;
    style?: ViewStyle;
    /**
     * If true, uses a gradient background (if available in theme) or primary color.
     * Default: false (uses theme background color).
     */
    useGradientBackground?: boolean;
    /**
     * If true, ignores safe area insets (useful for screens with full-bleed headers).
     * Default: false.
     */
    fullScreen?: boolean;
    /**
     * Status bar style override.
     * Default: based on theme mode.
     */
    statusBarStyle?: 'light' | 'dark' | 'auto';
}

export function ScreenWrapper({
    children,
    style,
    useGradientBackground = false,
    fullScreen = false,
    statusBarStyle,
    edges = ['top', 'left', 'right', 'bottom'], // Default edges from safe-area-context
    ...props
}: ScreenWrapperProps) {
    const { colors, mode } = useTheme();

    const containerStyle = [
        styles.container,
        { backgroundColor: useGradientBackground ? colors.primary : colors.background },
        style,
    ];

    const computedStatusBarStyle = statusBarStyle ?? (mode === 'dark' ? 'light' : 'dark');

    if (fullScreen) {
        return (
            <View style={containerStyle} {...props}>
                <StatusBar style={computedStatusBarStyle} />
                {children}
            </View>
        );
    }

    return (
        <SafeAreaView style={containerStyle} edges={edges} {...props}>
            <StatusBar style={computedStatusBarStyle} />
            {children}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
