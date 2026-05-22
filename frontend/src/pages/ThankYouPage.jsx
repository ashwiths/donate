import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Share2, Download, Heart, Shield } from 'lucide-react'
import { useDonation } from '../context/DonationContext'
import { staggerContainer, fadeUp, scaleIn } from '../animations/variants'
import confetti from 'canvas-confetti'

export default function ThankYouPage() {
  const navigate = useNavigate()
  const { selectedChild, donationAmount, transactionId } = useDonation()

  // Fire confetti on mount
  useEffect(() => {
    const fire = () =>
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#7B3F00', '#C8773A', '#E8A87C', '#FAF8F5'],
      })
    const t = setTimeout(fire, 300)
    return () => clearTimeout(t)
  }, [])

  const txId = transactionId || 'HP' + Date.now().toString().slice(-8)
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
        <div style={{ width: 40, height: 40, background: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Heart size={20} color="#fff" fill="#fff" />
        </div>
        <div>
          <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 18, color: 'var(--color-text)' }}>Heal & Play</div>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Play Games. Save Lives.</div>
        </div>
      </div>

      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        style={{ background: '#fff', borderRadius: 24, padding: '40px 36px', maxWidth: 500, width: '100%', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)' }}
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
          style={{ width: 72, height: 72, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}
        >
          <CheckCircle size={40} color="#16a34a" />
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ textAlign: 'center' }}>
          <motion.h1 variants={fadeUp} style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 800, margin: '0 0 8px', color: 'var(--color-text)' }}>
            Thank You! 🎉
          </motion.h1>
          <motion.p variants={fadeUp} style={{ fontSize: 15, color: 'var(--color-text-muted)', margin: '0 0 28px', lineHeight: 1.6 }}>
            Your donation has been successfully received.<br />You&apos;re helping save a life today.
          </motion.p>

          {/* Donation proof card */}
          <motion.div
            variants={fadeUp}
            style={{ background: 'var(--color-bg-warm)', borderRadius: 16, padding: '20px', border: '1px solid #E8D9C8', marginBottom: 24, textAlign: 'left' }}
          >
            <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>Donation Proof</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Donated To</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{selectedChild?.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Amount</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>₹{donationAmount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Date</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{date}</span>
            </div>
            <div style={{ height: 1, background: 'var(--color-border)', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Transaction ID</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'monospace', background: '#fff', padding: '3px 8px', borderRadius: 6, border: '1px solid var(--color-border)' }}>
                {txId}
              </span>
            </div>
          </motion.div>

          {/* Transparency badge */}
          <motion.div
            variants={fadeUp}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: '#f0fdf4', borderRadius: 12, marginBottom: 24, border: '1px solid #bbf7d0' }}
          >
            <Shield size={16} color="#16a34a" />
            <span style={{ fontSize: 13, color: '#15803d', fontWeight: 600 }}>
              ₹{donationAmount - 1} goes directly to Baby Aarav's treatment
            </span>
          </motion.div>

          {/* Actions */}
          <motion.div variants={fadeUp} style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px', background: '#fff', border: '1px solid var(--color-border)', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--color-text-muted)' }}
            >
              <Share2 size={14} /> Share
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px', background: '#fff', border: '1px solid var(--color-border)', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--color-text-muted)' }}
            >
              <Download size={14} /> Download Receipt
            </motion.button>
          </motion.div>

          <motion.button
            variants={fadeUp}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/main')}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: 15, fontFamily: 'Outfit' }}
          >
            Continue Playing <ArrowRight size={16} />
          </motion.button>

          <motion.button
            variants={fadeUp}
            onClick={() => navigate('/home')}
            style={{ marginTop: 12, background: 'none', border: 'none', fontSize: 13, color: 'var(--color-text-muted)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Back to Home
          </motion.button>
        </motion.div>
      </motion.div>

      <p style={{ marginTop: 24, fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center' }}>
        Together, we can save more lives. 🤎<br />
        © 2024 Heal & Play
      </p>
    </div>
  )
}
