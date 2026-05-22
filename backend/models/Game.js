const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  price: { type: Number, required: true, default: 10 },
  category: { type: String, default: 'game' },
  active: { type: Boolean, default: true },
  tag: { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Game', gameSchema)
