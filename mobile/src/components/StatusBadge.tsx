import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, radius } from '../styles/tokens';
import type { SessionStatus } from '../types';

const STATUS_CONFIG: Record<SessionStatus, { bg: string; color: string; label: string }> = {
  PLANNED: { bg: colors.border, color: colors.textSecondary, label: 'Planned' },
  COMPLETED: { bg: colors.success + '20', color: colors.success, label: 'Completed' },
  SKIPPED: { bg: colors.warning + '20', color: colors.warning, label: 'Skipped' },
  MODIFIED: { bg: colors.secondary + '20', color: colors.secondary, label: 'Modified' },
};

interface StatusBadgeProps {
  status: SessionStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  text: {
    ...typography.caption,
    fontWeight: '600',
  },
});
