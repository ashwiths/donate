import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DonationProvider } from './context/DonationContext'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import MainPage from './pages/MainPage'
import ThankYouPage from './pages/ThankYouPage'
import InspirationsPage from './pages/InspirationsPage'
import { GlobalBackground } from './components/PremiumBackground'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DonationProvider>
          <div style={{ position: 'relative', minHeight: '100vh', background: '#FAF8F5' }}>
            <GlobalBackground />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/thank-you" element={<ThankYouPage />} />
                <Route path="/inspirations" element={<InspirationsPage />} />
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </DonationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

