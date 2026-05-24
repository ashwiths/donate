import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function TransparentBreakdown({ amount }) {
  const parsedAmount = Number(amount) || 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: 'rgba(255, 253, 250, 0.95)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(139, 94, 52, 0.2)',
        borderRadius: '20px',
        padding: '20px 24px',
        width: '100%',
        boxSizing: 'border-box',
        boxShadow: '0 8px 32px rgba(139, 94, 52, 0.03)',
        textAlign: 'left',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ 
          fontSize: '11px', 
          fontWeight: 900, 
          color: '#166534', 
          background: 'rgba(22, 101, 52, 0.06)', 
          padding: '4px 12px', 
          borderRadius: '99px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          Direct Support Contribution
        </span>
        <span style={{ fontSize: '11.5px', color: '#7A6A5A', fontWeight: 600 }}>Exact Amount Only</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#7A6A5A', fontWeight: 700 }}>Total Contribution</span>
          <span style={{ fontSize: 18, color: '#3D2B1A', fontWeight: 900, fontFamily: 'Outfit' }}>
            ₹{parsedAmount.toFixed(2)}
          </span>
        </div>

        <div style={{ 
          height: '1px', 
          background: 'rgba(139, 94, 52, 0.1)', 
          margin: '6px 0', 
          borderTop: '1px dashed rgba(139, 94, 52, 0.15)' 
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <ShieldCheck size={16} color="#16a34a" style={{ marginTop: 2, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#1b6335', marginBottom: 2 }}>
              100% Direct Pediatric Treatment Support
            </div>
            <div style={{ fontSize: '11.5px', color: '#5C4C3C', lineHeight: 1.4 }}>
              100% of your contribution goes directly toward verified pediatric treatment support. No platform fees, convenience charges, or hidden processing fees.
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
