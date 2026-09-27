const mongoose = require('mongoose');

const vetRequestSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  cattle: { type: mongoose.Schema.Types.ObjectId, ref: 'Cattle', required: true },
  preferredVeterinarian: { type: mongoose.Schema.Types.ObjectId, ref: 'Veterinarian' },
  assignedVeterinarian: { type: mongoose.Schema.Types.ObjectId, ref: 'Veterinarian' },
  healthCheck: { type: mongoose.Schema.Types.ObjectId, ref: 'HealthCheck' },
  primaryConcern: { type: String, trim: true },
  symptoms: { type: String, required: true, trim: true },
  details: { type: String, trim: true },
  priority: { type: String, enum: ['routine', 'urgent', 'emergency'], default: 'routine' },
  visitType: { type: String, enum: ['farm_visit', 'clinic', 'remote'], default: 'farm_visit' },
  location: { type: String, trim: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'completed', 'cancelled'],
    default: 'pending'
  },
  requestedAt: { type: Date, default: Date.now },
  declinedReason: { type: String, trim: true }
}, { timestamps: true });

vetRequestSchema.index({ farmer: 1, status: 1, createdAt: -1 });
vetRequestSchema.index({ assignedVeterinarian: 1, status: 1 });

module.exports = mongoose.models.VetRequest || mongoose.model('VetRequest', vetRequestSchema);