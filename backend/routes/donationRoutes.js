const express = require('express')
const router = express.Router()
const { createDonation, verifyPayment, getDonationHistory } = require('../controllers/donationController')

router.post('/', createDonation)
router.post('/verify', verifyPayment)
router.get('/history', getDonationHistory)

module.exports = router
