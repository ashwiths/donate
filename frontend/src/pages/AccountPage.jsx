import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Sparkles, User, Award, Shield, FileText, 
  Download, Clock, Calendar, CheckCircle2, 
  Gamepad2, Gift, Quote, MessageCircle, ChevronDown, Activity, Send, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../hooks/useUserData';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { addSupportTicket } from '../services/userService';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { getSupporterDisplayName } from '../utils/nameHelper';

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
  const [selectedCert, setSelectedCert] = useState(null);
  const [unlockedMessages, setUnlockedMessages] = useState([]);
  const [loadingMessageId, setLoadingMessageId] = useState(null);

  // Prefetch RevealMessagePage components while idle
  useEffect(() => {
    const timer = setTimeout(() => {
      import('./RevealMessagePage').catch(() => {});
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, 'healingMessageUnlocks'),
      where('userId', '==', user.uid)
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      const list = [];
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      // Sort in memory to avoid Firestore index requirement
      list.sort((a, b) => {
        const timeA = a.unlockedAt?.seconds ? a.unlockedAt.seconds : (a.unlockedAt ? new Date(a.unlockedAt).getTime() : 0);
        const timeB = b.unlockedAt?.seconds ? b.unlockedAt.seconds : (b.unlockedAt ? new Date(b.unlockedAt).getTime() : 0);
        return timeB - timeA;
      });
      setUnlockedMessages(list);
    }, (err) => {
      console.error("Error fetching healingMessageUnlocks in AccountPage:", err);
    });
    return () => unsubscribe();
  }, [user]);

  const handleDownloadCert = (cert) => {
    const safeName = getSupporterDisplayName(user, cert.supporterName || localStorage.getItem('hp_supporter_name') || localStorage.getItem('hp_user_name'));
    const parts = (cert.title || 'Certificate of Healing Support').split(/\s*[-–]\s*/);
    const titleLine1 = parts[0];
    const titleLine2 = parts.slice(1).join(' - ');
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to download your certificate.");
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>Healing Certificate - ₹${cert.amount}</title>
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;700;900&family=Great+Vibes&family=Playball&family=Pinyon+Script&display=swap" rel="stylesheet">
          <style>
            body {
              background: #FAF8F5;
              font-family: 'Outfit', sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
              box-sizing: border-box;
            }
            .certificate-container {
              background: #FFFDFB;
              border: 12px double #D4AF37;
              border-radius: 24px;
              padding: 70px 60px 60px;
              max-width: 840px;
              width: 100%;
              text-align: center;
              box-shadow: 0 24px 60px rgba(139, 94, 52, 0.12);
              position: relative;
              box-sizing: border-box;
              overflow: hidden;
            }
            .certificate-container::before {
              content: '';
              position: absolute;
              inset: 6px;
              border: 2px solid #D4AF37;
              border-radius: 18px;
              pointer-events: none;
            }
            .watermark {
              position: absolute;
              inset: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              opacity: 0.025;
              pointer-events: none;
              z-index: 0;
            }
            .header-institution {
              font-size: 11px;
              font-weight: 900;
              color: #8C745C;
              text-transform: uppercase;
              letter-spacing: 0.35em;
              margin-bottom: 24px;
              position: relative;
              z-index: 1;
            }
            .title-line1 {
              font-family: 'Georgia', serif;
              font-size: 32px;
              color: #3D2B1A;
              margin: 0 0 8px;
              font-weight: 700;
              position: relative;
              z-index: 1;
            }
            .title-line2 {
              font-family: 'Great Vibes', cursive;
              font-size: 42px;
              color: #C8773A;
              margin: 0 0 16px;
              position: relative;
              z-index: 1;
            }
            h2 {
              font-size: 14px;
              color: #7A6A58;
              text-transform: uppercase;
              letter-spacing: 0.25em;
              margin: 0 0 28px;
              font-weight: 700;
              position: relative;
              z-index: 1;
            }
            .presented-to {
              font-size: 13.5px;
              color: #8C745C;
              font-style: italic;
              margin-bottom: 6px;
              font-weight: 500;
              position: relative;
              z-index: 1;
            }
            .name {
              font-size: 34px;
              font-weight: 900;
              color: #3D2B1A;
              border-bottom: 2px solid #EBD5C2;
              display: inline-block;
              padding-bottom: 6px;
              margin-bottom: 24px;
              min-width: 320px;
              font-family: 'Outfit', sans-serif;
              position: relative;
              z-index: 1;
            }
            .description {
              font-size: 15.5px;
              line-height: 1.8;
              color: #5C4C3C;
              margin: 0 auto 36px;
              max-width: 620px;
              position: relative;
              z-index: 1;
              font-weight: 500;
            }
            .amount {
              font-weight: 900;
              color: #8C4F1A;
            }
            .footer-info {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              border-top: 1px solid rgba(235, 221, 206, 0.8);
              padding-top: 40px;
              position: relative;
              z-index: 1;
            }
            .signature-block {
              text-align: center;
              width: 220px;
              position: relative;
            }
            .signature-graphic-left {
              font-family: 'Pinyon Script', cursive;
              font-size: 36px;
              color: #1E3A8A;
              opacity: 0.8;
              margin-bottom: -4px;
              transform: rotate(-6deg) translateY(-12px);
            }
            .signature-graphic-right {
              font-family: 'Playball', cursive;
              font-size: 26px;
              color: #1E3A8A;
              opacity: 0.85;
              margin-bottom: -10px;
              transform: rotate(-3deg) translateY(-2px);
            }
            .signature-title {
              font-size: 11px;
              color: #8C745C;
              text-transform: uppercase;
              font-weight: 800;
              letter-spacing: 0.08em;
              margin-top: 6px;
            }
            .signature-line {
              width: 100%;
              height: 1.5px;
              background: linear-gradient(90deg, transparent, #D4AF37, transparent);
            }
            .seal-wrapper {
              position: relative;
              width: 110px;
              height: 110px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: -20px;
              flex-shrink: 0;
            }
            .seal-ribbon-left {
              position: absolute;
              width: 22px;
              height: 65px;
              background: linear-gradient(135deg, #B91C1C, #EF4444);
              top: 55px;
              left: 38px;
              transform: rotate(20deg);
              clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%);
              z-index: 1;
            }
            .seal-ribbon-right {
              position: absolute;
              width: 22px;
              height: 65px;
              background: linear-gradient(135deg, #991B1B, #DC2626);
              top: 55px;
              left: 50px;
              transform: rotate(-20deg);
              clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%);
              z-index: 1;
            }
            .seal-gold-disc {
              position: relative;
              width: 90px;
              height: 90px;
              background: radial-gradient(circle, #FDE68A 0%, #D4AF37 60%, #B45309 100%);
              border: 3px dashed #FFF;
              border-radius: 50%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              box-shadow: 0 10px 24px rgba(212, 175, 55, 0.45);
              transform: rotate(-5deg);
              z-index: 2;
            }
            .seal-text {
              font-size: 7.5px;
              font-weight: 900;
              color: #78350F;
              text-transform: uppercase;
              letter-spacing: 0.06em;
              text-align: center;
              line-height: 1.3;
              text-shadow: 1px 1px 0px rgba(255,255,255,0.2);
            }
            .seal-star {
              color: #78350F;
              font-size: 10px;
              margin-top: 2px;
            }
            .registry-no {
              font-size: 9.5px;
              color: #A18266;
              font-weight: 700;
              letter-spacing: 0.08em;
              margin-top: 40px;
              text-transform: uppercase;
              position: relative;
              z-index: 1;
            }
            @media print {
              body { background: white; }
              .certificate-container { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            <div class="watermark">
              <svg width="450" height="450" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 82C50 82 82 58 82 36C82 18 68 8 50 26C32 8 18 18 18 36C18 58 50 82 50 82Z" stroke="#D4AF37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="50" cy="42" r="8" stroke="#D4AF37" stroke-width="1"/>
              </svg>
            </div>

            <div class="header-institution">Pediatric Healthcare Transparency Alliance • Global Registry</div>
            
            <h1 class="title-line1">${titleLine1}</h1>
            ${titleLine2 ? `<div class="title-line2">${titleLine2}</div>` : ''}
            <h2>Heal & Play Ecosystem • ${cert.contributionType ? cert.contributionType.replace('_', ' ').toUpperCase() : 'HEALING SUPPORT'}</h2>
            
            <div class="presented-to">This official token of medical gratitude is proudly awarded to</div>
            <div class="name">${safeName}</div>
            
            <div class="description">
              In sincere recognition of their compassionate contribution of <span class="amount">₹${cert.amount}</span> supporting essential clinical pediatric care and specialized hospital treatment for <span class="amount">${cert.childName || 'Janamithra'}</span>. Your generous contribution has directly helped secure verified medical operations.
            </div>

            <div style="font-size: 13px; font-weight: bold; color: #8C745C; margin-top: 10px; margin-bottom: 20px;">
              Date of Contribution: ${cert.createdAt ? (cert.createdAt.toDate ? cert.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date(cert.createdAt.seconds ? cert.createdAt.seconds * 1000 : cert.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })) : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            
            <div class="footer-info">
              <div class="signature-block">
                <div class="signature-graphic-left">Dr. Rebecca Sterling</div>
                <div class="signature-line"></div>
                <div class="signature-title">Pediatric Care Director</div>
              </div>
              
              <div class="seal-wrapper">
                <div class="seal-ribbon-left"></div>
                <div class="seal-ribbon-right"></div>
                <div class="seal-gold-disc">
                  <div class="seal-text">OFFICIAL<br>VERIFIED<br>HEALING</div>
                  <div class="seal-star">★ ★ ★</div>
                </div>
              </div>
              
              <div class="signature-block">
                <div class="signature-graphic-right" style="font-family: 'Great Vibes', cursive; font-size: 34px; color: #1e3a8a; opacity: 0.9; margin-bottom: -4px; transform: rotate(-4deg) translateY(-15px);">Infant Ashil</div>
                <div class="signature-line"></div>
                <div class="signature-title">Founder • Heal & Play Ecosystem</div>
              </div>
            </div>

            <div class="registry-no">Verified Blockchain Registry No: H&P-REF-REG-${cert.id ? cert.id.toUpperCase().slice(-10) : 'N/A'}</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };
  
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

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    try {
      await addSupportTicket(user?.uid, supportForm);
      alert('Support request submitted securely to our team. Thank you!');
      setSupportForm({ ...supportForm, issue: '', message: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to submit support ticket. Please try again.');
    }
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
      <style>{`
        @keyframes accountInlineSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .account-inline-spinner {
          animation: accountInlineSpin 0.6s linear infinite;
          border: 2px solid rgba(255,255,255,0.3);
          border-top: 2px solid #fff;
          border-radius: 50%;
          display: inline-block;
        }
      `}</style>
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
        <main style={{ maxWidth: 1280, width: '100%', margin: '0 auto', padding: 'clamp(0px,2vw,0px) clamp(12px,3vw,24px) clamp(60px,8vw,100px)', boxSizing: 'border-box', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(32px,5vw,60px)' }}>
          
          {/* Top Grid: Profile & Analytics / Quote */}
          <div className="responsive-grid account-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 'clamp(16px,3vw,32px)' }}>
            
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
                    {getSupporterDisplayName(user, userData?.name)[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 900, color: '#3D2B1A', fontFamily: 'Outfit', letterSpacing: '-0.5px' }}>
                    {getSupporterDisplayName(user, userData?.name)}
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
                { label: 'Games Unlocked', val: Array.isArray(userData?.unlockedGames) ? userData.unlockedGames.length : 0, total: 10, icon: Gamepad2, color: '#3B82F6' },
                { label: 'Coupons Claimed', val: Array.isArray(userData?.unlockedCoupons) ? userData.unlockedCoupons.length : (userData?.couponsClaimed || 0), total: 5, icon: Gift, color: '#EAB308' },
                { label: 'Quotes Opened', val: userData?.quotesOpened || 0, total: 20, icon: Quote, color: '#8B5CF6' },
                { label: 'Healing Supports', val: userData?.healingSupports || 0, total: 10, icon: Heart, color: '#EF4444' }
              ].map((stat, i) => (
                <motion.div key={i} whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(139, 94, 52, 0.08)' }} style={{ background: '#FFFDFB', border: '1px solid rgba(235, 224, 214, 0.8)', borderRadius: '24px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <stat.icon size={16} color={stat.color} />
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#5C4C3C' }}>{stat.label}</span>
                    </div>

                  </div>
                  <StatRing value={stat.val} total={stat.total} color={stat.color} />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Game Unlock History Grid */}
          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '24px' }}>
              <Gamepad2 size={20} color="#8C4F1A" />
              <h3 className="premium-title-sm" style={{ margin: 0 }}>Unlocked Games History</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {!userData?.unlockedGameDetails || userData.unlockedGameDetails.length === 0 ? (
                <div style={{ background: '#FFFDFB', border: '1px solid rgba(235, 224, 214, 0.8)', borderRadius: '24px', padding: '32px', textAlign: 'center', color: '#7A6A58', fontWeight: 500, fontSize: '14px', gridColumn: '1 / -1' }}>
                  No games unlocked yet. Visit the Discovery Portal to start your journey! 🎮
                </div>
              ) : (
                [...userData.unlockedGameDetails].sort((a,b) => new Date(b.unlockedAt) - new Date(a.unlockedAt)).map((game, i) => (
                  <motion.div key={i} whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(139, 94, 52, 0.08)' }} style={{ background: '#FFFDFB', border: '1px solid rgba(235, 224, 214, 0.8)', borderRadius: '20px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s ease' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: 48, height: 48, background: game.type === 'free' ? 'linear-gradient(135deg, #F0F9FF, #E0F2FE)' : 'linear-gradient(135deg, #FFF9F3, #F5E6D3)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: game.type === 'free' ? '1px solid #BAE6FD' : '1px solid #EADFCF' }}>
                        <Gamepad2 size={24} color={game.type === 'free' ? '#0284C7' : '#8C4F1A'} />
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#3D2B1A', marginBottom: '4px' }}>{game.gameName}</div>
                        <div style={{ fontSize: '11px', color: '#8B5E34', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {game.type === 'free' ? 'Free Experience' : `₹${game.amount} Unlock`}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '11px', color: '#7A6A58', fontWeight: 600, textAlign: 'right' }}>
                      {new Date(game.unlockedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.section>

          {/* Claimed Coupons History Grid */}
          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '24px' }}>
              <Gift size={20} color="#8C4F1A" />
              <h3 className="premium-title-sm" style={{ margin: 0 }}>Claimed Coupons History</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {!userData?.unlockedCoupons || userData.unlockedCoupons.length === 0 ? (
                <div style={{ background: '#FFFDFB', border: '1px solid rgba(235, 224, 214, 0.8)', borderRadius: '24px', padding: '32px', textAlign: 'center', color: '#7A6A58', fontWeight: 500, fontSize: '14px', gridColumn: '1 / -1' }}>
                  No coupons claimed yet. Complete contributions to unlock sponsor rewards! 🎁
                </div>
              ) : (
                [...userData.unlockedCoupons].sort((a,b) => new Date(b.unlockedAt) - new Date(a.unlockedAt)).map((coupon, i) => (
                  <motion.div key={i} whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(139, 94, 52, 0.08)' }} style={{ background: '#FFFDFB', border: '1px solid rgba(235, 224, 214, 0.8)', borderRadius: '20px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s ease' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #FFF9F3, #F5E6D3)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #EADFCF' }}>
                        <Gift size={24} color="#8C4F1A" />
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#3D2B1A', marginBottom: '4px' }}>{coupon.brand} Coupon</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#8B5E34', letterSpacing: '1px' }}>{coupon.code}</div>
                        <div style={{ fontSize: '11px', color: '#8C745C', fontWeight: 600 }}>Unlocked for ₹{coupon.amount}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '11px', color: '#7A6A58', fontWeight: 600, textAlign: 'right' }}>
                      {new Date(coupon.unlockedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.section>

          {/* Unlocked Healing Messages History Grid */}
          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ marginBottom: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '24px' }}>
              <Quote size={20} color="#8C4F1A" />
              <h3 className="premium-title-sm" style={{ margin: 0 }}>Unlocked Healing Messages</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {unlockedMessages.length === 0 ? (
                <div style={{ background: '#FFFDFB', border: '1px solid rgba(235, 224, 214, 0.8)', borderRadius: '24px', padding: '32px', textAlign: 'center', color: '#7A6A58', fontWeight: 500, fontSize: '14px', gridColumn: '1 / -1' }}>
                  No healing messages unlocked yet. Visit the Discovery Portal to support a child's recovery! 🌸
                </div>
              ) : (
                unlockedMessages.map((msg, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={loadingMessageId === msg.messageId ? {} : { y: -4, boxShadow: '0 12px 30px rgba(139, 94, 52, 0.08)' }} 
                    style={{ 
                      background: '#FFFDFB', 
                      border: '1px solid rgba(235, 224, 214, 0.8)', 
                      borderRadius: '20px', 
                      padding: '20px', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      transition: 'transform 0.2s ease, opacity 0.2s ease',
                      opacity: loadingMessageId === msg.messageId ? 0.7 : 1,
                      transform: loadingMessageId === msg.messageId ? 'scale(0.98) translateZ(0)' : 'translateZ(0)',
                      willChange: 'transform, opacity'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, marginRight: 16, overflow: 'hidden' }}>
                      <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #FFF9F3, #F5E6D3)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #EADFCF', flexShrink: 0 }}>
                        <Quote size={22} color="#8C4F1A" />
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#3D2B1A', marginBottom: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{msg.title}</div>
                        <div style={{ fontSize: '12.5px', color: '#7A6A5A', fontWeight: 500, marginBottom: '2px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>Dedicated to: <strong>{msg.supporterName || 'Supporter'}</strong></div>
                        <div style={{ fontSize: '11px', color: '#8C745C', fontWeight: 600 }}>Unlocked for ₹{msg.amount}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
                      <div style={{ fontSize: '11px', color: '#7A6A58', fontWeight: 600 }}>
                        {msg.unlockedAt ? new Date(msg.unlockedAt.seconds ? msg.unlockedAt.seconds * 1000 : msg.unlockedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'}
                      </div>
                      <button
                        onClick={() => {
                          setLoadingMessageId(msg.messageId);
                          navigate(`/reveal-message/${msg.messageId}`);
                        }}
                        style={{
                          padding: '6px 12px',
                          background: 'linear-gradient(135deg, #8C4F1A, #C8773A)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(140, 79, 26, 0.15)',
                          transform: loadingMessageId === msg.messageId ? 'scale(0.95) translateZ(0)' : 'translateZ(0)',
                          transition: 'transform 0.1s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {loadingMessageId === msg.messageId ? (
                          <>
                            <span className="account-inline-spinner" style={{ width: 10, height: 10 }} />
                            <span>Loading...</span>
                          </>
                        ) : (
                          <span>View Message</span>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
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
                    <div key={cert.id} className="certificate-card">
                      <div style={{ width: 80, height: 110, background: 'linear-gradient(135deg, #FFF9F3, #F5E6D3)', border: '2px solid #D4AF37', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)' }}>
                        <Heart size={20} color="#8C4F1A" style={{ marginBottom: 4 }} />
                        <span style={{ fontSize: '6px', color: '#8C4F1A', fontWeight: 800, textTransform: 'uppercase' }}>Official Certificate</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, width: '100%' }}>
                        <div className="certificate-badge">
                          Verified Healing
                        </div>
                        <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 800, color: '#3D2B1A' }}>₹{cert.amount} Contribution</h4>
                        <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#7A6A58', fontWeight: 600 }}>{cert.childName} • {formatDate(cert.createdAt)}</p>
                        <div className="certificate-card-buttons">
                          <button onClick={() => handleDownloadCert(cert)} className="certificate-card-btn certificate-card-btn-primary">
                            <Download size={14} /> Download
                          </button>
                          <button onClick={() => setSelectedCert(cert)} className="certificate-card-btn certificate-card-btn-secondary">
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

      <AnimatePresence>
        {selectedCert && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              background: 'rgba(26, 17, 9, 0.40)', 
              backdropFilter: 'blur(8px)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              zIndex: 9999, 
              padding: '24px' 
            }}
            onClick={() => setSelectedCert(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              style={{ 
                background: '#FFFDFB', 
                border: '8px double #D4AF37', 
                borderRadius: '24px', 
                padding: '60px 40px 48px', 
                maxWidth: '680px', 
                width: '100%', 
                textAlign: 'center', 
                boxShadow: '0 30px 70px rgba(139, 94, 52, 0.25)', 
                position: 'relative',
                boxSizing: 'border-box',
                overflow: 'hidden'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Border decoration inset */}
              <div style={{ position: 'absolute', inset: 4, border: '1.5px solid #D4AF37', borderRadius: '18px', pointerEvents: 'none' }} />

              {/* Elegant watermark background */}
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.02,
                pointerEvents: 'none',
                zIndex: 0
              }}>
                <svg width="360" height="360" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 82C50 82 82 58 82 36C82 18 68 8 50 26C32 8 18 18 18 36C18 58 50 82 50 82Z" stroke="#D4AF37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="50" cy="42" r="8" stroke="#D4AF37" stroke-width="1"/>
                </svg>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setSelectedCert(null)} 
                style={{ 
                  position: 'absolute', 
                  top: 20, 
                  right: 20, 
                  background: 'rgba(139, 94, 52, 0.05)', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: 36, 
                  height: 36, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer',
                  color: '#8C4F1A',
                  zIndex: 10,
                  transition: 'all 0.2s ease'
                }}
              >
                <X size={18} />
              </button>

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '280px', gap: 16, position: 'relative', zIndex: 1 }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 36, height: 36 }}
                  >
                    <Award size={36} color="#D4AF37" />
                  </motion.div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#8B5E34', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                    Securing Cryptographic Certificate...
                  </span>
                </div>
              ) : (
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '9px', fontWeight: 900, color: '#8C745C', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '16px' }}>
                    Pediatric Healthcare Transparency Alliance • Global Registry
                  </div>

                  {(() => {
                    const titleParts = (selectedCert.title || 'Certificate of Healing Support').split(/\s*[-–]\s*/);
                    const line1 = titleParts[0];
                    const line2 = titleParts.slice(1).join(' - ');
                    return (
                      <>
                        <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '24px', color: '#3D2B1A', margin: '0 0 4px' }}>
                          {line1}
                        </h2>
                        {line2 && (
                          <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: '32px', color: '#C8773A', margin: '0 0 12px' }}>
                            {line2}
                          </div>
                        )}
                      </>
                    );
                  })()}
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#7A6A58', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: 28 }}>
                    Official Verified Token • {selectedCert.contributionType ? selectedCert.contributionType.replace('_', ' ').toUpperCase() : 'HEALING SUPPORT'}
                  </span>

                  <p style={{ fontSize: '13.5px', fontStyle: 'italic', color: '#8C745C', margin: '0 0 8px' }}>
                    This official token of medical gratitude is proudly awarded to
                  </p>
                  
                  <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#3D2B1A', fontFamily: 'Outfit', borderBottom: '1.5px solid #EBD5C2', display: 'inline-block', paddingBottom: 6, marginBottom: 20, minWidth: '240px' }}>
                    {getSupporterDisplayName(user, selectedCert.supporterName || localStorage.getItem('hp_supporter_name') || localStorage.getItem('hp_user_name'))}
                  </h3>

                  <p style={{ fontSize: '14.5px', color: '#5C4C3C', lineHeight: 1.7, fontWeight: 500, margin: '0 auto 28px', maxWidth: '520px' }}>
                    In sincere recognition of their compassionate contribution of <strong style={{ color: '#8C4F1A' }}>₹{selectedCert.amount}</strong> supporting essential clinical pediatric care and specialized hospital treatment for <strong style={{ color: '#8C4F1A' }}>{selectedCert.childName}</strong>. Your generous contribution has directly helped secure verified medical operations.
                  </p>

                  {/* Institutional Signatures & Seal grid */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(235, 221, 206, 0.8)', paddingTop: 32, marginBottom: 28 }}>
                    
                    {/* Signature 1 */}
                    <div style={{ textAlign: 'center', width: '160px' }}>
                      <div style={{ fontFamily: "'Pinyon Script', cursive", fontSize: '28px', color: '#1E3A8A', opacity: 0.8, marginBottom: '-3px', transform: 'rotate(-5deg) translateY(-8px)' }}>
                        Dr. Rebecca Sterling
                      </div>
                      <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)', marginBottom: '4px' }} />
                      <div style={{ fontSize: '9px', color: '#8C745C', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                        Pediatric Care Director
                      </div>
                    </div>

                    {/* Gold Seal with Ribbons */}
                    <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '-10px' }}>
                      {/* Left Ribbon */}
                      <div style={{ position: 'absolute', width: '15px', height: '45px', background: 'linear-gradient(135deg, #B91C1C, #EF4444)', top: '40px', left: '26px', transform: 'rotate(20deg)', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)', zIndex: 1 }} />
                      {/* Right Ribbon */}
                      <div style={{ position: 'absolute', width: '15px', height: '45px', background: 'linear-gradient(135deg, #991B1B, #DC2626)', top: '40px', left: '35px', transform: 'rotate(-20deg)', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)', zIndex: 1 }} />
                      {/* Disc */}
                      <div style={{ position: 'relative', width: '64px', height: '64px', background: 'radial-gradient(circle, #FDE68A 0%, #D4AF37 60%, #B45309 100%)', border: '2px dashed #FFF', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 18px rgba(212, 175, 55, 0.4)', transform: 'rotate(-5deg)', zIndex: 2 }}>
                        <div style={{ fontSize: '5.5px', fontWeight: 900, color: '#78350F', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'center', lineHeight: 1.2 }}>
                          OFFICIAL<br/>VERIFIED
                        </div>
                        <div style={{ color: '#78350F', fontSize: '7px', marginTop: '1px' }}>★ ★ ★</div>
                      </div>
                    </div>

                    {/* Signature 2 */}
                    <div style={{ textAlign: 'center', width: '160px' }}>
                      <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: '24px', color: '#1E3A8A', opacity: 0.9, marginBottom: '-2px', transform: 'rotate(-4deg) translateY(-8px)' }}>
                        Infant Ashil
                      </div>
                      <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)', marginBottom: '4px' }} />
                      <div style={{ fontSize: '9px', color: '#8C745C', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                        Founder • Heal & Play
                      </div>
                    </div>

                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10.5px', color: '#7A6A58', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <div>Date: {formatDate(selectedCert.createdAt)}</div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button 
                        onClick={() => handleDownloadCert(selectedCert)}
                        style={{ 
                          background: '#8C4F1A', 
                          color: '#FFF', 
                          border: 'none', 
                          borderRadius: '99px', 
                          padding: '10px 22px', 
                          fontSize: '11px', 
                          fontWeight: 800, 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          boxShadow: '0 4px 12px rgba(140, 79, 26, 0.2)'
                        }}
                      >
                        <Download size={13} /> Print luxury PDF
                      </button>
                    </div>
                  </div>

                  <div style={{ fontSize: '8.5px', color: '#A18266', fontWeight: 700, letterSpacing: '0.08em', marginTop: '20px', textTransform: 'uppercase' }}>
                    Registry Reference: H&P-REF-REG-{selectedCert.id.toUpperCase().slice(-10)}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
