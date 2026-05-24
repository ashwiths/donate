import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BarChart3, RefreshCw, Users, DollarSign, Gift, Gamepad2, 
  Activity, ArrowLeft, Shield, AlertTriangle, CheckCircle2, TrendingUp,
  Calendar, Package, Lock, Award, Eye
} from 'lucide-react'
import { db } from '../firebase'
import { collection, query, orderBy, limit, onSnapshot, doc, writeBatch, serverTimestamp } from 'firebase/firestore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { COUPONS } from '../data/coupons'

export default function AdminAnalyticsPage() {
  const navigate = useNavigate()
  const [globalStats, setGlobalStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    totalCouponsUnlocked: 0,
    totalGamesUnlocked: 0,
    totalContributions: 0,
    totalCertificatesGenerated: 0
  })
  const [coupons, setCoupons] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    // 1. Subscribe to Global Stats
    const statsUnsub = onSnapshot(doc(db, 'analytics', 'globalStats'), (docSnap) => {
      if (docSnap.exists()) {
        setGlobalStats(docSnap.data())
      }
    }, (err) => console.error("Error subscribing to globalStats:", err))

    // 2. Subscribe to Coupons Inventory
    const couponsQuery = query(collection(db, 'coupons'), orderBy('brand', 'asc'))
    const couponsUnsub = onSnapshot(couponsQuery, (snap) => {
      const list = []
      snap.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() })
      })
      setCoupons(list)
      setLoading(false)
    }, (err) => console.error("Error subscribing to coupons:", err))

    // 3. Subscribe to Recent Activities Log
    const actQuery = query(collection(db, 'activities'), orderBy('createdAt', 'desc'), limit(25))
    const actUnsub = onSnapshot(actQuery, (snap) => {
      const list = []
      snap.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() })
      })
      setActivities(list)
    }, (err) => console.error("Error subscribing to activities:", err))

    return () => {
      statsUnsub()
      couponsUnsub()
      actUnsub()
    }
  }, [])

  const handleResetCoupons = async () => {
    if (!window.confirm("Are you sure you want to reset all coupon stocks to default values?")) {
      return
    }
    setResetting(true)
    try {
      const batch = writeBatch(db)
      COUPONS.forEach((c) => {
        const docRef = doc(db, 'coupons', c.id)
        batch.set(docRef, {
          id: c.id,
          brand: c.brand,
          title: c.title,
          code: c.code,
          totalStock: 100,
          remainingStock: 84, 
          unlockedCount: 16,  
          unlockAmount: c.price || 20,
          category: c.category,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          image: c.bannerUrl || '',
          isActive: true,
          createdAt: serverTimestamp()
        }, { merge: true })
      })
      await batch.commit()
      alert("Coupons inventory successfully reset! 🎁")
    } catch (err) {
      console.error(err)
      alert("Failed to reset: " + err.message)
    } finally {
      setResetting(false)
    }
  }

  const formatActivityText = (act) => {
    const name = act.supporterName || 'A Supporter'
    const targetName = act.target || ''
    const amount = act.amount || 0
    switch (act.type) {
      case 'user_signup':
        return `${name} created a Heal & Play account 🌟`
      case 'donation_success':
        return `${name} contributed ₹${amount} for pediatric healing 🤍`
      case 'coupon_unlock':
        return `${name} unlocked the ${targetName} brand coupon code 🎁`
      case 'game_unlock':
        return `${name} completed matching levels to unlock game: ${targetName} 🎮`
      case 'certificate_generated':
        return `A verified pediatric certificate was generated for ${name} 📜`
      default:
        return `${name} performed an action: ${act.type}`
    }
  }

  const formatTime = (ts) => {
    if (!ts) return 'Just now'
    const date = ts.toDate ? ts.toDate() : new Date(ts.seconds ? ts.seconds * 1000 : ts)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FAF6F0', color: '#3D2B1A', fontFamily: 'Outfit, sans-serif' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '40px 20px', maxWidth: '1200px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        {/* Back Link */}
        <Link to="/main" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#8B5E34', textDecoration: 'none', fontWeight: 700, fontSize: '14.5px', marginBottom: 28 }}>
          <ArrowLeft size={16} /> Back to Play Zone
        </Link>

        {/* Header Title Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20, marginBottom: 36 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FFF3E0', border: '1px solid #FFE0B2', padding: '6px 12px', borderRadius: '8px', width: 'fit-content', marginBottom: 12 }}>
              <Shield size={14} color="#E65100" />
              <span style={{ fontSize: '11px', fontWeight: 900, color: '#E65100', letterSpacing: '0.05em' }}>SECURE FIREBASE ADMIN PANEL</span>
            </div>
            <h1 style={{ margin: 0, fontSize: '36px', fontWeight: 900, color: '#3D2B1A', fontFamily: 'Georgia, serif' }}>
              Database Analytics & Inventory
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#7A6A5A' }}>
              Realtime synchronization with Google Firestore database collections and activity logs.
            </p>
          </div>

          <button 
            onClick={handleResetCoupons}
            disabled={resetting}
            style={{
              padding: '12px 24px',
              background: resetting ? '#E4E4E7' : 'linear-gradient(135deg, #8C4F1A, #C8773A)',
              border: resetting ? '1px solid #D4D4D8' : 'none',
              borderRadius: '14px',
              color: resetting ? '#A1A1AA' : '#FFF',
              fontWeight: 800,
              fontSize: '13.5px',
              cursor: resetting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: resetting ? 'none' : '0 4px 12px rgba(140, 79, 26, 0.15)'
            }}
          >
            <RefreshCw size={14} className={resetting ? "spin" : ""} />
            {resetting ? "Resetting..." : "Reset Coupon Inventory"}
          </button>
        </div>

        {/* Global Statistics Cards */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {[
            { title: 'Total Supporters', value: globalStats.totalUsers || 0, icon: Users, color: '#3B82F6', bg: '#EFF6FF' },
            { title: 'Total Revenue Generated', value: `₹${globalStats.totalRevenue || 0}`, icon: DollarSign, color: '#10B981', bg: '#ECFDF5' },
            { title: 'Coupons Unlocked', value: globalStats.totalCouponsUnlocked || 0, icon: Gift, color: '#F59E0B', bg: '#FEF3C7' },
            { title: 'Games Unlocked', value: globalStats.totalGamesUnlocked || 0, icon: Gamepad2, color: '#8B5CF6', bg: '#F5F3FF' },
            { title: 'Active Contributions', value: globalStats.totalContributions || 0, icon: Award, color: '#EF4444', bg: '#FEF2F2' },
          ].map((stat, idx) => (
            <div key={idx} style={{ background: '#FFFFFF', borderRadius: '24px', padding: '24px', border: '1px solid rgba(220, 208, 195, 0.7)', display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: '14px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={22} color={stat.color} />
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#8C745C', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.title}</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#3D2B1A', marginTop: 4 }}>{stat.value}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Two Column Layout: Coupon Stock & Live Logs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start', flexWrap: 'wrap' }}>
          {/* Left Column: Coupon Stock Tracking */}
          <section style={{ background: '#FFFFFF', borderRadius: '28px', border: '1px solid rgba(220, 208, 195, 0.7)', padding: '28px' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 800, color: '#3D2B1A', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Package size={18} color="#8C4F1A" />
              Sponsor Reward Inventory Stock
            </h3>

            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#7A6A5A' }}>Loading Inventory...</div>
            ) : coupons.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#7A6A5A' }}>No coupons in system. Click reset to seed coupons.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {coupons.map((coupon) => {
                  const percent = coupon.totalStock > 0 ? (coupon.remainingStock / coupon.totalStock) * 100 : 0
                  const isLow = coupon.remainingStock <= 20
                  const isOut = coupon.remainingStock <= 0

                  return (
                    <div key={coupon.id} style={{ borderBottom: '1px solid rgba(235, 224, 214, 0.5)', paddingBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#3D2B1A' }}>{coupon.brand}</div>
                          <div style={{ fontSize: '11px', color: '#7A6A5A' }}>{coupon.category}</div>
                        </div>

                        {/* Stock pills */}
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#8C4F1A' }}>
                            Unlocked {coupon.unlockedCount}x
                          </span>
                          
                          {isOut ? (
                            <span style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', padding: '3px 8px', borderRadius: '6px', fontSize: '9.5px', fontWeight: 900 }}>
                              OUT OF STOCK
                            </span>
                          ) : isLow ? (
                            <span style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', padding: '3px 8px', borderRadius: '6px', fontSize: '9.5px', fontWeight: 900 }}>
                              LOW STOCK
                            </span>
                          ) : (
                            <span style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', padding: '3px 8px', borderRadius: '6px', fontSize: '9.5px', fontWeight: 900 }}>
                              ACTIVE
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stock Progress Bar */}
                      <div style={{ width: '100%', height: '8px', background: '#F3ECE2', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                        <div 
                          style={{ 
                            width: `${percent}%`, 
                            height: '100%', 
                            background: isOut ? '#EF4444' : isLow ? '#F59E0B' : '#10B981',
                            borderRadius: '4px',
                            transition: 'width 0.5s ease-out'
                          }} 
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#7A6A5A', fontWeight: 600, marginTop: 6 }}>
                        <span>Code: {coupon.code}</span>
                        <span>{coupon.remainingStock} / {coupon.totalStock} Available</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Right Column: Live Activities Log Stream */}
          <section style={{ background: '#FFFFFF', borderRadius: '28px', border: '1px solid rgba(220, 208, 195, 0.7)', padding: '28px' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 800, color: '#3D2B1A', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Activity size={18} color="#8C4F1A" />
              Live Activity Stream logs
            </h3>

            {activities.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#7A6A5A' }}>No activity logged yet. Complete interactions to stream logs.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: '600px', overflowY: 'auto', paddingRight: '6px' }}>
                {activities.map((act) => (
                  <div key={act.id} style={{ display: 'flex', gap: 14, padding: '12px', background: '#FCFAF6', border: '1px solid rgba(235, 224, 214, 0.6)', borderRadius: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '8px', background: act.type === 'donation_success' ? '#D1FAE5' : act.type === 'coupon_unlock' ? '#FEF3C7' : '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Activity size={14} color={act.type === 'donation_success' ? '#059669' : act.type === 'coupon_unlock' ? '#D97706' : '#7C3AED'} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#3D2B1A', lineHeight: 1.4 }}>
                        {formatActivityText(act)}
                      </div>
                      <div style={{ fontSize: '11px', color: '#8C745C', marginTop: 4, fontWeight: 500 }}>
                        {formatTime(act.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
