import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ChevronRight, Gamepad2, Tag, Quote as QuoteIcon, Gift, 
  LayoutGrid, Shield, Heart, Lock, ArrowRight, Sparkles, Check, Info
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DonationProgress from '../components/DonationProgress'
import { useDonation } from '../context/DonationContext'

// ── Static premium data with SVGs / minimal styles ────────────────────
const MYSTERY_REWARDS = [
  {
    id: 'paytm',
    title: 'Daily Surprise Cashdrop',
    brand: 'Paytm Cashback',
    description: 'Chance to reveal a mystery cashback reward up to ₹100 directly to your wallet.',
    price: 10,
    blurBg: 'linear-gradient(135deg, rgba(0, 41, 112, 0.08) 0%, rgba(0, 163, 224, 0.12) 100%)',
    accentColor: '#002970',
    teaserLogo: 'Paytm'
  },
  {
    id: 'gpay',
    title: 'Mystery Scratch Reward',
    brand: 'Google Pay Card',
    description: 'A special golden scratch card containing exclusive wellness and reward drops.',
    price: 10,
    blurBg: 'linear-gradient(135deg, rgba(234, 67, 53, 0.08) 0%, rgba(66, 133, 244, 0.12) 100%)',
    accentColor: '#4285F4',
    teaserLogo: 'GPay'
  },
  {
    id: 'amazon',
    title: 'Premium Gift Voucher',
    brand: 'Amazon Gift Card',
    description: 'Unlock shopping power with a hidden Amazon voucher. Pure digital convenience.',
    price: 20,
    blurBg: 'linear-gradient(135deg, rgba(255, 153, 0, 0.08) 0%, rgba(0, 0, 0, 0.1) 100%)',
    accentColor: '#FF9900',
    teaserLogo: 'Amazon'
  },
  {
    id: 'swiggy',
    title: 'Gourmet Dining Treat',
    brand: 'Swiggy Food Coupon',
    description: 'Savor your next meal with a premium dining discount. Gift of delicious tastes.',
    price: 10,
    blurBg: 'linear-gradient(135deg, rgba(252, 128, 25, 0.08) 0%, rgba(252, 128, 25, 0.15) 100%)',
    accentColor: '#FC8019',
    teaserLogo: 'Swiggy'
  },
  {
    id: 'flipkart',
    title: 'Mega Shopping Discount',
    brand: 'Flipkart Voucher',
    description: 'An elegant shopping credit to elevate your checkout experience instantly.',
    price: 20,
    blurBg: 'linear-gradient(135deg, rgba(40, 116, 240, 0.08) 0%, rgba(255, 222, 0, 0.12) 100%)',
    accentColor: '#2874F0',
    teaserLogo: 'Flipkart'
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
          cx="48" cy="52" r="5" fill="#E8A87C" opacity="0.4"
        />
        <circle cx="48" cy="52" r="3" fill="#E8A87C" />
      </svg>
    )
  }
]

const INSPIRATIONAL_CARDS = [
  {
    title: 'Baby Aarav\'s Healing Milestone',
    description: 'Thanks to over 4,200 small gaming plays, Aarav\'s pre-operation checkup has been fully funded.',
    tag: 'SUCCESS STORY',
    accent: '#8C4F1A',
    bg: '#FAF4EE'
  },
  {
    title: 'Words of Hope from Pediatric Care',
    description: '"Every single 10-rupee gameplay helps us secure reliable bedside monitoring faster than traditional fundraising."',
    tag: 'CLINICAL VOICE',
    accent: '#47682C',
    bg: '#F3F6F0'
  },
  {
    title: 'How Transparency Empowers You',
    description: 'We map every transaction ID directly to the hospital\'s billing terminal. Trust is built on complete clarity.',
    tag: 'OUR PROMISE',
    accent: '#1E3A5F',
    bg: '#F0F4F8'
  }
]

const OTHER_CASES = [
  {
    name: 'Baby Kabir',
    condition: 'Congenital Heart Defect',
    raised: 450000,
    goal: 5500000,
    progress: 8,
    img: 'https://images.unsplash.com/photo-1519689680058-324335c77ebe?w=400&q=80'
  },
  {
    name: 'Infant Diya',
    condition: 'Retinoblastoma Treatment',
    raised: 120000,
    goal: 3000000,
    progress: 4,
    img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80'
  }
]

const TABS = [
  { id: 'all', label: 'All Unlocks' },
  { id: 'rewards', label: 'Mystery Rewards' },
  { id: 'games', label: 'Mini-Games' },
  { id: 'inspiration', label: 'Inspiration' },
  { id: 'donate', label: 'Direct Support' }
]

export default function MainPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [customAmount, setCustomAmount] = useState('')
  const [selectedPreset, setSelectedPreset] = useState(100)
  
  const navigate = useNavigate()
  const { confirmDonation } = useDonation()

  const handleUnlock = (price) => {
    confirmDonation(price)
    navigate('/thank-you')
  }

  const handleDirectDonate = () => {
    const amount = customAmount ? parseInt(customAmount) : selectedPreset
    if (amount > 0) {
      handleUnlock(amount)
    }
  }

  const show = (key) => activeTab === 'all' || activeTab === key

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FDFBF7', color: '#332211' }}>
      <Navbar />

      <main style={{ flex: 1, width: '100%', paddingBottom: 120 }}>
        
        {/* ── TOP CHILD-SUPPORT STRIP (Retained & Optimized) ── */}
        <div style={{ 
          background: '#fff', 
          borderBottom: '1px solid rgba(232,224,214,0.6)', 
          padding: '16px 40px',
          width: '100%',
          boxSizing: 'border-box'
        }} className="banner-fluid-padding">
          <div style={{ 
            maxWidth: 1200, 
            margin: '0 auto', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: 24, 
            flexWrap: 'wrap' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=120&q=80" 
                  alt="child" 
                  style={{ width: 56, height: 56, borderRadius: 14, objectFit: 'cover', border: '2px solid #FAF2EA' }} 
                />
                <span style={{ position: 'absolute', bottom: -2, right: -2, background: '#8C4F1A', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
                  <Heart size={10} color="#fff" fill="#fff" />
                </span>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 10, color: '#8C4F1A', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Currently Supporting</p>
                <h3 style={{ margin: '2px 0 0', fontWeight: 800, fontSize: 16, color: '#3C2F2F', fontFamily: 'Outfit', letterSpacing: '-0.3px' }}>Baby Aarav 🤍</h3>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>Liver Disease (Biliary Atresia)</p>
              </div>
            </div>
            
            <div style={{ flex: 1, maxWidth: 420, minWidth: 240 }}>
              <DonationProgress raised={214385} required={7000000} percentage={3.06} compact />
            </div>

            <button 
              onClick={() => handleUnlock(10)}
              className="btn-primary" 
              style={{ 
                padding: '10px 20px', 
                fontSize: 13, 
                fontWeight: 700,
                borderRadius: '10px', 
                background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s'
              }}
            >
              <span>Quick Support (₹10)</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* ── PREMIUM FILTER PILLS (Replaces Sidebar) ── */}
        <div style={{ maxWidth: 1200, margin: '48px auto 0', padding: '0 24px', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C4F1A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Discovery Portal</span>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '32px', color: '#2C1B1B', margin: '4px 0 16px', letterSpacing: '-0.8px' }}>
            Choose What You Want to Unlock 🤍
          </h2>
          <p style={{ margin: '0 auto 32px', maxWidth: 640, fontSize: '15px', color: '#7C6B5B', fontWeight: 500, lineHeight: 1.6 }}>
            Direct micro-donations to Baby Aarav\'s medical fund while gaining access to surprise wellness rewards, immersive minimal games, and stories.
          </p>

          <div style={{ 
            display: 'inline-flex', 
            gap: 8, 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'rgba(235, 224, 214, 0.3)',
            padding: '6px',
            borderRadius: '20px',
            border: '1px solid rgba(235, 224, 214, 0.6)',
            flexWrap: 'wrap'
          }}>
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '16px',
                  border: 'none',
                  background: activeTab === id ? '#fff' : 'transparent',
                  color: activeTab === id ? '#8C4F1A' : '#7C6B5B',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  boxShadow: activeTab === id ? '0 4px 12px rgba(140, 79, 26, 0.08)' : 'none',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── CENTRALIZED CONTENT GRID ── */}
        <div style={{ maxWidth: 1200, margin: '40px auto 0', padding: '0 24px', boxSizing: 'border-box' }}>
          
          {/* ────────────────── 1. FEATURED MYSTERY UNLOCKS ────────────────── */}
          {show('rewards') && (
            <section style={{ marginBottom: 64 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 32 }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#D4AF37', letterSpacing: '0.06em', textTransform: 'uppercase' }}>✨ Curated Surprise drops</span>
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '24px', color: '#2C1B1B', margin: '4px 0' }}>Featured Mystery Unlocks</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#7C6B5B' }}>Unlock elegant fintech and lifestyle surprise rewards. Brand vouchers are kept purely secret.</p>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                gap: 24 
              }}>
                {MYSTERY_REWARDS.map((reward) => (
                  <motion.div
                    key={reward.id}
                    whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(140, 79, 26, 0.08)' }}
                    onClick={() => handleUnlock(reward.price)}
                    style={{
                      background: '#fff',
                      border: '1px solid rgba(232, 224, 214, 0.7)',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative'
                    }}
                  >
                    {/* Blurred Secret Preview Area */}
                    <div style={{ 
                      height: 150, 
                      background: reward.blurBg, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {/* Ambient background shimmer */}
                      <div className="shimmer-bg" style={{ position: 'absolute', inset: 0, opacity: 0.15 }} />
                      
                      {/* Blurred teaser gift card */}
                      <div style={{
                        width: 140,
                        height: 84,
                        background: 'rgba(255, 255, 255, 0.45)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.6)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '10px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
                        transform: 'rotate(-4deg)',
                        transition: 'all 0.3s'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 9, fontWeight: 800, color: reward.accentColor, opacity: 0.75, letterSpacing: '0.04em' }}>MYSTERY GIFT</span>
                          <Lock size={10} color={reward.accentColor} />
                        </div>
                        <div style={{ textAlign: 'center', margin: '4px 0' }}>
                          <span style={{ fontSize: 18, fontWeight: 900, color: '#8C4F1A', opacity: 0.4, letterSpacing: '2px', filter: 'blur(1.5px)' }}>
                            ✨?✨
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 9, fontWeight: 700, color: '#8C4F1A' }}>₹?? Worth</span>
                          <div style={{ width: 12, height: 12, borderRadius: '50%', background: reward.accentColor, opacity: 0.6 }} />
                        </div>
                      </div>

                      {/* Lock Icon Badge */}
                      <div style={{
                        position: 'absolute',
                        bottom: 12,
                        background: '#FAF2EA',
                        border: '1px solid rgba(140, 79, 26, 0.15)',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}>
                        <Lock size={11} color="#8C4F1A" />
                        <span style={{ fontSize: 10, fontWeight: 800, color: '#8C4F1A', letterSpacing: '0.02em', textTransform: 'uppercase' }}>SECURE REVEAL</span>
                      </div>
                    </div>

                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 800, color: '#3C2F2F', fontFamily: 'Outfit' }}>{reward.title}</h4>
                        <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#7C6B5B', lineHeight: 1.5, fontWeight: 500 }}>{reward.description}</p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'space-between', justifyContent: 'space-between', borderTop: '1px solid rgba(232, 224, 214, 0.4)', paddingTop: '12px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C4F1A', textTransform: 'uppercase' }}>CLAIM FOR ₹{reward.price}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#8C4F1A', fontWeight: 800, fontSize: '13px' }}>
                          <span>Unlock</span>
                          <ChevronRight size={14} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ────────────────── 2. MINI-GAMES ────────────────── */}
          {show('games') && (
            <section style={{ marginBottom: 64 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 32 }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C4F1A', letterSpacing: '0.06em', textTransform: 'uppercase' }}>🎮 Light & Mindful Gameplay</span>
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '24px', color: '#2C1B1B', margin: '4px 0' }}>Mini-Games Collection</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#7C6B5B' }}>Calm your mind with interactive micro-games while direct funding life-saving treatments.</p>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
                gap: 24 
              }}>
                {PREMIUM_GAMES.map((game) => (
                  <motion.div
                    key={game.id}
                    whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(140, 79, 26, 0.08)' }}
                    onClick={() => handleUnlock(game.price)}
                    style={{
                      background: '#fff',
                      border: '1px solid rgba(232, 224, 214, 0.7)',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    {/* SVG Illustration Container */}
                    <div style={{ 
                      height: 140, 
                      background: '#FAF7F2', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      padding: 16
                    }}>
                      {game.illustration}
                    </div>

                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 800, color: '#3C2F2F', fontFamily: 'Outfit' }}>{game.title}</h4>
                        <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#7C6B5B', lineHeight: 1.5, fontWeight: 500 }}>{game.description}</p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'space-between', justifyContent: 'space-between', borderTop: '1px solid rgba(232, 224, 214, 0.4)', paddingTop: '12px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C4F1A', textTransform: 'uppercase' }}>PLAY FOR ₹{game.price}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#8C4F1A', fontWeight: 800, fontSize: '13px' }}>
                          <span>Start Play</span>
                          <ChevronRight size={14} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ────────────────── 3. INSPIRATIONAL UNLOCKS ────────────────── */}
          {show('inspiration') && (
            <section style={{ marginBottom: 64 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 32 }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#47682C', letterSpacing: '0.06em', textTransform: 'uppercase' }}>💬 Stories that heal</span>
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '24px', color: '#2C1B1B', margin: '4px 0' }}>Inspirational Unlocks</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#7C6B5B' }}>Unlock real hospital updates, progress stories, and beautiful motivational community quotes.</p>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                gap: 24 
              }}>
                {INSPIRATIONAL_CARDS.map((card, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.02)' }}
                    onClick={() => handleUnlock(10)}
                    style={{
                      background: card.bg,
                      borderRadius: '24px',
                      padding: '28px',
                      cursor: 'pointer',
                      border: '1px solid rgba(232, 224, 214, 0.4)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: 180,
                      transition: 'all 0.25s'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: card.accent, letterSpacing: '0.04em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.6)', padding: '4px 10px', borderRadius: '8px', display: 'inline-block', marginBottom: 12 }}>
                        {card.tag}
                      </span>
                      <h4 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 800, color: '#2C1B1B', fontFamily: 'Outfit', lineHeight: 1.35 }}>{card.title}</h4>
                      <p style={{ margin: 0, fontSize: '13.5px', color: '#5C4C3C', lineHeight: 1.5, fontWeight: 500 }}>{card.description}</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'space-between', justifyContent: 'space-between', marginTop: 20, paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: card.accent }}>CONTRIBUTE ₹10 TO UNLOCK</span>
                      <ArrowRight size={14} color={card.accent} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ────────────────── 4. DIRECT DONATION ────────────────── */}
          {show('donate') && (
            <section style={{ marginBottom: 64, maxWidth: 680, margin: '0 auto 64px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 28 }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C4F1A', letterSpacing: '0.06em', textTransform: 'uppercase' }}>❤️ Immediate Clinical Support</span>
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '24px', color: '#2C1B1B', margin: '4px 0' }}>Direct Support Checkout</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#7C6B5B' }}>Bypass the mini-games and mystery rewards to direct fund Baby Aarav\'s medical balance instantly.</p>
              </div>

              <div style={{
                background: '#fff',
                border: '1px solid rgba(232, 224, 214, 0.8)',
                borderRadius: '28px',
                padding: '32px',
                boxShadow: '0 10px 30px rgba(140, 79, 26, 0.03)'
              }}>
                <label style={{ fontSize: '13px', fontWeight: 800, color: '#8C4F1A', textTransform: 'uppercase', letterSpacing: '0.02em', display: 'block', marginBottom: 12 }}>
                  Select Contribution Amount
                </label>

                {/* Preset Chips */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24 }}>
                  {[100, 250, 500, 1000].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setSelectedPreset(preset)
                        setCustomAmount('')
                      }}
                      style={{
                        padding: '12px 0',
                        borderRadius: '14px',
                        border: '1px solid',
                        borderColor: selectedPreset === preset && !customAmount ? '#8C4F1A' : 'rgba(232, 224, 214, 0.8)',
                        background: selectedPreset === preset && !customAmount ? '#FFF8F2' : '#fff',
                        color: selectedPreset === preset && !customAmount ? '#8C4F1A' : '#7C6B5B',
                        fontWeight: 800,
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      ₹{preset}
                    </button>
                  ))}
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: '13px', fontWeight: 800, color: '#8C4F1A', textTransform: 'uppercase', letterSpacing: '0.02em', display: 'block', marginBottom: 8 }}>
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
                      padding: '14px 18px',
                      borderRadius: '14px',
                      border: '1px solid rgba(232, 224, 214, 0.9)',
                      fontSize: '15px',
                      fontWeight: 600,
                      boxSizing: 'border-box',
                      outline: 'none',
                      background: '#FFFDFB',
                      color: '#2C1B1B',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div>

                <button
                  onClick={handleDirectDonate}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '16px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '15px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 14px rgba(140, 79, 26, 0.25)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Heart size={16} fill="#fff" />
                  <span>Support Baby Aarav with ₹{customAmount ? parseInt(customAmount).toLocaleString() : selectedPreset.toLocaleString()}</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 18, fontSize: '11px', color: '#7C6B5B', fontWeight: 600 }}>
                  <Shield size={12} color="#47682C" />
                  <span>100% Direct Hospital Split Routing. Public Ledger Verified.</span>
                </div>
              </div>
            </section>
          )}

          {/* ────────────────── 5. MORE CASES ────────────────── */}
          <section style={{ 
            marginTop: 80, 
            borderTop: '1px solid rgba(232, 224, 214, 0.5)', 
            paddingTop: '64px'
          }}>
            <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#8C4F1A', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Explore more children</span>
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '24px', color: '#2C1B1B', margin: '4px 0 0', letterSpacing: '-0.5px' }}>Other Urgent Medical Cases</h3>
              </div>
              <button style={{ background: 'none', border: 'none', color: '#8C4F1A', fontWeight: 800, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>View All Cases</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: 24 
            }}>
              {OTHER_CASES.map((child, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#fff',
                    border: '1px solid rgba(232, 224, 214, 0.6)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <img src={child.img} alt={child.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                  
                  <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ margin: '0 0 2px', fontSize: '16px', fontWeight: 800, color: '#3C2F2F', fontFamily: 'Outfit' }}>{child.name}</h4>
                      <p style={{ margin: '0 0 14px', fontSize: '12.5px', color: '#7C6B5B' }}>{child.condition}</p>
                      
                      {/* Simple compact progress */}
                      <div style={{ height: 6, background: '#FAF2EA', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
                        <div style={{ width: `${child.progress}%`, height: '100%', background: '#8C4F1A' }} />
                      </div>
                      <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', fontSize: '11px', color: '#7C6B5B', fontWeight: 700 }}>
                        <span>₹{child.raised.toLocaleString('en-IN')} raised</span>
                        <span>{child.progress}%</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleUnlock(10)}
                      style={{ 
                        width: '100%', 
                        marginTop: 18, 
                        padding: '10px', 
                        fontSize: 12, 
                        fontWeight: 800, 
                        borderRadius: '10px', 
                        border: '1px solid rgba(140, 79, 26, 0.25)', 
                        background: 'transparent', 
                        color: '#8C4F1A', 
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      Support case
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

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
