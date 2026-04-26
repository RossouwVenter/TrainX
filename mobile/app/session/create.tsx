import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { createSession } from '../../src/services/session.service';
import { getDisciplineColor, getDisciplineLabel } from '../../src/utils/discipline';
import { showAlert } from '../../src/utils/alert';
import { colors, spacing, typography, radius, shadows } from '../../src/styles/tokens';
import type { Discipline } from '../../src/types';

const DISCIPLINES: Discipline[] = ['SWIM', 'BIKE', 'RUN', 'STRENGTH', 'FLEXIBILITY', 'REST', 'OTHER'];

export default function CreateSessionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { athleteId, weekOf } = useLocalSearchParams<{ athleteId: string; weekOf: string }>();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discipline, setDiscipline] = useState<Discipline | null>(null);
  const [date, setDate] = useState(weekOf || '');
  const [duration, setDuration] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !discipline || !date || !duration || !athleteId || !currentUser) {
      showAlert('Missing Fields', 'Please fill in all required fields');
      return;
    }

    const durationNum = parseInt(duration, 10);
    if (isNaN(durationNum) || durationNum <= 0) {
      showAlert('Invalid Duration', 'Duration must be a positive number');
      return;
    }

    setSubmitting(true);
    try {
      await createSession({
        title: title.trim(),
        description: description.trim() || undefined,
        discipline,
        date,
        duration: durationNum,
        athleteId,
        coachId: currentUser.id,
      });
      showAlert('Success', 'Session created!');
      router.back();
    } catch {
      showAlert('Error', 'Failed to create session');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.scroll, { paddingBottom: spacing.xxl + insets.bottom }]}>
      <View style={styles.card}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Morning Swim"
          placeholderTextColor={colors.textLight}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Session details..."
          placeholderTextColor={colors.textLight}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Discipline *</Text>
        <View style={styles.disciplineGrid}>
          {DISCIPLINES.map((d) => {
            const color = getDisciplineColor(d);
            const isSelected = discipline === d;
            return (
              <Pressable
                key={d}
                onPress={() => setDiscipline(d)}
                style={[
                  styles.disciplineButton,
                  isSelected && { backgroundColor: color + '20', borderColor: color },
                ]}
              >
                <Text style={[styles.disciplineText, isSelected && { color }]}>
                  {getDisciplineLabel(d)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Date * (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="2026-04-27"
          placeholderTextColor={colors.textLight}
          value={date}
          onChangeText={setDate}
        />

        <Text style={styles.label}>Duration (minutes) *</Text>
        <TextInput
          style={styles.input}
          placeholder="60"
          placeholderTextColor={colors.textLight}
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />

        <Pressable
          onPress={handleSubmit}
          disabled={submitting}
          style={[styles.submitButton, submitting && styles.disabled]}
        >
          <Text style={styles.submitText}>
            {submitting ? 'Creating...' : 'Create Session'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadows.md,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.sm,
    ...typography.body,
    color: colors.text,
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  disciplineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  disciplineButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  disciplineText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  disabled: { opacity: 0.5 },
  submitText: {
    ...typography.label,
    color: colors.surface,
  },
});
