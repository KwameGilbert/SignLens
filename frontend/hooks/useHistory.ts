import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getHistory,
  createHistory,
  type CreateHistoryRequest,
} from "../services/endpoints/history";
import { useAuthStore } from "../stores/authStore";

/**
 * Hook for translation history operations.
 *
 * Provides:
 * - `historyQuery` – fetches the user's paginated translation history.
 * - `createHistoryMutation` – manually logs a new translation entry.
 */
export function useHistory(skip = 0, limit = 20) {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // ── Fetch history ─────────────────────────────────────────────────
  const historyQuery = useQuery({
    queryKey: ["history", skip, limit],
    queryFn: async () => {
      const { data } = await getHistory(skip, limit);
      return data;
    },
    enabled: isAuthenticated,
  });

  // ── Create history entry ──────────────────────────────────────────
  const createHistoryMutation = useMutation({
    mutationFn: (data: CreateHistoryRequest) => createHistory(data),
    onSuccess: () => {
      // Invalidate history list so it refetches with the new entry.
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });

  return {
    historyQuery,
    createHistoryMutation,
  };
}
