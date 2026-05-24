import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Play, Pause, RotateCcw, Heart, Sparkles, 
  Volume2, VolumeX, ShieldCheck, ChevronRight, Award, Share2, Music, CheckCircle
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { GlobalBackground } from '../components/PremiumBackground'
import { addContribution } from '../services/contributionService'

// Solfeggio healing frequencies for the pentatonic chimes
const CHIME_FREQS = [528, 639, 741, 852, 963] // Solfeggio transformation frequencies

const SOUNDSCAPES = {
  ocean: {
    name: 'Ocean Chimes 🌊',
    desc: 'Deep rolling surf with high-pitched crystalline bells.',
    synthType: 'sine',
    decay: 2.5
  },
  wind: {
    name: 'Wind Bells 🎐',
    desc: 'Soft gentle breeze with ringing metal chimes.',
    synthType: 'triangle',
    decay: 1.8
  },
  forest: {
    name: 'Forest Rain 🌧️',
    desc: 'Warm soothing rain drops with hollow wooden tones.',
    synthType: 'sine',
    decay: 1.2
  }
}

export default function SoundWavePage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Game States
  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(0) // Needs 10 hits to win
  const [streak, setStreak] = useState(0)
  const [soundscapeKey, setSoundscapeKey] = useState('ocean')
  const [gameCompleted, setGameCompleted] = useState(false)
  const [savingContribution, setSavingContribution] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  
  // Custom name for certificate
  const [helperName, setHelperName] = useState(localStorage.getItem('hp_user_name') || 'Generous Supporter')
  const [isCopied, setIsCopied] = useState(false)

  // Visual effects
  const [feedbackText, setFeedbackText] = useState('')
  const [ripples, setRipples] = useState([])

  const currentSoundscape = SOUNDSCAPES[soundscapeKey]

  // Canvas Refs
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  // Game loop tracking
  const nodesRef = useRef([]) // Active nodes on the wave
  const waveOffsetRef = useRef(0)

  // Redirect if logged out
  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  // Web Audio Context synthesizer
  const audioContextRef = useRef(null)

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
  }

  // Play healing chime synthesized dynamically on tap
  const playChime = (isPerfect = true, index = 0) => {
    if (!soundEnabled) return
    initAudio()
    try {
      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      // Perfect alignment plays elegant Solfeggio bells
      if (isPerfect) {
        const freq = CHIME_FREQS[index % CHIME_FREQS.length]
        osc.type = currentSoundscape.synthType
        osc.frequency.setValueAtTime(freq, ctx.currentTime)

        // Crystal chime volume envelope
        gainNode.gain.setValueAtTime(0, ctx.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05)
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + currentSoundscape.decay)
        
        // Add subtle harmonic node (overtone) for premium warm bell tone
        const overtone = ctx.createOscillator()
        const overtoneGain = ctx.createGain()
        overtone.type = 'sine'
        overtone.frequency.setValueAtTime(freq * 1.5, ctx.currentTime)
        overtoneGain.gain.setValueAtTime(0, ctx.currentTime)
        overtoneGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.08)
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + currentSoundscape.decay * 0.7)
        
        overtone.connect(overtoneGain)
        overtoneGain.connect(ctx.destination)
        overtone.start()
        overtone.stop(ctx.currentTime + currentSoundscape.decay)
      } else {
        // Off-beat tap plays lower minor calming hum
        osc.type = 'sine'
        osc.frequency.setValueAtTime(164.81, ctx.currentTime) // E3 minor note
        gainNode.gain.setValueAtTime(0, ctx.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1)
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8)
      }

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + currentSoundscape.decay)
    } catch (e) {
      console.warn('Audio synthesis issue:', e)
    }
  }

  // Draw & Update Game loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let dpr = window.devicePixelRatio || 1
    
    // Resize handler
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Game loop
    const render = () => {
      const w = canvas.width / dpr
      const h = canvas.height / dpr

      // 1. Clear background with elegant slight transparent color to create soft trace trail
      ctx.fillStyle = 'rgba(253, 250, 246, 0.25)'
      ctx.fillRect(0, 0, w, h)

      // 2. Draw standard target Harmony line (vertical bar on the right zone)
      const targetX = w * 0.75
      ctx.strokeStyle = 'rgba(140, 79, 26, 0.15)'
      ctx.lineWidth = 1.5
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(targetX, 0)
      ctx.lineTo(targetX, h)
      ctx.stroke()
      ctx.setLineDash([]) // reset

      // Pulse glow on target line if notes are approaching
      ctx.shadowBlur = 0 // reset
      ctx.fillStyle = 'rgba(140, 79, 26, 0.05)'
      ctx.fillRect(targetX - 25, 0, 50, h)

      // Label for target line
      ctx.fillStyle = '#8C4F1A'
      ctx.font = 'bold 9px Outfit, system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('HARMONY ZONE', targetX, 20)

      // 3. Draw primary sound sine wave
      waveOffsetRef.current += isPlaying ? 0.03 : 0.005
      ctx.beginPath()
      ctx.strokeStyle = '#EADFD6'
      ctx.lineWidth = 2
      for (let x = 0; x < w; x++) {
        const y = h / 2 + Math.sin(x * 0.015 - waveOffsetRef.current) * 45
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Draw secondary softer aesthetic wave
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(225, 215, 203, 0.4)'
      ctx.lineWidth = 1
      for (let x = 0; x < w; x++) {
        const y = h / 2 + Math.cos(x * 0.02 - waveOffsetRef.current * 1.3) * 30
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // 4. Update & Render Nodes (notes)
      if (isPlaying) {
        // Spawn nodes periodically
        if (Math.random() < 0.012 && nodesRef.current.length < 5) {
          nodesRef.current.push({
            id: Math.random(),
            x: 0,
            y: h / 2,
            radius: 9,
            speed: Math.random() * 1.5 + 1.8,
            color: '#8C4F1A',
            pulse: 0,
            hit: false
          })
        }
      }

      nodesRef.current.forEach((node, idx) => {
        // Move note node along the wave mathematically
        node.x += node.speed
        node.y = h / 2 + Math.sin(node.x * 0.015 - waveOffsetRef.current) * 45
        node.pulse += 0.05

        // Render shadow bloom
        ctx.shadowColor = 'rgba(140, 79, 26, 0.15)'
        ctx.shadowBlur = 10

        // Soft outer beat indicator ring
        ctx.strokeStyle = 'rgba(140, 79, 26, 0.25)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius + Math.sin(node.pulse) * 4, 0, Math.PI * 2)
        ctx.stroke()

        // Inner solid vector node
        ctx.fillStyle = '#8C4F1A'
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius - 2, 0, Math.PI * 2)
        ctx.fill()

        ctx.shadowBlur = 0 // reset

        // Center dot
        ctx.fillStyle = '#FFF'
        ctx.beginPath()
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      // Remove nodes off-screen
      nodesRef.current = nodesRef.current.filter(node => {
        if (node.x > w) {
          // Missed node penalty resets streak
          if (isPlaying && !node.hit) {
            setStreak(0)
            setFeedbackText('Seeking Rhythm...')
          }
          return false
        }
        return true
      })

      // 5. Draw interactive hit feedback ripples
      ripples.forEach(rip => {
        rip.radius += 2.2
        rip.opacity -= 0.02
        ctx.strokeStyle = `rgba(140, 79, 26, ${rip.opacity})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2)
        ctx.stroke()
      })

      animRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animRef.current)
    }
  }, [isPlaying, ripples])

  // Tap handler to capture active notes
  const handleTapWorkspace = (e) => {
    if (!isPlaying) return
    initAudio()
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    
    // Get tap coordinate relative to client sizing
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    // Target Harmony Line X
    const w = rect.width
    const targetX = w * 0.75

    // Check if there are any notes inside the click threshold or near target line
    let hitSuccess = false
    let closestNode = null
    let minDistance = 9999

    nodesRef.current.forEach(node => {
      // Distance from target vertical Harmony Line
      const distanceToTarget = Math.abs(node.x - targetX)
      if (distanceToTarget < minDistance && !node.hit) {
        minDistance = distanceToTarget
        closestNode = node
      }
    })

    // If the closest node is within the trigger range of 32px of the harmony line
    if (closestNode && minDistance < 35) {
      closestNode.hit = true
      hitSuccess = true

      // Create beautiful ripple feedback
      setRipples(prev => [
        ...prev,
        { x: closestNode.x, y: closestNode.y, radius: 10, opacity: 0.8 }
      ].slice(-10))

      // Remove from nodes
      nodesRef.current = nodesRef.current.filter(n => n.id !== closestNode.id)

      // Score logic
      setScore(s => {
        const nextScore = s + 1
        if (nextScore >= 10) {
          // Finished Song of Hope!
          setIsPlaying(false)
          setGameCompleted(true)
          setStreak(0)
          setFeedbackText('Perfect Harmony!')
          handleClaimSponsorReward()
        }
        return nextScore
      })

      setStreak(st => st + 1)
      setFeedbackText('Harmony!')
      playChime(true, score)
    }

    // Play dull tone if they tapped blindly without hit
    if (!hitSuccess) {
      setStreak(0)
      setFeedbackText('Seeking Rhythm...')
      playChime(false)
    }
  }

  // Trigger sponsored contribution write on Firestore
  const handleClaimSponsorReward = async () => {
    if (!user?.uid || savingContribution) return
    setSavingContribution(true)
    try {
      // Record ₹10 matched sponsor donation in single transaction
      await addContribution(user.uid, 10, 'Baby Aarav', 'Sponsor Matched Sound Wave')
    } catch (err) {
      console.error('Error adding sponsor contribution:', err)
    } finally {
      setSavingContribution(false)
    }
  }

  const handleTogglePlay = () => {
    if (gameCompleted) {
      setScore(0)
      setStreak(0)
      setGameCompleted(false)
    }

    // Explicitly initialize/resume AudioContext on direct click gesture
    initAudio()
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }

    const nextPlaying = !isPlaying
    setIsPlaying(nextPlaying)
    setFeedbackText(nextPlaying ? 'Listen closely & tap...' : 'Session Paused')
    
    // Play a gentle welcome chime to signal start immediately!
    if (nextPlaying) {
      setTimeout(() => playChime(true, 0), 60)
    }
  }

  const handleReset = () => {
    setIsPlaying(false)
    setScore(0)
    setStreak(0)
    setGameCompleted(false)
    setFeedbackText('')
    nodesRef.current = []
    setRipples([])
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
        
        {/* Header Block with Back Link */}
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

        {/* Outer Premium Glass Card for Game Area */}
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
              
              {/* Left Column: Interactive Canvas & Visuals */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                
                {/* Floating Heart indicator */}
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

                {/* Main Interactive Canvas Area */}
                <div 
                  onClick={handleTapWorkspace}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: 260,
                    marginTop: 40,
                    background: '#FCFAF6',
                    border: '1px solid rgba(220, 208, 195, 0.6)',
                    borderRadius: '24px',
                    boxShadow: 'inset 0 4px 16px rgba(0,0,0,0.01), 0 10px 24px rgba(139, 94, 52, 0.03)',
                    cursor: isPlaying ? 'crosshair' : 'default',
                    overflow: 'hidden'
                  }}
                >
                  <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

                  {/* Play Overlay if not playing and not completed */}
                  {!isPlaying && !gameCompleted && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(253, 250, 246, 0.65)',
                      backdropFilter: 'blur(3px)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 12
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
                        <Music size={20} fill="#FFF" />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8C4F1A' }}>
                        Click Play to Harmonize
                      </span>
                    </div>
                  )}

                  {/* Floating Hit Feedback Text */}
                  {feedbackText && (
                    <div style={{
                      position: 'absolute',
                      bottom: 16,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#FFF',
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
                  )}
                </div>

                {/* Score Target status bar */}
                <div style={{ marginTop: 24, width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#8C4F1A', marginBottom: 6 }}>
                    <span>Chime Harmony progress</span>
                    <span>{score} / 10 Hits</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(235, 224, 214, 0.6)', borderRadius: 99, overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(score / 10) * 100}%` }}
                      style={{ height: '100%', background: 'linear-gradient(90deg, #EBD5C2, #8C4F1A)', borderRadius: 99 }}
                    />
                  </div>
                </div>

                {/* soundscape and toggle settings */}
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyBetween: 'space-between', justifyContent: 'space-between', width: '100%' }}>
                  <button
                    onClick={() => {
                      const nextSound = !soundEnabled
                      setSoundEnabled(nextSound)
                      if (nextSound) {
                        initAudio()
                        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                          audioContextRef.current.resume()
                        }
                        // Play a pleasant chime preview to verify sound instantly
                        setTimeout(() => playChime(true, 0), 50)
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
                    <span style={{ fontSize: 11, fontWeight: 700 }}>Chime Synthesizer</span>
                  </button>

                  {streak > 1 && (
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#47682C', background: '#F3F6F0', padding: '3px 10px', borderRadius: 99 }}>
                      🔥 {streak} Streak
                    </span>
                  )}
                </div>

              </div>

              {/* Right Column: Information, settings & presets */}
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
                        Soundscape healing
                      </span>
                    </div>

                    <h2 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: 900, color: '#4A3427', fontFamily: 'Outfit', letterSpacing: '-0.5px' }}>
                      Sound Wave Serenade
                    </h2>
                    
                    <p style={{ margin: 0, fontSize: '13.5px', color: '#7A6A5A', lineHeight: 1.6, fontWeight: 500 }}>
                      Listen to soothing sound frequencies and tap the nodes when they align with the vertical Harmony Zone. Achieve a perfect harmony of 10 hits to trigger a sponsored ₹10 treatment donation.
                    </p>
                  </div>

                  {/* Soundscape presets selection */}
                  <div style={{ marginBottom: 32 }}>
                    <h4 style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#8C4F1A' }}>
                      Choose Soundscape Theme
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {Object.entries(SOUNDSCAPES).map(([key, details]) => (
                        <div
                          key={key}
                          onClick={() => {
                            setSoundscapeKey(key)
                            // Resume audio context just in case
                            initAudio()
                            if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                              audioContextRef.current.resume()
                            }
                            // Play a nice preview chime of the new soundscape theme!
                            playChime(true, score)
                          }}
                          style={{
                            background: soundscapeKey === key ? '#FFFDFB' : 'rgba(255,255,255,0.4)',
                            border: soundscapeKey === key ? '1.5px solid #8C4F1A' : '1px solid rgba(220, 208, 195, 0.6)',
                            borderRadius: '16px',
                            padding: '12px 16px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: soundscapeKey === key ? '0 4px 12px rgba(139, 94, 52, 0.05)' : 'none'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 13.5, fontWeight: 700, color: '#4A3427' }}>
                              {details.name}
                            </span>
                            <span style={{ fontSize: 10, fontWeight: 800, color: '#8C4F1A', background: 'rgba(140, 79, 26, 0.08)', padding: '2px 8px', borderRadius: 99 }}>
                              {details.synthType} synth
                            </span>
                          </div>
                          <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#7A6A5A', lineHeight: 1.4 }}>
                            {details.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Microcopy Instruction Info Box */}
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
                      💡 Gameplay Instruction
                    </span>
                    Tap anywhere inside the wave container when a floating circular node crosses the dashed vertical HARMONY ZONE to play a chime. Missing a node resets your active multiplier streak.
                  </div>

                </div>

                {/* Bottom: Play Controls */}
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
                        <Pause size={15} /> Pause Soundscape
                      </>
                    ) : (
                      <>
                        <Play size={15} /> {score > 0 ? 'Resume Harmony' : 'Start Soundscape'}
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
          {gameCompleted && (
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
                    Chime Harmony Unlocked ✨
                  </span>

                  <h2 style={{ fontFamily: 'Outfit', fontSize: 26, fontWeight: 900, color: '#4A3427', margin: '6px 0 12px', letterSpacing: '-0.5px' }}>
                    Serenade Perfected!
                  </h2>

                  <p style={{ margin: '0 auto 24px', fontSize: '14px', color: '#7A6A5A', lineHeight: 1.6, maxWidth: 440 }}>
                    You have successfully finalized the song of hope. Your harmony has triggered a matching sponsor payment of <strong>₹10</strong> directed straight to verified hospital bills for Baby Aarav's treatment!
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
                          Sound Wave Harmony Ambassador
                        </h4>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 8, fontWeight: 900, color: '#47682C', background: '#F3F6F0', padding: '3px 8px', borderRadius: 99 }}>
                        <ShieldCheck size={10} /> SECURE AUDITED
                      </div>
                    </div>

                    {/* Certificate message text */}
                    <p style={{ margin: '0 0 16px', fontSize: 11.5, color: '#7A6A5A', lineHeight: 1.5 }}>
                      This represents verified recognition that a dedicated chime harmony session was executed, triggering a match donation towards child ICU support billing.
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
                        <RotateCcw size={13} /> Harmonize Again
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
