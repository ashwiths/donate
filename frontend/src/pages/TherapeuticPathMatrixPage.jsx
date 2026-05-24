import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Play, RotateCcw, Heart, Sparkles, 
  Volume2, VolumeX, ShieldCheck, ChevronRight, Award, Share2, 
  Activity, Zap, Target, Dna, Cpu, Award as BadgeIcon
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { GlobalBackground } from '../components/PremiumBackground'
import { addContribution } from '../services/contributionService'

// Solfeggio Pentatonic frequencies for Helical jumps and matrix moves
const SOLFEGGIO_FREQS = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]

// Board Grid size: 6x6 (36 cells total)
const GRID_SIZE = 6
const CELLS_TOTAL = 36

// Helical Strands (Ladders: Start -> End)
const HELICAL_STRANDS = {
  3: 15,
  8: 22,
  12: 28,
  18: 30,
  20: 34
}

// Neural Inhibitors (Snakes: Start -> End)
const NEURAL_INHIBITORS = {
  16: 6,
  24: 10,
  29: 14,
  33: 17,
  35: 23
}

export default function TherapeuticPathMatrixPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Game States
  const [isPlaying, setIsPlaying] = useState(false)
  const [playerPosition, setPlayerPosition] = useState(1) // Starts at cell 1
  const [diceRoll, setDiceRoll] = useState(null)
  const [isRolling, setIsRolling] = useState(false)
  const [logMessages, setLogMessages] = useState(['Initialize matrix accelerator.'])
  const [score, setScore] = useState(0)
  const [sessionCompleted, setSessionCompleted] = useState(false)
  const [savingContribution, setSavingContribution] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Real-time tracking metrics
  const [multiplier, setMultiplier] = useState(2.5)
  const [oncologyYield, setOncologyYield] = useState(18200)

  // Custom name for certificate
  const [helperName, setHelperName] = useState(localStorage.getItem('hp_user_name') || 'Generous Supporter')
  const [isCopied, setIsCopied] = useState(false)

  // Audio Context Ref
  const audioContextRef = useRef(null)

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
  }

  // Play a beautiful therapeutic chime chord
  const playMatrixChime = (freqIdx = 0, isHighPitch = false) => {
    if (!soundEnabled) return
    initAudio()
    try {
      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      const baseFreq = SOLFEGGIO_FREQS[freqIdx % SOLFEGGIO_FREQS.length]
      const freq = isHighPitch ? baseFreq * 1.5 : baseFreq

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)

      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2)

      // Sub-harmonic for depth
      const subOsc = ctx.createOscillator()
      const subGain = ctx.createGain()
      subOsc.type = 'sine'
      subOsc.frequency.setValueAtTime(freq / 2, ctx.currentTime)
      subGain.gain.setValueAtTime(0, ctx.currentTime)
      subGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.02)
      subGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8)

      subOsc.connect(subGain)
      subGain.connect(ctx.destination)

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc.start()
      subOsc.start()

      osc.stop(ctx.currentTime + 1.3)
      subOsc.stop(ctx.currentTime + 0.9)
    } catch (e) {
      console.warn('Audio synthesis block:', e)
    }
  }

  // Dynamic board progression roll
  const handleRollDice = () => {
    if (isRolling || sessionCompleted) return
    setIsRolling(true)
    setIsPlaying(true)

    initAudio()
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }

    // Play rolling click tick
    if (soundEnabled) {
      try {
        const ctx = audioContextRef.current
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(800, ctx.currentTime)
        gain.gain.setValueAtTime(0, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01)
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.1)
      } catch (e) {}
    }

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1
      setDiceRoll(roll)
      
      const newPos = playerPosition + roll
      
      if (newPos >= CELLS_TOTAL) {
        // Win game!
        setPlayerPosition(CELLS_TOTAL)
        setLogMessages(prev => [`Dice rolled ${roll}. Reached Cortex Terminal Gateway!`, ...prev])
        playMatrixChime(7, true)
        setSessionCompleted(true)
        setOncologyYield(30000) // limit target hit
        handleClaimSponsorReward()
      } else {
        setPlayerPosition(newPos)
        let msg = `Dice rolled ${roll}. Moved to Cell ${newPos}.`
        playMatrixChime(newPos)

        // Increment Oncology pool yield
        setOncologyYield(y => Math.min(30000, y + roll * 240))

        // Check Helical Strands (Ladders)
        if (HELICAL_STRANDS[newPos]) {
          const finalPos = HELICAL_STRANDS[newPos]
          setTimeout(() => {
            setPlayerPosition(finalPos)
            setLogMessages(prev => [`🧬 Helical strand acceleration! Jumped from Cell ${newPos} to ${finalPos}.`, ...prev])
            playMatrixChime(finalPos, true)
          }, 800)
          msg += ` DNA repair helical jump ahead!`
        }
        // Check Neural Inhibitors (Snakes)
        else if (NEURAL_INHIBITORS[newPos]) {
          const finalPos = NEURAL_INHIBITORS[newPos]
          setTimeout(() => {
            setPlayerPosition(finalPos)
            setLogMessages(prev => [`⚠️ Neural inhibitor challenge! Drifted from Cell ${newPos} to ${finalPos}.`, ...prev])
            // Play relaxing low slide tone
            if (soundEnabled) {
              try {
                const ctx = audioContextRef.current
                const osc = ctx.createOscillator()
                const gain = ctx.createGain()
                osc.type = 'sine'
                osc.frequency.setValueAtTime(220, ctx.currentTime)
                osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.6)
                gain.gain.setValueAtTime(0, ctx.currentTime)
                gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05)
                gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6)
                osc.connect(gain)
                gain.connect(ctx.destination)
                osc.start()
                osc.stop(ctx.currentTime + 0.7)
              } catch (e) {}
            }
          }, 800)
          msg += ` Neural inhibitor obstacle encountered.`
        }

        setLogMessages(prev => [msg, ...prev])
      }

      setIsRolling(false)
    }, 600)
  }

  const handleClaimSponsorReward = async () => {
    if (!user?.uid || savingContribution) return
    setSavingContribution(true)
    try {
      await addContribution(user.uid, 10, 'Baby Aarav', 'Sponsor Matched Matrix Path')
    } catch (err) {
      console.error('Failed writing contribution:', err)
    } finally {
      setSavingContribution(false)
    }
  }

  const handleReset = () => {
    setPlayerPosition(1)
    setDiceRoll(null)
    setSessionCompleted(false)
    setLogMessages(['Accelerator matrix reinitialized.'])
    setOncologyYield(18200)
    setMultiplier(2.5)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  // Generate grid mapping coordinates for a standard Snake and Ladders board layout
  const renderGridCells = () => {
    const cells = []
    // 6x6 grid with alternating left-to-right rows
    for (let r = GRID_SIZE - 1; r >= 0; r--) {
      const isAlternating = r % 2 !== 0
      for (let c = 0; c < GRID_SIZE; c++) {
        const colIdx = isAlternating ? (GRID_SIZE - 1 - c) : c
        const cellNum = r * GRID_SIZE + colIdx + 1
        cells.push({ num: cellNum, row: r, col: c })
      }
    }
    return cells
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent', color: '#3D2B1A', position: 'relative' }}>
      <GlobalBackground />
      <Navbar />

      <main style={{ flex: 1, position: 'relative', zIndex: 1, width: '100%', paddingBottom: 100 }}>
        
        {/* Header Back Link */}
        <div style={{ maxWidth: 1200, margin: '40px auto 0', padding: '0 24px', boxSizing: 'border-box' }}>
          <button 
            onClick={() => navigate('/main')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(220, 208, 195, 0.8)',
              padding: '10px 20px',
              borderRadius: '99px',
              fontSize: '13px',
              fontWeight: 700,
              color: '#8C4F1A',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(139, 94, 52, 0.04)',
              transition: 'all 0.2s'
            }}
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
        </div>

        {/* Premium Therapeutic Path Matrix Deck */}
        <div style={{ maxWidth: 1100, margin: '30px auto 0', padding: '0 24px', boxSizing: 'border-box' }}>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(225, 215, 203, 0.9)',
            borderRadius: '40px',
            boxShadow: '0 25px 60px rgba(122, 78, 43, 0.09)',
            overflow: 'hidden',
            padding: '48px 36px'
          }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '50fr 50fr', gap: 44 }} className="gameplay-split-grid">
              
              {/* LEFT COLUMN: Intricate 3D Bio-Geometric Grid Matrix */}
              <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 9.5, fontWeight: 900, color: '#8C4F1A', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    [ 3D THERAPEUTIC PATHWAY MATRIX ]
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 8.5, fontWeight: 900, color: '#47682C', background: '#F3F6F0', padding: '2px 8px', borderRadius: 99 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#47682C' }} /> ENGINE ARMED
                  </div>
                </div>

                {/* 6x6 Matrix Board Grid */}
                <div style={{
                  width: '100%',
                  aspectRatio: '1',
                  background: '#FFFFFF',
                  border: '1.5px solid rgba(220, 208, 195, 0.8)',
                  borderRadius: '28px',
                  boxShadow: 'inset 0 4px 18px rgba(0,0,0,0.015), 0 12px 30px rgba(139, 94, 52, 0.04)',
                  overflow: 'hidden',
                  position: 'relative',
                  padding: 16,
                  boxSizing: 'border-box'
                }}>
                  
                  {/* Grid layout */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gridTemplateRows: 'repeat(6, 1fr)',
                    gap: 6,
                    height: '100%',
                    width: '100%'
                  }}>
                    {renderGridCells().map(({ num, row, col }) => {
                      const isActive = playerPosition === num
                      const isHelical = !!HELICAL_STRANDS[num]
                      const isInhibitor = !!NEURAL_INHIBITORS[num]

                      return (
                        <div
                          key={num}
                          style={{
                            background: isActive 
                              ? 'rgba(140, 79, 26, 0.08)' 
                              : isHelical 
                                ? '#FFFDF8' 
                                : isInhibitor 
                                  ? 'rgba(253, 250, 246, 0.4)' 
                                  : '#FFFFFF',
                            border: isActive 
                              ? '2px solid #8C4F1A' 
                              : isHelical 
                                ? '1px solid #EBD5C2' 
                                : '1px solid rgba(220, 208, 195, 0.5)',
                            borderRadius: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                          }}
                        >
                          {/* Cell number watermark */}
                          <span style={{
                            position: 'absolute',
                            top: 4,
                            left: 6,
                            fontSize: '9px',
                            fontWeight: 800,
                            color: isActive ? '#8C4F1A' : 'rgba(140, 79, 26, 0.25)'
                          }}>
                            {num}
                          </span>

                          {/* Cell Specific Graphic Overlay */}
                          {isHelical && (
                            <Dna size={12} color="#D4AF37" style={{ opacity: 0.8 }} />
                          )}
                          {isInhibitor && (
                            <Activity size={12} color="#A09080" style={{ opacity: 0.6 }} />
                          )}

                          {/* Player Pulse node overlay */}
                          {isActive && (
                            <motion.div
                              layoutId="matrixPlayerPulse"
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: '50%',
                                background: '#8C4F1A',
                                border: '3px solid #FFF',
                                boxShadow: '0 4px 10px rgba(140, 79, 26, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifySelf: 'center',
                                position: 'relative',
                                zIndex: 5
                              }}
                            >
                              <motion.span
                                animate={{ opacity: [0.3, 0.9, 0.3] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                style={{
                                  position: 'absolute',
                                  inset: -6,
                                  border: '1.5px solid #8C4F1A',
                                  borderRadius: '50%'
                                }}
                              />
                            </motion.div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Helical strands / Inhibitor visual paths overlays */}
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} viewBox="0 0 100 100">
                    {/* Render Helical strand pathways (ladders) as subtle gold connections */}
                    <g opacity="0.4">
                      <line x1="30" y1="90" x2="60" y2="40" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3, 3" />
                      <line x1="15" y1="80" x2="45" y2="30" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3, 3" />
                    </g>
                  </svg>
                </div>

                {/* Dice roll accelerator panel */}
                <div style={{ marginTop: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
                  <button
                    onClick={handleRollDice}
                    disabled={isRolling || sessionCompleted}
                    style={{
                      flex: 2,
                      padding: '14px',
                      borderRadius: '16px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
                      color: '#FFF',
                      fontWeight: 800,
                      fontSize: '14.5px',
                      fontFamily: 'Outfit',
                      cursor: (isRolling || sessionCompleted) ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: '0 6px 16px rgba(140, 79, 26, 0.12)'
                    }}
                  >
                    {isRolling ? 'Accelerating...' : 'Initiate Acceleration'}
                  </button>

                  <div style={{
                    width: 50,
                    height: 50,
                    borderRadius: '14px',
                    border: '1.5px solid rgba(140, 79, 26, 0.3)',
                    background: '#FFFDFB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 900,
                    color: '#8C4F1A'
                  }}>
                    {diceRoll || '-'}
                  </div>
                </div>

                {/* Log messages scrollbox */}
                <div style={{
                  marginTop: 16,
                  height: 90,
                  overflowY: 'auto',
                  border: '1px solid rgba(220, 208, 195, 0.4)',
                  borderRadius: '16px',
                  padding: '10px 14px',
                  background: 'rgba(253, 250, 246, 0.4)',
                  fontSize: '11px',
                  lineHeight: '1.6',
                  color: '#7A6A5A'
                }}>
                  {logMessages.map((msg, idx) => (
                    <div key={idx} style={{ marginBottom: 4 }}>
                      • {msg}
                    </div>
                  ))}
                </div>

              </div>

              {/* RIGHT COLUMN: Highly Packed Clinical & Partner Data */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '1px solid rgba(225, 215, 203, 0.6)', paddingLeft: 36 }}>
                <div>
                  
                  {/* Badge Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ fontSize: 9, fontWeight: 900, color: '#8C4F1A', border: '1px solid rgba(140, 79, 26, 0.3)', background: 'rgba(140, 79, 26, 0.03)', padding: '4px 12px', borderRadius: 99, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      COGNITIVE LIFELINE TRAJECTORY
                    </span>
                    
                    <span style={{ fontSize: 10, fontWeight: 900, color: '#8C4F1A', background: 'rgba(140, 79, 26, 0.08)', border: '1.5px dashed rgba(140, 79, 26, 0.3)', padding: '4px 12px', borderRadius: '8px', fontFamily: 'Outfit' }}>
                      Entry Code: ₹20 ENTRY CODE
                    </span>
                  </div>

                  {/* Header Title */}
                  <h2 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: 900, color: '#4A3427', fontFamily: 'Outfit', letterSpacing: '-0.5px' }}>
                    Therapeutic Path Matrix
                  </h2>

                  <p style={{ margin: '0 0 20px', fontSize: '13.5px', color: '#7A6A5A', lineHeight: 1.6, fontWeight: 500 }}>
                    Navigate the therapeutic matrix grid. Advancing up the helical strands bypasses neural inhibitors to unlock dynamic partner pools.
                  </p>

                  {/* LIVE ACCELERATOR POOL */}
                  <div style={{
                    background: 'rgba(139, 94, 52, 0.04)',
                    border: '1.5px solid rgba(139, 94, 52, 0.12)',
                    borderRadius: '20px',
                    padding: '16px 20px',
                    marginBottom: 20
                  }}>
                    <h4 style={{ margin: '0 0 10px', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8C4F1A', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Zap size={13} /> LIVE ACCELERATOR POOL
                    </h4>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(235, 224, 214, 0.6)', paddingBottom: 10, marginBottom: 10 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#4A3427' }}>Sponsor Multiplier</span>
                      <span style={{ fontSize: 13, fontWeight: 900, color: '#47682C', background: '#F3F6F0', padding: '2px 10px', borderRadius: 99 }}>
                        {multiplier.toFixed(1)}x Active
                      </span>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: '#4A3427', marginBottom: 6 }}>
                        <span>Oncology Asset Yield</span>
                        <span>₹{oncologyYield.toLocaleString()} / ₹30,000</span>
                      </div>
                      <div style={{ height: 6, background: 'rgba(235, 224, 214, 0.5)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(oncologyYield / 30000) * 100}%`, background: '#8C4F1A', borderRadius: 99 }} />
                      </div>
                    </div>
                  </div>

                  {/* CELLULAR ASCENSION STATUS */}
                  <div style={{ marginBottom: 24 }}>
                    <h4 style={{ margin: '0 0 10px', fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8C4F1A' }}>
                      CELLULAR ASCENSION STATUS
                    </h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(220, 208, 195, 0.4)', borderRadius: '10px', padding: '6px 12px', fontSize: '11px' }}>
                        <span style={{ fontWeight: 700, color: '#7A6A5A' }}>Base Node</span>
                        <span style={{ fontWeight: 900, color: '#47682C' }}>STABLE</span>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(220, 208, 195, 0.4)', borderRadius: '10px', padding: '6px 12px', fontSize: '11px' }}>
                        <span style={{ fontWeight: 700, color: '#7A6A5A' }}>Helical Jump</span>
                        <span style={{ fontWeight: 900, color: '#8C4F1A' }}>ACTIVE</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(220, 208, 195, 0.4)', borderRadius: '10px', padding: '6px 12px', fontSize: '11px' }}>
                        <span style={{ fontWeight: 700, color: '#7A6A5A' }}>Inhibitor Risk</span>
                        <span style={{ fontWeight: 900, color: '#A09080' }}>MINIMAL</span>
                      </div>
                    </div>
                  </div>

                  {/* Tracing Guideline */}
                  <div style={{
                    background: 'rgba(139, 94, 52, 0.02)',
                    border: '1px dashed rgba(139, 94, 52, 0.25)',
                    borderRadius: '20px',
                    padding: '14px 18px',
                    fontSize: '11.5px',
                    lineHeight: 1.5,
                    color: '#7A6A5A'
                  }}>
                    <span style={{ fontWeight: 800, color: '#8C4F1A', display: 'block', marginBottom: 4 }}>
                      💡 Matrix Guideline
                    </span>
                    Roll the acceleration matrix code. Helical strands elevate your cellular trajectory instantly, while translucent inhibitors drift your pulse back. Reach gateway Cell 36 to trigger chart integrations.
                  </div>

                </div>

                {/* Reset button */}
                <div style={{ display: 'flex', gap: 14, marginTop: 20 }}>
                  <motion.button
                    onClick={handleReset}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: '16px',
                      border: '1px solid rgba(220, 208, 195, 0.8)',
                      background: '#FFF',
                      color: '#7A6A5A',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}
                  >
                    <RotateCcw size={14} /> Reinitialize Grid
                  </motion.button>
                </div>

              </div>

            </div>

            {/* VERY BOTTOM: SPONSOR INTEGRATION CORES */}
            <div style={{
              marginTop: 40,
              paddingTop: 30,
              borderTop: '1px solid rgba(225, 215, 203, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16
            }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#8C4F1A', display: 'block', marginBottom: 2 }}>
                  SPONSOR INTEGRATION CORES
                </span>
                <span style={{ fontSize: 12, color: '#7A6A5A', fontWeight: 500 }}>
                  Progress milestones trigger direct institutional split funding.
                </span>
              </div>

              {/* Fictitious elegant partner logos */}
              <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(235, 224, 214, 0.25)',
                  border: '1px solid rgba(220, 208, 195, 0.5)',
                  padding: '6px 14px',
                  borderRadius: '10px'
                }}>
                  <ShieldCheck size={13} color="#8C4F1A" />
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#4A3427', fontFamily: 'Outfit' }}>BioCore Pharma</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(235, 224, 214, 0.25)',
                  border: '1px solid rgba(220, 208, 195, 0.5)',
                  padding: '6px 14px',
                  borderRadius: '10px'
                }}>
                  <BadgeIcon size={13} color="#8C4F1A" />
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#4A3427', fontFamily: 'Outfit' }}>NeuroGen Labs</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Success Modal */}
        <AnimatePresence>
          {sessionCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(61, 43, 26, 0.6)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
                zIndex: 999
              }}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '36px',
                  border: '1px solid rgba(225, 215, 203, 0.9)',
                  boxShadow: '0 30px 70px rgba(61, 43, 26, 0.25)',
                  width: '100%',
                  maxWidth: '540px',
                  padding: '36px',
                  boxSizing: 'border-box',
                  position: 'relative'
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: '#FAF6F0',
                    border: '1px solid rgba(139, 94, 52, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <Award size={32} color="#8C4F1A" />
                  </div>

                  <span style={{ fontSize: '10.5px', fontWeight: 900, color: '#8C4F1A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Matrix Alignment Successful ✨
                  </span>

                  <h2 style={{ fontFamily: 'Outfit', fontSize: 26, fontWeight: 900, color: '#4A3427', margin: '6px 0 12px' }}>
                    Path Ascension Completed!
                  </h2>

                  <p style={{ margin: '0 auto 24px', fontSize: '14px', color: '#7A6A5A', lineHeight: 1.6, maxWidth: 440 }}>
                    You have successfully finalized the geometric path matrix. Your cognitive trajectory has triggered a matching sponsor payment of <strong>₹10</strong> directed straight to verified hospital bills for Baby Aarav's treatment!
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <motion.button
                      onClick={() => navigate('/main')}
                      style={{
                        padding: '14px',
                        borderRadius: '16px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
                        color: '#FFF',
                        fontWeight: 800,
                        fontSize: '14px',
                        fontFamily: 'Outfit',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8
                      }}
                    >
                      Return to Dashboard <ChevronRight size={15} />
                    </motion.button>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        onClick={handleCopyLink}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '14px',
                          border: '1px solid rgba(220, 208, 195, 0.8)',
                          background: '#FFF',
                          color: '#7A6A5A',
                          fontWeight: 700,
                          fontSize: '12.5px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6
                        }}
                      >
                        <Share2 size={13} /> {isCopied ? 'Link Copied!' : 'Share Achievement'}
                      </button>

                      <button
                        onClick={handleReset}
                        style={{
                          flex: 1,
                          padding: '12px',
                          borderRadius: '14px',
                          border: '1px solid rgba(220, 208, 195, 0.8)',
                          background: '#FFF',
                          color: '#7A6A5A',
                          fontWeight: 700,
                          fontSize: '12.5px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6
                        }}
                      >
                        <RotateCcw size={13} /> Trace Again
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
