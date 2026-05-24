import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, RotateCcw, Volume2, VolumeX, ShieldCheck, 
  ChevronRight, Award, Share2, Bot, User, Trophy, ListTodo, 
  Sparkles, Star, Target, Loader2
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { GlobalBackground } from '../components/PremiumBackground'
import { addContribution } from '../services/contributionService'

// Custom Solfeggio / Pentatonic chimes for high-end feel
const CHIME_FREQS = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]

// Balanced, High-End Snakes and Ladders Mapping
const LADDERS = {
  3: 21,
  8: 30,
  28: 84,
  58: 77,
  75: 96
}

const SNAKES = {
  17: 4,
  52: 29,
  62: 19,
  88: 57,
  97: 79
}

// Total board cell settings
const TOTAL_CELLS = 100

// Helper: Get cell center coordinates as % (0 to 100) from bottom-left
function getCellCenter(num) {
  const zeroIndexed = num - 1
  const r = Math.floor(zeroIndexed / 10)
  const isRowOddFromBottom = r % 2 !== 0
  const c = zeroIndexed % 10
  const colIdx = isRowOddFromBottom ? (9 - c) : c
  
  return {
    x: colIdx * 10 + 5,
    y: r * 10 + 5
  }
}

// Convert coordinates to top-left SVG coordinate space
function getSVGBoardCoords(num) {
  const coords = getCellCenter(num)
  return {
    x: coords.x,
    y: 100 - coords.y
  }
}

export default function TherapeuticPathMatrixPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Game Settings
  const [gameMode, setGameMode] = useState('AI') // 'PvP' or 'AI'
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Gameplay positions
  const [player1Pos, setPlayer1Pos] = useState(1)
  const [player2Pos, setPlayer2Pos] = useState(1)
  const [currentPlayer, setCurrentPlayer] = useState(1) // 1 or 2
  const [isRolling, setIsRolling] = useState(false)
  const [diceValue, setDiceValue] = useState(1)
  const [isMoving, setIsMoving] = useState(false)
  const [movementPhase, setMovementPhase] = useState('idle') // 'idle', 'stepping', 'climbing', 'sliding'

  // Logs & victory
  const [gameLogs, setGameLogs] = useState(['Accelerator board initialized. Ready for play.'])
  const [winner, setWinner] = useState(null)
  const [savingReward, setSavingReward] = useState(false)

  // Custom name
  const [helperName, setHelperName] = useState(localStorage.getItem('hp_user_name') || 'Generous Supporter')
  const [isCopied, setIsCopied] = useState(false)

  // Audio Context Ref & Lock references
  const audioContextRef = useRef(null)
  const aiRollPending = useRef(false)

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  // AI auto roll logic protected by ref locks
  useEffect(() => {
    if (gameMode === 'AI' && currentPlayer === 2 && !winner && !isMoving && !isRolling && !aiRollPending.current) {
      aiRollPending.current = true
      const timer = setTimeout(() => {
        aiRollPending.current = false
        handleTriggerRoll()
      }, 1500)
      return () => {
        clearTimeout(timer)
        aiRollPending.current = false
      }
    }
  }, [currentPlayer, gameMode, winner, isMoving, isRolling])

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
  }

  // Soft marimba synth chime sound
  const playSoundChime = (freqIdx = 0, isHigh = false, isLowGlide = false) => {
    if (!soundEnabled) return
    initAudio()
    try {
      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()
      const baseFreq = CHIME_FREQS[freqIdx % CHIME_FREQS.length] || 329.63
      
      if (isLowGlide) {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(260, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.6)
        gainNode.gain.setValueAtTime(0, ctx.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05)
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6)
      } else {
        const freq = isHigh ? baseFreq * 1.6 : baseFreq
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, ctx.currentTime)
        gainNode.gain.setValueAtTime(0, ctx.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8)
      }

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.9)
    } catch (e) {
      console.warn('Audio synthesis block:', e)
    }
  }

  // Smooth step-by-step token progression with safety finally locks
  const movePlayerStepByStep = async (playerNum, startPos, steps) => {
    setIsMoving(true)
    setMovementPhase('stepping')
    try {
      let currentPos = startPos
      
      for (let i = 1; i <= steps; i++) {
        if (currentPos >= TOTAL_CELLS) break
        currentPos += 1
        
        if (playerNum === 1) {
          setPlayer1Pos(currentPos)
        } else {
          setPlayer2Pos(currentPos)
        }
        
        playSoundChime(currentPos, false)
        await new Promise(resolve => setTimeout(resolve, 250))
      }

      // Check final target cell for Ladder or Snake
      let finalPos = currentPos
      if (LADDERS[finalPos]) {
        setMovementPhase('climbing')
        const topPos = LADDERS[finalPos]
        setGameLogs(prev => [`🧬 Ladder Ascension: Player ${playerNum} climbed from ${finalPos} to ${topPos}!`, ...prev])
        await new Promise(resolve => setTimeout(resolve, 600))
        
        if (playerNum === 1) {
          setPlayer1Pos(topPos)
        } else {
          setPlayer2Pos(topPos)
        }
        playSoundChime(topPos % 8, true)
        finalPos = topPos
        await new Promise(resolve => setTimeout(resolve, 500))
      } else if (SNAKES[finalPos]) {
        setMovementPhase('sliding')
        const bottomPos = SNAKES[finalPos]
        setGameLogs(prev => [`⚠️ Neural Inhibitor: Player ${playerNum} drifted down from ${finalPos} to ${bottomPos}.`, ...prev])
        await new Promise(resolve => setTimeout(resolve, 600))
        
        if (playerNum === 1) {
          setPlayer1Pos(bottomPos)
        } else {
          setPlayer2Pos(bottomPos)
        }
        playSoundChime(bottomPos % 8, false, true)
        finalPos = bottomPos
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      // Win check
      if (finalPos >= TOTAL_CELLS) {
        setWinner(playerNum)
        setGameLogs(prev => [`🏆 Player ${playerNum} successfully scaled cell 100! Quest Completed!`, ...prev])
        playSoundChime(4, true)
        handleClaimVictoryMatch()
      } else {
        // Toggle turns cleanly
        setCurrentPlayer(playerNum === 1 ? 2 : 1)
      }
    } catch (err) {
      console.error('Animation stepping loop failed:', err)
    } finally {
      setIsMoving(false)
      setMovementPhase('idle')
    }
  }

  const handleTriggerRoll = () => {
    if (isRolling || isMoving || winner) return
    setIsRolling(true)
    initAudio()

    let tempVal = 1
    const rollInterval = setInterval(() => {
      tempVal = Math.floor(Math.random() * 6) + 1
      setDiceValue(tempVal)
      playSoundChime(tempVal, false)
    }, 70)

    setTimeout(() => {
      clearInterval(rollInterval)
      const finalRoll = Math.floor(Math.random() * 6) + 1
      setDiceValue(finalRoll)
      setIsRolling(false)

      const activePos = currentPlayer === 1 ? player1Pos : player2Pos
      setGameLogs(prev => [`Player ${currentPlayer} rolled a ${finalRoll}.`, ...prev])
      
      movePlayerStepByStep(currentPlayer, activePos, finalRoll)
    }, 750)
  }

  const handleClaimVictoryMatch = async () => {
    if (!user?.uid || savingReward) return
    setSavingReward(true)
    try {
      await addContribution(user.uid, 10, 'Baby Aarav', 'Sponsor Matched Quest Complete')
    } catch (err) {
      console.error('Failed writing contribution:', err)
    } finally {
      setSavingReward(false)
    }
  }

  const handleRestart = () => {
    setPlayer1Pos(1)
    setPlayer2Pos(1)
    setCurrentPlayer(1)
    setWinner(null)
    setDiceValue(1)
    setIsRolling(false)
    setIsMoving(false)
    setMovementPhase('idle')
    setGameLogs(['Board reset. Ready to roll.'])
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  // Dynamic Premium Status Text
  const getButtonText = () => {
    if (winner) return 'Victory Achieved! ✨'
    if (isRolling) return 'Rolling trajectory... 🎲'
    if (isMoving) {
      if (movementPhase === 'climbing') return 'Climbing helix ladder... 🧬'
      if (movementPhase === 'sliding') return 'Snake encounter detected... ⚠️'
      return 'Advancing token... 🏃‍♂️'
    }
    if (gameMode === 'AI' && currentPlayer === 2) return 'AI Bot is planning... 🤖'
    return 'ROLL THE ACCELERATOR'
  }

  // Symmetrical calculation to render perpendicular rungs mathematically
  const renderSVGLadder = (start, end) => {
    const p1 = getSVGBoardCoords(start)
    const p2 = getSVGBoardCoords(end)
    
    // Perpendicular vectors for rails offset
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    const len = Math.sqrt(dx * dx + dy * dy)
    const nx = -dy / len
    const ny = dx / len
    const railOffset = 1.8 // width spacing
    
    // Offset rail coordinates
    const r1x1 = p1.x - nx * railOffset
    const r1y1 = p1.y - ny * railOffset
    const r1x2 = p2.x - nx * railOffset
    const r1y2 = p2.y - ny * railOffset

    const r2x1 = p1.x + nx * railOffset
    const r2y1 = p1.y + ny * railOffset
    const r2x2 = p2.x + nx * railOffset
    const r2y2 = p2.y + ny * railOffset

    // Generate perpendicular rungs mathematically
    const rungs = []
    const rungCount = Math.max(3, Math.floor(len / 6))
    for (let j = 1; j < rungCount; j++) {
      const t = j / rungCount
      const cx = p1.x + dx * t
      const cy = p1.y + dy * t
      rungs.push({
        x1: cx - nx * railOffset,
        y1: cy - ny * railOffset,
        x2: cx + nx * railOffset,
        y2: cy + ny * railOffset
      })
    }

    return (
      <g key={`ladder-geom-${start}`}>
        {/* Shadow layer for 3D depth */}
        <line x1={r1x1 + 0.6} y1={r1y1 + 0.6} x2={r1x2 + 0.6} y2={r1y2 + 0.6} stroke="rgba(58, 40, 26, 0.15)" strokeWidth="1.6" strokeLinecap="round" />
        <line x1={r2x1 + 0.6} y1={r2y1 + 0.6} x2={r2x2 + 0.6} y2={r2y2 + 0.6} stroke="rgba(58, 40, 26, 0.15)" strokeWidth="1.6" strokeLinecap="round" />
        
        {/* Solid wooden golden rails */}
        <line x1={r1x1} y1={r1y1} x2={r1x2} y2={r1y2} stroke="url(#goldGrad)" strokeWidth="1.3" strokeLinecap="round" />
        <line x1={r2x1} y1={r2y1} x2={r2x2} y2={r2y2} stroke="url(#goldGrad)" strokeWidth="1.3" strokeLinecap="round" />

        {/* Perpendicular rungs */}
        {rungs.map((rung, idx) => (
          <line
            key={idx}
            x1={rung.x1}
            y1={rung.y1}
            x2={rung.x2}
            y2={rung.y2}
            stroke="#EADFCF"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        ))}
      </g>
    )
  }

  // Draw organic curvy slithering snakes
  const renderSVGSnake = (start, end) => {
    const p1 = getSVGBoardCoords(start)
    const p2 = getSVGBoardCoords(end)
    
    // Slithering bezier wave calculations
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    const len = Math.sqrt(dx * dx + dy * dy)
    
    // Smooth S-curve control points
    const mx1 = p1.x + dx * 0.33 + dy * 0.14
    const my1 = p1.y + dy * 0.33 - dx * 0.14
    const mx2 = p1.x + dx * 0.66 - dy * 0.14
    const my2 = p1.y + dy * 0.66 + dx * 0.14

    const pathD = `M ${p1.x} ${p1.y} C ${mx1} ${my1}, ${mx2} ${my2}, ${p2.x} ${p2.y}`

    return (
      <g key={`snake-geom-${start}`}>
        {/* Soft elegant shadow trail */}
        <path d={pathD} fill="none" stroke="rgba(58, 40, 26, 0.12)" strokeWidth="3.2" strokeLinecap="round" />
        
        {/* Smooth slithering snake body */}
        <path d={pathD} fill="none" stroke="url(#snakeGrad)" strokeWidth="2.0" strokeLinecap="round" />
        
        {/* Textured pattern overlay simulating micro scales */}
        <path d={pathD} fill="none" stroke="#FFF" strokeWidth="0.6" strokeDasharray="1.5, 3.5" opacity="0.6" />
        
        {/* Highly visible glowing head */}
        <circle cx={p1.x} cy={p1.y} r="1.8" fill="#3A281A" stroke="#EADFCF" strokeWidth="0.5" />
        <circle cx={p1.x - 0.4} cy={p1.y - 0.4} r="0.4" fill="#D4AF37" />
        <circle cx={p1.x + 0.4} cy={p1.y - 0.4} r="0.4" fill="#D4AF37" />
      </g>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#3A281A] relative font-sans animate-fade-in">
      <GlobalBackground />
      <Navbar />

      <main className="flex-1 relative z-10 w-full pb-20">
        
        {/* Elegant top back link */}
        <div className="max-w-[1200px] mx-auto mt-10 px-6 box-border">
          <button 
            onClick={() => navigate('/main')}
            className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md border border-[#EADFCF] px-6 py-3 rounded-full text-xs font-bold text-[#8B6239] cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
        </div>

        {/* Premium Redesigned Playground Container */}
        <div className="max-w-[1100px] mx-auto mt-8 px-6 box-border">
          
          <div className="bg-[#FFFDFB]/98 backdrop-blur-2xl border border-[#EADFCF] rounded-[44px] shadow-xl p-8 lg:p-12 overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* LEFT SIDE: REDESIGNED PREMIUM GRID BOARD */}
              <div className="lg:col-span-7 flex flex-col items-center">
                
                <div className="w-full flex justify-between items-center mb-6">
                  <span className="text-[10px] font-black tracking-widest text-[#8B6239] uppercase">
                    ⭐️ Elite Snakes & Ladders Board
                  </span>
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-[#8B6239] bg-[#EADFCF]/20 px-3.5 py-1.5 rounded-full border border-[#EADFCF]/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B6239] animate-ping" /> MULTIPLAYER ACTIVE
                  </div>
                </div>

                {/* Symmetrical High-End 10x10 Grid container */}
                <div className="w-full aspect-square bg-[#F5F1EB]/50 border-4 border-[#EADFCF] rounded-[32px] p-5 shadow-2xl relative box-border">
                  
                  {/* Clean rounded grid cells */}
                  <div className="grid grid-cols-10 grid-rows-10 gap-1.5 w-full h-full">
                    {Array.from({ length: 100 }, (_, i) => {
                      const cellNum = 100 - i
                      const rowNum = Math.floor((cellNum - 1) / 10)
                      const isAlternatingRow = rowNum % 2 !== 0
                      const colNum = (cellNum - 1) % 10
                      const actualNum = rowNum * 10 + (isAlternatingRow ? (9 - colNum) : colNum) + 1
                      
                      const isBeige = (Math.floor((actualNum - 1) / 10) + (actualNum - 1) % 10) % 2 === 0
                      const isP1Here = player1Pos === actualNum
                      const isP2Here = player2Pos === actualNum
                      const isCellActive = (currentPlayer === 1 && isP1Here) || (currentPlayer === 2 && isP2Here)

                      return (
                        <motion.div
                          key={actualNum}
                          whileHover={{ scale: 1.04 }}
                          className={`rounded-xl flex flex-col justify-between p-2 relative transition-all duration-300 ${
                            isBeige ? 'bg-[#EADFCF]/35' : 'bg-white'
                          } ${
                            isCellActive 
                              ? 'shadow-md border border-[#8B6239] ring-1 ring-[#8B6239]/20' 
                              : 'border border-[#EADFCF]/15 shadow-sm'
                          }`}
                        >
                          {/* Elegant, high-contrast, bold vector number */}
                          <span className={`text-[11px] font-black text-[#8B6239]/40`}>
                            {actualNum}
                          </span>

                          {/* Symmetrical player piece wrapper */}
                          <div className="flex gap-1 justify-center items-center mt-auto">
                            {isP1Here && (
                              <motion.div
                                layoutId="tokenP1"
                                transition={{ type: 'spring', stiffness: 130, damping: 15 }}
                                className="w-4.5 h-4.5 rounded-full bg-[#8B6239] border-2 border-white shadow-md flex items-center justify-center text-[7px] text-white font-black"
                              >
                                P1
                              </motion.div>
                            )}
                            {isP2Here && (
                              <motion.div
                                layoutId="tokenP2"
                                transition={{ type: 'spring', stiffness: 130, damping: 15 }}
                                className="w-4.5 h-4.5 rounded-full bg-[#3A281A] border-2 border-white shadow-md flex items-center justify-center text-[7px] text-white font-black"
                              >
                                P2
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Redesigned Mathematical Vector overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#D4AF37" />
                        <stop offset="50%" stopColor="#8B6239" />
                        <stop offset="100%" stopColor="#6F4D2E" />
                      </linearGradient>
                      <linearGradient id="snakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#A05A3F" />
                        <stop offset="50%" stopColor="#6F4D2E" />
                        <stop offset="100%" stopColor="#3A281A" />
                      </linearGradient>
                    </defs>

                    {/* Mathematically perfectly perpendicular ladders */}
                    {Object.entries(LADDERS).map(([start, end]) => 
                      renderSVGLadder(parseInt(start), end)
                    )}

                    {/* Curved organic slithering vector snakes */}
                    {Object.entries(SNAKES).map(([start, end]) => 
                      renderSVGSnake(parseInt(start), end)
                    )}
                  </svg>

                </div>

                {/* Symmetrical legend badges */}
                <div className="flex flex-wrap gap-4 mt-6 text-[11px] font-black text-[#8B6239] tracking-wide">
                  <div className="flex items-center gap-1.5 bg-white border border-[#EADFCF]/70 px-3 py-1.5 rounded-full shadow-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8B6239]" /> Player 1 (You)
                  </div>
                  <div className="flex items-center gap-1.5 bg-white border border-[#EADFCF]/70 px-3 py-1.5 rounded-full shadow-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3A281A]" /> Player 2 ({gameMode === 'AI' ? 'AI Bot' : 'Human'})
                  </div>
                  <div className="flex items-center gap-1.5 bg-white border border-[#EADFCF]/70 px-3 py-1.5 rounded-full shadow-sm">
                    <span className="w-3.5 h-0.5 bg-amber-500" /> Vector Helix Ladder
                  </div>
                  <div className="flex items-center gap-1.5 bg-white border border-[#EADFCF]/70 px-3 py-1.5 rounded-full shadow-sm">
                    <span className="w-3.5 h-0.5 bg-orange-400" /> Slithering Inhibitor Snake
                  </div>
                </div>

              </div>

              {/* RIGHT SIDE: LUXURY GLASSMORPHISM CONTROLS */}
              <div className="lg:col-span-5 flex flex-col justify-between lg:border-l border-[#EADFCF]/60 lg:pl-10">
                
                <div>
                  
                  {/* Title & Mode Switcher */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-extrabold tracking-widest text-[#8B6239] uppercase">
                      PREMIUM PLAYGROUND INTERFACE
                    </span>
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="text-[#8B6239] hover:opacity-75 cursor-pointer"
                    >
                      {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                    </button>
                  </div>

                  {/* Mode select tags */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                      disabled={isRolling || isMoving}
                      onClick={() => {
                        setGameMode('AI')
                        handleRestart()
                      }}
                      className={`py-3.5 px-4 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 disabled:opacity-50 ${
                        gameMode === 'AI'
                          ? 'bg-[#8B6239] border-[#8B6239] text-[#FFFDFB] shadow-md'
                          : 'bg-[#FFFDFB] border-[#EADFCF] text-[#8B6239] hover:bg-[#F5F1EB]'
                      }`}
                    >
                      <Bot size={14} /> PLAY VS AI BOT
                    </button>
                    
                    <button
                      disabled={isRolling || isMoving}
                      onClick={() => {
                        setGameMode('PvP')
                        handleRestart()
                      }}
                      className={`py-3.5 px-4 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 disabled:opacity-50 ${
                        gameMode === 'PvP'
                          ? 'bg-[#8B6239] border-[#8B6239] text-[#FFFDFB] shadow-md'
                          : 'bg-[#FFFDFB] border-[#EADFCF] text-[#8B6239] hover:bg-[#F5F1EB]'
                      }`}
                    >
                      <User size={14} /> PLAY 2 PLAYERS
                    </button>
                  </div>

                  {/* NEUMORPHIC ROLLING DICE PANEL */}
                  <div className="bg-gradient-to-br from-[#FFFDF9] to-[#F5F1EB] border border-[#EADFCF] rounded-[28px] p-6 mb-6 shadow-sm">
                    <span className="text-[10px] font-black text-[#8B6239] tracking-wider block mb-4 uppercase text-center">
                      NEUMORPHIC ACCELERATOR CORE
                    </span>
                    
                    <div className="flex justify-center items-center gap-8 mb-6">
                      
                      {/* Animated Dice */}
                      <motion.div
                        animate={isRolling ? {
                          rotate: [0, 90, 180, 270, 360],
                          scale: [1, 1.25, 0.9, 1.15, 1],
                          y: [0, -25, 5, -5, 0]
                        } : {}}
                        transition={{ duration: 0.75, ease: 'easeInOut' }}
                        className="w-16 h-16 bg-white border border-[#EADFCF] rounded-2xl shadow-md flex items-center justify-center text-3xl font-black text-[#3A281A] cursor-pointer select-none"
                        onClick={handleTriggerRoll}
                        style={{ boxShadow: 'inset 0 2px 4px rgba(234, 223, 207, 0.5), 0 8px 16px rgba(139, 98, 57, 0.08)' }}
                      >
                        {diceValue}
                      </motion.div>

                      <div className="text-left">
                        <span className="text-[9px] font-black text-[#8B6239]/80 block uppercase">Current turn</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`w-3 h-3 rounded-full ${currentPlayer === 1 ? 'bg-[#8B6239]' : 'bg-[#3A281A]'}`} />
                          <span className="text-xs font-black text-[#3A281A]">
                            {currentPlayer === 1 ? 'Player 1 (You)' : gameMode === 'AI' ? 'AI Bot' : 'Player 2'}
                          </span>
                        </div>
                      </div>

                    </div>

                    <button
                      onClick={handleTriggerRoll}
                      disabled={isRolling || isMoving || !!winner || (gameMode === 'AI' && currentPlayer === 2)}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#8B6239] to-[#6F4D2E] text-white font-extrabold text-sm tracking-wide shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {(isRolling || isMoving) && <Loader2 size={16} className="animate-spin" />}
                      {getButtonText()}
                    </button>
                  </div>

                  {/* DYNAMIC LEADERBOARD */}
                  <div className="mb-6">
                    <h4 className="text-[10px] font-black tracking-wider text-[#8B6239] uppercase mb-3 flex items-center gap-1.5">
                      <Trophy size={13} /> DYNAMIC LEADERBOARD
                    </h4>

                    <div className="flex flex-col gap-3">
                      {/* Player 1 rank */}
                      <div className="flex justify-between items-center bg-white border border-[#EADFCF]/70 rounded-2xl p-3.5 shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-[#8B6239]">#1</span>
                          <span className="w-2.5 h-2.5 rounded-full bg-[#8B6239]" />
                          <span className="text-xs font-extrabold text-[#3A281A]">Player 1 (You)</span>
                        </div>
                        <span className="text-xs font-black text-[#8B6239]">Cell {player1Pos} / 100</span>
                      </div>

                      {/* Player 2 rank */}
                      <div className="flex justify-between items-center bg-white border border-[#EADFCF]/70 rounded-2xl p-3.5 shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-[#8B6239]">#2</span>
                          <span className="w-2.5 h-2.5 rounded-full bg-[#3A281A]" />
                          <span className="text-xs font-extrabold text-[#3A281A]">
                            Player 2 ({gameMode === 'AI' ? 'AI Bot' : 'Human'})
                          </span>
                        </div>
                        <span className="text-xs font-black text-[#8B6239]">Cell {player2Pos} / 100</span>
                      </div>
                    </div>
                  </div>

                  {/* TRANSACTION LOGS */}
                  <div>
                    <h4 className="text-[10px] font-black tracking-wider text-[#8B6239] uppercase mb-3 flex items-center gap-1.5">
                      <ListTodo size={13} /> TRANSACTION LOGS
                    </h4>
                    <div className="bg-[#F5F1EB]/40 border border-[#EADFCF]/50 rounded-2xl p-4 h-28 overflow-y-auto text-xs text-[#6F4D2E] leading-relaxed">
                      {gameLogs.map((log, idx) => (
                        <div key={idx} className="mb-2 border-b border-[#EADFCF]/20 pb-1.5 text-slate-700">
                          • {log}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Reset button */}
                <div className="mt-8">
                  <button
                    disabled={isRolling || isMoving}
                    onClick={handleRestart}
                    className="w-full py-3.5 rounded-2xl border border-[#EADFCF] bg-white text-xs font-extrabold text-[#8B6239] cursor-pointer hover:bg-[#F5F1EB] transition-all duration-300 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <RotateCcw size={13} /> Reset Standings & Grid
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ────────────────── SUCCESS MODAL ────────────────── */}
        <AnimatePresence>
          {winner && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#3A281A]/70 backdrop-blur-md flex items-center justify-center p-6 z-[999]"
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
                    CHAMPIONSHIP ASCENSION ✨
                  </span>

                  <h2 className="text-3xl font-black text-[#3A281A] my-3">
                    Victory Achieved!
                  </h2>

                  <p className="text-sm text-[#6F4D2E] leading-relaxed max-w-sm mx-auto mb-6">
                    Player {winner} reached the final cell 100 successfully! As an audited milestone, sponsors matched a transaction of <strong>₹10</strong> directly to Aarav's real-time care fund balance.
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
                        onClick={handleRestart}
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
