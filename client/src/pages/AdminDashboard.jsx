import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const MOCK_DATA = {
  stats: { totalUsers: 142, totalAuthors: 18, totalStories: 10450, totalProjects: 840 },
  users: [
    { _id: '1', name: 'Athira K', email: 'athirapskathu@gmail.com', role: 'user', createdAt: '2026-08-01T10:00:00.000Z' },
    { _id: '2', name: 'Arjun Mehta', email: 'arjun@example.com', role: 'user', createdAt: '2026-07-29T14:30:00.000Z' },
    { _id: '3', name: 'Sara Ahmed', email: 'sara@example.com', role: 'user', createdAt: '2026-07-25T09:15:00.000Z' },
    { _id: '4', name: 'Rahul Sharma', email: 'rahul@example.com', role: 'user', createdAt: '2026-07-20T11:45:00.000Z' },
  ],
  authors: [
    { _id: 'a1', name: 'Lewis Carroll' },
    { _id: 'a2', name: 'R.L. Stevenson' },
    { _id: 'a3', name: 'Frances Hodgson Burnett' },
    { _id: 'a4', name: 'Jules Verne' },
    { _id: 'a5', name: 'Elara Moonwhisper' },
  ],
  stories: [
    { _id: 's1', title: 'The Brave Little Rabbit', author: 'AnimVerse Team', genre: 'Fairy Tale', viewCount: 1420 },
    { _id: 's2', title: 'The Golden Lantern', author: 'Folk Tales Press', genre: 'Moral Story', viewCount: 980 },
    { _id: 's3', title: 'Stars of the Deep Ocean', author: 'Marina Blue', genre: 'Adventure', viewCount: 2340 },
    { _id: 's4', title: "The Dragon's Secret Garden", author: 'Elara Moonwhisper', genre: 'Fantasy', viewCount: 1890 },
    { _id: 's5', title: 'Midnight at Blackwood Manor', author: 'A.K. Vortex', genre: 'Mystery', viewCount: 860 },
  ],
  projects: [
    { _id: 'p1', title: 'The Legend of Brave Rabbit', user: { name: 'Athira K' }, animationStyle: 'Kids Cartoon', status: 'completed' },
    { _id: 'p2', title: 'Stars of Deep Ocean', user: { name: 'Arjun Mehta' }, animationStyle: 'Cinematic', status: 'completed' },
    { _id: 'p3', title: 'Mystery at Blackwood', user: { name: 'Sara Ahmed' }, animationStyle: 'Comic Book', status: 'processing' },
    { _id: 'p4', title: 'Journey to the Moon', user: { name: 'Rahul Sharma' }, animationStyle: 'Pixar Style', status: 'completed' },
  ]
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(null)
  const [activeTab, setActiveTab] = useState('users')
  const [loading, setLoading] = useState(true)
  const [dashData, setDashData] = useState(MOCK_DATA)

  useEffect(() => {
    const savedAdmin = JSON.parse(localStorage.getItem('animverse_admin') || 'null')
    const token = localStorage.getItem('animverse_admin_token')

    if (!savedAdmin || !token) {
      setLoading(false)
      navigate('/admin-login', { replace: true })
      return
    }

    setAdmin(savedAdmin)

    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const result = await response.json()

        if (result.success && result.data) {
          setDashData(result.data)
        }
      } catch (error) {
        console.warn('API unavailable, using mock admin data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [navigate])

  const adminLogout = () => {
    setLoading(false)
    localStorage.removeItem('animverse_admin_token')
    localStorage.removeItem('animverse_admin')
    navigate('/admin-login', { replace: true })
  }

  const titles = {
    'users': 'Users Management',
    'authors': 'Authors Directory',
    'books': 'Library Books',
    'projects': 'Animation Projects'
  }

  const nonAdminUsers = (dashData.users || []).filter(u => u.role !== 'admin')

  return (
    <div className="admin-dash-container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner-lg" />
          <div>Loading Dashboard...</div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <i className="fas fa-shield-alt" /> AnimVerse Admin
        </div>
        <a className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          <i className="fas fa-users" /> Users
        </a>
        <a className={`nav-item ${activeTab === 'authors' ? 'active' : ''}`} onClick={() => setActiveTab('authors')}>
          <i className="fas fa-pen-nib" /> Authors
        </a>
        <a className={`nav-item ${activeTab === 'books' ? 'active' : ''}`} onClick={() => setActiveTab('books')}>
          <i className="fas fa-book-open" /> Library Books
        </a>
        <a className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
          <i className="fas fa-video" /> Animation Projects
        </a>

        <button className="btn-logout" onClick={adminLogout}>
          <i className="fas fa-sign-out-alt" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <h1>{titles[activeTab]}</h1>
          <div className="user-profile">
            <i className="fas fa-user-circle" style={{ fontSize: '1.5rem', color: 'var(--admin-muted)' }} />
            <span>{admin ? admin.name : 'Admin'}</span>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#38bdf8' }}><i className="fas fa-users" /></div>
            <div className="stat-info">
              <h3>Total Users</h3>
              <p>{dashData.stats?.totalUsers || 0}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#a855f7' }}><i className="fas fa-pen-nib" /></div>
            <div className="stat-info">
              <h3>Total Authors</h3>
              <p>{dashData.stats?.totalAuthors || 0}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#22c55e' }}><i className="fas fa-book" /></div>
            <div className="stat-info">
              <h3>Library Books</h3>
              <p>{dashData.stats?.totalStories || 0}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ color: '#FFD60A' }}><i className="fas fa-film" /></div>
            <div className="stat-info">
              <h3>Animation Projects</h3>
              <p>{dashData.stats?.totalProjects || 0}</p>
            </div>
          </div>
        </div>

        {/* Tab: Users */}
        <div className={`data-table-container ${activeTab === 'users' ? 'active' : ''}`}>
          <h2 className="section-title">Registered Users</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {nonAdminUsers.length > 0 ? (
                nonAdminUsers.map(u => (
                  <tr key={u._id || u.id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td><span className="badge user">{u.role}</span></td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4">No regular users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tab: Authors */}
        <div className={`data-table-container ${activeTab === 'authors' ? 'active' : ''}`}>
          <h2 className="section-title">Authors</h2>
          <table>
            <thead>
              <tr>
                <th>Author Name</th>
              </tr>
            </thead>
            <tbody>
              {dashData.authors?.length > 0 ? (
                dashData.authors.map((a, i) => (
                  <tr key={a._id || i}>
                    <td><strong>{a.name}</strong></td>
                  </tr>
                ))
              ) : (
                <tr><td>No authors found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tab: Library Books */}
        <div className={`data-table-container ${activeTab === 'books' ? 'active' : ''}`}>
          <h2 className="section-title">Library Books (Stories)</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Views</th>
              </tr>
            </thead>
            <tbody>
              {dashData.stories?.length > 0 ? (
                dashData.stories.map(b => (
                  <tr key={b._id || b.id}>
                    <td><strong>{b.title}</strong></td>
                    <td>{b.author}</td>
                    <td>{b.genre || 'N/A'}</td>
                    <td>{b.viewCount || 0}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4">No books found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tab: Animation Projects */}
        <div className={`data-table-container ${activeTab === 'projects' ? 'active' : ''}`}>
          <h2 className="section-title">Animation Projects</h2>
          <table>
            <thead>
              <tr>
                <th>Project Title</th>
                <th>User</th>
                <th>Style</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dashData.projects?.length > 0 ? (
                dashData.projects.map(p => (
                  <tr key={p._id || p.id}>
                    <td><strong>{p.title}</strong></td>
                    <td>{p.user ? p.user.name : 'Unknown'}</td>
                    <td>{p.animationStyle}</td>
                    <td>
                      <span className={`badge ${p.status === 'completed' ? 'completed' : p.status === 'processing' ? 'processing' : 'user'}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4">No projects found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      <style>{`
        :root {
          --admin-bg: #0b0f19;
          --admin-card: rgba(20, 26, 43, 0.8);
          --admin-border: rgba(255, 255, 255, 0.08);
          --admin-primary: #FFD60A;
          --admin-accent: #E63946;
          --admin-text: #e2e8f0;
          --admin-muted: #94a3b8;
        }
        .admin-dash-container {
          background: var(--admin-bg);
          color: var(--admin-text);
          font-family: 'Inter', -apple-system, sans-serif;
          margin: 0;
          padding: 0;
          min-height: 100vh;
          display: flex;
          width: 100%;
        }
        .sidebar {
          width: 260px;
          background: var(--admin-card);
          border-right: 1px solid var(--admin-border);
          backdrop-filter: blur(12px);
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 40px;
        }
        .brand i { color: var(--admin-primary); }
        .nav-item {
          padding: 12px 16px;
          border-radius: 8px;
          color: var(--admin-muted);
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
          background: rgba(255, 214, 10, 0.1);
          color: var(--admin-primary);
        }
        .main-content {
          flex: 1;
          padding: 40px;
          overflow-y: auto;
          height: 100vh;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .header h1 {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
          color: white;
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--admin-card);
          padding: 8px 16px;
          border-radius: 50px;
          border: 1px solid var(--admin-border);
          color: white;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .stat-card {
          background: var(--admin-card);
          border: 1px solid var(--admin-border);
          border-radius: 16px;
          padding: 24px;
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          gap: 20px;
          transition: transform 0.3s;
        }
        .stat-card:hover { transform: translateY(-5px); border-color: rgba(255,255,255,0.2); }
        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
        }
        .stat-info h3 { margin: 0; font-size: 0.9rem; color: var(--admin-muted); font-weight: 500; }
        .stat-info p { margin: 4px 0 0; font-size: 1.8rem; font-weight: 700; color: white; }
        
        .section-title { font-size: 1.2rem; margin-bottom: 16px; color: white; }
        .data-table-container {
          background: var(--admin-card);
          border: 1px solid var(--admin-border);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 30px;
          backdrop-filter: blur(10px);
          overflow-x: auto;
          display: none;
        }
        .data-table-container.active {
          display: block;
          animation: fadeIn 0.4s ease-out;
        }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 14px 16px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); color: white; }
        th { color: var(--admin-muted); font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; }
        td { font-size: 0.95rem; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: rgba(255,255,255,0.02); }
        
        .badge {
          padding: 4px 10px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .badge.admin { background: rgba(255, 214, 10, 0.15); color: #FFD60A; }
        .badge.user { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }
        .badge.completed { background: rgba(34, 197, 94, 0.15); color: #22c55e; }
        .badge.processing { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
        
        .btn-logout {
          margin-top: auto;
          padding: 12px;
          border-radius: 8px;
          background: rgba(230, 57, 70, 0.1);
          color: var(--admin-accent);
          border: 1px solid rgba(230, 57, 70, 0.2);
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .btn-logout:hover { background: var(--admin-accent); color: white; }
        
        .loading-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: var(--admin-bg);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
          color: white; font-size: 1.5rem; flex-direction: column; gap: 16px;
        }
        .spinner-lg {
          width: 40px; height: 40px;
          border: 4px solid rgba(255,255,255,0.1);
          border-top-color: var(--admin-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
