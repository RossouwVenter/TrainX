import api from './api';
import type { AthleteWithStats, User } from '../types';

export async function getAthletes(): Promise<AthleteWithStats[]> {
  const { data } = await api.get<AthleteWithStats[]>('/athletes');
  return data;
}

export async function getAthlete(id: string): Promise<User> {
  const { data } = await api.get<User>(`/athletes/${id}`);
  return data;
}

export async function createAthlete(name: string, email: string): Promise<User> {
  const { data } = await api.post<User>('/athletes', { name, email });
  return data;
}

export async function deleteAthlete(id: string): Promise<void> {
  await api.delete(`/athletes/${id}`);
}
