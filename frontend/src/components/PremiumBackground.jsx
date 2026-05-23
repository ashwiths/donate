import { useEffect, useRef, memo } from 'react'
import { motion } from 'framer-motion'




// ─── Shared: Floating ambient blob ────────────────────────────────────────────
function AmbientBlob({ style, delay = 0, duration = 18 }) {
  return (
    <motion.div
      animate={{
        x: [0, 18, -10, 0],
        y: [0, -22, 14, 0],
        scale: [1, 1.06, 0.97, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
        repeatType: 'mirror',
      }}
      style={{
        position: 'absolute',
        borderRadius: '50%',
        filter: 'blur(70px)',
        pointerEvents: 'none',
        ...style,
      }}
    />
  )
}

// ─── Shared: Floating micro-particle ──────────────────────────────────────────
function FloatingDot({ style, delay = 0 }) {
  return (
    <motion.div
      animate={{
        y: [0, -20, 0],
        opacity: [0.3, 0.7, 0.3],
        scale: [1, 1.15, 1],
      }}
      transition={{
        duration: 6 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        position: 'absolute',
        width: 5,
        height: 5,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,168,120,0.8), rgba(139,98,57,0.4))',
        pointerEvents: 'none',
        ...style,
      }}
    />
  )
}

// ─── 1. HERO BACKGROUND ───────────────────────────────────────────────────────
// Soft mesh gradient + floating blobs + micro particles + breathing radial glow
export const HeroBackground = memo(function HeroBackground() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Animated mesh gradient layer */}
      <div className="hero-mesh-gradient" />

      {/* Large ambient blobs */}
      <AmbientBlob
        delay={0}
        duration={20}
        style={{
          top: '-8%',
          left: '-6%',
          width: 560,
          height: 560,
          background: 'radial-gradient(circle, rgba(232,192,140,0.18) 0%, rgba(254,246,235,0) 70%)',
        }}
      />
      <AmbientBlob
        delay={3}
        duration={24}
        style={{
          top: '30%',
          right: '-10%',
          width: 480,
          height: 480,
          background: 'radial-gradient(circle, rgba(200,119,58,0.12) 0%, transparent 70%)',
        }}
      />
      <AmbientBlob
        delay={6}
        duration={18}
        style={{
          bottom: '-10%',
          left: '25%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(234,213,192,0.22) 0%, transparent 70%)',
        }}
      />

      {/* Subtle breathing central glow */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.08, 0.14, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '10%',
          left: '35%',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(215,175,120,0.22) 0%, transparent 60%)',
          filter: 'blur(40px)',
          transform: 'translate(-50%, 0)',
        }}
      />

      {/* Floating micro particles */}
      {[
        { top: '12%', left: '8%', delay: 0 },
        { top: '25%', left: '78%', delay: 1.2 },
        { top: '55%', left: '14%', delay: 2.5 },
        { top: '40%', left: '90%', delay: 0.7 },
        { top: '72%', left: '60%', delay: 3.1 },
        { top: '18%', left: '50%', delay: 1.8 },
        { top: '80%', left: '30%', delay: 4 },
        { top: '65%', left: '85%', delay: 2 },
      ].map((p, i) => (
        <FloatingDot key={i} style={{ top: p.top, left: p.left }} delay={p.delay} />
      ))}

      {/* Very subtle diagonal light streak */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          left: '60%',
          width: 2,
          height: '45%',
          background: 'linear-gradient(to bottom, transparent, rgba(215,175,100,0.06), transparent)',
          transform: 'rotate(20deg)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '20%',
          width: 1,
          height: '30%',
          background: 'linear-gradient(to bottom, transparent, rgba(215,175,100,0.05), transparent)',
          transform: 'rotate(-15deg)',
        }}
      />
    </div>
  )
})

// ─── 2. GAMES / PARTICIPATION SECTION BACKGROUND ──────────────────────────────
// Faint animated grid + floating particles + elegant ambient glow
export const GamesBackground = memo(function GamesBackground() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Faint animated grid */}
      <div className="games-grid-texture" />

      {/* Ambient corner blobs */}
      <AmbientBlob
        delay={1}
        duration={22}
        style={{
          top: '-15%',
          right: '-5%',
          width: 420,
          height: 420,
          background: 'radial-gradient(circle, rgba(200,168,120,0.11) 0%, transparent 70%)',
        }}
      />
      <AmbientBlob
        delay={4}
        duration={19}
        style={{
          bottom: '-10%',
          left: '-5%',
          width: 380,
          height: 380,
          background: 'radial-gradient(circle, rgba(232,192,140,0.10) 0%, transparent 70%)',
        }}
      />

      {/* Floating particles */}
      {[
        { top: '8%', left: '15%', delay: 0.5 },
        { top: '20%', left: '70%', delay: 2 },
        { top: '60%', left: '25%', delay: 1 },
        { top: '75%', left: '80%', delay: 3 },
        { top: '45%', left: '95%', delay: 1.5 },
      ].map((p, i) => (
        <FloatingDot key={i} style={{ top: p.top, left: p.left }} delay={p.delay} />
      ))}

      {/* Subtle center shimmer */}
      <motion.div
        animate={{ opacity: [0.04, 0.10, 0.04] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 600,
          height: 400,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, rgba(215,175,100,0.18) 0%, transparent 65%)',
          filter: 'blur(30px)',
        }}
      />
    </div>
  )
})

// ─── 3. QUOTES / INSPIRATION SECTION BACKGROUND ───────────────────────────────
// Dreamy warm floating light blobs + slow opacity pulses
export const QuotesBackground = memo(function QuotesBackground() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Soft dreamy blobs */}
      <AmbientBlob
        delay={0}
        duration={25}
        style={{
          top: '5%',
          left: '-8%',
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(200,119,58,0.10) 0%, transparent 65%)',
        }}
      />
      <AmbientBlob
        delay={5}
        duration={28}
        style={{
          bottom: '5%',
          right: '-8%',
          width: 450,
          height: 450,
          background: 'radial-gradient(circle, rgba(139,98,57,0.09) 0%, transparent 65%)',
        }}
      />
      <AmbientBlob
        delay={2}
        duration={22}
        style={{
          top: '40%',
          left: '30%',
          width: 360,
          height: 360,
          background: 'radial-gradient(circle, rgba(234,223,207,0.20) 0%, transparent 60%)',
        }}
      />

      {/* Slow pulsing center aura */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.07, 0.16, 0.07] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,168,100,0.25) 0%, transparent 60%)',
          filter: 'blur(50px)',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Sparse particles */}
      {[
        { top: '10%', left: '5%', delay: 0 },
        { top: '15%', left: '90%', delay: 1.5 },
        { top: '80%', left: '10%', delay: 2.8 },
        { top: '85%', left: '88%', delay: 0.8 },
      ].map((p, i) => (
        <FloatingDot key={i} style={{ top: p.top, left: p.left, width: 4, height: 4 }} delay={p.delay} />
      ))}
    </div>
  )
})

// ─── 4. DONATION / TRANSPARENCY SECTION BACKGROUND ────────────────────────────
// Hospital trust atmosphere — soft glass reflections + minimal animated lines + subtle glow
export const DonationBackground = memo(function DonationBackground() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Premium corner ambient glows */}
      <AmbientBlob
        delay={0}
        duration={20}
        style={{
          top: '-10%',
          left: '-8%',
          width: 440,
          height: 440,
          background: 'radial-gradient(circle, rgba(215,185,140,0.12) 0%, transparent 70%)',
        }}
      />
      <AmbientBlob
        delay={3}
        duration={26}
        style={{
          bottom: '-5%',
          right: '-6%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(200,160,110,0.10) 0%, transparent 70%)',
        }}
      />

      {/* Animated minimal elegant lines */}
      <motion.div
        animate={{ scaleX: [0.85, 1, 0.85], opacity: [0.04, 0.10, 0.04] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '25%',
          left: '8%',
          width: '80%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(200,150,80,0.30), transparent)',
          transformOrigin: 'center',
        }}
      />
      <motion.div
        animate={{ scaleX: [1, 0.88, 1], opacity: [0.03, 0.08, 0.03] }}
        transition={{ duration: 16, delay: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '25%',
          left: '10%',
          width: '75%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(200,150,80,0.25), transparent)',
          transformOrigin: 'center',
        }}
      />

      {/* Glass reflection shimmer (top right corner) */}
      <motion.div
        animate={{ opacity: [0, 0.06, 0], x: ['-5%', '5%', '-5%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 300,
          height: 300,
          background: 'linear-gradient(135deg, rgba(255,250,240,0.40) 0%, transparent 60%)',
          borderRadius: '0 0 0 300px',
        }}
      />

      {/* Premium progress bar glow helper element */}
      <motion.div
        animate={{ opacity: [0.05, 0.14, 0.05] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: 80,
          background: 'radial-gradient(ellipse, rgba(200,150,80,0.20) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Sparse elegant floating dots */}
      {[
        { top: '15%', left: '5%', delay: 0 },
        { top: '70%', left: '92%', delay: 2 },
      ].map((p, i) => (
        <FloatingDot
          key={i}
          style={{ top: p.top, left: p.left, width: 4, height: 4, opacity: 0.5 }}
          delay={p.delay}
        />
      ))}
    </div>
  )
})

// ─── 5. GENERAL WARM SECTION BACKGROUND ──────────────────────────────────────
// Used for campaigns, neutral sections — minimal warm ambiance
export const WarmSectionBackground = memo(function WarmSectionBackground() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <AmbientBlob
        delay={0}
        duration={24}
        style={{
          top: '0%',
          right: '5%',
          width: 360,
          height: 360,
          background: 'radial-gradient(circle, rgba(232,192,140,0.09) 0%, transparent 70%)',
        }}
      />
      <AmbientBlob
        delay={6}
        duration={22}
        style={{
          bottom: '0%',
          left: '5%',
          width: 320,
          height: 320,
          background: 'radial-gradient(circle, rgba(215,175,120,0.08) 0%, transparent 70%)',
        }}
      />
    </div>
  )
})

// ─── 6. LOGIN / LANDING HERO BACKGROUND ────────────────────────────────────────
// Luxury beige watercolor texture + Ivory overlay + Caramel radial glows + floating orbs
export const LoginBackground = memo(function LoginBackground() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Layer 1: Luxury Beige Watercolor Texture */}
      <motion.div
        animate={{
          scale: [1, 1.03, 1],
          rotate: [0, 0.3, -0.3, 0],
        }}
        transition={{
          duration: 36,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          inset: '-1%', // Extend slightly to cover panning boundaries
          backgroundImage: 'url("/background.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.88, // Highly visible to show off the beautiful corner watercolor splashes
          filter: 'none', // No blur to preserve the elegant paper texture grain and watercolor details
        }}
      />

      {/* Layer 2: Soft Ivory/Cream Transparent Overlay + Vignette Fade */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(250, 246, 240, 0.25) 30%, rgba(250, 246, 240, 0.75) 100%)',
        }}
      />

      {/* Layer 3: Subtle Caramel Radial Glow behind Hero Content */}
      {/* Left side caramel glow (behind headline text) */}
      <motion.div
        animate={{
          opacity: [0.15, 0.22, 0.15],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '15%',
          left: '15%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200, 150, 80, 0.24) 0%, rgba(250, 246, 240, 0) 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Right side warm radial glow (behind featured card) */}
      <motion.div
        animate={{
          opacity: [0.12, 0.18, 0.12],
          scale: [1, 1.04, 1]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2
        }}
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '15%',
          width: 550,
          height: 550,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232, 168, 124, 0.20) 0%, rgba(254, 243, 232, 0) 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Optional Premium Effects: Ultra Subtle Floating Blur Orbs */}
      <AmbientBlob
        delay={1}
        duration={26}
        style={{
          top: '5%',
          right: '25%',
          width: 320,
          height: 320,
          background: 'radial-gradient(circle, rgba(215, 175, 120, 0.12) 0%, transparent 70%)',
        }}
      />
      <AmbientBlob
        delay={5}
        duration={30}
        style={{
          bottom: '15%',
          left: '20%',
          width: 380,
          height: 380,
          background: 'radial-gradient(circle, rgba(139, 98, 57, 0.08) 0%, transparent 70%)',
        }}
      />

      {/* Smooth Section Blending at the very bottom edge */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: 'linear-gradient(to bottom, transparent, #FAF8F5)',
        }}
      />
    </div>
  )
})

// ─── 7. GLOBAL PLATFORM BACKGROUND ─────────────────────────────────────────────
// Premium beige watercolor texture + Ivory overlay + Floating subtle warm caramel blobs
export const GlobalBackground = memo(function GlobalBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Layer 1: Luxury Beige Watercolor Texture */}
      <motion.div
        animate={{
          scale: [1, 1.03, 1],
          rotate: [0, 0.3, -0.3, 0],
        }}
        transition={{
          duration: 36,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          inset: '-2%', // Extend slightly to cover panning boundaries
          backgroundImage: 'url("/background.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.18, // Significantly reduced to prevent washing out content
          filter: 'none',
        }}
      />

      {/* Layer 2: Clean Light White Overlay to Soften Texture & Ensure High Readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255, 255, 255, 0.72)',
        }}
      />

      {/* Layer 3: Soft Cream Vignette Fade */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(250, 246, 240, 0.15) 30%, rgba(250, 246, 240, 0.6) 100%)',
        }}
      />

      {/* Subtle floating caramel blobs to represent warmth globally across pages */}
      <AmbientBlob
        delay={0}
        duration={28}
        style={{
          top: '10%',
          left: '10%',
          width: 550,
          height: 550,
          background: 'radial-gradient(circle, rgba(200, 150, 80, 0.08) 0%, transparent 70%)',
        }}
      />
      <AmbientBlob
        delay={4}
        duration={32}
        style={{
          bottom: '10%',
          right: '10%',
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(232, 168, 124, 0.06) 0%, transparent 70%)',
        }}
      />
    </div>
  )
})


