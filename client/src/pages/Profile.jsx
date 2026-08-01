import { useState, useEffect } from 'react'
import AppSidebar from '../components/AppSidebar'
import AppHeader from '../components/AppHeader'

export default function Profile() {
  const [user, setUser] = useState({ name: 'User Creator', email: 'user@example.com', role: 'user' })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('animverse_user') || 'null')
    if (saved) setUser(saved)
  }, [])

  return (
    <div className="app-shell">
      <AppSidebar />
      <main className="app-main">
        <AppHeader title="User Profile" />

        <div className="app-content">
          <div className="card" style={{ padding: '32px', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '90px', height: '90px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '2.5rem', margin: '0 auto 16px'
              }}>
                {user.name.charAt(0)}
              </div>
              <h2 style={{ fontSize: '1.6rem', margin: 0 }}>{user.name}</h2>
              <p style={{ color: 'var(--text-muted)' }}>{user.email} • <span className="badge badge-green">{user.role}</span></p>
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input type="text" className="form-control" defaultValue={user.name} />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" className="form-control" defaultValue={user.email} disabled />
            </div>

            <div className="form-group">
              <label>Preferred Animation Style</label>
              <select className="form-control" defaultValue="Kids Cartoon">
                <option>Kids Cartoon</option>
                <option>Anime</option>
                <option>Pixar Style</option>
                <option>Cinematic</option>
              </select>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => alert('Profile updated!')}>
              Save Profile Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
