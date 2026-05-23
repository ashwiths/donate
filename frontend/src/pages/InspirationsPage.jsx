import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Sun, Heart, Leaf, Zap, Target, Star,
  Wind, Flame, CheckCircle2, Circle, ArrowRight, Quote
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { QuotesBackground } from '../components/PremiumBackground'

import imgSuriya from '/portraits/portrait_suriya.png'
import imgKalam from '/portraits/portrait_kalam.png'
import imgElon from '/portraits/portrait_elon.png'
import imgJobs from '/portraits/portrait_jobs.png'
import imgMurthy from '/portraits/portrait_murthy.png'
import imgDhoni from '/portraits/portrait_dhoni.png'
import imgVirat from '/portraits/portrait_virat.png'
import imgSundar from '/portraits/portrait_sundar.png'

// ── Data ──────────────────────────────────────────────────────────────
const HERO_QUOTE = {
  text: "Every small act of kindness plants a seed that grows into something extraordinary.",
  author: "Heal & Play Philosophy"
}

const INSPIRATION_CARDS = [
  {
    icon: Sun,
    title: "Rise With Purpose",
    text: "Each morning is a new canvas. Paint it with intention, courage, and an open heart ready to give.",
    accent: "#8B6239"
  },
  {
    icon: Heart,
    title: "Lead With Compassion",
    text: "True strength is measured not by what you achieve alone, but by how many lives you uplift on your journey.",
    accent: "#A0522D"
  },
  {
    icon: Leaf,
    title: "Grow Through Stillness",
    text: "In quiet moments of reflection, the deepest roots of resilience and wisdom take hold.",
    accent: "#6F7B3A"
  },
  {
    icon: Zap,
    title: "Act, Don't Wait",
    text: "The perfect moment never arrives on its own. It's created by those bold enough to take the first step.",
    accent: "#7A4E2B"
  },
  {
    icon: Target,
    title: "Focus on the Journey",
    text: "Your destination matters, but the clarity you gain walking each mile is the true reward.",
    accent: "#5C6B8A"
  },
  {
    icon: Star,
    title: "You Are Enough",
    text: "Stop waiting for permission to shine. Your gifts, your story, your presence — they are needed exactly as they are.",
    accent: "#8B6239"
  }
]

const QUOTES = [
  { text: "The meaning of life is to find your gift. The purpose of life is to give it away.", author: "Pablo Picasso" },
  { text: "Do not wait; the time will never be 'just right.' Start where you stand.", author: "Napoleon Hill" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" }
]

const CHALLENGES = [
  { id: 1, text: "Drink 8 glasses of water today", icon: Wind },
  { id: 2, text: "Finish one pending task you've been avoiding", icon: Target },
  { id: 3, text: "Take a 10-minute mindful walk outdoors", icon: Leaf },
  { id: 4, text: "Write 3 things you're grateful for right now", icon: Heart },
  { id: 5, text: "Reach out to someone you haven't spoken to in a while", icon: Sun },
  { id: 6, text: "Spend 20 minutes reading something uplifting", icon: Star }
]

const REAL_LIFE_INSPIRATIONS = [
  {
    name: "Suriya",
    badge: "Agaram Foundation",
    role: "Founder of Agaram Foundation",
    description: "Pioneering transformative educational access for underprivileged children, building lives through empowerment and active social outreach.",
    quote: "Education is the single most powerful tool to uplift families and change society.",
    image: "/portraits/portrait_suriya.png",
    accent: "#8B6239"
  },
  {
    name: "Dr. A.P.J. Abdul Kalam",
    badge: "Missile Man of India",
    role: "People's President & Scientist",
    description: "Igniting million minds with values of pure discipline, persistent dreams, and child-centered learning paradigms.",
    quote: "Dreams are not what you see in your sleep, they are things that do not let you sleep.",
    image: "/portraits/portrait_kalam.png",
    accent: "#A0522D"
  },
  {
    name: "Elon Musk",
    badge: "SpaceX & Tesla",
    role: "Futurist & Explorer",
    description: "Redefining interplanetary travel, electric mobility, and neurotechnology with bold risk-taking and relentless execution.",
    quote: "When something is important enough, you do it even if the odds are not in your favor.",
    image: "/portraits/portrait_elon.png",
    accent: "#6F7B3A"
  },
  {
    name: "Steve Jobs",
    badge: "Apple Co-founder",
    role: "Design Pioneer",
    description: "Championing elegant simplicity, pure intuition, and state-of-the-art designs that revolutionized global human interface.",
    quote: "The only way to do great work is to love what you do.",
    image: "/portraits/portrait_jobs.png",
    accent: "#7A4E2B"
  },
  {
    name: "Narayana Murthy",
    badge: "Infosys Founder",
    role: "Father of Indian IT",
    description: "Pioneering the global software revolution while modeling absolute clean governance, modesty, and compassionate capitalism.",
    quote: "In God we trust, everyone else brings data to the table.",
    image: "/portraits/portrait_murthy.png",
    accent: "#5C6B8A"
  },
  {
    name: "MS Dhoni",
    badge: "Captain Cool",
    role: "Legendary Leader & Finisher",
    description: "Executing legendary high-pressure turnarounds with serene calmness, unparalleled strategic clarity, and sheer sportsmanship.",
    quote: "Process is always more important than the final result.",
    image: "/portraits/portrait_dhoni.png",
    accent: "#8B6239"
  },
  {
    name: "Virat Kohli",
    badge: "Modern Cricket Icon",
    role: "Peak Athleticism & Passion",
    description: "Redefining batting performance metrics through absolute fitness discipline, raw intensity, and consistent work ethic.",
    quote: "Self-belief and hard work will always earn you success.",
    image: "/portraits/portrait_virat.png",
    accent: "#A0522D"
  },
  {
    name: "Sundar Pichai",
    badge: "Google CEO",
    role: "Global Tech Leader",
    description: "Leading global internet scale from humble beginnings with clean collaborative leadership, curiosity, and high vision.",
    quote: "A person who is happy is because he chooses to find attitude right.",
    image: "/portraits/portrait_sundar.png",
    accent: "#6F7B3A"
  }
]

// ── Floating particle component ────────────────────────────────────────
function FloatingParticle({ style }) {
  return (
    <motion.div
      animate={{ y: [0, -18, 0], opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute',
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #C8A87C, #8B6239)',
        ...style
      }}
    />
  )
}

// ── Main Component ─────────────────────────────────────────────────────
export default function InspirationsPage() {
  const [quoteIdx, setQuoteIdx] = useState(0)
  const [checked, setChecked] = useState({})

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIdx(i => (i + 1) % QUOTES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const toggleCheck = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }))

  const particles = [
    { top: '8%', left: '6%' }, { top: '14%', left: '90%' },
    { top: '42%', left: '3%' }, { top: '55%', right: '5%' },
    { top: '72%', left: '88%' }, { top: '88%', left: '12%' }
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent', position: 'relative', overflowX: 'hidden' }}>
      {/* Premium ambient background system */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <QuotesBackground />
      </div>

      {/* Floating particles */}
      {particles.map((style, i) => <FloatingParticle key={i} style={style} />)}

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />

        {/* ── 1. HERO ── */}
        <section style={{ padding: '90px 24px 80px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(139,98,57,0.10)', border: '1px solid rgba(139,98,57,0.20)',
              borderRadius: 99, padding: '6px 18px', marginBottom: 24
            }}
          >
            <Sparkles size={13} color="#8B6239" />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#8B6239', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Daily Inspirations
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="premium-title-lg"
          >
            Fuel Your{' '}
            <span className="text-gradient-animate">
              Inner Fire
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            style={{ fontSize: 17, color: '#7A6A58', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 48px', fontWeight: 500 }}
          >
            Words that move you. Challenges that shape you. A space crafted to ignite the best version of yourself — every single day.
          </motion.p>

          {/* Hero Quote Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              background: 'rgba(255,255,255,0.70)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(234,223,207,0.70)',
              borderRadius: 32,
              padding: '48px 52px',
              boxShadow: '0 24px 64px rgba(111,77,46,0.10), inset 0 0 40px rgba(255,255,255,0.5)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* decorative corner glow */}
            <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, background: 'radial-gradient(circle, rgba(200,119,58,0.12), transparent 70%)', borderRadius: '50%' }} />
            <Quote size={40} color="rgba(139,98,57,0.18)" style={{ marginBottom: 16 }} />
            <p style={{ fontFamily: 'Outfit', fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, color: '#3D2B1A', lineHeight: 1.55, margin: '0 0 20px', fontStyle: 'italic' }}>
              "{HERO_QUOTE.text}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 2, background: 'linear-gradient(90deg, transparent, #C8773A)' }} />
              <span style={{ fontSize: 12, fontWeight: 800, color: '#8B6239', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{HERO_QUOTE.author}</span>
              <div style={{ width: 36, height: 2, background: 'linear-gradient(90deg, #C8773A, transparent)' }} />
            </div>
          </motion.div>
        </section>

        {/* ── 2. INSPIRATION GRID ── */}
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px 100px' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: 52 }}
          >
            <span style={{ fontSize: 11, fontWeight: 800, color: '#8B6239', textTransform: 'uppercase', letterSpacing: '0.12em' }}>✨ Mindset Collection</span>
            <h2 className="premium-title-md">
              Wisdom for Every Moment
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 28 }}>
            {INSPIRATION_CARDS.map((card, idx) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.07, duration: 0.5 }}
                  whileHover={{ y: -10, boxShadow: '0 24px 48px rgba(122, 78, 43, 0.12), 0 4px 12px rgba(0, 0, 0, 0.03)' }}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(220, 208, 195, 0.7)',
                    borderRadius: 28,
                    padding: '36px 32px',
                    cursor: 'default',
                    transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                    boxShadow: '0 12px 36px rgba(122, 78, 43, 0.06), 0 2px 8px rgba(0, 0, 0, 0.02)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: `radial-gradient(circle, ${card.accent}18, transparent 70%)`, borderRadius: '50%' }} />
                  <div style={{
                    width: 52, height: 52, borderRadius: 16,
                    background: `linear-gradient(135deg, ${card.accent}22, ${card.accent}10)`,
                    border: `1px solid ${card.accent}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 20
                  }}>
                    <Icon size={22} color={card.accent} />
                  </div>
                  <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 19, color: '#3D2B1A', margin: '0 0 10px', letterSpacing: '-0.3px' }}>{card.title}</h3>
                  <p style={{ fontSize: 14, color: '#7A6A58', lineHeight: 1.75, margin: 0, fontWeight: 500 }}>{card.text}</p>
                  <div style={{ width: 40, height: 3, borderRadius: 99, background: `linear-gradient(90deg, ${card.accent}, transparent)`, marginTop: 20 }} />
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* ── REAL LIFE INSPIRATIONS (Inspired Minds ✨) ── */}
        <section style={{ maxWidth: 1400, margin: '0 auto', padding: '0 32px 100px' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            <span style={{ fontSize: 11, fontWeight: 800, color: '#8B6239', textTransform: 'uppercase', letterSpacing: '0.12em' }}>🌟 Inspired Minds ✨</span>
            <h2 className="premium-title-md" style={{ margin: '8px 0 12px' }}>
              Real Life Inspirations
            </h2>
            <p style={{ fontSize: 15, color: '#7A6A58', margin: 0, lineHeight: 1.65, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
              Meet the visionary minds, resilient leaders, and passionate innovators who reshaped their fields with determination and purpose.
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: 32
          }}>
            {REAL_LIFE_INSPIRATIONS.map((person, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.6 }}
                whileHover={{ y: -12, boxShadow: '0 24px 48px rgba(122, 78, 43, 0.12), 0 4px 12px rgba(0, 0, 0, 0.03)' }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(220, 208, 195, 0.7)',
                  borderRadius: '32px',
                  padding: '40px 28px 36px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 16,
                  boxShadow: '0 12px 36px rgba(122, 78, 43, 0.06), 0 2px 8px rgba(0, 0, 0, 0.02)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className="inspiration-profile-card"
              >
                {/* Floating glow behind image */}
                <div style={{
                  position: 'absolute',
                  top: '10%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '160px',
                  height: '160px',
                  background: `radial-gradient(circle, ${person.accent}20 0%, transparent 70%)`,
                  borderRadius: '50%',
                  pointerEvents: 'none',
                  zIndex: 0
                }} />

                {/* Circular Profile Image Container */}
                <div style={{ position: 'relative', zIndex: 1, width: 120, height: 120 }}>
                  <img
                    src={person.image}
                    alt={person.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '4px solid #fff',
                      boxShadow: '0 12px 28px rgba(139, 98, 57, 0.15)'
                    }}
                  />
                  {/* Subtle decorative mini sparkle badge */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 4,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: person.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}>
                    <Sparkles size={11} color="#fff" />
                  </div>
                </div>

                {/* Info & Typography */}
                <div style={{ relative: 1, zIndex: 1, width: '100%' }}>
                  <h3 style={{
                    fontFamily: 'Outfit',
                    fontWeight: 850,
                    fontSize: 20,
                    color: '#3D2B1A',
                    margin: '0 0 4px',
                    letterSpacing: '-0.4px'
                  }}>
                    {person.name}
                  </h3>
                  
                  <span style={{
                    display: 'inline-block',
                    fontSize: 10,
                    fontWeight: 800,
                    color: person.accent,
                    background: `${person.accent}12`,
                    border: `1.5px solid ${person.accent}22`,
                    borderRadius: '99px',
                    padding: '4px 12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: 14
                  }}>
                    {person.badge}
                  </span>

                  <p style={{
                    fontSize: 13.5,
                    color: '#7A6A58',
                    lineHeight: 1.6,
                    margin: '0 0 16px',
                    fontWeight: 500
                  }}>
                    {person.description}
                  </p>

                  <div style={{
                    width: '32px',
                    height: '2px',
                    background: `linear-gradient(90deg, ${person.accent}, transparent)`,
                    margin: '0 auto 16px'
                  }} />

                  {/* Elegant Quote */}
                  <p style={{
                    fontSize: 12.5,
                    color: '#8C745C',
                    fontStyle: 'italic',
                    lineHeight: 1.5,
                    margin: 0,
                    fontWeight: 600,
                    background: 'rgba(255, 255, 255, 0.35)',
                    padding: '10px 14px',
                    borderRadius: '16px',
                    border: '1px solid rgba(234, 223, 207, 0.4)'
                  }}>
                    “{person.quote}”
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 3. QUOTE CAROUSEL ── */}
        <section style={{
          background: 'linear-gradient(135deg, #EADFCF 0%, #F5F1EB 60%, #EDE5D8 100%)',
          borderTop: '1px solid rgba(234,223,207,0.6)',
          borderBottom: '1px solid rgba(234,223,207,0.6)',
          padding: '90px 32px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Premium animated corner glows */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.14, 0.08] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: '20%', left: '5%', width: 220, height: 220, background: 'radial-gradient(circle, rgba(200,119,58,0.14), transparent 70%)', filter: 'blur(40px)', borderRadius: '50%' }}
          />
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.07, 0.13, 0.07] }}
            transition={{ duration: 13, delay: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', bottom: '10%', right: '5%', width: 200, height: 200, background: 'radial-gradient(circle, rgba(139,98,57,0.12), transparent 70%)', filter: 'blur(40px)', borderRadius: '50%' }}
          />

          <span style={{ fontSize: 11, fontWeight: 800, color: '#8B6239', textTransform: 'uppercase', letterSpacing: '0.12em' }}>💬 Quote of the Moment</span>
          <h2 className="premium-title-md">Words That Change Everything</h2>

          <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative', minHeight: 160 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.55, ease: 'easeInOut' }}
                style={{
                  background: 'rgba(255,255,255,0.65)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(234,223,207,0.7)',
                  borderRadius: 24,
                  padding: '40px 44px',
                  boxShadow: '0 16px 48px rgba(111,77,46,0.08)'
                }}
              >
                <p style={{ fontFamily: 'Outfit', fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 700, color: '#3D2B1A', lineHeight: 1.6, margin: '0 0 20px', fontStyle: 'italic' }}>
                  "{QUOTES[quoteIdx].text}"
                </p>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#8B6239' }}>— {QUOTES[quoteIdx].author}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28 }}>
            {QUOTES.map((_, i) => (
              <button
                key={i}
                onClick={() => setQuoteIdx(i)}
                style={{
                  width: i === quoteIdx ? 24 : 8, height: 8,
                  borderRadius: 99, border: 'none', cursor: 'pointer',
                  background: i === quoteIdx ? '#8B6239' : 'rgba(139,98,57,0.25)',
                  transition: 'all 0.3s ease', padding: 0
                }}
              />
            ))}
          </div>
        </section>

        {/* ── 4. DAILY CHALLENGES ── */}
        <section style={{ maxWidth: 800, margin: '0 auto', padding: '100px 32px' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 52 }}
          >
            <span style={{ fontSize: 11, fontWeight: 800, color: '#8B6239', textTransform: 'uppercase', letterSpacing: '0.12em' }}>✅ Today's Growth</span>
            <h2 className="premium-title-md">
              Daily Challenges
            </h2>
            <p style={{ fontSize: 15, color: '#7A6A58', margin: 0, lineHeight: 1.65 }}>Small, consistent actions that compound into extraordinary results.</p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {CHALLENGES.map((challenge, idx) => {
              const Icon = challenge.icon
              const done = checked[challenge.id]
              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06 }}
                  whileHover={{ x: 4 }}
                  onClick={() => toggleCheck(challenge.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 18,
                    background: done ? 'rgba(139,98,57,0.08)' : 'rgba(255,255,255,0.72)',
                    backdropFilter: 'blur(8px)',
                    border: `1.5px solid ${done ? 'rgba(139,98,57,0.25)' : 'rgba(234,223,207,0.65)'}`,
                    borderRadius: 20, padding: '20px 24px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: done ? '0 4px 20px rgba(139,98,57,0.08)' : '0 4px 16px rgba(111,77,46,0.04)'
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                    background: done ? 'linear-gradient(135deg, #8B6239, #C8773A)' : '#F5F1EB',
                    border: `1px solid ${done ? 'transparent' : 'rgba(234,223,207,0.6)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}>
                    <Icon size={18} color={done ? '#fff' : '#8B6239'} />
                  </div>
                  <span style={{
                    flex: 1, fontSize: 15, fontWeight: 600,
                    color: done ? '#8B6239' : '#3D2B1A',
                    textDecoration: done ? 'line-through' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    {challenge.text}
                  </span>
                  <motion.div animate={{ scale: done ? 1 : 0.85, opacity: done ? 1 : 0.35 }}>
                    {done
                      ? <CheckCircle2 size={22} color="#8B6239" />
                      : <Circle size={22} color="#EADFCF" />
                    }
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* ── 5. SUCCESS MINDSET ── */}
        <section style={{ padding: '0 24px 100px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              maxWidth: 1100,
              margin: '0 auto',
              background: 'linear-gradient(135deg, #6F4D2E 0%, #8B6239 50%, #A0733F 100%)',
              borderRadius: 40,
              padding: '90px 48px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(111,77,46,0.28)'
            }}
          >
            {/* Animated glow rings */}
            {[200, 340, 480].map((size, i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.08, 1], opacity: [0.12, 0.22, 0.12] }}
                transition={{ duration: 5 + i * 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
                style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: size, height: size, borderRadius: '50%',
                  border: '1.5px solid rgba(255,255,255,0.20)',
                  pointerEvents: 'none'
                }}
              />
            ))}

            <Flame size={44} color="rgba(255,220,180,0.7)" style={{ marginBottom: 24 }} />
            <h2 className="premium-title-lg" style={{ color: '#fff' }}>
              Your Mindset Is<br />Your Superpower
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,240,220,0.85)', lineHeight: 1.75, maxWidth: 560, margin: '0 auto 36px', fontWeight: 500 }}>
              Extraordinary lives are built from ordinary days lived with extraordinary intention. The gap between where you are and where you want to be is crossed one decision at a time.
            </p>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                border: '1.5px solid rgba(255,255,255,0.35)',
                color: '#fff', fontSize: 14, fontWeight: 700,
                padding: '13px 32px', borderRadius: 14, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                transition: 'all 0.25s ease'
              }}
            >
              Begin Today <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        </section>

        {/* ── 6. FOOTER BANNER ── */}
        <section style={{ padding: '0 24px 80px' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            style={{
              maxWidth: 1100, margin: '0 auto',
              background: 'rgba(255,255,255,0.68)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(234,223,207,0.70)',
              borderRadius: 32, padding: '52px 48px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 28,
              boxShadow: '0 16px 48px rgba(111,77,46,0.07)'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <Sparkles size={18} color="#8B6239" />
                <span style={{ fontSize: 11, fontWeight: 800, color: '#8B6239', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Keep Going</span>
              </div>
              <h3 style={{ fontFamily: 'Outfit', fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, color: '#3D2B1A', margin: 0, letterSpacing: '-0.5px', lineHeight: 1.3 }}>
                Keep building your future<br />one step at a time.
              </h3>
            </div>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'linear-gradient(135deg, #8B6239, #6F4D2E)',
                color: '#fff', fontSize: 14, fontWeight: 700,
                padding: '14px 32px', borderRadius: 14, border: 'none',
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
                boxShadow: '0 8px 24px rgba(111,77,46,0.20)',
                transition: 'all 0.25s ease', flexShrink: 0
              }}
            >
              Start Your Journey <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        </section>

        <Footer />
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 640px) {
          section { padding-left: 16px !important; padding-right: 16px !important; }
        }
      `}</style>
    </div>
  )
}
