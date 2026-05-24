import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Volume2, VolumeX, Award, 
  Share2, ChevronRight, Star, RefreshCw, Trophy,
  ListTodo, HelpCircle, Sparkles, CheckCircle2, AlertCircle, Play
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { GlobalBackground } from '../components/PremiumBackground'
import { addContribution } from '../services/contributionService'

// Luxury audio frequencies for satisfying stretching chimes
const FLEX_CHIMES = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]

// 3 Highly-Engineered levels with strategic grids
const LEVELS = [
  {
    id: 1,
    name: "Ivory Sanctuary",
    size: 4,
    startX: 0,
    startY: 0,
    grid: [
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]
  },
  {
    id: 2,
    name: "Amber Pathway",
    size: 5,
    startX: 0,
    startY: 0,
    grid: [
      [0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0]
    ]
  },
  {
    id: 3,
    name: "Obsidian Matrix",
    size: 6,
    startX: 0,
    startY: 0,
    grid: [
      [0, 0, 0, 0, 0, 0],
      [0, 1, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0, 0],
      [0, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 0]
    ]
  }
]

// Atmospheric level visual variables
const THEMES = {
  1: {
    bgClass: "from-[#FFFDFB] to-[#F5F1EB] text-[#3A281A]",
    gridBg: "bg-[#F5F1EB]/40 border-2 border-[#EADFCF]",
    obstacleClass: "bg-[#3A281A] shadow-inner border border-[#8B6239]/20",
    tileBg: "bg-white/80 border border-[#EADFCF]/30 shadow-sm",
    particleColor: "rgba(139, 98, 57, 0.35)",
    trailColor: "#8B6239"
  },
  2: {
    bgClass: "from-[#FDFBF7] to-[#EADFCF]/50 text-[#3A281A]",
    gridBg: "bg-[#EADFCF]/35 border-2 border-[#C89B6C]",
    obstacleClass: "bg-gradient-to-br from-[#8B6239] to-[#5C3D24] shadow-md border-2 border-[#D4AF37]/40",
    tileBg: "bg-white border border-[#C89B6C]/25 shadow-sm",
    particleColor: "rgba(212, 175, 55, 0.45)",
    trailColor: "#C89B6C"
  },
  3: {
    bgClass: "from-[#20150E] to-[#120A05] text-stone-100",
    gridBg: "bg-[#1E1107]/80 border-2 border-[#8B6239]/40",
    obstacleClass: "bg-gradient-to-br from-[#160F0A] to-[#050302] shadow-2xl border border-[#3A281A] ring-2 ring-[#8B6239]/30",
    tileBg: "bg-[#2A1D13] border border-[#8B6239]/20 shadow-inner text-white",
    particleColor: "rgba(234, 168, 124, 0.55)",
    trailColor: "#EAA87C"
  }
}

export default function FlexPathPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Game States
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  
  // Stretch Tail Path state: array of { x, y } coordinates
  const [path, setPath] = useState([])
  const [gridState, setGridState] = useState([])
  const [gameState, setGameState] = useState('playing') // 'playing', 'failed', 'level-complete', 'all-complete'
  
  // Custom blinks/happy expressions state machine
  const [faceState, setFaceState] = useState('idle') // 'idle', 'blinking', 'happy', 'trapped'

  // Parallax camera impulse state
  const [boardAnimateState, setBoardAnimateState] = useState({ scale: 1, rotate: 0 })

  // Victory logs
  const [logs, setLogs] = useState(['Select glowing adjacent tiles to stretch tail flow.'])
  const [savingReward, setSavingReward] = useState(false)
  const [helperName, setHelperName] = useState(localStorage.getItem('hp_user_name') || 'Generous Supporter')
  const [isCopied, setIsCopied] = useState(false)

  const audioContextRef = useRef(null)
  const activeLevel = LEVELS[currentLevelIdx] || LEVELS[0]
  const activeTheme = THEMES[activeLevel.id] || THEMES[1]

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  // Initialize level coordinate structures
  useEffect(() => {
    initializeLevel()
  }, [currentLevelIdx])

  // Blinking loop for lovable personality
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (gameState === 'failed') {
        setFaceState('trapped')
        return
      }
      setFaceState('blinking')
      setTimeout(() => {
        setFaceState(gameState === 'failed' ? 'trapped' : 'idle')
      }, 250)
    }, 4200)

    return () => clearInterval(blinkInterval)
  }, [gameState])

  const initializeLevel = () => {
    const level = LEVELS[currentLevelIdx]
    if (!level) return
    
    // Copy grid array safely
    const copy = level.grid.map(row => [...row])
    setGridState(copy)
    
    const startCoord = { x: level.startX, y: level.startY }
    setPath([startCoord])
    setGameState('playing')
    setFaceState('idle')
    setBoardAnimateState({ scale: 1, rotate: 0 })
    setLogs(prev => [`Level ${level.id} (${level.name}) loaded. Tap neighbors.`, ...prev])
  }

  const handleRestart = () => {
    initializeLevel()
  }

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
  }

  // Soft marimba Solfeggio sound chimes
  const playSoundChime = (freqIdx = 0, isHigh = false) => {
    if (!soundEnabled) return
    initAudio()
    try {
      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()
      const baseFreq = FLEX_CHIMES[freqIdx % FLEX_CHIMES.length] || 329.63
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(isHigh ? baseFreq * 1.6 : baseFreq, ctx.currentTime)
      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5)

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.5)
    } catch (e) {
      console.warn('Audio synthesis block:', e)
    }
  }

  // Interactive Click-to-Stretch logic
  const handleTileClick = (r, c) => {
    if (gameState !== 'playing') return
    const head = path[path.length - 1]
    const size = activeLevel.size

    // Validate adjacency
    const isAdjacent = Math.abs(head.x - c) + Math.abs(head.y - r) === 1
    if (!isAdjacent) return

    // Option A: Undo / retract step
    const isPrevSegment = path.length > 1 && path[path.length - 2].x === c && path[path.length - 2].y === r
    if (isPrevSegment) {
      setPath(prev => prev.slice(0, -1))
      playSoundChime(path.length - 2, false)
      setBoardAnimateState({ scale: [1, 0.99, 1], rotate: [0, -0.4, 0] })
      setLogs(prev => ['Retracted stretch coordinate.', ...prev])
      return
    }

    // Option B: Hit brick obstacle
    if (gridState[r] && gridState[r][c] === 1) {
      playSoundChime(0, false)
      return
    }

    // Option C: Hit self path
    const isOccupied = path.some(segment => segment.x === c && segment.y === r)
    if (isOccupied) {
      playSoundChime(0, false)
      return
    }

    // Option D: Successful stretch flow!
    const newPath = [...path, { x: c, y: r }]
    setPath(newPath)
    playSoundChime(newPath.length, false)
    
    // Expressive face shift
    setFaceState('happy')
    setTimeout(() => {
      setFaceState('idle')
    }, 600)

    // Trigger board camera spring impulse
    setBoardAnimateState({ scale: [1, 0.98, 1.01, 1], rotate: [0, -0.4, 0.4, 0] })

    // Check completion criteria: cover all vacant cells
    let fillableCount = 0
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (activeLevel.grid[row][col] === 0) {
          fillableCount++
        }
      }
    }

    if (newPath.length === fillableCount) {
      handleLevelComplete()
      return
    }

    // Check Trapped state
    checkTrappedState(newPath, size)
  }

  const checkTrappedState = (currentPath, size) => {
    const head = currentPath[currentPath.length - 1]
    const directions = [
      { dx: 0, dy: -1 }, // Up
      { dx: 0, dy: 1 },  // Down
      { dx: -1, dy: 0 }, // Left
      { dx: 1, dy: 0 }   // Right
    ]

    let hasMoves = false
    for (const d of directions) {
      const nx = head.x + d.dx
      const ny = head.y + d.dy

      // Check bounds
      if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
        const isObstacle = gridState[ny] && gridState[ny][nx] === 1
        const isOccupied = currentPath.some(s => s.x === nx && s.y === ny)
        if (!isObstacle && !isOccupied) {
          hasMoves = true
          break
        }
      }
    }

    if (!hasMoves) {
      playSoundChime(0, false)
      setGameState('failed')
      setFaceState('trapped')
      setLogs(prev => ['⚠️ Trapped! Press Undo or Quick Restart to plan another route.', ...prev])
    }
  }

  const handleLevelComplete = () => {
    playSoundChime(6, true)
    if (currentLevelIdx < LEVELS.length - 1) {
      setGameState('level-complete')
      setLogs(prev => [`🎉 Level ${activeLevel.id} cleared perfect coverage!`, ...prev])
    } else {
      setGameState('all-complete')
      setLogs(prev => [`🏆 Quest Complete! Matching sponsor rewards unlocked!`, ...prev])
      handleClaimVictoryMatch()
    }
  }

  const handleClaimVictoryMatch = async () => {
    if (!user?.uid || savingReward) return
    setSavingReward(true)
    try {
      await addContribution(user.uid, 10, 'Baby Aarav', 'Sponsor Matched FlexPath Victory')
    } catch (err) {
      console.error('Failed writing match contribution:', err)
    } finally {
      setSavingReward(false)
    }
  }

  const handleNextLevel = () => {
    setCurrentLevelIdx(prev => prev + 1)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  // Draw expressive face
  const getFaceChar = () => {
    if (faceState === 'trapped') return '╥﹏╥'
    if (faceState === 'happy') return '◕‿◕'
    if (faceState === 'blinking') return '-‿-'
    return '◠‿◠'
  }

  // Draw elegant crawling trail tube connecting cells
  const renderPathTraceLine = () => {
    if (path.length < 2) return null
    const size = activeLevel.size
    const cellSizePct = 100 / size
    
    let d = ""
    path.forEach((segment, idx) => {
      const cx = segment.x * cellSizePct + (cellSizePct / 2)
      const cy = segment.y * cellSizePct + (cellSizePct / 2)
      if (idx === 0) {
        d += `M ${cx} ${cy}`
      } else {
        d += ` L ${cx} ${cy}`
      }
    })

    return (
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <linearGradient id="trailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EADFCF" />
            <stop offset="50%" stopColor="#8B6239" />
            <stop offset="100%" stopColor="#3A281A" />
          </linearGradient>
        </defs>
        
        {/* Soft dynamic underlying glow shadow */}
        <motion.path
          d={d}
          fill="none"
          stroke="#8B6239"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.22"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
        
        {/* Core premium pipeline gradient */}
        <motion.path
          d={d}
          fill="none"
          stroke="url(#trailGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
        
        {/* Shimmering crawling gold dash trail */}
        <motion.path
          d={d}
          fill="none"
          stroke="#FFFDFB"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4, 10"
          animate={{ strokeDashoffset: [0, -20] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
        />
      </svg>
    )
  }

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br ${activeTheme.bgClass} transition-all duration-700 relative font-sans animate-fade-in overflow-hidden pb-16`}>
      <GlobalBackground />
      <Navbar />

      {/* Atmospheric floating stardust particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 5 + 3,
              height: Math.random() * 5 + 3,
              background: activeTheme.particleColor,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -35, 0],
              opacity: [0.15, 0.7, 0.15],
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
        
        {/* Top Header Back button */}
        <div className="max-w-[1200px] mx-auto mt-8 px-6 box-border animate-fade-in">
          <button 
            onClick={() => navigate('/main')}
            className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md border border-[#EADFCF] px-6 py-3 rounded-full text-xs font-bold text-[#8B6239] cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
        </div>

        {/* Premium Playground Body Layout */}
        <div className="max-w-[1100px] mx-auto mt-6 px-6 box-border">
          
          <div className="bg-[#FFFDFB]/95 backdrop-blur-2xl border border-[#EADFCF] rounded-[44px] shadow-2xl p-8 lg:p-12 overflow-hidden relative">
            
            {/* Absolute radial background soft gradient glow */}
            <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-radial-gradient from-amber-50 to-transparent pointer-events-none opacity-60" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
              
              {/* LEFT COLUMN: TACTILE PLAYABLE MAZE BOARD */}
              <div className="lg:col-span-7 flex flex-col items-center">
                
                {/* Level Title HUD */}
                <div className="w-full flex justify-between items-center mb-6">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-[#8B6239] uppercase">
                      LEVEL {activeLevel.id} — {activeLevel.name}
                    </span>
                    <h2 className="text-2xl font-black text-[#3A281A] mt-1">Zen Stretch Journey</h2>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-[#8B6239] bg-[#EADFCF]/20 px-3.5 py-1.5 rounded-full border border-[#EADFCF]/40 shadow-inner">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B6239] animate-ping" /> TOUCHPAD ACTIVE
                  </div>
                </div>

                {/* Symmetrical Tactile Board Canvas */}
                <motion.div 
                  animate={boardAnimateState}
                  transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                  className={`w-full aspect-square ${activeTheme.gridBg} rounded-[40px] p-6 shadow-2xl relative box-border flex items-center justify-center`}
                >
                  
                  {/* Dynamic Shimmer path line connects segments */}
                  {renderPathTraceLine()}

                  {/* Grid layout cells */}
                  <div 
                    className="grid gap-2.5 w-full h-full relative z-20"
                    style={{
                      gridTemplateColumns: `repeat(${activeLevel.size}, 1fr)`,
                      gridTemplateRows: `repeat(${activeLevel.size}, 1fr)`
                    }}
                  >
                    {Array.from({ length: activeLevel.size * activeLevel.size }, (_, i) => {
                      const size = activeLevel.size
                      const r = Math.floor(i / size)
                      const c = i % size
                      
                      const isObstacle = gridState[r] && gridState[r][c] === 1
                      const pathIndex = path.findIndex(segment => segment.x === c && segment.y === r)
                      const isStretched = pathIndex !== -1
                      const isHead = pathIndex === path.length - 1 && path.length > 0
                      const isTail = pathIndex === 0 && path.length > 0

                      // Identify adjacent moves
                      const headSegment = path[path.length - 1]
                      const isAdjacent = headSegment ? (Math.abs(headSegment.x - c) + Math.abs(headSegment.y - r) === 1) : false
                      const isPrevSegment = path.length > 1 && path[path.length - 2].x === c && path[path.length - 2].y === r
                      const isValidMove = isAdjacent && !isObstacle && !isStretched

                      return (
                        <motion.div
                          key={i}
                          whileHover={isValidMove || isPrevSegment ? { scale: 1.04 } : {}}
                          onClick={() => handleTileClick(r, c)}
                          className={`rounded-[22px] relative transition-all duration-300 flex items-center justify-center ${
                            isObstacle 
                              ? activeTheme.obstacleClass + ' cursor-not-allowed'
                              : isStretched
                                ? 'bg-white/90 shadow-md border border-[#EADFCF]/65'
                                : isValidMove
                                  ? 'bg-[#EADFCF]/20 border border-[#8B6239]/30 hover:border-[#8B6239]/80 hover:bg-[#8B6239]/5 cursor-pointer shadow-lg'
                                  : activeTheme.tileBg + ' opacity-75'
                          }`}
                        >
                          {/* Valid neighboring target indicator */}
                          {isValidMove && (
                            <div className="absolute inset-2 rounded-xl border border-dashed border-[#8B6239]/30 bg-amber-50/15 flex items-center justify-center pointer-events-none">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#8B6239]/80 animate-ping" />
                            </div>
                          )}

                          {/* Undo step target highlight */}
                          {isPrevSegment && (
                            <div className="absolute inset-1 rounded-xl border border-dashed border-red-300 bg-red-50/5 cursor-pointer flex items-center justify-center z-30">
                              <span className="text-[9px] font-black text-red-500/80 tracking-wider">UNDO</span>
                            </div>
                          )}

                          {/* Render stretched character components */}
                          {isStretched && (
                            <motion.div
                              layoutId={`body-${r}-${c}`}
                              initial={{ scale: 0.88, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className={`absolute inset-1.5 rounded-[18px] flex items-center justify-center transition-all duration-300 ${
                                isHead 
                                  ? 'bg-gradient-to-br from-[#8B6239] to-[#6F4D2E] shadow-xl z-20 border-2 border-white' 
                                  : isTail
                                    ? 'bg-[#EADFCF] border border-[#8B6239]/30 z-10 shadow-sm'
                                    : 'bg-[#8B6239]/20 border border-[#8B6239]/10 z-10'
                              }`}
                            >
                              {/* Lovable Blinking Hybrid Cat Head Segment */}
                              {isHead && (
                                <motion.div 
                                  animate={{ scale: [1, 1.05, 1] }}
                                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                                  className="text-[10px] font-black text-white select-none flex flex-col items-center"
                                >
                                  {/* Ears */}
                                  <div className="flex gap-2.5 -mt-2">
                                    <span className="w-1.5 h-1.5 bg-white rounded-t-sm rotate-12" />
                                    <span className="w-1.5 h-1.5 bg-white rounded-t-sm -rotate-12" />
                                  </div>
                                  <span className="text-[11px] font-mono leading-none -mt-0.5 tracking-wider">
                                    {getFaceChar()}
                                  </span>
                                </motion.div>
                              )}
                              
                              {/* Simple Gold Node center indicator */}
                              {!isHead && (
                                <span className="w-2.5 h-2.5 rounded-full bg-[#8B6239]" />
                              )}
                            </motion.div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>

                </motion.div>

                {/* Symmetrical Tip */}
                <div className="w-full flex items-center gap-2.5 bg-[#F5F1EB]/50 border border-[#EADFCF] rounded-2xl p-4 mt-6 text-xs text-[#6F4D2E] leading-relaxed">
                  <HelpCircle size={16} className="text-[#8B6239] flex-shrink-0" />
                  <span>
                    <strong>Tactile Hint:</strong> Tap adjacent empty highlighted cells to stretch. Tap your previous tail block at any time to instantly <strong>undo / retract</strong> steps.
                  </span>
                </div>

              </div>

              {/* RIGHT COLUMN: HIGH-END GAME HUD & PROGRESS Nodes */}
              <div className="lg:col-span-5 flex flex-col justify-between lg:border-l border-[#EADFCF]/60 lg:pl-10">
                
                <div>
                  
                  {/* Mode switcher HUD bar */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black tracking-widest text-[#8B6239] uppercase">
                      TACTILE ZEN ENGINE
                    </span>
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="text-[#8B6239] hover:opacity-75 cursor-pointer bg-white border border-[#EADFCF] p-2.5 rounded-full shadow-sm"
                    >
                      {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </button>
                  </div>

                  {/* Redesigned Level Map Progression System */}
                  <div className="bg-[#FFFDF9] border border-[#EADFCF] rounded-[32px] p-6 mb-6 shadow-sm relative overflow-hidden">
                    <span className="text-[10px] font-black text-[#8B6239] tracking-wider block mb-6 uppercase text-center">
                      Journey Roadmap
                    </span>

                    {/* Connected Nodes Map */}
                    <div className="flex justify-between items-center relative px-2 mb-6">
                      
                      {/* Dashboard Connection Line */}
                      <div className="absolute top-6 left-8 right-8 h-1 bg-[#EADFCF] z-0">
                        <motion.div 
                          className="h-full bg-[#8B6239]" 
                          style={{ width: `${(currentLevelIdx / (LEVELS.length - 1)) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>

                      {LEVELS.map((level, idx) => {
                        const isCurrent = idx === currentLevelIdx
                        const isCompleted = idx < currentLevelIdx
                        const isUnlocked = idx <= currentLevelIdx

                        return (
                          <div 
                            key={level.id} 
                            onClick={() => isUnlocked && setCurrentLevelIdx(idx)}
                            className="flex flex-col items-center z-10 cursor-pointer relative"
                          >
                            <motion.div
                              whileHover={isUnlocked ? { scale: 1.08 } : {}}
                              className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xs border-2 transition-all duration-300 ${
                                isCurrent
                                  ? 'bg-[#8B6239] text-white border-[#8B6239] ring-4 ring-[#8B6239]/20 shadow-md'
                                  : isCompleted
                                    ? 'bg-[#EADFCF]/50 text-[#8B6239] border-[#8B6239]'
                                    : 'bg-white text-slate-300 border-[#EADFCF] cursor-not-allowed'
                              }`}
                            >
                              {isCompleted ? <CheckCircle2 size={16} /> : `L${level.id}`}
                            </motion.div>
                            
                            <span className="text-[8px] font-black text-[#8B6239] uppercase tracking-wider mt-2.5">
                              {level.name.split(' ')[0]}
                            </span>
                          </div>
                        )
                      })}

                    </div>

                    <button
                      onClick={handleRestart}
                      className="w-full py-3.5 rounded-2xl border border-[#EADFCF] bg-white text-xs font-black text-[#8B6239] cursor-pointer hover:bg-[#F5F1EB] transition-all"
                    >
                      Restart Maze Layout
                    </button>
                  </div>

                  {/* HUD STATS */}
                  <div className="mb-6">
                    <h4 className="text-[10px] font-black tracking-wider text-[#8B6239] uppercase mb-3 flex items-center gap-1.5">
                      <Trophy size={13} /> PERFORMANCE METRICS
                    </h4>

                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center bg-white border border-[#EADFCF]/70 rounded-2xl p-3.5 shadow-sm">
                        <span className="text-xs font-bold text-[#3A281A]">Current Stretched Size</span>
                        <span className="text-xs font-black text-[#8B6239]">{path.length} Segments</span>
                      </div>
                      
                      <div className="flex justify-between items-center bg-white border border-[#EADFCF]/70 rounded-2xl p-3.5 shadow-sm">
                        <span className="text-xs font-bold text-[#3A281A]">Active Theme</span>
                        <span className="text-[9px] font-black text-[#8B6239] bg-[#EADFCF]/25 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {activeLevel.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RUNNING CHRONOLOGY */}
                  <div>
                    <h4 className="text-[10px] font-black tracking-wider text-[#8B6239] uppercase mb-3 flex items-center gap-1.5">
                      <ListTodo size={13} /> RUNNING CHRONOLOGY
                    </h4>
                    <div className="bg-[#F5F1EB]/40 border border-[#EADFCF]/50 rounded-2xl p-4 h-28 overflow-y-auto text-xs text-[#6F4D2E] leading-relaxed">
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

        {/* ────────────────── GAME PLAY STATE OVERLAYS ────────────────── */}
        <AnimatePresence>
          {/* TRAPPED / FAILURE STATE OVERLAY */}
          {gameState === 'failed' && (
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
                className="bg-white rounded-[36px] border border-[#EADFCF] p-8 max-w-sm w-full text-center relative shadow-2xl overflow-hidden animate-wiggle"
              >
                <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <AlertCircle size={30} className="text-red-600 animate-pulse" />
                </div>

                <span className="text-[10px] font-black tracking-widest text-[#8B6239] uppercase">
                  NO MOVES DETECTED ⚠️
                </span>

                <h2 className="text-2xl font-black text-[#3A281A] my-3">
                  Zen Cat Trapped!
                </h2>

                <p className="text-xs text-[#6F4D2E] leading-relaxed mb-6">
                  You ran out of vacant adjacent tiles. You can either retract your trail using the undo highlights or quick-restart.
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      if (path.length > 1) {
                        setPath(prev => prev.slice(0, -1))
                        setGameState('playing')
                        setFaceState('idle')
                        setLogs(prev => ['Retracted one step to rescue.', ...prev])
                      }
                    }}
                    disabled={path.length <= 1}
                    className="w-full py-4 rounded-2xl bg-[#8B6239] text-white font-extrabold text-xs tracking-wide shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    UNDO LAST STEP
                  </button>

                  <button
                    onClick={handleRestart}
                    className="w-full py-3.5 rounded-2xl border border-[#EADFCF] bg-white text-xs font-black text-[#8B6239] cursor-pointer hover:bg-[#F5F1EB] transition-all"
                  >
                    QUICK RESTART LEVEL
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* LEVEL COMPLETE OVERLAY */}
          {gameState === 'level-complete' && (
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
                <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Star size={30} className="text-[#8B6239] animate-bounce" />
                </div>

                <span className="text-[10px] font-black tracking-widest text-[#8B6239] uppercase">
                  LEVEL COMPLETED 💫
                </span>

                <h2 className="text-2xl font-black text-[#3A281A] my-3">
                  Symmetrical Harmony!
                </h2>

                <p className="text-xs text-[#6F4D2E] leading-relaxed mb-6">
                  You successfully cleared all coordinates of Level {activeLevel.id}: {activeLevel.name}. Ready to advance your trajectory?
                </p>

                <button
                  onClick={handleNextLevel}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#8B6239] to-[#6F4D2E] text-white font-extrabold text-xs tracking-wide shadow-md hover:shadow-lg cursor-pointer"
                >
                  LOAD NEXT LEVEL
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* QUEST COMPLETE SUCCESS OVERLAY */}
          {gameState === 'all-complete' && (
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
                className="bg-white rounded-[36px] border border-[#EADFCF] p-8 max-w-lg w-full text-center relative shadow-2xl overflow-hidden"
              >
                <div className="absolute -top-20 -right-20 w-52 h-52 rounded-full bg-radial-gradient from-amber-100/50 to-transparent pointer-events-none" />

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-5 shadow-inner">
                    <Award size={32} className="text-[#8B6239]" />
                  </div>

                  <span className="text-[10px] font-black tracking-widest text-[#8B6239] uppercase">
                    QUEST COMPLETED ✨
                  </span>

                  <h2 className="text-3xl font-black text-[#3A281A] my-3">
                    FlexPath Champion!
                  </h2>

                  <p className="text-sm text-[#6F4D2E] leading-relaxed max-w-sm mx-auto mb-6">
                    You successfully cleared every intricate level in FlexPath Journey. Corporate sponsors matched a transaction of <strong>₹10</strong> directly to Aarav's clinical care fund balance.
                  </p>

                  <div className="bg-[#FFFDF9] border border-[#EADFCF] rounded-2xl p-5 text-left mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <span className="text-[9px] font-black text-[#8B6239] tracking-wider uppercase">Holder Name</span>
                        <input
                          type="text"
                          value={helperName}
                          onChange={(e) => {
                            setHelperName(e.target.value)
                            localStorage.setItem('hp_user_name', e.target.value)
                          }}
                          className="w-full bg-transparent border-b border-dashed border-[#8B6239]/30 text-sm font-extrabold text-[#3A281A] outline-none py-1"
                        />
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-black text-[#8B6239] tracking-wider uppercase">Match Yield</span>
                        <div className="text-lg font-black text-[#8B6239]">₹10.00</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-[#A09080] font-black border-t border-[#EADFCF]/50 pt-2.5">
                      <span>VERIFIED HELD</span>
                      <span className="text-[#47682C]">✓ MATCH CODE REGISTERED</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => navigate('/main')}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#8B6239] to-[#6F4D2E] text-white font-extrabold text-sm tracking-wide shadow-md hover:shadow-lg cursor-pointer"
                    >
                      Return to Dashboard
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleCopyLink}
                        className="py-3 rounded-2xl border border-[#EADFCF] bg-white text-xs font-black text-[#8B6239] cursor-pointer hover:bg-[#F5F1EB]"
                      >
                        {isCopied ? 'Link Copied!' : 'Share Quest'}
                      </button>

                      <button
                        onClick={() => {
                          setCurrentLevelIdx(0)
                          initializeLevel()
                        }}
                        className="py-3 rounded-2xl border border-[#EADFCF] bg-white text-xs font-black text-[#8B6239] cursor-pointer hover:bg-[#F5F1EB]"
                      >
                        Play Again
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
