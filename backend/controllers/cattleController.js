const Cattle = require('../models/Cattle');
const Farmer = require('../models/Farmer');
const { sendSuccess } = require('../utils/responseHandler');
const { getProfile, httpError, pickFields } = require('../utils/controllerHelpers');

const editableFields = ['tagNumber', 'name', 'breed', 'sex', 'dateOfBirth', 'weightKg', 'color', 'photo', 'notes', 'mother', 'father', 'status'];

async function list(req, res) {
  const farmer = await getProfile(Farmer, req.user.sub, 'Farmer profile');
  const filter = { farmer: farmer._id };
  if (req.query.status) filter.status = req.query.status;
  const cattle = await Cattle.find(filter).sort({ createdAt: -1 });
  return sendSuccess(res, { data: cattle });
}

async function create(req, res) {
  const farmer = await getProfile(Farmer, req.user.sub, 'Farmer profile');
  const cattle = await Cattle.create({ farmer: farmer._id, ...pickFields(req.body, editableFields) });
  return sendSuccess(res, { statusCode: 201, message: 'Cattle registered.', data: cattle });
}

async function getById(req, res) {
  const farmer = await getProfile(Farmer, req.user.sub, 'Farmer profile');
  const cattle = await Cattle.findOne({ _id: req.params.id, farmer: farmer._id });
  if (!cattle) throw httpError(404, 'Cattle record not found.');
  return sendSuccess(res, { data: cattle });
}

async function update(req, res) {
  const farmer = await getProfile(Farmer, req.user.sub, 'Farmer profile');
  const cattle = await Cattle.findOneAndUpdate(
    { _id: req.params.id, farmer: farmer._id },
    { $set: pickFields(req.body, editableFields) },
    { new: true, runValidators: true }
  );
  if (!cattle) throw httpError(404, 'Cattle record not found.');
  return sendSuccess(res, { message: 'Cattle record updated.', data: cattle });
}

async function remove(req, res) {
  const farmer = await getProfile(Farmer, req.user.sub, 'Farmer profile');
  const cattle = await Cattle.findOneAndUpdate(
    { _id: req.params.id, farmer: farmer._id },
    { $set: { status: 'sold' } },
    { new: true }
  );
  if (!cattle) throw httpError(404, 'Cattle record not found.');
  return sendSuccess(res, { message: 'Cattle record archived.', data: cattle });
}

module.exports = { create, getById, list, remove, update };