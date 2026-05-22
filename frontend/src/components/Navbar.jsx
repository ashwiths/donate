import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Gamepad2, Tag, Quote, Gift, Bell, ChevronDown, User, LogOut, Menu, X, Coins } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { label: 'Home', path: '/home', icon: Heart },
  { label: 'Play Zone', path: '/main?tab=games', icon: Gamepad2 },
  { label: 'Coupons', path: '/main?tab=coupons', icon: Tag },
  { label: 'Inspirations', path: '/main?tab=quotes', icon: Quote },
  { label: 'Free Tickets', path: '/main?tab=free', icon: Gift },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(232, 224, 214, 0.4)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 20px rgba(123, 63, 0, 0.02)',
      }}
    >
      <div style={{ 
        maxWidth: 1280, 
        margin: '0 auto', 
        padding: '0 40px', 
        display: 'flex', 
        alignItems: 'center', 
        height: 76, // Increased height for luxury vertical breathing room
        justifyContent: 'space-between',
        boxSizing: 'border-box'
      }} className="nav-container">
        
        {/* Left Section: Premium Branding */}
        <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: 38,
            height: 38,
            background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
            borderRadius: '11px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 16px rgba(123, 63, 0, 0.15)'
          }}>
            <Heart size={18} color="#fff" fill="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 17, color: 'var(--color-text)', letterSpacing: '-0.5px', lineHeight: 1.1 }}>Heal & Play</div>
            <div style={{ fontSize: 9.5, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Play Games. Save Lives.</div>
          </div>
        </Link>

        {/* Middle Section: Desktop Nav Tabs (Premium horizontal pill) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} className="hidden md:flex">
          {navItems.map(({ label, path, icon: Icon }) => {
            const active = location.pathname + location.search === path || location.pathname === path.split('?')[0]
            return (
              <Link 
                key={label} 
                to={path} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  borderRadius: '99px',
                  textDecoration: 'none',
                  color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  fontWeight: active ? 750 : 600,
                  fontSize: '13.5px',
                  background: active ? '#FAF2EA' : 'transparent',
                  transition: 'all 0.25s ease',
                  border: active ? '1px solid #EBD5C2' : '1px solid transparent'
                }}
                className="nav-link-item"
              >
                <Icon size={15} style={{ opacity: active ? 1 : 0.7 }} />
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right Section: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          
          {/* HP Coins Pill */}
          {user && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#FFFBEB',
              border: '1.5px solid #FCD34D',
              borderRadius: '99px',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 800,
              color: '#B45309',
            }} className="coins-badge">
              <Coins size={14} color="#D97706" />
              <span>120 Coins</span>
            </div>
          )}

          {/* Bell Notifications */}
          <button style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            padding: 8, 
            color: 'var(--color-text-muted)', 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'background 0.2s'
          }} className="icon-btn-hover">
            <Bell size={19} />
            <span style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 7,
              height: 7,
              background: '#EF4444',
              borderRadius: '50%',
              border: '1.5px solid #fff',
            }} />
          </button>

          {/* User profile section */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropOpen(!dropOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 6px',
                  borderRadius: '99px',
                  transition: 'background 0.2s'
                }}
                className="profile-btn-hover"
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FAF2EA, #EBD5C2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid #EBD5C2',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  color: 'var(--color-primary)'
                }}>
                  {user.name ? user.name[0].toUpperCase() : 'V'}
                </div>
                <ChevronDown size={14} color="var(--color-text-muted)" style={{ transform: dropOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              <AnimatePresence>
                {dropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 44,
                      width: 190,
                      background: '#fff',
                      borderRadius: '16px',
                      boxShadow: '0 10px 30px rgba(123, 63, 0, 0.08)',
                      border: '1px solid rgba(232, 224, 214, 0.6)',
                      overflow: 'hidden',
                      zIndex: 200,
                      padding: '8px'
                    }}
                  >
                    <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(232, 224, 214, 0.4)', marginBottom: 4 }}>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-light)', fontWeight: 700, textTransform: 'uppercase' }}>Signed in as</div>
                      <div style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--color-text)', marginTop: 2 }}>{user.name || 'Helper'}</div>
                    </div>
                    
                    <button 
                      onClick={handleLogout} 
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 12px',
                        background: 'none',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13.5px',
                        color: '#EF4444',
                        fontWeight: 700,
                        transition: 'background 0.2s'
                      }}
                      className="logout-btn-hover"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/" className="btn-primary" style={{ padding: '8px 18px', fontSize: 13.5, borderRadius: '9px' }}>Login</Link>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              display: 'flex', 
              padding: 6,
              color: 'var(--color-text)'
            }}
            className="md:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer with premium list styles */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ 
              overflow: 'hidden', 
              borderTop: '1px solid rgba(232, 224, 214, 0.4)', 
              background: '#fff',
              boxShadow: '0 10px 20px rgba(123, 63, 0, 0.05)'
            }}
          >
            <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {navItems.map(({ label, path, icon: Icon }) => {
                const active = location.pathname + location.search === path || location.pathname === path.split('?')[0]
                return (
                  <Link 
                    key={label} 
                    to={path} 
                    onClick={() => setMenuOpen(false)} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 16px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      fontWeight: active ? 750 : 600,
                      fontSize: '14.5px',
                      background: active ? '#FAF2EA' : 'transparent',
                    }}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
