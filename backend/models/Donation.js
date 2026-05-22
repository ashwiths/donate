const mongoose = require('mongoose')

const donationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  child: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
  amount: { type: Number, required: true, min: 1 },
  treatmentAmount: { type: Number },
  gatewayFee: { type: Number, default: 1 },
  transactionId: { type: String, unique: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'success' },
  paymentMethod: { type: String, default: 'upi' },
}, { timestamps: true })

donationSchema.pre('save', function (next) {
  this.treatmentAmount = this.amount - this.gatewayFee
  if (!this.transactionId) {
    this.transactionId = 'HP' + Date.now().toString().slice(-8)
  }
  next()
})

module.exports = mongoose.model('Donation', donationSchema)
