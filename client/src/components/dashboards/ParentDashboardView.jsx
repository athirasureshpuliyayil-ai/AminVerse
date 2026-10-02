import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LIBRARY_STORIES, getStoryCover } from '../../pages/StoryLibrary'
import { GAKEDATA } from '../../pages/GameHub'
import AnimatedBookReader from '../AnimatedBookReader'

export default function ParentDashboardView({ user }) {
  const navigate = useNavigate()
  const [selectedStory, setSelectedStory] = useState(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [childAgeFilter, setChildAgeFilter] = useState('All Kids')
  const [screenTimeLimit] = useState(30)

  const kidsStories = LIBRARY_STORIES.filter(s => 
    s.audience === 'Kids' || s.ageGroup === 'Children' || s.genre === 'Fairy Tale' || s.genre === 'Moral Story'
  )

  const filteredStories = childAgeFilter === 'All Kids' 
    ? kidsStories 
    : kidsStories.filter(s => s.genre?.toLowerCase().includes(childAgeFilter.toLowerCase()))

  const kidsGames = GAKEDATA.filter(g => g.category === 'Kids' || g.category === 'Everyone')

  // Curated Kids Radio Stations
  const KIDS_RADIO_STATIONS = [
    {
      id: 'k-radio-1',
      title: 'The Brave Little Hummingbird',
      category: 'Stories',
      narrator: 'Aria Songbird',
      duration: '4:15',
      cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      desc: 'A gentle, soothing bedtime story about courage and kindness in the ancient forest.'
    },
    {
      id: 'k-radio-2',
      title: 'Whispering Willow Lullaby',
      category: 'Music',
      narrator: 'Orchestral Melody',
      duration: '5:30',
      cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      desc: 'Calming harp and acoustic waves designed for peaceful children bedtime sleep.'
    },
    {
      id: 'k-radio-3',
      title: 'Curious Stars & The Moon Rover',
      category: 'Astronauts & Space',
      narrator: 'Dr. Leo Vance',
      duration: '6:10',
      cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
      desc: 'Fun space journey answering why stars twinkle and how rovers explore Mars.'
    },
    {
      id: 'k-radio-4',
      title: 'The Golden Acorn & The Squirrel King',
      category: 'Fairy Tales',
      narrator: 'Grandpa Oliver',
      duration: '3:45',
      cover: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
      desc: 'A moral audio fable teaching generosity and teamwork in woodland kingdoms.'
    }
  ]

  // Curated Kids Literature Museum Exhibits
  const KIDS_MUSEUM_EXHIBITS = [
    {
      id: 'km-1',
      title: 'Hans Christian Andersen & Timeless Fairy Tales',
      author: 'Hans Christian Andersen',
      era: '1835 • Golden Age of Children’s Tales',
      category: 'World Fairy Tales',
      keyWorks: ['The Ugly Duckling', 'The Emperor’s New Clothes', 'The Little Mermaid', 'The Steadfast Tin Soldier'],
      moral: 'True beauty radiates from resilience, kindness, and inner character.',
      image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=600&q=80',
      quote: '“Life itself is the most wonderful fairy tale.”',
      note: 'Andersen transformed folklore into tender, universal allegories that foster empathy in generations of young readers.'
    },
    {
      id: 'km-2',
      title: 'Panchatantra: The Ancient Wisdom of Animal Tales',
      author: 'Vishnu Sharma',
      era: '3rd Century BCE • Classical Indian Fables',
      category: 'Moral Fables & Wisdom',
      keyWorks: ['The Monkey and the Crocodile', 'The Turtle and the Geese', 'The Blue Jackal', 'Four True Friends'],
      moral: 'Intelligence, unity, and loyal friendship overcome physical might.',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      quote: '“Where knowledge fails, true wit and unity conquer insurmountable odds.”',
      note: 'Composed to educate young princes in statecraft and ethics through lively animal dialogues and wit.'
    },
    {
      id: 'km-3',
      title: 'Aesop’s Moral Fables from Ancient Greece',
      author: 'Aesop of Delphi',
      era: '6th Century BCE • Classical Antiquity',
      category: 'Classic Moral Tales',
      keyWorks: ['The Tortoise and the Hare', 'The Boy Who Cried Wolf', 'The Lion and the Mouse', 'The Ant and the Grasshopper'],
      moral: 'Patience, honesty, and humility always outlast haste and deceit.',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
      quote: '“No act of kindness, no matter how small, is ever wasted.”',
      note: 'The foundational bedrock of storytelling used across global schools to nurture virtue and integrity.'
    }
  ]

  const [activeRadioTrack, setActiveRadioTrack] = useState(KIDS_RADIO_STATIONS[0])
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
      const text = `${track.title}. Narrated by ${track.narrator}. ${track.desc}`
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.92
      utterance.pitch = 1.08
      utterance.volume = radioVolume / 100
      utterance.onend = () => setIsRadioPlaying(false)
      utterance.onerror = () => setIsRadioPlaying(false)
      window.speechSynthesis.speak(utterance)
      setIsRadioPlaying(true)
    }
  }

  const handleReadAloud = (text) => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel()
        setIsPlayingAudio(false)
      } else {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.9
        utterance.pitch = 1.1
        utterance.onend = () => setIsPlayingAudio(false)
        utterance.onerror = () => setIsPlayingAudio(false)
        window.speechSynthesis.speak(utterance)
        setIsPlayingAudio(true)
      }
    } else {
      alert('Text-to-speech is not supported by your browser.')
    }
  }

  const closeStoryReader = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsPlayingAudio(false)
    setSelectedStory(null)
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
      {/* ── PARENT SAFETY STUDIO BANNER ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0A0B0E 0%, #171923 50%, #1F2937 100%)',
        borderRadius: 24, padding: '40px 48px', color: 'white', position: 'relative', overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
      }}>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ maxWidth: 580 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '6px 16px', borderRadius: 50, fontSize: '0.78rem', fontWeight: 800, color: '#06B6D4', fontFamily: 'monospace', marginBottom: 16 }}>
              ✦ PARENT SAFETY SUITE • CHILD SAFETY FILTER ACTIVE
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, margin: '0 0 12px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              Welcome, {user?.name || 'Parent'}
            </h1>
            <p style={{ fontSize: '1.02rem', color: '#94A3B8', margin: 0, lineHeight: 1.7 }}>
              Manage kid-safe bedtime stories, live radio audio streams, virtual literature museum wings, and non-violent learning arcade games.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigate('/generate?audience=kids&style=Cartoon')}
              style={S.btnPrimary}
            >
              Generate Kid Animation →
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

      {/* ── PARENTAL TELEMETRY METRIC CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
        <div style={{ ...S.card, borderTop: '3px solid #F59E0B' }}>
          <div style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 8 }}>
            STARS EARNED
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#F59E0B', marginBottom: 8 }}>
            48 Stars
          </div>
          <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
            3 Quizzes completed with 100% score
          </div>
        </div>

        <div style={{ ...S.card, borderTop: '3px solid #06B6D4' }}>
          <div style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 8 }}>
            STORIES READ
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#06B6D4', marginBottom: 8 }}>
            12 Stories
          </div>
          <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
            4-day active bedtime reading streak
          </div>
        </div>

        <div style={{ ...S.card, borderTop: '3px solid #10B981' }}>
          <div style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 8 }}>
            DAILY SCREEN LIMIT
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#10B981', marginBottom: 8 }}>
            {screenTimeLimit} Min
          </div>
          <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
            Child safe mode & timer active
          </div>
        </div>

        <div style={{ ...S.card, borderTop: '3px solid #8B5CF6' }}>
          <div style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 8 }}>
            AUDIO & MUSEUM
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#8B5CF6', marginBottom: 8 }}>
            7 Exhibits
          </div>
          <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
            Kid-safe audio & fairy tale tours
          </div>
        </div>
      </div>

      {/* ── SECTION: ANIMVERSE RADIO (KID-SAFE & BEDTIME AUDIO LOUNGE) ── */}
      <div style={{ ...S.card, border: '1px solid rgba(6, 182, 212, 0.3)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', fontWeight: 800, color: '#06B6D4', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>
              📻 LIVE AUDIO BROADCAST • PARENT SAFETY SUITE
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F8FAFC', margin: 0 }}>
              AnimVerse Radio <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic', fontWeight: 400, color: '#F59E0B' }}>Bedtime & Learning Lounge</span>
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: '4px 0 0' }}>
              Gentle bedtime audio tales, soothing acoustic lullabies, nursery poetry, and children space adventures.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Link
              to="/radio"
              style={{
                padding: '9px 18px', borderRadius: 50, background: 'rgba(6, 182, 212, 0.15)',
                border: '1px solid rgba(6, 182, 212, 0.35)', color: '#06B6D4', fontWeight: 800,
                fontSize: '0.82rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6
              }}>
              Open Full Radio Station 📻 →
            </Link>
          </div>
        </div>

        {/* Radio Live Player Banner & Track Selection */}
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
                {isRadioPlaying ? '⏸ Pause Radio' : '▶ Play Kid Story'}
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
            {KIDS_RADIO_STATIONS.map(track => {
              const isSelected = activeRadioTrack.id === track.id
              return (
                <div
                  key={track.id}
                  onClick={() => toggleRadioPlay(track)}
                  style={{
                    padding: 14, borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s',
                    background: isSelected ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isSelected ? '#F59E0B' : 'rgba(255,255,255,0.07)'}`,
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

      {/* ── SECTION: LITERATURE MUSEUM (CHILDREN & FAMILY HERITAGE WING) ── */}
      <div style={{ ...S.card, border: '1px solid rgba(245, 158, 11, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', fontWeight: 800, color: '#F59E0B', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>
              🏛️ VIRTUAL LITERATURE MUSEUM • FAMILY & KIDS WING
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F8FAFC', margin: 0 }}>
              World Children's <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic', fontWeight: 400, color: '#F59E0B' }}>Literature Museum</span>
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: '4px 0 0' }}>
              Explore foundational fairy tales, ancient Panchatantra fables, and Aesop moral lore curated for young minds.
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
          {KIDS_MUSEUM_EXHIBITS.map(exhibit => (
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
                    <div style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, fontFamily: 'monospace', marginBottom: 2 }}>KEY LESSON / MORAL:</div>
                    <div style={{ fontSize: '0.8rem', color: '#E2E8F0', fontStyle: 'italic' }}>{exhibit.moral}</div>
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

      {/* ── KIDS STORIES & AUDIO READER SECTION ── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F8FAFC', margin: 0 }}>
              Kid-Safe <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic', fontWeight: 400, color: '#F59E0B' }}>Storybook Corner</span>
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: '4px 0 0' }}>
              Tap any story to launch the audio storybook reader with gentle voice narration.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {['All Kids', 'Fairy Tale', 'Moral Story'].map(filter => (
              <button
                key={filter}
                onClick={() => setChildAgeFilter(filter)}
                style={{
                  padding: '7px 16px', borderRadius: 50,
                  border: `1px solid ${childAgeFilter === filter ? '#F59E0B' : 'rgba(255,255,255,0.08)'}`,
                  background: childAgeFilter === filter ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.03)',
                  color: childAgeFilter === filter ? '#F59E0B' : '#94A3B8',
                  fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
                }}>
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {filteredStories.map(story => {
            const cover = getStoryCover(story)
            return (
              <div 
                key={story.id}
                style={{
                  ...S.card, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  transition: 'all 0.2s ease', cursor: 'pointer'
                }}
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
                      <span style={S.badge('rgba(6, 182, 212, 0.9)', '#0A0B0E')}>🧸 KIDS</span>
                    </div>
                    <div style={{ position: 'absolute', top: 12, right: 12, fontSize: '0.72rem', color: '#F59E0B', fontFamily: 'monospace', fontWeight: 800, background: 'rgba(0,0,0,0.7)', padding: '3px 10px', borderRadius: 20 }}>
                      {(story.pages?.length || 6) * 2} PAGES
                    </div>
                  </div>

                  <div style={{ padding: '20px 22px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={S.badge('rgba(6, 182, 212, 0.15)', '#06B6D4')}>{story.genre}</span>
                      <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Read time: {story.readTime || '5 min'}</span>
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
                    onClick={() => setSelectedStory(story)}
                    style={{
                      padding: '11px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.05)', color: '#F8FAFC', fontWeight: 700, fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}>
                    Read Story
                  </button>
                  <button
                    onClick={() => navigate(`/stories/${story.id}/quiz`)}
                    style={{
                      padding: '11px', borderRadius: 10, border: 'none',
                      background: '#F59E0B', color: '#0A0B0E',
                      fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer'
                    }}>
                    Take Quiz
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── KIDS MINDFUL GAMES ── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F8FAFC', margin: 0 }}>
              Mindful <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic', fontWeight: 400, color: '#F59E0B' }}>Learning Arcade</span>
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: '4px 0 0' }}>
              Calming, non-violent 10-level progressive games for memory and focus.
            </p>
          </div>
          <Link to="/relax" style={{ color: '#F59E0B', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>
            Full Level Arcade →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {kidsGames.map(game => (
            <div key={game.id} style={{ ...S.card, padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800, color: '#F8FAFC' }}>{game.name}</h3>
                  <span style={S.badge('rgba(245, 158, 11, 0.15)', '#F59E0B')}>10 Levels</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#94A3B8', marginBottom: 20, lineHeight: 1.5 }}>
                  {game.desc}
                </p>
              </div>

              <button
                onClick={() => navigate('/relax')}
                style={{
                  width: '100%', padding: '11px', borderRadius: 10, border: 'none',
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#0A0B0E',
                  fontWeight: 800, fontSize: '0.86rem', cursor: 'pointer'
                }}>
                Launch Level Arcade →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── REALISTIC ANIMATED 3D BOOK READER ── */}
      {selectedStory && (
        <AnimatedBookReader
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
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
