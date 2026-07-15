/**
 * Standard API Response Utility
 */

/**
 * Send a success response.
 * @param {object} res Express response object
 * @param {any} data Response payload data
 * @param {string} message Optional success message
 * @param {number} statusCode HTTP Status Code (default 200)
 */
export const sendSuccess = (res, data = null, message = 'Request completed successfully', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send a created resource success response (201).
 * @param {object} res Express response object
 * @param {any} data Created resource data
 * @param {string} message Success message
 */
export const sendCreated = (res, data = null, message = 'Resource created successfully') => {
  return sendSuccess(res, data, message, 201);
};

/**
 * Send an error response template.
 * @param {object} res Express response object
 * @param {string} message Error detail message
 * @param {number} statusCode HTTP Status Code
 * @param {string} errorCode Internal error identifier code
 * @param {any} details Optional extra details
 */
export const sendError = (res, message, statusCode, errorCode = 'ERROR', details = null) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      ...(details && { details }),
    },
  });
};

/**
 * Bad Request Response (400)
 */
export const sendBadRequest = (res, message = 'Bad request parameters', details = null) => {
  return sendError(res, message, 400, 'BAD_REQUEST', details);
};

/**
 * Unauthorized Response (401)
 */
export const sendUnauthorized = (res, message = 'Authentication required') => {
  return sendError(res, message, 401, 'UNAUTHORIZED');
};

/**
 * Forbidden Response (403)
 */
export const sendForbidden = (res, message = 'Access denied') => {
  return sendError(res, message, 403, 'FORBIDDEN');
};

/**
 * Not Found Response (404)
 */
export const sendNotFound = (res, message = 'Resource not found') => {
  return sendError(res, message, 404, 'NOT_FOUND');
};

/**
 * Conflict Response (409)
 */
export const sendConflict = (res, message = 'Resource conflict') => {
  return sendError(res, message, 409, 'CONFLICT');
};

/**
 * Internal Server Error Response (500)
 */
export const sendInternalError = (res, message = 'An unexpected internal server error occurred', err = null) => {
  if (err) {
    console.error('[DATABASE/SYSTEM ERROR]:', err);
  }
  return sendError(res, message, 500, 'INTERNAL_SERVER_ERROR', process.env.NODE_ENV === 'development' && err ? err.stack : null);
};

export default {
  sendSuccess,
  sendCreated,
  sendError,
  sendBadRequest,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
  sendConflict,
  sendInternalError,
};
