import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getToken, getUser } from '../utils/authStorage'

const STORIES = [
  { id: 1, title: "Echoes of the Quantum Void", author: "Dr. Aris Vance", genre: "Sci-Fi Thriller", audience: "Adults", desc: "An astrophysicist intercepts deep-space quantum signals that rewrite the laws of gravity.", time: "15 min", resolution: "4K UHD" },
  { id: 2, title: "The Celestial Observatory", author: "Elara Moonwhisper", genre: "High Fantasy", audience: "Teens", desc: "A young star-cartographer discovers an ancient observatory where constellations animate future events.", time: "12 min", resolution: "HDR10" },
  { id: 3, title: "Midnight at Blackwood Manor", author: "A.K. Vortex", genre: "Mystery & Noir", audience: "Adults", desc: "A detective unravels a high-stakes billionaire disappearance from a locked penthouse study.", time: "20 min", resolution: "4K UHD" },
  { id: 4, title: "The Guardian of Whispering Woods", author: "AnimVerse Studio", genre: "Fairy Tale", audience: "Kids & Family", desc: "A brave forest guardian protects a hidden magical grove from a shadow dragon.", time: "8 min", resolution: "1080p" },
]

const ASPECT_RATIOS = [
  { id: '16:9', label: '16:9 Widescreen' },
  { id: '9:16', label: '9:16 Vertical Reel' },
  { id: '4:3',  label: '4:3 Studio' },
  { id: '1:1',  label: '1:1 Square' },
]

const STYLES = [
  { id: 'cinematic', label: 'Cinematic 8K', color: '#F59E0B' },
  { id: 'anime',     label: 'Anime Studio', color: '#EC4899' },
  { id: 'cyberpunk', label: 'Cyberpunk Neon', color: '#06B6D4' },
  { id: 'fantasy',   label: 'Epic Fantasy', color: '#8B5CF6' },
]

export default function Home() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)
  const [prompt, setPrompt] = useState('A brave rabbit saves the forest from a shadow dragon.')
  const [selectedRatio, setSelectedRatio] = useState('16:9')
  const [selectedStyle, setSelectedStyle] = useState('cinematic')

  const user = getUser()
  const token = getToken()
  const isLoggedIn = !!(user && token)

  const handleGenerate = (e) => {
    e.preventDefault()
    const clean = prompt.trim()
    const query = `?prompt=${encodeURIComponent(clean)}&ratio=${selectedRatio}&style=${selectedStyle}`
    if (!isLoggedIn) {
      navigate(`/login?redirect=${encodeURIComponent(clean ? `/generate${query}` : '/generate')}`)
    } else {
      navigate(clean ? `/generate${query}` : '/generate')
    }
  }

  return (
    <div style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      background: '#0A0B0E',
      color: '#F8FAFC',
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>

      {/* ── TOP NAVBAR MATCHING FIGMA REFERENCE ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'rgba(10, 11, 14, 0.90)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto', padding: '0 32px',
          height: 76, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: '#F59E0B',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, color: '#0A0B0E', fontSize: '1.1rem'
            }}>
              🎬
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
              AnimVerse <span style={{ fontSize: '0.75rem', color: '#06B6D4', textTransform: 'uppercase', verticalAlign: 'super' }}>AI</span>
            </div>
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
            <Link to="/museum" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F59E0B', textDecoration: 'none' }}>Literature Museum 🏛️</Link>
            <Link to="/radio" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#06B6D4', textDecoration: 'none' }}>AnimVerse Radio 📻</Link>
            <Link to={isLoggedIn ? "/stories" : "/login?redirect=/stories"} style={{ fontSize: '0.9rem', fontWeight: 600, color: '#94A3B8', textDecoration: 'none' }}>Stories</Link>
            {isLoggedIn ? (
              <Link to="/dashboard" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F59E0B', textDecoration: 'none' }}>Dashboard</Link>
            ) : (
              <Link to="/login" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#94A3B8', textDecoration: 'none' }}>Log in</Link>
            )}
            <button
              onClick={() => navigate(isLoggedIn ? '/dashboard' : '/register')}
              style={{
                padding: '10px 24px', borderRadius: 50, border: 'none',
                background: '#F59E0B', color: '#0A0B0E', fontWeight: 800, fontSize: '0.88rem',
                cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)'
              }}>
              {isLoggedIn ? 'Go to Studio' : 'Get Started'}
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION MATCHING REFERENCE SCREENSHOT EXACTLY ── */}
      <section style={{
        paddingTop: 150, paddingBottom: 100, position: 'relative',
        background: 'radial-gradient(circle at 20% 30%, rgba(245, 158, 11, 0.12) 0%, rgba(10, 11, 14, 0) 60%)'
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 64, alignItems: 'center' }}>
            
            {/* Left Column */}
            <div>
              {/* Cyan Mono Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.3)',
                color: '#06B6D4', padding: '6px 14px', borderRadius: 50,
                fontSize: '0.75rem', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '1px', marginBottom: 24
              }}>
                ✦ POWERED BY CLAUDE + NANO BANANA
              </div>

              {/* Title with Serif Italic Accent */}
              <h1 style={{
                fontSize: 'clamp(2.8rem, 5.5vw, 4.4rem)', fontWeight: 800, lineHeight: 1.08,
                marginBottom: 24, letterSpacing: '-0.03em', color: '#F8FAFC'
              }}>
                Turn a prompt <br />
                into a <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic', fontWeight: 400, color: '#F59E0B' }}>cinematic story.</span>
              </h1>

              <p style={{ fontSize: '1.08rem', color: '#94A3B8', lineHeight: 1.75, marginBottom: 40, maxWidth: 520 }}>
                AnimVerse AI writes, illustrates and directs your idea into a scene-by-scene animated storyboard — for children's fairy tales, sci-fi thrillers, romances and everything in between.
              </p>
              
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 54 }}>
                <Link to="/generate" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 36px',
                  borderRadius: 50, background: '#F59E0B', color: '#0A0B0E',
                  fontWeight: 800, fontSize: '0.98rem', border: 'none', cursor: 'pointer',
                  boxShadow: '0 8px 30px rgba(245,158,11,0.35)', textDecoration: 'none'
                }}>
                  Generate Animation →
                </Link>

                <button onClick={() => navigate('/login')} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 32px',
                  borderRadius: 50, background: 'rgba(255,255,255,0.03)', color: '#F8FAFC',
                  border: '1px solid rgba(255,255,255,0.15)', fontWeight: 700, fontSize: '0.95rem',
                  cursor: 'pointer', fontFamily: 'inherit'
                }}>
                  I already have an account
                </button>
              </div>

              {/* Monospace Stats Row */}
              <div style={{ display: 'flex', gap: 36, fontSize: '0.85rem', fontFamily: 'monospace', color: '#94A3B8' }}>
                <div><span style={{ color: '#F8FAFC', fontWeight: 800 }}>7</span> visual styles</div>
                <div><span style={{ color: '#F8FAFC', fontWeight: 800 }}>13+</span> curated stories</div>
                <div><span style={{ color: '#F8FAFC', fontWeight: 800 }}>∞</span> ideas</div>
              </div>
            </div>

            {/* Right Column Visual Card */}
            <div>
              <div style={{
                background: 'rgba(18, 19, 26, 0.90)', borderRadius: 24, padding: 16,
                border: '1px solid rgba(255, 255, 255, 0.10)', boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
              }}>
                <div style={{ position: 'relative', height: 340, borderRadius: 18, overflow: 'hidden', background: '#000' }}>
                  <img
                    src="/images/hero.png"
                    alt="AnimVerse AI Production Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                  />
                  <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, background: 'rgba(10, 11, 14, 0.90)', backdropFilter: 'blur(12px)', padding: '16px 20px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 4 }}>
                      PROMPT
                    </div>
                    <div style={{ fontSize: '0.98rem', color: '#F8FAFC', fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic' }}>
                      "A brave rabbit saves the forest from a shadow dragon."
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── ISOLATED ROLE GATEWAYS (PARENT, ADULT, AUTHOR) ── */}
      <section id="portals" style={{ padding: '90px 0', background: '#0D0E15', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#F59E0B', padding: '6px 16px', borderRadius: 50,
              fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 16
            }}>
              ISOLATED ROLE PORTALS
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 14, color: '#F8FAFC' }}>
              Dedicated Workspaces & Gateways
            </h2>
            <p style={{ color: '#94A3B8', maxWidth: 600, margin: '0 auto', fontSize: '1rem', lineHeight: 1.6 }}>
              Separate, secure portals for every audience type — Parent Safety Suite, Adult Fiction Lounge, or Author Publishing Studio.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {/* Parent Portal Card */}
            <div style={{
              background: 'rgba(18, 19, 26, 0.8)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)',
              padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>
                  FAMILY & EDUCATION
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 10, color: '#F8FAFC' }}>
                  Parent & Kid Safety Suite
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: 24 }}>
                  Kid-safe bedtime Radio narrations, Children's Literature Museum wings, screen time telemetry, reading rewards, and learning arcade games.
                </p>
              </div>
              <button
                onClick={() => navigate('/login/parent')}
                style={{
                  width: '100%', padding: '13px', borderRadius: 12, border: 'none',
                  background: 'linear-gradient(135deg, #06B6D4, #0891B2)', color: 'white',
                  fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer'
                }}>
                Enter Parent Portal →
              </button>
            </div>

            {/* Adult Portal Card */}
            <div style={{
              background: 'rgba(18, 19, 26, 0.8)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)',
              padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#8B5CF6', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>
                  FICTION & ZEN LOUNGE
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 10, color: '#F8FAFC' }}>
                  Adult Fiction & Zen Lounge
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: 24 }}>
                  Serialized Radio audio novellas, World Classics Literature Museum, bookmark shelves, ambient focus soundscapes, and spatial logic puzzles.
                </p>
              </div>
              <button
                onClick={() => navigate('/login/adult')}
                style={{
                  width: '100%', padding: '13px', borderRadius: 12, border: 'none',
                  background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', color: 'white',
                  fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer'
                }}>
                Enter Adult Lounge →
              </button>
            </div>

            {/* Author Studio Card */}
            <div style={{
              background: 'rgba(18, 19, 26, 0.8)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)',
              padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#F59E0B', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>
                  MANUSCRIPT → ANIMATION
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 10, color: '#F8FAFC' }}>
                  Author Publishing Studio
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: 24 }}>
                  Write and publish story chapters, broadcast audio narrations to AnimVerse Radio, study Mastercraft Museum archives, and convert manuscripts into AI animations.
                </p>
              </div>
              <button
                onClick={() => navigate('/login/author')}
                style={{
                  width: '100%', padding: '13px', borderRadius: 12, border: 'none',
                  background: '#F59E0B', color: '#0A0B0E',
                  fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer'
                }}>
                Enter Author Studio →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── PARAMETRIC AI GENERATOR SECTION ── */}
      <section id="generator-section" style={{ padding: '90px 0', background: '#0A0B0E' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: 14 }}>
            AI Story <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic', fontWeight: 400, color: '#F59E0B' }}>Animation Console</span>
          </h2>
          <p style={{ color: '#94A3B8', marginBottom: 36, fontSize: '1.02rem' }}>
            Input any creative premise or manuscript text. Select studio aspect ratios and visual styles.
          </p>

          <form onSubmit={handleGenerate} style={{ background: 'rgba(18, 19, 26, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 28, textAlign: 'left' }}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#CBD5E1', marginBottom: 8, letterSpacing: '0.5px' }}>
                PROMPT / MANUSCRIPT SCENE
              </label>
              <textarea
                rows={3}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="A brave rabbit saves the forest from a shadow dragon..."
                style={{
                  width: '100%', padding: '16px 18px', borderRadius: 14,
                  background: '#050608', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#F8FAFC', fontSize: '0.98rem', fontFamily: 'inherit',
                  resize: 'none', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#CBD5E1', marginBottom: 8, letterSpacing: '0.5px' }}>ASPECT RATIO</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {ASPECT_RATIOS.map(r => (
                    <button
                      key={r.id} type="button" onClick={() => setSelectedRatio(r.id)}
                      style={{
                        padding: '10px 12px', borderRadius: 10, fontSize: '0.78rem', fontWeight: 700,
                        background: selectedRatio === r.id ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${selectedRatio === r.id ? '#F59E0B' : 'rgba(255,255,255,0.08)'}`,
                        color: selectedRatio === r.id ? '#F59E0B' : '#94A3B8', cursor: 'pointer'
                      }}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#CBD5E1', marginBottom: 8, letterSpacing: '0.5px' }}>VISUAL STYLE</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {STYLES.map(s => (
                    <button
                      key={s.id} type="button" onClick={() => setSelectedStyle(s.id)}
                      style={{
                        padding: '10px 12px', borderRadius: 10, fontSize: '0.78rem', fontWeight: 700,
                        background: selectedStyle === s.id ? `${s.color}25` : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${selectedStyle === s.id ? s.color : 'rgba(255,255,255,0.08)'}`,
                        color: selectedStyle === s.id ? s.color : '#94A3B8', cursor: 'pointer'
                      }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" style={{
                padding: '14px 32px', borderRadius: 50, background: '#F59E0B', color: '#0A0B0E',
                fontWeight: 800, fontSize: '0.95rem', border: 'none', cursor: 'pointer'
              }}>
                Generate Animation →
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ── FEATURED STORIES SECTION ── */}
      <section id="story-library" style={{ padding: '90px 0', background: '#0D0E15', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: 14 }}>
              Curated <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic', fontWeight: 400, color: '#F59E0B' }}>Stories & Adaptations</span>
            </h2>
            <p style={{ color: '#94A3B8', maxWidth: 600, margin: '0 auto' }}>
              Read original titles across Sci-Fi, Mystery, Fantasy, and Bedtime audio. Read chapters or render AI animations.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {STORIES.map(s => (
              <div key={s.id} style={{
                background: 'rgba(18, 19, 26, 0.8)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)',
                padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase' }}>{s.genre} • {s.audience}</span>
                    <span style={{ fontSize: '0.74rem', color: '#64748B' }}>{s.time}</span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC', margin: '0 0 6px' }}>{s.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 12px' }}>Author: {s.author}</p>
                  <p style={{ fontSize: '0.86rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: 20 }}>{s.desc}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <Link to={isLoggedIn ? `/stories/${s.id}` : `/login?redirect=${encodeURIComponent(`/stories/${s.id}`)}`} style={{ padding: '10px', textAlign: 'center', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#F8FAFC', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none' }}>
                    Read Story
                  </Link>
                  <Link to={isLoggedIn ? `/generate?prompt=${encodeURIComponent(s.title + ': ' + s.desc)}` : `/login?redirect=${encodeURIComponent(`/generate?prompt=${encodeURIComponent(s.title + ': ' + s.desc)}`)}`} style={{ padding: '10px', textAlign: 'center', borderRadius: 10, background: '#F59E0B', color: '#0A0B0E', fontWeight: 800, fontSize: '0.82rem', textDecoration: 'none' }}>
                    Animate Scene
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0A0B0E', color: '#64748B', padding: '60px 0 32px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
            <div style={{ fontWeight: 800, color: '#F8FAFC' }}>AnimVerse AI — Generative Storytelling & Animation Platform</div>
            <div>© 2026 AnimVerse AI. All rights reserved.</div>
          </div>
        </div>
      </footer>

    </div>
  )
}
