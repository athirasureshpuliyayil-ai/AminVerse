import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../components/AppShell'

// Initial seed stories for the contest
const SEED_CONTEST_STORIES = [
  {
    id: 'c1',
    title: 'The Wandering Starlight',
    author: 'Elena Rostova',
    category: 'Sci-Fi',
    votes: 310,
    color: '#7C3AED',
    icon: '✨',
    synopsis: 'A lonely rogue starship captain discovers a dying star that communicates in symphonic chords.',
    content: [
      "Commander Elena Vance stared through the viewport of the starship Starlight Wanderer. Outside, the Orion Nebula shimmered in deep crimson and violet hues.",
      "Her sensors picked up an anomalous frequency—not static, but a structured harmonic resonance echoing from a dying white dwarf star. As the ship approached, the star's light fluctuated in sync with human brainwaves.",
      "Realizing the star was a living stellar consciousness holding memories of ancient galaxies, Elena linked her vessel's telemetry. Together, they broadcasted a cosmic song across the quadrant before the star went supernova, preserving its memory forever."
    ]
  },
  {
    id: 'c2',
    title: 'Whispers in the Willow',
    author: 'Samuel Oak',
    category: 'Fantasy',
    votes: 275,
    color: '#059669',
    icon: '🌳',
    synopsis: 'An orphaned herbalist learns to listen to the ancient trees that guard forgotten fairy spells.',
    content: [
      "In the misty foothills of Oakhaven, young Samuel gathered silver moss from the base of the Great Willow. The villagers considered the tree sacred, but Samuel knew it held a deeper secret.",
      "When a blighted fever swept through the valley, Samuel pressed his hand against the Willow's trunk. The bark warmed beneath his touch, and gentle whispers filled his mind, guiding him to combine golden orchid roots with spring dew.",
      "Following the tree's ancient wisdom, Samuel brewed an elixir that cured the village, proving that nature's magic listens to those with compassionate hearts."
    ]
  },
  {
    id: 'c3',
    title: 'The Shadow Artifact',
    author: 'Clara Higgins',
    category: 'Mystery',
    votes: 240,
    color: '#546E7A',
    icon: '🗝️',
    synopsis: 'A museum curator stumbles upon an ancient obsidian key that unlocks hidden passages beneath London.',
    content: [
      "During a midnight inventory at the British Antiquities Vault, Clara discovered an uncataloged obsidian key wrapped in faded velvet.",
      "The key bore no markings except a glowing constellation glyph that matched a stone archway hidden beneath the museum cellar.",
      "Inserting the key unlocked an underground labyrinth containing lost manuscripts from forgotten empires, unraveling a centuries-old secret society."
    ]
  },
  {
    id: 'c4',
    title: 'Guardians of the Sun',
    author: 'Leo Sterling',
    category: 'Adventure',
    votes: 195,
    color: '#FF9F1C',
    icon: '☀️',
    synopsis: 'Two sibling aviators embark on a high-altitude expedition to reignite a fading solar beacon.',
    content: [
      "High above the cloud sea, Leo and his sister Freya piloted their solar-powered airship, The Helios Vanguard.",
      "The Great Solar Beacon atop Mount Aegis was dimming, threatening to plunge their floating sky-cities into eternal frost.",
      "Navigating through violent electro-magnetic storms, they aligned the beacon's giant quartz lenses just as the sun crested the horizon, illuminating the sky kingdom once again."
    ]
  },
  {
    id: 'c5',
    title: 'The Whispering Tree',
    author: 'Ananya Sharma',
    category: 'Kids',
    votes: 180,
    color: '#FFD60A',
    icon: '🎈',
    synopsis: 'A joyful tale of woodland creatures who organize a surprise party for the forest elder.',
    content: [
      "Barnaby the bunny and Pippin the squirrel hopped through the meadow carrying colorful balloon flowers.",
      "It was Elder Owl's 100th birthday, and every animal in Whispering Woods wanted to make it unforgettable.",
      "With berry cakes, firefly lanterns, and cheerful songs, they celebrated late into the night under a canopy of glowing stars."
    ]
  }
]

// Spotlight winners
const SPOTLIGHT_WEEK = {
  id: 'spot-week',
  title: 'The Crystal Phoenix of Solaria',
  author: 'Maya Lin',
  category: 'Fantasy',
  votes: 482,
  color: '#EC4899',
  icon: '🦩',
  synopsis: 'A young glassblower crafts a phoenix sculpture that comes to life to defend her village from frost giants.',
  content: [
    "In the sun-baked desert city of Solaria, young glassblower Maya spent months shaping a majestic phoenix from glowing crimson crystal.",
    "When an unexpected frost storm threatened to freeze the city's oases, Maya's crystal phoenix absorbed the desert heat and burst into radiant flame.",
    "Soaring into the blizzard, the phoenix dispersed the icy clouds, bestowing perpetual warmth and light upon Solaria."
  ]
}

const SPOTLIGHT_MONTH = {
  id: 'spot-month',
  title: 'Chronicles of the Time Keeper',
  author: 'David Vance',
  category: 'Sci-Fi',
  votes: 1240,
  color: '#3B82F6',
  icon: '⏳',
  synopsis: 'A master watchmaker builds a chronometer capable of rewinding tragic moments in human history.',
  content: [
    "Inside his workshop in Prague, master horologist David Vance assembled the gears of the Chronos Sphere.",
    "Unlike ordinary clocks, the Chronos Sphere manipulated tachyon fields, allowing the user to step backward three minutes into the past.",
    "David used his creation to prevent tragic accidents throughout the city, earning him the legendary title of Prague's Silent Time Keeper."
  ]
}

// Previous Winners / Hall of Fame
const PAST_WINNERS = [
  { rank: '🥇 1st Place', month: 'July 2026', title: 'The Last Dragon Rider', author: 'Sir Eric Vance', votes: '3,450 Votes', icon: '🐉', color: '#7C3AED' },
  { rank: '🥈 2nd Place', month: 'June 2026', title: 'Beyond the Event Horizon', author: 'Dr. Aris Thorne', votes: '2,980 Votes', icon: '🌌', color: '#2563EB' },
  { rank: '🥉 3rd Place', month: 'May 2026', title: 'Kingdom of the Silver Sea', author: 'Sophia Loren', votes: '2,410 Votes', icon: '👑', color: '#059669' }
]

export default function StoryContest() {
  const [stories, setStories] = useState([])
  const [votedIds, setVotedIds] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')

  // Modal states
  const [readingStory, setReadingStory] = useState(null)
  const [showSubmitModal, setShowSubmitModal] = useState(false)

  // Submit form state
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newCategory, setNewCategory] = useState('Fantasy')
  const [newSynopsis, setNewSynopsis] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newColor, setNewColor] = useState('#7C3AED')
  const [newIcon, setNewIcon] = useState('📖')

  // Load state from localStorage on mount
  useEffect(() => {
    const savedCustom = JSON.parse(localStorage.getItem('animverse_custom_contest_stories') || '[]')
    const savedVotes = JSON.parse(localStorage.getItem('animverse_contest_votes') || '[]')
    const savedVotedIds = JSON.parse(localStorage.getItem('animverse_voted_ids') || '[]')

    // Merge custom submitted stories with seed stories
    let combined = [...savedCustom, ...SEED_CONTEST_STORIES]

    // Apply stored votes
    if (savedVotes.length > 0) {
      combined = combined.map(story => {
        const found = savedVotes.find(v => v.id === story.id)
        return found ? { ...story, votes: found.votes } : story
      })
    }

    setStories(combined)
    setVotedIds(savedVotedIds)
  }, [])

  // Vote / Like Handler
  const handleVote = (storyId) => {
    let updatedStories = [...stories]
    let updatedVotedIds = [...votedIds]

    if (votedIds.includes(storyId)) {
      // Toggle off vote
      updatedVotedIds = updatedVotedIds.filter(id => id !== storyId)
      updatedStories = updatedStories.map(s => s.id === storyId ? { ...s, votes: s.votes - 1 } : s)
    } else {
      // Toggle on vote
      updatedVotedIds.push(storyId)
      updatedStories = updatedStories.map(s => s.id === storyId ? { ...s, votes: s.votes + 1 } : s)
    }

    setStories(updatedStories)
    setVotedIds(updatedVotedIds)

    // Save to localStorage
    localStorage.setItem('animverse_voted_ids', JSON.stringify(updatedVotedIds))
    const voteMap = updatedStories.map(s => ({ id: s.id, votes: s.votes }))
    localStorage.setItem('animverse_contest_votes', JSON.stringify(voteMap))
  }

  // Handle New Story Submission
  const handleSubmitStory = (e) => {
    e.preventDefault()
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Please provide a story title and narrative content.')
      return
    }

    const createdStory = {
      id: 'custom-' + Date.now(),
      title: newTitle.trim(),
      author: newAuthor.trim() || 'Anonymous Creator',
      category: newCategory,
      votes: 1, // Start with 1 self vote
      color: newColor,
      icon: newIcon,
      synopsis: newSynopsis.trim() || newContent.slice(0, 120) + '...',
      content: newContent.split('\n\n').filter(Boolean),
      submittedBy: 'parent'  // Tag: this is a parent/user contest submission (not author)
    }

    const updatedCustom = [createdStory, ...JSON.parse(localStorage.getItem('animverse_custom_contest_stories') || '[]')]
    localStorage.setItem('animverse_custom_contest_stories', JSON.stringify(updatedCustom))

    setStories(prev => [createdStory, ...prev])
    setVotedIds(prev => [...prev, createdStory.id])
    localStorage.setItem('animverse_voted_ids', JSON.stringify([...votedIds, createdStory.id]))

    // Reset Form
    setNewTitle('')
    setNewAuthor('')
    setNewSynopsis('')
    setNewContent('')
    setShowSubmitModal(false)
    alert('🎉 Your story has been successfully submitted to the contest!')
  }

  // Filtered stories sorted by highest votes
  const filteredStories = stories.filter(s => activeCategory === 'All' || s.category === activeCategory)

  return (
    <AppShell title="Story Contest & Awards">
      
      {/* CONTEST BANNER */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
          borderRadius: 20, padding: '36px 32px', color: 'white', marginBottom: 36,
          boxShadow: '0 8px 30px rgba(67, 56, 202, 0.25)', position: 'relative', overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 680 }}>
          <span className="badge" style={{ background: '#F59E0B', color: '#78350F', fontWeight: 800, padding: '6px 14px', borderRadius: 50, marginBottom: 12, display: 'inline-block' }}>
            🏆 August 2026 Monthly Championship
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '8px 0', lineHeight: 1.2 }}>
            Write, Publish & Win the AnimVerse Story Contest
          </h1>
          <p style={{ fontSize: '1rem', color: '#E0E7FF', marginBottom: 24, lineHeight: 1.6 }}>
            Submit your original story or novel to compete for community votes. Top winners receive <strong>$500 Studio Credits</strong> and a full <strong>AI Animated Adaptation</strong>!
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowSubmitModal(true)}
              style={{
                padding: '14px 28px', borderRadius: 12, background: 'linear-gradient(135deg, #E63946, #C1121F)',
                color: 'white', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(230,57,70,0.4)', display: 'flex', alignItems: 'center', gap: 8
              }}
            >
              ➕ Submit Your Story Now
            </button>
            <a
              href="#trending-section"
              style={{
                padding: '14px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.15)',
                color: 'white', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 700, fontSize: '0.95rem',
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8
              }}
            >
              🔥 Explore Entries
            </a>
          </div>
        </div>

        {/* Decorative background trophy */}
        <div style={{ position: 'absolute', right: -20, bottom: -30, fontSize: '14rem', opacity: 0.12, pointerEvents: 'none' }}>
          🏆
        </div>
      </div>

      {/* SPOTLIGHT SECTION: STORY OF THE WEEK & MONTH */}
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1A1A2E', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>🌟</span> Featured Contest Spotlights
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 40 }}>
        
        {/* Story of the Week */}
        <div className="card" style={{ padding: 24, borderRadius: 20, border: '2px solid #FCD34D', background: 'linear-gradient(180deg, #FFFDF5 0%, #FFFFFF 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span className="badge" style={{ background: '#FEF3C7', color: '#92400E', fontWeight: 800 }}>⭐ Story of the Week</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#D97706' }}>❤️ {SPOTLIGHT_WEEK.votes} Votes</span>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
              <div style={{ width: 60, height: 60, borderRadius: 16, background: SPOTLIGHT_WEEK.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', flexShrink: 0 }}>
                {SPOTLIGHT_WEEK.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', margin: '0 0 4px', fontWeight: 800, color: '#1A1A2E' }}>{SPOTLIGHT_WEEK.title}</h3>
                <p style={{ fontSize: '0.82rem', color: '#6B7280', margin: 0 }}>by {SPOTLIGHT_WEEK.author} • <span style={{ color: '#D97706', fontWeight: 600 }}>{SPOTLIGHT_WEEK.category}</span></p>
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#4B5563', lineHeight: 1.6, marginBottom: 20 }}>{SPOTLIGHT_WEEK.synopsis}</p>
          </div>
          <button
            onClick={() => setReadingStory(SPOTLIGHT_WEEK)}
            className="btn btn-outline"
            style={{ width: '100%', borderColor: '#FCD34D', color: '#B45309', fontWeight: 700 }}
          >
            📖 Read Story of the Week
          </button>
        </div>

        {/* Story of the Month */}
        <div className="card" style={{ padding: 24, borderRadius: 20, border: '2px solid #A78BFA', background: 'linear-gradient(180deg, #FAF5FF 0%, #FFFFFF 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span className="badge" style={{ background: '#F3E8FF', color: '#6B21A8', fontWeight: 800 }}>👑 Story of the Month</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7C3AED' }}>❤️ {SPOTLIGHT_MONTH.votes} Votes</span>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
              <div style={{ width: 60, height: 60, borderRadius: 16, background: SPOTLIGHT_MONTH.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', flexShrink: 0 }}>
                {SPOTLIGHT_MONTH.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', margin: '0 0 4px', fontWeight: 800, color: '#1A1A2E' }}>{SPOTLIGHT_MONTH.title}</h3>
                <p style={{ fontSize: '0.82rem', color: '#6B7280', margin: 0 }}>by {SPOTLIGHT_MONTH.author} • <span style={{ color: '#7C3AED', fontWeight: 600 }}>{SPOTLIGHT_MONTH.category}</span></p>
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#4B5563', lineHeight: 1.6, marginBottom: 20 }}>{SPOTLIGHT_MONTH.synopsis}</p>
          </div>
          <button
            onClick={() => setReadingStory(SPOTLIGHT_MONTH)}
            className="btn btn-outline"
            style={{ width: '100%', borderColor: '#C4B5FD', color: '#6D28D9', fontWeight: 700 }}
          >
            📖 Read Story of the Month
          </button>
        </div>

      </div>

      {/* TRENDING CONTEST ENTRIES */}
      <div id="trending-section" style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1A1A2E', margin: 0 }}>🔥 Trending Contest Entries ({filteredStories.length})</h2>
            <p style={{ fontSize: '0.88rem', color: '#6B7280', margin: 0 }}>Vote for your favorite original stories to help them reach the leaderboard!</p>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['All', 'Fantasy', 'Sci-Fi', 'Adventure', 'Kids', 'Mystery'].map(cat => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveCategory(cat)}
                style={{ borderRadius: 20, padding: '6px 14px' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {filteredStories.map(story => {
            const isVoted = votedIds.includes(story.id)
            return (
              <div key={story.id} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 16 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span className="badge badge-yellow">{story.category}</span>
                    <button
                      onClick={() => handleVote(story.id)}
                      style={{
                        padding: '6px 12px', borderRadius: 50, border: 'none',
                        background: isVoted ? '#FEF2F2' : '#F3F4F6',
                        color: isVoted ? '#EF4444' : '#6B7280',
                        fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s'
                      }}
                    >
                      <span>{isVoted ? '❤️' : '🤍'}</span>
                      <span>{story.votes}</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: story.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0 }}>
                      {story.icon}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', margin: '0 0 2px', fontWeight: 800, color: '#1A1A2E' }}>{story.title}</h3>
                      <p style={{ fontSize: '0.8rem', color: '#9CA3AF', margin: 0 }}>by {story.author}</p>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#4B5563', lineHeight: 1.5, marginBottom: 20 }}>
                    {story.synopsis}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => setReadingStory(story)}
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1 }}
                  >
                    📖 Read Story
                  </button>
                  <Link
                    to={`/generate?prompt=${encodeURIComponent(story.title + ': ' + story.synopsis)}`}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}
                  >
                    ✨ Animate
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* HALL OF FAME / PREVIOUS WINNERS */}
      <div style={{ background: '#F9FAFB', borderRadius: 20, padding: 32, border: '1px solid #E5E7EB', marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1A1A2E', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>🏛️</span> Hall of Fame — Previous Winners
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: 24 }}>Honoring championship stories from past monthly community tournaments.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {PAST_WINNERS.map((winner, idx) => (
            <div key={idx} style={{ background: 'white', padding: 20, borderRadius: 16, border: '1px solid #E5E7EB', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#7C3AED', background: '#F5F3FF', padding: '4px 10px', borderRadius: 50 }}>
                  {winner.rank}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>{winner.month}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: winner.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                  {winner.icon}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 2px', fontSize: '1rem', fontWeight: 800, color: '#1A1A2E' }}>{winner.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B7280' }}>by {winner.author}</p>
                </div>
              </div>
              <div style={{ marginTop: 12, fontSize: '0.8rem', fontWeight: 700, color: '#059669', textAlign: 'right' }}>
                🏆 {winner.votes}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* READ STORY MODAL */}
      {readingStory && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'white', borderRadius: 24, maxWidth: 700, width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: 36, position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            <button
              onClick={() => setReadingStory(null)}
              style={{ position: 'absolute', top: 20, right: 20, border: 'none', background: '#F3F4F6', borderRadius: '50%', width: 36, height: 36, fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: readingStory.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                {readingStory.icon}
              </div>
              <div>
                <span className="badge badge-yellow">{readingStory.category}</span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '4px 0 2px', color: '#1A1A2E' }}>{readingStory.title}</h2>
                <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>Written by {readingStory.author} • ❤️ {readingStory.votes} Votes</p>
              </div>
            </div>

            <div style={{ fontSize: '1.05rem', lineHeight: 1.85, color: '#1A1A2E', margin: '24px 0 32px' }}>
              {Array.isArray(readingStory.content) ? (
                readingStory.content.map((p, idx) => (
                  <p key={idx} style={{ marginBottom: 16 }}>{p}</p>
                ))
              ) : (
                <p>{readingStory.content || readingStory.synopsis}</p>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => { handleVote(readingStory.id); }}
                className="btn"
                style={{ flex: 1, background: votedIds.includes(readingStory.id) ? '#EF4444' : '#F3F4F6', color: votedIds.includes(readingStory.id) ? 'white' : '#374151', fontWeight: 700 }}
              >
                {votedIds.includes(readingStory.id) ? '❤️ Voted' : '🤍 Vote for Story'}
              </button>
              <Link
                to={`/generate?prompt=${encodeURIComponent(readingStory.title + ': ' + readingStory.synopsis)}`}
                className="btn btn-primary"
                style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}
              >
                ✨ Convert to Video
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* SUBMIT STORY MODAL */}
      {showSubmitModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'white', borderRadius: 24, maxWidth: 650, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 36, position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            <button
              onClick={() => setShowSubmitModal(false)}
              style={{ position: 'absolute', top: 20, right: 20, border: 'none', background: '#F3F4F6', borderRadius: '50%', width: 36, height: 36, fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ✕
            </button>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1A1A2E', margin: '0 0 6px' }}>🏆 Submit Your Story to Contest</h2>
            <p style={{ fontSize: '0.88rem', color: '#6B7280', marginBottom: 24 }}>Share your creation with the community and earn votes!</p>

            <form onSubmit={handleSubmitStory}>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 6, display: 'block' }}>Story Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. The Legend of the Lost Realm"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div className="form-group">
                  <label style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 6, display: 'block' }}>Author Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your Name or Pen Name"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 6, display: 'block' }}>Category / Genre</label>
                  <select
                    className="form-control"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="Fantasy">Fantasy</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Kids">Kids</option>
                    <option value="Mystery">Mystery</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div className="form-group">
                  <label style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 6, display: 'block' }}>Cover Theme Color</label>
                  <input
                    type="color"
                    className="form-control"
                    style={{ height: 42, padding: 4 }}
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 6, display: 'block' }}>Story Icon Emoji</label>
                  <select
                    className="form-control"
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value)}
                  >
                    <option value="📖">📖 Book</option>
                    <option value="🐉">🐉 Dragon</option>
                    <option value="🚀">🚀 Rocket</option>
                    <option value="✨">✨ Magic</option>
                    <option value="💎">💎 Crystal</option>
                    <option value="🔮">🔮 Orb</option>
                    <option value="🏰">🏰 Castle</option>
                    <option value="🦁">🦁 Lion</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 16 }}>
                <label style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 6, display: 'block' }}>Short Synopsis / Teaser</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Brief 1-2 sentence overview of your story..."
                  value={newSynopsis}
                  onChange={(e) => setNewSynopsis(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 24 }}>
                <label style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 6, display: 'block' }}>Full Story Narrative *</label>
                <textarea
                  className="form-control"
                  rows={6}
                  placeholder="Write or paste your story paragraphs here (separate paragraphs with blank lines)..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%', padding: 16, borderRadius: 12,
                  background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                  color: 'white', fontWeight: 800, fontSize: '1rem', border: 'none',
                  cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(124,58,237,0.3)'
                }}
              >
                🚀 Submit Story to Contest
              </button>
            </form>
          </div>
        </div>
      )}

    </AppShell>
  )
}
