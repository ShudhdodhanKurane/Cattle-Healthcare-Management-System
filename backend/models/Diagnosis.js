const mongoose = require('mongoose');

const diagnosisSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  vetRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'VetRequest' },
  veterinarian: { type: mongoose.Schema.Types.ObjectId, ref: 'Veterinarian', required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  cattle: { type: mongoose.Schema.Types.ObjectId, ref: 'Cattle', required: true },
  primaryCondition: { type: String, required: true, trim: true },
  severity: { type: String, enum: ['mild', 'moderate', 'severe'], default: 'mild' },
  clinicalFindings: { type: String, trim: true },
  vitals: {
    temperatureCelsius: { type: Number, min: 0 },
    heartRate: { type: Number, min: 0 },
    respiratoryRate: { type: Number, min: 0 }
  },
  carePlan: { type: String, trim: true },
  followUpAt: Date,
  status: { type: String, enum: ['active', 'resolved'], default: 'active' }
}, { timestamps: true });

diagnosisSchema.index({ cattle: 1, createdAt: -1 });

module.exports = mongoose.models.Diagnosis || mongoose.model('Diagnosis', diagnosisSchema);