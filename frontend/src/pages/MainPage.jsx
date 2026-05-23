import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ChevronRight, Gamepad2, Tag, Quote as QuoteIcon, Gift, 
  LayoutGrid, Shield, Heart, Lock, ArrowRight, Sparkles, Check, Info, X
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DonationProgress from '../components/DonationProgress'
import { useDonation } from '../context/DonationContext'
import { useAuth } from '../context/AuthContext'
import TransparentBreakdown from '../components/TransparentBreakdown'

// ── Static premium data with SVGs / minimal styles ────────────────────
const MYSTERY_REWARDS = [
  {
    id: 'paytm',
    title: 'Calmness Promise Drop',
    brand: 'Exclusive Partner Gift',
    description: 'A genuine mystery support reward code promised by our leading healthcare and wellness brand partners.',
    price: 10,
    blurBg: 'linear-gradient(135deg, rgba(0, 41, 112, 0.08) 0%, rgba(0, 163, 224, 0.12) 100%)',
    accentColor: '#8C4F1A',
    teaserLogo: 'Gift'
  },
  {
    id: 'gpay',
    title: 'Golden Wellness Surprise',
    brand: 'Premium Care Drop',
    description: 'Unlock a guaranteed surprise partner perk curated specifically to celebrate your generous gameplay.',
    price: 10,
    blurBg: 'linear-gradient(135deg, rgba(234, 67, 53, 0.08) 0%, rgba(66, 133, 244, 0.12) 100%)',
    accentColor: '#8C4F1A',
    teaserLogo: 'Gift'
  },
  {
    id: 'amazon',
    title: 'Serene Care Bonus',
    brand: 'Wellness Sponsor Reward',
    description: 'Enjoy a surprise healthcare voucher or exclusive brand drop provided by our dedicated care partners.',
    price: 20,
    blurBg: 'linear-gradient(135deg, rgba(255, 153, 0, 0.08) 0%, rgba(0, 0, 0, 0.1) 100%)',
    accentColor: '#8C4F1A',
    teaserLogo: 'Gift'
  },
  {
    id: 'swiggy',
    title: 'Care Circle Gift',
    brand: 'Mindfulness Gift Drop',
    description: 'A surprise lifestyle code or wellness reward drops promised by top organic lifestyle sponsors.',
    price: 10,
    blurBg: 'linear-gradient(135deg, rgba(252, 128, 25, 0.08) 0%, rgba(252, 128, 25, 0.15) 100%)',
    accentColor: '#8C4F1A',
    teaserLogo: 'Gift'
  },
  {
    id: 'flipkart',
    title: 'Pure Joy Voucher',
    brand: 'Hospital Sponsor Drop',
    description: 'Unlock a promised surprise wellness credit or positive living voucher from our wellness partners.',
    price: 20,
    blurBg: 'linear-gradient(135deg, rgba(40, 116, 240, 0.08) 0%, rgba(255, 222, 0, 0.12) 100%)',
    accentColor: '#8C4F1A',
    teaserLogo: 'Gift'
  },
  {
    id: 'healing-token',
    title: 'Hope & Healing Token',
    brand: 'Special Support Code',
    description: 'A surprise healing reward promised by our leading healthcare and mindfulness partners to support your recovery quest.',
    price: 30,
    blurBg: 'linear-gradient(135deg, rgba(71, 104, 44, 0.08) 0%, rgba(71, 104, 44, 0.15) 100%)',
    accentColor: '#8C4F1A',
    teaserLogo: 'Gift'
  }
]

const PREMIUM_GAMES = [
  {
    id: 'spin',
    title: 'Spin the Care Wheel',
    description: 'Take a gentle, joyful spin to instantly direct ₹10 from corporate sponsors to Aarav\'s medical fund.',
    price: 10,
    illustration: (
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="wheelGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF4EA" />
            <stop offset="100%" stopColor="#FAF0E6" />
          </radialGradient>
        </defs>
        <circle cx="50%" cy="50%" r="42" fill="url(#wheelGlow)" stroke="#F0E0D0" strokeWidth="1" />
        <circle cx="50%" cy="50%" r="35" fill="none" stroke="#E6CDB8" strokeWidth="1.5" strokeDasharray="3, 3" />
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '50px', originY: '50px' }}
        >
          <path d="M50 15 L50 85 M15 50 L85 50 M25 25 L75 75 M25 75 L75 25" stroke="#E3C3A7" strokeWidth="1" />
          <circle cx="50" cy="18" r="4" fill="#E8A87C" />
          <circle cx="50" cy="82" r="4" fill="#E8A87C" />
          <circle cx="18" cy="50" r="4" fill="#E8A87C" />
          <circle cx="82" cy="50" r="4" fill="#E8A87C" />
        </motion.g>
        <circle cx="50" cy="50" r="14" fill="#fff" style={{ filter: 'drop-shadow(0 2px 4px rgba(140,79,26,0.1))' }} />
        <path d="M47 48 H53 V52 H47 Z" fill="#8C4F1A" />
        <path d="M50 43 L54 48 H46 Z" fill="#8C4F1A" />
      </svg>
    )
  },
  {
    id: 'scratch',
    title: 'Scratch & Heal Card',
    description: 'Gently wipe the gold leaf surface to reveal a personalized wellness quote and trigger treatment support.',
    price: 10,
    illustration: (
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <rect x="15" y="15" width="70" height="70" rx="12" fill="#FCFAF8" stroke="#F0E0D0" strokeWidth="1" />
        <rect x="22" y="22" width="56" height="56" rx="8" fill="linear-gradient(135deg, #FFF9F3 0%, #FAF0E6 100%)" />
        <motion.g
          animate={{ y: [0, -3, 0], x: [0, 4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <rect x="26" y="26" width="48" height="48" rx="6" fill="#F3E5D8" stroke="#E8D2BF" strokeWidth="1" />
          <path d="M38 42 L62 58 M62 42 L38 58" stroke="#DFBA9D" strokeWidth="1.5" />
        </motion.g>
        <circle cx="50" cy="50" r="12" fill="#fff" />
        <path d="M48 45 L52 45 L53 53 L47 53 Z" fill="#8C4F1A" />
        <circle cx="50" cy="56" r="1.5" fill="#8C4F1A" />
      </svg>
    )
  },
  {
    id: 'memory',
    title: 'Mindful Memory Match',
    description: 'Find matching calming pairs in a beautifully simple cognitive layout to trigger sponsor matches.',
    price: 20,
    illustration: (
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <g transform="translate(18, 18)">
          <rect x="0" y="0" width="28" height="28" rx="6" fill="#FFF9F3" stroke="#E8D2BF" strokeWidth="1.2" />
          <circle cx="14" cy="14" r="5" fill="#E8A87C" />
        </g>
        <g transform="translate(54, 18)">
          <rect x="0" y="0" width="28" height="28" rx="6" fill="#FFF9F3" stroke="#E8D2BF" strokeWidth="1.2" />
          <path d="M14 8 L20 20 H8 Z" fill="#E8A87C" />
        </g>
        <g transform="translate(18, 54)">
          <rect x="0" y="0" width="28" height="28" rx="6" fill="#FFF5ED" stroke="#E8D2BF" strokeWidth="1.2" />
          <path d="M14 8 L20 20 H8 Z" fill="#E8A87C" />
        </g>
        <g transform="translate(54, 54)">
          <rect x="0" y="0" width="28" height="28" rx="6" fill="#FFF9F3" stroke="#E8D2BF" strokeWidth="1.2" />
          <rect x="9" y="9" width="10" height="10" fill="#E8A87C" />
        </g>
      </svg>
    )
  },
  {
    id: 'treasure',
    title: 'Healing Treasure Hunt',
    description: 'Journey through a beautifully serene minimal map, discovering milestones that fund critical hospital supplies.',
    price: 20,
    illustration: (
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <path d="M20 50 C 35 25, 45 75, 80 50" fill="none" stroke="#E8D2BF" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4, 4" />
        <circle cx="20" cy="50" r="6" fill="#E8A87C" />
        <circle cx="80" cy="50" r="8" fill="#8C4F1A" />
        <path d="M77 46 L83 54 M83 46 L77 54" stroke="#fff" strokeWidth="1.5" />
        <motion.circle
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          cx="48" cy="52" r={5} fill="#E8A87C" opacity="0.4"
        />
        <circle cx="48" cy="52" r={3} fill="#E8A87C" />
      </svg>
    )
  },
  {
    id: 'calm-tap',
    title: 'Calm Tap Challenge',
    description: 'Breathe and tap expanding circles at their peak alignment to generate sponsor hospital credits.',
    price: 10,
    illustration: (
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <motion.circle
          animate={{ r: [15, 38, 15], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          cx="50" cy="50" r={25} fill="none" stroke="#E8A87C" strokeWidth="2"
        />
        <circle cx="50" cy="50" r={12} fill="#8C4F1A" />
        <circle cx="50" cy="50" r="32" fill="none" stroke="#E8D2BF" strokeWidth="1" strokeDasharray="6, 4" />
      </svg>
    )
  },
  {
    id: 'hope-puzzle',
    title: 'Hope Tile Puzzle',
    description: 'Arrange matching therapeutic clinical icons cleanly to release custom matching sponsor rewards.',
    price: 20,
    illustration: (
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <rect x="20" y="20" width="60" height="60" rx="8" fill="#FCFAF8" stroke="#F0E0D0" strokeWidth="1.2" />
        <line x1="40" y1="20" x2="40" y2="80" stroke="#F0E0D0" strokeWidth="1" />
        <line x1="60" y1="20" x2="60" y2="80" stroke="#F0E0D0" strokeWidth="1" />
        <line x1="20" y1="40" x2="80" y2="40" stroke="#F0E0D0" strokeWidth="1" />
        <line x1="20" y1="60" x2="80" y2="60" stroke="#F0E0D0" strokeWidth="1" />
        <motion.circle
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          cx="50" cy="50" r={6} fill="#E8A87C"
        />
      </svg>
    )
  },
  {
    id: 'light-path',
    title: 'Light Path Journey',
    description: 'Trace glowing points of healing light through a calming forest path to secure child aid.',
    price: 10,
    illustration: (
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <path d="M15 80 Q 35 20, 50 50 T 85 20" fill="none" stroke="#E6D4C3" strokeWidth="2.5" strokeLinecap="round" />
        <motion.circle
          animate={{ offsetDistance: ["0%", "100%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          r={5} fill="#8C4F1A"
          style={{ motionPath: 'path("M15 80 Q 35 20, 50 50 T 85 20")' }}
        />
        <circle cx="15" cy="80" r="3" fill="#E8A87C" />
        <circle cx="85" cy="20" r="3" fill="#E8A87C" />
      </svg>
    )
  },
  {
    id: 'sponsor-match',
    title: 'Sponsor Match Quest',
    description: 'Bridge two major brand partners directly to unlock double matching contributions instantly.',
    price: 20,
    illustration: (
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <circle cx="30" cy="50" r="12" fill="#FFF2EA" stroke="#E8A87C" strokeWidth="1" />
        <circle cx="70" cy="50" r="12" fill="#FFF2EA" stroke="#E8A87C" strokeWidth="1" />
        <motion.line
          animate={{ strokeDashoffset: [0, -20] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          x1="42" y1="50" x2="58" y2="50" stroke="#8C4F1A" strokeWidth="2" strokeDasharray="4, 4"
        />
        <circle cx="50" cy="50" r="5" fill="#8C4F1A" />
      </svg>
    )
  },
  {
    id: 'gratitude-drop',
    title: 'Gratitude Drop',
    description: 'Catch slowly descending bubbles of positive emotional recovery to route free hospital split bonuses.',
    price: 0,
    illustration: (
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <motion.circle
          animate={{ y: [80, 20], opacity: [0, 0.7, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          cx="35" cy="50" r={7} fill="#E8A87C"
        />
        <motion.circle
          animate={{ y: [90, 10], opacity: [0, 0.6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          cx="65" cy="50" r={9} fill="#8C4F1A"
        />
      </svg>
    )
  }
]

const INSPIRATIONAL_CARDS = [
  {
    title: 'Baby Aarav\'s Healing Milestone',
    description: 'Thanks to over 4,200 small gaming plays, Aarav\'s pre-operation checkup has been fully funded.',
    curiosity: 'Discover the heartfelt recovery milestone shared by Aarav\'s family after successful pre-op stabilization.',
    tag: 'SUCCESS STORY',
    accent: '#8C4F1A',
    bg: '#FAF4EE',
    price: 10
  },
  {
    title: 'Words of Hope from Pediatric Care',
    description: '"Every single 10-rupee gameplay helps us secure reliable bedside monitoring faster than traditional fundraising."',
    curiosity: 'Unlock an exclusive clinical voice recording message from the lead pediatric nursing officer at the hospital ward.',
    tag: 'CLINICAL VOICE',
    accent: '#47682C',
    bg: '#F3F6F0',
    price: 20
  },
  {
    title: 'How Transparency Empowers You',
    description: 'We map every transaction ID directly to the hospital\'s billing terminal. Trust is built on complete clarity.',
    curiosity: 'Reveal the transparent ledger framework that guarantees your contribution arrives directly to the ward desk.',
    tag: 'OUR PROMISE',
    accent: '#1E3A5F',
    bg: '#F0F4F8',
    price: 30
  }
]



const TABS = [
  { id: 'all', label: 'All Unlocks' },
  { id: 'games', label: 'Games 🎮' },
  { id: 'coupons', label: 'Coupons 🎁' },
  { id: 'quotes', label: 'Quotes 💬' },
  { id: 'free-help', label: 'Free Help ❤️' }
]

export default function MainPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [customAmount, setCustomAmount] = useState('')
  const [selectedPreset, setSelectedPreset] = useState(100)
  
  const navigate = useNavigate()
  const { user } = useAuth()
  const { confirmDonation } = useDonation()

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  // Premium Certificate Form Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingPrice, setPendingPrice] = useState(null)
  const [formData, setFormData] = useState({ name: '', mobile: '', email: '' })
  const [errors, setErrors] = useState({ name: '', email: '' })

  // ESC Key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleUnlock = (price) => {
    setPendingPrice(price)
    setIsModalOpen(true)
  }

  const handleDirectDonate = () => {
    const amount = customAmount ? parseInt(customAmount) : selectedPreset
    if (amount > 0) {
      handleUnlock(amount)
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Full Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Save details
    localStorage.setItem('hp_user_name', formData.name.trim())
    localStorage.setItem('hp_user_mobile', formData.mobile.trim())
    localStorage.setItem('hp_user_email', formData.email.trim())

    // Proceed to payment
    setIsModalOpen(false)
    confirmDonation(pendingPrice)
    navigate('/thank-you')
  }

  const show = (key) => activeTab === 'all' || activeTab === key

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent', color: '#332211' }}>
      <Navbar />

      <main style={{ flex: 1, width: '100%', paddingBottom: 120 }}>
        

        {/* ── PREMIUM FILTER PILLS (Replaces Sidebar) ── */}
        <div style={{ maxWidth: 1360, margin: '80px auto 0', padding: '0 48px', textAlign: 'center', boxSizing: 'border-box' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(139,94,52,0.06)', border: '1px solid rgba(139,94,52,0.12)',
            borderRadius: 99, padding: '6px 18px', marginBottom: 20
          }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: '#8B5E34', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Discovery Portal
            </span>
          </div>

          <h2 className="premium-title-lg" style={{ textAlign: 'center' }}>
            Unlock Joy While{' '}
            <span className="text-gradient-animate">
              Healing ❤️
            </span>
          </h2>

          <p style={{ 
            margin: '0 auto 40px', 
            maxWidth: 560, 
            fontSize: '16.5px', 
            color: '#7A6A58', 
            fontWeight: 500, 
            lineHeight: 1.7 
          }}>
            Direct support contributions to Baby Aarav's medical fund while gaining access to surprise wellness rewards, immersive minimal games, and stories.
          </p>

          <div style={{ 
            display: 'inline-flex', 
            gap: 10, 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'rgba(235, 224, 214, 0.25)',
            padding: '8px',
            borderRadius: '24px',
            border: '1px solid rgba(235, 224, 214, 0.4)',
            flexWrap: 'wrap'
          }}>
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  padding: '12px 26px',
                  borderRadius: '18px',
                  border: 'none',
                  background: activeTab === id ? '#fff' : 'transparent',
                  color: activeTab === id ? '#8B5E34' : '#7A6A5A',
                  fontWeight: 700,
                  fontSize: 13.5,
                  cursor: 'pointer',
                  boxShadow: activeTab === id ? '0 6px 16px rgba(139, 94, 52, 0.06)' : 'none',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── CENTRALIZED CONTENT GRID ── */}
        <div style={{ maxWidth: 1360, margin: '56px auto 0', padding: '0 48px', boxSizing: 'border-box' }}>
          
          {/* ────────────────── 1. GAMES SECTION ────────────────── */}
          {show('games') && (
            <section style={{ marginBottom: 90 }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                textAlign: 'center', 
                marginBottom: 36,
                padding: '24px 0',
                background: 'radial-gradient(50% 50% at 50% 50%, rgba(235, 224, 214, 0.15) 0%, rgba(255, 255, 255, 0) 100%)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(139,94,52,0.06)', border: '1px solid rgba(139,94,52,0.12)',
                  borderRadius: 99, padding: '6px 18px', marginBottom: 20
                }}>
                  <span style={{ fontSize: 11, fontWeight: 900, color: '#8B5E34', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Interactive Healing Moments
                  </span>
                </div>

                <h3 className="premium-title-md">
                  Healing Through{' '}
                  <span className="text-gradient-animate">
                    Play 🎮
                  </span>
                </h3>

                <p style={{ 
                  margin: '0 auto 24px', 
                  fontSize: '16px', 
                  color: '#7A6A58', 
                  maxWidth: 540, 
                  lineHeight: 1.7, 
                  fontWeight: 500 
                }}>
                  Calm your mind with interactive micro-games while direct funding life-saving treatments.
                </p>
                <div style={{ height: '1px', width: '60px', background: 'rgba(139, 94, 52, 0.25)', marginTop: 16 }} />
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
                gap: 32 
              }}>
                {PREMIUM_GAMES.map((game) => (
                  <motion.div
                    key={game.id}
                    whileHover={{ 
                      y: -8, 
                      boxShadow: '0 24px 48px rgba(122, 78, 43, 0.12), 0 4px 12px rgba(0, 0, 0, 0.03)' 
                    }}
                    onClick={() => handleUnlock(game.price)}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(220, 208, 195, 0.7)',
                      borderRadius: '32px',
                      boxShadow: '0 12px 36px rgba(122, 78, 43, 0.06), 0 2px 8px rgba(0, 0, 0, 0.02)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      minHeight: 410
                    }}
                  >
                    {/* SVG Illustration Container */}
                    <div style={{ 
                      height: 160, 
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.45) 100%)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      padding: 20,
                      borderBottom: '1px solid rgba(235, 224, 214, 0.3)'
                    }}>
                      <div style={{ width: '100%', height: '100%', maxWidth: 120, maxHeight: 120 }}>
                        {game.illustration}
                      </div>
                    </div>

                    <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 20 }}>
                      <div>
                        <h4 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: '#4A3427', fontFamily: 'Outfit' }}>{game.title}</h4>
                        <p style={{ margin: 0, fontSize: '13.5px', color: '#7A6A5A', lineHeight: 1.75, fontWeight: 500 }}>{game.description}</p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(235, 224, 214, 0.4)', paddingTop: '16px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#8B5E34', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {game.price === 0 ? 'Free Experience' : `₹${game.price} Entry Code`}
                        </span>
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 6, 
                            color: '#fff', 
                            fontWeight: 700, 
                            fontSize: '12.5px',
                            background: 'linear-gradient(135deg, #9A673A, #7A4E2B)',
                            padding: '10px 20px',
                            borderRadius: '14px',
                            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 6px 16px rgba(122, 78, 43, 0.16)'
                          }}
                        >
                          <span>{game.price === 0 ? 'Start Playing' : `Unlock for ₹${game.price}`}</span>
                          <ChevronRight size={13} />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ────────────────── 2. COUPONS / MYSTERY REWARDS SECTION ────────────────── */}
          {show('coupons') && (
            <section style={{ marginBottom: 90 }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                textAlign: 'center', 
                marginBottom: 36,
                padding: '24px 0',
                background: 'radial-gradient(50% 50% at 50% 50%, rgba(235, 224, 214, 0.15) 0%, rgba(255, 255, 255, 0) 100%)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(139,94,52,0.06)', border: '1px solid rgba(139,94,52,0.12)',
                  borderRadius: 99, padding: '6px 18px', marginBottom: 20
                }}>
                  <span style={{ fontSize: 11, fontWeight: 900, color: '#8B5E34', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Curated Mystery Rewards
                  </span>
                </div>

                <h3 className="premium-title-md">
                  Play With{' '}
                  <span className="text-gradient-animate">
                    Purpose 🎁
                  </span>
                </h3>

                <p style={{ 
                  margin: '0 auto 24px', 
                  fontSize: '16px', 
                  color: '#7A6A58', 
                  maxWidth: 540, 
                  lineHeight: 1.7, 
                  fontWeight: 500 
                }}>
                  Unlock hidden surprise brand vouchers securely. Brand reward codes are kept completely secret before payment.
                </p>
                <div style={{ height: '1px', width: '60px', background: 'rgba(139, 94, 52, 0.25)', marginTop: 16 }} />
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
                gap: 32 
              }}>
                {MYSTERY_REWARDS.map((reward) => (
                  <motion.div
                    key={reward.id}
                    whileHover={{ 
                      y: -8, 
                      boxShadow: '0 24px 48px rgba(122, 78, 43, 0.12), 0 4px 12px rgba(0, 0, 0, 0.03)' 
                    }}
                    onClick={() => handleUnlock(reward.price)}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(220, 208, 195, 0.7)',
                      borderRadius: '32px',
                      boxShadow: '0 12px 36px rgba(122, 78, 43, 0.06), 0 2px 8px rgba(0, 0, 0, 0.02)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative',
                      minHeight: 410
                    }}
                  >
                    {/* Blurred Secret Preview Area */}
                    <div style={{ 
                      height: 160, 
                      background: reward.blurBg, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      borderBottom: '1px solid rgba(235, 224, 214, 0.3)'
                    }}>
                      <div className="shimmer-bg" style={{ position: 'absolute', inset: 0, opacity: 0.15 }} />
                      
                      {/* Blurred teaser gift card */}
                      <div style={{
                        width: 150,
                        height: 90,
                        background: 'rgba(255, 255, 255, 0.45)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '14px',
                        border: '1px solid rgba(255, 255, 255, 0.7)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '12px',
                        boxShadow: '0 8px 24px rgba(139, 94, 52, 0.03)',
                        transform: 'rotate(-4deg)',
                        transition: 'all 0.3s'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 9.5, fontWeight: 800, color: reward.accentColor, opacity: 0.75, letterSpacing: '0.04em' }}>MYSTERY GIFT</span>
                          <Lock size={10.5} color={reward.accentColor} />
                        </div>
                        <div style={{ textAlign: 'center', margin: '4px 0' }}>
                          <span style={{ fontSize: 19, fontWeight: 900, color: '#8B5E34', opacity: 0.3, letterSpacing: '2px', filter: 'blur(1.5px)' }}>
                            ✨?✨
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 9.5, fontWeight: 700, color: '#8B5E34' }}>₹?? Worth</span>
                          <div style={{ width: 12, height: 12, borderRadius: '50%', background: reward.accentColor, opacity: 0.6 }} />
                        </div>
                      </div>

                      {/* Lock Icon Badge */}
                      <div style={{
                        position: 'absolute',
                        bottom: 16,
                        background: '#FAF6F0',
                        border: '1px solid rgba(139, 94, 52, 0.15)',
                        padding: '5px 12px',
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}>
                        <Lock size={11.5} color="#8B5E34" />
                        <span style={{ fontSize: 10, fontWeight: 800, color: '#8B5E34', letterSpacing: '0.02em', textTransform: 'uppercase' }}>SECURE REVEAL</span>
                      </div>
                    </div>

                    <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column', justifySelf: 'space-between', justifyContent: 'space-between', gap: 20 }}>
                      <div>
                        <h4 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: '#4A3427', fontFamily: 'Outfit' }}>{reward.title}</h4>
                        <p style={{ margin: 0, fontSize: '13.5px', color: '#7A6A5A', lineHeight: 1.75, fontWeight: 500 }}>{reward.description}</p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(235, 224, 214, 0.4)', paddingTop: '16px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#8B5E34', textTransform: 'uppercase', letterSpacing: '0.04em' }}>₹{reward.price} Reward Code</span>
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 6, 
                            color: '#fff', 
                            fontWeight: 700, 
                            fontSize: '12.5px',
                            background: 'linear-gradient(135deg, #9A673A, #7A4E2B)',
                            padding: '10px 20px',
                            borderRadius: '14px',
                            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 6px 16px rgba(122, 78, 43, 0.16)'
                          }}
                        >
                          <span>Unlock for ₹{reward.price}</span>
                          <ChevronRight size={13} />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ────────────────── 3. QUOTES & INSPIRATION SECTION ────────────────── */}
          {show('quotes') && (
            <section style={{ marginBottom: 90 }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                textAlign: 'center', 
                marginBottom: 36,
                padding: '24px 0',
                background: 'radial-gradient(50% 50% at 50% 50%, rgba(235, 224, 214, 0.15) 0%, rgba(255, 255, 255, 0) 100%)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(139,94,52,0.06)', border: '1px solid rgba(139,94,52,0.12)',
                  borderRadius: 99, padding: '6px 18px', marginBottom: 20
                }}>
                  <span style={{ fontSize: 11, fontWeight: 900, color: '#8B5E34', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Healing Capsules
                  </span>
                </div>

                <h3 className="premium-title-md">
                  Mindful Healing{' '}
                  <span className="text-gradient-animate">
                    Games ✨
                  </span>
                </h3>

                <p style={{ 
                  margin: '0 auto 24px', 
                  fontSize: '16px', 
                  color: '#7A6A58', 
                  maxWidth: 540, 
                  lineHeight: 1.7, 
                  fontWeight: 500 
                }}>
                  Unlock heartwarming gratitude messages, survivor audio stories, and positive pediatric recovery journals.
                </p>
                <div style={{ height: '1px', width: '60px', background: 'rgba(139, 94, 52, 0.25)', marginTop: 16 }} />
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
                gap: 32 
              }}>
                {INSPIRATIONAL_CARDS.map((card, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ 
                      y: -8, 
                      boxShadow: '0 24px 48px rgba(122, 78, 43, 0.12), 0 4px 12px rgba(0, 0, 0, 0.03)' 
                    }}
                    onClick={() => handleUnlock(card.price)}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '32px',
                      padding: '36px',
                      cursor: 'pointer',
                      border: '1px solid rgba(220, 208, 195, 0.7)',
                      boxShadow: '0 12px 36px rgba(122, 78, 43, 0.06), 0 2px 8px rgba(0, 0, 0, 0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: 280,
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <span style={{ fontSize: '9.5px', fontWeight: 800, color: card.accent, letterSpacing: '0.05em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.7)', padding: '4px 10px', borderRadius: '8px', border: `1px solid rgba(235, 224, 214, 0.3)` }}>
                          {card.tag}
                        </span>
                        
                        <div style={{
                          background: '#FAF6F0',
                          border: '1px solid rgba(139, 94, 52, 0.15)',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}>
                          <Lock size={10} color="#8B5E34" />
                          <span style={{ fontSize: 9, fontWeight: 800, color: '#8B5E34', letterSpacing: '0.02em' }}>LOCKED</span>
                        </div>
                      </div>

                      <h4 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: 700, color: '#4A3427', fontFamily: 'Outfit', lineHeight: 1.4 }}>
                        {card.title}
                      </h4>
                      
                      {/* Premium locked mask layout */}
                      <div style={{ margin: '14px 0 0', position: 'relative' }}>
                        <p style={{ margin: '0 0 12px', fontSize: '13.5px', color: '#7A6A5A', lineHeight: 1.7, fontWeight: 600, fontStyle: 'italic' }}>
                          “{card.curiosity}”
                        </p>
                        
                        {/* Elegant blurred mockup text */}
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#A8998A', 
                          letterSpacing: '3px', 
                          filter: 'blur(3.5px)', 
                          userSelect: 'none', 
                          opacity: 0.45,
                          lineHeight: 1.8
                        }}>
                          •••••••••••• •••••••••••• •••••••••••• •••••••••••• •••••••••••• ••••••••••••
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(235, 224, 214, 0.4)' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#8B5E34', letterSpacing: '0.04em' }}>₹{card.price} Contribution</span>
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 6, 
                          color: '#fff', 
                          fontWeight: 700, 
                          fontSize: '12.5px',
                          background: 'linear-gradient(135deg, #9A673A, #7A4E2B)',
                          padding: '10px 20px',
                          borderRadius: '14px',
                          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 6px 16px rgba(122, 78, 43, 0.16)'
                        }}
                      >
                        <span>Reveal Healing Message</span>
                        <ChevronRight size={13} />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ────────────────── 4. FREE TO HELP SECTION ────────────────── */}
          {show('free-help') && (
            <section style={{ marginBottom: 110, maxWidth: 840, margin: '0 auto 110px' }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                textAlign: 'center', 
                marginBottom: 36,
                padding: '24px 0',
                background: 'radial-gradient(50% 50% at 50% 50%, rgba(235, 224, 214, 0.15) 0%, rgba(255, 255, 255, 0) 100%)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(139,94,52,0.06)', border: '1px solid rgba(139,94,52,0.12)',
                  borderRadius: 99, padding: '6px 18px', marginBottom: 20
                }}>
                  <span style={{ fontSize: 11, fontWeight: 900, color: '#8B5E34', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Simple Pure Support
                  </span>
                </div>

                <h3 style={{ 
                  fontFamily: 'Outfit', 
                  fontWeight: 900, 
                  fontSize: 'clamp(32px, 4.5vw, 48px)', 
                  color: '#3D2B1A', 
                  margin: '0 0 12px', 
                  letterSpacing: '-1.8px', 
                  lineHeight: 1.15 
                }}>
                  Help Without{' '}
                  <span style={{ background: 'linear-gradient(135deg, #8B5E34, #C8773A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Rewards ❤️
                  </span>
                </h3>

                <p style={{ 
                  margin: '0 auto 24px', 
                  fontSize: '16px', 
                  color: '#7A6A58', 
                  maxWidth: 540, 
                  lineHeight: 1.7, 
                  fontWeight: 500 
                }}>
                  Every single rupee goes directly towards Baby Aarav's medical balance sheet at the hospital billing desk.
                </p>
                <div style={{ height: '1px', width: '60px', background: 'rgba(139, 94, 52, 0.25)', marginTop: 16 }} />
              </div>

              <div style={{
                background: '#FFFFFF',
                border: '1px solid rgba(220, 208, 195, 0.7)',
                borderRadius: '36px',
                padding: '48px',
                boxShadow: '0 12px 36px rgba(122, 78, 43, 0.06), 0 2px 8px rgba(0, 0, 0, 0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#FFF2EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Heart size={22} color="#8B5E34" fill="#8B5E34" />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '19px', fontWeight: 700, color: '#4A3427', fontFamily: 'Outfit' }}>Direct Hospital Support</h4>
                      <p style={{ margin: '3px 0 0', fontSize: '13.5px', color: '#7A6A5A', fontWeight: 500 }}>Real-time pediatric ward terminal split routing</p>
                    </div>
                  </div>

                  <div style={{
                    background: '#EAF5E2',
                    border: '1px solid rgba(71, 104, 44, 0.2)',
                    borderRadius: '12px',
                    padding: '6px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#47682C' }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#47682C', letterSpacing: '0.04em', textTransform: 'uppercase' }}>VERIFIED TERMINAL</span>
                  </div>
                </div>

                <label style={{ fontSize: '11px', fontWeight: 800, color: '#8B5E34', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 14 }}>
                  Select Contribution Amount
                </label>

                {/* Preset Chips */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
                  {[100, 250, 500, 1000].map((preset) => {
                    const isSelected = selectedPreset === preset && !customAmount;
                    return (
                      <motion.button
                        key={preset}
                        whileHover={{ y: -2 }}
                        onClick={() => {
                          setSelectedPreset(preset)
                          setCustomAmount('')
                        }}
                        style={{
                          padding: '14px 0',
                          borderRadius: '16px',
                          border: isSelected ? 'none' : '1px solid rgba(235, 224, 214, 0.7)',
                          background: isSelected ? 'linear-gradient(135deg, #9A673A, #7A4E2B)' : '#fff',
                          color: isSelected ? '#fff' : '#7A6A5A',
                          fontWeight: 700,
                          fontSize: '14.5px',
                          cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                          boxShadow: isSelected 
                            ? 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 8px 16px rgba(122, 78, 43, 0.16)' 
                            : '0 2px 6px rgba(139, 94, 52, 0.02)'
                        }}
                      >
                        ₹{preset}
                      </motion.button>
                    );
                  })}
                </div>

                <div style={{ marginBottom: 32 }}>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#8B5E34', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 10 }}>
                    Or Enter Custom Amount (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter custom support amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setSelectedPreset(0)
                    }}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      borderRadius: '16px',
                      border: '1px solid rgba(232, 224, 214, 0.8)',
                      fontSize: '15px',
                      fontWeight: 600,
                      boxSizing: 'border-box',
                      outline: 'none',
                      background: '#FFF',
                      color: '#4A3427',
                      transition: 'border-color 0.2s',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.01)'
                    }}
                  />
                </div>

                {/* Direct Hospital Trust Info Panel */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.45)',
                  border: '1px solid rgba(235, 224, 214, 0.5)',
                  borderRadius: '24px',
                  padding: '24px',
                  marginBottom: 32,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 20
                }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <Shield size={18} color="#8B5E34" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <h5 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#4A3427' }}>Split-Term Routing Guarantee</h5>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: '#7A6A5A', lineHeight: 1.6 }}>100% of contributions land directly inside Baby Aarav\'s pre-op stabilization billing account (Fortis ID #F89410).</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <Shield size={18} color="#47682C" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <h5 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#47682C' }}>Public Ledger Ledgering</h5>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: '#7A6A5A', lineHeight: 1.6 }}>Real-time cryptographic audit trail verified. Public records index is open to every gameplay micro-donator.</p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  onClick={handleDirectDonate}
                  style={{
                    width: '100%',
                    padding: '18px',
                    borderRadius: '18px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #9A673A, #7A4E2B)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '15px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 8px 24px rgba(122, 78, 43, 0.18)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <Heart size={16} fill="#fff" />
                  <span>Contribute Freely</span>
                </motion.button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 20, fontSize: '11px', color: '#7C6B5B', fontWeight: 600 }}>
                  <Shield size={12} color="#47682C" />
                  <span>100% Direct Hospital Split Routing. Public Ledger Verified.</span>
                </div>
              </div>
            </section>
          )}



          {/* Audit Verification Block */}
          <div style={{ 
            background: 'linear-gradient(135deg, #FFF9F3 0%, #FAF0E6 100%)', 
            borderRadius: '24px', 
            padding: '24px 32px', 
            border: '1px solid rgba(232, 224, 214, 0.6)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap', 
            gap: 16,
            marginTop: 64,
            boxShadow: '0 4px 20px rgba(140, 79, 26, 0.01)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13.5, color: '#5C4C3C', fontWeight: 500 }}>
              <Shield size={18} color="#8C4F1A" />
              <span>100% of your micro-donation goes directly towards Baby Aarav\'s medical fund balance. Zero corporate hidden commissions.</span>
            </div>
            <button style={{ background: 'none', border: 'none', fontSize: 13.5, fontWeight: 800, color: '#8C4F1A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>Auditing Dashboard</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </main>

      {/* ── PREMIUM CENTER MODAL POPUP ── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(26, 17, 10, 0.45)', // dark transparent warm backdrop
              backdropFilter: 'blur(8px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              boxSizing: 'border-box'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.45, bounce: 0.15 }}
              onClick={(e) => e.stopPropagation()} // Prevent close on modal body click
              style={{
                background: 'rgba(255, 253, 250, 0.94)', // soft cream glassmorphism
                border: '1px solid rgba(139, 94, 52, 0.22)',
                boxShadow: '0 24px 60px rgba(74, 52, 39, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                borderRadius: '28px',
                width: '100%',
                maxWidth: '520px',
                padding: '36px',
                boxSizing: 'border-box',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                color: '#3D2B1A'
              }}
            >
              {/* Close Button in corner */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(139, 94, 52, 0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#8B5E34',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 94, 52, 0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(139, 94, 52, 0.08)'}
              >
                <X size={16} />
              </button>

              {/* Modal Title Block */}
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#8B5E34', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
                  <Sparkles size={12} /> Healing Contribution
                </span>
                <h2 className="premium-title-sm" style={{ margin: '0 0 8px' }}>
                  Before Unlocking ✨
                </h2>
                <p style={{ margin: 0, fontSize: '14px', color: '#7A6A5A', lineHeight: 1.5, fontWeight: 500 }}>
                  Help us generate your personalized contribution certificate after support.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Full Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#5A4635', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Priyanshu Sharma"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      if (errors.name) setErrors({ ...errors, name: '' })
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '16px',
                      border: errors.name ? '1.5px solid #E11D48' : '1px solid rgba(139, 94, 52, 0.25)',
                      background: '#FFFFFF',
                      boxShadow: 'inset 0 2px 4px rgba(74, 52, 39, 0.02)',
                      fontSize: '14.5px',
                      color: '#3D2B1A',
                      outline: 'none',
                      fontFamily: 'Outfit',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease'
                    }}
                  />
                  {errors.name && <span style={{ fontSize: '11.5px', color: '#E11D48', fontWeight: 600 }}>{errors.name}</span>}
                </div>

                {/* Mobile Number */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#5A4635', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Mobile Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '16px',
                      border: '1px solid rgba(139, 94, 52, 0.25)',
                      background: '#FFFFFF',
                      boxShadow: 'inset 0 2px 4px rgba(74, 52, 39, 0.02)',
                      fontSize: '14.5px',
                      color: '#3D2B1A',
                      outline: 'none',
                      fontFamily: 'Outfit',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease'
                    }}
                  />
                </div>

                {/* Email Address */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#5A4635', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email Address *</label>
                  <input
                    type="email"
                    placeholder="e.g. priyanshu@gmail.com"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      if (errors.email) setErrors({ ...errors, email: '' })
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '16px',
                      border: errors.email ? '1.5px solid #E11D48' : '1px solid rgba(139, 94, 52, 0.25)',
                      background: '#FFFFFF',
                      boxShadow: 'inset 0 2px 4px rgba(74, 52, 39, 0.02)',
                      fontSize: '14.5px',
                      color: '#3D2B1A',
                      outline: 'none',
                      fontFamily: 'Outfit',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease'
                    }}
                  />
                  {errors.email && <span style={{ fontSize: '11.5px', color: '#E11D48', fontWeight: 600 }}>{errors.email}</span>}
                </div>

                {/* Dynamic Transparent Contribution Breakdown */}
                <div style={{ marginTop: '4px', marginBottom: '8px' }}>
                  <TransparentBreakdown amount={pendingPrice || 10} />
                </div>

                {/* Secure disclaimer */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', background: 'rgba(139, 94, 52, 0.04)', padding: '12px 14px', borderRadius: '12px', border: '1px dashed rgba(139, 94, 52, 0.15)', marginTop: '4px' }}>
                  <Shield size={14} color="#8B5E34" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <p style={{ margin: 0, fontSize: '11.5px', color: '#7A6A5A', lineHeight: 1.45, fontWeight: 500 }}>
                    Your details are securely used for contribution acknowledgment and certificate generation only.
                  </p>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: 12, marginTop: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: '99px',
                      border: '1px solid rgba(139, 94, 52, 0.25)',
                      background: '#FFFFFF',
                      color: '#7A6A5A',
                      fontSize: '14.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'Outfit',
                      transition: 'all 0.2s ease'
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
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1.4,
                      padding: '14px',
                      borderRadius: '99px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #8C4F1A, #C8773A)',
                      color: '#FFFFFF',
                      fontSize: '14.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'Outfit',
                      boxShadow: '0 8px 24px rgba(140, 79, 26, 0.22)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 12px 30px rgba(140, 79, 26, 0.35)'
                      e.currentTarget.style.filter = 'brightness(1.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(140, 79, 26, 0.22)'
                      e.currentTarget.style.filter = 'none'
                    }}
                  >
                    Continue to ₹{pendingPrice} Support
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

      {/* Shimmer animations */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-bg {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 100%);
          background-size: 200% 100%;
          animation: shimmer 3.5s infinite linear;
        }
        @media (max-width: 960px) {
          .banner-fluid-padding {
            padding: 16px 20px !important;
          }
        }
      `}</style>
    </div>
  )
}
