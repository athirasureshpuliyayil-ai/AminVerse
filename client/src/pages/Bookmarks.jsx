import { Link } from 'react-router-dom'
import AppSidebar from '../components/AppSidebar'
import AppHeader from '../components/AppHeader'
import { LIBRARY_STORIES } from './StoryLibrary'

export default function Bookmarks() {
  const bookmarked = LIBRARY_STORIES.slice(0, 3)

  return (
    <div className="app-shell">
      <AppSidebar />
      <main className="app-main">
        <AppHeader title="Saved & Bookmarked Stories" />

        <div className="app-content">
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '24px' }}>Bookmarked Stories ({bookmarked.length})</h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {bookmarked.map(s => (
              <div key={s.id} className="card" style={{ padding: '20px' }}>
                <div style={{ height: '120px', borderRadius: '12px', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', marginBottom: '16px' }}>
                  {s.icon}
                </div>
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 4px 0' }}>{s.title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>by {s.author}</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link to={`/stories/${s.id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>Read</Link>
                  <Link to={`/generate?storyId=${s.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>Animate</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
