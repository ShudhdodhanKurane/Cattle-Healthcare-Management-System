const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  vetRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'VetRequest' },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  cattle: { type: mongoose.Schema.Types.ObjectId, ref: 'Cattle', required: true },
  veterinarian: { type: mongoose.Schema.Types.ObjectId, ref: 'Veterinarian', required: true },
  scheduledAt: { type: Date, required: true },
  visitType: { type: String, enum: ['farm_visit', 'clinic', 'remote'], default: 'farm_visit' },
  location: { type: String, trim: true },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'],
    default: 'scheduled'
  },
  consultationFee: { type: Number, min: 0 },
  notes: { type: String, trim: true },
  followUpAt: Date
}, { timestamps: true });

appointmentSchema.index({ veterinarian: 1, scheduledAt: 1 });
appointmentSchema.index({ farmer: 1, scheduledAt: -1 });

module.exports = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);