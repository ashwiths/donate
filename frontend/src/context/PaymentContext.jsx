import { createContext, useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShieldCheck, CreditCard, Sparkles } from 'lucide-react'

const PaymentContext = createContext(null)

export const usePayment = () => useContext(PaymentContext)

// Dynamic script loader for Razorpay
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export function PaymentProvider({ children }) {
  const [paymentState, setPaymentState] = useState({
    isOpen: false,
    amount: 0,
    status: 'idle', // idle | processing | success | error
    message: ''
  })

  // Resolvers for the active payment request promise
  const [activePromise, setActivePromise] = useState(null)

  const requestPayment = (amount, description = 'Healing Contribution') => {
    return new Promise(async (resolve, reject) => {
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID

      if (razorpayKey) {
        // ── LIVE RAZORPAY PAYMENT FLOW ──
        console.log('💳 Razorpay Key detected. Initializing live checkout flow...')
        setPaymentState({ isOpen: true, amount, status: 'processing', message: 'Connecting to secure gateway...' })

        const loaded = await loadRazorpayScript()
        if (!loaded) {
          setPaymentState({ isOpen: false, amount: 0, status: 'idle', message: '' })
          reject(new Error('Failed to load Razorpay checkout script.'))
          return
        }

        try {
          // 1. Create order on the Express backend
          const backendUrl = import.meta.env.VITE_API_URL || '/api'
          const res = await fetch(`${backendUrl}/donations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, childId: '1' })
          })
          const orderData = await res.json()

          if (!orderData.success) {
            throw new Error(orderData.message || 'Failed to create order on backend')
          }

          setPaymentState(prev => ({ ...prev, message: 'Opening payment checkout...' }))

          // 2. Configure Razorpay checkout
          const options = {
            key: razorpayKey,
            amount: orderData.amount * 100,
            currency: orderData.currency || 'INR',
            name: 'Heal & Play',
            description,
            image: '/logo.png',
            order_id: orderData.orderId,
            handler: async function (response) {
              setPaymentState(prev => ({ ...prev, status: 'processing', message: 'Verifying healing contribution...' }))
              try {
                // 3. Verify signature on backend
                const verifyRes = await fetch(`${backendUrl}/donations/verify`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                  })
                })
                const verifyData = await verifyRes.json()

                if (verifyData.success) {
                  setPaymentState(prev => ({ ...prev, status: 'success', message: 'Payment verified! Thank you.' }))
                  setTimeout(() => {
                    setPaymentState({ isOpen: false, amount: 0, status: 'idle', message: '' })
                    resolve({ transactionId: response.razorpay_payment_id, amount })
                  }, 1500)
                } else {
                  throw new Error(verifyData.message || 'Payment verification failed')
                }
              } catch (err) {
                setPaymentState(prev => ({ ...prev, status: 'error', message: err.message }))
                setTimeout(() => setPaymentState({ isOpen: false, amount: 0, status: 'idle', message: '' }), 3000)
                reject(err)
              }
            },
            prefill: {
              name: localStorage.getItem('hp_user_name') || '',
              email: localStorage.getItem('hp_user_email') || '',
              contact: localStorage.getItem('hp_user_mobile') || ''
            },
            theme: { color: '#8C4F1A' },
            modal: {
              ondismiss: function () {
                setPaymentState({ isOpen: false, amount: 0, status: 'idle', message: '' })
                reject(new Error('Payment canceled by user'))
              }
            }
          }

          const rzp = new window.Razorpay(options)
          rzp.open()

        } catch (err) {
          console.error('Razorpay initialization error:', err)
          setPaymentState(prev => ({ ...prev, status: 'error', message: err.message }))
          setTimeout(() => setPaymentState({ isOpen: false, amount: 0, status: 'idle', message: '' }), 3000)
          reject(err)
        }

      } else {
        // ── MOCK PAYMENT FALLBACK MODE ──
        console.warn('⚠️ Razorpay not configured yet. Mock payment mode enabled.')
        console.log(`Processing mock payment of ₹${amount} for "${description}"`)

        setPaymentState({
          isOpen: true,
          amount,
          status: 'processing',
          message: 'Processing Healing Contribution...'
        })

        // Simulate 2s premium loading delay
        setTimeout(() => {
          setPaymentState(prev => ({
            ...prev,
            status: 'success',
            message: 'Contribution Confirmed! 🙏'
          }))

          setTimeout(() => {
            setPaymentState({ isOpen: false, amount: 0, status: 'idle', message: '' })
            resolve({
              transactionId: 'HP' + Date.now().toString().slice(-8),
              amount
            })
          }, 1500)
        }, 2000)
      }
    })
  }

  return (
    <PaymentContext.Provider value={{ requestPayment }}>
      {children}

      <AnimatePresence>
        {paymentState.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(26, 17, 9, 0.72)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              fontFamily: 'Outfit, sans-serif'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              style={{
                background: 'linear-gradient(135deg, #FCFAF6, #F5E6D3)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '32px',
                padding: '40px 32px',
                maxWidth: '420px',
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
              }}
            >
              {/* Header Badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(140, 79, 26, 0.08)', padding: '6px 14px', borderRadius: '20px', marginBottom: 28, border: '1px solid rgba(140, 79, 26, 0.1)' }}>
                <ShieldCheck size={13} color="#8C4F1A" />
                <span style={{ fontSize: 10, fontWeight: 900, color: '#8C4F1A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Secure Healing Terminal
                </span>
              </div>

              {/* Animated Core Spinner */}
              <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AnimatePresence mode="wait">
                  {paymentState.status === 'processing' ? (
                    <motion.div
                      key="spinner"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '50%',
                          border: '4px solid rgba(140, 79, 26, 0.1)',
                          borderTopColor: '#8C4F1A',
                          boxShadow: '0 0 12px rgba(140, 79, 26, 0.1)'
                        }}
                      />
                      <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <Heart size={36} color="#8C4F1A" fill="#8C4F1A" />
                      </motion.div>
                    </motion.div>
                  ) : paymentState.status === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1, type: 'spring' }}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: '#EAF5E2',
                        border: '2px solid #47682C',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(71, 104, 44, 0.2)'
                      }}
                    >
                      <motion.div
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <ShieldCheck size={44} color="#47682C" />
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="error"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: '#FEE2E2',
                        border: '2px solid #991B1B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(153, 27, 27, 0.2)'
                      }}
                    >
                      <CreditCard size={40} color="#991B1B" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status & Message */}
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800, color: '#3D2B1A' }}>
                {paymentState.message}
              </h3>

              {/* Pricing Display */}
              <div style={{ margin: '20px 0 28px' }}>
                <span style={{ fontSize: '12px', color: '#7A6A58', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
                  Contribution Amount
                </span>
                <span className="text-gradient-animate" style={{ fontSize: '36px', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>
                  ₹{paymentState.amount}
                </span>
              </div>

              {/* Trust Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#8C745C', fontSize: '11px', fontWeight: 600 }}>
                <Sparkles size={12} color="#D4AF37" />
                <span>100% Direct Pediatric Billing Support</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PaymentContext.Provider>
  )
}
