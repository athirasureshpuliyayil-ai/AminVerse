import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppSidebar from '../components/AppSidebar'
import AppHeader from '../components/AppHeader'
import { aiService } from '../services/aiService'

export default function GeneratorWizard() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState({ percent: 0, statusText: '' })

  // Pipeline Data State
  const [inputMode, setInputMode] = useState('prompt') // prompt, paste, file, voice
  const [promptText, setPromptText] = useState('')
  const [options, setOptions] = useState({
    length: 'medium',
    audience: 'kids',
    style: 'Kids Cartoon',
    tone: 'Adventurous',
    language: 'English',
    musicTheme: 'Adventure'
  })

  const [story, setStory] = useState(null)
  const [characters, setCharacters] = useState([])
  const [scenes, setScenes] = useState([])
  const [renderedResult, setRenderedResult] = useState(null)

  // Step 1 -> 2: Generate Story
  const handleGenerateStory = async () => {
    if (!promptText.trim()) return alert('Please enter a prompt or story text first.')
    setIsProcessing(true)
    try {
      const generatedStory = await aiService.generateStory({ prompt: promptText, ...options })
      setStory(generatedStory)
      const extractedChars = await aiService.extractCharacters(generatedStory.fullText)
      setCharacters(extractedChars)
      const dividedScenes = await aiService.generateScenes(generatedStory.fullText)
      setScenes(dividedScenes)
      setCurrentStep(2)
    } catch (err) {
      alert('Generation error: ' + err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  // Step 5: Render Video
  const handleRenderVideo = async () => {
    setIsProcessing(true)
    try {
      const result = await aiService.renderVideo({ story, characters, scenes }, (pct, status) => {
        setProgress({ percent: pct, statusText: status })
      })
      setRenderedResult(result)
      setCurrentStep(6)
    } catch (err) {
      alert('Render error: ' + err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const stepsList = [
    { num: 1, label: 'Story & Style' },
    { num: 2, label: 'Story & Characters' },
    { num: 3, label: 'Scene Breakdown' },
    { num: 4, label: 'Audio & Music' },
    { num: 5, label: 'Storyboard Review' },
    { num: 6, label: 'Video Export' }
  ]

  return (
    <div className="app-shell">
      <AppSidebar />
      <main className="app-main">
        <AppHeader title="AI Prompt-to-Animation Generator" />

        <div className="app-content">
          {/* Progress Steps Header */}
          <div className="wizard-steps">
            {stepsList.map(s => (
              <div 
                key={s.num} 
                className={`wizard-step ${currentStep === s.num ? 'active' : ''} ${currentStep > s.num ? 'completed' : ''}`}
                onClick={() => currentStep > s.num && setCurrentStep(s.num)}
                style={{ cursor: currentStep > s.num ? 'pointer' : 'default' }}
              >
                <div className="step-num">
                  {currentStep > s.num ? <i className="fas fa-check" /> : s.num}
                </div>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          {/* STEP 1: INPUT & CONFIGURATION */}
          {currentStep === 1 && (
            <div className="card" style={{ padding: '32px' }}>
              <h2 className="section-title" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>
                1. Input Your Story Idea
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Choose how you want to provide your story and select animation options.
              </p>

              {/* Input Mode Tabs */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {[
                  { mode: 'prompt', label: '✍️ Text Prompt' },
                  { mode: 'paste', label: '📖 Paste Full Story' },
                  { mode: 'file', label: '📁 Upload File (.txt, .docx)' },
                  { mode: 'voice', label: '🎙️ Voice Recording' },
                ].map(m => (
                  <button 
                    key={m.mode}
                    type="button"
                    className={`btn ${inputMode === m.mode ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setInputMode(m.mode)}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Main Input Textarea */}
              <div className="form-group">
                <label>Story Prompt or Script Text</label>
                <textarea 
                  className="form-control"
                  rows={5}
                  value={promptText}
                  onChange={e => setPromptText(e.target.value)}
                  placeholder="✨ Type your story idea here... e.g. 'A brave little rabbit discovers a hidden garden where animals can speak...'"
                />
              </div>

              {/* Options Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '24px' }}>
                <div className="form-group">
                  <label>Target Audience</label>
                  <select 
                    className="form-control"
                    value={options.audience}
                    onChange={e => setOptions({ ...options, audience: e.target.value })}
                  >
                    <option value="kids">👶 Kids</option>
                    <option value="teens">🧑 Teens</option>
                    <option value="adults">🧔 Adults</option>
                    <option value="general">🌍 General Audience</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Animation Style</label>
                  <select 
                    className="form-control"
                    value={options.style}
                    onChange={e => setOptions({ ...options, style: e.target.value })}
                  >
                    <option value="Kids Cartoon">🧒 Kids Cartoon</option>
                    <option value="Anime">🌸 Anime</option>
                    <option value="Comic Book">💥 Comic Book</option>
                    <option value="Fantasy">🧙 Fantasy</option>
                    <option value="Pixar Style">✨ Pixar Style</option>
                    <option value="Cinematic">🎬 Cinematic</option>
                    <option value="Watercolor">🎨 Watercolor</option>
                    <option value="Realistic 3D">🎮 Realistic 3D</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Story Tone</label>
                  <select 
                    className="form-control"
                    value={options.tone}
                    onChange={e => setOptions({ ...options, tone: e.target.value })}
                  >
                    <option value="Adventurous">⚔️ Adventurous</option>
                    <option value="Whimsical">✨ Whimsical</option>
                    <option value="Funny">😂 Funny & Comedic</option>
                    <option value="Mysterious">🔍 Mysterious</option>
                    <option value="Emotional">❤️ Emotional & Touching</option>
                    <option value="Educational">🎓 Educational</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Language</label>
                  <select 
                    className="form-control"
                    value={options.language}
                    onChange={e => setOptions({ ...options, language: e.target.value })}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>
              </div>

              <div style={{ textAlign: 'right', marginTop: '32px' }}>
                <button 
                  className="btn btn-primary btn-lg" 
                  onClick={handleGenerateStory}
                  disabled={isProcessing}
                >
                  {isProcessing ? <><span className="spinner" /> Generating Pipeline...</> : <><i className="fas fa-magic" /> Generate Story & Characters</>}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: REVIEW STORY & CHARACTERS */}
          {currentStep === 2 && story && (
            <div className="card" style={{ padding: '32px' }}>
              <h2 className="section-title" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>
                2. AI Story & Character Profiles
              </h2>
              
              <div style={{ background: 'var(--light-bg)', padding: '24px', borderRadius: 'var(--radius-md)', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-dark)', marginBottom: '8px' }}>{story.title}</h3>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <span className="badge badge-yellow">{story.genre}</span>
                  <span className="badge badge-green">{story.animationStyle}</span>
                  <span className="badge badge-red">{story.targetAudience}</span>
                </div>
                <p style={{ whiteSpace: 'pre-line', fontSize: '0.95rem' }}>{story.fullText}</p>
              </div>

              <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Extracted Character Consistency Profiles</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                {characters.map((char, i) => (
                  <div key={char.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px', display: 'flex', gap: '16px' }}>
                    <img src={char.image} alt={char.name} style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', color: 'var(--primary-dark)' }}>{char.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 8px 0' }}>{char.species} • {char.personality}</p>
                      <p style={{ fontSize: '0.82rem', margin: 0 }}><strong>Voice:</strong> {char.voiceProfile}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button className="btn btn-outline" onClick={() => setCurrentStep(1)}>Back</button>
                <button className="btn btn-primary" onClick={() => setCurrentStep(3)}>Next: Scene Breakdown →</button>
              </div>
            </div>
          )}

          {/* STEP 3: SCENE BREAKDOWN */}
          {currentStep === 3 && (
            <div className="card" style={{ padding: '32px' }}>
              <h2 className="section-title" style={{ fontSize: '1.6rem', marginBottom: '16px' }}>
                3. Scene Breakdown & Visual Art
              </h2>

              <div style={{ display: 'grid', gap: '20px', marginBottom: '32px' }}>
                {scenes.map(sc => (
                  <div key={sc.number} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '20px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px', background: 'var(--card-bg)' }}>
                    <img src={sc.image} alt={sc.title} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px' }} />
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h4 style={{ fontSize: '1.1rem', margin: 0 }}>Scene {sc.number}: {sc.title}</h4>
                        <span className="badge badge-yellow">{sc.emotion}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{sc.prompt}</p>
                      <div style={{ background: 'var(--light-bg)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem', fontStyle: 'italic' }}>
                        💬 {sc.dialogue}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button className="btn btn-outline" onClick={() => setCurrentStep(2)}>Back</button>
                <button className="btn btn-primary" onClick={() => setCurrentStep(4)}>Next: Audio & Music →</button>
              </div>
            </div>
          )}

          {/* STEP 4: AUDIO & MUSIC */}
          {currentStep === 4 && (
            <div className="card" style={{ padding: '32px' }}>
              <h2 className="section-title" style={{ fontSize: '1.6rem', marginBottom: '16px' }}>
                4. Voice Synthesis & Background Music
              </h2>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>Narrator Voice Model</label>
                <select className="form-control" defaultValue="Narrator Male - Deep & Warm">
                  <option>Narrator Male - Deep & Warm</option>
                  <option>Narrator Female - Expressive & Soft</option>
                  <option>Child Voice - Energetic</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '32px' }}>
                <label>Background Soundtrack Category</label>
                <select className="form-control" defaultValue="Adventure & Wonder">
                  <option>Adventure & Wonder</option>
                  <option>Calm & Peaceful</option>
                  <option>Whimsical Fantasy</option>
                  <option>Suspense & Mystery</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button className="btn btn-outline" onClick={() => setCurrentStep(3)}>Back</button>
                <button className="btn btn-primary" onClick={() => setCurrentStep(5)}>Next: Storyboard Review →</button>
              </div>
            </div>
          )}

          {/* STEP 5: STORYBOARD REVIEW */}
          {currentStep === 5 && (
            <div className="card" style={{ padding: '32px' }}>
              <h2 className="section-title" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>
                5. Interactive Storyboard Preview
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Review scenes and audio tracks before rendering the final animated video.
              </p>

              {isProcessing ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div className="spinner" style={{ width: '48px', height: '48px', borderTopColor: 'var(--primary)', marginBottom: '16px' }} />
                  <h3>{progress.statusText || 'Rendering Video...'}</h3>
                  <div style={{ width: '300px', height: '10px', background: 'var(--border)', borderRadius: '10px', margin: '16px auto', overflow: 'hidden' }}>
                    <div style={{ width: `${progress.percent}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s' }} />
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                    {scenes.map(sc => (
                      <div key={sc.number} className="card" style={{ padding: '12px' }}>
                        <img src={sc.image} alt={sc.title} style={{ height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />
                        <h5 style={{ margin: '0 0 4px 0' }}>Scene {sc.number}: {sc.title}</h5>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>Duration: {sc.durationSec}s</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button className="btn btn-outline" onClick={() => setCurrentStep(4)}>Back</button>
                    <button className="btn btn-emerald btn-lg" onClick={handleRenderVideo}>
                      🎬 Render MP4 Video
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 6: RENDERED RESULT & EXPORTS */}
          {currentStep === 6 && renderedResult && (
            <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎉</div>
              <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>
                Your Animation is Ready!
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                Watch your generated video preview below and download exported files.
              </p>

              <div style={{ maxWidth: '720px', margin: '0 auto 32px', borderRadius: '16px', overflow: 'hidden', border: '2px solid var(--border)' }}>
                <video controls width="100%" src={renderedResult.videoUrl} poster={scenes[0]?.image} />
              </div>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href={renderedResult.videoUrl} download className="btn btn-primary btn-lg">
                  <i className="fas fa-download" /> Download MP4 Video
                </a>
                <button className="btn btn-outline btn-lg" onClick={() => alert('Storyboard PDF downloaded!')}>
                  <i className="fas fa-file-pdf" /> Storyboard PDF
                </button>
                <button className="btn btn-secondary btn-lg" onClick={() => navigate('/projects')}>
                  <i className="fas fa-folder-open" /> View in Projects
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
