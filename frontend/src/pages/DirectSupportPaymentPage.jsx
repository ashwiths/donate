import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Heart, Shield, ArrowLeft, Smartphone, ShieldCheck, HeartPulse, Sparkles, Activity, Smile, Gift } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useDonation } from '../context/DonationContext'
import { generateHealingCertificate, processOfflineQueue } from '../services/contributionService'
import qrImage from '../assets/payment-qr.png'
import { fadeUp } from '../animations/variants'
import { getSupporterDisplayName } from '../utils/nameHelper'
import { sanitizeInput } from '../utils/sanitize'

// App details & High-Fidelity SVG Brand Icons
const phonepeLogo = (
  <svg viewBox="0 0 40 40" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="#5F259F"/>
    <path d="M20 9C15.58 9 12 12.58 12 17C12 22.5 20 31 20 31C20 31 28 22.5 28 17C28 12.58 24.42 9 20 9ZM20 20C18.34 20 17 18.66 17 17C17 15.34 18.34 14 20 14C21.66 14 23 15.34 23 17C23 18.66 21.66 20 20 20Z" fill="white"/>
  </svg>
)

const gpayLogo = (
  <svg viewBox="0 0 48 48" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M36.16 24a4.16 4.16 0 0 1-4.16 4.16H18.72a4.16 4.16 0 0 1 0-8.32H32a4.16 4.16 0 0 1 4.16 4.16z" fill="#EA4335"/>
    <path d="M29.76 36.16A4.16 4.16 0 0 1 25.6 32V18.72a4.16 4.16 0 0 1 8.32 0V32a4.16 4.16 0 0 1-4.16 4.16z" fill="#4285F4"/>
    <path d="M18.24 36.16a4.16 4.16 0 0 1-4.16-4.16V18.72a4.16 4.16 0 0 1 8.32 0V32a4.16 4.16 0 0 1-4.16 4.16z" fill="#34A853"/>
    <path d="M24 18.24a4.16 4.16 0 0 1-4.16-4.16V8.32a4.16 4.16 0 0 1 8.32 0V14a4.16 4.16 0 0 1-4.16 4.16z" fill="#FBBC05"/>
  </svg>
)

const paytmLogo = (
  <svg viewBox="0 0 40 40" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="#00b9f5"/>
    <text x="20" y="25" fill="#FFFFFF" fontSize="12" fontWeight="950" fontFamily="system-ui, -apple-system, sans-serif" textAnchor="middle">paytm</text>
  </svg>
)

const bhimLogo = (
  <svg viewBox="0 0 40 40" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="#1E3D59"/>
    <path d="M12 11H28L20 29L12 11Z" fill="#FF9933"/>
    <path d="M15 14H25L20 25L15 14Z" fill="#FFFFFF"/>
    <path d="M18 17H22L20 21L18 17Z" fill="#128807"/>
  </svg>
)

const floatingIcons = [
  { Icon: HeartPulse, top: '8%', left: '4%', size: 24, color: 'rgba(200, 119, 58, 0.4)', delay: 0 },
  { Icon: Sparkles, top: '22%', right: '6%', size: 28, color: 'rgba(212, 175, 55, 0.4)', delay: 1.2 },
  { Icon: Activity, bottom: '25%', left: '3%', size: 26, color: 'rgba(140, 79, 26, 0.3)', delay: 0.6 },
  { Icon: Gift, bottom: '15%', right: '5%', size: 22, color: 'rgba(232, 168, 124, 0.4)', delay: 1.8 },
  { Icon: Smile, top: '45%', left: '8%', size: 20, color: 'rgba(140, 79, 26, 0.3)', delay: 2.4 }
]

const upiApps = [
  { id: 'phonepe', name: 'PhonePe', scheme: 'phonepe', caption: 'Tap to Pay', logo: phonepeLogo },
  { id: 'gpay', name: 'Google Pay', scheme: 'gpay', caption: 'Tap to Pay', logo: gpayLogo },
  { id: 'paytm', name: 'Paytm', scheme: 'paytm', caption: 'Tap to Pay', logo: paytmLogo },
  { id: 'bhim', name: 'BHIM', scheme: 'upi', caption: 'Tap to Pay', logo: bhimLogo }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
}

export default function DirectSupportPaymentPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { confirmDonation } = useDonation()

  const [copied, setCopied] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showQrFallback, setShowQrFallback] = useState(false)
  const [openingApp, setOpeningApp] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)
  const [honeypotVal, setHoneypotVal] = useState('')

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
    } else {
      // Preload Google Fonts used in certificates (e.g. Great Vibes, Outfit) and cache browser resources
      try {
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Outfit:wght@400;500;700;800;900&display=swap';
        document.head.appendChild(fontLink);
      } catch (err) {
        console.error('Failed to preload certificate fonts:', err);
      }

      // Prefetch thank-you page assets silently in the background
      try {
        import('./ThankYouPage')
      } catch (err) {
        // Ignore prefetch failures
      }

      // Silently process any stored offline contributions
      try {
        processOfflineQueue()
      } catch (offlineErr) {
        console.error('Failed to run offline queue processor:', offlineErr)
      }
    }
  }, [user, navigate])

  // Device detection for mobile layout and direct payments
  useEffect(() => {
    const checkMobile = () => {
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const isSmallScreen = window.innerWidth <= 768
      setIsMobile(isMobileUA || isSmallScreen)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const upiId = 'ppqr01.bgpulp@iob'

  const getUpiUrl = (appScheme = 'upi') => {
    const pnEncoded = encodeURIComponent('Janamithra Support')
    const tnEncoded = encodeURIComponent('Heal & Play Pediatric Support')
    // Use standard upi:// for all apps — proprietary schemes (paytmmp://, phonepe://) from
    // browser contexts are flagged as fraud by those apps' security systems.
    // GPay uses tez://upi which is safe. PhonePe and Paytm both support upi:// natively.
    let url
    if (appScheme === 'gpay') {
      // Google Pay Android deep link (tez is the internal name)
      url = `tez://upi/pay?pa=${upiId}&pn=${pnEncoded}&am=${pendingPrice}&cu=INR&tn=${tnEncoded}`
    } else if (appScheme === 'phonepe') {
      // PhonePe supports standard upi:// — avoid phonepe:// from browser (fraud flag risk)
      url = `upi://pay?pa=${upiId}&pn=${pnEncoded}&am=${pendingPrice}&cu=INR&tn=${tnEncoded}&app=phonepe`
    } else if (appScheme === 'paytm') {
      // Paytm supports standard upi:// — paytmmp:// from browser triggers fraud detection
      url = `upi://pay?pa=${upiId}&pn=${pnEncoded}&am=${pendingPrice}&cu=INR&tn=${tnEncoded}`
    } else {
      // BHIM and generic UPI
      url = `upi://pay?pa=${upiId}&pn=${pnEncoded}&am=${pendingPrice}&cu=INR&tn=${tnEncoded}`
    }
    return url
  }

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(30)
      } catch (err) {
        // Safe catch for unsupported environments
      }
    }
  }

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleUpiPayment = (appName, scheme) => {
    triggerHaptic()
    setOpeningApp(appName)
    const url = getUpiUrl(scheme)
    const start = Date.now()
    window.location.href = url

    // Fallback: If browser does not lose focus within 1.2s, the app is likely not installed.
    setTimeout(() => {
      setOpeningApp(null)
      if (Date.now() - start < 1500) {
        setShowQrFallback(true)
        setToastMessage('App not detected. Please scan QR instead.')
        setTimeout(() => setToastMessage(null), 4000)
      }
    }, 1200)
  }

  const handlePaymentComplete = () => {
    // 1. Bot prevention: honeypot check
    if (honeypotVal) {
      console.warn('Bot activity suspected via honeypot.');
      return;
    }

    // 2. Cooldown check: prevent duplicate submissions
    const lastClickTime = sessionStorage.getItem('hp_payment_click_ts')
    const now = Date.now()
    if (lastClickTime && now - Number(lastClickTime) < 8000) {
      console.warn('Payment submit cooldown active.');
      return;
    }
    sessionStorage.setItem('hp_payment_click_ts', now.toString())

    // 3. Automated environment checks
    if (navigator.webdriver) {
      console.warn('Automated execution environment blocked.');
      return;
    }

    // 4. Input sanity checks
    if (isNaN(pendingPrice) || pendingPrice < 10 || pendingPrice > 1000000) {
      console.error('Suspicious contribution amount rejected.');
      return;
    }

    // Trigger tiny haptic vibration feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(30)
      } catch (hapticErr) {
        // Safe catch
      }
    }
    triggerHaptic()
    setIsProcessing(true)
    
    // 1. Immediately show the lightweight transition overlay
    setPaymentSuccess(true)

    // 2. Perform Firestore background save asynchronously (non-blocking)
    try {
      confirmDonation(pendingPrice)

      if (user?.uid) {
        const runBackgroundSave = async () => {
          try {
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
                couponCode: 'SECRET_CODE_MOCK',
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
          } catch (err) {
            console.error('Background save failed:', err)
          } finally {
            setIsProcessing(false)
          }
        }
        runBackgroundSave()
      } else {
        setIsProcessing(false)
      }
    } catch (err) {
      console.error('Background save registration failed:', err)
      setIsProcessing(false)
    }

    // 3. Immediately trigger navigation after a tiny 300ms transition delay
    setTimeout(() => {
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
    }, 300)
  }



  return (
    <div className="payment-page-container" style={{
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
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes shimmerProgress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes shimmerText {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

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
          transform: translateY(-5px) scale(1.01) !important;
          box-shadow: 0 20px 48px rgba(140, 79, 26, 0.12), 0 0 40px rgba(200, 119, 58, 0.1), inset 0 1px 0 rgba(255,255,255,0.9) !important;
          border-color: rgba(139, 94, 52, 0.25) !important;
        }
        
        .back-btn-hover:hover {
          background: rgba(140, 79, 26, 0.1) !important;
          color: #7B3F00 !important;
          transform: translateX(-2px);
        }

        .upi-apps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          width: 100%;
        }

        @media (max-width: 900px) and (min-width: 481px) {
          .upi-apps-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .upi-apps-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
        }

        .upi-app-card {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        .upi-app-card:hover {
          border-color: #C8773A !important;
          box-shadow: 0 8px 20px rgba(200, 119, 58, 0.08) !important;
          background: #FFFBF7 !important;
        }

        .upi-app-card:active {
          transform: scale(0.96);
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(140,79,26,0.2);
          border-top: 2px solid #8C4F1A;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.9;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.015);
            box-shadow: 0 4px 20px rgba(200, 119, 58, 0.06);
          }
        }
        
        @keyframes gentleFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        .mobile-qr-card-premium {
          animation: gentleFloat 4s ease-in-out infinite;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .mobile-qr-card-premium:hover {
          transform: translateY(-5px) scale(1.01) !important;
          box-shadow: 0 20px 48px rgba(140, 79, 26, 0.12), 0 0 40px rgba(200, 119, 58, 0.1), inset 0 1px 0 rgba(255,255,255,0.9) !important;
          border-color: rgba(139, 94, 52, 0.25) !important;
        }

        @media (max-width: 768px) {
          .payment-page-container {
            padding: 16px 12px 100px !important;
          }
          .payment-main-container {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .payment-right-card {
            padding: 20px 16px !important;
            border-radius: 20px !important;
          }
          .amount-indicator-card {
            padding: 16px 18px !important;
            border-radius: 18px !important;
          }
          .compassion-quote-card {
            padding: 14px 18px !important;
            border-radius: 0 16px 16px 0 !important;
          }
          .trust-badges-grid {
            gap: 10px !important;
            margin-bottom: 20px !important;
          }
          .trust-badge-item {
            padding: 12px 10px !important;
            border-radius: 12px !important;
          }
          .payment-action-btn-container {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            background: rgba(253, 251, 247, 0.95) !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;
            padding: 16px 20px calc(16px + env(safe-area-inset-bottom)) !important;
            box-shadow: 0 -8px 32px rgba(140,79,26,0.1) !important;
            border-top: 1px solid rgba(232, 224, 214, 0.8) !important;
            z-index: 1000 !important;
          }
          .payment-action-btn {
            margin: 0 !important;
            width: 100% !important;
          }
          .payment-grid-layout {
            padding-bottom: 120px !important;
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

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#3D2B1A',
              color: '#FAF6F2',
              padding: '12px 24px',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(140, 79, 26, 0.18)',
              zIndex: 100000,
              fontSize: '13.5px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid rgba(212, 175, 55, 0.3)'
            }}
          >
            <ShieldCheck size={16} color="#D4AF37" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Layout Container */}
      <div className="payment-main-container" style={{
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
            <div className="amount-indicator-card" style={{
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
            <div className="compassion-quote-card" style={{
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
            <div className="trust-badges-grid" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '28px'
            }}>
              <div className="trust-badge-item" style={{
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
              <div className="trust-badge-item" style={{
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
            <div className="payment-right-card" style={{
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

              {/* Responsive Rendering */}
              {isMobile ? (
                /* MOBILE LAYOUT: UPI App Cards Selection + Sticky Confirmation */
                <>
                  {/* QR Fallback Notice if deep link fails */}
                  {showQrFallback && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        background: 'rgba(200, 119, 58, 0.08)',
                        border: '1px solid rgba(200, 119, 58, 0.2)',
                        borderRadius: '16px',
                        padding: '12px 16px',
                        marginBottom: '20px',
                        fontSize: '13px',
                        color: '#8C4F1A',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        zIndex: 1,
                        position: 'relative'
                      }}
                    >
                      <ShieldCheck size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>
                        Could not open the selected app directly. We've loaded the QR code below. You can scan it or copy the UPI ID to complete payment.
                      </span>
                    </motion.div>
                  )}

                  {showQrFallback ? (
                    /* Fallback: Mobile QR Code */
                    <motion.div
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        zIndex: 1,
                        position: 'relative',
                        boxSizing: 'border-box'
                      }}
                    >
                      <div
                        className="mobile-qr-card-premium"
                        style={{
                          margin: '0 auto 20px',
                          maxWidth: '240px',
                          width: '100%',
                          aspectRatio: '1 / 1',
                          position: 'relative',
                          zIndex: 1,
                          background: '#FFFDFB',
                          borderRadius: '28px',
                          border: '1.5px solid rgba(139, 94, 52, 0.12)',
                          padding: '16px',
                          boxShadow: '0 12px 32px rgba(140, 79, 26, 0.08), 0 0 24px rgba(200, 119, 58, 0.05), inset 0 1px 0 rgba(255,255,255,0.9)',
                          boxSizing: 'border-box',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        <img 
                          src={qrImage} 
                          alt="Scan to Pay" 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'contain',
                            display: 'block', 
                            borderRadius: '12px' 
                          }} 
                        />
                      </div>

                      {/* Small Trust Section Below QR */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', marginBottom: '24px', zIndex: 1, position: 'relative', width: '100%', boxSizing: 'border-box' }}>
                        {['Verified patient support', 'Community trust model', 'Transparent healing initiative'].map((text, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#47682C', fontWeight: 700, background: '#EAF5E2', padding: '4px 12px', borderRadius: '99px', border: '1px solid rgba(133, 185, 111, 0.15)', justifyContent: 'center', width: 'fit-content' }}>
                            <Check size={12} strokeWidth={3} />
                            <span>{text}</span>
                          </div>
                        ))}
                      </div>

                      {/* UPI ID Details */}
                      <div style={{ marginBottom: '24px', zIndex: 1, position: 'relative', width: '100%', boxSizing: 'border-box' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C4F1A', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px', textAlign: 'left' }}>
                          UPI ID
                        </span>
                        <div className="payment-upi-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAF8F5', border: '1px solid rgba(232,224,214,0.6)', borderRadius: '16px', padding: '12px 16px', gap: 12, boxSizing: 'border-box' }}>
                          <code style={{ fontSize: '13px', fontWeight: 700, color: '#3D2B1A', fontFamily: 'monospace', wordBreak: 'break-all', textAlign: 'left' }}>{upiId}</code>
                          <button onClick={handleCopyUPI} style={{ background: copied ? '#EAF5E2' : '#8C4F1A', border: 'none', borderRadius: '10px', padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: copied ? '#47682C' : '#FFF', fontSize: '12px', fontWeight: 700, transition: 'all 0.2s', flexShrink: 0 }}>
                            {copied ? <Check size={13} /> : <Copy size={13} />}
                            {copied ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    /* Mobile UPI Card grid */
                    <div style={{ zIndex: 1, position: 'relative', width: '100%', textAlign: 'left', marginBottom: '20px', boxSizing: 'border-box' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#3D2B1A', margin: '0 0 4px 0', letterSpacing: '-0.3px' }}>
                        Choose Your Payment App
                      </h3>
                      <p style={{ fontSize: '12px', color: '#7A6A5A', margin: '0 0 16px 0', fontWeight: 500, lineHeight: 1.4 }}>
                        Tap your preferred UPI app to continue securely.
                      </p>

                      {openingApp && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          background: 'rgba(200, 119, 58, 0.06)',
                          border: '1.5px solid rgba(200, 119, 58, 0.18)',
                          borderRadius: '16px',
                          padding: '14px',
                          marginBottom: '20px',
                          fontSize: '13px',
                          color: '#8C4F1A',
                          fontWeight: 700,
                          animation: 'pulseGlow 2s infinite ease-in-out',
                          boxSizing: 'border-box',
                          width: '100%'
                        }}>
                          <div className="spinner" style={{ flexShrink: 0 }} />
                          <span>Opening {openingApp} securely...</span>
                        </div>
                      )}

                      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="upi-apps-grid" style={{ boxSizing: 'border-box' }}>
                        {upiApps.map((app) => (
                          <motion.button
                            key={app.id}
                            variants={cardVariants}
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => handleUpiPayment(app.name, app.scheme)}
                            aria-label={`Pay with ${app.name}`}
                            role="button"
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '14px',
                              borderRadius: '16px',
                              border: '1.5px solid rgba(232, 224, 214, 0.8)',
                              background: '#FFFDFB',
                              cursor: 'pointer',
                              boxShadow: '0 4px 12px rgba(140, 79, 26, 0.02)',
                              outline: 'none',
                              width: '100%',
                              boxSizing: 'border-box'
                            }}
                            className="upi-app-card"
                          >
                            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{app.logo}</div>
                            <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#3D2B1A', marginBottom: '2px', display: 'block', whiteSpace: 'nowrap' }}>{app.name}</span>
                            <span style={{ fontSize: '9px', fontWeight: 700, color: '#9A8A7A', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>{app.caption}</span>
                          </motion.button>
                        ))}
                      </motion.div>

                      <div style={{ marginTop: '20px', fontSize: '11.5px', color: '#8C4F1A', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', textAlign: 'center', lineHeight: 1.4 }}>
                        <Heart size={11} fill="#8C4F1A" className="heartbeat-pulse" />
                        <span>100% Direct Patient Support &bull; No Payment Gateway Middlemen</span>
                      </div>
                    </div>
                  )}

                  {/* Sticky button container for Mobile */}
                  <div className="payment-action-btn-container" style={{ zIndex: 1, position: 'relative' }}>
                    <input
                      type="text"
                      name="middle_name_alt"
                      value={honeypotVal}
                      onChange={(e) => setHoneypotVal(e.target.value)}
                      style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1 }}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                    <button
                      onClick={handlePaymentComplete}
                      disabled={isProcessing}
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
                      {isProcessing ? 'Processing Contribution...' : 'I Have Completed Payment'}
                    </button>
                    <p style={{ margin: '8px 0 0', fontSize: '10.5px', color: '#9A8A7A', fontStyle: 'italic', textAlign: 'center', lineHeight: 1.35 }}>
                      Payments are manually reviewed to prevent misuse and protect verified pediatric treatment campaigns.
                    </p>
                  </div>
                </>
              ) : (
                /* DESKTOP LAYOUT: Keep original layout unchanged */
                <>
                  {/* Large Centered QR Code Container */}
                  <div
                    className="qr-card-glow"
                    style={{
                      margin: '0 auto 24px',
                      maxWidth: '280px',
                      width: '100%',
                      aspectRatio: '1 / 1',
                      position: 'relative',
                      zIndex: 1,
                      background: '#FFFDFB',
                      borderRadius: '28px',
                      border: '1.5px solid rgba(139, 94, 52, 0.12)',
                      padding: '16px',
                      boxShadow: '0 16px 40px rgba(140, 79, 26, 0.08), 0 0 32px rgba(200, 119, 58, 0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
                      boxSizing: 'border-box',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: 'gentleFloat 4s ease-in-out infinite'
                    }}
                  >
                    <img
                      src={qrImage}
                      alt="Scan to Pay"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        display: 'block',
                        borderRadius: '12px'
                      }}
                    />
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

                  {/* Non-sticky Action Button */}
                  <div style={{ zIndex: 1, position: 'relative' }}>
                    <input
                      type="text"
                      name="middle_name_alt"
                      value={honeypotVal}
                      onChange={(e) => setHoneypotVal(e.target.value)}
                      style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1 }}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                    <button
                      onClick={handlePaymentComplete}
                      disabled={isProcessing}
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
                      {isProcessing ? 'Processing Contribution...' : 'I Have Completed Payment'}
                    </button>
                  </div>
                </>
              )}

              {/* Subtext info */}
              <p style={{ margin: '16px 0 0', fontSize: '11px', color: '#9A8A7A', fontStyle: 'italic', zIndex: 1, position: 'relative', lineHeight: 1.45 }}>
                Payments are manually reviewed to prevent misuse and protect verified pediatric treatment campaigns.
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
              background: 'rgba(253, 251, 247, 0.98)',
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
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
                background: '#FAF2EA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                boxShadow: '0 8px 24px rgba(140, 79, 26, 0.08)',
                animation: 'pulseGlow 1.2s infinite ease-in-out'
              }}>
                <Heart size={36} fill="#8C4F1A" color="#8C4F1A" />
              </div>

              <h2 style={{
                margin: '0 0 16px',
                fontSize: '24px',
                fontWeight: 900,
                color: '#3D2B1A',
                letterSpacing: '-0.5px',
                animation: 'shimmerText 1.5s infinite ease-in-out'
              }}>
                Verifying contribution...
              </h2>
              
              {/* Shimmering Progress Bar */}
              <div style={{
                width: '180px',
                height: '5px',
                background: 'rgba(140, 79, 26, 0.1)',
                borderRadius: '3px',
                overflow: 'hidden',
                position: 'relative',
                marginBottom: '8px'
              }}>
                <div style={{
                  position: 'absolute',
                  height: '100%',
                  top: 0,
                  left: 0,
                  width: '100%',
                  background: 'linear-gradient(90deg, transparent, #C8773A, #8C4F1A, transparent)',
                  borderRadius: '3px',
                  animation: 'shimmerProgress 1.2s infinite linear',
                  willChange: 'transform'
                }} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
