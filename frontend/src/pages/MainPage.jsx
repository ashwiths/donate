import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  ChevronRight, Gamepad2, Tag, Quote as QuoteIcon, Gift, 
  LayoutGrid, Shield, Heart, Lock, ArrowRight, Sparkles, Check, Info, X
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DonationProgress from '../components/DonationProgress'
import { useDonation } from '../context/DonationContext'
import { useAuth } from '../context/AuthContext'
import { usePayment } from '../context/PaymentContext'
import TransparentBreakdown from '../components/TransparentBreakdown'
import { addContribution, generateHealingCertificate } from '../services/contributionService'
import { doc, updateDoc, increment, arrayUnion, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useUserData } from '../hooks/useUserData'
import { COUPONS as MYSTERY_REWARDS } from '../data/coupons'
import { subscribeCoupons } from '../services/contributionService'
import { getSupporterDisplayName } from '../utils/nameHelper'

const PREMIUM_GAMES = [
  {
    id: 'sound-wave-serenade',
    title: 'Sound Wave Serenade',
    description: 'Tap moving nodes along peaceful sound waves at the harmony zone to release beautiful Solfeggio chimes and secure sponsor aid.',
    price: 0,
    illustration: (
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="waveGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFBF7" />
            <stop offset="100%" stopColor="#F5EFEB" />
          </radialGradient>
        </defs>
        {/* Soft background with subtle rounded corners */}
        <rect x="5" y="5" width="90" height="90" rx="16" fill="url(#waveGlow)" stroke="#EADFD6" strokeWidth="1" />
        
        {/* Soothing moving wave lines (chimes/ocean waves) */}
        <motion.path
          animate={{ d: [
            "M 15 50 Q 32.5 25, 50 50 T 85 50",
            "M 15 50 Q 32.5 75, 50 50 T 85 50",
            "M 15 50 Q 32.5 25, 50 50 T 85 50"
          ] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          fill="none"
          stroke="#8C4F1A"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <motion.path
          animate={{ d: [
            "M 15 50 Q 32.5 65, 50 50 T 85 50",
            "M 15 50 Q 32.5 35, 50 50 T 85 50",
            "M 15 50 Q 32.5 65, 50 50 T 85 50"
          ] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          fill="none"
          stroke="#D4C5B9"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Concentric harmony rings radiating behind nodes representing sound frequencies */}
        <motion.circle
          animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
          cx="70" cy="50" r="10" fill="none" stroke="#8C4F1A" strokeWidth="0.8" strokeDasharray="2, 2"
          style={{ originX: '70px', originY: '50px' }}
        />
        
        {/* Interactive nodes along the wave */}
        {/* Left Node */}
        <circle cx="30" cy="35" r="3.5" fill="#946B4E" />
        <circle cx="30" cy="35" r="1.5" fill="#FFF" />
        
        {/* Center Node */}
        <circle cx="50" cy="50" r="4.5" fill="#785338" />
        <circle cx="50" cy="50" r="2" fill="#FFF" />

        {/* Active Node approaching harmony line */}
        <motion.g
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ originX: '70px', originY: '50px' }}
        >
          <circle cx="70" cy="50" r="5.5" fill="#5C3D24" />
          <circle cx="70" cy="50" r="2.5" fill="#FFF" />
        </motion.g>

        {/* Target alignment harmony zone indicator */}
        <line x1="70" y1="15" x2="70" y2="85" stroke="#8C4F1A" strokeWidth="1" strokeDasharray="3, 3" opacity="0.4" />
      </svg>
    )
  },
  {
    id: 'breathe-bloom',
    title: 'Breathe & Bloom',
    description: 'Immerse in deep breathing rhythms with an elegant, expanding flower to find serenity and trigger sponsor aid.',
    price: 0,
    illustration: (
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="flowerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFBF7" />
            <stop offset="100%" stopColor="#F5EFEB" />
          </radialGradient>
        </defs>
        {/* Soft white background with subtle rounded corners */}
        <rect x="5" y="5" width="90" height="90" rx="16" fill="url(#flowerGlow)" stroke="#EADFD6" strokeWidth="1" />
        
        {/* Soft, concentric dashed lines radiating around the flower, representing breathing expansion */}
        <motion.circle
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          cx="50%" cy="50%" r="32" fill="none" stroke="#D4C5B9" strokeWidth="1" strokeDasharray="3, 3"
          style={{ originX: '50px', originY: '50px' }}
        />
        <motion.circle
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          cx="50%" cy="50%" r="24" fill="none" stroke="#D4C5B9" strokeWidth="1" strokeDasharray="4, 4"
          style={{ originX: '50px', originY: '50px' }}
        />
        <motion.circle
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          cx="50%" cy="50%" r="16" fill="none" stroke="#C5B4A6" strokeWidth="0.8" strokeDasharray="2, 2"
          style={{ originX: '50px', originY: '50px' }}
        />
        
        {/* Elegant flower silhouette in mid-bloom with dark brown accents */}
        <motion.g
          animate={{ scale: [0.9, 1.1, 0.9], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '50px', originY: '50px' }}
        >
          {/* Flower Stem / Base */}
          <path d="M50 50 L50 72" stroke="#5C3D24" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          
          {/* Flower Petals (Elegant silhouette) */}
          <path d="M50 50 C46 38, 54 38, 50 50 Z" fill="#5C3D24" opacity="0.9" />
          <path d="M50 50 C38 42, 44 32, 50 50 Z" fill="#785338" opacity="0.85" />
          <path d="M50 50 C62 42, 56 32, 50 50 Z" fill="#785338" opacity="0.85" />
          <path d="M50 50 C34 48, 38 38, 50 50 Z" fill="#946B4E" opacity="0.75" />
          <path d="M50 50 C66 48, 62 38, 50 50 Z" fill="#946B4E" opacity="0.75" />
          
          {/* Flower Center Core (small accent) */}
          <circle cx="50" cy="48" r="2.5" fill="#EADFD6" />
          <circle cx="50" cy="48" r="1.5" fill="#5C3D24" />
        </motion.g>
      </svg>
    )
  },
  {
    id: 'bio-path-tracer',
    title: 'Bio-Path Tracer',
    description: 'Trace abstract neural path networks and bio-geometry spheres in sequence to secure match contributions and promote fine-motor recovery.',
    price: 0,
    illustration: (
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="tracerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFBF7" />
            <stop offset="100%" stopColor="#F5EFEB" />
          </radialGradient>
        </defs>
        {/* Soft pure white background with rounded corners */}
        <rect x="5" y="5" width="90" height="90" rx="16" fill="url(#tracerGlow)" stroke="#EADFD6" strokeWidth="1" />
        
        {/* Abstract, elegant neural pathway lines (light traces) using dynamic vectors */}
        <line x1="30" y1="75" x2="50" y2="50" stroke="rgba(220, 208, 195, 0.6)" strokeWidth="1" />
        <line x1="70" y1="75" x2="50" y2="50" stroke="rgba(220, 208, 195, 0.6)" strokeWidth="1" />
        <line x1="30" y1="30" x2="50" y2="50" stroke="rgba(220, 208, 195, 0.6)" strokeWidth="1" />
        <line x1="70" y1="30" x2="50" y2="50" stroke="rgba(220, 208, 195, 0.6)" strokeWidth="1" />
        
        {/* Traced Golden connected path line */}
        <motion.line
          x1="50" y1="50" x2="50" y2="20"
          stroke="#8C4F1A"
          strokeWidth="1.5"
          strokeDasharray="4, 4"
          animate={{ strokeDashoffset: [0, -10] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        />
        <line x1="30" y1="75" x2="70" y2="75" stroke="#D4C5B9" strokeWidth="0.8" opacity="0.4" />
        
        {/* Protective biological cell spheres at junction points */}
        {/* Bottom Left Cell */}
        <circle cx="30" cy="75" r="4" fill="#946B4E" />
        <circle cx="30" cy="75" r="1.5" fill="#FFF" />

        {/* Bottom Right Cell */}
        <circle cx="70" cy="75" r="4" fill="#946B4E" />
        <circle cx="70" cy="75" r="1.5" fill="#FFF" />

        {/* Top Left Cell */}
        <circle cx="30" cy="30" r="4.5" fill="#785338" />
        <circle cx="30" cy="30" r="1.8" fill="#FFF" />

        {/* Top Right Cell */}
        <circle cx="70" cy="30" r="4.5" fill="#785338" />
        <circle cx="70" cy="30" r="1.8" fill="#FFF" />

        {/* Center glowing Cell Sphere */}
        <motion.circle
          cx="50"
          cy="50"
          r="6"
          fill="#5C3D24"
          animate={{ r: [5, 6.5, 5] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
        <circle cx="50" cy="50" r="2.2" fill="#FFF" />

        {/* Target Cortex Gateway Top Cell */}
        <motion.circle
          cx="50"
          cy="20"
          r="7"
          fill="none"
          stroke="#8C4F1A"
          strokeWidth="0.8"
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          style={{ originX: '50px', originY: '20px' }}
        />
        <circle cx="50" cy="20" r="4.5" fill="#8C4F1A" />
        <circle cx="50" cy="20" r="1.5" fill="#FFF" />

        {/* Small floating energy pulses traveling between nodes */}
        <motion.circle
          cx="30" cy="75" r="1.5" fill="#D4AF37"
          animate={{ cx: [30, 50], cy: [75, 50] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />
      </svg>
    )
  },
  {
    id: 'therapeutic-path-matrix',
    title: 'Snakes & Ladders',
    description: 'Experience a beautiful, fully-playable modern Snakes & Ladders game in a premium luxury layout to unlock sponsor matched rewards.',
    price: 20,
    illustration: (
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="matrixCardGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFBF7" />
            <stop offset="100%" stopColor="#F5EFEB" />
          </radialGradient>
        </defs>
        <rect x="5" y="5" width="90" height="90" rx="16" fill="url(#matrixCardGlow)" stroke="#EADFD6" strokeWidth="1" />
        
        <line x1="20" y1="80" x2="80" y2="80" stroke="rgba(220, 208, 195, 0.4)" strokeWidth="0.8" />
        <line x1="20" y1="50" x2="80" y2="50" stroke="rgba(220, 208, 195, 0.4)" strokeWidth="0.8" />
        <line x1="20" y1="20" x2="80" y2="20" stroke="rgba(220, 208, 195, 0.4)" strokeWidth="0.8" />
        
        <line x1="20" y1="20" x2="20" y2="80" stroke="rgba(220, 208, 195, 0.4)" strokeWidth="0.8" />
        <line x1="50" y1="20" x2="50" y2="80" stroke="rgba(220, 208, 195, 0.4)" strokeWidth="0.8" />
        <line x1="80" y1="20" x2="80" y2="80" stroke="rgba(220, 208, 195, 0.4)" strokeWidth="0.8" />

        <path d="M 20 80 Q 35 65, 50 50 T 80 20" fill="none" stroke="#D4AF37" strokeWidth="2" strokeDasharray="3, 3" />
        
        <path d="M 80 80 C 65 65, 50 35, 50 20" fill="none" stroke="#A09080" strokeWidth="1.5" opacity="0.6" />

        <circle cx="20" cy="80" r="3" fill="#8C4F1A" />
        <circle cx="50" cy="50" r="3" fill="#8C4F1A" />
        <circle cx="80" cy="20" r="3.5" fill="#8C4F1A" />

        <motion.circle
          cx={20}
          cy={80}
          r={4.5}
          fill="#8C4F1A"
          animate={{ cx: [20, 50, 80], cy: [80, 50, 20] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        />
        <circle cx="50" cy="50" r="1.5" fill="#FFF" />
      </svg>
    )
  },
  {
    id: 'flex-path',
    title: 'FlexPath Journey',
    description: 'Guide a stretching companion through elegant maze pathways using smooth directional movement and strategic positioning.',
    price: 20,
    illustration: (
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="flexCardGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFBF7" />
            <stop offset="100%" stopColor="#F2ECE4" />
          </radialGradient>
        </defs>
        <rect x="5" y="5" width="90" height="90" rx="20" fill="url(#flexCardGlow)" stroke="#EADFCF" strokeWidth="1" />
        
        <rect x="20" y="20" width="16" height="16" rx="4" fill="#FFFFFF" stroke="#EADFCF" strokeWidth="0.8" />
        <rect x="42" y="20" width="16" height="16" rx="4" fill="#FFFFFF" stroke="#EADFCF" strokeWidth="0.8" />
        <rect x="64" y="20" width="16" height="16" rx="4" fill="#FFFFFF" stroke="#EADFCF" strokeWidth="0.8" />

        <rect x="20" y="42" width="16" height="16" rx="4" fill="#FFFFFF" stroke="#EADFCF" strokeWidth="0.8" />
        <rect x="42" y="42" width="16" height="16" rx="4" fill="#FFFFFF" stroke="#EADFCF" strokeWidth="0.8" />
        <rect x="64" y="42" width="16" height="16" rx="4" fill="#FFFFFF" stroke="#EADFCF" strokeWidth="0.8" />

        <rect x="20" y="64" width="16" height="16" rx="4" fill="#FFFFFF" stroke="#EADFCF" strokeWidth="0.8" />
        <rect x="42" y="64" width="16" height="16" rx="4" fill="#FFFFFF" stroke="#EADFCF" strokeWidth="0.8" />
        <rect x="64" y="64" width="16" height="16" rx="4" fill="#FFFFFF" stroke="#EADFCF" strokeWidth="0.8" />
        
        <rect x="42" y="42" width="16" height="16" rx="4" fill="#3A281A" />
        
        <path d="M 28 72 L 28 50 L 50 50" fill="none" stroke="#8B6239" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
        <path d="M 28 72 L 28 50 L 50 50" fill="none" stroke="#8B6239" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 28 72 L 28 50 L 50 50" fill="none" stroke="#EADFCF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1.5, 3" />
        
        <circle cx="50" cy="50" r="5" fill="#3A281A" />
        <polygon points="46,47 48,43 50,47" fill="#3A281A" />
        <polygon points="50,47 52,43 54,47" fill="#3A281A" />
        <circle cx="50" cy="50" r="1.5" fill="#FFF" />
      </svg>
    )
  },
  {
    id: 'luxe-xo',
    title: 'Luxe XO',
    description: 'Engage in an elegant, premium Tic Tac Toe battle vs friends or a smart strategic AI. Achieve perfect alignment to unlock matched sponsor pools.',
    price: 20,
    illustration: (
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="xoCardGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFBF7" />
            <stop offset="100%" stopColor="#F2ECE4" />
          </radialGradient>
        </defs>
        <rect x="5" y="5" width="90" height="90" rx="20" fill="url(#xoCardGlow)" stroke="#EADFCF" strokeWidth="1" />
        
        {/* Intricate premium 3x3 grid */}
        <line x1="38" y1="20" x2="38" y2="80" stroke="#8B6239" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
        <line x1="62" y1="20" x2="62" y2="80" stroke="#8B6239" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
        <line x1="20" y1="38" x2="80" y2="38" stroke="#8B6239" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
        <line x1="20" y1="62" x2="80" y2="62" stroke="#8B6239" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />

        {/* Elegant glowing O mark */}
        <circle
          cx="29"
          cy="29"
          r="8"
          fill="none"
          stroke="#8B6239"
          strokeWidth="3.2"
        />
        
        {/* Elegant glowing X mark */}
        <g opacity="0.9">
          <line
            x1="45" y1="45" x2="55" y2="55"
            stroke="#3A281A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <line
            x1="55" y1="45" x2="45" y2="55"
            stroke="#3A281A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>

        {/* Soft floating stars */}
        <path d="M 71 25 L 72 28 L 75 29 L 72 30 L 71 33 L 70 30 L 67 29 L 70 28 Z" fill="#D4AF37" opacity="0.75" />
      </svg>
    )
  },
  {
    id: 'mind-flip',
    title: 'MindFlip Arena',
    description: 'Master cognitive focus in a premium Neural Memory Arena. Match minimalist geometric nodes to chain combos and unlock matched sponsor aid.',
    price: 20,
    illustration: (
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="mindFlipCardGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFBF7" />
            <stop offset="100%" stopColor="#F2ECE4" />
          </radialGradient>
        </defs>
        <rect x="5" y="5" width="90" height="90" rx="20" fill="url(#mindFlipCardGlow)" stroke="#EADFCF" strokeWidth="1" />
        
        {/* Memory Grid nodes layout */}
        <rect x="22" y="22" width="22" height="22" rx="6" fill="#FFFDF5" stroke="#8B6239" strokeWidth="1.2" />
        <rect x="54" y="22" width="22" height="22" rx="6" fill="#FFFDF5" stroke="#8B6239" strokeWidth="1.2" />
        <rect x="22" y="54" width="22" height="22" rx="6" fill="#FFFDF5" stroke="#8B6239" strokeWidth="1.2" />
        <rect x="54" y="54" width="22" height="22" rx="6" fill="#8B6239" />
        
        {/* Glowing match indicators */}
        <circle cx="65" cy="65" r="4" fill="#FFF" />
        
        {/* Star bursts representing active matches */}
        <path d="M 33 33 L 34 35 L 37 36 L 34 37 L 33 39 L 32 37 L 29 36 L 32 35 Z" fill="#D4AF37" opacity="0.9" />
        <path d="M 65 33 L 66 35 L 69 36 L 66 37 L 65 39 L 64 37 L 61 36 L 64 35 Z" fill="#D4AF37" opacity="0.5" />
        
        {/* Infinite ribbon ripple background */}
        <circle cx="50" cy="50" r="38" fill="none" stroke="#EADFCF" strokeWidth="1" strokeDasharray="3, 3" />
      </svg>
    )
  },
  {
    id: 'pulse-reflex',
    title: 'Pulse Reflex Arena',
    description: 'Test your sensory timing in a premium Neural Reaction Arena. Tap glowing pulse targets, chain combos, and earn matched sponsor help.',
    price: 20,
    illustration: (
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="pulseReflexCardGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFDF7" />
            <stop offset="100%" stopColor="#F2ECE4" />
          </radialGradient>
        </defs>
        <rect x="5" y="5" width="90" height="90" rx="20" fill="url(#pulseReflexCardGlow)" stroke="#EADFCF" strokeWidth="1" />
        
        {/* Concentric glowing pulse ripples */}
        <circle cx="50" cy="50" r="34" fill="none" stroke="#8B6239" strokeWidth="1" strokeDasharray="4, 4" opacity="0.4" />
        <circle cx="50" cy="50" r="24" fill="none" stroke="#8B6239" strokeWidth="1.5" opacity="0.6" />
        
        {/* Core glowing target orb */}
        <circle cx="50" cy="50" r="14" fill="#8B6239" />
        <circle cx="50" cy="50" r="6" fill="#FFFDF5" />
        
        {/* Star bursts representing tap response feedback */}
        <path d="M 50 14 L 51 18 L 54 19 L 51 20 L 50 24 L 49 20 L 46 19 L 49 18 Z" fill="#D4AF37" opacity="0.95" />
        <path d="M 86 50 L 87 52 L 90 53 L 87 54 L 86 58 L 85 54 L 82 53 L 85 52 Z" fill="#D4AF37" opacity="0.95" />
        <path d="M 14 50 L 15 52 L 18 53 L 15 54 L 14 58 L 13 54 L 10 53 L 13 52 Z" fill="#D4AF37" opacity="0.95" />
      </svg>
    )
  },
  {
    id: 'mind-slide',
    title: 'MindSlide Puzzle',
    description: 'Reorder sensory matrix paths in a premium sliding node arena. Align numbered paths, improve moves, and unlock wellness sponsor aid.',
    price: 20,
    illustration: (
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="mindSlideCardGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFBF7" />
            <stop offset="100%" stopColor="#F2ECE4" />
          </radialGradient>
        </defs>
        <rect x="5" y="5" width="90" height="90" rx="20" fill="url(#mindSlideCardGlow)" stroke="#EADFCF" strokeWidth="1" />
        
        {/* Sliding puzzle grid blocks */}
        <rect x="18" y="18" width="20" height="20" rx="4" fill="#FFF" stroke="#8B6239" strokeWidth="1" />
        <rect x="40" y="18" width="20" height="20" rx="4" fill="#FFF" stroke="#8B6239" strokeWidth="1" />
        <rect x="62" y="18" width="20" height="20" rx="4" fill="#FFF" stroke="#8B6239" strokeWidth="1" />
        
        <rect x="18" y="40" width="20" height="20" rx="4" fill="#FFF" stroke="#8B6239" strokeWidth="1" />
        <rect x="40" y="40" width="20" height="20" rx="4" fill="#8B6239" />
        <rect x="62" y="40" width="20" height="20" rx="4" fill="#FFF" stroke="#8B6239" strokeWidth="1" />
        
        <rect x="18" y="62" width="20" height="20" rx="4" fill="#FFF" stroke="#8B6239" strokeWidth="1" />
        <rect x="40" y="62" width="20" height="20" rx="4" fill="#FFF" stroke="#8B6239" strokeWidth="1" />
        
        {/* Dotted empty slot placeholder */}
        <rect x="62" y="62" width="20" height="20" rx="4" fill="none" stroke="#D4C5B9" strokeWidth="1.5" strokeDasharray="3, 3" />
        
        {/* Symmetrical alignment stars */}
        <circle cx="50" cy="50" r="3" fill="#FFFDF5" />
      </svg>
    )
  }
]

const INSPIRATIONAL_CARDS = [
  {
    title: 'Janamithra\'s Healing Milestone',
    description: 'Thanks to over 4,200 small gaming plays, Janamithra\'s pre-operation checkup has been fully funded.',
    curiosity: 'Discover the heartfelt recovery milestone shared by Janamithra\'s family after successful pre-op stabilization.',
    tag: 'SUCCESS STORY',
    accent: '#8C4F1A',
    bg: '#FAF4EE',
    price: 10
  },
  {
    title: 'Words of Hope from Pediatric Care',
    description: '"Every single 10-rupee gameplay helps us secure reliable bedside monitoring faster than traditional fundraising."',
    curiosity: 'Unlock an exclusive clinical voice recording message from the lead pediatric nursing officer at the hospital ward.',
    tag: 'CLINICAL VOICE',
    accent: '#47682C',
    bg: '#F3F6F0',
    price: 20
  },
  {
    title: 'How Transparency Empowers You',
    description: 'We map every transaction ID directly to the hospital\'s billing terminal. Trust is built on complete clarity.',
    curiosity: 'Reveal the transparent ledger framework that guarantees your contribution arrives directly to the ward desk.',
    tag: 'OUR PROMISE',
    accent: '#1E3A5F',
    bg: '#F0F4F8',
    price: 30
  }
]



const TABS = [
  { id: 'all', label: 'All Unlocks' },
  { id: 'games', label: 'Games 🎮' },
  { id: 'coupons', label: 'Coupons 🎁' },
  { id: 'quotes', label: 'Quotes 💬' },
  { id: 'free-help', label: 'Free Help ❤️' }
]

export default function MainPage() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [activeTab, setActiveTab] = useState(() => {
    if (location.state?.activeTab) return location.state.activeTab
    return 'all'
  })
  const [customAmount, setCustomAmount] = useState('')
  const [selectedPreset, setSelectedPreset] = useState(100)
  
  const { user } = useAuth()
  const { confirmDonation } = useDonation()
  const { requestPayment } = usePayment()
  const { userData } = useUserData()

  const [couponsList, setCouponsList] = useState([])

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab)
      setTimeout(() => {
        const element = document.getElementById('tab-container')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 150)
    }
  }, [location.state])

  useEffect(() => {
    const unsubscribe = subscribeCoupons((data) => {
      setCouponsList(data.sort((a, b) => a.id.localeCompare(b.id)))
    })
    return () => unsubscribe()
  }, [])

  const activeCoupons = couponsList.length > 0 ? couponsList : MYSTERY_REWARDS
  const unlockedGames = Array.isArray(userData?.unlockedGames) ? userData.unlockedGames : []

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  // Premium Certificate Form Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingPrice, setPendingPrice] = useState(null)
  const [unlockType, setUnlockType] = useState('donation')
  const [pendingGamePath, setPendingGamePath] = useState(null)
  const [pendingGameId, setPendingGameId] = useState(null)
  const [pendingGameTitle, setPendingGameTitle] = useState(null)
  const [formData, setFormData] = useState({ name: '', mobile: '', email: '' })
  const [errors, setErrors] = useState({ name: '', email: '' })
  const [toastMsg, setToastMsg] = useState(null)

  // ESC Key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleUnlock = (price, path = null, gameId = null, gameTitle = null) => {
    setPendingPrice(price)
    setPendingGamePath(path)
    setPendingGameId(gameId)
    setPendingGameTitle(gameTitle)
    setIsModalOpen(true)
  }

  const handleFreeGameUnlock = async (gameId, gameTitle, targetPath) => {
    if (user?.uid) {
      const userRef = doc(db, 'users', user.uid);
      const updateFields = {};
      
      updateFields.totalGamesUnlocked = increment(1);
      
      if (userData && !Array.isArray(userData.unlockedGames)) {
        updateFields.unlockedGames = [gameId];
        updateFields.unlockedGameDetails = [{
          gameId,
          gameName: gameTitle,
          amount: 0,
          type: "free",
          unlockedAt: new Date().toISOString()
        }];
      } else {
        updateFields.unlockedGames = arrayUnion(gameId);
        updateFields.unlockedGameDetails = arrayUnion({
          gameId,
          gameName: gameTitle,
          amount: 0,
          type: "free",
          unlockedAt: new Date().toISOString()
        });
      }
      
      try {
        await updateDoc(userRef, updateFields);
      } catch (err) {
        console.error('Error unlocking free game:', err);
      }
    }
    
    setToastMsg('Game successfully unlocked ✨')
    setTimeout(() => setToastMsg(null), 3000)
    navigate(targetPath)
  }

  const handleDirectDonate = () => {
    const amount = customAmount ? parseInt(customAmount) : selectedPreset
    if (amount < 50) {
      alert("The minimum contribution amount is ₹50.")
      return
    }
    setUnlockType('donation')
    handleUnlock(amount)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    const newErrors = {}
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Resolve name dynamically with helper (if empty or provided)
    const finalSupporterName = getSupporterDisplayName(user, formData.name)

    // Save details
    localStorage.setItem('hp_supporter_name', finalSupporterName)
    localStorage.setItem('hp_supporter_mobile', formData.mobile.trim())
    localStorage.setItem('hp_supporter_email', formData.email.trim())
    localStorage.setItem('hp_user_name', finalSupporterName)
    localStorage.setItem('hp_user_mobile', formData.mobile.trim())
    localStorage.setItem('hp_user_email', formData.email.trim())

    localStorage.setItem('hp_unlock_type', unlockType)
    localStorage.setItem('hp_pending_price', pendingPrice.toString())
    localStorage.setItem('hp_pending_game_id', pendingGameId)
    localStorage.setItem('hp_pending_game_title', pendingGameTitle)
    localStorage.setItem('hp_pending_game_path', pendingGamePath)

    // Redirect to direct support payment page
    setIsModalOpen(false)
    navigate('/direct-payment')
  }

  const show = (key) => activeTab === 'all' || activeTab === key

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent', color: '#332211', position: 'relative' }}>
      <Navbar />

      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: 80,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#8C4F1A',
              color: '#FFF',
              padding: '12px 24px',
              borderRadius: '99px',
              fontWeight: 800,
              fontSize: '12px',
              zIndex: 9999,
              boxShadow: '0 8px 32px rgba(140, 79, 26, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Check size={14} /> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <main style={{ flex: 1, width: '100%', paddingBottom: 120 }}>
        

        {/* ── PREMIUM FILTER PILLS (Replaces Sidebar) ── */}
        <div id="tab-container" style={{ maxWidth: 1360, margin: '80px auto 0', padding: '0 48px', textAlign: 'center', boxSizing: 'border-box' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(139,94,52,0.06)', border: '1px solid rgba(139,94,52,0.12)',
            borderRadius: 99, padding: '6px 18px', marginBottom: 20
          }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: '#8B5E34', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Discovery Portal
            </span>
          </div>

          <h2 className="premium-title-lg" style={{ textAlign: 'center' }}>
            Unlock Joy While{' '}
            <span className="text-gradient-animate">
              Healing ❤️
            </span>
          </h2>

          <p style={{ 
            margin: '0 auto 40px', 
            maxWidth: 560, 
            fontSize: '16.5px', 
            color: '#7A6A58', 
            fontWeight: 500, 
            lineHeight: 1.7 
          }}>
            Direct support contributions to Janamithra's medical fund while gaining access to surprise wellness rewards, immersive minimal games, and stories.
          </p>

          <div style={{ 
            display: 'inline-flex', 
            gap: 10, 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'rgba(235, 224, 214, 0.25)',
            padding: '8px',
            borderRadius: '24px',
            border: '1px solid rgba(235, 224, 214, 0.4)',
            flexWrap: 'wrap'
          }}>
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  padding: '12px 26px',
                  borderRadius: '18px',
                  border: 'none',
                  background: activeTab === id ? '#fff' : 'transparent',
                  color: activeTab === id ? '#8B5E34' : '#7A6A5A',
                  fontWeight: 700,
                  fontSize: 13.5,
                  cursor: 'pointer',
                  boxShadow: activeTab === id ? '0 6px 16px rgba(139, 94, 52, 0.06)' : 'none',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── CENTRALIZED CONTENT GRID ── */}
        <div className="main-grid-container" style={{ maxWidth: 1360, margin: '56px auto 0', padding: '0 48px', boxSizing: 'border-box' }}>
          
          {/* ────────────────── 1. GAMES SECTION ────────────────── */}
          {show('games') && (
            <section style={{ marginBottom: 90 }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                textAlign: 'center', 
                marginBottom: 36,
                padding: '24px 0',
                background: 'radial-gradient(50% 50% at 50% 50%, rgba(235, 224, 214, 0.15) 0%, rgba(255, 255, 255, 0) 100%)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(139,94,52,0.06)', border: '1px solid rgba(139,94,52,0.12)',
                  borderRadius: 99, padding: '6px 18px', marginBottom: 20
                }}>
                  <span style={{ fontSize: 11, fontWeight: 900, color: '#8B5E34', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Interactive Healing Moments
                  </span>
                </div>

                <h3 className="premium-title-md">
                  Healing Through{' '}
                  <span className="text-gradient-animate">
                    Play 🎮
                  </span>
                </h3>

                <p style={{ 
                  margin: '0 auto 24px', 
                  fontSize: '16px', 
                  color: '#7A6A58', 
                  maxWidth: 540, 
                  lineHeight: 1.7, 
                  fontWeight: 500 
                }}>
                  Calm your mind with interactive micro-games while direct funding life-saving treatments.
                </p>
                <div style={{ height: '1px', width: '60px', background: 'rgba(139, 94, 52, 0.25)', marginTop: 16 }} />
              </div>

              <div 
                className="games-card-grid"
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
                  gap: 32 
                }}
              >
                {PREMIUM_GAMES.map((game) => {
                  const isUnlocked = game.price === 0 || unlockedGames.includes(game.id)
                  
                  let targetPath = '/';
                  if (game.id === 'sound-wave-serenade') targetPath = '/sound-wave-serenade';
                  else if (game.id === 'breathe-bloom') targetPath = '/breathe-bloom';
                  else if (game.id === 'bio-path-tracer') targetPath = '/bio-path-tracer';
                  else if (game.id === 'therapeutic-path-matrix') targetPath = '/therapeutic-path-matrix';
                  else if (game.id === 'flex-path') targetPath = '/flex-path';
                  else if (game.id === 'luxe-xo') targetPath = '/luxe-xo';
                  else if (game.id === 'mind-flip') targetPath = '/mind-flip';
                  else if (game.id === 'pulse-reflex') targetPath = '/pulse-reflex';
                  else if (game.id === 'mind-slide') targetPath = '/mind-slide';

                  return (
                    <motion.div
                      key={game.id}
                      className="premium-game-card"
                      whileHover={isUnlocked ? { 
                        y: -8, 
                        boxShadow: '0 24px 48px rgba(122, 78, 43, 0.12), 0 4px 12px rgba(0, 0, 0, 0.03)' 
                      } : {}}
                      onClick={() => {
                        if (!isUnlocked && game.price > 0) {
                          setUnlockType('game');
                          handleUnlock(game.price, targetPath, game.id, game.title);
                        } else if (game.price === 0 && !unlockedGames.includes(game.id)) {
                          handleFreeGameUnlock(game.id, game.title, targetPath);
                        } else {
                          navigate(targetPath);
                        }
                      }}
                      style={{
                        background: '#FFFFFF',
                        border: isUnlocked ? '1px solid rgba(220, 208, 195, 0.7)' : '1px solid rgba(220, 208, 195, 0.4)',
                        borderRadius: '32px',
                        boxShadow: '0 12px 36px rgba(122, 78, 43, 0.06), 0 2px 8px rgba(0, 0, 0, 0.02)',
                        overflow: 'hidden',
                        cursor: isUnlocked ? 'pointer' : 'default',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        minHeight: 410,
                        position: 'relative'
                      }}
                    >
                      {/* Locked Overlay */}
                      {!isUnlocked && (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(255, 253, 251, 0.65)',
                          backdropFilter: 'blur(2px)',
                          zIndex: 10,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          pointerEvents: 'none'
                        }}>
                          <div style={{
                            background: 'linear-gradient(135deg, #FAF4EE, #F2ECE4)',
                            border: '1px solid #EADFCF',
                            padding: '12px',
                            borderRadius: '50%',
                            boxShadow: '0 8px 24px rgba(122, 78, 43, 0.15)'
                          }}>
                            <Lock size={24} color="#8B5E34" />
                          </div>
                        </div>
                      )}

                      {/* SVG Illustration Container */}
                      <div 
                        className="game-card-illustration-container"
                        style={{ 
                          height: 160, 
                          background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.45) 100%)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          padding: 20,
                          borderBottom: '1px solid rgba(235, 224, 214, 0.3)',
                          opacity: isUnlocked ? 1 : 0.6
                        }}
                      >
                        <div style={{ width: '100%', height: '100%', maxWidth: 120, maxHeight: 120 }}>
                          {game.illustration}
                        </div>
                      </div>

                      <div 
                        className="game-card-body"
                        style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 20 }}
                      >
                        <div>
                          <h4 
                            className="game-card-title"
                            style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: '#4A3427', fontFamily: 'Outfit' }}
                          >
                            {game.title}
                          </h4>
                          <p 
                            className="game-card-description"
                            style={{ margin: 0, fontSize: '13.5px', color: '#7A6A5A', lineHeight: 1.75, fontWeight: 500 }}
                          >
                            {game.description}
                          </p>
                        </div>

                        <div 
                          className="game-card-footer"
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(235, 224, 214, 0.4)', paddingTop: '16px', position: 'relative', zIndex: 11 }}
                        >
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#8B5E34', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {game.price === 0 ? 'Free Experience' : (isUnlocked ? 'Unlocked' : `₹${game.price} Entry Code`)}
                          </span>
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="game-card-cta-button"
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 6, 
                              color: isUnlocked ? '#fff' : '#6F4D2E', 
                              fontWeight: 700, 
                              fontSize: '12.5px',
                              background: isUnlocked ? 'linear-gradient(135deg, #9A673A, #7A4E2B)' : '#F5F1EB',
                              border: isUnlocked ? 'none' : '1px solid #EADFCF',
                              padding: '10px 20px',
                              borderRadius: '14px',
                              boxShadow: isUnlocked ? 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 6px 16px rgba(122, 78, 43, 0.16)' : 'none',
                              cursor: 'pointer'
                            }}
                            onClick={(e) => {
                              if (!isUnlocked && game.price > 0) {
                                e.stopPropagation();
                                setUnlockType('game');
                                handleUnlock(game.price, targetPath, game.id, game.title);
                              } else if (game.price === 0 && !unlockedGames.includes(game.id)) {
                                e.stopPropagation();
                                handleFreeGameUnlock(game.id, game.title, targetPath);
                              }
                            }}
                          >
                            <span>{isUnlocked ? 'Start Playing' : `Unlock for ₹${game.price}`}</span>
                            {isUnlocked && <ChevronRight size={13} />}
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </section>
          )}

          {/* ────────────────── 2. COUPONS / MYSTERY REWARDS SECTION ────────────────── */}
          {show('coupons') && (
            <section style={{ marginBottom: 90 }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                textAlign: 'center', 
                marginBottom: 36,
                padding: '24px 0',
                background: 'radial-gradient(50% 50% at 50% 50%, rgba(235, 224, 214, 0.15) 0%, rgba(255, 255, 255, 0) 100%)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(139,94,52,0.06)', border: '1px solid rgba(139,94,52,0.12)',
                  borderRadius: 99, padding: '6px 18px', marginBottom: 20
                }}>
                  <span style={{ fontSize: 11, fontWeight: 900, color: '#8B5E34', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Curated Mystery Rewards
                  </span>
                </div>

                <h3 className="premium-title-md">
                  Play With{' '}
                  <span className="text-gradient-animate">
                    Purpose 🎁
                  </span>
                </h3>

                <p style={{ 
                  margin: '0 auto 24px', 
                  fontSize: '16px', 
                  color: '#7A6A58', 
                  maxWidth: 540, 
                  lineHeight: 1.7, 
                  fontWeight: 500 
                }}>
                  Unlock hidden surprise brand vouchers securely. Brand reward codes are kept completely secret before payment.
                </p>
                <div style={{ height: '1px', width: '60px', background: 'rgba(139, 94, 52, 0.25)', marginTop: 16 }} />
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
                gap: 32 
              }}>
                {activeCoupons.map((reward) => {
                  const isCouponUnlocked = userData?.unlockedCoupons?.some(c => c.id === reward.id) || false;
                  const isOutOfStock = reward.remainingStock !== undefined && reward.remainingStock <= 0;

                  return (
                    <motion.div
                      key={reward.id}
                      whileHover={isOutOfStock ? {} : { 
                        y: -8, 
                        boxShadow: '0 24px 48px rgba(122, 78, 43, 0.12), 0 4px 12px rgba(0, 0, 0, 0.03)' 
                      }}
                      onClick={() => {
                        if (!isOutOfStock) {
                          navigate(`/coupon/${reward.id}`);
                        }
                      }}
                      className="coupon-card"
                      style={{
                        background: '#FFFFFF',
                        border: isOutOfStock ? '1px solid rgba(220, 208, 195, 0.4)' : '1px solid rgba(220, 208, 195, 0.7)',
                        borderRadius: '32px',
                        boxShadow: '0 12px 36px rgba(122, 78, 43, 0.06), 0 2px 8px rgba(0, 0, 0, 0.02)',
                        overflow: 'hidden',
                        cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        position: 'relative',
                        minHeight: 410,
                        opacity: isOutOfStock ? 0.65 : 1,
                        filter: isOutOfStock ? 'grayscale(40%)' : 'none'
                      }}
                  >
                    {/* Blurred Secret Preview Area */}
                    <div style={{ 
                      height: 160, 
                      background: reward.blurBg, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      borderBottom: '1px solid rgba(235, 224, 214, 0.3)'
                    }}>
                      <div className="shimmer-bg" style={{ position: 'absolute', inset: 0, opacity: 0.15 }} />
                      
                      {/* Realtime stock / unlock counts badges */}
                      <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                        {/* Remaining Stock Badge */}
                        {reward.remainingStock !== undefined && (
                          isOutOfStock ? (
                            <span style={{
                              background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5',
                              fontSize: '9px', fontWeight: 900, textTransform: 'uppercase',
                              padding: '3px 8px', borderRadius: '8px', letterSpacing: '0.04em'
                            }}>
                              Out of Stock
                            </span>
                          ) : reward.remainingStock <= 20 ? (
                            <span style={{
                              background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A',
                              fontSize: '9px', fontWeight: 900, textTransform: 'uppercase',
                              padding: '3px 8px', borderRadius: '8px', letterSpacing: '0.04em'
                            }}>
                              Only {reward.remainingStock} left!
                            </span>
                          ) : (
                            <span style={{
                              background: 'rgba(255, 255, 255, 0.85)', color: '#4A3427', border: '1px solid rgba(139, 94, 52, 0.15)',
                              fontSize: '9px', fontWeight: 700,
                              padding: '3px 8px', borderRadius: '8px', backdropFilter: 'blur(4px)'
                            }}>
                              {reward.remainingStock} left
                            </span>
                          )
                        )}
                        
                        {/* Unlocked Count Social Proof Badge */}
                        {reward.unlockedCount !== undefined && reward.unlockedCount > 0 && (
                          <span style={{
                            background: 'rgba(255, 255, 255, 0.85)', color: '#8C4F1A', border: '1px solid rgba(139, 94, 52, 0.15)',
                            fontSize: '9px', fontWeight: 700,
                            padding: '3px 8px', borderRadius: '8px', backdropFilter: 'blur(4px)'
                          }}>
                            Unlocked {reward.unlockedCount}x
                          </span>
                        )}
                      </div>
                      
                      {/* Blurred teaser gift card */}
                      <div style={{
                        width: 150,
                        height: 90,
                        background: 'rgba(255, 255, 255, 0.45)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '14px',
                        border: '1px solid rgba(255, 255, 255, 0.7)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '12px',
                        boxShadow: '0 8px 24px rgba(139, 94, 52, 0.03)',
                        transform: 'rotate(-4deg)',
                        transition: 'all 0.3s'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 9.5, fontWeight: 800, color: reward.accentColor, opacity: 0.75, letterSpacing: '0.04em' }}>MYSTERY GIFT</span>
                          <Lock size={10.5} color={reward.accentColor} />
                        </div>
                        <div style={{ textAlign: 'center', margin: '4px 0' }}>
                          <span style={{ fontSize: 19, fontWeight: 900, color: '#8B5E34', opacity: 0.3, letterSpacing: '2px', filter: 'blur(1.5px)' }}>
                            ✨?✨
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 9.5, fontWeight: 700, color: '#8B5E34' }}>₹?? Worth</span>
                          <div style={{ width: 12, height: 12, borderRadius: '50%', background: reward.accentColor, opacity: 0.6 }} />
                        </div>
                      </div>

                      {/* Lock Icon Badge */}
                      <div style={{
                        position: 'absolute',
                        bottom: 16,
                        background: '#FAF6F0',
                        border: '1px solid rgba(139, 94, 52, 0.15)',
                        padding: '5px 12px',
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}>
                        <Lock size={11.5} color="#8B5E34" />
                        <span style={{ fontSize: 10, fontWeight: 800, color: '#8B5E34', letterSpacing: '0.02em', textTransform: 'uppercase' }}>{isOutOfStock ? 'EXHAUSTED' : 'SECURE REVEAL'}</span>
                      </div>
                    </div>

                    <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column', justifySelf: 'space-between', justifyContent: 'space-between', gap: 20 }}>
                      <div>
                        <h4 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: '#4A3427', fontFamily: 'Outfit' }}>
                          {isCouponUnlocked ? reward.title : '🎁 Premium Mystery Reward'}
                        </h4>
                        <p style={{ margin: 0, fontSize: '13.5px', color: '#7A6A5A', lineHeight: 1.75, fontWeight: 500 }}>
                          {isCouponUnlocked ? reward.description : 'Unlock this exclusive mystery reward to support Janamithra and reveal a premium discount voucher code from one of our luxury wellness brand partners.'}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(235, 224, 214, 0.4)', paddingTop: '16px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#8B5E34', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {isOutOfStock ? 'Sold Out' : (isCouponUnlocked ? 'Unlocked' : `₹${reward.unlockAmount ?? reward.price} Reward Code`)}
                        </span>
                        <motion.div 
                          whileHover={isOutOfStock ? {} : { scale: 1.02 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isOutOfStock) {
                              navigate(`/coupon/${reward.id}`);
                            }
                          }}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 6, 
                            color: isOutOfStock ? '#71717A' : (isCouponUnlocked ? '#8C4F1A' : '#fff'), 
                            fontWeight: 700, 
                            fontSize: '12.5px',
                            background: isOutOfStock ? '#E4E4E7' : (isCouponUnlocked ? '#FAF6F0' : 'linear-gradient(135deg, #8C4F1A, #C8773A)'),
                            border: isOutOfStock ? '1px solid #D4D4D8' : (isCouponUnlocked ? '1px solid #EADFCF' : 'none'),
                            padding: '10px 20px',
                            borderRadius: '14px',
                            boxShadow: isOutOfStock || isCouponUnlocked ? 'none' : 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 6px 16px rgba(122, 78, 43, 0.16)',
                            cursor: isOutOfStock ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <span>{isOutOfStock ? 'Out of Stock' : (isCouponUnlocked ? 'View Coupon' : `Unlock for ₹${reward.unlockAmount ?? reward.price}`)}</span>
                          <ChevronRight size={13} />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
              </div>
            </section>
          )}

          {/* ────────────────── 3. QUOTES & INSPIRATION SECTION ────────────────── */}
          {show('quotes') && (
            <section style={{ marginBottom: 90 }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                textAlign: 'center', 
                marginBottom: 36,
                padding: '24px 0',
                background: 'radial-gradient(50% 50% at 50% 50%, rgba(235, 224, 214, 0.15) 0%, rgba(255, 255, 255, 0) 100%)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(139,94,52,0.06)', border: '1px solid rgba(139,94,52,0.12)',
                  borderRadius: 99, padding: '6px 18px', marginBottom: 20
                }}>
                  <span style={{ fontSize: 11, fontWeight: 900, color: '#8B5E34', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Healing Capsules
                  </span>
                </div>

                <h3 className="premium-title-md">
                  Mindful Healing{' '}
                  <span className="text-gradient-animate">
                    Games ✨
                  </span>
                </h3>

                <p style={{ 
                  margin: '0 auto 24px', 
                  fontSize: '16px', 
                  color: '#7A6A58', 
                  maxWidth: 540, 
                  lineHeight: 1.7, 
                  fontWeight: 500 
                }}>
                  Unlock heartwarming gratitude messages, survivor audio stories, and positive pediatric recovery journals.
                </p>
                <div style={{ height: '1px', width: '60px', background: 'rgba(139, 94, 52, 0.25)', marginTop: 16 }} />
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
                gap: 32 
              }}>
                {INSPIRATIONAL_CARDS.map((card, idx) => (
                  <motion.div
                    key={idx}
                    className="quotes-card"
                    whileHover={{ 
                      y: -8, 
                      boxShadow: '0 24px 48px rgba(122, 78, 43, 0.12), 0 4px 12px rgba(0, 0, 0, 0.03)' 
                    }}
                    onClick={() => navigate(`/reveal-message/${idx}`)}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '32px',
                      padding: '36px',
                      cursor: 'pointer',
                      border: '1px solid rgba(220, 208, 195, 0.7)',
                      boxShadow: '0 12px 36px rgba(122, 78, 43, 0.06), 0 2px 8px rgba(0, 0, 0, 0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: 280,
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <span style={{ fontSize: '9.5px', fontWeight: 800, color: card.accent, letterSpacing: '0.05em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.7)', padding: '4px 10px', borderRadius: '8px', border: `1px solid rgba(235, 224, 214, 0.3)` }}>
                          {card.tag}
                        </span>
                        
                        <div style={{
                          background: '#FAF6F0',
                          border: '1px solid rgba(139, 94, 52, 0.15)',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}>
                          <Lock size={10} color="#8B5E34" />
                          <span style={{ fontSize: 9, fontWeight: 800, color: '#8B5E34', letterSpacing: '0.02em' }}>LOCKED</span>
                        </div>
                      </div>

                      <h4 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: 700, color: '#4A3427', fontFamily: 'Outfit', lineHeight: 1.4 }}>
                        {card.title}
                      </h4>
                      
                      {/* Premium locked mask layout */}
                      <div style={{ margin: '14px 0 0', position: 'relative' }}>
                        <p style={{ margin: '0 0 12px', fontSize: '13.5px', color: '#7A6A5A', lineHeight: 1.7, fontWeight: 600, fontStyle: 'italic' }}>
                          “{card.curiosity}”
                        </p>
                        
                        {/* Elegant blurred mockup text */}
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#A8998A', 
                          letterSpacing: '3px', 
                          filter: 'blur(3.5px)', 
                          userSelect: 'none', 
                          opacity: 0.45,
                          lineHeight: 1.8
                        }}>
                          •••••••••••• •••••••••••• •••••••••••• •••••••••••• •••••••••••• ••••••••••••
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(235, 224, 214, 0.4)' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#8B5E34', letterSpacing: '0.04em' }}>₹{card.price} Contribution</span>
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 6, 
                          color: '#fff', 
                          fontWeight: 700, 
                          fontSize: '12.5px',
                          background: 'linear-gradient(135deg, #9A673A, #7A4E2B)',
                          padding: '10px 20px',
                          borderRadius: '14px',
                          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 6px 16px rgba(122, 78, 43, 0.16)'
                        }}
                      >
                        <span>Reveal Healing Message</span>
                        <ChevronRight size={13} />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ────────────────── 4. FREE TO HELP SECTION ────────────────── */}
          {show('free-help') && (
            <section style={{ marginBottom: 110, maxWidth: 840, margin: '0 auto 110px' }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                textAlign: 'center', 
                marginBottom: 36,
                padding: '24px 0',
                background: 'radial-gradient(50% 50% at 50% 50%, rgba(235, 224, 214, 0.15) 0%, rgba(255, 255, 255, 0) 100%)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(139,94,52,0.06)', border: '1px solid rgba(139,94,52,0.12)',
                  borderRadius: 99, padding: '6px 18px', marginBottom: 20
                }}>
                  <span style={{ fontSize: 11, fontWeight: 900, color: '#8B5E34', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Simple Pure Support
                  </span>
                </div>

                <h3 style={{ 
                  fontFamily: 'Outfit', 
                  fontWeight: 900, 
                  fontSize: 'clamp(32px, 4.5vw, 48px)', 
                  color: '#3D2B1A', 
                  margin: '0 0 12px', 
                  letterSpacing: '-1.8px', 
                  lineHeight: 1.15 
                }}>
                  Help Without{' '}
                  <span style={{ background: 'linear-gradient(135deg, #8B5E34, #C8773A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Rewards ❤️
                  </span>
                </h3>

                <p style={{ 
                  margin: '0 auto 24px', 
                  fontSize: '16px', 
                  color: '#7A6A58', 
                  maxWidth: 540, 
                  lineHeight: 1.7, 
                  fontWeight: 500 
                }}>
                  Every single rupee goes directly towards Janamithra's medical balance sheet at the hospital billing desk.
                </p>
                <div style={{ height: '1px', width: '60px', background: 'rgba(139, 94, 52, 0.25)', marginTop: 16 }} />
              </div>

              <div className="free-help-card" style={{
                background: '#FFFFFF',
                border: '1px solid rgba(220, 208, 195, 0.7)',
                borderRadius: '36px',
                padding: '48px',
                boxShadow: '0 12px 36px rgba(122, 78, 43, 0.06), 0 2px 8px rgba(0, 0, 0, 0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#FFF2EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Heart size={22} color="#8B5E34" fill="#8B5E34" />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '19px', fontWeight: 700, color: '#4A3427', fontFamily: 'Outfit' }}>Direct Hospital Support</h4>
                      <p style={{ margin: '3px 0 0', fontSize: '13.5px', color: '#7A6A5A', fontWeight: 500 }}>Real-time pediatric ward treatment routing</p>
                    </div>
                  </div>

                  <div style={{
                    background: '#EAF5E2',
                    border: '1px solid rgba(71, 104, 44, 0.2)',
                    borderRadius: '12px',
                    padding: '6px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#47682C' }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#47682C', letterSpacing: '0.04em', textTransform: 'uppercase' }}>VERIFIED TERMINAL</span>
                  </div>
                </div>

                <label style={{ fontSize: '11px', fontWeight: 800, color: '#8B5E34', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 14 }}>
                  Select Contribution Amount
                </label>

                {/* Preset Chips */}
                <div className="preset-chips-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
                  {[100, 250, 500, 1000].map((preset) => {
                    const isSelected = selectedPreset === preset && !customAmount;
                    return (
                      <motion.button
                        key={preset}
                        whileHover={{ y: -2 }}
                        onClick={() => {
                          setSelectedPreset(preset)
                          setCustomAmount('')
                        }}
                        style={{
                          padding: '14px 0',
                          borderRadius: '16px',
                          border: isSelected ? 'none' : '1px solid rgba(235, 224, 214, 0.7)',
                          background: isSelected ? 'linear-gradient(135deg, #9A673A, #7A4E2B)' : '#fff',
                          color: isSelected ? '#fff' : '#7A6A5A',
                          fontWeight: 700,
                          fontSize: '14.5px',
                          cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                          boxShadow: isSelected 
                            ? 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 8px 16px rgba(122, 78, 43, 0.16)' 
                            : '0 2px 6px rgba(139, 94, 52, 0.02)'
                        }}
                      >
                        ₹{preset}
                      </motion.button>
                    );
                  })}
                </div>

                <div style={{ marginBottom: 32 }}>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#8B5E34', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 10 }}>
                    Or Enter Custom Amount (₹) — Min ₹50
                  </label>
                  <input
                    type="number"
                    min="50"
                    placeholder="Enter custom support amount (minimum ₹50)"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setSelectedPreset(0)
                    }}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      borderRadius: '16px',
                      border: '1px solid rgba(232, 224, 214, 0.8)',
                      fontSize: '15px',
                      fontWeight: 600,
                      boxSizing: 'border-box',
                      outline: 'none',
                      background: '#FFF',
                      color: '#4A3427',
                      transition: 'border-color 0.2s',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.01)'
                    }}
                  />
                </div>

                {/* Direct Hospital Trust Info Panel */}
                <div className="hospital-trust-panel" style={{
                  background: 'rgba(255, 255, 255, 0.45)',
                  border: '1px solid rgba(235, 224, 214, 0.5)',
                  borderRadius: '24px',
                  padding: '24px',
                  marginBottom: 32,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 20
                }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <Shield size={18} color="#8B5E34" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <h5 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#4A3427' }}>Direct Hospital Support Guarantee</h5>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: '#7A6A5A', lineHeight: 1.6 }}>100% of contributions land directly inside Janamithra\'s pre-op stabilization billing account (Fortis ID #F89410).</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <Shield size={18} color="#47682C" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <h5 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#47682C' }}>Public Ledger Ledgering</h5>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: '#7A6A5A', lineHeight: 1.6 }}>Real-time cryptographic audit trail verified. Public records index is open to every gameplay micro-donator.</p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  onClick={handleDirectDonate}
                  style={{
                    width: '100%',
                    padding: '18px',
                    borderRadius: '18px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #9A673A, #7A4E2B)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '15px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 8px 24px rgba(122, 78, 43, 0.18)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <Heart size={16} fill="#fff" />
                  <span>Contribute Freely</span>
                </motion.button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 20, fontSize: '11px', color: '#7C6B5B', fontWeight: 600 }}>
                  <Shield size={12} color="#47682C" />
                  <span>100% Direct Hospital Payout routing. Public Ledger Verified.</span>
                </div>
              </div>
            </section>
          )}



          {/* Audit Verification Block */}
          <div style={{ 
            background: 'linear-gradient(135deg, #FFF9F3 0%, #FAF0E6 100%)', 
            borderRadius: '24px', 
            padding: '24px 32px', 
            border: '1px solid rgba(232, 224, 214, 0.6)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap', 
            gap: 16,
            marginTop: 64,
            boxShadow: '0 4px 20px rgba(140, 79, 26, 0.01)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13.5, color: '#5C4C3C', fontWeight: 500 }}>
              <Shield size={18} color="#8C4F1A" />
              <span>100% of your micro-donation goes directly towards Janamithra\'s medical fund balance. Zero corporate hidden commissions.</span>
            </div>
            <button style={{ background: 'none', border: 'none', fontSize: 13.5, fontWeight: 800, color: '#8C4F1A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>Auditing Dashboard</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </main>

      {/* ── PREMIUM CENTER MODAL POPUP ── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(26, 17, 10, 0.45)', // dark transparent warm backdrop
              backdropFilter: 'blur(8px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              boxSizing: 'border-box'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.45, bounce: 0.15 }}
              onClick={(e) => e.stopPropagation()} // Prevent close on modal body click
              style={{
                background: 'rgba(255, 253, 250, 0.94)', // soft cream glassmorphism
                border: '1px solid rgba(139, 94, 52, 0.22)',
                boxShadow: '0 24px 60px rgba(74, 52, 39, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                borderRadius: '28px',
                width: '100%',
                maxWidth: '520px',
                padding: '36px',
                boxSizing: 'border-box',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                color: '#3D2B1A'
              }}
            >
              {/* Close Button in corner */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(139, 94, 52, 0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#8B5E34',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 94, 52, 0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(139, 94, 52, 0.08)'}
              >
                <X size={16} />
              </button>

              {/* Modal Title Block */}
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#8B5E34', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
                  <Sparkles size={12} /> Healing Contribution
                </span>
                <h2 className="premium-title-sm" style={{ margin: '0 0 8px' }}>
                  Before Unlocking ✨
                </h2>
                <p style={{ margin: 0, fontSize: '14px', color: '#7A6A5A', lineHeight: 1.5, fontWeight: 500 }}>
                  Help us generate your personalized contribution certificate after support.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Full Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#5A4635', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Full Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Priyanshu Sharma"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      if (errors.name) setErrors({ ...errors, name: '' })
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '16px',
                      border: errors.name ? '1.5px solid #E11D48' : '1px solid rgba(139, 94, 52, 0.25)',
                      background: '#FFFFFF',
                      boxShadow: 'inset 0 2px 4px rgba(74, 52, 39, 0.02)',
                      fontSize: '14.5px',
                      color: '#3D2B1A',
                      outline: 'none',
                      fontFamily: 'Outfit',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease'
                    }}
                  />
                  {errors.name && <span style={{ fontSize: '11.5px', color: '#E11D48', fontWeight: 600 }}>{errors.name}</span>}
                </div>

                {/* Mobile Number */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#5A4635', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Mobile Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '16px',
                      border: '1px solid rgba(139, 94, 52, 0.25)',
                      background: '#FFFFFF',
                      boxShadow: 'inset 0 2px 4px rgba(74, 52, 39, 0.02)',
                      fontSize: '14.5px',
                      color: '#3D2B1A',
                      outline: 'none',
                      fontFamily: 'Outfit',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease'
                    }}
                  />
                </div>

                {/* Email Address */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#5A4635', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email Address *</label>
                  <input
                    type="email"
                    placeholder="e.g. priyanshu@gmail.com"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      if (errors.email) setErrors({ ...errors, email: '' })
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '16px',
                      border: errors.email ? '1.5px solid #E11D48' : '1px solid rgba(139, 94, 52, 0.25)',
                      background: '#FFFFFF',
                      boxShadow: 'inset 0 2px 4px rgba(74, 52, 39, 0.02)',
                      fontSize: '14.5px',
                      color: '#3D2B1A',
                      outline: 'none',
                      fontFamily: 'Outfit',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s ease'
                    }}
                  />
                  {errors.email && <span style={{ fontSize: '11.5px', color: '#E11D48', fontWeight: 600 }}>{errors.email}</span>}
                </div>

                {/* Dynamic Transparent Contribution Breakdown */}
                <div style={{ marginTop: '4px', marginBottom: '8px' }}>
                  <TransparentBreakdown amount={pendingPrice || 10} />
                </div>

                {/* Secure disclaimer */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', background: 'rgba(139, 94, 52, 0.04)', padding: '12px 14px', borderRadius: '12px', border: '1px dashed rgba(139, 94, 52, 0.15)', marginTop: '4px' }}>
                  <Shield size={14} color="#8B5E34" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <p style={{ margin: 0, fontSize: '11.5px', color: '#7A6A5A', lineHeight: 1.45, fontWeight: 500 }}>
                    Your details are securely used for contribution acknowledgment and certificate generation only.
                  </p>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: 12, marginTop: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: '99px',
                      border: '1px solid rgba(139, 94, 52, 0.25)',
                      background: '#FFFFFF',
                      color: '#7A6A5A',
                      fontSize: '14.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'Outfit',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(139, 94, 52, 0.04)'
                      e.currentTarget.style.color = '#3D2B1A'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#FFFFFF'
                      e.currentTarget.style.color = '#7A6A5A'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1.4,
                      padding: '14px',
                      borderRadius: '99px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #8C4F1A, #C8773A)',
                      color: '#FFFFFF',
                      fontSize: '14.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'Outfit',
                      boxShadow: '0 8px 24px rgba(140, 79, 26, 0.22)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 12px 30px rgba(140, 79, 26, 0.35)'
                      e.currentTarget.style.filter = 'brightness(1.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(140, 79, 26, 0.22)'
                      e.currentTarget.style.filter = 'none'
                    }}
                  >
                    Continue to ₹{pendingPrice} Support
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

      {/* Shimmer animations */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-bg {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 100%);
          background-size: 200% 100%;
          animation: shimmer 3.5s infinite linear;
        }
        @media (max-width: 960px) {
          .banner-fluid-padding {
            padding: 16px 20px !important;
          }
        }
        @media (max-width: 768px) {
          #tab-container { margin: 24px auto 0 !important; padding: 0 16px !important; }
          .main-grid-container {
            margin: 24px auto 0 !important;
            padding: 0 16px !important;
          }
          .free-help-card {
            padding: 24px 16px !important;
            border-radius: 24px !important;
          }
          .preset-chips-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
            margin-bottom: 24px !important;
          }
          .hospital-trust-panel {
            padding: 16px !important;
            border-radius: 18px !important;
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            margin-bottom: 24px !important;
          }
          .coupon-card {
            border-radius: 20px !important;
          }
          .coupon-card > div:last-child {
            padding: 20px 16px !important;
          }
          .quotes-card {
            padding: 20px 16px !important;
            border-radius: 20px !important;
            min-height: 240px !important;
          }
          .main-tabs-row { overflow-x: auto; -webkit-overflow-scrolling: touch; flex-wrap: nowrap !important; gap: 8px !important; }
          .main-tabs-row button { flex-shrink: 0; white-space: nowrap; }
          .games-card-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .coupon-card-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .quotes-card-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .donation-section-inner { padding: 24px 16px !important; }
          .direct-donation-amounts { flex-wrap: wrap !important; gap: 8px !important; }
          .direct-donation-amounts button { flex: 1 1 calc(50% - 8px) !important; min-width: 80px !important; }
          
          /* Premium mobile game cards styling overrides */
          .premium-game-card {
            min-height: 420px !important;
            height: 420px !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .game-card-illustration-container {
            height: 140px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 16px !important;
            flex-shrink: 0 !important;
          }
          .game-card-body {
            padding: 20px !important;
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            gap: 12px !important;
            box-sizing: border-box !important;
          }
          .game-card-title {
            margin: 0 0 6px 0 !important;
            font-size: 17px !important;
          }
          .game-card-description {
            min-height: 72px !important;
            max-height: 72px !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 3 !important;
            -webkit-box-orient: vertical !important;
            line-height: 1.6 !important;
            margin: 0 !important;
            font-size: 13px !important;
          }
          .game-card-footer {
            border-top: 1px solid rgba(235, 224, 214, 0.5) !important;
            padding-top: 12px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            flex-shrink: 0 !important;
          }
          .game-card-cta-button {
            padding: 8px 16px !important;
            font-size: 12px !important;
            border-radius: 12px !important;
            white-space: nowrap !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            min-width: 120px !important;
          }
        }
        @media (max-width: 480px) {
          .main-tabs-row { gap: 6px !important; }
          .main-tabs-row button { padding: 10px 14px !important; font-size: 13px !important; }
          .direct-donation-amounts button { flex: 1 1 calc(50% - 6px) !important; }
        }
      `}</style>
    </div>
  )
}
