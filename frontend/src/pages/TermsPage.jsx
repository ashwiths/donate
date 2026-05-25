import React from 'react'
import { motion } from 'framer-motion'
import { FileText, ShieldAlert, DollarSign, Award, Scale, HelpCircle, Info, Globe } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } }
}

export default function TermsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#FCFAF6' }}>
      <Navbar />

      <main style={{ flex: '1 0 auto', padding: '40px 0', position: 'relative', zIndex: 1 }}>
        {/* Canonical/SEO optimization link tag */}
        <link rel="canonical" href="https://savee.space/terms" />

        <div className="page-container" style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', flexDirection: 'column', gap: 32 }}
          >
            {/* Header / Hero */}
            <motion.div variants={itemVariants} className="glass-warm" style={{ padding: '40px 24px', borderRadius: '24px', textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(123, 63, 0, 0.08)',
                color: 'var(--color-primary)',
                padding: '6px 16px',
                borderRadius: '99px',
                fontSize: '13px',
                fontWeight: 800,
                marginBottom: 16
              }}>
                <FileText size={14} />
                Agreement & Policies
              </div>
              <h1 className="premium-title-lg" style={{ margin: '0 0 16px 0', fontSize: 'clamp(28px, 5vw, 44px)' }}>
                Terms & Conditions
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', margin: 0, fontWeight: 600 }}>
                Effective Date: May 25, 2026 • Official Platform Domain: <a href="https://savee.space" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 800 }}>https://savee.space</a>
              </p>
            </motion.div>

            {/* Document Body */}
            <motion.div variants={itemVariants} className="glass-warm" style={{ padding: '32px 28px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: 28, lineHeight: 1.7, fontSize: 15, color: '#3D2B1A' }}>
              
              {/* Section 1 */}
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, color: '#3D2B1A' }}>
                  <Globe size={18} color="var(--color-primary)" />
                  1. Platform Domain & Scope
                </h2>
                <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                  These Terms and Conditions govern your use of the Heal & Play platform, operated canonically under the domain <a href="https://savee.space" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>https://savee.space</a>. By accessing the platform, playing games, or completing contributions, you agree to comply with and be bound by these policies. If you do not agree, you must immediately cease platform use.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, color: '#3D2B1A' }}>
                  <Info size={18} color="var(--color-primary)" />
                  2. Support & Contribution Policy
                </h2>
                <p style={{ color: 'var(--color-text-muted)', margin: '0 0 12px 0' }}>
                  Heal & Play facilitates micro-donations to aid pediatric clinical care. Users participate by unlocking wellness-focused interactive games (such as Sound Wave Serenade, Breathe & Bloom, or Bio-Path Tracer).
                </p>
                <ul style={{ color: 'var(--color-text-muted)', paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li>All contributions are settled directly towards verified patient hospital records and clinical bills.</li>
                  <li>Contributions starting from ₹10 help secure verified treatment milestones for pediatric care.</li>
                  <li>Contributions are voluntary and cannot be reversed or refunded once settled to the hospital ledger.</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, color: '#3D2B1A' }}>
                  <DollarSign size={18} color="var(--color-primary)" />
                  3. Payment Policy
                </h2>
                <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                  Transactions are routed through secure, authenticated third-party interfaces including UPI deep-linking gateways and official QR code fallbacks. Heal & Play does not collect, process, or store credit card numbers, payment pins, or authentication passwords. In the event of network disruption, offline fallback triggers queueing local contribution records to ensure ledger settlements are completed silently and securely once connectivity restores.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, color: '#3D2B1A' }}>
                  <Award size={18} color="var(--color-primary)" />
                  4. Healing Appreciation Certificate Policy
                </h2>
                <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                  Upon successful payment confirmation, users are granted a digital, personalized "Healing Appreciation Certificate" containing a custom dedication name. This certificate serves as an official token of gratitude from the Heal & Play ecosystem. It holds no monetary value, cannot be traded, and is not a financial security or certificate of stock ownership.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, color: '#3D2B1A' }}>
                  <ShieldAlert size={18} color="var(--color-primary)" />
                  5. Medical & Therapeutic Disclaimer
                </h2>
                <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                  The interactive games and visual sensory tools (e.g. breathing exercises, sound wave therapies) are strictly for therapeutic recreation and positive engagement. They are <strong>not</strong> medical treatments or clinical therapies, and should not replace professional medical advice, diagnosis, or treatment. Always consult certified clinical professionals regarding medical conditions.
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, color: '#3D2B1A' }}>
                  <Scale size={18} color="var(--color-primary)" />
                  6. Limitation of Liability
                </h2>
                <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                  Under no circumstances shall Heal & Play, its administrators, developers, or clinical partners be liable for any direct, indirect, incidental, or consequential damages resulting from your use of, or inability to use, the platform services, games, or payment systems.
                </p>
              </div>

              {/* Section 7 */}
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, color: '#3D2B1A' }}>
                  <HelpCircle size={18} color="var(--color-primary)" />
                  7. Platform Administration & Contact
                </h2>
                <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                  We reserve the right to modify these Terms & Conditions at any time to reflect platform upgrades. Continued use of <a href="https://savee.space" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>https://savee.space</a> constitutes acceptance of revised terms. For questions or support, contact our team at <strong>support@savee.space</strong>.
                </p>
              </div>

            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
