const mongoose = require('mongoose');

const milkRecordSchema = new mongoose.Schema({
  dairyOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'DairyOwner', required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  cattle: { type: mongoose.Schema.Types.ObjectId, ref: 'Cattle' },
  collectionDate: { type: Date, required: true, default: Date.now },
  session: { type: String, enum: ['morning', 'evening'], required: true },
  quantityLiters: { type: Number, required: true, min: 0 },
  fatPercentage: { type: Number, min: 0, max: 100 },
  snfPercentage: { type: Number, min: 0, max: 100 },
  ratePerLiter: { type: Number, min: 0 },
  amount: { type: Number, min: 0 },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'accepted' },
  notes: { type: String, trim: true }
}, { timestamps: true });

milkRecordSchema.index({ dairyOwner: 1, collectionDate: -1 });
milkRecordSchema.index({ farmer: 1, collectionDate: -1 });

module.exports = mongoose.models.MilkRecord || mongoose.model('MilkRecord', milkRecordSchema);