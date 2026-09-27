const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  line1: { type: String, trim: true },
  line2: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  postalCode: { type: String, trim: true },
  country: { type: String, trim: true }
}, { _id: false });

const veterinarianSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  licenseNumber: { type: String, required: true, trim: true, unique: true },
  qualifications: [{ type: String, trim: true }],
  specializations: [{ type: String, trim: true }],
  yearsOfExperience: { type: Number, min: 0 },
  clinicName: { type: String, trim: true },
  clinicAddress: addressSchema,
  serviceAreas: [{ type: String, trim: true }],
  consultationFee: { type: Number, min: 0, default: 0 },
  isAvailable: { type: Boolean, default: true },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.models.Veterinarian
  || mongoose.model('Veterinarian', veterinarianSchema);