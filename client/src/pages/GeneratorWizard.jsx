import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { aiService } from '../services/aiService'

export default function GeneratorWizard() {
  const navigate     = useNavigate()
  const [step, setStep]         = useState(1)
  const [processing, setProc]   = useState(false)
  const [progress, setProgress] = useState({ pct: 0, status: '' })
  const [inputMode, setInputMode] = useState('prompt')
  const [promptText, setPrompt]   = useState('')
  const [options, setOptions]     = useState({ audience:'kids', style:'Kids Cartoon', tone:'Adventurous', language:'English' })
  const [story, setStory]         = useState(null)
  const [characters, setChars]    = useState([])
  const [scenes, setScenes]       = useState([])
  const [result, setResult]       = useState(null)

  const STEPS = [
    { n:1, label:'Story & Style' },
    { n:2, label:'Story & Characters' },
    { n:3, label:'Scene Breakdown' },
    { n:4, label:'Audio & Music' },
    { n:5, label:'Storyboard Review' },
    { n:6, label:'Video Export' },
  ]

  const handleGenerateStory = async () => {
    if (!promptText.trim()) return alert('Please enter a story idea.')
    setProc(true)
    try {
      const storyData  = await aiService.understandStory(promptText, options)
      const charData   = await aiService.extractCharacters(storyData)
      const sceneData  = await aiService.divideScenes(storyData)
      setStory(storyData); setChars(charData); setScenes(sceneData); setStep(2)
    } catch (e) { alert('Error: ' + e.message) }
    finally { setProc(false) }
  }

  const handleRenderVideo = async () => {
    setProc(true)
    try {
      const r = await aiService.renderVideo({ story, characters, scenes }, (pct, status) => setProgress({ pct, status }))
      setResult(r); setStep(6)
    } catch (e) { alert('Render error: ' + e.message) }
    finally { setProc(false) }
  }

  const S = {
    card: { background:'white', borderRadius:20, border:'1px solid #FFE0B2', boxShadow:'0 4px 20px rgba(230,57,70,0.06)', padding:32, marginBottom:24 },
    label: { display:'block', marginBottom:7, fontWeight:700, fontSize:'0.9rem', color:'#1A1A2E' },
    input: { width:'100%', padding:'12px 16px', border:'2px solid #FFE0B2', borderRadius:10, fontSize:'0.95rem', fontFamily:'inherit', color:'#1A1A2E', background:'#FFFBF0', boxSizing:'border-box', outline:'none' },
    select: { width:'100%', padding:'12px 16px', border:'2px solid #FFE0B2', borderRadius:10, fontSize:'0.9rem', fontFamily:'inherit', color:'#1A1A2E', background:'#FFFBF0', boxSizing:'border-box', outline:'none' },
    btnPrimary: { padding:'13px 28px', background:'linear-gradient(135deg,#E63946,#C1121F)', color:'white', border:'none', borderRadius:10, fontWeight:700, fontSize:'0.95rem', cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 16px rgba(230,57,70,0.35)' },
    btnOutline: { padding:'13px 28px', background:'white', color:'#4A4A6A', border:'2px solid #FFE0B2', borderRadius:10, fontWeight:700, fontSize:'0.95rem', cursor:'pointer', fontFamily:'inherit' },
    btnEmerald: { padding:'13px 28px', background:'linear-gradient(135deg,#22c55e,#15803d)', color:'white', border:'none', borderRadius:10, fontWeight:700, fontSize:'0.95rem', cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 16px rgba(34,197,94,0.35)' },
    modeBtn: (active) => ({ padding:'10px 18px', background: active ? '#E63946' : 'white', color: active ? 'white' : '#4A4A6A', border: active ? '2px solid #E63946' : '2px solid #FFE0B2', borderRadius:10, fontWeight:700, fontSize:'0.85rem', cursor:'pointer', fontFamily:'inherit' }),
    badge: (color) => ({ display:'inline-block', padding:'4px 12px', borderRadius:50, fontSize:'0.75rem', fontWeight:700, background: color==='red'?'#FFEBEE':color==='green'?'#F0FDF4':'#FFF9C4', color: color==='red'?'#C1121F':color==='green'?'#15803d':'#D97706' }),
    sectionTitle: { fontSize:'1.5rem', fontWeight:800, color:'#1A1A2E', marginBottom:8 },
    sectionSub: { fontSize:'0.9rem', color:'#9090A0', marginBottom:24 },
  }

  return (
    <AppShell title="AI Animation Generator">

      {/* Step Progress */}
      <div style={{ display:'flex', gap:8, marginBottom:32, overflowX:'auto', paddingBottom:4 }}>
        {STEPS.map((s) => (
          <div key={s.n} onClick={() => step > s.n && setStep(s.n)}
            style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0, cursor: step>s.n?'pointer':'default' }}>
            <div style={{
              width:32, height:32, borderRadius:'50%', flexShrink:0,
              background: step > s.n ? '#22c55e' : step === s.n ? '#E63946' : '#FFE0B2',
              color: step >= s.n ? 'white' : '#9090A0',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight:800, fontSize:'0.85rem',
            }}>
              {step > s.n ? '✓' : s.n}
            </div>
            <span style={{ fontWeight: step===s.n?700:500, fontSize:'0.85rem', color: step===s.n?'#E63946':step>s.n?'#22c55e':'#9090A0', whiteSpace:'nowrap' }}>
              {s.label}
            </span>
            {s.n < 6 && <div style={{ width:32, height:2, background:'#FFE0B2', marginLeft:4 }} />}
          </div>
        ))}
      </div>

      {/* STEP 1: INPUT */}
      {step === 1 && (
        <div style={S.card}>
          <h2 style={S.sectionTitle}>1. Input Your Story Idea</h2>
          <p style={S.sectionSub}>Choose how to provide your story and configure animation options.</p>

          {/* Mode Tabs */}
          <div style={{ display:'flex', gap:10, marginBottom:24, flexWrap:'wrap' }}>
            {[['prompt','✍️ Text Prompt'],['paste','📖 Paste Full Story'],['file','📁 Upload File'],['voice','🎙️ Voice Recording']].map(([m,l]) => (
              <button key={m} style={S.modeBtn(inputMode===m)} onClick={() => setInputMode(m)}>{l}</button>
            ))}
          </div>

          <div style={{ marginBottom:24 }}>
            <label style={S.label}>Story Prompt or Script Text</label>
            <textarea rows={5} value={promptText} onChange={e=>setPrompt(e.target.value)}
              placeholder="✨ Type your story idea here... e.g. 'A brave little rabbit discovers a hidden garden where animals can speak...'"
              style={{ ...S.input, resize:'vertical' }} />
          </div>

          {/* Options */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:20, marginBottom:32 }}>
            {[
              { key:'audience', label:'Target Audience', opts:[['kids','👶 Kids'],['teens','🧑 Teens'],['adults','🧔 Adults'],['general','🌍 General']] },
              { key:'style',    label:'Animation Style',  opts:[['Kids Cartoon','🧒 Kids Cartoon'],['Anime','🌸 Anime'],['Comic Book','💥 Comic Book'],['Fantasy','🧙 Fantasy'],['Pixar Style','✨ Pixar Style'],['Cinematic','🎬 Cinematic'],['Watercolor','🎨 Watercolor']] },
              { key:'tone',     label:'Story Tone',       opts:[['Adventurous','⚔️ Adventurous'],['Whimsical','✨ Whimsical'],['Funny','😂 Funny'],['Mysterious','🔍 Mysterious'],['Emotional','❤️ Emotional'],['Educational','🎓 Educational']] },
              { key:'language', label:'Language',         opts:[['English','English'],['Spanish','Spanish'],['French','French'],['Hindi','Hindi'],['German','German']] },
            ].map(({ key, label, opts }) => (
              <div key={key}>
                <label style={S.label}>{label}</label>
                <select style={S.select} value={options[key]} onChange={e => setOptions(o => ({ ...o, [key]:e.target.value }))}>
                  {opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div style={{ textAlign:'right' }}>
            <button style={S.btnPrimary} onClick={handleGenerateStory} disabled={processing}>
              {processing ? '⏳ Generating...' : '✨ Generate Story & Characters →'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: STORY & CHARACTERS */}
      {step === 2 && story && (
        <div style={S.card}>
          <h2 style={S.sectionTitle}>2. AI Story & Character Profiles</h2>
          <div style={{ background:'#FFF8E7', border:'1px solid #FFE0B2', borderRadius:14, padding:24, marginBottom:28 }}>
            <h3 style={{ fontSize:'1.3rem', color:'#C1121F', margin:'0 0 10px' }}>{story.title}</h3>
            <div style={{ display:'flex', gap:10, marginBottom:12, flexWrap:'wrap' }}>
              {[story.genre, story.animationStyle, story.targetAudience].map((t,i) => (
                <span key={i} style={S.badge(['red','green','yellow'][i])}>{t}</span>
              ))}
            </div>
            <p style={{ fontSize:'0.9rem', lineHeight:1.7, margin:0, whiteSpace:'pre-line' }}>{story.fullText}</p>
          </div>

          <h3 style={{ marginBottom:16 }}>Extracted Character Profiles</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16, marginBottom:28 }}>
            {characters.map(c => (
              <div key={c.id} style={{ display:'flex', gap:14, padding:16, border:'1px solid #FFE0B2', borderRadius:14, background:'white' }}>
                <img src={c.image} alt={c.name} style={{ width:72, height:72, borderRadius:12, objectFit:'cover', flexShrink:0 }} />
                <div>
                  <h4 style={{ margin:'0 0 4px', color:'#C1121F' }}>{c.name}</h4>
                  <p style={{ fontSize:'0.78rem', color:'#9090A0', margin:'0 0 6px' }}>{c.species} • {c.personality}</p>
                  <p style={{ fontSize:'0.8rem', margin:0 }}><strong>Voice:</strong> {c.voiceProfile}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <button style={S.btnOutline} onClick={() => setStep(1)}>← Back</button>
            <button style={S.btnPrimary} onClick={() => setStep(3)}>Next: Scene Breakdown →</button>
          </div>
        </div>
      )}

      {/* STEP 3: SCENES */}
      {step === 3 && (
        <div style={S.card}>
          <h2 style={S.sectionTitle}>3. Scene Breakdown & Visual Art</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:28 }}>
            {scenes.map(sc => (
              <div key={sc.number} style={{ display:'grid', gridTemplateColumns:'180px 1fr', gap:16, border:'1px solid #FFE0B2', borderRadius:14, padding:16 }}>
                <img src={sc.image} alt={sc.title} style={{ width:'100%', height:120, objectFit:'cover', borderRadius:10 }} />
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <h4 style={{ margin:0 }}>Scene {sc.number}: {sc.title}</h4>
                    <span style={S.badge('yellow')}>{sc.emotion}</span>
                  </div>
                  <p style={{ fontSize:'0.85rem', color:'#4A4A6A', marginBottom:8 }}>{sc.prompt}</p>
                  <div style={{ background:'#FFF8E7', padding:'8px 12px', borderRadius:8, fontSize:'0.85rem', fontStyle:'italic' }}>
                    💬 {sc.dialogue}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <button style={S.btnOutline} onClick={() => setStep(2)}>← Back</button>
            <button style={S.btnPrimary} onClick={() => setStep(4)}>Next: Audio & Music →</button>
          </div>
        </div>
      )}

      {/* STEP 4: AUDIO */}
      {step === 4 && (
        <div style={S.card}>
          <h2 style={S.sectionTitle}>4. Voice Synthesis & Background Music</h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:32 }}>
            {[
              { label:'Narrator Voice Model', opts:['Narrator Male - Deep & Warm','Narrator Female - Expressive & Soft','Child Voice - Energetic'] },
              { label:'Background Soundtrack', opts:['Adventure & Wonder','Calm & Peaceful','Whimsical Fantasy','Suspense & Mystery'] },
            ].map((f,i) => (
              <div key={i}>
                <label style={S.label}>{f.label}</label>
                <select style={S.select}>
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <button style={S.btnOutline} onClick={() => setStep(3)}>← Back</button>
            <button style={S.btnPrimary} onClick={() => setStep(5)}>Next: Storyboard Review →</button>
          </div>
        </div>
      )}

      {/* STEP 5: STORYBOARD */}
      {step === 5 && (
        <div style={S.card}>
          <h2 style={S.sectionTitle}>5. Interactive Storyboard Preview</h2>
          <p style={S.sectionSub}>Review your scenes and audio before rendering the final video.</p>
          {processing ? (
            <div style={{ textAlign:'center', padding:'60px 0' }}>
              <div style={{ width:60, height:60, border:'5px solid #FFE0B2', borderTopColor:'#E63946', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 20px' }} />
              <h3 style={{ marginBottom:12 }}>{progress.status || 'Rendering Video...'}</h3>
              <div style={{ width:300, height:10, background:'#FFE0B2', borderRadius:10, margin:'0 auto', overflow:'hidden' }}>
                <div style={{ width:`${progress.pct}%`, height:'100%', background:'#E63946', transition:'width 0.3s' }} />
              </div>
              <p style={{ color:'#9090A0', marginTop:10, fontSize:'0.85rem' }}>{progress.pct}%</p>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          ) : (
            <>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:16, marginBottom:28 }}>
                {scenes.map(sc => (
                  <div key={sc.number} style={{ border:'1px solid #FFE0B2', borderRadius:14, padding:12, background:'#FFFBF0' }}>
                    <img src={sc.image} alt={sc.title} style={{ width:'100%', height:130, objectFit:'cover', borderRadius:10, marginBottom:8 }} />
                    <h5 style={{ margin:'0 0 4px' }}>Scene {sc.number}: {sc.title}</h5>
                    <p style={{ fontSize:'0.75rem', color:'#9090A0', margin:0 }}>Duration: {sc.durationSec}s</p>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <button style={S.btnOutline} onClick={() => setStep(4)}>← Back</button>
                <button style={S.btnEmerald} onClick={handleRenderVideo}>🎬 Render MP4 Video</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* STEP 6: RESULT */}
      {step === 6 && result && (
        <div style={{ ...S.card, textAlign:'center' }}>
          <div style={{ fontSize:'4rem', marginBottom:16 }}>🎉</div>
          <h2 style={{ fontSize:'2rem', fontWeight:900, color:'#1A1A2E', marginBottom:8 }}>Your Animation is Ready!</h2>
          <p style={{ color:'#9090A0', marginBottom:32 }}>Watch your generated video preview and download the exported files.</p>
          <div style={{ maxWidth:720, margin:'0 auto 28px', borderRadius:16, overflow:'hidden', border:'2px solid #FFE0B2' }}>
            <video controls width="100%" src={result.videoUrl} poster={scenes[0]?.image} />
          </div>
          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
            <a href={result.videoUrl} download style={{ ...S.btnPrimary, textDecoration:'none' }}>📥 Download MP4 Video</a>
            <button style={S.btnOutline} onClick={() => alert('Storyboard PDF downloaded!')}>📄 Storyboard PDF</button>
            <button style={{ ...S.btnOutline, borderColor:'#E63946', color:'#E63946' }} onClick={() => navigate('/projects')}>📁 View in Projects</button>
          </div>
        </div>
      )}
    </AppShell>
  )
}
