import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Gamepad2, Tag, Quote as QuoteIcon, Gift, LayoutGrid, ChevronDown, Shield } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import GameCard from '../components/GameCard'
import CouponCard from '../components/CouponCard'
import DonationProgress from '../components/DonationProgress'
import { staggerContainer, cardVariant } from '../animations/variants'

// ── Static dummy data ─────────────────────────────────────────────────
const GAMES = [
  { id: 1, title: 'Spin & Win', description: 'Spin the wheel and win exciting rewards', price: 10, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80', tag: 'Popular' },
  { id: 2, title: 'Scratch Card', description: 'Scratch and reveal your surprise', price: 10, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80' },
  { id: 3, title: 'Memory Match', description: 'Match the cards and win rewards', price: 20, image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&q=80', tag: 'New' },
  { id: 4, title: 'Treasure Hunt', description: 'Find the treasure and win big', price: 20, image: 'https://images.unsplash.com/photo-1569701813229-33284b643e3c?w=400&q=80' },
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
  { id: 'all', label: 'All Categories', icon: LayoutGrid },
  { id: 'games', label: 'Playable Games', icon: Gamepad2 },
  { id: 'coupons', label: 'Store Coupons', icon: Tag },
  { id: 'quotes', label: 'Daily Quotes', icon: QuoteIcon },
  { id: 'free', label: 'Free Rewards', icon: Gift },
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

      <main style={{ flex: 1, width: '100%' }}>
        
        {/* Full-width child support banner with responsive limits */}
        <div style={{ 
          background: '#fff', 
          borderBottom: '1px solid var(--color-border)', 
          padding: '16px 40px',
          width: '100%',
          boxSizing: 'border-box'
        }} className="banner-fluid-padding">
          <div style={{ 
            maxWidth: 1600, 
            margin: '0 auto', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: 24, 
            flexWrap: 'wrap' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <img 
                src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=100&q=80" 
                alt="child" 
                style={{ width: 64, height: 64, borderRadius: 14, objectFit: 'cover', border: '1px solid var(--color-border)' }} 
              />
              <div>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase' }}>Currently Supporting</p>
                <h3 style={{ margin: '2px 0', fontWeight: 800, fontSize: 18, color: 'var(--color-text)', fontFamily: 'Outfit' }}>Baby Aarav 🤍</h3>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>Liver Disease (Biliary Atresia)</p>
              </div>
            </div>
            
            <div style={{ flex: 1, maxWidth: 460, minWidth: 260 }}>
              <DonationProgress raised={214385} required={7000000} percentage={0.31} compact />
            </div>

            <button className="btn-primary" style={{ padding: '12px 24px', fontSize: 14, flexShrink: 0, borderRadius: '12px' }}>
              View Aarav's Full Story →
            </button>
          </div>
        </div>

        {/* Full Width Responsive Dashboard */}
        <div style={{ 
          maxWidth: 1600, 
          margin: '0 auto', 
          padding: '32px 40px', 
          display: 'grid', 
          gridTemplateColumns: '180px 1fr', 
          gap: 36,
          boxSizing: 'border-box',
          width: '100%'
        }} className="main-grid">
          
          {/* Small modern Sticky Sidebar */}
          <aside className="dashboard-sidebar">
            <div style={{ 
              background: '#fff', 
              borderRadius: 18, 
              border: '1px solid var(--color-border)', 
              overflow: 'hidden', 
              position: 'sticky', 
              top: 96,
              boxShadow: 'var(--shadow-sm)'
            }}>
              {SIDEBAR_ITEMS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  style={{
                    width: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 12,
                    padding: '14px 20px', 
                    background: activeTab === id ? 'var(--color-bg-warm)' : 'none',
                    border: 'none', 
                    borderLeft: activeTab === id ? '4px solid var(--color-primary)' : '4px solid transparent',
                    cursor: 'pointer', 
                    fontSize: 14, 
                    fontWeight: activeTab === id ? 700 : 500,
                    color: activeTab === id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    textAlign: 'left', 
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
              
              {/* Sidebar badge context */}
              <div style={{ 
                margin: 14, 
                background: 'var(--color-bg-warm)', 
                borderRadius: 14, 
                padding: '14px', 
                border: '1px solid #E8D9C8' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Shield size={14} color="var(--color-primary)" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.02em' }}>100% SECURE</span>
                </div>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.45 }}>All donation splits are directly verified on public audits.</p>
              </div>
            </div>
          </aside>

          {/* Large Expanded Content Area */}
          <div style={{ width: '100%' }} className="dashboard-content">
            
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ 
                fontFamily: 'Outfit', 
                fontWeight: 800, 
                fontSize: '28px', 
                margin: '0 0 6px', 
                color: 'var(--color-text)',
                letterSpacing: '-0.5px'
              }}>
                Choose What You Want to Unlock 🤍
              </h2>
              <p style={{ margin: '0 0 24px', fontSize: 15, color: 'var(--color-text-muted)' }}>
                Fund medical procedures, claim curated vouchers, play mini-games, and save a life today.
              </p>

              {/* Enhanced Full-Width Filter Tabs */}
              <div style={{ 
                display: 'flex', 
                gap: 10, 
                alignItems: 'center', 
                flexWrap: 'wrap',
                background: '#fff',
                padding: '8px 12px',
                borderRadius: '16px',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {TABS.map(({ id, label, icon: Icon }) => (
                  <motion.button
                    key={id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(id)}
                    style={{
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8, 
                      padding: '8px 16px',
                      borderRadius: 10, 
                      border: 'none',
                      background: activeTab === id ? 'var(--color-primary)' : 'transparent',
                      color: activeTab === id ? '#fff' : 'var(--color-text-muted)',
                      fontWeight: activeTab === id ? 700 : 500, 
                      fontSize: 13,
                      cursor: 'pointer', 
                      transition: 'all 0.2s',
                    }}
                  >
                    <Icon size={14} /> {label}
                  </motion.button>
                ))}
                
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 6, 
                    background: 'var(--color-bg-warm)', 
                    border: '1px solid #E8D9C8', 
                    borderRadius: 10, 
                    padding: '8px 16px', 
                    fontSize: 13, 
                    cursor: 'pointer', 
                    color: 'var(--color-primary)',
                    fontWeight: 600
                  }}>
                    Sorted: Popular <ChevronDown size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Games Section */}
            {show('games') && (
              <section style={{ marginBottom: 48 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 className="section-title" style={{ fontSize: '20px', fontWeight: 800 }}>🎮 Playable Games – Win Rewards</h3>
                  <button style={{ fontSize: 13, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    View All Games <ChevronRight size={15} />
                  </button>
                </div>
                <motion.div 
                  variants={staggerContainer} 
                  initial="hidden" 
                  whileInView="visible" 
                  viewport={{ once: true }}
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
                    gap: 24 
                  }}
                >
                  {GAMES.map((g) => <GameCard key={g.id} game={g} />)}
                </motion.div>
              </section>
            )}

            {/* Coupons Section */}
            {show('coupons') && (
              <section style={{ marginBottom: 48 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 className="section-title" style={{ fontSize: '20px', fontWeight: 800 }}>🏷️ Premium Coupons – Shop & Save</h3>
                  <button style={{ fontSize: 13, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    View All Coupons <ChevronRight size={15} />
                  </button>
                </div>
                <motion.div 
                  variants={staggerContainer} 
                  initial="hidden" 
                  whileInView="visible" 
                  viewport={{ once: true }}
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                    gap: 24 
                  }}
                >
                  {COUPONS.map((c) => <CouponCard key={c.id} coupon={c} />)}
                </motion.div>
              </section>
            )}

            {/* Quotes Section */}
            {show('quotes') && (
              <section style={{ marginBottom: 48 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 className="section-title" style={{ fontSize: '20px', fontWeight: 800 }}>💬 Inspirational Quotes – Lift Spirits</h3>
                  <button style={{ fontSize: 13, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>View All</button>
                </div>
                <motion.div 
                  variants={staggerContainer} 
                  initial="hidden" 
                  whileInView="visible" 
                  viewport={{ once: true }}
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                    gap: 24 
                  }}
                >
                  {QUOTES.map((q, i) => (
                    <motion.div 
                      key={i} 
                      variants={cardVariant} 
                      style={{ 
                        background: '#fff', 
                        borderRadius: 18, 
                        padding: '24px', 
                        border: '1px solid var(--color-border)', 
                        position: 'relative',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <button style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>🤍</button>
                      <p style={{ margin: '0 0 16px', fontSize: 15, color: 'var(--color-text)', lineHeight: 1.6, fontStyle: 'italic', pr: '20px' }}>&ldquo;{q.text}&rdquo;</p>
                      <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{q.author}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            )}

            {/* Free Rewards Section */}
            {show('free') && (
              <section style={{ marginBottom: 48 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 className="section-title" style={{ fontSize: '20px', fontWeight: 800 }}>🎁 Free Quizzes & Daily Rewards</h3>
                  <button style={{ fontSize: 13, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>View All</button>
                </div>
                <motion.div 
                  variants={staggerContainer} 
                  initial="hidden" 
                  whileInView="visible" 
                  viewport={{ once: true }}
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
                    gap: 24 
                  }}
                >
                  {FREE_ITEMS.map((item) => (
                    <motion.div 
                      key={item.title} 
                      variants={cardVariant}
                      whileHover={{ y: -4, boxShadow: 'var(--shadow-md)' }}
                      style={{ 
                        background: '#fff', 
                        borderRadius: 18, 
                        padding: '24px', 
                        border: '1px solid var(--color-border)', 
                        boxShadow: 'var(--shadow-sm)', 
                        cursor: 'pointer' 
                      }}
                    >
                      <div style={{ fontSize: 36, marginBottom: 12 }}>{item.emoji}</div>
                      <h4 style={{ margin: '0 0 6px', fontWeight: 800, fontSize: 16, color: 'var(--color-text)', fontFamily: 'Outfit' }}>{item.title}</h4>
                      <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{item.desc}</p>
                      <button className="btn-outline" style={{ width: '100%', padding: '10px', fontSize: 13, borderRadius: '10px' }}>{item.cta}</button>
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            )}

            {/* Bottom transparency fluid panel */}
            <div style={{ 
              background: 'var(--color-bg-warm)', 
              borderRadius: 18, 
              padding: '20px 24px', 
              border: '1px solid #E8D9C8', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              flexWrap: 'wrap', 
              gap: 16,
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--color-text-muted)' }}>
                <Shield size={18} color="var(--color-primary)" />
                <span>100% of your micro-donation goes directly towards baby Aarav's treatment case. Zero hidden commissions.</span>
              </div>
              <button style={{ background: 'none', border: 'none', fontSize: 14, fontWeight: 700, color: 'var(--color-primary)', cursor: 'pointer' }}>Auditing Dashboard →</button>
            </div>

          </div>
        </div>
      </main>

      <Footer />

      {/* Modern Dashboard Media Queries for full screen responsiveness */}
      <style>{`
        @media (max-width: 960px) {
          .main-grid {
            grid-template-columns: 1fr !important;
            padding: 24px 16px !important;
            gap: 24px !important;
          }
          .dashboard-sidebar {
            display: none !important;
          }
          .banner-fluid-padding {
            padding: 16px !important;
          }
        }
      `}</style>
    </div>
  )
}
