import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../styles/tokens';
import type { DaySchedule as DayScheduleType } from '../types';
import { SessionCard } from './SessionCard';

interface DaySectionProps {
  day: DayScheduleType;
}

export function DaySection({ day }: DaySectionProps) {
  if (day.sessions.length === 0) return null;

  const dateObj = new Date(day.date);
  const dateLabel = `${day.dayName} · ${dateObj.getDate()}/${dateObj.getMonth() + 1}`;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{dateLabel}</Text>
      {day.sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    ...typography.label,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
