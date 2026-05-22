import { motion } from 'framer-motion'

export default function DonationProgress({ raised, required, percentage, compact = false }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <div>
          <span style={{ fontSize: compact ? 12 : 13, color: 'var(--color-text-muted)', display: 'block' }}>Raised So Far</span>
          <span style={{ fontFamily: 'Outfit', fontSize: compact ? 18 : 22, fontWeight: 800, color: 'var(--color-primary)' }}>
            ₹{raised.toLocaleString('en-IN')}
          </span>
        </div>
        <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600 }}>{percentage}%</span>
      </div>

      <div className="progress-bar-track">
        <motion.div
          className="progress-bar-fill"
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>

      {!compact && (
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 8 }}>
          of ₹{required.toLocaleString('en-IN')} goal
        </p>
      )}
    </div>
  )
}
