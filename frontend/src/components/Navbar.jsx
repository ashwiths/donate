import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Gamepad2, Quote, Bell, ChevronDown, LogOut, Menu, X, Coins, Sparkles, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { label: 'Home', path: '/home', icon: Heart },
  { label: 'Play Zone', path: '/main?tab=games', icon: Gamepad2 },
  { label: 'Healing Stories', path: '/healing-stories', icon: Sparkles },
  { label: 'Inspirations', path: '/inspirations', icon: Quote },
  { label: 'Account', path: '/account', icon: User },
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
        margin: '24px auto 0',
        maxWidth: '1240px',
        width: 'calc(100% - 48px)',
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(235, 224, 214, 0.9)',
        borderRadius: '24px',
        position: 'sticky',
        top: 24,
        zIndex: 100,
        boxShadow: '0 12px 40px rgba(139, 94, 52, 0.08)'
      }}
    >
      <div style={{ 
        maxWidth: 1280, 
        margin: '0 auto', 
        padding: '0 32px', 
        display: 'flex', 
        alignItems: 'center', 
        height: 80, 
        justifyContent: 'space-between',
        boxSizing: 'border-box'
      }} className="nav-container">
        
        {/* Left Section: Premium Branding */}
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 6px 16px rgba(92, 45, 14, 0.2)'
            }}>
              <Heart size={18} color="#fff" fill="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 18.5, color: '#3D2B1A', letterSpacing: '-0.5px', lineHeight: 1.1 }}>Heal & Play</div>
              <div style={{ fontSize: 9.5, color: '#7A6A58', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Play Games. Save Lives.</div>
            </div>
          </Link>
        </motion.div>

        {/* Middle Section: Centered Premium Capsule Nav Pills */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12,
          justifyContent: 'center'
        }} className="hidden md:flex">
          {navItems.map(({ label, path, icon: Icon }) => {
            const active = isActive(path)
            return (
              <motion.div key={label} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link 
                  to={path} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 20px',
                    borderRadius: '99px',
                    textDecoration: 'none',
                    color: active ? '#fff' : '#6A5C4F',
                    fontWeight: active ? 700 : 600,
                    fontSize: '14.5px',
                    height: 42,
                    boxSizing: 'border-box',
                    background: active ? 'linear-gradient(135deg, #8C4F1A, #5C2D0E)' : 'transparent',
                    border: active ? '1px solid rgba(140, 79, 26, 0.5)' : '1px solid transparent',
                    transition: 'all 0.3s ease',
                    boxShadow: active 
                      ? 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 8px 24px rgba(92, 45, 14, 0.25)' 
                      : 'none'
                  }}
                  className="nav-link-item hover:bg-[#FAF6F2]"
                >
                  <Icon size={15} style={{ opacity: active ? 1 : 0.7 }} />
                  <span>{label}</span>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Right Section: Aligned flex group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          
          {/* HP Coins Pill */}
          {user && (
            <motion.div whileHover={{ scale: 1.02 }} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#FFFBEB',
              border: '1.5px solid #FDE68A',
              borderRadius: '99px',
              padding: '8px 16px',
              fontSize: '13.5px',
              fontWeight: 800,
              color: '#B45309',
            }} className="coins-badge">
              <Coins size={14} color="#D97706" />
              <span>120 Coins</span>
            </motion.div>
          )}

          {/* Bell Notifications */}
          <motion.button whileHover={{ scale: 1.05 }} style={{ 
            background: '#FFFDFB', 
            border: '1px solid rgba(235, 224, 214, 0.8)', 
            cursor: 'pointer', 
            width: 42,
            height: 42,
            color: '#6A5C4F', 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(139, 94, 52, 0.02)'
          }} className="hover:border-[#C8773A]">
            <Bell size={18} />
            <span style={{
              position: 'absolute',
              top: 10,
              right: 12,
              width: 8,
              height: 8,
              background: '#EF4444',
              borderRadius: '50%',
              border: '2px solid #fff',
            }} />
          </motion.button>

          {/* User profile section / Login trigger */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setDropOpen(!dropOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#FFFDFB',
                  border: '1px solid rgba(235, 224, 214, 0.8)',
                  cursor: 'pointer',
                  padding: '4px 16px 4px 6px',
                  borderRadius: '99px',
                  height: 42,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(139, 94, 52, 0.02)'
                }}
                className="hover:border-[#C8773A]"
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FAF2EA, #EBD5C2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #EBD5C2',
                  fontSize: '13px',
                  fontWeight: 900,
                  color: '#8C4F1A'
                }}>
                  {user.name ? user.name[0].toUpperCase() : 'V'}
                </div>
                <ChevronDown size={14} color="#6A5C4F" style={{ transform: dropOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </motion.button>

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
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Link 
                to="/" 
                style={{ 
                  padding: '0 24px', 
                  fontSize: '14.5px', 
                  fontWeight: 800,
                  borderRadius: '99px',
                  height: 42,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 6px 16px rgba(92, 45, 14, 0.2)',
                  transition: 'all 0.3s ease'
                }}
              >
                Login
              </Link>
            </motion.div>
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
