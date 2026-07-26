import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeApi } from '../api/resume.api';
import { Resume, Portfolio } from '../types/resume.types';
import toast from 'react-hot-toast';

export const RESUME_KEYS = {
  all: ['resumes'] as const,
  list: () => [...RESUME_KEYS.all, 'list'] as const,
  detail: (id: string) => [...RESUME_KEYS.all, 'detail', id] as const,
  ats: (id: string) => [...RESUME_KEYS.all, 'ats', id] as const,
  portfolio: ['portfolio'] as const,
};

export const useResumes = () => {
  return useQuery({
    queryKey: RESUME_KEYS.list(),
    queryFn: () => resumeApi.getResumes(),
  });
};

export const useResume = (id: string) => {
  return useQuery({
    queryKey: RESUME_KEYS.detail(id),
    queryFn: () => resumeApi.getResumeById(id),
    enabled: !!id,
  });
};

export const useCreateResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Resume>) => resumeApi.createResume(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUME_KEYS.list() });
      toast.success('Resume created successfully');
    },
    onError: () => {
      toast.error('Failed to create resume');
    }
  });
};

export const useUpdateResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Resume> }) => resumeApi.updateResume(id, data),
    onSuccess: (res, variables) => {
      // Optimistically update the cache for the detailed view
      queryClient.setQueryData(RESUME_KEYS.detail(variables.id), res);
      // Invalidate the ATS score to recalculate it if needed
      queryClient.invalidateQueries({ queryKey: RESUME_KEYS.ats(variables.id) });
    },
    // We don't toast on every successful update because it will auto-save frequently
    onError: () => {
      toast.error('Failed to save changes');
    }
  });
};

export const useDeleteResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resumeApi.deleteResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUME_KEYS.list() });
      toast.success('Resume deleted');
    },
    onError: () => {
      toast.error('Failed to delete resume');
    }
  });
};

export const useAnalyzeResume = (id: string) => {
  return useQuery({
    queryKey: RESUME_KEYS.ats(id),
    queryFn: () => resumeApi.calculateAtsScore(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
};

export const useAIRewrite = () => {
  return useMutation({
    mutationFn: (content: string) => resumeApi.aiRewriteBullets(content),
    onError: () => {
      toast.error('AI rewrite failed');
    }
  });
};

export const usePortfolio = () => {
  return useQuery({
    queryKey: RESUME_KEYS.portfolio,
    queryFn: () => resumeApi.getPortfolio(),
  });
};

export const useUpdatePortfolio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Portfolio>) => resumeApi.updatePortfolio(data),
    onSuccess: (res) => {
      queryClient.setQueryData(RESUME_KEYS.portfolio, res);
      toast.success('Portfolio saved');
    },
    onError: () => {
      toast.error('Failed to update portfolio');
    }
  });
};
