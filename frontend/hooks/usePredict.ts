import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";
import {
  predictImage,
  getPredictStreamUrl,
  type PredictionResult,
} from "../services/endpoints/predict";

/**
 * Hook for sign language prediction operations.
 *
 * Provides:
 * - `predictImageMutation` – upload a static image for prediction.
 * - `getStreamUrl()` – build the authenticated WebSocket URL for real-time
 *   video frame streaming.
 */
export function usePredict() {
  const token = useAuthStore((s) => s.token);

  // ── Static image prediction ───────────────────────────────────────
  const predictImageMutation = useMutation({
    mutationFn: (imageUri: string) => predictImage(imageUri),
  });

  // ── WebSocket stream URL helper ───────────────────────────────────
  const getStreamUrl = (type: "stream" | "video" = "stream"): string | null => {
    if (!token) return null;
    return getPredictStreamUrl(token, type);
  };

  return {
    predictImageMutation,
    getStreamUrl,
  };
}
