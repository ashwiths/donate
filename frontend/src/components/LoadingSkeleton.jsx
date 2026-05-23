import React from 'react';
import { motion } from 'framer-motion';

/**
 * A beautiful premium Loading Skeleton for the Heal & Play dashboard.
 * Designed to perfectly match the brown luxury medical-healing glassmorphic theme.
 */
export default function LoadingSkeleton() {
  const pulseVariant = {
    animate: {
      opacity: [0.4, 0.7, 0.4],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div style={{
      maxWidth: 1280,
      width: '100%',
      margin: '60px auto 100px',
      padding: '0 24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '40px',
      position: 'relative',
      zIndex: 1
    }}>
      {/* Hero Header Skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center', marginBottom: '20px' }}>
        <motion.div
          variants={pulseVariant}
          animate="animate"
          style={{ width: '180px', height: '28px', borderRadius: '99px', background: 'rgba(139, 94, 52, 0.1)' }}
        />
        <motion.div
          variants={pulseVariant}
          animate="animate"
          style={{ width: '400px', height: '48px', borderRadius: '12px', background: 'rgba(139, 94, 52, 0.1)', maxWidth: '90%' }}
        />
        <motion.div
          variants={pulseVariant}
          animate="animate"
          style={{ width: '600px', height: '20px', borderRadius: '8px', background: 'rgba(139, 94, 52, 0.05)', maxWidth: '90%' }}
        />
      </div>

      {/* Main Grid Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
        {/* Profile Card Skeleton */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(235, 224, 214, 0.9)',
          borderRadius: '32px',
          padding: '40px',
          height: '280px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <motion.div
              variants={pulseVariant}
              animate="animate"
              style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(139, 94, 52, 0.1)' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              <motion.div
                variants={pulseVariant}
                animate="animate"
                style={{ width: '60%', height: '24px', borderRadius: '6px', background: 'rgba(139, 94, 52, 0.1)' }}
              />
              <motion.div
                variants={pulseVariant}
                animate="animate"
                style={{ width: '40%', height: '16px', borderRadius: '4px', background: 'rgba(139, 94, 52, 0.05)' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
            <motion.div
              variants={pulseVariant}
              animate="animate"
              style={{ flex: 1, height: '80px', borderRadius: '20px', background: 'rgba(139, 94, 52, 0.05)' }}
            />
            <motion.div
              variants={pulseVariant}
              animate="animate"
              style={{ flex: 1, height: '80px', borderRadius: '20px', background: 'rgba(139, 94, 52, 0.05)' }}
            />
          </div>
        </div>

        {/* Cinematic Stats Card Skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <motion.div
            variants={pulseVariant}
            animate="animate"
            style={{ height: '160px', borderRadius: '32px', background: 'rgba(139, 94, 52, 0.1)' }}
          />
          <div style={{ display: 'flex', gap: '20px' }}>
            <motion.div
              variants={pulseVariant}
              animate="animate"
              style={{ flex: 1, height: '90px', borderRadius: '32px', background: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(235, 224, 214, 0.9)' }}
            />
            <motion.div
              variants={pulseVariant}
              animate="animate"
              style={{ flex: 1, height: '90px', borderRadius: '32px', background: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(235, 224, 214, 0.9)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
