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
    <footer style={{
      background: 'rgba(255,255,255,0.45)',
      backdropFilter: 'blur(8px)',
      borderTop: '1px solid var(--color-border)',
      marginTop: 'auto'
    }}>
      {/* Trust Bar */}
      <div
        className="footer-trust-grid"
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '28px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 24,
          boxSizing: 'border-box',
          width: '100%'
        }}
      >
        {trustItems.map(({ icon: Icon, label, desc }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{
              width: 40, height: 40,
              background: 'var(--color-bg-warm)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
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
      <div style={{ borderTop: '1px solid var(--color-border)', padding: '20px 24px', textAlign: 'center' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          gap: '16px', 
          marginBottom: '16px',
          flexWrap: 'wrap'
        }}>
          <Link to="/about" style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>About Us</Link>
          <span style={{ color: 'var(--color-border)', fontSize: 12 }}>|</span>
          <Link to="/privacy" style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>Privacy Policy</Link>
          <span style={{ color: 'var(--color-border)', fontSize: 12 }}>|</span>
          <Link to="/terms" style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>Terms & Conditions</Link>
          <span style={{ color: 'var(--color-border)', fontSize: 12 }}>|</span>
          <Link to="/contact" style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>Contact Us</Link>
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0 }}>
          © 2026{' '}
          <a
            href="https://ashil.space"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--color-primary)', fontWeight: 800, textDecoration: 'none', borderBottom: '1px dashed rgba(140,79,26,0.4)', transition: 'all 0.2s ease' }}
            onMouseOver={(e) => { e.target.style.color = '#5C2D0E'; e.target.style.borderBottomColor = '#5C2D0E'; }}
            onMouseOut={(e) => { e.target.style.color = 'var(--color-primary)'; e.target.style.borderBottomColor = 'rgba(140,79,26,0.4)'; }}
          >
            Infant Ashil A
          </a>
          . All rights reserved.
        </p>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
          Made with <Heart size={13} style={{ display: 'inline', verticalAlign: 'middle', color: 'var(--color-primary)' }} fill="var(--color-primary)" /> and a lot of ☕
        </p>
      </div>
    </footer>
  )
}
