import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LIBRARY_STORIES, getStoryCover } from '../../pages/StoryLibrary'
import { GAKEDATA } from '../../pages/GameHub'
import AnimatedBookReader from '../AnimatedBookReader'

export default function AdultDashboardView({ user }) {
  const navigate = useNavigate()
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [activeStoryReader, setActiveStoryReader] = useState(null)
  const [isPlayingVoice, setIsPlayingVoice] = useState(false)
  const [bookmarkedIds, setBookmarkedIds] = useState([3, 5, 6])
  const [fontSize, setFontSize] = useState(16)

  const adultStories = LIBRARY_STORIES.filter(s =>
    s.audience === 'Adults' || s.audience === 'Teens'
  )

  const filteredStories = selectedGenre === 'All'
    ? adultStories
    : adultStories.filter(s => s.genre === selectedGenre)

  const adultGames = GAKEDATA.filter(g => g.category === 'Adults' || g.category === 'Everyone')

  // Curated Adult Radio Stations
  const ADULT_RADIO_STATIONS = [
    {
      id: 'a-radio-1',
      title: 'Echoes of the Quantum Void',
      category: 'Mini Novels',
      narrator: 'Victor Sterling',
      duration: '14:20',
      cover: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
      desc: 'Serialized cyberpunk audio novella exploring rogue consciousness in the year 2184.'
    },
    {
      id: 'a-radio-2',
      title: 'Midnight Rain & Solitude Piano',
      category: 'Music',
      narrator: 'Noir Lounge Ensemble',
      duration: '8:45',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      desc: 'Cinematic ambient soundscape curated for late-night reading and manuscript writing.'
    },
    {
      id: 'a-radio-3',
      title: 'The Albatross & The Open Sea',
      category: 'Poetry',
      narrator: 'Elena Rostova',
      duration: '5:12',
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
      desc: 'Haunting recital of modern philosophical verses on freedom, isolation, and destiny.'
    },
    {
      id: 'a-radio-4',
      title: 'The Architecture of Literary Tragedy',
      category: 'Literature Talks',
      narrator: 'Prof. Julian Vance',
      duration: '18:30',
      cover: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
      desc: 'Comparative literary analysis of Dostoevsky, Shakespeare, and existentialist narratives.'
    }
  ]

  // Curated Adult Literature Museum Exhibits
  const ADULT_MUSEUM_EXHIBITS = [
    {
      id: 'am-1',
      title: 'Fyodor Dostoevsky: Psychological Depth & Redemption',
      author: 'Fyodor Dostoevsky',
      era: '1866 • Golden Age of Russian Realism',
      category: 'Psychological Realism',
      keyWorks: ['Crime and Punishment', 'The Brothers Karamazov', 'Notes from Underground', 'The Idiot'],
      theme: 'The duality of human conscience, moral guilt, and spiritual redemption.',
      image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80',
      quote: '“The darker the night, the brighter the stars; the deeper the grief, the closer is God!”',
      note: 'Dostoevsky dissected the extreme depths of psychological torment, faith, and freedom in masterworks that transformed modern world literature.'
    },
    {
      id: 'am-2',
      title: 'William Shakespeare: Elizabethan Tragedies & Power',
      author: 'William Shakespeare',
      era: '1600 • Renaissance / Elizabethan Age',
      category: 'Renaissance Drama',
      keyWorks: ['Hamlet', 'Macbeth', 'King Lear', 'Othello', 'The Tempest'],
      theme: 'The anatomy of ambition, betrayal, existential doubt, and cosmic fate.',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80',
      quote: '“All the world’s a stage, and all the men and women merely players.”',
      note: 'The pinnacle of dramatic verse, exploring the fragility of sovereign power and the intricate anatomy of human passions.'
    },
    {
      id: 'am-3',
      title: 'Mahakavi Kumaran Asan: Romanticism & Social Renaissance',
      author: 'Kumaran Asan',
      era: '1907 • Kerala Literary Renaissance',
      category: 'Renaissance Romanticism',
      keyWorks: ['Veena Poovu (The Fallen Flower)', 'Karuna', 'Chandalabhikshuki', 'Duravastha'],
      theme: 'Radical humanism, romantic introspection, and philosophical reflections on impermanence.',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      quote: '“സ്നേഹമാണഖിലസാരമൂഴിയിൽ... സ്നേഹസാരമിഹ സത്യമേകമാം.” (Love is the essence of all in this world; Love is the singular truth).',
      note: 'Revolutionized Indian lyrical poetry with metaphysical depth, rejecting orthodox caste strictures in favor of pure spiritual love.'
    }
  ]

  const [activeRadioTrack, setActiveRadioTrack] = useState(ADULT_RADIO_STATIONS[0])
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
      const text = `${track.title}. Channel: ${track.category}. Narrated by ${track.narrator}. ${track.desc}`
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.96
      utterance.pitch = 0.95
      utterance.volume = radioVolume / 100
      utterance.onend = () => setIsRadioPlaying(false)
      utterance.onerror = () => setIsRadioPlaying(false)
      window.speechSynthesis.speak(utterance)
      setIsRadioPlaying(true)
    }
  }

  const toggleBookmark = (id, e) => {
    e.stopPropagation()
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleReadVoice = (text) => {
    if ('speechSynthesis' in window) {
      if (isPlayingVoice) {
        window.speechSynthesis.cancel()
        setIsPlayingVoice(false)
      } else {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 1.0
        utterance.pitch = 0.95
        utterance.onend = () => setIsPlayingVoice(false)
        utterance.onerror = () => setIsPlayingVoice(false)
        window.speechSynthesis.speak(utterance)
        setIsPlayingVoice(true)
      }
    } else {
      alert('Text-to-speech is not supported by your browser.')
    }
  }

  const closeStoryReader = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsPlayingVoice(false)
    setActiveStoryReader(null)
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
    },
    btnDark: {
      padding: '12px 24px', borderRadius: 50, border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', fontFamily: 'inherit',
      background: 'rgba(255,255,255,0.04)', color: '#F8FAFC', fontWeight: 700, fontSize: '0.9rem',
      display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none'
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* ── ADULT LOUNGE BANNER ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0A0B0E 0%, #171923 50%, #1F2937 100%)',
        borderRadius: 24, padding: '40px 48px', color: 'white', position: 'relative', overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
      }}>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ maxWidth: 580 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '6px 16px', borderRadius: 50, fontSize: '0.78rem', fontWeight: 800, color: '#F59E0B', fontFamily: 'monospace', marginBottom: 16 }}>
              ✦ ADULT FICTION LOUNGE • DEEP NARRATIVES & AUDIO
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, margin: '0 0 12px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              Welcome, {user?.name?.split(' ')[0] || 'Reader'}
            </h1>
            <p style={{ fontSize: '1.02rem', color: '#94A3B8', margin: 0, lineHeight: 1.7 }}>
              Immerse yourself in complex world-building, serialized radio novellas, world literature classics, and AI cinematic animation generation.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigate('/generate?audience=adult&style=Cinematic')}
              style={S.btnPrimary}
            >
              Create Cinematic Animation →
            </button>
            <Link to="/radio" style={S.btnDark}>
              AnimVerse Radio 📻
            </Link>
            <Link to="/museum" style={S.btnDark}>
              Literature Museum 🏛️
            </Link>
          </div>
        </div>
      </div>

      {/* ── METRICS & TELEMETRY CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
        <div style={{ ...S.card, borderTop: '3px solid #F59E0B' }}>
          <div style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 8 }}>
            STORIES EXPLORED
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#F59E0B', marginBottom: 8 }}>
            19 Titles
          </div>
          <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
            4 chapters read this week
          </div>
        </div>

        <div style={{ ...S.card, borderTop: '3px solid #06B6D4' }}>
          <div style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 8 }}>
            SAVED BOOKMARKS
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#06B6D4', marginBottom: 8 }}>
            {bookmarkedIds.length} Saved
          </div>
          <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
            Quick access reading list
          </div>
        </div>

        <div style={{ ...S.card, borderTop: '3px solid #8B5CF6' }}>
          <div style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 8 }}>
            RADIO & AUDIO LOUNGE
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#8B5CF6', marginBottom: 8 }}>
            10 Channels
          </div>
          <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
            Ambient music, novellas & talks
          </div>
        </div>

        <div style={{ ...S.card, borderTop: '3px solid #10B981' }}>
          <div style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 8 }}>
            MUSEUM ARCHIVES
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#10B981', marginBottom: 8 }}>
            7 Wings
          </div>
          <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
            World classics & master authors
          </div>
        </div>
      </div>

      {/* ── SECTION: ANIMVERSE RADIO (ADULT FICTION & ZEN AUDIO STATION) ── */}
      <div style={{ ...S.card, border: '1px solid rgba(139, 92, 246, 0.35)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', fontWeight: 800, color: '#8B5CF6', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>
              📻 BROADCAST STREAM • ADULT FICTION LOUNGE
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F8FAFC', margin: 0 }}>
              AnimVerse Radio <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic', fontWeight: 400, color: '#F59E0B' }}>Fiction & Ambient Lounge</span>
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: '4px 0 0' }}>
              Serialized sci-fi audio novellas, noir mystery chapters, focus ambient music, and literary discourse.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Link
              to="/radio"
              style={{
                padding: '9px 18px', borderRadius: 50, background: 'rgba(139, 92, 246, 0.15)',
                border: '1px solid rgba(139, 92, 246, 0.35)', color: '#A78BFA', fontWeight: 800,
                fontSize: '0.82rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6
              }}>
              Explore All Radio Stations 📻 →
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
                <span style={S.badge('rgba(139, 92, 246, 0.2)', '#A78BFA')}>{activeRadioTrack.category}</span>
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
                {isRadioPlaying ? '⏸ Pause Stream' : '▶ Play Audio Novella'}
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
            {ADULT_RADIO_STATIONS.map(track => {
              const isSelected = activeRadioTrack.id === track.id
              return (
                <div
                  key={track.id}
                  onClick={() => toggleRadioPlay(track)}
                  style={{
                    padding: 14, borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s',
                    background: isSelected ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isSelected ? '#8B5CF6' : 'rgba(255,255,255,0.07)'}`,
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                  }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.7rem', color: isSelected ? '#F59E0B' : '#A78BFA', fontWeight: 800, fontFamily: 'monospace' }}>
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
                    {isSelected && isRadioPlaying ? '● Streaming Audio' : '▶ Tap to Listen'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── SECTION: LITERATURE MUSEUM (WORLD CLASSICS & RENAISSANCE WING) ── */}
      <div style={{ ...S.card, border: '1px solid rgba(245, 158, 11, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', fontWeight: 800, color: '#F59E0B', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>
              🏛️ VIRTUAL LITERATURE MUSEUM • WORLD CLASSICS & SCHOLARS WING
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F8FAFC', margin: 0 }}>
              Grand Rotunda of <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic', fontWeight: 400, color: '#F59E0B' }}>World Literature</span>
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: '4px 0 0' }}>
              Study timeless psychological epics, Shakespearean verse, Renaissance manuscripts, and philosophical lore.
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
          {ADULT_MUSEUM_EXHIBITS.map(exhibit => (
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
                    <span style={S.badge('rgba(245, 158, 11, 0.9)', '#0A0B0E')}>{exhibit.category}</span>
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
                    <div style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, fontFamily: 'monospace', marginBottom: 2 }}>CENTRAL THEME:</div>
                    <div style={{ fontSize: '0.8rem', color: '#E2E8F0', fontStyle: 'italic' }}>{exhibit.theme}</div>
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
                  Inspect Plaque 🔍
                </button>
                <button
                  onClick={() => navigate('/museum')}
                  style={{
                    padding: '10px', borderRadius: 10, border: 'none',
                    background: '#F59E0B', color: '#0A0B0E', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer'
                  }}>
                  Museum Tour →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ADULT STORIES CATALOG ── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F8FAFC', margin: 0 }}>
              Adult & Fiction <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic', fontWeight: 400, color: '#F59E0B' }}>Collection</span>
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: '4px 0 0' }}>
              Sci-Fi epics, dark mysteries, cyberpunk thrillers, and philosophical narratives.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['All', 'Sci-Fi', 'Mystery', 'Fantasy', 'Adventure'].map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                style={{
                  padding: '7px 16px', borderRadius: 50,
                  border: `1px solid ${selectedGenre === genre ? '#F59E0B' : 'rgba(255,255,255,0.08)'}`,
                  background: selectedGenre === genre ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.03)',
                  color: selectedGenre === genre ? '#F59E0B' : '#94A3B8',
                  fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
                }}>
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
          {filteredStories.map(story => {
            const isBookmarked = bookmarkedIds.includes(story.id)
            const cover = getStoryCover(story)
            return (
              <div 
                key={story.id}
                style={{
                  ...S.card, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  transition: 'all 0.2s ease', cursor: 'pointer'
                }}
                onClick={() => setActiveStoryReader(story)}
              >
                <div>
                  <div style={{
                    height: 160,
                    background: `url(${cover}) center/cover no-repeat`,
                    position: 'relative',
                    borderBottom: '1px solid rgba(255,255,255,0.08)'
                  }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(18, 19, 26, 0.95) 0%, transparent 60%)' }} />
                    <div style={{ position: 'absolute', top: 12, left: 12 }}>
                      <span style={S.badge('rgba(245, 158, 11, 0.9)', '#0A0B0E')}>📚 ADULTS</span>
                    </div>
                    <div style={{ position: 'absolute', top: 12, right: 12, fontSize: '0.72rem', color: '#06B6D4', fontFamily: 'monospace', fontWeight: 800, background: 'rgba(0,0,0,0.7)', padding: '3px 10px', borderRadius: 20 }}>
                      {(story.pages?.length || 6) * 2} PAGES
                    </div>
                  </div>

                  <div style={{ padding: '20px 22px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={S.badge('rgba(245, 158, 11, 0.15)', '#F59E0B')}>{story.genre}</span>
                      <button
                        onClick={(e) => toggleBookmark(story.id, e)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: isBookmarked ? '#F59E0B' : '#64748B', fontWeight: 800 }}>
                        {isBookmarked ? '★ SAVED' : '☆ SAVE'}
                      </button>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 8px', color: '#F8FAFC' }}>
                      {story.title}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                      {story.desc}
                    </p>
                  </div>
                </div>

                <div style={{ padding: '0 22px 22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveStoryReader(story); }}
                    style={{
                      padding: '11px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.05)', color: '#F8FAFC', fontWeight: 700, fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}>
                    Read Story
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/generate?prompt=${encodeURIComponent(story.title + ': ' + story.desc)}&style=Cinematic`)
                    }}
                    style={{
                      padding: '11px', borderRadius: 10, border: 'none',
                      background: '#F59E0B', color: '#0A0B0E',
                      fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer'
                    }}>
                    Animate Scene
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── REALISTIC ANIMATED 3D BOOK READER ── */}
      {activeStoryReader && (
        <AnimatedBookReader
          story={activeStoryReader}
          onClose={() => setActiveStoryReader(null)}
        />
      )}

      {/* ── MUSEUM EXHIBIT PLAQUE POPUP MODAL ── */}
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
              🏛️ MUSEUM EXHIBIT PLAQUE • {selectedMuseumExhibit.category.toUpperCase()}
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
                MASTERWORK QUOTE:
              </div>
              <div style={{ fontSize: '0.92rem', fontStyle: 'italic', color: '#FEF3C7' }}>
                {selectedMuseumExhibit.quote}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 800, marginBottom: 8 }}>KEY WORKS:</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {selectedMuseumExhibit.keyWorks.map(kw => (
                  <span key={kw} style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.78rem', color: '#E2E8F0' }}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => { setSelectedMuseumExhibit(null); navigate('/museum'); }}
                style={{
                  flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: '#F59E0B',
                  color: '#0A0B0E', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer'
                }}>
                Explore in Virtual Museum 🏛️
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
