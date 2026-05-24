import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Gamepad2, Quote, Bell, ChevronDown, LogOut, Menu, X, Sparkles, User } from 'lucide-react'
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
        maxWidth: '1200px',
        width: 'calc(100% - 32px)',
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.55)',
        borderRadius: '99px',
        position: 'sticky',
        top: 24,
        zIndex: 100,
        boxShadow: '0 8px 40px rgba(120, 80, 40, 0.08)'
      }}
    >
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto', 
        padding: '0 24px', 
        display: 'flex', 
        alignItems: 'center', 
        height: 76, 
        justifyContent: 'space-between',
        boxSizing: 'border-box'
      }} className="nav-container">
        
        {/* Left Section: Premium Branding */}
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: 36,
              height: 36,
              background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 8px 20px rgba(92, 45, 14, 0.15)'
            }}>
              <Heart size={20} color="#fff" fill="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 17, color: '#3D2B1A', letterSpacing: '-0.5px', lineHeight: 1.1 }}>Heal & Play</div>
              <div style={{ fontSize: 8.5, color: '#7A6A58', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Play Games. Save Lives.</div>
            </div>
          </Link>
        </motion.div>

        {/* Middle Section: Centered Premium Capsule Nav Pills */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 18,
          justifyContent: 'center'
        }} className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: 18, justifyContent: 'center' }}>
          {navItems.map(({ label, path, icon: Icon }) => {
            const active = isActive(path)
            return (
              <motion.div key={label} whileHover={{ y: -1.5 }} transition={{ duration: 0.2 }}>
                <Link 
                  to={path} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: active ? '4px 14px 4px 4px' : '4px 12px',
                    borderRadius: '99px',
                    textDecoration: 'none',
                    color: active ? '#fff' : '#4A3422',
                    fontWeight: active ? 800 : 600,
                    fontSize: '14px',
                    height: 42,
                    boxSizing: 'border-box',
                    background: active ? 'linear-gradient(135deg, #9C6134, #7D4C28)' : 'transparent',
                    border: '1px solid transparent',
                    transition: 'all 0.3s ease',
                    boxShadow: active 
                      ? 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 20px rgba(139, 94, 52, 0.2)' 
                      : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = '#3D2B1A';
                      e.currentTarget.style.background = 'rgba(255, 251, 245, 0.6)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 94, 52, 0.04)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = '#4A3422';
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <div style={{
                    width: active ? 32 : 30,
                    height: active ? 32 : 30,
                    borderRadius: '50%',
                    background: active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: active ? 'none' : '1px solid rgba(235, 224, 214, 0.8)',
                    boxShadow: active ? 'none' : '0 2px 8px rgba(139, 94, 52, 0.04)',
                    transition: 'all 0.3s ease'
                  }}>
                    <Icon size={active ? 20 : 18} strokeWidth={active ? 2.5 : 2} style={{ color: active ? '#fff' : '#5C2D0E' }} />
                  </div>
                  <span>{label}</span>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Right Section: Aligned flex group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          
          {user ? (
            <div style={{ position: 'relative' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setDropOpen(!dropOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(235, 224, 214, 0.5)',
                  cursor: 'pointer',
                  padding: '4px 12px 4px 4px',
                  borderRadius: '99px',
                  height: 44,
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(139, 94, 52, 0.03)'
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FAF2EA, #EBD5C2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13.5px',
                  fontWeight: 900,
                  color: '#8C4F1A'
                }}>
                  {user.name ? user.name[0].toUpperCase() : 'V'}
                </div>
                <ChevronDown size={18} strokeWidth={2} color="#4A3422" style={{ transform: dropOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
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
                      top: 48,
                      width: 190,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(16px)',
                      borderRadius: '16px',
                      boxShadow: '0 24px 60px rgba(139, 94, 52, 0.12), inset 0 1px 0 rgba(255,255,255,0.8)',
                      border: '1px solid rgba(235, 224, 214, 0.6)',
                      overflow: 'hidden',
                      zIndex: 200,
                      padding: '8px'
                    }}
                  >
                    <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(235, 224, 214, 0.4)', marginBottom: 4 }}>
                      <div style={{ fontSize: '11px', color: '#4A3422', fontWeight: 800, textTransform: 'uppercase' }}>Signed in as</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#4A3427', marginTop: 2 }}>{user.name || 'Helper'}</div>
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
                        fontSize: '13px',
                        color: '#DC2626',
                        fontWeight: 800,
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
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
                  fontSize: '14px', 
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

          {/* Mobile Hamburger - only shown on mobile via CSS */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="nav-hamburger"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'rgba(255,251,245,0.8)',
              border: '1px solid rgba(235,224,214,0.6)',
              cursor: 'pointer',
              flexShrink: 0
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} color="#3D2B1A" /> : <Menu size={20} color="#3D2B1A" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer with premium bottom sheet styling */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(61, 43, 26, 0.4)',
                backdropFilter: 'blur(4px)',
                zIndex: 90
              }}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed',
                bottom: 0, left: 0, right: 0,
                background: '#fff',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '24px',
                zIndex: 100,
                boxShadow: '0 -10px 40px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ width: 40, height: 4, background: '#E8E0D6', borderRadius: 2, margin: '0 auto 24px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {navItems.map(({ label, path, icon: Icon }) => {
                  const active = isActive(path)
                  return (
                    <Link 
                      key={label} 
                      to={path} 
                      onClick={() => {
                        setMenuOpen(false);
                        window.scrollTo(0, 0);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        padding: '16px',
                        borderRadius: '16px',
                        textDecoration: 'none',
                        color: active ? '#8C4F1A' : '#4A3427',
                        fontWeight: active ? 700 : 600,
                        fontSize: '15px',
                        background: active ? '#FAF2EA' : 'transparent',
                        transition: 'all 0.2s ease',
                        border: active ? '1px solid rgba(140, 79, 26, 0.2)' : '1px solid transparent',
                      }}
                    >
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: active ? '#fff' : 'rgba(235, 224, 214, 0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: active ? '0 2px 8px rgba(139,94,52,0.1)' : 'none'
                      }}>
                        <Icon size={18} color={active ? '#8C4F1A' : '#7A6A5A'} />
                      </div>
                      {label}
                    </Link>
                  )
                })}
              </div>
              
              {!user && (
                <div style={{ marginTop: 24 }}>
                  <Link 
                    to="/" 
                    onClick={() => setMenuOpen(false)}
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%', 
                      height: 52, 
                      borderRadius: 16, 
                      fontSize: 15,
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
                      color: '#fff',
                      textDecoration: 'none'
                    }}
                  >
                    Login to Account
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
