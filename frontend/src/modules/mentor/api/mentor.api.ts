import apiClient from '../../../api/client';
import {
  CreateSessionResponse,
  ChatPayload,
  ChatResponse,
  GetHistoryResponse,
  GetSessionResponse
} from '../types/mentor.types';

export const createSession = async (initialMessage?: string): Promise<CreateSessionResponse> => {
  const response = await apiClient.post<CreateSessionResponse>('/ai/session', { initialMessage });
  return response.data;
};

export const sendMessage = async (payload: ChatPayload): Promise<ChatResponse> => {
  const response = await apiClient.post<ChatResponse>('/ai/chat', payload);
  return response.data;
};

export const getHistory = async (): Promise<GetHistoryResponse> => {
  const response = await apiClient.get<GetHistoryResponse>('/ai/history');
  return response.data;
};

export const getSession = async (sessionId: string): Promise<GetSessionResponse> => {
  const response = await apiClient.get<GetSessionResponse>(`/ai/session/${sessionId}`);
  return response.data;
};
