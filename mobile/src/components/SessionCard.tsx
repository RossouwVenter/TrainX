import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, radius, shadows } from '../styles/tokens';
import { getDisciplineColor } from '../utils/discipline';
import { DisciplineBadge } from './DisciplineBadge';
import { StatusBadge } from './StatusBadge';
import type { Session } from '../types';

interface SessionCardProps {
  session: Session;
}

export function SessionCard({ session }: SessionCardProps) {
  const router = useRouter();
  const borderColor = getDisciplineColor(session.discipline);

  return (
    <Pressable
      onPress={() => router.push(`/session/${session.id}`)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.border, { backgroundColor: borderColor }]} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>{session.title}</Text>
          <StatusBadge status={session.status} />
        </View>
        <View style={styles.bottomRow}>
          <DisciplineBadge discipline={session.discipline} />
          <Text style={styles.duration}>{session.duration} min</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    ...shadows.md,
  },
  pressed: {
    opacity: 0.9,
  },
  border: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  duration: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
