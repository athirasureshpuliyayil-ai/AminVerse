import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import AppSidebar from '../components/AppSidebar'
import AppHeader from '../components/AppHeader'
import { GAKEDATA } from './GameHub'

export default function GamePlay() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const game = GAKEDATA.find(g => g.id === gameId) || GAKEDATA[0]

  // Calm Breathing State
  const [breathPhase, setBreathPhase] = useState('Inhale')
  const [breathTimer, setBreathTimer] = useState(4)

  // Memory Match Cards State
  const [cards, setCards] = useState([
    { id: 1, icon: '🐇', flipped: false, matched: false },
    { id: 2, icon: '🐇', flipped: false, matched: false },
    { id: 3, icon: '🐉', flipped: false, matched: false },
    { id: 4, icon: '🐉', flipped: false, matched: false },
    { id: 5, icon: '🌟', flipped: false, matched: false },
    { id: 6, icon: '🌟', flipped: false, matched: false },
    { id: 7, icon: '👑', flipped: false, matched: false },
    { id: 8, icon: '👑', flipped: false, matched: false }
  ])
  const [flippedCards, setFlippedCards] = useState([])

  // Garden Sandbox items
  const [garden, setGarden] = useState(['🌸', '🌳', '🦋', '🌿'])

  // Calm Breathing loop
  useEffect(() => {
    if (game.id !== 'calm-breathing') return
    const phases = ['Inhale...', 'Hold...', 'Exhale...']
    let idx = 0
    const interval = setInterval(() => {
      idx = (idx + 1) % phases.length
      setBreathPhase(phases[idx])
    }, 4000)
    return () => clearInterval(interval)
  }, [game.id])

  // Memory Match Card Flip logic
  const handleCardClick = (idx) => {
    if (cards[idx].flipped || cards[idx].matched || flippedCards.length === 2) return
    const updated = [...cards]
    updated[idx].flipped = true
    setCards(updated)
    const newFlipped = [...flippedCards, idx]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      if (cards[newFlipped[0]].icon === cards[newFlipped[1]].icon) {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => newFlipped.includes(i) ? { ...c, matched: true } : c))
          setFlippedCards([])
        }, 500)
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => newFlipped.includes(i) ? { ...c, flipped: false } : c))
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  return (
    <div className="app-shell">
      <AppSidebar />
      <main className="app-main">
        <AppHeader title={`Relax & Play — ${game.name}`} />

        <div className="app-content">
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/relax" className="btn btn-outline btn-sm">← Back to Game Hub</Link>
            <div className="section-badge" style={{ margin: 0 }}>{game.category} • {game.difficulty}</div>
          </div>

          <div className="card" style={{ padding: '40px', textAlign: 'center', minHeight: '480px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* 1. Calm Breathing Game */}
            {game.id === 'calm-breathing' && (
              <div>
                <div style={{
                  width: '200px', height: '200px', borderRadius: '50%',
                  background: 'radial-gradient(circle, var(--emerald-light), var(--emerald))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 32px',
                  boxShadow: '0 0 60px rgba(34,197,94,0.4)',
                  transition: 'transform 4s ease-in-out',
                  transform: breathPhase.startsWith('Inhale') ? 'scale(1.3)' : 'scale(0.85)'
                }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>{breathPhase}</span>
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Mindful Breathing Session</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Focus on your breath. Inhale peace, exhale stress.</p>
              </div>
            )}

            {/* 2. Memory Match Game */}
            {game.id === 'memory-match' && (
              <div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '24px' }}>Find Matching Pairs</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 90px)', gap: '16px', margin: '0 auto 24px' }}>
                  {cards.map((c, i) => (
                    <div 
                      key={i}
                      onClick={() => handleCardClick(i)}
                      style={{
                        width: '90px', height: '90px', borderRadius: '16px',
                        background: c.flipped || c.matched ? 'var(--light-bg)' : 'var(--emerald)',
                        border: '2px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2.5rem', cursor: 'pointer',
                        transition: 'transform 0.3s'
                      }}
                    >
                      {c.flipped || c.matched ? c.icon : '❓'}
                    </div>
                  ))}
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => setCards(cards.map(c => ({ ...c, flipped: false, matched: false })))}>
                  Reset Cards
                </button>
              </div>
            )}

            {/* 3. Puzzle Garden Sandbox */}
            {game.id === 'puzzle-garden' && (
              <div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Your Virtual Zen Garden</h3>
                <div style={{
                  width: '100%', maxWidth: '500px', height: '240px',
                  background: 'linear-gradient(135deg, #dcfce7, #fef08a)',
                  borderRadius: '24px', border: '3px solid var(--emerald)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px',
                  fontSize: '3rem', margin: '0 auto 24px'
                }}>
                  {garden.map((item, idx) => <span key={idx}>{item}</span>)}
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  {['🌸', '🌺', '🌳', '🦋', '⛲', '🪨'].map(item => (
                    <button key={item} className="btn btn-white" onClick={() => setGarden([...garden, item])}>
                      Add {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Generic Fallback for remaining games */}
            {!['calm-breathing', 'memory-match', 'puzzle-garden'].includes(game.id) && (
              <div>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>{game.icon}</div>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{game.name}</h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 24px' }}>
                  {game.desc}
                </p>
                <div className="alert alert-success" style={{ display: 'inline-flex' }}>
                  ✨ Relax Mode Active — Play at your own comfortable pace!
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}
