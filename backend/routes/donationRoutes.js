const express = require('express')
const router = express.Router()
const { createDonation, getDonationHistory } = require('../controllers/donationController')

router.post('/', createDonation)
router.get('/history', getDonationHistory)

module.exports = router
