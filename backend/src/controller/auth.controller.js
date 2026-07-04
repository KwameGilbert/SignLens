import { OAuth2Client } from 'google-auth-library';
import UserModel from '../model/user.model.js';
import { hashPassword, comparePassword, generateToken } from '../utils/helpers.js';
import { sendSuccess, sendCreated, sendBadRequest, sendUnauthorized, sendForbidden, sendConflict, sendInternalError } from '../utils/response.js';

const client = new OAuth2Client();

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
        firstName: newUser.firstName,
        lastName: newUser.lastName,
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

    const user = await UserModel.findByEmail(email, true);
    if (!user) {
      return sendUnauthorized(res, 'Invalid email or password');
    }

    if (user.status !== 'active') {
      return sendForbidden(res, 'Account is inactive or deactivated');
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return sendUnauthorized(res, 'Invalid email or password');
    }

    const token = generateToken(user);

    sendSuccess(res, {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
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

export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return sendBadRequest(res, 'Google ID token is required');
    }

    let payload;
    try {
      const allowedClientIds = [
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_ID_WEB,
        process.env.GOOGLE_CLIENT_ID_IOS,
        process.env.GOOGLE_CLIENT_ID_ANDROID,
      ].filter(Boolean);

      const ticket = await client.verifyIdToken({
        idToken,
        ...(allowedClientIds.length > 0 ? { audience: allowedClientIds } : {}),
      });
      payload = ticket.getPayload();
    } catch (verifyError) {
      return sendUnauthorized(res, 'Invalid Google ID token', verifyError);
    }

    const { sub: googleId, email, given_name: firstName, family_name: lastName } = payload;

    if (!email) {
      return sendBadRequest(res, 'Google account email not provided');
    }

    // 1. Try to find user by googleId
    let user = await UserModel.findByGoogleId(googleId);

    if (!user) {
      // 2. If not found by googleId, check by email
      user = await UserModel.findByEmail(email, true);
      
      if (user) {
        // Link googleId to existing user
        user = await UserModel.update(user.id, { googleId });
      } else {
        // 3. Register a new user
        user = await UserModel.create({
          email,
          googleId,
          firstName: firstName || 'Google',
          lastName: lastName || 'User',
          role: 'user',
          status: 'active',
        });
      }
    }

    if (user.status !== 'active') {
      return sendForbidden(res, 'Account is inactive or deactivated');
    }

    const token = generateToken(user);

    sendSuccess(res, {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    }, 'Logged in successfully with Google');
  } catch (err) {
    sendInternalError(res, 'Internal server error during Google login', err);
  }
};
