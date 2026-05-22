import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Gamepad2, Tag, Quote as QuoteIcon, Gift, LayoutGrid, SlidersHorizontal, ChevronDown, Shield } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import GameCard from '../components/GameCard'
import CouponCard from '../components/CouponCard'
import DonationProgress from '../components/DonationProgress'
import { staggerContainer, cardVariant, fadeUp } from '../animations/variants'

// ── Static dummy data ─────────────────────────────────────────────────
const GAMES = [
  { id: 1, title: 'Spin & Win', description: 'Spin the wheel and win exciting rewards', price: 10, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&q=80', tag: 'Popular' },
  { id: 2, title: 'Scratch Card', description: 'Scratch and reveal your surprise', price: 10, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&q=80' },
  { id: 3, title: 'Memory Match', description: 'Match the cards and win rewards', price: 20, image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&q=80', tag: 'New' },
  { id: 4, title: 'Treasure Hunt', description: 'Find the treasure and win big', price: 20, image: 'https://images.unsplash.com/photo-1569701813229-33284b643e3c?w=300&q=80' },
]

const COUPONS = [
  { id: 1, brand: 'Flipkart', worth: 100, price: 10, color: '#1E3A5F' },
  { id: 2, brand: 'Amazon', worth: 75, price: 10, color: '#FF9900' },
  { id: 3, brand: 'Google Play', worth: 50, price: 10, color: '#01875F' },
  { id: 4, brand: 'Paytm', worth: 100, price: 10, color: '#002970' },
]

const QUOTES = [
  { text: 'The purpose of our lives is to be happy.', author: '— Dalai Lama' },
  { text: 'Be the reason someone believes in good people.', author: '— Unknown' },
  { text: 'Every small step counts. Keep moving forward.', author: '— Unknown' },
  { text: 'Together, we can make a big difference.', author: '— Unknown' },
]

const FREE_ITEMS = [
  { emoji: '🎁', title: 'Daily Free Box', desc: 'Open your daily free mystery box', cta: 'Open Now' },
  { emoji: '🧠', title: 'Free Quiz', desc: 'Answer & win reward points', cta: 'Play Now' },
  { emoji: '▶️', title: 'Watch & Earn', desc: 'Watch short videos and earn points', cta: 'Earn Now' },
  { emoji: '🎯', title: 'Lucky Draw', desc: 'Join daily lucky draw & win', cta: 'Join Now' },
]

const TABS = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'games', label: 'Games', icon: Gamepad2 },
  { id: 'coupons', label: 'Coupons', icon: Tag },
  { id: 'quotes', label: 'Quotes', icon: QuoteIcon },
  { id: 'free', label: 'Free', icon: Gift },
]

const SIDEBAR_ITEMS = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'games', label: 'Games', icon: Gamepad2 },
  { id: 'coupons', label: 'Coupons', icon: Tag },
  { id: 'quotes', label: 'Quotes', icon: QuoteIcon },
  { id: 'free', label: 'Free', icon: Gift },
]

// ─────────────────────────────────────────────────────────────────────
export default function MainPage() {
  const [activeTab, setActiveTab] = useState('all')

  const show = (key) => activeTab === 'all' || activeTab === key

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        {/* Supporting Child Banner */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--color-border)', padding: '14px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <img src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=60&q=80" alt="child" style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover' }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-muted)' }}>You are supporting</p>
              <p style={{ margin: '2px 0', fontWeight: 700, fontSize: 16, color: 'var(--color-text)', fontFamily: 'Outfit' }}>Baby Aarav 🤍</p>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>Liver Disease (Biliary Atresia)</p>
            </div>
            <div style={{ minWidth: 220 }}>
              <DonationProgress raised={214385} required={7000000} percentage={0.31} compact />
            </div>
            <button className="btn-primary" style={{ padding: '9px 18px', fontSize: 13, flexShrink: 0 }}>
              View Full Story →
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 28 }} className="main-grid">
          {/* Sidebar */}
          <aside>
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--color-border)', overflow: 'hidden', position: 'sticky', top: 80 }}>
              {SIDEBAR_ITEMS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 18px', background: activeTab === id ? 'var(--color-bg-warm)' : 'none',
                    border: 'none', borderLeft: activeTab === id ? '3px solid var(--color-primary)' : '3px solid transparent',
                    cursor: 'pointer', fontSize: 14, fontWeight: activeTab === id ? 700 : 500,
                    color: activeTab === id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    textAlign: 'left', transition: 'all 0.2s',
                  }}
                >
                  <Icon size={17} /> {label}
                </button>
              ))}
              {/* Transparency note */}
              <div style={{ margin: 12, background: 'var(--color-bg-warm)', borderRadius: 12, padding: '12px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Shield size={14} color="var(--color-primary)" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)' }}>100% Transparent</span>
                </div>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>Every penny goes directly to treatment funds.</p>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 22, margin: '0 0 4px', color: 'var(--color-text)' }}>
                Choose What You Want to Unlock 🤍
              </h2>
              <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--color-text-muted)' }}>Pay a small amount, play games, win rewards and help save a life.</p>

              {/* Tab filters */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                {TABS.map(({ id, label, icon: Icon }) => (
                  <motion.button
                    key={id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTab(id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                      borderRadius: 99, border: '1px solid',
                      borderColor: activeTab === id ? 'var(--color-primary)' : 'var(--color-border)',
                      background: activeTab === id ? 'var(--color-primary)' : '#fff',
                      color: activeTab === id ? '#fff' : 'var(--color-text-muted)',
                      fontWeight: activeTab === id ? 700 : 400, fontSize: 13,
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    <Icon size={14} /> {label}
                  </motion.button>
                ))}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fff', border: '1px solid var(--color-border)', borderRadius: 99, padding: '7px 14px', fontSize: 13, cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                    Popular <ChevronDown size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* Games */}
            {show('games') && (
              <section style={{ marginBottom: 36 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h3 className="section-title">🎮 Games – Play & Win</h3>
                  <button style={{ fontSize: 13, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                    View All <ChevronRight size={14} />
                  </button>
                </div>
                <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                  {GAMES.map((g) => <GameCard key={g.id} game={g} />)}
                </motion.div>
              </section>
            )}

            {/* Coupons */}
            {show('coupons') && (
              <section style={{ marginBottom: 36 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h3 className="section-title">🏷️ Coupons – Shop & Save</h3>
                  <button style={{ fontSize: 13, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                    View All <ChevronRight size={14} />
                  </button>
                </div>
                <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
                  {COUPONS.map((c) => <CouponCard key={c.id} coupon={c} />)}
                </motion.div>
              </section>
            )}

            {/* Quotes */}
            {show('quotes') && (
              <section style={{ marginBottom: 36 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h3 className="section-title">💬 Quotes – Inspire Yourself</h3>
                  <button style={{ fontSize: 13, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View All</button>
                </div>
                <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                  {QUOTES.map((q, i) => (
                    <motion.div key={i} variants={cardVariant} style={{ background: '#fff', borderRadius: 14, padding: '18px', border: '1px solid var(--color-border)', position: 'relative' }}>
                      <button style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>🤍</button>
                      <p style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--color-text)', lineHeight: 1.6, fontStyle: 'italic' }}>&ldquo;{q.text}&rdquo;</p>
                      <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600 }}>{q.author}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            )}

            {/* Free */}
            {show('free') && (
              <section style={{ marginBottom: 36 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h3 className="section-title">🎁 Free – No Payment Needed</h3>
                  <button style={{ fontSize: 13, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View All</button>
                </div>
                <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                  {FREE_ITEMS.map((item) => (
                    <motion.div key={item.title} variants={cardVariant}
                      whileHover={{ y: -4, boxShadow: 'var(--shadow-md)' }}
                      style={{ background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}>
                      <div style={{ fontSize: 32, marginBottom: 10 }}>{item.emoji}</div>
                      <h4 style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 14, color: 'var(--color-text)' }}>{item.title}</h4>
                      <p style={{ margin: '0 0 14px', fontSize: 12, color: 'var(--color-text-muted)' }}>{item.desc}</p>
                      <button className="btn-outline" style={{ width: '100%', padding: '8px', fontSize: 13 }}>{item.cta}</button>
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            )}

            {/* Bottom transparency note */}
            <div style={{ background: 'var(--color-bg-warm)', borderRadius: 14, padding: '14px 18px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-muted)' }}>
                <Shield size={16} color="var(--color-primary)" />
                100% of your contribution goes directly to the child's treatment. We only charge a small payment gateway fee.
              </div>
              <button style={{ background: 'none', border: 'none', fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', cursor: 'pointer' }}>Learn More →</button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`@media(max-width:768px){.main-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}
