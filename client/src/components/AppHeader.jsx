import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AppHeader({ title = 'Dashboard' }) {
  const navigate    = useNavigate()
  const [query, setQuery] = useState('')
  const user = JSON.parse(localStorage.getItem('animverse_user') || '{}')

  const S = {
    header: {
      height: 65, background: 'white', borderBottom: '1px solid #FFE0B2',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', gap: 20, boxShadow: '0 2px 12px rgba(230,57,70,0.06)',
      position: 'sticky', top: 0, zIndex: 100, flexShrink: 0,
    },
    titleArea: {},
    title: { fontSize: '1.2rem', fontWeight: 800, color: '#1A1A2E', margin: 0 },
    breadcrumb: { fontSize: '0.72rem', color: '#9090A0', margin: '2px 0 0', fontWeight: 500 },
    searchWrap: {
      display: 'flex', alignItems: 'center', gap: 10, background: '#FFF8E7',
      border: '2px solid #FFE0B2', borderRadius: 10, padding: '8px 14px',
      flex: 1, maxWidth: 400, transition: 'border-color 0.2s',
    },
    searchInput: {
      border: 'none', background: 'transparent', fontFamily: 'inherit',
      fontSize: '0.88rem', color: '#1A1A2E', outline: 'none', width: '100%',
    },
    rightActions: { display: 'flex', alignItems: 'center', gap: 14 },
    iconBtn: {
      width: 38, height: 38, borderRadius: 10, background: '#FFF8E7',
      border: '1.5px solid #FFE0B2', display: 'flex', alignItems: 'center',
      justifyContent: 'center', cursor: 'pointer', fontSize: '1rem',
      transition: 'all 0.2s', flexShrink: 0,
    },
    avatar: {
      width: 38, height: 38, borderRadius: '50%', cursor: 'pointer',
      background: 'linear-gradient(135deg,#E63946,#FF9F1C)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.95rem', fontWeight: 700, color: 'white', flexShrink: 0,
    },
    userMeta: {},
    userName: { fontSize: '0.88rem', fontWeight: 700, color: '#1A1A2E', display: 'block' },
    userRole: { fontSize: '0.68rem', color: '#9090A0', display: 'block' },
    createBtn: {
      display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10,
      background: 'linear-gradient(135deg,#E63946,#C1121F)', color: 'white',
      border: 'none', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
      boxShadow: '0 4px 16px rgba(230,57,70,0.30)', fontFamily: 'inherit', flexShrink: 0,
      transition: 'transform 0.15s',
    },
  }

  return (
    <header style={S.header}>
      {/* Title */}
      <div style={S.titleArea}>
        <h1 style={S.title}>{title}</h1>
        <div style={S.breadcrumb}>AnimVerse AI › {title}</div>
      </div>

      {/* Search */}
      <div style={S.searchWrap}>
        <span style={{ color: '#9090A0', fontSize: '1rem', flexShrink: 0 }}>🔍</span>
        <input
          style={S.searchInput}
          placeholder="Search stories, projects, templates..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {/* Right actions */}
      <div style={S.rightActions}>
        {/* Create button */}
        <button style={S.createBtn} onClick={() => navigate('/generate')}
          onMouseEnter={e => e.currentTarget.style.transform='scale(1.04)'}
          onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
          ✨ New Animation
        </button>

        {/* Notifications bell */}
        <div style={{ position: 'relative' }} title="Notifications">
          <button style={S.iconBtn} onClick={() => navigate('/notifications')}>🔔</button>
          <div style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%', background: '#E63946', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', color: 'white', fontWeight: 700 }}>3</div>
        </div>

        {/* Dark mode placeholder */}
        <button style={S.iconBtn} title="Toggle theme">🌙</button>

        {/* User info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/profile')}>
          <div style={S.avatar}>{(user?.name || 'U')[0].toUpperCase()}</div>
          <div style={S.userMeta}>
            <span style={S.userName}>{(user?.name || 'User').split(' ')[0]}</span>
            <span style={S.userRole}>{user?.role === 'admin' ? '🛡️ Admin' : '🎨 Creator'}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
