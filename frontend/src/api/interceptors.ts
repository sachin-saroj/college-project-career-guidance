import { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/auth.store';
import toast from 'react-hot-toast';

export const setupInterceptors = (apiClient: AxiosInstance) => {
  // Request Interceptor: Attach Bearer Token
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // Response Interceptor: Handle Global Errors & 401s
  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config;
      
      // If 401 Unauthorized, force logout (no refresh token implemented yet)
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
        toast.error('Session expired. Please log in again.');
        window.location.href = '/session-expired';
        return Promise.reject(error);
      }

      // Handle 500 Server Errors globally
      if (error.response?.status && error.response.status >= 500) {
        toast.error('A server error occurred. Please try again later.');
      }

      return Promise.reject(error);
    }
  );
};
