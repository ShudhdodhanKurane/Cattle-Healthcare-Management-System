function sendSuccess(res, { statusCode = 200, message = 'Success.', data = null } = {}) {
  return res.status(statusCode).json({ success: true, message, data });
}

function sendError(res, { statusCode = 500, message = 'Internal server error.', errors } = {}) {
  const body = { success: false, message };
  if (errors !== undefined) {
    body.errors = errors;
  }

  return res.status(statusCode).json(body);
}

module.exports = { sendSuccess, sendError };