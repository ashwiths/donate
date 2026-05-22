import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, Heart, Shield, FileCheck, Globe } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { fadeUp, staggerContainer, scaleIn } from '../animations/variants'

const trustBadges = [
  { icon: Shield, label: '100% Transparent', desc: 'Every penny is used for treatment funds' },
  { icon: FileCheck, label: 'Verified Cases', desc: 'All cases are verified with hospital proof' },
  { icon: Lock, label: 'Secure & Safe', desc: 'Your data and payments are always protected' },
  { icon: User, label: 'Together We Heal', desc: 'Together, we can save more lives' },
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
    // Simulate async login — replace with real API call later
    await new Promise((r) => setTimeout(r, 800))
    login({ name: 'Vignesh', email: form.email })
    navigate('/home')
  }

  const handleGuest = () => {
    loginAsGuest()
    navigate('/home')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Header bar */}
      <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={18} color="#fff" fill="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 18, color: 'var(--color-text)' }}>Heal & Play</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Play Games. Save Lives.</div>
          </div>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid var(--color-border)', borderRadius: 99, padding: '6px 14px', cursor: 'pointer', fontSize: 13, color: 'var(--color-text-muted)' }}>
          <Globe size={14} /> English
        </button>
      </div>

      {/* Hero text */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{ textAlign: 'center', padding: '32px 24px 24px' }}
      >
        <motion.h1
          variants={fadeUp}
          style={{ fontFamily: 'Outfit', fontSize: 'clamp(32px,6vw,52px)', fontWeight: 800, margin: 0, lineHeight: 1.1, color: 'var(--color-text)' }}
        >
          Play Games.<br />
          <span style={{ color: 'var(--color-primary)' }}>Save Lives.</span>{' '}
          <span style={{ color: 'var(--color-primary)' }}>🤍</span>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          style={{ marginTop: 12, fontSize: 15, color: 'var(--color-text-muted)', lineHeight: 1.6 }}
        >
          Your small contribution can give a child<br />a second chance at life. 🤎
        </motion.p>
      </motion.div>

      {/* Login Card */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 16px 40px' }}>
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          style={{
            background: '#fff',
            borderRadius: 24,
            padding: '36px 32px',
            width: '100%',
            maxWidth: 440,
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 700, margin: '0 0 6px', color: 'var(--color-text)' }}>
              Welcome Back! 👋
            </h2>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-muted)' }}>Login to continue your journey</p>
          </div>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--color-text)' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                  style={{
                    width: '100%', padding: '12px 14px 12px 40px',
                    border: '1.5px solid var(--color-border)', borderRadius: 12,
                    fontSize: 14, outline: 'none', fontFamily: 'Inter',
                    background: '#fff', color: 'var(--color-text)',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--color-text)' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%', padding: '12px 44px 12px 40px',
                    border: '1.5px solid var(--color-border)', borderRadius: 12,
                    fontSize: 14, outline: 'none', fontFamily: 'Inter',
                    background: '#fff', color: 'var(--color-text)',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
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

            <div style={{ textAlign: 'right', marginBottom: 20 }}>
              <button type="button" style={{ background: 'none', border: 'none', fontSize: 13, color: 'var(--color-accent)', cursor: 'pointer', fontWeight: 600 }}>
                Forgot Password?
              </button>
            </div>

            {/* Login btn */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              style={{
                width: '100%', padding: '14px', background: 'var(--color-primary)',
                color: '#fff', border: 'none', borderRadius: 12, fontSize: 16,
                fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Outfit', opacity: loading ? 0.8 : 1,
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'Logging in…' : 'Login'}
            </motion.button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          </div>

          {/* Social logins */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <motion.button
              whileHover={{ scale: 1.02, background: '#f5f5f5' }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%', padding: '12px', border: '1.5px solid var(--color-border)',
                borderRadius: 12, background: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                fontSize: 14, fontWeight: 600, color: 'var(--color-text)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.6 2.2 30.2 0 24 0 14.6 0 6.7 5.4 2.7 13.4l7.8 6C12.4 13 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.7c-.6 3-2.4 5.6-5 7.3l7.8 6C43.9 37.8 46.5 31.5 46.5 24.5z"/><path fill="#FBBC05" d="M10.5 28.8A14.6 14.6 0 0 1 9.5 24c0-1.7.3-3.3.8-4.8l-7.8-6A24 24 0 0 0 0 24c0 3.8.9 7.4 2.5 10.5l8-5.7z"/><path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.8-6c-2 1.4-4.6 2.2-7.4 2.2-6.2 0-11.5-4.2-13.4-9.9l-8 5.7C6.7 42.6 14.6 48 24 48z"/></svg>
              Continue with Google
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, background: '#f5f5f5' }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%', padding: '12px', border: '1.5px solid var(--color-border)',
                borderRadius: 12, background: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                fontSize: 14, fontWeight: 600, color: 'var(--color-text)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 814 1000"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-38.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.3 134.4-316.9 266.5-316.9 100.9 0 184.4 66.9 245.8 66.9 59.2 0 152-71 272.1-71 38.4 0 110.8 3.9 169.6 38.8zm-171.5-150.8c-108.2 0-226.1 72.1-226.1 220.6v2.6c109.5 0 236.2-81.5 236.2-220.6 0-3.9-.6-7.7-1-10.6l-9.1 7.4z"/></svg>
              Continue with Apple
            </motion.button>
          </div>

          {/* Sign up */}
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--color-text-muted)', margin: '18px 0' }}>
            Don&apos;t have an account?{' '}
            <button style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
              Sign Up
            </button>
          </p>

          {/* Guest */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGuest}
            style={{
              width: '100%', padding: '14px', background: '#fff',
              border: '1.5px solid var(--color-primary)', borderRadius: 12,
              cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 2,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={18} color="var(--color-primary)" />
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-primary)' }}>Continue as Guest</span>
            </div>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Explore without login</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Trust badges */}
      <div style={{ background: '#fff', borderTop: '1px solid var(--color-border)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 20 }}>
          {trustBadges.map(({ icon: Icon, label, desc }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ width: 36, height: 36, background: 'var(--color-bg-warm)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} color="var(--color-primary)" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--color-text)', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '14px', background: '#fff' }}>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>
          © 2024 Heal & Play. All rights reserved. Together, we can save more lives. 🤎
        </p>
      </div>
    </div>
  )
}
