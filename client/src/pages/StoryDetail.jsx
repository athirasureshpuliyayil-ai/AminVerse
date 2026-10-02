import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { getStoryById } from './StoryLibrary'
import AnimatedBookReader from '../components/AnimatedBookReader'
import { getToken } from '../utils/authStorage'

export const normalizeStoryData = (st) => {
  if (!st) return st
  let pages = st.pages || []
  if (!Array.isArray(pages) || pages.length === 0 || pages.every(p => !p.content || p.content.length === 0)) {
    const raw = (typeof st.content === 'string' && st.content.trim())
      ? st.content.trim()
      : ((typeof st.description === 'string' && st.description.trim()) || (typeof st.desc === 'string' && st.desc.trim()) || '')
    if (raw) {
      const paras = raw.split(/\r?\n\s*\r?\n|\r?\n/).map(p => p.trim()).filter(Boolean)
      pages = []
      for (let i = 0; i < paras.length; i += 2) {
        const chunk = paras.slice(i, i + 2)
        const chNum = Math.floor(i / 2) + 1
        pages.push({
          chapter: `Chapter ${chNum}`,
          title: chNum === 1 ? 'The Journey Begins' : chNum === 2 ? 'The Deep Adventure' : chNum === 3 ? 'The Decisive Climax' : `Journey Continued`,
          content: chunk
        })
      }
      if (pages.length === 0) {
        pages = [{ chapter: 'Chapter 1', title: st.title || 'Beginning', content: [raw] }]
      }
    }
  }
  return {
    ...st,
    id: st._id || st.id,
    desc: st.desc || st.description || (pages[0]?.content?.[0] ? pages[0].content[0].slice(0, 160) + '...' : 'AnimVerse Story'),
    audience: st.audience || (st.ageGroup === 'kids' ? 'Kids' : 'All'),
    pages: pages.length > 0 ? pages : [{ chapter: 'Chapter 1', title: st.title || 'Beginning', content: ['Story content...'] }]
  }
}

export default function StoryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [story, setStory] = useState(() => normalizeStoryData(getStoryById(id)))
  const [hasTheatre, setHasTheatre] = useState(false)
  const [showAnimatedBook, setShowAnimatedBook] = useState(true)
  const [showCinemaModal, setShowCinemaModal] = useState(false)
  const [isRenderingVideo, setIsRenderingVideo] = useState(false)
  const [animationProgress, setAnimationProgress] = useState({ step: 1, text: '', pct: 10 })
  const [animationResult, setAnimationResult] = useState(null)
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 4500)
  }

  const handleStartVideoGeneration = async (targetStory) => {
    const st = targetStory || story
    if (!st) return
    setAnimationResult(null)
    setIsRenderingVideo(true)
    setAnimationProgress({ step: 1, text: '🧠 Analyzing Story Characters, Chapters & Script...', pct: 20 })

    const t1 = setTimeout(() => {
      setAnimationProgress({ step: 2, text: '🎬 Generating Multi-Scene Storyboard & Camera Angles...', pct: 45 })
    }, 600)

    const t2 = setTimeout(() => {
      setAnimationProgress({ step: 3, text: '🎙️ Synthesizing Spoken Dialogue & Cinematic Narration...', pct: 70 })
    }, 1200)

    const t3 = setTimeout(() => {
      setAnimationProgress({ step: 4, text: '🎥 Rendering Neural AI Animation Video Clips...', pct: 88 })
    }, 1800)

    try {
      const token = getToken()
      const headers = { 'Content-Type': 'application/json' }
      if (token) headers.Authorization = `Bearer ${token}`

      const res = await fetch('/api/generate/story-to-video', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          storyId: st._id || st.id,
          storyData: st,
          style: (st.audience === 'Kids' || st.ageGroup === 'kids') ? 'Kids Cartoon' : 'Cinematic 8K',
          animationStyle: (st.audience === 'Kids' || st.ageGroup === 'kids') ? 'cartoon' : 'cinematic'
        })
      })

      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)

      const json = await res.json()
      if (json.success && json.data) {
        setAnimationProgress({ step: 5, text: '✨ 100% Animation Render Complete! Loading Video...', pct: 100 })
        setTimeout(() => {
          setIsRenderingVideo(false)
          setAnimationResult(json.data)
          showToast('🎬 Animated Video generated & added to Animated Videos!')
        }, 600)
      } else {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
        showToast(json.message || 'Video generation failed')
        setIsRenderingVideo(false)
      }
    } catch (err) {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      console.error(err)
      showToast('Error during AI animation synthesis.')
      setIsRenderingVideo(false)
    }
  }

  useEffect(() => {
    if (!/^[a-f\d]{24}$/i.test(id)) return
    const headers = {}
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`

    fetch(`/api/stories/${id}`)
      .then(response => response.json())
      .then(payload => {
        if (payload.success && payload.data) {
          const normalized = normalizeStoryData(payload.data)
          setStory(normalized)
          return fetch(`/api/theatre/story/${id}`, { headers })
        }
        return null
      })
      .then(response => response?.json())
      .then(payload => setHasTheatre(Boolean(payload?.success && payload.data)))
      .catch(() => setHasTheatre(false))
  }, [id])

  const STORY_VIDEOS = {
    "the brave little rabbit": "/videos/scene_rabbit.mp4",
    "the golden lantern": "/videos/scene_2.mp4",
    "midnight at blackwood manor": "/videos/scene_4.mp4",
    "echoes of the quantum void": "/videos/scene_cyber.mp4",
    "stars of the deep ocean": "/videos/scene_ocean.mp4",
    "oliver the owl's midnight school": "/videos/scene_owl.mp4"
  }
  const storyKey = story?.title?.toLowerCase()?.trim() || ''
  const getThematicVideo = (st) => {
    if (st?.videoUrl && !st.videoUrl.startsWith('blob:')) return st.videoUrl
    const k = st?.title?.toLowerCase()?.trim() || ''
    if (STORY_VIDEOS[k]) return STORY_VIDEOS[k]
    if (k.includes('owl') || k.includes('oliver') || k.includes('midnight school') || k.includes('nocturnal')) return '/videos/scene_owl.mp4'
    if (k.includes('ocean') || k.includes('fish') || k.includes('sea')) return '/videos/scene_ocean.mp4'
    if (k.includes('rabbit') || k.includes('bunny') || k.includes('forest')) return '/videos/scene_rabbit.mp4'
    if (k.includes('cyber') || k.includes('quantum') || k.includes('void')) return '/videos/scene_cyber.mp4'
    if (k.includes('dragon') || k.includes('pyrrhus')) return '/videos/scene_dragon.mp4'
    return '/videos/scene_1.mp4'
  }
  const storyVideoSrc = getThematicVideo(story)

  return (
    <AppShell title={`Story Book — ${story.title}`}>
      {/* Return to Library bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <button
          onClick={() => navigate('/stories')}
          style={{
            padding: '9px 20px', borderRadius: 50, border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.05)', color: '#F8FAFC', fontWeight: 700, fontSize: '0.85rem',
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8
          }}>
          ← Back to Story Library
        </button>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {hasTheatre && (
            <button
              onClick={() => navigate(`/stories/${id}/theatre`)}
              style={{ padding: '10px 18px', borderRadius: 50, border: '1px solid rgba(201,180,129,.55)', background: 'rgba(201,180,129,.12)', color: '#E3CC96', fontWeight: 800, fontSize: '.88rem', cursor: 'pointer' }}>
              🎭 Story Theatre
            </button>
          )}

          <button
            onClick={() => handleStartVideoGeneration(story)}
            style={{
              padding: '10px 22px', borderRadius: 50, border: 'none',
              background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', color: 'white', fontWeight: 800, fontSize: '0.88rem',
              cursor: 'pointer', boxShadow: '0 4px 18px rgba(236,72,153,0.35)',
              display: 'inline-flex', alignItems: 'center', gap: 8
            }}>
            ✨ Generate Animated Video
          </button>

          <button
            onClick={() => setShowCinemaModal(true)}
            style={{
              padding: '10px 20px', borderRadius: 50, border: 'none',
              background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', fontWeight: 800, fontSize: '0.88rem',
              cursor: 'pointer', boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
              display: 'inline-flex', alignItems: 'center', gap: 8
            }}>
            🎬 Watch Video
          </button>

          <button
            onClick={() => setShowAnimatedBook(true)}
            style={{
              padding: '10px 24px', borderRadius: 50, border: 'none',
              background: '#F59E0B', color: '#0A0B0E', fontWeight: 800, fontSize: '0.88rem',
              cursor: 'pointer', boxShadow: '0 4px 16px rgba(245,158,11,0.3)',
              display: 'inline-flex', alignItems: 'center', gap: 8
            }}>
            📖 Open 3D Book
          </button>
        </div>
      </div>

      {/* Main Story Overview Card */}
      <div style={{
        background: 'rgba(18, 19, 26, 0.85)', backdropFilter: 'blur(20px)',
        borderRadius: 24, border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 15px 40px rgba(0,0,0,0.6)', padding: 40, maxWidth: 900, margin: '0 auto',
        color: '#F8FAFC'
      }}>
        {/* Banner with Genre & Audience */}
        <div style={{
          height: 180, borderRadius: 18,
          background: `linear-gradient(135deg, ${story.color}25, #0A0B0E)`,
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          fontSize: '4.5rem', marginBottom: 28, position: 'relative'
        }}>
          {story.icon}
          <div style={{
            position: 'absolute', bottom: 12, right: 16,
            background: 'rgba(0,0,0,0.7)', padding: '5px 14px', borderRadius: 50,
            fontSize: '0.75rem', color: '#F59E0B', fontWeight: 800, fontFamily: 'monospace'
          }}>
            {(story.pages?.length || 6) * 2} PHYSICAL BOOK PAGES
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ padding: '5px 14px', borderRadius: 50, background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '0.78rem', fontWeight: 800, fontFamily: 'monospace' }}>
            {story.genre}
          </span>
          <span style={{ padding: '5px 14px', borderRadius: 50, background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4', border: '1px solid rgba(6, 182, 212, 0.3)', fontSize: '0.78rem', fontWeight: 800, fontFamily: 'monospace' }}>
            {story.audience}
          </span>
          <span style={{ padding: '5px 14px', borderRadius: 50, background: 'rgba(255, 255, 255, 0.05)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.78rem', fontWeight: 700 }}>
            {story.readTime || '12 min read'}
          </span>
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '0 0 8px', color: '#F8FAFC' }}>
          {story.title}
        </h1>
        <p style={{ color: '#64748B', marginBottom: 28, fontSize: '0.95rem' }}>
          Original manuscript by {story.author}
        </p>

        {/* Story Synopses */}
        <div style={{
          fontSize: '1.08rem', lineHeight: 1.85, color: '#CBD5E1', marginBottom: 36,
          fontFamily: "Georgia, 'Times New Roman', serif"
        }}>
          <p style={{ marginBottom: 18, fontStyle: 'italic', color: '#94A3B8' }}>
            "{story.desc}"
          </p>
          {story.pages && story.pages.length > 0 ? (
            <div style={{ marginTop: 24 }}>
              <h3 style={{ fontSize: '1.1rem', color: '#F8FAFC', fontFamily: 'inherit', fontWeight: 800, marginBottom: 12 }}>
                Chapter Index ({story.pages.length} Chapters):
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                {story.pages.map((p, idx) => (
                  <div
                    key={idx}
                    onClick={() => setShowAnimatedBook(true)}
                    style={{
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 12, padding: '12px 16px', cursor: 'pointer', transition: 'all 0.2s'
                    }}>
                    <div style={{ fontSize: '0.72rem', color: '#F59E0B', fontWeight: 800, fontFamily: 'monospace' }}>
                      {p.chapter}
                    </div>
                    <div style={{ fontSize: '0.92rem', color: '#F8FAFC', fontWeight: 700, marginTop: 2 }}>
                      {p.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <button
            onClick={() => handleStartVideoGeneration(story)}
            style={{
              flex: 1.2, minWidth: 200, padding: '15px 24px', borderRadius: 50, border: 'none',
              background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', color: 'white', fontWeight: 800, fontSize: '1rem',
              cursor: 'pointer', boxShadow: '0 4px 20px rgba(236,72,153,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}>
            ✨ Generate Animated Video
          </button>

          <button
            onClick={() => setShowAnimatedBook(true)}
            style={{
              flex: 1, minWidth: 160, padding: '15px 24px', borderRadius: 50, border: 'none',
              background: '#F59E0B', color: '#0A0B0E', fontWeight: 800, fontSize: '1rem',
              cursor: 'pointer', boxShadow: '0 4px 20px rgba(245,158,11,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}>
            📖 Read in 3D Book
          </button>

          <button
            onClick={() => setShowCinemaModal(true)}
            style={{
              flex: 1, minWidth: 160, padding: '15px 24px', borderRadius: 50, border: 'none',
              background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', fontWeight: 800, fontSize: '1rem',
              cursor: 'pointer', boxShadow: '0 4px 20px rgba(16,185,129,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}>
            🎬 Watch Video
          </button>

          <Link
            to={`/generate?prompt=${encodeURIComponent(story.title + ': ' + story.desc)}`}
            style={{
              flex: 1, minWidth: 160, padding: '15px 24px', borderRadius: 50,
              background: 'linear-gradient(135deg, #06B6D4, #0891B2)', color: 'white',
              fontWeight: 800, fontSize: '1rem', textDecoration: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 20px rgba(6,182,212,0.3)'
            }}>
            🛠️ Open in Studio
          </Link>
        </div>
      </div>

      {/* ── TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 99999,
          background: 'rgba(15, 23, 42, 0.95)', border: '1px solid #10B981',
          color: '#F8FAFC', padding: '14px 22px', borderRadius: 14,
          boxShadow: '0 10px 35px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: 10,
          fontWeight: 700, fontSize: '0.92rem', backdropFilter: 'blur(12px)'
        }}>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── LIVE VIDEO GENERATION PROGRESS MODAL ── */}
      {isRenderingVideo && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100000,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #111827, #0B0F17)',
            border: '1px solid rgba(236,72,153,0.3)', borderRadius: 24,
            padding: '36px 32px', maxWidth: 520, width: '100%',
            textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 16, animation: 'pulse 1.5s infinite' }}>
              🎬
            </div>
            <h3 style={{ color: '#F8FAFC', fontSize: '1.4rem', fontWeight: 900, margin: '0 0 8px' }}>
              Creating Animated Video
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginBottom: 24 }}>
              Converting "{story?.title}" into a full multi-scene animation with voice & dialogues...
            </p>

            <div style={{
              background: 'rgba(255,255,255,0.06)', borderRadius: 50, height: 12,
              overflow: 'hidden', marginBottom: 16, border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{
                height: '100%', width: `${animationProgress.pct}%`,
                background: 'linear-gradient(90deg, #EC4899, #8B5CF6, #3B82F6)',
                borderRadius: 50, transition: 'width 0.4s ease'
              }} />
            </div>

            <div style={{ color: '#E2E8F0', fontSize: '0.86rem', fontWeight: 600, minHeight: 24 }}>
              {animationProgress.text}
            </div>

            {animationResult && (
              <div style={{ marginTop: 28, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    setIsRenderingVideo(false)
                    setShowCinemaModal(true)
                  }}
                  style={{
                    padding: '12px 24px', borderRadius: 50, border: 'none',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    color: 'white', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(16,185,129,0.3)'
                  }}>
                  ▶️ Watch Generated Video
                </button>
                <button
                  onClick={() => {
                    setIsRenderingVideo(false)
                    navigate('/videos')
                  }}
                  style={{
                    padding: '12px 22px', borderRadius: 50,
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer'
                  }}>
                  🎬 Go to Animated Videos
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CINEMA MODAL ── */}
      {showCinemaModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
        }}>
          <div style={{
            background: '#0F172A', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 20, maxWidth: 840, width: '100%', overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.85)'
          }}>
            <div style={{
              padding: '16px 24px', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 800, fontFamily: 'monospace' }}>
                  CINEMATIC STORY ANIMATION
                </span>
                <h3 style={{ margin: '2px 0 0', color: '#F8FAFC', fontSize: '1.2rem', fontWeight: 800 }}>
                  {story?.title}
                </h3>
              </div>
              <button
                onClick={() => setShowCinemaModal(false)}
                style={{
                  width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                  border: 'none', color: 'white', cursor: 'pointer', fontWeight: 800, fontSize: '1.1rem'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ position: 'relative', width: '100%', background: '#000', maxHeight: 460 }}>
              <video
                controls
                autoPlay
                src={storyVideoSrc}
                poster={story?.coverImage}
                style={{ width: '100%', maxHeight: 460, objectFit: 'contain' }}
              />
            </div>

            <div style={{
              padding: '16px 24px', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', flexWrap: 'wrap', gap: 12, background: 'rgba(15, 23, 42, 0.95)'
            }}>
              <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.85rem' }}>
                {story?.desc || 'AnimVerse Story Presentation'}
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <a
                  href={storyVideoSrc}
                  download={`${(story?.title || 'story').toLowerCase().replace(/\s+/g, '_')}_animation.mp4`}
                  style={{
                    padding: '8px 18px', borderRadius: 50, background: '#F59E0B',
                    color: '#0A0B0E', fontWeight: 800, fontSize: '0.82rem', textDecoration: 'none'
                  }}
                >
                  📥 Download Video
                </a>
                <Link
                  to={`/generate?prompt=${encodeURIComponent(story.title + ': ' + story.desc)}`}
                  style={{
                    padding: '8px 18px', borderRadius: 50, background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)', color: 'white',
                    fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none'
                  }}
                >
                  Open in Generator Studio ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── REALISTIC ANIMATED BOOK READER MODAL ── */}
      {showAnimatedBook && (
        <AnimatedBookReader
          story={story}
          onClose={() => setShowAnimatedBook(false)}
        />
      )}
    </AppShell>
  )
}
