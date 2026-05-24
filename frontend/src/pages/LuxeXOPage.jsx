import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Volume2, VolumeX, Award, Share2, Star, 
  RefreshCw, Trophy, ListTodo, HelpCircle, Sparkles, 
  CheckCircle2, AlertCircle, Play, Users, Cpu
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { GlobalBackground } from '../components/PremiumBackground'
import { addContribution } from '../services/contributionService'

// Solfeggio harmonic frequencies for high-end audio feedback
const LUXE_CHIMES = {
  click: 392.00, // G4 (soothing, clear chime)
  win: [261.63, 329.63, 392.00, 523.25], // C major arpeggio
  draw: [293.66, 349.23, 440.00] // Comforting neutral chord
}

export default function LuxeXOPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Game States
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [gameMode, setGameMode] = useState('AI') // 'Friend', 'AI'
  const [aiDifficulty, setAiDifficulty] = useState('Hard') // 'Easy', 'Medium', 'Hard'
  const [winnerInfo, setWinnerInfo] = useState(null) // { winner: 'X'/'O'/'Draw', line: [...] }
  const [soundEnabled, setSoundEnabled] = useState(true)
  
  // Scoreboard
  const [scores, setScores] = useState(() => {
    const saved = localStorage.getItem('xo_scores')
    return saved ? JSON.parse(saved) : { X: 0, O: 0, draws: 0 }
  })

  // Visual highlights
  const [logs, setLogs] = useState(['Initialize Luxe XO grid. X moves first.'])
  const [boardPulse, setBoardPulse] = useState({ scale: 1, rotate: 0 })
  const [savingReward, setSavingReward] = useState(false)
  const [helperName, setHelperName] = useState(localStorage.getItem('hp_user_name') || 'Generous Supporter')
  const [isCopied, setIsCopied] = useState(false)
  const [aiThinking, setAiThinking] = useState(false)

  const audioContextRef = useRef(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  // Save scores
  useEffect(() => {
    localStorage.setItem('xo_scores', JSON.stringify(scores))
  }, [scores])

  // Handle AI turn triggers
  useEffect(() => {
    if (gameMode === 'AI' && !isXNext && !winnerInfo && !aiThinking) {
      setAiThinking(true)
      const thinkTime = 600 + Math.random() * 500
      const timer = setTimeout(() => {
        makeAIMove()
      }, thinkTime)
      return () => clearTimeout(timer)
    }
  }, [isXNext, gameMode, winnerInfo])

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
  }

  // Pure Web Audio chime synthesis
  const playSoundChime = (type) => {
    if (!soundEnabled) return
    initAudio()
    try {
      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      if (type === 'click') {
        const osc = ctx.createOscillator()
        const gainNode = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(LUXE_CHIMES.click, ctx.currentTime)
        gainNode.gain.setValueAtTime(0, ctx.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3)
        osc.connect(gainNode)
        gainNode.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.3)
      } else if (type === 'win') {
        LUXE_CHIMES.win.forEach((freq, idx) => {
          const osc = ctx.createOscillator()
          const gainNode = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1)
          gainNode.gain.setValueAtTime(0, ctx.currentTime + idx * 0.1)
          gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + idx * 0.1 + 0.01)
          gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.1 + 0.6)
          osc.connect(gainNode)
          gainNode.connect(ctx.destination)
          osc.start(ctx.currentTime + idx * 0.1)
          osc.stop(ctx.currentTime + idx * 0.1 + 0.6)
        })
      } else if (type === 'draw') {
        LUXE_CHIMES.draw.forEach((freq) => {
          const osc = ctx.createOscillator()
          const gainNode = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, ctx.currentTime)
          gainNode.gain.setValueAtTime(0, ctx.currentTime)
          gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.01)
          gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5)
          osc.connect(gainNode)
          gainNode.connect(ctx.destination)
          osc.start()
          osc.stop(ctx.currentTime + 0.5)
        })
      }
    } catch (e) {
      console.warn('Audio synth blocked:', e)
    }
  }

  // Classic Win Patterns
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ]

  const checkWinner = (currentBoard) => {
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], line: pattern }
      }
    }
    if (currentBoard.every(cell => cell !== null)) {
      return { winner: 'Draw', line: [] }
    }
    return null
  }

  const handleCellClick = (idx) => {
    if (board[idx] || winnerInfo || aiThinking) return

    // If game mode is AI, only allow human to play when it's X's turn
    if (gameMode === 'AI' && !isXNext) return

    const newBoard = [...board]
    const activePlayer = isXNext ? 'X' : 'O'
    newBoard[idx] = activePlayer

    playSoundChime('click')
    setBoard(newBoard)
    setBoardPulse({ scale: [1, 0.98, 1.01, 1], rotate: [0, -0.2, 0.2, 0] })
    
    const coordName = getCellCoordinateName(idx)
    setLogs(prev => [`${activePlayer} placed mark at ${coordName}.`, ...prev])

    const status = checkWinner(newBoard)
    if (status) {
      handleMatchEnd(status)
    } else {
      setIsXNext(!isXNext)
    }
  }

  const getCellCoordinateName = (idx) => {
    const row = Math.floor(idx / 3) + 1
    const col = (idx % 3) + 1
    return `Row ${row}, Col ${col}`
  }

  const handleMatchEnd = (status) => {
    setWinnerInfo(status)
    if (status.winner === 'Draw') {
      playSoundChime('draw')
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }))
      setLogs(prev => ['Match finished in a balanced Draw.', ...prev])
    } else {
      playSoundChime('win')
      setScores(prev => ({ ...prev, [status.winner]: prev[status.winner] + 1 }))
      setLogs(prev => [`🎉 Player ${status.winner} achieved alignment victory!`, ...prev])
      
      // Matched sponsor rewards logged
      if (status.winner === 'X' || (gameMode === 'AI' && status.winner === 'O')) {
        handleClaimSponsorMatch()
      }
    }
  }

  const handleClaimSponsorMatch = async () => {
    if (!user?.uid || savingReward) return
    setSavingReward(true)
    try {
      await addContribution(user.uid, 20, 'Baby Aarav', 'Luxe XO Perfect Alignment Sponsor Reward')
      setLogs(prev => ['✓ Matched sponsor pool contribution ₹20 dispatched to Aarav\'s ledger!', ...prev])
    } catch (err) {
      console.error('Failed writing match contribution:', err)
    } finally {
      setSavingReward(false)
    }
  }

  // --- AI Bot Decision Brain ---
  const makeAIMove = () => {
    const availableIndices = board.map((cell, idx) => cell === null ? idx : null).filter(v => v !== null)
    if (availableIndices.length === 0) return

    let selectedIdx = null

    if (aiDifficulty === 'Easy') {
      // Pick entirely random available cell
      const randIdx = Math.floor(Math.random() * availableIndices.length)
      selectedIdx = availableIndices[randIdx]
    } else if (aiDifficulty === 'Medium') {
      // 50% chance of smart move, 50% random
      if (Math.random() < 0.5) {
        selectedIdx = getMinimaxMove([...board])
      } else {
        const randIdx = Math.floor(Math.random() * availableIndices.length)
        selectedIdx = availableIndices[randIdx]
      }
    } else {
      // Hard (100% intelligent MiniMax logic)
      selectedIdx = getMinimaxMove([...board])
    }

    if (selectedIdx !== null && selectedIdx !== -1) {
      const newBoard = [...board]
      newBoard[selectedIdx] = 'O'
      
      playSoundChime('click')
      setBoard(newBoard)
      setBoardPulse({ scale: [1, 0.98, 1.01, 1], rotate: [0, 0.2, -0.2, 0] })
      
      const coordName = getCellCoordinateName(selectedIdx)
      setLogs(prev => [`AI Bot (O) calculated move at ${coordName}.`, ...prev])

      const status = checkWinner(newBoard)
      if (status) {
        handleMatchEnd(status)
      } else {
        setIsXNext(true)
      }
    }
    setAiThinking(false)
  }

  // MiniMax implementation for Tic Tac Toe Optimal strategic gameplay
  const getMinimaxMove = (currentBoard) => {
    const evaluateBoard = (b) => {
      for (const pattern of winPatterns) {
        const [a, bIndex, c] = pattern
        if (b[a] && b[a] === b[bIndex] && b[a] === b[c]) {
          return b[a] === 'O' ? 10 : -10
        }
      }
      return 0
    }

    const isMovesLeft = (b) => b.some(cell => cell === null)

    const minimax = (b, depth, isMax) => {
      const score = evaluateBoard(b)
      if (score === 10) return score - depth
      if (score === -10) return score + depth
      if (!isMovesLeft(b)) return 0

      if (isMax) {
        let best = -1000
        for (let i = 0; i < 9; i++) {
          if (b[i] === null) {
            b[i] = 'O'
            best = Math.max(best, minimax(b, depth + 1, false))
            b[i] = null
          }
        }
        return best
      } else {
        let best = 1000
        for (let i = 0; i < 9; i++) {
          if (b[i] === null) {
            b[i] = 'X'
            best = Math.min(best, minimax(b, depth + 1, true))
            b[i] = null
          }
        }
        return best
      }
    }

    let bestVal = -1000
    let bestMove = -1
    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        currentBoard[i] = 'O'
        let moveVal = minimax(currentBoard, 0, false)
        currentBoard[i] = null
        if (moveVal > bestVal) {
          bestMove = i
          bestVal = moveVal
        }
      }
    }
    return bestMove
  }

  const handleRestart = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setWinnerInfo(null)
    setAiThinking(false)
    setBoardPulse({ scale: 1, rotate: 0 })
    setLogs(prev => ['Grid cleared. Standard X moves first.', ...prev])
  }

  const handleClearScoreboard = () => {
    const emptyScores = { X: 0, O: 0, draws: 0 }
    setScores(emptyScores)
    localStorage.setItem('xo_scores', JSON.stringify(emptyScores))
    setLogs(prev => ['Scoreboard stats reset.', ...prev])
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  // Dynamic SVG icons for X and O marks
  const renderMarkX = () => (
    <svg className="w-16 h-16" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="xGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B6239" />
          <stop offset="100%" stopColor="#3A281A" />
        </linearGradient>
      </defs>
      <motion.line
        x1="25" y1="25" x2="75" y2="75"
        stroke="url(#xGrad)"
        strokeWidth="10"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
      <motion.line
        x1="75" y1="25" x2="25" y2="75"
        stroke="url(#xGrad)"
        strokeWidth="10"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
      />
    </svg>
  )

  const renderMarkO = () => (
    <svg className="w-16 h-16" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="oGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#8B6239" />
          <stop offset="100%" stopColor="#3A281A" />
        </linearGradient>
      </defs>
      <motion.circle
        cx="50" cy="50" r="26"
        fill="none"
        stroke="url(#oGrad)"
        strokeWidth="10"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </svg>
  )

  // Absolute-layered winning stroke pipeline
  const renderWinningLine = () => {
    if (!winnerInfo || !winnerInfo.line || winnerInfo.line.length === 0) return null
    const [a, , c] = winnerInfo.line
    
    // Grid coordinate centers (viewBox 0 to 300)
    const centers = [
      { x: 50, y: 50 },   { x: 150, y: 50 },   { x: 250, y: 50 },
      { x: 50, y: 150 },  { x: 150, y: 150 },  { x: 250, y: 150 },
      { x: 50, y: 250 },  { x: 150, y: 250 },  { x: 250, y: 250 }
    ]

    const pStart = centers[a]
    const pEnd = centers[c]

    // Calculate line extending past boundaries slightly
    const dx = pEnd.x - pStart.x
    const dy = pEnd.y - pStart.y
    const len = Math.sqrt(dx*dx + dy*dy)
    const scale = 1.15
    const cx = pStart.x + dx/2
    const cy = pStart.y + dy/2
    
    const ex1 = cx - (dx/2) * scale
    const ey1 = cy - (dy/2) * scale
    const ex2 = cx + (dx/2) * scale
    const ey2 = cy + (dy/2) * scale

    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-30" viewBox="0 0 300 300">
        <defs>
          <linearGradient id="winLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#8B6239" />
            <stop offset="100%" stopColor="#3A281A" />
          </linearGradient>
        </defs>
        
        {/* Soft shadow underlying glow */}
        <motion.line
          x1={ex1} y1={ey1} x2={ex2} y2={ey2}
          stroke="#8B6239"
          strokeWidth="14"
          strokeLinecap="round"
          opacity="0.3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />

        {/* Shimmer gradient line */}
        <motion.line
          x1={ex1} y1={ey1} x2={ex2} y2={ey2}
          stroke="url(#winLineGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />

        {/* Shimmer dash overlay */}
        <motion.line
          x1={ex1} y1={ey1} x2={ex2} y2={ey2}
          stroke="#FFFDF9"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4, 12"
          animate={{ strokeDashoffset: [0, -20] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
      </svg>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFFDFB] to-[#F5F1EB] transition-all duration-700 relative font-sans animate-fade-in overflow-hidden pb-16">
      <GlobalBackground />
      <Navbar />

      {/* Ambient aesthetic floating stardust particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 5 + 3,
              height: Math.random() * 5 + 3,
              background: 'rgba(139, 98, 57, 0.25)',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.15, 0.6, 0.15],
              scale: [1, 1.25, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <main className="flex-1 relative z-10 w-full pb-20">
        
        {/* Back button link */}
        <div className="max-w-[1200px] mx-auto mt-8 px-6 box-border animate-fade-in">
          <button 
            onClick={() => navigate('/main')}
            className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md border border-[#EADFCF] px-6 py-3 rounded-full text-xs font-bold text-[#8B6239] cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
        </div>

        {/* Symmetrical Tactile Luxe Canvas Container */}
        <div className="max-w-[1100px] mx-auto mt-6 px-6 box-border">
          
          <div className="bg-[#FFFDFB]/95 backdrop-blur-2xl border border-[#EADFCF] rounded-[44px] shadow-2xl p-8 lg:p-12 overflow-hidden relative">
            <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-radial-gradient from-amber-50 to-transparent pointer-events-none opacity-60" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
              
              {/* LEFT COLUMN: TACTILE GAME BOARD */}
              <div className="lg:col-span-7 flex flex-col items-center">
                
                {/* HUD Header details */}
                <div className="w-full flex justify-between items-center mb-6">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-[#8B6239] uppercase">
                      LUXURY TACTILE ENGINE
                    </span>
                    <h2 className="text-2xl font-black text-[#3A281A] mt-1">Luxe XO Arena</h2>
                  </div>
                  
                  {aiThinking && (
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-[#8B6239] bg-[#EADFCF]/20 px-3.5 py-1.5 rounded-full border border-[#EADFCF]/40 shadow-inner">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B6239] animate-ping" /> AI THINKING...
                    </div>
                  )}
                </div>

                {/* Tactical 3x3 Grid Canvas */}
                <motion.div 
                  animate={boardPulse}
                  transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                  className="w-full max-w-[420px] aspect-square bg-[#F5F1EB]/40 border-2 border-[#EADFCF] rounded-[40px] p-6 shadow-2xl relative box-border flex items-center justify-center mx-auto"
                >
                  
                  {/* Glowing Victory connection line */}
                  {renderWinningLine()}

                  {/* 3x3 Matrix Grid cells */}
                  <div className="grid grid-cols-3 gap-4 w-full aspect-square relative z-20">
                    {board.map((cell, idx) => {
                      const isWinningCell = winnerInfo && winnerInfo.line.includes(idx)
                      const isClickable = !cell && !winnerInfo && !aiThinking

                      return (
                        <motion.div
                          key={idx}
                          whileHover={isClickable ? { scale: 1.03, y: -2 } : {}}
                          whileTap={isClickable ? { scale: 0.97 } : {}}
                          onClick={() => handleCellClick(idx)}
                          className={`aspect-square rounded-[26px] relative transition-all duration-300 flex items-center justify-center ${
                            isWinningCell
                              ? 'bg-amber-50/70 border-2 border-[#D4AF37] shadow-xl'
                              : cell
                                ? 'bg-white shadow-md border border-[#EADFCF]/65'
                                : 'bg-white/80 border border-[#EADFCF]/30 shadow-inner hover:border-[#8B6239]/40 cursor-pointer'
                          }`}
                        >
                          {/* Inner glowing hover effect */}
                          {isClickable && (
                            <div className="absolute inset-2 rounded-xl border border-dashed border-[#8B6239]/10 bg-amber-50/5 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                          )}

                          {/* Render Marks */}
                          {cell === 'X' && renderMarkX()}
                          {cell === 'O' && renderMarkO()}
                        </motion.div>
                      )
                    })}
                  </div>

                </motion.div>

                {/* Symmetrical Hint */}
                <div className="w-full flex items-center gap-2.5 bg-[#F5F1EB]/50 border border-[#EADFCF] rounded-2xl p-4 mt-6 text-xs text-[#6F4D2E] leading-relaxed">
                  <HelpCircle size={16} className="text-[#8B6239] flex-shrink-0" />
                  <span>
                    <strong>Quest Rule:</strong> Tap any empty cell to place your mark. Match 3 marks in a row (horizontal, vertical, or diagonal) to secure a perfect alignment and trigger sponsor fund matches.
                  </span>
                </div>

              </div>

              {/* RIGHT COLUMN: HIGH-END CONTROLS & HUD */}
              <div className="lg:col-span-5 flex flex-col justify-between lg:border-l border-[#EADFCF]/60 lg:pl-10">
                
                <div>
                  
                  {/* HUD controls and sounds */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black tracking-widest text-[#8B6239] uppercase">
                      MATCH CONFIGURATOR
                    </span>
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="text-[#8B6239] hover:opacity-75 cursor-pointer bg-white border border-[#EADFCF] p-2.5 rounded-full shadow-sm"
                    >
                      {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </button>
                  </div>

                  {/* Redesigned interactive mode selector */}
                  <div className="bg-[#FFFDF9] border border-[#EADFCF] rounded-[32px] p-6 mb-6 shadow-sm">
                    <span className="text-[10px] font-black text-[#8B6239] tracking-wider block mb-4 uppercase text-center">
                      Gameplay Mode
                    </span>

                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <button
                        onClick={() => {
                          setGameMode('AI')
                          handleRestart()
                        }}
                        className={`py-3.5 rounded-2xl border text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          gameMode === 'AI'
                            ? 'bg-[#8B6239] text-white border-[#8B6239] shadow-md'
                            : 'bg-white text-[#8B6239] border-[#EADFCF] hover:bg-[#F5F1EB]'
                        }`}
                      >
                        <Cpu size={14} /> VS SMART AI
                      </button>

                      <button
                        onClick={() => {
                          setGameMode('Friend')
                          handleRestart()
                        }}
                        className={`py-3.5 rounded-2xl border text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          gameMode === 'Friend'
                            ? 'bg-[#8B6239] text-white border-[#8B6239] shadow-md'
                            : 'bg-white text-[#8B6239] border-[#EADFCF] hover:bg-[#F5F1EB]'
                        }`}
                      >
                        <Users size={14} /> VS A FRIEND
                      </button>
                    </div>

                    {/* AI Difficulty dropdown */}
                    {gameMode === 'AI' && (
                      <div className="mb-4">
                        <span className="text-[9px] font-black text-[#8B6239] tracking-wider block mb-2.5 uppercase text-left">
                          AI Cognitive Depth
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {['Easy', 'Medium', 'Hard'].map((diff) => (
                            <button
                              key={diff}
                              onClick={() => {
                                setAiDifficulty(diff)
                                handleRestart()
                              }}
                              className={`py-2 rounded-xl border text-[10px] font-extrabold transition-all cursor-pointer ${
                                aiDifficulty === diff
                                  ? 'bg-[#8B6239]/15 text-[#8B6239] border-[#8B6239]'
                                  : 'bg-white text-slate-500 border-[#EADFCF] hover:bg-[#F5F1EB]'
                              }`}
                            >
                              {diff}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleRestart}
                      className="w-full py-3.5 rounded-2xl border border-[#EADFCF] bg-white text-xs font-black text-[#8B6239] cursor-pointer hover:bg-[#F5F1EB] transition-all"
                    >
                      Clear & Reset Grid
                    </button>
                  </div>

                  {/* SCOREBOARD STATUS */}
                  <div className="bg-white border border-[#EADFCF] rounded-[32px] p-6 mb-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-[10px] font-black tracking-wider text-[#8B6239] uppercase flex items-center gap-1.5">
                        <Trophy size={13} /> SCOREBOARD STATUS
                      </h4>
                      <button 
                        onClick={handleClearScoreboard}
                        className="text-[9px] font-black text-red-500 bg-red-50/50 px-2.5 py-1 rounded-full border border-red-200/50 hover:bg-red-50 transition-all cursor-pointer"
                      >
                        Reset Scores
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-[#F5F1EB]/30 border border-[#EADFCF]/60 rounded-2xl p-3">
                        <div className="text-[9px] font-black text-[#8B6239] uppercase tracking-wide">X Wins</div>
                        <div className="text-xl font-black text-[#3A281A] mt-1">{scores.X}</div>
                      </div>

                      <div className="bg-[#F5F1EB]/30 border border-[#EADFCF]/60 rounded-2xl p-3">
                        <div className="text-[9px] font-black text-[#8B6239] uppercase tracking-wide">O Wins</div>
                        <div className="text-xl font-black text-[#3A281A] mt-1">{scores.O}</div>
                      </div>

                      <div className="bg-[#F5F1EB]/30 border border-[#EADFCF]/60 rounded-2xl p-3">
                        <div className="text-[9px] font-black text-[#8B6239] uppercase tracking-wide">Draws</div>
                        <div className="text-xl font-black text-[#3A281A] mt-1">{scores.draws}</div>
                      </div>
                    </div>
                  </div>

                  {/* MATCH LOG CHRONOLOGY */}
                  <div>
                    <h4 className="text-[10px] font-black tracking-wider text-[#8B6239] uppercase mb-3 flex items-center gap-1.5">
                      <ListTodo size={13} /> ACTION CHRONOLOGY
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

        {/* ────────────────── VICTORY & MATCH END OVERLAYS ────────────────── */}
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
                {/* Floating particle burst indicators */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-[#D4AF37]"
                      style={{
                        top: '50%',
                        left: '50%',
                      }}
                      animate={{
                        x: [0, (Math.random() - 0.5) * 200],
                        y: [0, (Math.random() - 0.5) * 200 - 80],
                        opacity: [1, 0],
                        scale: [1, 1.4, 0],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  ))}
                </div>

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 shadow-inner">
                    {winnerInfo.winner === 'Draw' ? (
                      <Star size={30} className="text-[#8B6239]" />
                    ) : (
                      <Award size={32} className="text-[#8B6239] animate-bounce" />
                    )}
                  </div>

                  <span className="text-[10px] font-black tracking-widest text-[#8B6239] uppercase">
                    {winnerInfo.winner === 'Draw' ? 'HARMONIOUS DRAW 💫' : `PLAYER ${winnerInfo.winner} WINS! 🏆`}
                  </span>

                  <h2 className="text-2xl font-black text-[#3A281A] my-3">
                    {winnerInfo.winner === 'Draw' ? 'Perfect Equilibrium!' : 'Symmetrical Alignment!'}
                  </h2>

                  <p className="text-xs text-[#6F4D2E] leading-relaxed mb-6">
                    {winnerInfo.winner === 'Draw' 
                      ? 'The alignment grid reached perfect balance without any clash. Play another round to claim a fund match!'
                      : `Player ${winnerInfo.winner} successfully claimed alignment perfect matching. A matching transaction of ₹20 has been matched by corporate sponsors directly to Aarav's treatment pool.`}
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
                        <div className="text-lg font-black text-[#8B6239]">
                          {winnerInfo.winner === 'Draw' ? '₹0.00' : '₹20.00'}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-[#A09080] font-black border-t border-[#EADFCF]/50 pt-2.5">
                      <span>STATUS</span>
                      <span className={winnerInfo.winner === 'Draw' ? 'text-amber-600' : 'text-[#47682C]'}>
                        {winnerInfo.winner === 'Draw' ? '✓ SYMMETRY RECORDED' : '✓ MATCH CODE REGISTERED'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleRestart}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#8B6239] to-[#6F4D2E] text-white font-extrabold text-xs tracking-wide shadow-md hover:shadow-lg cursor-pointer"
                    >
                      PLAY NEXT MATCH
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleCopyLink}
                        className="py-3 rounded-2xl border border-[#EADFCF] bg-white text-xs font-black text-[#8B6239] cursor-pointer hover:bg-[#F5F1EB]"
                      >
                        {isCopied ? 'Link Copied!' : 'Share Quest'}
                      </button>

                      <button
                        onClick={() => navigate('/main')}
                        className="py-3 rounded-2xl border border-[#EADFCF] bg-white text-xs font-black text-[#8B6239] cursor-pointer hover:bg-[#F5F1EB]"
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
