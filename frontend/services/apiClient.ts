import axios from "axios";
import { useAuthStore } from "../stores/authStore";

/**
 * Pre-configured Axios instance for all API requests.
 *
 * - Reads the base URL from the EXPO_PUBLIC_API_URL environment variable.
 * - Automatically attaches the JWT bearer token from the Zustand auth store
 *   to every outgoing request via a request interceptor.
 * - Handles 401 Unauthorized responses globally by clearing the auth state,
 *   forcing the user back to the login screen.
 */
const BASE_URL = "https://signlens-backend-sg1c.onrender.com/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 240000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor ────────────────────────────────────────────────
// Attach the JWT token to every request if available.
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ───────────────────────────────────────────────
// Handle global error cases like expired tokens.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid – clear stored credentials.
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
