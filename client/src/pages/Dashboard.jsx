import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppSidebar from '../components/AppSidebar'
import AppHeader from '../components/AppHeader'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('animverse_user') || 'null')
    const token = localStorage.getItem('animverse_token')
    if (!saved || !token) { navigate('/login'); return }
    setUser(saved)
  }, [navigate])

  const stats = [
    { label: 'Total Projects', value: 3, icon: '🎬', color: 'var(--primary)', bg: '#FFE0E3' },
    { label: 'Videos Generated', value: 2, icon: '🎞️', color: 'var(--secondary-dark)', bg: '#FFF9C4' },
    { label: 'Stories Read', value: 7, icon: '📖', color: 'var(--emerald-dark)', bg: 'var(--emerald-light)' },
    { label: 'Relaxation Sessions', value: 4, icon: '🎮', color: '#7C3AED', bg: '#F3E5F5' },
  ]

  const recentProjects = [
    { id: 'p1', title: 'The Legend of Brave Rabbit', style: 'Kids Cartoon', status: 'completed', thumb: 'https://images.unsplash.com/photo-1511497584788-876761c119ef?w=300&q=70' },
    { id: 'p2', title: 'Stars of Deep Ocean', style: 'Cinematic', status: 'completed', thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=70' },
    { id: 'p3', title: 'Mystery at Blackwood', style: 'Comic Book', status: 'processing', thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&q=70' },
  ]

  const quickGames = [
    { id: 'memory-match', name: 'Memory Match', icon: '🧠', color: '#FFF9C4' },
    { id: 'calm-breathing', name: 'Calm Breathing', icon: '🫁', color: 'var(--emerald-light)' },
    { id: 'puzzle-garden', name: 'Puzzle Garden', icon: '🪴', color: '#DCFCE7' },
  ]

  if (!user) return null

  return (
    <div className="app-shell">
      <AppSidebar />
      <main className="app-main">
        <AppHeader title="My Creative Studio" />

        <div className="app-content">
          {/* Welcome Banner */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--accent), var(--secondary))',
            borderRadius: 'var(--radius-lg)', padding: '32px', marginBottom: '32px', color: 'white',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px'
          }}>
            <div>
              <h1 style={{ fontSize: '1.9rem', fontWeight: 800, margin: '0 0 8px' }}>
                Hello, {user.name.split(' ')[0]}! 👋
              </h1>
              <p style={{ opacity: 0.85, margin: 0, fontSize: '1rem' }}>
                Ready to turn another story into an animated world?
              </p>
            </div>
            <Link to="/generate" className="btn btn-white btn-lg">
              <i className="fas fa-magic" /> Start Generating
            </Link>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            {stats.map((s, i) => (
              <div key={i} className="card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.label}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Two-column grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>

            {/* Recent Projects */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Recent Projects</h2>
                <Link to="/projects" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>View All →</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {recentProjects.map(p => (
                  <div key={p.id} className="card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <img src={p.thumb} alt={p.title} style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{p.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.style}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                      <span className={`badge ${p.status === 'completed' ? 'badge-green' : 'badge-yellow'}`}>{p.status}</span>
                      <Link to="/generate" style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}>Continue →</Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
                <Link to="/generate" className="btn btn-primary"><i className="fas fa-plus" /> New Animation</Link>
                <Link to="/stories" className="btn btn-secondary"><i className="fas fa-book-open" /> Browse Stories</Link>
                <Link to="/relax" className="btn btn-emerald"><i className="fas fa-gamepad" /> Relax & Play</Link>
              </div>
            </div>

            {/* Right column: Relax + Story Library teaser */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Relax & Play Widget */}
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '1.5rem' }}>🎮</span>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Relax & Play</h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Take a quick break. Come back refreshed and creative.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {quickGames.map(g => (
                    <Link key={g.id} to={`/relax/${g.id}`} className="btn btn-outline btn-sm" style={{ justifyContent: 'flex-start', gap: '10px' }}>
                      <span style={{ fontSize: '1.1rem' }}>{g.icon}</span> {g.name}
                    </Link>
                  ))}
                </div>
                <Link to="/relax" style={{ display: 'block', textAlign: 'center', marginTop: '12px', fontSize: '0.82rem', color: 'var(--emerald-dark)', fontWeight: 600 }}>
                  Explore All 8 Games →
                </Link>
              </div>

              {/* Story Library Teaser */}
              <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, var(--light-bg), white)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '1.5rem' }}>📚</span>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Story Library</h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  10,000+ stories — kids, teens & adults.
                </p>
                <Link to="/stories" className="btn btn-secondary" style={{ width: '100%' }}>
                  Browse Stories
                </Link>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
