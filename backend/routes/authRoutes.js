const express = require('express')
const router = express.Router()
const { register, login, googleLogin, getMe } = require('../controllers/authController')

router.post('/register', register)
router.post('/login', login)
router.get('/google', googleLogin)
router.get('/me', getMe)

module.exports = router
