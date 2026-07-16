import apiClient from "../apiClient";
import axios from "axios";

// ── Types ──────────────────────────────────────────────────────────────

export type PredictionResult = {
  prediction: string;
  confidence: number;
  loggedId?: number;
  fallback?: boolean;
  model_used?: string;
};

// Create a dedicated axios instance for direct ML server communication
const ML_BASE_URL = process.env.EXPO_PUBLIC_ML_API_URL ?? "http://10.50.49.16:8000";

const mlClient = axios.create({
  baseURL: ML_BASE_URL,
  timeout: 300000, // 5 minutes timeout for large video uploads/processing
  headers: {
    "bypass-tunnel-reminder": "true",
  },
});

// ── Endpoint functions ─────────────────────────────────────────────────

/**
 * Send a static image directly to the ML model server.
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
  });
};

/**
 * Send a recorded video directly to the ML model server.
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
  });
};

/**
 * Returns the WebSocket URL for real-time video frame streaming.
 * Communicates directly with the ML model server.
 *
 * @param token - Authentication token (optional/dummy key for local model).
 * @param type  - The type of stream: "stream" (live camera) or "video".
 */
export const getPredictStreamUrl = (
  token: string,
  type: "stream" | "video" = "stream"
): string => {
  const baseUrl = ML_BASE_URL.replace(/^http/, "ws");
  // The model endpoints WebSocket requires api_key and type parameters.
  // Since verification is commented out in endpoints.py, a dummy key is used.
  return `${baseUrl}/api/v1/predict-stream?api_key=dummy_key&type=${type}`;
};
