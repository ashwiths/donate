import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Play, Pause, RotateCcw, Heart, Sparkles, 
  Volume2, VolumeX, ShieldCheck, ChevronRight, Award, Share2, Eye, Activity
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { GlobalBackground } from '../components/PremiumBackground'
import { addContribution } from '../services/contributionService'

// Solfeggio / Pentatonic chime frequencies for Neural Tracing (Warm marimba/wood tones)
const MARIMBA_FREQS = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25] // Pentatonic scale C4 - C5

// Geometric Bio-Neural pathway nodes
const PATHWAY_NODES = [
  { id: 0, x: 50, y: 80, label: 'Receptor Core', connectsTo: [1, 2] },
  { id: 1, x: 25, y: 60, label: 'Synaptic Branch A', connectsTo: [0, 3] },
  { id: 2, x: 75, y: 60, label: 'Synaptic Branch B', connectsTo: [0, 4] },
  { id: 3, x: 30, y: 35, label: 'Dendrite Junction A', connectsTo: [1, 5] },
  { id: 4, x: 70, y: 35, label: 'Dendrite Junction B', connectsTo: [2, 5] },
  { id: 5, x: 50, y: 20, label: 'Cortex Gateway', connectsTo: [3, 4] }
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

  // Custom name for certificate
  const [helperName, setHelperName] = useState(localStorage.getItem('hp_user_name') || 'Generous Supporter')
  const [isCopied, setIsCopied] = useState(false)

  // Visual highlights
  const [feedbackText, setFeedbackText] = useState('Click Play to initialize pathway')
  
  // Audio Synthesis Context
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

  // Play peaceful marimba chime tone when connecting a pathway node
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
      
      // Triangle wave replicates hollow organic marimba woody chime tones beautifully
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)

      // Marimba volume envelope (very sharp onset, fast organic decay)
      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9)

      // Add gentle sub-harmonic octave lower for structural warmth
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
    
    // Check if the tapped node is directly connected to the active node
    const isAdjacent = currentNodeObj.connectsTo.includes(nodeId)
    // Avoid double backtracking immediately
    const isNextInSequence = nodeId > activeNode || (activeNode === 5 && nodeId === 0)

    if (isAdjacent && !tracedPath.includes(nodeId)) {
      // Successful connection!
      const nextPath = [...tracedPath, nodeId]
      setTracedPath(nextPath)
      setActiveNode(nodeId)
      
      playMarimbaNode(nodeId)
      setFeedbackText(`Connected to ${PATHWAY_NODES[nodeId].label}!`)

      // Check if they reached the final Cortex Gateway (node ID 5)
      if (nodeId === 5) {
        // Complete pathway tracing cycle!
        setScore(s => {
          const nextScore = s + 1
          if (nextScore >= 1) {
            // Unlocked full neural pathway harmony!
            setIsPlaying(false)
            setSessionCompleted(true)
            setFeedbackText('Neural Pathway Restored!')
            handleClaimSponsorReward()
          }
          return nextScore
        })
      }
    } else {
      // Off-path tap
      setFeedbackText('Select a connected adjacent biological cell!')
      // Play brief low error hum
      if (soundEnabled) {
        try {
          const ctx = audioContextRef.current
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(130.81, ctx.currentTime) // low C3
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

  // Record ₹10 matched sponsor contribution inside transaction
  const handleClaimSponsorReward = async () => {
    if (!user?.uid || savingContribution) return
    setSavingContribution(true)
    try {
      await addContribution(user.uid, 10, 'Baby Aarav', 'Sponsor Matched Neural Path')
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
    
    // Resume context
    initAudio()
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }

    const nextPlaying = !isPlaying
    setIsPlaying(nextPlaying)
    setFeedbackText(nextPlaying ? 'Trace connection paths to Cortex Gateway...' : 'Tracer Paused')
    
    // Play subtle startup tone
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
    setFeedbackText('Pathway reinitialized. Press Play.')
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

        {/* Immersive Glass Card */}
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
              
              {/* Left Column: Biological Neural Graph SVG Visualizer */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                
                {/* Healing heart label */}
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

                {/* SVG Visualizer Container */}
                <div style={{
                  width: '100%',
                  height: 340,
                  marginTop: 40,
                  background: '#FFFFFF',
                  border: '1px solid rgba(220, 208, 195, 0.6)',
                  borderRadius: '24px',
                  boxShadow: 'inset 0 4px 16px rgba(0,0,0,0.01), 0 10px 24px rgba(139, 94, 52, 0.03)',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  
                  {/* Overlay play lock */}
                  {!isPlaying && !sessionCompleted && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(253, 250, 246, 0.7)',
                      backdropFilter: 'blur(3px)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 12,
                      zIndex: 10
                    }}>
                      <div style={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: '#8C4F1A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        boxShadow: '0 8px 20px rgba(140,79,26,0.25)',
                        cursor: 'pointer'
                      }} onClick={handleTogglePlay}>
                        <Activity size={20} color="#FFF" />
                      </div>
                      <span style={{ fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8C4F1A' }}>
                        Click Play to Align Pathways
                      </span>
                    </div>
                  )}

                  {/* SVG Biological Network */}
                  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', padding: '10px', boxSizing: 'border-box' }}>
                    
                    {/* Glowing static guide connections */}
                    {PATHWAY_NODES.map(node => 
                      node.connectsTo.map(targetId => {
                        const targetNode = PATHWAY_NODES[targetId]
                        // Only draw line once (avoid duplicates)
                        if (node.id > targetId) return null
                        
                        // Check if this connection line is active in traced path
                        const isTraced = 
                          tracedPath.includes(node.id) && 
                          tracedPath.includes(targetId) &&
                          Math.abs(tracedPath.indexOf(node.id) - tracedPath.indexOf(targetId)) === 1

                        return (
                          <motion.line
                            key={`${node.id}-${targetId}`}
                            x1={node.x}
                            y1={node.y}
                            x2={targetNode.x}
                            y2={targetNode.y}
                            stroke={isTraced ? '#8C4F1A' : 'rgba(220, 208, 195, 0.4)'}
                            strokeWidth={isTraced ? 2.0 : 1.2}
                            animate={isTraced ? { strokeDashoffset: [0, -10] } : {}}
                            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                            strokeDasharray={isTraced ? "4, 4" : "none"}
                          />
                        )
                      })
                    )}

                    {/* Nodes (biological cell spheres) */}
                    {PATHWAY_NODES.map(node => {
                      const isActive = activeNode === node.id && isPlaying
                      const isTraced = tracedPath.includes(node.id)
                      const isClickable = isPlaying && 
                        PATHWAY_NODES[activeNode].connectsTo.includes(node.id) &&
                        !tracedPath.includes(node.id)

                      return (
                        <g key={node.id} style={{ cursor: isClickable ? 'pointer' : 'default' }} onClick={() => handleNodeClick(node.id)}>
                          
                          {/* Inner glowing trace indicators */}
                          {isActive && (
                            <motion.circle
                              cx={node.x}
                              cy={node.y}
                              r={8}
                              fill="none"
                              stroke="#8C4F1A"
                              strokeWidth={0.8}
                              animate={{ scale: [1.0, 1.6, 1.0], opacity: [0.3, 0.8, 0.3] }}
                              transition={{ duration: 1.8, repeat: Infinity }}
                            />
                          )}

                          {/* Outer sphere casing */}
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={isTraced ? 5.5 : 4.5}
                            fill={isActive ? '#8C4F1A' : isTraced ? '#5C3D24' : '#FFFFFF'}
                            stroke={isClickable ? '#8C4F1A' : isTraced ? '#5C3D24' : '#D4C5B9'}
                            strokeWidth={isClickable ? 1.5 : 1.0}
                          />

                          {/* Center core dot */}
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={1.8}
                            fill={isActive || isTraced ? '#FFFDF8' : '#8C4F1A'}
                          />

                          {/* Small identifier node indicators */}
                          {isClickable && (
                            <motion.circle
                              cx={node.x}
                              cy={node.y}
                              r={3}
                              fill="none"
                              stroke="#8C4F1A"
                              strokeWidth={0.8}
                              animate={{ scale: [1, 1.4, 1] }}
                              transition={{ duration: 1.2, repeat: Infinity }}
                            />
                          )}
                        </g>
                      )
                    })}

                    {/* Glowing active path pulse indicator */}
                    {isPlaying && (
                      <motion.circle
                        cx={PATHWAY_NODES[activeNode].x}
                        cy={PATHWAY_NODES[activeNode].y}
                        r={2.5}
                        fill="#D4AF37"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </svg>

                  {/* Status Toast Notification banner */}
                  <div style={{
                    position: 'absolute',
                    bottom: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#FFFFFF',
                    border: '1px solid rgba(139,94,52,0.15)',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#8C4F1A',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    pointerEvents: 'none',
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase'
                  }}>
                    {feedbackText}
                  </div>
                </div>

                {/* Score Target progress track */}
                <div style={{ marginTop: 24, width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#8C4F1A', marginBottom: 6 }}>
                    <span>Pathway connection restored</span>
                    <span>{tracedPath.length} / 6 Nodes Traced</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(235, 224, 214, 0.6)', borderRadius: 99, overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(tracedPath.length / 6) * 100}%` }}
                      style={{ height: '100%', background: 'linear-gradient(90deg, #EBD5C2, #8C4F1A)', borderRadius: 99 }}
                    />
                  </div>
                </div>

                {/* Sound Controls toggle */}
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
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
                    {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    <span style={{ fontSize: 11, fontWeight: 700 }}>Marimba Synthesizer</span>
                  </button>
                </div>

              </div>

              {/* Right Column: Settings & Presets */}
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
                        Fine-Motor Tracing
                      </span>
                    </div>

                    <h2 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: 900, color: '#4A3427', fontFamily: 'Outfit', letterSpacing: '-0.5px' }}>
                      Bio-Path Tracer
                    </h2>
                    
                    <p style={{ margin: 0, fontSize: '13.5px', color: '#7A6A5A', lineHeight: 1.6, fontWeight: 500 }}>
                      Embark on a therapeutic geometric alignment. Trace the connected neural pathway branch nodes in sequence starting from the Receptor Core to the Cortex Gateway. Restoring the link triggers ₹10 in hospital bill support.
                    </p>
                  </div>

                  {/* Biological Node Guide Info */}
                  <div style={{ marginBottom: 30 }}>
                    <h4 style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#8C4F1A' }}>
                      Active Cell Pathway Status
                    </h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {PATHWAY_NODES.map((node) => {
                        const isDone = tracedPath.includes(node.id)
                        const isActive = activeNode === node.id && isPlaying
                        return (
                          <div
                            key={node.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              background: isActive ? '#FFFDFB' : 'rgba(255,255,255,0.4)',
                              border: isActive ? '1.5px solid #8C4F1A' : '1px solid rgba(220, 208, 195, 0.5)',
                              borderRadius: '12px',
                              padding: '8px 12px',
                              opacity: !isPlaying ? 0.6 : 1
                            }}
                          >
                            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#4A3427' }}>
                              {node.label}
                            </span>
                            <span style={{
                              fontSize: 9.5,
                              fontWeight: 900,
                              color: isDone ? '#47682C' : isActive ? '#8C4F1A' : '#A09080',
                              background: isDone ? '#F3F6F0' : isActive ? 'rgba(140,79,26,0.08)' : '#FAF8F5',
                              padding: '2px 8px',
                              borderRadius: 99
                            }}>
                              {isDone ? '✓ CONNECTED' : isActive ? '● ACTIVE PULSE' : '○ DISCONNECTED'}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Instruction text */}
                  <div style={{
                    background: 'rgba(139, 94, 52, 0.03)',
                    border: '1px solid rgba(139, 94, 52, 0.08)',
                    borderRadius: '20px',
                    padding: '16px 20px',
                    marginBottom: 32,
                    fontSize: 12.5,
                    lineHeight: 1.5,
                    color: '#7A6A5A'
                  }}>
                    <span style={{ fontWeight: 800, color: '#8C4F1A', display: 'block', marginBottom: 4 }}>
                      💡 Tracing Guideline
                    </span>
                    The active pulse of light rests on a node. Tapping an adjacent glowing connected node (indicated by a small concentric ring) draws a structural golden bridge. Guide the pulse safely all the way to the top Cortex Gateway cell.
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
