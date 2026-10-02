import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { getUser } from '../utils/authStorage'

// Seed stories for parent/user if no submissions exist yet
// NOTE: These are tagged submittedBy: 'parent' to distinguish from author-uploaded stories
const INITIAL_MY_STORIES = [
  {
    id: 'user-story-1',
    title: 'The Legend of the Starlight Guardian',
    author: 'You (Creator)',
    category: 'Fantasy',
    genre: 'Fantasy',
    votes: 142,
    views: 1240,
    status: 'Approved & Live',
    period: 'August 2026',
    winnerStatus: '🏆 Nominated Top 5',
    color: '#7C3AED',
    icon: '✨',
    submittedBy: 'parent',
    synopsis: 'A young stargazer unlocks ancient celestial powers to defend her kingdom from shadow wraiths.',
    fullContent: [
      "High above the obsidian towers of Aethelgard, nineteen-year-old Lyra pointed her brass telescope at the constellation of Orion.",
      "A silver shooting star streaked across the sky, leaving a glowing trail of star-dust that landed softly in her courtyard.",
      "Touching the glowing star crystal, Lyra felt ancient stellar energy flow through her veins, empowering her to become the first Starlight Guardian in a thousand years."
    ]
  },
  {
    id: 'user-story-2',
    title: "Echoes of Crater 9",
    author: 'You (Creator)',
    genre: "Sci-Fi",
    category: "Story Contest",
    status: "Published",
    createdAt: "2026-08-25",
    color: "#26C6DA",
    icon: "🚀",
    views: 98,
    votes: 19,
    submittedBy: 'parent',
    synopsis: "An astronaut receives a warning from her future self near a lunar crater.",
    fullContent: [
      "Dr. Elena Vance checked the oxygen reserves on her lunar rover. Only twelve percent remaining.",
      "Suddenly, her radio crackled with a voice identical to her own: 'Elena, turn back now. Do not enter Crater 9.'",
      "Realizing she was caught in a temporal rift, Elena used her knowledge of tachyon physics to alter the timeline and survive."
    ]
  }
]

export default function MyStories() {
  const navigate = useNavigate()
  const user = getUser() || {}
  const authorName = user.name || 'You (Creator)'

  const [myStories, setMyStories] = useState([])
  const [readingStory, setReadingStory] = useState(null)
  const [editingStory, setEditingStory] = useState(null)

  // Edit form state
  const [editTitle, setEditTitle] = useState('')
  const [editCategory, setEditCategory] = useState('Fantasy')
  const [editSynopsis, setEditSynopsis] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editColor, setEditColor] = useState('#7C3AED')
  const [editIcon, setEditIcon] = useState('📖')

  // Load ONLY parent/user submitted contest stories (NOT author-uploaded stories)
  useEffect(() => {
    const savedCustom = JSON.parse(localStorage.getItem('animverse_custom_contest_stories') || '[]')
    const savedVotes = JSON.parse(localStorage.getItem('animverse_contest_votes') || '[]')

    let combined = []

    if (savedCustom.length === 0) {
      // First time initialization: populate default user stories
      combined = INITIAL_MY_STORIES
      localStorage.setItem('animverse_custom_contest_stories', JSON.stringify(INITIAL_MY_STORIES))
    } else {
      // IMPORTANT: Only show stories submitted by 'parent' role.
      // Stories from animverse_author_stories (author uploads) use a completely separate key
      // and must NEVER appear in MyStories. Filter to parent-submitted or untagged seed stories only.
      combined = savedCustom.filter(s =>
        !s.submittedBy || s.submittedBy === 'parent'
      )
    }

    // Merge vote metrics if available
    if (savedVotes.length > 0) {
      combined = combined.map(story => {
        const found = savedVotes.find(v => v.id === story.id)
        return found ? { ...story, votes: found.votes } : story
      })
    }

    setMyStories(combined)
  }, [])

  // Save stories update helper
  const updateSavedStories = (newStories) => {
    setMyStories(newStories)
    localStorage.setItem('animverse_custom_contest_stories', JSON.stringify(newStories))
  }

  // Open Edit Modal
  const handleOpenEdit = (story) => {
    setEditingStory(story)
    setEditTitle(story.title || '')
    setEditCategory(story.category || 'Fantasy')
    setEditSynopsis(story.synopsis || '')
    setEditContent(Array.isArray(story.content) ? story.content.join('\n\n') : story.content || '')
    setEditColor(story.color || '#7C3AED')
    setEditIcon(story.icon || '📖')
  }

  // Submit Edit
  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (!editTitle.trim()) return

    const updated = myStories.map(s => {
      if (s.id === editingStory.id) {
        return {
          ...s,
          title: editTitle.trim(),
          category: editCategory,
          synopsis: editSynopsis.trim() || editContent.slice(0, 100) + '...',
          content: editContent.split('\n\n').filter(Boolean),
          color: editColor,
          icon: editIcon
        }
      }
      return s
    })

    updateSavedStories(updated)
    setEditingStory(null)
    alert('✅ Story updated successfully!')
  }

  // Delete Story Handler
  const handleDelete = (storyId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      const updated = myStories.filter(s => s.id !== storyId)
      updateSavedStories(updated)

      // Also clean up voted IDs if present
      const votedIds = JSON.parse(localStorage.getItem('animverse_voted_ids') || '[]')
      const updatedVoted = votedIds.filter(id => id !== storyId)
      localStorage.setItem('animverse_voted_ids', JSON.stringify(updatedVoted))
    }
  }

  // Calculated Stats
  const totalSubmissions = myStories.length
  const totalVotes = myStories.reduce((acc, s) => acc + (s.votes || 0), 0)
  const totalViews = myStories.reduce((acc, s) => acc + (s.views || (s.votes * 8) + 120), 0)

  return (
    <AppShell title="My Submitted Stories & Novels">
      
      {/* HEADER BANNER */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          borderRadius: 20, padding: '32px 28px', color: 'white', marginBottom: 32,
          boxShadow: '0 8px 30px rgba(15,23,42,0.2)', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: 20
        }}
      >
        <div>
          <span className="badge" style={{ background: '#38BDF8', color: '#0369A1', fontWeight: 800, padding: '6px 14px', borderRadius: 50, marginBottom: 10, display: 'inline-block' }}>
            📖 Creator Dashboard
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: '6px 0', lineHeight: 1.2 }}>
            My Submitted Stories & Contest Entries
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94A3B8', margin: 0, maxWidth: 600 }}>
            Manage, edit, read, and track reader engagement for all stories submitted by <strong style={{ color: 'white' }}>{authorName}</strong>.
          </p>
        </div>

        <button
          onClick={() => navigate('/contest')}
          style={{
            padding: '14px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
            color: 'white', border: 'none', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
            fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', gap: 8
          }}
        >
          🏆 Go to Story Contest
        </button>
      </div>

      {/* STATS OVERVIEW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 36 }}>
        
        <div className="card" style={{ padding: 20, borderRadius: 16, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            📚
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Total Submissions</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A' }}>{totalSubmissions}</div>
          </div>
        </div>

        <div className="card" style={{ padding: 20, borderRadius: 16, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            ❤️
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Total Votes Received</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A' }}>{totalVotes}</div>
          </div>
        </div>

        <div className="card" style={{ padding: 20, borderRadius: 16, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            👁️
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Total Reader Views</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A' }}>{totalViews.toLocaleString()}</div>
          </div>
        </div>

        <div className="card" style={{ padding: 20, borderRadius: 16, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            🏆
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>Contest Status</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#D97706' }}>In Competition</div>
          </div>
        </div>

      </div>

      {/* STORIES LIST / MANAGEMENT */}
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: 20 }}>
        Your Contest Submissions ({myStories.length})
      </h2>

      {myStories.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center', borderRadius: 20 }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>📖</div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>No Submitted Stories Found</h3>
          <p style={{ color: '#64748B', marginBottom: 24 }}>You haven't submitted any stories to the contest yet.</p>
          <button
            onClick={() => navigate('/contest')}
            className="btn btn-primary"
            style={{ padding: '12px 24px', fontWeight: 700 }}
          >
            ➕ Submit Your First Story
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {myStories.map(story => {
            const views = story.views || (story.votes * 8) + 120
            const status = story.status || 'Approved & Live'
            const period = story.period || 'August 2026'
            const winnerStatus = story.winnerStatus || '🏆 Nominated Candidate'

            return (
              <div 
                key={story.id} 
                className="card" 
                style={{
                  padding: 24, borderRadius: 18, border: '1px solid #E2E8F0',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  flexWrap: 'wrap', gap: 20
                }}
              >
                {/* Story Info */}
                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flex: 1, minWidth: 280 }}>
                  <div 
                    style={{
                      width: 64, height: 64, borderRadius: 16, background: story.color || '#7C3AED',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '2.2rem', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  >
                    {story.icon || '📖'}
                  </div>

                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
                      <span className="badge badge-yellow">{story.category}</span>
                      <span className="badge badge-green">{status}</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#7C3AED', background: '#F5F3FF', padding: '2px 10px', borderRadius: 50 }}>
                        {winnerStatus}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>
                      {story.title}
                    </h3>
                    
                    <p style={{ fontSize: '0.88rem', color: '#64748B', margin: '0 0 10px', lineHeight: 1.5, maxWidth: 650 }}>
                      {story.synopsis}
                    </p>

                    <div style={{ display: 'flex', gap: 16, fontSize: '0.82rem', fontWeight: 700, color: '#475569', flexWrap: 'wrap' }}>
                      <span>❤️ {story.votes || 0} Votes</span>
                      <span>👁️ {views.toLocaleString()} Views</span>
                      <span>📅 Contest: {period}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  <button
                    onClick={() => setReadingStory(story)}
                    className="btn btn-outline btn-sm"
                    style={{ fontWeight: 700 }}
                  >
                    📖 Read
                  </button>

                  <button
                    onClick={() => handleOpenEdit(story)}
                    className="btn btn-sm"
                    style={{ background: '#F1F5F9', color: '#334155', border: '1px solid #CBD5E1', fontWeight: 700 }}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => handleDelete(story.id, story.title)}
                    className="btn btn-sm"
                    style={{ background: '#FEF2F2', color: '#EF4444', border: '1px solid #FCA5A5', fontWeight: 700 }}
                  >
                    🗑️ Delete
                  </button>

                  <Link
                    to={`/generate?prompt=${encodeURIComponent(story.title + ': ' + story.synopsis)}`}
                    className="btn btn-primary btn-sm"
                    style={{ textDecoration: 'none' }}
                  >
                    ✨ Animate
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

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
              <div style={{ width: 64, height: 64, borderRadius: 16, background: readingStory.color || '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                {readingStory.icon || '📖'}
              </div>
              <div>
                <span className="badge badge-yellow">{readingStory.category}</span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '4px 0 2px', color: '#0F172A' }}>{readingStory.title}</h2>
                <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>❤️ {readingStory.votes || 0} Votes • Contest: {readingStory.period || 'August 2026'}</p>
              </div>
            </div>

            <div style={{ fontSize: '1.05rem', lineHeight: 1.85, color: '#0F172A', margin: '24px 0 32px' }}>
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
                onClick={() => { setReadingStory(null); handleOpenEdit(readingStory); }}
                className="btn btn-outline"
                style={{ flex: 1, fontWeight: 700 }}
              >
                ✏️ Edit Story
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

      {/* EDIT STORY MODAL */}
      {editingStory && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'white', borderRadius: 24, maxWidth: 650, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 36, position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            <button
              onClick={() => setEditingStory(null)}
              style={{ position: 'absolute', top: 20, right: 20, border: 'none', background: '#F3F4F6', borderRadius: '50%', width: 36, height: 36, fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ✕
            </button>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', margin: '0 0 6px' }}>✏️ Edit Story Entry</h2>
            <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: 24 }}>Update your contest submission details.</p>

            <form onSubmit={handleSaveEdit}>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 6, display: 'block' }}>Story Title *</label>
                <input
                  type="text"
                  className="form-control"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div className="form-group">
                  <label style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 6, display: 'block' }}>Category / Genre</label>
                  <select
                    className="form-control"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  >
                    <option value="Fantasy">Fantasy</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Kids">Kids</option>
                    <option value="Mystery">Mystery</option>
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 6, display: 'block' }}>Cover Theme Color</label>
                  <input
                    type="color"
                    className="form-control"
                    style={{ height: 42, padding: 4 }}
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 16 }}>
                <label style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 6, display: 'block' }}>Story Icon Emoji</label>
                <select
                  className="form-control"
                  value={editIcon}
                  onChange={(e) => setEditIcon(e.target.value)}
                >
                  <option value="📖">📖 Book</option>
                  <option value="✨">✨ Starlight</option>
                  <option value="🌌">🌌 Galaxy</option>
                  <option value="🐉">🐉 Dragon</option>
                  <option value="🚀">🚀 Rocket</option>
                  <option value="💎">💎 Crystal</option>
                  <option value="🔮">🔮 Orb</option>
                  <option value="🏰">🏰 Castle</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 16 }}>
                <label style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 6, display: 'block' }}>Short Synopsis</label>
                <input
                  type="text"
                  className="form-control"
                  value={editSynopsis}
                  onChange={(e) => setEditSynopsis(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 24 }}>
                <label style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 6, display: 'block' }}>Full Story Narrative *</label>
                <textarea
                  className="form-control"
                  rows={6}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
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
                💾 Save Story Changes
              </button>
            </form>
          </div>
        </div>
      )}

    </AppShell>
  )
}
