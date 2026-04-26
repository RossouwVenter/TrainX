import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, radius, shadows } from '../styles/tokens';
import type { Feedback } from '../types';

interface FeedbackDisplayProps {
  feedback: Feedback;
}

export function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Athlete Feedback</Text>

      <View style={styles.rpeRow}>
        <View style={styles.rpeCircle}>
          <Text style={styles.rpeValue}>{feedback.rpe}</Text>
          <Text style={styles.rpeLabel}>RPE</Text>
        </View>
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>
            {feedback.completed ? '✓ Completed' : '✗ Not Completed'}
          </Text>
        </View>
      </View>

      {feedback.notes ? (
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Notes</Text>
          <Text style={styles.notesText}>{feedback.notes}</Text>
        </View>
      ) : null}
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
  rpeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  rpeCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rpeValue: {
    ...typography.h2,
    color: colors.primary,
  },
  rpeLabel: {
    ...typography.caption,
    color: colors.primary,
  },
  statusContainer: {
    flex: 1,
  },
  statusLabel: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  notesSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  notesLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  notesText: {
    ...typography.body,
    color: colors.text,
  },
});
