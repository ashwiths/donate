import { useState, useEffect } from 'react'
import helpJanaImg from '../assets/janamithra.png'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Heart, Shield, Award, Sparkles, CheckCircle2, X, ChevronRight, Activity, Globe } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { fadeUp, staggerContainer } from '../animations/variants'
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth'
import { auth, provider } from '../firebase'

// Premium background particles
const Particles = () => (
  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: Math.random() * 1000, x: Math.random() * 1000, scale: Math.random() * 0.5 + 0.5 }}
        animate={{ opacity: [0, 0.4, 0], y: [null, Math.random() * -300], x: [null, Math.random() * 100 - 50] }}
        transition={{ duration: Math.random() * 15 + 15, repeat: Infinity, ease: "linear", delay: Math.random() * 5 }}
        style={{
          position: 'absolute', width: '6px', height: '6px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #C8773A, #D4AF37)', filter: 'blur(2px)', willChange: 'transform, opacity'
        }}
      />
    ))}
  </div>
);

const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=80'
]

export default function LoginPage() {
  const navigate = useNavigate()
  const { user, login } = useAuth()

  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (user) {
      navigate('/home')
    }
  }, [user, navigate])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      console.log("User:", result.user)
      login({ name: result.user.displayName || 'User', email: result.user.email, photoURL: result.user.photoURL, uid: result.user.uid })
      setIsLoginOpen(false)
      navigate('/home')
    } catch (error) {
      console.error("Google Auth Error:", error)
    }
  }

  const handleForgotPassword = async () => {
    if (!form.email) {
      setAuthError('Please enter your email address first.')
      setSuccessMessage('')
      return
    }
    setLoading(true)
    setAuthError('')
    setSuccessMessage('')
    try {
      await sendPasswordResetEmail(auth, form.email)
      setSuccessMessage('Password reset link sent to your email!')
    } catch (error) {
      console.error("Forgot Password Error:", error)
      let readableError = error.message
      if (error.code === 'auth/user-not-found') readableError = 'No user found with this email.'
      if (error.code === 'auth/invalid-email') readableError = 'Invalid email address.'
      if (error.code === 'auth/operation-not-allowed') {
        readableError = 'Email & Password authentication is disabled in your Firebase console. Please go to Firebase Console > Authentication > Sign-in method, click "Email/Password", and toggle it to Enabled.'
      }
      setAuthError(readableError)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setAuthError('')
    setSuccessMessage('')

    try {
      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(auth, form.email, form.password)
        await updateProfile(result.user, { displayName: form.name })
        login({ name: form.name, email: form.email, photoURL: result.user.photoURL, uid: result.user.uid })
        setIsLoginOpen(false)
        navigate('/home')
      } else {
        const result = await signInWithEmailAndPassword(auth, form.email, form.password)
        login({ name: result.user.displayName || 'User', email: result.user.email, photoURL: result.user.photoURL, uid: result.user.uid })
        setIsLoginOpen(false)
        navigate('/home')
      }
    } catch (error) {
      console.error("Auth Error:", error)
      let readableError = error.message
      if (error.code === 'auth/user-not-found') readableError = 'No user found with this email.'
      if (error.code === 'auth/wrong-password') readableError = 'Incorrect password.'
      if (error.code === 'auth/email-already-in-use') readableError = 'Email is already registered.'
      if (error.code === 'auth/weak-password') readableError = 'Password should be at least 6 characters.'
      if (error.code === 'auth/invalid-email') readableError = 'Invalid email address.'
      if (error.code === 'auth/operation-not-allowed') {
        readableError = 'Email & Password authentication is disabled in your Firebase console. Please go to Firebase Console > Authentication > Sign-in method, click "Email/Password", and toggle it to Enabled.'
      }
      setAuthError(readableError)
    } finally {
      setLoading(false)
    }
  }



  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      background: '#FCFAF6'
    }}>
      {/* Layered cinematic background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.6, backgroundImage: 'url("/background.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(10px) brightness(1.1)' }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'radial-gradient(circle at top right, rgba(200, 119, 58, 0.08) 0%, transparent 60%)' }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'radial-gradient(circle at bottom left, rgba(139, 94, 52, 0.08) 0%, transparent 60%)' }} />
      <Particles />

      {/* ────────────────── 1. PREMIUM FLOATING NAVBAR ────────────────── */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 32px',
          margin: '24px auto',
          maxWidth: '1240px',
          width: 'calc(100% - 48px)',
          zIndex: 10,
          position: 'relative',
          border: '1px solid rgba(232, 224, 214, 0.8)',
          borderRadius: '99px',
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 12px 40px rgba(139, 94, 52, 0.06), inset 0 1px 0 rgba(255,255,255,0.6)'
        }} className="landing-header">
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
            borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 16px rgba(123, 63, 0, 0.2), inset 0 2px 4px rgba(255,255,255,0.2)'
          }}>
            <Heart size={20} color="#fff" fill="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 20, color: '#3D2B1A', letterSpacing: '-0.5px', lineHeight: 1.1 }}>Heal & Play</div>
            <div style={{ fontSize: 10, color: '#8C4F1A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Play Games. Save Lives.</div>
          </div>
        </div>

        {/* Desktop Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="landing-nav-links">
          <span className="nav-hover-link">Our Mission</span>
          <span className="nav-hover-link">How it Works</span>
          <span className="nav-hover-link">Transparency</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button 
            onClick={() => setIsLoginOpen(true)}
            style={{ background: 'none', border: 'none', fontSize: '15px', fontWeight: 800, color: '#8C4F1A', cursor: 'pointer', fontFamily: 'Outfit' }}
          >
            Sign In
          </button>
          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: '0 12px 30px rgba(139, 94, 52, 0.2)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsLoginOpen(true)}
            style={{ 
              padding: '12px 28px', fontSize: '15px', borderRadius: '99px',
              background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)', color: '#FFF', border: 'none',
              fontWeight: 800, fontFamily: 'Outfit', cursor: 'pointer', transition: 'all 0.3s ease'
            }}
            className="mobile-full-btn"
          >
            Play & Support
          </motion.button>
        </div>
      </motion.header>

      {/* ────────────────── 2. CINEMATIC HERO SECTION ────────────────── */}
      <main style={{
        flex: 1,
        maxWidth: 1240,
        margin: '0 auto',
        padding: 'clamp(24px,4vw,40px) clamp(16px,3vw,32px) clamp(60px,8vw,100px)',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: 'clamp(32px,5vw,60px)',
        alignItems: 'center',
        boxSizing: 'border-box',
        width: '100%',
        zIndex: 1,
        position: 'relative'
      }} className="hero-split-grid">
        
        {/* Left Side Column: Emotional Text & CTAs */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '99px', padding: '8px 18px', alignSelf: 'flex-start', backdropFilter: 'blur(8px)' }}>
            <Sparkles size={14} color="#D4AF37" />
            <span style={{ fontSize: '11.5px', fontWeight: 900, color: '#8C4F1A', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Micro-donations, Infinite Impact
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} style={{
            fontFamily: 'Outfit',
            fontSize: 'clamp(46px, 5.5vw, 68px)',
            fontWeight: 900,
            lineHeight: 1.05,
            color: '#3D2B1A',
            margin: 0,
            letterSpacing: '-2.5px'
          }}>
            Play Small Games.<br />
            <span style={{ 
              background: 'linear-gradient(135deg, #8C4F1A 0%, #D4AF37 50%, #C8773A 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'textGradient 5s linear infinite'
            }}>Save Sick Children.</span>
          </motion.h1>

          <motion.p variants={fadeUp} style={{ fontSize: '18px', color: '#5A4635', lineHeight: 1.6, maxWidth: '520px', margin: 0, fontWeight: 500 }}>
            Every ₹10 you spend on our interactive games goes directly toward verified pediatric medical treatments. Small actions create real miracles.
          </motion.p>

          <motion.div variants={fadeUp} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8 }} className="hero-buttons">
            <motion.button 
              whileHover={{ scale: 1.02, boxShadow: '0 16px 40px rgba(139, 94, 52, 0.25)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsLoginOpen(true)}
              style={{ 
                padding: '18px 36px', fontSize: '16px', borderRadius: '99px',
                background: 'linear-gradient(135deg, #8C4F1A, #C8773A)', color: '#FFF', border: 'none',
                fontWeight: 800, fontFamily: 'Outfit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                boxShadow: '0 8px 24px rgba(139, 94, 52, 0.15)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              Choose Game & Help <ChevronRight size={18} />
            </motion.button>
          </motion.div>

          {/* Live Trust Section */}
          <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {AVATARS.map((avatar, idx) => (
                <img key={idx} src={avatar} alt="Helper" style={{
                  width: 38, height: 38, borderRadius: '50%', border: '3px solid #FCFAF6',
                  marginLeft: idx === 0 ? 0 : -14, objectFit: 'cover', boxShadow: '0 4px 12px rgba(139, 94, 52, 0.1)'
                }} />
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ position: 'relative', width: 8, height: 8 }}>
                  <span style={{ position: 'absolute', inset: 0, background: '#10B981', borderRadius: '50%', opacity: 0.5, animation: 'pulseRing 2s cubic-bezier(0,0,0.2,1) infinite' }} />
                  <span style={{ position: 'absolute', inset: 0, background: '#10B981', borderRadius: '50%' }} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 900, color: '#3D2B1A', fontFamily: 'Outfit' }}>Thousands are playing live</span>
              </div>
              <span style={{ fontSize: '12px', color: '#7A6A5A', fontWeight: 600 }}>100% verified hospital settlements</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side Column: Premium Floating Medical Dashboard Card */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            whileHover={{ y: -10, boxShadow: '0 40px 80px rgba(139, 94, 52, 0.15)' }}
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '32px',
              border: '1px solid rgba(235, 224, 214, 0.9)',
              padding: '24px',
              width: '100%',
              maxWidth: '460px',
              boxShadow: '0 30px 60px rgba(139, 94, 52, 0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
              boxSizing: 'border-box',
              position: 'relative',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
            }}
          >
            {/* Visual Container */}
            <div style={{ position: 'relative', width: '100%', height: '300px', borderRadius: '20px', overflow: 'hidden', marginBottom: 24 }}>
              <img src={helpJanaImg} alt="Janamithra" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26, 17, 9, 0.9) 0%, rgba(26, 17, 9, 0.1) 60%)' }} />

              {/* Verified Emblem */}
              <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', padding: '6px 14px', borderRadius: '99px', fontSize: '10px', fontWeight: 900, color: '#166534', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Shield size={12} fill="#166534" />
                VERIFIED MEDICAL CASE
              </div>

              {/* Title & Stats */}
              <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
                <span style={{ fontSize: '10px', color: '#D4AF37', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.06em' }}>Nanavati Max Hospital</span>
                <h3 style={{ margin: '4px 0 2px', color: '#fff', fontSize: '24px', fontWeight: 900, fontFamily: 'Outfit' }}>Janamithra</h3>
                <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>8 months old • Biliary Atresia Treatment</p>
              </div>
            </div>

            {/* Glowing Funding Progress */}
            <div style={{ marginBottom: 24, position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#5A4635', marginBottom: 12 }}>
                <span style={{ fontWeight: 600 }}>Funded: <strong style={{ color: '#3D2B1A', fontSize: '15px' }}>₹2.14L</strong></span>
                <span style={{ fontWeight: 600 }}>Goal: <strong style={{ color: '#3D2B1A', fontSize: '15px' }}>₹70L</strong></span>
              </div>
              <div style={{ position: 'relative', height: '10px', background: '#E8E0D6', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }} style={{ position: 'absolute', height: '100%', background: 'linear-gradient(90deg, #8C4F1A, #D4AF37)', borderRadius: '99px' }} />
              </div>
              <div style={{ position: 'absolute', bottom: '-8px', left: 0, width: '45%', height: '20px', background: 'radial-gradient(ellipse, rgba(212, 175, 55, 0.3) 0%, transparent 70%)', filter: 'blur(6px)' }} />
            </div>

            {/* Subtext info */}
            <div style={{ background: 'linear-gradient(135deg, #FFF9F3, #FAF0E6)', borderRadius: '16px', padding: '16px', border: '1px solid #EBD5C2', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, fontSize: '12.5px', color: '#7A6A5A', lineHeight: 1.5 }}>
              <div style={{ background: '#fff', borderRadius: '50%', padding: '6px', boxShadow: '0 2px 8px rgba(139,94,52,0.1)', flexShrink: 0 }}>
                <Heart size={16} color="#8C4F1A" fill="#8C4F1A" />
              </div>
              <span style={{ fontWeight: 600 }}>100% of your game purchases directly settle verified hospital bills.</span>
            </div>

            {/* Action CTA */}
            <motion.button 
              whileHover={{ scale: 1.02, boxShadow: '0 12px 30px rgba(61, 43, 26, 0.3)' }} 
              whileTap={{ scale: 0.98 }} 
              onClick={() => setIsLoginOpen(true)}
              style={{ width: '100%', padding: '18px', borderRadius: '16px', fontSize: '16px', fontWeight: 900, fontFamily: 'Outfit', background: 'linear-gradient(135deg, #8B5E34, #3D2B1A)', color: '#FFF', border: 'none', boxShadow: '0 8px 24px rgba(61, 43, 26, 0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              <Sparkles size={16} /> Donate ₹10 & Play
            </motion.button>
          </motion.div>
        </div>

      </main>

      {/* ────────────────── 3. PREMIUM GLASSMORPHIC LOGIN MODAL ────────────────── */}
      <AnimatePresence>
        {isLoginOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(26, 17, 9, 0.55)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderRadius: '32px',
                border: '1px solid rgba(255, 255, 255, 0.8)', padding: '40px', width: '100%', maxWidth: '420px',
                boxShadow: '0 40px 80px rgba(61, 43, 26, 0.2), inset 0 1px 0 rgba(255,255,255,1)', boxSizing: 'border-box', position: 'relative',
                transform: 'translateZ(0)'
              }}
            >
              <button
                onClick={() => setIsLoginOpen(false)}
                style={{ position: 'absolute', top: 24, right: 24, background: '#FAF6F2', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#7A6A5A', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#F2EAD8'; e.currentTarget.style.color = '#3D2B1A' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#FAF6F2'; e.currentTarget.style.color = '#7A6A5A' }}
              >
                <X size={18} />
              </button>

              <div style={{ marginBottom: 32, textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #FFF9F3, #FAF0E6)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid #EBD5C2', boxShadow: '0 8px 24px rgba(139,94,52,0.1)' }}>
                  <Heart size={24} color="#8C4F1A" fill="#8C4F1A" />
                </div>
                <h2 className="premium-title-sm" style={{ margin: '0 0 8px' }}>
                  {isSignUp ? 'Create an Account' : 'Sign In to Support'}
                </h2>
                <p style={{ margin: 0, fontSize: '14px', color: '#7A6A5A', fontWeight: 500 }}>
                  Join the ecosystem of healing and play
                </p>
              </div>

              {authError && (
                <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444', fontSize: '13px', fontWeight: 600, marginBottom: '16px', textAlign: 'center' }}>
                  {authError}
                </div>
              )}
              {successMessage && (
                <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10B981', fontSize: '13px', fontWeight: 600, marginBottom: '16px', textAlign: 'center' }}>
                  {successMessage}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: 24 }}>
                <button type="button" onClick={handleGoogleLogin} style={{ padding: '12px 16px', border: '1px solid #E8E0D6', borderRadius: '12px', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: '13.5px', fontWeight: 800, color: '#3D2B1A', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'} onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)'}>
                  <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.6 2.2 30.2 0 24 0 14.6 0 6.7 5.4 2.7 13.4l7.8 6C12.4 13 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.7c-.6 3-2.4 5.6-5 7.3l7.8 6C43.9 37.8 46.5 31.5 46.5 24.5z"/><path fill="#FBBC05" d="M10.5 28.8A14.6 14.6 0 0 1 9.5 24c0-1.7.3-3.3.8-4.8l-7.8-6A24 24 0 0 0 0 24c0 3.8.9 7.4 2.5 10.5l8-5.7z"/><path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.8-6c-2 1.4-4.6 2.2-7.4 2.2-6.2 0-11.5-4.2-13.4-9.9l-8 5.7C6.7 42.6 14.6 48 24 48z"/></svg>
                  Google
                </button>
                <button type="button" style={{ padding: '12px 16px', border: '1px solid #E8E0D6', borderRadius: '12px', background: '#FAF8F5', cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: '13px', fontWeight: 800, color: '#A09080', boxShadow: 'none', transition: 'all 0.2s', opacity: 0.6, filter: 'blur(0.5px)' }}>
                  <svg width="14" height="14" viewBox="0 0 814 1000" style={{ fill: '#A09080' }}><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-38.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.3 134.4-316.9 266.5-316.9 100.9 0 184.4 66.9 245.8 66.9 59.2 0 152-71 272.1-71 38.4 0 110.8 3.9 169.6 38.8zm-171.5-150.8c-108.2 0-226.1 72.1-226.1 220.6v2.6c109.5 0 236.2-81.5 236.2-220.6 0-3.9-.6-7.7-1-10.6l-9.1 7.4z"/></svg>
                  Coming Soon
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{ flex: 1, height: 1, background: '#E8E0D6' }} />
                <span style={{ fontSize: '11px', color: '#B8A898', fontWeight: 900, letterSpacing: '0.06em' }}>OR EMAIL</span>
                <div style={{ flex: 1, height: 1, background: '#E8E0D6' }} />
              </div>

              <form onSubmit={handleEmailAuth}>
                {isSignUp && (
                  <div style={{ marginBottom: 16 }}>
                    <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="Full Name" required style={{ width: '100%', padding: '16px', border: '1px solid #EBD5C2', borderRadius: '12px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', background: '#FAF6F2', color: '#3D2B1A', fontWeight: 500, transition: 'all 0.2s' }} onFocus={e => e.currentTarget.style.borderColor = '#C8773A'} onBlur={e => e.currentTarget.style.borderColor = '#EBD5C2'} />
                  </div>
                )}
                <div style={{ marginBottom: 16 }}>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email Address" required style={{ width: '100%', padding: '16px', border: '1px solid #EBD5C2', borderRadius: '12px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', background: '#FAF6F2', color: '#3D2B1A', fontWeight: 500, transition: 'all 0.2s' }} onFocus={e => e.currentTarget.style.borderColor = '#C8773A'} onBlur={e => e.currentTarget.style.borderColor = '#EBD5C2'} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required style={{ width: '100%', padding: '16px', border: '1px solid #EBD5C2', borderRadius: '12px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', background: '#FAF6F2', color: '#3D2B1A', fontWeight: 500, transition: 'all 0.2s' }} onFocus={e => e.currentTarget.style.borderColor = '#C8773A'} onBlur={e => e.currentTarget.style.borderColor = '#EBD5C2'} />
                </div>
                {!isSignUp && (
                  <div style={{ textAlign: 'right', marginTop: '-12px', marginBottom: '20px' }}>
                    <span onClick={handleForgotPassword} style={{ fontSize: '12.5px', color: '#8C4F1A', fontWeight: 800, cursor: 'pointer', fontFamily: 'Outfit', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#C8773A'} onMouseLeave={e => e.currentTarget.style.color = '#8C4F1A'}>
                      Forgot Password?
                    </span>
                  </div>
                )}

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} style={{ width: '100%', padding: '18px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #8B5E34, #3D2B1A)', color: '#fff', fontSize: '16px', fontWeight: 800, fontFamily: 'Outfit', cursor: 'pointer', boxShadow: '0 8px 24px rgba(61, 43, 26, 0.25)', transition: 'all 0.2s' }}>
                  {loading ? 'Processing...' : isSignUp ? 'Create Account Securely' : 'Sign In Securely'}
                </motion.button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <span onClick={() => { setIsSignUp(!isSignUp); setAuthError(''); setSuccessMessage(''); }} style={{ fontSize: '13px', color: '#8C4F1A', fontWeight: 800, cursor: 'pointer', fontFamily: 'Outfit' }}>
                  {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </span>
              </div>


            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-hover-link {
          font-size: 14.5px;
          font-weight: 700;
          color: #5C4C3C;
          cursor: pointer;
          transition: color 0.2s ease;
          position: relative;
        }
        .nav-hover-link:hover { color: #8C4F1A; }
        .nav-hover-link::after {
          content: '';
          position: absolute;
          bottom: -6px; left: 0;
          width: 0%; height: 2px;
          background: #8C4F1A;
          transition: width 0.3s ease;
        }
        .nav-hover-link:hover::after { width: 100%; }
        @keyframes pulseRing {
          0%   { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(3.5); opacity: 0; }
        }
        @media (max-width: 900px) {
          .landing-header { padding: 12px 20px !important; margin: 12px auto !important; width: calc(100% - 24px) !important; }
          .landing-nav-links { display: none !important; }
          .hero-split-grid {
            grid-template-columns: 1fr !important;
            text-align: center !important;
            padding: 24px 20px 80px !important;
            gap: 40px !important;
          }
          .hero-split-grid > div:first-child { align-items: center !important; display: flex !important; flex-direction: column !important; }
          .hero-split-grid p { text-align: center !important; }
          .mobile-full-btn { display: none !important; }
          .hero-buttons { flex-direction: column !important; width: 100% !important; }
          .hero-buttons button { width: 100% !important; justify-content: center !important; }
        }
        @media (max-width: 480px) {
          .hero-split-grid { padding: 20px 14px 60px !important; }
          .landing-header { margin: 10px auto !important; }
        }
      `}</style>
    </div>
  )
}
