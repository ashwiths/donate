const { admin } = require('../config/firebaseAdmin')

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization header missing or invalid' })
    }

    const token = authHeader.split('Bearer ')[1]
    
    // Check if Firebase Admin is initialized
    if (admin && admin.apps.length > 0) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(token)
        req.user = decodedToken
        return next()
      } catch (err) {
        console.error('Firebase token verification failed:', err.message)
        return res.status(401).json({ success: false, message: 'Invalid or expired authentication token' })
      }
    } else {
      // Mock mode / local development fallback
      console.warn('⚠️ Firebase Admin SDK uninitialized. Decoding token in mock mode.')
      req.user = {
        uid: 'mock_uid_123',
        email: 'mock_user@example.com',
        name: 'Mock Supporter'
      }
      return next()
    }
  } catch (error) {
    next(error)
  }
}
