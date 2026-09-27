const jwt = require('jsonwebtoken');
const { getJwtSecret, jwtExpiresIn } = require('../config/jwt');

function generateToken(userId, role) {
  return jwt.sign({ sub: String(userId), role }, getJwtSecret(), {
    expiresIn: jwtExpiresIn
  });
}

module.exports = generateToken;