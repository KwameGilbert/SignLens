import ActivityLogModel from '../model/activityLog.model.js';
import { parsePagination } from '../utils/helpers.js';
import { sendSuccess, sendCreated, sendBadRequest, sendInternalError } from '../utils/response.js';

export const listActivityLogs = async (req, res) => {
  try {
    const { limit, offset } = parsePagination(req, 50);
    const { userId } = req.query;

    let logs;
    if (userId) {
      logs = await ActivityLogModel.findByUserId(userId, limit, offset);
    } else {
      logs = await ActivityLogModel.findAll({ limit, offset, orderBy: 'createdAt', orderDir: 'desc' });
    }
    sendSuccess(res, logs, 'Activity logs retrieved successfully');
  } catch (err) {
    sendInternalError(res, 'Error retrieving activity logs', err);
  }
};

export const createActivityLog = async (req, res) => {
  try {
    const { userId, eventDescription, category, before, after } = req.body;
    if (!eventDescription || !category) {
      return sendBadRequest(res, 'EventDescription and category are required fields');
    }

    const log = await ActivityLogModel.create({
      userId: userId || req.user?.id || null, // default to authenticated user if not specified
      eventDescription,
      category,
      before,
      after,
    });
    sendCreated(res, log, 'Activity log recorded successfully');
  } catch (err) {
    sendInternalError(res, 'Error creating activity log', err);
  }
};
