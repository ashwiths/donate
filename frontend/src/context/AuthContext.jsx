import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'

const AuthContext = createContext(null)

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isGuest, setIsGuest] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL
        })
        setIsGuest(false)
      } else {
        setUser((prev) => (prev?.isGuest ? prev : null))
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const loginAsGuest = () => {
    setIsGuest(true)
    setUser({ name: 'Guest', email: '', isGuest: true })
  }

  const login = (userData) => {
    setUser(userData)
    setIsGuest(false)
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (e) {
      console.error("Logout error", e)
    }
    setUser(null)
    setIsGuest(false)
    localStorage.removeItem('hp_token')
  }

  return (
    <AuthContext.Provider value={{ user, isGuest, loading, login, loginAsGuest, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
