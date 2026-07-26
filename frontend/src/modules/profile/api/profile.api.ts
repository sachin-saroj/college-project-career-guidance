import apiClient from '@/api/client';
import { 
  ProfileResponse, 
  DashboardResponse, 
  ProfileCompletionResponse 
} from '../types/profile.types';
import { UpdateProfileFormValues } from '../validators/profile.schema';

export const profileApi = {
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await apiClient.get<ProfileResponse>('/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileFormValues): Promise<ProfileResponse> => {
    // We send individual sections or all sections at once
    const response = await apiClient.patch<ProfileResponse>('/profile', data);
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<{ status: string; data: { avatarUrl: string } }> => {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await apiClient.post('/profile/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getDashboard: async (): Promise<DashboardResponse> => {
    // In Phase 5, the route was configured as /student/dashboard or /dashboard depending on the router mount.
    // Assuming /dashboard is mounted off the main router or /student/dashboard. 
    // We will use /dashboard for now as per plan, but if backend used /student prefix we would change it here.
    const response = await apiClient.get<DashboardResponse>('/dashboard');
    return response.data;
  },

  getProfileCompletion: async (): Promise<ProfileCompletionResponse> => {
    const response = await apiClient.get<ProfileCompletionResponse>('/profile/completion');
    return response.data;
  },
};
