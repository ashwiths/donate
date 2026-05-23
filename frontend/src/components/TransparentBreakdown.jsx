import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Info } from 'lucide-react';

export default function TransparentBreakdown({ amount }) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Convert amount to number safely
  const parsedAmount = Number(amount) || 10;

  // realistic Indian payment gateway fee (2% + 18% GST = 2.36%)
  const gatewayFee = parsedAmount * 0.0236;
  const hospitalCredit = parsedAmount - gatewayFee;

  // Supporter Label logic
  let supporterBadge = "Micro Healing Support";
  let badgeColor = "#8B5E34";
  let badgeBg = "rgba(139, 94, 52, 0.06)";

  if (parsedAmount >= 20 && parsedAmount < 100) {
    supporterBadge = "Verified Healing Contribution";
    badgeColor = "#166534";
    badgeBg = "rgba(22, 101, 52, 0.06)";
  } else if (parsedAmount >= 100) {
    supporterBadge = "Major Treatment Supporter";
    badgeColor = "#D4AF37";
    badgeBg = "rgba(212, 175, 55, 0.09)";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: 'rgba(255, 253, 250, 0.85)',
        backdropFilter: 'blur(8px)',
        border: '1px dashed rgba(139, 94, 52, 0.25)',
        borderRadius: '20px',
        padding: '22px 26px',
        width: '100%',
        boxSizing: 'border-box',
        boxShadow: '0 8px 32px rgba(139, 94, 52, 0.03), inset 0 1px 0 rgba(255,255,255,0.6)',
        textAlign: 'left',
        position: 'relative',
        overflow: 'visible'
      }}
    >
      {/* Dynamic Supporter Badge Pill */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ 
          fontSize: '11px', 
          fontWeight: 900, 
          color: badgeColor, 
          background: badgeBg, 
          padding: '4px 12px', 
          borderRadius: '99px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          transition: 'all 0.3s ease'
        }}>
          {supporterBadge}
        </span>
        <span style={{ fontSize: '11.5px', color: '#7A6A5A', fontWeight: 600 }}>Razorpay Secure</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Row 1: Contribution Amount */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#7A6A5A', fontWeight: 700 }}>Contribution Amount</span>
          <span style={{ fontSize: 14, color: '#3D2B1A', fontWeight: 900, fontFamily: 'Outfit' }}>
            ₹{parsedAmount.toFixed(2)}
          </span>
        </div>

        {/* Row 2: Gateway Processing */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#7A6A5A', fontWeight: 700 }}>
            Gateway Processing
            <div 
              style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
            >
              <Info size={13.5} color="#8C4F1A" />
            </div>
          </span>
          <span style={{ fontSize: 14, color: '#3D2B1A', fontWeight: 900, fontFamily: 'Outfit' }}>
            ₹{gatewayFee.toFixed(2)}
          </span>

          {/* Hover Tooltip Box */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                style={{
                  position: 'absolute',
                  bottom: '26px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '250px',
                  background: '#3D2B1A',
                  color: '#FCFAF6',
                  padding: '12px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  lineHeight: '1.45',
                  fontWeight: 600,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                  zIndex: 99999,
                  pointerEvents: 'none',
                  textAlign: 'left'
                }}
              >
                Gateway processing charges vary slightly depending on UPI/card/banking method.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Row 3: Platform Service Fee */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#7A6A5A', fontWeight: 700 }}>Platform Service Fee</span>
          <span style={{ fontSize: 14, color: '#166534', fontWeight: 900, fontFamily: 'Outfit' }}>
            ₹0.00
          </span>
        </div>

        {/* Elegant dotted divider */}
        <div style={{ 
          height: '1px', 
          background: 'rgba(139, 94, 52, 0.15)', 
          margin: '10px 0', 
          borderTop: '1px dashed rgba(139, 94, 52, 0.2)' 
        }} />

        {/* Row 4: Hospital Support Route */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 13, color: '#8C4F1A', fontWeight: 800 }}>Estimated Hospital Credit</span>
            <span style={{ fontSize: 9.5, color: '#7A6A5A', fontWeight: 600 }}>Public ledger audited routing</span>
          </div>
          <span style={{ 
            fontSize: '12.5px', 
            color: '#166534', 
            background: '#DCFCE7', 
            padding: '4px 12px', 
            borderRadius: '12px', 
            fontWeight: 800, 
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
          }}>
            ₹{hospitalCredit.toFixed(2)} Verified Route ✓
          </span>
        </div>
      </div>

      {/* Confetti ambient particles inside card backdrop */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.04,
        background: 'radial-gradient(circle, #8B5E34 10%, transparent 11%)',
        backgroundSize: '16px 16px',
        pointerEvents: 'none',
        zIndex: 0
      }} />
    </motion.div>
  );
}
