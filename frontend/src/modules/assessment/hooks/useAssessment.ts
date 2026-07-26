import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  startAssessment, 
  getAssessmentSession, 
  saveAnswer, 
  submitAssessment, 
  getRecommendations 
} from '../api/assessment.api';

export const useAssessmentSession = () => {
  return useQuery({
    queryKey: ['assessmentSession'],
    queryFn: getAssessmentSession,
    staleTime: 0, // Always fetch latest session state
  });
};

export const useStartAssessment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: startAssessment,
    onSuccess: (data) => {
      queryClient.setQueryData(['assessmentSession'], data);
    },
  });
};

export const useSaveAnswer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: saveAnswer,
    onMutate: async (newAnswer) => {
      await queryClient.cancelQueries({ queryKey: ['assessmentSession'] });
      
      const previousSession = queryClient.getQueryData(['assessmentSession']);
      
      // Optimistically update session
      queryClient.setQueryData(['assessmentSession'], (old: any) => {
        if (!old?.data?.session) return old;
        const answers = [...old.data.session.answers];
        const existingIndex = answers.findIndex(a => a.questionId === newAnswer.questionId);
        if (existingIndex >= 0) {
          answers[existingIndex] = { ...answers[existingIndex], ...newAnswer };
        } else {
          answers.push(newAnswer);
        }
        return {
          ...old,
          data: {
            ...old.data,
            session: {
              ...old.data.session,
              answers
            }
          }
        };
      });
      
      return { previousSession };
    },
    onError: (err, newAnswer, context) => {
      queryClient.setQueryData(['assessmentSession'], context?.previousSession);
    },
    onSettled: () => {
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['assessmentSession'] });
    },
  });
};

export const useSubmitAssessment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: submitAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessmentSession'] });
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useRecommendations = () => {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: getRecommendations,
  });
};
