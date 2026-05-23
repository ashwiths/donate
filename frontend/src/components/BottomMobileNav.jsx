import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Gamepad2, Sparkles, Quote, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { label: 'Home', path: '/home', icon: Heart },
  { label: 'Play Zone', path: '/main?tab=games', icon: Gamepad2 },
  { label: 'Stories', path: '/healing-stories', icon: Sparkles },
  { label: 'Inspire', path: '/inspirations', icon: Quote },
  { label: 'Account', path: '/account', icon: User },
]

export default function BottomMobileNav() {
  const location = useLocation()
  const { user } = useAuth()

  // Do not show on login page
  if (location.pathname === '/') return null;

  const isActive = (path) => {
    if (path.includes('?')) {
      return location.pathname + location.search === path;
    }
    return location.pathname === path;
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.2 }}
      className="md:hidden"
      style={{
        position: 'fixed',
        bottom: 24,
        left: 16,
        right: 16,
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(235, 224, 214, 0.8)',
        borderRadius: '99px',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 12px 40px rgba(120, 80, 40, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        zIndex: 110,
      }}
    >
      {navItems.map(({ label, path, icon: Icon }) => {
        const active = isActive(path)
        return (
          <Link
            key={label}
            to={path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              textDecoration: 'none',
              padding: '6px',
              color: active ? '#8C4F1A' : '#7A6A5A',
              transition: 'all 0.3s ease',
            }}
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: active ? '#FAF2EA' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: active ? '0 2px 8px rgba(139, 94, 52, 0.08)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 2} color={active ? '#8C4F1A' : '#7A6A5A'} />
            </motion.div>
            <span style={{ 
              fontSize: '9.5px', 
              fontWeight: active ? 800 : 600,
              transition: 'all 0.3s ease'
            }}>
              {label}
            </span>
          </Link>
        )
      })}
    </motion.div>
  )
}
