import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

// Helper to extract error message from Axios
const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || 'An unexpected error occurred';
  }
  return 'An unexpected error occurred';
};

export const useLogin = () => {
  const navigate = useNavigate();
  const setCredentials = useAuthStore((state) => state.setCredentials);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setCredentials(data.data.user, data.token);
      toast.success('Login successful!');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  const setCredentials = useAuthStore((state) => state.setCredentials);

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setCredentials(data.data.user, data.token);
      toast.success('Registration successful! Welcome to CareerSathi.');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const logoutStore = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logoutStore();
      queryClient.clear(); // Clear all cached queries
      toast.success('Logged out successfully.');
      navigate('/login');
    },
    onError: () => {
      // Even if API fails, clear client state to prevent being stuck
      logoutStore();
      queryClient.clear();
      navigate('/login');
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success('Password reset link sent to your email.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useResetPassword = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: ({ token, data }: { token: string; data: any }) => authApi.resetPassword(token, data),
    onSuccess: () => {
      toast.success('Password reset successfully. You can now login.');
      navigate('/login');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useCurrentUser = () => {
  const token = useAuthStore((state) => state.token);
  const setCredentials = useAuthStore((state) => state.setCredentials);
  const logoutStore = useAuthStore((state) => state.logout);

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.getMe,
    enabled: !!token, // Only fetch if we have a token
    retry: false, // Don't retry auth checks
    staleTime: 1000 * 60 * 60, // Consider user data fresh for 1 hour
  });
};
