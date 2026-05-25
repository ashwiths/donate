import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, HelpCircle, Heart } from 'lucide-react'
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

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    }
  }

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
            {/* Header */}
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
                <HelpCircle size={14} />
                Get In Touch
              </div>
              <h1 className="premium-title-lg" style={{ margin: '0 0 16px 0', fontSize: 'clamp(28px, 5vw, 48px)' }}>
                Contact Support & Inquiry
              </h1>
              <p style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: 'var(--color-text-muted)', maxWidth: 640, margin: '0 auto 0', lineHeight: 1.6, fontWeight: 500 }}>
                Have questions about a medical case, dynamic contribution rewards, or looking to verify hospital credentials? We are here to assist you.
              </p>
            </motion.div>

            {/* Support info & form split */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 24
            }}>
              {/* Info */}
              <motion.div variants={itemVariants} className="glass-warm" style={{ padding: 28, borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 24 }}>
                <h2 style={{ fontWeight: 900, fontSize: 20, color: 'var(--color-text)', margin: 0 }}>Support Channels</h2>
                
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, background: 'var(--color-bg-warm)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={20} color="var(--color-primary)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text)' }}>Email Address</div>
                    <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>support@ashil.space</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, background: 'var(--color-bg-warm)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={20} color="var(--color-primary)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text)' }}>Dedicated Phone Support</div>
                    <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>+91 98765 43210 (Mon-Fri, 9am - 6pm IST)</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, background: 'var(--color-bg-warm)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={20} color="var(--color-primary)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text)' }}>Corporate Address</div>
                    <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>Heal & Play Operations Hub, 102 Wellness Square, Indiranagar, Bangalore, KA, India</div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 20, marginTop: 'auto' }}>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
                    For fast resolution, please check case verification document files attached directly to each individual child contribution banner on the Homepage.
                  </p>
                </div>
              </motion.div>

              {/* Form */}
              <motion.div variants={itemVariants} className="glass-warm" style={{ padding: 28, borderRadius: 20 }}>
                <h2 style={{ fontWeight: 900, fontSize: 20, color: 'var(--color-text)', margin: '0 0 20px 0' }}>Send Us a Message</h2>

                {submitted ? (
                  <div style={{
                    background: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    color: '#065F46',
                    padding: 16,
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    lineHeight: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <Heart size={16} fill="#065F46" />
                    Thank you! Your message has been sent successfully. We will get back to you shortly.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        className="premium-input"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        className="premium-input"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>Subject (Optional)</label>
                      <input
                        type="text"
                        placeholder="Partnership, Case Submission, Bug Report"
                        className="premium-input"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>Your Message</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="How can we help you?"
                        className="premium-input"
                        style={{ minHeight: 120, resize: 'vertical', paddingTop: 14 }}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8 }}>
                      <Send size={16} />
                      Send Message
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
