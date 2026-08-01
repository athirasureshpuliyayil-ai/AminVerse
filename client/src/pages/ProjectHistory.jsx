import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppSidebar from '../components/AppSidebar'
import AppHeader from '../components/AppHeader'

export default function ProjectHistory() {
  const [projects, setProjects] = useState([
    { id: 'p1', title: 'The Legend of Brave Rabbit', style: 'Kids Cartoon', status: 'completed', duration: '2 min 30s', date: '2026-08-01' },
    { id: 'p2', title: 'Stars of Deep Ocean', style: 'Cinematic', status: 'completed', duration: '4 min 15s', date: '2026-07-28' },
    { id: 'p3', title: 'Mystery at Blackwood', style: 'Comic Book', status: 'processing', duration: '3 min 10s', date: '2026-07-25' }
  ])

  return (
    <AppShell title="My Animation Projects">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>Project History ({projects.length})</h1>
            <Link to="/generate" className="btn btn-primary"><i className="fas fa-plus" /> New Project</Link>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>Title</th>
                  <th style={{ padding: '12px' }}>Animation Style</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Duration</th>
                  <th style={{ padding: '12px' }}>Date</th>
                  <th style={{ padding: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 12px', fontWeight: 700 }}>{p.title}</td>
                    <td style={{ padding: '16px 12px' }}>{p.style}</td>
                    <td style={{ padding: '16px 12px' }}>
                      <span className={`badge ${p.status === 'completed' ? 'badge-green' : 'badge-yellow'}`}>{p.status}</span>
                    </td>
                    <td style={{ padding: '16px 12px' }}>{p.duration}</td>
                    <td style={{ padding: '16px 12px', color: 'var(--text-muted)' }}>{p.date}</td>
                    <td style={{ padding: '16px 12px', display: 'flex', gap: '8px' }}>
                      <Link to="/generate" className="btn btn-outline btn-sm">Edit</Link>
                      <button className="btn btn-sm" style={{ background: '#fee2e2', color: '#dc2626' }} onClick={() => setProjects(projects.filter(x => x.id !== p.id))}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AppShell>
  )
}


