import { Heart, CreditCard, Info } from 'lucide-react'

export default function PaymentBreakdown({ amount = 10 }) {
  const treatment = amount - 1
  const gateway = 1

  return (
    <div style={{
      background: 'var(--color-bg-warm)',
      borderRadius: 16,
      border: '1px solid #E8D9C8',
      padding: '20px 24px',
    }}>
      <h4 style={{ margin: '0 0 16px', fontWeight: 700, fontSize: 15, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 8 }}>
        How Your Contribution Helps <Heart size={15} color="var(--color-primary)" fill="var(--color-primary)" />
      </h4>
      <p style={{ margin: '0 0 16px', fontSize: 12, color: 'var(--color-text-muted)' }}>
        Your every rupee goes towards saving a life.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {/* You Pay */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 2 }}>You Pay</div>
          <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 22, color: 'var(--color-text)' }}>₹{amount}</div>
        </div>

        <span style={{ fontSize: 20, color: 'var(--color-text-muted)' }}>=</span>

        {/* Treatment */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--color-border)' }}>
          <Heart size={18} color="var(--color-primary)" fill="var(--color-primary)" />
          <div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>To Baby's Treatment</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-text)' }}>₹{treatment}</div>
          </div>
        </div>

        <span style={{ fontSize: 16, color: 'var(--color-text-muted)' }}>+</span>

        {/* Gateway */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--color-border)' }}>
          <CreditCard size={18} color="var(--color-text-muted)" />
          <div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Payment Gateway Charges</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-text)' }}>₹{gateway}</div>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: 14, padding: '10px 14px',
        background: '#FFF0E0', borderRadius: 10,
        fontSize: 12, color: 'var(--color-primary)', fontWeight: 500,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Info size={14} />
        We are 100% transparent. You can see the complete breakup before payment.
      </div>
    </div>
  )
}
