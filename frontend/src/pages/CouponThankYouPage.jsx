import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Check, Copy, ExternalLink, ArrowRight, Heart, Sparkles, Gift,
  CheckCircle2, Share2, Download, Shield, Award, Calendar, Landmark, Activity, Info
} from 'lucide-react'
import { COUPONS } from '../data/coupons'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useUserData } from '../hooks/useUserData'
import { staggerContainer, fadeUp, scaleIn } from '../animations/variants'
import confetti from 'canvas-confetti'
import TransparentBreakdown from '../components/TransparentBreakdown'

export default function CouponThankYouPage() {
  const { couponId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { userData, loading: userDataLoading } = useUserData()

  const [coupon, setCoupon] = useState(null)
  const [copied, setCopied] = useState(false)
  const [toastMsg, setToastMsg] = useState(null)
  const [cert, setCert] = useState(null)
  const [hoveredCertificate, setHoveredCertificate] = useState(false)

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

  // Fire confetti on mount for premium delight
  useEffect(() => {
    const fire = () =>
      confetti({
        particleCount: 160,
        spread: 110,
        origin: { y: 0.4 },
        colors: ['#8C4F1A', '#C8773A', '#D4AF37', '#FDFBF7'],
      })
    const t = setTimeout(fire, 350)
    return () => clearTimeout(t)
  }, [])

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

  const parseTitle = (fullTitle) => {
    if (!fullTitle) return { line1: 'Certificate of Coupon Unlock', line2: '' }
    const parts = fullTitle.split(/\s*[-–]\s*/)
    if (parts.length > 1) {
      return { line1: parts[0], line2: parts[1] }
    }
    return { line1: fullTitle, line2: '' }
  }

  const userName = cert?.supporterName || userData?.name || user?.displayName || localStorage.getItem('hp_user_name') || 'Verified Supporter'
  const userEmail = userData?.email || user?.email || localStorage.getItem('hp_user_email') || ''

  const formatDate = (timestamp) => {
    if (!timestamp) return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds ? timestamp.seconds * 1000 : timestamp)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Central luxury A4 landscape certificate drawer
  const drawCertificate = (canvas) => {
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    // 1. Solid luxury cream/tan radial paper gradient
    const grad = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, width * 0.8)
    grad.addColorStop(0, '#FCFAF6')
    grad.addColorStop(0.5, '#FAF4E8')
    grad.addColorStop(1, '#F2EAD8')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)

    // 2. Translucent Vector Heart Watermark in Center
    ctx.save()
    ctx.translate(width / 2, height / 2 - 40)
    ctx.strokeStyle = 'rgba(139, 94, 52, 0.035)'
    ctx.lineWidth = 6
    ctx.beginPath()
    for (let t = 0; t <= Math.PI * 2; t += 0.01) {
      const hx = 16 * Math.pow(Math.sin(t), 3) * 14
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * 14
      if (t === 0) ctx.moveTo(hx, hy)
      else ctx.lineTo(hx, hy)
    }
    ctx.closePath()
    ctx.stroke()
    ctx.restore()

    // 3. Double-layered Luxury Borders
    ctx.strokeStyle = '#3D2B1A'
    ctx.lineWidth = 6
    ctx.strokeRect(40, 40, width - 80, height - 80)

    ctx.strokeStyle = '#D4AF37'
    ctx.lineWidth = 2
    ctx.strokeRect(52, 52, width - 104, height - 104)

    ctx.strokeStyle = 'rgba(139, 94, 52, 0.4)'
    ctx.lineWidth = 1
    ctx.strokeRect(60, 60, width - 120, height - 120)

    // 4. Elegant Ornamental Corner Accents
    const drawCorners = (x, y, w, h) => {
      ctx.strokeStyle = '#D4AF37'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(x + 50, y); ctx.lineTo(x, y); ctx.lineTo(x, y + 50)
      ctx.moveTo(x + 60, y + 15); ctx.lineTo(x + 15, y + 15); ctx.lineTo(x + 15, y + 60)
      ctx.stroke()
      
      ctx.beginPath()
      ctx.moveTo(w - 50, y); ctx.lineTo(w, y); ctx.lineTo(w, y + 50)
      ctx.moveTo(w - 60, y + 15); ctx.lineTo(w - 15, y + 15); ctx.lineTo(w - 15, y + 60)
      ctx.stroke()
      
      ctx.beginPath()
      ctx.moveTo(x + 50, h); ctx.lineTo(x, h); ctx.lineTo(x, h - 50)
      ctx.moveTo(x + 60, h - 15); ctx.lineTo(x + 15, h - 15); ctx.lineTo(x + 15, h - 60)
      ctx.stroke()
      
      ctx.beginPath()
      ctx.moveTo(w - 50, h); ctx.lineTo(w, h); ctx.lineTo(w, h - 50)
      ctx.moveTo(w - 60, h - 15); ctx.lineTo(w - 15, h - 15); ctx.lineTo(w - 15, h - 60)
      ctx.stroke()
    }
    drawCorners(76, 76, width - 76, height - 76)

    // 5. Header Branding Section
    ctx.textAlign = 'center'
    ctx.fillStyle = '#3D2B1A'
    ctx.font = 'bold 36px Georgia, serif'
    ctx.fillText('Heal & Play Foundation', width / 2, 165)

    ctx.fillStyle = '#D4AF37'
    ctx.font = '800 12px "Outfit", sans-serif'
    ctx.fillText('VERIFIED PEDIATRIC HEALING INITIATIVE', width / 2, 202)

    // 6. Main Title
    const titleObj = parseTitle(cert?.title || 'Certificate of Coupon Unlock')
    ctx.save()
    ctx.shadowColor = 'rgba(61, 43, 26, 0.12)'
    ctx.shadowBlur = 4
    ctx.shadowOffsetY = 2
    ctx.fillStyle = '#3D2B1A'
    
    if (titleObj.line2) {
      ctx.font = 'bold 36px Georgia, serif'
      ctx.fillText(titleObj.line1, width / 2, 255)
      ctx.fillStyle = '#C8773A'
      ctx.font = 'italic bold 30px Georgia, serif'
      ctx.fillText(titleObj.line2, width / 2, 300)
    } else {
      ctx.font = '800 44px Georgia, serif'
      ctx.fillText(titleObj.line1, width / 2, 285)
    }
    ctx.restore()

    // 7. Presentation Subheading
    ctx.fillStyle = '#7A6A5A'
    ctx.font = 'italic 26px Georgia, serif'
    ctx.fillText('This certificate is proudly awarded in heartfelt appreciation to', width / 2, 395)

    // 8. Recipient Name
    const nameGrad = ctx.createLinearGradient(width / 2 - 300, 0, width / 2 + 300, 0)
    nameGrad.addColorStop(0, '#8C4F1A')
    nameGrad.addColorStop(0.5, '#D4AF37')
    nameGrad.addColorStop(1, '#8C4F1A')
    
    ctx.fillStyle = nameGrad
    ctx.font = 'bold 64px Georgia, serif'
    ctx.fillText(userName, width / 2, 490)

    // Golden underline flourish line
    ctx.strokeStyle = '#D4AF37'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(width / 2 - 280, 520)
    ctx.quadraticCurveTo(width / 2, 535, width / 2 + 280, 520)
    ctx.stroke()

    // 9. Body Text
    ctx.fillStyle = '#5A4635'
    ctx.font = '22px Georgia, serif'
    const displayChild = cert?.childName || 'Janamithra'
    const displayAmount = cert?.amount || coupon?.price || 10
    const bodyText = `This certificate is proudly awarded in heartfelt appreciation for supporting life-saving pediatric medical care through Heal & Play’s verified micro-contribution initiative. Your kindness has directly contributed toward critical treatment support for ${displayChild}.`
    
    const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
      const words = text.split(' ')
      let line = ''
      let currentY = y
      for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' '
        let metrics = context.measureText(testLine)
        let testWidth = metrics.width
        if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, currentY)
          line = words[n] + ' '
          currentY += lineHeight
        } else {
          line = testLine
        }
      }
      context.fillText(line, x, currentY)
    }
    
    wrapText(ctx, bodyText, width / 2, 605, 1100, 36)

    // 10. Bottom Left Column
    const dateY = 880
    ctx.strokeStyle = 'rgba(139, 94, 52, 0.25)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(180, dateY + 20)
    ctx.lineTo(460, dateY + 20)
    ctx.stroke()

    ctx.fillStyle = '#3D2B1A'
    ctx.font = 'bold 24px Georgia, serif'
    ctx.fillText(formatDate(cert?.createdAt), 320, dateY - 15)

    ctx.fillStyle = '#7A6A5A'
    ctx.font = 'italic 16px Georgia, serif'
    ctx.fillText('Date of Contribution', 320, dateY + 50)

    // 11. Bottom Center Column
    const sealX = width / 2
    const sealY = dateY + 15
    
    ctx.fillStyle = '#D4AF37'
    ctx.save()
    ctx.translate(sealX, sealY)
    ctx.beginPath()
    for (let i = 0; i < 30; i++) {
      ctx.rotate(Math.PI / 15)
      ctx.lineTo(0, i % 2 === 0 ? 56 : 46)
    }
    ctx.closePath()
    ctx.fill()
    ctx.restore()

    ctx.fillStyle = '#FDFBF7'
    ctx.beginPath()
    ctx.arc(sealX, sealY, 40, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = '#8B5E34'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(sealX, sealY, 34, 0, Math.PI * 2)
    ctx.stroke()

    ctx.fillStyle = '#D4AF37'
    ctx.font = '16px "Outfit", sans-serif'
    ctx.fillText('★', sealX, sealY - 8)
    ctx.fillStyle = '#8B5E34'
    ctx.font = '800 8px "Outfit", sans-serif'
    ctx.fillText('HEAL & PLAY', sealX, sealY + 8)
    ctx.fillText('VERIFIED', sealX, sealY + 18)

    // 12. Bottom Right Column
    const sigX = 1280
    ctx.strokeStyle = 'rgba(139, 94, 52, 0.25)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(1140, dateY + 20)
    ctx.lineTo(1420, dateY + 20)
    ctx.stroke()

    ctx.fillStyle = '#5C2D0E'
    ctx.font = '68px "Great Vibes", cursive'
    ctx.fillText('Infant Ashil', sigX, dateY - 15)

    ctx.fillStyle = '#3D2B1A'
    ctx.font = 'bold 20px Georgia, serif'
    ctx.fillText('INFANT ASHIL', sigX, dateY + 50)

    ctx.fillStyle = '#7A6A5A'
    ctx.font = 'italic 14px Georgia, serif'
    ctx.fillText('Authorized Signatory, Heal & Play', sigX, dateY + 75)

    // 13. Secure Cryptographic Verification Bar
    const blockchainRef = cert?.id ? `H&P-REF-REG-${cert.id.toUpperCase().slice(-10)}` : 'N/A'
    ctx.fillStyle = '#7A6A5A'
    ctx.font = '11px "Outfit", sans-serif'
    ctx.fillText(`SECURE ONLINE VERIFICATION ID: ${blockchainRef}  •  CASE DESK REFERENCE: Janamithra-Pediatric-Critical-Care`, width / 2, 1055)
  }

  // Trigger high-res canvas-based certificate image download
  const handleDownloadCertificate = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1600
    canvas.height = 1130
    drawCertificate(canvas)
    
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `HealAndPlay_Certificate_${userName.replace(/\s+/g, '_')}.png`
    link.href = url
    link.click()
  }

  // Trigger high-res print window layout
  const handlePrintPDF = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1600
    canvas.height = 1130
    drawCertificate(canvas)
    const imgData = canvas.toDataURL('image/png')
    
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert("Please allow popups to download your certificate.")
      return
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>Heal & Play - Certificate of Healing Support</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              background: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
            }
            img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }
            @page {
              size: A4 landscape;
              margin: 0;
            }
            @media print {
              img {
                width: 100vw;
                height: 100vh;
              }
            }
          </style>
        </head>
        <body>
          <img src="${imgData}" onload="window.print(); window.close();" />
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  // Native web share integration
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "I unlocked a coupon while supporting pediatric treatment! ❤️",
          text: `I just unlocked a reward on Heal & Play and directly supported verified healthcare funds. Join me to save lives!`,
          url: window.location.origin
        })
      } catch (err) {
        console.log('Share canceled', err)
      }
    } else {
      navigator.clipboard.writeText(coupon.code)
      setToastMsg('Coupon code copied to clipboard! 📋')
      setTimeout(() => setToastMsg(null), 2500)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FAF8F5', color: '#3D2B1A', fontFamily: 'Outfit, sans-serif', overflowX: 'hidden' }}>
      <Navbar />

      {/* Luxury ambient background glow orbs */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: -1 }}>
        <motion.div 
          animate={{ x: [0, 60, 0], y: [0, -50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', top: '2%', left: '15%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, #F6EFE6 0%, rgba(246,239,230,0) 70%)', filter: 'blur(70px)', opacity: 0.8 }}
        />
        <motion.div 
          animate={{ x: [0, -60, 0], y: [0, 50, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', top: '30%', right: '10%', width: '580px', height: '580px', borderRadius: '50%', background: 'radial-gradient(circle, #ECDDCB 0%, rgba(236,221,203,0) 70%)', filter: 'blur(80px)', opacity: 0.7 }}
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'absolute', bottom: '5%', left: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, #E6D0BA 0%, rgba(230,208,186,0) 70%)', filter: 'blur(90px)', opacity: 0.5 }}
        />
      </div>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 24px 80px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {/* CINEMATIC HERO CELEBRATION MOMENT */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{
            maxWidth: '850px',
            width: '100%',
            textAlign: 'center',
            marginBottom: 44,
            padding: '0 16px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Animated Gold/Green Glowing Rings Badge */}
          <div style={{ position: 'relative', width: 96, height: 96, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '2px dashed rgba(16, 185, 129, 0.4)',
                boxShadow: '0 0 24px rgba(16, 185, 129, 0.2)'
              }}
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                inset: -8,
                borderRadius: '50%',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                background: 'rgba(212, 175, 55, 0.02)'
              }}
            />
            <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #ECFDF5, #F0FDF4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #A7F3D0', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15)' }}>
              <CheckCircle2 size={40} color="#10B981" />
            </div>
          </div>

          {/* Upper Label */}
          <motion.div
            variants={fadeUp}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(140, 79, 26, 0.08)',
              padding: '6px 14px',
              borderRadius: '20px',
              marginBottom: 16,
              border: '1px solid rgba(140, 79, 26, 0.1)'
            }}
          >
            <Award size={13} color="#8C4F1A" />
            <span style={{ fontSize: 10.5, fontWeight: 900, color: '#8C4F1A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Verified Healing Reward Unlock
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeUp}
            className="premium-title-lg"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#3D2B1A', margin: '0 0 16px', lineHeight: 1.2 }}
          >
            Coupon Successfully <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>Unlocked 🎉</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            style={{
              fontSize: 'clamp(15px, 2.2vw, 18px)',
              color: '#7A6A5A',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 0 28px',
              fontWeight: 500
            }}
          >
            Thank you for supporting healing journeys ❤️. Your contribution of <span style={{ color: '#8C4F1A', fontWeight: 800 }}>₹{coupon.price}</span> directly helped support verified pediatric treatment campaigns.
          </motion.p>

          {/* Stats Pills */}
          <motion.div
            variants={fadeUp}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 12,
              marginBottom: 20
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(212, 175, 55, 0.25)', padding: '10px 18px', borderRadius: '99px', boxShadow: '0 4px 12px rgba(139, 94, 52, 0.03)' }}>
              <Activity size={14} color="#10B981" />
              <span style={{ fontSize: 13, fontWeight: 800, color: '#3D2B1A', fontFamily: 'Outfit' }}>₹{coupon.price} Medical Contribution Active</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(212, 175, 55, 0.25)', padding: '10px 18px', borderRadius: '99px', boxShadow: '0 4px 12px rgba(139, 94, 52, 0.03)' }}>
              <Shield size={14} color="#8C4F1A" />
              <span style={{ fontSize: 13, fontWeight: 800, color: '#3D2B1A', fontFamily: 'Outfit' }}>Verified Healthcare Route</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(212, 175, 55, 0.25)', padding: '10px 18px', borderRadius: '99px', boxShadow: '0 4px 12px rgba(139, 94, 52, 0.03)' }}>
              <Award size={14} color="#D4AF37" />
              <span style={{ fontSize: 13, fontWeight: 800, color: '#3D2B1A', fontFamily: 'Outfit' }}>Healing Certificate Active</span>
            </div>
          </motion.div>

          {/* Golden fading elegant divider line */}
          <div style={{
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, rgba(212, 175, 55, 0) 0%, rgba(212, 175, 55, 0.35) 50%, rgba(212, 175, 55, 0) 100%)',
            marginTop: 24,
            marginBottom: 16
          }} />
        </motion.div>

        {/* Main Grid: Editorial Asymmetric Layout with staggered columns */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px', 
          maxWidth: '1150px', 
          width: '100%', 
          alignItems: 'start',
          boxSizing: 'border-box',
          marginTop: 20
        }}>
          
          {/* Left Column: Reward Card & Impact Details */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '30px'
            }}
          >
            {/* LARGE PREMIUM REWARD CARD */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '32px',
                border: '1px solid rgba(139, 94, 52, 0.18)',
                boxShadow: '0 25px 60px rgba(139, 94, 52, 0.08), 0 0 25px rgba(212, 175, 55, 0.03)',
                position: 'relative',
                overflow: 'hidden',
                boxSizing: 'border-box'
              }}
            >
              {/* Brand Banner Image */}
              <div style={{ height: '180px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={coupon.bannerUrl || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=400&fit=crop&q=80"} 
                  alt={coupon.brand} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.5) 100%)' }} />
              </div>

              {/* Float Content Layout */}
              <div style={{ padding: '36px', pt: 0, position: 'relative', textAlign: 'left' }}>
                
                {/* Floating Brand Logo overlapping banner */}
                <div style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '3px solid #EBD5C2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'absolute',
                  top: '-38px',
                  left: '36px',
                  boxShadow: '0 8px 24px rgba(139, 94, 52, 0.15)'
                }}>
                  <img 
                    src={coupon.logoUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150&h=150&fit=crop&q=80"} 
                    alt={`${coupon.brand} logo`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ height: '48px' }} /> {/* Spacing spacer for floating logo */}

                {/* Badges */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C4F1A', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(140, 79, 26, 0.08)', padding: '5px 12px', borderRadius: '8px' }}>
                    {coupon.brand}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: coupon.accentColor || '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', background: `${coupon.accentColor || '#D4AF37'}12`, padding: '5px 12px', borderRadius: '8px' }}>
                    {coupon.category}
                  </span>
                </div>

                {/* Title & Offer */}
                <h3 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 900, color: '#3D2B1A', fontFamily: 'Outfit' }}>
                  {coupon.title}
                </h3>
                <p style={{ margin: '0 0 24px', fontSize: '16px', color: '#5C4C3C', fontWeight: 700, lineHeight: 1.4 }}>
                  {coupon.offer}
                </p>

                {/* Revealed Coupon Code Box */}
                <div style={{ 
                  background: '#FCFAF6', 
                  borderRadius: '20px', 
                  padding: '24px', 
                  margin: '0 0 24px', 
                  border: '1.5px dashed #EBD5C2',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12
                }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C745C', letterSpacing: '0.08em', textTransform: 'uppercase' }}>PROMO CODE REVEALED</span>
                  <span style={{ fontSize: '28px', fontWeight: 900, color: '#3D2B1A', letterSpacing: '3px', fontFamily: 'monospace' }}>{coupon.code}</span>
                </div>

                {/* Action Row */}
                <div style={{ display: 'flex', gap: 16, width: '100%' }}>
                  <button 
                    onClick={handleCopy}
                    style={{ 
                      flex: 1,
                      padding: '16px', 
                      background: '#FAF6F0', 
                      border: '1.5px solid #C8773A', 
                      borderRadius: '16px', 
                      color: '#C8773A', 
                      fontWeight: 800, 
                      fontSize: '15px', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      transition: 'all 0.2s',
                      fontFamily: 'Outfit'
                    }}
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? 'Copied!' : 'Copy Code'}
                  </button>
                  <a 
                    href={coupon.redeemUrl || "https://healplay.example.com/redeem"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      flex: 1,
                      padding: '16px', 
                      background: 'linear-gradient(135deg, #8C4F1A, #C8773A)', 
                      border: 'none', 
                      borderRadius: '16px', 
                      color: '#FFFFFF', 
                      fontWeight: 800, 
                      fontSize: '15px', 
                      cursor: 'pointer',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: '0 8px 24px rgba(140, 79, 26, 0.18)',
                      fontFamily: 'Outfit'
                    }}
                  >
                    Redeem Now <ExternalLink size={16} />
                  </a>
                </div>

                {/* Expiry / Unlock details footer line */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  borderTop: '1px solid rgba(235, 221, 206, 0.6)', 
                  marginTop: '28px', 
                  paddingTop: '20px',
                  fontSize: '13px',
                  color: '#7A6A5A',
                  fontWeight: 600
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={14} color="#8C4F1A" />
                    <span>Validity: 30 days</span>
                  </div>
                  <div>
                    <span>Amount: ₹{coupon.price} Contribution</span>
                  </div>
                </div>

              </div>
            </div>

            {/* IMPACT SECTION */}
            <div
              style={{
                background: 'rgba(255, 254, 252, 0.85)',
                backdropFilter: 'blur(8px)',
                borderRadius: '32px',
                padding: '36px',
                boxShadow: '0 20px 50px rgba(139, 94, 52, 0.04), 0 1px 0 rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(139, 94, 52, 0.15)',
                boxSizing: 'border-box'
              }}
            >
              <h4 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 800, color: '#8C4F1A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Your Unlock Contribution Impact
              </h4>
              <p style={{ margin: '0 0 24px', fontSize: '13.5px', color: '#7A6A5A', lineHeight: 1.5, fontWeight: 500 }}>
                100% of your coupon unlock amount has been directly securely settled to child healthcare systems.
              </p>

              {/* Grid of 4 mini stats cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                
                {/* Stat 1 */}
                <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid rgba(139, 94, 52, 0.08)', textAlign: 'left' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justify: 'center', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                    <Activity size={14} color="#10B981" />
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#3D2B1A', marginBottom: '4px' }}>100% Routed</div>
                  <div style={{ fontSize: '10.5px', color: '#7A6A5A', lineHeight: 1.3 }}>Direct to patient clinical care</div>
                </div>

                {/* Stat 2 */}
                <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid rgba(139, 94, 52, 0.08)', textAlign: 'left' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justify: 'center', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                    <Heart size={14} color="#EF4444" fill="#EF4444" />
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#3D2B1A', marginBottom: '4px' }}>Patient Linked</div>
                  <div style={{ fontSize: '10.5px', color: '#7A6A5A', lineHeight: 1.3 }}>Assisting critical surgeries</div>
                </div>

                {/* Stat 3 */}
                <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid rgba(139, 94, 52, 0.08)', textAlign: 'left' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#FEF9C3', display: 'flex', alignItems: 'center', justify: 'center', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                    <Award size={14} color="#CA8A04" />
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#3D2B1A', marginBottom: '4px' }}>Secure Seal</div>
                  <div style={{ fontSize: '10.5px', color: '#7A6A5A', lineHeight: 1.3 }}>Cryptographically signed token</div>
                </div>

                {/* Stat 4 */}
                <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid rgba(139, 94, 52, 0.08)', textAlign: 'left' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justify: 'center', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                    <Shield size={14} color="#3B82F6" />
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#3D2B1A', marginBottom: '4px' }}>Fully Auditable</div>
                  <div style={{ fontSize: '10.5px', color: '#7A6A5A', lineHeight: 1.3 }}>All receipts trace in public registry</div>
                </div>

              </div>
            </div>

          </motion.div>

          {/* Right Column: Floating Certificate & PDF Actions */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            {userDataLoading ? (
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                border: '3px solid rgba(212, 175, 55, 0.25)',
                padding: '60px 40px',
                minHeight: '420px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                gap: 16
              }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  style={{ width: 36, height: 36 }}
                >
                  <Award size={36} color="#D4AF37" />
                </motion.div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#8B5E34', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  Securing Cryptographic Certificate...
                </span>
              </div>
            ) : (
              cert && (
                <>
                  {/* Elevated Floating Certificate Container */}
                  <motion.div
                    onMouseEnter={() => setHoveredCertificate(true)}
                    onMouseLeave={() => setHoveredCertificate(false)}
                    style={{
                      background: 'linear-gradient(135deg, #FCFAF6 0%, #FAF4E8 50%, #F2EAD8 100%)',
                      border: '3px solid #D4AF37',
                      borderRadius: '24px',
                      padding: '30px 24px',
                      boxShadow: hoveredCertificate 
                        ? '0 35px 80px rgba(139, 94, 52, 0.18), 0 0 40px rgba(212, 175, 55, 0.15)'
                        : '0 25px 60px rgba(139, 94, 52, 0.12), 0 0 25px rgba(212, 175, 55, 0.05)',
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'box-shadow 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                      boxSizing: 'border-box'
                    }}
                  >
                    {/* Elegant Gold corners overlay */}
                    <div style={{ position: 'absolute', top: 12, left: 12, width: 16, height: 16, borderTop: '3px solid #D4AF37', borderLeft: '3px solid #D4AF37' }} />
                    <div style={{ position: 'absolute', top: 12, right: 12, width: 16, height: 16, borderTop: '3px solid #D4AF37', borderRight: '3px solid #D4AF37' }} />
                    <div style={{ position: 'absolute', bottom: 12, left: 12, width: 16, height: 16, borderBottom: '3px solid #D4AF37', borderLeft: '3px solid #D4AF37' }} />
                    <div style={{ position: 'absolute', bottom: 12, right: 12, width: 16, height: 16, borderBottom: '3px solid #D4AF37', borderRight: '3px solid #D4AF37' }} />

                    {/* Sweeping shine glass animation effect */}
                    <AnimatePresence>
                      {hoveredCertificate && (
                        <motion.div
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.2, ease: 'easeInOut' }}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 100%)',
                            zIndex: 2,
                            pointerEvents: 'none'
                          }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Translucent Vector Heart Watermark */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 140,
                      height: 140,
                      opacity: 0.03,
                      pointerEvents: 'none',
                      background: 'radial-gradient(circle, #8B5E34 20%, transparent 80%)'
                    }} />

                    {/* Certificate Content */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(139, 94, 52, 0.06)', padding: '6px 14px', borderRadius: '20px', marginBottom: 18 }}>
                      <Award size={14} color="#8B5E34" />
                      <span style={{ fontSize: 10.5, fontWeight: 800, color: '#8B5E34', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Personalized Honor</span>
                    </div>

                    <div style={{ fontSize: 13, fontWeight: 700, color: '#8B5E34', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 6 }}>
                      HEAL & PLAY FOUNDATION
                    </div>

                    <div style={{ borderBottom: '1px solid rgba(139,94,52,0.1)', paddingBottom: 12, marginBottom: 16 }}>
                      <h3 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 800, color: '#3D2B1A', letterSpacing: '0.5px' }}>
                        {parseTitle(cert.title || 'Certificate of Coupon Unlock').line1}
                      </h3>
                      {parseTitle(cert.title).line2 && (
                        <h4 style={{ margin: '4px 0 0', fontFamily: 'Georgia, serif', fontSize: '15px', fontWeight: 700, color: '#C8773A', fontStyle: 'italic' }}>
                          {parseTitle(cert.title).line2}
                        </h4>
                      )}
                    </div>

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

                    <p style={{ margin: '0 auto 20px', fontSize: 12, color: '#5A4635', lineHeight: 1.5, maxWidth: '280px' }}>
                      for contribution support toward verified lifesaving pediatric treatment for {cert.childName || 'Janamithra'}.
                    </p>

                    {/* Embossed seal & signature preview */}
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: 22 }}>
                      <div>
                        <div style={{ fontSize: 10, color: '#7A6A5A', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Contribution</div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: '#8C4F1A', fontFamily: 'Outfit' }}>₹{cert.amount}</div>
                      </div>

                      {/* Embossed Gold Seal */}
                      <div style={{
                        width: 58,
                        height: 58,
                        background: 'linear-gradient(135deg, #D4AF37 0%, #C59B27 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(139, 94, 52, 0.2), inset 0 2px 4px rgba(255,255,255,0.4)',
                        position: 'relative'
                      }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Sparkles size={16} color="#FFF" />
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: 10, color: '#7A6A5A', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Signature</div>
                        <div style={{ fontFamily: 'Great Vibes', fontSize: 20, color: '#5C2D0E', fontWeight: 'bold', transform: 'rotate(-4deg)' }}>Infant Ashil</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Actions wrapper */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', boxSizing: 'border-box' }}>
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDownloadCertificate}
                      style={{
                        background: 'linear-gradient(135deg, #7B3F00 0%, #A0522D 100%)',
                        color: '#FFFDF9',
                        border: 'none',
                        padding: '16px 28px',
                        borderRadius: '99px',
                        fontSize: 14.5,
                        fontWeight: 800,
                        cursor: 'pointer',
                        fontFamily: 'Outfit',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        boxShadow: '0 8px 24px rgba(123, 63, 0, 0.22), 0 0 0 1px rgba(123, 63, 0, 0.15)',
                        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
                      }}
                    >
                      <Download size={16} style={{ transition: 'transform 0.2s ease' }} /> Download High-Res Certificate
                    </motion.button>

                    {/* Print and Share row */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleShare}
                        style={{ 
                          flex: 1, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: 8, 
                          padding: '14px', 
                          background: '#FFFFFF', 
                          border: '1px solid rgba(139, 94, 52, 0.25)', 
                          borderRadius: '99px', 
                          fontSize: 14, 
                          fontWeight: 700, 
                          cursor: 'pointer', 
                          color: '#7A6A5A',
                          fontFamily: 'Outfit',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 12px rgba(139, 94, 52, 0.02)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(139, 94, 52, 0.04)'
                          e.currentTarget.style.color = '#3D2B1A'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#FFFFFF'
                          e.currentTarget.style.color = '#7A6A5A'
                        }}
                      >
                        <Share2 size={15} /> Share Honor
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePrintPDF}
                        style={{ 
                          flex: 1, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: 8, 
                          padding: '14px', 
                          background: '#FFFFFF', 
                          border: '1px solid rgba(139, 94, 52, 0.25)', 
                          borderRadius: '99px', 
                          fontSize: 14, 
                          fontWeight: 700, 
                          cursor: 'pointer', 
                          color: '#7A6A5A',
                          fontFamily: 'Outfit',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 12px rgba(139, 94, 52, 0.02)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(139, 94, 52, 0.04)'
                          e.currentTarget.style.color = '#3D2B1A'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#FFFFFF'
                          e.currentTarget.style.color = '#7A6A5A'
                        }}
                      >
                        <Download size={15} /> Download PDF
                      </motion.button>
                    </div>
                  </div>
                </>
              )
            )}
          </motion.div>

        </div>

        {/* Navigation flows */}
        <div style={{ maxWidth: '480px', width: '100%', marginTop: 50, textAlign: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate('/main')}
            style={{ 
              width: '100%', 
              padding: '16px', 
              fontSize: 15.5, 
              fontFamily: 'Outfit',
              fontWeight: 800,
              border: 'none',
              background: 'linear-gradient(135deg, #8C4F1A, #C8773A)',
              color: '#FFFFFF',
              borderRadius: '99px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 8px 24px rgba(140, 79, 26, 0.2)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(140, 79, 26, 0.3)'
              e.currentTarget.style.filter = 'brightness(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(140, 79, 26, 0.2)'
              e.currentTarget.style.filter = 'none'
            }}
          >
            Continue Playing & Supporting <ArrowRight size={16} />
          </motion.button>

          <motion.button
            onClick={() => navigate('/home')}
            style={{ marginTop: 18, background: 'none', border: 'none', fontSize: 13.5, color: '#7A6A5A', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600, display: 'inline-block' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#8C4F1A'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#7A6A5A'}
          >
            Back to Home Dashboard
          </motion.button>
        </div>

        <p style={{ marginTop: 50, fontSize: 12.5, color: '#7A6A5A', textAlign: 'center', fontWeight: 500, lineHeight: 1.6 }}>
          Together, we can save more lives. 🤎<br />
          © 2026 Heal & Play Foundation
        </p>

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
