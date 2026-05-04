import api from './api';
import type { User } from '../types';

export async function signupCoach(email: string, password: string, name: string): Promise<User> {
  const { data } = await api.post<User>('/auth/signup', { email, password, name });
  return data;
}

export async function loginCoach(email: string, password: string): Promise<User> {
  const { data } = await api.post<User>('/auth/login', { email, password });
  return data;
}

export async function getCoach(): Promise<User> {
  const { data } = await api.get<User>('/auth/coach');
  return data;
}

export async function getAthletes(): Promise<User[]> {
  const { data } = await api.get<User[]>('/auth/athletes');
  return data;
}
