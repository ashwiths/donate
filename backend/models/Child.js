const mongoose = require('mongoose')

const childSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: String },
  condition: { type: String, required: true },
  story: { type: String },
  image: { type: String },
  requiredAmount: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  documents: [{ type: String }],
}, { timestamps: true })

childSchema.virtual('percentage').get(function () {
  return ((this.raisedAmount / this.requiredAmount) * 100).toFixed(2)
})

module.exports = mongoose.model('Child', childSchema)
