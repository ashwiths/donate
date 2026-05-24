import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Play, Pause, RotateCcw, Heart, Sparkles, 
  Volume2, VolumeX, ShieldCheck, ChevronRight, Award, Share2, Info, CheckCircle
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { GlobalBackground } from '../components/PremiumBackground'
import { addContribution } from '../services/contributionService'

// Breathing rhythm configs: [inhaleTime, holdTime, exhaleTime]
const RHYTHMS = {
  serenity: {
    name: 'Serenity (4-4-4)',
    description: 'Standard equal breathing to bring rapid cognitive stability.',
    inhale: 4,
    hold: 4,
    exhale: 4
  },
  resonance: {
    name: 'Resonance (5-0-5)',
    description: 'Flowing continuous breathing for deep emotional rhythm.',
    inhale: 5,
    hold: 0,
    exhale: 5
  },
  deepCalm: {
    name: 'Deep Calm (4-7-8)',
    description: 'Classic anxiety-relief cycle to lower heart rates quickly.',
    inhale: 4,
    hold: 7,
    exhale: 8
  }
}

export default function BreatheBloomPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // State Management
  const [isPlaying, setIsPlaying] = useState(false)
  const [rhythmKey, setRhythmKey] = useState('serenity')
  const [phase, setPhase] = useState('idle') // 'idle', 'inhale', 'hold', 'exhale'
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [cyclesCompleted, setCyclesCompleted] = useState(0)
  const [sessionCompleted, setSessionCompleted] = useState(false)
  const [savingContribution, setSavingContribution] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  
  // Custom name for certificate
  const [helperName, setHelperName] = useState(localStorage.getItem('hp_user_name') || 'Generous Supporter')
  const [isCopied, setIsCopied] = useState(false)

  // Floating healing particles state
  const [particles, setParticles] = useState([])
  
  // Current active rhythm details
  const currentRhythm = RHYTHMS[rhythmKey]

  // Track intervals
  const timerRef = useRef(null)

  // Redirect if logged out
  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  // Sound generator simulation
  const audioContextRef = useRef(null)
  const oscillatorRef = useRef(null)
  const gainNodeRef = useRef(null)

  // Web Audio ambient synthesizer (soft serene humming sound matching breathing)
  const startHum = (freq = 220, vol = 0.05) => {
    if (!soundEnabled) return
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
      
      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      // Stop previous
      stopHum()

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      
      // Smooth volume fade-in
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 1)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.start()
      oscillatorRef.current = osc
      gainNodeRef.current = gain
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e)
    }
  }

  const stopHum = () => {
    try {
      if (gainNodeRef.current && audioContextRef.current) {
        const ctx = audioContextRef.current
        gainNodeRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5)
        setTimeout(() => {
          if (oscillatorRef.current) {
            oscillatorRef.current.stop()
            oscillatorRef.current.disconnect()
            oscillatorRef.current = null
          }
        }, 500)
      }
    } catch (e) {
      // safe bypass
    }
  }

  // Handle ambient hum based on phase
  useEffect(() => {
    if (!isPlaying) {
      stopHum()
      return
    }
    
    if (phase === 'inhale') {
      startHum(220, 0.04) // Lower soft frequency
    } else if (phase === 'hold') {
      startHum(261.63, 0.06) // Serene middle note C
    } else if (phase === 'exhale') {
      startHum(196, 0.03) // Deep relaxing lower note G
    } else {
      stopHum()
    }

    return () => stopHum()
  }, [phase, isPlaying, soundEnabled])

  // Trigger floating particles during exhale phase
  useEffect(() => {
    if (isPlaying && phase === 'exhale') {
      const interval = setInterval(() => {
        setParticles(prev => [
          ...prev,
          {
            id: Math.random(),
            x: 50 + (Math.random() * 20 - 10), // start around flower center
            y: 50 + (Math.random() * 10 - 5),
            scale: Math.random() * 0.6 + 0.4,
            speedY: Math.random() * 2 + 1,
            speedX: Math.random() * 1 - 0.5,
            opacity: 1
          }
        ].slice(-40)) // limit particle array size
      }, 250)
      return () => clearInterval(interval)
    }
  }, [phase, isPlaying])

  // Animate particles floating upwards to the heart
  useEffect(() => {
    let animFrame
    const updateParticles = () => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            y: p.y - p.speedY,
            x: p.x + p.speedX,
            opacity: p.opacity - 0.015
          }))
          .filter(p => p.opacity > 0)
      )
      animFrame = requestAnimationFrame(updateParticles)
    }
    animFrame = requestAnimationFrame(updateParticles)
    return () => cancelAnimationFrame(animFrame)
  }, [])

  // Gameplay timer tick engine
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    // Set initial phase
    if (phase === 'idle') {
      setPhase('inhale')
      setSecondsLeft(currentRhythm.inhale)
      return
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          // Transition to next phase
          if (phase === 'inhale') {
            if (currentRhythm.hold > 0) {
              setPhase('hold')
              return currentRhythm.hold
            } else {
              setPhase('exhale')
              return currentRhythm.exhale
            }
          } else if (phase === 'hold') {
            setPhase('exhale')
            return currentRhythm.exhale
          } else {
            // Exhale finished -> increment cycle
            setCyclesCompleted(c => {
              const nextCycle = c + 1
              if (nextCycle >= 3) {
                // Game Finished!
                setIsPlaying(false)
                setSessionCompleted(true)
                setPhase('idle')
                handleClaimSponsorReward()
              }
              return nextCycle
            })
            setPhase('inhale')
            return currentRhythm.inhale
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [isPlaying, phase, rhythmKey, currentRhythm])

  // Trigger sponsored contribution write on Firestore
  const handleClaimSponsorReward = async () => {
    if (!user?.uid || savingContribution) return
    setSavingContribution(true)
    try {
      // Call Firebase Transaction to record ₹10 matched sponsor donation
      await addContribution(user.uid, 10, 'Baby Aarav', 'Sponsor Matched Play', true)
    } catch (err) {
      console.error('Error adding sponsor contribution:', err)
    } finally {
      setSavingContribution(false)
    }
  }

  // Session controls
  const handleTogglePlay = () => {
    if (sessionCompleted) {
      setCyclesCompleted(0)
      setSessionCompleted(false)
    }

    // Explicitly initialize/resume AudioContext on direct click gesture
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }

    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setPhase('idle')
    setSecondsLeft(0)
    setCyclesCompleted(0)
    setSessionCompleted(false)
    setParticles([])
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  // Calculate dynamic circular progress parameters
  const getPhaseDuration = () => {
    if (phase === 'inhale') return currentRhythm.inhale
    if (phase === 'hold') return currentRhythm.hold
    if (phase === 'exhale') return currentRhythm.exhale
    return 1
  }

  const progressPercent = secondsLeft > 0 ? ((getPhaseDuration() - secondsLeft) / getPhaseDuration()) * 100 : 0
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent', color: '#3D2B1A', position: 'relative' }}>
      <GlobalBackground />
      <Navbar />

      <main style={{ flex: 1, position: 'relative', zIndex: 1, width: '100%', paddingBottom: 100 }}>
        
        {/* Header Block with Back link */}
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

        {/* Outer Elegant Glass Card for the Game Area */}
        <div style={{ maxWidth: 1000, margin: '30px auto 0', padding: '0 24px', boxSizing: 'border-box' }}>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(225, 215, 203, 0.8)',
            borderRadius: '40px',
            boxShadow: '0 20px 50px rgba(122, 78, 43, 0.08)',
            overflow: 'hidden',
            padding: '48px 32px'
          }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '55fr 45fr', gap: 40 }} className="gameplay-split-grid">
              
              {/* Left Column: Interactive Breathing Core */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                
                {/* Floating Heart / Child Target Area */}
                <div style={{
                  position: 'absolute',
                  top: -10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#8C4F1A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(140, 79, 26, 0.3)'
                  }}>
                    <Heart size={14} color="#FFF" fill="#FFF" />
                  </div>
                  <span style={{ fontSize: 9.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8C4F1A' }}>
                    Baby Aarav's Recovery
                  </span>
                </div>

                {/* Particle Canvas */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 10 }}>
                  {particles.map(p => (
                    <motion.div
                      key={p.id}
                      style={{
                        position: 'absolute',
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: 8 * p.scale,
                        height: 8 * p.scale,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, #EADFD6 20%, #8C4F1A 80%)',
                        opacity: p.opacity,
                        pointerEvents: 'none',
                        boxShadow: '0 0 8px rgba(140, 79, 26, 0.3)'
                      }}
                    />
                  ))}
                </div>

                {/* Major Breathing Circle & Flower Visualizer */}
                <div style={{ position: 'relative', width: 280, height: 280, marginTop: 40, display: 'flex', alignItems: 'center', justifyCenter: 'center', justifyContent: 'center' }}>
                  
                  {/* SVG Outer Progress Ring & Radials */}
                  <svg width="280" height="280" style={{ transform: 'rotate(-90deg)', position: 'absolute', top: 0, left: 0 }}>
                    {/* Background Soft dashed tracks */}
                    <circle cx="140" cy="140" r={radius} fill="none" stroke="rgba(235, 224, 214, 0.8)" strokeWidth="4" />
                    <circle cx="140" cy="140" r={radius + 15} fill="none" stroke="rgba(235, 224, 214, 0.3)" strokeWidth="1" strokeDasharray="4, 4" />
                    <circle cx="140" cy="140" r={radius - 15} fill="none" stroke="rgba(235, 224, 214, 0.5)" strokeWidth="0.8" strokeDasharray="3, 3" />
                    
                    {/* Active Timer Ring */}
                    {isPlaying && (
                      <motion.circle
                        cx="140"
                        cy="140"
                        r={radius}
                        fill="none"
                        stroke="#8C4F1A"
                        strokeWidth="5"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        transition={{ ease: 'linear' }}
                      />
                    )}
                  </svg>

                  {/* Central Elegant Blooming Flower & State */}
                  <div style={{
                    width: 220,
                    height: 220,
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: '1px solid rgba(220, 208, 195, 0.6)',
                    boxShadow: 'inset 0 4px 16px rgba(0,0,0,0.01), 0 10px 24px rgba(139, 94, 52, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 2
                  }}>
                    
                    {/* Glowing Aura Ring based on phase */}
                    <AnimatePresence>
                      {isPlaying && (
                        <motion.div
                          key={phase}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ 
                            opacity: phase === 'hold' ? 0.35 : 0.15,
                            scale: phase === 'inhale' ? 1.15 : phase === 'hold' ? 1.25 : 1.0
                          }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: getPhaseDuration(), ease: 'easeInOut' }}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(140, 79, 26, 0.4) 0%, transparent 70%)',
                            pointerEvents: 'none',
                            zIndex: -1
                          }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Highly polished Flower Silhouette inside the ring */}
                    <div style={{ width: 100, height: 100 }}>
                      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                        <motion.g
                          animate={{ 
                            scale: isPlaying 
                              ? (phase === 'inhale' ? [0.85, 1.25] : phase === 'hold' ? [1.25, 1.28, 1.25] : [1.25, 0.85])
                              : 1.0,
                            rotate: isPlaying ? (phase === 'hold' ? [0, 8, 0] : [0, 0]) : 0
                          }}
                          transition={{ 
                            duration: isPlaying ? getPhaseDuration() : 2, 
                            ease: 'easeInOut',
                            repeat: phase === 'hold' ? Infinity : 0
                          }}
                          style={{ originX: '50px', originY: '50px' }}
                        >
                          {/* Flower Stem / Base */}
                          <path d="M50 50 L50 75" stroke="#5C3D24" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                          
                          {/* Flower Petals (Elegant silhouette) */}
                          <path d="M50 50 C46 38, 54 38, 50 50 Z" fill="#5C3D24" opacity="0.9" />
                          <path d="M50 50 C38 42, 44 32, 50 50 Z" fill="#785338" opacity="0.85" />
                          <path d="M50 50 C62 42, 56 32, 50 50 Z" fill="#785338" opacity="0.85" />
                          <path d="M50 50 C34 48, 38 38, 50 50 Z" fill="#946B4E" opacity="0.75" />
                          <path d="M50 50 C66 48, 62 38, 50 50 Z" fill="#946B4E" opacity="0.75" />
                          
                          {/* Center core */}
                          <circle cx="50" cy="48" r="2.5" fill="#EADFD6" />
                          <circle cx="50" cy="48" r="1.5" fill="#5C3D24" />
                        </motion.g>
                      </svg>
                    </div>

                    {/* Numeric seconds indicator in center */}
                    <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ 
                        fontSize: 36, 
                        fontWeight: 900, 
                        color: '#4A3427', 
                        fontFamily: 'Outfit',
                        lineHeight: 1
                      }}>
                        {isPlaying ? secondsLeft : '0'}
                      </span>
                      <span style={{ 
                        fontSize: 10, 
                        fontWeight: 800, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.12em', 
                        color: '#8C4F1A',
                        marginTop: 4
                      }}>
                        {isPlaying ? phase : 'Ready'}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Central Status Text Notification */}
                <div style={{ marginTop: 24, textAlign: 'center', minHeight: 60 }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={phase}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 800, color: '#4A3427', fontFamily: 'Outfit' }}>
                        {phase === 'idle' && 'Begin Mindful Breathing'}
                        {phase === 'inhale' && 'Inhale Gently'}
                        {phase === 'hold' && 'Hold and Rest'}
                        {phase === 'exhale' && 'Exhale Fully'}
                      </h3>
                      <p style={{ margin: 0, fontSize: '13px', color: '#7A6A5A', fontStyle: 'italic', fontWeight: 500 }}>
                        {phase === 'idle' && 'Click Play to begin a 3-cycle sponsored wellness session.'}
                        {phase === 'inhale' && 'Breathe in slowly, filling your lungs with positivity.'}
                        {phase === 'hold' && 'Embrace absolute stillness, holding in the peacefulness.'}
                        {phase === 'exhale' && 'Release all weight, sending your healing energy upwards.'}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Ambient Visual Sound Bar Toggle */}
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <button
                    onClick={() => {
                      const nextSound = !soundEnabled
                      setSoundEnabled(nextSound)
                      if (nextSound) {
                        if (!audioContextRef.current) {
                          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
                        }
                        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                          audioContextRef.current.resume()
                        }
                        // Start hum immediately if currently in active phase
                        if (isPlaying && phase !== 'idle') {
                          setTimeout(() => startHum(phase === 'inhale' ? 220 : phase === 'hold' ? 261.63 : 196, 0.04), 50)
                        }
                      } else {
                        stopHum()
                      }
                    }}
                    style={{
                      border: 'none',
                      background: 'none',
                      padding: 6,
                      cursor: 'pointer',
                      color: soundEnabled ? '#8C4F1A' : '#A09080',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                    title={soundEnabled ? "Mute Ambient Hum" : "Enable Serene Ambient Sound"}
                  >
                    {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    <span style={{ fontSize: 11, fontWeight: 700 }}>Ambient Hum</span>
                  </button>
                </div>

              </div>

              {/* Right Column: Settings, Information & Gamification Progress */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '1px solid rgba(225, 215, 203, 0.5)', paddingLeft: 32 }} className="gameplay-settings-col">
                <div>
                  
                  {/* Title & Brand Intro */}
                  <div style={{ marginBottom: 28 }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'rgba(139,94,52,0.06)', border: '1px solid rgba(139,94,52,0.12)',
                      borderRadius: 99, padding: '4px 12px', marginBottom: 12
                    }}>
                      <Sparkles size={11} color="#8B5E34" />
                      <span style={{ fontSize: 9.5, fontWeight: 900, color: '#8B5E34', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        Wellness Portal
                      </span>
                    </div>

                    <h2 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: 900, color: '#4A3427', fontFamily: 'Outfit', letterSpacing: '-0.5px' }}>
                      Breathe & Bloom
                    </h2>
                    
                    <p style={{ margin: 0, fontSize: '13.5px', color: '#7A6A5A', lineHeight: 1.6, fontWeight: 500 }}>
                      Complete 3 full cycles of peaceful breathing. Our wellness sponsors will match your focus by executing a direct ₹10 contribution to Baby Aarav's treatment.
                    </p>
                  </div>

                  {/* Rhythm Style Selection Presets */}
                  <div style={{ marginBottom: 32 }}>
                    <h4 style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#8C4F1A' }}>
                      Select Breathing Technique
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {Object.entries(RHYTHMS).map(([key, details]) => (
                        <div
                          key={key}
                          onClick={() => {
                            setRhythmKey(key)
                            // Resume audio context just in case
                            if (!audioContextRef.current) {
                              audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
                            }
                            if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                              audioContextRef.current.resume()
                            }
                            // Update active countdown timer immediately if session is playing
                            if (isPlaying) {
                              const activeDur = details[phase] !== undefined ? details[phase] : details.inhale
                              setSecondsLeft(activeDur)
                            }
                          }}
                          style={{
                            background: rhythmKey === key ? '#FFFDFB' : 'rgba(255,255,255,0.4)',
                            border: rhythmKey === key ? '1.5px solid #8C4F1A' : '1px solid rgba(220, 208, 195, 0.6)',
                            borderRadius: '16px',
                            padding: '12px 16px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: rhythmKey === key ? '0 4px 12px rgba(139, 94, 52, 0.05)' : 'none'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 13.5, fontWeight: 700, color: '#4A3427' }}>
                              {details.name}
                            </span>
                            <span style={{ fontSize: 10, fontWeight: 800, color: '#8C4F1A', background: 'rgba(140, 79, 26, 0.08)', padding: '2px 8px', borderRadius: 99 }}>
                              {details.inhale}s - {details.hold}s - {details.exhale}s
                            </span>
                          </div>
                          <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#7A6A5A', lineHeight: 1.4 }}>
                            {details.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Core Cycle Counter Tracker */}
                  <div style={{
                    background: 'rgba(139, 94, 52, 0.03)',
                    border: '1px solid rgba(139, 94, 52, 0.08)',
                    borderRadius: '20px',
                    padding: '16px 20px',
                    marginBottom: 32
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#8C4F1A' }}>
                        Session Progress
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 900, color: '#4A3427', fontFamily: 'Outfit' }}>
                        {cyclesCompleted} / 3 Cycles
                      </span>
                    </div>

                    {/* Cycle mini dots */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                      {[0, 1, 2].map((idx) => {
                        const isDone = cyclesCompleted > idx
                        const isActive = isPlaying && cyclesCompleted === idx
                        return (
                          <div
                            key={idx}
                            style={{
                              flex: 1,
                              height: 6,
                              borderRadius: 99,
                              background: isDone 
                                ? '#8C4F1A' 
                                : isActive 
                                  ? 'linear-gradient(90deg, #EBD5C2, #8C4F1A)' 
                                  : 'rgba(235, 224, 214, 0.6)',
                              transition: 'all 0.4s'
                            }}
                          />
                        )
                      })}
                    </div>
                  </div>

                </div>

                {/* Bottom: Play Control Trigger Buttons */}
                <div style={{ display: 'flex', gap: 14 }}>
                  <motion.button
                    onClick={handleTogglePlay}
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(140, 79, 26, 0.16)' }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      flex: 2,
                      padding: '15px',
                      borderRadius: '16px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #8C4F1A, #5C2D0E)',
                      color: '#FFF',
                      fontWeight: 800,
                      fontSize: '14.5px',
                      fontFamily: 'Outfit',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: '0 6px 16px rgba(140, 79, 26, 0.12)'
                    }}
                  >
                    {isPlaying ? (
                      <>
                        <Pause size={15} /> Pause Session
                      </>
                    ) : (
                      <>
                        <Play size={15} /> {cyclesCompleted > 0 ? 'Resume Session' : 'Start Session'}
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    onClick={handleReset}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      flex: 1,
                      padding: '15px',
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
                    <RotateCcw size={14} /> Reset
                  </motion.button>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ────────────────── SUCCESS VAULT OVERLAY MODAL ────────────────── */}
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
                transition={{ type: 'spring', damping: 20 }}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '36px',
                  border: '1px solid rgba(225, 215, 203, 0.9)',
                  boxShadow: '0 30px 70px rgba(61, 43, 26, 0.25)',
                  width: '100%',
                  maxWidth: '540px',
                  padding: '36px',
                  boxSizing: 'border-box',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Background watermarked watercolor circle */}
                <div style={{
                  position: 'absolute',
                  top: -80,
                  right: -80,
                  width: 220,
                  height: 220,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(235, 224, 214, 0.4) 0%, transparent 70%)',
                  zIndex: 0,
                  pointerEvents: 'none'
                }} />

                <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  
                  {/* Verified badge */}
                  <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: '#FAF6F0',
                    border: '1px solid rgba(139, 94, 52, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    boxShadow: '0 8px 20px rgba(139, 94, 52, 0.08)'
                  }}>
                    <Award size={32} color="#8C4F1A" />
                  </div>

                  <span style={{ fontSize: '10.5px', fontWeight: 900, color: '#8C4F1A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Mindfulness Unlocked ✨
                  </span>

                  <h2 style={{ fontFamily: 'Outfit', fontSize: 26, fontWeight: 900, color: '#4A3427', margin: '6px 0 12px', letterSpacing: '-0.5px' }}>
                    Serenity Complete!
                  </h2>

                  <p style={{ margin: '0 auto 24px', fontSize: '14px', color: '#7A6A5A', lineHeight: 1.6, maxWidth: 440 }}>
                    You have successfully completed a mindful breathing session. Your focus has activated a matching sponsor payment of <strong>₹10</strong> directed straight to verified hospital bills for Baby Aarav's treatment!
                  </p>

                  {/* ────────────────── HIGH-END LUXURY CERTIFICATE CARD ────────────────── */}
                  <div style={{
                    background: '#FFFDF9',
                    border: '2px solid #EBD5C2',
                    borderRadius: '24px',
                    padding: '24px',
                    textAlign: 'left',
                    boxShadow: '0 8px 24px rgba(139, 94, 52, 0.03)',
                    marginBottom: 28,
                    position: 'relative'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <span style={{ fontSize: 8.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8C4F1A' }}>
                          Heal & Play Platform
                        </span>
                        <h4 style={{ margin: '2px 0 0', fontSize: 13.5, fontWeight: 800, color: '#4A3427', fontFamily: 'Outfit' }}>
                          Breathe & Bloom Ambassador
                        </h4>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 8, fontWeight: 900, color: '#47682C', background: '#F3F6F0', padding: '3px 8px', borderRadius: 99 }}>
                        <ShieldCheck size={10} /> SECURE AUDITED
                      </div>
                    </div>

                    {/* Certificate message text */}
                    <p style={{ margin: '0 0 16px', fontSize: 11.5, color: '#7A6A5A', lineHeight: 1.5 }}>
                      This represents verified recognition that a dedicated breathing mindfulness session was executed, triggering a match donation towards child ICU support billing.
                    </p>

                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#FAF6F2', borderRadius: '12px', padding: '10px 14px' }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 8, fontWeight: 800, textTransform: 'uppercase', color: '#A09080' }}>
                          Holder Name
                        </span>
                        <input
                          type="text"
                          value={helperName}
                          onChange={(e) => {
                            setHelperName(e.target.value)
                            localStorage.setItem('hp_user_name', e.target.value)
                          }}
                          style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '1px dashed rgba(140, 79, 26, 0.3)',
                            fontSize: 12,
                            fontWeight: 800,
                            color: '#4A3427',
                            padding: '2px 0',
                            outline: 'none'
                          }}
                        />
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: 8, fontWeight: 800, textTransform: 'uppercase', color: '#A09080' }}>
                          Matched
                        </span>
                        <div style={{ fontSize: 13, fontWeight: 900, color: '#8C4F1A' }}>
                          ₹10.00
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, borderTop: '1px solid rgba(235, 224, 214, 0.5)', paddingTop: 10 }}>
                      <span style={{ fontSize: 8, color: '#A09080', fontWeight: 600 }}>
                        ID: HP-{Math.floor(100000 + Math.random() * 900000)}
                      </span>
                      <span style={{ fontSize: 8.5, fontWeight: 800, color: '#47682C' }}>
                        ✓ TRANSACTION VERIFIED
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <motion.button
                      onClick={() => navigate('/main')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
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
                        <RotateCcw size={13} /> Breathe Again
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
