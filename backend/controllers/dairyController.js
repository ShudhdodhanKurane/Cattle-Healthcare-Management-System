const DairyOwner = require('../models/DairyOwner');
const Farmer = require('../models/Farmer');
const User = require('../models/User');
const { sendSuccess } = require('../utils/responseHandler');
const { getProfile, httpError, pickFields } = require('../utils/controllerHelpers');

const editableFields = ['dairyName', 'registrationNumber', 'address', 'collectionPoints'];

async function getMine(req, res) {
  const profile = await getProfile(DairyOwner, req.user.sub, 'Dairy owner profile');
  await profile.populate('user', 'name email phone profileImage');
  return sendSuccess(res, { data: profile });
}

async function updateMine(req, res) {
  const updates = pickFields(req.body, editableFields);
  if (!updates.dairyName) {
    const user = await User.findById(req.user.sub).select('name');
    updates.dairyName = user.name;
  }
  const profile = await DairyOwner.findOneAndUpdate(
    { user: req.user.sub },
    { $set: updates, $setOnInsert: { user: req.user.sub } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  ).populate('user', 'name email phone profileImage');
  return sendSuccess(res, { message: 'Dairy profile saved.', data: profile });
}

async function listFarmers(req, res) {
  const dairyOwner = await getProfile(DairyOwner, req.user.sub, 'Dairy owner profile');
  const farmers = await Farmer.find({ dairyOwner: dairyOwner._id })
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 });
  return sendSuccess(res, { data: farmers });
}

async function attachFarmer(req, res) {
  if (!req.body.farmerId) throw httpError(400, 'farmerId is required.');
  const dairyOwner = await getProfile(DairyOwner, req.user.sub, 'Dairy owner profile');
  const farmer = await Farmer.findById(req.body.farmerId);
  if (!farmer) throw httpError(404, 'Farmer not found.');
  if (farmer.dairyOwner && !farmer.dairyOwner.equals(dairyOwner._id)) {
    throw httpError(409, 'Farmer is already linked to another dairy.');
  }
  farmer.dairyOwner = dairyOwner._id;
  await farmer.save();
  await farmer.populate('user', 'name email phone');
  return sendSuccess(res, { statusCode: 200, message: 'Farmer linked to dairy.', data: farmer });
}

module.exports = { attachFarmer, getMine, listFarmers, updateMine };