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

export type AuthResponse = {
  access_token: string;
  token_type: string;
};

export type UserProfile = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  is_active: boolean;
  created_at: string;
};

// ── Endpoint functions ─────────────────────────────────────────────────

/**
 * Register a new user account.
 */
export const register = (data: RegisterRequest) =>
  apiClient.post<AuthResponse>("/auth/register", data);

/**
 * Log in with email and password.
 */
export const login = (data: LoginRequest) =>
  apiClient.post<AuthResponse>("/auth/login", data);

/**
 * Get the currently authenticated user's profile.
 */
export const getMe = () => apiClient.get<UserProfile>("/auth/me");
