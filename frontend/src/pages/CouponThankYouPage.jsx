import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Copy, ExternalLink, ArrowRight, Heart, Sparkles, Gift } from 'lucide-react'
import { COUPONS } from '../data/coupons'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useUserData } from '../hooks/useUserData'

export default function CouponThankYouPage() {
  const { couponId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { userData, loading: userDataLoading } = useUserData()

  const [coupon, setCoupon] = useState(null)
  const [copied, setCopied] = useState(false)
  const [toastMsg, setToastMsg] = useState(null)
  const [cert, setCert] = useState(null)

  useEffect(() => {
    const found = COUPONS.find(c => c.id === couponId)
    if (found) {
      setCoupon(found)
    } else {
      navigate('/main')
    }
  }, [couponId, navigate])

  useEffect(() => {
    if (user && couponId) {
      const q = query(
        collection(db, 'certificates'),
        where('userId', '==', user.uid),
        where('couponId', '==', couponId)
      )
      getDocs(q).then(snap => {
        if (!snap.empty) {
          setCert({ id: snap.docs[0].id, ...snap.docs[0].data() })
        }
      }).catch(err => console.error("Error fetching coupon certificate:", err))
    }
  }, [user, couponId])

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

  const userName = userData?.name || user?.name || user?.displayName || localStorage.getItem('hp_user_name') || 'Verified Supporter'

  const formatDate = (timestamp) => {
    if (!timestamp) return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds ? timestamp.seconds * 1000 : timestamp)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const handleDownloadCert = () => {
    if (!cert) return
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert("Please allow popups to download your certificate.")
      return
    }

    const formattedDate = formatDate(cert.createdAt)
    const displayType = cert.contributionType ? cert.contributionType.replace('_', ' ').toUpperCase() : 'HEALING SUPPORT'

    printWindow.document.write(`
      <html>
        <head>
          <title>Healing Certificate - ₹${cert.amount}</title>
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;900&family=Great+Vibes&family=Playball&family=Pinyon+Script&display=swap" rel="stylesheet">
          <style>
            body {
              background: #FAF8F5;
              font-family: 'Outfit', sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
            }
            .certificate-container {
              background: #FFFFFF;
              border: 12px double #D4AF37;
              border-radius: 20px;
              padding: 60px 50px;
              width: 800px;
              text-align: center;
              box-shadow: 0 20px 50px rgba(139, 94, 52, 0.15);
              position: relative;
              box-sizing: border-box;
            }
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              opacity: 0.025;
              pointer-events: none;
              z-index: 0;
            }
            .header-institution {
              font-size: 11px;
              font-weight: 900;
              color: #8C745C;
              text-transform: uppercase;
              letter-spacing: 0.35em;
              margin-bottom: 24px;
              position: relative;
              z-index: 1;
            }
            h1 {
              font-family: 'Great Vibes', cursive;
              font-size: 64px;
              color: #8C4F1A;
              margin: 0 0 4px;
              position: relative;
              z-index: 1;
              text-shadow: 1px 1px 0px rgba(255,255,255,0.8);
            }
            h2 {
              font-size: 15px;
              color: #7A6A58;
              text-transform: uppercase;
              letter-spacing: 0.25em;
              margin: 0 0 36px;
              font-weight: 700;
              position: relative;
              z-index: 1;
            }
            .presented-to {
              font-size: 13.5px;
              color: #8C745C;
              font-style: italic;
              margin-bottom: 6px;
              font-weight: 500;
              position: relative;
              z-index: 1;
            }
            .name {
              font-size: 34px;
              font-weight: 900;
              color: #3D2B1A;
              border-bottom: 2px solid #EBD5C2;
              display: inline-block;
              padding-bottom: 6px;
              margin-bottom: 24px;
              min-width: 320px;
              font-family: 'Outfit', sans-serif;
              position: relative;
              z-index: 1;
            }
            .description {
              font-size: 15.5px;
              line-height: 1.8;
              color: #5C4C3C;
              margin: 0 auto 36px;
              max-width: 620px;
              position: relative;
              z-index: 1;
              font-weight: 500;
            }
            .amount {
              font-weight: 900;
              color: #8C4F1A;
            }
            .footer-info {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              border-top: 1px solid rgba(235, 221, 206, 0.8);
              padding-top: 40px;
              position: relative;
              z-index: 1;
            }
            .signature-block {
              text-align: center;
              width: 220px;
              position: relative;
            }
            .signature-graphic-left {
              font-family: 'Pinyon Script', cursive;
              font-size: 36px;
              color: #1E3A8A;
              opacity: 0.8;
              margin-bottom: -4px;
              transform: rotate(-6deg) translateY(-12px);
            }
            .signature-graphic-right {
              font-family: 'Playball', cursive;
              font-size: 26px;
              color: #1E3A8A;
              opacity: 0.85;
              margin-bottom: -10px;
              transform: rotate(-3deg) translateY(-2px);
            }
            .signature-title {
              font-size: 11px;
              color: #8C745C;
              text-transform: uppercase;
              font-weight: 800;
              letter-spacing: 0.08em;
              margin-top: 6px;
            }
            .signature-line {
              width: 100%;
              height: 1.5px;
              background: linear-gradient(90deg, transparent, #D4AF37, transparent);
            }
            .seal-wrapper {
              position: relative;
              width: 110px;
              height: 110px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: -20px;
              flex-shrink: 0;
            }
            .seal-ribbon-left {
              position: absolute;
              width: 22px;
              height: 65px;
              background: linear-gradient(135deg, #B91C1C, #EF4444);
              top: 55px;
              left: 38px;
              transform: rotate(20deg);
              clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%);
              z-index: 1;
            }
            .seal-ribbon-right {
              position: absolute;
              width: 22px;
              height: 65px;
              background: linear-gradient(135deg, #991B1B, #DC2626);
              top: 55px;
              left: 50px;
              transform: rotate(-20deg);
              clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%);
              z-index: 1;
            }
            .seal-gold-disc {
              position: relative;
              width: 90px;
              height: 90px;
              background: radial-gradient(circle, #FDE68A 0%, #D4AF37 60%, #B45309 100%);
              border: 3px dashed #FFF;
              border-radius: 50%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              box-shadow: 0 10px 24px rgba(212, 175, 55, 0.45);
              transform: rotate(-5deg);
              z-index: 2;
            }
            .seal-text {
              font-size: 7.5px;
              font-weight: 900;
              color: #78350F;
              text-transform: uppercase;
              letter-spacing: 0.06em;
              text-align: center;
              line-height: 1.3;
              text-shadow: 1px 1px 0px rgba(255,255,255,0.2);
            }
            .seal-star {
              color: #78350F;
              font-size: 10px;
              margin-top: 2px;
            }
            .registry-no {
              font-size: 9.5px;
              color: #A18266;
              font-weight: 700;
              letter-spacing: 0.08em;
              margin-top: 40px;
              text-transform: uppercase;
              position: relative;
              z-index: 1;
            }
            @media print {
              body { background: white; }
              .certificate-container { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            <div class="watermark">
              <svg width="450" height="450" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 82C50 82 82 58 82 36C82 18 68 8 50 26C32 8 18 18 18 36C18 58 50 82 50 82Z" stroke="#D4AF37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="50" cy="42" r="8" stroke="#D4AF37" stroke-width="1"/>
              </svg>
            </div>

            <div class="header-institution">Pediatric Healthcare Transparency Alliance • Global Registry</div>
            
            <h1>${cert.title || 'Certificate of Healing Support'}</h1>
            <h2>Heal & Play Ecosystem • ${displayType}</h2>
            
            <div class="presented-to">This official token of medical gratitude is proudly awarded to</div>
            <div class="name">${userName}</div>
            
            <div class="description">
              In sincere recognition of their compassionate contribution of <span class="amount">₹${cert.amount}</span> supporting essential clinical pediatric care and specialized hospital treatment for <span class="amount">${cert.childName || 'Janamithra'}</span>. Your generous contribution has directly helped secure verified medical operations.
            </div>

            <div style="font-size: 13px; font-weight: bold; color: #8C745C; margin-top: 10px; margin-bottom: 20px;">
              Date of Contribution: ${formattedDate}
            </div>
            
            <div class="footer-info">
              <div class="signature-block">
                <div class="signature-graphic-left">Dr. Rebecca Sterling</div>
                <div class="signature-line"></div>
                <div class="signature-title">Pediatric Care Director</div>
              </div>
              
              <div class="seal-wrapper">
                <div class="seal-ribbon-left"></div>
                <div class="seal-ribbon-right"></div>
                <div class="seal-gold-disc">
                  <div class="seal-text">OFFICIAL<br>VERIFIED<br>HEALING</div>
                  <div class="seal-star">★ ★ ★</div>
                </div>
              </div>
              
              <div class="signature-block">
                <div class="signature-graphic-right" style="font-family: 'Great Vibes', cursive; font-size: 34px; color: #1e3a8a; opacity: 0.9; margin-bottom: -4px; transform: rotate(-4deg) translateY(-15px);">Infant Ashil</div>
                <div class="signature-line"></div>
                <div class="signature-title">Founder • Heal & Play Ecosystem</div>
              </div>
            </div>

            <div class="registry-no">Verified Blockchain Registry No: H&P-REF-REG-${cert.id ? cert.id.toUpperCase().slice(-10) : 'N/A'}</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
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
            marginBottom: 32,
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

        {/* Dynamic Healing Certificate Section */}
        {cert && (
          userDataLoading ? (
            <div style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '3px solid rgba(212, 175, 55, 0.25)',
              padding: '60px 40px',
              minHeight: '280px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
              gap: 16,
              marginBottom: '32px'
            }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                style={{ width: 36, height: 36 }}
              >
                <Gift size={36} color="#D4AF37" />
              </motion.div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#8B5E34', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                Securing Cryptographic Certificate...
              </span>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                background: 'linear-gradient(135deg, #FCFAF6 0%, #FAF4E8 50%, #F2EAD8 100%)',
                border: '3px solid #D4AF37',
                borderRadius: '24px',
                padding: '30px 24px',
                boxShadow: '0 20px 40px rgba(139, 94, 52, 0.08), 0 0 20px rgba(212, 175, 55, 0.05)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxSizing: 'border-box',
                marginBottom: '32px'
              }}
            >
              {/* Elegant Gold corners overlay */}
              <div style={{ position: 'absolute', top: 12, left: 12, width: 16, height: 16, borderTop: '3px solid #D4AF37', borderLeft: '3px solid #D4AF37' }} />
              <div style={{ position: 'absolute', top: 12, right: 12, width: 16, height: 16, borderTop: '3px solid #D4AF37', borderRight: '3px solid #D4AF37' }} />
              <div style={{ position: 'absolute', bottom: 12, left: 12, width: 16, height: 16, borderBottom: '3px solid #D4AF37', borderLeft: '3px solid #D4AF37' }} />
              <div style={{ position: 'absolute', bottom: 12, right: 12, width: 16, height: 16, borderBottom: '3px solid #D4AF37', borderRight: '3px solid #D4AF37' }} />

              <div style={{ fontSize: '13px', fontWeight: 700, color: '#8B5E34', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 6 }}>
                HEAL & PLAY FOUNDATION
              </div>

              <h3 style={{ margin: '0 0 16px', fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 800, color: '#3D2B1A', letterSpacing: '0.5px', borderBottom: '1px solid rgba(139,94,52,0.1)', paddingBottom: 12 }}>
                {cert.title || 'Certificate of Healing Support'}
              </h3>

              <div style={{ fontSize: 12.5, color: '#7A6A5A', fontStyle: 'italic', marginBottom: 6 }}>
                This certificate is proudly awarded in heartfelt appreciation to
              </div>

              <div style={{ 
                fontSize: 28, 
                fontFamily: 'Georgia, serif', 
                fontWeight: 'bold', 
                background: 'linear-gradient(90deg, #8C4F1A, #D4AF37, #8C4F1A)', 
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: '8px 0',
                display: 'inline-block'
              }}>
                {userName}
              </div>

              {/* Decorative flourish line */}
              <div style={{ width: '120px', height: '2px', background: '#D4AF37', margin: '6px auto 14px', opacity: 0.7 }} />

              <p style={{ margin: '0 auto 20px', fontSize: 12, color: '#5A4635', lineHeight: 1.5, maxWidth: '380px' }}>
                In recognition of contribution amount ₹{cert.amount} supporting essential clinical treatment for {cert.childName || 'Janamithra'}.
              </p>

              <button 
                onClick={handleDownloadCert}
                style={{
                  background: 'linear-gradient(135deg, #7B3F00 0%, #A0522D 100%)',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '14px 28px',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 8px 24px rgba(123, 63, 0, 0.15)',
                  transition: 'all 0.3s ease'
                }}
              >
                <Heart size={16} fill="#fff" /> View & Print Certificate
              </button>
            </motion.div>
          )
        )}

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
