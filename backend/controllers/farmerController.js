const Farmer = require('../models/Farmer');
const DairyOwner = require('../models/DairyOwner');
const { sendSuccess } = require('../utils/responseHandler');
const { getProfile, httpError, pagination, pickFields } = require('../utils/controllerHelpers');

const editableFields = ['farmName', 'address', 'landArea', 'landAreaUnit', 'notes'];

async function getMine(req, res) {
  const profile = await getProfile(Farmer, req.user.sub, 'Farmer profile');
  await profile.populate('user', 'name email phone profileImage');
  return sendSuccess(res, { data: profile });
}

async function updateMine(req, res) {
  const updates = pickFields(req.body, editableFields);
  const profile = await Farmer.findOneAndUpdate(
    { user: req.user.sub },
    { $set: updates, $setOnInsert: { user: req.user.sub } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  ).populate('user', 'name email phone profileImage');
  return sendSuccess(res, { message: 'Farmer profile saved.', data: profile });
}

async function list(req, res) {
  const { page, limit, skip } = pagination(req.query);
  const filter = {};
  if (req.user.role === 'dairy_owner') {
    const dairyOwner = await getProfile(DairyOwner, req.user.sub, 'Dairy owner profile');
    filter.dairyOwner = dairyOwner._id;
  }
  const [farmers, total] = await Promise.all([
    Farmer.find(filter).populate('user', 'name email phone').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Farmer.countDocuments(filter)
  ]);
  return sendSuccess(res, { data: { items: farmers, page, limit, total } });
}

async function getById(req, res) {
  const farmer = await Farmer.findById(req.params.id).populate('user', 'name email phone');
  if (!farmer) throw httpError(404, 'Farmer not found.');
  if (req.user.role === 'dairy_owner') {
    const dairyOwner = await getProfile(DairyOwner, req.user.sub, 'Dairy owner profile');
    if (!farmer.dairyOwner || !farmer.dairyOwner.equals(dairyOwner._id)) {
      throw httpError(403, 'You cannot access this farmer profile.');
    }
  }
  return sendSuccess(res, { data: farmer });
}

module.exports = { getById, getMine, list, updateMine };