import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Shield, ChevronRight, Star, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// A subtle background particles component for luxury feel (optimized)
const Particles = () => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            y: Math.random() * 1000,
            x: Math.random() * 1000,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{
            opacity: [0, 0.3, 0],
            y: [null, Math.random() * -300],
            x: [null, Math.random() * 100 - 50]
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #C8773A, #8B5E34)',
            filter: 'blur(2px)',
            willChange: 'transform, opacity'
          }}
        />
      ))}
    </div>
  );
};

export default function HealingStoriesPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const timelineSteps = [
    {
      title: "Diagnosis Confirmed",
      date: "Baby Aarav - 2 Months",
      desc: "Diagnosed with severe Biliary Atresia requiring emergent pediatric liver surgery preparation.",
      status: "completed"
    },
    {
      title: "Emergency Treatment Started",
      date: "Baby Aarav - 4 Months",
      desc: "ICU stabilization and baseline biliary drainage initiated at pediatric surgical ward.",
      status: "completed"
    },
    {
      title: "Community Contributions Activated",
      date: "Baby Aarav - 6 Months",
      desc: "Thousands of ₹10, ₹20 micro-donations securely routed through Heal & Play transparent ecosystem.",
      status: "completed"
    },
    {
      title: "Recovery Stabilized",
      date: "Baby Aarav - Today",
      desc: "Post-operative liver markers stabilized safely. Aarav is recovering happily under professional monitoring.",
      status: "active"
    }
  ];

  const floatingMessages = [
    { name: "Priyanshu S.", msg: "Seeing Aarav smile makes every game we play entirely worth it! ❤️", date: "2 hrs ago", avatar: "P" },
    { name: "Ananya D.", msg: "A beautiful proof that micro-donations are incredibly powerful.", date: "1 day ago", avatar: "A" },
    { name: "Vikram R.", msg: "Healing through play is the most honest, pure model. Keep going!", date: "3 days ago", avatar: "V" }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent' }}>
      <Particles />
      <Navbar />

      {/* Hero Section */}
      <header style={{ 
        maxWidth: 900, 
        margin: '60px auto 0', 
        padding: '0 24px', 
        textAlign: 'center',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 1
      }}>
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(139, 94, 52, 0.05)',
            border: '1px solid rgba(139, 94, 52, 0.15)',
            borderRadius: '99px',
            padding: '6px 20px',
            marginBottom: '16px',
            boxShadow: '0 4px 20px rgba(139, 94, 52, 0.05)'
          }}
        >
          <Sparkles size={13} color="#8B5E34" />
          <span style={{ fontSize: '11px', fontWeight: 900, color: '#8B5E34', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Real Healing Journeys
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          style={{
            fontFamily: 'Outfit',
            fontWeight: 900,
            fontSize: 'clamp(36px, 5vw, 60px)',
            color: '#3D2B1A',
            margin: '0 0 16px',
            letterSpacing: '-2px',
            lineHeight: 1.1,
            textShadow: '0 10px 30px rgba(139, 94, 52, 0.05)'
          }}
        >
          Healing Stories That{' '}
          <span style={{ background: 'linear-gradient(135deg, #8B5E34, #C8773A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Stay With You
          </span>
          <span style={{ display: 'inline-block', fontSize: '0.65em', verticalAlign: 'middle', marginLeft: '6px', filter: 'drop-shadow(0 0 8px rgba(225,29,72,0.3))' }}>❤️</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          style={{
            margin: '0 auto 40px',
            maxWidth: 600,
            fontSize: '16.5px',
            color: '#7A6A58',
            fontWeight: 500,
            lineHeight: 1.75
          }}
        >
          Every contribution becomes part of a child’s recovery journey. Read the stories made possible through collective kindness.
        </motion.p>
      </header>

      {/* Main Content Layout */}
      <main style={{ maxWidth: 1280, width: '100%', margin: '0 auto', padding: '0 24px 100px', boxSizing: 'border-box', position: 'relative', zIndex: 1 }}>
        
        {/* Cinematic Featured Story Card */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          whileHover={{ boxShadow: '0 30px 60px rgba(139, 94, 52, 0.08)' }}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: '0',
            background: 'rgba(255, 254, 252, 0.9)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(235, 224, 214, 0.9)',
            borderRadius: '32px',
            boxShadow: '0 20px 50px rgba(139, 94, 52, 0.04)',
            marginBottom: '100px',
            overflow: 'hidden',
            transition: 'all 0.5s ease'
          }}
        >
          {/* Left Column: Cinematic Imagery */}
          <div style={{ position: 'relative', overflow: 'hidden', minHeight: '500px' }}>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ width: '100%', height: '60%', position: 'absolute', top: 0 }}
            >
              <img src="/pediatric_hospital_care.png" alt="Hospital Care" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(61,43,26,0) 0%, rgba(61,43,26,0.4) 100%)' }} />
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ width: '100%', height: '40%', position: 'absolute', bottom: 0 }}
            >
              <img src="/parent_holding_infant_hand.png" alt="Holding Hand" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(61,43,26,0.2) 0%, transparent 100%)' }} />
            </motion.div>

            {/* Glowing Gradient Overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, rgba(139,94,52,0.1) 100%)', pointerEvents: 'none' }} />

            {/* Floating Indicators */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                position: 'absolute',
                top: 24,
                left: 24,
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(8px)',
                color: '#166534',
                padding: '8px 16px',
                borderRadius: '99px',
                fontSize: '11.5px',
                fontWeight: 900,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#166534', boxShadow: '0 0 8px #166534' }} />
                85% Recovery Progress
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              style={{
                position: 'absolute',
                bottom: 24,
                right: 24,
                background: 'rgba(61,43,26,0.85)',
                backdropFilter: 'blur(8px)',
                color: '#FDE68A',
                padding: '8px 16px',
                borderRadius: '99px',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
              }}>
                Community Support Active
            </motion.div>
          </div>

          {/* Right Column: Emotional Story Details */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '56px' }}>
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: '32px', fontWeight: 900, color: '#3D2B1A', fontFamily: 'Outfit', letterSpacing: '-1px' }}>
                  Aarav Mehta
                </span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#8B5E34', background: 'rgba(139, 94, 52, 0.08)', padding: '6px 14px', borderRadius: '12px' }}>
                  8 Months Old
                </span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#166534', background: '#DCFCE7', padding: '6px 14px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Shield size={13} /> Verified Pediatric Monitoring
                </span>
              </div>

              <div style={{ 
                fontSize: '12px', 
                fontWeight: 800, 
                color: '#8C4F1A', 
                textTransform: 'uppercase', 
                letterSpacing: '0.08em', 
                marginBottom: 24 
              }}>
                Condition: Biliary Atresia (Liver Disease)
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontSize: '16.5px', color: '#6A5C4F', lineHeight: 1.8, fontWeight: 500 }}>
                <p>
                  Aarav was born with a rare liver condition that rapidly worsened during his first months of life. His parents struggled emotionally and financially as treatment costs increased every week.
                </p>
                <p>
                  Through thousands of small micro-contributions made via Heal & Play, Aarav’s treatment milestones began getting funded gradually. What started as ₹10 support entries from strangers became a meaningful network of healing support.
                </p>
                <p>
                  His surgery preparation, medication monitoring, and pediatric recovery assistance were partially sustained through the collective support ecosystem. Today, Aarav is recovering safely under continued hospital supervision.
                </p>
              </div>

              {/* Upgraded Parents Gratitude Quote */}
              <motion.div 
                whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(139, 94, 52, 0.08)' }}
                style={{ 
                  marginTop: 40, 
                  padding: '32px', 
                  background: 'rgba(255, 255, 255, 0.9)', 
                  border: '1px solid rgba(235, 224, 214, 0.8)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 24px rgba(139, 94, 52, 0.03)',
                  position: 'relative',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ position: 'absolute', top: -14, left: 32, background: '#FFF9F3', borderRadius: '50%', padding: '6px', border: '1px solid #EBD5C2', boxShadow: '0 4px 12px rgba(200,119,58,0.2)' }}>
                  <Quote size={16} color="#C8773A" />
                </div>
                <p style={{ margin: 0, fontSize: '16.5px', fontStyle: 'italic', fontFamily: 'Georgia, serif', color: '#4A3427', lineHeight: 1.6 }}>
                  “Even the smallest support gave us strength during the hardest nights. We will always remember the hands that helped save Aarav.”
                </p>
                <span style={{ display: 'block', marginTop: 16, fontSize: '11.5px', fontWeight: 800, color: '#8B5E34', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  — Aarav's Parents
                </span>
              </motion.div>
            </div>

            {/* Micro Funding Tracker */}
            <div style={{ marginTop: 48, borderTop: '1px solid rgba(235, 224, 214, 0.6)', paddingTop: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13.5, color: '#7A6A58', fontWeight: 800, letterSpacing: '0.02em', textTransform: 'uppercase' }}>Treatment Funding Progress</span>
                <span style={{ fontSize: 16, color: '#166534', fontWeight: 900, fontFamily: 'Outfit' }}>94% Funded</span>
              </div>
              <div style={{ height: 12, background: 'rgba(232, 224, 214, 0.8)', borderRadius: 99, overflow: 'hidden', marginBottom: 16, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '94%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, #166534, #22C55E)', borderRadius: 99, boxShadow: '0 0 10px rgba(34,197,94,0.5)' }} 
                />
              </div>
              <div style={{ fontSize: '12.5px', color: '#7C6B5B', fontWeight: 600 }}>
                ₹2,82,000 raised through 28,200 micro-support game transactions.
              </div>
            </div>
          </div>
        </motion.section>

        {/* Premium Timeline Section */}
        <section style={{ marginBottom: 100 }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ fontSize: '12px', fontWeight: 900, color: '#8B5E34', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Chronological Milestones
            </span>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 'clamp(32px, 5vw, 42px)', color: '#3D2B1A', margin: '8px 0 0', letterSpacing: '-1.5px' }}>
              Aarav's Treatment Timeline
            </h2>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
            gap: 32,
            position: 'relative'
          }}>
            {timelineSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(139, 94, 52, 0.06)' }}
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(220, 208, 195, 0.8)',
                  borderRadius: '28px',
                  padding: '32px',
                  boxShadow: '0 8px 24px rgba(139, 94, 52, 0.03)',
                  position: 'relative',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Connecting Line between timeline steps */}
                {idx < timelineSteps.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    right: '-24px',
                    top: '48px',
                    width: '24px',
                    height: '2px',
                    background: 'rgba(220, 208, 195, 0.8)',
                    zIndex: 0
                  }} className="hidden lg:block" />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: step.status === 'active' ? '#166534' : '#C8773A',
                    boxShadow: step.status === 'active' ? '0 0 12px #166534' : '0 0 12px #C8773A'
                  }} />
                  <span style={{ fontSize: '11.5px', fontWeight: 900, color: '#8B5E34', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {step.date}
                  </span>
                </div>

                <h4 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: 900, color: '#3D2B1A', fontFamily: 'Outfit' }}>
                  {step.title}
                </h4>
                <p style={{ margin: 0, fontSize: '14.5px', color: '#6A5C4F', lineHeight: 1.6, fontWeight: 500 }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Supporters Messages Section */}
        <section style={{ marginBottom: 120 }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ fontSize: '12px', fontWeight: 900, color: '#8B5E34', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Messages From Supporters
            </span>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 'clamp(32px, 5vw, 42px)', color: '#3D2B1A', margin: '8px 0 0', letterSpacing: '-1.5px' }}>
              Encouragement Ledger ✨
            </h2>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
            gap: 32 
          }}>
            {floatingMessages.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(139, 94, 52, 0.08)', borderColor: '#C8773A' }}
                style={{
                  background: 'rgba(255, 253, 250, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(235, 224, 214, 0.8)',
                  borderRadius: '24px',
                  padding: '32px',
                  display: 'flex',
                  gap: 20,
                  transition: 'all 0.4s ease'
                }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FAF2EA, #EBD5C2)',
                  border: '2px solid #FFF',
                  boxShadow: '0 4px 12px rgba(139,94,52,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  color: '#8C4F1A',
                  fontSize: '18px',
                  fontFamily: 'Outfit',
                  flexShrink: 0
                }}>
                  {item.avatar}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: '15px', fontWeight: 900, color: '#3D2B1A', fontFamily: 'Outfit' }}>{item.name}</span>
                      <span style={{ fontSize: '12px', color: '#8B5E34', fontWeight: 700 }}>{item.date}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '14.5px', color: '#5C4C3C', lineHeight: 1.6, fontWeight: 500 }}>
                      {item.msg}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16 }}>
                    <Star size={12} fill="#D4AF37" color="#D4AF37" />
                    <span style={{ fontSize: '10.5px', fontWeight: 900, color: '#D4AF37', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Verified Healing Entry
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Continue Supporting CTA */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ 
            background: 'linear-gradient(135deg, #FFF9F3 0%, #FAF0E6 100%)',
            border: '1px solid rgba(232, 224, 214, 0.9)',
            borderRadius: '40px',
            padding: '72px 40px',
            textAlign: 'center',
            boxShadow: '0 24px 60px rgba(139, 94, 52, 0.05)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(22, 101, 52, 0.06)',
              border: '1px solid rgba(22, 101, 52, 0.12)',
              borderRadius: '99px',
              padding: '8px 20px',
              marginBottom: '24px'
            }}>
              <Heart size={14} fill="#166534" color="#166534" />
              <span style={{ fontSize: '12px', fontWeight: 900, color: '#166534', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Join Another Active Journey
              </span>
            </div>

            <h2 style={{
              fontFamily: 'Outfit',
              fontWeight: 900,
              fontSize: 'clamp(36px, 5.5vw, 56px)',
              color: '#3D2B1A',
              margin: '0 0 16px',
              letterSpacing: '-2px',
              lineHeight: 1.1
            }}>
              Support Another{' '}
              <span style={{ background: 'linear-gradient(135deg, #8B5E34, #C8773A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Healing Journey 🤍
              </span>
            </h2>

            <p style={{
              margin: '0 auto 40px',
              maxWidth: 600,
              fontSize: '17px',
              color: '#7A6A58',
              lineHeight: 1.7,
              fontWeight: 500
            }}>
              Play immersive games, unlock brand partner rewards, or contribute directly to ensure pediatric medical bills get cleared at the hospital desk in real-time.
            </p>

            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 16px 40px rgba(140, 79, 26, 0.3)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/main')}
              style={{
                background: 'linear-gradient(135deg, #8C4F1A, #C8773A)',
                border: 'none',
                color: '#FFFFFF',
                padding: '20px 48px',
                borderRadius: '99px',
                fontSize: '16px',
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: 'Outfit',
                boxShadow: '0 10px 30px rgba(140, 79, 26, 0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                transition: 'all 0.3s ease'
              }}
            >
              <span>Support Another Healing Journey</span>
              <ChevronRight size={18} />
            </motion.button>
          </div>

          {/* Ambient styling circles */}
          <div style={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 94, 52, 0.04) 0%, transparent 70%)',
            zIndex: 1
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 94, 52, 0.04) 0%, transparent 70%)',
            zIndex: 1
          }} />
        </motion.section>

      </main>

      <Footer />
    </div>
  );
}
