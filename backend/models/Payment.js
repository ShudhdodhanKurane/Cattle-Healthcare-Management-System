const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  payer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  payee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
  dairyOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'DairyOwner' },
  veterinarian: { type: mongoose.Schema.Types.ObjectId, ref: 'Veterinarian' },
  medicalStore: { type: mongoose.Schema.Types.ObjectId, ref: 'MedicalStore' },
  medicineOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'MedicineOrder' },
  milkRecord: { type: mongoose.Schema.Types.ObjectId, ref: 'MilkRecord' },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR', uppercase: true, trim: true },
  purpose: {
    type: String,
    enum: ['milk_purchase', 'medicine_order', 'consultation', 'other'],
    required: true
  },
  method: { type: String, enum: ['cash', 'card', 'upi', 'bank_transfer', 'other'] },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionReference: { type: String, trim: true },
  paidAt: Date,
  notes: { type: String, trim: true }
}, { timestamps: true });

paymentSchema.index({ payer: 1, createdAt: -1 });
paymentSchema.index({ payee: 1, createdAt: -1 });

module.exports = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);