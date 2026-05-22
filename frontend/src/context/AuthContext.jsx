import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isGuest, setIsGuest] = useState(false)

  const loginAsGuest = () => {
    setIsGuest(true)
    setUser({ name: 'Guest', email: '', isGuest: true })
  }

  const login = (userData) => {
    setUser(userData)
    setIsGuest(false)
  }

  const logout = () => {
    setUser(null)
    setIsGuest(false)
    localStorage.removeItem('hp_token')
  }

  return (
    <AuthContext.Provider value={{ user, isGuest, login, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
