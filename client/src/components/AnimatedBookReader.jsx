import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * AnimatedBookReader - A realistic, animated skeuomorphic book reader component
 * Supports multi-page stories with smooth 3D page flip effect, page numbers,
 * authentic parchment & dark leather themes, realistic page turn sound synthesis,
 * text-to-speech audio narration, bookmarks, and direct "Animate Scene" button.
 */
export default function AnimatedBookReader({
  story,
  onClose,
  initialPage = 0
}) {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState('next') // 'next' or 'prev'
  const [bookTheme, setBookTheme] = useState('parchment') // 'parchment' | 'midnight' | 'sepia'
  const [fontSize, setFontSize] = useState(17)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const bookContainerRef = useRef(null)

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

  // Robust parsing of story pages from any data format (pages, fullContent, content, description)
  const parseStoryPages = (st) => {
    if (!st) return [{ chapter: 'Chapter 1', title: 'The Beginning', content: ['Once upon a time...'] }]

    // 1. If story.pages is a non-empty array with valid content
    if (Array.isArray(st.pages) && st.pages.length > 0) {
      const valid = st.pages.map((p, idx) => {
        let contentArr = []
        if (Array.isArray(p.content)) {
          contentArr = p.content.filter(c => typeof c === 'string' && c.trim())
        } else if (typeof p.content === 'string' && p.content.trim()) {
          contentArr = p.content.split(/\r?\n\s*\r?\n|\r?\n/).map(c => c.trim()).filter(Boolean)
        }
        return {
          chapter: p.chapter || `Chapter ${idx + 1}`,
          title: p.title || p.chapter || `Act ${idx + 1}`,
          content: contentArr
        }
      }).filter(p => p.content.length > 0)

      if (valid.length > 0) return valid
    }

    // 2. If story.fullContent is an array of paragraph texts
    if (Array.isArray(st.fullContent) && st.fullContent.length > 0) {
      const validTexts = st.fullContent.filter(t => typeof t === 'string' && t.trim())
      if (validTexts.length > 0) {
        return validTexts.map((text, i) => ({
          chapter: `Chapter ${i + 1}`,
          title: `Part ${i + 1}`,
          content: text.split(/\r?\n\s*\r?\n|\r?\n/).map(c => c.trim()).filter(Boolean)
        }))
      }
    }

    // 3. If story.content or description is a full multi-paragraph text
    const rawText = (typeof st.content === 'string' && st.content.trim())
      ? st.content.trim()
      : ((typeof st.description === 'string' && st.description.trim()) || (typeof st.desc === 'string' && st.desc.trim()) || '')

    if (rawText) {
      const paras = rawText.split(/\r?\n\s*\r?\n|\r?\n/).map(p => p.trim()).filter(Boolean)
      if (paras.length >= 2) {
        const generatedPages = []
        for (let i = 0; i < paras.length; i += 2) {
          const chunk = paras.slice(i, i + 2)
          const chNum = Math.floor(i / 2) + 1
          generatedPages.push({
            chapter: `Chapter ${chNum}`,
            title: chNum === 1 ? 'The Awakening' : chNum === 2 ? 'The Deep Adventure' : chNum === 3 ? 'The Decisive Climax' : `Journey Continued`,
            content: chunk
          })
        }
        return generatedPages
      }
      return [{
        chapter: 'Chapter 1',
        title: st.title || 'The Beginning',
        content: paras.length > 0 ? paras : [rawText]
      }]
    }

    return [{ chapter: 'Chapter 1', title: st.title || 'The Story', content: ['Once upon a time, an enchanting story began...'] }]
  }

  const pages = parseStoryPages(story)
  const totalPages = Math.max(1, pages.length)

  // Realistic synthesized page turn sound using Web Audio API
  const playPageTurnSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const bufferSize = ctx.sampleRate * 0.12 // 120ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        // Filtered white noise with envelope simulating paper rustle
        const envelope = Math.sin((i / bufferSize) * Math.PI)
        data[i] = (Math.random() * 2 - 1) * envelope * 0.15
      }
      const noise = ctx.createBufferSource()
      noise.buffer = buffer
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(800, ctx.currentTime)
      filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.12)
      noise.connect(filter)
      filter.connect(ctx.destination)
      noise.start()
    } catch {
      // AudioContext fallback
    }
  }

  // Handle Page navigation with 3D animation
  const goToPage = (newIndex, dir = 'next') => {
    if (newIndex < 0 || newIndex >= totalPages || isFlipping) return
    setIsFlipping(true)
    setFlipDirection(dir)
    playPageTurnSound()

    // Stop speech if switching pages
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsPlayingAudio(false)
    }

    setTimeout(() => {
      setCurrentPage(newIndex)
      setIsFlipping(false)
    }, 450)
  }

  const nextPage = () => goToPage(currentPage + 1, 'next')
  const prevPage = () => goToPage(currentPage - 1, 'prev')

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        nextPage()
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        prevPage()
      } else if (e.key === 'Escape' && onClose) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, totalPages, isFlipping])

  // Check saved bookmark
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(`animverse_bookmark_${story?.id}`) || 'null')
      if (saved && saved.page === currentPage) {
        setIsBookmarked(true)
      } else {
        setIsBookmarked(false)
      }
    } catch {
      setIsBookmarked(false)
    }
  }, [currentPage, story?.id])

  const toggleBookmark = () => {
    const nextState = !isBookmarked
    setIsBookmarked(nextState)
    if (nextState) {
      localStorage.setItem(`animverse_bookmark_${story?.id}`, JSON.stringify({
        storyId: story?.id,
        title: story?.title,
        page: currentPage,
        date: new Date().toISOString()
      }))
    } else {
      localStorage.removeItem(`animverse_bookmark_${story?.id}`)
    }
  }

  // Text-To-Speech read aloud
  const toggleAudioNarration = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.')
      return
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel()
      setIsPlayingAudio(false)
      return
    }

    window.speechSynthesis.cancel()
    const activePageData = pages[currentPage]
    const contentText = Array.isArray(activePageData?.content)
      ? activePageData.content.join(' ')
      : (activePageData?.content || '')
    const fullSpeech = `${activePageData?.chapter || ''}. ${activePageData?.title || ''}. ${contentText}`

    const utterance = new SpeechSynthesisUtterance(fullSpeech)
    utterance.rate = 0.95
    utterance.pitch = story?.audience === 'Kids' ? 1.1 : 0.98
    utterance.onend = () => setIsPlayingAudio(false)
    utterance.onerror = () => setIsPlayingAudio(false)

    window.speechSynthesis.speak(utterance)
    setIsPlayingAudio(true)
  }

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const currentData = pages[currentPage] || {}
  const paragraphs = Array.isArray(currentData.content) ? currentData.content : [currentData.content || '']

  // Theme palettes
  const themes = {
    parchment: {
      cover: 'linear-gradient(135deg, #2A1810 0%, #170F0B 100%)',
      spine: '#1A0E08',
      bookBg: '#FDFBF7',
      pageEdge: '#EDE5D8',
      textColor: '#2C2523',
      subColor: '#786A65',
      accentColor: '#B45309',
      border: 'rgba(120, 106, 101, 0.25)',
      pageShadow: 'inset 25px 0 35px -10px rgba(0,0,0,0.08), inset -25px 0 35px -10px rgba(0,0,0,0.08)',
      ribbon: '#DC2626'
    },
    sepia: {
      cover: 'linear-gradient(135deg, #3A2312 0%, #20130A 100%)',
      spine: '#1F1208',
      bookBg: '#F4ECD8',
      pageEdge: '#E4D5B7',
      textColor: '#362B24',
      subColor: '#7A6B5D',
      accentColor: '#92400E',
      border: 'rgba(122, 107, 93, 0.25)',
      pageShadow: 'inset 25px 0 35px -10px rgba(0,0,0,0.1), inset -25px 0 35px -10px rgba(0,0,0,0.1)',
      ribbon: '#B45309'
    },
    midnight: {
      cover: 'linear-gradient(135deg, #0F172A 0%, #030712 100%)',
      spine: '#020617',
      bookBg: '#13151F',
      pageEdge: '#1E2235',
      textColor: '#E2E8F0',
      subColor: '#94A3B8',
      accentColor: '#F59E0B',
      border: 'rgba(255, 255, 255, 0.08)',
      pageShadow: 'inset 25px 0 35px -10px rgba(0,0,0,0.4), inset -25px 0 35px -10px rgba(0,0,0,0.4)',
      ribbon: '#F59E0B'
    }
  }

  const activeTheme = themes[bookTheme]

  const handleAnimatePage = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    const promptText = `${story?.title} - ${currentData.title || ''}: ${paragraphs[0] || ''}`
    navigate(`/generate?prompt=${encodeURIComponent(promptText)}&style=${story?.audience === 'Kids' ? 'Kids Cartoon' : 'Cinematic 8K'}`)
  }

  return (
    <div
      ref={bookContainerRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(5, 7, 12, 0.92)', backdropFilter: 'blur(20px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: isFullscreen ? '0' : '20px 24px', overflowY: 'auto'
      }}
    >
      {/* ── TOP CONTROL BAR ── */}
      <div style={{
        width: '100%', maxWidth: 1040, display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12, color: 'white'
      }}>
        {/* Story Title & Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#F59E0B', padding: '4px 14px', borderRadius: 50, fontSize: '0.75rem',
            fontWeight: 800, fontFamily: 'monospace'
          }}>
            ORIGINAL BOOK READER
          </div>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F8FAFC' }}>
            {story?.title}
          </span>
          <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
            by {story?.author}
          </span>
        </div>

        {/* Toolbar Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Watch Animation Video */}
          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel()
              setShowVideoModal(true)
            }}
            title="Watch full animation video of this book"
            style={{
              padding: '8px 16px', borderRadius: 50,
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              border: 'none', color: '#0A0B0E',
              cursor: 'pointer', fontSize: '0.82rem', fontWeight: 800,
              display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: '0 2px 10px rgba(245,158,11,0.35)'
            }}
          >
            <span>🎬 Watch Animation</span>
          </button>

          {/* Audio Narration */}
          <button
            onClick={toggleAudioNarration}
            title={isPlayingAudio ? 'Stop Reading Aloud' : 'Read Page Aloud'}
            style={{
              padding: '8px 16px', borderRadius: 50,
              background: isPlayingAudio ? '#EF4444' : 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)', color: 'white',
              cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s'
            }}
          >
            <span>{isPlayingAudio ? '■ Stop Audio' : '▶ Audio Voice'}</span>
          </button>

          {/* Bookmark */}
          <button
            onClick={toggleBookmark}
            title="Bookmark this page"
            style={{
              padding: '8px 14px', borderRadius: 50,
              background: isBookmarked ? '#F59E0B' : 'rgba(255,255,255,0.08)',
              border: `1px solid ${isBookmarked ? '#F59E0B' : 'rgba(255,255,255,0.15)'}`,
              color: isBookmarked ? '#0A0B0E' : 'white', cursor: 'pointer',
              fontSize: '0.82rem', fontWeight: 800
            }}
          >
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>

          {/* Theme Switcher */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 50, padding: 3, border: '1px solid rgba(255,255,255,0.1)' }}>
            {[
              { id: 'parchment', label: 'Parchment' },
              { id: 'sepia', label: 'Sepia' },
              { id: 'midnight', label: 'Dark' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setBookTheme(t.id)}
                style={{
                  padding: '5px 12px', borderRadius: 50, border: 'none',
                  background: bookTheme === t.id ? '#F59E0B' : 'transparent',
                  color: bookTheme === t.id ? '#0A0B0E' : '#94A3B8',
                  fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Font Size */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 50, padding: '2px 8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              onClick={() => setFontSize(s => Math.max(14, s - 1))}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 800, padding: '4px 6px' }}>
              A-
            </button>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', minWidth: 20, textAlign: 'center' }}>{fontSize}</span>
            <button
              onClick={() => setFontSize(s => Math.min(24, s + 1))}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 800, padding: '4px 6px' }}>
              A+
            </button>
          </div>

          {/* Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              style={{
                width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── 3D REALISTIC BOOK CONTAINER ── */}
      <div style={{
        position: 'relative', width: '100%', maxWidth: 1040, minHeight: 620,
        perspective: '1800px', display: 'flex', justifyContent: 'center', alignItems: 'center'
      }}>
        {/* Leather Hardcover Casing */}
        <div style={{
          position: 'relative', width: '100%', minHeight: 610,
          background: activeTheme.cover,
          borderRadius: 20,
          boxShadow: '0 30px 80px rgba(0,0,0,0.85), inset 0 0 0 2px rgba(255,255,255,0.08), 0 0 50px rgba(0,0,0,0.5)',
          padding: '16px 20px',
          display: 'flex',
          border: '3px solid #3F2C20'
        }}>
          {/* Gold Embossed Corner Accents */}
          <div style={{ position: 'absolute', top: 8, left: 8, width: 24, height: 24, borderTop: '3px solid #D97706', borderLeft: '3px solid #D97706', borderRadius: '4px 0 0 0', opacity: 0.6 }} />
          <div style={{ position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderTop: '3px solid #D97706', borderRight: '3px solid #D97706', borderRadius: '0 4px 0 0', opacity: 0.6 }} />
          <div style={{ position: 'absolute', bottom: 8, left: 8, width: 24, height: 24, borderBottom: '3px solid #D97706', borderLeft: '3px solid #D97706', borderRadius: '0 0 0 4px', opacity: 0.6 }} />
          <div style={{ position: 'absolute', bottom: 8, right: 8, width: 24, height: 24, borderBottom: '3px solid #D97706', borderRight: '3px solid #D97706', borderRadius: '0 0 4px 0', opacity: 0.6 }} />

          {/* Book Spine (Middle Valley) */}
          <div style={{
            position: 'absolute', top: 14, bottom: 14, left: '50%', transform: 'translateX(-50%)',
            width: 32, background: 'linear-gradient(to right, rgba(0,0,0,0.4), rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.4))',
            zIndex: 20, pointerEvents: 'none', borderLeft: '1px solid rgba(0,0,0,0.3)', borderRight: '1px solid rgba(0,0,0,0.3)'
          }} />

          {/* Bookmark Ribbon */}
          {isBookmarked && (
            <div style={{
              position: 'absolute', top: 0, left: '49%', width: 18, height: 90,
              background: activeTheme.ribbon, zIndex: 25, boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)'
            }} />
          )}

          {/* ── TWO-PAGE SPREAD ── */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%',
            background: activeTheme.pageEdge, borderRadius: 12, overflow: 'hidden',
            boxShadow: 'inset 0 0 12px rgba(0,0,0,0.25)', position: 'relative'
          }}>

            {/* ── LEFT PAGE (Illustration / Chapter Overview / Context) ── */}
            <div
              onClick={prevPage}
              style={{
                background: activeTheme.bookBg,
                padding: '48px 42px 42px',
                borderRight: '1px solid ' + activeTheme.border,
                boxShadow: activeTheme.pageShadow,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                position: 'relative', cursor: currentPage > 0 ? 'pointer' : 'default',
                userSelect: 'none'
              }}
            >
              {/* Header */}
              <div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderBottom: `1px solid ${activeTheme.border}`, paddingBottom: 10, marginBottom: 24
                }}>
                  <span style={{ fontSize: '0.76rem', color: activeTheme.subColor, textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'monospace' }}>
                    {story?.title}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: activeTheme.accentColor, fontWeight: 700, fontFamily: 'Georgia, serif' }}>
                    {currentData.chapter || `Chapter ${currentPage + 1}`}
                  </span>
                </div>

                {/* Chapter Title */}
                <h2 style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: '1.8rem', fontWeight: 700, color: activeTheme.textColor,
                  margin: '0 0 16px', lineHeight: 1.2
                }}>
                  {currentData.title || `Act ${currentPage + 1}`}
                </h2>

                {/* Decorative Thematic Vignette / Story Art Card */}
                <div style={{
                  height: 180, borderRadius: 14, overflow: 'hidden', margin: '20px 0',
                  background: story?.coverImage ? `url(${story.coverImage}) center/cover no-repeat` : activeTheme.cover,
                  border: `1px solid ${activeTheme.border}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
                  padding: 16, textAlign: 'center', position: 'relative'
                }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }} />
                  <div style={{ position: 'relative', zIndex: 1, fontSize: '0.85rem', color: '#F8FAFC', fontWeight: 700, maxWidth: 280 }}>
                    "{currentData.title || story?.title}"
                  </div>
                  <div style={{ position: 'relative', zIndex: 1, fontSize: '0.72rem', color: '#94A3B8', marginTop: 4, fontFamily: 'monospace' }}>
                    {story?.genre} • {story?.audience}
                  </div>
                </div>

                {/* Chapter Synopsis Paragraph */}
                <p style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: `${Math.max(14, fontSize - 2)}px`,
                  lineHeight: 1.7, color: activeTheme.subColor, fontStyle: 'italic', margin: 0
                }}>
                  {paragraphs[0] ? paragraphs[0].slice(0, 160) + '...' : ''}
                </p>
              </div>

              {/* Left Page Footer & Page Number */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderTop: `1px solid ${activeTheme.border}`, paddingTop: 14, marginTop: 20
              }}>
                <button
                  disabled={currentPage === 0}
                  onClick={(e) => { e.stopPropagation(); prevPage(); }}
                  style={{
                    padding: '6px 14px', borderRadius: 20, border: `1px solid ${activeTheme.border}`,
                    background: 'transparent', color: currentPage === 0 ? activeTheme.subColor + '60' : activeTheme.textColor,
                    fontSize: '0.78rem', fontWeight: 700, cursor: currentPage === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  ◀ Previous Page
                </button>

                <div style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: '0.85rem', color: activeTheme.subColor, fontWeight: 700
                }}>
                  Page {currentPage * 2 + 1}
                </div>
              </div>
            </div>

            {/* ── RIGHT PAGE (Full Narrative Prose with Animated 3D Turn) ── */}
            <div
              onClick={nextPage}
              style={{
                background: activeTheme.bookBg,
                padding: '48px 46px 42px',
                boxShadow: activeTheme.pageShadow,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                position: 'relative', cursor: currentPage < totalPages - 1 ? 'pointer' : 'default',
                transformOrigin: 'left center',
                transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.45s ease',
                transform: isFlipping ? (flipDirection === 'next' ? 'rotateY(-25deg)' : 'rotateY(25deg)') : 'none',
                userSelect: 'none'
              }}
            >
              {/* Top Page Subtitle */}
              <div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderBottom: `1px solid ${activeTheme.border}`, paddingBottom: 10, marginBottom: 24
                }}>
                  <span style={{ fontSize: '0.78rem', color: activeTheme.accentColor, fontWeight: 700, fontFamily: 'Georgia, serif' }}>
                    {currentData.title || `Act ${currentPage + 1}`}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: activeTheme.subColor, fontFamily: 'monospace' }}>
                    {story?.readTime || '8 min read'}
                  </span>
                </div>

                {/* Story Prose Paragraphs */}
                <div style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: 1.85,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  color: activeTheme.textColor,
                  maxHeight: 380,
                  overflowY: 'auto',
                  paddingRight: 6
                }}>
                  {paragraphs.map((p, idx) => (
                    <p key={idx} style={{ marginBottom: 18, textIndent: idx > 0 ? '1.5em' : '0' }}>
                      {idx === 0 && (
                        <span style={{
                          float: 'left',
                          fontSize: '3.3rem',
                          lineHeight: 0.8,
                          padding: '4px 8px 0 0',
                          fontFamily: "Georgia, 'Times New Roman', serif",
                          fontWeight: 700,
                          color: activeTheme.accentColor
                        }}>
                          {p.charAt(0)}
                        </span>
                      )}
                      {idx === 0 ? p.slice(1) : p}
                    </p>
                  ))}
                </div>
              </div>

              {/* Right Page Footer & Navigation */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderTop: `1px solid ${activeTheme.border}`, paddingTop: 14, marginTop: 16,
                flexWrap: 'wrap', gap: 8
              }}>
                <div style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: '0.85rem', color: activeTheme.subColor, fontWeight: 700,
                  whiteSpace: 'nowrap'
                }}>
                  Page {currentPage * 2 + 2} of {totalPages * 2}
                </div>

                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowVideoModal(true); }}
                    style={{
                      padding: '6px 12px', borderRadius: 20,
                      border: `1.5px solid ${activeTheme.accentColor}`,
                      background: 'rgba(245,158,11,0.12)', color: activeTheme.accentColor,
                      fontSize: '0.76rem', fontWeight: 800, cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    🎬 Watch Video
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleAnimatePage(); }}
                    style={{
                      padding: '6px 14px', borderRadius: 20, border: 'none',
                      background: '#F59E0B', color: '#0A0B0E',
                      fontSize: '0.76rem', fontWeight: 800, cursor: 'pointer',
                      boxShadow: '0 3px 10px rgba(245, 158, 11, 0.3)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Animate in Studio →
                  </button>

                  <button
                    disabled={currentPage >= totalPages - 1}
                    onClick={(e) => { e.stopPropagation(); nextPage(); }}
                    style={{
                      padding: '6px 12px', borderRadius: 20, border: `1px solid ${activeTheme.border}`,
                      background: 'transparent', color: currentPage >= totalPages - 1 ? activeTheme.subColor + '60' : activeTheme.textColor,
                      fontSize: '0.76rem', fontWeight: 700, cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Next Page ▶
                  </button>
                </div>
              </div>

              {/* Animated Corner Turn Cue / Dog-Ear */}
              {currentPage < totalPages - 1 && (
                <div
                  title="Click to turn to next page"
                  style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 32, height: 32,
                    background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.2) 100%)',
                    cursor: 'pointer', borderTopLeftRadius: 6,
                    boxShadow: '-2px -2px 5px rgba(0,0,0,0.08)'
                  }}
                />
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── BOTTOM CHAPTER PROGRESS & QUICK SELECTOR ── */}
      <div style={{
        width: '100%', maxWidth: 1040, marginTop: 18, display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'monospace', textTransform: 'uppercase' }}>
            Book Progression:
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            {pages.map((p, idx) => (
              <button
                key={idx}
                onClick={() => goToPage(idx, idx > currentPage ? 'next' : 'prev')}
                title={`Go to ${p.title || `Part ${idx + 1}`}`}
                style={{
                  width: 30, height: 30, borderRadius: 8, border: 'none',
                  background: currentPage === idx ? '#F59E0B' : 'rgba(255,255,255,0.08)',
                  color: currentPage === idx ? '#0A0B0E' : '#94A3B8',
                  fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
          Use <kbd style={{ background: 'rgba(255,255,255,0.12)', padding: '2px 6px', borderRadius: 4, color: 'white' }}>◀</kbd> and <kbd style={{ background: 'rgba(255,255,255,0.12)', padding: '2px 6px', borderRadius: 4, color: 'white' }}>▶</kbd> arrow keys to turn pages
        </div>
      </div>

      {/* ── IN-BOOK CINEMA ANIMATION MODAL ── */}
      {showVideoModal && (
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
            {/* Modal Header */}
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
                onClick={() => setShowVideoModal(false)}
                style={{
                  width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                  border: 'none', color: 'white', cursor: 'pointer', fontWeight: 800, fontSize: '1.1rem'
                }}
              >
                ✕
              </button>
            </div>

            {/* Video Player */}
            <div style={{ position: 'relative', width: '100%', background: '#000', maxHeight: 460 }}>
              <video
                controls
                autoPlay
                src={storyVideoSrc}
                poster={story?.coverImage}
                style={{ width: '100%', maxHeight: 460, objectFit: 'contain' }}
              />
            </div>

            {/* Modal Footer */}
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
                <button
                  onClick={() => {
                    setShowVideoModal(false);
                    handleAnimatePage();
                  }}
                  style={{
                    padding: '8px 18px', borderRadius: 50, background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)', color: 'white',
                    fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
                  }}
                >
                  Open in Generator Studio ↗
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
