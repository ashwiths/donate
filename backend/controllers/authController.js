// Auth Controller — stub (implement real JWT auth when backend is wired)
exports.register = async (req, res, next) => {
  try {
    res.status(201).json({ success: true, message: 'Register endpoint — coming soon' })
  } catch (err) { next(err) }
}

exports.login = async (req, res, next) => {
  try {
    res.json({ success: true, message: 'Login endpoint — coming soon' })
  } catch (err) { next(err) }
}

exports.googleLogin = async (req, res, next) => {
  try {
    res.json({ success: true, message: 'Google login — coming soon' })
  } catch (err) { next(err) }
}

exports.getMe = async (req, res, next) => {
  try {
    res.json({ success: true, user: req.user, message: 'User info resolved securely via Firebase Admin SDK' })
  } catch (err) { next(err) }
}
