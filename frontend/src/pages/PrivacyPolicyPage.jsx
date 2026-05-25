import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Eye, Database, FileText, Globe } from 'lucide-react'
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

export default function PrivacyPolicyPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ flex: '1 0 auto', padding: '40px 0' }}>
        <div className="page-container" style={{ maxWidth: 900 }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', flexDirection: 'column', gap: 32 }}
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
                <ShieldCheck size={14} />
                User Privacy First
              </div>
              <h1 className="premium-title-lg" style={{ margin: '0 0 16px 0', fontSize: 'clamp(28px, 5vw, 44px)' }}>
                Privacy Policy
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', margin: 0, fontWeight: 600 }}>
                Last Updated: May 25, 2026
              </p>
            </motion.div>

            {/* Document Content */}
            <motion.div variants={itemVariants} className="glass-warm" style={{ padding: '32px 28px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: 24, lineHeight: 1.7, fontSize: 15, color: '#3D2B1A' }}>
              
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Eye size={18} color="var(--color-primary)" />
                  1. Overview & Scope
                </h2>
                <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                  At Heal & Play, accessible from <strong>https://donate.ashil.space</strong>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Heal & Play and how we use it. If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Database size={18} color="var(--color-primary)" />
                  2. Information We Collect
                </h2>
                <p style={{ color: 'var(--color-text-muted)', margin: '0 0 12px 0' }}>
                  The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
                </p>
                <ul style={{ color: 'var(--color-text-muted)', paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li><strong>Account Credentials:</strong> If you register for an Account, we may ask for your contact information, including items such as name, email address, and authentication tokens.</li>
                  <li><strong>Contribution Records:</strong> When you execute a support donation, we track details like amount, date, and completed status, but we do <strong>not</strong> collect or store full credit card numbers or raw payment pins.</li>
                  <li><strong>Game Logs:</strong> Performance score status inside dynamic games is recorded to credit support tokens or display certificate rewards.</li>
                </ul>
              </div>

              <div>
                <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Globe size={18} color="var(--color-primary)" />
                  3. Log Files & Web Technologies
                </h2>
                <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                  Heal & Play follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FileText size={18} color="var(--color-primary)" />
                  4. Google DoubleClick DART Cookie & Ads
                </h2>
                <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                  Google is one of the third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>https://policies.google.com/technologies/ads</a>
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ShieldCheck size={18} color="var(--color-primary)" />
                  5. Security of Payments
                </h2>
                <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                  We implement high-grade SSL encryption for all transaction communication channels. Payments are finalized using secure, authenticated third-party interfaces like UPI gateways and certified payment platforms. We do not store sensitive payment system attributes in our databases.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FileText size={18} color="var(--color-primary)" />
                  6. Consent
                </h2>
                <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                  By using our website, you hereby consent to our Privacy Policy and agree to its terms and conditions.
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
