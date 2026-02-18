/**
 * Error Boundary
 *
 * Catches React rendering errors and shows a friendly fallback.
 * Logs to Sentry in production.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <Screen />
 *   </ErrorBoundary>
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Appearance } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Sentry from '@sentry/react-native';
import { brand, palette } from '../../theme/colors';

interface Props {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log to Sentry in production
        Sentry.captureException(error, { extra: { componentStack: errorInfo.componentStack } });
        console.error('[ErrorBoundary]', error, errorInfo.componentStack);
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Class components can't use hooks, so read scheme imperatively
            const isDark = Appearance.getColorScheme() === 'dark';
            const colors = isDark ? palette.dark : palette.light;

            return (
                <View style={[styles.container, { backgroundColor: colors.background }]}>
                    <View
                        style={[
                            styles.iconContainer,
                            { backgroundColor: brand.primaryMuted },
                        ]}
                    >
                        <Ionicons name="cloudy-night-outline" size={64} color={brand.primary} />
                    </View>
                    <Text style={[styles.title, { color: colors.text }]}>Oops! Something went wrong</Text>
                    <Text style={[styles.message, { color: colors.textSecondary }]}>
                        Don&apos;t worry, let&apos;s try again InshaAllah
                    </Text>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: brand.primary }]}
                        onPress={this.handleRetry}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.buttonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center' as const,
    },
    message: {
        fontSize: 16,
        textAlign: 'center' as const,
        marginTop: 8,
        lineHeight: 24,
    },
    button: {
        marginTop: 32,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 14,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
