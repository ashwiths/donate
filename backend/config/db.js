const mongoose = require('mongoose')

let isConnected = false

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    console.log('✅ Using existing MongoDB connection')
    isConnected = true
    return
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/healandplay')
    isConnected = true
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    // In serverless, do not call process.exit(1) as it kills the serverless container unnecessarily.
    throw error
  }
}

module.exports = connectDB
