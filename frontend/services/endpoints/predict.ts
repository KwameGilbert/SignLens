import apiClient from "../apiClient";

// ── Types ──────────────────────────────────────────────────────────────

export type PredictionResult = {
  prediction_label: string;
  confidence: number;
};

// ── Endpoint functions ─────────────────────────────────────────────────

/**
 * Send a static image to the prediction gateway.
 * The backend proxies it to the ML model server and logs the result.
 */
export const predictImage = (imageUri: string) => {
  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    name: "frame.jpg",
    type: "image/jpeg",
  } as any);

  return apiClient.post<PredictionResult>("/predict", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Returns the WebSocket URL for real-time video frame streaming.
 * The caller should establish the WebSocket connection directly.
 *
 * @param token - JWT access token for authentication.
 * @param type  - The type of stream: "stream" (live camera) or "video".
 */
export const getPredictStreamUrl = (
  token: string,
  type: "stream" | "video" = "stream"
): string => {
  const baseUrl = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(
    /^http/,
    "ws"
  );
  return `${baseUrl}/predict-stream?token=${token}&type=${type}`;
};
