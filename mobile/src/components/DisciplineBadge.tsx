import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, radius } from '../styles/tokens';
import { getDisciplineColor, getDisciplineLabel } from '../utils/discipline';
import type { Discipline } from '../types';

interface DisciplineBadgeProps {
  discipline: Discipline;
}

export function DisciplineBadge({ discipline }: DisciplineBadgeProps) {
  const color = getDisciplineColor(discipline);
  const label = getDisciplineLabel(discipline);

  return (
    <View style={[styles.badge, { backgroundColor: color + '26' }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  text: {
    ...typography.caption,
    fontWeight: '600',
  },
});
