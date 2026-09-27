const Cattle = require('../models/Cattle');
const Farmer = require('../models/Farmer');
const HealthCheck = require('../models/HealthCheck');
const { sendSuccess } = require('../utils/responseHandler');
const { getProfile, httpError, pickFields } = require('../utils/controllerHelpers');

async function list(req, res) {
  const farmer = await getProfile(Farmer, req.user.sub, 'Farmer profile');
  const checks = await HealthCheck.find({ farmer: farmer._id })
    .populate('cattle', 'tagNumber name breed')
    .sort({ createdAt: -1 });
  return sendSuccess(res, { data: checks });
}

async function create(req, res) {
  const farmer = await getProfile(Farmer, req.user.sub, 'Farmer profile');
  if (!req.body.cattle) throw httpError(400, 'cattle is required.');
  const cattle = await Cattle.findOne({ _id: req.body.cattle, farmer: farmer._id });
  if (!cattle) throw httpError(404, 'Cattle record not found.');
  const healthCheck = await HealthCheck.create({
    farmer: farmer._id,
    cattle: cattle._id,
    checkType: 'ai',
    ...pickFields(req.body, ['primaryConcern', 'symptoms', 'symptomDetails', 'readings'])
  });
  return sendSuccess(res, { statusCode: 201, message: 'Health check submitted.', data: healthCheck });
}

async function getById(req, res) {
  const farmer = await getProfile(Farmer, req.user.sub, 'Farmer profile');
  const healthCheck = await HealthCheck.findOne({ _id: req.params.id, farmer: farmer._id })
    .populate('cattle', 'tagNumber name breed');
  if (!healthCheck) throw httpError(404, 'Health check not found.');
  return sendSuccess(res, { data: healthCheck });
}

module.exports = { create, getById, list };