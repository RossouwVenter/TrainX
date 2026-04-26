import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing, typography, radius, shadows } from '../styles/tokens';
import { getDisciplineColor, getDisciplineLabel } from '../utils/discipline';
import type { DisciplineTotals, Discipline } from '../types';

interface WeekTotalsProps {
  totals: DisciplineTotals;
}

export function WeekTotals({ totals }: WeekTotalsProps) {
  const entries = Object.entries(totals).filter(([, v]) => v.count > 0);
  if (entries.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
    >
      {entries.map(([discipline, data]) => {
        const color = getDisciplineColor(discipline as Discipline);
        return (
          <View key={discipline} style={[styles.card, { borderTopColor: color }]}>
            <Text style={[styles.discipline, { color }]}>
              {getDisciplineLabel(discipline as Discipline)}
            </Text>
            <Text style={styles.count}>{data.count} sessions</Text>
            <Text style={styles.minutes}>{data.totalMinutes} min</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginRight: spacing.sm,
    minWidth: 120,
    borderTopWidth: 3,
    ...shadows.sm,
  },
  discipline: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  count: {
    ...typography.bodySmall,
    color: colors.text,
  },
  minutes: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
