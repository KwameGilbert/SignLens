import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://signlens-backend-sg1c.onrender.com/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and optionally redirect to login
      localStorage.removeItem('token');
      // Uncomment below if you want to force reload to trigger Auth state clearing
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
