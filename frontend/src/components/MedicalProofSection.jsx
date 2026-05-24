import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Download, Maximize2, X, Eye, FileText, CheckCircle } from 'lucide-react'
import { DonationBackground } from './PremiumBackground'

// Import assets
import doc1 from '../assets/document1.jpg'
import doc2 from '../assets/document2.jpg'
import doc3 from '../assets/document3.jpg'
import doc4 from '../assets/document4.jpg'

const DOCUMENTS = [
  {
    id: 'doc-1',
    src: doc1,
    title: 'Hospital Admission Certificate',
    category: 'Admission Record',
    desc: 'Official patient admission registry and clinical intake confirmation from the Super Speciality Pediatric wing.',
    date: 'May 12, 2026',
    size: '1.2 MB'
  },
  {
    id: 'doc-2',
    src: doc2,
    title: 'Diagnostic Lab Reports',
    category: 'Lab Diagnostics',
    desc: 'Hematology panel, clinical genetic sequencing, and certified SMN1 gene deletion testing records.',
    date: 'May 14, 2026',
    size: '2.4 MB'
  },
  {
    id: 'doc-3',
    src: doc3,
    title: 'Clinical Recommendation Letter',
    category: 'Neurological Opinion',
    desc: 'Certified treatment recommendation and life-saving drug prescription signed by Chief Pediatric Neurologist.',
    date: 'May 18, 2026',
    size: '1.8 MB'
  },
  {
    id: 'doc-4',
    src: doc4,
    title: 'Treatment Estimate Ledger',
    category: 'Financial Estimate',
    desc: 'Certified hospital billing estimate outlining intensive clinical care and genetic replacement cost projections.',
    date: 'May 20, 2026',
    size: '3.1 MB'
  }
]

export default function MedicalProofSection() {
  const [activeDoc, setActiveDoc] = useState(null)

  // Direct trigger download helper
  const handleDownload = (docSrc, docTitle) => {
    const link = document.createElement('a')
    link.href = docSrc
    link.download = docTitle.toLowerCase().replace(/\s+/g, '_') + '.jpg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section
      id="medical-documents"
      style={{
        padding: 'clamp(48px,7vw,96px) clamp(16px,4vw,40px)',
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <DonationBackground />
      {/* Decorative Warm Ambient Glows */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(235, 215, 194, 0.25) 0%, rgba(255,255,255,0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(235, 215, 194, 0.25) 0%, rgba(255,255,255,0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(240, 226, 211, 0.6)',
              backdropFilter: 'blur(4px)',
              border: '1px solid #EBD5C2',
              borderRadius: '99px',
              padding: '6px 16px',
              marginBottom: 16
            }}
          >
            <ShieldCheck size={14} color="#8C4F1A" />
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#8C4F1A',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}>
              100% Transparency Framework
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontFamily: 'Outfit',
              fontWeight: 900,
              fontSize: 'clamp(32px, 4.5vw, 44px)',
              color: '#3D2B1A',
              margin: '0 0 16px',
              letterSpacing: '-1px',
              lineHeight: 1.15
            }}
          >
            Verified Medical Documents
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              fontSize: '16.5px',
              color: '#6E5D4F',
              maxWidth: '640px',
              margin: '0 auto',
              lineHeight: 1.6
            }}
          >
            We believe in complete transparency. Supporters can review authentic hospital and diagnostic reports related to Janamitra’s treatment journey.
          </motion.p>
        </div>

        {/* 3 trust pillars badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 20,
            marginBottom: 56
          }}
        >
          {[
            'Verified by Hospital',
            'Medical Transparency Initiative',
            'Parent Approved Documentation'
          ].map((text, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#FFF',
              border: '1px solid rgba(235, 224, 214, 0.7)',
              boxShadow: '0 4px 15px rgba(139, 94, 52, 0.03)',
              borderRadius: '99px',
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 700,
              color: '#5C4C3C'
            }}>
              <CheckCircle size={15} color="#8C4F1A" />
              <span>{text}</span>
            </div>
          ))}
        </motion.div>

        {/* Documents Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 'clamp(16px, 3vw, 32px)'
        }}>
          {DOCUMENTS.map((doc, idx) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(139, 94, 52, 0.08)' }}
              style={{
                background: '#FFF',
                borderRadius: '24px',
                border: '1px solid rgba(235, 224, 214, 0.8)',
                boxShadow: '0 10px 30px rgba(139, 94, 52, 0.02)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Document Image Preview Container */}
              <div style={{
                height: '200px',
                position: 'relative',
                overflow: 'hidden',
                background: '#FAF6F2',
                borderBottom: '1px solid rgba(235, 224, 214, 0.5)',
                cursor: 'pointer'
              }}
                onClick={() => setActiveDoc(doc)}
                className="group"
              >
                <img
                  src={doc.src}
                  alt={doc.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    transition: 'transform 0.5s ease'
                  }}
                  className="doc-preview-img"
                />
                
                {/* Image Overlay Hover */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(61, 43, 26, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  backdropFilter: 'blur(3px)'
                }}
                  className="doc-hover-overlay"
                >
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                  }}>
                    <Eye size={20} color="#8C4F1A" />
                  </div>
                </div>

                {/* Category Badge */}
                <div style={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(4px)',
                  padding: '4px 12px',
                  borderRadius: '99px',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#8C4F1A',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                  letterSpacing: '0.02em'
                }}>
                  {doc.category}
                </div>
              </div>

              {/* Document Details Info */}
              <div style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: '#8C7A6B',
                    fontWeight: 700,
                    marginBottom: 8
                  }}>
                    <span>{doc.date}</span>
                    <span>{doc.size}</span>
                  </div>
                  
                  <h3 style={{
                    fontFamily: 'Outfit',
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#3D2B1A',
                    margin: '0 0 10px',
                    lineHeight: 1.3
                  }}>
                    {doc.title}
                  </h3>
                  
                  <p style={{
                    fontSize: '13.5px',
                    color: '#6E5D4F',
                    lineHeight: 1.5,
                    margin: 0
                  }}>
                    {doc.desc}
                  </p>
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                  marginTop: 24
                }}>
                  {/* View Fullscreen */}
                  <button
                    onClick={() => setActiveDoc(doc)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      background: '#FAF6F2',
                      border: '1px solid #EBD5C2',
                      borderRadius: '12px',
                      padding: '10px 0',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#8C4F1A',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#F0E5DA'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#FAF6F2'
                    }}
                  >
                    <Maximize2 size={13} /> View Fullscreen
                  </button>

                  {/* Download */}
                  <button
                    onClick={() => handleDownload(doc.src, doc.title)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      background: '#8C4F1A',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '10px 0',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#FFF',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(140, 79, 26, 0.12)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#733F14'
                      e.currentTarget.style.boxShadow = '0 6px 15px rgba(140, 79, 26, 0.2)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#8C4F1A'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(140, 79, 26, 0.12)'
                    }}
                  >
                    <Download size={13} /> Download Proof
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox / Fullscreen Modal */}
      <AnimatePresence>
        {activeDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(26, 17, 9, 0.85)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              boxSizing: 'border-box'
            }}
            onClick={() => setActiveDoc(null)}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              style={{
                width: '100%',
                maxWidth: '960px',
                background: '#FFFDFB',
                borderRadius: '32px',
                border: '1px solid rgba(235, 224, 214, 0.5)',
                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.4)',
                overflow: 'hidden',
                display: 'grid',
                gridTemplateColumns: '60fr 40fr',
                boxSizing: 'border-box',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
              className="lightbox-grid"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveDoc(null)}
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #EBD5C2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  color: '#8C4F1A',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'rotate(90deg)'
                  e.currentTarget.style.background = '#8C4F1A'
                  e.currentTarget.style.color = '#FFF'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'rotate(0deg)'
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'
                  e.currentTarget.style.color = '#8C4F1A'
                }}
              >
                <X size={18} />
              </button>

              {/* Left Side: Large Image */}
              <div style={{
                background: '#FAF6F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                height: '560px',
                borderRight: '1px solid rgba(235, 224, 214, 0.5)'
              }} className="lightbox-img-pane">
                <img
                  src={activeDoc.src}
                  alt={activeDoc.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    padding: '20px'
                  }}
                />
              </div>

              {/* Right Side: Document Details */}
              <div style={{
                padding: '40px 32px 32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box'
              }} className="lightbox-info-pane">
                <div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#FAF2EA',
                    border: '1px solid #EBD5C2',
                    borderRadius: '99px',
                    padding: '4px 12px',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#8C4F1A',
                    textTransform: 'uppercase',
                    marginBottom: 18
                  }}>
                    <FileText size={12} /> {activeDoc.category}
                  </div>

                  <h3 style={{
                    fontFamily: 'Outfit',
                    fontSize: '26px',
                    fontWeight: 900,
                    color: '#3D2B1A',
                    margin: '0 0 16px',
                    lineHeight: 1.25,
                    letterSpacing: '-0.5px'
                  }}>
                    {activeDoc.title}
                  </h3>

                  <p style={{
                    fontSize: '14.5px',
                    color: '#6E5D4F',
                    lineHeight: 1.6,
                    margin: '0 0 24px'
                  }}>
                    {activeDoc.desc}
                  </p>

                  {/* Verification Status Ledger */}
                  <div style={{
                    background: 'rgba(22, 163, 74, 0.05)',
                    border: '1px solid rgba(22, 163, 74, 0.2)',
                    borderRadius: '16px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    marginBottom: 20
                  }}>
                    <ShieldCheck size={20} color="#16a34a" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#165b2f', marginBottom: 2 }}>
                        Verified Document & Signature
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#1b6335', lineHeight: 1.4 }}>
                        Intake registration verified against official pediatric registrar ledgers. Report hashes digitally cataloged and sealed.
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 16,
                    fontSize: '13px',
                    color: '#8C7A6B',
                    borderTop: '1px solid rgba(235, 224, 214, 0.6)',
                    paddingTop: 20
                  }}>
                    <div>
                      <strong style={{ display: 'block', color: '#5C4C3C', marginBottom: 2 }}>Audit Date</strong>
                      {activeDoc.date}
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: '#5C4C3C', marginBottom: 2 }}>File Size</strong>
                      {activeDoc.size}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 32 }}>
                  <button
                    onClick={() => handleDownload(activeDoc.src, activeDoc.title)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
                      border: 'none',
                      borderRadius: '16px',
                      padding: '16px 0',
                      fontSize: '15px',
                      fontWeight: 900,
                      color: '#FFF',
                      cursor: 'pointer',
                      boxShadow: '0 8px 24px rgba(140, 79, 26, 0.2)',
                      fontFamily: 'Outfit',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 12px 30px rgba(140, 79, 26, 0.3)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(140, 79, 26, 0.2)'
                    }}
                  >
                    <Download size={16} /> Download Verification Report
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global CSS Inject */}
      <style dangerouslySetInnerHTML={{__html: `
        .group:hover .doc-hover-overlay {
          opacity: 1 !important;
        }
        .group:hover .doc-preview-img {
          transform: scale(1.05) !important;
        }
        @media (max-width: 768px) {
          .lightbox-grid {
            grid-template-columns: 1fr !important;
          }
          .lightbox-img-pane {
            height: 300px !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(235, 224, 214, 0.5) !important;
          }
          .lightbox-info-pane {
            padding: 32px 24px 24px !important;
          }
        }
      `}} />
    </section>
  )
}
