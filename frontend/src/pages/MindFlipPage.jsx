import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Volume2, VolumeX, Award, Share2, Star, 
  RefreshCw, Trophy, Clock, Zap, Shield, Play, HelpCircle, 
  Sparkles, CheckCircle2, ChevronRight, Activity, Smile, Brain
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { GlobalBackground } from '../components/PremiumBackground'
import { addContribution } from '../services/contributionService'

// Solfeggio sound chimes for high-end psychoacoustic feedback
const SOLFEGGIO_FREQS = {
  click: 528.00, // 528Hz (Transformation & DNA Repair - clean chime)
  match: [528.00, 639.00, 741.00, 852.00], // Harmonic ascending chord
  mismatch: [396.00, 417.00], // Dual calming low frequency chord
  victory: [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50] // Glorious arpeggio symphony
}

// 18 Premium Minimalist Vector SVG symbols (sacred geometry, wellness icons)
const SYMBOLS = [
  // 1. Sacred Lotus Mandala
  (gradientId) => (
    <svg className="w-12 h-12" viewBox="0 0 100 100">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#C59B73" />
          <stop offset="100%" stopColor="#8B6239" />
        </linearGradient>
      </defs>
      <path
        d="M50 15 C55 35, 45 35, 50 15 Z M50 15 C65 30, 55 45, 50 15 Z M50 15 C35 30, 45 45, 50 15 Z
           M50 85 C55 65, 45 65, 50 85 Z M50 85 C65 70, 55 55, 50 85 Z M50 85 C35 70, 45 55, 50 85 Z
           M15 50 C35 55, 35 45, 15 50 Z M15 50 C30 65, 45 55, 15 50 Z M15 50 C30 35, 45 45, 15 50 Z
           M85 50 C65 55, 65 45, 85 50 Z M85 50 C70 65, 55 55, 85 50 Z M85 50 C70 35, 55 45, 85 50 Z"
        fill={`url(#${gradientId})`}
        stroke={`url(#${gradientId})`}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="50" r="10" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2" />
      <circle cx="50" cy="50" r="4" fill={`url(#${gradientId})`} />
    </svg>
  ),
  // 2. Infinite Knot (Eternal Connection)
  (gradientId) => (
    <svg className="w-12 h-12" viewBox="0 0 100 100">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0A96D" />
          <stop offset="100%" stopColor="#8B6239" />
        </linearGradient>
      </defs>
      <path
        d="M30 35 L70 65 C78 71, 78 81, 70 87 C62 93, 50 93, 42 87 L18 69 C10 63, 10 53, 18 47 L82 13"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M70 35 L30 65 C22 71, 22 81, 30 87 C38 93, 50 93, 58 87 L82 69 C90 63, 90 53, 82 47 L18 13"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  // 3. Zen Enso Circle
  (gradientId) => (
    <svg className="w-12 h-12" viewBox="0 0 100 100">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3A281A" />
          <stop offset="50%" stopColor="#8B6239" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
      </defs>
      <motion.path
        d="M 50,15 A 35,35 0 1,1 42,16"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="220"
        strokeDashoffset="10"
      />
      <circle cx="50" cy="50" r="3" fill="#3A281A" />
    </svg>
  ),
  // 4. Sacred Triquetra (Trinity Node)
  (gradientId) => (
    <svg className="w-12 h-12" viewBox="0 0 100 100">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B87333" />
          <stop offset="100%" stopColor="#5C2D0E" />
        </linearGradient>
      </defs>
      <path
        d="M50 18 C50 18, 25 55, 50 78 C75 55, 50 18, 50 18 Z"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M24 62 C24 62, 75 62, 50 22 C25 62, 24 62, 24 62 Z"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M76 62 C76 62, 25 62, 50 22 C75 62, 76 62, 76 62 Z"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="50" cy="54" r="18" fill="none" stroke={`url(#${gradientId})`} strokeWidth="3.5" />
    </svg>
  ),
  // 5. Crystalline Diamond of Focus
  (gradientId) => (
    <svg className="w-12 h-12" viewBox="0 0 100 100">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8C4F1A" />
          <stop offset="100%" stopColor="#EADFCF" />
        </linearGradient>
      </defs>
      <polygon
        points="50,12 82,38 82,62 50,88 18,62 18,38"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <line x1="50" y1="12" x2="50" y2="88" stroke={`url(#${gradientId})`} strokeWidth="2.5" />
      <line x1="18" y1="38" x2="82" y2="38" stroke={`url(#${gradientId})`} strokeWidth="2" />
      <line x1="18" y1="62" x2="82" y2="62" stroke={`url(#${gradientId})`} strokeWidth="2" />
      <line x1="50" y1="12" x2="18" y2="62" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
      <line x1="50" y1="12" x2="82" y2="62" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
      <line x1="50" y1="88" x2="18" y2="38" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
      <line x1="50" y1="88" x2="82" y2="38" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
    </svg>
  ),
  // 6. Symmetrical Ginkgo Leaf
  (gradientId) => (
    <svg className="w-12 h-12" viewBox="0 0 100 100">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#47682C" />
          <stop offset="100%" stopColor="#8B6239" />
        </linearGradient>
      </defs>
      <path
        d="M50 82 C50 68, 55 58, 68 50 C80 42, 85 30, 72 24 C58 18, 52 28, 50 34 C48 28, 42 18, 28 24 C15 30, 20 42, 32 50 C45 58, 50 68, 50 82 Z"
        fill={`url(#${gradientId})`}
        stroke={`url(#${gradientId})`}
        strokeWidth="1.5"
      />
      <path d="M50 34 L50 82" stroke="#FFF" strokeWidth="1.5" opacity="0.3" />
    </svg>
  ),
  // 7. Star Constellation Node
  (gradientId) => (
    <svg className="w-12 h-12" viewBox="0 0 100 100">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#3A281A" />
        </linearGradient>
      </defs>
      <path
        d="M50 15 L78 35 L68 75 L32 75 L22 35 Z"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="2.5"
        strokeDasharray="4, 4"
      />
      <line x1="50" y1="15" x2="50" y2="50" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
      <line x1="78" y1="35" x2="50" y2="50" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
      <line x1="68" y1="75" x2="50" y2="50" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
      <line x1="32" y1="75" x2="50" y2="50" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
      <line x1="22" y1="35" x2="50" y2="50" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
      
      <circle cx="50" cy="15" r="5.5" fill={`url(#${gradientId})`} />
      <circle cx="78" cy="35" r="5.5" fill={`url(#${gradientId})`} />
      <circle cx="68" cy="75" r="5.5" fill={`url(#${gradientId})`} />
      <circle cx="32" cy="75" r="5.5" fill={`url(#${gradientId})`} />
      <circle cx="22" cy="35" r="5.5" fill={`url(#${gradientId})`} />
      <circle cx="50" cy="50" r="7.5" fill={`url(#${gradientId})`} />
    </svg>
  ),
  // 8. Fibonacci Spiral
  (gradientId) => (
    <svg className="w-12 h-12" viewBox="0 0 100 100">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C59B73" />
          <stop offset="100%" stopColor="#6F4D2E" />
        </linearGradient>
      </defs>
      <path
        d="M50 50 A 2 2 0 0 1 50 46 A 4 4 0 0 1 54 50 A 8 8 0 0 1 50 58 A 16 16 0 0 1 34 50 A 32 32 0 0 1 50 18 A 64 64 0 0 1 82 50"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <circle cx="50" cy="50" r="3" fill="#6F4D2E" />
    </svg>
  ),
  // 9. Yin Yang Lotus
  (gradientId) => (
    <svg className="w-12 h-12" viewBox="0 0 100 100">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3A281A" />
          <stop offset="100%" stopColor="#FFFDF9" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="36" fill="none" stroke="#3A281A" strokeWidth="4" />
      <path d="M50 14 A 18 18 0 0 1 50 50 A 18 18 0 0 0 50 86 A 36 36 0 0 1 50 14 Z" fill="#3A281A" />
      <circle cx="50" cy="32" r="5" fill="#FFFDF9" />
      <path d="M50 14 A 18 18 0 0 1 50 50 A 18 18 0 0 0 50 86 A 36 36 0 0 0 50 14 Z" fill="none" />
      <circle cx="50" cy="68" r="5" fill="#3A281A" />
    </svg>
  ),
  // 10. Concentric Ripple Wave (Mindfulness)
  (gradientId) => (
    <svg className="w-12 h-12" viewBox="0 0 100 100">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2C5E8A" />
          <stop offset="100%" stopColor="#8B6239" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="36" fill="none" stroke={`url(#${gradientId})`} strokeWidth="1.5" strokeDasharray="6, 6" />
      <circle cx="50" cy="50" r="26" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2.5" strokeDasharray="3, 3" />
      <circle cx="50" cy="50" r="16" fill="none" stroke={`url(#${gradientId})`} strokeWidth="3.5" />
      <circle cx="50" cy="50" r="6" fill={`url(#${gradientId})`} />
    </svg>
  ),
  // 11. Sun Rays Mandala
  (gradientId) => (
    <svg className="w-12 h-12" viewBox="0 0 100 100">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFBF00" />
          <stop offset="100%" stopColor="#8B6239" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="18" fill="none" stroke={`url(#${gradientId})`} strokeWidth="4" />
      {Array.from({ length: 12 }).map((_, idx) => {
        const angle = (idx * 30 * Math.PI) / 180
        const x1 = 50 + Math.cos(angle) * 24
        const y1 = 50 + Math.sin(angle) * 24
        const x2 = 50 + Math.cos(angle) * 38
        const y2 = 50 + Math.sin(angle) * 38
        return (
          <line
            key={idx}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={`url(#${gradientId})`}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        )
      })}
    </svg>
  ),
  // 12. Celestial Crescent Moon & Star
  (gradientId) => (
    <svg className="w-12 h-12" viewBox="0 0 100 100">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E3A5F" />
          <stop offset="50%" stopColor="#8B6239" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
      </defs>
      <path
        d="M58 20 C36 20, 20 36, 20 58 C20 74, 30 88, 46 94 C34 86, 28 72, 28 58 C28 42, 38 28, 54 22 C55 21, 57 21, 58 20 Z"
        fill={`url(#${gradientId})`}
      />
      <polygon
        points="68,34 72,44 82,44 74,50 77,60 68,54 59,60 62,50 54,44 64,44"
        fill="#D4AF37"
        stroke="#8B6239"
        strokeWidth="0.8"
      />
    </svg>
  ),
  // 13. Neural Synapse (Constellation Node)
  (gradientId) => (
    <svg className="w-12 h-12" viewBox="0 0 100 100">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B6239" />
          <stop offset="100%" stopColor="#FFFDF9" />
        </linearGradient>
      </defs>
      <path d="M25 50 Q 50 30, 75 50 T 25 50" fill="none" stroke={`url(#${gradientId})`} strokeWidth="3" />
      <path d="M25 50 Q 50 70, 75 50 T 25 50" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2.5" />
      <circle cx="25" cy="50" r="7" fill={`url(#${gradientId})`} />
      <circle cx="50" cy="38" r="5" fill={`url(#${gradientId})`} />
      <circle cx="50" cy="62" r="5" fill={`url(#${gradientId})`} />
      <circle cx="75" cy="50" r="7" fill={`url(#${gradientId})`} />
    </svg>
  ),
  // 14. Triskelion Triple Spiral
  (gradientId) => (
    <svg className="w-12 h-12" viewBox="0 0 100 100">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B87333" />
          <stop offset="100%" stopColor="#5C2D0E" />
        </linearGradient>
      </defs>
      <path
        d="M50 50 A 12 12 0 0 1 38 62 A 12 12 0 0 1 26 50 A 12 12 0 0 1 38 38
           M50 50 A 12 12 0 0 1 62 38 A 12 12 0 0 1 74 50 A 12 12 0 0 1 62 62
           M50 50 A 12 12 0 0 1 50 26 A 12 12 0 0 1 62 14"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  ),
  // 15. Sacred Dodecahedron
  (gradientId) => (
    <svg className="w-12 h-12" viewBox="0 0 100 100">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6F4D2E" />
          <stop offset="100%" stopColor="#3A281A" />
        </linearGradient>
      </defs>
      <polygon
        points="50,15 80,35 80,65 50,85 20,65 20,35"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="3.5"
      />
      <polygon
        points="50,30 68,43 61,65 39,65 32,43"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="2.5"
      />
      <line x1="50" y1="15" x2="50" y2="30" stroke={`url(#${gradientId})`} strokeWidth="2.5" />
      <line x1="80" y1="35" x2="68" y2="43" stroke={`url(#${gradientId})`} strokeWidth="2.5" />
      <line x1="80" y1="65" x2="61" y2="65" stroke={`url(#${gradientId})`} strokeWidth="2.5" />
      <line x1="50" y1="85" x2="39" y2="65" stroke={`url(#${gradientId})`} strokeWidth="2.5" />
      <line x1="20" y1="65" x2="32" y2="43" stroke={`url(#${gradientId})`} strokeWidth="2.5" />
      <line x1="20" y1="35" x2="32" y2="43" stroke={`url(#${gradientId})`} strokeWidth="2.5" />
    </svg>
  ),
  // 16. Symmetrical Zen Butterfly Wings
  (gradientId) => (
    <svg className="w-12 h-12" viewBox="0 0 100 100">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FAF8F5" />
          <stop offset="50%" stopColor="#EADFCF" />
          <stop offset="100%" stopColor="#8B6239" />
        </linearGradient>
      </defs>
      <path
        d="M50 45 C50 45, 65 20, 75 35 C85 50, 60 60, 50 50 C40 60, 15 50, 25 35 C35 20, 50 45, 50 45 Z"
        fill={`url(#${gradientId})`}
        stroke="#8B6239"
        strokeWidth="1"
      />
      <path
        d="M50 52 C50 52, 60 70, 70 65 C80 60, 70 48, 50 52 C30 48, 20 60, 30 65 C40 70, 50 52, 50 52 Z"
        fill={`url(#${gradientId})`}
        stroke="#8B6239"
        strokeWidth="1"
      />
      <line x1="50" y1="26" x2="50" y2="76" stroke="#8B6239" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="22" r="3" fill="#8B6239" />
    </svg>
  ),
  // 17. Symmetrical Tree of Life
  (gradientId) => (
    <svg className="w-12 h-12" viewBox="0 0 100 100">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#47682C" />
          <stop offset="50%" stopColor="#8B6239" />
          <stop offset="100%" stopColor="#3A281A" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="38" fill="none" stroke={`url(#${gradientId})`} strokeWidth="3.5" />
      <path
        d="M50 78 Q 45 60, 50 50 Q 55 60, 50 78 Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M50 50 Q 30 45, 20 30 Q 35 35, 50 50 Z
           M50 50 Q 70 45, 80 30 Q 65 35, 50 50 Z
           M50 50 Q 40 35, 50 20 Q 60 35, 50 50 Z"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  // 18. Resonance Solfeggio Chime (Tuning Fork)
  (gradientId) => (
    <svg className="w-12 h-12" viewBox="0 0 100 100">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#FFFDFB" />
        </linearGradient>
      </defs>
      <path
        d="M38 25 L38 60 A 12 12 0 0 0 62 60 L62 25"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <line x1="50" y1="68" x2="50" y2="80" stroke={`url(#${gradientId})`} strokeWidth="8" strokeLinecap="round" />
      <circle cx="50" cy="85" r="5.5" fill={`url(#${gradientId})`} />
      
      {/* Soundwave vibration ripples */}
      <path d="M26 28 Q 18 38, 26 48" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
      <path d="M74 28 Q 82 38, 74 48" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
]

export default function MindFlipPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Game Settings States
  const [level, setLevel] = useState('Easy') // 'Easy' (3x2), 'Medium' (4x4), 'Hard' (6x6)
  const [mode, setMode] = useState('Solo') // 'Solo', 'Timed', 'Zen'
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Card & Board States
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([]) // Indices of currently flipped cards
  const [isProcessing, setIsProcessing] = useState(false) // Blocks clicks during evaluation/flips

  // HUD / Score Stats
  const [moves, setMoves] = useState(0)
  const [matchesCount, setMatchesCount] = useState(0)
  const [timer, setTimer] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [logs, setLogs] = useState(['MindFlip initialized. Select Zen, Solo, or Timed.'])
  const [savingReward, setSavingReward] = useState(false)
  
  // Best score tracker stored in localstorage
  const [bestScores, setBestScores] = useState(() => {
    const saved = localStorage.getItem('mindflip_best_scores')
    return saved ? JSON.parse(saved) : {
      Easy: { Solo: null, Timed: null },
      Medium: { Solo: null, Timed: null },
      Hard: { Solo: null, Timed: null }
    }
  })

  // Victory Overlay State
  const [winnerInfo, setWinnerInfo] = useState(null) // { level, moves, time, bestScoreUnlocked }
  const [confettiBurst, setConfettiBurst] = useState([])

  const audioContextRef = useRef(null)
  const timerIntervalRef = useRef(null)

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  // Save best scores to localStorage on update
  useEffect(() => {
    localStorage.setItem('mindflip_best_scores', JSON.stringify(bestScores))
  }, [bestScores])

  // Initialize board on load or level/mode change
  useEffect(() => {
    initGameBoard()
    return () => stopTimer()
  }, [level, mode])

  // Timer loop controller
  useEffect(() => {
    if (timerActive) {
      timerIntervalRef.current = setInterval(() => {
        setTimer(prev => {
          // If Timed Challenge mode, check for countdown limit
          if (mode === 'Timed') {
            const timeLimit = level === 'Easy' ? 25 : level === 'Medium' ? 60 : 120
            if (prev >= timeLimit) {
              handleGameOverLoss()
              return prev
            }
          }
          return prev + 1
        })
      }, 1000)
    } else {
      stopTimer()
    }
    return () => stopTimer()
  }, [timerActive, mode, level])

  // Audio system initializer
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
  }

  // Synthesize Solfeggio sound cues
  const playSound = (type) => {
    if (!soundEnabled) return
    initAudio()
    try {
      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const now = ctx.currentTime

      if (type === 'click') {
        const osc = ctx.createOscillator()
        const gainNode = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(SOLFEGGIO_FREQS.click, now)
        gainNode.gain.setValueAtTime(0, now)
        gainNode.gain.linearRampToValueAtTime(0.08, now + 0.005)
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.1)
        osc.connect(gainNode)
        gainNode.connect(ctx.destination)
        osc.start()
        osc.stop(now + 0.1)
      } else if (type === 'match') {
        SOLFEGGIO_FREQS.match.forEach((freq, idx) => {
          const osc = ctx.createOscillator()
          const gainNode = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, now + idx * 0.08)
          gainNode.gain.setValueAtTime(0, now + idx * 0.08)
          gainNode.gain.linearRampToValueAtTime(0.06, now + idx * 0.08 + 0.01)
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.5)
          osc.connect(gainNode)
          gainNode.connect(ctx.destination)
          osc.start(now + idx * 0.08)
          osc.stop(now + idx * 0.08 + 0.5)
        })
      } else if (type === 'mismatch') {
        SOLFEGGIO_FREQS.mismatch.forEach((freq) => {
          const osc = ctx.createOscillator()
          const gainNode = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, now)
          gainNode.gain.setValueAtTime(0, now)
          gainNode.gain.linearRampToValueAtTime(0.08, now + 0.01)
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.35)
          osc.connect(gainNode)
          gainNode.connect(ctx.destination)
          osc.start()
          osc.stop(now + 0.35)
        })
      } else if (type === 'victory') {
        SOLFEGGIO_FREQS.victory.forEach((freq, idx) => {
          const osc = ctx.createOscillator()
          const gainNode = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, now + idx * 0.12)
          gainNode.gain.setValueAtTime(0, now + idx * 0.12)
          gainNode.gain.linearRampToValueAtTime(0.07, now + idx * 0.12 + 0.01)
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.7)
          osc.connect(gainNode)
          gainNode.connect(ctx.destination)
          osc.start(now + idx * 0.12)
          osc.stop(now + idx * 0.12 + 0.7)
        })
      }
    } catch (e) {
      console.warn('Solfeggio synthesizer blocked or failed:', e)
    }
  }

  // Timer controls
  const startTimer = () => setTimerActive(true)
  const stopTimer = () => {
    setTimerActive(false)
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
  }

  // Initialize Game Board from Scratch
  const initGameBoard = () => {
    stopTimer()
    setTimer(0)
    setMoves(0)
    setMatchesCount(0)
    setStreak(0)
    setMaxStreak(0)
    setFlippedCards([])
    setIsProcessing(false)
    setWinnerInfo(null)
    setConfettiBurst([])

    let pairCount = 3 // Easy (3x2)
    if (level === 'Medium') pairCount = 8 // Medium (4x4)
    if (level === 'Hard') pairCount = 18 // Hard (6x6)

    // Grab subset of symbols and duplicate them to make pairs
    const activeSymbols = Array.from({ length: pairCount }).map((_, i) => i)
    const combinedSymbols = [...activeSymbols, ...activeSymbols]

    // Symmetrical strategic shuffle (Fisher-Yates)
    for (let i = combinedSymbols.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[combinedSymbols[i], combinedSymbols[j]] = [combinedSymbols[j], combinedSymbols[i]]
    }

    const initialCards = combinedSymbols.map((symbolId, idx) => ({
      id: idx,
      symbolId,
      isFlipped: false,
      isMatched: false,
      glowColor: `glowGrad-${symbolId}-${Math.floor(Math.random() * 10000)}`
    }))

    setCards(initialCards)
    setLogs([`MindFlip ${level} arena loaded in ${mode} mode. 9 pairs available.`])
  }

  // Card Click Interaction
  const handleCardClick = (idx) => {
    if (isProcessing || cards[idx].isFlipped || cards[idx].isMatched) return

    // Play click sound and flip the card
    playSound('click')

    // Start timer on first card click
    if (!timerActive && mode !== 'Zen') {
      startTimer()
    }

    const updatedCards = [...cards]
    updatedCards[idx].isFlipped = true
    setCards(updatedCards)

    const nextFlipped = [...flippedCards, idx]
    setFlippedCards(nextFlipped)

    if (nextFlipped.length === 2) {
      setIsProcessing(true)
      setMoves(prev => prev + 1)
      evaluateMatch(nextFlipped)
    }
  }

  // Evaluate flipped pair
  const evaluateMatch = (flippedIndices) => {
    const [firstIdx, secondIdx] = flippedIndices
    const card1 = cards[firstIdx]
    const card2 = cards[secondIdx]

    if (card1.symbolId === card2.symbolId) {
      // SUCCESS: MATCH
      setTimeout(() => {
        playSound('match')
        const updatedCards = [...cards]
        updatedCards[firstIdx].isMatched = true
        updatedCards[secondIdx].isMatched = true
        setCards(updatedCards)
        
        const nextMatchesCount = matchesCount + 1
        setMatchesCount(nextMatchesCount)

        const currentStreak = streak + 1
        setStreak(currentStreak)
        if (currentStreak > maxStreak) {
          setMaxStreak(currentStreak)
        }

        // Trigger Soft Confetti burst details at matched positions
        triggerMatchShimmerParticles(firstIdx, secondIdx)

        setLogs(prev => [
          `✓ Strategic Match! Pair ${card1.symbolId + 1} aligned. Streak combo x${currentStreak}.`,
          ...prev
        ])

        // Reset click buffer
        setFlippedCards([])
        setIsProcessing(false)

        // Check Victory Alignment
        const totalPairs = level === 'Easy' ? 3 : level === 'Medium' ? 8 : 18
        if (nextMatchesCount === totalPairs) {
          handleVictoryAchievement()
        }
      }, 250) // Ultra fast 250ms feedback
    } else {
      // FAILURE: MISMATCH
      setTimeout(() => {
        playSound('mismatch')
        const updatedCards = [...cards]
        updatedCards[firstIdx].isFlipped = false
        updatedCards[secondIdx].isFlipped = false
        setCards(updatedCards)

        setStreak(0) // Reset combo streak
        setLogs(prev => [
          `✗ Alignment mismatch. Keep focus! Streak combo reset.`,
          ...prev
        ])

        setFlippedCards([])
        setIsProcessing(false)
      }, 550) // Reduced to 550ms for snappy fluid gameplay
    }
  }

  // Visual Golden match particles shimmer effect helper
  const triggerMatchShimmerParticles = (first, second) => {
    // Generate particle visual coords inside the board
    const newConfetti = Array.from({ length: 12 }).map((_, i) => ({
      id: Math.random(),
      x: (Math.random() - 0.5) * 120,
      y: (Math.random() - 0.5) * 120 - 20,
      size: Math.random() * 6 + 3,
      color: i % 2 === 0 ? '#D4AF37' : '#FFFDF5'
    }))
    setConfettiBurst(prev => [...prev, ...newConfetti])
    // Clear them in 1.5s
    setTimeout(() => {
      setConfettiBurst([])
    }, 1500)
  }

  // Timed mode loss helper
  const handleGameOverLoss = () => {
    stopTimer()
    playSound('mismatch')
    setLogs(prev => ['☠ Timer expired. Challenge failed. Restart to regain focus!', ...prev])
    initGameBoard()
  }

  // Victory Event
  const handleVictoryAchievement = () => {
    stopTimer()
    playSound('victory')

    let isNewBestScore = false
    const currentBest = bestScores[level][mode]
    const metric = mode === 'Timed' || mode === 'Solo' ? (mode === 'Timed' ? timer : moves) : null

    if (metric !== null) {
      if (currentBest === null || metric < currentBest) {
        // New Record!
        isNewBestScore = true
        setBestScores(prev => ({
          ...prev,
          [level]: {
            ...prev[level],
            [mode]: metric
          }
        }))
      }
    }

    setWinnerInfo({
      level,
      moves,
      time: timer,
      bestScoreUnlocked: isNewBestScore,
      currentBestScore: isNewBestScore ? metric : currentBest
    })

    setLogs(prev => [
      `🎉 Mind mastered! Perfect ${level} completion in ${moves} moves / ${timer}s!`,
      ...prev
    ])

    // Claim Sponsor Match Pool rewards (Indians currency themed wellness drop)
    handleClaimSponsorMatch()
  }

  // Post match contribution dispatches
  const handleClaimSponsorMatch = async () => {
    if (!user?.uid || savingReward) return
    setSavingReward(true)
    try {
      await addContribution(user.uid, 20, 'Baby Aarav', 'MindFlip Cognitive Symmetrical Alignment Match Reward', true)
      setLogs(prev => ['✓ Corporate sponsor matched contribution ₹20 dispatched directly to Aarav\'s pediatric ledgers!', ...prev])
    } catch (err) {
      console.error('Failed writing match contribution:', err)
    } finally {
      setSavingReward(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin)
    setLogs(prev => ['✓ Share quest link copied to clipboard!', ...prev])
  }

  // Next level unlock sequence helper
  const handleNextLevelUnlock = () => {
    if (level === 'Easy') {
      setLevel('Medium')
    } else if (level === 'Medium') {
      setLevel('Hard')
    } else {
      setLevel('Easy')
    }
  }

  // Grid styling details
  const getGridClass = () => {
    if (level === 'Easy') return 'grid-cols-3 gap-6 max-w-[500px]' // 3 columns, 2 rows
    if (level === 'Medium') return 'grid-cols-4 gap-4 max-w-[580px]' // 4 columns, 4 rows
    return 'grid-cols-6 gap-3 max-w-[680px]' // 6 columns, 6 rows
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFFDFB] to-[#F5F1EB] transition-all duration-700 relative font-sans animate-fade-in overflow-hidden pb-16">
      <GlobalBackground />
      <Navbar />

      {/* Floating stardust ambient wellness particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 6 + 3,
              height: Math.random() * 6 + 3,
              background: 'rgba(139, 98, 57, 0.2)',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 6 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <main className="flex-1 relative z-10 w-full pb-20">
        
        {/* Back Link Header */}
        <div className="max-w-[1200px] mx-auto mt-8 px-6 box-border">
          <button 
            onClick={() => navigate('/main')}
            className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md border border-[#EADFCF] px-6 py-3 rounded-full text-xs font-bold text-[#8B6239] cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
        </div>

        {/* Tactile Luxe MindFlip Layout Canvas */}
        <div className="max-w-[1100px] mx-auto mt-6 px-6 box-border">
          
          <div className="bg-[#FFFDFB]/90 backdrop-blur-2xl border border-[#EADFCF] rounded-[44px] shadow-2xl p-8 lg:p-12 overflow-hidden relative">
            <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-radial-gradient from-amber-50 to-transparent pointer-events-none opacity-60" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
              
              {/* LEFT COLUMN: MEMORY BOARD GRID */}
              <div className="lg:col-span-7 flex flex-col items-center">
                
                {/* HUD Header Details */}
                <div className="w-full flex justify-between items-center mb-6">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-[#8B6239] uppercase flex items-center gap-1.5">
                      <Brain size={12} className="animate-pulse" /> COGNITIVE SYMMETRY
                    </span>
                    <h2 className="text-2xl font-black text-[#3A281A] mt-1">Neural Memory Arena</h2>
                  </div>
                  
                  {/* Streak Multiplier HUD Node */}
                  {streak > 1 && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-1.5 text-[10px] font-black text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full shadow-sm"
                    >
                      <Zap size={12} className="text-amber-600 fill-amber-500 animate-bounce" /> COMBO STREAK x{streak}
                    </motion.div>
                  )}
                </div>

                {/* Tactile Board Card Wrapper */}
                <div className="w-full flex items-center justify-center min-h-[460px] bg-[#F5F1EB]/40 border-2 border-[#EADFCF] rounded-[40px] p-8 shadow-inner relative box-border">
                  
                  {/* Glowing match effects stardust */}
                  <AnimatePresence>
                    {confettiBurst.map(p => (
                      <motion.div
                        key={p.id}
                        className="absolute rounded-full z-40 pointer-events-none shadow-lg"
                        style={{
                          width: p.size,
                          height: p.size,
                          background: p.color,
                          top: '50%',
                          left: '50%'
                        }}
                        initial={{ x: 0, y: 0, opacity: 1 }}
                        animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      />
                    ))}
                  </AnimatePresence>

                  {/* 3D Flip Card grid system */}
                  <div className={`grid ${getGridClass()} w-full justify-center items-center`}>
                    {cards.map((card, idx) => {
                      const isFlipped = card.isFlipped || card.isMatched
                      
                      return (
                        <motion.div
                          key={card.id}
                          className="aspect-square relative cursor-pointer select-none"
                          style={{ perspective: 1000 }}
                          onClick={() => handleCardClick(idx)}
                          whileHover={{ 
                            scale: 1.05, 
                            y: -3,
                            boxShadow: '0 12px 24px rgba(139, 98, 57, 0.15)'
                          }}
                          whileTap={{ 
                            scale: 0.94,
                            boxShadow: '0 4px 8px rgba(139, 98, 57, 0.1)'
                          }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        >
                          <motion.div
                            className="w-full h-full rounded-[20px] relative"
                            style={{ transformStyle: 'preserve-3d' }}
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ type: 'spring', stiffness: 360, damping: 24, mass: 0.6 }}
                          >
                            
                            {/* CARD BACK FACE */}
                            <div 
                              className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-[#FFFDFB] to-[#EADFCF] border border-[#D4C5B9]/60 shadow-md flex flex-col items-center justify-center overflow-hidden z-10"
                              style={{ backfaceVisibility: 'hidden' }}
                            >
                              {/* Inner dashed ring pattern */}
                              <div className="absolute inset-1.5 rounded-[16px] border border-dashed border-[#8B6239]/12 flex items-center justify-center pointer-events-none opacity-50" />
                              
                              {/* Sacred Geometry back pattern */}
                              <svg className="w-1/2 h-1/2 opacity-25" viewBox="0 0 100 100" fill="none" stroke="#8B6239" strokeWidth="2">
                                <circle cx="50" cy="50" r="36" />
                                <circle cx="50" cy="50" r="24" strokeDasharray="3, 3" />
                                <polygon points="50,14 81,32 81,68 50,86 19,68 19,32" />
                                <circle cx="50" cy="50" r="4" fill="#8B6239" />
                              </svg>

                              <span className="text-[7.5px] font-black tracking-widest text-[#8B6239]/40 uppercase mt-2">MINDFLIP</span>
                            </div>

                            {/* CARD FRONT FACE */}
                            <div 
                              className={`absolute inset-0 rounded-[20px] border shadow-lg flex items-center justify-center z-20 ${
                                card.isMatched 
                                  ? 'bg-amber-50/60 border-amber-300 shadow-amber-100/30' 
                                  : 'bg-white border-[#EADFCF]'
                              }`}
                              style={{ 
                                backfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)'
                              }}
                            >
                              {/* Inner premium canvas overlay */}
                              <div className="absolute inset-1.5 rounded-[16px] bg-[#FAF8F5] opacity-50 z-0" />
                              
                              {/* Symmetrical glowing gradient vector symbol */}
                              <div className="relative z-10">
                                {SYMBOLS[card.symbolId](card.glowColor)}
                              </div>

                              {/* Glowing pulse rings on matches */}
                              {card.isMatched && (
                                <motion.div
                                  className="absolute inset-0 rounded-[20px] border-2 border-amber-400 z-30"
                                  animate={{ opacity: [1, 0.3, 1] }}
                                  transition={{ repeat: Infinity, duration: 1.5 }}
                                />
                              )}
                            </div>

                          </motion.div>
                        </motion.div>
                      )
                    })}
                  </div>

                </div>

                {/* Symmetrical Hint footer */}
                <div className="w-full flex items-center gap-3 bg-[#F5F1EB]/50 border border-[#EADFCF] rounded-2xl p-4 mt-6 text-xs text-[#6F4D2E] leading-relaxed">
                  <HelpCircle size={16} className="text-[#8B6239] flex-shrink-0" />
                  <span>
                    <strong>Cognitive Boost:</strong> Find matching geometric nodes. Consistently matching nodes chain a higher combo streak multiplier and unlocks matched corporate charity contributions ₹20 directly.
                  </span>
                </div>

              </div>

              {/* RIGHT COLUMN: HIGH-END GAME HUD & LEADERBOARD */}
              <div className="lg:col-span-5 flex flex-col justify-between lg:border-l border-[#EADFCF]/60 lg:pl-10">
                
                <div>
                  
                  {/* Sound and Volume Configurations */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black tracking-widest text-[#8B6239] uppercase">
                      COGNITIVE ENGINE
                    </span>
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="text-[#8B6239] hover:opacity-75 cursor-pointer bg-white border border-[#EADFCF] p-2.5 rounded-full shadow-sm"
                    >
                      {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </button>
                  </div>

                  {/* Mode Configurator */}
                  <div className="bg-[#FFFDF9] border border-[#EADFCF] rounded-[32px] p-6 mb-6 shadow-sm">
                    <span className="text-[10px] font-black text-[#8B6239] tracking-wider block mb-4 uppercase text-center">
                      Arena Mode Selector
                    </span>

                    <div className="grid grid-cols-3 gap-2.5 mb-5">
                      {['Solo', 'Timed', 'Zen'].map(m => (
                        <button
                          key={m}
                          onClick={() => setMode(m)}
                          className={`py-3.5 rounded-xl border text-[10.5px] font-black tracking-wider transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            mode === m
                              ? 'bg-[#8B6239] text-white border-[#8B6239] shadow-md'
                              : 'bg-white text-[#8B6239] border-[#EADFCF] hover:bg-[#F5F1EB]'
                          }`}
                        >
                          {m === 'Timed' ? <Clock size={12} /> : m === 'Solo' ? <Award size={12} /> : <Smile size={12} />}
                          <span className="uppercase">{m}</span>
                        </button>
                      ))}
                    </div>

                    {/* Cognitive Depth Level Selection */}
                    <div>
                      <span className="text-[9px] font-black text-[#8B6239] tracking-wider block mb-2.5 uppercase text-left">
                        Cognitive Node Depth
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {['Easy', 'Medium', 'Hard'].map((diff) => (
                          <button
                            key={diff}
                            onClick={() => setLevel(diff)}
                            className={`py-2.5 rounded-xl border text-[10px] font-extrabold transition-all cursor-pointer ${
                              level === diff
                                ? 'bg-[#8B6239]/15 text-[#8B6239] border-[#8B6239]'
                                : 'bg-white text-slate-500 border-[#EADFCF] hover:bg-[#F5F1EB]'
                            }`}
                          >
                            {diff === 'Easy' ? '3x2 Pairs' : diff === 'Medium' ? '4x4 Pairs' : '6x6 Pairs'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={initGameBoard}
                      className="w-full mt-5 py-3.5 rounded-2xl border border-[#EADFCF] bg-white text-xs font-black text-[#8B6239] cursor-pointer hover:bg-[#F5F1EB] transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={12} /> RE-SHUFFLE ARENA
                    </button>
                  </div>

                  {/* SCOREBOARD STATUS HUD */}
                  <div className="bg-white border border-[#EADFCF] rounded-[32px] p-6 mb-6 shadow-sm">
                    <h4 className="text-[10px] font-black tracking-wider text-[#8B6239] uppercase mb-4 flex items-center gap-1.5">
                      <Trophy size={13} /> ARENA METRIC HUD
                    </h4>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-[#F5F1EB]/30 border border-[#EADFCF]/60 rounded-2xl p-3">
                        <div className="text-[9px] font-black text-[#8B6239] uppercase tracking-wide">Total Moves</div>
                        <div className="text-xl font-black text-[#3A281A] mt-1">{moves}</div>
                      </div>

                      <div className="bg-[#F5F1EB]/30 border border-[#EADFCF]/60 rounded-2xl p-3">
                        <div className="text-[9px] font-black text-[#8B6239] uppercase tracking-wide">
                          {mode === 'Timed' ? 'TIME LIMIT' : 'TIMER'}
                        </div>
                        <div className="text-xl font-black text-[#3A281A] mt-1">
                          {mode === 'Timed' ? (
                            <span className="text-red-800">
                              {timer}s / {level === 'Easy' ? 25 : level === 'Medium' ? 60 : 120}s
                            </span>
                          ) : (
                            `${timer}s`
                          )}
                        </div>
                      </div>

                      <div className="bg-[#F5F1EB]/30 border border-[#EADFCF]/60 rounded-2xl p-3">
                        <div className="text-[9px] font-black text-[#8B6239] uppercase tracking-wide">Best Score</div>
                        <div className="text-xl font-black text-[#3A281A] mt-1">
                          {bestScores[level][mode] !== null 
                            ? (mode === 'Timed' ? `${bestScores[level][mode]}s` : `${bestScores[level][mode]}m`) 
                            : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ACTION LOG CHRONOLOGY */}
                  <div>
                    <h4 className="text-[10px] font-black tracking-wider text-[#8B6239] uppercase mb-3 flex items-center gap-1.5">
                      <Activity size={13} /> ARENA ACTION CHRONOLOGY
                    </h4>
                    <div className="bg-[#F5F1EB]/40 border border-[#EADFCF]/50 rounded-2xl p-4 h-24 overflow-y-auto text-xs text-[#6F4D2E] leading-relaxed">
                      {logs.map((log, idx) => (
                        <div key={idx} className="mb-2 border-b border-[#EADFCF]/20 pb-1.5 text-slate-700">
                          • {log}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ────────────────── VICTORY & COMPLETION OVERLAYS ────────────────── */}
        <AnimatePresence>
          {winnerInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#3A281A]/75 backdrop-blur-md flex items-center justify-center p-6 z-[999]"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-[36px] border border-[#EADFCF] p-8 max-w-sm w-full text-center relative shadow-2xl overflow-hidden"
              >
                {/* Golden Victory confetti bursts floating background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2.5 h-2.5 rounded-full bg-[#D4AF37]"
                      style={{
                        top: '50%',
                        left: '50%',
                      }}
                      animate={{
                        x: [0, (Math.random() - 0.5) * 240],
                        y: [0, (Math.random() - 0.5) * 240 - 80],
                        opacity: [1, 0],
                        scale: [1, 1.5, 0],
                      }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                  ))}
                </div>

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <Award size={34} className="text-[#8B6239] animate-bounce" />
                  </div>

                  <span className="text-[10px] font-black tracking-widest text-[#8B6239] uppercase">
                    MEMORY MASTERED 🏆
                  </span>

                  <h2 className="text-2xl font-black text-[#3A281A] my-3">
                    Cognitive Symmetry!
                  </h2>

                  <p className="text-xs text-[#6F4D2E] leading-relaxed mb-6">
                    Congratulations! You aligned exactly all sensory nodes in the <strong>{winnerInfo.level}</strong> MindFlip Arena using <strong>{winnerInfo.moves} moves</strong>.
                    <br />
                    A matching transaction of ₹20 has been dispatched by corporate wellness sponsors directly to Aarav's treatment pool ledger.
                  </p>

                  <div className="bg-[#FFFDF9] border border-[#EADFCF] rounded-2xl p-5 text-left mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <span className="text-[9px] font-black text-[#8B6239] tracking-wider uppercase">Holder Mode</span>
                        <div className="text-sm font-extrabold text-[#3A281A]">{mode} Challenge</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-black text-[#8B6239] tracking-wider uppercase">Match Yield</span>
                        <div className="text-lg font-black text-[#8B6239]">₹20.00</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-[#A09080] font-black border-t border-[#EADFCF]/50 pt-2.5">
                      <span>STATUS</span>
                      <span className="text-[#47682C]">✓ SPONSOR MATCH CODES ISSUED</span>
                    </div>
                  </div>

                  {/* Victory buttons */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={initGameBoard}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#8B6239] to-[#6F4D2E] text-white font-extrabold text-xs tracking-wide shadow-md hover:shadow-lg cursor-pointer"
                    >
                      PLAY NEXT CHALLENGE
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleNextLevelUnlock}
                        className="py-3 rounded-2xl border border-[#EADFCF] bg-white text-[11px] font-black text-[#8B6239] cursor-pointer hover:bg-[#F5F1EB]"
                      >
                        Unlock Next Level
                      </button>

                      <button
                        onClick={() => navigate('/main')}
                        className="py-3 rounded-2xl border border-[#EADFCF] bg-white text-[11px] font-black text-[#8B6239] cursor-pointer hover:bg-[#F5F1EB]"
                      >
                        Return Home
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <Footer />
    </div>
  )
}
