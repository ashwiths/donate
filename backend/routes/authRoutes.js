const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const { register, login, googleLogin, getMe } = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() })
  }
  next()
}

const validateRegister = [
  body('email')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail().trim(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().trim().escape(),
  handleValidationErrors
]

const validateLogin = [
  body('email')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail().trim(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors
]

router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)
router.get('/google', googleLogin)
router.get('/me', authMiddleware, getMe)

module.exports = router
