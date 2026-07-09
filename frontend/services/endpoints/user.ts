import apiClient from "../apiClient";
import type { UserProfile } from "./auth";

// ── Types ──────────────────────────────────────────────────────────────

export type UpdateProfileRequest = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type ChangePasswordRequest = {
  current_password: string;
  new_password: string;
};

// ── Endpoint functions ─────────────────────────────────────────────────

/**
 * Fetch the currently authenticated user's profile.
 * (Alias of auth/me for convenience in user-centric hooks.)
 */
export const getProfile = () => apiClient.get<UserProfile>("/auth/me");

/**
 * Update the authenticated user's profile fields.
 */
export const updateProfile = (data: UpdateProfileRequest) =>
  apiClient.put<UserProfile>("/auth/me", data);

/**
 * Change the authenticated user's password.
 */
export const changePassword = (data: ChangePasswordRequest) =>
  apiClient.post("/auth/change-password", data);
