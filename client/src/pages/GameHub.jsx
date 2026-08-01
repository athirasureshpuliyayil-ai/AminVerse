import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppSidebar from '../components/AppSidebar'
import AppHeader from '../components/AppHeader'

export const GAKEDATA = [
  { id: 'memory-match', name: 'Memory Match', category: 'Kids', icon: '🧠', bg: '#FFF176', desc: 'Flip and match pairs of animals, space, and story symbols.', duration: '2-5 min', difficulty: 'Easy' },
  { id: 'calm-breathing', name: 'Calm Breathing', category: 'Everyone', icon: '🫁', bg: '#dcfce7', desc: 'Slow, peaceful guided breathing exercise with ambient sounds.', duration: '1-5 min', difficulty: 'Relaxation' },
  { id: 'color-flow', name: 'Color Flow', category: 'Adults', icon: '🎨', bg: '#FFE0B2', desc: 'Connect smooth colored paths without crossing paths.', duration: '3-6 min', difficulty: 'Medium' },
  { id: 'bubble-pop', name: 'Bubble Pop', category: 'Kids', icon: '🫧', bg: '#E0F2FE', desc: 'Tap gentle floating bubbles with soothing pop sounds.', duration: '2-4 min', difficulty: 'Easy' },
  { id: 'story-puzzle', name: 'Story Puzzle', category: 'Everyone', icon: '🧩', bg: '#FCE4EC', desc: 'Arrange scrambled story scene cards in chronological order.', duration: '3-7 min', difficulty: 'Easy' },
  { id: 'word-puzzle', name: 'Word Puzzle', category: 'Adults', icon: '🔤', bg: '#F3E5F5', desc: 'Calm word search & unscramble with relaxing themes.', duration: '4-8 min', difficulty: 'Easy' },
  { id: 'zen-match', name: 'Zen Match', category: 'Adults', icon: '🌸', bg: '#E8F5E9', desc: 'Tile matching puzzle with no countdown or stress.', duration: '3-5 min', difficulty: 'Relax Mode' },
  { id: 'puzzle-garden', name: 'Puzzle Garden', category: 'Everyone', icon: '🪴', bg: '#DCFCE7', desc: 'Build and customize your own virtual zen garden.', duration: 'Free Play', difficulty: 'Sandbox' },
]

export default function GameHub() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')

  const filteredGames = filter === 'All' ? GAKEDATA : GAKEDATA.filter(g => g.category === filter || g.category === 'Everyone')

  return (
    <div className="app-shell">
      <AppSidebar />
      <main className="app-main">
        <AppHeader title="Relax & Play — Mind Relaxation Hub" />

        <div className="app-content">
          {/* Header Banner */}
          <div style={{
            background: 'linear-gradient(135deg, var(--emerald-light), var(--secondary-light))',
            padding: '36px',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--emerald)',
            marginBottom: '32px'
          }}>
            <div className="section-badge" style={{ background: 'white', color: 'var(--emerald-dark)', borderColor: 'var(--emerald)' }}>
              🌱 Mindful & Peaceful Break
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0' }}>
              Take a Little Break. Play Something Peaceful.
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: 0 }}>
              Calming, non-competitive games designed for focus, creativity, and stress reduction for both kids and adults.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
            {['All', 'Kids', 'Adults', 'Everyone'].map(cat => (
              <button 
                key={cat}
                type="button"
                className={`btn ${filter === cat ? 'btn-emerald' : 'btn-outline'}`}
                onClick={() => setFilter(cat)}
              >
                {cat === 'Kids' ? '🧒 For Kids' : cat === 'Adults' ? '🧔 For Adults' : cat === 'Everyone' ? '🌟 For Everyone' : '📚 All Games'}
              </button>
            ))}
          </div>

          {/* Games Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {filteredGames.map(game => (
              <div 
                key={game.id} 
                className="card"
                style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '16px',
                    background: game.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2.2rem', marginBottom: '16px'
                  }}>
                    {game.icon}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>{game.name}</h3>
                    <span className="badge badge-green">{game.difficulty}</span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>{game.desc}</p>
                </div>

                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    ⏱️ Session: {game.duration}
                  </div>
                  <button 
                    className="btn btn-emerald" 
                    style={{ width: '100%' }}
                    onClick={() => navigate(`/relax/${game.id}`)}
                  >
                    Play Now ▶
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
