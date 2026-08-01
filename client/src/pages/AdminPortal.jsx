import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import AppSidebar from '../components/AppSidebar'
import AppHeader from '../components/AppHeader'

export default function AdminPortal() {
  const location = useLocation()
  const [adminData, setAdminData] = useState({
    stats: { totalUsers: 142, totalAuthors: 24, totalStories: 10450, totalProjects: 840, gameSessions: 3200 },
    users: [
      { id: '1', name: 'Athira K', email: 'athira@example.com', role: 'user', date: '2026-08-01' },
      { id: '2', name: 'Arjun Mehta', email: 'arjun@example.com', role: 'user', date: '2026-07-29' }
    ],
    games: [
      { id: 'g1', name: 'Memory Match', category: 'Kids', plays: 1200, status: 'Active' },
      { id: 'g2', name: 'Calm Breathing', category: 'Everyone', plays: 850, status: 'Active' },
      { id: 'g3', name: 'Puzzle Garden', category: 'Everyone', plays: 640, status: 'Active' }
    ]
  })

  const path = location.pathname

  return (
    <div className="app-shell">
      <AppSidebar isAdmin={true} />
      <main className="app-main">
        <AppHeader title="Admin Management Console" />

        <div className="app-content">
          {/* Top Admin Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Users</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{adminData.stats.totalUsers}</div>
            </div>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Library Stories</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary-dark)' }}>{adminData.stats.totalStories}</div>
            </div>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Animation Rendered</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)' }}>{adminData.stats.totalProjects}</div>
            </div>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Game Sessions</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald)' }}>{adminData.stats.gameSessions}</div>
            </div>
          </div>

          {/* Section: Users */}
          {(path === '/admin' || path === '/admin/users') && (
            <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Registered Users Management</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>Name</th>
                    <th style={{ padding: '12px' }}>Email</th>
                    <th style={{ padding: '12px' }}>Role</th>
                    <th style={{ padding: '12px' }}>Joined Date</th>
                    <th style={{ padding: '12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminData.users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px 12px', fontWeight: 600 }}>{u.name}</td>
                      <td style={{ padding: '16px 12px' }}>{u.email}</td>
                      <td style={{ padding: '16px 12px' }}><span className="badge badge-green">{u.role}</span></td>
                      <td style={{ padding: '16px 12px', color: 'var(--text-muted)' }}>{u.date}</td>
                      <td style={{ padding: '16px 12px', display: 'flex', gap: '8px' }}>
                        <button className="btn btn-outline btn-sm">Edit Role</button>
                        <button className="btn btn-sm" style={{ background: '#fee2e2', color: '#dc2626' }}>Suspend</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Section: Games */}
          {(path === '/admin' || path === '/admin/games') && (
            <div className="card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Relax & Play Games Management</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>Game Name</th>
                    <th style={{ padding: '12px' }}>Audience Category</th>
                    <th style={{ padding: '12px' }}>Total Play Sessions</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminData.games.map(g => (
                    <tr key={g.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px 12px', fontWeight: 600 }}>{g.name}</td>
                      <td style={{ padding: '16px 12px' }}>{g.category}</td>
                      <td style={{ padding: '16px 12px' }}>{g.plays}</td>
                      <td style={{ padding: '16px 12px' }}><span className="badge badge-green">{g.status}</span></td>
                      <td style={{ padding: '16px 12px' }}>
                        <button className="btn btn-outline btn-sm">Configure</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
