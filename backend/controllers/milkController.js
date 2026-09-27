const DairyOwner = require('../models/DairyOwner');
const Farmer = require('../models/Farmer');
const Cattle = require('../models/Cattle');
const MilkRecord = require('../models/MilkRecord');
const { sendSuccess } = require('../utils/responseHandler');
const { getProfile, httpError, pickFields } = require('../utils/controllerHelpers');

async function getFilter(req) {
  if (req.user.role === 'dairy_owner') {
    const dairy = await getProfile(DairyOwner, req.user.sub, 'Dairy owner profile');
    const filter = { dairyOwner: dairy._id };
    if (req.query.farmer) filter.farmer = req.query.farmer;
    return filter;
  }
  if (req.user.role === 'farmer') {
    const farmer = await getProfile(Farmer, req.user.sub, 'Farmer profile');
    return { farmer: farmer._id };
  }
  return {};
}

async function list(req, res) {
  const filter = await getFilter(req);
  if (req.query.from || req.query.to) {
    filter.collectionDate = {};
    if (req.query.from) filter.collectionDate.$gte = new Date(req.query.from);
    if (req.query.to) filter.collectionDate.$lte = new Date(req.query.to);
  }
  const records = await MilkRecord.find(filter)
    .populate('farmer', 'user')
    .populate('cattle', 'tagNumber name')
    .sort({ collectionDate: -1 });
  return sendSuccess(res, { data: records });
}

async function create(req, res) {
  const dairy = await getProfile(DairyOwner, req.user.sub, 'Dairy owner profile');
  if (!req.body.farmer) throw httpError(400, 'farmer is required.');
  const farmer = await Farmer.findOne({ _id: req.body.farmer, dairyOwner: dairy._id });
  if (!farmer) throw httpError(404, 'Farmer is not linked to this dairy.');
  if (req.body.cattle) {
    const cattle = await Cattle.findOne({ _id: req.body.cattle, farmer: farmer._id });
    if (!cattle) throw httpError(404, 'Cattle record does not belong to this farmer.');
  }
  const record = await MilkRecord.create({
    dairyOwner: dairy._id,
    farmer: farmer._id,
    recordedBy: req.user.sub,
    ...pickFields(req.body, ['cattle', 'collectionDate', 'session', 'quantityLiters', 'fatPercentage', 'snfPercentage', 'ratePerLiter', 'amount', 'status', 'notes'])
  });
  return sendSuccess(res, { statusCode: 201, message: 'Milk record created.', data: record });
}

async function getById(req, res) {
  const filter = await getFilter(req);
  filter._id = req.params.id;
  const record = await MilkRecord.findOne(filter).populate('farmer', 'user').populate('cattle', 'tagNumber name');
  if (!record) throw httpError(404, 'Milk record not found.');
  return sendSuccess(res, { data: record });
}

async function update(req, res) {
  const dairy = await getProfile(DairyOwner, req.user.sub, 'Dairy owner profile');
  const record = await MilkRecord.findOneAndUpdate(
    { _id: req.params.id, dairyOwner: dairy._id },
    { $set: pickFields(req.body, ['collectionDate', 'session', 'quantityLiters', 'fatPercentage', 'snfPercentage', 'ratePerLiter', 'amount', 'status', 'notes']) },
    { new: true, runValidators: true }
  );
  if (!record) throw httpError(404, 'Milk record not found.');
  return sendSuccess(res, { message: 'Milk record updated.', data: record });
}

module.exports = { create, getById, list, update };