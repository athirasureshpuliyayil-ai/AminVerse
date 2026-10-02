import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { getStoredGames } from '../utils/authStorage'

// Sample story scenes for sequence levels
const SCENES_POOL = [
  { id: 1, order: 1, emoji: '🌅', title: 'Chapter 1: Dawn Awakening', desc: 'The young hero wakes up at sunrise in an ancient forest.' },
  { id: 2, order: 2, emoji: '🗺️', title: 'Chapter 2: The Lost Map', desc: 'Discovering a glowing map inside an ancient stone temple.' },
  { id: 3, order: 3, emoji: '🐉', title: 'Chapter 3: Dragon Companion', desc: 'Meeting a friendly crystal dragon who offers guidance.' },
  { id: 4, order: 4, emoji: '⚡', title: 'Chapter 4: Energy Nexus', desc: 'Navigating through the stormy floating sky islands.' },
  { id: 5, order: 5, emoji: '🏰', title: 'Chapter 5: Crystal Citadel', desc: 'Arriving at the legendary Crystal Citadel of Lumina.' }
]

export default function GamePlay() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  
  const [game, setGame] = useState(null)
  const [activeLevel, setActiveLevel] = useState(1)
  const [userProgress, setUserProgress] = useState({ unlockedLevel: 1, stars: 0, totalXp: 0 })
  
  // Level State
  const [levelState, setLevelState] = useState('select') // 'select', 'playing', 'completed'
  const [scenes, setScenes] = useState([])
  const [dragging, setDragging] = useState(null)
  const [moves, setMoves] = useState(0)
  const [score, setScore] = useState(0)
  const [earnedStars, setEarnedStars] = useState(3)
  const [timeLeft, setTimeLeft] = useState(45)

  useEffect(() => {
    // Find game from storage
    const games = getStoredGames()
    const found = games.find(g => g.id === gameId) || games[0]
    setGame(found)

    // Load progress
    try {
      const saved = JSON.parse(localStorage.getItem('animverse_level_progress') || '{}')
      const p = saved[gameId] || { unlockedLevel: 1, stars: 0, totalXp: 0 }
      setUserProgress(p)
      setActiveLevel(p.unlockedLevel || 1)
    } catch {
      setUserProgress({ unlockedLevel: 1, stars: 0, totalXp: 0 })
    }
  }, [gameId])

  // Start specific level
  const startLevel = (lvlNum) => {
    if (lvlNum > (userProgress.unlockedLevel || 1)) return
    setActiveLevel(lvlNum)
    setLevelState('playing')
    setMoves(0)
    setScore(0)
    setTimeLeft(45 - (lvlNum * 2))

    // Shuffle scenes based on level length
    const count = Math.min(SCENES_POOL.length, 3 + Math.floor(lvlNum / 2))
    const subset = SCENES_POOL.slice(0, count).sort(() => Math.random() - 0.5)
    setScenes(subset)
  }

  // Timer tick for playing state
  useEffect(() => {
    if (levelState !== 'playing') return
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer)
          handleLevelComplete(moves, false)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [levelState, moves])

  // Drag and drop handlers
  const onDragStart = (i) => setDragging(i)
  const onDragOver  = (e) => e.preventDefault()
  const onDrop = (targetIdx) => {
    if (dragging === null || dragging === targetIdx) return
    const next = [...scenes]
    const [item] = next.splice(dragging, 1)
    next.splice(targetIdx, 0, item)
    setScenes(next)
    setMoves(m => m + 1)
    setDragging(null)

    // Check if sorted
    const isSorted = next.every((s, idx) => s.order === idx + 1)
    if (isSorted) {
      handleLevelComplete(moves + 1, true)
    }
  }

  const handleLevelComplete = (finalMoves, passed) => {
    setLevelState('completed')
    const stars = passed ? (finalMoves <= 4 ? 3 : finalMoves <= 7 ? 2 : 1) : 1
    setEarnedStars(stars)
    const gainedXp = passed ? 100 + (activeLevel * 50) : 30
    setScore(gainedXp)

    // Update persistent progress
    const nextUnlocked = Math.max((userProgress.unlockedLevel || 1), activeLevel + 1)
    const newProgress = {
      unlockedLevel: nextUnlocked,
      totalXp: (userProgress.totalXp || 0) + gainedXp,
      stars: (userProgress.stars || 0) + stars
    }
    setUserProgress(newProgress)

    try {
      const allProg = JSON.parse(localStorage.getItem('animverse_level_progress') || '{}')
      allProg[gameId] = newProgress
      localStorage.setItem('animverse_level_progress', JSON.stringify(allProg))
    } catch (e) {
      console.error(e)
    }
  }

  if (!game) return null

  const totalLevels = game.totalLevels || 10

  return (
    <AppShell title={`Game: ${game.title}`}>
      <div style={{ maxWidth: 1000, margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        {/* Top Game Navigation Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <button onClick={() => navigate('/relax')} style={{ padding: '8px 18px', borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontWeight: 700, cursor: 'pointer' }}>
            ← Back to Game Hub
          </button>

          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FBBF24' }}>⭐ {userProgress.stars || 0} Total Stars</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#10B981' }}>⚡ {userProgress.totalXp || 0} XP</span>
          </div>
        </div>

        {/* Level Selection View */}
        {levelState === 'select' && (
          <div style={{ background: 'var(--card-bg)', borderRadius: 24, border: '1.5px solid var(--border)', padding: 36, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, #6366F1, #4F46E5)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', margin: '0 auto 16px', boxShadow: '0 6px 20px rgba(99,102,241,0.3)' }}>
                {game.icon || '🎮'}
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px' }}>{game.title}</h1>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto' }}>
                Select an unlocked level to begin the story sequence challenge. Complete levels to earn stars and unlock the next stage!
              </p>
            </div>

            {/* 10 Level Selector Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, maxWidth: 650, margin: '0 auto' }}>
              {Array.from({ length: totalLevels }).map((_, idx) => {
                const lvlNum = idx + 1
                const isUnlocked = lvlNum <= (userProgress.unlockedLevel || 1)
                const isCurrent = lvlNum === (userProgress.unlockedLevel || 1)

                return (
                  <button
                    key={lvlNum}
                    onClick={() => isUnlocked && startLevel(lvlNum)}
                    style={{
                      aspectRatio: '1',
                      borderRadius: 16,
                      border: isCurrent ? '2.5px solid #6366F1' : isUnlocked ? '1.5px solid var(--border)' : '1px dashed var(--border)',
                      background: isCurrent ? 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))' : isUnlocked ? 'var(--light-bg)' : 'rgba(0,0,0,0.04)',
                      color: isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      cursor: isUnlocked ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      transition: 'transform 0.15s, border-color 0.15s'
                    }}
                  >
                    <span>{isUnlocked ? `Level ${lvlNum}` : '🔒'}</span>
                    {isUnlocked && <span style={{ fontSize: '0.7rem', color: '#FBBF24' }}>⭐⭐⭐</span>}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Active Gameplay Arena */}
        {levelState === 'playing' && (
          <div style={{ background: 'var(--card-bg)', borderRadius: 24, border: '1.5px solid var(--border)', padding: 36, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1.5px solid var(--border)', paddingBottom: 16 }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>CHALLENGE ARENA</div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Level {activeLevel} Story Sequence</h2>
              </div>

              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ background: 'rgba(239,68,68,0.12)', color: '#EF4444', padding: '6px 14px', borderRadius: 50, fontWeight: 700, fontSize: '0.88rem' }}>
                  ⏱ Time: {timeLeft}s
                </div>
                <div style={{ background: 'rgba(99,102,241,0.12)', color: '#6366F1', padding: '6px 14px', borderRadius: 50, fontWeight: 700, fontSize: '0.88rem' }}>
                  Moves: {moves}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
              Drag and reorder the animated story chapters into their correct narrative timeline order:
            </p>

            {/* Draggable Scene Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {scenes.map((s, i) => (
                <div
                  key={s.id}
                  draggable
                  onDragStart={() => onDragStart(i)}
                  onDragOver={onDragOver}
                  onDrop={() => onDrop(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 20px', borderRadius: 14,
                    background: dragging === i ? 'rgba(99,102,241,0.15)' : s.order === i + 1 ? 'rgba(16,185,129,0.12)' : 'var(--light-bg)',
                    border: `1.5px solid ${s.order === i + 1 ? '#10B981' : 'var(--border)'}`,
                    cursor: 'grab', transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>{s.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.title}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{s.desc}</div>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>⠿</span>
                </div>
              ))}
            </div>

            <button onClick={() => setLevelState('select')} style={{ padding: '10px 20px', borderRadius: 10, background: 'var(--light-bg)', color: 'var(--text-primary)', border: '1.5px solid var(--border)', fontWeight: 700, cursor: 'pointer' }}>
              ← Return to Level Selector
            </button>
          </div>
        )}

        {/* Level Completed Overlay Modal */}
        {levelState === 'completed' && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 24, width: '100%', maxWidth: 480, padding: 36, textAlign: 'center', color: 'white' }}>
              
              <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>
                {earnedStars === 3 ? '🏆' : '🌟'}
              </div>

              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 6px', color: 'white' }}>
                Level {activeLevel} Complete!
              </h2>

              <div style={{ fontSize: '1.8rem', color: '#FBBF24', margin: '10px 0 16px' }}>
                {'⭐'.repeat(earnedStars)}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: '16px 20px', marginBottom: 28, display: 'flex', justifyContent: 'space-around' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>XP Gained</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10B981' }}>+{score} XP</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Next Level</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#818CF8' }}>Level {activeLevel + 1}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => startLevel(activeLevel)} style={{ flex: 1, padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', fontWeight: 700, cursor: 'pointer' }}>
                  🔄 Replay
                </button>
                
                {activeLevel < totalLevels ? (
                  <button onClick={() => startLevel(activeLevel + 1)} style={{ flex: 1.5, padding: '12px 16px', borderRadius: 12, background: 'linear-gradient(135deg,#6366F1,#4F46E5)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
                    Next Level {activeLevel + 1} ➡️
                  </button>
                ) : (
                  <button onClick={() => setLevelState('select')} style={{ flex: 1.5, padding: '12px 16px', borderRadius: 12, background: 'linear-gradient(135deg,#10B981,#059669)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                    🎉 All Levels Cleared!
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  )
}
