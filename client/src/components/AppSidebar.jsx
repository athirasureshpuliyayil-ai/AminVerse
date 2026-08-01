import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const NAV = [
  { icon:'🏠', label:'Dashboard',       path:'/dashboard' },
  { icon:'🎬', label:'Create Animation',path:'/generate' },
  { icon:'📚', label:'Story Library',   path:'/stories' },
  { icon:'🗂️', label:'My Projects',     path:'/projects' },
  { icon:'📥', label:'Downloads',       path:'/downloads' },
  { icon:'🔖', label:'Bookmarks',       path:'/bookmarks' },
  { icon:'🎨', label:'Templates',       path:'/templates' },
  { icon:'🎮', label:'Relax & Play',    path:'/relax' },
]

const ADMIN_NAV = [
  { icon:'🛡️', label:'Admin Console',  path:'/admin' },
  { icon:'👥', label:'Users',           path:'/admin/users' },
  { icon:'🎮', label:'Games Manager',   path:'/admin/games' },
]

export default function AppSidebar({ collapsed, onToggle }) {
  const location = useLocation()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('animverse_user') || '{}')
  const isAdmin = user?.role === 'admin'

  const logout = () => {
    localStorage.removeItem('animverse_token')
    localStorage.removeItem('animverse_user')
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  const S = {
    sidebar: {
      width: collapsed ? 72 : 260,
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1A1A2E 0%, #16213E 60%, #0F3460 100%)',
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
      overflow: 'hidden', flexShrink: 0,
      boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
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
      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
      background: 'linear-gradient(135deg,#E63946,#FFD60A)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.3rem', boxShadow: '0 4px 14px rgba(230,57,70,0.40)',
    },
    brandText: { overflow: 'hidden', whiteSpace: 'nowrap' },
    brandName: { fontSize: '0.95rem', fontWeight: 800, color: 'white' },
    brandTag: { fontSize: '0.62rem', color: 'rgba(255,255,255,0.45)', marginTop: 1 },
    toggleBtn: {
      width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.08)',
      border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.85rem',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    navSection: { padding: '16px 12px', flex: 1, overflowY: 'auto' },
    sectionLabel: {
      fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.30)',
      textTransform: 'uppercase', letterSpacing: '1.5px',
      padding: collapsed ? '10px 0' : '10px 8px', marginBottom: 4,
      textAlign: collapsed ? 'center' : 'left',
      display: 'block',
    },
    navItem: (active) => ({
      display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 12,
      padding: collapsed ? '11px 0' : '11px 14px',
      borderRadius: 10, marginBottom: 4, cursor: 'pointer',
      background: active ? 'linear-gradient(135deg, rgba(230,57,70,0.85), rgba(193,18,31,0.75))' : 'transparent',
      border: active ? '1px solid rgba(230,57,70,0.40)' : '1px solid transparent',
      transition: 'all 0.2s', textDecoration: 'none', justifyContent: collapsed ? 'center' : 'flex-start',
      boxShadow: active ? '0 4px 12px rgba(230,57,70,0.25)' : 'none',
    }),
    navIcon: { fontSize: '1.15rem', flexShrink: 0 },
    navLabel: (active) => ({
      fontSize: '0.88rem', fontWeight: active ? 700 : 500,
      color: active ? 'white' : 'rgba(255,255,255,0.65)',
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
      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg,#E63946,#FF9F1C)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1rem', fontWeight: 700, color: 'white',
    },
    userName: { fontSize: '0.85rem', fontWeight: 700, color: 'white', overflow: 'hidden', whiteSpace: 'nowrap' },
    userRole: { fontSize: '0.68rem', color: 'rgba(255,255,255,0.40)', marginTop: 1 },
    logoutBtn: {
      display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 8,
      marginTop: 10, padding: collapsed ? '9px 0' : '9px 14px',
      borderRadius: 8, background: 'rgba(230,57,70,0.12)', border: '1px solid rgba(230,57,70,0.25)',
      color: '#FF8A80', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
      transition: 'all 0.2s', width: '100%', fontFamily: 'inherit',
      justifyContent: collapsed ? 'center' : 'flex-start',
    },
  }

  const navList = isAdmin ? [...NAV, ...ADMIN_NAV] : NAV

  return (
    <aside style={S.sidebar}>

      {/* Logo */}
      <div style={S.logoArea}>
        <div style={S.brandRow}>
          <div style={S.logoIcon}>🎬</div>
          {!collapsed && (
            <div style={S.brandText}>
              <div style={S.brandName}>AnimVerse AI</div>
              <div style={S.brandTag}>Creative Studio</div>
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
        {!collapsed && <span style={S.sectionLabel}>Main Menu</span>}
        {navList.slice(0, 8).map(item => (
          <Link key={item.path} to={item.path} style={S.navItem(isActive(item.path))}>
            <span style={S.navIcon}>{item.icon}</span>
            {!collapsed && <span style={S.navLabel(isActive(item.path))}>{item.label}</span>}
          </Link>
        ))}

        {isAdmin && (
          <>
            <div style={S.divider} />
            {!collapsed && <span style={S.sectionLabel}>Admin</span>}
            {ADMIN_NAV.map(item => (
              <Link key={item.path} to={item.path} style={S.navItem(isActive(item.path))}>
                <span style={S.navIcon}>{item.icon}</span>
                {!collapsed && <span style={S.navLabel(isActive(item.path))}>{item.label}</span>}
              </Link>
            ))}
          </>
        )}

        <div style={S.divider} />

        {/* Settings & Notifications */}
        {[{icon:'🔔',label:'Notifications',path:'/notifications'},{icon:'⚙️',label:'Settings',path:'/settings'},{icon:'👤',label:'Profile',path:'/profile'}].map(item => (
          <Link key={item.path} to={item.path} style={S.navItem(isActive(item.path))}>
            <span style={S.navIcon}>{item.icon}</span>
            {!collapsed && <span style={S.navLabel(isActive(item.path))}>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* User / Logout */}
      <div style={S.userArea}>
        {!collapsed && (
          <div style={S.avatarRow}>
            <div style={S.avatar}>{(user?.name||'?')[0].toUpperCase()}</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={S.userName}>{user?.name || 'User'}</div>
              <div style={S.userRole}>{user?.role === 'admin' ? '🛡️ Administrator' : '🎨 Creator'}</div>
            </div>
          </div>
        )}
        <button style={S.logoutBtn} onClick={logout}>
          <span>🚪</span>
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  )
}
