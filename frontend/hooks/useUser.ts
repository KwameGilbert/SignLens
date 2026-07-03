import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { useAuthStore } from "../stores/authStore";
import {
  getProfile,
  updateProfile,
  changePassword,
  type UpdateProfileRequest,
  type ChangePasswordRequest,
} from "../services/endpoints/user";

/**
 * Hook for user profile management.
 *
 * Provides:
 * - `profileQuery` – fetches the current user profile.
 * - `updateProfileMutation` – updates name / email fields.
 * - `changePasswordMutation` – changes the user password.
 */
export function useUser() {
  const queryClient = useQueryClient();
  const { setUser, isAuthenticated } = useAuthStore();

  // ── Fetch profile ─────────────────────────────────────────────────
  const profileQuery = useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const { data } = await getProfile();
      setUser(data);
      return data;
    },
    enabled: isAuthenticated,
  });

  // ── Update profile ────────────────────────────────────────────────
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateProfile(data),
    onSuccess: (response) => {
      setUser(response.data);
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      Alert.alert("Success", "Profile updated successfully.");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ?? "Failed to update profile.";
      Alert.alert("Error", message);
    },
  });

  // ── Change password ───────────────────────────────────────────────
  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePassword(data),
    onSuccess: () => {
      Alert.alert("Success", "Password changed successfully.");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.detail ?? "Failed to change password.";
      Alert.alert("Error", message);
    },
  });

  return {
    profileQuery,
    updateProfileMutation,
    changePasswordMutation,
  };
}
