import BadgeModel from '../model/badge.model.js';
import { sendSuccess, sendCreated, sendBadRequest, sendNotFound, sendInternalError } from '../utils/response.js';

export const listBadges = async (req, res) => {
  try {
    const badges = await BadgeModel.findAll();
    sendSuccess(res, badges, 'Badges retrieved successfully');
  } catch (err) {
    sendInternalError(res, 'Error retrieving badges', err);
  }
};

export const getBadge = async (req, res) => {
  try {
    const { id } = req.params;
    const badge = await BadgeModel.findById(id);
    if (!badge) {
      return sendNotFound(res, 'Badge not found');
    }
    sendSuccess(res, badge, 'Badge retrieved successfully');
  } catch (err) {
    sendInternalError(res, 'Error retrieving badge', err);
  }
};

export const createBadge = async (req, res) => {
  try {
    const { name, icon, description, xpReward, triggerRequirement } = req.body;
    if (!name || !triggerRequirement) {
      return sendBadRequest(res, 'Name and triggerRequirement are required fields');
    }

    const existing = await BadgeModel.findByTriggerRequirement(triggerRequirement);
    if (existing) {
      return sendBadRequest(res, 'Badge with this trigger requirement already exists');
    }

    const badge = await BadgeModel.create({ name, icon, description, xpReward, triggerRequirement });
    sendCreated(res, badge, 'Badge created successfully');
  } catch (err) {
    sendInternalError(res, 'Error creating badge', err);
  }
};

export const updateBadge = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, description, xpReward, triggerRequirement } = req.body;

    const existing = await BadgeModel.findById(id);
    if (!existing) {
      return sendNotFound(res, 'Badge not found');
    }

    if (triggerRequirement && triggerRequirement !== existing.triggerRequirement) {
      const duplicate = await BadgeModel.findByTriggerRequirement(triggerRequirement);
      if (duplicate) {
        return sendBadRequest(res, 'Badge with this trigger requirement already exists');
      }
    }

    const updated = await BadgeModel.update(id, { name, icon, description, xpReward, triggerRequirement });
    sendSuccess(res, updated, 'Badge updated successfully');
  } catch (err) {
    sendInternalError(res, 'Error updating badge', err);
  }
};

export const deleteBadge = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await BadgeModel.findById(id);
    if (!existing) {
      return sendNotFound(res, 'Badge not found');
    }

    await BadgeModel.delete(id);
    sendSuccess(res, null, 'Badge deleted successfully');
  } catch (err) {
    sendInternalError(res, 'Error deleting badge', err);
  }
};
