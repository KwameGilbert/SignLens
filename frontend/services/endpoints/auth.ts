import apiClient from "../apiClient";

// ── Types ──────────────────────────────────────────────────────────────

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  full_name: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
};

export type UserProfile = {
  id: number;
  email: string;
  full_name: string;
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
 * The backend expects `application/x-www-form-urlencoded` for OAuth2.
 */
export const login = (data: LoginRequest) => {
  const formData = new URLSearchParams();
  formData.append("username", data.email);
  formData.append("password", data.password);

  return apiClient.post<AuthResponse>("/auth/login", formData.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};

/**
 * Get the currently authenticated user's profile.
 */
export const getMe = () => apiClient.get<UserProfile>("/auth/me");
