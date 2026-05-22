import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { cardVariant } from '../animations/variants'
import { useDonation } from '../context/DonationContext'

export default function GameCard({ game }) {
  const { image, title, description, price, tag } = game
  const navigate = useNavigate()
  const { confirmDonation } = useDonation()

  const handleUnlock = () => {
    confirmDonation(price)
    navigate('/thank-you')
  }

  return (
    <motion.div
      variants={cardVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ y: -4, boxShadow: 'var(--shadow-md)' }}
      style={{
        background: '#fff', borderRadius: 16,
        border: '1px solid var(--color-border)',
        overflow: 'hidden', cursor: 'pointer',
        transition: 'box-shadow 0.2s',
      }}
      onClick={handleUnlock}
    >
      <div style={{ position: 'relative' }}>
        <img src={image} alt={title} style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
        {tag && (
          <span style={{
            position: 'absolute', top: 8, right: 8,
            background: 'var(--color-primary)', color: '#fff',
            borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600,
          }}>{tag}</span>
        )}
      </div>
      <div style={{ padding: '14px 16px' }}>
        <h4 style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 15, color: 'var(--color-text)' }}>{title}</h4>
        <p style={{ margin: '0 0 14px', fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{description}</p>
        <button className="btn-primary" style={{ width: '100%', padding: '9px 0', fontSize: 14 }}>
          ₹{price}
        </button>
      </div>
    </motion.div>
  )
}
