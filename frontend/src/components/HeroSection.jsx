import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Heart, Play } from 'lucide-react'
import { fadeUp, staggerContainer, slideInRight } from '../animations/variants'

const avatars = [
  'https://i.pravatar.cc/32?img=1',
  'https://i.pravatar.cc/32?img=2',
  'https://i.pravatar.cc/32?img=3',
]

export default function HeroSection() {
  const navigate = useNavigate()

  return (
    <section style={{ padding: '48px 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}
        className="hero-grid">
        {/* Left */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.h1
            variants={fadeUp}
            style={{ fontFamily: 'Outfit', fontSize: 'clamp(36px,5vw,56px)', fontWeight: 800, lineHeight: 1.1, margin: '0 0 12px', color: 'var(--color-text)' }}
          >
            Play Games.<br />
            <span style={{ color: 'var(--color-primary)' }}>Save Lives.</span>{' '}
            <span style={{ fontSize: '0.6em' }}>🤍</span>
          </motion.h1>

          <motion.p variants={fadeUp} style={{ fontSize: 16, color: 'var(--color-text-muted)', marginBottom: 32, lineHeight: 1.6, maxWidth: 400 }}>
            Your small contribution can give a child a second chance at life.
          </motion.p>

          <motion.div variants={fadeUp} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/main')}
              className="btn-primary"
              style={{ fontSize: 15 }}
            >
              <Heart size={16} fill="#fff" /> Donate & Play
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-outline"
            >
              <Play size={15} /> See How It Works
            </motion.button>
          </motion.div>

          <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex' }}>
              {avatars.map((src, i) => (
                <img key={i} src={src} alt="helper" style={{
                  width: 30, height: 30, borderRadius: '50%',
                  border: '2px solid #fff', marginLeft: i > 0 ? -8 : 0, objectFit: 'cover',
                }} />
              ))}
            </div>
            <span style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 500 }}>
              <strong style={{ color: 'var(--color-text)' }}>25,842+</strong> people are helping children every day 🤎
            </span>
          </motion.div>
        </motion.div>

        {/* Right image */}
        <motion.div variants={slideInRight} initial="hidden" animate="visible" style={{ position: 'relative' }}>
          <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: 'var(--shadow-lg)', position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=80"
              alt="Child in need"
              style={{ width: '100%', height: 360, objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              position: 'absolute', bottom: 20, right: 20,
              background: 'var(--color-primary)', color: '#fff',
              borderRadius: 16, padding: '12px 16px', fontSize: 13, fontWeight: 600,
              lineHeight: 1.4, textAlign: 'center', boxShadow: 'var(--shadow-md)',
            }}>
              Together,<br />we can heal<br />more lives.
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
