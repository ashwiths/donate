// Child Controller — stub
exports.getAllChildren = async (req, res, next) => {
  try {
    // TODO: const children = await Child.find().sort({ createdAt: -1 })
    res.json({ success: true, data: [], message: 'Children endpoint — connect MongoDB to populate' })
  } catch (err) { next(err) }
}

exports.getChildById = async (req, res, next) => {
  try {
    res.json({ success: true, data: null, message: `Child ${req.params.id} — coming soon` })
  } catch (err) { next(err) }
}
