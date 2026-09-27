const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  line1: { type: String, trim: true },
  line2: { type: String, trim: true },
  village: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  postalCode: { type: String, trim: true },
  country: { type: String, trim: true }
}, { _id: false });

const farmerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  dairyOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'DairyOwner' },
  farmName: { type: String, trim: true },
  address: addressSchema,
  landArea: { type: Number, min: 0 },
  landAreaUnit: { type: String, enum: ['acre', 'hectare'] },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  notes: { type: String, trim: true }
}, { timestamps: true });

farmerSchema.index({ dairyOwner: 1 });

module.exports = mongoose.models.Farmer || mongoose.model('Farmer', farmerSchema);