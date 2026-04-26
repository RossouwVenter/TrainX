import { useState, useEffect, useCallback } from 'react';
import type { WeekSchedule } from '../types';
import { getWeekSchedule as fetchSchedule } from '../services/session.service';

export function useWeekSchedule(athleteId: string | undefined, weekOf?: string) {
  const [schedule, setSchedule] = useState<WeekSchedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!athleteId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSchedule(athleteId, weekOf);
      setSchedule(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load schedule');
    } finally {
      setLoading(false);
    }
  }, [athleteId, weekOf]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { schedule, loading, error, refetch };
}
