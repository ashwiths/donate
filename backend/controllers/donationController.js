// Donation Controller — stub
exports.createDonation = async (req, res, next) => {
  try {
    const { amount, childId } = req.body
    const transactionId = 'HP' + Date.now().toString().slice(-8)
    res.status(201).json({ success: true, data: { transactionId, amount, childId }, message: 'Donation recorded' })
  } catch (err) { next(err) }
}

exports.getDonationHistory = async (req, res, next) => {
  try {
    res.json({ success: true, data: [], message: 'Donation history — coming soon' })
  } catch (err) { next(err) }
}
