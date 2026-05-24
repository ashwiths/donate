import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Copy, ExternalLink, ArrowRight, Heart, Sparkles, Gift } from 'lucide-react'
import { COUPONS } from '../data/coupons'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function CouponThankYouPage() {
  const { couponId } = useParams()
  const navigate = useNavigate()

  const [coupon, setCoupon] = useState(null)
  const [copied, setCopied] = useState(false)
  const [toastMsg, setToastMsg] = useState(null)

  useEffect(() => {
    const found = COUPONS.find(c => c.id === couponId)
    if (found) {
      setCoupon(found)
    } else {
      navigate('/main')
    }
  }, [couponId, navigate])

  if (!coupon) {
    return (
      <div style={{ minHeight: '100vh', background: '#FAF6F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    )
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code)
    setCopied(true)
    setToastMsg('Coupon code copied! 📋')
    setTimeout(() => {
      setCopied(false)
      setToastMsg(null)
    }, 2000)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FAF6F0', color: '#3D2B1A', fontFamily: 'Outfit, sans-serif' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '60px 20px', maxWidth: '680px', width: '100%', margin: '0 auto', boxSizing: 'border-box', textAlign: 'center' }}>
        
        {/* Celebrate / Success Icon */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #FFF9F3, #F5E6D3)', 
            border: '3px solid #D4AF37', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 28px',
            boxShadow: '0 12px 36px rgba(212, 175, 55, 0.3)'
          }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <Gift size={36} color="#8C4F1A" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: '32px', fontWeight: 900, color: '#3D2B1A', margin: '0 0 12px', fontFamily: 'Outfit' }}
        >
          Coupon Successfully Unlocked 🎉
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ fontSize: '16px', color: '#7A6A58', fontWeight: 500, lineHeight: 1.6, margin: '0 0 40px' }}
        >
          Thank you for supporting healing journeys ❤️. Your contribution directly helped support verified pediatric treatment campaigns.
        </motion.p>

        {/* Luxury Reward Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ 
            background: '#FFFFFF', 
            borderRadius: '28px', 
            border: '2px dashed #C8773A', 
            padding: '36px',
            boxShadow: '0 16px 48px rgba(122, 78, 43, 0.08)',
            marginBottom: 40,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle sparkles */}
          <div style={{ position: 'absolute', top: 16, right: 16 }}>
            <Sparkles size={20} color="#D4AF37" />
          </div>

          <span style={{ fontSize: '11px', fontWeight: 800, color: coupon.accentColor, textTransform: 'uppercase', letterSpacing: '0.08em', background: `${coupon.accentColor}12`, padding: '6px 12px', borderRadius: '8px' }}>
            {coupon.brand} • {coupon.category}
          </span>

          <h2 style={{ margin: '16px 0 8px', fontSize: '22px', fontWeight: 800, color: '#3D2B1A' }}>
            {coupon.offer}
          </h2>

          <div style={{ 
            background: '#FAF6F0', 
            borderRadius: '16px', 
            padding: '20px', 
            margin: '24px 0 28px', 
            border: '1px solid #EADFCF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12
          }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C745C', letterSpacing: '0.06em' }}>YOUR PROMO CODE</span>
            <span style={{ fontSize: '24px', fontWeight: 900, color: '#3D2B1A', letterSpacing: '2px' }}>{coupon.code}</span>
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button 
              onClick={handleCopy}
              style={{ 
                padding: '14px 28px', 
                background: '#FAF6F0', 
                border: '1px solid #C8773A', 
                borderRadius: '14px', 
                color: '#C8773A', 
                fontWeight: 800, 
                fontSize: '14.5px', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s'
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
            <a 
              href={coupon.redeemUrl || "https://healplay.example.com/redeem"} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                padding: '14px 32px', 
                background: 'linear-gradient(135deg, #8C4F1A, #C8773A)', 
                border: 'none', 
                borderRadius: '14px', 
                color: '#FFFFFF', 
                fontWeight: 800, 
                fontSize: '14.5px', 
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 6px 16px rgba(140, 79, 26, 0.15)'
              }}
            >
              Redeem Now <ExternalLink size={14} />
            </a>
          </div>
        </motion.div>

        {/* Home Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link to="/main" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#8B5E34', textDecoration: 'none', fontWeight: 800, fontSize: '15px' }}>
            Go to Play Zone <ArrowRight size={16} />
          </Link>
        </motion.div>

      </main>

      {/* TOAST SYSTEM */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: 40,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#3D2B1A',
              color: '#FAF6F0',
              padding: '14px 28px',
              borderRadius: '99px',
              boxShadow: '0 12px 36px rgba(0,0,0,0.15)',
              zIndex: 100,
              fontSize: '14px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Sparkles size={16} color="#D4AF37" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
