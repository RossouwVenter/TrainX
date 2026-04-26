import api from './api';
import type { WeekSchedule, Session, SessionStatus } from '../types';

export async function getWeekSchedule(athleteId: string, weekOf?: string): Promise<WeekSchedule> {
  const params: Record<string, string> = { athleteId };
  if (weekOf) params.weekOf = weekOf;
  const { data } = await api.get<WeekSchedule>('/sessions', { params });
  return data;
}

export async function createSession(sessionData: {
  title: string;
  description?: string;
  discipline: string;
  date: string;
  duration: number;
  athleteId: string;
  coachId: string;
}): Promise<Session> {
  const { data } = await api.post<Session>('/sessions', sessionData);
  return data;
}

export async function updateSession(id: string, sessionData: Partial<Session>): Promise<Session> {
  const { data } = await api.put<Session>(`/sessions/${id}`, sessionData);
  return data;
}

export async function deleteSession(id: string): Promise<void> {
  await api.delete(`/sessions/${id}`);
}

export async function updateSessionStatus(id: string, status: SessionStatus): Promise<Session> {
  const { data } = await api.put<Session>(`/sessions/${id}/status`, { status });
  return data;
}
