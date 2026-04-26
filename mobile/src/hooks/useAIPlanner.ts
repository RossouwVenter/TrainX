import { useState, useCallback } from 'react';
import type { AIPlanRequest, AIPlanResponse } from '../types';
import { planWeek } from '../services/agent.service';
import { showAlert } from '../utils/alert';

export function useAIPlanner() {
  const [plan, setPlan] = useState<AIPlanResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const generatePlan = useCallback(async (data: AIPlanRequest) => {
    setLoading(true);
    try {
      const result = await planWeek(data);
      setPlan(result);
      return result;
    } catch {
      showAlert('Error', 'Failed to generate AI plan');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearPlan = useCallback(() => setPlan(null), []);

  return { plan, loading, generatePlan, clearPlan };
}
