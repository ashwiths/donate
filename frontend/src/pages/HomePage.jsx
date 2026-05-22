import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Users, Shield, CheckCircle2, ChevronRight, Play, Heart, Star, Award, Sparkles, Gift, Gamepad2, Trophy, Clock, HeartHandshake, FileText, Download, TrendingUp, ShieldCheck, HeartPulse, CreditCard } from 'lucide-react'
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
  percentage: 0.03,
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
    percentage: 0.32,
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
    percentage: 0.27,
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
    percentage: 0.08,
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
    percentage: 0.12,
    tag: 'Urgent Case',
    storyPreview: "An urgent bone marrow transplant from a verified matched donor will rebuild Meera's immune system completely."
  }
]

const TRENDING_GAMES = [
  { id: 'g1', title: 'Spin the Wheel', icon: '🎯', players: '1,240 active helpers', cost: 10, rating: 4.8 },
  { id: 'g2', title: 'Lucky Scratch Card', icon: '💳', players: '820 online now', cost: 10, rating: 4.9 },
  { id: 'g3', title: 'Daily Treasure Box', icon: '🎁', players: '2.5K helpers today', cost: 0, rating: 4.7 }
]

const COMPLETED_TREATMENTS = [
  { name: 'Baby Kabir', age: '4 months', illness: 'Congenital Heart Defect', status: 'Successfully Cured!', date: '2 days ago', image: 'https://images.unsplash.com/photo-1519689680058-324335c77ebe?w=200&q=80' },
  { name: 'Baby Aisha', age: '1 year', illness: 'Liver Transplant Success', status: 'Discharged!', date: '1 week ago', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80' }
]

const REWARD_CATEGORIES = [
  { brand: 'Flipkart Voucher', value: 'flat 10% off', logo: '🏷️', category: 'Shopping' },
  { brand: 'Amazon Pay Gift Card', value: 'flat ₹50 cashback', logo: '💳', category: 'Vouchers' },
  { brand: 'Swiggy Food Pass', value: 'free delivery voucher', logo: '🍕', category: 'Food' }
]

const LIVE_DONATIONS = [
  { text: "Someone donated ₹10 from Chennai just now ❤️", time: "1s ago" },
  { text: "Flat ₹50 Flipkart coupon unlocked in Bangalore 🏷️", time: "12s ago" },
  { text: "₹2,500 raised for Baby Aarav this hour 📈", time: "3m ago" },
  { text: "Nanavati Max Hospital cleared billing milestone 🛡️", time: "8m ago" }
]

export default function HomePage() {
  const navigate = useNavigate()

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

          {/* Right Column (45%): ONE Dynamic Featured Case Spotlight */}
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
                padding: '24px',
                width: '100%',
                maxWidth: '450px',
                boxShadow: '0 25px 60px rgba(123, 63, 0, 0.08)',
                boxSizing: 'border-box',
                position: 'relative'
              }}
              className="featured-child-premium-card"
            >
              {/* Case tag */}
              <div style={{
                position: 'absolute',
                top: 36,
                left: 36,
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
                marginBottom: 20
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
                  bottom: 16,
                  left: 16,
                  right: 16,
                  color: '#fff'
                }}>
                  <span style={{ fontSize: '10px', opacity: 0.8, textTransform: 'uppercase', fontWeight: 700 }}>{URGENT_CASE.hospital}</span>
                  <h3 style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: 800, fontFamily: 'Outfit' }}>{URGENT_CASE.name} ({URGENT_CASE.age})</h3>
                  <p style={{ margin: 0, fontSize: '11.5px', opacity: 0.8 }}>{URGENT_CASE.condition}</p>
                </div>
              </div>

              {/* Progress metrics */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--color-text-muted)', marginBottom: 8 }}>
                  <span>Raised: <strong>₹2.14L</strong></span>
                  <span>Goal: <strong>₹70L</strong></span>
                </div>
                <DonationProgress raised={URGENT_CASE.raisedAmount} required={URGENT_CASE.requiredAmount} percentage={URGENT_CASE.percentage} compact />
              </div>

              <motion.button 
                onClick={() => navigate('/main')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary" 
                style={{ 
                  width: '100%', 
                  padding: '13px', 
                  borderRadius: '11px', 
                  fontSize: '14.5px',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
                  boxShadow: '0 4px 15px rgba(123, 63, 0, 0.15)',
                  cursor: 'pointer',
                  border: 'none',
                  color: '#fff'
                }}
              >
                Donate ₹10 & Start Playing
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

        {/* ────────────────── 3. REDESIGNED ULTRA-PREMIUM PAYMENT TRANSPARENCY ────────────────── */}
        <section style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          
          {/* Centered Section Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
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
                0% Platform Commission
              </span>
            </motion.div>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '32px', color: 'var(--color-text)', margin: '4px 0 0', letterSpacing: '-0.75px' }}>
              Where Your Contribution Goes 💳
            </h2>
            <p style={{ margin: '8px 0 0', fontSize: '15px', color: 'var(--color-text-muted)', maxWidth: '580px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>
              We route 100% of ticket transactions to children's hospital operations. No platform fees, no complex cutaways. Complete transparency.
            </p>
          </div>

          {/* Balanced 3-Card Responsive Grid Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 28,
            marginBottom: 48
          }} className="transparency-grid">
            
            {/* Card 1 */}
            <motion.div
              whileHover={{ y: -5, boxShadow: '0 15px 35px rgba(123, 63, 0, 0.05)' }}
              transition={{ duration: 0.2 }}
              style={{
                background: '#fff',
                borderRadius: '20px',
                border: '1px solid rgba(232, 224, 214, 0.6)',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: '#FFF7ED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)'
              }}>
                <HeartPulse size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--color-text)', fontFamily: 'Outfit' }}>Direct Hospital Payouts</h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
                ₹9.00 routes directly to settlement of operations and medical bills. We route payments to official hospital accounts, never personal profiles.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              whileHover={{ y: -5, boxShadow: '0 15px 35px rgba(123, 63, 0, 0.05)' }}
              transition={{ duration: 0.2 }}
              style={{
                background: '#fff',
                borderRadius: '20px',
                border: '1px solid rgba(232, 224, 214, 0.6)',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: '#FFF7ED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)'
              }}>
                <CreditCard size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--color-text)', fontFamily: 'Outfit' }}>Secure Gateway Processing</h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
                ₹1.00 covers Razorpays direct SSL transactional network and server gateway processing costs. We absorb zero administration cuts.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              whileHover={{ y: -5, boxShadow: '0 15px 35px rgba(123, 63, 0, 0.05)' }}
              transition={{ duration: 0.2 }}
              style={{
                background: '#fff',
                borderRadius: '20px',
                border: '1px solid rgba(232, 224, 214, 0.6)',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: '#FFF7ED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)'
              }}>
                <FileText size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--color-text)', fontFamily: 'Outfit' }}>Fully Auditable Ledger</h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
                Every ₹10 spent unlocks an instant cryptographic transaction trail and hospital ledger release. Anyone can verify matching allocations anytime.
              </p>
            </motion.div>

          </div>

          {/* Centered Modern Payment Split Infographic */}
          <div style={{
            background: '#FAF2EA',
            border: '1px solid #EBD5C2',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '800px',
            margin: '0 auto',
            boxSizing: 'border-box'
          }}>
            <h4 style={{ margin: '0 0 16px', fontSize: '14.5px', fontWeight: 800, color: '#8C4F1A', textAlign: 'center', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              Micro-Ticket Transaction Allocation
            </h4>
            
            {/* Visual split progress track */}
            <div style={{ 
              height: 24, 
              background: 'rgba(232, 224, 214, 0.6)', 
              borderRadius: '99px', 
              overflow: 'hidden', 
              display: 'flex',
              marginBottom: 16
            }}>
              <div style={{ 
                width: '90%', 
                background: 'linear-gradient(90deg, #8C4F1A, #C8773A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 900
              }}>
                ₹9.00 Direct Treatment (90%)
              </div>
              <div style={{ 
                width: '10%', 
                background: '#5C2D0E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 900
              }}>
                ₹1.00 PG (10%)
              </div>
            </div>

            {/* Split Info Labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }} className="split-labels-flex">
              <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
                🏥 Route: <strong>Nanavati Max Hospital operations desk</strong>
              </span>
              <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
                🔒 Encryption: <strong>Razorpay Direct Gateway Routing</strong>
              </span>
            </div>
          </div>

        </section>

        {/* ────────────────── 4. TRENDING MINI-GAMES ────────────────── */}
        <section style={{ padding: '40px 40px', maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Playable Options</span>
              <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '26px', color: 'var(--color-text)', margin: '2px 0 0', letterSpacing: '-0.5px' }}>Trending Mini-Games</h2>
            </div>
            <button onClick={() => navigate('/main?tab=games')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, fontSize: '13.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              View All Games <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {TRENDING_GAMES.map((game) => (
              <motion.div 
                key={game.id}
                whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(123, 63, 0, 0.06)' }}
                transition={{ duration: 0.2 }}
                style={{
                  background: '#fff',
                  border: '1px solid var(--color-border)',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
                onClick={() => navigate('/main?tab=games')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ 
                    fontSize: '30px',
                    width: 52,
                    height: 52,
                    background: '#FFF7ED',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>{game.icon}</div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15.5px', fontWeight: 800, color: 'var(--color-text)', fontFamily: 'Outfit' }}>{game.title}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{game.players}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-primary)' }}>{game.cost === 0 ? 'FREE' : `₹${game.cost}`}</div>
                  <div style={{ fontSize: '11px', color: '#B45309', fontWeight: 700, marginTop: 2 }}>⭐ {game.rating}</div>
                </div>
              </motion.div>
            ))}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }} className="section-header-flex">
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

        {/* ────────────────── 8. REWARD CATEGORIES ────────────────── */}
        <section style={{ 
          background: 'radial-gradient(circle at 50% 50%, #FAF6F0 0%, #FAF8F5 100%)', 
          borderTop: '1px solid var(--color-border)', 
          borderBottom: '1px solid var(--color-border)', 
          padding: '80px 40px' 
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Partner Brand Rewards</span>
                <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '26px', color: 'var(--color-text)', margin: '2px 0 0', letterSpacing: '-0.5px' }}>Coupons Unlocked via Playing</h2>
              </div>
              <button onClick={() => navigate('/main?tab=coupons')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, fontSize: '13.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                Explore Coupon Store <ChevronRight size={16} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              {REWARD_CATEGORIES.map((reward, i) => (
                <div 
                  key={i}
                  style={{
                    background: '#fff',
                    borderRadius: '20px',
                    border: '1px solid var(--color-border)',
                    padding: '24px',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16
                  }}
                >
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: 'var(--color-bg-warm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px'
                  }}>
                    {reward.logo}
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#B45309', textTransform: 'uppercase' }}>{reward.category}</span>
                    <h4 style={{ margin: '2px 0 0', fontSize: '15px', fontWeight: 800, color: 'var(--color-text)', fontFamily: 'Outfit' }}>{reward.brand}</h4>
                    <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>{reward.value}</span>
                  </div>
                </div>
              ))}
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

      <Footer />

      {/* Responsive adjustments */}
      <style>{`
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
        }
      `}</style>
    </div>
  )
}
