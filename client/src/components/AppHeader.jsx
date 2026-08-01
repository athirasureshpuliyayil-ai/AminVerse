import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function AppHeader({ title = 'Dashboard' }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState(localStorage.getItem('animverse_theme') || 'light')
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('animverse_user') || 'null')
    setUser(savedUser)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    localStorage.setItem('animverse_theme', nextTheme)
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/stories?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('animverse_token')
    localStorage.removeItem('animverse_user')
    navigate('/login')
  }

  return (
    <header className="app-header">
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>{title}</h2>

      <div className="header-search">
        <i className="fas fa-search" />
        <input 
          type="text" 
          placeholder="Search stories, prompts, projects..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      <div className="header-actions">
        {/* Quick Generate CTA */}
        <Link to="/generate" className="btn btn-primary btn-sm">
          <i className="fas fa-plus" /> Create New
        </Link>

        {/* Theme Toggle */}
        <button className="icon-btn" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
          <i className={`fas fa-${theme === 'light' ? 'moon' : 'sun'}`} />
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
            <i className="fas fa-bell" />
            <span className="badge-dot" />
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute', right: 0, top: '50px', width: '320px',
              background: 'var(--card-bg)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)',
              padding: '16px', zIndex: 200
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontWeight: 700, fontSize: '0.9rem' }}>
                <span>Notifications</span>
                <Link to="/notifications" style={{ fontSize: '0.78rem', color: 'var(--primary)' }}>View all</Link>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <div style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  🎬 <strong>Animation Ready:</strong> "The Legend of Brave Rabbit" is rendered!
                </div>
                <div style={{ padding: '8px 0' }}>
                  🎮 <strong>Relax & Play:</strong> New game "Puzzle Garden" added!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile dropdown */}
        <div className="user-avatar-btn" onClick={() => navigate('/profile')}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex', alignItems: 'center', justifySelf: 'center', color: 'white', fontWeight: 700
          }}>
            {user ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user ? user.name.split(' ')[0] : 'User'}</span>
          <i className="fas fa-chevron-down" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }} />
        </div>

        <button className="icon-btn" onClick={handleLogout} title="Logout">
          <i className="fas fa-sign-out-alt" style={{ color: 'var(--primary)' }} />
        </button>
      </div>
    </header>
  )
}
