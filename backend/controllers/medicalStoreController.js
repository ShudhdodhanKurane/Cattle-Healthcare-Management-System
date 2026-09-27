const MedicalStore = require('../models/MedicalStore');
const MedicineOrder = require('../models/MedicineOrder');
const User = require('../models/User');
const { sendSuccess } = require('../utils/responseHandler');
const { getProfile, httpError, pickFields } = require('../utils/controllerHelpers');

const editableFields = ['storeName', 'licenseNumber', 'address', 'phone', 'isOpen'];
const orderStatuses = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

async function getMine(req, res) {
  const profile = await getProfile(MedicalStore, req.user.sub, 'Medical store profile');
  await profile.populate('user', 'name email phone profileImage');
  return sendSuccess(res, { data: profile });
}

async function updateMine(req, res) {
  const updates = pickFields(req.body, editableFields);
  if (!updates.storeName) {
    const user = await User.findById(req.user.sub).select('name');
    updates.storeName = user.name;
  }
  if (!updates.licenseNumber) {
    const current = await MedicalStore.findOne({ user: req.user.sub }).select('licenseNumber');
    if (!current) throw httpError(400, 'licenseNumber is required to create a store profile.');
    updates.licenseNumber = current.licenseNumber;
  }
  const profile = await MedicalStore.findOneAndUpdate(
    { user: req.user.sub },
    { $set: updates, $setOnInsert: { user: req.user.sub } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  ).populate('user', 'name email phone profileImage');
  return sendSuccess(res, { message: 'Medical store profile saved.', data: profile });
}

async function listOrders(req, res) {
  const store = await getProfile(MedicalStore, req.user.sub, 'Medical store profile');
  const filter = { medicalStore: store._id };
  if (req.query.status) filter.status = req.query.status;
  const orders = await MedicineOrder.find(filter)
    .populate('farmer', 'user')
    .populate('items.medicine', 'name packSize')
    .sort({ createdAt: -1 });
  return sendSuccess(res, { data: orders });
}

async function updateOrderStatus(req, res) {
  const { status } = req.body;
  if (!orderStatuses.includes(status)) throw httpError(400, 'Invalid order status.');
  const store = await getProfile(MedicalStore, req.user.sub, 'Medical store profile');
  const order = await MedicineOrder.findOneAndUpdate(
    { _id: req.params.id, medicalStore: store._id },
    { $set: { status } },
    { new: true, runValidators: true }
  );
  if (!order) throw httpError(404, 'Order not found for this store.');
  return sendSuccess(res, { message: 'Order status updated.', data: order });
}

module.exports = { getMine, listOrders, updateMine, updateOrderStatus };