const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  medicineName: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  totalPrice: { type: Number, required: true, min: 0 }
});

const medicineOrderSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  medicalStore: { type: mongoose.Schema.Types.ObjectId, ref: 'MedicalStore', required: true },
  prescription: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' },
  items: { type: [orderItemSchema], required: true, validate: (items) => items.length > 0 },
  subtotal: { type: Number, required: true, min: 0 },
  deliveryFee: { type: Number, min: 0, default: 0 },
  total: { type: Number, required: true, min: 0 },
  deliveryAddress: { type: String, trim: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  notes: { type: String, trim: true }
}, { timestamps: true });

medicineOrderSchema.index({ farmer: 1, createdAt: -1 });
medicineOrderSchema.index({ medicalStore: 1, status: 1 });

module.exports = mongoose.models.MedicineOrder
  || mongoose.model('MedicineOrder', medicineOrderSchema);