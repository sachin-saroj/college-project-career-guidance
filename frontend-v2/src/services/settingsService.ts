import api from "../utils/api";

export const settingsService = {
  changePassword: async (data: any) => {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/profile');
    return response.data;
  }
};
