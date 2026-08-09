import api from "../utils/api";
import type { User } from "../context/AuthContext";

export interface ProfileResponse {
  profile: User;
}

export interface ProfileUpdateRequest {
  name?: string;
  education?: string;
  skills?: string;
  interests?: string;
  careerGoal?: string;
  familyIncome?: string;
}

export const profileService = {
  // Get current user profile
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get('/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: ProfileUpdateRequest): Promise<{ message: string, profile: User }> => {
    const response = await api.put('/profile', data);
    return response.data;
  }
};
