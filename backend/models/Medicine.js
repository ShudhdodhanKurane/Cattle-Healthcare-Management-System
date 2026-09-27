const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  medicalStore: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalStore',
    required: true
  },
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['nutrition', 'antibiotic', 'vaccine', 'topical_care', 'other'],
    default: 'other'
  },
  packSize: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  reorderLevel: { type: Number, min: 0, default: 10 },
  description: { type: String, trim: true },
  requiresPrescription: { type: Boolean, default: false },
  expiryDate: Date,
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

medicineSchema.index({ medicalStore: 1, name: 1 });

module.exports = mongoose.models.Medicine || mongoose.model('Medicine', medicineSchema);