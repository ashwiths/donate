import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DonationProvider } from './context/DonationContext'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import MainPage from './pages/MainPage'
import ThankYouPage from './pages/ThankYouPage'
import InspirationsPage from './pages/InspirationsPage'
import HealingStoriesPage from './pages/HealingStoriesPage'
import AccountPage from './pages/AccountPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DonationProvider>
          <div style={{
            position: 'relative',
            minHeight: '100vh',
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.32)), url("/background.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'scroll'
          }}>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/main" element={<MainPage />} />
              <Route path="/thank-you" element={<ThankYouPage />} />
              <Route path="/inspirations" element={<InspirationsPage />} />
              <Route path="/healing-stories" element={<HealingStoriesPage />} />
              <Route path="/account" element={<AccountPage />} />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </DonationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

