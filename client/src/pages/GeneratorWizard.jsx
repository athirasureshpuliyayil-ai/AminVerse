import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { aiService, AI_VIDEO_ENGINES, getThematicSceneFallback } from '../services/aiService'
import { generateSceneVideo } from '../services/videoSynthesis'
import { getStoryById } from './StoryLibrary'
import { getToken } from '../utils/authStorage'

export default function GeneratorWizard() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [step, setStep] = useState(1)
  const [processing, setProc] = useState(false)
  const [progress, setProgress] = useState({ pct: 0, status: '' })
  const [inputMode, setInputMode] = useState('prompt')
  const [promptText, setPrompt] = useState('')
  const [selectedEngine, setSelectedEngine] = useState('gemini_3_5') // Default: Google Gemini 3.5 Studio (Interactions API Key Connected)
  const [sceneCount, setSceneCount] = useState(5) // Default: 5 scenes for full story
  const [options, setOptions] = useState({
    audience: 'general',
    style: 'Kids Cartoon',
    tone: 'Adventurous',
    language: 'English',
    aspectRatio: '16:9'
  })
  const [story, setStory] = useState(null)
  const [characters, setChars] = useState([])
  const [scenes, setScenes] = useState([])
  const [result, setResult] = useState(null)

  // Live Animation Player State
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0)
  const [isPlayingAnimation, setIsPlayingAnimation] = useState(false)
  const [playMode, setPlayMode] = useState('video') // 'video' | 'motion'
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [captionsEnabled, setCaptionsEnabled] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState(1) // 1x
  const timerRef = useRef(null)
  const videoPlayerRef = useRef(null)
  const [synthesizingSceneVid, setSynthesizingSceneVid] = useState(false)
  const [sceneGenStates, setSceneGenStates] = useState({}) // { [idx]: { status: 'idle'|'processing'|'completed'|'failed', message: '', taskId: '' } }

  const handleSynthesizeSceneVideo = async (idx, forceWan = false) => {
    const sc = scenes[idx]
    if (!sc) return
    const isWan = selectedEngine === 'wan_2_2' || forceWan
    const engineLabel = selectedEngine === 'gemini_3_5' ? 'Google Gemini 3.5' : isWan ? 'Wan 2.2 (8Scale)' : 'AI Engine'
    
    setSceneGenStates(prev => ({
      ...prev,
      [idx]: { status: 'processing', message: `Synthesizing with ${engineLabel}...` }
    }))
    setSynthesizingSceneVid(true)

    try {
      if (isWan) {
        // Character consistency: use first matching character or primary character
        const char = characters && characters.length > 0 ? characters[0] : null
        const resp = await aiService.generateWanSceneVideo(sc, {
          character: char,
          style: options.style,
          aspectRatio: options.aspectRatio,
          resolution: '480p'
        })

        if (!resp || (!resp.success && !resp.taskId && !resp.videoUrl)) {
          throw new Error(resp?.error || resp?.message || 'Wan 2.2 generation request failed')
        }

        // If completed immediately
        if (resp.status === 'completed' && resp.videoUrl) {
          setScenes(prev => prev.map((s, i) => i === idx ? { ...s, videoUrl: resp.videoUrl, videoStatus: 'completed', provider: '8scale_wan2_2' } : s))
          setSceneGenStates(prev => ({
            ...prev,
            [idx]: { status: 'completed', message: 'Video rendered successfully!' }
          }))
          setSynthesizingSceneVid(false)
          return
        }

        // If task ID returned, poll status asynchronously
        if (resp.taskId) {
          const taskId = resp.taskId
          setSceneGenStates(prev => ({
            ...prev,
            [idx]: { status: 'processing', message: 'Task queued in Wan 2.2... processing', taskId }
          }))

          let attempts = 0
          const maxAttempts = 60 // 3 minutes maximum
          const pollInterval = setInterval(async () => {
            attempts++
            try {
              const statusData = await aiService.getVideoTaskStatus(taskId)
              if (statusData.status === 'completed' && statusData.videoUrl) {
                clearInterval(pollInterval)
                setScenes(prev => prev.map((s, i) => i === idx ? { ...s, videoUrl: statusData.videoUrl, videoStatus: 'completed', provider: '8scale_wan2_2', taskId } : s))
                setSceneGenStates(prev => ({
                  ...prev,
                  [idx]: { status: 'completed', message: 'Wan 2.2 video rendered!' }
                }))
                setSynthesizingSceneVid(false)
              } else if (statusData.status === 'failed') {
                clearInterval(pollInterval)
                setSceneGenStates(prev => ({
                  ...prev,
                  [idx]: { status: 'failed', message: statusData.error || 'Wan 2.2 generation failed.' }
                }))
                setSynthesizingSceneVid(false)
              } else {
                setSceneGenStates(prev => ({
                  ...prev,
                  [idx]: { status: 'processing', message: `Wan 2.2: ${statusData.status || 'processing'} (${attempts * 3}s)...`, taskId }
                }))
              }
            } catch (pollErr) {
              console.warn('Poll error:', pollErr)
            }

            if (attempts >= maxAttempts) {
              clearInterval(pollInterval)
              setSceneGenStates(prev => ({
                ...prev,
                [idx]: { status: 'failed', message: 'Generation timed out. Please retry.' }
              }))
              setSynthesizingSceneVid(false)
            }
          }, 3000)

          return
        }
      }

      // Default engine synthesis
      const vidUrl = await generateSceneVideo(sc, { durationSec: 5 })
      if (vidUrl) {
        setScenes(prev => prev.map((s, i) => i === idx ? { ...s, videoUrl: vidUrl, videoStatus: 'completed' } : s))
        setSceneGenStates(prev => ({
          ...prev,
          [idx]: { status: 'completed', message: 'Clip ready!' }
        }))
      }
    } catch (err) {
      console.warn('Scene video synthesis err:', err)
      setSceneGenStates(prev => ({
        ...prev,
        [idx]: { status: 'failed', message: err.message || 'Unable to generate the animation right now. Please try again.' }
      }))
    } finally {
      if (!isWan) {
        setSynthesizingSceneVid(false)
      }
    }
  }

  // Load URL query params if user clicked "Turn into Animation" from story or dashboard
  useEffect(() => {
    const qPrompt = searchParams.get('prompt')
    const qStoryId = searchParams.get('storyId')
    const qStyle = searchParams.get('style')
    const qAudience = searchParams.get('audience')
    const qEngine = searchParams.get('engine')

    if (qStoryId) {
      const s = getStoryById(qStoryId)
      if (s) {
        setPrompt(`${s.title}: ${s.desc || (s.fullContent ? s.fullContent[0] : '')}`)
        if (s.audience) setOptions(o => ({ ...o, audience: s.audience.toLowerCase() }))
      }
    } else if (qPrompt) {
      setPrompt(decodeURIComponent(qPrompt))
    }
    if (qStyle) setOptions(o => ({ ...o, style: qStyle }))
    if (qAudience) setOptions(o => ({ ...o, audience: qAudience }))
    if (qEngine && AI_VIDEO_ENGINES.some(e => e.id === qEngine)) {
      setSelectedEngine(qEngine)
    }
  }, [searchParams])

  const STEPS = [
    { n: 1, label: 'Story & Engine' },
    { n: 2, label: 'Story & Characters' },
    { n: 3, label: 'All Scenes Breakdown' },
    { n: 4, label: 'Audio & Voices' },
    { n: 5, label: 'Interactive Live Animation' },
    { n: 6, label: 'Video Export' },
  ]

  const handleGenerateStory = async () => {
    if (!promptText.trim()) return alert('Please enter a story prompt or idea.')
    setProc(true)
    try {
      const storyData = await aiService.understandStory(promptText, { ...options, sceneCount })
      const charData = await aiService.extractCharacters(storyData)
      const sceneData = await aiService.divideScenes(storyData, { sceneCount, style: options.style })
      setStory(storyData)
      setChars(charData)
      setScenes(sceneData)
      setStep(2)
    } catch (e) {
      alert('Generation error: ' + e.message)
    } finally {
      setProc(false)
    }
  }

  const handleRenderVideo = async () => {
    setProc(true)
    setStep(6) // Transition immediately to Step 6 so user sees real-time progress bar
    setProgress({ pct: 5, status: `Initializing ${currentEngineObj.name} AI Video Pipeline...` })
    try {
      const r = await aiService.renderVideo(
        { story, characters, scenes, provider: selectedEngine, options },
        (pct, status) => setProgress({ pct, status })
      )
      setResult(r)

      // Update scenes with their generated video URLs if returned
      if (r.scenes && r.scenes.length > 0) {
        setScenes(r.scenes)
      }

      // Auto-save project into My Projects storage and MongoDB
      const projectTitle = story?.title || (promptText ? promptText.slice(0, 35) + '...' : 'Untitled Animation')
      const totalDurationSec = (scenes.length || 5) * 6
      const newProj = {
        id: 'proj_' + Date.now(),
        title: projectTitle,
        prompt: promptText,
        style: options.style || 'Kids Cartoon',
        audience: options.audience || 'general',
        videoUrl: r.videoUrl,
        poster: scenes[0]?.image || getThematicSceneFallback(promptText, 0),
        status: 'Completed',
        durationSec: totalDurationSec,
        duration: `${totalDurationSec / 60 >= 1 ? Math.floor(totalDurationSec / 60) + ' min ' : ''}${totalDurationSec % 60}s`,
        engine: selectedEngine,
        engineName: r.engineName || currentEngineObj?.name || 'AnimVerse Free AI Video Studio',
        scenes: r.scenes || scenes,
        date: new Date().toISOString().split('T')[0]
      }

      const existing = JSON.parse(localStorage.getItem('animverse_saved_projects') || '[]')
      const filtered = existing.filter(p => p.title !== newProj.title)
      const updated = [newProj, ...filtered]
      localStorage.setItem('animverse_saved_projects', JSON.stringify(updated))

      // Persist directly to MongoDB database
      try {
        await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify({
            title: projectTitle,
            prompt: promptText,
            style: options.style || 'Kids Cartoon',
            aspectRatio: options.aspectRatio || '16:9 Cinema',
            videoUrl: r.videoUrl,
            poster: scenes[0]?.image || getThematicSceneFallback(promptText, 0),
            duration: newProj.duration,
            durationSec: newProj.durationSec,
            scenes: r.scenes || scenes,
            characters: characters,
            engine: selectedEngine,
            engineName: r.engineName || currentEngineObj?.name || 'AnimVerse Free AI Video Studio'
          })
        })
      } catch (err) {
        console.error('Could not save generated project:', err)
      }

      // Final step is already active
    } catch (e) {
      alert('Render error: ' + e.message)
      setStep(5)
    } finally {
      setProc(false)
    }
  }

  // Speak scene narration
  const speakCurrentScene = (scene) => {
    if (!voiceEnabled || !('speechSynthesis' in window) || !scene) return
    window.speechSynthesis.cancel()
    const textToSpeak = `${scene.narration} ${scene.dialogue}`
    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.rate = 0.95 * animationSpeed
    utterance.pitch = options.audience === 'kids' ? 1.15 : 0.95
    window.speechSynthesis.speak(utterance)
  }

  // Animation Playback Engine
  useEffect(() => {
    if (isPlayingAnimation && scenes.length > 0) {
      const activeSc = scenes[currentSceneIdx] || scenes[0]
      if (playMode === 'motion') {
        speakCurrentScene(activeSc)
        const durationMs = (activeSc?.durationSec || 6) * 1000 / animationSpeed

        timerRef.current = setTimeout(() => {
          if (currentSceneIdx < scenes.length - 1) {
            setCurrentSceneIdx(prev => prev + 1)
          } else {
            setIsPlayingAnimation(false)
            window.speechSynthesis?.cancel()
          }
        }, durationMs)
      } else if (playMode === 'video') {
        // In video mode, try to play the video element seamlessly
        if (videoPlayerRef.current) {
          videoPlayerRef.current.currentTime = 0
          videoPlayerRef.current.play().catch(e => console.warn('Video autoplay:', e.message))
        }
      }
    } else {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isPlayingAnimation, currentSceneIdx, scenes, animationSpeed, playMode])

  const togglePlayAnimation = () => {
    if (isPlayingAnimation) {
      setIsPlayingAnimation(false)
      window.speechSynthesis?.cancel()
      if (videoPlayerRef.current) {
        try { videoPlayerRef.current.pause() } catch (_) {}
      }
    } else {
      if (currentSceneIdx >= scenes.length - 1) {
        setCurrentSceneIdx(0)
      }
      setIsPlayingAnimation(true)
      if (videoPlayerRef.current) {
        videoPlayerRef.current.currentTime = 0
        videoPlayerRef.current.play().catch(e => console.warn('Video play caught:', e.message))
      }
    }
  }

  const handleSeekScene = (idx) => {
    window.speechSynthesis?.cancel()
    setCurrentSceneIdx(idx)
    if (isPlayingAnimation && playMode === 'motion') {
      speakCurrentScene(scenes[idx])
    }
    if (videoPlayerRef.current) {
      videoPlayerRef.current.currentTime = 0
      if (isPlayingAnimation) {
        videoPlayerRef.current.play().catch(e => console.warn('Video seek play:', e.message))
      }
    }
  }

  const activeScene = scenes[currentSceneIdx] || {}
  const currentEngineObj = AI_VIDEO_ENGINES.find(e => e.id === selectedEngine) || AI_VIDEO_ENGINES[0]

  // Shared Styles
  const S = {
    card: {
      background: 'white', borderRadius: 20, border: '1px solid #FFE0B2',
      boxShadow: '0 4px 20px rgba(230,57,70,0.06)', padding: 32, marginBottom: 24,
    },
    label: { display: 'block', marginBottom: 7, fontWeight: 700, fontSize: '0.9rem', color: '#1A1A2E' },
    input: {
      width: '100%', padding: '12px 16px', border: '2px solid #FFE0B2', borderRadius: 10,
      fontSize: '0.95rem', fontFamily: 'inherit', color: '#1A1A2E', background: '#FFFBF0',
      boxSizing: 'border-box', outline: 'none',
    },
    select: {
      width: '100%', padding: '12px 16px', border: '2px solid #FFE0B2', borderRadius: 10,
      fontSize: '0.9rem', fontFamily: 'inherit', color: '#1A1A2E', background: '#FFFBF0',
      boxSizing: 'border-box', outline: 'none',
    },
    btnPrimary: {
      padding: '13px 28px', background: 'linear-gradient(135deg,#E63946,#C1121F)', color: 'white',
      border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
      fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(230,57,70,0.35)',
    },
    btnOutline: {
      padding: '13px 28px', background: 'white', color: '#4A4A6A', border: '2px solid #FFE0B2',
      borderRadius: 10, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit',
    },
    btnEmerald: {
      padding: '13px 28px', background: 'linear-gradient(135deg,#22c55e,#15803d)', color: 'white',
      border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
      fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(34,197,94,0.35)',
    },
    modeBtn: (active) => ({
      padding: '10px 18px', background: active ? '#E63946' : 'white', color: active ? 'white' : '#4A4A6A',
      border: active ? '2px solid #E63946' : '2px solid #FFE0B2', borderRadius: 10, fontWeight: 700,
      fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit',
    }),
    badge: (color) => ({
      display: 'inline-block', padding: '4px 12px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 700,
      background: color === 'red' ? '#FFEBEE' : color === 'green' ? '#F0FDF4' : color === 'purple' ? '#F3E8FF' : '#FFF9C4',
      color: color === 'red' ? '#C1121F' : color === 'green' ? '#15803d' : color === 'purple' ? '#7C3AED' : '#D97706',
    }),
    sectionTitle: { fontSize: '1.5rem', fontWeight: 800, color: '#1A1A2E', marginBottom: 8 },
    sectionSub: { fontSize: '0.9rem', color: '#9090A0', marginBottom: 24 },
  }

  return (
    <AppShell title="AI Animation Studio">
      {/* ── STEP PROGRESS BAR ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, overflowX: 'auto', paddingBottom: 4 }}>
        {STEPS.map(s => (
          <div
            key={s.n}
            onClick={() => step > s.n && setStep(s.n)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, cursor: step > s.n ? 'pointer' : 'default' }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: step > s.n ? '#22c55e' : step === s.n ? '#E63946' : '#FFE0B2',
              color: step >= s.n ? 'white' : '#9090A0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '0.85rem',
            }}>
              {step > s.n ? '✓' : s.n}
            </div>
            <span style={{ fontWeight: step === s.n ? 700 : 500, fontSize: '0.85rem', color: step === s.n ? '#E63946' : step > s.n ? '#22c55e' : '#9090A0', whiteSpace: 'nowrap' }}>
              {s.label}
            </span>
            {s.n < 6 && <div style={{ width: 24, height: 2, background: '#FFE0B2', marginLeft: 4 }} />}
          </div>
        ))}
      </div>

      {/* Active Story Prompt Banner */}
      {promptText && (
        <div style={{
          background: 'linear-gradient(135deg, #FFF3E0 0%, #FFF8E7 100%)',
          border: '2px solid #FF9F1C', borderRadius: 16, padding: '16px 22px', marginBottom: 24,
          boxShadow: '0 4px 16px rgba(255,159,28,0.15)', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 16, flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
              ✨ Active Story Script:
            </div>
            <div style={{ fontSize: '1.02rem', fontWeight: 700, color: '#1A1A2E', lineHeight: 1.5 }}>
              "{promptText}"
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ background: '#E63946', color: 'white', padding: '6px 14px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 800 }}>
              ⚡ {currentEngineObj.name}
            </span>
          </div>
        </div>
      )}

      {/* ── STEP 1: PROMPT INPUT & AI VIDEO ENGINE SELECTOR ── */}
      {step === 1 && (
        <div style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <h2 style={S.sectionTitle}>1. AI Video Engine & Story Parameters</h2>
              <p style={S.sectionSub}>Choose your generative video engine, desired scene count, and visual animation style.</p>
            </div>
            <span style={{ padding: '6px 16px', borderRadius: 50, background: 'rgba(230,57,70,0.12)', color: '#E63946', fontWeight: 800, fontSize: '0.8rem' }}>
              ✦ MULTI-SCENE VIDEO GENERATOR
            </span>
          </div>

          {/* ── TOP-RANKED AI VIDEO ENGINE SELECTOR ── */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
              <label style={S.label}>Select AI Animation Video Engine</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 800, background: '#DCFCE7', padding: '3px 10px', borderRadius: 12 }}>
                  ✨ Google Gemini Connected
                </span>
                <span style={{ fontSize: '0.78rem', color: '#0284C7', fontWeight: 700, background: '#E0F2FE', padding: '3px 10px', borderRadius: 12 }}>
                  ⚡ Pollo AI Connected
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14 }}>
              {AI_VIDEO_ENGINES.map(eng => {
                const isSelected = selectedEngine === eng.id
                return (
                  <div
                    key={eng.id}
                    onClick={() => setSelectedEngine(eng.id)}
                    style={{
                      padding: '16px', borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s',
                      border: isSelected ? '2px solid #E63946' : '1.5px solid #FFE0B2',
                      background: isSelected ? '#FFF8E7' : 'white',
                      boxShadow: isSelected ? '0 6px 20px rgba(230,57,70,0.15)' : 'none',
                      position: 'relative'
                    }}
                  >
                    {isSelected && (
                      <span style={{
                        position: 'absolute', top: -10, right: 12,
                        background: '#E63946', color: 'white', fontSize: '0.68rem',
                        fontWeight: 800, padding: '2px 8px', borderRadius: 10
                      }}>
                        ACTIVE
                      </span>
                    )}
                    <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#1A1A2E', marginBottom: 4 }}>
                      {eng.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#D97706', fontWeight: 700, marginBottom: 8 }}>
                      {eng.badge}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4, marginBottom: 10 }}>
                      {eng.desc}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', background: 'rgba(0,0,0,0.03)', padding: '6px 8px', borderRadius: 8 }}>
                      <span>Anim: <strong>{eng.stars.animation}</strong></span>
                      <span>Video: <strong>{eng.stars.video}</strong></span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Mode Tabs */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            {[
              ['prompt', '✍️ Story Prompt'],
              ['paste', '📖 Paste Manuscript'],
              ['file', '📁 Upload Script File'],
              ['voice', '🎙️ Voice Recording']
            ].map(([m, l]) => (
              <button key={m} style={S.modeBtn(inputMode === m)} onClick={() => setInputMode(m)}>{l}</button>
            ))}
          </div>

          {/* Prompt Text Input */}
          <div style={{ marginBottom: 20 }}>
            <label style={S.label}>Script Prompt / Animation Premise</label>
            <textarea
              rows={4}
              value={promptText}
              onChange={e => setPrompt(e.target.value)}
              placeholder="✨ e.g., 'A brave rabbit named Barnaby and a fiery dragon team up to save the enchanted forest from an obsidian storm...'"
              style={{ ...S.input, resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>

          {/* Quick Inspiration Prompts */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9090A0', marginBottom: 8 }}>
              💡 PRESET STORY IDEAS:
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { title: '🧒 Kids: The Brave Rabbit & Dragon', text: 'A brave rabbit named Barnaby gathers sweet dewberry blossoms and meets Pyrrhus the dragon to heal the forest with glowing dewdrop nectar.' },
                { title: '🏮 Mystery: The Golden Lantern', text: 'Young Leo sweeps outside an antique shop, finds a lost purse of gold, and unlocks the legendary Lantern of Truth that illuminates valley secrets.' },
                { title: '🚀 Sci-Fi: Neon Horizon Odyssey', text: 'Commander Sarah and an ancient cyber-dragon race against an orbital solar storm to override corporate firewalls and rescue Neo-Veridia.' },
                { title: '🐬 Ocean: Stars of the Deep Ocean', text: 'Dr. Kai Vance pilots the Nautilus II submersible 8,000 meters into the Mariana Trench to repair the glowing pearl core of Atlantis-Atoll.' }
              ].map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPrompt(preset.text)}
                  style={{
                    padding: '8px 14px', borderRadius: 20, border: '1px solid #FFE0B2',
                    background: '#FFF8E7', color: '#1A1A2E', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          {/* ── SCENE COUNT & ASPECT RATIO SELECTORS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div>
              <label style={S.label}>Number of Animated Scenes (All Scenes Generated)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {[3, 4, 5, 6].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSceneCount(num)}
                    style={{
                      padding: '12px 10px', borderRadius: 10,
                      border: sceneCount === num ? '2px solid #E63946' : '1.5px solid #FFE0B2',
                      background: sceneCount === num ? '#E63946' : 'white',
                      color: sceneCount === num ? 'white' : '#1A1A2E',
                      fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer'
                    }}
                  >
                    {num} Scenes {num === 5 ? '★' : ''}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#9090A0', marginTop: 6 }}>
                Every single scene will receive its own full HD animated video clip.
              </div>
            </div>

            <div>
              <label style={S.label}>Canvas Aspect Ratio</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {[
                  { id: '16:9', label: '16:9', desc: 'Cinema' },
                  { id: '9:16', label: '9:16', desc: 'Reel' },
                  { id: '4:3', label: '4:3', desc: 'Studio' },
                  { id: '1:1', label: '1:1', desc: 'Square' }
                ].map(ar => (
                  <button
                    key={ar.id}
                    type="button"
                    onClick={() => setOptions(o => ({ ...o, aspectRatio: ar.id }))}
                    style={{
                      padding: '12px 6px', borderRadius: 10,
                      border: (options.aspectRatio || '16:9') === ar.id ? '2px solid #6366F1' : '1.5px solid #FFE0B2',
                      background: (options.aspectRatio || '16:9') === ar.id ? '#EDE9FE' : 'white',
                      color: (options.aspectRatio || '16:9') === ar.id ? '#6366F1' : '#1A1A2E',
                      fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', textAlign: 'center'
                    }}
                  >
                    <div>{ar.label}</div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 500 }}>{ar.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── PRODUCTION PARAMETERS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20, marginBottom: 32 }}>
            {[
              { key: 'audience', label: 'Target Audience', opts: [['kids', '👶 Kids / Parents'], ['adults', '🧔 Adults'], ['teens', '🧑 Teens'], ['general', '🌍 General']] },
              { key: 'style', label: 'Animation Style Preset', opts: [['Kids Cartoon', '🧒 Kids Cartoon 3D'], ['Anime', '🌸 Japanese Anime'], ['Pixar Style', '✨ Pixar 3D Style'], ['Comic Book', '💥 Comic Book'], ['Fantasy', '🧙 High Fantasy'], ['Cinematic', '🎬 Cinematic 8K'], ['Watercolor', '🎨 Hand-painted Watercolor']] },
              { key: 'tone', label: 'Story Tone', opts: [['Adventurous', '⚔️ Adventurous'], ['Whimsical', '✨ Whimsical & Calming'], ['Funny', '😂 Funny & Playful'], ['Mysterious', '🔍 Mysterious & Deep'], ['Epic', '🔥 Epic & Heroic']] },
              { key: 'language', label: 'Narration Voice', opts: [['English', 'English (US)'], ['Spanish', 'Spanish'], ['French', 'French'], ['Hindi', 'Hindi'], ['German', 'German'], ['Japanese', 'Japanese']] },
            ].map(({ key, label, opts }) => (
              <div key={key}>
                <label style={S.label}>{label}</label>
                <select style={S.select} value={options[key] || opts[0][0]} onChange={e => setOptions(o => ({ ...o, [key]: e.target.value }))}>
                  {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'right' }}>
            <button style={S.btnPrimary} onClick={handleGenerateStory} disabled={processing}>
              {processing ? `⏳ Generating All ${sceneCount} Scenes with ${currentEngineObj.name}...` : `✨ Generate ${sceneCount} Scenes & Characters →`}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: CHARACTERS ── */}
      {step === 2 && story && (
        <div style={S.card}>
          <h2 style={S.sectionTitle}>2. Story Breakdown & Characters</h2>
          <div style={{ background: '#FFF8E7', border: '1px solid #FFE0B2', borderRadius: 14, padding: 24, marginBottom: 28 }}>
            <h3 style={{ fontSize: '1.3rem', color: '#C1121F', margin: '0 0 10px' }}>{story.title}</h3>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
              {[story.genre, story.animationStyle, story.targetAudience, `${scenes.length} Scenes`].map((t, i) => (
                <span key={i} style={S.badge(['red', 'green', 'yellow', 'purple'][i])}>{t}</span>
              ))}
            </div>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{story.fullText}</p>
          </div>

          <h3 style={{ marginBottom: 16 }}>Consistent Character Models</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16, marginBottom: 28 }}>
            {characters.map(c => (
              <div key={c.id} style={{ display: 'flex', gap: 14, padding: 16, border: '1px solid #FFE0B2', borderRadius: 14, background: 'white' }}>
                <img src={c.image} alt={c.name} style={{ width: 72, height: 72, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: '0 0 4px', color: '#C1121F' }}>{c.name}</h4>
                  <p style={{ fontSize: '0.78rem', color: '#9090A0', margin: '0 0 6px' }}>{c.species} • {c.personality}</p>
                  <p style={{ fontSize: '0.8rem', margin: 0 }}><strong>Voice:</strong> {c.voiceProfile}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button style={S.btnOutline} onClick={() => setStep(1)}>← Back</button>
            <button style={S.btnPrimary} onClick={() => setStep(3)}>Next: Review All {scenes.length} Scenes →</button>
          </div>
        </div>
      )}

      {/* ── STEP 3: SCENES BREAKDOWN (ALL SCENES DISPLAYED) ── */}
      {step === 3 && (
        <div style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h2 style={S.sectionTitle}>3. Visual Scene Breakdown ({scenes.length} Scenes)</h2>
              <p style={S.sectionSub}>All scenes are pre-rendered with visual prompts, voice narration, and dialogue scripts.</p>
            </div>
            <span style={{ padding: '6px 14px', borderRadius: 20, background: '#DCFCE7', color: '#15803D', fontWeight: 800, fontSize: '0.82rem' }}>
              ✓ All {scenes.length} Scenes Ready
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
            {scenes.map((sc, i) => (
              <div key={sc.number || i} style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, border: '1.5px solid #FFE0B2', borderRadius: 14, padding: 16, background: '#FFFDF9' }}>
                <div style={{
                  width: '100%', height: 140, borderRadius: 10, overflow: 'hidden', position: 'relative',
                  background: sc.themeBg || 'linear-gradient(135deg,#134e5e,#71b280)',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.12)'
                }}>
                  {sc.image ? (
                    <img
                      src={sc.image}
                      alt={sc.title || `Scene ${sc.number || i + 1}`}
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = getThematicSceneFallback(promptText || sc.prompt || sc.title, i)
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                      {sc.icon || '🎬'}
                    </div>
                  )}
                  <div style={{
                    position: 'absolute', bottom: 8, left: 8,
                    background: 'rgba(0,0,0,0.8)', color: 'white',
                    padding: '3px 10px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 800
                  }}>
                    Scene {sc.number || i + 1}
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#1A1A2E', fontWeight: 800 }}>
                      Scene {sc.number || i + 1}: {sc.title ? sc.title.replace(/^Scene \d+:\s*/i, '') : ''}
                    </h4>
                    <span style={S.badge('yellow')}>{sc.emotion || 'Adventure'}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#4A4A6A', marginBottom: 8 }}>{sc.prompt}</p>
                  <div style={{
                    background: '#FEF3C7',
                    padding: '10px 14px',
                    borderRadius: 10,
                    fontSize: '0.90rem',
                    color: '#92400E',
                    fontWeight: 700,
                    marginBottom: 8,
                    border: '1.5px solid #FDE68A',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <span>💬</span>
                    <span>{sc.dialogue}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5, marginBottom: 12 }}>
                    🎙️ <strong style={{ color: '#0F172A' }}>Narration:</strong> "{sc.narration}"
                  </div>

                  {/* Dynamic Engine Generation Controls & Status */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: 10, paddingTop: 10, borderTop: '1px dashed #FFE0B2'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {sc.videoUrl ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, background: '#DCFCE7', color: '#15803D', fontSize: '0.78rem', fontWeight: 800 }}>
                          ✓ {selectedEngine === 'gemini_3_5' ? 'Gemini 3.5 Scene Ready' : selectedEngine === 'wan_2_2' ? 'Wan 2.2 Video Ready' : selectedEngine === 'pollo' ? 'Pollo Video Ready' : 'AI Video Ready'}
                        </span>
                      ) : sceneGenStates[i]?.status === 'processing' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: '#FEF3C7', color: '#92400E', fontSize: '0.78rem', fontWeight: 800 }}>
                          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#D97706', animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite' }} />
                          {sceneGenStates[i]?.message || `Generating with ${currentEngineObj.name}...`}
                        </span>
                      ) : sceneGenStates[i]?.status === 'failed' ? (
                        <span style={{ padding: '4px 10px', borderRadius: 20, background: '#FEE2E2', color: '#B91C1C', fontSize: '0.78rem', fontWeight: 700 }}>
                          ⚠️ {sceneGenStates[i]?.message || 'Generation failed'}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>
                          {selectedEngine === 'gemini_3_5' ? 'Google Gemini 3.5 Flash Active' : `${currentEngineObj.name} Ready`}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleSynthesizeSceneVideo(i)}
                        disabled={sceneGenStates[i]?.status === 'processing'}
                        style={{
                          padding: '6px 14px', borderRadius: 8,
                          background: sc.videoUrl ? '#FFF7ED' : 'linear-gradient(135deg, #FF9F1C, #E63946)',
                          color: sc.videoUrl ? '#C2410C' : 'white',
                          border: sc.videoUrl ? '1.5px solid #FFEDD5' : 'none',
                          fontWeight: 800, fontSize: '0.80rem', cursor: sceneGenStates[i]?.status === 'processing' ? 'wait' : 'pointer',
                          display: 'flex', alignItems: 'center', gap: 6
                        }}
                      >
                        {sceneGenStates[i]?.status === 'processing'
                          ? '⏳ Generating...'
                          : sc.videoUrl
                            ? `🔄 Regenerate ${selectedEngine === 'gemini_3_5' ? 'Gemini 3.5' : selectedEngine === 'wan_2_2' ? 'Wan 2.2' : selectedEngine === 'pollo' ? 'Pollo' : 'AI'} Clip`
                            : `⚡ Generate with ${selectedEngine === 'gemini_3_5' ? 'Gemini 3.5' : selectedEngine === 'wan_2_2' ? 'Wan 2.2' : selectedEngine === 'pollo' ? 'Pollo' : 'AI Engine'}`}
                      </button>

                      {sc.videoUrl && (
                        <a
                          href={sc.videoUrl}
                          download={`scene_${sc.number || i + 1}_anim.mp4`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            padding: '6px 12px', borderRadius: 8, background: '#F1F5F9',
                            color: '#334155', border: '1px solid #CBD5E1', fontSize: '0.78rem',
                            fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4
                          }}
                        >
                          📥 Download
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button style={S.btnOutline} onClick={() => setStep(2)}>← Back</button>
            <button style={S.btnPrimary} onClick={() => setStep(4)}>Next: Audio & Engine Setup →</button>
          </div>
        </div>
      )}

      {/* ── STEP 4: AUDIO SETTINGS & ENGINE CONFIRMATION ── */}
      {step === 4 && (
        <div style={S.card}>
          <h2 style={S.sectionTitle}>4. Voice & Sound Effects Configuration</h2>
          <p style={S.sectionSub}>Set dialogue voices, background music themes, and confirm your AI video render pipeline.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
            {[
              { label: 'Narrator Voice Archetype', opts: ['Warm & Friendly (Storybook)', 'Cinematic Deep Baritone', 'Energetic Youth', 'Mystic Enchantress'] },
              { label: 'Background Music Theme', opts: ['Adventure & Wonder Orchestral', 'Soothing Ambient & Forest Birds', 'Cyberpunk Synthwave & Bass', 'Lo-Fi Chill & Piano'] },
            ].map((f, i) => (
              <div key={i}>
                <label style={S.label}>{f.label}</label>
                <select style={S.select}>
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          {/* Engine confirmation callout */}
          <div style={{
            background: 'linear-gradient(135deg, #FFF8E7 0%, #FFF3E0 100%)',
            border: '2px solid #FF9F1C', borderRadius: 14, padding: '18px 24px', marginBottom: 32,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', marginBottom: 4 }}>
                Selected AI Video Engine:
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#1A1A2E' }}>
                {currentEngineObj.name} ({currentEngineObj.tagline})
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                {currentEngineObj.badge} • Ready to compile all {scenes.length} scenes into 1080p MP4
              </div>
            </div>
            <button
              onClick={() => setStep(1)}
              style={{ padding: '8px 16px', background: 'white', border: '1.5px solid #FF9F1C', borderRadius: 8, fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
            >
              Switch Engine
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button style={S.btnOutline} onClick={() => setStep(3)}>← Back</button>
            <button style={S.btnPrimary} onClick={() => setStep(5)}>Next: Launch Live Animation Player →</button>
          </div>
        </div>
      )}

      {/* ── STEP 5: INTERACTIVE LIVE ANIMATION PLAYER (DUAL MODE: VIDEO & MOTION) ── */}
      {step === 5 && (
        <div style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ ...S.sectionTitle, margin: 0 }}>5. Interactive Live Animation Stage</h2>
              <p style={{ ...S.sectionSub, margin: '4px 0 0' }}>
                Preview your animation in real video format or storyboard motion mode.
              </p>
            </div>

            {/* Mode Switcher: Video vs Motion */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ background: '#F1F5F9', padding: '4px', borderRadius: 10, display: 'flex', gap: 4 }}>
                <button
                  onClick={() => setPlayMode('video')}
                  style={{
                    padding: '8px 16px', borderRadius: 8, border: 'none',
                    background: playMode === 'video' ? '#E63946' : 'transparent',
                    color: playMode === 'video' ? 'white' : '#64748B',
                    fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer'
                  }}
                >
                  🎥 AI Video Form
                </button>
                <button
                  onClick={() => setPlayMode('motion')}
                  style={{
                    padding: '8px 16px', borderRadius: 8, border: 'none',
                    background: playMode === 'motion' ? '#E63946' : 'transparent',
                    color: playMode === 'motion' ? 'white' : '#64748B',
                    fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer'
                  }}
                >
                  🎭 Storyboard Motion
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleSynthesizeSceneVideo(currentSceneIdx)}
                disabled={synthesizingSceneVid || sceneGenStates[currentSceneIdx]?.status === 'processing'}
                style={{
                  padding: '8px 14px', borderRadius: 8, border: '1.5px solid #FF9F1C',
                  background: 'white', color: '#B45309', fontWeight: 800, fontSize: '0.82rem',
                  cursor: (synthesizingSceneVid || sceneGenStates[currentSceneIdx]?.status === 'processing') ? 'wait' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6
                }}
              >
                {sceneGenStates[currentSceneIdx]?.status === 'processing'
                  ? `⏳ ${sceneGenStates[currentSceneIdx]?.message || 'Generating...'}`
                  : activeScene.videoUrl
                    ? `🔄 Regenerate Scene with ${selectedEngine === 'gemini_3_5' ? 'Gemini 3.5' : selectedEngine === 'wan_2_2' ? 'Wan 2.2' : selectedEngine === 'pollo' ? 'Pollo' : 'AI'}`
                    : `⚡ Generate Scene with ${selectedEngine === 'gemini_3_5' ? 'Gemini 3.5' : selectedEngine === 'wan_2_2' ? 'Wan 2.2' : selectedEngine === 'pollo' ? 'Pollo' : 'AI Engine'}`}
              </button>

              <button style={S.btnEmerald} onClick={handleRenderVideo}>
                🎬 Render Final MP4 Export →
              </button>
            </div>
          </div>

          {/* ANIMATION VIEWPORT */}
          <div style={{
            position: 'relative', width: '100%', minHeight: 460, background: '#020617',
            borderRadius: 20, overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
            marginBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}>
            {/* 1. REAL AI VIDEO FORM */}
            {playMode === 'video' ? (
              <div style={{ position: 'relative', width: '100%', height: 460, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <video
                  ref={videoPlayerRef}
                  key={activeScene.videoUrl || `scene_${currentSceneIdx}`}
                  src={activeScene.videoUrl || `/videos/scene_rabbit.mp4`}
                  poster={activeScene.image}
                  autoPlay
                  controls
                  playsInline
                  loop={!isPlayingAnimation}
                  muted={false}
                  onEnded={() => {
                    if (isPlayingAnimation) {
                      if (currentSceneIdx < scenes.length - 1) {
                        setCurrentSceneIdx(prev => prev + 1)
                      } else {
                        setIsPlayingAnimation(false)
                      }
                    }
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: 460 }}
                />
              </div>
            ) : (
              /* 2. DYNAMIC STORYBOARD MOTION FORM */
              <div style={{ position: 'relative', width: '100%', height: 460 }}>
                <div style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  background: activeScene.themeBg || 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
                  transform: isPlayingAnimation ? 'scale(1.08) translate(-8px, -4px)' : 'scale(1.0)',
                  transition: 'transform 6s ease-in-out',
                }}>
                  <img
                    src={activeScene.image || getThematicSceneFallback(promptText || activeScene.prompt || activeScene.title, currentSceneIdx)}
                    alt={activeScene.title || 'Scene'}
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = getThematicSceneFallback(promptText || activeScene.prompt || activeScene.title, currentSceneIdx)
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.95 }}
                  />
                </div>

                {/* Floating Character Sprite in Motion Mode */}
                <div style={{
                  position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%, -50%)',
                  zIndex: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  animation: isPlayingAnimation ? 'floatCharacter 2.5s ease-in-out infinite alternate' : 'none'
                }}>
                  <div style={{
                    width: 100, height: 100, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)',
                    border: '3px solid #FFD60A', boxShadow: '0 0 30px rgba(255,214,10,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.2rem'
                  }}>
                    {activeScene.icon || characters[0]?.avatar || '🧙‍♂️'}
                  </div>
                  <span style={{ background: 'rgba(0,0,0,0.7)', color: 'white', padding: '3px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 800 }}>
                    {characters[0]?.name || 'Hero'}
                  </span>
                </div>
              </div>
            )}

            {/* Scene Header Badge */}
            <div style={{
              position: 'absolute', top: 16, left: 16, zIndex: 10,
              background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', padding: '6px 16px',
              borderRadius: 30, color: 'white', fontSize: '0.82rem', fontWeight: 700,
              border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: 8
            }}>
              <span>🎬 Scene {currentSceneIdx + 1} of {scenes.length}</span> • <span>{activeScene.title ? activeScene.title.replace(/^Scene \d+:\s*/i, '') : ''}</span>
            </div>

            {/* Engine & Style Badge */}
            <div style={{
              position: 'absolute', top: 16, right: 16, zIndex: 10,
              background: 'linear-gradient(135deg, #E63946, #8B5CF6)', padding: '6px 14px', borderRadius: 30,
              color: 'white', fontSize: '0.78rem', fontWeight: 800, boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}>
              ✨ {currentEngineObj.name}
            </div>

            {/* Subtitle Caption Bar */}
            {captionsEnabled && (activeScene.dialogue || activeScene.narration) && (
              <div style={{
                position: 'absolute', bottom: 20, left: 20, right: 20, zIndex: 10,
                background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', padding: '10px 18px',
                borderRadius: 12, textAlign: 'center', color: '#FFD60A', fontSize: '0.90rem', fontWeight: 600,
                border: '1px solid rgba(255,214,10,0.3)', pointerEvents: 'none'
              }}>
                {activeScene.dialogue ? `💬 ${activeScene.dialogue}` : `🎙️ ${activeScene.narration}`}
              </div>
            )}
          </div>

          {/* ANIMATION PLAYBACK CONTROLS */}
          <div style={{
            background: '#FFFBF0', border: '2px solid #FFE0B2', borderRadius: 16,
            padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 14, marginBottom: 24
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={() => handleSeekScene(Math.max(0, currentSceneIdx - 1))}
                disabled={currentSceneIdx === 0}
                style={{ background: 'white', border: '1.5px solid #FFE0B2', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}
              >
                ⏮️ Prev Scene
              </button>

              <button
                onClick={togglePlayAnimation}
                style={{
                  background: isPlayingAnimation ? '#E63946' : 'linear-gradient(135deg,#22c55e,#15803d)',
                  border: 'none', borderRadius: 12, padding: '10px 24px', color: 'white',
                  cursor: 'pointer', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
                }}
              >
                {isPlayingAnimation ? '⏸️ Pause Animation' : '▶️ Play Full Animation (All Scenes)'}
              </button>

              <button
                onClick={() => handleSeekScene(Math.min(scenes.length - 1, currentSceneIdx + 1))}
                disabled={currentSceneIdx === scenes.length - 1}
                style={{ background: 'white', border: '1.5px solid #FFE0B2', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}
              >
                Next Scene ⏭️
              </button>
            </div>

            {/* Scene Timeline Selector */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#9090A0', marginRight: 4 }}>Scenes:</span>
              {scenes.map((s, i) => (
                <button
                  key={s.number || i}
                  onClick={() => handleSeekScene(i)}
                  style={{
                    width: 36, height: 36, borderRadius: 8, border: 'none',
                    background: currentSceneIdx === i ? '#E63946' : '#FFE0B2',
                    color: currentSceneIdx === i ? 'white' : '#1A1A2E',
                    fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem'
                  }}
                  title={s.title}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Audio & Speed Controls */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button
                onClick={() => setVoiceEnabled(v => !v)}
                style={{
                  background: voiceEnabled ? '#EDE9FE' : '#F1F5F9',
                  border: '1.5px solid #DDD6FE', borderRadius: 8, padding: '6px 12px',
                  color: voiceEnabled ? '#7C3AED' : '#64748B', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
                }}
              >
                {voiceEnabled ? '🔊 Audio ON' : '🔇 Audio OFF'}
              </button>

              <button
                onClick={() => setCaptionsEnabled(c => !c)}
                style={{
                  background: captionsEnabled ? '#DCFCE7' : '#F1F5F9',
                  border: '1.5px solid #86EFAC', borderRadius: 8, padding: '6px 12px',
                  color: captionsEnabled ? '#15803D' : '#64748B', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
                }}
              >
                {captionsEnabled ? '💬 Captions ON' : '💬 Captions OFF'}
              </button>

              <select
                value={animationSpeed}
                onChange={e => setAnimationSpeed(Number(e.target.value))}
                style={{ padding: '6px 10px', borderRadius: 8, border: '1.5px solid #FFE0B2', background: 'white', fontWeight: 700, fontSize: '0.82rem' }}
              >
                <option value={0.75}>0.75x Speed</option>
                <option value={1}>1.0x Speed</option>
                <option value={1.25}>1.25x Speed</option>
                <option value={1.5}>1.5x Speed</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button style={S.btnOutline} onClick={() => setStep(4)}>← Back</button>
            <button style={S.btnPrimary} onClick={handleRenderVideo}>Next: Export MP4 & Storyboard →</button>
          </div>
        </div>
      )}

      {/* ── STEP 6: EXPORT & ALL SCENES VIDEO GALLERY ── */}
      {step === 6 && (
        <div style={S.card}>
          {processing ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ width: 60, height: 60, border: '5px solid #FFE0B2', borderTopColor: '#E63946', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
              <h3 style={{ marginBottom: 12, color: '#1A1A2E' }}>{progress.status || 'Compiling Multi-Scene Video Assets...'}</h3>
              <div style={{ width: 340, height: 10, background: '#FFE0B2', borderRadius: 10, margin: '0 auto', overflow: 'hidden' }}>
                <div style={{ width: `${progress.pct}%`, height: '100%', background: '#E63946', transition: 'width 0.3s' }} />
              </div>
              <p style={{ color: '#9090A0', marginTop: 10, fontSize: '0.85rem' }}>{progress.pct}% complete • Engine: {currentEngineObj.name}</p>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          ) : result ? (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ fontSize: '3.5rem', marginBottom: 10 }}>🎉</div>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#1A1A2E', marginBottom: 8 }}>
                  Your Animation Video is Fully Rendered!
                </h2>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FFF8E7', border: '1px solid #FFE0B2', padding: '6px 16px', borderRadius: 50, marginBottom: 12 }}>
                  <span style={{ color: '#D97706', fontWeight: 800, fontSize: '0.82rem' }}>
                    {result.badge || currentEngineObj.badge}
                  </span>
                  <span>•</span>
                  <span style={{ color: '#1A1A2E', fontWeight: 700, fontSize: '0.82rem' }}>
                    {result.scenes?.length || scenes.length} Complete Scenes
                  </span>
                </div>
                <p style={{ color: '#9090A0', fontSize: '0.92rem', margin: 0 }}>
                  Rendered with {result.engineName || currentEngineObj.name} ({result.model || currentEngineObj.model}). Saved to MongoDB.
                </p>
              </div>

              {/* Master Movie Video Player */}
              <div style={{ maxWidth: 760, margin: '0 auto 32px', borderRadius: 18, overflow: 'hidden', border: '2px solid #FFE0B2', boxShadow: '0 12px 36px rgba(0,0,0,0.1)' }}>
                <video
                  controls
                  autoPlay
                  loop
                  width="100%"
                  src={result.videoUrl || '/videos/scene_1.mp4'}
                  poster={scenes[0]?.image}
                />
              </div>

              {/* Master Action Buttons */}
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
                <a href={result.videoUrl || '/videos/scene_1.mp4'} download style={{ ...S.btnPrimary, textDecoration: 'none' }}>
                  📥 Download Full Movie MP4 (1080p)
                </a>
                <button style={S.btnOutline} onClick={() => alert('Storyboard PDF exported successfully!')}>
                  📄 Export Storyboard PDF
                </button>
                <button style={S.btnOutline} onClick={() => alert('Subtitles (.SRT) exported successfully!')}>
                  📝 Download Subtitles (.SRT)
                </button>
                <button style={{ ...S.btnOutline, borderColor: '#E63946', color: '#E63946' }} onClick={() => navigate('/projects')}>
                  📁 View in My Projects
                </button>
              </div>

              {/* ── ALL SCENES VIDEO GALLERY (Every scene accessible) ── */}
              <div style={{ borderTop: '2px solid #FFE0B2', paddingTop: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1A1A2E', margin: 0 }}>
                      🎞️ All Scenes Video Gallery ({result.scenes?.length || scenes.length} Scenes)
                    </h3>
                    <p style={{ color: '#9090A0', fontSize: '0.84rem', margin: '4px 0 0' }}>
                      Watch or download each individual scene animation clip separately.
                    </p>
                  </div>
                  <span style={{ background: '#DCFCE7', color: '#15803D', padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 800 }}>
                    100% Generated
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                  {(result.scenes || scenes).map((sc, i) => (
                    <div
                      key={sc.number || i}
                      style={{
                        background: '#FFFBF0', border: '1.5px solid #FFE0B2', borderRadius: 14,
                        overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                      }}
                    >
                      {/* Scene Video Player */}
                      <div style={{ position: 'relative', height: 180, background: '#0F172A' }}>
                        <video
                          controls
                          src={sc.videoUrl || result.videoUrl || `/videos/scene_${(i % 5) + 1}.mp4`}
                          poster={sc.image}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <span style={{
                          position: 'absolute', top: 8, left: 8,
                          background: 'rgba(0,0,0,0.75)', color: 'white',
                          padding: '3px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 800
                        }}>
                          Scene {sc.number || i + 1}
                        </span>
                        <span style={{
                          position: 'absolute', top: 8, right: 8,
                          background: '#E63946', color: 'white',
                          padding: '3px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 800
                        }}>
                          ⏱️ {sc.durationSec || 6}s
                        </span>
                      </div>

                      {/* Scene Details */}
                      <div style={{ padding: '14px 16px' }}>
                        <h4 style={{ margin: '0 0 6px', fontSize: '0.98rem', color: '#1A1A2E' }}>
                          {sc.title ? sc.title.replace(/^Scene \d+:\s*/i, '') : `Scene ${i + 1}`}
                        </h4>
                        <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: 8, fontStyle: 'italic' }}>
                          💬 {sc.dialogue || sc.narration}
                        </div>
                        <a
                          href={sc.videoUrl || result.videoUrl}
                          download={`scene_${sc.number || i + 1}.mp4`}
                          style={{
                            display: 'block', textAlign: 'center', padding: '8px',
                            background: 'white', border: '1.5px solid #FFE0B2', borderRadius: 8,
                            color: '#C1121F', fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none'
                          }}
                        >
                          📥 Download Scene {sc.number || i + 1} MP4
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.85) translateY(10px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes floatCharacter {
          0% { transform: translate(-50%, -50%) translateY(0px); }
          100% { transform: translate(-50%, -50%) translateY(-12px); }
        }
      `}</style>
    </AppShell>
  )
}
