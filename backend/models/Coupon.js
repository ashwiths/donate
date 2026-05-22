const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  worth: { type: Number, required: true },
  price: { type: Number, required: true, default: 10 },
  color: { type: String, default: '#1E3A5F' },
  active: { type: Boolean, default: true },
  code: { type: String },
  expiresAt: { type: Date },
}, { timestamps: true })

module.exports = mongoose.model('Coupon', couponSchema)
