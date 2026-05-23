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
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ position: 'relative', zIndex: 2 }}>
          <motion.h1
            variants={fadeUp}
            style={{ fontFamily: 'Outfit', fontSize: 'clamp(48px, 7vw, 76px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', margin: '0 0 16px', color: '#3D2B1A' }}
          >
            Help Children <br />
            <span className="text-gradient-animate">Heal.</span>{' '}
            <span style={{ fontSize: '0.6em', filter: 'drop-shadow(0 4px 12px rgba(140,79,26,0.3))' }}>🤎</span>
          </motion.h1>

          <motion.p variants={fadeUp} style={{ fontSize: 17, color: '#6A5C4F', marginBottom: 36, lineHeight: 1.6, maxWidth: 440, fontWeight: 500 }}>
            Every contribution becomes a verified hospital credit. Your small kindness can give a child a second chance at life.
          </motion.p>

          <motion.div variants={fadeUp} className="hero-buttons" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 12px 30px rgba(139, 94, 52, 0.25)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/main')}
              style={{ padding: '16px 32px', background: 'linear-gradient(135deg, #8C4F1A, #C8773A)', color: '#fff', border: 'none', borderRadius: '99px', fontSize: '15px', fontWeight: 800, fontFamily: 'Outfit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.3s ease' }}
            >
              <Heart size={16} fill="#fff" /> Donate & Play
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, background: 'rgba(255,255,255,0.9)', boxShadow: '0 12px 30px rgba(139, 94, 52, 0.08)' }}
              whileTap={{ scale: 0.97 }}
              style={{ padding: '16px 32px', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)', color: '#8C4F1A', border: '1px solid rgba(140, 79, 26, 0.3)', borderRadius: '99px', fontSize: '15px', fontWeight: 800, fontFamily: 'Outfit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.3s ease' }}
            >
              <Play size={15} /> See How It Works
            </motion.button>
          </motion.div>

          <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex' }}>
              {avatars.map((src, i) => (
                <img key={i} src={src} alt="helper" style={{
                  width: 34, height: 34, borderRadius: '50%',
                  border: '2px solid #fff', marginLeft: i > 0 ? -12 : 0, objectFit: 'cover',
                  boxShadow: '0 4px 12px rgba(139, 94, 52, 0.15)'
                }} />
              ))}
            </div>
            <span style={{ fontSize: 13.5, color: '#7A6A58', fontWeight: 600 }}>
              <strong style={{ color: '#3D2B1A', fontWeight: 900 }}>25,842+</strong> people are helping children 🤎
            </span>
          </motion.div>
        </motion.div>

        {/* Right image */}
        <motion.div variants={slideInRight} initial="hidden" animate="visible" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }} className="glass-warm" style={{ borderRadius: 32, padding: '12px', position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=80"
              alt="Child in need"
              style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block', borderRadius: 24 }}
              loading="lazy" decoding="async"
            />
            <div style={{
              position: 'absolute', bottom: -20, right: -20,
              background: 'rgba(255, 255, 255, 0.95)', color: '#8C4F1A',
              borderRadius: 24, padding: '20px 24px', fontSize: 14, fontWeight: 800,
              lineHeight: 1.5, textAlign: 'left', boxShadow: '0 20px 40px rgba(139, 94, 52, 0.15)',
              border: '1px solid #EBD5C2', backdropFilter: 'blur(10px)',
              display: 'flex', flexDirection: 'column', gap: 8
            }}>
              <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#166534', background: '#DCFCE7', padding: '4px 10px', borderRadius: 99, alignSelf: 'flex-start' }}>Live Hospital Case</span>
              Funding Verified Treatment<br />
              <div style={{ height: 6, width: 140, background: '#EBD5C2', borderRadius: 99, marginTop: 4, overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '70%' }} transition={{ duration: 1.5, delay: 0.5 }} style={{ height: '100%', background: 'linear-gradient(90deg, #8C4F1A, #C8773A)', borderRadius: 99 }} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
