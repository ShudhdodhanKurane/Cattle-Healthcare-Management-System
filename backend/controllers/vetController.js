const Appointment = require('../models/Appointment');
const Diagnosis = require('../models/Diagnosis');
const Prescription = require('../models/Prescription');
const User = require('../models/User');
const Veterinarian = require('../models/Veterinarian');
const VetRequest = require('../models/VetRequest');
const { sendSuccess } = require('../utils/responseHandler');
const { getProfile, httpError, pickFields } = require('../utils/controllerHelpers');

const editableFields = [
  'licenseNumber', 'qualifications', 'specializations', 'yearsOfExperience',
  'clinicName', 'clinicAddress', 'serviceAreas', 'consultationFee', 'isAvailable'
];

async function getMine(req, res) {
  const profile = await getProfile(Veterinarian, req.user.sub, 'Veterinarian profile');
  await profile.populate('user', 'name email phone profileImage');
  return sendSuccess(res, { data: profile });
}

async function updateMine(req, res) {
  const updates = pickFields(req.body, editableFields);
  if (!updates.licenseNumber) {
    throw httpError(400, 'licenseNumber is required to create a veterinarian profile.');
  }
  const profile = await Veterinarian.findOneAndUpdate(
    { user: req.user.sub },
    { $set: updates, $setOnInsert: { user: req.user.sub } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  ).populate('user', 'name email phone profileImage');
  return sendSuccess(res, { message: 'Veterinarian profile saved.', data: profile });
}

async function listRequests(req, res) {
  const veterinarian = await getProfile(Veterinarian, req.user.sub, 'Veterinarian profile');
  const filter = {
    status: req.query.status || 'pending',
    $or: [
      { assignedVeterinarian: veterinarian._id },
      { preferredVeterinarian: veterinarian._id },
      { assignedVeterinarian: null }
    ]
  };
  const requests = await VetRequest.find(filter)
    .populate('farmer', 'user')
    .populate('cattle', 'tagNumber name breed')
    .sort({ priority: -1, createdAt: 1 });
  return sendSuccess(res, { data: requests });
}

async function respondToRequest(req, res) {
  const { status, declinedReason } = req.body;
  if (!['accepted', 'declined'].includes(status)) {
    throw httpError(400, 'status must be accepted or declined.');
  }
  const veterinarian = await getProfile(Veterinarian, req.user.sub, 'Veterinarian profile');
  const request = await VetRequest.findOne({
    _id: req.params.id,
    status: 'pending',
    $or: [
      { assignedVeterinarian: veterinarian._id },
      { preferredVeterinarian: veterinarian._id },
      { assignedVeterinarian: null }
    ]
  });
  if (!request) throw httpError(404, 'Pending veterinarian request not found.');
  request.status = status;
  if (status === 'accepted') request.assignedVeterinarian = veterinarian._id;
  if (status === 'declined') request.declinedReason = declinedReason;
  await request.save();
  return sendSuccess(res, { message: `Request ${status}.`, data: request });
}

async function listAppointments(req, res) {
  const veterinarian = await getProfile(Veterinarian, req.user.sub, 'Veterinarian profile');
  const appointments = await Appointment.find({ veterinarian: veterinarian._id })
    .populate('farmer', 'user')
    .populate('cattle', 'tagNumber name breed')
    .sort({ scheduledAt: 1 });
  return sendSuccess(res, { data: appointments });
}

async function createDiagnosis(req, res) {
  const veterinarian = await getProfile(Veterinarian, req.user.sub, 'Veterinarian profile');
  const appointment = await Appointment.findOne({
    _id: req.body.appointment,
    veterinarian: veterinarian._id
  });
  if (!appointment) throw httpError(404, 'Appointment not found for this veterinarian.');
  if (!req.body.primaryCondition) throw httpError(400, 'primaryCondition is required.');

  const diagnosis = await Diagnosis.create({
    appointment: appointment._id,
    vetRequest: appointment.vetRequest,
    veterinarian: veterinarian._id,
    farmer: appointment.farmer,
    cattle: appointment.cattle,
    ...pickFields(req.body, ['primaryCondition', 'severity', 'clinicalFindings', 'vitals', 'carePlan', 'followUpAt'])
  });
  return sendSuccess(res, { statusCode: 201, message: 'Diagnosis recorded.', data: diagnosis });
}

async function createPrescription(req, res) {
  const veterinarian = await getProfile(Veterinarian, req.user.sub, 'Veterinarian profile');
  if (!req.body.diagnosis) throw httpError(400, 'diagnosis is required.');
  const diagnosis = await Diagnosis.findOne({ _id: req.body.diagnosis, veterinarian: veterinarian._id });
  if (!diagnosis) throw httpError(404, 'Diagnosis not found for this veterinarian.');
  const prescription = await Prescription.create({
    diagnosis: diagnosis._id,
    appointment: diagnosis.appointment,
    veterinarian: veterinarian._id,
    farmer: diagnosis.farmer,
    cattle: diagnosis.cattle,
    ...pickFields(req.body, ['items', 'notes', 'expiresAt'])
  });
  return sendSuccess(res, { statusCode: 201, message: 'Prescription created.', data: prescription });
}

module.exports = {
  createDiagnosis,
  createPrescription,
  getMine,
  listAppointments,
  listRequests,
  respondToRequest,
  updateMine
};