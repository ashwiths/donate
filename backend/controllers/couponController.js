exports.getAllCoupons = async (req, res, next) => {
  try {
    res.json({ success: true, data: [], message: 'Coupons endpoint — connect MongoDB to populate' })
  } catch (err) { next(err) }
}

exports.redeemCoupon = async (req, res, next) => {
  try {
    res.json({ success: true, message: `Coupon ${req.params.id} redeemed` })
  } catch (err) { next(err) }
}
