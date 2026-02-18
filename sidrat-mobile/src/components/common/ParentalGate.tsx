/**
 * Parental Gate
 *
 * COPPA-compliant parental verification using math challenge.
 * A child must solve an addition problem to access parent features.
 *
 * Used for: Settings, adding children, viewing detailed progress,
 * subscription management.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { brand } from '../../theme/colors';

interface ParentalGateProps {
    visible: boolean;
    onSuccess: () => void;
    onCancel: () => void;
}

export function ParentalGate({ visible, onSuccess, onCancel }: ParentalGateProps) {
    const [a] = useState(() => Math.floor(Math.random() * 11) + 12);
    const [b] = useState(() => Math.floor(Math.random() * 10) + 5);
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = useCallback(() => {
        if (parseInt(answer, 10) === a + b) {
            setAnswer('');
            setError(false);
            onSuccess();
        } else {
            setError(true);
            setAnswer('');
        }
    }, [answer, a, b, onSuccess]);

    const handleCancel = useCallback(() => {
        setAnswer('');
        setError(false);
        onCancel();
    }, [onCancel]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="lock-closed" size={28} color={brand.primary} />
                    </View>

                    <Text style={styles.title}>Parent Verification</Text>
                    <Text style={styles.subtitle}>
                        Please solve this to continue
                    </Text>

                    <Text style={styles.equation}>
                        {a} + {b} = ?
                    </Text>

                    {error && (
                        <Text style={styles.error}>Incorrect, try again</Text>
                    )}

                    <TextInput
                        value={answer}
                        onChangeText={setAnswer}
                        keyboardType="number-pad"
                        style={[styles.input, error && styles.inputError]}
                        placeholder="Answer"
                        placeholderTextColor="#9CA3AF"
                        maxLength={3}
                        autoFocus
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit}
                    />

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.submitText}>Submit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleCancel}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 32,
        width: '85%',
        maxWidth: 360,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 12,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: `${brand.primary}15`,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2C3E3F',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 24,
    },
    equation: {
        fontSize: 36,
        fontWeight: '700',
        color: brand.primary,
        marginBottom: 16,
    },
    error: {
        fontSize: 14,
        color: '#DC2626',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        fontSize: 22,
        fontWeight: '600',
        width: '60%',
        textAlign: 'center',
        color: '#2C3E3F',
        marginBottom: 20,
    },
    inputError: {
        borderColor: '#DC2626',
    },
    submitButton: {
        backgroundColor: brand.primary,
        paddingVertical: 14,
        paddingHorizontal: 48,
        borderRadius: 12,
        marginBottom: 12,
    },
    submitText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelText: {
        fontSize: 14,
        color: '#6B7280',
        paddingVertical: 8,
    },
});
