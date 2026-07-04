/**
 * Centralized API Endpoints
 */
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh',
  },
  USERS: {
    LIST: '/users',
    DETAIL: (id) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
  },
  LESSONS: {
    LIST: '/lessons',
    DETAIL: (id) => `/lessons/${id}`,
    CREATE: '/lessons',
    UPDATE: (id) => `/lessons/${id}`,
    DELETE: (id) => `/lessons/${id}`,
  },
  // Add more endpoints as needed for Categories, Quizzes, Badges, etc.
};
