import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DonationProvider } from './context/DonationContext'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import MainPage from './pages/MainPage'
import ThankYouPage from './pages/ThankYouPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DonationProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DonationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
