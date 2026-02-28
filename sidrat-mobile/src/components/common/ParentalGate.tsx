/**
 * Parental Gate
 *
 * COPPA-compliant parental verification using math challenge.
 * A child must solve an addition problem to access parent features.
 *
 * Uses the theme system for full dark mode support.
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Modal } from 'react-native';
import { useTheme } from '../../theme';

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
  const { brand, colors, typography, spacing, radius, shadows } = useTheme();

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
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderRadius: radius.xl,
              ...shadows.elevated,
            },
          ]}
        >
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: brand.primaryMuted,
                borderRadius: radius.full,
              },
            ]}
          >
            <Ionicons name="lock-closed" size={28} color={brand.primary} />
          </View>

          <Text style={[typography.title3, { color: colors.text, marginBottom: 4 }]}>
            Parent Verification
          </Text>
          <Text
            style={[
              typography.bodySmall,
              { color: colors.textSecondary, marginBottom: spacing.xl },
            ]}
          >
            Please solve this to continue
          </Text>

          <Text
            style={[typography.displaySmall, { color: brand.primary, marginBottom: spacing.md }]}
          >
            {a} + {b} = ?
          </Text>

          {error && (
            <Text style={[typography.bodySmall, { color: colors.error, marginBottom: spacing.xs }]}>
              Incorrect, try again
            </Text>
          )}

          <TextInput
            value={answer}
            onChangeText={setAnswer}
            keyboardType="number-pad"
            style={[
              styles.input,
              {
                borderColor: error ? colors.error : colors.border,
                borderRadius: radius.md,
                color: colors.text,
                backgroundColor: colors.backgroundSecondary,
              },
            ]}
            placeholder="Answer"
            placeholderTextColor={colors.textTertiary}
            maxLength={3}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />

          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              {
                backgroundColor: brand.primary,
                borderRadius: radius.md,
                opacity: pressed ? 0.85 : 1,
                ...shadows.glow(brand.primary),
              },
            ]}
            onPress={handleSubmit}
          >
            <Text style={[typography.labelLarge, { color: '#FFFFFF' }]}>Submit</Text>
          </Pressable>

          <Pressable onPress={handleCancel} hitSlop={12}>
            <Text
              style={[
                typography.label,
                { color: colors.textSecondary, paddingVertical: spacing.xs },
              ]}
            >
              Cancel
            </Text>
          </Pressable>
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
  },
  card: {
    padding: 32,
    width: '85%',
    maxWidth: 360,
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 22,
    fontWeight: '600',
    width: '60%',
    textAlign: 'center',
    marginBottom: 20,
  },
  submitButton: {
    paddingVertical: 14,
    paddingHorizontal: 48,
    alignItems: 'center',
    marginBottom: 12,
  },
});
