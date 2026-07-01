import UserModel from '../model/user.js';
import { hashPassword, comparePassword, generateToken } from '../utils/helpers.js';
import { sendSuccess, sendCreated, sendBadRequest, sendUnauthorized, sendForbidden, sendConflict, sendInternalError } from '../utils/response.js';

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return sendBadRequest(res, 'Email, password, first name, and last name are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendBadRequest(res, 'Invalid email format');
    }

    if (password.length < 6) {
      return sendBadRequest(res, 'Password must be at least 6 characters long');
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return sendConflict(res, 'Email is already registered');
    }

    const passwordHash = await hashPassword(password);

    const newUser = await UserModel.create({
      email,
      passwordHash,
      firstName,
      lastName,
      role: 'user', // default role
    });

    const token = generateToken(newUser);

    sendCreated(res, {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        role: newUser.role,
      },
    }, 'User registered successfully');
  } catch (err) {
    sendInternalError(res, 'Internal server error during registration', err);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendBadRequest(res, 'Email and password are required');
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return sendUnauthorized(res, 'Invalid email or password');
    }

    if (user.status !== 'active') {
      return sendForbidden(res, 'Account is inactive or deactivated');
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return sendUnauthorized(res, 'Invalid email or password');
    }

    const token = generateToken(user);

    sendSuccess(res, {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    }, 'User logged in successfully');
  } catch (err) {
    sendInternalError(res, 'Internal server error during login', err);
  }
};

export const me = (req, res) => {
  sendSuccess(res, { user: req.user }, 'User profile retrieved successfully');
};

export const listUsers = async (req, res) => {
  try {
    const users = await UserModel.listAll();
    sendSuccess(res, users, 'Users list retrieved successfully');
  } catch (err) {
    sendInternalError(res, 'Internal server error retrieving users list', err);
  }
};
