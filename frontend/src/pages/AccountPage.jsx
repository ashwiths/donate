import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, Sparkles, User, Award, Shield, FileText, 
  Download, Clock, Calendar, CheckCircle2, 
  Gamepad2, Gift, Quote, MessageCircle, ChevronDown, Activity, Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../hooks/useUserData';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSkeleton from '../components/LoadingSkeleton';

// Ambient floating particles (optimized for performance)
const Particles = () => (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: Math.random() * 1000, x: Math.random() * 1000, scale: Math.random() * 0.5 + 0.5 }}
        animate={{ opacity: [0, 0.3, 0], y: [null, Math.random() * -300], x: [null, Math.random() * 100 - 50] }}
        transition={{ duration: Math.random() * 15 + 15, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute', width: '4px', height: '4px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #C8773A, #8B5E34)', filter: 'blur(2px)', willChange: 'transform, opacity'
        }}
      />
    ))}
  </div>
);

const StatRing = ({ value, total, color }) => {
  const percentage = total > 0 ? Math.min((value / total) * 100, 100) : 0;
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="30" cy="30" r={radius} fill="none" stroke="rgba(139, 94, 52, 0.1)" strokeWidth="4" />
        <motion.circle
          cx="30" cy="30" r={radius || 24} fill="none" stroke={color || '#8B5E34'} strokeWidth="4"
          strokeLinecap="round" strokeDasharray={circumference || 150}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <span style={{ position: 'absolute', fontSize: '14px', fontWeight: 900, color: '#3D2B1A', fontFamily: 'Outfit' }}>
        {value}
      </span>
    </div>
  );
};

export default function AccountPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userData, contributions, certificates, activities, loading } = useUserData();
  
  const [supportForm, setSupportForm] = useState({ 
    name: userData?.name || user?.name || '', 
    email: userData?.email || user?.email || '', 
    issue: '', 
    message: '' 
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Update form placeholders when real data arrives
  useEffect(() => {
    if (userData) {
      setSupportForm(prev => ({
        ...prev,
        name: userData.name || prev.name,
        email: userData.email || prev.email
      }));
    }
  }, [userData]);

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    alert('Support request submitted securely. Our team will contact you shortly.');
    setSupportForm({ ...supportForm, issue: '', message: '' });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent' }}>
      <Particles />
      <Navbar />

      {/* Hero Section */}
      <header style={{ 
        maxWidth: 1200, margin: '60px auto 0', padding: '0 24px', textAlign: 'center', boxSizing: 'border-box', position: 'relative', zIndex: 1
      }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(139, 94, 52, 0.05)',
            border: '1px solid rgba(139, 94, 52, 0.15)', borderRadius: '99px', padding: '6px 20px', marginBottom: '20px'
          }}
        >
          <User size={13} color="#8B5E34" />
          <span style={{ fontSize: '11px', fontWeight: 900, color: '#8B5E34', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Personal Healing Account
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="premium-title-lg"
        >
          Your Healing Journey Dashboard 🤎
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          style={{ margin: '0 auto 60px', maxWidth: 620, fontSize: '16.5px', color: '#7A6A58', fontWeight: 500, lineHeight: 1.7 }}
        >
          Track your contributions, unlocked experiences, healing certificates, and support activity.
        </motion.p>
      </header>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <main style={{ maxWidth: 1280, width: '100%', margin: '0 auto', padding: '0 24px 100px', boxSizing: 'border-box', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '60px' }}>
          
          {/* Top Grid: Profile & Analytics / Quote */}
          <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            
            {/* Section 1: Profile Overview */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              style={{
                background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(235, 224, 214, 0.9)', borderRadius: '32px', padding: '40px',
                boxShadow: '0 20px 50px rgba(139, 94, 52, 0.04)', position: 'relative', overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, #8C4F1A, #C8773A)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                {userData?.profilePhoto || user?.photoURL ? (
                  <img 
                    src={userData?.profilePhoto || user?.photoURL} 
                    alt="Profile" 
                    style={{
                      width: 80, height: 80, borderRadius: '50%', border: '3px solid #FFF',
                      boxShadow: '0 8px 24px rgba(139, 94, 52, 0.15)', objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #FAF2EA, #EBD5C2)',
                    border: '3px solid #FFF', boxShadow: '0 8px 24px rgba(139, 94, 52, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '32px', fontWeight: 900, color: '#8C4F1A', fontFamily: 'Outfit'
                  }}>
                    {(userData?.name || user?.name || 'V')[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 900, color: '#3D2B1A', fontFamily: 'Outfit', letterSpacing: '-0.5px' }}>
                    {userData?.name || user?.name || 'Helper Account'}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', color: '#7A6A58', fontWeight: 600, marginBottom: '8px' }}>
                    <User size={14} /> {userData?.email || user?.email || 'verified.supporter@email.com'}
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#DCFCE7', color: '#166534', padding: '4px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <Shield size={12} /> Verified Healing Contributor
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, background: '#FAF6F2', padding: '20px', borderRadius: '20px', border: '1px solid rgba(235, 224, 214, 0.5)' }}>
                  <span style={{ fontSize: '11px', color: '#8B5E34', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Support</span>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#3D2B1A', fontFamily: 'Outfit', marginTop: '4px' }}>₹{userData?.totalSupport || 0}</div>
                </div>
                <div style={{ flex: 1, background: '#FAF6F2', padding: '20px', borderRadius: '20px', border: '1px solid rgba(235, 224, 214, 0.5)' }}>
                  <span style={{ fontSize: '11px', color: '#8B5E34', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Contributions</span>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#3D2B1A', fontFamily: 'Outfit', marginTop: '4px' }}>{userData?.contributions || 0}</div>
                </div>
              </div>
            </motion.section>

            {/* Bonus: Emotional Quote & Analytics Widget */}
            <motion.div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)', borderRadius: '32px', padding: '40px', color: '#FFF', position: 'relative', overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(92, 45, 14, 0.15)'
              }}>
                <Quote size={40} color="rgba(255,255,255,0.1)" style={{ position: 'absolute', top: 20, left: 20 }} />
                <p style={{ margin: 0, fontSize: '20px', fontStyle: 'italic', fontFamily: 'Georgia, serif', lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
                  “Small kindness can become someone’s second chance at life. Thank you for being a part of their healing.”
                </p>
                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#EBD5C2' }}>
                  <Heart size={14} fill="#EBD5C2" /> Heal & Play Community
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(235, 224, 214, 0.9)', borderRadius: '32px', padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                 <div>
                   <span style={{ fontSize: '11px', color: '#8B5E34', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Children Helped</span>
                   <div style={{ fontSize: '32px', fontWeight: 900, color: '#3D2B1A', fontFamily: 'Outfit', marginTop: '4px', display: 'flex', alignItems: 'center', gap: 10 }}>
                     {userData?.childrenHelped || 0} <Heart size={20} fill="#EF4444" color="#EF4444" />
                   </div>
                 </div>
                 <div>
                   <span style={{ fontSize: '11px', color: '#8B5E34', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Healing Streak</span>
                   <div style={{ fontSize: '32px', fontWeight: 900, color: '#3D2B1A', fontFamily: 'Outfit', marginTop: '4px', display: 'flex', alignItems: 'center', gap: 10 }}>
                     {userData?.healingStreak || '0 Days'} <Activity size={20} color="#C8773A" />
                   </div>
                 </div>
              </div>
            </motion.div>
          </div>

          {/* Section 4: Unlocked Experiences Stats */}
          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '24px' }}>
              <Sparkles size={20} color="#8C4F1A" />
              <h3 className="premium-title-sm" style={{ margin: 0 }}>Unlocked Experiences</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              {[
                { label: 'Games Unlocked', val: userData?.unlockedGames || 0, total: 10, icon: Gamepad2, color: '#3B82F6' },
                { label: 'Coupons Claimed', val: userData?.couponsClaimed || 0, total: 5, icon: Gift, color: '#EAB308' },
                { label: 'Quotes Opened', val: userData?.quotesOpened || 0, total: 20, icon: Quote, color: '#8B5CF6' },
                { label: 'Healing Supports', val: userData?.healingSupports || 0, total: 10, icon: Heart, color: '#EF4444' }
              ].map((stat, i) => (
                <motion.div key={i} whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(139, 94, 52, 0.08)' }} style={{ background: '#FFFDFB', border: '1px solid rgba(235, 224, 214, 0.8)', borderRadius: '24px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <stat.icon size={16} color={stat.color} />
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#5C4C3C' }}>{stat.label}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#8B5E34', fontWeight: 700, textTransform: 'uppercase' }}>Milestone Progress</span>
                  </div>
                  <StatRing value={stat.val} total={stat.total} color={stat.color} />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Middle Grid: Certificates & Contributions */}
          <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
            
            {/* Section 2: My Certificates */}
            <motion.section initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '24px' }}>
                <Award size={20} color="#8C4F1A" />
                <h3 className="premium-title-sm" style={{ margin: 0 }}>My Healing Certificates</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {certificates.length === 0 ? (
                  <div style={{ background: '#FFFDFB', border: '1px solid #EBD5C2', borderRadius: '24px', padding: '32px', textAlign: 'center', color: '#7A6A58', fontWeight: 500, fontSize: '14px', lineHeight: 1.6 }}>
                    <Award size={36} color="#D4AF37" style={{ marginBottom: 12, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
                    No certificates generated yet. Complete a contribution to unlock your first verified healing certificate! 🤍
                  </div>
                ) : (
                  certificates.map((cert) => (
                    <div key={cert.id} style={{ background: '#FFFDFB', border: '1px solid #EBD5C2', borderRadius: '24px', padding: '24px', position: 'relative', overflow: 'hidden', display: 'flex', gap: '24px', boxShadow: '0 8px 24px rgba(139, 94, 52, 0.03)' }}>
                      <div style={{ width: 80, height: 110, background: 'linear-gradient(135deg, #FFF9F3, #F5E6D3)', border: '2px solid #D4AF37', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)' }}>
                        <Heart size={20} color="#8C4F1A" style={{ marginBottom: 4 }} />
                        <span style={{ fontSize: '6px', color: '#8C4F1A', fontWeight: 800, textTransform: 'uppercase' }}>Official Certificate</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                        <div style={{ display: 'inline-block', background: '#FEF3C7', color: '#92400E', padding: '4px 10px', borderRadius: '99px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px', alignSelf: 'flex-start' }}>
                          Verified Healing
                        </div>
                        <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 800, color: '#3D2B1A' }}>₹{cert.amount} Contribution</h4>
                        <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#7A6A58', fontWeight: 600 }}>{cert.childName} • {formatDate(cert.createdAt)}</p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button style={{ flex: 1, padding: '8px', background: '#8C4F1A', color: '#FFF', border: 'none', borderRadius: '99px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                            <Download size={14} /> Download
                          </button>
                          <button style={{ flex: 1, padding: '8px', background: 'transparent', color: '#8C4F1A', border: '1px solid #8C4F1A', borderRadius: '99px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.section>

            {/* Section 3: My Contributions */}
            <motion.section initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '24px' }}>
                <Clock size={20} color="#8C4F1A" />
                <h3 className="premium-title-sm" style={{ margin: 0 }}>Contribution History</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {contributions.length === 0 ? (
                  <div style={{ background: '#FFFDFB', border: '1px solid rgba(235, 224, 214, 0.8)', borderRadius: '20px', padding: '32px', textAlign: 'center', color: '#7A6A58', fontWeight: 500 }}>
                    No contributions made yet.
                  </div>
                ) : (
                  contributions.map((tx) => (
                    <div key={tx.id} style={{ background: '#FFFDFB', border: '1px solid rgba(235, 224, 214, 0.8)', borderRadius: '20px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 16px rgba(139, 94, 52, 0.02)' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '6px' }}>
                          <span style={{ fontSize: '16px', fontWeight: 900, color: '#3D2B1A' }}>₹{tx.amount}</span>
                          <span style={{ background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '99px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>
                            <CheckCircle2 size={10} style={{ display: 'inline', marginRight: 2 }} /> {tx.status || 'Success'}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#5C4C3C', fontWeight: 700, marginBottom: '4px' }}>Healing Support for {tx.childName}</div>
                        <div style={{ fontSize: '11px', color: '#8B5E34', fontWeight: 600 }}>Direct Hospital Ledger • ID: {tx.id.slice(-8)}</div>
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#7A6A58', fontWeight: 600, textAlign: 'right' }}>
                        {formatDateTime(tx.createdAt)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.section>
          </div>

          {/* Bottom Grid: Support Center & Timeline */}
          <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
            
            {/* Section 5: Help & Support Center */}
            <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '16px' }}>
                <MessageCircle size={20} color="#8C4F1A" />
                <h3 className="premium-title-sm" style={{ margin: 0 }}>Need Help?</h3>
              </div>
              <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#7A6A58', fontWeight: 500, lineHeight: 1.5 }}>
                Our support system is here to help you quickly and transparently.
              </p>
              <form onSubmit={handleSupportSubmit} style={{ background: '#FFFDFB', border: '1px solid rgba(235, 224, 214, 0.8)', borderRadius: '24px', padding: '32px', boxShadow: '0 12px 30px rgba(139, 94, 52, 0.04)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <input type="text" placeholder="Your Name" value={supportForm.name} onChange={e => setSupportForm({...supportForm, name: e.target.value})} required style={{ flex: 1, padding: '14px 16px', borderRadius: '12px', border: '1px solid #EBD5C2', background: '#FAF6F2', outline: 'none', color: '#3D2B1A', fontSize: '14px', fontWeight: 500 }} />
                    <input type="email" placeholder="Email Address" value={supportForm.email} onChange={e => setSupportForm({...supportForm, email: e.target.value})} required style={{ flex: 1, padding: '14px 16px', borderRadius: '12px', border: '1px solid #EBD5C2', background: '#FAF6F2', outline: 'none', color: '#3D2B1A', fontSize: '14px', fontWeight: 500 }} />
                  </div>
                  
                  <div style={{ position: 'relative' }}>
                    <select value={supportForm.issue} onChange={e => setSupportForm({...supportForm, issue: e.target.value})} required style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #EBD5C2', background: '#FAF6F2', outline: 'none', color: '#3D2B1A', fontSize: '14px', fontWeight: 500, appearance: 'none' }}>
                      <option value="" disabled>Select Support Issue</option>
                      <option value="Payment not credited">Payment not credited</option>
                      <option value="Contribution failed">Contribution failed</option>
                      <option value="Razorpay payment error">Razorpay payment error</option>
                      <option value="Certificate not downloading">Certificate not downloading</option>
                      <option value="Unlock not received">Unlock not received</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown size={16} color="#8B5E34" style={{ position: 'absolute', right: 16, top: 16, pointerEvents: 'none' }} />
                  </div>

                  <textarea placeholder="Describe your issue in detail..." value={supportForm.message} onChange={e => setSupportForm({...supportForm, message: e.target.value})} required rows={4} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #EBD5C2', background: '#FAF6F2', outline: 'none', color: '#3D2B1A', fontSize: '14px', fontWeight: 500, resize: 'none', boxSizing: 'border-box' }} />

                  <motion.button whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(140, 79, 26, 0.25)' }} whileTap={{ scale: 0.98 }} type="submit" style={{ padding: '16px', background: 'linear-gradient(135deg, #8C4F1A, #C8773A)', border: 'none', borderRadius: '99px', color: '#FFF', fontSize: '15px', fontWeight: 800, fontFamily: 'Outfit', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s ease' }}>
                    <Send size={16} /> Send Secure Message
                  </motion.button>
                </div>
              </form>
            </motion.section>

            {/* Bonus: Activity Timeline */}
            <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '24px' }}>
                <Activity size={20} color="#8C4F1A" />
                <h3 className="premium-title-sm" style={{ margin: 0 }}>Recent Activity</h3>
              </div>
              <div style={{ background: '#FFFDFB', border: '1px solid rgba(235, 224, 214, 0.8)', borderRadius: '24px', padding: '32px', boxShadow: '0 12px 30px rgba(139, 94, 52, 0.04)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '15px', top: '10px', bottom: '10px', width: '2px', background: 'rgba(235, 224, 214, 0.8)', zIndex: 0 }} />
                  {activities.length === 0 ? (
                    <div style={{ color: '#7A6A58', fontWeight: 500, fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                      No recent activities recorded yet.
                    </div>
                  ) : (
                    activities.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FFF9F3', border: '2px solid #C8773A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#C8773A' }} />
                        </div>
                        <div style={{ paddingTop: '6px' }}>
                          <h4 style={{ margin: '0 0 4px', fontSize: '14.5px', fontWeight: 800, color: '#3D2B1A' }}>{item.text}</h4>
                          <p style={{ margin: 0, fontSize: '12px', color: '#8B5E34', fontWeight: 700 }}>{formatDate(item.createdAt)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.section>

          </div>
        </main>
      )}

      <Footer />
    </div>
  );
}
