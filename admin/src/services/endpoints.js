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
  CATEGORIES: {
    LIST: '/lesson-categories',
    DETAIL: (id) => `/lesson-categories/${id}`,
    CREATE: '/lesson-categories',
    UPDATE: (id) => `/lesson-categories/${id}`,
    DELETE: (id) => `/lesson-categories/${id}`,
  },
  QUIZZES: {
    LIST: '/quizzes',
    DETAIL: (id) => `/quizzes/${id}`,
    CREATE: '/quizzes',
    UPDATE: (id) => `/quizzes/${id}`,
    DELETE: (id) => `/quizzes/${id}`,
  },
  // Add more endpoints as needed for Badges, etc.
};
