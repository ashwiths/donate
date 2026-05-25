import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Heart, Shield, ArrowLeft, Smartphone, ShieldCheck, HeartPulse, Sparkles, Activity, Smile, Gift } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useDonation } from '../context/DonationContext'
import { generateHealingCertificate } from '../services/contributionService'
import qrImage from '../assets/payment-qr.png'
import { fadeUp } from '../animations/variants'
import confetti from 'canvas-confetti'
import { getSupporterDisplayName } from '../utils/nameHelper'

export default function DirectSupportPaymentPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { confirmDonation } = useDonation()

  const [copied, setCopied] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  // Retrieve temporary contribution details stored in localStorage
  const supporterName = getSupporterDisplayName(user, localStorage.getItem('hp_supporter_name') || localStorage.getItem('hp_user_name'))
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
              childName: 'Janamitra',
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
              childName: 'Janamitra',
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
              childName: 'Janamitra',
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
              childName: 'Janamitra',
              title: 'Certificate of Healing Support',
              contributionType: 'donation',
              supporterName: supporterName
            })
          }
        }

        // Show full screen success celebration
        setPaymentSuccess(true)
        confetti({
          particleCount: 180,
          spread: 100,
          origin: { y: 0.4 },
          colors: ['#8C4F1A', '#C8773A', '#D4AF37', '#FAF2EA']
        })

        // Hold success presentation for 3 seconds of high-fidelity wellness delight
        setTimeout(() => {
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
        }, 3000)

      } catch (err) {
        console.error('Error confirming payment:', err)
        alert('Confirmation failed: ' + err.message)
        setProcessing(false)
      }
    }, 2000)
  }

  const floatingIcons = [
    { Icon: HeartPulse, top: '8%', left: '4%', size: 24, color: 'rgba(200, 119, 58, 0.4)', delay: 0 },
    { Icon: Sparkles, top: '22%', right: '6%', size: 28, color: 'rgba(212, 175, 55, 0.4)', delay: 1.2 },
    { Icon: Activity, bottom: '25%', left: '3%', size: 26, color: 'rgba(140, 79, 26, 0.3)', delay: 0.6 },
    { Icon: Gift, bottom: '15%', right: '5%', size: 22, color: 'rgba(232, 168, 124, 0.4)', delay: 1.8 },
    { Icon: Smile, top: '45%', left: '8%', size: 20, color: 'rgba(140, 79, 26, 0.3)', delay: 2.4 }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FDFBF7 0%, #F5EFEB 100%)',
      color: '#3D2B1A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 'clamp(20px, 4vw, 40px) clamp(12px, 4vw, 20px)',
      boxSizing: 'border-box',
      fontFamily: 'Outfit, sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <style>{`
        .payment-grid-layout {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 48px;
          align-items: start;
          width: 100%;
        }
        
        @media (max-width: 900px) {
          .payment-grid-layout {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
        
        .glowing-btn {
          background: linear-gradient(135deg, #C8773A, #8C4F1A) !important;
          color: #fff !important;
          box-shadow: 0 8px 24px rgba(140,79,26,0.15);
          animation: buttonGlow 3s ease-in-out infinite;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        
        .glowing-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 36px rgba(140,79,26,0.3), 0 0 12px rgba(200,119,58,0.3) !important;
          background: linear-gradient(135deg, #A0522D, #7B3F00) !important;
        }
        
        .glowing-btn:active {
          transform: scale(0.98);
        }
        
        @keyframes buttonGlow {
          0%, 100% {
            box-shadow: 0 8px 24px rgba(140,79,26,0.2), 0 0 0 rgba(200,119,58,0);
          }
          50% {
            box-shadow: 0 16px 36px rgba(140,79,26,0.35), 0 0 16px rgba(200,119,58,0.4);
          }
        }
        
        .qr-card-glow {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .qr-card-glow:hover {
          transform: translateY(-4px);
        }
        
        .back-btn-hover:hover {
          background: rgba(140, 79, 26, 0.1) !important;
          color: #7B3F00 !important;
          transform: translateX(-2px);
        }

        @media (max-width: 768px) {
          .payment-action-btn-container {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            background: rgba(253, 251, 247, 0.9) !important;
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            padding: 16px 20px !important;
            box-shadow: 0 -8px 32px rgba(140,79,26,0.08) !important;
            border-top: 1px solid rgba(232, 224, 214, 0.6) !important;
            z-index: 1000 !important;
          }
          .payment-action-btn {
            margin: 0 !important;
            width: 100% !important;
          }
          .payment-grid-layout {
            padding-bottom: 90px !important;
          }
        }
      `}</style>

      {/* Ambient background blur shapes */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200, 119, 58, 0.12) 0%, rgba(200, 119, 58, 0) 70%)',
        filter: 'blur(80px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '5%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(123, 63, 0, 0.1) 0%, rgba(123, 63, 0, 0) 70%)',
        filter: 'blur(90px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '45%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(254, 243, 199, 0.3) 0%, rgba(254, 243, 199, 0) 60%)',
        filter: 'blur(100px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Floating Medical/Healing Icons */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 8, -8, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 6 + index * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay
          }}
          style={{
            position: 'absolute',
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom,
            zIndex: 1,
            pointerEvents: 'none',
            color: item.color,
          }}
        >
          <item.Icon size={item.size} />
        </motion.div>
      ))}

      {/* Main Layout Container */}
      <div style={{
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
        zIndex: 2,
        position: 'relative'
      }}>
        {/* Header back link */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-start' }}>
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
              padding: '8px 16px',
              borderRadius: '12px',
              background: 'rgba(140, 79, 26, 0.05)',
              border: '1px solid rgba(140, 79, 26, 0.1)',
              transition: 'all 0.2s'
            }}
            className="back-btn-hover"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        <div className="payment-grid-layout">
          {/* LEFT SIDE: Emotional Details and Contribution Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            {/* Top Emotional Badge */}
            <div style={{
              display: 'inline-flex',
              alignSelf: 'flex-start',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(140, 79, 26, 0.06)',
              border: '1.5px solid rgba(140, 79, 26, 0.1)',
              borderRadius: '99px',
              padding: '8px 16px',
              marginBottom: '20px'
            }}>
              <Heart size={14} color="#8C4F1A" fill="#8C4F1A" className="heartbeat-pulse" />
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C4F1A', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Pediatric Healing Support &bull; Janamitra
              </span>
            </div>

            {/* Main Heading & Subtitle */}
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-1px',
              color: '#3D2B1A',
              margin: '0 0 12px 0'
            }}>
              Support Janamitra’s Healing Journey ❤️
            </h1>
            <p style={{
              fontSize: 'clamp(14.5px, 2vw, 16.5px)',
              color: '#7A6A5A',
              lineHeight: 1.6,
              margin: '0 0 28px 0',
              fontWeight: 500
            }}>
              You are directly supporting verified pediatric treatment and recovery care.
            </p>

            {/* Selected Amount Indicator */}
            <div style={{
              background: 'linear-gradient(135deg, #FAF6F2 0%, #F5ECE5 100%)',
              border: '1px solid rgba(140, 79, 26, 0.15)',
              borderRadius: '24px',
              padding: '20px 24px',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 8px 24px rgba(140, 79, 26, 0.02)'
            }}>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '11px', fontWeight: 850, color: '#8C4F1A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Contribution Amount</span>
                <div style={{ fontSize: '14px', color: '#7A6A5A', marginTop: '4px', fontWeight: 600 }}>
                  For: {unlockType === 'game' ? `Unlock Game - ${pendingGameTitle}` : unlockType === 'coupon' ? `Unlock Coupon - ${pendingGameTitle}` : unlockType === 'message' ? `Unlock Quote - ${pendingGameTitle}` : 'Direct Support'}
                </div>
              </div>
              <div style={{ fontSize: '38px', fontWeight: 950, color: '#8C4F1A', letterSpacing: '-1.5px' }}>
                ₹{pendingPrice}
              </div>
            </div>

            {/* Compassion Quote Card */}
            <div style={{
              background: 'rgba(200, 119, 58, 0.04)',
              borderLeft: '4px solid #C8773A',
              borderRadius: '0 20px 20px 0',
              padding: '18px 24px',
              marginBottom: '28px',
              textAlign: 'left'
            }}>
              <p style={{ margin: 0, fontSize: '15px', color: '#8C4F1A', fontWeight: 650, lineHeight: 1.6, fontStyle: 'italic' }}>
                “Every contribution helps support a child’s medical recovery journey. Please support honestly and compassionately ❤️”
              </p>
            </div>

            {/* Left Trust Badges Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '28px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#FFF',
                border: '1px solid rgba(232, 224, 214, 0.6)',
                borderRadius: '16px',
                padding: '14px',
                boxShadow: '0 4px 12px rgba(140,79,26,0.02)'
              }}>
                <div style={{ background: 'rgba(133, 185, 111, 0.1)', padding: '8px', borderRadius: '12px', color: '#47682C', display: 'flex' }}>
                  <ShieldCheck size={20} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#3D2B1A' }}>100% Secure</div>
                  <div style={{ fontSize: '11px', color: '#7A6A5A' }}>Direct QR Transfer</div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#FFF',
                border: '1px solid rgba(232, 224, 214, 0.6)',
                borderRadius: '16px',
                padding: '14px',
                boxShadow: '0 4px 12px rgba(140,79,26,0.02)'
              }}>
                <div style={{ background: 'rgba(200, 119, 58, 0.1)', padding: '8px', borderRadius: '12px', color: '#C8773A', display: 'flex' }}>
                  <Heart size={20} fill="#C8773A" />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#3D2B1A' }}>Direct Care</div>
                  <div style={{ fontSize: '11px', color: '#7A6A5A' }}>Instant Allocation</div>
                </div>
              </div>
            </div>

            {/* Verified Support Labels & Transparency */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              borderTop: '1px solid rgba(232, 224, 214, 0.5)',
              paddingTop: '24px'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C4F1A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Verified Transparency
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13.5px', color: '#7A6A5A', lineHeight: 1.5 }}>
                  <Check size={16} color="#8C4F1A" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>Hospital invoices and child recovery status updates are verified and published directly.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13.5px', color: '#7A6A5A', lineHeight: 1.5 }}>
                  <Check size={16} color="#8C4F1A" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>Direct QR transfer keeps the platform audit-friendly with zero intermediary platform cuts.</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE: Floating QR Card and Payment Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div style={{
              border: '2px solid transparent',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.7) 100%) padding-box, linear-gradient(135deg, rgba(235, 213, 194, 0.9) 0%, rgba(200, 119, 58, 0.4) 100%) border-box',
              borderRadius: '32px',
              padding: 'clamp(20px, 4vw, 36px)',
              boxShadow: '0 24px 64px rgba(140, 79, 26, 0.08), 0 8px 16px rgba(140, 79, 26, 0.02)',
              position: 'relative',
              textAlign: 'center'
            }}>
              {/* Soft warm glow inside card */}
              <div style={{
                position: 'absolute',
                top: '-10%',
                left: '-10%',
                width: '120%',
                height: '120%',
                background: 'radial-gradient(circle at 50% 20%, rgba(254, 243, 199, 0.4) 0%, rgba(255,255,255,0) 65%)',
                zIndex: 0,
                pointerEvents: 'none'
              }} />

              {/* Large Centered QR Code Container */}
              <div
                className="qr-card-glow"
                style={{
                  margin: '0 auto 20px',
                  maxWidth: '280px',
                  width: '100%',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '-12px',
                  right: '-12px',
                  bottom: '-12px',
                  background: 'radial-gradient(circle, rgba(200, 119, 58, 0.22) 0%, rgba(255,255,255,0) 75%)',
                  borderRadius: '28px',
                  zIndex: 0
                }} className="qr-glow-layer" />

                <div style={{
                  background: '#fff',
                  borderRadius: '24px',
                  border: '1px solid rgba(232, 224, 214, 0.8)',
                  padding: '20px',
                  position: 'relative',
                  zIndex: 1,
                  boxShadow: '0 16px 40px rgba(140, 79, 26, 0.06)'
                }}>
                  <img
                    src={qrImage}
                    alt="Scan to Pay"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      borderRadius: '16px'
                    }}
                  />
                </div>
              </div>

              {/* Small Trust Section Below QR */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                alignItems: 'center',
                marginBottom: '24px',
                zIndex: 1,
                position: 'relative'
              }}>
                {[
                  'Verified patient support',
                  'Community trust model',
                  'Transparent healing initiative'
                ].map((text, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    color: '#47682C',
                    fontWeight: 700,
                    background: '#EAF5E2',
                    padding: '4px 12px',
                    borderRadius: '99px',
                    border: '1px solid rgba(133, 185, 111, 0.15)'
                  }}>
                    <Check size={12} strokeWidth={3} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              {/* UPI ID Details */}
              <div style={{ marginBottom: '24px', zIndex: 1, position: 'relative' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C4F1A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px', textAlign: 'left' }}>
                  UPI ID
                </span>
                <div
                  className="payment-upi-row"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#FAF8F5',
                    border: '1px solid rgba(232,224,214,0.6)',
                    borderRadius: '16px',
                    padding: '12px 16px',
                    gap: 12
                  }}
                >
                  <code style={{ fontSize: '13.5px', fontWeight: 700, color: '#3D2B1A', fontFamily: 'monospace', wordBreak: 'break-all', textAlign: 'left' }}>
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
                      transition: 'all 0.2s',
                      flexShrink: 0
                    }}
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Scan with Apps Row */}
              <div style={{
                borderTop: '1px solid rgba(232, 224, 214, 0.4)',
                paddingTop: '20px',
                marginBottom: '28px',
                zIndex: 1,
                position: 'relative'
              }}>
                <div style={{ fontSize: '11px', color: '#7A6A5A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
                  Scan using any UPI App
                </div>
                <div className="payment-apps-row" style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {['PhonePe', 'Google Pay', 'Paytm', 'BHIM'].map((app) => (
                    <div
                      key={app}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
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

              {/* Button Container - handles fixed position on mobile */}
              <div className="payment-action-btn-container" style={{ zIndex: 1, position: 'relative' }}>
                <button
                  onClick={handlePaymentComplete}
                  disabled={processing}
                  className="payment-action-btn glowing-btn"
                  style={{
                    width: '100%',
                    padding: '18px',
                    borderRadius: '18px',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    touchAction: 'manipulation'
                  }}
                >
                  <Heart size={16} fill="#fff" />
                  {processing ? 'Processing Contribution...' : 'I Have Completed Payment'}
                </button>
              </div>

              {/* Subtext info */}
              <p style={{ margin: '16px 0 0', fontSize: '11px', color: '#9A8A7A', fontStyle: 'italic', zIndex: 1, position: 'relative' }}>
                Payment confirmation may be reviewed manually for transparency purposes.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FULL SCREEN CELEBRATION SUCCESS OVERLAY */}
      <AnimatePresence>
        {paymentSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(61, 43, 26, 0.96)',
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center',
              backdropFilter: 'blur(16px)'
            }}
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              style={{
                background: 'linear-gradient(135deg, #FFF, #FAF4E8)',
                padding: '48px 40px',
                borderRadius: '36px',
                border: '1px solid #D4AF37',
                boxShadow: '0 24px 64px rgba(212, 175, 55, 0.2)',
                maxWidth: '460px',
                width: '100%',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {/* Pulsing check mark ring */}
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#EAF6E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                border: '4px solid #85B96F',
                boxShadow: '0 8px 24px rgba(133, 185, 111, 0.3)'
              }}>
                <ShieldCheck size={40} color="#47682C" />
              </div>

              <h2 style={{
                margin: '0 0 12px',
                fontSize: '26px',
                fontWeight: 900,
                color: '#3D2B1A',
                letterSpacing: '-0.5px'
              }}>
                Payment Completed! ✨
              </h2>
              
              <p style={{
                margin: '0 0 24px',
                fontSize: '14.5px',
                color: '#7A6A5A',
                lineHeight: 1.6,
                fontWeight: 500
              }}>
                Your direct support is fully verified and routed directly to Janamitra’s pediatric care.
              </p>

              {/* Glowing Heart indicator */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FAF2EA',
                padding: '10px 20px',
                borderRadius: '14px',
                border: '1px solid #EBD5C2',
                fontSize: '13px',
                fontWeight: 800,
                color: '#8C4F1A',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                <Heart size={14} fill="#8C4F1A" />
                Certificate Generated
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
