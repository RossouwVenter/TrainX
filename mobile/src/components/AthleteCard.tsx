import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius, shadows } from '../styles/tokens';
import type { AthleteWithStats } from '../types';

interface AthleteCardProps {
  athlete: AthleteWithStats;
  onRemove?: () => void;
}

export function AthleteCard({ athlete, onRemove }: AthleteCardProps) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/athlete/${athlete.id}`)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{athlete.name.charAt(0)}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{athlete.name}</Text>
          <Text style={styles.email}>{athlete.email}</Text>
        </View>
        {onRemove && (
          <Pressable
            onPress={(e) => { e.stopPropagation(); onRemove(); }}
            hitSlop={8}
            style={({ pressed }) => [styles.removeBtn, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </Pressable>
        )}
      </View>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{athlete.sessionsThisWeek}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{athlete.completionRate}%</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${athlete.completionRate}%` }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.md,
  },
  pressed: { opacity: 0.9 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    ...typography.h3,
    color: colors.primary,
  },
  info: { flex: 1 },
  removeBtn: {
    padding: spacing.xs,
  },
  name: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  email: {
    ...typography.caption,
    color: colors.textLight,
  },
  stats: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  stat: {
    marginRight: spacing.lg,
  },
  statValue: {
    ...typography.h3,
    color: colors.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    backgroundColor: colors.success,
    borderRadius: 3,
  },
});
