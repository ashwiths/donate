import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Gamepad2, Tag, Quote, Gift, Bell, ChevronDown, User, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { label: 'Home', path: '/home', icon: Heart },
  { label: 'Games', path: '/main?tab=games', icon: Gamepad2 },
  { label: 'Coupons', path: '/main?tab=coupons', icon: Tag },
  { label: 'Quotes', path: '/main?tab=quotes', icon: Quote },
  { label: 'Free', path: '/main?tab=free', icon: Gift },
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
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        background: '#fff',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 64, gap: 16 }}>
        {/* Logo */}
        <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36, background: 'var(--color-primary)',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Heart size={18} color="#fff" fill="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 16, color: 'var(--color-text)', lineHeight: 1.1 }}>Heal & Play</div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '0.02em' }}>Play Games. Save Lives.</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 4 }} className="hidden md:flex">
          {navItems.map(({ label, path, icon: Icon }) => {
            const active = location.pathname + location.search === path || location.pathname === path.split('?')[0]
            return (
              <Link key={label} to={path} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                padding: '6px 16px', borderRadius: 10, textDecoration: 'none',
                background: active ? 'var(--color-bg-warm)' : 'transparent',
                color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: active ? 600 : 400, fontSize: 13,
                transition: 'all 0.2s',
              }}>
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
          {/* Coins indicator */}
          {user && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'var(--color-bg-warm)', borderRadius: 99,
              padding: '4px 12px', fontSize: 13, fontWeight: 600, color: 'var(--color-primary)',
            }}>
              🪙 250
            </div>
          )}

          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: 'var(--color-text-muted)', position: 'relative' }}>
            <Bell size={20} />
            <span style={{
              position: 'absolute', top: 4, right: 4, width: 8, height: 8,
              background: 'var(--color-accent)', borderRadius: '50%', border: '1.5px solid #fff',
            }} />
          </button>

          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropOpen(!dropOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '4px 8px', borderRadius: 10,
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--color-bg-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid var(--color-border)',
                }}>
                  <User size={16} color="var(--color-primary)" />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }} className="hidden md:block">
                  {user.name || 'User'}
                </span>
                <ChevronDown size={14} color="var(--color-text-muted)" />
              </button>

              <AnimatePresence>
                {dropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute', right: 0, top: 44, width: 180,
                      background: '#fff', borderRadius: 12, boxShadow: 'var(--shadow-lg)',
                      border: '1px solid var(--color-border)', overflow: 'hidden', zIndex: 200,
                    }}
                  >
                    <button onClick={handleLogout} style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '12px 16px', background: 'none', border: 'none',
                      cursor: 'pointer', fontSize: 14, color: '#dc2626', fontWeight: 500,
                    }}>
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/" className="btn-primary" style={{ padding: '8px 18px', fontSize: 14 }}>Login</Link>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 4 }}
            className="md:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', borderTop: '1px solid var(--color-border)', background: '#fff' }}
          >
            {navItems.map(({ label, path, icon: Icon }) => (
              <Link key={label} to={path} onClick={() => setMenuOpen(false)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 24px', textDecoration: 'none',
                color: 'var(--color-text)', fontWeight: 500, fontSize: 15,
                borderBottom: '1px solid var(--color-border)',
              }}>
                <Icon size={18} color="var(--color-primary)" />
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
