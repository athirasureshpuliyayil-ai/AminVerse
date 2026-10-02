import { useState, useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { getUser, getToken, setUser as persistUser } from '../utils/authStorage'

import ParentDashboardView from '../components/dashboards/ParentDashboardView'
import AdultDashboardView from '../components/dashboards/AdultDashboardView'
import AuthorDashboardView from '../components/dashboards/AuthorDashboardView'

export default function Dashboard({ forcedRole }) {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [user, setUser] = useState(() => {
    return getUser() || { id: 'demo_user', name: 'Creator', email: 'user@animverse.ai', role: forcedRole || 'author' }
  })
  const [activeRole, setActiveRole] = useState(() => {
    if (forcedRole) return forcedRole
    if (location.pathname.includes('/parent')) return 'parent'
    if (location.pathname.includes('/adult')) return 'adult'
    if (location.pathname.includes('/author')) return 'author'
    const saved = getUser()
    return searchParams.get('role') || (saved && saved.role && saved.role !== 'user' ? saved.role : 'author')
  })
  const [roleSwitchError, setRoleSwitchError] = useState('')

  useEffect(() => {
    const saved = getUser()
    const token = getToken()
    let role = forcedRole
    if (!role) {
      if (location.pathname.includes('/parent')) role = 'parent'
      else if (location.pathname.includes('/adult')) role = 'adult'
      else if (location.pathname.includes('/author')) role = 'author'
      else role = searchParams.get('role') || (saved && saved.role && saved.role !== 'user' ? saved.role : 'author')
    }

    if (!saved || !token) {
      const demoUser = { id: 'demo_user', name: 'Creator', email: 'user@animverse.ai', role: role || 'author' }
      setUser(demoUser)
      setActiveRole(role || 'author')
      setRoleSwitchError('')
      return
    }

    setUser(saved)
    setActiveRole(role || (saved.role && saved.role !== 'user' ? saved.role : 'author'))
    setRoleSwitchError('')
    if (!forcedRole || saved.role === forcedRole || saved.role === 'admin' || token.startsWith('mock_')) {
      if (saved.role !== 'admin') setActiveRole(role || saved.role || 'author')
      return
    }

    let cancelled = false
    fetch('/api/user/switch-role', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role: forcedRole })
    })
      .then(async response => {
        const payload = await response.json()
        if (!response.ok || !payload.success) throw new Error(payload.message || 'Could not switch workspace role.')
        return payload.user
      })
      .then(updatedUser => {
        if (cancelled) return
        persistUser(updatedUser)
        setUser(updatedUser)
        setActiveRole(updatedUser.role)
      })
      .catch(error => {
        if (cancelled) return
        setRoleSwitchError(error.message || 'Could not switch workspace role.')
      })

    return () => { cancelled = true }
  }, [searchParams, forcedRole, location.pathname])

  const roleTitle = activeRole === 'parent' 
    ? 'Parent Safety Suite' 
    : activeRole === 'adult' 
    ? 'Adult Fiction Lounge' 
    : 'Author Studio'

  return (
    <AppShell title={roleTitle}>
      {/* ── ISOLATED ROLE HEADER (MATCHING HOME PAGE SERIF & MONO BADGE) ── */}
      <div style={{
        background: 'rgba(18, 19, 26, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        padding: '16px 28px',
        marginBottom: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 12px 36px rgba(0,0,0,0.6)'
      }}>
        <div>
          <div style={{
            fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800,
            fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4
          }}>
            ✦ AUTHENTICATED WORKSPACE
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F8FAFC' }}>
            {activeRole === 'parent' ? (
              <>Parent & Kid <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic', fontWeight: 400, color: '#F59E0B' }}>Safety Suite</span></>
            ) : activeRole === 'adult' ? (
              <>Adult Fiction <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic', fontWeight: 400, color: '#F59E0B' }}>& Zen Lounge</span></>
            ) : (
              <>Author Publishing <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic', fontWeight: 400, color: '#F59E0B' }}>& AI Studio</span></>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            fontSize: '0.75rem', fontWeight: 800, padding: '6px 16px', borderRadius: 50,
            background: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B',
            border: '1px solid rgba(245, 158, 11, 0.3)', fontFamily: 'monospace'
          }}>
            AUTHENTICATED: {user?.name || 'User'} ({activeRole.toUpperCase()})
          </span>
        </div>
      </div>

      {roleSwitchError && (
        <div role="alert" style={{ marginBottom: 20, padding: '12px 16px', border: '1px solid rgba(248,113,113,.35)', borderRadius: 10, background: 'rgba(127,29,29,.18)', color: '#FCA5A5', fontWeight: 700 }}>
          {roleSwitchError}
        </div>
      )}

      {/* ── ISOLATED ROLE DASHBOARD VIEW ── */}
      {activeRole === 'parent' && <ParentDashboardView user={user} />}
      {activeRole === 'adult'  && <AdultDashboardView user={user} />}
      {activeRole === 'author' && <AuthorDashboardView user={user} />}
      {!['parent', 'adult', 'author'].includes(activeRole) && <AuthorDashboardView user={user} />}
    </AppShell>
  )
}
