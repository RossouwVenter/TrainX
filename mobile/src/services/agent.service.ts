import api from './api';
import type { AIPlanRequest, AIPlanResponse } from '../types';

export async function planWeek(data: AIPlanRequest): Promise<AIPlanResponse> {
  const { data: response } = await api.post<AIPlanResponse>('/agent/plan-week', data);
  return response;
}
