import apiClient from '@/api/client';
import { AuthResponse, GenericResponse } from '../types/auth.types';
import { 
  LoginFormValues, 
  RegisterFormValues, 
  ForgotPasswordFormValues, 
  ResetPasswordFormValues 
} from '../validators/auth.schema';

export const authApi = {
  login: async (data: LoginFormValues): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterFormValues): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<GenericResponse> => {
    const response = await apiClient.post<GenericResponse>('/auth/logout');
    return response.data;
  },

  getMe: async (): Promise<{ status: string; data: { user: AuthResponse['data']['user'] } }> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordFormValues): Promise<GenericResponse> => {
    const response = await apiClient.post<GenericResponse>('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (token: string, data: ResetPasswordFormValues): Promise<GenericResponse> => {
    const response = await apiClient.patch<GenericResponse>(`/auth/reset-password/${token}`, {
      password: data.password,
    });
    return response.data;
  }
};
