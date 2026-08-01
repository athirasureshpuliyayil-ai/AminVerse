import AppSidebar from '../components/AppSidebar'
import AppHeader from '../components/AppHeader'

export default function Downloads() {
  const downloads = [
    { name: 'The Legend of Brave Rabbit.mp4', type: 'MP4 Video', size: '48.2 MB', date: '2026-08-01' },
    { name: 'Brave Rabbit Storyboard.pdf', type: 'PDF Storyboard', size: '4.1 MB', date: '2026-08-01' },
    { name: 'Stars of Deep Ocean Subtitles.srt', type: 'Subtitles', size: '12 KB', date: '2026-07-28' },
  ]

  return (
    <AppShell title="Downloads & Exports">
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '24px' }}>Exported Files</h1>

          <div className="card" style={{ padding: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>File Name</th>
                  <th style={{ padding: '12px' }}>Format</th>
                  <th style={{ padding: '12px' }}>Size</th>
                  <th style={{ padding: '12px' }}>Date Exported</th>
                  <th style={{ padding: '12px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {downloads.map((d, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 12px', fontWeight: 600 }}>{d.name}</td>
                    <td style={{ padding: '16px 12px' }}><span className="badge badge-green">{d.type}</span></td>
                    <td style={{ padding: '16px 12px' }}>{d.size}</td>
                    <td style={{ padding: '16px 12px', color: 'var(--text-muted)' }}>{d.date}</td>
                    <td style={{ padding: '16px 12px' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => alert(`Downloading ${d.name}...`)}>
                        <i className="fas fa-download" /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AppShell>
  )
}


