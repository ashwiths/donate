const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const errorHandler = require('./middleware/errorHandler')

// Route imports
const authRoutes = require('./routes/authRoutes')
const childRoutes = require('./routes/childRoutes')
const donationRoutes = require('./routes/donationRoutes')
const gameRoutes = require('./routes/gameRoutes')
const couponRoutes = require('./routes/couponRoutes')

const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const compression = require('compression')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Disable X-Powered-By header
app.disable('x-powered-by')

// Enable gzip compression
app.use(compression())

// Enable Helmet middleware for secure headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.razorpay.com", "https://savee.space"]
    }
  }
}))

// Configure strict CORS
const allowedOrigins = ['https://savee.space', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175']
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

// Rate Limiters
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
})

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth requests, please try again in a minute' },
  standardHeaders: true,
  legacyHeaders: false,
})

const donationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many donation or payment requests, please try again in a minute' },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(express.json({ limit: '10kb' })) // Prevent oversized JSON payloads
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// Apply global rate limiting to all requests
app.use('/api/', globalLimiter)

// Apply specific rate limits to sensitive routes
app.use('/api/auth', authLimiter)
app.use('/api/donations', donationLimiter)

// Static uploads with secure caching and headers
app.use('/uploads', express.static('uploads', {
  maxAge: '1d',
  setHeaders: (res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff')
  }
}))

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
  console.log(`🚀 Heal & Play server running on port ${PORT}`)
})

module.exports = app
