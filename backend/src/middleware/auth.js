import UserModel from '../model/user.js';
import { verifyToken } from '../utils/helpers.js';
import { sendUnauthorized, sendForbidden, sendInternalError } from '../utils/response.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendUnauthorized(res, 'Authorization header missing or invalid format');
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return sendUnauthorized(res, 'Token is invalid or expired');
    }

    if (!decoded.id) {
      return sendUnauthorized(res, 'Invalid token payload structure');
    }

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return sendUnauthorized(res, 'User associated with token no longer exists');
    }

    if (user.status !== 'active') {
      return sendForbidden(res, 'User account is inactive or deactivated');
    }

    // Attach user information to request object
    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
    };

    next();
  } catch (err) {
    sendInternalError(res, 'Internal server error during authentication', err);
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return sendUnauthorized(res, 'Authentication required');
  }
  
  // Accept admin or super_admin, content_editor, moderator roles as "admin" depending on context
  // Here requireAdmin is for basic admin operations
  const adminRoles = ['super_admin', 'admin', 'content_editor', 'moderator'];
  if (!adminRoles.includes(req.user.role)) {
    return sendForbidden(res, 'Forbidden: Admin access required');
  }
  
  next();
};
