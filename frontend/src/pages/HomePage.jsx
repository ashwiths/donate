import { motion } from 'framer-motion'
import { ArrowRight, Users, Leaf, Shield, Calendar, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HeroSection from '../components/HeroSection'
import ChildCard from '../components/ChildCard'
import DonationProgress from '../components/DonationProgress'
import PaymentBreakdown from '../components/PaymentBreakdown'
import { staggerContainer, fadeUp, cardVariant } from '../animations/variants'

const CHILD = {
  id: '1',
  name: 'Baby Aarav',
  age: '8 months',
  condition: 'Liver Disease (Biliary Atresia)',
  image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=80',
  requiredAmount: 7000000,
  raisedAmount: 214385,
  story: 'Aarav is 8 months old and needs a liver transplant to survive. Your support can save his life.',
}

const STATS = [
  { icon: Users, value: '12,842+', label: "Lives You've Touched" },
  { icon: Leaf, value: '₹3,28,45,120+', label: 'Total Donated' },
  { icon: Shield, value: '100%', label: 'Transparent' },
  { icon: Calendar, value: '500+', label: 'Children Helped' },
]

const HOW_IT_WORKS = [
  { emoji: '❤️', title: 'Choose a Child', desc: 'See their story and needs' },
  { emoji: '💳', title: 'Make a Small Contribution', desc: 'Pay a small amount to help' },
  { emoji: '🎮', title: 'Play Games / Win Rewards', desc: 'Unlock games, coupons & more' },
  { emoji: '🌱', title: 'Save Lives', desc: 'Your contribution helps them heal' },
]

const UPDATES = [
  { img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=80&q=80', text: "Aarav's new test reports have come in. Doctors are monitoring his condition.", time: '2 days ago' },
  { img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=80&q=80', text: 'Aarav had a stable night. Family sends gratitude to all donors.', time: '5 days ago' },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        {/* Hero */}
        <HeroSection />

        {/* Current Child in Need */}
        <section style={{ padding: '0 24px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 className="section-title">Current Child in Need 🤍</h2>
            <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', cursor: 'pointer' }}>
              View All Children <ChevronRight size={16} />
            </button>
          </div>

          <ChildCard child={CHILD} />

          {/* Verified badges */}
          <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)' }}>Verified & Trusted</span>
            {['Hospital Documents Verified', 'Doctor Verified Case', 'Parent Consent Verified', 'Regular Updates Provided'].map((t) => (
              <span key={t} style={{ fontSize: 12, color: 'var(--color-text-muted)', background: 'var(--color-bg-warm)', padding: '4px 12px', borderRadius: 99, border: '1px solid var(--color-border)' }}>
                ✅ {t}
              </span>
            ))}
            <button style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', background: 'none', border: '1px solid var(--color-primary)', borderRadius: 99, padding: '4px 14px', cursor: 'pointer' }}>
              View All Proofs →
            </button>
          </div>
        </section>

        {/* Payment Breakdown + Recent Updates */}
        <section style={{ padding: '0 24px 48px', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }} className="two-col">
          <PaymentBreakdown amount={10} />

          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--color-border)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--color-text)' }}>Recent Updates</h3>
              <button style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600 }}>View All</button>
            </div>
            {UPDATES.map((u, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <img src={u.img} alt="update" style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: 13, color: 'var(--color-text)', lineHeight: 1.5 }}>{u.text}</p>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{u.time}</span>
                </div>
              </div>
            ))}
          </div>

          <style>{`@media(max-width:768px){.two-col{grid-template-columns:1fr!important}}`}</style>
        </section>

        {/* Stats */}
        <section style={{ padding: '0 24px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}
          >
            {STATS.map(({ icon: Icon, value, label }) => (
              <motion.div
                key={label}
                variants={cardVariant}
                style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid var(--color-border)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}
              >
                <Icon size={28} color="var(--color-primary)" style={{ marginBottom: 8 }} />
                <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 22, color: 'var(--color-text)', marginBottom: 4 }}>{value}</div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* How it works */}
        <section style={{ padding: '0 24px 64px', maxWidth: 1200, margin: '0 auto' }}>
          <h2 className="section-title" style={{ marginBottom: 28 }}>How It Works 🤍</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, alignItems: 'center' }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} style={{ display: 'contents' }}>
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid var(--color-border)', textAlign: 'center' }}
                >
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{step.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: 'var(--color-text)' }}>{step.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{step.desc}</div>
                </motion.div>
                {i < HOW_IT_WORKS.length - 1 && (
                  <ArrowRight size={20} color="var(--color-text-light)" style={{ justifySelf: 'center' }} />
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
