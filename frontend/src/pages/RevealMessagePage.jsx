import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, Sparkles, User, Award, Shield, 
  Download, ArrowRight, ArrowLeft, Gamepad2, Info, CheckCircle2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useUserData } from '../hooks/useUserData'
import { usePayment } from '../context/PaymentContext'
import { generateHealingCertificate } from '../services/contributionService'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import confetti from 'canvas-confetti'
import { getSupporterDisplayName } from '../utils/nameHelper'

const MESSAGES_DATA = [
  {
    id: '0',
    title: "Janamithra’s Healing Milestone",
    tag: "SUCCESS STORY",
    price: 10,
    quote: "Every heartbeat of hope grows stronger because compassionate souls chose kindness over silence. Janamithra’s family now faces tomorrow with renewed strength and faith.",
    author: "Heal & Play Healing Journal"
  },
  {
    id: '1',
    title: "Words of Hope from Pediatric Care",
    tag: "CLINICAL VOICE",
    price: 20,
    quote: "Even the smallest contribution can become the light that helps a child continue fighting another day.",
    author: "Pediatric Care Team"
  },
  {
    id: '2',
    title: "How Transparency Empowers You",
    tag: "OUR PROMISE",
    price: 30,
    quote: "Trust is not just a promise; it is a visible link. Direct ledger transparency guarantees that every rupee goes from your heart directly to the clinical bill.",
    author: "Heal & Play Ecosystem"
  }
]

export default function RevealMessagePage() {
  const { messageId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { userData } = useUserData()
  const { requestPayment } = usePayment()

  const [step, setStep] = useState('name') // 'name' | 'reveal'
  const [supporterName, setSupporterName] = useState('')
  const [loading, setLoading] = useState(false)
  const [createdCertId, setCreatedCertId] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const found = MESSAGES_DATA.find(m => m.id === messageId)
    if (found) {
      setMessage(found)
    } else {
      navigate('/main')
    }
  }, [messageId, navigate])

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleNameSubmit = async (e) => {
    e.preventDefault()
    
    // Resolve helper name if input is empty
    const finalName = getSupporterDisplayName(user, supporterName)

    // Save details to localStorage
    localStorage.setItem('hp_supporter_name', finalName)
    localStorage.setItem('hp_user_name', finalName)

    localStorage.setItem('hp_unlock_type', 'message')
    localStorage.setItem('hp_pending_price', message.price.toString())
    localStorage.setItem('hp_pending_game_id', message.id)
    localStorage.setItem('hp_pending_game_title', message.title)
    localStorage.setItem('hp_pending_game_path', '')

    navigate('/direct-payment')
  }

  const handleDownloadCert = () => {
    if (!createdCertId) return
    const safeName = getSupporterDisplayName(user, supporterName)
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert("Please allow popups to download your certificate.")
      return
    }

    const certTitle = `Certificate of Healing Message - ${message.title}`
    const parts = certTitle.split(/\s*[-–]\s*/)
    const titleLine1 = parts[0]
    const titleLine2 = parts.slice(1).join(' - ')

    printWindow.document.write(`
      <html>
        <head>
          <title>Healing Message Certificate</title>
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
              padding: 20px;
              box-sizing: border-box;
            }
            .certificate-container {
              background: #FFFDFB;
              border: 12px double #D4AF37;
              border-radius: 24px;
              padding: 70px 60px 60px;
              max-width: 840px;
              width: 100%;
              text-align: center;
              box-shadow: 0 24px 60px rgba(139, 94, 52, 0.12);
              position: relative;
              box-sizing: border-box;
              overflow: hidden;
            }
            .certificate-container::before {
              content: '';
              position: absolute;
              inset: 6px;
              border: 2px solid #D4AF37;
              border-radius: 18px;
              pointer-events: none;
            }
            .watermark {
              position: absolute;
              inset: 0;
              display: flex;
              align-items: center;
              justify-content: center;
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
            .title-line1 {
              font-family: 'Georgia', serif;
              font-size: 32px;
              color: #3D2B1A;
              margin: 0 0 8px;
              font-weight: 700;
              position: relative;
              z-index: 1;
            }
            .title-line2 {
              font-family: 'Great Vibes', cursive;
              font-size: 42px;
              color: #C8773A;
              margin: 0 0 16px;
              position: relative;
              z-index: 1;
            }
            h2 {
              font-size: 14px;
              color: #7A6A58;
              text-transform: uppercase;
              letter-spacing: 0.25em;
              margin: 0 0 28px;
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
            
            <h1 class="title-line1">${titleLine1}</h1>
            ${titleLine2 ? `<div class="title-line2">${titleLine2}</div>` : ''}
            <h2>Heal & Play Ecosystem • HEALING MESSAGE UNLOCK</h2>
            
            <div class="presented-to">This official token of medical gratitude is proudly awarded to</div>
            <div class="name">${safeName}</div>
            
            <div class="description">
              In sincere recognition of their compassionate contribution of <span class="amount">₹${message.price}</span> supporting essential clinical pediatric care and specialized hospital treatment for <span class="amount">Janamithra</span>. Your generous contribution has directly helped secure verified medical operations.
            </div>

            <div style="font-size: 13px; font-weight: bold; color: #8C745C; margin-top: 10px; margin-bottom: 20px;">
              Date of Contribution: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
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

            <div class="registry-no">Verified Blockchain Registry No: H&P-REF-REG-${createdCertId ? createdCertId.toUpperCase().slice(-10) : 'N/A'}</div>
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

  if (!message) {
    return (
      <div style={{ minHeight: '100vh', background: '#FAF6F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FAF6F0', color: '#3D2B1A', fontFamily: 'Outfit, sans-serif', position: 'relative', overflowX: 'hidden' }}>
      
      {/* Soft floating glow background elements */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(235, 224, 214, 0.5) 0%, rgba(255, 255, 255, 0) 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, rgba(255, 255, 255, 0) 70%)', filter: 'blur(50px)' }} />
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -25, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 5 + i * 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #C8A87C, #8B6239)',
              left: `${15 + i * 10}%`,
              top: `${20 + (i * 8) % 60}%`
            }}
          />
        ))}
      </div>

      <Navbar />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', zIndex: 1, position: 'relative', boxSizing: 'border-box' }}>
        <AnimatePresence mode="wait">
          {step === 'name' ? (
            /* 1️⃣ NAME ENTRY PAGE */
            <motion.div
              key="name-step"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                width: '100%',
                maxWidth: '520px',
                background: 'rgba(255, 253, 250, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(139, 94, 52, 0.18)',
                borderRadius: '32px',
                padding: '48px 40px',
                boxShadow: '0 24px 64px rgba(74, 52, 39, 0.08)',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(140, 79, 26, 0.06)', padding: '6px 14px', borderRadius: '20px', marginBottom: 20 }}>
                <Award size={13} color="#8C4F1A" />
                <span style={{ fontSize: 10.5, fontWeight: 900, color: '#8C4F1A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Certificate Dedication
                </span>
              </div>

              <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#3D2B1A', margin: '0 0 10px', lineHeight: 1.25, fontFamily: 'Georgia, serif' }}>
                Who should this healing message be dedicated to?
              </h2>
              
              <p style={{ fontSize: '14.5px', color: '#7A6A5A', margin: '0 0 32px', fontWeight: 500, lineHeight: 1.5 }}>
                This name will appear on your healing appreciation certificate.
              </p>

              <form onSubmit={handleNameSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24, textAlign: 'left' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Enter Supporter's Name (Optional)"
                    value={supporterName}
                    onChange={(e) => setSupporterName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      borderRadius: '16px',
                      border: '1px solid rgba(139, 94, 52, 0.25)',
                      background: '#FFFFFF',
                      fontSize: '15px',
                      color: '#3D2B1A',
                      outline: 'none',
                      fontFamily: 'Outfit',
                      boxSizing: 'border-box',
                      boxShadow: '0 4px 12px rgba(139, 94, 52, 0.02)',
                      transition: 'all 0.2s ease'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: loading ? '#E4E4E7' : 'linear-gradient(135deg, #8C4F1A, #C8773A)',
                    color: loading ? '#A1A1AA' : '#FFF',
                    fontWeight: 800,
                    fontSize: '15px',
                    borderRadius: '16px',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: loading ? 'none' : '0 8px 24px rgba(140, 79, 26, 0.15)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {loading ? "Securing Unlock..." : "Continue to Reveal Message"}
                  <ArrowRight size={16} />
                </button>
              </form>
            </motion.div>
          ) : (
            /* 2️⃣ THANK YOU + MESSAGE REVEAL PAGE */
            <motion.div
              key="reveal-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                width: '100%',
                maxWidth: '720px',
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(20px)',
                border: '1.5px solid rgba(212, 175, 55, 0.35)',
                borderRadius: '40px',
                padding: '56px 48px',
                boxShadow: '0 30px 80px rgba(139, 94, 52, 0.15), 0 0 30px rgba(212, 175, 55, 0.05)',
                textAlign: 'center',
                boxSizing: 'border-box',
                position: 'relative'
              }}
            >
              {/* Soft Golden Corner Glow inside the card */}
              <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }} />

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FFFDF0', border: '1px solid #FFE082', padding: '6px 14px', borderRadius: '20px', marginBottom: 24 }}>
                <Sparkles size={13} color="#D4AF37" />
                <span style={{ fontSize: 10.5, fontWeight: 900, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {message.tag}
                </span>
              </div>

              {/* Title / Child Header */}
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 700, color: '#8C4F1A', margin: '0 0 20px' }}>
                🌸 {message.title}
              </h3>

              {/* 3️⃣ REVEALED QUOTE EXPERIENCE */}
              <div style={{
                background: 'rgba(252, 250, 246, 0.8)',
                borderLeft: '4px solid #D4AF37',
                borderRadius: '16px',
                padding: '32px 36px',
                margin: '0 0 36px',
                textAlign: 'left',
                boxShadow: 'inset 0 2px 8px rgba(139, 94, 52, 0.02)'
              }}>
                <p style={{
                  fontFamily: 'Outfit',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#3D2B1A',
                  lineHeight: 1.6,
                  margin: '0 0 16px',
                  fontStyle: 'italic'
                }}>
                  “{message.quote}”
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 24, height: 1.5, background: '#D4AF37' }} />
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#8C745C', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {message.author}
                  </span>
                </div>
              </div>

              {/* 5️⃣ THANK YOU SECTION */}
              <div style={{ marginBottom: 40 }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 900, color: '#3D2B1A' }}>
                  Thank You for Supporting Healing Journeys ❤️
                </h4>
                <p style={{ margin: 0, fontSize: '14.5px', color: '#7A6A5A', fontWeight: 500, lineHeight: 1.6 }}>
                  Your contribution of <strong style={{ color: '#8C4F1A' }}>₹{message.price}</strong> directly helps verified pediatric treatment and emotional recovery programs.
                </p>
              </div>

              {/* 6️⃣ ACTION BUTTONS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', gap: 14, width: '100%' }}>
                  {/* Download */}
                  <button
                    onClick={handleDownloadCert}
                    style={{
                      flex: 1,
                      padding: '16px',
                      background: 'linear-gradient(135deg, #8C4F1A, #C8773A)',
                      color: '#FFF',
                      fontWeight: 800,
                      fontSize: '14px',
                      borderRadius: '14px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: '0 6px 16px rgba(140, 79, 26, 0.12)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 24px rgba(140, 79, 26, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 6px 16px rgba(140, 79, 26, 0.12)'}
                  >
                    <Download size={15} /> Download Healing Certificate
                  </button>

                  {/* Unlock Another */}
                  <button
                    onClick={() => navigate('/main')}
                    style={{
                      flex: 1,
                      padding: '16px',
                      background: '#FFFDF9',
                      color: '#8C4F1A',
                      fontWeight: 800,
                      fontSize: '14px',
                      borderRadius: '14px',
                      border: '1.5px solid #EBD5C2',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Unlock Another Message
                  </button>
                </div>

                {/* View Stories */}
                <button
                  onClick={() => navigate('/healing-stories')}
                  style={{
                    padding: '14px',
                    background: 'rgba(139, 94, 52, 0.05)',
                    color: '#8C745C',
                    fontWeight: 800,
                    fontSize: '13.5px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    transition: 'all 0.2s'
                  }}
                >
                  View Healing Stories
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}
