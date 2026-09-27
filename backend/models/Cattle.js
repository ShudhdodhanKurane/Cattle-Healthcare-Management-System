const mongoose = require('mongoose');

const cattleSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  tagNumber: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  breed: { type: String, trim: true },
  sex: { type: String, enum: ['female', 'male', 'unknown'], default: 'female' },
  dateOfBirth: Date,
  weightKg: { type: Number, min: 0 },
  color: { type: String, trim: true },
  photo: { type: String, trim: true },
  notes: { type: String, trim: true },
  mother: { type: mongoose.Schema.Types.ObjectId, ref: 'Cattle' },
  father: { type: mongoose.Schema.Types.ObjectId, ref: 'Cattle' },
  status: { type: String, enum: ['active', 'sold', 'deceased'], default: 'active' }
}, { timestamps: true });

cattleSchema.index({ farmer: 1, tagNumber: 1 }, { unique: true });

module.exports = mongoose.models.Cattle || mongoose.model('Cattle', cattleSchema);