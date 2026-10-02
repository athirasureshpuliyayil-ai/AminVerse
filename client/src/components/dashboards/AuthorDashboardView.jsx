import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getToken } from '../../utils/authStorage'
import { getStoryCover } from '../../pages/StoryLibrary'
import AnimatedBookReader from '../AnimatedBookReader'

const INITIAL_AUTHOR_STORIES = [
  {
    id: 'author-story-1',
    title: 'The Chrono Alchemist',
    genre: 'Fantasy / Sci-Fi',
    audience: 'Adults',
    ageGroup: 'adult',
    coverImage: '/images/stories/quantum_void.jpg',
    reads: 2420,
    bookmarks: 312,
    votes: 89,
    status: 'Published & Live',
    synopsis: 'A rogue chronomancer discovers a shattered relic capable of reversing timeline collapses.',
    content: [
      "In the steam-lit alleys of Oakhaven, Marcus aligned the brass gears of his Chrono-Gauntlet.",
      "The temporal storm was growing more violent by the second, tearing rifts across the cobblestone pavement.",
      "With a single spark of aether, Marcus plunged his hand into the temporal singularity to save his daughter's timeline."
    ],
    pages: [
      {
        chapter: "Chapter 1",
        title: "The Brass Chronometer",
        content: [
          "In the steam-lit alleys of Oakhaven, Marcus aligned the brass gears of his Chrono-Gauntlet. The temporal storm was growing more violent by the second, tearing rifts across the cobblestone pavement.",
          "With a single spark of aether, Marcus plunged his hand into the temporal singularity to save his daughter's timeline."
        ]
      }
    ],
    createdAt: '2026-08-20'
  },
  {
    id: 'author-story-2',
    title: 'Pipsqueak and the Cloud Castle',
    genre: 'Fairy Tale',
    audience: 'Kids',
    ageGroup: 'kids',
    coverImage: '/images/stories/owl_school.jpg',
    reads: 1840,
    bookmarks: 198,
    votes: 45,
    status: 'Published & Live',
    synopsis: 'A tiny winged squirrel embarks on a whimsical flight up to a floating castle made of cotton clouds.',
    content: [
      "Pipsqueak fluttered his tiny translucent wings as morning sunlight illuminated the treetops.",
      "High above the tallest pine tree floated the shimmering Cloud Castle of Queen Cumulus.",
      "Gathering three golden acorn seeds, Pipsqueak soared into the sky on the adventure of a lifetime."
    ],
    pages: [
      {
        chapter: "Chapter 1",
        title: "The Treetop Flight",
        content: [
          "Pipsqueak fluttered his tiny translucent wings as morning sunlight illuminated the treetops. High above the tallest pine tree floated the shimmering Cloud Castle of Queen Cumulus.",
          "Gathering three golden acorn seeds, Pipsqueak soared into the sky on the adventure of a lifetime."
        ]
      }
    ],
    createdAt: '2026-08-27'
  }
]

export default function AuthorDashboardView({ user }) {
  const navigate = useNavigate()
  const [stories, setStories] = useState([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showBroadcastModal, setShowBroadcastModal] = useState(false)
  const [broadcastSelectedStory, setBroadcastSelectedStory] = useState('')
  const [broadcastNarrator, setBroadcastNarrator] = useState(user?.name || 'Author (You)')
  const [submitting, setSubmitting] = useState(false)
  const [alertMsg, setAlertMsg] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [selectedStoryForReader, setSelectedStoryForReader] = useState(null)

  // Curated Author Radio Stations
  const AUTHOR_RADIO_STATIONS = [
    {
      id: 'aut-radio-1',
      title: 'The Writer’s Crucible: Crafting Conflict',
      category: 'Author Stories',
      narrator: 'Helena Cross',
      duration: '12:40',
      cover: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
      desc: 'Masterclass on rising action, character flaws, and world-building consistency.'
    },
    {
      id: 'aut-radio-2',
      title: 'Deep Focus Ambient Writing Waves',
      category: 'Music',
      narrator: 'AnimVerse Studio',
      duration: '22:15',
      cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      desc: 'Theta-wave binaural ambient soundscape tuned for sustained writing concentration.'
    },
    {
      id: 'aut-radio-3',
      title: 'Voice Acting & Narrating Your Audiobook',
      category: 'Literature Talks',
      narrator: 'Marcus Thorne',
      duration: '9:50',
      cover: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80',
      desc: 'Pro tips on pacing, character accents, and emotional resonance in audio narration.'
    }
  ]

  // Curated Master Literature Museum Exhibits for Authors
  const AUTHOR_MUSEUM_EXHIBITS = [
    {
      id: 'aut-m-1',
      title: 'Fyodor Dostoevsky: Internal Monologues & Psychological Pacing',
      author: 'Fyodor Dostoevsky',
      era: '19th Century • Russian Realism',
      craftFocus: 'Crafting unhinged first-person perspectives and multi-layered moral stakes.',
      image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80',
      quote: '“It takes something more than intelligence to act intelligently.”',
      note: 'A masterclass in tension: how internal character guilt drives unstoppable narrative momentum.'
    },
    {
      id: 'aut-m-2',
      title: 'William Shakespeare: Subtext & Tragic Flaw Dynamics',
      author: 'William Shakespeare',
      era: 'Elizabethan / Jacobean Era',
      craftFocus: 'Balancing multi-plot intrigue, rhythmic dialogue, and fatal character flaws (Hamartia).',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80',
      quote: '“Give sorrow words; the grief that does not speak knits up the o’er-wrought heart.”',
      note: 'Study how dramatic irony and sharp soliloquies create emotional investment in the audience.'
    },
    {
      id: 'aut-m-3',
      title: 'Mahakavi Kumaran Asan: Metaphorical Imagery & Philosophical Depth',
      author: 'Kumaran Asan',
      era: 'Kerala Renaissance',
      craftFocus: 'Using allegorical flora and natural symbols to challenge entrenched social paradigms.',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      quote: '“Change the laws yourselves, or the laws will change you in their time.”',
      note: 'Exemplifies how lyrical economy and bold thematic vision can redefine an entire literary culture.'
    }
  ]

  const [activeRadioTrack, setActiveRadioTrack] = useState(AUTHOR_RADIO_STATIONS[0])
  const [isRadioPlaying, setIsRadioPlaying] = useState(false)
  const [radioVolume, setRadioVolume] = useState(80)
  const [selectedMuseumExhibit, setSelectedMuseumExhibit] = useState(null)

  const toggleRadioPlay = (track) => {
    if (activeRadioTrack?.id === track.id) {
      if (isRadioPlaying) {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel()
        setIsRadioPlaying(false)
      } else {
        playTrackVoice(track)
      }
    } else {
      setActiveRadioTrack(track)
      playTrackVoice(track)
    }
  }

  const playTrackVoice = (track) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const text = `${track.title}. Category: ${track.category}. Narrated by ${track.narrator}. ${track.desc}`
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.96
      utterance.pitch = 0.98
      utterance.volume = radioVolume / 100
      utterance.onend = () => setIsRadioPlaying(false)
      utterance.onerror = () => setIsRadioPlaying(false)
      window.speechSynthesis.speak(utterance)
      setIsRadioPlaying(true)
    }
  }

  const handleBroadcastStoryToRadio = async (e) => {
    e.preventDefault()
    if (!broadcastSelectedStory) {
      alert('Please select a published story to broadcast.')
      return
    }

    const story = stories.find(s => s.id === broadcastSelectedStory || s._id === broadcastSelectedStory)
    if (!story) return

    setSubmitting(true)
    // Simulate/Broadcast to AnimVerse Radio feed
    setTimeout(() => {
      setSubmitting(false)
      setShowBroadcastModal(false)
      setAlertMsg({
        type: 'success',
        text: `📻 "${story.title}" audio broadcast queued for AnimVerse Radio (${story.audience === 'Kids' ? 'Kids Stories' : 'Mini Novels'} channel)!`
      })
      setTimeout(() => setAlertMsg(null), 5000)
    }, 800)
  }

  const [form, setForm] = useState({
    title: '',
    genre: 'Fantasy',
    audience: 'Kids',
    ageGroup: 'kids',
    synopsis: '',
    content: ''
  })

  useEffect(() => {
    const saved = localStorage.getItem('animverse_author_stories')
    if (saved) {
      try {
        setStories(JSON.parse(saved))
      } catch {
        setStories(INITIAL_AUTHOR_STORIES)
      }
    } else {
      setStories(INITIAL_AUTHOR_STORIES)
      localStorage.setItem('animverse_author_stories', JSON.stringify(INITIAL_AUTHOR_STORIES))
    }
  }, [])

  const saveStories = (newStories) => {
    setStories(newStories)
    localStorage.setItem('animverse_author_stories', JSON.stringify(newStories))
  }

  const handleUploadStory = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.synopsis.trim()) {
      alert('Please provide at least a title and synopsis for your story.')
      return
    }

    setSubmitting(true)
    const isKids = form.audience === 'Kids'
    const defaultCover = isKids ? '/images/stories/brave_rabbit.jpg' : '/images/stories/blackwood_manor.jpg'

    const newStory = {
      id: 'story-' + Date.now(),
      title: form.title.trim(),
      genre: form.genre,
      audience: form.audience,
      ageGroup: isKids ? 'kids' : 'adult',
      coverImage: defaultCover,
      synopsis: form.synopsis.trim(),
      desc: form.synopsis.trim(),
      content: form.content ? form.content.split('\n\n').filter(Boolean) : [form.synopsis.trim()],
      pages: [
        {
          chapter: "Chapter 1",
          title: form.title.trim(),
          content: form.content ? form.content.split('\n\n').filter(Boolean) : [form.synopsis.trim()]
        }
      ],
      author: user?.name || 'Author (You)',
      reads: 1,
      bookmarks: 0,
      votes: 0,
      status: 'Published & Live',
      createdAt: new Date().toISOString().split('T')[0]
    }

    const token = getToken()
    if (!token) {
      setSubmitting(false)
      setAlertMsg({ type: 'error', text: 'Sign in as an author to publish a story.' })
      return
    }

    try {
      const response = await fetch('/api/user/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...newStory, description: newStory.synopsis })
      })
      const payload = await response.json()
      if (!response.ok || !payload.story) throw new Error(payload.message || 'Story could not be saved.')
      Object.assign(newStory, payload.story, { id: payload.story._id })
    } catch (err) {
      setSubmitting(false)
      setAlertMsg({ type: 'error', text: err.message || 'Story could not be saved.' })
      return
    }

    const updated = [newStory, ...stories]
    saveStories(updated)
    setSubmitting(false)
    setShowUploadModal(false)
    setForm({ title: '', genre: 'Fantasy', audience: 'Kids', ageGroup: 'kids', synopsis: '', content: '' })

    setAlertMsg({ type: 'success', text: `Story "${newStory.title}" published in ${newStory.audience} category!` })
    setTimeout(() => setAlertMsg(null), 5000)
  }

  const handleDeleteStory = (id, title) => {
    if (window.confirm(`Are you sure you want to remove "${title}"?`)) {
      const updated = stories.filter(s => s.id !== id)
      saveStories(updated)
    }
  }

  const handleCreateTheatre = async (story) => {
    const token = getToken()
    if (!token) {
      setAlertMsg({ type: 'error', text: 'Sign in as an author to create a theatre version.' })
      return
    }

    try {
      let persistentStory = story
      if (!/^[a-f\d]{24}$/i.test(String(story._id || story.id || ''))) {
        const content = Array.isArray(story.content) ? story.content : Array.isArray(story.fullContent) ? story.fullContent : []
        const response = await fetch('/api/user/stories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            title: story.title,
            description: story.synopsis || story.description || story.desc || '',
            synopsis: story.synopsis || story.description || story.desc || '',
            content,
            pages: story.pages || [],
            genre: story.genre || 'Fantasy',
            audience: story.audience || 'All',
            ageGroup: story.ageGroup || (story.audience === 'Kids' ? 'kids' : 'adult'),
            language: story.language || 'English',
            coverImage: getStoryCover(story)
          })
        })
        const payload = await response.json()
        if (!response.ok || !payload.story) throw new Error(payload.message || 'Could not save this manuscript for theatre.')
        persistentStory = { ...story, ...payload.story, id: payload.story._id }
        saveStories(stories.map(item => item.id === story.id ? persistentStory : item))
      }
      navigate(`/author/theatre/${persistentStory._id || persistentStory.id}`)
    } catch (error) {
      setAlertMsg({ type: 'error', text: error.message || 'Could not open Story Theatre.' })
    }
  }

  const handleAnimateStory = (story) => {
    const promptText = `${story.title}: ${story.synopsis}`
    const style = story.audience === 'Kids' ? 'Cartoon' : 'Cinematic'
    navigate(`/generate?prompt=${encodeURIComponent(promptText)}&style=${style}&audience=${story.audience.toLowerCase()}`)
  }

  const S = {
    card: {
      background: 'rgba(18, 19, 26, 0.8)',
      backdropFilter: 'blur(20px)',
      borderRadius: 20,
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      padding: 26,
      color: '#F8FAFC'
    },
    badge: (bg, color) => ({
      display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 50,
      fontSize: '0.75rem', fontWeight: 800, background: bg, color: color, border: `1px solid ${color}40`, fontFamily: 'monospace'
    }),
    btnPrimary: {
      padding: '12px 26px', borderRadius: 50, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
      background: '#F59E0B', color: '#0A0B0E', fontWeight: 800, fontSize: '0.9rem',
      boxShadow: '0 4px 16px rgba(245,158,11,0.3)', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: 8
    }
  }

  const totalReads = stories.reduce((acc, s) => acc + (s.reads || 0), 0)
  const totalBookmarks = stories.reduce((acc, s) => acc + (s.bookmarks || 0), 0)
  const totalVotes = stories.reduce((acc, s) => acc + (s.votes || 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* ── AUTHOR PUBLISHING BANNER ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0A0B0E 0%, #171923 50%, #1F2937 100%)',
        borderRadius: 24, padding: '40px 48px', color: 'white', position: 'relative', overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
      }}>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ maxWidth: 580 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '6px 16px', borderRadius: 50, fontSize: '0.78rem', fontWeight: 800, color: '#F59E0B', fontFamily: 'monospace', marginBottom: 16 }}>
              ✦ AUTHOR PUBLISHING STUDIO • MANUSCRIPT PIPELINE
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, margin: '0 0 12px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              Welcome, Author {user?.name?.split(' ')[0] || 'Creator'}
            </h1>
            <p style={{ fontSize: '1.02rem', color: '#94A3B8', margin: 0, lineHeight: 1.7 }}>
              Write, upload, and publish your manuscripts to readers worldwide — then convert chapters into 4K AI animated video scenes with 1 click.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button 
              onClick={() => setShowUploadModal(true)}
              style={S.btnPrimary}
            >
              Upload New Story →
            </button>
            <button
              onClick={() => setShowBroadcastModal(true)}
              style={{
                ...S.btnPrimary,
                background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
                boxShadow: '0 4px 16px rgba(6,182,212,0.3)', color: 'white'
              }}>
              Broadcast to Radio 📻
            </button>
            <button
              onClick={() => navigate('/museum')}
              style={{
                ...S.btnPrimary,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#F8FAFC'
              }}>
              Literature Museum 🏛️
            </button>
          </div>
        </div>
      </div>

      {alertMsg && (
        <div style={{
          padding: '14px 20px', borderRadius: 14, fontWeight: 700, fontSize: '0.9rem',
          background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.3)',
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          <span>{alertMsg.text}</span>
        </div>
      )}

      {/* ── AUTHOR ANALYTICS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
        <div style={{ ...S.card, borderTop: '3px solid #F59E0B' }}>
          <div style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 8 }}>
            PUBLISHED WORKS
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#F59E0B', marginBottom: 8 }}>
            {stories.length} Live
          </div>
          <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
            Active across story library
          </div>
        </div>

        <div style={{ ...S.card, borderTop: '3px solid #06B6D4' }}>
          <div style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 8 }}>
            READER VIEWS
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#06B6D4', marginBottom: 8 }}>
            {totalReads.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
            +18% audience growth
          </div>
        </div>

        <div style={{ ...S.card, borderTop: '3px solid #8B5CF6' }}>
          <div style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 8 }}>
            BOOKMARKS
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#8B5CF6', marginBottom: 8 }}>
            {totalBookmarks.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
            Active follower saves
          </div>
        </div>

        <div style={{ ...S.card, borderTop: '3px solid #10B981' }}>
          <div style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 8 }}>
            CONTEST VOTES
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#10B981', marginBottom: 8 }}>
            {totalVotes.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
            Nominated in Creator Showcase
          </div>
        </div>
      </div>

      {/* ── AUTHOR MANUSCRIPTS & CATEGORY CONTROLS ── */}
      <div style={S.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '4px 12px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 800, color: '#F59E0B', fontFamily: 'monospace', marginBottom: 8 }}>
              ✦ CATEGORY PIPELINE
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#F8FAFC', margin: 0 }}>
              Your Uploaded <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic', fontWeight: 400, color: '#F59E0B' }}>Manuscripts</span>
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: '4px 0 0' }}>
              Filter by Kids or Adults category to view, test with 3D page flip reader, and render AI animation.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowUploadModal(true)}
              style={S.btnPrimary}
            >
              + Upload New Story →
            </button>
          </div>
        </div>

        {/* ── CATEGORY FILTER PILLS ── */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          <button
            onClick={() => setCategoryFilter('All')}
            style={{
              padding: '8px 18px', borderRadius: 50,
              border: `1px solid ${categoryFilter === 'All' ? '#F59E0B' : 'rgba(255,255,255,0.1)'}`,
              background: categoryFilter === 'All' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.03)',
              color: categoryFilter === 'All' ? '#F59E0B' : '#94A3B8',
              fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
            }}>
            All Uploaded ({stories.length})
          </button>
          <button
            onClick={() => setCategoryFilter('Kids')}
            style={{
              padding: '8px 18px', borderRadius: 50,
              border: `1px solid ${categoryFilter === 'Kids' ? '#06B6D4' : 'rgba(255,255,255,0.1)'}`,
              background: categoryFilter === 'Kids' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.03)',
              color: categoryFilter === 'Kids' ? '#06B6D4' : '#94A3B8',
              fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
            }}>
            🧸 Kids Category ({stories.filter(s => s.audience === 'Kids' || s.ageGroup === 'kids').length})
          </button>
          <button
            onClick={() => setCategoryFilter('Adults')}
            style={{
              padding: '8px 18px', borderRadius: 50,
              border: `1px solid ${categoryFilter === 'Adults' ? '#F59E0B' : 'rgba(255,255,255,0.1)'}`,
              background: categoryFilter === 'Adults' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.03)',
              color: categoryFilter === 'Adults' ? '#F59E0B' : '#94A3B8',
              fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
            }}>
            📚 Adults Category ({stories.filter(s => s.audience === 'Adults' || s.ageGroup === 'adult').length})
          </button>
        </div>

        {/* ── VISUAL BOOK CARDS GRID ── */}
        {(() => {
          const filteredList = stories.filter(s => {
            if (categoryFilter === 'All') return true
            if (categoryFilter === 'Kids') return s.audience === 'Kids' || s.ageGroup === 'kids'
            if (categoryFilter === 'Adults') return s.audience === 'Adults' || s.ageGroup === 'adult'
            return true
          })

          if (filteredList.length === 0) {
            return (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>
                  {categoryFilter === 'Kids' ? '🧸' : '📚'}
                </div>
                <div style={{ fontWeight: 700, color: '#F8FAFC' }}>No manuscripts uploaded under {categoryFilter} category yet.</div>
                <button
                  onClick={() => {
                    setForm(f => ({ ...f, audience: categoryFilter === 'Kids' ? 'Kids' : 'Adults' }))
                    setShowUploadModal(true)
                  }}
                  style={{ marginTop: 14, ...S.btnPrimary }}>
                  Upload to {categoryFilter} Category →
                </button>
              </div>
            )
          }

          return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24, marginBottom: 32 }}>
              {filteredList.map(story => {
                const cover = getStoryCover(story)
                const isKids = story.audience === 'Kids' || story.ageGroup === 'kids'

                return (
                  <div key={story.id} style={{
                    background: 'rgba(10, 11, 14, 0.7)',
                    borderRadius: 18, border: '1px solid rgba(255, 255, 255, 0.08)',
                    overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{
                        height: 160,
                        background: `url(${cover}) center/cover no-repeat`,
                        position: 'relative',
                        borderBottom: '1px solid rgba(255,255,255,0.08)'
                      }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10, 11, 14, 0.95) 0%, transparent 60%)' }} />

                        {/* Category Tag on the book */}
                        <div style={{
                          position: 'absolute', top: 12, left: 12,
                          background: isKids ? 'rgba(6, 182, 212, 0.9)' : 'rgba(245, 158, 11, 0.9)',
                          padding: '4px 10px', borderRadius: 20, fontSize: '0.72rem',
                          color: '#0A0B0E', fontWeight: 900, fontFamily: 'monospace', zIndex: 2
                        }}>
                          {isKids ? '🧸 CATEGORY: KIDS' : '📚 CATEGORY: ADULTS'}
                        </div>

                        <div style={{
                          position: 'absolute', top: 12, right: 12,
                          background: 'rgba(16, 185, 129, 0.9)', color: '#0A0B0E',
                          padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem',
                          fontWeight: 800, fontFamily: 'monospace', zIndex: 2
                        }}>
                          ✓ LIVE
                        </div>
                      </div>

                      <div style={{ padding: '18px 20px 12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: isKids ? '#06B6D4' : '#F59E0B', fontFamily: 'monospace' }}>
                            {story.genre}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{(story.reads || 0).toLocaleString()} reads</span>
                        </div>

                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 8px', color: '#F8FAFC' }}>
                          {story.title}
                        </h3>
                        <p style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
                          {story.synopsis}
                        </p>
                      </div>
                    </div>

                    <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, alignItems: 'center' }}>
                      <button
                        onClick={() => setSelectedStoryForReader(story)}
                        style={{
                          padding: '9px 12px', borderRadius: 8, border: 'none',
                          background: '#F59E0B', color: '#0A0B0E', fontWeight: 800, fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}>
                        Read Book
                      </button>
                      <button
                        onClick={() => handleAnimateStory(story)}
                        style={{
                          padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)',
                          background: 'rgba(255,255,255,0.05)', color: '#F8FAFC', fontWeight: 700, fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}>
                        Animate →
                      </button>
                      <button
                        onClick={() => handleCreateTheatre(story)}
                        style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(201,180,129,.4)', background: 'rgba(201,180,129,.1)', color: '#E3CC96', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
                        🎭 Story Theatre
                      </button>
                      <button
                        onClick={() => handleDeleteStory(story.id, story.title)}
                        style={{
                          padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(239, 68, 68, 0.4)',
                          background: 'rgba(239, 68, 68, 0.15)', color: '#F87171', fontWeight: 700, fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}>
                        ✕
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })()}

        {/* ── MANUSCRIPT DATA TABLE ── */}
        <div style={{ overflowX: 'auto', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20 }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#CBD5E1', marginBottom: 12 }}>
            Detailed Manuscript Registry
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                <th style={{ padding: '14px' }}>Story</th>
                <th style={{ padding: '14px' }}>Uploaded Category</th>
                <th style={{ padding: '14px' }}>Genre</th>
                <th style={{ padding: '14px' }}>Reads</th>
                <th style={{ padding: '14px' }}>Status</th>
                <th style={{ padding: '14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stories.filter(s => {
                if (categoryFilter === 'All') return true
                if (categoryFilter === 'Kids') return s.audience === 'Kids' || s.ageGroup === 'kids'
                if (categoryFilter === 'Adults') return s.audience === 'Adults' || s.ageGroup === 'adult'
                return true
              }).map(story => {
                const isKids = story.audience === 'Kids' || story.ageGroup === 'kids'
                return (
                  <tr key={story.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '16px 14px' }}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#F8FAFC' }}>{story.title}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B', maxWidth: 280, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {story.synopsis}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '16px 14px' }}>
                      <span style={S.badge(
                        isKids ? 'rgba(6, 182, 212, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        isKids ? '#06B6D4' : '#F59E0B'
                      )}>
                        {isKids ? '🧸 Kids Category' : '📚 Adults Category'}
                      </span>
                    </td>

                    <td style={{ padding: '16px 14px', fontWeight: 600, color: '#94A3B8' }}>
                      {story.genre}
                    </td>

                    <td style={{ padding: '16px 14px', fontWeight: 700, color: '#06B6D4' }}>
                      {(story.reads || 0).toLocaleString()}
                    </td>

                    <td style={{ padding: '16px 14px' }}>
                      <span style={S.badge('rgba(16, 185, 129, 0.15)', '#34D399')}>
                        ● {story.status}
                      </span>
                    </td>

                    <td style={{ padding: '16px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setSelectedStoryForReader(story)}
                          style={{
                            padding: '7px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(255,255,255,0.05)', color: '#F8FAFC',
                            fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                          }}>
                          Read
                        </button>
                        <button
                          onClick={() => handleAnimateStory(story)}
                          style={{
                            padding: '7px 14px', borderRadius: 8, border: 'none',
                            background: '#F59E0B', color: '#0A0B0E',
                            fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer'
                          }}>
                          Animate →
                        </button>
                        <button
                          onClick={() => handleCreateTheatre(story)}
                          style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid rgba(201,180,129,.4)', background: 'rgba(201,180,129,.1)', color: '#E3CC96', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
                          Theatre
                        </button>
                        <button
                          onClick={() => handleDeleteStory(story.id, story.title)}
                          style={{
                            padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(239, 68, 68, 0.4)',
                            background: 'rgba(239, 68, 68, 0.15)', color: '#F87171', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                          }}>
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── SECTION: ANIMVERSE RADIO (AUTHOR AUDIO BROADCAST & VOICE STUDIO) ── */}
      <div style={{ ...S.card, border: '1px solid rgba(6, 182, 212, 0.35)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', fontWeight: 800, color: '#06B6D4', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>
              📻 AUDIO BROADCAST STUDIO • AUTHOR CHANNEL
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F8FAFC', margin: 0 }}>
              Author Voice & <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic', fontWeight: 400, color: '#F59E0B' }}>Radio Broadcast Hub</span>
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: '4px 0 0' }}>
              Listen to creative writing masterclasses, ambient writing focus waves, and broadcast your audio story narrations globally.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowBroadcastModal(true)}
              style={{
                padding: '9px 18px', borderRadius: 50, background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
                border: 'none', color: 'white', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6
              }}>
              🎙️ Broadcast Story to Radio
            </button>
            <Link
              to="/radio"
              style={{
                padding: '9px 18px', borderRadius: 50, background: 'rgba(6, 182, 212, 0.15)',
                border: '1px solid rgba(6, 182, 212, 0.35)', color: '#06B6D4', fontWeight: 800,
                fontSize: '0.82rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6
              }}>
              Full Radio Station 📻 →
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1.1fr) minmax(300px, 1.9fr)', gap: 20, alignItems: 'center' }}>
          {/* Active Player Box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85))',
            borderRadius: 16, padding: 20, border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', flexDirection: 'column', gap: 14
          }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <img
                src={activeRadioTrack.cover}
                alt={activeRadioTrack.title}
                style={{ width: 68, height: 68, borderRadius: 12, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.15)' }}
              />
              <div style={{ overflow: 'hidden' }}>
                <span style={S.badge('rgba(6, 182, 212, 0.2)', '#06B6D4')}>{activeRadioTrack.category}</span>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#F8FAFC', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeRadioTrack.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                  🎙️ {activeRadioTrack.narrator} • ⏱️ {activeRadioTrack.duration}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.5, margin: 0 }}>
              {activeRadioTrack.desc}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={() => toggleRadioPlay(activeRadioTrack)}
                style={{
                  padding: '10px 22px', borderRadius: 50, border: 'none',
                  background: isRadioPlaying ? '#EF4444' : '#F59E0B', color: '#0A0B0E',
                  fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8
                }}>
                {isRadioPlaying ? '⏸ Pause Stream' : '▶ Play Craft Audio'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#94A3B8' }}>
                <span>🔊</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={radioVolume}
                  onChange={(e) => setRadioVolume(Number(e.target.value))}
                  style={{ width: 70, accentColor: '#F59E0B', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>

          {/* Quick Track Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {AUTHOR_RADIO_STATIONS.map(track => {
              const isSelected = activeRadioTrack.id === track.id
              return (
                <div
                  key={track.id}
                  onClick={() => toggleRadioPlay(track)}
                  style={{
                    padding: 14, borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s',
                    background: isSelected ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isSelected ? '#06B6D4' : 'rgba(255,255,255,0.07)'}`,
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                  }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.7rem', color: isSelected ? '#F59E0B' : '#06B6D4', fontWeight: 800, fontFamily: 'monospace' }}>
                        {track.category}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{track.duration}</span>
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: isSelected ? '#F59E0B' : '#F8FAFC', marginBottom: 4 }}>
                      {track.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{track.narrator}</div>
                  </div>

                  <div style={{ marginTop: 10, fontSize: '0.78rem', fontWeight: 700, color: isSelected && isRadioPlaying ? '#10B981' : '#F59E0B' }}>
                    {isSelected && isRadioPlaying ? '● Playing Audio' : '▶ Tap to Play'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── SECTION: LITERATURE MUSEUM (MASTER AUTHOR CRAFT & HERITAGE ARCHIVE) ── */}
      <div style={{ ...S.card, border: '1px solid rgba(245, 158, 11, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', fontWeight: 800, color: '#F59E0B', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>
              🏛️ VIRTUAL LITERATURE MUSEUM • MASTER AUTHOR ARCHIVE
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F8FAFC', margin: 0 }}>
              Master Craft Archive & <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic', fontWeight: 400, color: '#F59E0B' }}>Literary Heritage</span>
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: '4px 0 0' }}>
              Deconstruct narrative pacing, dialogue rhythm, and world-building techniques from global literary masters.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Link
              to="/museum"
              style={{
                padding: '9px 18px', borderRadius: 50, background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.35)', color: '#F59E0B', fontWeight: 800,
                fontSize: '0.82rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6
              }}>
              Enter Virtual Museum 🏛️ →
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {AUTHOR_MUSEUM_EXHIBITS.map(exhibit => (
            <div
              key={exhibit.id}
              style={{
                ...S.card, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                background: 'rgba(10, 11, 14, 0.7)', border: '1px solid rgba(255,255,255,0.08)'
              }}>
              <div>
                <div style={{
                  height: 140, background: `url(${exhibit.image}) center/cover no-repeat`,
                  position: 'relative'
                }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10, 11, 14, 0.95) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', top: 12, left: 12 }}>
                    <span style={S.badge('rgba(245, 158, 11, 0.9)', '#0A0B0E')}>✍️ CRAFT LESSON</span>
                  </div>
                  <div style={{ position: 'absolute', bottom: 10, left: 14, right: 14, fontSize: '0.75rem', color: '#06B6D4', fontFamily: 'monospace', fontWeight: 800 }}>
                    {exhibit.era}
                  </div>
                </div>

                <div style={{ padding: '18px 20px 12px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F8FAFC', margin: '0 0 6px' }}>
                    {exhibit.title}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: '#F59E0B', fontWeight: 700, marginBottom: 10 }}>
                    Author: {exhibit.author}
                  </div>
                  <p style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.5, margin: '0 0 12px' }}>
                    {exhibit.note}
                  </p>

                  <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 12 }}>
                    <div style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, fontFamily: 'monospace', marginBottom: 2 }}>WRITING FOCUS:</div>
                    <div style={{ fontSize: '0.8rem', color: '#E2E8F0', fontStyle: 'italic' }}>{exhibit.craftFocus}</div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button
                  onClick={() => setSelectedMuseumExhibit(exhibit)}
                  style={{
                    padding: '10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.05)', color: '#F8FAFC', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                  }}>
                  Inspect Craft Plaque 🔍
                </button>
                <button
                  onClick={() => navigate('/museum')}
                  style={{
                    padding: '10px', borderRadius: 10, border: 'none',
                    background: '#F59E0B', color: '#0A0B0E', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer'
                  }}>
                  Museum Hall →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── STORY UPLOAD MODAL ── */}
      {showUploadModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            background: '#0A0B0E', color: '#F8FAFC', width: '100%', maxWidth: 700, maxHeight: '90vh', borderRadius: 24,
            border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden'
          }}>
            <div style={{
              padding: '20px 28px', background: 'rgba(18, 19, 26, 0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)',
              color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>Publish New Manuscript</h3>
                <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Publish original stories to AnimVerse AI</span>
              </div>
              <button 
                onClick={() => setShowUploadModal(false)}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: 36, height: 36, borderRadius: '50%', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 800 }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadStory} style={{ padding: '28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 700, fontSize: '0.88rem', color: '#CBD5E1' }}>Story Title *</label>
                <input
                  type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="The Secret of the Whispering Sands"
                  style={{ width: '100%', padding: '12px 14px', background: '#050608', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: '0.95rem', color: '#F8FAFC', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 700, fontSize: '0.88rem', color: '#CBD5E1' }}>Target Audience *</label>
                  <select
                    value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', background: '#050608', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: '0.9rem', color: '#F8FAFC', outline: 'none', boxSizing: 'border-box' }}>
                    <option value="Kids">Kids / Parents (Kid Safe)</option>
                    <option value="Adults">Adults / Teens</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 700, fontSize: '0.88rem', color: '#CBD5E1' }}>Genre *</label>
                  <select
                    value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', background: '#050608', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: '0.9rem', color: '#F8FAFC', outline: 'none', boxSizing: 'border-box' }}>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Fairy Tale">Fairy Tale / Bedtime</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Mystery">Mystery & Thriller</option>
                    <option value="Moral Story">Moral & Educational</option>
                    <option value="Adventure">Adventure</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 700, fontSize: '0.88rem', color: '#CBD5E1' }}>Short Synopsis *</label>
                <textarea
                  required rows={2} value={form.synopsis} onChange={e => setForm({ ...form, synopsis: e.target.value })}
                  placeholder="A brief 1-2 sentence logline..."
                  style={{ width: '100%', padding: '12px 14px', background: '#050608', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: '0.92rem', color: '#F8FAFC', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 700, fontSize: '0.88rem', color: '#CBD5E1' }}>Full Manuscript / Chapter Content</label>
                <textarea
                  rows={5} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                  placeholder="Paste or write chapter content..."
                  style={{ width: '100%', padding: '12px 14px', background: '#050608', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: '0.92rem', color: '#F8FAFC', outline: 'none', boxSizing: 'border-box', lineHeight: 1.6 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
                <button
                  type="button" onClick={() => setShowUploadModal(false)}
                  style={{ padding: '12px 22px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#CBD5E1', fontWeight: 700, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button
                  type="submit" disabled={submitting}
                  style={{ padding: '12px 26px', borderRadius: 10, border: 'none', background: '#F59E0B', color: '#0A0B0E', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}>
                  {submitting ? 'Publishing...' : 'Publish Story →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── BROADCAST TO RADIO MODAL ── */}
      {showBroadcastModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            background: '#0A0B0E', color: '#F8FAFC', width: '100%', maxWidth: 640, maxHeight: '90vh', borderRadius: 24,
            border: '1px solid rgba(6, 182, 212, 0.4)', boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden'
          }}>
            <div style={{
              padding: '20px 28px', background: 'rgba(18, 19, 26, 0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>📻 Broadcast to AnimVerse Radio</h3>
                <span style={{ fontSize: '0.82rem', color: '#06B6D4' }}>Publish your story narration to the global audio streams</span>
              </div>
              <button 
                onClick={() => setShowBroadcastModal(false)}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: 36, height: 36, borderRadius: '50%', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 800 }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleBroadcastStoryToRadio} style={{ padding: '28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 700, fontSize: '0.88rem', color: '#CBD5E1' }}>Select Published Manuscript *</label>
                <select
                  required
                  value={broadcastSelectedStory}
                  onChange={e => setBroadcastSelectedStory(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', background: '#050608', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: '0.9rem', color: '#F8FAFC', outline: 'none', boxSizing: 'border-box' }}>
                  <option value="">-- Choose Story to Narrate --</option>
                  {stories.map(s => (
                    <option key={s.id || s._id} value={s.id || s._id}>
                      {s.title} ({s.genre} • {s.audience})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 700, fontSize: '0.88rem', color: '#CBD5E1' }}>Narrator / Voiceover Credit</label>
                <input
                  type="text"
                  value={broadcastNarrator}
                  onChange={e => setBroadcastNarrator(e.target.value)}
                  placeholder="Author / Narrator Name"
                  style={{ width: '100%', padding: '12px 14px', background: '#050608', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: '0.92rem', color: '#F8FAFC', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                <div style={{ fontSize: '0.78rem', color: '#06B6D4', fontWeight: 800, fontFamily: 'monospace', marginBottom: 4 }}>
                  BROADCAST INFORMATION:
                </div>
                <div style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.5 }}>
                  When broadcast, an AI narrator will generate expressive speech synchronized with your manuscript text and feature on the AnimVerse Radio channel.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                <button
                  type="button" onClick={() => setShowBroadcastModal(false)}
                  style={{ padding: '12px 22px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#CBD5E1', fontWeight: 700, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button
                  type="submit" disabled={submitting}
                  style={{ padding: '12px 26px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #06B6D4, #0891B2)', color: 'white', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}>
                  {submitting ? 'Broadcasting...' : 'Launch Broadcast 📻'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── REALISTIC ANIMATED 3D BOOK READER FOR AUTHOR ── */}
      {selectedStoryForReader && (
        <AnimatedBookReader
          story={selectedStoryForReader}
          onClose={() => setSelectedStoryForReader(null)}
        />
      )}

      {/* ── MUSEUM CRAFT EXHIBIT PLAQUE MODAL ── */}
      {selectedMuseumExhibit && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            background: '#0F1117', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: 24,
            maxWidth: 600, width: '100%', padding: 32, color: 'white', position: 'relative',
            boxShadow: '0 24px 70px rgba(0,0,0,0.8)'
          }}>
            <button
              onClick={() => setSelectedMuseumExhibit(null)}
              style={{
                position: 'absolute', top: 18, right: 18, background: 'rgba(255,255,255,0.1)', border: 'none',
                color: 'white', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', fontWeight: 800
              }}>
              ✕
            </button>

            <div style={{ fontSize: '0.72rem', color: '#F59E0B', fontFamily: 'monospace', fontWeight: 800, letterSpacing: '1.5px', marginBottom: 8 }}>
              🏛️ AUTHOR CRAFT ARCHIVE • MASTER STUDY
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0 0 8px', color: '#F8FAFC' }}>
              {selectedMuseumExhibit.title}
            </h2>

            <div style={{ fontSize: '0.88rem', color: '#06B6D4', fontWeight: 700, marginBottom: 16 }}>
              {selectedMuseumExhibit.author} • {selectedMuseumExhibit.era}
            </div>

            <p style={{ fontSize: '0.92rem', color: '#CBD5E1', lineHeight: 1.7, marginBottom: 16 }}>
              {selectedMuseumExhibit.note}
            </p>

            <div style={{ padding: '14px 18px', borderRadius: 14, background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', marginBottom: 20 }}>
              <div style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 800, fontFamily: 'monospace', marginBottom: 4 }}>
                ICONIC PASSAGE / QUOTE:
              </div>
              <div style={{ fontSize: '0.92rem', fontStyle: 'italic', color: '#FEF3C7' }}>
                {selectedMuseumExhibit.quote}
              </div>
            </div>

            <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.2)', marginBottom: 24 }}>
              <div style={{ fontSize: '0.75rem', color: '#06B6D4', fontWeight: 800, fontFamily: 'monospace', marginBottom: 4 }}>
                CRAFT TAKEAWAY FOR WRITERS:
              </div>
              <div style={{ fontSize: '0.86rem', color: '#E2E8F0' }}>
                {selectedMuseumExhibit.craftFocus}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => { setSelectedMuseumExhibit(null); navigate('/museum'); }}
                style={{
                  flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: '#F59E0B',
                  color: '#0A0B0E', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer'
                }}>
                Study Masterworks in Museum 🏛️
              </button>
              <button
                onClick={() => setSelectedMuseumExhibit(null)}
                style={{
                  padding: '12px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.05)', color: '#F8FAFC', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer'
                }}>
                Close Plaque
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
