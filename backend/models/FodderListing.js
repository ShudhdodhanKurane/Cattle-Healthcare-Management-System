const mongoose = require('mongoose');

const fodderListingSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  name: { type: String, required: true, trim: true },
  fodderType: { type: String, trim: true },
  description: { type: String, trim: true },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, enum: ['kg', 'tonne', 'bundle'], default: 'kg' },
  pricePerUnit: { type: Number, min: 0 },
  supplier: { type: String, trim: true },
  receivedAt: Date,
  location: { type: String, trim: true },
  image: { type: String, trim: true },
  status: { type: String, enum: ['available', 'unavailable', 'archived'], default: 'available' }
}, { timestamps: true });

fodderListingSchema.index({ farmer: 1, status: 1 });

module.exports = mongoose.models.FodderListing
  || mongoose.model('FodderListing', fodderListingSchema);