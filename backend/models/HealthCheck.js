const mongoose = require('mongoose');

const healthCheckSchema = new mongoose.Schema({
  cattle: { type: mongoose.Schema.Types.ObjectId, ref: 'Cattle', required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Veterinarian' },
  checkType: { type: String, enum: ['ai', 'manual'], default: 'ai' },
  primaryConcern: { type: String, trim: true },
  symptoms: { type: String, required: true, trim: true },
  symptomDetails: { type: String, trim: true },
  readings: {
    temperatureCelsius: { type: Number, min: 0 },
    heartRate: { type: Number, min: 0 },
    respiratoryRate: { type: Number, min: 0 },
    weightKg: { type: Number, min: 0 }
  },
  assessment: { type: String, trim: true },
  severity: { type: String, enum: ['low', 'moderate', 'high', 'critical'] },
  recommendations: [{ type: String, trim: true }],
  status: { type: String, enum: ['submitted', 'reviewed'], default: 'submitted' }
}, { timestamps: true });

healthCheckSchema.index({ cattle: 1, createdAt: -1 });

module.exports = mongoose.models.HealthCheck
  || mongoose.model('HealthCheck', healthCheckSchema);