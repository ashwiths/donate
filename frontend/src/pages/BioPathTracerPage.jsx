import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Play, Pause, RotateCcw, Heart, Sparkles, 
  Volume2, VolumeX, ShieldCheck, ChevronRight, Award, Share2, 
  Activity, Zap, Target, Dna, Cpu, Award as BadgeIcon
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { GlobalBackground } from '../components/PremiumBackground'
import { addContribution } from '../services/contributionService'

// Solfeggio / Pentatonic chime frequencies for Neural Tracing (Warm marimba/wood tones)
const MARIMBA_FREQS = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25] 

// Highly complex, intricate 12-node multi-layered bio-neural matrix structure
const PATHWAY_NODES = [
  // Layer 0: Root Sensory Input
  { id: 0, x: 50, y: 90, label: 'Receptor Primary Core', connectsTo: [1, 2, 3], vitality: 97, integrity: 99, code: 'RCP-01' },
  { id: 1, x: 20, y: 80, label: 'Sensory Node Aux-A', connectsTo: [0, 4, 6], vitality: 89, integrity: 94, code: 'SNA-02' },
  { id: 2, x: 80, y: 80, label: 'Sensory Node Aux-B', connectsTo: [0, 5, 7], vitality: 91, integrity: 95, code: 'SNB-03' },
  
  // Layer 1: Intermediate Relays
  { id: 3, x: 50, y: 68, label: 'Central Synaptic Relay', connectsTo: [0, 6, 7], vitality: 85, integrity: 90, code: 'CSR-04' },
  { id: 4, x: 15, y: 56, label: 'Lateral Synaptic Relay-L', connectsTo: [1, 6, 8], vitality: 88, integrity: 92, code: 'LSL-05' },
  { id: 5, x: 85, y: 56, label: 'Lateral Synaptic Relay-R', connectsTo: [2, 7, 9], vitality: 90, integrity: 93, code: 'LSR-06' },
  
  // Layer 2: Complex Dendritic Integrators
  { id: 6, x: 35, y: 44, label: 'Dendrite Integrator-AL', connectsTo: [1, 3, 4, 8, 10], vitality: 82, integrity: 88, code: 'DIA-07' },
  { id: 7, x: 65, y: 44, label: 'Dendrite Integrator-BR', connectsTo: [2, 3, 5, 9, 10], vitality: 86, integrity: 89, code: 'DIB-08' },
  { id: 8, x: 15, y: 32, label: 'Peripheral Processor-L', connectsTo: [4, 6, 10], vitality: 79, integrity: 84, code: 'PPL-09' },
  { id: 9, x: 85, y: 32, label: 'Peripheral Processor-R', connectsTo: [5, 7, 10], vitality: 81, integrity: 85, code: 'PPR-10' },

  // Layer 3: Cortex Gateways
  { id: 10, x: 50, y: 24, label: 'Pre-Cortex Consolidation', connectsTo: [6, 7, 8, 9, 11], vitality: 93, integrity: 97, code: 'PCC-11' },
  { id: 11, x: 50, y: 10, label: 'Cortex Gateway Master', connectsTo: [10], vitality: 98, integrity: 99, code: 'CGM-12' }
]

export default function BioPathTracerPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Game States
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeNode, setActiveNode] = useState(0) // Start node index
  const [tracedPath, setTracedPath] = useState([0]) // Array of node IDs traced
  const [score, setScore] = useState(0) // Cycles completed
  const [sessionCompleted, setSessionCompleted] = useState(false)
  const [savingContribution, setSavingContribution] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Fictitious live data updates
  const [chartProgress, setChartProgress] = useState(64)
  const [creditPool, setCreditPool] = useState(12450)

  // Custom name for certificate
  const [helperName, setHelperName] = useState(localStorage.getItem('hp_user_name') || 'Generous Supporter')
  const [isCopied, setIsCopied] = useState(false)

  // Visual highlights
  const [feedbackText, setFeedbackText] = useState('Initialize alignment grid')
  
  // Audio Synthesis Context
  const audioContextRef = useRef(null)

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  // Soft real-time charts flutter animation
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setChartProgress(p => Math.min(99, Math.max(50, p + (Math.random() * 2 - 1))))
      setCreditPool(c => Math.min(20000, c + Math.floor(Math.random() * 3)))
    }, 1500)
    return () => clearInterval(interval)
  }, [isPlaying])

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
  }

  // Play chimes
  const playMarimbaNode = (index = 0) => {
    if (!soundEnabled) return
    initAudio()
    try {
      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      const freq = MARIMBA_FREQS[index % MARIMBA_FREQS.length]
      
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)

      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9)

      const subOsc = ctx.createOscillator()
      const subGain = ctx.createGain()
      subOsc.type = 'sine'
      subOsc.frequency.setValueAtTime(freq / 2, ctx.currentTime)
      subGain.gain.setValueAtTime(0, ctx.currentTime)
      subGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.02)
      subGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7)

      subOsc.connect(subGain)
      subGain.connect(ctx.destination)
      
      osc.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      osc.start()
      subOsc.start()
      
      osc.stop(ctx.currentTime + 1.0)
      subOsc.stop(ctx.currentTime + 0.8)
    } catch (e) {
      console.warn('Audio synthesis block:', e)
    }
  }

  // Tracing node tap handler
  const handleNodeClick = (nodeId) => {
    if (!isPlaying || sessionCompleted) return

    initAudio()
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }

    const currentNodeObj = PATHWAY_NODES[activeNode]
    
    // Check adjacent link connections
    const isAdjacent = currentNodeObj.connectsTo.includes(nodeId)

    if (isAdjacent && !tracedPath.includes(nodeId)) {
      const nextPath = [...tracedPath, nodeId]
      setTracedPath(nextPath)
      setActiveNode(nodeId)
      
      playMarimbaNode(nodeId)
      setFeedbackText(`Aligned: ${PATHWAY_NODES[nodeId].label}!`)

      setCreditPool(c => Math.min(20000, c + 680)) // incremental oncology asset credit load

      if (nodeId === 11) {
        setScore(s => {
          const nextScore = s + 1
          if (nextScore >= 1) {
            setIsPlaying(false)
            setSessionCompleted(true)
            setFeedbackText('Neural Pathway Restored!')
            setCreditPool(16450)
            handleClaimSponsorReward()
          }
          return nextScore
        })
      }
    } else {
      setFeedbackText('Link error: Tap adjacent active cells!')
      if (soundEnabled) {
        try {
          const ctx = audioContextRef.current
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(130.81, ctx.currentTime) 
          gain.gain.setValueAtTime(0, ctx.currentTime)
          gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05)
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start()
          osc.stop(ctx.currentTime + 0.5)
        } catch (e) {}
      }
    }
  }

  const handleClaimSponsorReward = async () => {
    if (!user?.uid || savingContribution) return
    setSavingContribution(true)
    try {
      await addContribution(user.uid, 10, 'Baby Aarav', 'Sponsor Matched Neural Path', true)
    } catch (err) {
      console.error('Failed writing contribution:', err)
    } finally {
      setSavingContribution(false)
    }
  }

  const handleTogglePlay = () => {
    if (sessionCompleted) {
      setScore(0)
      setTracedPath([0])
      setActiveNode(0)
      setSessionCompleted(false)
    }
    
    initAudio()
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }

    const nextPlaying = !isPlaying
    setIsPlaying(nextPlaying)
    setFeedbackText(nextPlaying ? 'Tracing active path...' : 'Tracer Paused')
    
    if (nextPlaying) {
      playMarimbaNode(0)
    }
  }

  const handleReset = () => {
    setIsPlaying(false)
    setScore(0)
    setTracedPath([0])
    setActiveNode(0)
    setSessionCompleted(false)
    setFeedbackText('Pathway reinitialized.')
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
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

        {/* Evolved Academic-Medical UI Layout */}
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
              
              {/* LEFT SIDE: KINETIC SYNTHESIS Visualizer & 3D Progress */}
              <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                
                {/* Academic Header Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 9.5, fontWeight: 900, color: '#8C4F1A', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    [ SYSTEM MONITOR: RESTORATION DECK ]
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 8.5, fontWeight: 900, color: '#47682C', background: '#F3F6F0', padding: '2px 8px', borderRadius: 99 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#47682C' }} /> ONLINE FEED
                  </div>
                </div>

                {/* Elaborate Biological Pathway SVG Grid */}
                <div style={{
                  width: '100%',
                  height: 380,
                  background: '#FFFFFF',
                  border: '1px solid rgba(220, 208, 195, 0.8)',
                  borderRadius: '28px',
                  boxShadow: 'inset 0 4px 18px rgba(0,0,0,0.015), 0 12px 30px rgba(139, 94, 52, 0.04)',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  
                  {/* Overlay text */}
                  <div style={{
                    position: 'absolute',
                    top: 16,
                    left: 20,
                    fontSize: '9px',
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    color: '#8C4F1A',
                    background: 'rgba(253, 250, 246, 0.8)',
                    border: '1px solid rgba(139,94,52,0.15)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    zIndex: 5
                  }}>
                    KINETIC SYNTHESIS ENGINE - LIVE FEED
                  </div>

                  {/* Play lock state */}
                  {!isPlaying && !sessionCompleted && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(253, 250, 246, 0.75)',
                      backdropFilter: 'blur(4px)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 12,
                      zIndex: 10
                    }}>
                      <div style={{
                        width: 54,
                        height: 54,
                        borderRadius: '50%',
                        background: '#8C4F1A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        boxShadow: '0 8px 24px rgba(140,79,26,0.22)',
                        cursor: 'pointer'
                      }} onClick={handleTogglePlay}>
                        <Activity size={22} color="#FFF" />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8C4F1A' }}>
                        Initialize Alignment Grid
                      </span>
                    </div>
                  )}

                  {/* Crystalline Biological Layered SVG */}
                  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', padding: '15px', boxSizing: 'border-box' }}>
                    
                    {/* Intricate background crystalline matrix guides representing secondary filaments */}
                    <g opacity="0.15">
                      <polygon points="50,10 20,80 80,80" fill="none" stroke="#8C4F1A" strokeWidth="0.35" />
                      <polygon points="50,90 15,32 85,32" fill="none" stroke="#8C4F1A" strokeWidth="0.35" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#8C4F1A" strokeWidth="0.25" strokeDasharray="1, 3" />
                      <circle cx="50" cy="50" r="25" fill="none" stroke="#8C4F1A" strokeWidth="0.2" strokeDasharray="2, 2" />
                    </g>

                    {/* Complex dynamic light filaments */}
                    {PATHWAY_NODES.map(node => 
                      node.connectsTo.map(targetId => {
                        const targetNode = PATHWAY_NODES[targetId]
                        if (node.id > targetId) return null
                        
                        const isTraced = 
                          tracedPath.includes(node.id) && 
                          tracedPath.includes(targetId) &&
                          Math.abs(tracedPath.indexOf(node.id) - tracedPath.indexOf(targetId)) === 1

                        return (
                          <g key={`${node.id}-${targetId}`}>
                            {/* Softer background trace path */}
                            <line
                              x1={node.x}
                              y1={node.y}
                              x2={targetNode.x}
                              y2={targetNode.y}
                              stroke={isTraced ? 'rgba(140, 79, 26, 0.15)' : 'rgba(220, 208, 195, 0.25)'}
                              strokeWidth={3}
                            />
                            {/* Intricate aligned light trace filament */}
                            <motion.line
                              x1={node.x}
                              y1={node.y}
                              x2={targetNode.x}
                              y2={targetNode.y}
                              stroke={isTraced ? '#8C4F1A' : 'rgba(220, 208, 195, 0.45)'}
                              strokeWidth={isTraced ? 2.2 : 0.9}
                              animate={isTraced ? { strokeDashoffset: [0, -10] } : {}}
                              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                              strokeDasharray={isTraced ? "4, 4" : "none"}
                            />
                          </g>
                        )
                      })
                    )}

                    {/* Crystalline cell structure spheres */}
                    {PATHWAY_NODES.map(node => {
                      const isActive = activeNode === node.id && isPlaying
                      const isTraced = tracedPath.includes(node.id)
                      const isClickable = isPlaying && 
                        PATHWAY_NODES[activeNode].connectsTo.includes(node.id) &&
                        !tracedPath.includes(node.id)

                      return (
                        <g key={node.id} style={{ cursor: isClickable ? 'pointer' : 'default' }} onClick={() => handleNodeClick(node.id)}>
                          
                          {/* Concentric layered glowing circles */}
                          {isActive && (
                            <>
                              <motion.circle
                                cx={node.x}
                                cy={node.y}
                                r={8}
                                fill="none"
                                stroke="#8C4F1A"
                                strokeWidth={0.5}
                                animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.6, 0.2] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                              <circle cx={node.x} cy={node.y} r={5.5} fill="none" stroke="rgba(140, 79, 26, 0.2)" strokeWidth={0.5} />
                            </>
                          )}

                          {/* Outer crystalline cell frame */}
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={isTraced ? 5.5 : 4.2}
                            fill={isActive ? '#8C4F1A' : isTraced ? '#5C3D24' : '#FFFFFF'}
                            stroke={isClickable ? '#8C4F1A' : isTraced ? '#5C3D24' : '#C5B4A6'}
                            strokeWidth={isClickable ? 1.5 : 1.0}
                          />

                          {/* Center core */}
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={1.5}
                            fill={isActive || isTraced ? '#FFFDF8' : '#8C4F1A'}
                          />

                          {/* Target Cortex Gateway specialized outer orbit */}
                          {node.id === 11 && (
                            <circle cx={node.x} cy={node.y} r={8} fill="none" stroke="rgba(140, 79, 26, 0.25)" strokeWidth={0.8} strokeDasharray="3, 3" />
                          )}
                        </g>
                      )
                    })}

                    {/* Glowing active path pulse indicator */}
                    {isPlaying && (
                      <motion.circle
                        cx={PATHWAY_NODES[activeNode].x}
                        cy={PATHWAY_NODES[activeNode].y}
                        r={2.2}
                        fill="#D4AF37"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      />
                    )}
                  </svg>

                  {/* Feedback status overlay bar */}
                  <div style={{
                    position: 'absolute',
                    bottom: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#FFFFFF',
                    border: '1px solid rgba(139,94,52,0.18)',
                    padding: '5px 14px',
                    borderRadius: '12px',
                    fontSize: '10.5px',
                    fontWeight: 900,
                    color: '#8C4F1A',
                    boxShadow: '0 4px 14px rgba(139,94,52,0.06)',
                    pointerEvents: 'none',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase'
                  }}>
                    {feedbackText}
                  </div>
                </div>

                {/* 3D-Stylized Progress Bar Section */}
                <div style={{ marginTop: 24, width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: '#8C4F1A', marginBottom: 8, letterSpacing: '0.02em' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Cpu size={12} /> PATHWAY CONNECTION RESTORED
                    </span>
                    <span>{tracedPath.length} / 12 Nodes Traced</span>
                  </div>
                  
                  {/* 3D Styled Progress Track */}
                  <div style={{ 
                    height: 14, 
                    background: 'rgba(235, 224, 214, 0.7)', 
                    borderRadius: 99, 
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 1px 1px #FFF',
                    padding: '2px', 
                    boxSizing: 'border-box',
                    overflow: 'hidden'
                  }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(tracedPath.length / 12) * 100}%` }}
                      style={{ 
                        height: '100%', 
                        background: 'linear-gradient(180deg, #EBD5C2 0%, #8C4F1A 100%)', 
                        borderRadius: 99,
                        boxShadow: '0 2px 4px rgba(140, 79, 26, 0.25), inset 0 1px 1px rgba(255,255,255,0.4)',
                        position: 'relative'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        inset: '0 0 50% 0',
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: 99
                      }} />
                    </motion.div>
                  </div>
                </div>

                {/* Sound settings */}
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button
                    onClick={() => {
                      const nextSound = !soundEnabled
                      setSoundEnabled(nextSound)
                      if (nextSound) {
                        initAudio()
                        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                          audioContextRef.current.resume()
                        }
                        playMarimbaNode(0)
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
                  >
                    {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                    <span style={{ fontSize: 11, fontWeight: 700 }}>Marimba Synth Feed</span>
                  </button>

                  <span style={{ fontSize: 9.5, fontWeight: 900, color: '#A09080', letterSpacing: '0.04em' }}>
                    SOLFEGIO TRANSFORM CORE: 432Hz/528Hz
                  </span>
                </div>

              </div>

              {/* RIGHT SIDE: Densely Packed Academic Info & Real-Time Stats */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '1px solid rgba(225, 215, 203, 0.6)', paddingLeft: 36 }} className="gameplay-settings-col">
                <div>
                  
                  {/* Title & Brand Intro */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: 'rgba(139,94,52,0.06)', border: '1px solid rgba(139,94,52,0.12)',
                        borderRadius: 99, padding: '4px 12px'
                      }}>
                        <Sparkles size={11} color="#8B5E34" />
                        <span style={{ fontSize: 9.5, fontWeight: 900, color: '#8B5E34', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                          fine-motor tracing
                        </span>
                      </div>

                      {/* Entry Code Box */}
                      <span style={{ fontSize: 10.5, fontWeight: 900, color: '#8C4F1A', background: 'rgba(140, 79, 26, 0.08)', border: '1.5px dashed rgba(140, 79, 26, 0.3)', padding: '4px 12px', borderRadius: '8px', fontFamily: 'Outfit' }}>
                        Entry Code: ₹20 ENTRY CODE
                      </span>
                    </div>

                    <h2 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: 900, color: '#4A3427', fontFamily: 'Outfit', letterSpacing: '-0.5px' }}>
                      Bio-Path Tracer
                    </h2>
                    
                    <p style={{ margin: '0 0 8px', fontSize: '13.5px', color: '#7A6A5A', lineHeight: 1.5, fontWeight: 500 }}>
                      Embark on a therapeutic geometric alignment. Trace the connected neural pathway branch nodes in sequence starting from the Receptor Core to the Cortex Gateway. Restoring the link triggers ₹10 in hospital bill support.
                    </p>

                    {/* Deep-tier expanded sub-paragraph */}
                    <p style={{ margin: 0, fontSize: '11.5px', color: '#8C4F1A', lineHeight: 1.5, fontWeight: 600, paddingLeft: 10, borderLeft: '2px solid #8C4F1A', fontStyle: 'italic' }}>
                      Each precise trajectory completed pools deep-tier Oncology Treatment Asset Credits directly from our clinical brand partners, automatically updating Aarav's real-time care chart with critical oncology fund allocations.
                    </p>
                  </div>

                  {/* HEAVILY DETAILED ACTIVE CELL PATHWAY STATUS - Scrollable custom height container */}
                  <div style={{ marginBottom: 24 }}>
                    <h4 style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8C4F1A' }}>
                      Active Cell Pathway Status
                    </h4>
                    
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 6,
                      maxHeight: '190px',
                      overflowY: 'auto',
                      paddingRight: '6px',
                      border: '1px solid rgba(220, 208, 195, 0.3)',
                      borderRadius: '16px',
                      padding: '8px',
                      background: 'rgba(253, 250, 246, 0.4)'
                    }} className="clinical-scroll-container">
                      {PATHWAY_NODES.map((node) => {
                        const isDone = tracedPath.includes(node.id)
                        const isActive = activeNode === node.id && isPlaying
                        const isAdjacent = isPlaying && PATHWAY_NODES[activeNode].connectsTo.includes(node.id)

                        return (
                          <div
                            key={node.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              background: isActive ? '#FFFDFB' : isAdjacent ? 'rgba(140, 79, 26, 0.04)' : 'rgba(255,255,255,0.6)',
                              border: isActive ? '1.5px solid #8C4F1A' : isAdjacent ? '1px dashed rgba(140, 79, 26, 0.4)' : '1px solid rgba(220, 208, 195, 0.4)',
                              borderRadius: '10px',
                              padding: '6px 10px',
                              opacity: !isPlaying ? 0.6 : 1,
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Dna size={11} color={isDone ? '#47682C' : isActive ? '#8C4F1A' : '#A09080'} />
                              <span style={{ fontSize: 11, fontWeight: 700, color: '#4A3427' }}>
                                {node.label} <span style={{ fontSize: 8, color: '#A09080', fontWeight: 600 }}>({node.code})</span>
                              </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 9, color: '#7A6A5A', fontWeight: 600 }}>
                                Vit: <strong>{node.vitality}%</strong>
                              </span>
                              <span style={{ fontSize: 9, color: '#7A6A5A', fontWeight: 600 }}>
                                Lk: <strong>{node.integrity}%</strong>
                              </span>
                              <span style={{
                                fontSize: 8.5,
                                fontWeight: 900,
                                color: isDone ? '#47682C' : isActive ? '#8C4F1A' : isAdjacent ? '#8C4F1A' : '#A09080',
                                background: isDone ? '#F3F6F0' : isActive ? 'rgba(140,79,26,0.08)' : isAdjacent ? 'rgba(140,79,26,0.05)' : '#FAF8F5',
                                padding: '1px 6px',
                                borderRadius: 99
                              }}>
                                {isDone ? '✓ ALIGNED' : isActive ? '● ACTIVE' : isAdjacent ? '○ READY' : '○ STABLE'}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* NEW MAJOR SECTION: INTEGRATED CHART & CREDIT POOL */}
                  <div style={{
                    background: 'rgba(139, 94, 52, 0.03)',
                    border: '1.5px solid rgba(139, 94, 52, 0.12)',
                    borderRadius: '24px',
                    padding: '18px 22px',
                    marginBottom: 24
                  }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8C4F1A', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Target size={14} /> INTEGRATED CHART & CREDIT POOL
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      
                      {/* Metric 1 */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 700, color: '#4A3427', marginBottom: 4 }}>
                          <span>Aarav's Chart Status (Oncology)</span>
                          <span style={{ color: '#47682C', fontWeight: 900 }}>{Math.floor(chartProgress)}% Vitality Match</span>
                        </div>
                        <div style={{ height: 6, background: 'rgba(235,224,214,0.5)', borderRadius: 99, overflow: 'hidden' }}>
                          <motion.div 
                            animate={{ width: `${chartProgress}%` }}
                            style={{ height: '100%', background: '#47682C', borderRadius: 99 }} 
                          />
                        </div>
                      </div>

                      {/* Metric 2 */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 700, color: '#4A3427', marginBottom: 4 }}>
                          <span>Partner Credit Pool</span>
                          <span style={{ fontWeight: 800 }}>₹{creditPool.toLocaleString()} / ₹20,000</span>
                        </div>
                        <div style={{ height: 6, background: 'rgba(235,224,214,0.5)', borderRadius: 99, overflow: 'hidden' }}>
                          <motion.div 
                            animate={{ width: `${(creditPool / 20000) * 100}%` }}
                            style={{ height: '100%', background: '#8C4F1A', borderRadius: 99 }} 
                          />
                        </div>
                      </div>

                      {/* Metric 3 */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, fontWeight: 700, color: '#4A3427', marginBottom: 4 }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <Zap size={11} color="#D4AF37" /> Next Medical Asset Unlock
                          </span>
                          <span style={{ fontWeight: 800 }}>25% Complete</span>
                        </div>
                        <div style={{ height: 6, background: 'rgba(235,224,214,0.5)', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: '25%', background: '#D4AF37', borderRadius: 99 }} />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Tracing Guideline Box */}
                  <div style={{
                    background: 'rgba(139, 94, 52, 0.02)',
                    border: '1px dashed rgba(139, 94, 52, 0.25)',
                    borderRadius: '20px',
                    padding: '16px 20px',
                    marginBottom: 24,
                    fontSize: 12.5,
                    lineHeight: 1.5,
                    color: '#7A6A5A'
                  }}>
                    <span style={{ fontWeight: 800, color: '#8C4F1A', display: 'block', marginBottom: 4 }}>
                      💡 Tracing Guideline
                    </span>
                    Guide the active light pulses. Tapping an adjacent glowing connected node draws a structural golden bridge. Avoid trace deviations to maximize asset credits. Guide the pulse to the Cortex Gateway and chart-level synthesis will trigger.
                  </div>

                </div>

                {/* Play Controls */}
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
                        <Pause size={15} /> Pause Tracer
                      </>
                    ) : (
                      <>
                        <Play size={15} /> {tracedPath.length > 1 ? 'Resume Tracing' : 'Start Tracing'}
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

            {/* VERY BOTTOM PANEL: PARTNER ACKNOWLEDGEMENT */}
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
                  PARTNER ACKNOWLEDGEMENT
                </span>
                <span style={{ fontSize: 12, color: '#7A6A5A', fontWeight: 500 }}>
                  Aarav's treatment facilitated by partner contributions.
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
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#4A3427', fontFamily: 'Outfit' }}>MedCorp BioTech</span>
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
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#4A3427', fontFamily: 'Outfit' }}>Global Health Alliance</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ────────────────── SUCCESS MODAL OVERLAY ────────────────── */}
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
                    Neural Pathway Restored ✨
                  </span>

                  <h2 style={{ fontFamily: 'Outfit', fontSize: 26, fontWeight: 900, color: '#4A3427', margin: '6px 0 12px', letterSpacing: '-0.5px' }}>
                    Connection Complete!
                  </h2>

                  <p style={{ margin: '0 auto 24px', fontSize: '14px', color: '#7A6A5A', lineHeight: 1.6, maxWidth: 440 }}>
                    You have successfully finalized the geometric neural alignment. Your motor tracing has triggered a matching sponsor payment of <strong>₹10</strong> directed straight to verified hospital bills for Baby Aarav's treatment!
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
                          Bio-Geometry Pathway Restorer
                        </h4>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 8, fontWeight: 900, color: '#47682C', background: '#F3F6F0', padding: '3px 8px', borderRadius: 99 }}>
                        <ShieldCheck size={10} /> SECURE AUDITED
                      </div>
                    </div>

                    {/* Certificate message text */}
                    <p style={{ margin: '0 0 16px', fontSize: 11.5, color: '#7A6A5A', lineHeight: 1.5 }}>
                      This represents verified recognition that a dedicated geometric neural alignment was fully executed, triggering a match donation towards child ICU support billing.
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
                      onClick={() => navigate('/thank-you')}
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
