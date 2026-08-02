import axios from "axios";

// Standardizing the base URL for the backend
export const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to automatically add the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login (or let AuthContext handle it)
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Ideally redirect to login page if we have one. We will handle auth state in Context.
    }
    return Promise.reject(error);
  }
);

export default api;
