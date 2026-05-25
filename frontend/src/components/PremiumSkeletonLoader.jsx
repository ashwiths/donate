import React from 'react'

export default function PremiumSkeletonLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#FAF6F0',
      color: '#3D2B1A',
      fontFamily: 'Outfit, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes skeletonShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.9; }
        }
        .shimmer-bg {
          position: relative;
          overflow: hidden;
          background: rgba(139, 94, 52, 0.08);
          border-radius: 8px;
        }
        .shimmer-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
          animation: skeletonShimmer 1.6s infinite linear;
          will-change: transform;
        }
        .skeleton-card {
          width: 100%;
          max-width: 520px;
          background: rgba(255, 253, 250, 0.85);
          border: 1px solid rgba(139, 94, 52, 0.12);
          border-radius: 32px;
          padding: 48px 40px;
          box-sizing: border-box;
          box-shadow: 0 24px 64px rgba(74, 52, 39, 0.04);
          text-align: center;
          will-change: transform, opacity;
          animation: pulseGlow 2s infinite ease-in-out;
        }
        @media (max-width: 768px) {
          .skeleton-card {
            padding: 32px 24px;
            margin: 20px;
            border-radius: 24px;
          }
        }
      `}</style>

      {/* Floating glow elements matching background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(235, 224, 214, 0.4) 0%, rgba(255, 255, 255, 0) 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, rgba(255, 255, 255, 0) 70%)', filter: 'blur(50px)' }} />
      </div>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', zIndex: 1, position: 'relative', boxSizing: 'border-box' }}>
        <div className="skeleton-card">
          {/* Badge skeleton */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div className="shimmer-bg" style={{ width: '150px', height: '24px', borderRadius: '20px' }} />
          </div>

          {/* Heading skeleton */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
            <div className="shimmer-bg" style={{ width: '90%', height: '28px' }} />
            <div className="shimmer-bg" style={{ width: '70%', height: '28px' }} />
          </div>

          {/* Subtitle skeleton */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center', marginBottom: '32px' }}>
            <div className="shimmer-bg" style={{ width: '85%', height: '14px' }} />
            <div className="shimmer-bg" style={{ width: '60%', height: '14px' }} />
          </div>

          {/* Input field skeleton */}
          <div style={{ marginBottom: '24px' }}>
            <div className="shimmer-bg" style={{ width: '100%', height: '54px', borderRadius: '16px' }} />
          </div>

          {/* Button skeleton */}
          <div>
            <div className="shimmer-bg" style={{ width: '100%', height: '54px', borderRadius: '16px' }} />
          </div>
        </div>
      </main>
    </div>
  )
}
