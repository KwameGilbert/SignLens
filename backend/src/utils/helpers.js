import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

/**
 * Hash a plain text password using bcrypt.
 * @param {string} password 
 * @returns {Promise<string>}
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plain text password with a hash.
 * @param {string} password 
 * @param {string} hash 
 * @returns {Promise<boolean>}
 */
export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate a JWT token for a user.
 * @param {object} user 
 * @returns {string}
 */
export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.secretKey,
    { expiresIn: config.jwtExpiry }
  );
};

/**
 * Verify a JWT token.
 * @param {string} token 
 * @returns {object} Decoded token payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, config.secretKey);
};

/**
 * Parse pagination parameters from request query.
 * @param {object} req Express request
 * @param {number} defaultLimit 
 * @returns {{limit: number, offset: number}}
 */
export const parsePagination = (req, defaultLimit = 20) => {
  const limit = parseInt(req.query.limit || String(defaultLimit), 10);
  const offset = parseInt(req.query.offset || '0', 10);
  return {
    limit: isNaN(limit) || limit <= 0 ? defaultLimit : limit,
    offset: isNaN(offset) || offset < 0 ? 0 : offset,
  };
};
