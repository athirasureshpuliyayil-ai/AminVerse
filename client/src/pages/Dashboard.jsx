import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [dashData, setDashData] = useState({
    stats: { totalProjects: 0, totalStories: 0, downloads: 0 },
    myProjects: [],
    myStories: []
  })

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('animverse_user') || 'null')
    const token = localStorage.getItem('animverse_token')

    if (!savedUser || !token) {
      navigate('/login')
      return
    }

    setUser(savedUser)

    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const result = await response.json()
        setLoading(false)

        if (result.success) {
          setDashData(result.data)
        } else {
          if (response.status === 401) {
            logout()
          } else {
            alert('Failed to load data: ' + result.message)
          }
        }
      } catch (error) {
        setLoading(false)
        console.error('Error fetching dashboard:', error)
        alert('An error occurred while fetching data.')
      }
    }

    fetchUserData()
  }, [navigate])

  const logout = () => {
    localStorage.removeItem('animverse_token')
    localStorage.removeItem('animverse_user')
    navigate('/login')
  }

  return (
    <div className="dash-container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner-lg" />
          <div>Loading your workspace...</div>
        </div>
      )}

      <aside className="sidebar">
        <Link to="/" className="brand">
          🎬 <span>AnimVerse</span>
        </Link>
        <a className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          <i className="fas fa-home" /> Overview
        </a>
        <a className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
          <i className="fas fa-video" /> My Projects
        </a>
        <a className={`nav-item ${activeTab === 'stories' ? 'active' : ''}`} onClick={() => setActiveTab('stories')}>
          <i className="fas fa-book-open" /> My Stories
        </a>

        <button className="btn-logout" onClick={logout}>
          <i className="fas fa-sign-out-alt" /> Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="header">
          <h1>Hello, {user ? user.name.split(' ')[0] : 'User'}! 👋</h1>
          <div className="user-profile">
            <i className="fas fa-user-astronaut" style={{ fontSize: '1.5rem', color: 'var(--dash-primary)' }} />
            <span>{user ? user.name : 'User'}</span>
          </div>
        </header>

        {/* Tab: Overview */}
        <div className={`content-container ${activeTab === 'overview' ? 'active' : ''}`}>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)' }}>
                <i className="fas fa-video" />
              </div>
              <div className="stat-info">
                <h3>Total Projects</h3>
                <p>{dashData.stats.totalProjects}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ color: '#a855f7', background: 'rgba(168, 85, 247, 0.1)' }}>
                <i className="fas fa-book" />
              </div>
              <div className="stat-info">
                <h3>My Stories</h3>
                <p>{dashData.stats.totalStories}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ color: '#22c55e', background: 'rgba(34, 197, 94, 0.1)' }}>
                <i className="fas fa-download" />
              </div>
              <div className="stat-info">
                <h3>Downloads</h3>
                <p>{dashData.stats.downloads}</p>
              </div>
            </div>
          </div>

          <h2 className="section-title" style={{ marginTop: '40px' }}>Recent Activity</h2>
          <div className="item-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4>Welcome to AnimVerse AI!</h4>
              <p style={{ margin: 0 }}>Start creating amazing animated stories today.</p>
            </div>
            <Link to="/" className="badge" style={{ background: 'var(--dash-primary)', color: '#000', textDecoration: 'none', padding: '10px 20px' }}>
              Go to Generator
            </Link>
          </div>
        </div>

        {/* Tab: My Projects */}
        <div className={`content-container ${activeTab === 'projects' ? 'active' : ''}`}>
          <h2 className="section-title">My Animation Projects</h2>
          <div className="grid-view">
            {dashData.myProjects.length > 0 ? (
              dashData.myProjects.map(p => (
                <div className="item-card" key={p._id || p.id}>
                  <h4>{p.title}</h4>
                  <p>Style: {p.animationStyle}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`badge ${p.status === 'completed' ? 'completed' : p.status === 'processing' ? 'processing' : ''}`}>
                      {p.status}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--dash-muted)' }}>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                <i className="fas fa-video-slash" />
                <p>You haven't created any animation projects yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Tab: My Stories */}
        <div className={`content-container ${activeTab === 'stories' ? 'active' : ''}`}>
          <h2 className="section-title">My Stories</h2>
          <div className="grid-view">
            {dashData.myStories.length > 0 ? (
              dashData.myStories.map(s => (
                <div className="item-card" key={s._id || s.id}>
                  <h4>{s.title}</h4>
                  <p>Genre: {s.genre || 'N/A'}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge"><i className="fas fa-eye" /> {s.viewCount || 0}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--dash-muted)' }}>
                      {new Date(s.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                <i className="fas fa-book-dead" />
                <p>You haven't added any stories yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        :root {
          --dash-bg: #0b0f19;
          --dash-card: rgba(255, 255, 255, 0.05);
          --dash-border: rgba(255, 255, 255, 0.1);
          --dash-primary: #38bdf8;
          --dash-accent: #a855f7;
          --dash-text: #f8fafc;
          --dash-muted: #94a3b8;
        }
        .dash-container {
          background: var(--dash-bg);
          color: var(--dash-text);
          font-family: 'Inter', -apple-system, sans-serif;
          margin: 0;
          padding: 0;
          min-height: 100vh;
          display: flex;
          width: 100%;
        }
        .sidebar {
          width: 260px;
          background: var(--dash-card);
          border-right: 1px solid var(--dash-border);
          backdrop-filter: blur(16px);
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 40px;
          text-decoration: none;
        }
        .brand span {
          background: linear-gradient(135deg, var(--dash-primary), var(--dash-accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .nav-item {
          padding: 12px 16px;
          border-radius: 8px;
          color: var(--dash-muted);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
          margin-bottom: 8px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .nav-item:hover, .nav-item.active {
          background: rgba(56, 189, 248, 0.1);
          color: var(--dash-primary);
        }
        .main-content {
          flex: 1;
          padding: 40px;
          overflow-y: auto;
          height: 100vh;
          background: radial-gradient(circle at top right, rgba(56, 189, 248, 0.05), transparent 40%);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }
        .header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          color: white;
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--dash-card);
          padding: 8px 16px;
          border-radius: 50px;
          border: 1px solid var(--dash-border);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .stat-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid var(--dash-border);
          border-radius: 20px;
          padding: 24px;
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          gap: 20px;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .stat-card:hover { 
          transform: translateY(-5px); 
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          border-color: rgba(255,255,255,0.2); 
        }
        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          background: rgba(255, 255, 255, 0.05);
        }
        .stat-info h3 { margin: 0; font-size: 0.95rem; color: var(--dash-muted); font-weight: 500; }
        .stat-info p { margin: 4px 0 0; font-size: 2rem; font-weight: 800; color: white; }
        
        .section-title { font-size: 1.4rem; margin-bottom: 20px; color: white; font-weight: 700; }
        .content-container {
          background: var(--dash-card);
          border: 1px solid var(--dash-border);
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 30px;
          backdrop-filter: blur(10px);
          display: none;
        }
        .content-container.active {
          display: block;
          animation: slideUp 0.4s ease-out;
        }
        
        .grid-view {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        
        .item-card {
          background: rgba(0,0,0,0.2);
          border: 1px solid var(--dash-border);
          border-radius: 16px;
          padding: 20px;
          transition: all 0.3s;
        }
        .item-card:hover {
          border-color: var(--dash-primary);
          background: rgba(56, 189, 248, 0.05);
        }
        .item-card h4 { margin: 0 0 8px 0; font-size: 1.1rem; color: white; }
        .item-card p { margin: 0 0 16px 0; font-size: 0.9rem; color: var(--dash-muted); }
        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 600;
          background: rgba(255,255,255,0.1);
        }
        .badge.completed { background: rgba(34, 197, 94, 0.15); color: #22c55e; }
        .badge.processing { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
        
        .btn-logout {
          margin-top: auto;
          padding: 12px;
          border-radius: 10px;
          background: transparent;
          color: var(--dash-muted);
          border: 1px solid var(--dash-border);
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .btn-logout:hover { background: rgba(255,255,255,0.05); color: white; }
        
        .loading-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: var(--dash-bg);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
          color: white; font-size: 1.5rem; flex-direction: column; gap: 16px;
        }
        .spinner-lg {
          width: 40px; height: 40px;
          border: 4px solid rgba(255,255,255,0.1);
          border-top-color: var(--dash-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--dash-muted);
        }
        .empty-state i { font-size: 3rem; margin-bottom: 16px; opacity: 0.5; }
      `}</style>
    </div>
  )
}
