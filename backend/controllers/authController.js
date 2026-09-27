const crypto = require('crypto');
const { promisify } = require('util');
const User = require('../models/User');
const Farmer = require('../models/Farmer');
const generateToken = require('../utils/generateToken');
const { sendSuccess } = require('../utils/responseHandler');
const { httpError } = require('../utils/controllerHelpers');
const { isValidEmail } = require('../utils/validators');

const scrypt = promisify(crypto.scrypt);
const roles = ['farmer', 'dairy_owner', 'veterinarian', 'medical_store'];

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, 64);
  return `scrypt$${salt}$${derivedKey.toString('hex')}`;
}

async function verifyPassword(password, storedHash) {
  const [algorithm, salt, storedKey] = (storedHash || '').split('$');
  if (algorithm !== 'scrypt' || !salt || !storedKey) return false;

  const expected = Buffer.from(storedKey, 'hex');
  if (expected.length === 0) return false;
  const actual = await scrypt(password, salt, expected.length);
  return crypto.timingSafeEqual(expected, actual);
}

function publicUser(user) {
  const data = user.toObject ? user.toObject() : { ...user };
  delete data.password;
  return data;
}

async function register(req, res) {
  const { name, email, password, phone } = req.body || {};
  const role = req.body?.role || 'farmer';
  if (typeof name !== 'string' || !name.trim()
    || typeof email !== 'string' || !isValidEmail(email)
    || typeof password !== 'string' || !password) {
    throw httpError(400, 'Name, email, and password are required.');
  }
  if (password.length < 8) {
    throw httpError(400, 'Password must be at least 8 characters long.');
  }
  if (!roles.includes(role)) {
    throw httpError(400, 'A valid non-admin account role is required.');
  }

  const user = await User.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: await hashPassword(password),
    phone,
    role
  });
  if (role === 'farmer') {
    await Farmer.create({ user: user._id });
  }

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Account created.',
    data: { user: publicUser(user), token: generateToken(user._id, user.role) }
  });
}

async function login(req, res) {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || !isValidEmail(email)
    || typeof password !== 'string' || !password) {
    throw httpError(400, 'Email and password are required.');
  }

  const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select('+password');
  if (!user || !user.isActive || !(await verifyPassword(password, user.password))) {
    throw httpError(401, 'Email or password is incorrect.');
  }

  user.lastLoginAt = new Date();
  await user.save();
  return sendSuccess(res, {
    message: 'Signed in.',
    data: { user: publicUser(user), token: generateToken(user._id, user.role) }
  });
}

async function getCurrentUser(req, res) {
  const user = await User.findById(req.user.sub);
  if (!user) throw httpError(404, 'User not found.');
  return sendSuccess(res, { data: { user } });
}

module.exports = { getCurrentUser, login, register };