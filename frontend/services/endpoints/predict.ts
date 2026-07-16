import apiClient from "../apiClient";
import axios from "axios";

// ── Types ──────────────────────────────────────────────────────────────

export type PredictionResult = {
  prediction: string;
  confidence: number;
  loggedId?: number;
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

  console.log("Sending image prediction request:", {
    endpoint: "http://172.20.10.14:8000/api/v1/predict?type=image",
    fileUri: imageUri,
    fileName: "frame.jpg",
    fileType: "image/jpeg",
  });

  return axios.post<PredictionResult>("http://172.20.10.14:8000/api/v1/predict?type=image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000, // 60 seconds (allows Render backends to wake from sleep)
  });
};

/**
 * Send a recorded video to the prediction gateway.
 */
export const predictVideo = (videoUri: string) => {
  const formData = new FormData();
  formData.append("file", {
    uri: videoUri,
    name: "sign.mp4",
    type: "video/mp4",
  } as any);

  console.log("Sending video prediction request:", {
    endpoint: "http://172.20.10.14:8000/api/v1/predict?type=video",
    fileUri: videoUri,
    fileName: "sign.mp4",
    fileType: "video/mp4",
  });

  return axios.post<PredictionResult>("http://172.20.10.14:8000/api/v1/predict?type=video", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 120000, // 2 minutes for video upload & ML processing
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
