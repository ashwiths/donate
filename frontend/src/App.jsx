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
          <div className="app-global-bg">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/main" element={<MainPage />} />
              <Route path="/thank-you" element={<ThankYouPage />} />
              <Route path="/healing-stories" element={<HealingStoriesPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/inspirations" element={<InspirationsPage />} />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </DonationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}