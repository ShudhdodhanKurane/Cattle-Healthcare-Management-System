const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  ticketNumber: { type: String, trim: true, unique: true, sparse: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  category: {
    type: String,
    enum: ['account', 'payment', 'medicine_order', 'veterinary_service', 'milk_collection', 'other'],
    default: 'other'
  },
  subject: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' },
  status: { type: String, enum: ['open', 'assigned', 'in_progress', 'resolved', 'closed'], default: 'open' },
  resolution: { type: String, trim: true },
  resolvedAt: Date
}, { timestamps: true });

complaintSchema.index({ status: 1, priority: 1, createdAt: -1 });

module.exports = mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);