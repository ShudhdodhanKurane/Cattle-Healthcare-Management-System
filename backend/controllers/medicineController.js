const MedicalStore = require('../models/MedicalStore');
const Medicine = require('../models/Medicine');
const { sendSuccess } = require('../utils/responseHandler');
const { getProfile, httpError, pickFields } = require('../utils/controllerHelpers');

const editableFields = ['name', 'category', 'packSize', 'price', 'stock', 'reorderLevel', 'description', 'requiresPrescription', 'expiryDate', 'isAvailable'];

async function list(req, res) {
  const filter = { isAvailable: true };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.medicalStore) filter.medicalStore = req.query.medicalStore;
  const medicines = await Medicine.find(filter)
    .populate('medicalStore', 'storeName address isOpen')
    .sort({ name: 1 });
  return sendSuccess(res, { data: medicines });
}

async function getById(req, res) {
  const medicine = await Medicine.findOne({ _id: req.params.id, isAvailable: true })
    .populate('medicalStore', 'storeName address isOpen');
  if (!medicine) throw httpError(404, 'Medicine not found.');
  return sendSuccess(res, { data: medicine });
}

async function create(req, res) {
  const store = await getProfile(MedicalStore, req.user.sub, 'Medical store profile');
  const medicine = await Medicine.create({ medicalStore: store._id, ...pickFields(req.body, editableFields) });
  return sendSuccess(res, { statusCode: 201, message: 'Medicine added.', data: medicine });
}

async function update(req, res) {
  const store = await getProfile(MedicalStore, req.user.sub, 'Medical store profile');
  const medicine = await Medicine.findOneAndUpdate(
    { _id: req.params.id, medicalStore: store._id },
    { $set: pickFields(req.body, editableFields) },
    { new: true, runValidators: true }
  );
  if (!medicine) throw httpError(404, 'Medicine not found in this store.');
  return sendSuccess(res, { message: 'Medicine updated.', data: medicine });
}

async function remove(req, res) {
  const store = await getProfile(MedicalStore, req.user.sub, 'Medical store profile');
  const medicine = await Medicine.findOneAndUpdate(
    { _id: req.params.id, medicalStore: store._id },
    { $set: { isAvailable: false } },
    { new: true }
  );
  if (!medicine) throw httpError(404, 'Medicine not found in this store.');
  return sendSuccess(res, { message: 'Medicine listing disabled.', data: medicine });
}

module.exports = { create, getById, list, remove, update };