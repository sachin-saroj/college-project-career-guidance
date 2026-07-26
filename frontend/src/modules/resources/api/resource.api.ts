import axios from 'axios';
import { 
  RecommendedResourcesPayload, 
  SearchResourcesParams, 
  PaginatedResponse,
  BaseResource
} from '../types/resource.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Setup axios instance
const api = axios.create({
  baseURL: `${API_URL}/resources`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const resourceApi = {
  getRecommended: async () => {
    const response = await api.get<{ status: string; data: RecommendedResourcesPayload }>('/recommended');
    return response.data;
  },

  search: async <T extends BaseResource>(params: SearchResourcesParams) => {
    const response = await api.get<{ status: string; data: PaginatedResponse<T> }>('/search', { params });
    return response.data;
  },

  // Bookmarking endpoints
  toggleBookmark: async (resourceId: string, type: string, action: 'add' | 'remove') => {
    if (action === 'add') {
      const res = await api.post<{ status: string; message: string }>('/bookmarks', { resourceId, resourceType: type });
      return res.data;
    } else {
      const res = await api.delete<{ status: string; message: string }>(`/bookmarks/${resourceId}`);
      return res.data;
    }
  },
  
  getBookmarks: async () => {
    const res = await api.get<{ status: string; data: string[] }>('/bookmarks');
    return res.data;
  }
};
