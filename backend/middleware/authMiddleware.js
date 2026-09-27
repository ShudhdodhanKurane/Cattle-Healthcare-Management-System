const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../config/jwt');

function authMiddleware(req, res, next) {
  const authorization = req.get('authorization');
  const [scheme, token] = authorization ? authorization.split(' ') : [];

  if (scheme !== 'Bearer' || !token) {
    const error = new Error('Authentication token is required.');
    error.statusCode = 401;
    return next(error);
  }

  try {
    req.user = jwt.verify(token, getJwtSecret());
    return next();
  } catch (error) {
    const authError = new Error('Invalid or expired authentication token.');
    authError.statusCode = 401;
    return next(authError);
  }
}

module.exports = authMiddleware;