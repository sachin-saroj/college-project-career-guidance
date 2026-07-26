import axios from 'axios';
import { Resume, ATSScoreData, Portfolio } from '../types/resume.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: `${API_URL}/resume`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const resumeApi = {
  // Core CRUD
  getResumes: async () => {
    const res = await api.get<{ status: string; data: Resume[] }>('/');
    return res.data;
  },
  
  getResumeById: async (id: string) => {
    const res = await api.get<{ status: string; data: Resume }>(`/${id}`);
    return res.data;
  },
  
  createResume: async (data: Partial<Resume>) => {
    const res = await api.post<{ status: string; data: Resume }>('/', data);
    return res.data;
  },
  
  updateResume: async (id: string, data: Partial<Resume>) => {
    const res = await api.put<{ status: string; data: Resume }>(`/${id}`, data);
    return res.data;
  },
  
  deleteResume: async (id: string) => {
    const res = await api.delete(`/${id}`);
    return res.data;
  },

  // Engine endpoints
  calculateAtsScore: async (id: string) => {
    const res = await api.get<{ status: string; data: ATSScoreData }>(`/${id}/ats`);
    return res.data;
  },
  
  exportPdfUrl: (id: string) => {
    return `${api.defaults.baseURL}/${id}/export/pdf`;
  },

  // AI Endpoints
  aiRewriteBullets: async (content: string) => {
    const res = await api.post<{ status: string; data: string }>('/ai/rewrite', { content });
    return res.data;
  },
  
  aiGenerateSummary: async (id: string) => {
    const res = await api.post<{ status: string; data: string }>(`/${id}/ai/summary`);
    return res.data;
  },

  // Portfolio Endpoints
  getPortfolio: async () => {
    const res = await api.get<{ status: string; data: Portfolio }>('/portfolio');
    return res.data;
  },

  updatePortfolio: async (data: Partial<Portfolio>) => {
    const res = await api.put<{ status: string; data: Portfolio }>('/portfolio', data);
    return res.data;
  }
};
