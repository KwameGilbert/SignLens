import apiClient from "../apiClient";

// ── Types ──────────────────────────────────────────────────────────────

export type HistoryEntry = {
  id: number;
  user_id: number;
  input_type: "image" | "video" | "stream";
  prediction_label: string;
  confidence: number;
  created_at: string;
};

export type CreateHistoryRequest = {
  input_type: "image" | "video" | "stream";
  prediction_label: string;
  confidence: number;
};

// ── Endpoint functions ─────────────────────────────────────────────────

/**
 * Retrieve the authenticated user's paginated translation history.
 */
export const getHistory = (skip = 0, limit = 20) =>
  apiClient.get<HistoryEntry[]>("/history/", { params: { skip, limit } });

/**
 * Manually create a new translation history log entry.
 */
export const createHistory = (data: CreateHistoryRequest) =>
  apiClient.post<HistoryEntry>("/history/", data);
