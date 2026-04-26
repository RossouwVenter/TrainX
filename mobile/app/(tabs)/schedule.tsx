import React, { useState, useMemo, useCallback } from 'react';
import { View, ScrollView, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { useWeekSchedule } from '../../src/hooks/useWeekSchedule';
import { useAthletes } from '../../src/hooks/useAthletes';
import { useAIPlanner } from '../../src/hooks/useAIPlanner';
import { WeekSelector } from '../../src/components/WeekSelector';
import { WeekTotals } from '../../src/components/WeekTotals';
import { DaySection } from '../../src/components/DaySection';
import { EmptyState } from '../../src/components/EmptyState';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';
import { FAB } from '../../src/components/FAB';
import { AIPlannerModal } from '../../src/components/AIPlannerModal';
import { getWeekStart, addWeeks, toISODate } from '../../src/utils/date';
import { showAlert } from '../../src/utils/alert';
import { createSession } from '../../src/services/session.service';
import { colors, spacing, typography, radius, shadows } from '../../src/styles/tokens';

export default function ScheduleScreen() {
  const router = useRouter();
  const { currentUser, role } = useAuth();
  const isCoach = role === 'COACH';

  // Week navigation
  const [weekOffset, setWeekOffset] = useState(0);
  const weekStart = useMemo(() => addWeeks(getWeekStart(new Date()), weekOffset), [weekOffset]);
  const weekOf = toISODate(weekStart);

  // Athlete selector for coach
  const { athletes } = useAthletes();
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);
  const [showAthleteDropdown, setShowAthleteDropdown] = useState(false);

  const athleteId = isCoach
    ? selectedAthleteId || athletes[0]?.id
    : currentUser?.id;

  const selectedAthlete = athletes.find((a) => a.id === athleteId);

  const { schedule, loading, refetch } = useWeekSchedule(athleteId, weekOf);

  // AI Planner
  const [showAIModal, setShowAIModal] = useState(false);
  const { loading: aiLoading, generatePlan } = useAIPlanner();

  const handleAIPlan = useCallback(async (instructions: string) => {
    if (!athleteId || !currentUser) return;
    const result = await generatePlan({
      athleteId,
      coachId: currentUser.id,
      weekOf,
      instructions,
    });
    if (result) {
      // Create sessions from AI plan
      for (const s of result.sessions) {
        await createSession({
          ...s,
          athleteId,
          coachId: currentUser.id,
        });
      }
      setShowAIModal(false);
      showAlert('Success', `${result.sessions.length} sessions created!`);
      refetch();
    }
  }, [athleteId, currentUser, weekOf, generatePlan, refetch]);

  if (!currentUser) return null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Coach athlete selector */}
        {isCoach && athletes.length > 0 && (
          <View style={styles.athleteSelector}>
            <Pressable
              onPress={() => setShowAthleteDropdown(!showAthleteDropdown)}
              style={styles.selectorButton}
            >
              <Ionicons name="person" size={18} color={colors.primary} />
              <Text style={styles.selectorText}>
                {selectedAthlete?.name || 'Select Athlete'}
              </Text>
              <Ionicons
                name={showAthleteDropdown ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={colors.textSecondary}
              />
            </Pressable>
            {showAthleteDropdown && (
              <View style={styles.dropdown}>
                {athletes.map((a) => (
                  <Pressable
                    key={a.id}
                    onPress={() => {
                      setSelectedAthleteId(a.id);
                      setShowAthleteDropdown(false);
                    }}
                    style={[styles.dropdownItem, a.id === athleteId && styles.dropdownItemActive]}
                  >
                    <Text style={[styles.dropdownText, a.id === athleteId && styles.dropdownTextActive]}>
                      {a.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
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
          <EmptyState
            message={athleteId ? 'Failed to load schedule' : 'Select an athlete to view schedule'}
            icon="calendar-outline"
          />
        )}
      </ScrollView>

      {/* Coach FABs */}
      {isCoach && athleteId && (
        <>
          <View style={styles.fabGroup}>
            <Pressable
              onPress={() => setShowAIModal(true)}
              style={[styles.miniFab, { marginBottom: spacing.sm }]}
            >
              <Ionicons name="sparkles" size={22} color={colors.surface} />
            </Pressable>
            <FAB
              icon="add"
              onPress={() => router.push({
                pathname: '/session/create',
                params: { athleteId, weekOf },
              })}
            />
          </View>

          <AIPlannerModal
            visible={showAIModal}
            loading={aiLoading}
            onClose={() => setShowAIModal(false)}
            onGenerate={handleAIPlan}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: 100,
  },
  athleteSelector: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    zIndex: 10,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    ...shadows.sm,
  },
  selectorText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginLeft: spacing.sm,
  },
  dropdown: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginTop: spacing.xs,
    ...shadows.md,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemActive: {
    backgroundColor: colors.primaryLight,
  },
  dropdownText: {
    ...typography.body,
    color: colors.text,
  },
  dropdownTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  fabGroup: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    alignItems: 'center',
  },
  miniFab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
});
