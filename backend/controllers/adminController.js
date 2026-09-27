const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Farmer = require('../models/Farmer');
const DairyOwner = require('../models/DairyOwner');
const Veterinarian = require('../models/Veterinarian');
const MedicalStore = require('../models/MedicalStore');
const Cattle = require('../models/Cattle');
const VetRequest = require('../models/VetRequest');
const MedicineOrder = require('../models/MedicineOrder');
const Complaint = require('../models/Complaint');
const { sendSuccess } = require('../utils/responseHandler');
const { getProfile, httpError, pagination } = require('../utils/controllerHelpers');

const profileModels = { farmer: Farmer, dairy_owner: DairyOwner, veterinarian: Veterinarian, medical_store: MedicalStore };

async function getStats(req, res) {
  const [users, farmers, dairies, veterinarians, stores, cattle, vetRequests, orders, complaints] = await Promise.all([
    User.countDocuments(), Farmer.countDocuments(), DairyOwner.countDocuments(),
    Veterinarian.countDocuments(), MedicalStore.countDocuments(), Cattle.countDocuments(),
    VetRequest.countDocuments(), MedicineOrder.countDocuments(), Complaint.countDocuments()
  ]);
  return sendSuccess(res, { data: { users, farmers, dairies, veterinarians, stores, cattle, vetRequests, orders, complaints } });
}

async function listUsers(req, res) {
  const { page, limit, skip } = pagination(req.query);
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.active === 'true') filter.isActive = true;
  if (req.query.active === 'false') filter.isActive = false;
  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter)
  ]);
  return sendSuccess(res, { data: { items: users, page, limit, total } });
}

async function updateUserStatus(req, res) {
  if (typeof req.body.isActive !== 'boolean') throw httpError(400, 'isActive must be a boolean.');
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: { isActive: req.body.isActive } },
    { new: true, runValidators: true }
  );
  if (!user) throw httpError(404, 'User not found.');
  return sendSuccess(res, { message: 'User status updated.', data: user });
}

async function verifyProfile(req, res) {
  const Model = profileModels[req.params.role];
  if (!Model) throw httpError(400, 'Unsupported profile role.');
  if (!['verified', 'rejected', 'pending'].includes(req.body.verificationStatus)) {
    throw httpError(400, 'Invalid verificationStatus.');
  }
  const profile = await Model.findByIdAndUpdate(
    req.params.id,
    { $set: { verificationStatus: req.body.verificationStatus } },
    { new: true, runValidators: true }
  );
  if (!profile) throw httpError(404, 'Profile not found.');
  return sendSuccess(res, { message: 'Profile verification updated.', data: profile });
}

async function getMine(req, res) {
  const profile = await getProfile(Admin, req.user.sub, 'Admin profile');
  await profile.populate('user', 'name email phone');
  return sendSuccess(res, { data: profile });
}

async function updateMine(req, res) {
  const permissions = Array.isArray(req.body.permissions) ? req.body.permissions : undefined;
  if (permissions && !req.user.sub) throw httpError(401, 'Authentication is required.');
  const profile = await Admin.findOneAndUpdate(
    { user: new mongoose.Types.ObjectId(req.user.sub) },
    { $set: permissions ? { permissions } : {}, $setOnInsert: { user: req.user.sub } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  return sendSuccess(res, { message: 'Admin profile saved.', data: profile });
}

module.exports = { getMine, getStats, listUsers, updateMine, updateUserStatus, verifyProfile };