import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { cardVariant } from '../animations/variants'
import { useDonation } from '../context/DonationContext'

export default function CouponCard({ coupon }) {
  const { logo, brand, worth, price, color = '#1E40AF' } = coupon
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
      whileHover={{ y: -4 }}
      style={{
        background: '#fff', borderRadius: 16,
        border: '1px solid var(--color-border)',
        overflow: 'hidden', cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
      }}
      onClick={handleUnlock}
    >
      <div style={{ background: color, padding: '24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100 }}>
        <span style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>{brand}</span>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <p style={{ margin: '0 0 2px', fontSize: 12, color: 'var(--color-text-muted)' }}>Worth</p>
        <p style={{ margin: '0 0 14px', fontSize: 20, fontWeight: 800, color: 'var(--color-text)', fontFamily: 'Outfit' }}>₹{worth}</p>
        <button className="btn-primary" style={{ width: '100%', padding: '9px 0', fontSize: 14 }}>₹{price}</button>
      </div>
    </motion.div>
  )
}
