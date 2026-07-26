import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api/profile.api';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || 'An unexpected error occurred';
  }
  return 'An unexpected error occurred';
};

// ==========================================
// QUERIES
// ==========================================

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: profileApi.getDashboard,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useProfileCompletion = () => {
  return useQuery({
    queryKey: ['profile', 'completion'],
    queryFn: profileApi.getProfileCompletion,
  });
};

// ==========================================
// MUTATIONS
// ==========================================

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (data) => {
      // Invalidate both profile and completion queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileApi.uploadAvatar,
    onSuccess: (data) => {
      // We could optimistically update here, but invalidating is safer
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Avatar uploaded successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
