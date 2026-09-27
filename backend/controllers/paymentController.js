const DairyOwner = require('../models/DairyOwner');
const Farmer = require('../models/Farmer');
const Appointment = require('../models/Appointment');
const MedicineOrder = require('../models/MedicineOrder');
const MilkRecord = require('../models/MilkRecord');
const MedicalStore = require('../models/MedicalStore');
const Veterinarian = require('../models/Veterinarian');
const Payment = require('../models/Payment');
const { sendSuccess } = require('../utils/responseHandler');
const { getProfile, httpError, pickFields } = require('../utils/controllerHelpers');

async function list(req, res) {
  const filter = req.user.role === 'admin'
    ? {}
    : { $or: [{ payer: req.user.sub }, { payee: req.user.sub }] };
  const payments = await Payment.find(filter).sort({ createdAt: -1 });
  return sendSuccess(res, { data: payments });
}

async function create(req, res) {
  const { purpose, referenceId } = req.body;
  if (!purpose || !referenceId) throw httpError(400, 'purpose and referenceId are required.');

  let payerId;
  let payeeId;
  let amount;
  let linked = {};
  if (purpose === 'medicine_order') {
    const order = await MedicineOrder.findById(referenceId);
    if (!order) throw httpError(404, 'Medicine order not found.');
    const farmer = await Farmer.findById(order.farmer).populate('user', '_id');
    const store = await MedicalStore.findById(order.medicalStore).populate('user', '_id');
    payerId = farmer.user._id;
    payeeId = store.user._id;
    amount = order.total;
    linked = { farmer: farmer._id, medicalStore: store._id, medicineOrder: order._id };
  } else if (purpose === 'milk_purchase') {
    const record = await MilkRecord.findById(referenceId);
    if (!record) throw httpError(404, 'Milk record not found.');
    const farmer = await Farmer.findById(record.farmer).populate('user', '_id');
    const dairy = await DairyOwner.findById(record.dairyOwner).populate('user', '_id');
    payerId = dairy.user._id;
    payeeId = farmer.user._id;
    amount = record.amount ?? (record.quantityLiters * record.ratePerLiter);
    linked = { farmer: farmer._id, dairyOwner: dairy._id, milkRecord: record._id };
  } else if (purpose === 'consultation') {
    const appointment = await Appointment.findById(referenceId);
    if (!appointment) throw httpError(404, 'Appointment not found.');
    const farmer = await Farmer.findById(appointment.farmer).populate('user', '_id');
    const veterinarian = await Veterinarian.findById(appointment.veterinarian).populate('user', '_id');
    payerId = farmer.user._id;
    payeeId = veterinarian.user._id;
    amount = appointment.consultationFee ?? veterinarian.consultationFee;
    linked = { farmer: farmer._id, veterinarian: veterinarian._id };
  } else {
    throw httpError(400, 'Unsupported payment purpose.');
  }

  if (String(payerId) !== req.user.sub) throw httpError(403, 'Only the payer can initiate this payment.');
  if (!Number.isFinite(amount) || amount < 0) {
    throw httpError(400, 'The linked record does not have a valid payment amount.');
  }
  const payment = await Payment.create({
    payer: payerId,
    payee: payeeId,
    purpose,
    amount,
    method: req.body.method,
    ...linked,
    ...pickFields(req.body, ['currency', 'transactionReference', 'notes'])
  });
  return sendSuccess(res, { statusCode: 201, message: 'Payment initiated.', data: payment });
}

async function getById(req, res) {
  const filter = { _id: req.params.id };
  if (req.user.role !== 'admin') filter.$or = [{ payer: req.user.sub }, { payee: req.user.sub }];
  const payment = await Payment.findOne(filter);
  if (!payment) throw httpError(404, 'Payment not found.');
  return sendSuccess(res, { data: payment });
}

async function updateStatus(req, res) {
  if (!['completed', 'failed', 'refunded'].includes(req.body.status)) {
    throw httpError(400, 'Invalid payment status.');
  }
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    { $set: { status: req.body.status, paidAt: req.body.status === 'completed' ? new Date() : undefined } },
    { new: true, runValidators: true }
  );
  if (!payment) throw httpError(404, 'Payment not found.');
  return sendSuccess(res, { message: 'Payment status updated.', data: payment });
}

module.exports = { create, getById, list, updateStatus };