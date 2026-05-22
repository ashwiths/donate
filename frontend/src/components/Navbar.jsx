import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Gamepad2, Quote, Bell, ChevronDown, LogOut, Menu, X, Coins } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { label: 'Home', path: '/home', icon: Heart },
  { label: 'Play Zone', path: '/main?tab=games', icon: Gamepad2 },
  { label: 'Inspirations', path: '/inspirations', icon: Quote },
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

  const isActive = (path) => {
    if (path.includes('?')) {
      return location.pathname + location.search === path;
    }
    return location.pathname === path;
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        background: 'rgba(252, 250, 247, 0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(235, 224, 214, 0.45)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 24px rgba(139, 94, 52, 0.03)'
      }}
    >
      <div style={{ 
        maxWidth: 1280, 
        margin: '0 auto', 
        padding: '0 24px', 
        display: 'flex', 
        alignItems: 'center', 
        height: 64, 
        justifyContent: 'space-between',
        boxSizing: 'border-box'
      }} className="nav-container">
        
        {/* Left Section: Premium Branding */}
        <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: 34,
            height: 34,
            background: 'linear-gradient(135deg, #9A673A, #7A4E2B)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 4px 12px rgba(122, 78, 43, 0.15)'
          }}>
            <Heart size={15} color="#fff" fill="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 16, color: '#4A3427', letterSpacing: '-0.4px', lineHeight: 1.1 }}>Heal & Play</div>
            <div style={{ fontSize: 9, color: '#7A6A5A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Play Games. Save Lives.</div>
          </div>
        </Link>

        {/* Middle Section: Centered Premium Capsule Nav Pills */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8,
          justifyContent: 'center'
        }} className="hidden md:flex">
          {navItems.map(({ label, path, icon: Icon }) => {
            const active = isActive(path)
            return (
              <Link 
                key={label} 
                to={path} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: '99px',
                  textDecoration: 'none',
                  color: active ? '#fff' : '#7A6A5A',
                  fontWeight: active ? 750 : 600,
                  fontSize: '13px',
                  height: 36,
                  boxSizing: 'border-box',
                  background: active ? 'linear-gradient(135deg, #9A673A, #7A4E2B)' : '#FAF6F2',
                  border: active ? '1px solid #7A4E2B' : '1px solid rgba(235, 224, 214, 0.5)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: active 
                    ? 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 12px rgba(122, 78, 43, 0.16)' 
                    : '0 2px 6px rgba(139, 94, 52, 0.01)'
                }}
                className="nav-link-item"
              >
                <Icon size={13} style={{ opacity: active ? 1 : 0.8 }} />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>

        {/* Right Section: Aligned flex group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          
          {/* HP Coins Pill */}
          {user && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: '#FFFBEB',
              border: '1.5px solid #FCD34D',
              borderRadius: '99px',
              padding: '5px 12px',
              fontSize: '12px',
              fontWeight: 800,
              color: '#B45309',
            }} className="coins-badge">
              <Coins size={13} color="#D97706" />
              <span>120 Coins</span>
            </div>
          )}

          {/* Bell Notifications */}
          <button style={{ 
            background: '#FAF6F2', 
            border: '1px solid rgba(235, 224, 214, 0.5)', 
            cursor: 'pointer', 
            width: 36,
            height: 36,
            color: '#7A6A5A', 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 2px 6px rgba(139, 94, 52, 0.01)'
          }} className="icon-btn-hover">
            <Bell size={16} />
            <span style={{
              position: 'absolute',
              top: 10,
              right: 10,
              width: 6,
              height: 6,
              background: '#EF4444',
              borderRadius: '50%',
              border: '1px solid #fff',
            }} />
          </button>

          {/* User profile section / Login trigger */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropOpen(!dropOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#FAF6F2',
                  border: '1px solid rgba(235, 224, 214, 0.5)',
                  cursor: 'pointer',
                  padding: '3px 8px 3px 4px',
                  borderRadius: '99px',
                  height: 36,
                  transition: 'background 0.2s',
                  boxShadow: '0 2px 6px rgba(139, 94, 52, 0.01)'
                }}
                className="profile-btn-hover"
              >
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FAF2EA, #EBD5C2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #EBD5C2',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#9A673A'
                }}>
                  {user.name ? user.name[0].toUpperCase() : 'V'}
                </div>
                <ChevronDown size={12} color="#7A6A5A" style={{ transform: dropOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
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
                      <div style={{ fontSize: '11px', color: '#7A6A5A', fontWeight: 700, textTransform: 'uppercase' }}>Signed in as</div>
                      <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#4A3427', marginTop: 2 }}>{user.name || 'Helper'}</div>
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
            <Link 
              to="/" 
              style={{ 
                padding: '0 18px', 
                fontSize: '13px', 
                fontWeight: 700,
                borderRadius: '99px',
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #9A673A, #7A4E2B)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 4px 12px rgba(122, 78, 43, 0.14)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              Login
            </Link>
          )}

          {/* Collapsed Mobile Menu Toggle inside subtle rounded button container */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ 
              background: '#FAF6F2', 
              border: '1px solid rgba(235, 224, 214, 0.5)', 
              cursor: 'pointer', 
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4A3427',
              boxShadow: '0 2px 6px rgba(139, 94, 52, 0.01)'
            }}
            className="md:hidden"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
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
                const active = isActive(path)
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
                      color: active ? '#9A673A' : '#7A6A5A',
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
