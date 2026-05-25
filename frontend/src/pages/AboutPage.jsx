import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Shield, Gamepad2, Users, Target } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
}

export default function AboutPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ flex: '1 0 auto', padding: '40px 0' }}>
        <div className="page-container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', flexDirection: 'column', gap: 40 }}
          >
            {/* Hero Section */}
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
                <Heart size={14} fill="var(--color-primary)" />
                Our Story & Mission
              </div>
              <h1 className="premium-title-lg" style={{ margin: '0 0 16px 0', fontSize: 'clamp(28px, 5vw, 48px)' }}>
                About Heal & Play
              </h1>
              <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'var(--color-text-muted)', maxWidth: 720, margin: '0 auto 0', lineHeight: 1.6, fontWeight: 500 }}>
                A modern donation and healing contribution platform. We believe in transparency, empathy, and engaging experiences to empower community-driven healthcare support.
              </p>
            </motion.div>

            {/* Core Principles */}
            <motion.div variants={itemVariants}>
              <h2 className="premium-title-md" style={{ textAlign: 'center', marginBottom: 32 }}>
                Our Core Principles
              </h2>
              <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                <div className="glass-warm" style={{ padding: 28, borderRadius: 20 }}>
                  <div style={{ width: 48, height: 48, background: 'var(--color-bg-warm)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <Shield size={24} color="var(--color-primary)" />
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: 18, color: 'var(--color-text)', marginBottom: 12 }}>100% Transparency</h3>
                  <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                    Every single donation and contribution is tracked and transferred directly for treatment funds. We publish verifiable break-downs and payment proofs for total auditability.
                  </p>
                </div>

                <div className="glass-warm" style={{ padding: 28, borderRadius: 20 }}>
                  <div style={{ width: 48, height: 48, background: 'var(--color-bg-warm)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <Gamepad2 size={24} color="var(--color-primary)" />
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: 18, color: 'var(--color-text)', marginBottom: 12 }}>Interactive Healing</h3>
                  <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                    We combine charity with mental wellness. By contributing, users unlock access to interactive healing games, breathing exercises, and sensory music experiences.
                  </p>
                </div>

                <div className="glass-warm" style={{ padding: 28, borderRadius: 20 }}>
                  <div style={{ width: 48, height: 48, background: 'var(--color-bg-warm)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <Users size={24} color="var(--color-primary)" />
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: 18, color: 'var(--color-text)', marginBottom: 12 }}>Verified Medical Cases</h3>
                  <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                    Our team works directly with verified hospitals and clinical practitioners to validate treatment details, ensuring every contribution targets a genuine case.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div variants={itemVariants} className="glass-warm" style={{ padding: '32px 28px', borderRadius: '20px' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
                <Target size={24} color="var(--color-primary)" />
                <h2 style={{ fontWeight: 900, fontSize: 22, margin: 0, color: 'var(--color-text)' }}>Our Vision</h2>
              </div>
              <p style={{ fontSize: 15, color: 'var(--color-text-muted)', lineHeight: 1.7, margin: '0 0 16px 0' }}>
                We believe that supporting someone in need shouldn't feel like a disconnected financial transaction. By introducing interactive elements, sound wave therapy, bio-path tracing visualization, and gamification, we turn donation campaigns into an active, positive community ritual.
              </p>
              <p style={{ fontSize: 15, color: 'var(--color-text-muted)', lineHeight: 1.7, margin: 0 }}>
                Our goal is to build the world's most transparent crowdfunding workspace, helping children and adults secure life-saving treatments through trusted, secure local channels. Thank you for being a part of this healing journey.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
