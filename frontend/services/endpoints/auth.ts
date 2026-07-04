import apiClient from "../apiClient";

// ── Types ──────────────────────────────────────────────────────────────

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type UserProfile = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

/**
 * The backend wraps all responses in { success, message, data }.
 */
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type LoginData = {
  token: string;
  user: UserProfile;
};

// ── Endpoint functions ─────────────────────────────────────────────────

/**
 * Register a new user account.
 */
export const register = (data: RegisterRequest) =>
  apiClient.post<ApiResponse<LoginData>>("/auth/register", data);

/**
 * Log in with email and password.
 */
export const login = (data: LoginRequest) =>
  apiClient.post<ApiResponse<LoginData>>("/auth/login", data);

/**
 * Get the currently authenticated user's profile.
 */
export const getMe = () => apiClient.get<ApiResponse<UserProfile>>("/auth/me");
