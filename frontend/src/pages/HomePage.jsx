import { motion } from 'framer-motion'
import { ArrowRight, Users, Shield, CheckCircle2, ChevronRight, Play, Heart, Star, Award, Sparkles, Gift } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DonationProgress from '../components/DonationProgress'
import { staggerContainer, fadeUp, cardVariant } from '../animations/variants'

const CHILD = {
  id: '1',
  name: 'Baby Aarav',
  age: '8 months old',
  condition: 'Liver Disease (Biliary Atresia)',
  image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1000&q=90',
  requiredAmount: 7000000,
  raisedAmount: 214385,
  story: 'Aarav is just 8 months old. He was diagnosed with Biliary Atresia—a rare, life-threatening liver condition. He requires an urgent liver transplant within the next 3 weeks to survive. His father, a local delivery driver, is the donor, but the transplant surgery costs an overwhelming ₹70 Lakhs, which is far beyond the family\'s lifetime savings. Every single ₹10 game ticket you purchase goes directly to funding his hospital bills.',
}

// Sample waiting children data
const WAITING_CHILDREN = [
  {
    id: '2',
    name: 'Baby Diya',
    age: '18 months old',
    condition: 'Congenital Heart Defect (VSD)',
    image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=500&q=80',
    requiredAmount: 1500000,
    raisedAmount: 480000,
    percentage: 0.32,
    tag: 'Urgent Case'
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
    tag: 'Recently Added'
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
    tag: 'Urgent Case'
  },
  {
    id: '5',
    name: 'Baby Meera',
    age: '6 months old',
    condition: 'Severe SCID (Bone Marrow Needed)',
    image: 'https://images.unsplash.com/photo-1484863137850-59afcfe05386?w=500&q=80',
    requiredAmount: 2500000,
    raisedAmount: 310000,
    percentage: 0.12,
    tag: 'Urgent Case'
  }
]

const TRUST_ITEMS = [
  { icon: Shield, title: 'Direct Hospital Payouts', desc: 'Every rupee collected goes directly to Nanavati Max Hospital bill settlement.' },
  { icon: CheckCircle2, title: 'Verified Medical Auditing', desc: 'All medical records, doctor prescriptions, and hospital sheets are third-party verified.' },
  { icon: Users, title: 'Full Parent Consent', desc: 'All campaigns are launched with written consent and verified government identity proofs.' }
]

const STEPS = [
  { emoji: '🎮', title: '1. Select a Mini-Game', desc: 'Choose a fast, engaging micro-game like Spin the Wheel or Scratch Card.' },
  { emoji: '💳', title: '2. Donate ₹10 to Unlock', desc: 'Pay a microscopic amount of just ₹10. 100% transparent audit split.' },
  { emoji: '🎁', title: '3. Claim Free Rewards', desc: 'Unlock exciting retail shopping gift coupons and keep helping children.' }
]

const REWARD_PREVIEWS = [
  { type: 'Game', title: 'Spin & Win', price: 10, icon: '🎯' },
  { type: 'Coupon', title: 'Flipkart Voucher', price: 10, icon: '🏷️' },
  { type: 'Reward', title: 'Daily Mystery Box', price: 0, icon: '🎁' }
]

const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=80'
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'radial-gradient(circle at 10% 20%, #FEF8F2 0%, #FAF8F5 100%)' }}>
      <Navbar />

      <main style={{ flex: 1 }}>

        {/* ────────────────── 1. CINEMATIC HERO SECTION ────────────────── */}
        <section style={{ 
          padding: '64px 40px 80px', 
          maxWidth: 1600, 
          margin: '0 auto', 
          display: 'grid', 
          gridTemplateColumns: '60fr 40fr', 
          gap: 64,
          alignItems: 'center',
          boxSizing: 'border-box',
          width: '100%'
        }} className="hero-split-grid">
          
          {/* Hero Left Content Column (60%) */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={fadeUp}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#FFF7ED',
                border: '1px solid #FFE4E6',
                borderRadius: '99px',
                padding: '6px 16px',
                marginBottom: '24px'
              }}
            >
              <Sparkles size={14} color="#8C4F1A" />
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#8C4F1A', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Join the Micro-Philanthropy Revolution
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              style={{
                fontFamily: 'Outfit',
                fontSize: 'clamp(44px, 5.5vw, 68px)',
                fontWeight: 900,
                lineHeight: 1.05,
                color: 'var(--color-text)',
                margin: '0 0 24px',
                letterSpacing: '-1.5px'
              }}
            >
              Play Small Games.<br />
              <span style={{ 
                background: 'linear-gradient(90deg, #8C4F1A, #C8773A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Save Lives.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              style={{
                fontSize: '18px',
                color: 'var(--color-text-muted)',
                lineHeight: 1.65,
                maxWidth: '560px',
                marginBottom: '32px'
              }}
            >
              Unlock fun, interactive mini-games and premium brand coupons for just ₹10. 100% of your ticket purchases directly fund life-critical medical transplants for children in need.
            </motion.p>

            {/* CTAs Row */}
            <motion.div
              variants={fadeUp}
              style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 40 }}
            >
              <button 
                onClick={() => navigate('/main')}
                className="btn-primary" 
                style={{ 
                  padding: '14px 28px', 
                  fontSize: '15px', 
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(123, 63, 0, 0.22)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <Play size={16} fill="#fff" /> Choose Game & Help
              </button>
              <a 
                href="#how-it-works"
                className="btn-outline" 
                style={{ 
                  padding: '13px 28px', 
                  fontSize: '15px', 
                  borderRadius: '12px',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)'
                }}
              >
                See How It Works
              </a>
            </motion.div>

            {/* Interactive Overlapping Helper Avatars + Trusted Stats */}
            <motion.div
              variants={fadeUp}
              style={{ display: 'flex', alignItems: 'center', gap: 16 }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {AVATARS.map((avatar, i) => (
                  <img 
                    key={i} 
                    src={avatar} 
                    alt="Helper Avatar" 
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      border: '3px solid #FAF8F5',
                      marginLeft: i === 0 ? 0 : -12,
                      objectFit: 'cover',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  />
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={16} color="#16a34a" fill="#dcfce7" />
                  <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text)' }}>Trusted by 25,800+ Helpers</span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>₹3.28 Crore raised directly for hospital disbursements.</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Right Card Column: Featured Child (40%) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <div style={{
              background: '#fff',
              borderRadius: '24px',
              border: '1px solid var(--color-border)',
              padding: '24px',
              width: '100%',
              maxWidth: '420px',
              boxShadow: '0 30px 60px rgba(123, 63, 0, 0.12)',
              boxSizing: 'border-box',
              position: 'relative'
            }}>
              
              {/* Premium image container */}
              <div style={{ 
                width: '100%', 
                height: '240px', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                position: 'relative',
                marginBottom: 20
              }}>
                <img 
                  src={CHILD.image} 
                  alt={CHILD.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                <div style={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#B45309',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <Award size={13} />
                  CRITICAL CASE
                </div>

                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                  padding: '20px 16px 16px',
                  color: '#fff'
                }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, fontFamily: 'Outfit' }}>{CHILD.name}</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', opacity: 0.85 }}>{CHILD.age} • Biliary Atresia (Liver)</p>
                </div>
              </div>

              {/* Progress metrics */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: 8 }}>
                  <span>Raised: <strong>₹2.14L</strong></span>
                  <span>Goal: <strong>₹70L</strong></span>
                </div>
                
                <DonationProgress raised={CHILD.raisedAmount} required={CHILD.requiredAmount} percentage={0.03} compact />
              </div>

              {/* Bottom transparency callout */}
              <div style={{ 
                background: 'var(--color-bg-warm)', 
                borderRadius: '12px', 
                padding: '12px 14px', 
                border: '1px solid #E8D9C8',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '11.5px',
                color: 'var(--color-text-muted)',
                lineHeight: 1.4
              }}>
                <Shield size={16} color="var(--color-primary)" />
                100% payouts mapped directly to Nanavati Max Hospital biller.
              </div>

              {/* Direct Play & Donate Button */}
              <button 
                onClick={() => navigate('/main')}
                className="btn-primary" 
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  borderRadius: '12px', 
                  fontSize: '14.5px',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
                  boxShadow: '0 4px 15px rgba(123, 63, 0, 0.16)'
                }}
              >
                Donate ₹10 & Play to Help Aarav
              </button>
            </div>
          </motion.div>
        </section>

        {/* ────────────────── 2. DETAILED FEATURED CHILD STORY SECTION ────────────────── */}
        <section style={{ 
          background: '#fff', 
          borderTop: '1px solid var(--color-border)', 
          borderBottom: '1px solid var(--color-border)', 
          padding: '80px 40px' 
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>CASE DIRECTIVE REPORT</span>
              <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '36px', color: 'var(--color-text)', margin: '4px 0 12px', letterSpacing: '-0.5px' }}>Meet Aarav: The Story Behind the Fight</h2>
              <p style={{ margin: 0, fontSize: '15px', color: 'var(--color-text-muted)' }}>Verified report from clinical coordinator and pediatric supervisor.</p>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1.2fr 0.8fr', 
              gap: 48,
              alignItems: 'start'
            }} className="story-split-grid">
              
              {/* Detailed story block */}
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text)', marginBottom: 14 }}>The Medical Challenge</h4>
                <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: 20 }}>
                  {CHILD.story}
                </p>
                <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: 28 }}>
                  Baby Aarav\'s abdomen is heavily distended, and jaundice has colored his skin. Without surgery, his liver failure is progressive and fatal. The family has exhausted every resource to pay for initial diagnosis and medication, leaving them with absolutely nothing.
                </p>

                {/* hospital verification checks */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
                  {['Hospital Documents Verified', 'Doctor Prescription verified', 'Parent Identity Audited'].map((badge) => (
                    <div 
                      key={badge}
                      style={{ 
                        background: 'var(--color-bg-warm)', 
                        border: '1px solid #E8D9C8', 
                        padding: '8px 16px', 
                        borderRadius: '99px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <CheckCircle2 size={14} color="var(--color-primary)" />
                      {badge}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 14 }}>
                  <button style={{ background: '#FAF8F5', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '12px 20px', fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text)', cursor: 'pointer' }}>
                    View Hospital Prescriptions & Proofs
                  </button>
                  <button style={{ background: '#FAF8F5', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '12px 20px', fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text)', cursor: 'pointer' }}>
                    Pediatric Ward Updates (2)
                  </button>
                </div>
              </div>

              {/* Interactive Donation transparency details right block */}
              <div style={{
                background: 'var(--color-bg-warm)',
                borderRadius: '20px',
                border: '1px solid #E8D9C8',
                padding: '28px',
                boxSizing: 'border-box'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary)', margin: '0 0 8px', letterSpacing: '0.01em', textTransform: 'uppercase' }}>100% Honest Transparency</h4>
                <p style={{ margin: '0 0 20px', fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.55 }}>
                  We charge zero platform fee. Here is the mathematically audited breakdown of how your ticket money helps Aarav:
                </p>

                {/* Audit rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E8D9C8', paddingBottom: 10 }}>
                    <span style={{ fontSize: '13.5px', color: 'var(--color-text)', fontWeight: 600 }}>Medicine & Ward Cost</span>
                    <span style={{ fontSize: '13.5px', color: 'var(--color-primary)', fontWeight: 800 }}>₹9.00 (90%)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E8D9C8', paddingBottom: 10 }}>
                    <span style={{ fontSize: '13.5px', color: 'var(--color-text)', fontWeight: 600 }}>Payment Processing Fee</span>
                    <span style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', fontWeight: 700 }}>₹1.00 (10%)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6 }}>
                    <span style={{ fontSize: '13.5px', color: 'var(--color-text)', fontWeight: 800 }}>Platform commission</span>
                    <span style={{ fontSize: '13.5px', color: '#16a34a', fontWeight: 800 }}>₹0.00 (0%)</span>
                  </div>
                </div>

                <div style={{ height: '6px', background: '#fff', borderRadius: '99px', margin: '20px 0 10px', overflow: 'hidden' }}>
                  <div style={{ width: '90%', height: '100%', background: '#8C4F1A' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  <span>₹9.00 Direct Medicine Split</span>
                  <span>₹1.00 Gateway</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ────────────────── 3. MORE CHILDREN WAITING FOR HELP ❤️ (NEW SECTION) ────────────────── */}
        <section style={{ 
          padding: '80px 40px', 
          maxWidth: 1600, 
          margin: '0 auto',
          boxSizing: 'border-box',
          width: '100%'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }} className="section-header-flex">
            <div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Urgent Cases</span>
              <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '32px', color: 'var(--color-text)', margin: '4px 0 0', letterSpacing: '-0.75px' }}>More Children Waiting For Help ❤️</h2>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontSize: '12px', background: '#FEF3C7', color: '#D97706', padding: '6px 12px', borderRadius: '99px', fontWeight: 700 }}>4 Critical Cases Remaining</span>
            </div>
          </div>

          {/* Premium horizontal cards layout */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: 28 
          }} className="waiting-children-grid">
            {WAITING_CHILDREN.map((child) => (
              <motion.div
                key={child.id}
                variants={cardVariant}
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(123, 63, 0, 0.12)' }}
                style={{
                  background: '#fff',
                  borderRadius: '20px',
                  border: '1px solid var(--color-border)',
                  padding: '16px',
                  boxSizing: 'border-box',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '420px',
                  cursor: 'pointer'
                }}
                onClick={() => navigate('/main')}
              >
                {/* Child Image & Badge */}
                <div>
                  <div style={{ position: 'relative', width: '100%', height: '170px', borderRadius: '14px', overflow: 'hidden', marginBottom: 16 }}>
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
                      fontSize: '11px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.02em'
                    }}>
                      {child.tag}
                    </div>
                  </div>

                  {/* Child Info */}
                  <h3 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 800, color: 'var(--color-text)', fontFamily: 'Outfit' }}>{child.name}</h3>
                  <p style={{ margin: '0 0 12px', fontSize: '12px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {child.age} old • {child.condition}
                  </p>
                </div>

                {/* Progress bar and play CTA */}
                <div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--color-text-muted)', marginBottom: 6 }}>
                      <span>Raised: <strong>₹{(child.raisedAmount/100000).toFixed(2)}L</strong></span>
                      <span>Goal: <strong>₹{(child.requiredAmount/100000).toFixed(2)}L</strong></span>
                    </div>
                    <DonationProgress raised={child.raisedAmount} required={child.requiredAmount} percentage={child.percentage} compact />
                  </div>

                  <button 
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
                      gap: 6
                    }}
                  >
                    Donate & Play <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ────────────────── 4. HOW IT WORKS SECTION (3-STEP GRID) ────────────────── */}
        <section id="how-it-works" style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Simple Micro-philanthropy</span>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '36px', color: 'var(--color-text)', margin: '4px 0 12px', letterSpacing: '-0.5px' }}>Help Children in 3 Simple Steps</h2>
            <p style={{ margin: 0, fontSize: '15px', color: 'var(--color-text-muted)' }}>No huge payments required. Even ₹10 contributes directly.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {STEPS.map((step, i) => (
              <div 
                key={i} 
                style={{ 
                  background: '#fff', 
                  borderRadius: '18px', 
                  border: '1px solid var(--color-border)', 
                  padding: '32px 28px',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s'
                }}
                className="step-card-hover"
              >
                <div style={{ fontSize: '40px', marginBottom: 16 }}>{step.emoji}</div>
                <h4 style={{ margin: '0 0 8px', fontWeight: 800, fontSize: '16px', color: 'var(--color-text)', fontFamily: 'Outfit' }}>{step.title}</h4>
                <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ────────────────── 5. GAMES & REWARDS PREVIEW SECTION ────────────────── */}
        <section style={{ 
          background: 'radial-gradient(circle at 50% 50%, #FAF6F0 0%, #FAF8F5 100%)', 
          borderTop: '1px solid var(--color-border)', 
          borderBottom: '1px solid var(--color-border)', 
          padding: '80px 40px' 
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>PREVIEW OPTIONS</span>
                <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '32px', color: 'var(--color-text)', margin: '4px 0 0', letterSpacing: '-0.5px' }}>Play & Earn Preview</h2>
              </div>
              <button 
                onClick={() => navigate('/main')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 4, 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '14px', 
                  fontWeight: 700, 
                  color: 'var(--color-primary)', 
                  cursor: 'pointer' 
                }}
              >
                Go to Main Dashboard <ChevronRight size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              {REWARD_PREVIEWS.map((preview, i) => (
                <div 
                  key={i}
                  style={{
                    background: '#fff',
                    borderRadius: '18px',
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
                    {preview.icon}
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{preview.type}</span>
                    <h4 style={{ margin: '2px 0 0', fontSize: '15px', fontWeight: 800, color: 'var(--color-text)' }}>{preview.title}</h4>
                    <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>Ticket cost: ₹{preview.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ────────────────── 6. BRAND TRUST & AUDITING BADGES ────────────────── */}
        <section style={{ padding: '80px 40px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: 32 
          }}>
            {TRUST_ITEMS.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} style={{ display: 'flex', gap: 16 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '14px',
                    background: '#FFF7ED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={22} color="var(--color-primary)" />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 800, color: 'var(--color-text)' }}>{item.title}</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

      </main>

      <Footer />

      {/* Embedded CSS for responsive scaling overrides */}
      <style>{`
        @media (max-width: 960px) {
          .hero-split-grid {
            grid-template-columns: 1fr !important;
            padding: 48px 16px 64px !important;
            gap: 40px !important;
          }
          .story-split-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .step-card-hover:hover, .step-card-hover:focus {
            transform: none !important;
          }
          .section-header-flex {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </div>
  )
}
