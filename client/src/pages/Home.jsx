import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const STORIES = [
  { id:1, title:"The Brave Little Rabbit", author:"AnimVerse Team", genre:"Fairy Tale", icon:"🐇", color:"#FFD60A", desc:"A tiny rabbit discovers courage when a fearsome dragon threatens the forest.", time:"8 min" },
  { id:2, title:"The Golden Lantern", author:"Folk Tales Press", genre:"Moral Story", icon:"🏮", color:"#FF9F1C", desc:"A poor boy's honesty earns him a magical lantern that can fulfill one wish.", time:"6 min" },
  { id:3, title:"Stars of the Deep Ocean", author:"Marina Blue", genre:"Adventure", icon:"🐬", color:"#4FC3F7", desc:"An oceanographer discovers a lost civilization in unexplored underwater caves.", time:"15 min" },
  { id:4, title:"The Dragon's Secret Garden", author:"Elara Moonwhisper", genre:"Fantasy", icon:"🐉", color:"#CE93D8", desc:"A young mage finds a hidden garden guarded by a lonely dragon with a painful past.", time:"12 min" },
  { id:5, title:"Midnight at Blackwood Manor", author:"A.K. Vortex", genre:"Mystery", icon:"🏚️", color:"#78909C", desc:"A detective investigates the mysterious disappearance of a billionaire.", time:"20 min" },
  { id:6, title:"Echo of the Cosmos", author:"Dr. Nebula", genre:"Sci-Fi", icon:"🚀", color:"#26C6DA", desc:"Earth's last astronaut discovers an alien message that could end all civilization.", time:"25 min" },
]

const TEMPLATES = [
  { name:"Kids Cartoon", icon:"🧒", bg:"linear-gradient(135deg,#FFD60A,#FF9F1C)" },
  { name:"Anime", icon:"🌸", bg:"linear-gradient(135deg,#F48FB1,#CE93D8)" },
  { name:"Comic Book", icon:"💥", bg:"linear-gradient(135deg,#E63946,#C1121F)" },
  { name:"Fantasy", icon:"🧙", bg:"linear-gradient(135deg,#7C3AED,#A78BFA)" },
  { name:"Storybook", icon:"📚", bg:"linear-gradient(135deg,#059669,#34D399)" },
  { name:"Cinematic", icon:"🎬", bg:"linear-gradient(135deg,#1E3A5F,#2196F3)" },
  { name:"Watercolor", icon:"🎨", bg:"linear-gradient(135deg,#FF9800,#FFC107)" },
  { name:"Pixar Style", icon:"✨", bg:"linear-gradient(135deg,#E63946,#FF9F1C)" },
]

const GAMES = [
  { id:"memory-match", name:"Memory Match", icon:"🧠", desc:"Flip and match pairs — keep it calm and fun.", time:"2-5 min" },
  { id:"calm-breathing", name:"Calm Breathing", icon:"🫁", desc:"Guided breathing with soothing ambient sounds.", time:"1-5 min" },
  { id:"color-flow", name:"Color Flow", icon:"🎨", desc:"Connect color paths in a relaxing flow puzzle.", time:"3-6 min" },
  { id:"puzzle-garden", name:"Puzzle Garden", icon:"🪴", desc:"Build your own virtual zen garden.", time:"Free Play" },
]

const FAQS = [
  { q:"What is AnimVerse AI?", a:"AnimVerse AI is an AI-powered platform that converts text prompts, stories, books, and novels into fully animated videos — with AI-generated images, voices, music, and sound effects." },
  { q:"Do I need any technical skills?", a:"No! Simply type your story idea or paste any text and the AI handles everything — scene creation, character design, voice generation, and video production." },
  { q:"How long does it take to generate?", a:"A typical 2-5 minute animation takes about 3-8 minutes to generate, depending on complexity and the selected animation style." },
  { q:"What formats can I download?", a:"MP4 Video, Storyboard PDF, Script Document, and Subtitle file (.srt) for use on any platform." },
  { q:"Is it suitable for children?", a:"Absolutely! We have a dedicated Children's Section with Fairy Tales, Moral Stories, Bedtime Stories, and Educational content — all child-safe." },
  { q:"Can I use it for commercial projects?", a:"Yes! Pro and Business plan users get full commercial licensing on all generated animations." },
]

export default function Home() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)
  const [prompt, setPrompt] = useState('')
  const [scrollTop, setScrollTop] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrollTop(window.scrollY > 500)
      setNavScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleGenerate = (e) => {
    e.preventDefault()
    if (prompt.trim()) navigate(`/register`)
    else navigate('/register')
  }

  const S = {
    // Navbar
    nav: {
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: navScrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: navScrolled ? '1px solid #FFE0B2' : '1px solid transparent',
      boxShadow: navScrolled ? '0 4px 30px rgba(230,57,70,0.10)' : 'none',
      transition: 'all 0.3s ease',
    },
    navInner: {
      maxWidth: 1200, margin: '0 auto', padding: '0 24px',
      height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    },
    brand: { display: 'flex', alignItems: 'center', gap: 12 },
    brandIcon: {
      width: 42, height: 42, borderRadius: 12,
      background: 'linear-gradient(135deg,#E63946,#FFD60A)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.4rem', boxShadow: '0 4px 14px rgba(230,57,70,0.30)',
    },
    brandName: { fontSize: '1.25rem', fontWeight: 800, background: 'linear-gradient(135deg,#E63946,#FF9F1C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    brandTag: { fontSize: '0.6rem', color: '#9090A0', fontWeight: 500, marginTop: -2 },
    navLinks: { display: 'flex', alignItems: 'center', gap: 32 },
    navLink: { fontSize: '0.9rem', fontWeight: 600, color: '#4A4A6A', textDecoration: 'none', transition: 'color 0.2s' },
    navActions: { display: 'flex', alignItems: 'center', gap: 12 },
    btnLogin: {
      padding: '10px 24px', borderRadius: 50, border: '2px solid #E63946',
      background: 'transparent', color: '#E63946', fontWeight: 700, fontSize: '0.88rem',
      cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
    },
    btnStart: {
      padding: '10px 24px', borderRadius: 50,
      background: 'linear-gradient(135deg,#E63946,#C1121F)',
      color: 'white', fontWeight: 700, fontSize: '0.88rem',
      border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(230,57,70,0.35)',
      fontFamily: 'inherit',
    },

    // Page
    page: { fontFamily: "'Poppins', -apple-system, sans-serif", background: '#FFFBF0', color: '#1A1A2E' },
    section: { padding: '80px 0' },
    container: { maxWidth: 1200, margin: '0 auto', padding: '0 24px' },
    center: { textAlign: 'center' },
    badge: {
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: 'linear-gradient(135deg,#FFF176,#FFE082)', border: '2px solid #FFD60A',
      color: '#C1121F', padding: '6px 18px', borderRadius: 50,
      fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
      marginBottom: 16,
    },
    sectionTitle: { fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12 },
    sectionSub: { fontSize: '1rem', color: '#4A4A6A', maxWidth: 580, margin: '0 auto 48px', lineHeight: 1.7 },

    // Hero
    hero: {
      minHeight: '100vh', paddingTop: 120, paddingBottom: 80,
      background: 'linear-gradient(160deg,#FFFBF0 0%,#FFF8E7 50%,#FFEDE3 100%)',
      position: 'relative', overflow: 'hidden',
    },
    heroShape1: {
      position: 'absolute', top: -150, right: -100, width: 500, height: 500,
      borderRadius: '50%', background: 'radial-gradient(circle,rgba(230,57,70,0.08),transparent)',
      pointerEvents: 'none',
    },
    heroShape2: {
      position: 'absolute', bottom: -100, left: -80, width: 400, height: 400,
      borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,214,10,0.12),transparent)',
      pointerEvents: 'none',
    },
    heroGrid: {
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64,
      alignItems: 'center', position: 'relative', zIndex: 1,
    },
    heroBadge: {
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: 'rgba(230,57,70,0.08)', border: '1.5px solid rgba(230,57,70,0.25)',
      color: '#C1121F', padding: '8px 18px', borderRadius: 50, fontSize: '0.82rem',
      fontWeight: 700, marginBottom: 20,
    },
    heroDot: { width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' },
    heroTitle: { fontSize: 'clamp(2.2rem,5vw,3.4rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20, color: '#1A1A2E' },
    heroHighlight: { background: 'linear-gradient(135deg,#E63946,#FF9F1C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    heroDesc: { fontSize: '1.05rem', color: '#4A4A6A', lineHeight: 1.75, marginBottom: 36, maxWidth: 520 },
    heroActions: { display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 40 },
    btnPrimary: {
      display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 36px',
      borderRadius: 50, background: 'linear-gradient(135deg,#E63946,#C1121F)', color: 'white',
      fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer',
      boxShadow: '0 8px 30px rgba(230,57,70,0.40)', transition: 'transform 0.2s,box-shadow 0.2s',
      textDecoration: 'none', fontFamily: 'inherit',
    },
    btnSec: {
      display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 36px',
      borderRadius: 50, background: 'linear-gradient(135deg,#FFD60A,#F4A21D)', color: '#1A1A2E',
      fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer',
      boxShadow: '0 8px 30px rgba(255,214,10,0.35)', transition: 'transform 0.2s',
      textDecoration: 'none', fontFamily: 'inherit',
    },
    heroStats: { display: 'flex', gap: 32, flexWrap: 'wrap' },
    statNum: { fontSize: '1.6rem', fontWeight: 800, color: '#E63946' },
    statLabel: { fontSize: '0.78rem', color: '#9090A0', fontWeight: 500 },

    heroImgWrap: {
      position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    heroImg: {
      width: '100%', maxWidth: 520, borderRadius: 24,
      boxShadow: '0 32px 80px rgba(230,57,70,0.20)', border: '3px solid rgba(255,255,255,0.8)',
    },
    heroBadgeFloat: (top, left, bg) => ({
      position: 'absolute', top, left, background: bg,
      borderRadius: 14, padding: '10px 16px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: '0.8rem', fontWeight: 700,
      display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
    }),

    // Cards
    card: {
      background: 'white', borderRadius: 20, border: '1px solid #FFE0B2',
      boxShadow: '0 4px 20px rgba(230,57,70,0.06)', transition: 'transform 0.2s,box-shadow 0.2s',
      overflow: 'hidden',
    },

    // Footer
    footer: { background: '#1A1A2E', color: 'rgba(255,255,255,0.75)', padding: '60px 0 32px' },

    // Scroll-top
    scrollBtn: {
      position: 'fixed', bottom: 32, right: 32, width: 48, height: 48, borderRadius: '50%',
      background: 'linear-gradient(135deg,#E63946,#FF9F1C)', color: 'white',
      border: 'none', cursor: 'pointer', fontSize: '1.2rem', zIndex: 999,
      boxShadow: '0 8px 24px rgba(230,57,70,0.40)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
  }

  return (
    <div style={S.page}>

      {/* ── NAVBAR ── */}
      <nav style={S.nav}>
        <div style={S.navInner}>
          <div style={S.brand}>
            <div style={S.brandIcon}>🎬</div>
            <div>
              <div style={S.brandName}>AnimVerse AI</div>
              <div style={S.brandTag}>Turn Stories Into Animated Worlds</div>
            </div>
          </div>
          <div style={S.navLinks}>
            {['Features','Story Library','How It Works','Templates','FAQ'].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`} style={S.navLink}>{l}</a>
            ))}
          </div>
          <div style={S.navActions}>
            <button style={S.btnLogin} onClick={() => navigate('/login')}>Login</button>
            <button style={S.btnStart} onClick={() => navigate('/register')}>Get Started Free</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={S.hero}>
        <div style={S.heroShape1} />
        <div style={S.heroShape2} />
        <div style={S.container}>
          <div style={S.heroGrid}>
            {/* Left */}
            <div>
              <div style={S.heroBadge}>
                <div style={S.heroDot} />
                🚀 AI-Powered Animation Platform — Now Live!
              </div>
              <h1 style={S.heroTitle}>
                Turn Any Story Into a{' '}
                <span style={S.heroHighlight}>Stunning Animation</span>{' '}
                in Minutes
              </h1>
              <p style={S.heroDesc}>
                Type your story, paste a book chapter, or pick from our 10,000+ story library.
                AnimVerse AI handles everything — characters, scenes, voices, music, and exports
                your animation as a downloadable MP4 video.
              </p>
              <div style={S.heroActions}>
                <Link to="/register" style={S.btnPrimary}>
                  <span>✨</span> Start Creating Free
                </Link>
                <a href="#how-it-works" style={S.btnSec}>
                  <span>▶</span> See How It Works
                </a>
              </div>
              <div style={S.heroStats}>
                {[['50K+','Animations Created'],['10K+','Stories in Library'],['7','Animation Styles']].map(([n,l],i) => (
                  <div key={i}>
                    <div style={S.statNum}>{n}</div>
                    <div style={S.statLabel}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div style={S.heroImgWrap}>
              <img src="/images/hero.png" alt="AnimVerse AI" style={S.heroImg}
                onError={e => { e.target.style.display='none' }} />

              {/* Floating info badges */}
              <div style={S.heroBadgeFloat('10%','-8%','white')}>
                <span>🎬</span> AI Animation Ready
              </div>
              <div style={S.heroBadgeFloat('65%','-12%','white')}>
                <span>🎙️</span> Voice Generated
              </div>
              <div style={S.heroBadgeFloat('80%','60%','linear-gradient(135deg,#FFD60A,#FF9F1C)')}>
                <span>✅</span> Story Complete
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK PROMPT ── */}
      <section style={{ padding: '60px 0', background: 'white' }}>
        <div style={S.container}>
          <div style={{ ...S.center, maxWidth: 700, margin: '0 auto' }}>
            <div style={S.badge}>⚡ Try It Now</div>
            <h2 style={S.sectionTitle}>Generate Your Animation in Seconds</h2>
            <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <textarea
                rows={3}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="✨ Type your story idea... e.g. 'A brave rabbit saves the enchanted forest from a fearsome dragon...'"
                style={{
                  width: '100%', padding: '18px 22px', borderRadius: 16,
                  border: '2px solid #FFE0B2', fontSize: '1rem', fontFamily: 'inherit',
                  resize: 'none', outline: 'none', boxSizing: 'border-box',
                  background: '#FFFBF0', color: '#1A1A2E', lineHeight: 1.6,
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#E63946'}
                onBlur={e => e.target.style.borderColor = '#FFE0B2'}
              />
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {['🐇 Brave Rabbit Story','🚀 Space Adventure','🧙 Fantasy Quest','🌊 Ocean Mystery'].map((q,i) => (
                  <button key={i} type="button"
                    style={{
                      padding: '8px 18px', borderRadius: 50, background: '#FFF8E7',
                      border: '1.5px solid #FFE0B2', fontSize: '0.82rem', fontWeight: 600,
                      cursor: 'pointer', color: '#1A1A2E', fontFamily: 'inherit',
                    }}
                    onClick={() => setPrompt(q.slice(2))}>
                    {q}
                  </button>
                ))}
              </div>
              <button type="submit" style={{ ...S.btnPrimary, alignSelf: 'center', padding: '16px 48px' }}>
                <span>🎬</span> Generate Animation
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── STORY LIBRARY ── */}
      <section id="story-library" style={{ ...S.section, background: '#FFF8E7' }}>
        <div style={S.container}>
          <div style={S.center}>
            <div style={S.badge}>📚 10,000+ Stories</div>
            <h2 style={S.sectionTitle}>Featured <span style={S.heroHighlight}>Stories & Books</span></h2>
            <p style={S.sectionSub}>Browse our curated digital library — from children's fairy tales to adult fiction, all ready to be animated.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 24 }}>
            {STORIES.map(s => (
              <div key={s.id} style={S.card}>
                <div style={{ height: 140, background: `linear-gradient(135deg,${s.color}40,${s.color}90)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>
                  {s.icon}
                </div>
                <div style={{ padding: '20px 20px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ background: '#FFF9C4', color: '#E65100', padding: '3px 10px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 700 }}>{s.genre}</span>
                    <span style={{ fontSize: '0.72rem', color: '#9090A0' }}>⏱ {s.time}</span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '6px 0 4px' }}>{s.title}</h3>
                  <p style={{ fontSize: '0.75rem', color: '#9090A0', margin: '0 0 10px' }}>by {s.author}</p>
                  <p style={{ fontSize: '0.82rem', color: '#4A4A6A', lineHeight: 1.5, marginBottom: 16 }}>{s.desc}</p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Link to={`/stories/${s.id}`} style={{ flex:1, padding:'9px', textAlign:'center', border:'1.5px solid #E63946', borderRadius:10, color:'#E63946', fontWeight:700, fontSize:'0.8rem', textDecoration:'none' }}>Read</Link>
                    <Link to={`/register`} style={{ flex:1, padding:'9px', textAlign:'center', background:'linear-gradient(135deg,#E63946,#C1121F)', borderRadius:10, color:'white', fontWeight:700, fontSize:'0.8rem', textDecoration:'none' }}>Animate</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/stories" style={S.btnPrimary}>Browse Full Story Library →</Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ ...S.section, background: 'white' }}>
        <div style={S.container}>
          <div style={S.center}>
            <div style={S.badge}>⚙️ Simple Process</div>
            <h2 style={S.sectionTitle}>How It <span style={S.heroHighlight}>Works</span></h2>
            <p style={S.sectionSub}>Go from a simple idea to a full animated video in just 4 simple steps.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24 }}>
            {[
              { step:'01', icon:'✍️', title:'Enter Your Story', desc:'Type a prompt, paste a story, or pick from our 10,000+ story library.' },
              { step:'02', icon:'🤖', title:'AI Processes Everything', desc:'AI generates characters, scenes, voices, music & sound effects automatically.' },
              { step:'03', icon:'🎬', title:'Review & Customize', desc:'Preview each scene, edit characters, swap music, and perfect your animation.' },
              { step:'04', icon:'📥', title:'Download Your Video', desc:'Export as MP4 Video, PDF Storyboard, or SRT Subtitles instantly.' },
            ].map((step, i) => (
              <div key={i} style={{ ...S.card, padding: 28, textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#E63946', letterSpacing: 2, marginBottom: 12 }}>STEP {step.step}</div>
                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{step.icon}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#4A4A6A', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEMPLATES ── */}
      <section id="templates" style={{ ...S.section, background: '#FFF8E7' }}>
        <div style={S.container}>
          <div style={S.center}>
            <div style={S.badge}>🎨 Style Presets</div>
            <h2 style={S.sectionTitle}>Choose Your <span style={S.heroHighlight}>Animation Style</span></h2>
            <p style={S.sectionSub}>8 unique professional animation styles, each with distinct visual aesthetics and sound design.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 20 }}>
            {TEMPLATES.map((t, i) => (
              <div key={i} onClick={() => navigate('/register')}
                style={{ ...S.card, cursor: 'pointer', padding: 0, overflow: 'hidden' }}>
                <div style={{ height: 120, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>{t.icon}</div>
                <div style={{ padding: '14px 16px', fontWeight: 700, fontSize: '0.95rem' }}>{t.name}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/register" style={S.btnSec}>View All Templates →</Link>
          </div>
        </div>
      </section>

      {/* ── RELAX & PLAY ── */}
      <section style={{ ...S.section, background: 'white' }}>
        <div style={S.container}>
          <div style={S.center}>
            <div style={{ ...S.badge, background:'linear-gradient(135deg,#dcfce7,#a7f3d0)', borderColor:'#22c55e', color:'#15803d' }}>🎮 Mindful Break</div>
            <h2 style={S.sectionTitle}>Need a Little <span style={{ background:'linear-gradient(135deg,#22c55e,#15803d)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Break?</span></h2>
            <p style={S.sectionSub}>Take a few mindful minutes away from creating. Relax, play, and come back refreshed and inspired.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 24, marginBottom: 40 }}>
            {GAMES.map(g => (
              <div key={g.id} style={{ ...S.card, padding: 24 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 14 }}>{g.icon}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>{g.name}</h3>
                <p style={{ fontSize: '0.83rem', color: '#4A4A6A', marginBottom: 12, lineHeight: 1.5 }}>{g.desc}</p>
                <div style={{ fontSize: '0.75rem', color: '#9090A0', marginBottom: 16 }}>⏱ {g.time}</div>
                <Link to={`/register`}
                  style={{ display: 'block', textAlign:'center', padding:'11px', background:'linear-gradient(135deg,#22c55e,#15803d)', color:'white', borderRadius:12, fontWeight:700, fontSize:'0.85rem', textDecoration:'none' }}>
                  Play Now
                </Link>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link to="/register" style={{ ...S.btnSec, background:'linear-gradient(135deg,#22c55e,#15803d)', color:'white', boxShadow:'0 8px 30px rgba(34,197,94,0.35)' }}>
              Explore Relax & Play Hub →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ ...S.section, background: '#FFF8E7' }}>
        <div style={S.container}>
          <div style={S.center}>
            <div style={S.badge}>❓ Help Center</div>
            <h2 style={S.sectionTitle}>Frequently Asked <span style={S.heroHighlight}>Questions</span></h2>
          </div>
          <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FAQS.map((f, i) => (
              <div key={i} style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.98rem', fontWeight: 700, color: '#1A1A2E', textAlign: 'left' }}>
                  {f.q}
                  <span style={{ fontSize: '1.2rem', color: '#E63946', transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 24px 20px', fontSize: '0.88rem', color: '#4A4A6A', lineHeight: 1.7, borderTop: '1px solid #FFE0B2' }}>
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg,#E63946,#C1121F,#FF9F1C)' }}>
        <div style={{ ...S.container, ...S.center }}>
          <h2 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: 'white', marginBottom: 16 }}>
            Ready to Turn Your Story Into Animation?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', marginBottom: 36 }}>
            Join 25,000+ creators — it's completely free to get started.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ ...S.btnPrimary, background: 'white', color: '#E63946', boxShadow: '0 8px 30px rgba(0,0,0,0.20)' }}>
              🚀 Start Free — No Credit Card
            </Link>
            <Link to="/stories" style={{ ...S.btnSec, background: 'transparent', border: '2px solid white', color: 'white', boxShadow: 'none' }}>
              📖 Browse Story Library
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={S.footer}>
        <div style={S.container}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 40, paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white', marginBottom: 12 }}>🎬 AnimVerse AI</div>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.7, maxWidth: 260 }}>Transform your stories into stunning animated videos using the power of AI.</p>
            </div>
            {[
              { title:'Platform', links:['Story Library','Templates','How It Works','Pricing'] },
              { title:'Relax & Play', links:['Memory Match','Calm Breathing','Puzzle Garden','Color Flow'] },
              { title:'Company', links:['About','Privacy Policy','Terms of Service','Contact'] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>{col.title}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.links.map((l, j) => <li key={j}><a href="#" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.60)', textDecoration: 'none' }}>{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 28, fontSize: '0.8rem', flexWrap: 'wrap', gap: 12 }}>
            <div>© 2026 AnimVerse AI — MCA Capstone Project. All rights reserved.</div>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Privacy','Terms','Help Center'].map(l => <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.50)', textDecoration: 'none' }}>{l}</a>)}
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll-to-top */}
      {scrollTop && (
        <button onClick={() => window.scrollTo({top:0,behavior:'smooth'})} style={S.scrollBtn}>↑</button>
      )}
    </div>
  )
}
