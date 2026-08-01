import AppSidebar from '../components/AppSidebar'
import AppHeader from '../components/AppHeader'

export default function Notifications() {
  const notificationsList = [
    { title: 'Animation Render Complete', desc: 'Your video "The Legend of Brave Rabbit" has finished rendering.', time: '10 mins ago', type: 'video' },
    { title: 'New Relax & Play Game', desc: 'Puzzle Garden is now playable in the Relax & Play Hub!', time: '1 hour ago', type: 'game' },
    { title: 'Story Recommendation', desc: 'Check out "Stars of the Deep Ocean" in the story library.', time: '1 day ago', type: 'story' }
  ]

  return (
    <div className="app-shell">
      <AppSidebar />
      <main className="app-main">
        <AppHeader title="Notifications Inbox" />

        <div className="app-content">
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '24px' }}>Notifications</h1>

          <div style={{ display: 'grid', gap: '16px', maxWidth: '700px' }}>
            {notificationsList.map((n, i) => (
              <div key={i} className="card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'var(--light-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  {n.type === 'video' ? '🎬' : n.type === 'game' ? '🎮' : '📚'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>{n.title}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{n.time}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{n.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
