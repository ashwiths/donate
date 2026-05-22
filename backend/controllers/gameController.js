exports.getAllGames = async (req, res, next) => {
  try {
    res.json({ success: true, data: [], message: 'Games endpoint — connect MongoDB to populate' })
  } catch (err) { next(err) }
}
