import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Volume2, VolumeX, Shuffle, RefreshCw, Trophy, 
  Clock, Award, Smile, Activity, HelpCircle, AlertCircle
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { GlobalBackground } from '../components/PremiumBackground'
import { addContribution } from '../services/contributionService'

// Solfeggio sound frequencies for premium acoustic feedback
const AUDIO_FREQS = {
  slide: [432.00, 528.00], // clean Solfeggio pitch sweep
  shuffle: [294.00, 396.00], // tick sequence pitches
  victory: [396.00, 528.00, 639.00, 741.00, 852.00], // ascending harmony sweep
  error: [180.00, 200.00] // warm warning low-tone
}

export default function MindSlidePage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Game Settings States
  const [size, setSize] = useState(3) // 3 = 3x3 (Easy), 4 = 4x4 (Medium), 5 = 5x5 (Hard)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [board, setBoard] = useState([]) // Array containing tile numbers or null

  // Live Statistics
  const [moves, setMoves] = useState(0)
  const [timer, setTimer] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [logs, setLogs] = useState(['MindSlide Arena loaded. Select a difficulty to start matching nodes!'])
  const [victoryModal, setVictoryModal] = useState(null)
  const [savingReward, setSavingReward] = useState(false)

  // Best score tracker stored in localstorage
  const [bestScores, setBestScores] = useState(() => {
    const saved = localStorage.getItem('mindslide_best_scores')
    return saved ? JSON.parse(saved) : {
      3: { moves: null, time: null },
      4: { moves: null, time: null },
      5: { moves: null, time: null }
    }
  })

  const audioContextRef = useRef(null)
  const timerIntervalRef = useRef(null)

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  // Start board automatically on size/mode change
  useEffect(() => {
    initBoard()
    return () => stopTimer()
  }, [size])

  // Timer loop hooks
  useEffect(() => {
    if (timerActive) {
      timerIntervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    } else {
      stopTimer()
    }
    return () => stopTimer()
  }, [timerActive])

  // Audio Context initializer
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
  }

  // Synthesize game sound effects in real-time
  const playSound = (type) => {
    if (!soundEnabled) return
    initAudio()
    try {
      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const now = ctx.currentTime

      if (type === 'slide') {
        // Crisp high-speed frequency sweep
        const osc = ctx.createOscillator()
        const gainNode = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(AUDIO_FREQS.slide[0], now)
        osc.frequency.exponentialRampToValueAtTime(AUDIO_FREQS.slide[1], now + 0.1)
        gainNode.gain.setValueAtTime(0, now)
        gainNode.gain.linearRampToValueAtTime(0.06, now + 0.005)
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.1)
        osc.connect(gainNode)
        gainNode.connect(ctx.destination)
        osc.start()
        osc.stop(now + 0.1)
      } else if (type === 'shuffle') {
        // Quick burst of rhythmic ticks
        AUDIO_FREQS.shuffle.forEach((freq, idx) => {
          const osc = ctx.createOscillator()
          const gainNode = ctx.createGain()
          osc.type = 'triangle'
          osc.frequency.setValueAtTime(freq, now + idx * 0.04)
          gainNode.gain.setValueAtTime(0, now + idx * 0.04)
          gainNode.gain.linearRampToValueAtTime(0.05, now + idx * 0.04 + 0.005)
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.06)
          osc.connect(gainNode)
          gainNode.connect(ctx.destination)
          osc.start(now + idx * 0.04)
          osc.stop(now + idx * 0.04 + 0.06)
        })
      } else if (type === 'error') {
        AUDIO_FREQS.error.forEach((freq) => {
          const osc = ctx.createOscillator()
          const gainNode = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, now)
          gainNode.gain.setValueAtTime(0, now)
          gainNode.gain.linearRampToValueAtTime(0.05, now + 0.01)
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.15)
          osc.connect(gainNode)
          gainNode.connect(ctx.destination)
          osc.start()
          osc.stop(now + 0.15)
        })
      } else if (type === 'victory') {
        AUDIO_FREQS.victory.forEach((freq, idx) => {
          const osc = ctx.createOscillator()
          const gainNode = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, now + idx * 0.1)
          gainNode.gain.setValueAtTime(0, now + idx * 0.1)
          gainNode.gain.linearRampToValueAtTime(0.07, now + idx * 0.1 + 0.01)
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 0.4)
          osc.connect(gainNode)
          gainNode.connect(ctx.destination)
          osc.start(now + idx * 0.1)
          osc.stop(now + idx * 0.1 + 0.4)
        })
      }
    } catch (e) {
      console.warn('Audio synthesis issue:', e)
    }
  }

  // Initialize Board
  const initBoard = () => {
    stopTimer()
    setMoves(0)
    setTimer(0)
    setVictoryModal(null)
    setTimerActive(false)
    setIsPlaying(false)

    // Form solved board
    const totalTiles = size * size
    const solved = Array.from({ length: totalTiles - 1 }).map((_, i) => i + 1)
    solved.push(null) // Empty slot at the very end
    setBoard(solved)

    setLogs([`Solved layout loaded. Tap "SHUFFLE PUZZLE" to generate a solvable challenge!`])
  }

  // Stop Timer safely
  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
  }

  // Shuffle puzzle using 150 random valid swaps (guarantees solvability!)
  const shuffleBoard = () => {
    initAudio()
    playSound('shuffle')

    const totalTiles = size * size
    const solved = Array.from({ length: totalTiles - 1 }).map((_, i) => i + 1)
    solved.push(null)

    let currentBoard = [...solved]
    let emptyIdx = totalTiles - 1

    // Perform 150 valid random swaps
    const shuffleSteps = size === 3 ? 120 : size === 4 ? 200 : 300
    for (let s = 0; s < shuffleSteps; s++) {
      const adjacentIndices = getAdjacentIndices(emptyIdx)
      const randomSwapIdx = adjacentIndices[Math.floor(Math.random() * adjacentIndices.length)]
      
      // Swap empty slot with random adjacent slot
      currentBoard[emptyIdx] = currentBoard[randomSwapIdx]
      currentBoard[randomSwapIdx] = null
      emptyIdx = randomSwapIdx
    }

    setBoard(currentBoard)
    setMoves(0)
    setTimer(0)
    setVictoryModal(null)
    setTimerActive(true)
    setIsPlaying(true)

    const sizeLabel = size === 3 ? 'Easy 3x3' : size === 4 ? 'Medium 4x4' : 'Hard 5x5'
    setLogs(prev => [
      `⚔ Symmetrical Arena shuffled! Mode: ${sizeLabel}. Clock started. Solve it now!`,
      ...prev
    ])
  }

  // Get valid adjacent indices inside 1D array representing 2D grid
  const getAdjacentIndices = (idx) => {
    const adjacent = []
    const row = Math.floor(idx / size)
    const col = idx % size

    // Up
    if (row > 0) adjacent.push(idx - size)
    // Down
    if (row < size - 1) adjacent.push(idx + size)
    // Left
    if (col > 0) adjacent.push(idx - 1)
    // Right
    if (col < size - 1) adjacent.push(idx + 1)

    return adjacent
  }

  // Check if grid is solved
  const checkSolved = (currentBoard) => {
    const totalTiles = size * size
    for (let i = 0; i < totalTiles - 1; i++) {
      if (currentBoard[i] !== i + 1) return false
    }
    return currentBoard[totalTiles - 1] === null
  }

  // Handle Tile Click / Slide Interaction
  const handleTileClick = (idx) => {
    if (!isPlaying) {
      playSound('error')
      setLogs(prev => [`⚠ Puzzle not active. Tap "SHUFFLE PUZZLE" to launch.`, ...prev])
      return
    }

    const emptyIdx = board.indexOf(null)
    const row = Math.floor(idx / size)
    const col = idx % size
    
    const emptyRow = Math.floor(emptyIdx / size)
    const emptyCol = emptyIdx % size

    const isAdjacent = (Math.abs(row - emptyRow) + Math.abs(col - emptyCol)) === 1

    if (isAdjacent) {
      playSound('slide')
      const updatedBoard = [...board]
      
      // Swap tile and empty slot
      updatedBoard[emptyIdx] = board[idx]
      updatedBoard[idx] = null
      
      setBoard(updatedBoard)
      const nextMoves = moves + 1
      setMoves(nextMoves)

      // Check Victory Condition
      if (checkSolved(updatedBoard)) {
        handleVictory(nextMoves)
      }
    } else {
      playSound('error')
    }
  }

  // Calculate Symmetrical Completion Percentage
  const getCompletionPercentage = () => {
    const totalTiles = size * size
    let correctCount = 0
    for (let i = 0; i < totalTiles - 1; i++) {
      if (board[i] === i + 1) correctCount++
    }
    return Math.round((correctCount / (totalTiles - 1)) * 100)
  }

  // Handle Puzzle Solved Victory
  const handleVictory = (finalMoves) => {
    stopTimer()
    setTimerActive(false)
    setIsPlaying(false)
    playSound('victory')

    let isNewBest = false
    const previousBest = bestScores[size]

    const movesImproved = previousBest.moves === null || finalMoves < previousBest.moves
    const timeImproved = previousBest.time === null || timer < previousBest.time

    let nextBest = { ...previousBest }
    if (movesImproved || timeImproved) {
      isNewBest = true
      nextBest = {
        moves: previousBest.moves === null ? finalMoves : Math.min(previousBest.moves, finalMoves),
        time: previousBest.time === null ? timer : Math.min(previousBest.time, timer)
      }
      setBestScores(prev => ({
        ...prev,
        [size]: nextBest
      }))
      localStorage.setItem('mindslide_best_scores', JSON.stringify({
        ...bestScores,
        [size]: nextBest
      }))
    }

    setVictoryModal({
      moves: finalMoves,
      time: timer,
      isNewBest,
      bestMoves: nextBest.moves,
      bestTime: nextBest.time
    })

    setLogs(prev => [
      `🎉 MindSlide Solved! Final moves: ${finalMoves}. Completion time: ${timer}s. matched transactions dispatched!`,
      ...prev
    ])

    // Symmetrical pediatric contribution dispatch on win
    handleClaimSponsorContribution()
  }

  // Pediatric Treatment Ledger Dispatch
  const handleClaimSponsorContribution = async () => {
    if (!user?.uid || savingReward) return
    setSavingReward(true)
    try {
      await addContribution(user.uid, 20, 'Janamithra', 'MindSlide Symmetrical Alignment Completed Reward', true)
      setLogs(prev => [`✓ Sponsoring pediatric treatment pools ₹20 contribution aligned successfully!`, ...prev])
    } catch (err) {
      console.error('Failed writing match contribution:', err)
    } finally {
      setSavingReward(false)
    }
  }

  // Floating ambient node stars
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

      {/* Floating stardust ambient nodes */}
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
              y: [0, -35, 0],
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

        {/* Tactile Luxe MindSlide Canvas */}
        <div className="max-w-[1100px] mx-auto mt-6 px-6 box-border">
          
          <div className="bg-[#FFFDFB]/90 backdrop-blur-2xl border border-[#EADFCF] rounded-[32px] md:rounded-[44px] shadow-2xl p-5 sm:p-8 lg:p-12 overflow-hidden relative">
            <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-radial-gradient from-amber-50 to-transparent pointer-events-none opacity-60" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
              
              {/* LEFT COLUMN: INTERACTIVE SLIDING PUZZLE ARENA */}
              <div className="lg:col-span-8 flex flex-col items-center">
                
                {/* HUD Header Details */}
                <div className="w-full flex justify-between items-center mb-6">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-[#8B6239] uppercase flex items-center gap-1.5 animate-pulse">
                      🌱 COGNITIVE SYMMETRY MATRICES
                    </span>
                    <h2 className="text-2xl font-black text-[#3A281A] mt-1">MindSlide Puzzle</h2>
                  </div>
                  
                  {/* Real-time progression gauge */}
                  <div className="flex items-center gap-2.5 text-[10px] font-black text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full shadow-sm">
                    PROGRESS: {getCompletionPercentage()}%
                  </div>
                </div>

                {/* Symmetrical Grid Arena Container */}
                <div className="w-full max-w-[420px] aspect-square bg-[#F5F1EB]/50 border-2 border-[#EADFCF] rounded-[24px] md:rounded-[40px] shadow-inner p-2 sm:p-4 relative box-border flex items-center justify-center">
                  
                  {/* Grid Layout based on size */}
                  <div 
                    className={`grid gap-3 w-full h-full`}
                    style={{
                      gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
                      gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`
                    }}
                  >
                    {board.map((tile, idx) => {
                      if (tile === null) {
                        // Render Empty Spot
                        return (
                          <div 
                            key="empty" 
                            className="w-full h-full rounded-2xl bg-gradient-to-tr from-[#FAF8F5]/30 to-[#F0E8DC]/10 border border-dashed border-[#D4C5B9]/40 opacity-70"
                          />
                        )
                      }

                      // Check if tile is currently solved/aligned in its index position
                      const isCorrect = tile === idx + 1

                      return (
                        <motion.button
                          key={tile}
                          layout
                          onClick={() => handleTileClick(idx)}
                          className={`w-full h-full rounded-2xl border text-base font-black shadow-md flex items-center justify-center relative cursor-pointer select-none outline-none ${
                            isCorrect 
                              ? 'bg-amber-50/60 border-amber-300 text-[#8B6239] shadow-amber-100/35' 
                              : 'bg-white border-[#EADFCF] text-[#6F4D2E]'
                          }`}
                          whileHover={{ 
                            scale: 1.03, 
                            boxShadow: '0 8px 16px rgba(139, 98, 57, 0.12)' 
                          }}
                          whileTap={{ scale: 0.96 }}
                          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                        >
                          {/* Glossy inner alignment rings */}
                          <div className="absolute inset-1.5 rounded-xl bg-[#FAF8F5] opacity-[0.35] z-0 pointer-events-none" />
                          <span className="relative z-10">{tile}</span>
                        </motion.button>
                      )
                    })}
                  </div>

                  {/* Solved Celebration Mask overlay */}
                  {!isPlaying && !victoryModal && getCompletionPercentage() === 100 && (
                    <div className="absolute inset-0 bg-[#3A281A]/10 backdrop-blur-[1px] rounded-[40px] flex items-center justify-center z-20">
                      <div className="text-center bg-white/95 backdrop-blur-md border border-[#EADFCF] rounded-3xl p-6 shadow-xl max-w-[260px]">
                        <Trophy className="mx-auto text-amber-500 mb-2" size={32} />
                        <span className="text-[10px] font-black text-[#8B6239] uppercase tracking-wider block">SOLVED STATE</span>
                        <p className="text-[11px] text-[#6F4D2E] mt-2 mb-4 leading-relaxed">
                          Tap <strong>SHUFFLE PUZZLE</strong> in the right control panel to start!
                        </p>
                        <button
                          onClick={shuffleBoard}
                          className="px-6 py-2.5 bg-[#8B6239] text-white text-[10px] font-black tracking-wider rounded-xl cursor-pointer"
                        >
                          SHUFFLE & PLAY
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {/* Symmetrical Hint footer */}
                <div className="w-full flex items-center gap-3 bg-[#F5F1EB]/50 border border-[#EADFCF] rounded-2xl p-4 mt-6 text-xs text-[#6F4D2E] leading-relaxed">
                  <HelpCircle size={16} className="text-[#8B6239] flex-shrink-0" />
                  <span>
                    <strong>Slide Mechanics:</strong> Tap any tile immediately adjacent to the empty slot to slide it. Arrange tiles in ascending horizontal order. Solvability is mathematically guaranteed by the reverse swap generator.
                  </span>
                </div>

              </div>

              {/* RIGHT COLUMN: HIGH-END CONTROLS & HUD */}
              <div className="lg:col-span-4 flex flex-col justify-between lg:border-l border-[#EADFCF]/60 lg:pl-8">
                
                <div>
                  
                  {/* Sound and Volume Configurations */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black tracking-widest text-[#8B6239] uppercase">
                      COG ENGINE
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
                      Grid Dimension
                    </span>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[
                        { val: 3, label: 'Easy 3x3' },
                        { val: 4, label: 'Medium 4x4' },
                        { val: 5, label: 'Hard 5x5' }
                      ].map(item => (
                        <button
                          key={item.val}
                          onClick={() => setSize(item.val)}
                          className={`py-3.5 rounded-xl border text-center transition-all cursor-pointer text-[10px] font-black uppercase tracking-wider ${
                            size === item.val
                              ? 'bg-[#8B6239] text-white border-[#8B6239] shadow-sm'
                              : 'bg-white text-[#8B6239] border-[#EADFCF] hover:bg-[#F5F1EB]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={shuffleBoard}
                      className="w-full py-4 rounded-2xl bg-[#8B6239] text-white text-xs font-black cursor-pointer hover:opacity-90 shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Shuffle size={13} /> SHUFFLE PUZZLE
                    </button>
                  </div>

                  {/* STATS HUD MATRIX */}
                  <div className="bg-white border border-[#EADFCF] rounded-[32px] p-6 mb-6 shadow-sm">
                    <h4 className="text-[10px] font-black tracking-wider text-[#8B6239] uppercase mb-4 flex items-center gap-1.5">
                      <Trophy size={13} /> STAGE METRIC HUD
                    </h4>

                    <div className="grid grid-cols-2 gap-3 text-center mb-3">
                      <div className="bg-[#F5F1EB]/30 border border-[#EADFCF]/60 rounded-2xl p-3">
                        <div className="text-[8.5px] font-black text-[#8B6239] uppercase tracking-wide">Total Moves</div>
                        <div className="text-xl font-black text-[#3A281A] mt-1">{moves}</div>
                      </div>

                      <div className="bg-[#F5F1EB]/30 border border-[#EADFCF]/60 rounded-2xl p-3">
                        <div className="text-[8.5px] font-black text-[#8B6239] uppercase tracking-wide">Timer</div>
                        <div className="text-xl font-black text-[#3A281A] mt-1">{timer}s</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="bg-[#F5F1EB]/30 border border-[#EADFCF]/60 rounded-2xl p-3">
                        <div className="text-[8.5px] font-black text-[#8B6239] uppercase tracking-wide">Best Time</div>
                        <div className="text-xs font-black text-[#3A281A] mt-1.5">
                          {bestScores[size].time !== null ? `${bestScores[size].time}s` : 'N/A'}
                        </div>
                      </div>

                      <div className="bg-[#F5F1EB]/30 border border-[#EADFCF]/60 rounded-2xl p-3">
                        <div className="text-[8.5px] font-black text-[#8B6239] uppercase tracking-wide">Best Moves</div>
                        <div className="text-xs font-black text-[#3A281A] mt-1.5">
                          {bestScores[size].moves !== null ? `${bestScores[size].moves}` : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ACTION LOG CHRONOLOGY */}
                  <div>
                    <h4 className="text-[10px] font-black tracking-wider text-[#8B6239] uppercase mb-3 flex items-center gap-1.5">
                      <Activity size={13} /> SYSTEM PROGRESS LOGS
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

        {/* ────────────────── VICTORY SUCCESS MODAL ────────────────── */}
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
                {/* Visual stardust celebration burst */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-[#D4AF37]"
                      style={{
                        top: '55%',
                        left: '50%',
                      }}
                      animate={{
                        x: [0, (Math.random() - 0.5) * 260],
                        y: [0, (Math.random() - 0.5) * 260 - 80],
                        opacity: [1, 0],
                        scale: [1, 1.4, 0],
                      }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                  ))}
                </div>

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <Award size={34} className="text-[#8B6239] animate-bounce" />
                  </div>

                  <span className="text-[10px] font-black tracking-widest text-[#8B6239] uppercase">
                    SYMMETRY SOLVED 🏆
                  </span>

                  <h2 className="text-2xl font-black text-[#3A281A] my-3">
                    MindSlide Mastered!
                  </h2>

                  <p className="text-xs text-[#6F4D2E] leading-relaxed mb-6">
                    Symmetrical sequence restored! You solved the <strong>{size}x{size}</strong> alignment challenge in <strong>{victoryModal.moves} moves</strong> and <strong>{victoryModal.time} seconds</strong>.
                    <br />
                    Sponsor matches (₹20.00) have been dispatched directly to pediatric critical support ledgers.
                  </p>

                  <div className="bg-[#FFFDF9] border border-[#EADFCF] rounded-2xl p-5 text-left mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <span className="text-[9px] font-black text-[#8B6239] tracking-wider uppercase">Best Speed</span>
                        <div className="text-sm font-extrabold text-[#3A281A]">{victoryModal.bestTime}s</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-black text-[#8B6239] tracking-wider uppercase">Match Yield</span>
                        <div className="text-lg font-black text-[#8B6239]">₹20.00</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-[#A09080] font-black border-t border-[#EADFCF]/50 pt-2.5">
                      <span>STATUS</span>
                      <span className="text-[#47682C]">✓ SPONSOR MATCH CODES APPROVED</span>
                    </div>
                  </div>

                  {/* Action triggers */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={shuffleBoard}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#8B6239] to-[#6F4D2E] text-white font-extrabold text-xs tracking-wide shadow-md hover:shadow-lg cursor-pointer"
                    >
                      SOLVE ANOTHER ARENA
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
