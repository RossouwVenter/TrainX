import api from './api';
import type { Feedback } from '../types';

export async function submitFeedback(feedbackData: {
  sessionId: string;
  athleteId: string;
  rpe: number;
  notes?: string;
  completed: boolean;
}): Promise<Feedback> {
  const { data } = await api.post<Feedback>('/feedback', feedbackData);
  return data;
}

export async function getFeedback(sessionId: string): Promise<Feedback | null> {
  try {
    const { data } = await api.get<Feedback>(`/feedback/${sessionId}`);
    return data;
  } catch {
    return null;
  }
}
