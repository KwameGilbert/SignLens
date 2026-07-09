import mlClient from '../services/mlClient.service.js';
import HistoryModel from '../model/history.model.js';
import { sendSuccess, sendBadRequest, sendError, sendInternalError } from '../utils/response.js';

export const predictImage = async (req, res) => {
  try {
    if (!req.file) {
      return sendBadRequest(res, 'No image file uploaded');
    }

    const { type } = req.query;
    if (type && type !== 'image') {
      return sendBadRequest(res, 'This REST endpoint only supports type=image queries');
    }

    console.log(`Processing static image prediction request for User ID: ${req.user.id}`);
    console.log(`[ML Request] Sending image to ML server (MimeType: ${req.file.mimetype}, Size: ${req.file.buffer.length} bytes)`);

    // Call third party ML service to get prediction details
    let mlResult;
    try {
      mlResult = await mlClient.predictImage(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
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
    sendInternalError(res, 'Internal gateway failure processing image prediction', err);
  }
};
