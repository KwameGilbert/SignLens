import mlClient from '../services/mlClient.service.js';
import HistoryModel from '../model/history.model.js';
import { sendSuccess, sendBadRequest, sendError, sendInternalError } from '../utils/response.js';

const handlePrediction = async (req, res, isVideo) => {
  try {
    if (!req.file) {
      return sendBadRequest(res, `No ${isVideo ? 'video' : 'image'} file uploaded`);
    }

    console.log(`Processing static ${isVideo ? 'video' : 'image'} prediction request for User ID: ${req.user.id}`);
    console.log(`[ML Request] Sending ${isVideo ? 'video' : 'image'} to ML server (MimeType: ${req.file.mimetype}, Size: ${req.file.buffer.length} bytes)`);

    // Call third party ML service to get prediction details
    let mlResult;
    try {
      if (isVideo) {
        mlResult = await mlClient.predictVideo(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype
        );
      } else {
        mlResult = await mlClient.predictImage(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype
        );
      }
      console.log(`[ML Response] Received from ML server:`, mlResult);
    } catch (err) {
      console.error(`[ML Error] Failed to get predictions from ML server:`, err.message);
      return sendError(res, `Failed to get predictions from ML server: ${err.message}`, 502, 'BAD_GATEWAY');
    }

    if (!mlResult || !mlResult.prediction || mlResult.confidence === undefined) {
      console.error(`[ML Error] ML backend returned an empty or invalid prediction response`);
      return sendError(res, 'ML backend returned an empty or invalid prediction response', 502, 'BAD_GATEWAY');
    }

    // Save prediction result into translation history logs
    const savedLog = await HistoryModel.create({
      userId: req.user.id,
      mode: 'camera',
      prediction: mlResult.prediction,
      confidenceRating: mlResult.confidence,
      resolutionStatus: mlResult.confidence >= 0.8 ? 'success' : 'low_confidence',
    });

    const responsePayload = {
      prediction: mlResult.prediction,
      confidence: mlResult.confidence,
      loggedId: savedLog.id,
    };
    
    console.log(`[User Response] Returning prediction to user:`, responsePayload);

    sendSuccess(res, responsePayload, 'Prediction completed successfully');
  } catch (err) {
    sendInternalError(res, `Internal gateway failure processing ${isVideo ? 'video' : 'image'} prediction`, err);
  }
};

export const predictImage = async (req, res) => {
  if (!req.file) {
    return sendBadRequest(res, 'No file uploaded');
  }

  // Detect type (image vs video)
  let isVideo = false;
  const { type } = req.query;
  if (type === 'video') {
    isVideo = true;
  } else if (type === 'image') {
    isVideo = false;
  } else if (req.file.mimetype && req.file.mimetype.startsWith('video/')) {
    isVideo = true;
  } else if (req.file.originalname) {
    const filename = req.file.originalname.toLowerCase();
    if (
      filename.endsWith('.mp4') ||
      filename.endsWith('.mov') ||
      filename.endsWith('.m4v') ||
      filename.endsWith('.avi') ||
      filename.endsWith('.3gp') ||
      filename.endsWith('.webm') ||
      filename.endsWith('.mkv')
    ) {
      isVideo = true;
    }
  }

  await handlePrediction(req, res, isVideo);
};

export const predictVideo = async (req, res) => {
  await handlePrediction(req, res, true);
};
