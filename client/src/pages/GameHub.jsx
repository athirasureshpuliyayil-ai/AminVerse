import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { getStoredGames } from '../utils/authStorage'

export const GAKEDATA = [
  { id: 'g1', title: 'Story Quest: Sequence Master', category: 'Puzzle & Logic', totalLevels: 10, currentLevel: 3, xp: 450, stars: 7, desc: 'Arrange animated scene keyframes in chronological order to build the master story.', color: '#6366F1' },
  { id: 'g2', title: 'Character Memory Matrix', category: 'Brain & Memory', totalLevels: 10, currentLevel: 2, xp: 280, stars: 5, desc: 'Test your memory recall by matching character cards and legendary relics.', color: '#8B5CF6' },
  { id: 'g3', title: 'Animate Word Realm', category: 'Vocabulary', totalLevels: 10, currentLevel: 1, xp: 120, stars: 3, desc: 'Unscramble story keywords to unleash AI animated scene transformations.', color: '#10B981' },
  { id: 'g4', title: 'Director\'s Sound Studio', category: 'Audio & Music', totalLevels: 8, currentLevel: 1, xp: 90, stars: 2, desc: 'Match voiceover audio clips and ambient soundscapes to animated keyframes.', color: '#06B6D4' }
]

export default function GameHub() {
  const navigate = useNavigate()
  const [games, setGames] = useState([])
  const [userProgress, setUserProgress] = useState({})

  useEffect(() => {
    // Load stored games (including admin created games)
    setGames(getStoredGames())

    // Load level progress state from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('animverse_level_progress') || '{}')
      setUserProgress(saved)
    } catch {
      setUserProgress({})
    }
  }, [])

  const getGameStats = (gameId, totalLevels = 10) => {
    const prog = userProgress[gameId] || { currentLevel: 1, totalXp: 0, stars: 0 }
    return {
      unlockedLevel: prog.unlockedLevel || 1,
      totalXp: prog.totalXp || 0,
      stars: prog.stars || 0,
      maxLevels: totalLevels
    }
  }

  return (
    <AppShell title="Interactive Level Arcade Engine">
      <div style={{ maxWidth: 1200, margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        {/* Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0A0B0E 0%, #171923 50%, #1F2937 100%)',
          borderRadius: 24,
          padding: '40px 48px',
          marginBottom: 36,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 640 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#F59E0B', padding: '6px 16px', borderRadius: 50, fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.5px', marginBottom: 16 }}>
              LEVEL PROGRESSION ENGINE
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
              Level-Based Interactive Arcade
            </h1>
            <p style={{ fontSize: '1rem', color: '#94A3B8', lineHeight: 1.7, margin: 0 }}>
              Master Levels 1 through 10 in each story arcade module. Unlock stages, earn 3-Star ratings, gain XP, and level up your creator rank.
            </p>
          </div>
        </div>

        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Level Arcade Challenges
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Complete Level 1 to unlock Level 2 and progress through all 10 stages
            </p>
          </div>
        </div>

        {/* Games Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
          {games.map(game => {
            const stats = getGameStats(game.id, game.totalLevels || 10)
            const progressPct = Math.min(100, Math.round((stats.unlockedLevel / (game.totalLevels || 10)) * 100))

            return (
              <div
                key={game.id}
                onClick={() => navigate(`/relax/${game.id}`)}
                style={{
                  background: 'rgba(30, 41, 59, 0.65)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 20,
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: 28,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                }}
              >
                <div>
                  {/* Top Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: 50,
                      background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.5px'
                    }}>
                      {game.category || 'Arcade'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>
                      Level {stats.unlockedLevel} / {game.totalLevels || 10}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC', marginBottom: 8 }}>
                    {game.title}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: 20 }}>
                    {game.desc}
                  </p>
                </div>

                {/* Level Progress Stats */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', fontWeight: 700, marginBottom: 8, color: '#CBD5E1' }}>
                    <span>Progress: {progressPct}%</span>
                    <span style={{ color: '#F59E0B' }}>★ {stats.stars} Stars</span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: 6, borderRadius: 10, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 20 }}>
                    <div style={{ width: `${progressPct}%`, height: '100%', background: 'linear-gradient(90deg, #F59E0B, #10B981)', transition: 'width 0.3s' }} />
                  </div>

                  <button style={{
                    width: '100%', padding: '12px 18px', borderRadius: 12,
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    color: '#0A0B0E', border: 'none', fontWeight: 800, fontSize: '0.9rem',
                    cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)'
                  }}>
                    Launch Level {stats.unlockedLevel} →
                  </button>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </AppShell>
  )
}
