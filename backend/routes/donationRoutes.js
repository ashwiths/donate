const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const { createDonation, verifyPayment, getDonationHistory } = require('../controllers/donationController')

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() })
  }
  next()
}

const validateCreateDonation = [
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isInt({ min: 10, max: 1000000 }).withMessage('Amount must be an integer between 10 and 1,000,000')
    .toInt(),
  body('childId')
    .optional()
    .isString().trim().escape(),
  handleValidationErrors
]

const validateVerifyPayment = [
  body('razorpay_order_id')
    .optional()
    .isString().trim().escape(),
  body('razorpay_payment_id')
    .optional()
    .isString().trim().escape(),
  body('razorpay_signature')
    .optional()
    .isString().trim().escape(),
  handleValidationErrors
]

router.post('/', validateCreateDonation, createDonation)
router.post('/verify', validateVerifyPayment, verifyPayment)
router.get('/history', getDonationHistory)

module.exports = router
