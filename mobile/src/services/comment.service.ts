import api from './api';
import type { Comment } from '../types';

export async function getComments(sessionId: string): Promise<Comment[]> {
  const { data } = await api.get<Comment[]>(`/comments/${sessionId}`);
  return data;
}

export async function addComment(sessionId: string, authorId: string, text: string): Promise<Comment> {
  const { data } = await api.post<Comment>('/comments', { sessionId, authorId, text });
  return data;
}

export async function deleteComment(id: string): Promise<void> {
  await api.delete(`/comments/${id}`);
}
