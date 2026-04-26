import { useState, useEffect, useCallback } from 'react';
import type { Session } from '../types';
import api from '../services/api';

export function useSession(sessionId: string | undefined) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<Session>(`/sessions/${sessionId}`);
      setSession(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load session');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { session, loading, error, refetch };
}
