const express = require('express')
const router = express.Router()
const { getAllCoupons, redeemCoupon } = require('../controllers/couponController')

router.get('/', getAllCoupons)
router.post('/:id/redeem', redeemCoupon)

module.exports = router
