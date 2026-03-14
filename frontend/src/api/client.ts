import axios from "axios";
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios interceptor to automatically attach JWT tokens
apiClient.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

