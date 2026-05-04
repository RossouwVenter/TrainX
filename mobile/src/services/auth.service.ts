import api from './api';
import type { User, Role } from '../types';

export async function signupUser(email: string, password: string, name: string, role: Role): Promise<User> {
  const { data } = await api.post<User>('/auth/signup', { email, password, name, role });
  return data;
}

export async function loginUser(email: string, password: string): Promise<User> {
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
