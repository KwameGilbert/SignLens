import UserModel from '../model/user.model.js';
import { sendSuccess, sendInternalError } from '../utils/response.js';

export const listUsers = async (req, res) => {
  try {
    const users = await UserModel.listAll();
    sendSuccess(res, users, 'Users list retrieved successfully');
  } catch (err) {
    sendInternalError(res, 'Internal server error retrieving users list', err);
  }
};
