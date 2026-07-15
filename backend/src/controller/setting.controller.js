import SettingModel from '../model/setting.model.js';
import { sendSuccess, sendBadRequest, sendNotFound, sendInternalError } from '../utils/response.js';

export const listSettings = async (req, res) => {
  try {
    const settings = await SettingModel.findAll();
    sendSuccess(res, settings, 'Settings retrieved successfully');
  } catch (err) {
    sendInternalError(res, 'Error retrieving settings', err);
  }
};

export const getSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await SettingModel.findByKey(key);
    if (!setting) {
      return sendNotFound(res, 'Setting not found');
    }
    sendSuccess(res, setting, 'Setting retrieved successfully');
  } catch (err) {
    sendInternalError(res, 'Error retrieving setting', err);
  }
};

export const updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return sendBadRequest(res, 'Value is required');
    }

    const existing = await SettingModel.findByKey(key);
    if (!existing) {
      // Create if it doesn't exist
      const created = await SettingModel.create({ key, value });
      return sendSuccess(res, created, 'Setting created successfully');
    }

    const updated = await SettingModel.updateByKey(key, value);
    sendSuccess(res, updated, 'Setting updated successfully');
  } catch (err) {
    sendInternalError(res, 'Error updating setting', err);
  }
};
