import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, Heart, Shield, FileCheck, Users, ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { fadeUp, staggerContainer, scaleIn } from '../animations/variants'

const stats = [
  { icon: Users, value: '25,800+', label: 'Active Helpers' },
  { icon: Shield, value: '100%', label: 'Transparent Split' },
  { icon: FileCheck, value: 'Verified', label: 'Medical Cases' },
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
      background: '#FAF8F5',
      display: 'grid',
      gridTemplateColumns: '58fr 42fr',
      position: 'relative',
      overflow: 'hidden'
    }} className="login-split-layout">

      {/* Decorative premium blurs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(232, 168, 124, 0.12) 0%, rgba(254, 243, 232, 0) 70%)',
        filter: 'blur(90px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      
      {/* ────────────────── LEFT COLUMN: Cinematic Showcase (58%) ────────────────── */}
      <div style={{
        padding: '48px 64px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Keeps elements beautifully anchored without massive vertical stretching
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
        boxSizing: 'border-box'
      }} className="login-left-panel">
        
        {/* Brand Header: Part of natural flow now to eliminate overlapping */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '24px' }}>
          <div style={{
            width: 40,
            height: 40,
            background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 16px rgba(123, 63, 0, 0.15)'
          }}>
            <Heart size={20} color="#fff" fill="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 20, color: 'var(--color-text)', letterSpacing: '-0.5px', lineHeight: 1.1 }}>Heal & Play</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Play Games. Save Lives.</div>
          </div>
        </div>

        {/* Content stack with concrete, tight gaps instead of arbitrary whitespace */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, justifyContent: 'center' }}
        >
          {/* Badge */}
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
              alignSelf: 'flex-start',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <span style={{ fontSize: '12px' }}>✨</span>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#B45309', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Micro-donations, HUGE Real Impact
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: 'Outfit',
              fontSize: 'clamp(36px, 4.5vw, 54px)',
              fontWeight: 900,
              lineHeight: 1.1,
              color: 'var(--color-text)',
              margin: 0,
              letterSpacing: '-1px'
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
              fontSize: '15px',
              color: 'var(--color-text-muted)',
              lineHeight: 1.6,
              maxWidth: '500px',
              margin: 0
            }}
          >
            Join over 25,800 active helpers transforming medical crowdfunding. Play simple mini-games, claim merchant retail coupons, and fund surgeries for just ₹10.
          </motion.p>

          {/* User Avatars & Trust Text */}
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
                    border: '2px solid #FAF8F5',
                    marginLeft: idx === 0 ? 0 : -8,
                    objectFit: 'cover',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px' }}>
              <CheckCircle2 size={15} color="#16a34a" fill="#dcfce7" />
              <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>25,000+ Active Helpers</span>
              <span style={{ color: 'var(--color-text-muted)' }}>• 100% Transparent Audits</span>
            </div>
          </motion.div>

          {/* Featured Treatment Card (Beautiful Aspect Ratio) */}
          <motion.div 
            variants={fadeUp} 
            style={{ position: 'relative', width: '100%', maxWidth: '500px', height: '240px', borderRadius: '20px', overflow: 'visible', margin: '8px 0' }}
          >
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 45px rgba(123, 63, 0, 0.12)',
              border: '1px solid rgba(232, 224, 214, 0.6)',
              position: 'relative'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80" 
                alt="Child smiling"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(26, 17, 9, 0.8) 0%, rgba(26, 17, 9, 0.1) 70%)'
              }} />
              
              <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Verified Case</span>
                  <h4 style={{ margin: '1px 0 0', color: '#fff', fontSize: '18px', fontWeight: 800, fontFamily: 'Outfit' }}>Baby Aarav</h4>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
                  ₹2.14 Lakh Raised
                </div>
              </div>
            </div>

            {/* Floating Live Donation Badge (Right) */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                top: '-16px',
                right: '-20px',
                background: '#fff',
                borderRadius: '14px',
                padding: '10px 16px',
                boxShadow: '0 12px 28px rgba(123, 63, 0, 0.12)',
                border: '1px solid rgba(232, 224, 214, 0.7)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                zIndex: 2
              }}
            >
              <div style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%' }} />
              <div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Live Donation</div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--color-text)' }}>₹10 received just now</div>
              </div>
            </motion.div>

            {/* Floating Interactive Breakdown (Left) */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 2 }}
              style={{
                position: 'absolute',
                bottom: '-20px',
                left: '-20px',
                background: '#fff',
                borderRadius: '14px',
                padding: '12px 18px',
                boxShadow: '0 15px 30px rgba(123, 63, 0, 0.12)',
                border: '1px solid rgba(232, 224, 214, 0.8)',
                width: '230px',
                zIndex: 2
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>Your ₹10 Impact</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                <span>Hospital: <strong>₹9.00</strong></span>
                <span>Gateway: <strong>₹1.00</strong></span>
              </div>
            </motion.div>
          </motion.div>

        </motion.div>

        {/* Tight Bottom Stats Bar to prevent massive vertical empty spaces */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: 16, 
          paddingTop: '24px', 
          borderTop: '1px solid var(--color-border)',
          marginTop: '24px' 
        }}>
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: '#FFF7ED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #FFE4E6',
                flexShrink: 0
              }}>
                <Icon size={16} color="#8C4F1A" />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-text)', fontFamily: 'Outfit', lineHeight: 1.1 }}>{value}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ────────────────── RIGHT COLUMN: Tight Premium Login Panel (42%) ────────────────── */}
      <div style={{
        padding: '48px',
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
        
        {/* Soft elegant warm ambient glow */}
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '280px',
          height: '280px',
          background: 'rgba(232, 168, 124, 0.04)',
          filter: 'blur(70px)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        {/* Clean, well-spaced, compact login card container */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          style={{
            width: '100%',
            maxWidth: '380px',
            background: '#fff',
            borderRadius: '24px',
            border: '1px solid var(--color-border)',
            padding: '32px',
            boxShadow: '0 20px 40px rgba(123, 63, 0, 0.05)',
            boxSizing: 'border-box'
          }}
          className="login-card-container"
        >
          {/* Form Header */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{
              fontFamily: 'Outfit',
              fontSize: '24px',
              fontWeight: 800,
              color: 'var(--color-text)',
              letterSpacing: '-0.5px',
              marginBottom: '4px'
            }}>
              Welcome back 👋
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
              Unlock fun games and retail rewards while helping children.
            </p>
          </div>

          {/* Social Sign In */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: 20 }}>
            <motion.button
              whileHover={{ scale: 1.02, background: 'var(--color-bg-warm)' }}
              whileTap={{ scale: 0.98 }}
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
                fontSize: '12.5px',
                fontWeight: 700,
                color: 'var(--color-text)',
                transition: 'all 0.15s ease'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.6 2.2 30.2 0 24 0 14.6 0 6.7 5.4 2.7 13.4l7.8 6C12.4 13 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.7c-.6 3-2.4 5.6-5 7.3l7.8 6C43.9 37.8 46.5 31.5 46.5 24.5z"/><path fill="#FBBC05" d="M10.5 28.8A14.6 14.6 0 0 1 9.5 24c0-1.7.3-3.3.8-4.8l-7.8-6A24 24 0 0 0 0 24c0 3.8.9 7.4 2.5 10.5l8-5.7z"/><path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.8-6c-2 1.4-4.6 2.2-7.4 2.2-6.2 0-11.5-4.2-13.4-9.9l-8 5.7C6.7 42.6 14.6 48 24 48z"/></svg>
              Google
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, background: 'var(--color-bg-warm)' }}
              whileTap={{ scale: 0.98 }}
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
                fontSize: '12.5px',
                fontWeight: 700,
                color: 'var(--color-text)',
                transition: 'all 0.15s ease'
              }}
            >
              <svg width="12" height="12" viewBox="0 0 814 1000"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-38.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.3 134.4-316.9 266.5-316.9 100.9 0 184.4 66.9 245.8 66.9 59.2 0 152-71 272.1-71 38.4 0 110.8 3.9 169.6 38.8zm-171.5-150.8c-108.2 0-226.1 72.1-226.1 220.6v2.6c109.5 0 236.2-81.5 236.2-220.6 0-3.9-.6-7.7-1-10.6l-9.1 7.4z"/></svg>
              Apple
            </motion.button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            <span style={{ fontSize: '10px', color: 'var(--color-text-light)', fontWeight: 800, letterSpacing: '0.06em' }}>OR CREDENTIALS</span>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: 4, color: 'var(--color-text)' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: '10px',
                    fontSize: '13px',
                    outline: 'none',
                    fontFamily: 'Inter',
                    background: '#fff',
                    color: 'var(--color-text)',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-primary)'
                    e.target.style.boxShadow = '0 0 0 2px rgba(123, 63, 0, 0.06)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--color-text)' }}>
                  Password
                </label>
                <button type="button" style={{ background: 'none', border: 'none', fontSize: '11.5px', color: '#B45309', cursor: 'pointer', fontWeight: 700 }}>
                  Forgot?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 38px 10px 36px',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: '10px',
                    fontSize: '13px',
                    outline: 'none',
                    fontFamily: 'Inter',
                    background: '#fff',
                    color: 'var(--color-text)',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-primary)'
                    e.target.style.boxShadow = '0 0 0 2px rgba(123, 63, 0, 0.06)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
              <input type="checkbox" id="remember" style={{ cursor: 'pointer', accentColor: 'var(--color-primary)' }} />
              <label htmlFor="remember" style={{ fontSize: '12px', color: 'var(--color-text-muted)', cursor: 'pointer' }}>Keep me logged in</label>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.015, boxShadow: '0 6px 20px rgba(123, 63, 0, 0.18)' }}
              whileTap={{ scale: 0.985 }}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Outfit',
                opacity: loading ? 0.85 : 1,
                boxShadow: '0 4px 12px rgba(123, 63, 0, 0.12)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              {loading ? 'Securing Connection…' : 'Sign In'}
              <ArrowRight size={14} />
            </motion.button>
          </form>

          {/* Sign Up */}
          <p style={{ textAlign: 'center', fontSize: '12.5px', color: 'var(--color-text-muted)', margin: '16px 0 12px' }}>
            New to Heal & Play?{' '}
            <button style={{ background: 'none', border: 'none', color: '#B45309', fontWeight: 800, cursor: 'pointer', fontSize: '12.5px' }}>
              Create account
            </button>
          </p>

          {/* Guest explorative block */}
          <motion.div
            whileHover={{ scale: 1.015, background: 'var(--color-bg-warm)' }}
            onClick={handleGuest}
            style={{
              padding: '12px 14px',
              background: 'var(--color-bg-warm)',
              border: '1.5px dashed #E8D9C8',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <User size={14} color="#8C4F1A" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#8C4F1A', display: 'block', lineHeight: 1.1 }}>Explore as Guest</span>
                <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>Browse cases without logging in</span>
              </div>
            </div>
            <ChevronRight size={14} color="#8C4F1A" />
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
            padding: 40px 24px !important;
            border-bottom: 1px solid var(--color-border);
            min-height: auto !important;
          }
          .login-right-panel {
            padding: 40px 24px !important;
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
