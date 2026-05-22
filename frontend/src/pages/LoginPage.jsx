import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, Heart, Shield, FileCheck, Globe, Star, Users, ArrowRight, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { fadeUp, staggerContainer, scaleIn, fadeIn } from '../animations/variants'

const stats = [
  { icon: Users, value: '25,800+', label: 'Active Helpers' },
  { icon: Shield, value: '100%', label: 'Transparent' },
  { icon: FileCheck, value: 'Verified', label: 'Medical Cases' },
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
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 800))
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
      background: 'radial-gradient(circle at 10% 20%, rgba(254, 243, 232, 0.6) 0%, rgba(250, 248, 245, 1) 90%)',
      display: 'grid',
      gridTemplateColumns: '1.1fr 0.9fr',
      position: 'relative',
      overflow: 'hidden'
    }} className="login-split-layout">

      {/* Decorative blurred background shapes */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '20%',
        width: '400px',
        height: '400px',
        background: 'rgba(232, 168, 124, 0.15)',
        filter: 'blur(100px)',
        borderRadius: '50%',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '-10%',
        width: '350px',
        height: '350px',
        background: 'rgba(123, 63, 0, 0.05)',
        filter: 'blur(80px)',
        borderRadius: '50%',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* ────────────────── LEFT SIDE: Startup Landing Content ────────────────── */}
      <div style={{
        padding: '48px 64px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 1,
      }} className="login-left-panel">
        
        {/* Brand Logo Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <div style={{
            width: 42,
            height: 42,
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(123, 63, 0, 0.2)'
          }}>
            <Heart size={20} color="#fff" fill="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 20, color: 'var(--color-text)', letterSpacing: '-0.5px' }}>Heal & Play</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500 }}>Play Games. Save Lives.</div>
          </div>
        </motion.div>

        {/* Hero Copy & Visuals */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ margin: '48px 0' }}
        >
          <motion.div
            variants={fadeUp}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--color-bg-warm)',
              border: '1px solid #E8D9C8',
              borderRadius: '99px',
              padding: '6px 14px',
              marginBottom: '20px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <span style={{ fontSize: '13px' }}>✨</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              Micro-Donations, Mega Impact
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: 'Outfit',
              fontSize: 'clamp(38px, 4.5vw, 56px)',
              fontWeight: 800,
              lineHeight: 1.15,
              margin: '0 0 20px',
              color: 'var(--color-text)',
              letterSpacing: '-1px'
            }}
          >
            Play Games.<br />
            <span style={{ 
              background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Save Lives.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            style={{
              fontSize: '16px',
              color: 'var(--color-text-muted)',
              lineHeight: 1.65,
              maxWidth: '520px',
              marginBottom: '36px'
            }}
          >
            Join a modern community transforming medical fundraising. Play engaging micro-games, claim verified retail rewards, and fund critical surgeries with just ₹10.
          </motion.p>

          {/* Interactive Child Visual & Floating UI Cards */}
          <motion.div 
            variants={fadeUp} 
            style={{ position: 'relative', width: '100%', maxWidth: '520px', height: '260px', borderRadius: '24px', overflow: 'visible', marginBottom: '40px' }}
          >
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--color-border)',
              position: 'relative'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80" 
                alt="Child healing smiling"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(26, 17, 9, 0.8) 0%, rgba(26, 17, 9, 0) 60%)'
              }} />
              
              <div style={{ position: 'absolute', bottom: 20, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Featured Treatment Case</span>
                  <h4 style={{ margin: '2px 0 0', color: '#fff', fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit' }}>Baby Aarav</h4>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', color: '#fff', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 600 }}>
                  ₹2.14L Raised
                </div>
              </div>
            </div>

            {/* Floating Card 1: Recent Donation */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-24px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '12px 18px',
                boxShadow: '0 10px 25px rgba(123, 63, 0, 0.12)',
                border: '1px solid rgba(232, 224, 214, 0.6)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                zIndex: 2
              }}
              className="floating-card-1"
            >
              <div style={{ width: 10, height: 10, background: '#16a34a', borderRadius: '50%' }} />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>Live Donation</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>₹10 received just now</div>
              </div>
            </motion.div>

            {/* Floating Card 2: Interactive Impact Math */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 2 }}
              style={{
                position: 'absolute',
                bottom: '-25px',
                left: '-24px',
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '14px 20px',
                boxShadow: '0 12px 30px rgba(123, 63, 0, 0.15)',
                border: '1px solid rgba(232, 224, 214, 0.8)',
                width: '240px',
                zIndex: 2
              }}
              className="floating-card-2"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>Your ₹10 Impact</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                <span>Treatment: <strong>₹9.00</strong></span>
                <span>Gateway: <strong>₹1.00</strong></span>
              </div>
              <div style={{ height: '4px', background: 'var(--color-bg-warm)', borderRadius: '99px', marginTop: 8, overflow: 'hidden' }}>
                <div style={{ width: '90%', height: '100%', background: 'var(--color-primary)' }} />
              </div>
            </motion.div>
          </motion.div>

          {/* Inline Stats Row */}
          <motion.div 
            variants={staggerContainer}
            style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}
          >
            {stats.map(({ icon: Icon, value, label }) => (
              <motion.div key={label} variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  background: 'var(--color-bg-warm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #E8D9C8'
                }}>
                  <Icon size={18} color="var(--color-primary)" />
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text)', fontFamily: 'Outfit', lineHeight: 1.1 }}>{value}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Global Transparency Footer Tag */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: 'var(--color-text-muted)' }}
        >
          <Shield size={14} color="var(--color-primary)" />
          Every transaction verified on the blockchain registry.
        </motion.div>
      </div>

      {/* ────────────────── RIGHT SIDE: Premium Modern Login Panel ────────────────── */}
      <div style={{
        padding: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        borderLeft: '1px solid var(--color-border)',
        position: 'relative',
        zIndex: 1,
      }} className="login-right-panel">
        
        {/* Blurred glass background elements under the card */}
        <div style={{
          position: 'absolute',
          top: '25%',
          right: '15%',
          width: '200px',
          height: '200px',
          background: 'rgba(232, 168, 124, 0.08)',
          filter: 'blur(60px)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          style={{
            width: '100%',
            maxWidth: '420px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Form Header */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{
              fontFamily: 'Outfit',
              fontSize: '28px',
              fontWeight: 800,
              color: 'var(--color-text)',
              letterSpacing: '-0.5px',
              marginBottom: '6px'
            }}>
              Welcome back 👋
            </h2>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-muted)' }}>
              Let's continue healing the world together.
            </p>
          </div>

          {/* Social Sign In Options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: 24 }}>
            <motion.button
              whileHover={{ scale: 1.02, background: 'var(--color-bg-warm)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '12px 16px',
                border: '1.5px solid var(--color-border)',
                borderRadius: '12px',
                background: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-text)',
                transition: 'all 0.2s',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.6 2.2 30.2 0 24 0 14.6 0 6.7 5.4 2.7 13.4l7.8 6C12.4 13 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.7c-.6 3-2.4 5.6-5 7.3l7.8 6C43.9 37.8 46.5 31.5 46.5 24.5z"/><path fill="#FBBC05" d="M10.5 28.8A14.6 14.6 0 0 1 9.5 24c0-1.7.3-3.3.8-4.8l-7.8-6A24 24 0 0 0 0 24c0 3.8.9 7.4 2.5 10.5l8-5.7z"/><path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.8-6c-2 1.4-4.6 2.2-7.4 2.2-6.2 0-11.5-4.2-13.4-9.9l-8 5.7C6.7 42.6 14.6 48 24 48z"/></svg>
              Google
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, background: 'var(--color-bg-warm)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '12px 16px',
                border: '1.5px solid var(--color-border)',
                borderRadius: '12px',
                background: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-text)',
                transition: 'all 0.2s',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 814 1000"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-38.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.3 134.4-316.9 266.5-316.9 100.9 0 184.4 66.9 245.8 66.9 59.2 0 152-71 272.1-71 38.4 0 110.8 3.9 169.6 38.8zm-171.5-150.8c-108.2 0-226.1 72.1-226.1 220.6v2.6c109.5 0 236.2-81.5 236.2-220.6 0-3.9-.6-7.7-1-10.6l-9.1 7.4z"/></svg>
              Apple
            </motion.button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            <span style={{ fontSize: '11px', color: 'var(--color-text-light)', fontWeight: 700, letterSpacing: '0.05em' }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          </div>

          {/* Main Credentials Form */}
          <form onSubmit={handleLogin}>
            {/* Email Field */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: 6, color: 'var(--color-text)' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'Inter',
                    background: '#fff',
                    color: 'var(--color-text)',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-primary)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(123, 63, 0, 0.1)'
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
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
                  Password
                </label>
                <button type="button" style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--color-accent)', cursor: 'pointer', fontWeight: 600 }}>
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 44px 12px 40px',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'Inter',
                    background: '#fff',
                    color: 'var(--color-text)',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-primary)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(123, 63, 0, 0.1)'
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
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <input type="checkbox" id="remember" style={{ cursor: 'pointer', accentColor: 'var(--color-primary)' }} />
              <label htmlFor="remember" style={{ fontSize: '13px', color: 'var(--color-text-muted)', cursor: 'pointer' }}>Keep me logged in</label>
            </div>

            {/* Login Action */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Outfit',
                opacity: loading ? 0.8 : 1,
                boxShadow: '0 4px 15px rgba(123, 63, 0, 0.2)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              {loading ? 'Securing Connection…' : 'Sign In'}
              <ArrowRight size={16} />
            </motion.button>
          </form>

          {/* Switch to Sign Up */}
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--color-text-muted)', margin: '24px 0 16px' }}>
            New to Heal & Play?{' '}
            <button style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
              Create a free account
            </button>
          </p>

          {/* Premium Guest mode Callout */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            onClick={handleGuest}
            style={{
              padding: '16px',
              background: 'var(--color-bg-warm)',
              border: '1.5px dashed var(--color-primary-light)',
              borderRadius: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-sm)',
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
                <User size={16} color="var(--color-primary)" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)', display: 'block' }}>Explore as Guest</span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Browse cases without logging in</span>
              </div>
            </div>
            <ChevronRight size={16} color="var(--color-primary)" />
          </motion.div>

        </motion.div>
      </div>

      {/* Meticulous split layout CSS overrides for mobile viewports */}
      <style>{`
        @media (max-width: 960px) {
          .login-split-layout {
            grid-template-columns: 1fr !important;
          }
          .login-left-panel {
            padding: 32px 24px !important;
            border-bottom: 1px solid var(--color-border);
          }
          .login-right-panel {
            padding: 48px 24px !important;
            border-left: none !important;
          }
          .floating-card-1, .floating-card-2 {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
