import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Lock, Copy, Check, Calendar, Tag, Shield, 
  HelpCircle, AlertCircle, Sparkles, Star, Award, Heart
} from 'lucide-react'
import { doc, updateDoc, increment, arrayUnion, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useDonation } from '../context/DonationContext'
import { usePayment } from '../context/PaymentContext'
import { useUserData } from '../hooks/useUserData'
import { COUPONS } from '../data/coupons'
import { generateHealingCertificate, subscribeCoupon } from '../services/contributionService'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function CouponDetailPage() {
  const { couponId } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { userData } = useUserData()
  const { confirmDonation } = useDonation()
  const { requestPayment } = usePayment()

  const [coupon, setCoupon] = useState(null)
  const [copied, setCopied] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalStep, setModalStep] = useState(1) // 1: Name, 2: Payment
  const [formData, setFormData] = useState({ name: '', mobile: '', email: '' })
  const [errors, setErrors] = useState({ name: '', email: '' })
  const [toastMsg, setToastMsg] = useState(null)
  const [localUnlocked, setLocalUnlocked] = useState(false)

  useEffect(() => {
    const foundLocal = COUPONS.find(c => c.id === couponId)
    if (foundLocal) {
      setCoupon(foundLocal)
    }

    const unsubscribe = subscribeCoupon(couponId, (liveCoupon) => {
      if (liveCoupon) {
        setCoupon(liveCoupon)
      }
    })

    return () => unsubscribe()
  }, [couponId, navigate])

  // Pre-fill form from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem('hp_user_name') || ''
    const storedMobile = localStorage.getItem('hp_user_mobile') || ''
    const storedEmail = localStorage.getItem('hp_user_email') || ''
    setFormData({ name: storedName, mobile: storedMobile, email: storedEmail })
  }, [])

  if (!coupon) {
    return (
      <div style={{ minHeight: '100vh', background: '#FAF6F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    )
  }

  // Check if coupon is already unlocked
  const isUnlocked = localUnlocked || userData?.unlockedCoupons?.some(c => c.id === coupon.id) || false
  const unlockedDetails = userData?.unlockedCoupons?.find(c => c.id === coupon.id)
  const isOutOfStock = coupon.remainingStock !== undefined && coupon.remainingStock <= 0

  const handleCopy = () => {
    if (!isUnlocked) return
    const actualCode = unlockedDetails?.code || coupon.code
    navigator.clipboard.writeText(actualCode)
    setCopied(true)
    setToastMsg('Coupon code copied to clipboard! 📋')
    setTimeout(() => {
      setCopied(false)
      setToastMsg(null)
    }, 2000)
  }

  const handleUnlockClick = () => {
    setModalStep(1)
    setErrors({ name: '', email: '' })
    setIsModalOpen(true)
  }

  const handleContinueName = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setErrors({ ...errors, name: 'Full Name is required' })
      return
    }
    setErrors({ ...errors, name: '' })
    setModalStep(2)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    // Validate fields
    const newErrors = {}
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors({ ...errors, ...newErrors })
      return
    }

    // Save user details
    localStorage.setItem('hp_user_name', formData.name.trim())
    localStorage.setItem('hp_user_mobile', formData.mobile.trim())
    localStorage.setItem('hp_user_email', formData.email.trim())

    setIsModalOpen(false)

    try {
      const amount = coupon.unlockAmount ?? coupon.price
      // Call secure unified payment utility (live Razorpay or simulated mock)
      await requestPayment(amount, `Unlock Coupon: ${coupon.brand}`)

      confirmDonation(amount)

      if (currentUser?.uid) {
        await generateHealingCertificate({
          userId: currentUser.uid,
          amount: amount,
          childName: 'Janamithra',
          title: `Certificate of Coupon Unlock - ${coupon.brand}`,
          contributionType: 'coupon_unlock',
          couponId: coupon.id,
          couponBrand: coupon.brand,
          couponCode: coupon.code,
          supporterName: formData.name.trim()
        })

        // Unlock locally first
        setLocalUnlocked(true)
        setToastMsg('Coupon successfully unlocked! 🎁')
        setTimeout(() => {
          setToastMsg(null)
          navigate(`/coupon-thank-you/${coupon.id}`)
        }, 1500)
      } else {
        // Offline / fallback
        setLocalUnlocked(true)
        setToastMsg('Coupon successfully unlocked! 🎁')
        setTimeout(() => {
          setToastMsg(null)
          navigate(`/coupon-thank-you/${coupon.id}`)
        }, 1500)
      }
    } catch (err) {
      console.error('Payment workflow failed or was dismissed:', err.message)
      setToastMsg('Payment not completed ❌')
      setTimeout(() => setToastMsg(null), 3000)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FAF6F0', color: '#3D2B1A', fontFamily: 'Outfit, sans-serif' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '40px 20px', maxWidth: '1000px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        
        {/* Back Link */}
        <Link to="/main" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#8B5E34', textDecoration: 'none', fontWeight: 700, fontSize: '14.5px', marginBottom: 28, transition: 'all 0.2s' }}>
          <ArrowLeft size={16} /> Back to Play Zone
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
          
          {/* Main Card */}
          <div style={{ 
            background: '#FFFFFF', 
            borderRadius: '32px', 
            border: '1px solid rgba(220, 208, 195, 0.7)', 
            boxShadow: '0 16px 40px rgba(122, 78, 43, 0.05)', 
            overflow: 'hidden' 
          }}>
            
            {/* Banner & Logo Area */}
            <div style={{ position: 'relative', height: '240px', background: `url(${coupon.bannerUrl}) center/cover no-repeat` }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.45))' }} />
              
              {/* Floating circular brand logo */}
              <div style={{ 
                position: 'absolute', 
                bottom: '-40px', 
                left: '32px', 
                width: '90px', 
                height: '90px', 
                borderRadius: '50%', 
                background: '#FFFFFF', 
                border: '4px solid #FAF6F0', 
                boxShadow: '0 8px 24px rgba(139, 94, 52, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                zIndex: 5
              }}>
                <img src={coupon.logoUrl} alt={coupon.brand} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>

            {/* Content Area */}
            <div style={{ padding: '64px 32px 32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: coupon.accentColor, textTransform: 'uppercase', letterSpacing: '0.08em', background: `${coupon.accentColor}12`, padding: '6px 12px', borderRadius: '8px' }}>
                    {coupon.category}
                  </span>
                  <h1 style={{ margin: '12px 0 6px', fontSize: '28px', fontWeight: 800, color: '#3D2B1A' }}>
                    {coupon.brand} Offer
                  </h1>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#8B5E34' }}>
                    {coupon.offer}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FFF9F3', border: '1px solid #EADFCF', padding: '8px 16px', borderRadius: '14px' }}>
                    <Calendar size={14} color="#8B5E34" />
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#8B5E34' }}>Expires in 30 days</span>
                  </div>

                  {coupon.remainingStock !== undefined && (
                    isOutOfStock ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FEE2E2', border: '1px solid #FCA5A5', padding: '6px 12px', borderRadius: '10px', color: '#991B1B', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Out of Stock
                      </div>
                    ) : coupon.remainingStock <= 20 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FEF3C7', border: '1px solid #FDE68A', padding: '6px 12px', borderRadius: '10px', color: '#92400E', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        ⚠️ Only {coupon.remainingStock} left!
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '6px 12px', borderRadius: '10px', color: '#047857', fontSize: '11.5px', fontWeight: 700 }}>
                        ✓ {coupon.remainingStock} available
                      </div>
                    )
                  )}

                  {coupon.unlockedCount !== undefined && coupon.unlockedCount > 0 && (
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#8C4F1A', opacity: 0.8 }}>
                      ★ Unlocked {coupon.unlockedCount} times
                    </div>
                  )}
                </div>
              </div>

              <p style={{ fontSize: '15px', color: '#7A6A58', lineHeight: 1.7, fontWeight: 500, margin: '0 0 28px' }}>
                {coupon.description}
              </p>

              {/* Feature Icon Row */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                gap: '16px', 
                background: '#FAF6F0', 
                padding: '20px', 
                borderRadius: '20px', 
                border: '1px solid rgba(220, 208, 195, 0.4)',
                marginBottom: 32 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <Tag size={16} color="#8B5E34" />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#8C745C', fontWeight: 700 }}>REWARD CATEGORY</div>
                    <div style={{ fontSize: '13px', color: '#3D2B1A', fontWeight: 800 }}>{coupon.category}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <Award size={16} color="#8B5E34" />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#8C745C', fontWeight: 700 }}>UNLOCK FEE</div>
                    <div style={{ fontSize: '13px', color: '#3D2B1A', fontWeight: 800 }}>₹{coupon.unlockAmount ?? coupon.price} Support</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <Shield size={16} color="#8B5E34" />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#8C745C', fontWeight: 700 }}>REVEAL STATUS</div>
                    <div style={{ fontSize: '13px', color: isUnlocked ? '#16A34A' : '#D97706', fontWeight: 800 }}>
                      {isUnlocked ? 'Unlocked & Active' : 'Locked & Secured'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Coupon Reveal Section */}
              <div style={{ 
                background: isUnlocked ? 'linear-gradient(135deg, #FFFDFB, #FAF4EE)' : 'linear-gradient(135deg, #FAF6F0, #F3ECE2)', 
                border: isUnlocked ? '2px dashed #C8773A' : '1px dashed #EADFCF', 
                borderRadius: '24px', 
                padding: '32px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: 32
              }}>
                {!isUnlocked && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(3px)', pointerEvents: 'none' }} />
                )}

                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#8B5E34', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                    COUPON REVEAL CODE
                  </div>
                  
                  <div style={{ 
                    fontSize: '28px', 
                    fontWeight: 900, 
                    color: isUnlocked ? '#3D2B1A' : '#7A6A58', 
                    letterSpacing: isUnlocked ? '2px' : '4px',
                    margin: '12px 0',
                    filter: isUnlocked ? 'none' : 'blur(2px)',
                    opacity: isUnlocked ? 1 : 0.4
                  }}>
                    {isUnlocked ? (unlockedDetails?.code || coupon.code) : '••••••••'}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 20 }}>
                    {isUnlocked ? (
                      <>
                        <button 
                          onClick={handleCopy}
                          style={{ 
                            padding: '12px 24px', 
                            background: '#FAF6F0', 
                            border: '1px solid #C8773A', 
                            borderRadius: '14px', 
                            color: '#C8773A', 
                            fontWeight: 800, 
                            fontSize: '14px', 
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
                        <button 
                          onClick={() => navigate(`/coupon-thank-you/${coupon.id}`)}
                          style={{ 
                            padding: '12px 28px', 
                            background: 'linear-gradient(135deg, #8C4F1A, #C8773A)', 
                            border: 'none', 
                            borderRadius: '14px', 
                            color: '#FFFFFF', 
                            fontWeight: 800, 
                            fontSize: '14px', 
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            boxShadow: '0 6px 16px rgba(140, 79, 26, 0.15)',
                            transition: 'all 0.2s'
                          }}
                        >
                          Done
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={isOutOfStock ? undefined : handleUnlockClick}
                        disabled={isOutOfStock}
                        style={{ 
                          padding: '16px 36px', 
                          background: isOutOfStock ? '#E4E4E7' : 'linear-gradient(135deg, #8C4F1A, #C8773A)', 
                          border: isOutOfStock ? '1px solid #D4D4D8' : 'none', 
                          borderRadius: '18px', 
                          color: isOutOfStock ? '#A1A1AA' : '#FFFFFF', 
                          fontWeight: 800, 
                          fontSize: '15px', 
                          cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          boxShadow: isOutOfStock ? 'none' : '0 8px 24px rgba(140, 79, 26, 0.2)'
                        }}
                      >
                        <Lock size={16} /> {isOutOfStock ? 'Out of Stock' : `Unlock Code for ₹${coupon.unlockAmount ?? coupon.price}`}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* How to Avail */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#3D2B1A', display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 16px' }}>
                  <HelpCircle size={18} color="#8C4F1A" /> How To Avail
                </h3>
                <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <li style={{ fontSize: '14.5px', color: '#7A6A58', fontWeight: 500, lineHeight: 1.5 }}>
                    Click the <strong>Unlock</strong> button to make a verified donation of ₹{coupon.unlockAmount ?? coupon.price}.
                  </li>
                  <li style={{ fontSize: '14.5px', color: '#7A6A58', fontWeight: 500, lineHeight: 1.5 }}>
                    After successful payment, the hidden coupon code will be permanently revealed.
                  </li>
                  <li style={{ fontSize: '14.5px', color: '#7A6A58', fontWeight: 500, lineHeight: 1.5 }}>
                    Copy the code and click the <strong>Done</strong> button to finish.
                  </li>
                </ul>
              </div>

              {/* Terms and Conditions */}
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#3D2B1A', display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 16px' }}>
                  <AlertCircle size={18} color="#8C4F1A" /> Terms & Conditions
                </h3>
                <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {coupon.benefits.map((benefit, idx) => (
                    <li key={idx} style={{ fontSize: '14px', color: '#7A6A58', fontWeight: 500, lineHeight: 1.5 }}>
                      {benefit}
                    </li>
                  ))}
                  <li style={{ fontSize: '14px', color: '#7A6A58', fontWeight: 500, lineHeight: 1.5 }}>
                    Vouchers are non-refundable once unlocked as all proceeds directly fund verified pediatric treatments.
                  </li>
                </ul>
              </div>

            </div>
          </div>

        </div>

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

      {/* SECURE PAYMENT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(61, 43, 26, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                background: '#FAF6F0',
                border: '1px solid #EADFCF',
                borderRadius: '32px',
                width: '100%',
                maxWidth: '480px',
                padding: '32px',
                boxShadow: '0 24px 64px rgba(61, 43, 26, 0.15)',
                position: 'relative'
              }}
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ 
                  position: 'absolute', 
                  top: '24px', 
                  right: '24px', 
                  background: 'none', 
                  border: 'none', 
                  color: '#7A6A58', 
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '13px'
                }}
              >
                Close
              </button>

              <AnimatePresence mode="wait">
                {modalStep === 1 ? (
                  <motion.div
                    key="step-name"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                      <div style={{ 
                        width: '60px', 
                        height: '60px', 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, #FFF9F3, #F5E6D3)', 
                        border: '2px solid #D4AF37', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        margin: '0 auto 16px' 
                      }}>
                        <Award size={28} color="#8C4F1A" />
                      </div>
                      <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#3D2B1A', margin: '0 0 6px' }}>
                        Certificate Awardee
                      </h2>
                      <p style={{ margin: 0, fontSize: '13px', color: '#7A6A58', fontWeight: 600 }}>
                        Who should this certificate be awarded to?
                      </p>
                    </div>

                    <form onSubmit={handleContinueName} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#3D2B1A', marginBottom: 6, textTransform: 'uppercase' }}>Supporter Name *</label>
                        <input 
                          type="text" 
                          placeholder="Enter recipient's full name" 
                          value={formData.name} 
                          onChange={e => setFormData({ ...formData, name: e.target.value })} 
                          style={{ 
                            width: '100%', 
                            padding: '14px 16px', 
                            borderRadius: '12px', 
                            border: '1px solid #EBD5C2', 
                            background: '#FFFFFF', 
                            outline: 'none', 
                            color: '#3D2B1A', 
                            fontSize: '14.5px', 
                            fontWeight: 500,
                            boxSizing: 'border-box'
                          }} 
                        />
                        {errors.name && <span style={{ fontSize: '12px', color: '#EF4444', fontWeight: 600, marginTop: 4, display: 'block' }}>{errors.name}</span>}
                      </div>

                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#FDF8F3', border: '1px solid #F3ECE2', padding: 12, borderRadius: 12, marginTop: 8 }}>
                        <Sparkles size={16} color="#D4AF37" />
                        <span style={{ fontSize: '11px', color: '#8B5E34', fontWeight: 700 }}>
                          This name will be cryptographically printed on your official certificate.
                        </span>
                      </div>

                      <button 
                        type="submit"
                        style={{ 
                          padding: '16px', 
                          background: 'linear-gradient(135deg, #8C4F1A, #C8773A)', 
                          border: 'none', 
                          borderRadius: '99px', 
                          color: '#FFFFFF', 
                          fontSize: '15px', 
                          fontWeight: 800, 
                          cursor: 'pointer', 
                          marginTop: 12,
                          boxShadow: '0 8px 24px rgba(140, 79, 26, 0.2)'
                        }}
                      >
                        Continue
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step-payment"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                      <div style={{ 
                        width: '60px', 
                        height: '60px', 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, #FFF9F3, #F5E6D3)', 
                        border: '2px solid #D4AF37', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        margin: '0 auto 16px' 
                      }}>
                        <Heart size={28} color="#8C4F1A" />
                      </div>
                      <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#3D2B1A', margin: '0 0 6px' }}>
                        Secure Coupon Unlock
                      </h2>
                      <p style={{ margin: 0, fontSize: '13px', color: '#7A6A58', fontWeight: 600 }}>
                        A contribution of ₹{coupon.price} helps fund verified pediatric treatments.
                      </p>
                    </div>

                    <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#3D2B1A', marginBottom: 6, textTransform: 'uppercase' }}>Mobile Number</label>
                        <input 
                          type="text" 
                          placeholder="Enter 10-digit mobile" 
                          value={formData.mobile} 
                          onChange={e => setFormData({ ...formData, mobile: e.target.value })} 
                          style={{ 
                            width: '100%', 
                            padding: '14px 16px', 
                            borderRadius: '12px', 
                            border: '1px solid #EBD5C2', 
                            background: '#FFFFFF', 
                            outline: 'none', 
                            color: '#3D2B1A', 
                            fontSize: '14.5px', 
                            fontWeight: 500,
                            boxSizing: 'border-box'
                          }} 
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#3D2B1A', marginBottom: 6, textTransform: 'uppercase' }}>Email Address *</label>
                        <input 
                          type="email" 
                          placeholder="Enter email address" 
                          value={formData.email} 
                          onChange={e => setFormData({ ...formData, email: e.target.value })} 
                          style={{ 
                            width: '100%', 
                            padding: '14px 16px', 
                            borderRadius: '12px', 
                            border: '1px solid #EBD5C2', 
                            background: '#FFFFFF', 
                            outline: 'none', 
                            color: '#3D2B1A', 
                            fontSize: '14.5px', 
                            fontWeight: 500,
                            boxSizing: 'border-box'
                          }} 
                        />
                        {errors.email && <span style={{ fontSize: '12px', color: '#EF4444', fontWeight: 600, marginTop: 4, display: 'block' }}>{errors.email}</span>}
                      </div>

                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#FDF8F3', border: '1px solid #F3ECE2', padding: 12, borderRadius: 12, marginTop: 8 }}>
                        <Shield size={16} color="#D4AF37" />
                        <span style={{ fontSize: '11px', color: '#8B5E34', fontWeight: 700 }}>
                          Powered by secure simulation. No real money will be charged.
                        </span>
                      </div>

                      <button 
                        type="submit"
                        style={{ 
                          padding: '16px', 
                          background: 'linear-gradient(135deg, #8C4F1A, #C8773A)', 
                          border: 'none', 
                          borderRadius: '99px', 
                          color: '#FFFFFF', 
                          fontSize: '15px', 
                          fontWeight: 800, 
                          cursor: 'pointer', 
                          marginTop: 12,
                          boxShadow: '0 8px 24px rgba(140, 79, 26, 0.2)'
                        }}
                      >
                        Pay ₹{coupon.price} & Reveal Code
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
