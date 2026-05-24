import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Volume2, VolumeX, ShieldAlert, Zap, Trophy, 
  Clock, RefreshCw, Activity, Smile, Brain, Sparkles, 
  Target, Award, ShieldAlert as WarningIcon
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { GlobalBackground } from '../components/PremiumBackground'
import { addContribution } from '../services/contributionService'

// Solfeggio reaction sounds to provide premium audio feedback
const AUDIO_FREQS = {
  tapPerfect: [528.00, 659.25], // Perfect harmony chime
  tapFast: 528.00, // standard pristine tone
  tapGood: 432.00, // earthy calming tone
  miss: [220.00, 233.08], // warm warning low pitch chord
  decoyPenalty: [180.00, 195.00], // harsh but soothing penalty chime
  victory: [261.63, 329.63, 392.00, 523.25, 659.25] // Ascending major sweep
}

export default function PulseReflexPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Game Settings States
  const [mode, setMode] = useState('Speed Rush') // 'Zen', 'Speed Rush', 'Hardcore Reflex'
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  // Core Game Variables
  const [targets, setTargets] = useState([]) // Array of active targets on canvas
  const [feedbackPopups, setFeedbackPopups] = useState([]) // Floating scores/text
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [tapsCount, setTapsCount] = useState(0)
  const [hitsCount, setHitsCount] = useState(0)
  const [bestReactionTime, setBestReactionTime] = useState(null) // in ms
  const [timeLeft, setTimeLeft] = useState(30) // game duration in seconds
  const [logs, setLogs] = useState(['Pulse Reflex Arena ready. Select a mode to begin.'])
  const [savingReward, setSavingReward] = useState(false)
  const [victoryModal, setVictoryModal] = useState(null)

  // Best score tracker stored in localstorage
  const [bestScores, setBestScores] = useState(() => {
    const saved = localStorage.getItem('pulsereflex_best_scores')
    return saved ? JSON.parse(saved) : {
      Zen: 0,
      'Speed Rush': 0,
      'Hardcore Reflex': 0
    }
  })

  const arenaRef = useRef(null)
  const audioContextRef = useRef(null)
  
  // Running intervals/timers refs
  const gameTimerRef = useRef(null)
  const spawnTimerRef = useRef(null)
  const targetIdCounterRef = useRef(0)

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  // Automatically start game loop on mount or mode change!
  useEffect(() => {
    startGame()
    return () => stopGameLoop()
  }, [mode])

  // Save best scores to localStorage on update
  useEffect(() => {
    localStorage.setItem('pulsereflex_best_scores', JSON.stringify(bestScores))
  }, [bestScores])

  // Audio system initializer
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
  }

  // Synthesize chimes in real-time
  const playSound = (type) => {
    if (!soundEnabled) return
    initAudio()
    try {
      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const now = ctx.currentTime

      if (type === 'tapPerfect') {
        AUDIO_FREQS.tapPerfect.forEach((freq, idx) => {
          const osc = ctx.createOscillator()
          const gainNode = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, now + idx * 0.05)
          gainNode.gain.setValueAtTime(0, now + idx * 0.05)
          gainNode.gain.linearRampToValueAtTime(0.08, now + idx * 0.05 + 0.01)
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.3)
          osc.connect(gainNode)
          gainNode.connect(ctx.destination)
          osc.start(now + idx * 0.05)
          osc.stop(now + idx * 0.05 + 0.3)
        })
      } else if (type === 'tapFast') {
        const osc = ctx.createOscillator()
        const gainNode = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(AUDIO_FREQS.tapFast, now)
        gainNode.gain.setValueAtTime(0, now)
        gainNode.gain.linearRampToValueAtTime(0.08, now + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.2)
        osc.connect(gainNode)
        gainNode.connect(ctx.destination)
        osc.start()
        osc.stop(now + 0.2)
      } else if (type === 'tapGood') {
        const osc = ctx.createOscillator()
        const gainNode = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(AUDIO_FREQS.tapGood, now)
        gainNode.gain.setValueAtTime(0, now)
        gainNode.gain.linearRampToValueAtTime(0.06, now + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.15)
        osc.connect(gainNode)
        gainNode.connect(ctx.destination)
        osc.start()
        osc.stop(now + 0.15)
      } else if (type === 'miss') {
        AUDIO_FREQS.miss.forEach((freq) => {
          const osc = ctx.createOscillator()
          const gainNode = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, now)
          gainNode.gain.setValueAtTime(0, now)
          gainNode.gain.linearRampToValueAtTime(0.06, now + 0.01)
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.25)
          osc.connect(gainNode)
          gainNode.connect(ctx.destination)
          osc.start()
          osc.stop(now + 0.25)
        })
      } else if (type === 'decoyPenalty') {
        AUDIO_FREQS.decoyPenalty.forEach((freq) => {
          const osc = ctx.createOscillator()
          const gainNode = ctx.createGain()
          osc.type = 'sawtooth'
          osc.frequency.setValueAtTime(freq, now)
          gainNode.gain.setValueAtTime(0, now)
          gainNode.gain.linearRampToValueAtTime(0.05, now + 0.01)
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.3)
          osc.connect(gainNode)
          gainNode.connect(ctx.destination)
          osc.start()
          osc.stop(now + 0.3)
        })
      } else if (type === 'victory') {
        AUDIO_FREQS.victory.forEach((freq, idx) => {
          const osc = ctx.createOscillator()
          const gainNode = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, now + idx * 0.1)
          gainNode.gain.setValueAtTime(0, now + idx * 0.1)
          gainNode.gain.linearRampToValueAtTime(0.07, now + idx * 0.1 + 0.01)
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 0.5)
          osc.connect(gainNode)
          gainNode.connect(ctx.destination)
          osc.start(now + idx * 0.1)
          osc.stop(now + idx * 0.1 + 0.5)
        })
      }
    } catch (e) {
      console.warn('Web Audio synthesis error:', e)
    }
  }

  // Start Arena Game Loop
  const startGame = () => {
    initAudio()
    stopGameLoop()

    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setTapsCount(0)
    setHitsCount(0)
    setBestReactionTime(null)
    setTargets([])
    setFeedbackPopups([])
    setVictoryModal(null)
    setIsPlaying(true)

    const gameDuration = mode === 'Zen' ? 45 : mode === 'Speed Rush' ? 30 : 25
    setTimeLeft(gameDuration)

    setLogs([`Pulse Arena loaded in ${mode} mode. Focus and tap targets!`])

    // Game duration timer loop
    gameTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleGameOverVictory()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Dynamic Target Spawner Loop
    const spawnInterval = mode === 'Zen' ? 1400 : mode === 'Speed Rush' ? 750 : 500
    
    // Spawn initial targets
    spawnTarget() 
    if (mode !== 'Zen') {
      setTimeout(() => spawnTarget(), 250)
    }

    spawnTimerRef.current = setInterval(() => {
      spawnTarget()
    }, spawnInterval)
  }

  // Stop all timers and intervals
  const stopGameLoop = () => {
    setIsPlaying(false)
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current)
      gameTimerRef.current = null
    }
    if (spawnTimerRef.current) {
      clearInterval(spawnTimerRef.current)
      spawnTimerRef.current = null
    }
  }

  // Spawn Target randomly inside boundaries
  const spawnTarget = () => {
    // Rely on absolute state checking to prevent spawning after timer expires
    setTargets(prev => {
      const maxActive = mode === 'Zen' ? 2 : mode === 'Speed Rush' ? 3 : 4
      if (prev.length >= maxActive) return prev // target capping to avoid cluttering

      const id = ++targetIdCounterRef.current
      
      // Boundary coordinate safety (15% - 85% to ensure it is fully within container)
      const x = Math.floor(Math.random() * 70) + 15
      const y = Math.floor(Math.random() * 60) + 15
      
      // 25% chance of fake/decoy targets in Hardcore Mode
      const isDecoy = mode === 'Hardcore Reflex' && Math.random() < 0.25

      // Dynamic Lifespans scaling down as scores increase
      let lifespan = 1800 // Zen
      if (mode === 'Speed Rush') {
        lifespan = Math.max(700, 1400 - (score * 3.5)) // shrinks as score rises
      } else if (mode === 'Hardcore Reflex') {
        lifespan = Math.max(480, 950 - (score * 5)) // extremely narrow timing
      }

      const types = ['neural-pulse', 'energy-node', 'luxury-orb', 'elegant-ripple']
      const type = types[Math.floor(Math.random() * types.length)]

      const newTarget = {
        id,
        x,
        y,
        type,
        isDecoy,
        spawnTime: Date.now(),
        lifespan
      }

      // Disappear Timer trigger
      setTimeout(() => {
        handleTargetExpiry(id)
      }, lifespan)

      return [...prev, newTarget]
    })
  }

  // Handle Target Expiry
  const handleTargetExpiry = (id) => {
    setTargets(prev => {
      const target = prev.find(t => t.id === id)
      if (target) {
        // If it was a real target and missed, trigger missed penalty and break streak
        if (!target.isDecoy) {
          playSound('miss')
          setStreak(0)
          setLogs(prevLogs => [`✗ Target expired. Combo streak reset.`, ...prevLogs])
        }
        return prev.filter(t => t.id !== id)
      }
      return prev
    })
  }

  // Click Target handler
  const handleTargetTap = (e, target) => {
    e.stopPropagation() // Prevent arena background miss triggers
    if (!isPlaying) return

    setTapsCount(prev => prev + 1)
    
    // DECOY TARGET TRIGGERED
    if (target.isDecoy) {
      playSound('decoyPenalty')
      setScore(prev => Math.max(0, prev - 75))
      setStreak(0)
      
      // Spawn floating penalty feedback
      const popup = {
        id: Math.random(),
        x: target.x,
        y: target.y,
        label: 'DECOY PENALTY!',
        score: -75,
        color: '#8C4F1A'
      }
      setFeedbackPopups(prev => [...prev, popup])
      setLogs(prev => [`⚠ Decoy Target clicked! -75 score penalty. Streak reset.`, ...prev])
      
      // Remove clicked target
      setTargets(prev => prev.filter(t => t.id !== target.id))
      return
    }

    // REAL TARGET CLICKED SUCCESSFULLY
    const reactionTime = Date.now() - target.spawnTime
    setHitsCount(prev => prev + 1)

    // Calculate Best reaction time
    setBestReactionTime(prev => {
      if (prev === null) return reactionTime
      return Math.min(prev, reactionTime)
    })

    // Accuracy thresholds
    let points = 50
    let label = 'GOOD'
    let sound = 'tapGood'

    if (reactionTime < 240) {
      points = 250
      label = 'LIGHTNING!'
      sound = 'tapPerfect'
    } else if (reactionTime < 420) {
      points = 150
      label = 'PERFECT'
      sound = 'tapPerfect'
    } else if (reactionTime < 700) {
      points = 100
      label = 'FAST'
      sound = 'tapFast'
    }

    // Apply Streak multiplier
    const currentStreak = streak + 1
    setStreak(currentStreak)
    if (currentStreak > maxStreak) {
      setMaxStreak(currentStreak)
    }

    const multiplier = 1 + Math.min(4, Math.floor(currentStreak / 5) * 0.5) // Max 5x mult
    const finalPoints = Math.floor(points * multiplier)

    playSound(sound)
    setScore(prev => prev + finalPoints)

    // Floating feedback popup
    const popup = {
      id: Math.random(),
      x: target.x,
      y: target.y,
      label: `${label} (${reactionTime}ms)`,
      score: finalPoints,
      color: label === 'LIGHTNING!' ? '#D4AF37' : '#8B6239'
    }
    setFeedbackPopups(prev => [...prev, popup])

    setLogs(prev => [
      `✓ Hit! ${label} reaction (${reactionTime}ms). Earned +${finalPoints} pts.`,
      ...prev
    ])

    // Remove clicked target
    setTargets(prev => prev.filter(t => t.id !== target.id))

    // Spawn replacement immediately to keep the gameplay extremely fast-paced and snappy!
    setTimeout(() => spawnTarget(), 50)
  }

  // Handle click on empty arena space (mismatch miss)
  const handleArenaMiss = (e) => {
    if (!isPlaying) return
    
    // Play warning sound
    playSound('miss')
    setTapsCount(prev => prev + 1)
    setStreak(0)
    
    setLogs(prev => [`✗ Blank space tap. Combo streak broken.`, ...prev])
  }

  // Get Target Sizing class depending on Mode
  const getTargetSizeClass = (target) => {
    if (mode === 'Zen') return 'w-20 h-20'
    if (mode === 'Hardcore Reflex') return target.isDecoy ? 'w-16 h-16' : 'w-12 h-12'
    return 'w-16 h-16'
  }

  // Clear Popups transition helper
  const handlePopupAnimationComplete = (id) => {
    setFeedbackPopups(prev => prev.filter(p => p.id !== id))
  }

  // Victory Event
  const handleGameOverVictory = () => {
    stopGameLoop()
    playSound('victory')

    let isNewBest = false
    const currentBest = bestScores[mode]
    if (score > currentBest) {
      isNewBest = true
      setBestScores(prev => ({
        ...prev,
        [mode]: score
      }))
    }

    const accuracy = tapsCount > 0 ? Math.round((hitsCount / tapsCount) * 100) : 100

    setVictoryModal({
      score,
      maxStreak,
      bestReactionTime,
      accuracy,
      isNewBest,
      currentBest: isNewBest ? score : currentBest
    })

    setLogs(prev => [
      `🎉 Arena mastered! Final score: ${score}. Best reaction time: ${bestReactionTime || 0}ms.`,
      ...prev
    ])

    // Dispatches contribution directly to pediatric treatment ledger
    handleClaimSponsorContribution()
  }

  // Post match contribution dispatches
  const handleClaimSponsorContribution = async () => {
    if (!user?.uid || savingReward) return
    setSavingReward(true)
    try {
      await addContribution(user.uid, 20, 'Janamithra', 'Pulse Reflex Neural Symmetrical Alignment Match Reward', true)
      setLogs(prev => ['✓ Sponsoring pediatric healthcare pools ₹20 contribution alignment generated successfully!', ...prev])
    } catch (err) {
      console.error('Failed writing match contribution:', err)
    } finally {
      setSavingReward(false)
    }
  }

  // Floating ambient stardust
  const ambientNodes = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 3,
    delay: Math.random() * 5
  }))

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFFDFB] to-[#F5F1EB] transition-all duration-700 relative font-sans animate-fade-in overflow-hidden pb-16">
      <GlobalBackground />
      <Navbar />

      {/* Floating stardust ambient particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {ambientNodes.map(node => (
          <motion.div
            key={node.id}
            className="absolute rounded-full"
            style={{
              width: node.size,
              height: node.size,
              background: 'rgba(139, 98, 57, 0.15)',
              top: `${node.y}%`,
              left: `${node.x}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: node.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <main className="flex-1 relative z-10 w-full pb-20 overflow-x-hidden" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 4rem)' }}>
        
        {/* Back Link Header */}
        <div className="max-w-[1200px] mx-auto mt-8 px-6 box-border">
          <button 
            onClick={() => navigate('/main')}
            className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md border border-[#EADFCF] px-6 py-3 rounded-full text-xs font-bold text-[#8B6239] cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
        </div>

        {/* Tactile Luxe PulseReflex Layout Canvas */}
        <div className="max-w-[1100px] mx-auto mt-6 px-6 box-border">
          
          <div className="bg-[#FFFDFB]/90 backdrop-blur-2xl border border-[#EADFCF] rounded-[32px] md:rounded-[44px] shadow-2xl p-5 sm:p-8 lg:p-12 overflow-hidden relative">
            <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-radial-gradient from-amber-50 to-transparent pointer-events-none opacity-60" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
              
              {/* LEFT COLUMN: PULSE TARGETS ARENA */}
              <div className="lg:col-span-8 flex flex-col items-center">
                
                {/* HUD Header Details */}
                <div className="w-full flex justify-between items-center mb-6">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-[#8B6239] uppercase flex items-center gap-1.5">
                      <Target size={12} className="animate-pulse text-[#8B6239]" /> NEURAL REFLEX ARENA
                    </span>
                    <h2 className="text-xl md:text-2xl font-black text-[#3A281A] mt-1">Pulse Reflex</h2>
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

                {/* Tactile Arena Interactive Canvas */}
                <div 
                  ref={arenaRef}
                  onClick={handleArenaMiss}
                  className="w-full h-[360px] md:h-[480px] bg-gradient-to-tr from-[#F5F1EB]/50 to-[#FFFDFB] border-2 border-[#EADFCF] rounded-[24px] md:rounded-[40px] shadow-inner relative box-border overflow-hidden cursor-crosshair flex items-center justify-center"
                >
                  {/* Background grid texture lines for premium blueprint depth */}
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-[0.04] pointer-events-none">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div key={i} className="border border-[#3A281A] w-full h-full" />
                    ))}
                  </div>

                  {/* ACTIVE TARGETS RENDER */}
                  <AnimatePresence>
                    {isPlaying && targets.map(target => {
                      const isDecoy = target.isDecoy
                      const sizeClass = getTargetSizeClass(target)
                      
                      return (
                        <motion.div
                          key={target.id}
                          onClick={(e) => handleTargetTap(e, target)}
                          className={`absolute ${sizeClass} flex items-center justify-center select-none z-40 cursor-pointer pointer-events-auto`}
                          style={{
                            top: `${target.y}%`,
                            left: `${target.x}%`,
                            transform: 'translate(-50%, -50%)',
                          }}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ 
                            scale: [0, 1.1, 1], 
                            opacity: 1 
                          }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.12, type: 'spring', stiffness: 500, damping: 20 }}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.94 }}
                        >
                          {/* Inner premium pulse ripple graphics */}
                          <div className="relative w-full h-full flex items-center justify-center">
                            
                            {/* Glowing border ripple background circles */}
                            <motion.div 
                              className={`absolute inset-0 rounded-full border-2 opacity-50 ${isDecoy ? 'border-amber-900 bg-amber-950/20' : 'border-[#8B6239] bg-[#8B6239]/10'}`}
                              animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                              transition={{ repeat: Infinity, duration: 1.2 }}
                            />
                            
                            {/* Circular shrinking timer ring */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                              <motion.circle
                                cx="50"
                                cy="50"
                                r="42"
                                fill="none"
                                stroke={isDecoy ? '#8C4F1A' : '#8B6239'}
                                strokeWidth="4"
                                strokeLinecap="round"
                                initial={{ pathLength: 1 }}
                                animate={{ pathLength: 0 }}
                                transition={{ duration: target.lifespan / 1000, ease: 'linear' }}
                              />
                            </svg>

                            {/* Core Node Button */}
                            <div 
                              className={`w-3/5 h-3/5 rounded-full border shadow-lg flex items-center justify-center relative z-10 ${
                                isDecoy 
                                  ? 'bg-[#3A281A] border-amber-900 shadow-amber-900/10' 
                                  : 'bg-white border-[#EADFCF] shadow-[#8B6239]/10'
                              }`}
                            >
                              {/* Inner glowing core details */}
                              <div 
                                className={`w-1/2 h-1/2 rounded-full ${
                                  isDecoy 
                                    ? 'bg-[#8B6239]' 
                                    : 'bg-gradient-to-r from-[#8B6239] to-[#D4AF37] animate-pulse'
                                }`} 
                              />
                            </div>

                            {/* Minimal warning label for Decoy Nodes to test attention */}
                            {isDecoy && (
                              <span className="absolute -bottom-6 bg-[#3A281A] border border-amber-800 text-[6.5px] font-black text-amber-500 px-1.5 py-0.5 rounded uppercase tracking-wider whitespace-nowrap shadow-sm z-20">
                                FAKE NODE
                              </span>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>

                  {/* FLOATING SCORE POPUPS FEEDBACK RENDER */}
                  <AnimatePresence>
                    {feedbackPopups.map(popup => (
                      <motion.div
                        key={popup.id}
                        className="absolute pointer-events-none select-none z-50 text-center font-black flex flex-col items-center"
                        style={{
                          top: `${popup.y}%`,
                          left: `${popup.x}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                        initial={{ y: 0, opacity: 1, scale: 0.8 }}
                        animate={{ y: -50, opacity: 0, scale: 1.3 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        onAnimationComplete={() => handlePopupAnimationComplete(popup.id)}
                      >
                        <span 
                          className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow-sm"
                          style={{ 
                            background: popup.color, 
                            color: '#FFFDF9' 
                          }}
                        >
                          {popup.label}
                        </span>
                        <span 
                          className="text-lg mt-1"
                          style={{ color: popup.color }}
                        >
                          {popup.score > 0 ? `+${popup.score}` : popup.score}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                </div>

                {/* Symmetrical Hint footer */}
                <div className="w-full flex items-center gap-3 bg-[#F5F1EB]/50 border border-[#EADFCF] rounded-2xl p-4 mt-6 text-xs text-[#6F4D2E] leading-relaxed">
                  <Smile size={16} className="text-[#8B6239] flex-shrink-0" />
                  <span>
                    <strong>Attention Quest:</strong> Tap dynamic pulse nodes before their timer circle collapses. Tap speed triggers accuracy multipliers. In <strong>Hardcore Reflex</strong> mode, avoid dark FAKE targets.
                  </span>
                </div>

              </div>

              {/* RIGHT COLUMN: HIGH-END GAME HUD & LEADERBOARD */}
              <div className="lg:col-span-4 flex flex-col justify-between lg:border-l border-[#EADFCF]/60 lg:pl-8 mt-8 lg:mt-0">
                
                <div>
                  
                  {/* Sound and Volume Configurations */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black tracking-widest text-[#8B6239] uppercase">
                      PULSE ENGINE
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
                      Reflex Mode
                    </span>

                    <div className="grid grid-cols-1 gap-2 mb-4">
                      {[
                        { name: 'Zen', desc: 'Calming, ambient pulse pacing' },
                        { name: 'Speed Rush', desc: 'Combo multiplier rush focus' },
                        { name: 'Hardcore Reflex', desc: 'Decoys, extreme speeds & timings' }
                      ].map(item => (
                        <button
                          key={item.name}
                          onClick={() => {
                            if (isPlaying) stopGameLoop()
                            setMode(item.name)
                          }}
                          className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                            mode === item.name
                              ? 'bg-[#8B6239] text-white border-[#8B6239] shadow-md'
                              : 'bg-white text-[#8B6239] border-[#EADFCF] hover:bg-[#F5F1EB]'
                          }`}
                        >
                          <div className="mt-0.5">
                            {item.name === 'Zen' ? <Smile size={14} /> : item.name === 'Speed Rush' ? <Zap size={14} /> : <ShieldAlert size={14} />}
                          </div>
                          <div>
                            <span className="text-[11px] font-black tracking-wide block uppercase leading-none">{item.name}</span>
                            <span className={`text-[8.5px] mt-1 block leading-normal ${mode === item.name ? 'text-amber-100' : 'text-[#8B6239]/65'}`}>
                              {item.desc}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={startGame}
                      className="w-full py-4 rounded-2xl bg-white border border-[#8B6239] text-xs font-black text-[#8B6239] cursor-pointer hover:bg-[#F5F1EB] transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={12} className="animate-spin-slow" /> RE-START ARENA
                    </button>
                  </div>

                  {/* SCOREBOARD STATUS HUD */}
                  <div className="bg-white border border-[#EADFCF] rounded-[32px] p-6 mb-6 shadow-sm">
                    <h4 className="text-[10px] font-black tracking-wider text-[#8B6239] uppercase mb-4 flex items-center gap-1.5">
                      <Trophy size={13} /> REFLEX STATUS METRIC
                    </h4>

                    <div className="grid grid-cols-2 gap-3 text-center mb-3">
                      <div className="bg-[#F5F1EB]/30 border border-[#EADFCF]/60 rounded-2xl p-3">
                        <div className="text-[8.5px] font-black text-[#8B6239] uppercase tracking-wide">Reflex Score</div>
                        <div className="text-xl font-black text-[#3A281A] mt-1">{score}</div>
                      </div>

                      <div className="bg-[#F5F1EB]/30 border border-[#EADFCF]/60 rounded-2xl p-3">
                        <div className="text-[8.5px] font-black text-[#8B6239] uppercase tracking-wide">Time Left</div>
                        <div className="text-xl font-black text-red-800 mt-1">{timeLeft}s</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="bg-[#F5F1EB]/30 border border-[#EADFCF]/60 rounded-2xl p-3">
                        <div className="text-[8.5px] font-black text-[#8B6239] uppercase tracking-wide">Best Reflex</div>
                        <div className="text-xs font-black text-[#3A281A] mt-1.5">
                          {bestReactionTime ? `${bestReactionTime}ms` : 'N/A'}
                        </div>
                      </div>

                      <div className="bg-[#F5F1EB]/30 border border-[#EADFCF]/60 rounded-2xl p-3">
                        <div className="text-[8.5px] font-black text-[#8B6239] uppercase tracking-wide">Best Score</div>
                        <div className="text-xs font-black text-[#3A281A] mt-1.5">{bestScores[mode]} pts</div>
                      </div>
                    </div>
                  </div>

                  {/* ACTION LOG CHRONOLOGY */}
                  <div>
                    <h4 className="text-[10px] font-black tracking-wider text-[#8B6239] uppercase mb-3 flex items-center gap-1.5">
                      <Activity size={13} /> REFLEX ENGINE LOGS
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

        {/* ────────────────── VICTORY & GAME OVER MODALS ────────────────── */}
        <AnimatePresence>
          {victoryModal && (
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
                {/* Confetti floats */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-[#D4AF37]"
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
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  ))}
                </div>

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <Award size={34} className="text-[#8B6239] animate-bounce" />
                  </div>

                  <span className="text-[10px] font-black tracking-widest text-[#8B6239] uppercase">
                    ARENA MASTERED 🏆
                  </span>

                  <h2 className="text-2xl font-black text-[#3A281A] my-3">
                    Neural Alignment!
                  </h2>

                  <p className="text-xs text-[#6F4D2E] leading-relaxed mb-6">
                    Sensory coordination test complete! You completed the <strong>{mode}</strong> challenge with <strong>{victoryModal.score} points</strong> and <strong>{victoryModal.accuracy}% accuracy</strong>.
                    <br />
                    A matching transaction of ₹20 has been dispatched by corporate wellness sponsors directly to Janamithra's treatment pool ledger.
                  </p>

                  <div className="bg-[#FFFDF9] border border-[#EADFCF] rounded-2xl p-5 text-left mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <span className="text-[9px] font-black text-[#8B6239] tracking-wider uppercase">Best Speed</span>
                        <div className="text-sm font-extrabold text-[#3A281A]">{victoryModal.bestReactionTime || 0}ms</div>
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

                  {/* Modal button triggers */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={startGame}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#8B6239] to-[#6F4D2E] text-white font-extrabold text-xs tracking-wide shadow-md hover:shadow-lg cursor-pointer"
                    >
                      PLAY AGAIN
                    </button>

                    <button
                      onClick={() => navigate('/thank-you')}
                      className="w-full py-3.5 rounded-2xl border border-[#EADFCF] bg-white text-xs font-black text-[#8B6239] cursor-pointer hover:bg-[#F5F1EB]"
                    >
                      Return to Dashboard
                    </button>
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
