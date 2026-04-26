import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, typography, radius, shadows } from '../styles/tokens';

interface FeedbackFormProps {
  onSubmit: (data: { rpe: number; notes: string; completed: boolean }) => void;
  submitting?: boolean;
}

export function FeedbackForm({ onSubmit, submitting }: FeedbackFormProps) {
  const [rpe, setRpe] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [completed, setCompleted] = useState(true);

  const handleSubmit = () => {
    if (rpe === null) return;
    onSubmit({ rpe, notes, completed });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Session Feedback</Text>

      <Text style={styles.label}>Rate of Perceived Exertion (RPE)</Text>
      <View style={styles.rpeRow}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
          <Pressable
            key={val}
            onPress={() => setRpe(val)}
            style={[styles.rpeButton, rpe === val && styles.rpeButtonActive]}
          >
            <Text style={[styles.rpeText, rpe === val && styles.rpeTextActive]}>{val}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={styles.textInput}
        placeholder="How did the session go?"
        placeholderTextColor={colors.textLight}
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
      />

      <Pressable
        onPress={() => setCompleted(!completed)}
        style={styles.toggleRow}
      >
        <View style={[styles.checkbox, completed && styles.checkboxActive]}>
          {completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.toggleLabel}>Session completed</Text>
      </Pressable>

      <Pressable
        onPress={handleSubmit}
        disabled={rpe === null || submitting}
        style={[styles.submitButton, (rpe === null || submitting) && styles.submitDisabled]}
      >
        <Text style={styles.submitText}>
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    margin: spacing.md,
    ...shadows.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  rpeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  rpeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rpeButtonActive: {
    backgroundColor: colors.primary,
  },
  rpeText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  rpeTextActive: {
    color: colors.surface,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.sm,
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.md,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  checkboxActive: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkmark: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  toggleLabel: {
    ...typography.body,
    color: colors.text,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitText: {
    ...typography.label,
    color: colors.surface,
  },
});
