import { Link } from 'react-router-dom'
import { Heart, Shield, FileCheck, Lock, Users } from 'lucide-react'

const trustItems = [
  { icon: Shield, label: '100% Transparent', desc: 'Every penny is used for treatment funds' },
  { icon: FileCheck, label: 'Verified Cases', desc: 'All cases are verified with hospital proof' },
  { icon: Lock, label: 'Secure & Safe', desc: 'Your data and payments are always protected' },
  { icon: Users, label: 'Together We Heal', desc: 'Together, we can save more lives' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#fff', borderTop: '1px solid var(--color-border)', marginTop: 'auto' }}>
      {/* Trust Bar */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 24 }}>
        {trustItems.map(({ icon: Icon, label, desc }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{
              width: 40, height: 40, background: 'var(--color-bg-warm)',
              borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon size={20} color="var(--color-primary)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-text)', marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid var(--color-border)', padding: '16px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0 }}>
          © 2024 Heal &amp; Play. All rights reserved.
        </p>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
          Together, we can save more lives. <Heart size={13} style={{ display: 'inline', verticalAlign: 'middle', color: 'var(--color-primary)' }} fill="var(--color-primary)" />
        </p>
      </div>
    </footer>
  )
}
