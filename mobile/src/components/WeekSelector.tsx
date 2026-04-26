import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../styles/tokens';
import { formatDateRange, getWeekStart, getWeekEnd } from '../utils/date';

interface WeekSelectorProps {
  weekStart: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

export function WeekSelector({ weekStart, onPrevWeek, onNextWeek }: WeekSelectorProps) {
  const weekEnd = getWeekEnd(weekStart);
  const label = formatDateRange(weekStart, weekEnd);

  return (
    <View style={styles.container}>
      <Pressable onPress={onPrevWeek} style={styles.arrow} hitSlop={8}>
        <Ionicons name="chevron-back" size={24} color={colors.primary} />
      </Pressable>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={onNextWeek} style={styles.arrow} hitSlop={8}>
        <Ionicons name="chevron-forward" size={24} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },
  arrow: {
    padding: spacing.xs,
  },
  label: {
    ...typography.label,
    color: colors.text,
  },
});
