function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be set before using JWT authentication.');
  }

  return process.env.JWT_SECRET;
}

const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

module.exports = { getJwtSecret, jwtExpiresIn };