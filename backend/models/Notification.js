const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['health', 'vet_request', 'appointment', 'prescription', 'order', 'payment', 'system'],
    default: 'system'
  },
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  relatedModel: {
    type: String,
    enum: [
      'Cattle', 'HealthCheck', 'VetRequest', 'Appointment', 'Diagnosis', 'Prescription',
      'MedicineOrder', 'FodderListing', 'MilkRecord', 'Payment', 'Complaint'
    ]
  },
  relatedId: { type: mongoose.Schema.Types.ObjectId, refPath: 'relatedModel' },
  readAt: Date,
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.models.Notification
  || mongoose.model('Notification', notificationSchema);