const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8, select: false },
  role: {
    type: String,
    required: true,
    enum: ['farmer', 'dairy_owner', 'veterinarian', 'medical_store', 'admin']
  },
  phone: { type: String, trim: true },
  profileImage: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  lastLoginAt: Date
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);