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
      const { data } = await getMe();
      setUser(data);
      return data;
    },
    enabled: isAuthenticated,
  });

  // ── Login mutation ────────────────────────────────────────────────
  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: async (response) => {
      setToken(response.data.access_token);
      // Immediately fetch the user profile after login
      const { data: profile } = await getMe();
      setUser(profile);
      router.replace("/(tabs)/home");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ?? "Login failed. Please try again.";
      Alert.alert("Login Error", message);
    },
  });

  // ── Register mutation ─────────────────────────────────────────────
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: () => {
      Alert.alert("Success", "Account created! Please log in.", [
        { text: "OK", onPress: () => router.push("/(auth)/login") },
      ]);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ?? "Registration failed. Please try again.";
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
