import { create } from "zustand";
import type { UserProfile } from "../services/endpoints/auth";

// ── Types ──────────────────────────────────────────────────────────────

type AuthState = {
  /** JWT access token. `null` when not authenticated. */
  token: string | null;
  /** Cached user profile. `null` when not fetched or logged out. */
  user: UserProfile | null;
  /** Whether the user is currently authenticated. */
  isAuthenticated: boolean;
};

type AuthActions = {
  /** Persist the JWT token and mark the user as authenticated. */
  setToken: (token: string) => void;
  /** Cache the full user profile object. */
  setUser: (user: UserProfile) => void;
  /** Clear all auth state (token + user). */
  logout: () => void;
};

// ── Store ──────────────────────────────────────────────────────────────

/**
 * Global authentication store powered by Zustand.
 *
 * This store is intentionally kept **outside** of React's tree so that
 * the Axios interceptor in `apiClient.ts` can read the token
 * synchronously via `useAuthStore.getState()`.
 */
export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  setToken: (token) => set({ token, isAuthenticated: true }),

  setUser: (user) => set({ user }),

  logout: () => set({ token: null, user: null, isAuthenticated: false }),
}));
