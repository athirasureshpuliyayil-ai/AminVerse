import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { getToken } from '../utils/authStorage'

export default function ProjectHistory() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [activeVideoModal, setActiveVideoModal] = useState(null)
  const [selectedSceneIdx, setSelectedSceneIdx] = useState(-1) // -1 = master full movie

  // Project history is account-scoped and comes from MongoDB with fallback
  useEffect(() => {
    const token = getToken()
    const headers = {}
    if (token) headers.Authorization = `Bearer ${token}`

    fetch('/api/projects', { headers })
      .then(async response => {
        const payload = await response.json()
        if (!response.ok) throw new Error(payload.message || 'Projects could not be loaded.')
        return payload
      })
      .then(res => {
        if (res.success && res.data) {
          const mongoProjects = res.data.map(p => ({
            ...p,
            id: p._id || p.id
          }))
          setProjects(mongoProjects)
        }
      })
      .catch(error => {
        console.warn('Projects fallback notice:', error)
      })
      .finally(() => setLoading(false))
  }, [])

  // Delete project handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this animated video from your history?')) return

    try {
      const response = await fetch(`/api/projects/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.message || 'Project could not be deleted.')
    } catch (err) {
      window.alert(err.message || 'Project could not be deleted.')
      return
    }

    const updated = projects.filter(p => p.id !== id)
    setProjects(updated)
  }

  return (
    <AppShell title="Animated Videos & Project Showcase">

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0, color: '#F8FAFC' }}>
              🎬 Animated Videos ({projects.length})
            </h1>
            <span style={{
              background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B',
              padding: '4px 12px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 800, border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              AI Story Cinema
            </span>
          </div>
          <p style={{ color: '#94A3B8', margin: 0, fontSize: '0.92rem' }}>
            All generated AI animated videos converted from stories, character scripts, and multi-scene cinematic storyboards.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/stories" style={{
            padding: '12px 22px', background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#F8FAFC', borderRadius: 50, fontWeight: 700, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.88rem'
          }}>
            📚 Browse Story Library
          </Link>
          <Link to="/generate" style={{
            padding: '12px 24px', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
            color: 'white', borderRadius: 50, fontWeight: 800, textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(236,72,153,0.35)', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.88rem'
          }}>
            ✨ Studio Generator
          </Link>
        </div>
      </div>

      {/* Projects Grid View */}
      {loading ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#94A3B8' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⏳</div>
          <p>Loading your Animated Videos collection...</p>
        </div>
      ) : projects.length === 0 ? (
        <div style={{
          background: 'rgba(18, 19, 26, 0.7)', borderRadius: 24, border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '60px 24px', textAlign: 'center', maxWidth: 640, margin: '40px auto'
        }}>
          <div style={{ fontSize: '3.8rem', marginBottom: 16 }}>🎬</div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8, color: '#F8FAFC' }}>No Animated Videos Yet</h3>
          <p style={{ color: '#94A3B8', marginBottom: 28, fontSize: '0.92rem', lineHeight: 1.6 }}>
            Convert any existing story into a complete animated video with voice narration, or create a brand new story with Google Gemini AI!
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/stories" style={{
              padding: '12px 26px', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
              color: 'white', borderRadius: 50, fontWeight: 800, textDecoration: 'none',
              boxShadow: '0 4px 18px rgba(236,72,153,0.35)'
            }}>
              ✨ Generate Video from Story
            </Link>
            <Link to="/generate" style={{
              padding: '12px 24px', background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'white', borderRadius: 50, fontWeight: 700, textDecoration: 'none'
            }}>
              🛠️ Studio Generator
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {projects.map(p => (
            <div key={p.id} style={{
              background: 'rgba(18, 19, 26, 0.8)', borderRadius: 20, border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.4)', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              transition: 'transform 0.25s, border-color 0.25s'
            }}>
              <div>
                {/* Poster / Video Preview Thumbnail */}
                <div style={{ position: 'relative', height: 190, background: '#0B0F17', overflow: 'hidden' }}>
                  <img
                    src={p.poster || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'}
                    alt={p.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(10,11,14,0.95) 100%)' }} />

                  {/* Play Button Overlay */}
                  <button
                    onClick={() => {
                      setActiveVideoModal(p)
                      setSelectedSceneIdx(-1)
                    }}
                    style={{
                      position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)',
                      width: 56, height: 56, borderRadius: '50%', border: 'none',
                      background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', color: 'white', fontSize: '1.4rem',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 6px 24px rgba(236,72,153,0.5)', transition: 'transform 0.2s'
                    }}
                  >
                    ▶
                  </button>

                  <span style={{
                    position: 'absolute', bottom: 12, right: 12,
                    background: 'rgba(0,0,0,0.75)', color: '#F59E0B',
                    padding: '3px 10px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 800, fontFamily: 'monospace'
                  }}>
                    ⏱️ {p.duration || '18s'}
                  </span>

                  <span style={{
                    position: 'absolute', top: 12, left: 12,
                    background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.4)',
                    padding: '3px 10px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 800
                  }}>
                    ✓ {p.status || 'Completed'}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
                    <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', padding: '3px 10px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 800, border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                      ✨ {p.style || 'Kids Cartoon'}
                    </span>
                    <span style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4', padding: '3px 10px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 800, border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                      ⚡ {p.engineName || 'LTX Studio'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>📅 {p.date || 'Today'}</span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 8px', color: '#F8FAFC', lineHeight: 1.35 }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: '#94A3B8', margin: 0, lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.prompt || 'Custom AI Generated Animation'}
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{ padding: '0 20px 20px', display: 'flex', gap: 8 }}>
                <button
                  onClick={() => {
                    setActiveVideoModal(p)
                    setSelectedSceneIdx(-1)
                  }}
                  style={{
                    flex: 1.2, padding: '10px', background: 'linear-gradient(135deg, #10B981, #059669)',
                    color: 'white', border: 'none', borderRadius: 50, fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                  }}
                >
                  ▶ Watch Video
                </button>

                <button
                  onClick={() => navigate(`/generate?prompt=${encodeURIComponent(p.title + ': ' + (p.prompt || ''))}`)}
                  style={{
                    flex: 1, padding: '10px', background: 'rgba(255,255,255,0.06)',
                    color: '#CBD5E1', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 50, fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
                  }}
                >
                  ✏️ Studio
                </button>

                <button
                  onClick={() => handleDelete(p.id)}
                  style={{
                    padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)',
                    color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 50, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
                  }}
                  title="Delete Video"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal Player with Scene Switching */}
      {activeVideoModal && (() => {
        const hasScenes = activeVideoModal.scenes && Array.isArray(activeVideoModal.scenes) && activeVideoModal.scenes.length > 0
        const activeClipUrl = selectedSceneIdx >= 0 && hasScenes && activeVideoModal.scenes[selectedSceneIdx]?.videoUrl
          ? activeVideoModal.scenes[selectedSceneIdx].videoUrl
          : (activeVideoModal.videoUrl || '/videos/scene_1.mp4')
        const currentLabel = selectedSceneIdx >= 0 && hasScenes
          ? `Scene ${selectedSceneIdx + 1}: ${activeVideoModal.scenes[selectedSceneIdx].title || ''}`
          : 'Full Master Movie'

        return (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
          }}>
            <div style={{
              background: 'white', borderRadius: 24, width: '100%', maxWidth: 760, overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '2px solid #FFE0B2'
            }}>
              <div style={{ padding: '16px 24px', background: '#FFFBF0', borderBottom: '1px solid #FFE0B2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontWeight: 800, color: '#1A1A2E' }}>🎬 {activeVideoModal.title}</h3>
                  <div style={{ fontSize: '0.78rem', color: '#D97706', fontWeight: 700, marginTop: 2 }}>
                    {currentLabel} • Engine: {activeVideoModal.engineName || 'AnimVerse Free AI Video Studio'}
                  </div>
                </div>
                <button onClick={() => setActiveVideoModal(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#9090A0' }}>✕</button>
              </div>

              {/* Scene Navigation Selector */}
              {hasScenes && (
                <div style={{ padding: '10px 20px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', gap: 8, alignItems: 'center', overflowX: 'auto' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', whiteSpace: 'nowrap' }}>Playback:</span>
                  <button
                    onClick={() => setSelectedSceneIdx(-1)}
                    style={{
                      padding: '5px 12px', borderRadius: 20, border: 'none',
                      background: selectedSceneIdx === -1 ? '#E63946' : '#E2E8F0',
                      color: selectedSceneIdx === -1 ? 'white' : '#1A1A2E',
                      fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap'
                    }}
                  >
                    🎬 Full Movie
                  </button>
                  {activeVideoModal.scenes.map((sc, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSceneIdx(i)}
                      style={{
                        padding: '5px 12px', borderRadius: 20, border: 'none',
                        background: selectedSceneIdx === i ? '#E63946' : '#E2E8F0',
                        color: selectedSceneIdx === i ? 'white' : '#1A1A2E',
                        fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap'
                      }}
                    >
                      Scene {i + 1}
                    </button>
                  ))}
                </div>
              )}

              <div style={{ background: '#0F172A', padding: 0 }}>
                <video
                  key={activeClipUrl}
                  controls
                  autoPlay
                  loop
                  style={{ width: '100%', height: 400, objectFit: 'contain' }}
                  src={activeClipUrl}
                  poster={activeVideoModal.poster}
                />
              </div>

              <div style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <a href={activeClipUrl} download style={{
                  padding: '10px 20px', background: 'linear-gradient(135deg,#E63946,#C1121F)',
                  color: 'white', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem'
                }}>
                  📥 Download MP4 ({selectedSceneIdx === -1 ? 'Full Movie' : `Scene ${selectedSceneIdx + 1}`})
                </a>

                <button onClick={() => setActiveVideoModal(null)} style={{ padding: '10px 20px', background: '#F0F0F5', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}>
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )
      })()}

    </AppShell>
  )
}
