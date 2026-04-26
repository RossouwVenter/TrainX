import { useState, useCallback } from 'react';
import type { Feedback } from '../types';
import { submitFeedback as sendFeedback, getFeedback as fetchFeedback } from '../services/feedback.service';
import { showAlert } from '../utils/alert';

export function useFeedback(sessionId: string | undefined) {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadFeedback = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      const data = await fetchFeedback(sessionId);
      setFeedback(data);
    } catch {
      // No feedback yet
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const submitFeedback = useCallback(async (data: {
    sessionId: string;
    athleteId: string;
    rpe: number;
    notes?: string;
    completed: boolean;
  }) => {
    setSubmitting(true);
    try {
      const result = await sendFeedback(data);
      setFeedback(result);
      showAlert('Success', 'Feedback submitted!');
      return result;
    } catch {
      showAlert('Error', 'Failed to submit feedback');
      return null;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { feedback, loading, submitting, loadFeedback, submitFeedback };
}
