const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  line1: { type: String, trim: true },
  line2: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  postalCode: { type: String, trim: true },
  country: { type: String, trim: true }
}, { _id: false });

const medicalStoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  storeName: { type: String, required: true, trim: true },
  licenseNumber: { type: String, required: true, trim: true, unique: true },
  address: addressSchema,
  phone: { type: String, trim: true },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  isOpen: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.models.MedicalStore
  || mongoose.model('MedicalStore', medicalStoreSchema);