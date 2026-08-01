import { Link, useLocation } from 'react-router-dom'

export default function AppSidebar({ isAdmin = false }) {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <aside className="app-sidebar">
      <Link to="/" className="sidebar-logo">
        <div style={{
          width: '38px', height: '38px',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: '1.2rem'
        }}>
          🎬
        </div>
        <div>
          <div className="brand-name" style={{ fontSize: '1.2rem' }}>AnimVerse</div>
          <div className="brand-tagline">{isAdmin ? 'Admin Console' : 'Creative Studio'}</div>
        </div>
      </Link>

      {!isAdmin ? (
        <>
          <div className="sidebar-nav-group">
            <div className="sidebar-group-title">Main Studio</div>
            <Link to="/dashboard" className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}>
              <i className="fas fa-chart-pie" /> Dashboard
            </Link>
            <Link to="/generate" className={`sidebar-link ${isActive('/generate') ? 'active' : ''}`}>
              <i className="fas fa-magic" style={{ color: 'var(--primary)' }} /> Generate Animation
            </Link>
            <Link to="/stories" className={`sidebar-link ${isActive('/stories') ? 'active' : ''}`}>
              <i className="fas fa-book-open" style={{ color: 'var(--secondary-dark)' }} /> Story Library
            </Link>
            <Link to="/templates" className={`sidebar-link ${isActive('/templates') ? 'active' : ''}`}>
              <i className="fas fa-palette" /> Templates
            </Link>
          </div>

          <div className="sidebar-nav-group">
            <div className="sidebar-group-title">Mind & Play</div>
            <Link to="/relax" className={`sidebar-link ${isActive('/relax') ? 'active' : ''}`}>
              <i className="fas fa-gamepad" style={{ color: 'var(--emerald)' }} /> Relax & Play Hub
            </Link>
          </div>

          <div className="sidebar-nav-group">
            <div className="sidebar-group-title">Library & Exports</div>
            <Link to="/projects" className={`sidebar-link ${isActive('/projects') ? 'active' : ''}`}>
              <i className="fas fa-video" /> My Projects
            </Link>
            <Link to="/downloads" className={`sidebar-link ${isActive('/downloads') ? 'active' : ''}`}>
              <i className="fas fa-download" /> Downloads
            </Link>
            <Link to="/bookmarks" className={`sidebar-link ${isActive('/bookmarks') ? 'active' : ''}`}>
              <i className="fas fa-bookmark" /> Bookmarks
            </Link>
          </div>

          <div className="sidebar-nav-group" style={{ marginTop: 'auto' }}>
            <div className="sidebar-group-title">Account</div>
            <Link to="/profile" className={`sidebar-link ${isActive('/profile') ? 'active' : ''}`}>
              <i className="fas fa-user-circle" /> Profile
            </Link>
            <Link to="/settings" className={`sidebar-link ${isActive('/settings') ? 'active' : ''}`}>
              <i className="fas fa-cog" /> Settings
            </Link>
          </div>
        </>
      ) : (
        <div className="sidebar-nav-group">
          <div className="sidebar-group-title">Management</div>
          <Link to="/admin" className={`sidebar-link ${isActive('/admin') ? 'active' : ''}`}>
            <i className="fas fa-tachometer-alt" /> Overview
          </Link>
          <Link to="/admin/users" className={`sidebar-link ${isActive('/admin/users') ? 'active' : ''}`}>
            <i className="fas fa-users" /> Users
          </Link>
          <Link to="/admin/stories" className={`sidebar-link ${isActive('/admin/stories') ? 'active' : ''}`}>
            <i className="fas fa-book" /> Stories & Books
          </Link>
          <Link to="/admin/projects" className={`sidebar-link ${isActive('/admin/projects') ? 'active' : ''}`}>
            <i className="fas fa-film" /> Animation Projects
          </Link>
          <Link to="/admin/games" className={`sidebar-link ${isActive('/admin/games') ? 'active' : ''}`}>
            <i className="fas fa-gamepad" /> Games Hub
          </Link>
          <Link to="/admin/analytics" className={`sidebar-link ${isActive('/admin/analytics') ? 'active' : ''}`}>
            <i className="fas fa-chart-bar" /> Analytics & Reports
          </Link>
          <Link to="/admin/settings" className={`sidebar-link ${isActive('/admin/settings') ? 'active' : ''}`}>
            <i className="fas fa-sliders-h" /> System Settings
          </Link>
        </div>
      )}
    </aside>
  )
}
