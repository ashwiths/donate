import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Copy, Check, Heart, Shield, ArrowLeft, Smartphone, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useDonation } from '../context/DonationContext'
import { generateHealingCertificate } from '../services/contributionService'
import qrImage from '../assets/payment-qr.png'
import { fadeUp } from '../animations/variants'

export default function DirectSupportPaymentPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { confirmDonation } = useDonation()

  const [copied, setCopied] = useState(false)
  const [processing, setProcessing] = useState(false)

  // Retrieve temporary contribution details stored in localStorage
  const supporterName = localStorage.getItem('hp_supporter_name') || localStorage.getItem('hp_user_name') || 'Kind Supporter'
  const supporterEmail = localStorage.getItem('hp_supporter_email') || localStorage.getItem('hp_user_email') || ''
  const supporterMobile = localStorage.getItem('hp_supporter_mobile') || localStorage.getItem('hp_user_mobile') || ''
  
  const unlockType = localStorage.getItem('hp_unlock_type') || 'donation'
  const pendingPrice = parseInt(localStorage.getItem('hp_pending_price') || '50')
  const pendingGameId = localStorage.getItem('hp_pending_game_id') || ''
  const pendingGameTitle = localStorage.getItem('hp_pending_game_title') || ''
  const pendingGamePath = localStorage.getItem('hp_pending_game_path') || ''

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  const upiId = 'supportjanami1459@cashfreesdlpb'

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePaymentComplete = async () => {
    setProcessing(true)
    
    // Simulate premium processing delay
    setTimeout(async () => {
      try {
        confirmDonation(pendingPrice)

        if (user?.uid) {
          // Generate certificate based on saved context
          if (unlockType === 'game') {
            await generateHealingCertificate({
              userId: user.uid,
              amount: pendingPrice,
              childName: 'Janamithra',
              title: 'Certificate of Game Unlock',
              contributionType: 'game_unlock',
              gameId: pendingGameId,
              gameName: pendingGameTitle || 'Premium Game',
              supporterName: supporterName
            })
          } else if (unlockType === 'coupon') {
            await generateHealingCertificate({
              userId: user.uid,
              amount: pendingPrice,
              childName: 'Janamithra',
              title: `Certificate of Coupon Unlock - ${pendingGameTitle}`,
              contributionType: 'coupon_unlock',
              couponId: pendingGameId,
              couponBrand: pendingGameTitle,
              couponCode: 'SECRET_CODE_MOCK', // placeholder
              supporterName: supporterName
            })
          } else if (unlockType === 'message') {
            await generateHealingCertificate({
              userId: user.uid,
              amount: pendingPrice,
              childName: 'Janamithra',
              title: `Certificate of Healing Message - ${pendingGameTitle}`,
              contributionType: 'healing_message_unlock',
              gameId: pendingGameId,
              gameName: pendingGameTitle || 'Healing Message',
              supporterName: supporterName
            })
          } else {
            await generateHealingCertificate({
              userId: user.uid,
              amount: pendingPrice,
              childName: 'Janamithra',
              title: 'Certificate of Healing Support',
              contributionType: 'donation',
              supporterName: supporterName
            })
          }
        }

        // Navigate based on type
        if (unlockType === 'game') {
          if (pendingGamePath) {
            navigate(pendingGamePath)
          } else {
            navigate('/main')
          }
        } else if (unlockType === 'coupon') {
          navigate(`/coupon-thank-you/${pendingGameId}`)
        } else if (unlockType === 'message') {
          navigate(`/reveal-message/${pendingGameId}`)
        } else {
          navigate('/thank-you')
        }
      } catch (err) {
        console.error('Error confirming payment:', err)
        alert('Confirmation failed: ' + err.message)
      } finally {
        setProcessing(false)
      }
    }, 2000)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FDFBF7 0%, #F5EFEB 100%)',
      color: '#3D2B1A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      boxSizing: 'border-box',
      fontFamily: 'Outfit, sans-serif'
    }}>
      {/* Header back link */}
      <div style={{ width: '100%', maxWidth: '580px', marginBottom: '24px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: '#8C4F1A',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: 0
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        style={{
          width: '100%',
          maxWidth: '580px',
          background: '#FFF',
          borderRadius: '32px',
          border: '1px solid rgba(232, 224, 214, 0.7)',
          padding: '40px 32px',
          boxSizing: 'border-box',
          boxShadow: '0 24px 64px rgba(140, 79, 26, 0.08)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Top Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FAF2EA', border: '1px solid #EBD5C2', borderRadius: '99px', padding: '6px 14px', marginBottom: '20px' }}>
          <Shield size={12} color="#8C4F1A" />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C4F1A', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Verified Direct Patient Support
          </span>
        </div>

        {/* Headings */}
        <h1 style={{ margin: '0 0 8px', fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 900, letterSpacing: '-0.5px', color: '#3D2B1A' }}>
          Support Janamithra’s Healing Journey ❤️
        </h1>
        <p style={{ margin: '0 0 32px', fontSize: '14.5px', color: '#7A6A5A', lineHeight: 1.5 }}>
          You are directly supporting verified pediatric treatment and recovery care.
        </p>

        {/* Selected Amount Indicator */}
        <div style={{
          background: 'linear-gradient(135deg, #FAF6F2 0%, #F5ECE5 100%)',
          border: '1px solid rgba(140, 79, 26, 0.15)',
          borderRadius: '20px',
          padding: '16px 24px',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C4F1A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Contribution Amount</span>
            <div style={{ fontSize: '13px', color: '#7A6A5A', marginTop: '2px', fontWeight: 500 }}>
              For: {unlockType === 'game' ? `Unlock Game - ${pendingGameTitle}` : unlockType === 'coupon' ? `Unlock Coupon - ${pendingGameTitle}` : unlockType === 'message' ? `Unlock Quote - ${pendingGameTitle}` : 'Direct Support'}
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#8C4F1A' }}>
            ₹{pendingPrice}
          </div>
        </div>

        {/* QR Code Container */}
        <div style={{
          margin: '0 auto 32px',
          maxWidth: '240px',
          position: 'relative'
        }}>
          {/* Subtle Golden Glow Accent */}
          <div style={{
            position: 'absolute',
            top: '-10px',
            left: '-10px',
            right: '-10px',
            bottom: '-10px',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(255,255,255,0) 70%)',
            borderRadius: '24px',
            zIndex: 0
          }} />

          <div style={{
            background: '#fff',
            borderRadius: '24px',
            border: '1px solid rgba(232, 224, 214, 0.8)',
            padding: '16px',
            position: 'relative',
            zIndex: 1,
            boxShadow: '0 12px 32px rgba(140, 79, 26, 0.04)'
          }}>
            <img
              src={qrImage}
              alt="Scan to Pay"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '12px'
              }}
            />
          </div>
        </div>

        {/* UPI Details */}
        <div style={{ marginBottom: '32px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C4F1A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
            UPI ID
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#FAF8F5',
            border: '1px solid rgba(232, 224, 214, 0.6)',
            borderRadius: '16px',
            padding: '14px 20px',
            gap: 12
          }}>
            <code style={{ fontSize: '14px', fontWeight: 700, color: '#3D2B1A', fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {upiId}
            </code>
            <button
              onClick={handleCopyUPI}
              style={{
                background: copied ? '#EAF5E2' : '#8C4F1A',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: copied ? '#47682C' : '#FFF',
                fontSize: '12px',
                fontWeight: 700,
                transition: 'all 0.2s'
              }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Supported Payment Apps */}
        <div style={{
          borderTop: '1px solid rgba(232, 224, 214, 0.4)',
          paddingTop: '20px',
          marginBottom: '32px'
        }}>
          <div style={{ fontSize: '12px', color: '#7A6A5A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
            Scan using any UPI App
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {['PhonePe', 'Google Pay', 'Paytm', 'WhatsApp Pay'].map((app) => (
              <div
                key={app}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#7A6A5A',
                  background: '#FAF8F5',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(232, 224, 214, 0.4)'
                }}
              >
                <Smartphone size={13} color="#8C4F1A" />
                {app}
              </div>
            ))}
          </div>
        </div>

        {/* Main Payout Button */}
        <button
          onClick={handlePaymentComplete}
          disabled={processing}
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: '18px',
            border: 'none',
            background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(140, 79, 26, 0.16)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'opacity 0.2s',
            opacity: processing ? 0.8 : 1
          }}
        >
          <Heart size={16} fill="#fff" />
          {processing ? 'Processing Contribution...' : 'I Have Completed Payment'}
        </button>

        {/* Emotional messages */}
        <div style={{
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(232, 224, 214, 0.4)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#8C4F1A', fontWeight: 600, lineHeight: 1.5 }}>
            “Every contribution helps support a child’s medical recovery journey. Please support honestly and compassionately ❤️”
          </p>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#7A6A5A', lineHeight: 1.5 }}>
            This platform currently works on community trust and transparent support.
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: '#9A8A7A', fontStyle: 'italic' }}>
            Payment confirmation may be reviewed manually for transparency purposes.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
