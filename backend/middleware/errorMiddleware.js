const { sendError } = require('../utils/responseHandler');

function notFoundHandler(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = Number(error.statusCode || error.status) || 500;
  const message = statusCode >= 500 && process.env.NODE_ENV === 'production'
    ? 'Internal server error.'
    : error.message || 'Internal server error.';

  return sendError(res, { statusCode, message });
}

module.exports = { errorHandler, notFoundHandler };