import HistoryModel from '../model/history.js';
import { parsePagination } from '../utils/helpers.js';
import { sendSuccess, sendCreated, sendBadRequest, sendInternalError } from '../utils/response.js';

export const getHistory = async (req, res) => {
  try {
    const { limit, offset } = parsePagination(req, 20);

    const logs = await HistoryModel.findByUserId(req.user.id, limit, offset);
    sendSuccess(res, logs, 'History logs retrieved successfully');
  } catch (err) {
    sendInternalError(res, 'Internal server error retrieving history logs', err);
  }
};

export const createHistory = async (req, res) => {
  try {
    let { prediction, confidence, mode, inputType, resolutionStatus } = req.body;

    // Backward compatibility mapping for mode/inputType
    if (!mode && inputType) {
      if (inputType === 'image' || inputType === 'video' || inputType === 'stream') {
        mode = 'camera';
      } else {
        mode = inputType; // e.g. voice, text
      }
    }

    if (!prediction || confidence === undefined) {
      return sendBadRequest(res, 'Prediction and confidence are required fields');
    }

    if (!mode || (mode !== 'voice' && mode !== 'camera' && mode !== 'text')) {
      return sendBadRequest(res, 'mode must be either voice, camera, or text');
    }

    const confVal = parseFloat(confidence);
    if (isNaN(confVal) || confVal < 0 || confVal > 1) {
      return sendBadRequest(res, 'confidence must be a number between 0 and 1');
    }

    // Evaluate resolution status if not explicitly sent
    if (!resolutionStatus) {
      resolutionStatus = confVal >= 0.8 ? 'success' : 'low_confidence';
    }

    if (resolutionStatus !== 'success' && resolutionStatus !== 'failed' && resolutionStatus !== 'low_confidence') {
      return sendBadRequest(res, 'resolutionStatus must be either success, failed, or low_confidence');
    }

    const newLog = await HistoryModel.create({
      userId: req.user.id,
      mode,
      prediction,
      confidenceRating: confVal,
      resolutionStatus,
    });

    sendCreated(res, newLog, 'Translation history recorded successfully');
  } catch (err) {
    sendInternalError(res, 'Internal server error recording translation history', err);
  }
};

export const getAllHistory = async (req, res) => {
  try {
    const { limit, offset } = parsePagination(req, 50);

    const logs = await HistoryModel.findAll(limit, offset);
    sendSuccess(res, logs, 'Global history logs retrieved successfully');
  } catch (err) {
    sendInternalError(res, 'Internal server error retrieving global history logs', err);
  }
};
