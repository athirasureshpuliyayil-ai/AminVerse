import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { GAKEDATA } from './GameHub'

export default function GamePlay() {
  const { gameId }  = useParams()
  const navigate    = useNavigate()
  const game        = GAKEDATA.find(g => g.id === gameId) || GAKEDATA[0]

  // Calm Breathing State
  const [breathPhase, setBreathPhase] = useState('Inhale...')

  // Memory Match Cards State
  const initCards = () => [
    { id:1, icon:'🐇' },{ id:2, icon:'🐇' },
    { id:3, icon:'🐉' },{ id:4, icon:'🐉' },
    { id:5, icon:'🌟' },{ id:6, icon:'🌟' },
    { id:7, icon:'👑' },{ id:8, icon:'👑' },
  ].map(c => ({ ...c, flipped:false, matched:false }))

  const [cards, setCards]           = useState(initCards)
  const [flippedCards, setFlipped]  = useState([])
  const [garden, setGarden]         = useState(['🌸','🌳','🦋','🌿'])

  useEffect(() => {
    if (game.id !== 'calm-breathing') return
    const phases = ['Inhale...', 'Hold...', 'Exhale...']
    let idx = 0
    const t = setInterval(() => { idx = (idx+1)%phases.length; setBreathPhase(phases[idx]) }, 4000)
    return () => clearInterval(t)
  }, [game.id])

  const handleCardClick = (i) => {
    if (cards[i].flipped || cards[i].matched || flippedCards.length === 2) return
    const updated = [...cards]; updated[i].flipped = true; setCards(updated)
    const newFlipped = [...flippedCards, i]; setFlipped(newFlipped)
    if (newFlipped.length === 2) {
      if (cards[newFlipped[0]].icon === cards[newFlipped[1]].icon) {
        setTimeout(() => { setCards(p => p.map((c,j) => newFlipped.includes(j) ? { ...c, matched:true } : c)); setFlipped([]) }, 500)
      } else {
        setTimeout(() => { setCards(p => p.map((c,j) => newFlipped.includes(j) ? { ...c, flipped:false } : c)); setFlipped([]) }, 1000)
      }
    }
  }

  const S = {
    card: { background:'white', borderRadius:20, border:'1px solid #FFE0B2', boxShadow:'0 4px 20px rgba(230,57,70,0.06)', padding:40, textAlign:'center', minHeight:480, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' },
    btnOutline: { padding:'10px 20px', border:'2px solid #FFE0B2', borderRadius:10, background:'white', color:'#4A4A6A', fontWeight:700, fontSize:'0.85rem', cursor:'pointer', fontFamily:'inherit' },
    badge: { display:'inline-block', padding:'5px 14px', borderRadius:50, background:'#F0FDF4', color:'#15803d', fontSize:'0.78rem', fontWeight:700, border:'1px solid #A7F3D0' },
  }

  return (
    <AppShell title={`Relax & Play — ${game.name}`}>
      {/* Top bar */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <button style={S.btnOutline} onClick={() => navigate('/relax')}>← Back to Game Hub</button>
        <span style={S.badge}>{game.category} • {game.difficulty || 'Relaxation'}</span>
      </div>

      <div style={S.card}>

        {/* Calm Breathing */}
        {game.id === 'calm-breathing' && (
          <div>
            <div style={{
              width:220, height:220, borderRadius:'50%',
              background:'radial-gradient(circle,#4ade80,#16a34a)',
              display:'flex', alignItems:'center', justifyContent:'center',
              margin:'0 auto 32px',
              boxShadow:'0 0 80px rgba(34,197,94,0.45)',
              transition:'transform 4s ease-in-out',
              transform: breathPhase.startsWith('Inhale') ? 'scale(1.35)' : 'scale(0.82)',
            }}>
              <span style={{ fontSize:'1.6rem', fontWeight:800, color:'white' }}>{breathPhase}</span>
            </div>
            <h3 style={{ fontSize:'1.4rem', marginBottom:8 }}>Mindful Breathing Session</h3>
            <p style={{ color:'#9090A0' }}>Focus on your breath. Inhale peace, exhale stress.</p>
          </div>
        )}

        {/* Memory Match */}
        {game.id === 'memory-match' && (
          <div>
            <h3 style={{ fontSize:'1.4rem', marginBottom:24 }}>Find Matching Pairs 🧠</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 90px)', gap:14, margin:'0 auto 24px' }}>
              {cards.map((c,i) => (
                <div key={i} onClick={() => handleCardClick(i)}
                  style={{
                    width:90, height:90, borderRadius:16, cursor:'pointer',
                    background: c.matched ? '#F0FDF4' : c.flipped ? '#FFF8E7' : 'linear-gradient(135deg,#22c55e,#15803d)',
                    border: `2px solid ${c.matched ? '#A7F3D0' : '#FFE0B2'}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'2.5rem', transition:'transform 0.3s',
                    boxShadow: c.matched ? '0 2px 8px rgba(34,197,94,0.25)' : '0 2px 8px rgba(0,0,0,0.08)',
                  }}>
                  {c.flipped || c.matched ? c.icon : '❓'}
                </div>
              ))}
            </div>
            <button style={S.btnOutline} onClick={() => { setCards(initCards()); setFlipped([]) }}>
              🔄 Reset Cards
            </button>
          </div>
        )}

        {/* Puzzle Garden */}
        {game.id === 'puzzle-garden' && (
          <div>
            <h3 style={{ fontSize:'1.4rem', marginBottom:16 }}>Your Virtual Zen Garden 🪴</h3>
            <div style={{
              width:'100%', maxWidth:500, height:240, borderRadius:24,
              background:'linear-gradient(135deg,#dcfce7,#fef08a)',
              border:'3px solid #4ade80', display:'flex', alignItems:'center',
              justifyContent:'center', gap:20, fontSize:'3rem', margin:'0 auto 24px',
              boxShadow:'0 8px 30px rgba(34,197,94,0.20)',
            }}>
              {garden.map((item,i) => <span key={i}>{item}</span>)}
            </div>
            <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
              {['🌸','🌺','🌳','🦋','⛲','🪨'].map(item => (
                <button key={item} style={{ ...S.btnOutline, padding:'8px 14px' }} onClick={() => setGarden(g => [...g, item])}>
                  Add {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Generic Fallback */}
        {!['calm-breathing','memory-match','puzzle-garden'].includes(game.id) && (
          <div>
            <div style={{ fontSize:'5rem', marginBottom:16 }}>{game.icon}</div>
            <h3 style={{ fontSize:'1.6rem', marginBottom:8 }}>{game.name}</h3>
            <p style={{ color:'#9090A0', maxWidth:400, margin:'0 auto 24px' }}>{game.desc}</p>
            <div style={{ padding:'14px 24px', background:'#F0FDF4', border:'1px solid #A7F3D0', borderRadius:12, color:'#15803d', fontWeight:600 }}>
              ✨ Relax Mode Active — Play at your own comfortable pace!
            </div>
          </div>
        )}

      </div>
    </AppShell>
  )
}
