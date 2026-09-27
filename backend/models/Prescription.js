const mongoose = require('mongoose');

const prescriptionItemSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
  medicineName: { type: String, required: true, trim: true },
  dosage: { type: String, required: true, trim: true },
  frequency: { type: String, trim: true },
  durationDays: { type: Number, min: 1 },
  quantity: { type: Number, min: 1 },
  instructions: { type: String, trim: true }
});

const prescriptionSchema = new mongoose.Schema({
  diagnosis: { type: mongoose.Schema.Types.ObjectId, ref: 'Diagnosis' },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  veterinarian: { type: mongoose.Schema.Types.ObjectId, ref: 'Veterinarian', required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  cattle: { type: mongoose.Schema.Types.ObjectId, ref: 'Cattle', required: true },
  items: { type: [prescriptionItemSchema], required: true, validate: (items) => items.length > 0 },
  notes: { type: String, trim: true },
  issuedAt: { type: Date, default: Date.now },
  expiresAt: Date,
  status: { type: String, enum: ['active', 'fulfilled', 'cancelled', 'expired'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.models.Prescription
  || mongoose.model('Prescription', prescriptionSchema);