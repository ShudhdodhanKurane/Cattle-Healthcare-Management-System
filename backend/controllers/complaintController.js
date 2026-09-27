const Complaint = require('../models/Complaint');
const Admin = require('../models/Admin');
const { sendSuccess } = require('../utils/responseHandler');
const { httpError, pickFields } = require('../utils/controllerHelpers');

async function list(req, res) {
  const filter = req.user.role === 'admin' ? {} : { reportedBy: req.user.sub };
  if (req.query.status && req.user.role === 'admin') filter.status = req.query.status;
  const complaints = await Complaint.find(filter)
    .populate('reportedBy', 'name email role')
    .populate('assignedAdmin', 'user')
    .sort({ createdAt: -1 });
  return sendSuccess(res, { data: complaints });
}

async function create(req, res) {
  const complaint = await Complaint.create({
    reportedBy: req.user.sub,
    ...pickFields(req.body, ['category', 'subject', 'description', 'priority'])
  });
  return sendSuccess(res, { statusCode: 201, message: 'Complaint submitted.', data: complaint });
}

async function getById(req, res) {
  const filter = { _id: req.params.id };
  if (req.user.role !== 'admin') filter.reportedBy = req.user.sub;
  const complaint = await Complaint.findOne(filter).populate('reportedBy', 'name email role');
  if (!complaint) throw httpError(404, 'Complaint not found.');
  return sendSuccess(res, { data: complaint });
}

async function update(req, res) {
  if (req.user.role !== 'admin') throw httpError(403, 'Only administrators can update complaint status.');
  const updates = pickFields(req.body, ['status', 'priority', 'resolution']);
  if (updates.status === 'resolved' || updates.status === 'closed') updates.resolvedAt = new Date();
  if (req.body.assignTo) {
    const admin = await Admin.findById(req.body.assignTo);
    if (!admin) throw httpError(404, 'Assigned admin profile not found.');
    updates.assignedAdmin = admin._id;
  }
  const complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  );
  if (!complaint) throw httpError(404, 'Complaint not found.');
  return sendSuccess(res, { message: 'Complaint updated.', data: complaint });
}

module.exports = { create, getById, list, update };