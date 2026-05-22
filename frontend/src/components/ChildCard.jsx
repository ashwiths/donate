import { motion } from 'framer-motion'
import { MapPin, Play, Share2 } from 'lucide-react'
import DonationProgress from './DonationProgress'
import { cardVariant } from '../animations/variants'

export default function ChildCard({ child }) {
  const {
    name, age, condition, image, story,
    requiredAmount, raisedAmount,
  } = child

  const pct = Math.min(((raisedAmount / requiredAmount) * 100).toFixed(2), 100)

  return (
    <motion.div
      variants={cardVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      style={{
        background: '#fff',
        borderRadius: 20,
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        display: 'grid',
        gridTemplateColumns: '260px 1fr 220px',
        gap: 0,
      }}
      className="child-card-grid"
    >
      {/* Image */}
      <div style={{ position: 'relative' }}>
        <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 220 }} />
        <div style={{
          position: 'absolute', bottom: 8, left: 8,
          background: 'rgba(0,0,0,0.55)', color: '#fff', borderRadius: 6,
          padding: '2px 8px', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Play size={10} fill="#fff" /> 1:24
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '24px 20px' }}>
        <h3 style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 700, margin: '0 0 4px', color: 'var(--color-text)' }}>{name}</h3>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4, margin: '0 0 12px' }}>
          <MapPin size={13} /> {condition}
        </p>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.6, margin: '0 0 20px' }}>{story}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-outline" style={{ padding: '8px 16px', fontSize: 13 }}>View Full Story</button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
            background: 'var(--color-bg-warm)', border: '1px solid var(--color-border)',
            borderRadius: 10, fontSize: 13, cursor: 'pointer', fontWeight: 500, color: 'var(--color-text-muted)',
          }}>
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>

      {/* Progress */}
      <div style={{ padding: '24px 20px', borderLeft: '1px solid var(--color-border)' }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '0 0 4px', fontWeight: 500 }}>Required Amount</p>
        <p style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Outfit', margin: '0 0 16px', color: 'var(--color-text)' }}>
          ₹{requiredAmount.toLocaleString('en-IN')}
        </p>
        <DonationProgress raised={raisedAmount} required={requiredAmount} percentage={pct} />
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 12, textAlign: 'center' }}>
          Help us reach the goal 🤎
        </p>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .child-card-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  )
}
