import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Users, Shield, CheckCircle2, ChevronRight, Play, Heart, Star, Award, Sparkles, Gift, Gamepad2, Trophy, Clock, HeartHandshake, FileText, Download, TrendingUp, ShieldCheck, HeartPulse, CreditCard, Lock, Activity, CheckSquare, MessageSquare, HeartHandshake as DirectHeart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DonationProgress from '../components/DonationProgress'
import MedicalProofSection from '../components/MedicalProofSection'
import { staggerContainer, fadeUp, cardVariant } from '../animations/variants'
import { HeroBackground, DonationBackground, GamesBackground, WarmSectionBackground } from '../components/PremiumBackground'
import helpJanaImg from '../assets/janamithra.png'
import { db } from '../firebase'
import { collection, onSnapshot } from 'firebase/firestore'

const URGENT_CASE = {
  id: 'jana_case',
  name: 'Janamitra',
  age: '1 Year Old',
  condition: 'Spinal Muscular Atrophy (SMA Type 2)',
  image: helpJanaImg,
  requiredAmount: 90000000,
  baseRaisedAmount: 2745900,
  hospital: 'Aster Women & Children Hospital'
}

const formatCrore = (num) => {
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  } else if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)}L`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
}


const COMPLETED_TREATMENTS = [
  { name: 'Baby Kabir', age: '4 months', illness: 'Congenital Heart Defect', status: 'Successfully Cured!', date: '2 days ago', image: 'https://images.unsplash.com/photo-1519689680058-324335c77ebe?w=200&q=80' },
  { name: 'Baby Aisha', age: '1 year', illness: 'Liver Transplant Success', status: 'Discharged!', date: '1 week ago', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80' }
]



const LIVE_DONATIONS = [
  { text: "Someone donated ₹10 from Chennai just now ❤️", time: "1s ago" },
  { text: "Flat ₹50 Flipkart coupon unlocked in Bangalore 🏷️", time: "12s ago" },
  { text: "₹2,500 raised for Janamitra this hour 📈", time: "3m ago" },
  { text: "Nanavati Max Hospital cleared billing milestone 🛡️", time: "8m ago" }
]

// Stable inline custom high-fidelity SVG for Hospital Treatment
function HospitalIllustration() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', background: 'linear-gradient(135deg, #FFF7ED 0%, #FAF2EA 100%)' }}>
      <rect width="400" height="200" rx="16" fill="url(#paint0_linear)" />
      {/* Clinic base */}
      <path d="M120 160H280V80H120V160Z" fill="#FFF7ED" stroke="#EBD5C2" strokeWidth="3" />
      <path d="M170 160H230V115H170V160Z" fill="#FAF2EA" stroke="#EBD5C2" strokeWidth="3" />
      {/* Heart beat graph line behind */}
      <path d="M40 100H100L110 70L125 130L135 90L145 110L155 100H360" stroke="#8C4F1A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.25" />
      {/* Hospital cross roof sign */}
      <rect x="188" y="48" width="24" height="24" rx="4" fill="#8C4F1A" />
      <path d="M200 53V67M193 60H207" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      {/* Heart badge */}
      <path d="M200 137C200 137 186 127 186 119C186 112 192.5 108.5 200 114C207.5 108.5 214 112 214 119C214 127 200 137 200 137Z" fill="#8C4F1A" />
      <defs>
        <linearGradient id="paint0_linear" x1="0" y1="0" x2="400" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF7ED" />
          <stop offset="1" stopColor="#FAF2EA" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Stable inline custom high-fidelity SVG for Security Lock
function SecurityIllustration() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', background: 'linear-gradient(135deg, #FFF7ED 0%, #FAF2EA 100%)' }}>
      <rect width="400" height="200" rx="16" fill="url(#paint1_linear)" />
      {/* Credit card shape */}
      <rect x="110" y="60" width="180" height="100" rx="12" fill="#fff" stroke="#EBD5C2" strokeWidth="3" />
      <rect x="130" y="80" width="36" height="26" rx="4" fill="#FAF2EA" stroke="#EBD5C2" strokeWidth="2" />
      {/* Card strips */}
      <line x1="130" y1="125" x2="230" y2="125" stroke="#EBD5C2" strokeWidth="4" strokeLinecap="round" />
      <line x1="130" y1="138" x2="190" y2="138" stroke="#EBD5C2" strokeWidth="4" strokeLinecap="round" />
      {/* Lock badge overlay */}
      <circle cx="250" cy="115" r="28" fill="#8C4F1A" />
      <rect x="238" y="108" width="24" height="18" rx="3" fill="#fff" />
      <path d="M244 108V100C244 96.6863 246.686 94 250 94C253.314 94 256 96.6863 256 100V108" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="250" cy="116" r="3" fill="#8C4F1A" />
      <defs>
        <linearGradient id="paint1_linear" x1="0" y1="0" x2="400" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF7ED" />
          <stop offset="1" stopColor="#FAF2EA" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [dynamicRaised, setDynamicRaised] = useState(URGENT_CASE.baseRaisedAmount)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'contributions'), (snapshot) => {
      let extraRaised = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data && data.amount) {
          extraRaised += Number(data.amount);
        }
      });
      setDynamicRaised(URGENT_CASE.baseRaisedAmount + extraRaised);
    }, (error) => {
      console.error("Error listening to contributions: ", error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])



  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'transparent',
      position: 'relative'
    }}>

      <Navbar />

      <main style={{ flex: 1, paddingBottom: 100, zIndex: 1, position: 'relative' }}>

        {/* ────────────────── 1. HERO ────────────────── */}
        <section style={{ position: 'relative', overflow: 'hidden' }}>
          <HeroBackground />
          <div style={{
            padding: 'clamp(40px,6vw,80px) clamp(16px,4vw,40px) clamp(48px,6vw,96px)',
            maxWidth: 1200,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '55fr 45fr',
            gap: 'clamp(32px,5vw,64px)',
            alignItems: 'center',
            boxSizing: 'border-box',
            width: '100%',
            position: 'relative',
            zIndex: 1
          }} className="hero-split-grid">

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              <motion.div
                variants={fadeUp}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#FAF2EA',
                  border: '1px solid #EBD5C2',
                  borderRadius: '99px',
                  padding: '6px 14px',
                  alignSelf: 'flex-start'
                }}
              >
                <Trophy size={13} color="#8C4F1A" />
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C4F1A', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Helper Dashboard Portal
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                style={{
                  fontFamily: 'Outfit',
                  fontSize: 'clamp(38px, 4.8vw, 56px)',
                  fontWeight: 900,
                  lineHeight: 1.15,
                  color: 'var(--color-text)',
                  margin: 0,
                  letterSpacing: '-1.5px'
                }}
              >
                Play. Unlock.<br />
                <span style={{
                  background: 'linear-gradient(90deg, #8C4F1A, #C8773A)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Help Children Heal.</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                style={{
                  fontSize: '16.5px',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.65,
                  maxWidth: '480px',
                  margin: 0
                }}
              >
                Welcome back to the platform! Choose active clinical campaigns below, donate small amounts of ₹10 to play simple games, and unlock discounts from trusted merchant partners.
              </motion.p>

              <motion.div
                variants={fadeUp}
                style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}
              >
                <motion.button
                  onClick={() => navigate('/main')}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary"
                  style={{
                    padding: '13px 26px',
                    fontSize: '14.5px',
                    borderRadius: '11px',
                    boxShadow: '0 8px 20px rgba(123, 63, 0, 0.16)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer'
                  }}
                >
                  <Gamepad2 size={16} /> Play & Heal <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>❤️</span>
                </motion.button>

                <motion.button
                  onClick={() => navigate('/main', { state: { activeTab: 'free-help' } })}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '13px 26px',
                    fontSize: '14.5px',
                    borderRadius: '11px',
                    border: '1.5px solid #8C4F1A',
                    background: 'rgba(140, 79, 26, 0.05)',
                    color: '#8C4F1A',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'Outfit, sans-serif'
                  }}
                >
                  <Heart size={16} fill="#8C4F1A" /> Direct Donation
                </motion.button>
              </motion.div>

              <motion.div
                variants={fadeUp}
                style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid rgba(232, 224, 214, 0.5)', paddingTop: 20 }}
              >
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 size={14} color="#16a34a" />
                    <span style={{ fontSize: '13px', fontWeight: 700 }}>25.8K Helpers Active</span>
                  </div>
                  <span style={{ color: 'var(--color-text-light)' }}>•</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Shield size={14} color="var(--color-primary)" />
                    <span style={{ fontSize: '13px', fontWeight: 700 }}>100% Hospital Directed</span>
                  </div>
                </div>

                <a
                  href="#medical-documents"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('medical-documents')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: 'var(--color-accent)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    transition: 'all 0.2s ease',
                    marginTop: 4,
                    alignSelf: 'flex-start'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary-dark)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
                >
                  <FileText size={12} /> Scroll down to see the Medical Documents
                </a>
              </motion.div>
            </motion.div>

            {/* Right Column: Featured Child Spotlight */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <motion.div
                whileHover={{ y: -6, boxShadow: '0 30px 70px rgba(139, 94, 52, 0.15)' }}
                transition={{ duration: 0.3 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '32px',
                  border: '1px solid rgba(235, 224, 214, 0.9)',
                  padding: '32px',
                  width: '100%',
                  maxWidth: '480px',
                  boxShadow: '0 25px 60px rgba(123, 63, 0, 0.08)',
                  boxSizing: 'border-box',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                className="featured-child-premium-card"
              >
                <style>{`
                @keyframes heartbeat {
                  0% { transform: scale(1); }
                  14% { transform: scale(1.12); }
                  28% { transform: scale(1); }
                  42% { transform: scale(1.12); }
                  70% { transform: scale(1); }
                }
                .heartbeat-pulse {
                  animation: heartbeat 1.4s infinite ease-in-out;
                  display: inline-block;
                }
              `}</style>

                {/* Urgency Badge with Heartbeat Animation */}
                <div style={{
                  position: 'absolute',
                  top: 44,
                  left: 44,
                  background: 'rgba(239, 68, 68, 0.95)',
                  backdropFilter: 'blur(8px)',
                  padding: '6px 14px',
                  borderRadius: '99px',
                  fontSize: '11px',
                  fontWeight: 900,
                  color: '#FFF',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 8px 20px rgba(239, 68, 68, 0.25)',
                  letterSpacing: '0.04em'
                }}>
                  <span className="heartbeat-pulse">🚨</span> URGENT • CRITICAL TIMELINE
                </div>

                {/* Image with Dark Vignette Overlay */}
                <div style={{
                  width: '100%',
                  height: '300px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  position: 'relative',
                  marginBottom: 24,
                  boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)'
                }}>
                  <img
                    src={URGENT_CASE.image}
                    alt={URGENT_CASE.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center 20%',
                      transform: 'scale(1.02)'
                    }}
                  />

                  {/* Dark cinematic vignette and soft bottom gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(26, 17, 9, 0.95) 0%, rgba(26, 17, 9, 0.4) 50%, rgba(0,0,0,0) 100%)',
                  }} />

                  {/* Patient Info Overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    right: 20,
                    color: '#fff',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <ShieldCheck size={14} color="#D4AF37" />
                      <span style={{ fontSize: '10.5px', color: '#EBD5C2', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.08em' }}>
                        {URGENT_CASE.hospital}
                      </span>
                    </div>
                    <h3 style={{ margin: '0 0 2px', fontSize: '24px', fontWeight: 900, fontFamily: 'Outfit', letterSpacing: '-0.5px' }}>
                      {URGENT_CASE.name}
                    </h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#EBD5C2', fontWeight: 600 }}>
                      {URGENT_CASE.age} • {URGENT_CASE.condition}
                    </p>
                  </div>
                </div>

                {/* Progress & Amounts Section */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
                    <span style={{ fontSize: '15px', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'Outfit' }}>
                      {((dynamicRaised / URGENT_CASE.requiredAmount) * 100).toFixed(2)}% Funded
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      <strong>{formatCrore(dynamicRaised)}</strong> raised of <strong>{formatCrore(URGENT_CASE.requiredAmount)}</strong>
                    </span>
                  </div>

                  {/* Smooth Progress Bar with Framer Motion */}
                  <div className="progress-glow" style={{
                    height: 12,
                    background: 'rgba(235, 224, 214, 0.6)',
                    borderRadius: '99px',
                    overflow: 'hidden',
                    marginBottom: 20
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(dynamicRaised / URGENT_CASE.requiredAmount) * 100}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #8C4F1A, #C8773A)',
                        borderRadius: '99px'
                      }}
                    />
                  </div>

                  {/* 3-Column Milestone Widget */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 12,
                    marginBottom: 20
                  }}>
                    <div style={{
                      background: '#FAF6F2',
                      border: '1px solid rgba(235, 224, 214, 0.5)',
                      borderRadius: '16px',
                      padding: '12px 8px',
                      textAlign: 'center'
                    }}>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Goal</span>
                      <div style={{ fontSize: '13.5px', fontWeight: 900, color: 'var(--color-text)', marginTop: 4 }}>
                        {formatCrore(URGENT_CASE.requiredAmount)}
                      </div>
                    </div>
                    <div style={{
                      background: '#FAF6F2',
                      border: '1px solid rgba(235, 224, 214, 0.5)',
                      borderRadius: '16px',
                      padding: '12px 8px',
                      textAlign: 'center'
                    }}>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Raised</span>
                      <div style={{ fontSize: '13.5px', fontWeight: 900, color: 'var(--color-text)', marginTop: 4 }}>
                        {formatCrore(dynamicRaised)}
                      </div>
                    </div>
                    <div style={{
                      background: '#FAF6F2',
                      border: '1px solid rgba(235, 224, 214, 0.5)',
                      borderRadius: '16px',
                      padding: '12px 8px',
                      textAlign: 'center'
                    }}>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Remaining</span>
                      <div style={{ fontSize: '13.5px', fontWeight: 900, color: '#C8773A', marginTop: 4 }}>
                        {formatCrore(URGENT_CASE.requiredAmount - dynamicRaised)}
                      </div>
                    </div>
                  </div>

                  {/* Support Text & Verified Indicator */}
                  <p style={{ margin: '0 0 16px', fontSize: '13.5px', color: '#5C4C3C', textAlign: 'center', fontStyle: 'italic', lineHeight: 1.5, fontWeight: 500 }}>
                    “Every small contribution brings Jana one step closer to life-saving treatment.”
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyCenter: 'center', gap: 6, fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', justifyContent: 'center' }}>
                    <ShieldCheck size={13} color="#16a34a" /> 100% Verified Hospital Ledger
                  </div>
                </div>

                {/* Help Jana Survive Button */}
                <motion.button
                  onClick={() => navigate('/main')}
                  whileHover={{ scale: 1.02, boxShadow: '0 12px 30px rgba(140, 79, 26, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '99px',
                    fontSize: '15px',
                    fontWeight: 900,
                    background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
                    cursor: 'pointer',
                    border: 'none',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 8px 24px rgba(140, 79, 26, 0.2)',
                    fontFamily: 'Outfit',
                    letterSpacing: '0.02em',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Help Jana Survive <span className="heartbeat-pulse">❤️</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </section>
        {/* ────────────────── 5. DEEPLY EMOTIONAL STORYTELLING ────────────────── */}
        <section style={{ padding: '100px 40px', maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Clinical Reality</span>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 40px)', color: '#3D2B1A', margin: '6px 0 0', letterSpacing: '-1.5px', lineHeight: 1.15 }}>
              A Mother’s Plea to Save Her Only Child 💔
            </h2>
            <p style={{ margin: '8px 0 0', fontSize: '16px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              A real story of love, fear, hope, and survival.
            </p>
          </div>

          <div className="storytelling-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 48,
            alignItems: 'center'
          }}>

            {/* Left Column: Hero Storytelling Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
            >
              <div style={{
                background: 'rgba(255, 255, 255, 0.5)',
                border: '1px solid rgba(235, 224, 214, 0.6)',
                borderRadius: '24px',
                padding: '36px',
                boxShadow: '0 10px 30px rgba(123, 63, 0, 0.02)',
                lineHeight: 1.8,
                fontSize: '15.5px',
                color: '#5C4C3C',
                fontWeight: 500
              }}>
                <p style={{ margin: '0 0 18px' }}>
                  Umamaheswari never imagined that motherhood would become a fight for survival.
                </p>
                <p style={{ margin: '0 0 18px' }}>
                  Her little daughter, <strong>Janamitra</strong>, just <strong>1 year and 4 months old</strong>, is her first child, her only child, and her entire world. <span className="heartbeat-pulse">💔</span>
                </p>
                <p style={{ margin: '0 0 18px' }}>
                  At an age when children begin taking tiny steps and exploring life, Janamitra is fighting for something much more basic — the strength to even move.
                </p>
                <p style={{ margin: '0 0 18px' }}>
                  Doctors diagnosed her with <strong>Spinal Muscular Atrophy Type 2 (SMA Type 2)</strong>, a rare and life-threatening genetic condition that slowly weakens the muscles over time.
                </p>
                <p style={{ margin: '0 0 18px' }}>
                  Every day without treatment steals a little more of her strength.
                </p>
                <p style={{ margin: 0 }}>
                  While other children laugh, run, and play, Janamitra struggles silently — and her mother watches helplessly, praying every single day for a miracle.
                </p>
              </div>
            </motion.div>

            {/* Right Column: Visual Highlight Card & Emergency Alert */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
            >
              {/* SECTION 2 — VISUAL EMOTIONAL HIGHLIGHT */}
              <div style={{
                position: 'relative',
                borderRadius: '28px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(123, 63, 0, 0.08)',
                border: '1.5px solid rgba(235, 224, 214, 0.9)',
                height: '340px'
              }}>
                {/* Glow Border Effect */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  borderRadius: '26px',
                  pointerEvents: 'none',
                  zIndex: 3
                }} />

                <img
                  src={helpJanaImg}
                  alt="Janamitra"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 35%'
                  }}
                />

                {/* Vignette Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(26, 17, 9, 0.9) 0%, rgba(26, 17, 9, 0.3) 60%, rgba(0,0,0,0) 100%)',
                  zIndex: 1
                }} />

                {/* Badge Overlay */}
                <div style={{
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  background: 'rgba(140, 79, 26, 0.95)',
                  backdropFilter: 'blur(8px)',
                  padding: '5px 12px',
                  borderRadius: '99px',
                  fontSize: '10px',
                  fontWeight: 900,
                  color: '#FAF6F2',
                  zIndex: 2,
                  letterSpacing: '0.06em',
                  boxShadow: '0 4px 12px rgba(140, 79, 26, 0.3)',
                  textTransform: 'uppercase'
                }}>
                  🛡️ URGENT LIFE-SAVING TREATMENT
                </div>

                {/* Bottom Title Overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 20,
                  right: 20,
                  color: '#FFF',
                  zIndex: 2
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '10.5px', color: '#EBD5C2', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em', marginBottom: 2 }}>
                    <ShieldCheck size={12} color="#D4AF37" /> Clinical Case No: H&P-JANA-2026
                  </div>
                  <h4 style={{ margin: 0, fontSize: '20px', fontWeight: 900, fontFamily: 'Outfit' }}>
                    Janamitra (1 Year Old)
                  </h4>
                </div>
              </div>

              {/* SECTION 3 — CRITICAL TREATMENT MESSAGE */}
              <div style={{
                background: 'linear-gradient(135deg, #FFFDFB 0%, #FAF6F2 100%)',
                border: '1px solid #EBD5C2',
                borderLeft: '4px solid #EF4444',
                borderRadius: '20px',
                padding: '24px 28px',
                boxShadow: '0 10px 30px rgba(239, 68, 68, 0.03)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <HeartPulse className="heartbeat-pulse" size={24} color="#EF4444" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <p style={{ margin: '0 0 10px', fontSize: '14.5px', color: '#3D2B1A', fontWeight: 800, lineHeight: 1.5 }}>
                      Janamitra urgently needs a one-time gene therapy treatment that could save her life and give her a chance at a normal childhood.
                    </p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#7A6A58', fontWeight: 600, lineHeight: 1.5 }}>
                      The treatment cost is unimaginably high — far beyond what this family can afford alone.
                    </p>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>

        </section>

        {/* ────────────────── 6. PROOF & VERIFICATION ────────────────── */}
        <section style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Clinical Verification</span>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 34px)', color: '#3D2B1A', margin: '2px 0 0', letterSpacing: '-1.2px', lineHeight: 1.15 }}>
              Verified Proof & Clinical Authenticity 📄
            </h2>
            <p style={{ margin: '8px 0 0', fontSize: '14.5px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              All links verified and publicly accessible for complete transparency.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>

            {/* CARD 1 — PARENT CAMPAIGN DETAILS */}
            <motion.div
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(140, 79, 26, 0.08)' }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1.5px solid rgba(212, 175, 55, 0.35)',
                borderRadius: '24px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '240px',
                boxSizing: 'border-box',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Verified Badge */}
              <div style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: '#FAF6F2',
                border: '1px solid #EBD5C2',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '9px',
                fontWeight: 800,
                color: 'var(--color-primary)',
                letterSpacing: '0.04em'
              }}>
                ✓ VERIFIED SOURCE
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--color-primary)', marginBottom: 14 }}>
                  <Users size={20} />
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Parent Ledger</span>
                </div>
                <h4 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: 900, fontFamily: 'Outfit', color: '#3D2B1A' }}>
                  Official Parent Campaign
                </h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5, fontWeight: 500 }}>
                  Verified fundraiser and parent details hosted publicly for transparency and authenticity.
                </p>
              </div>

              <a
                href="https://www.impactguru.com/fundraiser/help-janamithra"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <motion.button
                  whileHover={{ x: 5 }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)',
                    fontWeight: 800,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: 0,
                    fontFamily: 'Outfit'
                  }}
                >
                  View Parent Campaign →
                </motion.button>
              </a>
            </motion.div>

            {/* CARD 2 — VIDEO PROOF & APPEAL */}
            <motion.div
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(239, 68, 68, 0.08)' }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1.5px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '24px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '240px',
                boxSizing: 'border-box',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Verified Badge */}
              <div style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: '#FEF2F2',
                border: '1px solid #FEE2E2',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '9px',
                fontWeight: 800,
                color: '#EF4444',
                letterSpacing: '0.04em'
              }}>
                ✓ VIDEO VERIFIED
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#EF4444', marginBottom: 14 }}>
                  <Play size={20} style={{ fill: '#EF4444' }} />
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Video Proof</span>
                </div>
                <h4 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: 900, fontFamily: 'Outfit', color: '#3D2B1A' }}>
                  Video Proof & Appeal
                </h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5, fontWeight: 500 }}>
                  Real emotional video appeal showing Janamitra’s condition and urgent treatment requirement.
                </p>
              </div>

              <a
                href="https://youtube.com/shorts/haHd9T4YmSI?si=LHbNZA3fxjudRoW_"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <motion.button
                  whileHover={{ x: 5 }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#EF4444',
                    fontWeight: 800,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: 0,
                    fontFamily: 'Outfit'
                  }}
                >
                  Watch Verification Video →
                </motion.button>
              </a>
            </motion.div>

            {/* CARD 3 — ABOUT SMA TYPE 2 */}
            <motion.div
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(13, 148, 136, 0.08)' }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1.5px solid rgba(13, 148, 136, 0.2)',
                borderRadius: '24px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '240px',
                boxSizing: 'border-box',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Verified Badge */}
              <div style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: '#F0FDFA',
                border: '1px solid #CCFBF1',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '9px',
                fontWeight: 800,
                color: '#0D9488',
                letterSpacing: '0.04em'
              }}>
                ✓ CLINICAL SOURCE
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#0D9488', marginBottom: 14 }}>
                  <Activity size={20} />
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Medical Education</span>
                </div>
                <h4 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: 900, fontFamily: 'Outfit', color: '#3D2B1A' }}>
                  What is SMA Type 2?
                </h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5, fontWeight: 500 }}>
                  Learn about Spinal Muscular Atrophy Type 2, its symptoms, progression, and life-saving treatments.
                </p>
              </div>

              <a
                href="https://my.clevelandclinic.org/health/diseases/14505-spinal-muscular-atrophy-sma"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <motion.button
                  whileHover={{ x: 5 }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0D9488',
                    fontWeight: 800,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: 0,
                    fontFamily: 'Outfit'
                  }}
                >
                  Read Medical Information →
                </motion.button>
              </a>
            </motion.div>

          </div>
        </section>

        {/* ────────────────── 7. MEDICAL PROOF & TRANSPARENCY ────────────────── */}
        <MedicalProofSection />




        {/* ────────────────── 3. PAYMENT TRANSPARENCY ────────────────── */}
        <section style={{ position: 'relative', overflow: 'hidden' }}>
          <DonationBackground />
          <div style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box', position: 'relative', zIndex: 1 }}>

            <div style={{ textAlign: 'center', marginBottom: 56 }} className="payment-transparency-header">
              <motion.div
                variants={fadeUp}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#FAF2EA',
                  border: '1px solid #EBD5C2',
                  borderRadius: '99px',
                  padding: '6px 16px',
                  marginBottom: '12px'
                }}
              >
                <ShieldCheck size={13} color="#8C4F1A" />
                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#8C4F1A', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  100% Direct Patient Support
                </span>
              </motion.div>
              <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 36px)', color: '#3D2B1A', margin: '4px 0 0', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
                Your Contribution Goes Directly to the Patient ❤️
              </h2>
              <p style={{ margin: '8px 0 0', fontSize: '15.5px', color: 'var(--color-text-muted)', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.55 }}>
                Every contribution is routed toward verified pediatric treatment support, medicines, recovery care, and emergency hospital needs.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 32,
              marginBottom: 48,
              alignItems: 'stretch'
            }} className="transparency-visual-grid">

              {/* CARD 1 */}
              <motion.div
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(123, 63, 0, 0.06)' }}
                style={{
                  background: '#fff',
                  borderRadius: '24px',
                  border: '1px solid rgba(232, 224, 214, 0.6)',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  boxShadow: 'var(--shadow-sm)',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  background: '#FFF2E6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8C4F1A'
                }}>
                  <HeartPulse size={22} />
                </div>
                <div>
                  <h3 style={{ margin: '0 0 10px', fontSize: '19px', fontWeight: 800, color: 'var(--color-text)', fontFamily: 'Outfit' }}>
                    Verified Treatment Support
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                    Your contribution directly supports medicines, ICU care, treatment procedures, recovery essentials, and pediatric emergency care.
                  </p>
                </div>
              </motion.div>

              {/* CARD 2 */}
              <motion.div
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(123, 63, 0, 0.06)' }}
                style={{
                  background: '#fff',
                  borderRadius: '24px',
                  border: '1px solid rgba(232, 224, 214, 0.6)',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  boxShadow: 'var(--shadow-sm)',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  background: '#FFF2E6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8C4F1A'
                }}>
                  <Users size={22} />
                </div>
                <div>
                  <h3 style={{ margin: '0 0 10px', fontSize: '19px', fontWeight: 800, color: 'var(--color-text)', fontFamily: 'Outfit' }}>
                    Direct Family Assistance
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                    Funds are routed toward verified patient support initiatives and emergency healthcare requirements without hidden deductions.
                  </p>
                </div>
              </motion.div>

              {/* CARD 3 */}
              <motion.div
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(123, 63, 0, 0.06)' }}
                style={{
                  background: '#fff',
                  borderRadius: '24px',
                  border: '1px solid rgba(232, 224, 214, 0.6)',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  boxShadow: 'var(--shadow-sm)',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  background: '#FFF2E6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8C4F1A'
                }}>
                  <Award size={22} />
                </div>
                <div>
                  <h3 style={{ margin: '0 0 10px', fontSize: '19px', fontWeight: 800, color: 'var(--color-text)', fontFamily: 'Outfit' }}>
                    Transparent Healing Impact
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                    Every contribution is tracked with transparency records and verified support acknowledgements for accountability and trust.
                  </p>
                </div>
              </motion.div>

            </div>

            {/* Bottom Trust Text */}
            <div style={{
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: 700,
              color: '#8C4F1A',
              background: '#FAF2EA',
              border: '1px solid #EBD5C2',
              borderRadius: '99px',
              padding: '10px 24px',
              display: 'block',
              margin: '28px auto 0',
              maxWidth: 'fit-content'
            }}>
              Exact contribution amount • No hidden charges • Compassion-first support
            </div>


            {/* 3B. TRUST & FRAMEWORK CARDS */}
            <div style={{ marginTop: 80, borderTop: '1px solid rgba(232, 224, 214, 0.6)', paddingTop: 64 }}>

              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Trust Framework
                </span>
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '26px', color: 'var(--color-text)', margin: '4px 0 0', letterSpacing: '-0.5px' }}>
                  Our Security & Verification Framework 🛡️
                </h3>
                <p style={{ margin: '6px 0 0', fontSize: '14.5px', color: 'var(--color-text-muted)', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                  Instant transparent operations. Verified medical cases and bank-grade payment encryption guarantee absolute security.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 24,
                marginBottom: 48
              }} className="framework-cards-grid">

                <motion.div
                  whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(123, 63, 0, 0.05)' }}
                  style={{
                    background: 'linear-gradient(135deg, #FAF8F5 0%, #FFFFFF 100%)',
                    borderRadius: '20px',
                    border: '1px solid rgba(232, 224, 214, 0.6)',
                    padding: '24px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}
                >
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: '#FAF2EA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary)'
                  }}>
                    <ShieldCheck size={20} />
                  </div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, fontFamily: 'Outfit' }}>
                    100% Transparent
                  </h4>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    Every rupee is mapped directly to verified hospital billing.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(123, 63, 0, 0.05)' }}
                  style={{
                    background: 'linear-gradient(135deg, #FAF8F5 0%, #FFFFFF 100%)',
                    borderRadius: '20px',
                    border: '1px solid rgba(232, 224, 214, 0.6)',
                    padding: '24px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}
                >
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: '#FAF2EA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary)'
                  }}>
                    <FileText size={20} />
                  </div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, fontFamily: 'Outfit' }}>
                    Verified Medical Cases
                  </h4>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    Hospital documents and treatment records are manually verified before publishing.
                  </p>
                </motion.div>



                <motion.div
                  whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(123, 63, 0, 0.05)' }}
                  style={{
                    background: 'linear-gradient(135deg, #FAF8F5 0%, #FFFFFF 100%)',
                    borderRadius: '20px',
                    border: '1px solid rgba(232, 224, 214, 0.6)',
                    padding: '24px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}
                >
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: '#FAF2EA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary)'
                  }}>
                    <Users size={20} />
                  </div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, fontFamily: 'Outfit' }}>
                    Together We Heal
                  </h4>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    Thousands of helpers contributing toward life-saving treatments together.
                  </p>
                </motion.div>

              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 20,
                flexWrap: 'wrap',
                paddingTop: 28,
                borderTop: '1px solid rgba(232, 224, 214, 0.4)'
              }} className="bottom-trust-badges">

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 800, color: 'var(--color-text-muted)' }}>
                  <span style={{ color: '#16a34a' }}>🔒</span>
                  <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>SSL Secured</span>
                </div>

                <span style={{ color: 'rgba(232, 224, 214, 0.8)' }}>|</span>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 800, color: 'var(--color-text-muted)' }}>
                  <span style={{ color: '#1A73E8' }}>💳</span>
                  <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>Razorpay Verified</span>
                </div>

                <span style={{ color: 'rgba(232, 224, 214, 0.8)' }}>|</span>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 800, color: 'var(--color-text-muted)' }}>
                  <span style={{ color: '#8C4F1A' }}>🏥</span>
                  <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>Hospital Audited</span>
                </div>

                <span style={{ color: 'rgba(232, 224, 214, 0.8)' }}>|</span>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 800, color: 'var(--color-text-muted)' }}>
                  <span style={{ color: '#C026D3' }}>🔑</span>
                  <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>End-to-End Encrypted</span>
                </div>

              </div>

            </div>

          </div>
        </section>


        {/* ────────────────── 8. BOTTOM CALL FOR HUMANITY ────────────────── */}
        <section style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.45)',
            backdropFilter: 'blur(8px)',
            borderRadius: '32px',
            padding: '56px 48px',
            border: '1.5px solid rgba(235, 224, 214, 0.7)',
            boxShadow: '0 20px 40px rgba(140, 79, 26, 0.04)'
          }}>
            <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>
              A Call for Humanity
            </span>
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 'clamp(22px, 3.5vw, 28px)', color: '#3D2B1A', margin: '0 0 16px', letterSpacing: '-0.8px' }}>
              This is not just a fundraiser.
            </h3>
            <p style={{ fontSize: '19px', fontWeight: 800, color: '#C8773A', margin: '0 0 24px', fontFamily: 'Outfit' }}>
              This is a mother asking the world for a miracle. 🙏
            </p>
            <p style={{ fontSize: '15.5px', color: '#5C4C3C', lineHeight: 1.75, fontWeight: 500, margin: '0 auto 36px', maxWidth: '680px' }}>
              Every contribution, every share, every act of kindness brings Janamitra one step closer to a future where she can stand, walk, smile, and joyfully call out ‘Amma’.
            </p>

            <motion.button
              onClick={() => navigate('/main')}
              whileHover={{ scale: 1.02, boxShadow: '0 12px 30px rgba(140, 79, 26, 0.25)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: 'linear-gradient(135deg, #8C4F1A, #C8773A)',
                color: '#FFF',
                border: 'none',
                borderRadius: '99px',
                padding: '16px 44px',
                fontSize: '15.5px',
                fontWeight: 900,
                fontFamily: 'Outfit',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 8px 24px rgba(140, 79, 26, 0.15)'
              }}
            >
              Extend a Helping Hand <Heart size={16} />
            </motion.button>

            {/* Bottom Disclaimer */}
            <p style={{ margin: '40px 0 0', fontSize: '11px', color: 'var(--color-text-muted)', lineHeight: 1.6, fontWeight: 500, maxWidth: '700px', margin: '40px auto 0' }}>
              * The campaign goal may exceed attached medical estimates to support post-hospitalization care, rehabilitation therapies, medications, diagnostics, and long-term follow-up treatment requirements.
            </p>
          </div>
        </section>

      </main>



      <Footer />

      {/* Premium Shimmer Animations & CSS styling */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-bg {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%);
          background-size: 200% 100%;
          animation: shimmer 3s infinite linear;
        }
        @media (max-width: 960px) {
          .home-dashboard-bar {
            padding: 12px 20px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 6px !important;
          }
          .hero-split-grid {
            grid-template-columns: 1fr !important;
            padding: 48px 20px 64px !important;
            gap: 40px !important;
          }
          .section-header-flex {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px !important;
          }
          .live-feed-flex {
            flex-direction: column !important;
            align-items: center !important;
            gap: 12px !important;
          }
          .timeline-line {
            left: 16px !important;
            transform: none !important;
          }
          .timeline-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          .timeline-left, .timeline-right {
            width: 100% !important;
            text-align: left !important;
            padding-left: 32px !important;
            padding-right: 0 !important;
          }
          .timeline-row > div:nth-child(2) {
            left: 16px !important;
            transform: translateX(-50%) !important;
          }
          .split-labels-flex {
            flex-direction: column !important;
            align-items: center !important;
            gap: 8px !important;
          }
          .transparency-visual-grid {
            grid-template-columns: 1fr !important;
          }
          .categories-grid {
            grid-template-columns: 1fr !important;
          }
          .rewards-cards-grid {
            grid-template-columns: 1fr !important;
          }
          .framework-cards-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .mystery-rewards-section, .payment-transparency-header {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .hero-split-grid > div { align-items: center !important; }
          .home-section-heading { font-size: clamp(22px, 7vw, 30px) !important; }
          .home-card-grid { grid-template-columns: 1fr !important; gap: 14px !important; }
          .game-cards-row { grid-template-columns: 1fr !important; }
          .donation-options-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 375px) {
          .hero-split-grid { padding: 32px 12px !important; }
        }
      `}</style>
    </div>
  )
}
