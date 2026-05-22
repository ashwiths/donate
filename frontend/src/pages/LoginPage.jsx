import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, Heart, Shield, FileCheck, Users, ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { fadeUp, staggerContainer, scaleIn } from '../animations/variants'

const stats = [
  { icon: Users, value: '25,800+', label: 'Active Helpers' },
  { icon: Shield, value: '100%', label: 'Transparent split' },
  { icon: FileCheck, value: 'Verified', label: 'Medical Cases' },
]

// Overlapping avatar assets for premium social proof
const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=80'
]

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loginAsGuest } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 850))
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
      display: 'grid',
      gridTemplateColumns: '60fr 40fr',
      position: 'relative',
      overflow: 'hidden'
    }} className="login-split-layout">

      {/* Modern, soft ambient gradient blobs */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '10%',
        width: '550px',
        height: '550px',
        background: 'radial-gradient(circle, rgba(232, 168, 124, 0.14) 0%, rgba(254, 243, 232, 0) 70%)',
        filter: 'blur(100px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '25%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(123, 63, 0, 0.05) 0%, rgba(254, 243, 232, 0) 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* ────────────────── LEFT COLUMN: Premium Cinematic Showcase (60%) ────────────────── */}
      <div style={{
        padding: '56px 80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
        boxSizing: 'border-box'
      }} className="login-left-panel">
        
        {/* Floating Brand Logo Header */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'absolute', top: 56, left: 80 }}
          className="brand-absolute-header"
        >
          <div style={{
            width: 44,
            height: 44,
            background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(123, 63, 0, 0.18)'
          }}>
            <Heart size={22} color="#fff" fill="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 22, color: 'var(--color-text)', letterSpacing: '-0.5px', lineHeight: 1.1 }}>Heal & Play</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Play Games. Save Lives.</div>
          </div>
        </motion.div>

        {/* Content Container perfectly centered vertically */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ margin: '48px 0 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
          <motion.div
            variants={fadeUp}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#FFF7ED',
              border: '1px solid #FCD34D',
              borderRadius: '99px',
              padding: '6px 16px',
              alignSelf: 'flex-start',
              marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(123, 63, 0, 0.04)'
            }}
          >
            <span style={{ fontSize: '13px' }}>✨</span>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#B45309', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Micro-donations, Huge Real Impact
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: 'Outfit',
              fontSize: 'clamp(44px, 5vw, 60px)',
              fontWeight: 900,
              lineHeight: 1.08,
              margin: '0 0 20px',
              color: 'var(--color-text)',
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

          <motion.p
            variants={fadeUp}
            style={{
              fontSize: '16.5px',
              color: 'var(--color-text-muted)',
              lineHeight: 1.65,
              maxWidth: '540px',
              marginBottom: '24px'
            }}
          >
            Join over 25,000 active helpers who are transforming medical crowdfunding. Play bite-sized games, unlock retail coupon rewards, and directly fund critical surgeries with ₹10.
          </motion.p>

          {/* Overlapping User Avatars + Trust Badges */}
          <motion.div
            variants={fadeUp}
            style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {AVATARS.map((avatar, idx) => (
                <img
                  key={idx}
                  src={avatar}
                  alt="Helper avatar"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    border: '2px solid #FAF8F5',
                    marginLeft: idx === 0 ? 0 : -10,
                    objectFit: 'cover',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={16} color="#16a34a" fill="#dcfce7" />
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>Trusted by 25,000+ helpers</span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>• 100% Audited</span>
            </div>
          </motion.div>

          {/* Enlarged Child Feature Card with Deeper Shadows and Floating POPUPs */}
          <motion.div 
            variants={fadeUp} 
            style={{ position: 'relative', width: '100%', maxWidth: '540px', height: '300px', borderRadius: '24px', overflow: 'visible', marginBottom: '40px' }}
          >
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 25px 55px rgba(123, 63, 0, 0.16)',
              border: '1px solid rgba(232, 224, 214, 0.7)',
              position: 'relative'
            }} className="left-hero-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1000&q=90" 
                alt="Child healing smiling"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(26, 17, 9, 0.85) 0%, rgba(26, 17, 9, 0.1) 75%)'
              }} />
              
              <div style={{ position: 'absolute', bottom: 24, left: 28, right: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em' }}>Verified Medical Treatment case</span>
                  <h4 style={{ margin: '2px 0 0', color: '#fff', fontSize: '20px', fontWeight: 800, fontFamily: 'Outfit' }}>Baby Aarav</h4>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.25)', color: '#fff', padding: '6px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 700 }}>
                  ₹2.14 Lakh Raised
                </div>
              </div>
            </div>

            {/* Floating Live Donation Popup (Top-Right) */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                top: '-24px',
                right: '-28px',
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(12px)',
                borderRadius: '18px',
                padding: '14px 20px',
                boxShadow: '0 20px 40px rgba(123, 63, 0, 0.16)',
                border: '1px solid rgba(232, 224, 214, 0.8)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                zIndex: 2
              }}
              className="floating-card-1"
            >
              <div style={{ width: 10, height: 10, background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px rgba(34, 197, 94, 0.6)' }} />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Live Donation</div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--color-text)' }}>₹10 received just now</div>
              </div>
            </motion.div>

            {/* Floating Critical Treatment Need Math (Bottom-Left) */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2.2 }}
              style={{
                position: 'absolute',
                bottom: '-28px',
                left: '-28px',
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(12px)',
                borderRadius: '18px',
                padding: '16px 22px',
                boxShadow: '0 20px 40px rgba(123, 63, 0, 0.18)',
                border: '1px solid rgba(232, 224, 214, 0.9)',
                width: '260px',
                zIndex: 2
              }}
              className="floating-card-2"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <div style={{ width: 6, height: 6, background: '#ef4444', borderRadius: '50%' }} />
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>Your ₹10 Impact split</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--color-text-muted)', marginBottom: 8 }}>
                <span>Treatment: <strong>₹9.00</strong></span>
                <span>Gateway: <strong>₹1.00</strong></span>
              </div>
              <div style={{ height: '5px', background: '#F1E6D8', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: '90%', height: '100%', background: '#8C4F1A' }} />
              </div>
            </motion.div>
          </motion.div>

          {/* Soft Stats Grid */}
          <motion.div 
            variants={staggerContainer}
            style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}
          >
            {stats.map(({ icon: Icon, value, label }) => (
              <motion.div key={label} variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '14px',
                  background: '#FFF7ED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #FFE4E6',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <Icon size={20} color="#8C4F1A" />
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--color-text)', fontFamily: 'Outfit', lineHeight: 1.1 }}>{value}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 500 }}>{label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ────────────────── RIGHT COLUMN: Perfectly Balanced Login Panel (40%) ────────────────── */}
      <div style={{
        padding: '56px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        borderLeft: '1px solid var(--color-border)',
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        boxSizing: 'border-box'
      }} className="login-right-panel">
        
        {/* Soft decorative blur directly under the card */}
        <div style={{
          position: 'absolute',
          top: '30%',
          right: '15%',
          width: '240px',
          height: '240px',
          background: 'rgba(232, 168, 124, 0.07)',
          filter: 'blur(80px)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        {/* Compact, Highly Polished Form Card */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          style={{
            width: '100%',
            maxWidth: '390px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Form Header */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{
              fontFamily: 'Outfit',
              fontSize: '28px',
              fontWeight: 900,
              color: 'var(--color-text)',
              letterSpacing: '-0.75px',
              marginBottom: '4px'
            }}>
              Welcome back 👋
            </h2>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
              Unlock micro-games and claim verified merchant coupons while saving lives.
            </p>
          </div>

          {/* Premium Google & Apple Button Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: 20 }}>
            <motion.button
              whileHover={{ scale: 1.02, background: 'var(--color-bg-warm)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '11px 16px',
                border: '1.5px solid var(--color-border)',
                borderRadius: '12px',
                background: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--color-text)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.15s ease'
              }}
            >
              <svg width="15" height="15" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.6 2.2 30.2 0 24 0 14.6 0 6.7 5.4 2.7 13.4l7.8 6C12.4 13 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.7c-.6 3-2.4 5.6-5 7.3l7.8 6C43.9 37.8 46.5 31.5 46.5 24.5z"/><path fill="#FBBC05" d="M10.5 28.8A14.6 14.6 0 0 1 9.5 24c0-1.7.3-3.3.8-4.8l-7.8-6A24 24 0 0 0 0 24c0 3.8.9 7.4 2.5 10.5l8-5.7z"/><path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.8-6c-2 1.4-4.6 2.2-7.4 2.2-6.2 0-11.5-4.2-13.4-9.9l-8 5.7C6.7 42.6 14.6 48 24 48z"/></svg>
              Google
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, background: 'var(--color-bg-warm)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '11px 16px',
                border: '1.5px solid var(--color-border)',
                borderRadius: '12px',
                background: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--color-text)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.15s ease'
              }}
            >
              <svg width="13" height="13" viewBox="0 0 814 1000"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-38.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.3 134.4-316.9 266.5-316.9 100.9 0 184.4 66.9 245.8 66.9 59.2 0 152-71 272.1-71 38.4 0 110.8 3.9 169.6 38.8zm-171.5-150.8c-108.2 0-226.1 72.1-226.1 220.6v2.6c109.5 0 236.2-81.5 236.2-220.6 0-3.9-.6-7.7-1-10.6l-9.1 7.4z"/></svg>
              Apple
            </motion.button>
          </div>

          {/* Styled OR divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            <span style={{ fontSize: '10.5px', color: 'var(--color-text-light)', fontWeight: 800, letterSpacing: '0.08em' }}>OR CREDENTIALS</span>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            {/* Email Field */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: 6, color: 'var(--color-text)' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 40px',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: '12px',
                    fontSize: '13.5px',
                    outline: 'none',
                    fontFamily: 'Inter',
                    background: '#fff',
                    color: 'var(--color-text)',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-primary)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(123, 63, 0, 0.08)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>
                  Password
                </label>
                <button type="button" style={{ background: 'none', border: 'none', fontSize: '12px', color: '#B45309', cursor: 'pointer', fontWeight: 700 }}>
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 44px 11px 40px',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: '12px',
                    fontSize: '13.5px',
                    outline: 'none',
                    fontFamily: 'Inter',
                    background: '#fff',
                    color: 'var(--color-text)',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-primary)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(123, 63, 0, 0.08)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <input type="checkbox" id="remember" style={{ cursor: 'pointer', accentColor: 'var(--color-primary)' }} />
              <label htmlFor="remember" style={{ fontSize: '13px', color: 'var(--color-text-muted)', cursor: 'pointer', fontWeight: 500 }}>Keep me logged in</label>
            </div>

            {/* Premium Luxury Brown Button with soft gradient glow */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.015, boxShadow: '0 8px 24px rgba(123, 63, 0, 0.22)' }}
              whileTap={{ scale: 0.985 }}
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14.5px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Outfit',
                opacity: loading ? 0.85 : 1,
                boxShadow: '0 6px 18px rgba(123, 63, 0, 0.16)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              {loading ? 'Securing Connection…' : 'Sign In'}
              <ArrowRight size={15} />
            </motion.button>
          </form>

          {/* Switch to Sign Up */}
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--color-text-muted)', margin: '20px 0 12px' }}>
            New to Heal & Play?{' '}
            <button style={{ background: 'none', border: 'none', color: '#B45309', fontWeight: 800, cursor: 'pointer', fontSize: '13px' }}>
              Create a free account
            </button>
          </p>

          {/* Guest Mode Dashboard Button */}
          <motion.div
            whileHover={{ scale: 1.015, background: 'var(--color-bg-warm)' }}
            onClick={handleGuest}
            style={{
              padding: '14px 18px',
              background: 'var(--color-bg-warm)',
              border: '1.5px dashed #E8D9C8',
              borderRadius: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(123, 63, 0, 0.02)',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <User size={16} color="#8C4F1A" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#8C4F1A', display: 'block', lineHeight: 1.1 }}>Explore as Guest</span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Browse cases without logging in</span>
              </div>
            </div>
            <ChevronRight size={16} color="#8C4F1A" />
          </motion.div>

        </motion.div>
      </div>

      {/* Modern viewport layout CSS overrides */}
      <style>{`
        @media (max-width: 960px) {
          .login-split-layout {
            grid-template-columns: 1fr !important;
          }
          .login-left-panel {
            padding: 96px 24px 48px !important;
            border-bottom: 1px solid var(--color-border);
            min-height: auto !important;
            justify-content: flex-start !important;
          }
          .brand-absolute-header {
            position: absolute !important;
            top: 32px !important;
            left: 24px !important;
          }
          .login-right-panel {
            padding: 48px 24px !important;
            border-left: none !important;
            min-height: auto !important;
          }
          .floating-card-1, .floating-card-2 {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
