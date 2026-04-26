import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useWeekSchedule } from '../../src/hooks/useWeekSchedule';
import { WeekSelector } from '../../src/components/WeekSelector';
import { WeekTotals } from '../../src/components/WeekTotals';
import { DaySection } from '../../src/components/DaySection';
import { EmptyState } from '../../src/components/EmptyState';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';
import { getWeekStart, addWeeks, toISODate } from '../../src/utils/date';
import { colors, spacing, typography, radius, shadows } from '../../src/styles/tokens';
import api from '../../src/services/api';
import type { User } from '../../src/types';

export default function AthleteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const [athlete, setAthlete] = useState<User | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const weekStart = useMemo(() => addWeeks(getWeekStart(new Date()), weekOffset), [weekOffset]);
  const weekOf = toISODate(weekStart);

  const { schedule, loading } = useWeekSchedule(id, weekOf);

  // Fetch athlete details
  React.useEffect(() => {
    if (id) {
      api.get<User>(`/athletes/${id}`).then((res) => setAthlete(res.data)).catch(() => {});
    }
  }, [id]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: spacing.xxl + insets.bottom }]}>
        {athlete && (
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{athlete.name.charAt(0)}</Text>
            </View>
            <Text style={styles.name}>{athlete.name}</Text>
            <Text style={styles.email}>{athlete.email}</Text>
          </View>
        )}

        <WeekSelector
          weekStart={weekStart}
          onPrevWeek={() => setWeekOffset((o) => o - 1)}
          onNextWeek={() => setWeekOffset((o) => o + 1)}
        />

        {loading ? (
          <LoadingSpinner />
        ) : schedule ? (
          <>
            <WeekTotals totals={schedule.totals} />
            {schedule.days.some((d) => d.sessions.length > 0) ? (
              schedule.days.map((day) => (
                <DaySection key={day.date} day={day} />
              ))
            ) : (
              <EmptyState message="No sessions this week" icon="calendar-outline" />
            )}
          </>
        ) : (
          <EmptyState message="Failed to load schedule" icon="alert-circle-outline" />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {},
  header: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderRadius: radius.lg,
    ...shadows.sm,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  name: {
    ...typography.h2,
    color: colors.text,
  },
  email: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
