import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ArrowRight, Share2, Download, Heart, Shield, Award, Calendar, Landmark, Copy, Check, Sparkles, Activity, Info } from 'lucide-react'
import { useDonation } from '../context/DonationContext'
import { staggerContainer, fadeUp, scaleIn } from '../animations/variants'
import confetti from 'canvas-confetti'
import TransparentBreakdown from '../components/TransparentBreakdown'

export default function ThankYouPage() {
  const navigate = useNavigate()
  const { selectedChild, donationAmount, transactionId } = useDonation()
  const [copied, setCopied] = useState(false)
  const [hoveredCertificate, setHoveredCertificate] = useState(false)
  const [showInfoTooltip, setShowInfoTooltip] = useState(false)

  // Fetch verified user details from localStorage
  const userName = localStorage.getItem('hp_user_name') || 'Generous Supporter'
  const userEmail = localStorage.getItem('hp_user_email') || ''

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

  const txId = transactionId || 'HP' + Date.now().toString().slice(-8)
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

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
    // Outer bold border
    ctx.strokeStyle = '#3D2B1A'
    ctx.lineWidth = 6
    ctx.strokeRect(40, 40, width - 80, height - 80)

    // Middle thin gold border
    ctx.strokeStyle = '#D4AF37'
    ctx.lineWidth = 2
    ctx.strokeRect(52, 52, width - 104, height - 104)

    // Inner thin brown border
    ctx.strokeStyle = 'rgba(139, 94, 52, 0.4)'
    ctx.lineWidth = 1
    ctx.strokeRect(60, 60, width - 120, height - 120)

    // 4. Elegant Ornamental Corner Accents (Gold Leaf Style lines)
    const drawCorners = (x, y, w, h) => {
      ctx.strokeStyle = '#D4AF37'
      ctx.lineWidth = 3
      // Top Left Corner Accent
      ctx.beginPath()
      ctx.moveTo(x + 50, y); ctx.lineTo(x, y); ctx.lineTo(x, y + 50)
      ctx.moveTo(x + 60, y + 15); ctx.lineTo(x + 15, y + 15); ctx.lineTo(x + 15, y + 60)
      ctx.stroke()
      
      // Top Right Corner Accent
      ctx.beginPath()
      ctx.moveTo(w - 50, y); ctx.lineTo(w, y); ctx.lineTo(w, y + 50)
      ctx.moveTo(w - 60, y + 15); ctx.lineTo(w - 15, y + 15); ctx.lineTo(w - 15, y + 60)
      ctx.stroke()
      
      // Bottom Left Corner Accent
      ctx.beginPath()
      ctx.moveTo(x + 50, h); ctx.lineTo(x, h); ctx.lineTo(x, h - 50)
      ctx.moveTo(x + 60, h - 15); ctx.lineTo(x + 15, h - 15); ctx.lineTo(x + 15, h - 60)
      ctx.stroke()
      
      // Bottom Right Corner Accent
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

    // 6. Main Title with Soft Embossed Shadow
    ctx.save()
    ctx.shadowColor = 'rgba(61, 43, 26, 0.12)'
    ctx.shadowBlur = 4
    ctx.shadowOffsetY = 2
    ctx.fillStyle = '#3D2B1A'
    ctx.font = '800 50px Georgia, serif'
    ctx.fillText('CERTIFICATE OF HEALING SUPPORT', width / 2, 285)
    ctx.restore()

    // 7. Presentation Subheading
    ctx.fillStyle = '#7A6A5A'
    ctx.font = 'italic 26px Georgia, serif'
    ctx.fillText('This certificate is proudly awarded in heartfelt appreciation to', width / 2, 395)

    // 8. Recipient Name with Luxury Gold/Brown Gradient and Underline flourish
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

    // 9. Premium Rewritten Body Text (wrapped beautifully)
    ctx.fillStyle = '#5A4635'
    ctx.font = '22px Georgia, serif'
    const bodyText = "This certificate is proudly awarded in heartfelt appreciation for supporting life-saving pediatric medical care through Heal & Play’s verified micro-contribution initiative. Your kindness has directly contributed toward critical treatment support for Baby Aarav."
    
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

    // 10. Bottom Left Column (Contribution Date)
    const dateY = 880
    ctx.strokeStyle = 'rgba(139, 94, 52, 0.25)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(180, dateY + 20)
    ctx.lineTo(460, dateY + 20)
    ctx.stroke()

    ctx.fillStyle = '#3D2B1A'
    ctx.font = 'bold 24px Georgia, serif'
    ctx.fillText(date, 320, dateY - 15)

    ctx.fillStyle = '#7A6A5A'
    ctx.font = 'italic 16px Georgia, serif'
    ctx.fillText('Date of Contribution', 320, dateY + 50)

    // 11. Bottom Center Column (Luxury Embossed Official Seal)
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

    // 12. Bottom Right Column (Digital Authorized Signature)
    const sigX = 1280
    ctx.strokeStyle = 'rgba(139, 94, 52, 0.25)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(1140, dateY + 20)
    ctx.lineTo(1420, dateY + 20)
    ctx.stroke()

    // Cursive Calligraphy Signature for Infant Ashil
    ctx.fillStyle = '#5C2D0E'
    ctx.font = '68px "Great Vibes", cursive'
    ctx.fillText('Infant Ashil', sigX, dateY - 15)

    ctx.fillStyle = '#3D2B1A'
    ctx.font = 'bold 20px Georgia, serif'
    ctx.fillText('INFANT ASHIL', sigX, dateY + 50)

    ctx.fillStyle = '#7A6A5A'
    ctx.font = 'italic 14px Georgia, serif'
    ctx.fillText('Authorized Signatory, Heal & Play', sigX, dateY + 75)

    // 13. Secure Cryptographic Verification Bar at Very Bottom
    ctx.fillStyle = '#7A6A5A'
    ctx.font = '11px "Outfit", sans-serif'
    ctx.fillText(`SECURE ONLINE VERIFICATION ID: ${txId}  •  CASE DESK REFERENCE: Aarav-Pediatric-Critical-Care`, width / 2, 1055)
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

  // Copy transaction ID to clipboard
  const handleCopyTx = () => {
    navigator.clipboard.writeText(txId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Native web share integration
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "I supported Baby Aarav's critical treatment! ❤️",
          text: `I just unlocked interactive play and directly supported Baby Aarav's hospital fund. Join me in playing games to save lives!`,
          url: window.location.origin
        })
      } catch (err) {
        console.log('Share canceled', err)
      }
    } else {
      handleCopyTx()
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'transparent', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '40px 24px 60px', 
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      
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

      {/* Brand Header with Luxury Spacing */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 50 }}>
        <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #7B3F00, #A0522D)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(123, 63, 0, 0.2)' }}>
          <Heart size={20} color="#fff" fill="#fff" />
        </div>
        <div>
          <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 20, color: '#3D2B1A', letterSpacing: '-0.5px' }}>Heal & Play</div>
          <div style={{ fontSize: 10.5, color: '#A0522D', fontWeight: 800, letterSpacing: '0.08em' }}>VERIFIED FOUNDATION</div>
        </div>
      </div>

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

        {/* Small Premium Upper Label */}
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
            Verified Healing Contribution
          </span>
        </motion.div>

        {/* Cinematic Main Title */}
        <motion.h1
          variants={fadeUp}
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(36px, 5.5vw, 54px)',
            fontWeight: 'bold',
            lineHeight: 1.1,
            color: '#3D2B1A',
            letterSpacing: '-1.5px',
            margin: '0 0 16px',
            background: 'linear-gradient(180deg, #3D2B1A 0%, #5A3A1A 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          You Just Helped Save a Life ❤️
        </motion.h1>

        {/* Emotional Subheading */}
        <motion.p
          variants={fadeUp}
          style={{
            fontSize: 'clamp(16px, 2.2vw, 19px)',
            color: '#7A6A5A',
            lineHeight: 1.6,
            maxWidth: '680px',
            margin: '0 0 28px',
            fontWeight: 500
          }}
        >
          Your contribution has been securely routed toward verified pediatric treatment support. Thank you, <span style={{ color: '#8C4F1A', fontWeight: 700 }}>{userName}</span>, for becoming a cornerstone in a child's healing journey.
        </motion.p>

        {/* Horizontal Mini Stats Pills */}
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
            <span style={{ fontSize: 13, fontWeight: 800, color: '#3D2B1A', fontFamily: 'Outfit' }}>₹{donationAmount || 10} Medical Contribution Activated</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(212, 175, 55, 0.25)', padding: '10px 18px', borderRadius: '99px', boxShadow: '0 4px 12px rgba(139, 94, 52, 0.03)' }}>
            <Shield size={14} color="#8C4F1A" />
            <span style={{ fontSize: 13, fontWeight: 800, color: '#3D2B1A', fontFamily: 'Outfit' }}>Verified Hospital Route</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(212, 175, 55, 0.25)', padding: '10px 18px', borderRadius: '99px', boxShadow: '0 4px 12px rgba(139, 94, 52, 0.03)' }}>
            <Award size={14} color="#D4AF37" />
            <span style={{ fontSize: 13, fontWeight: 800, color: '#3D2B1A', fontFamily: 'Outfit' }}>Healing Certificate Active</span>
          </div>
        </motion.div>

        {/* Small Transparency Note */}
        <motion.p
          variants={fadeUp}
          style={{ fontSize: 12.5, color: '#7A6A5A', fontStyle: 'italic', margin: '0 auto 20px', maxWidth: '580px', lineHeight: 1.5, fontWeight: 600 }}
        >
          Payment gateway charges are securely handled through Razorpay infrastructure. Heal & Play does not deduct platform commissions from treatment contributions.
        </motion.p>

        {/* Dynamic Transparent Contribution Breakdown */}
        <div style={{ maxWidth: '380px', width: '100%', margin: '0 auto 24px' }}>
          <TransparentBreakdown amount={donationAmount || 10} />
        </div>

        {/* Golden fading elegant divider line */}
        <div style={{
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, rgba(212, 175, 55, 0) 0%, rgba(212, 175, 55, 0.35) 50%, rgba(212, 175, 55, 0) 100%)',
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
        
        {/* Left Column (Slightly Staggered Lower for visual flow) */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          style={{ 
            background: 'rgba(255, 254, 252, 0.85)', 
            backdropFilter: 'blur(8px)',
            borderRadius: 32, 
            padding: '40px', 
            boxShadow: '0 20px 50px rgba(139, 94, 52, 0.06), 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 0 20px rgba(123, 63, 0, 0.02)', 
            border: '1px solid rgba(139, 94, 52, 0.18)',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
            transform: 'translateY(18px)' // staggered height offset
          }}
        >
          {/* Stacked Luxury Ledger Block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h4 style={{ margin: 0, fontSize: 12.5, fontWeight: 800, color: '#8C4F1A', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid rgba(139, 94, 52, 0.1)', paddingBottom: '10px' }}>
              Support Account Ledger
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid rgba(139, 94, 52, 0.06)', paddingBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: 11.5, color: '#7A6A5A', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Recipient Case</span>
                  <h5 style={{ margin: '4px 0 0', fontSize: 16, color: '#3D2B1A', fontWeight: 800 }}>
                    {selectedChild?.name || 'Baby Aarav'}
                  </h5>
                </div>
                <span style={{ fontSize: 12.5, color: '#166534', background: '#DCFCE7', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>Verified Patient</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid rgba(139, 94, 52, 0.06)', paddingBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: 11.5, color: '#7A6A5A', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Certificate Holder</span>
                  <h5 style={{ margin: '4px 0 0', fontSize: 16, color: '#3D2B1A', fontWeight: 800 }}>{userName}</h5>
                </div>
                <span style={{ fontSize: 13, color: '#7A6A5A', fontWeight: 500 }}>{userEmail || 'Direct Contributor'}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid rgba(139, 94, 52, 0.06)', paddingBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: 11.5, color: '#7A6A5A', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Settlement Channel</span>
                  <h5 style={{ margin: '4px 0 0', fontSize: 15, color: '#3D2B1A', fontWeight: 800 }}>Direct Healthcare Settlement</h5>
                </div>
                <span style={{ fontSize: 13, color: '#7A6A5A', fontWeight: 600 }}>Secure Settlement Verified</span>
              </div>

              {/* Secure Transaction Chip (Smart Card Style) */}
              <div style={{
                background: 'linear-gradient(135deg, #8B5E34 0%, #3D2B1A 100%)',
                padding: '16px 20px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                boxShadow: '0 6px 20px rgba(61, 43, 26, 0.15)',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(212, 175, 55, 0.25)'
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.08, background: 'radial-gradient(circle, #fff 10%, transparent 11%)', backgroundSize: '8px 8px' }} />
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, zIndex: 1 }}>
                  <div style={{ width: 28, height: 20, background: 'linear-gradient(135deg, #F3ECE0, #D4AF37)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.4)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)' }} />
                  <div>
                    <span style={{ fontSize: 9.5, fontWeight: 800, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>Secure Ledger Entry</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#FFF', fontFamily: 'monospace' }}>{txId}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCopyTx} 
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.12)', 
                    border: 'none', 
                    borderRadius: '10px', 
                    padding: '8px', 
                    color: '#fff', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    zIndex: 2,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                >
                  {copied ? <Check size={14} color="#34D399" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>



        </motion.div>

        {/* Right Column: Floating Luxury Certificate Showcase */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            transform: 'translateY(-12px)' // staggered height offset
          }}
        >
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

              {/* Certificate content items */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(139, 94, 52, 0.06)', padding: '6px 14px', borderRadius: '20px', marginBottom: 18 }}>
                <Award size={14} color="#8B5E34" />
                <span style={{ fontSize: 10.5, fontWeight: 800, color: '#8B5E34', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Personalized Honor</span>
              </div>

              <div style={{ fontSize: 13, fontWeight: 700, color: '#8B5E34', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 6 }}>
                HEAL & PLAY FOUNDATION
              </div>

              <h3 style={{ margin: '0 0 16px', fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 800, color: '#3D2B1A', letterSpacing: '0.5px', borderBottom: '1px solid rgba(139,94,52,0.1)', paddingBottom: 12 }}>
                Certificate of Healing Support
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

              <p style={{ margin: '0 auto 20px', fontSize: 12, color: '#5A4635', lineHeight: 1.5, maxWidth: '280px' }}>
                for micro-contribution support toward verified lifesaving treatment for Baby Aarav.
              </p>

              {/* Embossed seal & signature preview */}
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: 22 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#7A6A5A', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Contribution</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#8C4F1A', fontFamily: 'Outfit' }}>₹{donationAmount || 10}</div>
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

          {/* Action buttons with premium shadow */}
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
        </motion.div>

      </div>

      {/* Main navigation flow block with luxury spacing */}
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
    </div>
  )
}
