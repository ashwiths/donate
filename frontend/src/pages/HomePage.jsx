import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Users, Shield, CheckCircle2, ChevronRight, Play, Heart, Star, Award, Sparkles, Gift, Gamepad2, Trophy, Clock, HeartHandshake, FileText, Download, TrendingUp, ShieldCheck, HeartPulse, CreditCard, Lock, Activity, CheckSquare, MessageSquare, HeartHandshake as DirectHeart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DonationProgress from '../components/DonationProgress'
import { staggerContainer, fadeUp, cardVariant } from '../animations/variants'

const URGENT_CASE = {
  id: '1',
  name: 'Baby Aarav',
  age: '8 months old',
  condition: 'Liver Disease (Biliary Atresia)',
  image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1000&q=90',
  requiredAmount: 7000000,
  raisedAmount: 214385,
  remainingAmount: 6785615,
  percentage: 3,
  hospital: 'Nanavati Max Hospital'
}

const ACTIVE_CAMPAIGNS = [
  {
    id: '2',
    name: 'Baby Diya',
    age: '18 months old',
    condition: 'Congenital Heart Defect (VSD)',
    image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=500&q=80',
    requiredAmount: 1500000,
    raisedAmount: 480000,
    percentage: 32,
    tag: 'Urgent Case',
    storyPreview: "A simple open-heart surgery at Nanavati Hospital will patch Diya's congenital heart defect, letting her live a healthy life."
  },
  {
    id: '3',
    name: 'Baby Vihaan',
    age: '2 years old',
    condition: 'Acute Leukemia (Blood Cancer)',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&q=80',
    requiredAmount: 3000000,
    raisedAmount: 820000,
    percentage: 27,
    tag: 'Recently Added',
    storyPreview: "Vihaan requires 3 rounds of targeted chemotherapy to defeat blood cancer. Doctors are highly optimistic of a full cure."
  },
  {
    id: '4',
    name: 'Baby Arjun',
    age: '1 year old',
    condition: 'Spinal Muscular Atrophy (Type 1)',
    image: 'https://images.unsplash.com/photo-1544120190-2751b8e176b0?w=500&q=80',
    requiredAmount: 16000000,
    raisedAmount: 1400000,
    percentage: 8,
    tag: 'Urgent Case',
    storyPreview: "Arjun needs Zolgensma gene therapy within the next 4 months to halt progressive muscle loss and breathe naturally."
  },
  {
    id: '5',
    name: 'Baby Meera',
    age: '6 months old',
    condition: 'Severe SCID (Bone Marrow)',
    image: 'https://images.unsplash.com/photo-1484863137850-59afcfe05386?w=500&q=80',
    requiredAmount: 2500000,
    raisedAmount: 310000,
    percentage: 12,
    tag: 'Urgent Case',
    storyPreview: "An urgent bone marrow transplant from a verified matched donor will rebuild Meera's immune system completely."
  }
]

const COMPLETED_TREATMENTS = [
  { name: 'Baby Kabir', age: '4 months', illness: 'Congenital Heart Defect', status: 'Successfully Cured!', date: '2 days ago', image: 'https://images.unsplash.com/photo-1519689680058-324335c77ebe?w=200&q=80' },
  { name: 'Baby Aisha', age: '1 year', illness: 'Liver Transplant Success', status: 'Discharged!', date: '1 week ago', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80' }
]

// 3 Curated Mystery Box Types
const MYSTERY_REWARDS = [
  {
    id: 'daily',
    title: 'Daily Mystery Reward Box 🎁',
    desc: 'Unlock a surprise cashback or shopping discount reward.',
    badge: 'Mystery Box • Daily Drops 🔮',
    color: '#8B5CF6',
    borderGlow: '0 0 20px rgba(139, 92, 246, 0.25)',
    bg: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)',
    illustration: '🎁',
    possibleRewards: [
      { name: 'Paytm Cashback', logo: '🔵' },
      { name: 'Flipkart Voucher', logo: '🟡' },
      { name: 'Swiggy Coupon', logo: '🍕' }
    ]
  },
  {
    id: 'cashback',
    title: 'Lucky Cashback Drop ⚡',
    desc: 'Chance to reveal Paytm or Google Pay cashback rewards up to ₹100.',
    badge: 'Limited Stock Today ⚡',
    color: '#EC4899',
    borderGlow: '0 0 20px rgba(236, 72, 153, 0.25)',
    bg: 'linear-gradient(135deg, #311042 0%, #0F172A 100%)',
    illustration: '⚡',
    possibleRewards: [
      { name: 'Paytm Cashback', logo: '🔵' },
      { name: 'Google Pay Card', logo: '🟢' }
    ]
  },
  {
    id: 'shopping',
    title: 'Shopping Reward Vault 🛒',
    desc: 'Hidden ecommerce vouchers and delivery passes waiting inside.',
    badge: 'Chance-Based Drops 📈',
    color: '#10B981',
    borderGlow: '0 0 20px rgba(16, 185, 129, 0.25)',
    bg: 'linear-gradient(135deg, #064E3B 0%, #0F172A 100%)',
    illustration: '🗝️',
    possibleRewards: [
      { name: 'Flipkart Voucher', logo: '🟡' },
      { name: 'Amazon Gift Card', logo: '🟠' },
      { name: 'Swiggy Coupon', logo: '🍕' }
    ]
  }
]

const BRAND_PULL_LIST = [
  { name: 'Paytm Cashback', logo: '🔵', detail: '₹50 instant wallet payout' },
  { name: 'Google Pay', logo: '🟢', detail: 'Mystery daily scratch bonus' },
  { name: 'Flipkart Voucher', logo: '🟡', detail: '10% sitewide shopping pass' },
  { name: 'Amazon Gift Card', logo: '🟠', detail: '₹100 Amazon Pay gift voucher' },
  { name: 'Swiggy Food Pass', logo: '🍕', detail: 'Free food delivery coupon' }
]

const LIVE_DONATIONS = [
  { text: "Someone donated ₹10 from Chennai just now ❤️", time: "1s ago" },
  { text: "Flat ₹50 Flipkart coupon unlocked in Bangalore 🏷️", time: "12s ago" },
  { text: "₹2,500 raised for Baby Aarav this hour 📈", time: "3m ago" },
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
  const [selectedDirectAmount, setSelectedDirectAmount] = useState(20)

  // Interactive Mystery Reveal State Machine
  const [activeRevealBox, setActiveRevealBox] = useState(null) // 'daily' | 'cashback' | 'shopping'
  const [isShaking, setIsShaking] = useState(false)
  const [revealedResult, setRevealedResult] = useState(null)

  const handleTriggerMysteryReveal = (boxId) => {
    setActiveRevealBox(boxId)
    setIsShaking(true)
    setRevealedResult(null)

    // Stage 1: Fast exciting shake animation (1.8s)
    setTimeout(() => {
      setIsShaking(false)
      // Pick a random exciting premium reward
      const prizes = [
        { title: '₹50 Paytm Cashback! 🔵', code: 'HP-PAYTM50-CASH', detail: 'Instantly credited to your linked wallet number.' },
        { title: 'Google Pay Scratch Card! 🟢', code: 'HP-GPAY-SCRATCH', detail: 'Check GPay Reward section for mystery cashback drop.' },
        { title: '10% Flipkart Shopping Voucher! 🟡', code: 'HP-FLIP-10VOUCH', detail: 'Applicable on next clinical partner checkout.' },
        { title: '₹100 Amazon Pay Gift Reward! 🟠', code: 'HP-AMZN-100GIFT', detail: 'Redeem directly inside Amazon Pay wallet balance.' },
        { title: 'Free Swiggy Food Pass! 🍕', code: 'HP-SWIG-PASSFREE', detail: 'Enjoy 100% free food delivery checkout.' }
      ]
      const chosen = prizes[Math.floor(Math.random() * prizes.length)]
      setRevealedResult(chosen)
    }, 1800)
  }

  const handleCloseRevealModal = () => {
    setActiveRevealBox(null)
    setRevealedResult(null)
    setIsShaking(false)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      background: 'radial-gradient(circle at 50% 50%, #FAF6F0 0%, #FAF8F5 100%)',
      position: 'relative'
    }}>
      
      {/* Soft ambient background radial glows */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(232, 168, 124, 0.08) 0%, rgba(254, 243, 232, 0) 70%)',
        filter: 'blur(90px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <Navbar />

      {/* Dynamic Mini Dashboard Sub-Header */}
      <div style={{
        background: '#FFF8F2',
        borderBottom: '1px solid rgba(232, 224, 214, 0.5)',
        padding: '12px 80px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '13px',
        fontWeight: 700,
        color: '#8C4F1A',
        zIndex: 9,
        position: 'relative',
        boxShadow: '0 2px 6px rgba(123, 63, 0, 0.02)'
      }} className="home-dashboard-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <HeartHandshake size={15} color="#8C4F1A" />
          <span>Active Session: <strong>Vignesh (Helper Level 3)</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span>HP Coins: <strong>🪙 120 Coins</strong></span>
          <span>•</span>
          <span>Contributions Today: <strong>₹20</strong></span>
        </div>
      </div>

      <main style={{ flex: 1, paddingBottom: 100, zIndex: 1, position: 'relative' }}>

        {/* ────────────────── 1. CONTENT-DRIVEN PLATFORM HERO ────────────────── */}
        <section style={{ 
          padding: '80px 40px 96px',
          maxWidth: 1200, 
          margin: '0 auto', 
          display: 'grid', 
          gridTemplateColumns: '55fr 45fr', 
          gap: 64,
          alignItems: 'center',
          boxSizing: 'border-box',
          width: '100%'
        }} className="hero-split-grid">
          
          {/* Left Column (55%): Discovery & Header */}
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

            {/* Micro Dashboard CTAs */}
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
                <Gamepad2 size={16} /> Open Play Dashboard
              </motion.button>
              <motion.a 
                href="#active-campaigns"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="btn-outline" 
                style={{ 
                  padding: '12px 26px', 
                  fontSize: '14.5px', 
                  borderRadius: '11px',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                  background: '#fff',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                Browse Campaigns
              </motion.a>
            </motion.div>

            {/* Quick trust metrics strip */}
            <motion.div
              variants={fadeUp}
              style={{ display: 'flex', gap: 16, alignItems: 'center', borderTop: '1px solid rgba(232, 224, 214, 0.5)', paddingTop: 20 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={14} color="#16a34a" />
                <span style={{ fontSize: '13px', fontWeight: 700 }}>25.8K Helpers Active</span>
              </div>
              <span style={{ color: 'var(--color-text-light)' }}>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Shield size={14} color="var(--color-primary)" />
                <span style={{ fontSize: '13px', fontWeight: 700 }}>100% Hospital Directed</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column (45%): ONE Large Premium Featured Child Spotlight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(232, 224, 214, 0.8)',
                padding: '28px',
                width: '100%',
                maxWidth: '480px',
                boxShadow: '0 25px 60px rgba(123, 63, 0, 0.08)',
                boxSizing: 'border-box',
                position: 'relative'
              }}
              className="featured-child-premium-card"
            >
              {/* Case tag */}
              <div style={{
                position: 'absolute',
                top: 40,
                left: 40,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: 800,
                color: '#EF4444',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                boxShadow: 'var(--shadow-sm)'
              }}>
                <Clock size={11} />
                TODAY'S MOST URGENT CASE
              </div>

              {/* Image Container */}
              <div style={{ 
                width: '100%', 
                height: '240px', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                position: 'relative',
                marginBottom: 24
              }}>
                <img 
                  src={URGENT_CASE.image} 
                  alt={URGENT_CASE.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
                }} />
                
                <div style={{
                  position: 'absolute',
                  bottom: 18,
                  left: 18,
                  right: 18,
                  color: '#fff'
                }}>
                  <span style={{ fontSize: '10px', opacity: 0.8, textTransform: 'uppercase', fontWeight: 700 }}>{URGENT_CASE.hospital}</span>
                  <h3 style={{ margin: '2px 0 0', fontSize: '20px', fontWeight: 800, fontFamily: 'Outfit' }}>{URGENT_CASE.name} ({URGENT_CASE.age})</h3>
                  <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>{URGENT_CASE.condition}</p>
                </div>
              </div>

              {/* Redesigned Premium Funding Section */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-primary)' }}>
                    {URGENT_CASE.percentage}% Funded
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    <strong>₹2.14L</strong> raised of <strong>₹70L</strong> goal
                  </span>
                </div>
                
                {/* Thicker, high-fidelity premium progress track */}
                <div style={{ 
                  height: 12, 
                  background: 'rgba(232, 224, 214, 0.6)', 
                  borderRadius: '99px', 
                  overflow: 'hidden',
                  marginBottom: 20
                }}>
                  <div style={{ 
                    width: `${URGENT_CASE.percentage}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #8C4F1A, #C8773A)',
                    borderRadius: '99px' 
                  }} />
                </div>

                {/* Micro Fintech Stat Grid */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: 12, 
                  marginBottom: 16 
                }}>
                  <div style={{ 
                    background: '#FAF2EA', 
                    border: '1px solid #EBD5C2', 
                    borderRadius: '12px', 
                    padding: '10px',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Needed</span>
                    <div style={{ fontSize: '13px', fontWeight: 900, color: 'var(--color-text)', marginTop: 2 }}>₹70,00,000</div>
                  </div>
                  <div style={{ 
                    background: '#FAF2EA', 
                    border: '1px solid #EBD5C2', 
                    borderRadius: '12px', 
                    padding: '10px',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Raised</span>
                    <div style={{ fontSize: '13px', fontWeight: 900, color: 'var(--color-text)', marginTop: 2 }}>₹2,14,385</div>
                  </div>
                  <div style={{ 
                    background: '#FAF2EA', 
                    border: '1px solid #EBD5C2', 
                    borderRadius: '12px', 
                    padding: '10px',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Remaining</span>
                    <div style={{ fontSize: '13px', fontWeight: 900, color: '#C8773A', marginTop: 2 }}>₹67,85,615</div>
                  </div>
                </div>

                {/* Verified Hospital Treatment Estimate */}
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'center', fontWeight: 600 }}>
                  🛡️ Verified hospital treatment estimate. Updated directly from hospital billing records.
                </p>
              </div>

              <motion.button 
                onClick={() => navigate('/main')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary" 
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  borderRadius: '12px', 
                  fontSize: '15px',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
                  boxShadow: '0 4px 15px rgba(123, 63, 0, 0.15)',
                  cursor: 'pointer',
                  border: 'none',
                  color: '#fff'
                }}
              >
                Help Aarav While You Play ❤️
              </motion.button>
            </motion.div>
          </motion.div>
        </section>

        {/* ────────────────── 2. SUBTLE LIVE ACTIVITY FEED ────────────────── */}
        <section style={{ 
          background: 'rgba(255, 255, 255, 0.6)', 
          borderTop: '1px solid rgba(232, 224, 214, 0.4)',
          borderBottom: '1px solid rgba(232, 224, 214, 0.4)',
          padding: '16px 0',
          overflow: 'hidden'
        }}>
          <div style={{ 
            maxWidth: 1200, 
            margin: '0 auto', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-around', 
            gap: 20, 
            flexWrap: 'wrap',
            padding: '0 40px',
            boxSizing: 'border-box'
          }} className="live-feed-flex">
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={12} /> LIVE ACTIVITY:
            </span>
            {LIVE_DONATIONS.map((donation, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
                <span>{donation.text}</span>
                <span style={{ fontSize: '10px', color: 'var(--color-text-light)' }}>({donation.time})</span>
              </div>
            ))}
          </div>
        </section>

        {/* ────────────────── 3. STABLE VECTOR STORYTELLING PAYMENT TRANSPARENCY ────────────────── */}
        <section style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          
          {/* Centered Section Header */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
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
                marginBottom: '12px'
              }}
            >
              <ShieldCheck size={13} color="#8C4F1A" />
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#8C4F1A', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                100% Direct Payout Audit
              </span>
            </motion.div>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '32px', color: 'var(--color-text)', margin: '4px 0 0', letterSpacing: '-0.75px' }}>
              Where Your Contribution Goes 💳
            </h2>
            <p style={{ margin: '8px 0 0', fontSize: '15.5px', color: 'var(--color-text-muted)', maxWidth: '580px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.55 }}>
              A premium transparent overview of how your ₹10 ticket routes directly from payment gateway verification into immediate hospital treatment.
            </p>
          </div>

          {/* 3-Column Premium Visual Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 32,
            marginBottom: 64,
            alignItems: 'stretch'
          }} className="transparency-visual-grid">
            
            {/* Column 1: Left Treatment Explanation */}
            <motion.div
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(123, 63, 0, 0.06)' }}
              style={{
                background: '#fff',
                borderRadius: '24px',
                border: '1px solid rgba(232, 224, 214, 0.6)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--color-primary)', marginBottom: 16 }}>
                  <HeartPulse size={22} />
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Treatment Allocation</span>
                </div>
                
                {/* Custom Inline SVG Illustration (Stable/Unbreakable) */}
                <div style={{ width: '100%', height: '140px', borderRadius: '16px', overflow: 'hidden', marginBottom: 18 }}>
                  <HospitalIllustration />
                </div>

                <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800, color: 'var(--color-text)', fontFamily: 'Outfit' }}>
                  ₹9 Direct Treatment Support
                </h3>
                <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  Ninety percent of your micro-donation routes directly to settling operating theater fees, essential critical ICU setup support, and specialty pediatric pharmacy desks.
                </p>
              </div>
            </motion.div>

            {/* Column 2: Center Payment Split Infographic & flow */}
            <motion.div
              style={{
                background: '#FAF2EA',
                borderRadius: '24px',
                border: '1px solid #EBD5C2',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#8C4F1A', marginBottom: 16 }}>
                  <Activity size={22} />
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Allocation Split</span>
                </div>

                {/* Animated fill graphic bar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: 4 }}>
                      <span>Child Treatment</span>
                      <span>₹9.00 (90%)</span>
                    </div>
                    <div style={{ height: 10, background: 'rgba(232, 224, 214, 0.8)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: '90%', height: '100%', background: 'linear-gradient(90deg, #8C4F1A, #C8773A)', borderRadius: 99 }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: 4 }}>
                      <span>Secure Gateway Processing</span>
                      <span>₹1.00 (10%)</span>
                    </div>
                    <div style={{ height: 10, background: 'rgba(232, 224, 214, 0.8)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: '10%', height: '100%', background: '#5C2D0E', borderRadius: 99 }} />
                    </div>
                  </div>
                </div>

                {/* Mini payment flow diagram */}
                <h4 style={{ margin: '0 0 12px', fontSize: '12.5px', fontWeight: 800, color: '#8C4F1A', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  Micro-Payment Verification Flow
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8C4F1A' }} />
                    <span>Helper Pays ₹10 securely</span>
                  </div>
                  <div style={{ width: 1, height: 10, background: '#EBD5C2', marginLeft: 2.5 }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8C4F1A' }} />
                    <span>Razorpay SSL verification clears fee (₹1)</span>
                  </div>
                  <div style={{ width: 1, height: 10, background: '#EBD5C2', marginLeft: 2.5 }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8C4F1A' }} />
                    <span>Direct settlement clears operation billing (₹9)</span>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* Column 3: Right Side Gateway Security */}
            <motion.div
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(123, 63, 0, 0.06)' }}
              style={{
                background: '#fff',
                borderRadius: '24px',
                border: '1px solid rgba(232, 224, 214, 0.6)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--color-primary)', marginBottom: 16 }}>
                  <Lock size={20} />
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Assurance</span>
                </div>
                
                {/* Custom Inline SVG Illustration (Stable/Unbreakable) */}
                <div style={{ width: '100%', height: '140px', borderRadius: '16px', overflow: 'hidden', marginBottom: 18 }}>
                  <SecurityIllustration />
                </div>

                <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800, color: 'var(--color-text)', fontFamily: 'Outfit' }}>
                  ₹1 Secure Payment Routing
                </h3>
                <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  Payment routing handles secure SSL encryption protocols, transactional routing, and verification clearing keys, routing direct payouts to verified hospital ledgers.
                </p>
              </div>
            </motion.div>

          </div>

          {/* ────────────────── 3B. REDESIGNED HIGH-FIDELITY TRUST & FRAMEWORK CARDS ────────────────── */}
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
              
              {/* Card 1: 100% Transparent */}
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

              {/* Card 2: Verified Medical Cases */}
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

              {/* Card 3: Secure Payments */}
              <motion.div
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(123, 63, 0, 0.06)' }}
                style={{
                  background: 'linear-gradient(135deg, #FFF9F2 0%, #FFFFFF 100%)',
                  borderRadius: '20px',
                  border: '1px solid #8C4F1A',
                  padding: '24px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: '#8C4F1A',
                  color: '#fff',
                  fontSize: '8px',
                  fontWeight: 900,
                  padding: '2px 8px',
                  borderBottomLeftRadius: '8px',
                  letterSpacing: '0.05em'
                }}>
                  AES-256 SSL
                </div>

                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  background: '#FFF2E6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8C4F1A'
                }}>
                  <Lock size={18} />
                </div>
                
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--color-text)' }}>
                  Secure Payments
                </h4>
                
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  Protected with Razorpay SSL encryption and secure payment routing.
                </p>

                <div style={{ 
                  marginTop: 4, 
                  background: '#FFFDFB', 
                  border: '1px solid rgba(232, 224, 214, 0.5)', 
                  borderRadius: '8px', 
                  padding: '6px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '10px',
                  color: '#8C4F1A',
                  fontWeight: 700
                }}>
                  <span>🔒 Razorpay Gateway</span>
                  <span style={{ color: '#16a34a' }}>● Encrypted</span>
                </div>
              </motion.div>

              {/* Card 4: Together We Heal */}
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

            {/* Bottom Premium Trust Micro Badges Row */}
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

        </section>

        {/* ────────────────── 4. REDESIGNED CURATED PARTICIPATION CATEGORIES ────────────────── */}
        <section style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}> Curated Experiences </span>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '28px', color: 'var(--color-text)', margin: '2px 0 0', letterSpacing: '-0.75px' }}> Choose Your Way to Help 🤝 </h2>
            <p style={{ margin: '6px 0 0', fontSize: '14.5px', color: 'var(--color-text-muted)' }}> Explore gamified clinical tickets, unlock emotional quotes, or contribute direct billing sums. </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }} className="categories-grid">
            
            {/* Category 1: Games To Unlock */}
            <motion.div
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(123, 63, 0, 0.05)' }}
              style={{
                background: '#fff',
                border: '1px solid var(--color-border)',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '420px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--color-primary)', marginBottom: 16 }}>
                  <Gamepad2 size={24} />
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interactive Play</span>
                </div>
                
                <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 800, fontFamily: 'Outfit' }}>Games To Unlock</h3>
                <p style={{ margin: '0 0 16px', fontSize: '13.5px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  Play interactive mini-games while helping fund child treatments. Unlocks high-engagement spins, memory matches, and scratch cards.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  {['spin wheel', 'scratch cards', 'memory games', 'treasure hunts'].map((item, idx) => (
                    <span key={idx} style={{ fontSize: '11px', background: '#FAF2EA', color: '#8C4F1A', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
                      🎮 {item}
                    </span>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => navigate('/main?tab=games')}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(123, 63, 0, 0.1)'
                }}
              >
                Explore Games (₹10) 🎮
              </button>
            </motion.div>

            {/* Category 2: Quotes To Unlock */}
            <motion.div
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(123, 63, 0, 0.05)' }}
              style={{
                background: '#fff',
                border: '1px solid var(--color-border)',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '420px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--color-primary)', marginBottom: 16 }}>
                  <MessageSquare size={22} />
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inspirational Quotes</span>
                </div>
                
                <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 800, fontFamily: 'Outfit' }}>Quotes To Unlock</h3>
                <p style={{ margin: '0 0 16px', fontSize: '13.5px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  Unlock emotional stories, healing messages, and inspirational quotes. Connect directly with the human mission behind pediatric recovery.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  {['motivational quotes', 'success stories', 'healing messages', 'emotional content'].map((item, idx) => (
                    <span key={idx} style={{ fontSize: '11px', background: '#FAF2EA', color: '#8C4F1A', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
                      💬 {item}
                    </span>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => navigate('/main?tab=quotes')}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(123, 63, 0, 0.1)'
                }}
              >
                Unlock Inspiration (₹10) 💬
              </button>
            </motion.div>

            {/* Category 3: Donate Freely */}
            <motion.div
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(123, 63, 0, 0.05)' }}
              style={{
                background: '#fff',
                border: '1px solid var(--color-border)',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '420px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--color-primary)', marginBottom: 16 }}>
                  <Heart size={22} />
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Direct Clinical Support</span>
                </div>
                
                <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 800, fontFamily: 'Outfit' }}>Donate Freely</h3>
                <p style={{ margin: '0 0 16px', fontSize: '13.5px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  Support treatments directly. Perfect for helpers who simply wish to donate recommended sums directly to clear hospital bills.
                </p>

                {/* Interactive Recommended Chips */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 18 }} className="amount-chips-row">
                  {[20, 50, 100].map((amt) => (
                    <motion.button
                      key={amt}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDirectAmount(amt)}
                      style={{
                        flex: 1,
                        padding: '8px 0',
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor: selectedDirectAmount === amt ? '#8C4F1A' : 'rgba(232, 224, 214, 0.8)',
                        background: selectedDirectAmount === amt ? '#FAF2EA' : '#fff',
                        color: selectedDirectAmount === amt ? '#8C4F1A' : 'var(--color-text-muted)',
                        fontSize: '13px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      ₹{amt} {amt === 20 ? '🔥' : ''}
                    </motion.button>
                  ))}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  {['0% platform fee', 'hospital billing', 'direct payout', 'tax receipt ready'].map((item, idx) => (
                    <span key={idx} style={{ fontSize: '11px', background: '#FDF2F2', color: '#EF4444', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
                      ❤️ {item}
                    </span>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => navigate('/main')}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #EF4444, #C026D3)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)'
                }}
              >
                Support a Child (₹{selectedDirectAmount}) ❤️
              </button>
            </motion.div>

          </div>
        </section>

        {/* ────────────────── 5. TREATMENT JOURNEY & TIMELINE ────────────────── */}
        <section style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Clinical Roadmap</span>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '28px', color: 'var(--color-text)', margin: '2px 0 0', letterSpacing: '-0.75px' }}>Treatment Journey & Updates ❤️</h2>
            <p style={{ margin: '6px 0 0', fontSize: '14.5px', color: 'var(--color-text-muted)' }}>Track Baby Aarav's exact surgical and clinical roadmap from diagnosis to final discharge.</p>
          </div>

          <div style={{
            position: 'relative',
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px 0'
          }}>
            {/* Center line */}
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'var(--color-border)', transform: 'translateX(-50%)' }} className="timeline-line" />

            {/* Timeline Milestones */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
              
              {/* Event 1 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', position: 'relative' }} className="timeline-row">
                <div style={{ width: '45%', textAlign: 'right', paddingRight: 20 }} className="timeline-left">
                  <span style={{ fontSize: '11px', background: '#FAF2EA', color: 'var(--color-primary)', padding: '4px 8px', borderRadius: '5px', fontWeight: 800 }}>APRIL 10, 2026</span>
                  <h4 style={{ margin: '8px 0 4px', fontSize: '15px', fontWeight: 800 }}>Clinical Diagnosis</h4>
                  <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>Baby Aarav diagnosed with critical stage Biliary Atresia. Nanavati Max Hospital Hepatologist recommends immediate liver transplant.</p>
                </div>
                <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 14, height: 14, borderRadius: '50%', background: 'var(--color-primary)', border: '4px solid #fff', zIndex: 2 }} />
                <div style={{ width: '45%' }} className="timeline-right" />
              </div>

              {/* Event 2 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', position: 'relative' }} className="timeline-row">
                <div style={{ width: '45%' }} className="timeline-left" />
                <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 14, height: 14, borderRadius: '50%', background: 'var(--color-primary)', border: '4px solid #fff', zIndex: 2 }} />
                <div style={{ width: '45%', paddingLeft: 20 }} className="timeline-right">
                  <span style={{ fontSize: '11px', background: '#FAF2EA', color: 'var(--color-primary)', padding: '4px 8px', borderRadius: '5px', fontWeight: 800 }}>MAY 1, 2026</span>
                  <h4 style={{ margin: '8px 0 4px', fontSize: '15px', fontWeight: 800 }}>Fundraising Launched</h4>
                  <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>Campaign live on Heal & Play platform. Over 1,200 micro-tickets purchased within 24 hours.</p>
                </div>
              </div>

              {/* Event 3 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', position: 'relative' }} className="timeline-row">
                <div style={{ width: '45%', textAlign: 'right', paddingRight: 20 }} className="timeline-left">
                  <span style={{ fontSize: '11px', background: '#FAF2EA', color: 'var(--color-primary)', padding: '4px 8px', borderRadius: '5px', fontWeight: 800 }}>MAY 20, 2026</span>
                  <h4 style={{ margin: '8px 0 4px', fontSize: '15px', fontWeight: 800 }}>ICU Deposit Cleared</h4>
                  <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>₹2.14L successfully released directly to Nanavati Max Hospital billing desk to secure the operating room scheduling.</p>
                </div>
                <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 14, height: 14, borderRadius: '50%', background: 'var(--color-primary)', border: '4px solid #fff', zIndex: 2 }} />
                <div style={{ width: '45%' }} className="timeline-right" />
              </div>

            </div>
          </div>
        </section>

        {/* ────────────────── 6. PROOF & HOSPITAL VERIFICATION ────────────────── */}
        <section style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Clinical Verification</span>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '28px', color: 'var(--color-text)', margin: '2px 0 0', letterSpacing: '-0.75px' }}>Verified Proof & Clinical Authenticity 📄</h2>
            <p style={{ margin: '6px 0 0', fontSize: '14.5px', color: 'var(--color-text-muted)' }}>Download and inspect the authentic hospital documents certifying this campaign.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            
            {/* Doc 1 */}
            <div style={{
              background: '#fff',
              border: '1px solid var(--color-border)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '180px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-primary)', marginBottom: 12 }}>
                  <FileText size={18} />
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Estimation Letter</span>
                </div>
                <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 800 }}>Hospital Cost Estimate</h4>
                <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--color-text-muted)' }}>Certified operation cost breakdown signed by Hepatologist, Nanavati Max.</p>
              </div>
              <button style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start', padding: 0 }}>
                <Download size={14} /> Download Proof PDF
              </button>
            </div>

            {/* Doc 2 */}
            <div style={{
              background: '#fff',
              border: '1px solid var(--color-border)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '180px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-primary)', marginBottom: 12 }}>
                  <Award size={18} />
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Clinical Report</span>
                </div>
                <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 800 }}>Doctor Diagnostic PDF</h4>
                <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--color-text-muted)' }}>Official patient report diagnosing stage-3 Biliary Atresia.</p>
              </div>
              <button style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start', padding: 0 }}>
                <Download size={14} /> Download Report PDF
              </button>
            </div>

            {/* Doc 3 */}
            <div style={{
              background: '#fff',
              border: '1px solid var(--color-border)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '180px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-primary)', marginBottom: 12 }}>
                  <ShieldCheck size={18} />
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Consent Certificate</span>
                </div>
                <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 800 }}>Parent Consent Form</h4>
                <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--color-text-muted)' }}>Signed consent authorizing image release and hospital payment routing.</p>
              </div>
              <button style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start', padding: 0 }}>
                <Download size={14} /> Download Consent PDF
              </button>
            </div>

          </div>
        </section>

        {/* ────────────────── 7. ACTIVE CHILD CAMPAIGNS ────────────────── */}
        <section id="active-campaigns" style={{ 
          padding: '80px 40px', 
          maxWidth: 1200, 
          margin: '0 auto',
          boxSizing: 'border-box',
          width: '100%'
        }}>
          <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }} className="section-header-flex">
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Active Clinical Campaigns</span>
              <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '28px', color: 'var(--color-text)', margin: '2px 0 0', letterSpacing: '-0.75px' }}>More Children Waiting For Help ❤️</h2>
            </div>
            <span style={{ fontSize: '12.5px', background: '#FEF3C7', color: '#D97706', padding: '6px 14px', borderRadius: '99px', fontWeight: 700 }}>4 Clinical Verifications</span>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: 28 
          }} className="waiting-children-grid">
            {ACTIVE_CAMPAIGNS.map((child) => (
              <motion.div
                key={child.id}
                variants={cardVariant}
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(123, 63, 0, 0.08)' }}
                style={{
                  background: '#fff',
                  borderRadius: '20px',
                  border: '1px solid var(--color-border)',
                  padding: '18px',
                  boxSizing: 'border-box',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '450px',
                  cursor: 'pointer'
                }}
                onClick={() => navigate('/main')}
              >
                <div>
                  <div style={{ position: 'relative', width: '100%', height: '170px', borderRadius: '14px', overflow: 'hidden', marginBottom: 14 }}>
                    <img 
                      src={child.image} 
                      alt={child.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      background: child.tag === 'Urgent Case' ? '#FEE2E2' : '#FEF3C7',
                      color: child.tag === 'Urgent Case' ? '#EF4444' : '#D97706',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: 800,
                      textTransform: 'uppercase'
                    }}>
                      {child.tag}
                    </div>
                  </div>

                  <h3 style={{ margin: '0 0 2px', fontSize: '17px', fontWeight: 800, color: 'var(--color-text)', fontFamily: 'Outfit' }}>{child.name}</h3>
                  <p style={{ margin: '0 0 8px', fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                    {child.age} old • {child.condition}
                  </p>
                  
                  <p style={{
                    fontSize: '12.5px',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.5,
                    margin: '0 0 16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {child.storyPreview}
                  </p>
                </div>

                <div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--color-text-muted)', marginBottom: 6 }}>
                      <span>Raised: <strong>₹{(child.raisedAmount/100000).toFixed(2)}L</strong></span>
                      <span>Goal: <strong>₹{(child.requiredAmount/100000).toFixed(2)}L</strong></span>
                    </div>
                    <DonationProgress raised={child.raisedAmount} required={child.requiredAmount} percentage={child.percentage} compact />
                  </div>

                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary" 
                    style={{ 
                      width: '100%', 
                      padding: '10px 14px', 
                      borderRadius: '10px', 
                      fontSize: '13px', 
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
                      border: 'none',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      cursor: 'pointer'
                    }}
                  >
                    Donate & Play <ChevronRight size={14} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ────────────────── 8. EXCITED & MYSTERY REWARD UNLOCK SYSTEM ────────────────── */}
        <section style={{ 
          background: 'linear-gradient(180deg, #FAF8F5 0%, #FFFDFB 100%)', 
          borderTop: '1px solid var(--color-border)', 
          borderBottom: '1px solid var(--color-border)', 
          padding: '80px 40px',
          overflow: 'hidden'
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 44 }} className="section-header-flex">
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={12} /> Mystery Reward Ecosystem
                </span>
                <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '28px', color: 'var(--color-text)', margin: '2px 0 0', letterSpacing: '-0.75px' }}>
                  Unlock Real Rewards While Helping ❤️
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '14.5px', color: 'var(--color-text-muted)' }}>
                  Tickets cost ₹10. Buy dynamic tickets to fund surgeries and unlock high-dopamine mystery vouchers immediately!
                </p>
              </div>
              <button 
                onClick={() => navigate('/main?tab=coupons')} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--color-primary)', 
                  fontWeight: 700, 
                  fontSize: '13.5px', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 4 
                }}
              >
                Explore Reward Store <ChevronRight size={16} />
              </button>
            </div>

            {/* 3 Premium Mystery Box Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 28 }} className="rewards-cards-grid">
              {MYSTERY_REWARDS.map((box) => (
                <motion.div 
                  key={box.id}
                  whileHover={{ 
                    y: -6, 
                    boxShadow: box.borderGlow,
                    borderColor: box.color 
                  }}
                  transition={{ duration: 0.25 }}
                  style={{
                    background: box.bg,
                    borderRadius: '28px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '350px',
                    boxSizing: 'border-box',
                    position: 'relative',
                    overflow: 'hidden',
                    color: '#fff'
                  }}
                >
                  {/* Subtle top light bar */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 28,
                    right: 28,
                    height: '2px',
                    background: `linear-gradient(90deg, transparent, ${box.color}, transparent)`
                  }} />

                  <div>
                    {/* Header Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                      <span style={{ 
                        fontSize: '9.5px', 
                        background: 'rgba(255,255,255,0.08)', 
                        color: box.color, 
                        border: `1px solid rgba(255,255,255,0.15)`,
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontWeight: 900, 
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase'
                      }}>
                        {box.badge}
                      </span>
                      <span style={{ fontSize: '12px', opacity: 0.5 }}>₹10 entry</span>
                    </div>

                    {/* Mystery visual graphic wrapper - Blurred Preview with question mark! */}
                    <div style={{
                      height: '80px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      marginBottom: 20
                    }}>
                      {/* Blurred ambient brand logo rows behind */}
                      <div style={{ display: 'flex', gap: 14, filter: 'blur(6px)', opacity: 0.25 }}>
                        <span>🔵 Paytm</span>
                        <span>🟢 GPay</span>
                        <span>🟡 Flipkart</span>
                      </div>

                      {/* Floating question mark overlay */}
                      <div style={{
                        position: 'absolute',
                        fontSize: '26px',
                        fontWeight: 900,
                        color: box.color,
                        textShadow: `0 0 12px ${box.color}`,
                        animation: 'pulse 2s infinite ease-in-out'
                      }}>
                        {box.illustration} Secret Reward Inside
                      </div>
                    </div>

                    <h3 style={{ margin: '0 0 6px', fontSize: '19px', fontWeight: 900, fontFamily: 'Outfit', color: '#fff', letterSpacing: '-0.3px' }}>
                      {box.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.45 }}>
                      {box.desc}
                    </p>
                  </div>

                  <div>
                    {/* Possible Brands Row */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8, 
                      fontSize: '11px', 
                      color: 'rgba(255,255,255,0.4)', 
                      borderTop: '1px solid rgba(255,255,255,0.06)', 
                      paddingTop: 12,
                      marginBottom: 16 
                    }}>
                      <span>Possible Vouchers:</span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {box.possibleRewards.map((brand, bIdx) => (
                          <span key={bIdx} style={{ color: '#fff', fontWeight: 700 }} title={brand.name}>
                            {brand.logo}
                          </span>
                        ))}
                      </div>
                    </div>

                    <motion.button 
                      onClick={() => handleTriggerMysteryReveal(box.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '12px',
                        border: 'none',
                        background: `linear-gradient(135deg, ${box.color}, #0F172A)`,
                        color: '#fff',
                        fontWeight: 900,
                        fontSize: '13.5px',
                        cursor: 'pointer',
                        boxShadow: `0 4px 15px rgba(0,0,0,0.3)`
                      }}
                    >
                      Unlock Box (₹10) 🗝️
                    </motion.button>
                  </div>

                </motion.div>
              ))}
            </div>

            {/* Possible Brands Carousel Bar */}
            <div style={{
              marginTop: 48,
              background: '#FAF2EA',
              border: '1px solid #EBD5C2',
              borderRadius: '20px',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16
            }} className="brands-bar-row">
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#8C4F1A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                🤝 Verified Sponsor Partners:
              </span>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {BRAND_PULL_LIST.map((brand, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', color: 'var(--color-text)' }}>
                    <span>{brand.logo}</span>
                    <strong style={{ fontWeight: 800 }}>{brand.name}</strong>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ────────────────── 9. RECENTLY FUNDED TREATMENTS (WALL OF JOY) ────────────────── */}
        <section style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Wall of Joy</span>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '28px', color: 'var(--color-text)', margin: '2px 0 0', letterSpacing: '-0.75px' }}>Recently Funded Treatments 🎉</h2>
            <p style={{ margin: '6px 0 0', fontSize: '14px', color: 'var(--color-text-muted)' }}>Real hospital success metrics driven entirely by the micro-gaming community.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
            {COMPLETED_TREATMENTS.map((child, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -4 }}
                style={{
                  background: '#fff',
                  border: '1px solid var(--color-border)',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  gap: 18,
                  alignItems: 'center'
                }}
              >
                <img 
                  src={child.image} 
                  alt={child.name} 
                  style={{ width: '84px', height: '84px', borderRadius: '14px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--color-text)', fontFamily: 'Outfit' }}>{child.name} ({child.age})</h4>
                    <span style={{ fontSize: '9px', background: '#dcfce7', color: '#16a34a', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>CURED</span>
                  </div>
                  <p style={{ margin: '4px 0 6px', fontSize: '12.5px', color: 'var(--color-text-muted)' }}>{child.illness}</p>
                  <span style={{ fontSize: '11.5px', color: '#B45309', fontWeight: 700 }}>Surgery funded successfully {child.date}!</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      {/* ────────────────── HIGH-DOPAMINE INTERACTIVE MYSTERY REVEAL MODAL ────────────────── */}
      <AnimatePresence>
        {activeRevealBox && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(12px)',
            padding: '20px'
          }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                borderRadius: '28px',
                padding: '40px',
                width: '100%',
                maxWidth: '460px',
                textAlign: 'center',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
                color: '#fff',
                position: 'relative'
              }}
            >
              
              {/* Shaking State */}
              {isShaking ? (
                <div style={{ padding: '20px 0' }}>
                  <motion.div
                    animate={{
                      x: [-6, 6, -6, 6, 0],
                      y: [-4, 4, -4, 4, 0],
                      rotate: [-2, 2, -2, 2, 0]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.18,
                      ease: 'easeInOut'
                    }}
                    style={{
                      fontSize: '72px',
                      marginBottom: 24,
                      filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.6))'
                    }}
                  >
                    🎁
                  </motion.div>
                  
                  <h3 style={{ fontSize: '22px', fontWeight: 900, fontFamily: 'Outfit', marginBottom: 8, letterSpacing: '-0.3px' }}>
                    Securing payment gateway...
                  </h3>
                  
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13.5px', margin: 0 }}>
                    SSL check successful. Generating micro-ticket settlement for Baby Aarav. Vouchers unlocking soon!
                  </p>
                </div>
              ) : (
                /* Success Reveal State - High Dopamine Celebration! */
                <div>
                  {/* Glowing success badge */}
                  <div style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10B981, #064E3B)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    margin: '0 auto 24px',
                    boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)'
                  }}>
                    🎉
                  </div>

                  <span style={{ fontSize: '10.5px', fontWeight: 900, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Unlock Success • Treatment Funded ❤️
                  </span>
                  
                  <h3 style={{ fontSize: '26px', fontWeight: 900, fontFamily: 'Outfit', margin: '6px 0 12px', letterSpacing: '-0.5px' }}>
                    {revealedResult?.title}
                  </h3>

                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.5, marginBottom: 20 }}>
                    {revealedResult?.detail} Thank you for your support! Your ₹9 clinical routing deposit has cleared immediately with Nanavati Max Hospital billers.
                  </p>

                  {/* Blurred Copy Promo Code Field */}
                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '12px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 28
                  }}>
                    <code style={{ fontSize: '14px', fontWeight: 700, color: '#FCD34D' }}>
                      {revealedResult?.code}
                    </code>
                    <button 
                      onClick={() => alert('Coupon code copied! Claim your reward at check out.')}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#fff',
                        padding: '6px 12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Copy Code
                    </button>
                  </div>

                  <button
                    onClick={handleCloseRevealModal}
                    style={{
                      width: '100%',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #10B981, #059669)',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '14.5px',
                      cursor: 'pointer'
                    }}
                  >
                    Awesome, Claim Reward ❤️
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />

      {/* Responsive adjustments */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.98); }
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
      `}</style>
    </div>
  )
}
