import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import { DonationProvider } from './context/DonationContext'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import MainPage from './pages/MainPage'
import ThankYouPage from './pages/ThankYouPage'
import InspirationsPage from './pages/InspirationsPage'
import HealingStoriesPage from './pages/HealingStoriesPage'
import AccountPage from './pages/AccountPage'
import BreatheBloomPage from './pages/BreatheBloomPage'
import SoundWavePage from './pages/SoundWavePage'
import BioPathTracerPage from './pages/BioPathTracerPage'
import TherapeuticPathMatrixPage from './pages/TherapeuticPathMatrixPage'
import FlexPathPage from './pages/FlexPathPage'
import LuxeXOPage from './pages/LuxeXOPage'
import MindFlipPage from './pages/MindFlipPage'
import PulseReflexPage from './pages/PulseReflexPage'
import MindSlidePage from './pages/MindSlidePage'
import CouponDetailPage from './pages/CouponDetailPage'
import CouponThankYouPage from './pages/CouponThankYouPage'
import { seedCouponsIfEmpty } from './services/contributionService'

function ScrollToTop() {
  const { pathname, search } = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname, search])
  
  return null
}

export default function App() {
  useEffect(() => {
    seedCouponsIfEmpty()
  }, [])

  return (
    <BrowserRouter>
      <ScrollToTop />
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
              <Route path="/breathe-bloom" element={<BreatheBloomPage />} />
              <Route path="/sound-wave-serenade" element={<SoundWavePage />} />
              <Route path="/bio-path-tracer" element={<BioPathTracerPage />} />
              <Route path="/therapeutic-path-matrix" element={<TherapeuticPathMatrixPage />} />
              <Route path="/flex-path" element={<FlexPathPage />} />
              <Route path="/luxe-xo" element={<LuxeXOPage />} />
              <Route path="/mind-flip" element={<MindFlipPage />} />
              <Route path="/pulse-reflex" element={<PulseReflexPage />} />
              <Route path="/mind-slide" element={<MindSlidePage />} />
              <Route path="/coupon/:couponId" element={<CouponDetailPage />} />
              <Route path="/coupon-thank-you/:couponId" element={<CouponThankYouPage />} />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </DonationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}