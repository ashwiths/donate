import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, Heart, Shield, FileCheck, Users, ArrowRight, ChevronRight, CheckCircle2, X, Sparkles, Award, Star, Gift, Gamepad2, ArrowUpRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { fadeUp, staggerContainer, scaleIn } from '../animations/variants'
import DonationProgress from '../components/DonationProgress'

const statsGrid = [
  { value: '25,800+', label: 'Active Helpers' },
  { value: '₹3.28Cr+', label: 'Directly Raised' },
  { value: '120+', label: 'Children Supported' },
  { value: '98%', label: 'Verified Cases' },
]

const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=80'
]

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loginAsGuest } = useAuth()

  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setIsLoginOpen(false)
    login({ name: 'Vignesh', email: form.email })
    navigate('/home')
  }

  const handleGuest = () => {
    loginAsGuest()
    navigate('/home')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 12% 18%, #FAF6F0 0%, #FAF8F5 100%)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>

      {/* Modern ambient blurred layout shapes */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '5%',
        width: '550px',
        height: '550px',
        background: 'radial-gradient(circle, rgba(232, 168, 124, 0.12) 0%, rgba(254, 243, 232, 0) 70%)',
        filter: 'blur(100px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-5%',
        right: '15%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(123, 63, 0, 0.04) 0%, rgba(254, 243, 232, 0) 70%)',
        filter: 'blur(90px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* ────────────────── 1. PREMIUM HEADER NAVIGATION ────────────────── */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 80px',
        zIndex: 10,
        position: 'relative',
        borderBottom: '1px solid rgba(232, 224, 214, 0.4)',
        background: 'rgba(250, 246, 240, 0.75)',
        backdropFilter: 'blur(12px)'
      }} className="landing-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38,
            height: 38,
            background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
            borderRadius: '11px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 16px rgba(123, 63, 0, 0.15)'
          }}>
            <Heart size={18} color="#fff" fill="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 18, color: 'var(--color-text)', letterSpacing: '-0.5px', lineHeight: 1.1 }}>Heal & Play</div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Play Games. Save Lives.</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="landing-nav-links">
          <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-text-muted)', cursor: 'pointer' }}>Our Mission</span>
          <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-text-muted)', cursor: 'pointer' }}>How it Works</span>
          <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-text-muted)', cursor: 'pointer' }}>Transparency Audits</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button 
            onClick={() => setIsLoginOpen(true)}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '14px', 
              fontWeight: 700, 
              color: 'var(--color-primary)', 
              cursor: 'pointer' 
            }}
          >
            Sign In
          </button>
          <button 
            onClick={() => setIsLoginOpen(true)}
            className="btn-primary" 
            style={{ 
              padding: '10px 20px', 
              fontSize: '13.5px', 
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(123, 63, 0, 0.12)'
            }}
          >
            Play & Support
          </button>
        </div>
      </header>

      {/* ────────────────── 2. TRUST VERIFICATION STRIP ────────────────── */}
      <div style={{
        background: '#FFFDF9',
        borderBottom: '1px solid rgba(232, 224, 214, 0.4)',
        padding: '10px 80px',
        display: 'flex',
        justifyContent: 'center',
        gap: 36,
        fontSize: '11.5px',
        fontWeight: 700,
        color: '#8C4F1A',
        zIndex: 9,
        position: 'relative',
        letterSpacing: '0.02em',
        boxShadow: '0 2px 8px rgba(123, 63, 0, 0.02)'
      }} className="trust-strip">
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>🛡️ Verified Hospital Cases</span>
        <span style={{ opacity: 0.3 }}>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>🤝 100% Direct Payment Auditing</span>
        <span style={{ opacity: 0.3 }}>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>🔒 Secure SSL Micro-donations</span>
      </div>

      {/* ────────────────── 3. HERO GRID SECTION (55% / 45%) ────────────────── */}
      <main style={{
        flex: 1,
        maxWidth: 1600,
        margin: '0 auto',
        padding: '56px 80px 80px',
        display: 'grid',
        gridTemplateColumns: '55fr 45fr',
        gap: 64,
        alignItems: 'center',
        boxSizing: 'border-box',
        width: '100%',
        zIndex: 1,
        position: 'relative'
      }} className="hero-split-grid">
        
        {/* Left Side Column: Interactive Visual Stack (55%) */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
        >
          {/* Tag */}
          <motion.div
            variants={fadeUp}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#FFF7ED',
              border: '1px solid #FFE4E6',
              borderRadius: '99px',
              padding: '6px 14px',
              alignSelf: 'flex-start'
            }}
          >
            <Sparkles size={14} color="#8C4F1A" />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#B45309', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Micro-donations, HUGE Real Impact
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: 'Outfit',
              fontSize: 'clamp(44px, 5.5vw, 64px)',
              fontWeight: 900,
              lineHeight: 1.08,
              color: 'var(--color-text)',
              margin: 0,
              letterSpacing: '-1.5px'
            }}
          >
            Play Small Games.<br />
            <span style={{ 
              background: 'linear-gradient(90deg, #8C4F1A, #C8773A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Save Sick Children.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            style={{
              fontSize: '16.5px',
              color: 'var(--color-text-muted)',
              lineHeight: 1.65,
              maxWidth: '540px',
              margin: 0
            }}
          >
            Join over 25,800 active helpers transforming medical crowdfunding. Play simple mini-games, claim merchant retail coupons, and fund surgeries for just ₹10.
          </motion.p>

          {/* Mini "How It Works" Flow Row */}
          <motion.div
            variants={fadeUp}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12, 
              fontSize: '12px', 
              fontWeight: 700, 
              color: '#8C4F1A',
              background: '#FAF2EA',
              border: '1px solid #EBD5C2',
              borderRadius: '12px',
              padding: '10px 16px',
              alignSelf: 'flex-start'
            }}
            className="hero-mini-flow"
          >
            <span>🎮 1. Choose Game</span> <ArrowRight size={13} />
            <span>💳 2. Pay ₹10 Ticket</span> <ArrowRight size={13} />
            <span>🌱 3. Save Children</span>
          </motion.div>

          {/* CTAs Row */}
          <motion.div
            variants={fadeUp}
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
          >
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="btn-primary" 
              style={{ 
                padding: '13px 26px', 
                fontSize: '14.5px', 
                borderRadius: '11px',
                boxShadow: '0 8px 20px rgba(123, 63, 0, 0.16)'
              }}
            >
              Choose Game & Help
            </button>
            <button 
              onClick={handleGuest}
              className="btn-outline" 
              style={{ 
                padding: '12px 26px', 
                fontSize: '14.5px', 
                borderRadius: '11px',
                background: '#fff'
              }}
            >
              Explore as Guest
            </button>
          </motion.div>

          {/* Impact Stats Grid: Fills empty whitespace in left column beautifully */}
          <motion.div
            variants={fadeUp}
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: 14, 
              maxWidth: '600px',
              borderTop: '1px solid rgba(232, 224, 214, 0.6)',
              paddingTop: '24px',
              marginTop: '8px'
            }}
            className="hero-stats-row"
          >
            {statsGrid.map(({ value, label }) => (
              <div key={label} style={{
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '12px',
                padding: '12px 14px',
                border: '1px solid rgba(232, 224, 214, 0.5)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'Outfit' }}>{value}</div>
                <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', fontWeight: 500, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </motion.div>

          {/* Avatars */}
          <motion.div
            variants={fadeUp}
            style={{ display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {AVATARS.map((avatar, idx) => (
                <img
                  key={idx}
                  src={avatar}
                  alt="Helper avatar"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    border: '3px solid #FAF8F5',
                    marginLeft: idx === 0 ? 0 : -10,
                    objectFit: 'cover',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px' }}>
              <CheckCircle2 size={15} color="#16a34a" fill="#dcfce7" />
              <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>Trusted by 25,000+ helpers</span>
              <span style={{ color: 'var(--color-text-muted)' }}>• 100% Audited</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side Column: Large Premium Child Card + Overlapping Widgets (45%) */}
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', width: '100%' }}>
          
          {/* Decorative Floating Reward Cards around the featured card */}
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
            transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              top: '-24px',
              left: '-28px',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '12px',
              padding: '8px 12px',
              border: '1px solid rgba(232, 224, 214, 0.8)',
              boxShadow: '0 8px 24px rgba(123, 63, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              zIndex: 3
            }}
            className="floating-reward-badge"
          >
            <Gift size={15} color="#D97706" />
            <span style={{ fontSize: '11px', fontWeight: 800 }}>Flipkart Vouchers 🏷️</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0], rotate: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
            style={{
              position: 'absolute',
              top: '40%',
              right: '-36px',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '12px',
              padding: '8px 12px',
              border: '1px solid rgba(232, 224, 214, 0.8)',
              boxShadow: '0 8px 24px rgba(123, 63, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              zIndex: 3
            }}
            className="floating-game-badge"
          >
            <Gamepad2 size={15} color="#8C4F1A" />
            <span style={{ fontSize: '11px', fontWeight: 800 }}>Spin Wheel 🎯</span>
          </motion.div>

          {/* Floating live activities block */}
          <motion.div
            animate={{ x: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              top: '-36px',
              right: '20px',
              background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
              borderRadius: '10px',
              padding: '6px 12px',
              border: '1px solid #FCD34D',
              boxShadow: 'var(--shadow-sm)',
              fontSize: '10.5px',
              fontWeight: 800,
              color: '#B45309',
              zIndex: 3
            }}
          >
            🎉 Coupon unlocked in Chennai just now!
          </motion.div>

          {/* The ONE Large Premium Featured Child Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              background: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(20px)',
              borderRadius: '28px',
              border: '1px solid rgba(232, 224, 214, 0.8)',
              padding: '28px',
              width: '100%',
              maxWidth: '460px',
              boxShadow: '0 30px 60px rgba(123, 63, 0, 0.12)',
              boxSizing: 'border-box',
              position: 'relative'
            }}
            className="featured-child-premium-card"
          >
            {/* Image Overlay Header */}
            <div style={{ position: 'relative', width: '100%', height: '280px', borderRadius: '20px', overflow: 'hidden', marginBottom: 24 }}>
              <img 
                src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1000&q=90" 
                alt="Child smiling"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(26, 17, 9, 0.85) 0%, rgba(26, 17, 9, 0.1) 75%)'
              }} />

              {/* Verified Badge */}
              <div style={{
                position: 'absolute',
                top: 16,
                left: 16,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 800,
                color: '#B45309',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                boxShadow: 'var(--shadow-sm)'
              }}>
                <Award size={13} />
                VERIFIED CLINICAL CASE
              </div>

              {/* Name & Title */}
              <div style={{ position: 'absolute', bottom: 20, left: 24, right: 24 }}>
                <span style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Nanavati Max Hospital Biller</span>
                <h3 style={{ margin: '2px 0 0', color: '#fff', fontSize: '22px', fontWeight: 800, fontFamily: 'Outfit' }}>Baby Aarav</h3>
                <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.75)' }}>8 months old • Liver Disease (Biliary Atresia)</p>
              </div>
            </div>

            {/* Metrics */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: 8 }}>
                <span>Raised: <strong>₹2.14L</strong></span>
                <span>Goal: <strong>₹70.00L</strong></span>
              </div>
              <DonationProgress raised={214385} required={7000000} percentage={0.03} compact />
            </div>

            {/* Sub-text transparency row */}
            <div style={{
              background: 'var(--color-bg-warm)',
              borderRadius: '14px',
              padding: '14px 16px',
              border: '1px solid #E8D9C8',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: '12px',
              color: 'var(--color-text-muted)',
              lineHeight: 1.45
            }}>
              <Shield size={16} color="var(--color-primary)" />
              100%platform transparency split audited by coordinates.
            </div>

            {/* Play CTA */}
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
                boxShadow: '0 6px 18px rgba(123, 63, 0, 0.18)'
              }}
            >
              Donate ₹10 & Play to Support
            </button>
          </motion.div>

          {/* Secondary Overlapping Child Support Card (Fills empty bottom right space beautifully) */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              bottom: '-36px',
              right: '-28px',
              background: 'rgba(255, 255, 255, 0.98)',
              borderRadius: '18px',
              padding: '14px 18px',
              boxShadow: '0 20px 45px rgba(123, 63, 0, 0.16)',
              border: '1px solid rgba(232, 224, 214, 0.9)',
              zIndex: 2,
              width: '210px',
              cursor: 'pointer'
            }}
            onClick={() => setIsLoginOpen(true)}
            className="secondary-waiting-card"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: '9px', background: '#FEE2E2', color: '#EF4444', padding: '3px 8px', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase' }}>Urgent Case</span>
              <ArrowUpRight size={14} color="var(--color-primary)" />
            </div>
            <h4 style={{ margin: '4px 0 2px', fontSize: '13.5px', fontWeight: 800, color: 'var(--color-text)', fontFamily: 'Outfit' }}>Baby Meera</h4>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>12% raised • Bone Marrow transplant</div>
          </motion.div>
          
        </div>

      </main>

      {/* ────────────────── 4. DYNAMIC GLASSMORPHIC LOGIN MODAL ────────────────── */}
      <AnimatePresence>
        {isLoginOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(26, 17, 9, 0.45)',
              backdropFilter: 'blur(8px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                background: '#fff',
                borderRadius: '24px',
                border: '1px solid var(--color-border)',
                padding: '36px',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 30px 60px rgba(123, 63, 0, 0.25)',
                boxSizing: 'border-box',
                position: 'relative'
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsLoginOpen(false)}
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  background: 'var(--color-bg-warm)',
                  border: 'none',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)'
                }}
              >
                <X size={16} />
              </button>

              {/* Modal Header */}
              <div style={{ marginBottom: 24, textAlign: 'center' }}>
                <div style={{
                  width: 44,
                  height: 44,
                  background: '#FFF7ED',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  border: '1px solid #FFE4E6'
                }}>
                  <Heart size={20} color="#8C4F1A" fill="#8C4F1A" />
                </div>
                <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '24px', color: 'var(--color-text)', margin: '0 0 6px' }}>Sign in to Support</h2>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-muted)' }}>Choose your preferred option to proceed</p>
              </div>

              {/* Social Login */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: 20 }}>
                <button
                  type="button"
                  style={{
                    padding: '10px 14px',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: '10px',
                    background: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--color-text)'
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.6 2.2 30.2 0 24 0 14.6 0 6.7 5.4 2.7 13.4l7.8 6C12.4 13 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.7c-.6 3-2.4 5.6-5 7.3l7.8 6C43.9 37.8 46.5 31.5 46.5 24.5z"/><path fill="#FBBC05" d="M10.5 28.8A14.6 14.6 0 0 1 9.5 24c0-1.7.3-3.3.8-4.8l-7.8-6A24 24 0 0 0 0 24c0 3.8.9 7.4 2.5 10.5l8-5.7z"/><path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.8-6c-2 1.4-4.6 2.2-7.4 2.2-6.2 0-11.5-4.2-13.4-9.9l-8 5.7C6.7 42.6 14.6 48 24 48z"/></svg>
                  Google
                </button>
                <button
                  type="button"
                  style={{
                    padding: '10px 14px',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: '10px',
                    background: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--color-text)'
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 814 1000"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-38.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.3 134.4-316.9 266.5-316.9 100.9 0 184.4 66.9 245.8 66.9 59.2 0 152-71 272.1-71 38.4 0 110.8 3.9 169.6 38.8zm-171.5-150.8c-108.2 0-226.1 72.1-226.1 220.6v2.6c109.5 0 236.2-81.5 236.2-220.6 0-3.9-.6-7.7-1-10.6l-9.1 7.4z"/></svg>
                  Apple
                </button>
              </div>

              {/* Separator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
                <span style={{ fontSize: '10px', color: 'var(--color-text-light)', fontWeight: 800 }}>OR CREDENTIALS</span>
                <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
              </div>

              {/* Form */}
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: 14 }}>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      border: '1.5px solid var(--color-border)',
                      borderRadius: '10px',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      border: '1.5px solid var(--color-border)',
                      borderRadius: '10px',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {loading ? 'Logging in…' : 'Sign In'}
                </button>
              </form>

              {/* Guest explorative block */}
              <div 
                onClick={handleGuest}
                style={{
                  marginTop: 16,
                  padding: '10px 12px',
                  background: 'var(--color-bg-warm)',
                  border: '1px dashed #E8D9C8',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <User size={14} color="#8C4F1A" />
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#8C4F1A' }}>Explore as Guest First</span>
                </div>
                <ChevronRight size={14} color="#8C4F1A" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive media css overrides */}
      <style>{`
        @media (max-width: 960px) {
          .landing-header {
            padding: 16px 24px !important;
          }
          .trust-strip {
            padding: 8px 24px !important;
            gap: 16px !important;
            flex-wrap: wrap !important;
          }
          .landing-nav-links {
            display: none !important;
          }
          .hero-split-grid {
            grid-template-columns: 1fr !important;
            padding: 32px 24px 64px !important;
            gap: 48px !important;
          }
          .hero-stats-row {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .floating-reward-badge, .floating-game-badge, .secondary-waiting-card {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
