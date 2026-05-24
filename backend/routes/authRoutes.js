const express = require('express')
const router = express.Router()
const { register, login, googleLogin, getMe } = require('../controllers/authController')

const authMiddleware = require('../middleware/authMiddleware')

router.post('/register', register)
router.post('/login', login)
router.get('/google', googleLogin)
router.get('/me', authMiddleware, getMe)

module.exports = router
