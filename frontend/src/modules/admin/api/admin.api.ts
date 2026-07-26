import axios from 'axios';
import { AdminUser, AdminResource, AdminDashboardStats, PaginatedResponse } from '../types/admin.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: `${API_URL}/admin`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminApi = {
  getDashboardStats: async (): Promise<{ status: string; data: AdminDashboardStats }> => {
    const res = await api.get('/stats');
    return res.data;
  },

  getUsers: async (page = 1, limit = 10, search = ''): Promise<{ status: string; data: PaginatedResponse<AdminUser> }> => {
    const res = await api.get('/users', { params: { page, limit, search } });
    return res.data;
  },

  updateUserStatus: async (id: string, status: 'ACTIVE' | 'SUSPENDED'): Promise<{ status: string }> => {
    const res = await api.patch(`/users/${id}/status`, { status });
    return res.data;
  },

  getResources: async (page = 1, limit = 10, search = ''): Promise<{ status: string; data: PaginatedResponse<AdminResource> }> => {
    const res = await api.get('/resources', { params: { page, limit, search } });
    return res.data;
  },

  updateResourceStatus: async (id: string, status: AdminResource['status']): Promise<{ status: string }> => {
    const res = await api.patch(`/resources/${id}/status`, { status });
    return res.data;
  }
};
