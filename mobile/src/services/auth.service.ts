import api from './api';
import type { User } from '../types';

export async function getCoach(): Promise<User> {
  const { data } = await api.get<User>('/auth/coach');
  return data;
}

export async function getAthletes(): Promise<User[]> {
  const { data } = await api.get<User[]>('/auth/athletes');
  return data;
}
