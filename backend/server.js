const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorHandler')

// Route imports
const authRoutes = require('./routes/authRoutes')
const childRoutes = require('./routes/childRoutes')
const donationRoutes = require('./routes/donationRoutes')
const gameRoutes = require('./routes/gameRoutes')
const couponRoutes = require('./routes/couponRoutes')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static uploads
app.use('/uploads', express.static('uploads'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Heal & Play API is running 🚀', timestamp: new Date() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/children', childRoutes)
app.use('/api/donations', donationRoutes)
app.use('/api/games', gameRoutes)
app.use('/api/coupons', couponRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// Error handler
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Heal & Play server running on http://localhost:${PORT}`)
})

module.exports = app
