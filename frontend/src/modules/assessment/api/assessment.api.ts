import apiClient from '../../../api/client';
import { 
  StartAssessmentResponse, 
  SubmitAssessmentResponse, 
  GetRecommendationsResponse,
  AssessmentSession
} from '../types/assessment.types';

export const startAssessment = async (): Promise<StartAssessmentResponse> => {
  const response = await apiClient.post<StartAssessmentResponse>('/assessment/start');
  return response.data;
};

export const getAssessmentSession = async (): Promise<{ success: boolean; data: { session: AssessmentSession | null, questions: any[] } }> => {
  // We can fetch the current session status
  const response = await apiClient.get('/assessment/session');
  return response.data;
};

export const saveAnswer = async (payload: { questionId: string; value: number; timeTaken?: number }) => {
  const response = await apiClient.patch('/assessment/answer', payload);
  return response.data;
};

export const submitAssessment = async (): Promise<SubmitAssessmentResponse> => {
  const response = await apiClient.post<SubmitAssessmentResponse>('/assessment/submit');
  return response.data;
};

export const getRecommendations = async (): Promise<GetRecommendationsResponse> => {
  const response = await apiClient.get<GetRecommendationsResponse>('/recommendations');
  return response.data;
};
