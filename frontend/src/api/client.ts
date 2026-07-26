import axios from 'axios';
import { setupInterceptors } from './interceptors';

// In production, this would use Vite's import.meta.env.VITE_API_URL
const BASE_URL = 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Attach request/response interceptors to handle JWTs and global errors
setupInterceptors(apiClient);

export default apiClient;
