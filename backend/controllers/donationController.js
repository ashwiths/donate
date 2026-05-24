const Razorpay = require('razorpay')
const crypto = require('crypto')

// Helper to get Razorpay instance
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (keyId && keySecret) {
    return new Razorpay({ key_id: keyId, key_secret: keySecret })
  }
  return null
}

exports.createDonation = async (req, res, next) => {
  try {
    const { amount, childId } = req.body
    const parsedAmount = parseInt(amount) || 10
    
    const rzp = getRazorpayInstance()
    if (rzp) {
      // Create Razorpay Order
      const options = {
        amount: parsedAmount * 100, // in paise
        currency: 'INR',
        receipt: 'rcpt_' + Date.now().toString().slice(-8),
        payment_capture: 1
      }
      
      const order = await rzp.orders.create(options)
      return res.status(201).json({
        success: true,
        provider: 'razorpay',
        orderId: order.id,
        amount: order.amount / 100,
        currency: order.currency,
        message: 'Razorpay order created successfully'
      })
    } else {
      // Fallback/Mock Mode
      const transactionId = 'HP' + Date.now().toString().slice(-8)
      return res.status(201).json({
        success: true,
        provider: 'mock',
        transactionId,
        amount: parsedAmount,
        childId,
        message: 'Mock donation recorded successfully (Razorpay keys missing)'
      })
    }
  } catch (err) {
    next(err)
  }
}

exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    
    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) {
      return res.json({
        success: true,
        message: 'Payment verification bypassed in Mock/Development Mode'
      })
    }

    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id)
    const generated_signature = hmac.digest('hex')

    if (generated_signature === razorpay_signature) {
      res.json({
        success: true,
        message: 'Payment verified successfully'
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid signature. Payment verification failed.'
      })
    }
  } catch (err) {
    next(err)
  }
}

exports.getDonationHistory = async (req, res, next) => {
  try {
    res.json({ success: true, data: [], message: 'Donation history — coming soon' })
  } catch (err) { next(err) }
}
