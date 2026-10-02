import { Link, useNavigate, useLocation } from 'react-router-dom'
import { getUser, clearAllAuth } from '../utils/authStorage'

export default function AppSidebar({ collapsed, onToggle }) {
  const location = useLocation()
  const navigate = useNavigate()
  const user = getUser() || {}
  const role = user.role || (location.pathname.includes('/parent') ? 'parent' : location.pathname.includes('/adult') ? 'adult' : location.pathname.includes('/admin') ? 'admin' : 'author')

  const logout = () => {
    clearAllAuth()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const getRoleNav = () => {
    if (role === 'parent') {
      return [
        { label: 'Parent Dashboard', path: '/dashboard/parent' },
        { label: 'Story Library 📚', path: '/stories' },
        { label: 'Animated Videos 🎬', path: '/videos' },
        { label: 'Kid Animation Studio 🎨', path: '/generate?audience=kids' },
        { label: 'AnimVerse Radio 📻', path: '/radio' },
        { label: 'Literature Museum 🏛️', path: '/museum' },
        { label: 'Story Quizzes 🧩', path: '/stories/1/quiz' },
        { label: 'Kids Level Arcade 🎮', path: '/relax' },
        { label: 'Downloads & Audio 📥', path: '/downloads' },
      ]
    }
    if (role === 'adult') {
      return [
        { label: 'Adult Lounge', path: '/dashboard/adult' },
        { label: 'Fiction Novellas 📚', path: '/stories' },
        { label: 'Animated Videos 🎬', path: '/videos' },
        { label: 'Cinematic AI Studio 🎥', path: '/generate?audience=adult' },
        { label: 'AnimVerse Radio 📻', path: '/radio' },
        { label: 'Literature Museum 🏛️', path: '/museum' },
        { label: 'Saved Bookmarks 🔖', path: '/bookmarks' },
        { label: 'Zen Focus Games 🎯', path: '/relax' },
        { label: 'Story Contest 🏆', path: '/contest' },
      ]
    }
    if (role === 'admin') {
      return [
        { label: 'Admin Dashboard', path: '/admin' },
        { label: 'Story Library 📚', path: '/stories' },
        { label: 'Animated Videos 🎬', path: '/videos' },
        { label: 'AnimVerse Radio 📻', path: '/radio' },
        { label: 'Literature Museum 🏛️', path: '/museum' },
        { label: 'Story Manager', path: '/admin' },
        { label: 'Game Manager', path: '/admin' },
      ]
    }
    return [
      { label: 'Author Studio', path: '/dashboard/author' },
      { label: 'Story Library 📚', path: '/stories' },
      { label: 'Animated Videos 🎬', path: '/videos' },
      { label: 'AI Story Animator 🎥', path: '/generate' },
      { label: 'AnimVerse Radio 📻', path: '/radio' },
      { label: 'Literature Museum 🏛️', path: '/museum' },
      { label: 'Published Stories', path: '/my-stories' },
      { label: 'Contest Showcase', path: '/contest' },
    ]
  }

  const navItems = getRoleNav()

  const S = {
    sidebar: {
      width: collapsed ? 72 : 260,
      minHeight: '100vh',
      background: '#0A0B0E',
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
      overflow: 'hidden', flexShrink: 0,
      borderRight: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
      position: 'relative', zIndex: 10,
    },
    logoArea: {
      padding: collapsed ? '24px 12px' : '24px 20px',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center', gap: 12,
      justifyContent: collapsed ? 'center' : 'space-between',
      minHeight: 73,
    },
    brandRow: { display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' },
    logoIcon: {
      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
      background: '#F59E0B',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1rem', fontWeight: 900, color: '#0A0B0E'
    },
    brandText: { overflow: 'hidden', whiteSpace: 'nowrap' },
    brandName: { fontSize: '0.95rem', fontWeight: 800, color: 'white', letterSpacing: '-0.01em' },
    brandTag: { fontSize: '0.62rem', color: '#06B6D4', fontWeight: 800, letterSpacing: '1px' },
    toggleBtn: {
      width: 28, height: 28, borderRadius: 6, background: 'rgba(255,255,255,0.08)',
      border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.85rem',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    navSection: { padding: '16px 12px', flex: 1, overflowY: 'auto' },
    sectionLabel: {
      fontSize: '0.65rem', fontWeight: 800, color: '#64748B',
      textTransform: 'uppercase', letterSpacing: '1.5px',
      padding: collapsed ? '10px 0' : '10px 8px', marginBottom: 4,
      textAlign: collapsed ? 'center' : 'left',
      display: 'block',
    },
    navItem: (active) => ({
      display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 12,
      padding: collapsed ? '11px 0' : '11px 14px',
      borderRadius: 10, marginBottom: 4, cursor: 'pointer',
      background: active ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
      border: active ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid transparent',
      transition: 'all 0.2s', textDecoration: 'none', justifyContent: collapsed ? 'center' : 'flex-start'
    }),
    navLabel: (active) => ({
      fontSize: '0.88rem', fontWeight: active ? 800 : 500,
      color: active ? '#F59E0B' : 'rgba(255,255,255,0.70)',
      overflow: 'hidden', whiteSpace: 'nowrap',
    }),
    divider: { height: 1, background: 'rgba(255,255,255,0.07)', margin: '12px 0' },
    userArea: {
      padding: collapsed ? '16px 12px' : '16px 20px',
      borderTop: '1px solid rgba(255,255,255,0.08)',
    },
    avatarRow: {
      display: 'flex', alignItems: 'center', gap: 10,
      justifyContent: collapsed ? 'center' : 'flex-start',
    },
    avatar: {
      width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
      background: '#F59E0B',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.9rem', fontWeight: 800, color: '#0A0B0E'
    },
    userName: { fontSize: '0.85rem', fontWeight: 700, color: 'white', overflow: 'hidden', whiteSpace: 'nowrap' },
    userRole: { fontSize: '0.68rem', color: '#06B6D4', marginTop: 1, textTransform: 'uppercase', fontWeight: 800 },
    logoutBtn: {
      display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 8,
      marginTop: 10, padding: collapsed ? '9px 0' : '9px 14px',
      borderRadius: 8, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)',
      color: '#F87171', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
      transition: 'all 0.2s', width: '100%', fontFamily: 'inherit',
      justifyContent: collapsed ? 'center' : 'flex-start',
    },
  }

  return (
    <aside style={S.sidebar}>
      {/* Logo */}
      <div style={S.logoArea}>
        <div style={S.brandRow}>
          <div style={S.logoIcon}>🎬</div>
          {!collapsed && (
            <div style={S.brandText}>
              <div style={S.brandName}>AnimVerse AI</div>
              <div style={S.brandTag}>{role.toUpperCase()} WORKSPACE</div>
            </div>
          )}
        </div>
        {!collapsed && (
          <button style={S.toggleBtn} onClick={onToggle}>◀</button>
        )}
      </div>

      {collapsed && (
        <button style={{ ...S.toggleBtn, margin: '12px auto', display: 'block' }} onClick={onToggle}>▶</button>
      )}

      {/* Navigation */}
      <nav style={S.navSection}>
        {!collapsed && <span style={S.sectionLabel}>{role} Workspace</span>}
        {navItems.map(item => (
          <Link key={item.path + item.label} to={item.path} style={S.navItem(isActive(item.path))}>
            {!collapsed && <span style={S.navLabel(isActive(item.path))}>{item.label}</span>}
          </Link>
        ))}

        <div style={S.divider} />

        {[{ label: 'My Profile', path: '/profile' }, { label: 'Settings', path: '/settings' }].map(item => (
          <Link key={item.path} to={item.path} style={S.navItem(isActive(item.path))}>
            {!collapsed && <span style={S.navLabel(isActive(item.path))}>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* User / Logout */}
      <div style={S.userArea}>
        {!collapsed && (
          <div style={S.avatarRow}>
            <div style={S.avatar}>{(user?.name || '?')[0].toUpperCase()}</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={S.userName}>{user?.name || 'User'}</div>
              <div style={S.userRole}>{role} Mode</div>
            </div>
          </div>
        )}
        <button style={S.logoutBtn} onClick={logout}>
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  )
}
