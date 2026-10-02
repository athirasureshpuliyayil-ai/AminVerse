import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../utils/authStorage'

export default function AppHeader({ title = 'Dashboard' }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const user = getUser() || {}

  const S = {
    header: {
      height: 68,
      background: 'rgba(10, 11, 14, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      gap: 20,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      flexShrink: 0
    },
    titleArea: {},
    title: {
      fontSize: '1.25rem',
      fontWeight: 800,
      color: '#F8FAFC',
      margin: 0,
      letterSpacing: '-0.02em'
    },
    breadcrumb: {
      fontSize: '0.72rem',
      color: '#64748B',
      margin: '2px 0 0',
      fontWeight: 600,
      fontFamily: 'monospace'
    },
    searchWrap: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: 'rgba(255, 255, 255, 0.04)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 50,
      padding: '8px 18px',
      flex: 1,
      maxWidth: 380,
      transition: 'all 0.2s'
    },
    searchInput: {
      border: 'none',
      background: 'transparent',
      fontFamily: 'inherit',
      fontSize: '0.85rem',
      color: '#F8FAFC',
      outline: 'none',
      width: '100%'
    },
    rightActions: { display: 'flex', alignItems: 'center', gap: 16 },
    iconBtn: {
      width: 38,
      height: 38,
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.04)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '0.9rem',
      color: '#94A3B8',
      transition: 'all 0.2s',
      flexShrink: 0
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: '50%',
      cursor: 'pointer',
      background: '#F59E0B',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.92rem',
      fontWeight: 800,
      color: '#0A0B0E',
      flexShrink: 0,
      boxShadow: '0 2px 10px rgba(245, 158, 11, 0.3)'
    },
    userMeta: {},
    userName: {
      fontSize: '0.85rem',
      fontWeight: 700,
      color: '#F8FAFC',
      display: 'block'
    },
    userRole: {
      fontSize: '0.65rem',
      color: '#06B6D4',
      display: 'block',
      fontFamily: 'monospace',
      textTransform: 'uppercase',
      fontWeight: 800
    },
    createBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '9px 20px',
      borderRadius: 50,
      background: '#F59E0B',
      color: '#0A0B0E',
      border: 'none',
      fontWeight: 800,
      fontSize: '0.85rem',
      cursor: 'pointer',
      boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)',
      fontFamily: 'inherit',
      flexShrink: 0,
      transition: 'all 0.15s'
    }
  }

  return (
    <header style={S.header}>
      {/* Title */}
      <div style={S.titleArea}>
        <h1 style={S.title}>{title}</h1>
        <div style={S.breadcrumb}>AnimVerse AI / {title}</div>
      </div>

      {/* Search */}
      <div style={S.searchWrap}>
        <span style={{ color: '#64748B', fontSize: '0.85rem', flexShrink: 0 }}>Search</span>
        <input
          style={S.searchInput}
          placeholder="Stories, manuscripts, video exports..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {/* Right actions */}
      <div style={S.rightActions}>
        {/* Create button */}
        <button style={S.createBtn} onClick={() => navigate('/generate')}>
          + New Animation
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }} title="Notifications">
          <button style={S.iconBtn} onClick={() => navigate('/notifications')}>
            Alerts
          </button>
        </div>

        {/* User info */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          onClick={() => navigate('/profile')}
        >
          <div style={S.avatar}>{(user?.name || 'U')[0].toUpperCase()}</div>
          <div style={S.userMeta}>
            <span style={S.userName}>{(user?.name || 'User').split(' ')[0]}</span>
            <span style={S.userRole}>{user?.role || 'Creator'}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
