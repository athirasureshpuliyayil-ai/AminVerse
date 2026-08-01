import { useState } from 'react'
import AppSidebar from '../components/AppSidebar'
import AppHeader from '../components/AppHeader'

export default function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem('animverse_theme') || 'light')

  const changeTheme = (t) => {
    setTheme(t)
    localStorage.setItem('animverse_theme', t)
    document.documentElement.setAttribute('data-theme', t)
  }

  return (
    <AppShell title="Account & Studio Settings">
          <div className="card" style={{ padding: '32px', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '24px' }}>Appearance & Theme</h2>

            <div className="form-group">
              <label>Theme Mode</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-outline'}`} onClick={() => changeTheme('light')}>
                  ☀️ Light Mode
                </button>
                <button className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-outline'}`} onClick={() => changeTheme('dark')}>
                  🌙 Dark Mode
                </button>
              </div>
            </div>

            <hr style={{ margin: '24px 0', borderColor: 'var(--border)' }} />

            <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>AI Pipeline Preferences</h2>
            <div className="form-group">
              <label>Default Provider Mode</label>
              <select className="form-control" defaultValue="Mock Provider (Local Instant Simulation)">
                <option>Mock Provider (Local Instant Simulation)</option>
                <option>Runway / OpenAI Provider Architecture</option>
              </select>
            </div>

            <div className="form-group">
              <label>Audio Quality Level</label>
              <select className="form-control" defaultValue="High Quality 320kbps MP3">
                <option>High Quality 320kbps MP3</option>
                <option>Lossless WAV Audio</option>
              </select>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={() => alert('Settings saved!')}>
              Save Preferences
            </button>
          </div>
        </AppShell>
  )
}


