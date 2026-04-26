import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'expo-router';
import type { AthleteWithStats } from '../types';
import { getAthletes } from '../services/athlete.service';

export function useAthletes() {
  const [athletes, setAthletes] = useState<AthleteWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAthletes();
      setAthletes(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load athletes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Refetch whenever the screen gains focus (pathname changes back to this screen)
  useEffect(() => {
    refetch();
  }, [pathname, refetch]);

  return { athletes, loading, error, refetch };
}
