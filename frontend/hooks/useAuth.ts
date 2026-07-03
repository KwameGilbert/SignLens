import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useAuthStore } from "../stores/authStore";
import {
  login,
  register,
  getMe,
  type LoginRequest,
  type RegisterRequest,
} from "../services/endpoints/auth";

/**
 * Hook that exposes authentication operations backed by
 * TanStack React Query mutations and the Zustand auth store.
 */
export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setToken, setUser, logout: clearAuth, isAuthenticated, user } = useAuthStore();

  // ── Fetch current user (runs only when authenticated) ─────────────
  const profileQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      console.log("[AUTH] Fetching current user profile...");
      const response = await getMe();
      const profile = response.data.data;
      console.log("[AUTH] Profile fetched:", JSON.stringify(profile, null, 2));
      setUser(profile);
      return profile;
    },
    enabled: isAuthenticated,
  });

  // ── Login mutation ────────────────────────────────────────────────
  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => {
      console.log("[AUTH] Login request:", JSON.stringify(data, null, 2));
      return login(data);
    },
    onSuccess: (response) => {
      console.log("[AUTH] Login success:", JSON.stringify(response.data, null, 2));
      const { token, user: profile } = response.data.data;
      
      setToken(token);
      setUser(profile);
      
      router.replace("/(tabs)/home");
    },
    onError: (error: any) => {
      console.error("[AUTH] Login error:", error.response?.status, JSON.stringify(error.response?.data, null, 2));
      const message =
        error.response?.data?.error?.message ??
        error.response?.data?.message ??
        "Login failed. Please try again.";
      Alert.alert("Login Error", message);
    },
  });

  // ── Register mutation ─────────────────────────────────────────────
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => {
      console.log("[AUTH] Register request:", JSON.stringify(data, null, 2));
      return register(data);
    },
    onSuccess: (response) => {
      console.log("[AUTH] Register success:", JSON.stringify(response.data, null, 2));
      Alert.alert("Success", "Account created! Please log in.", [
        { text: "OK", onPress: () => router.push("/(auth)/login") },
      ]);
    },
    onError: (error: any) => {
      console.error("[AUTH] Register error:", error.response?.status, JSON.stringify(error.response?.data, null, 2));
      const message =
        error.response?.data?.error?.message ??
        error.response?.data?.message ??
        "Registration failed. Please try again.";
      Alert.alert("Registration Error", message);
    },
  });

  // ── Logout ────────────────────────────────────────────────────────
  const handleLogout = () => {
    clearAuth();
    queryClient.clear();
    router.replace("/welcome");
  };

  return {
    user,
    isAuthenticated,
    profileQuery,
    loginMutation,
    registerMutation,
    logout: handleLogout,
  };
}
