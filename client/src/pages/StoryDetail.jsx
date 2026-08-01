import { useParams, Link, useNavigate } from 'react-router-dom'
import AppSidebar from '../components/AppSidebar'
import AppHeader from '../components/AppHeader'
import { LIBRARY_STORIES } from './StoryLibrary'

export default function StoryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const story = LIBRARY_STORIES.find(s => s.id === parseInt(id)) || LIBRARY_STORIES[0]

  return (
    <div className="app-shell">
      <AppSidebar />
      <main className="app-main">
        <AppHeader title={`Story — ${story.title}`} />

        <div className="app-content">
          <div style={{ marginBottom: '20px' }}>
            <Link to="/stories" className="btn btn-outline btn-sm">← Back to Story Library</Link>
          </div>

          <div className="card" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{
              height: '200px', borderRadius: '16px',
              background: `linear-gradient(135deg, ${story.color}50, ${story.color})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '5rem', marginBottom: '24px'
            }}>
              {story.icon}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
              <span className="badge badge-yellow">{story.genre}</span>
              <span className="badge badge-green">{story.ageGroup}</span>
              <span className="badge badge-red">⏱️ {story.readTime || '10 min'}</span>
            </div>

            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 8px 0' }}>{story.title}</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Written by {story.author}</p>

            <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-primary)', marginBottom: '32px' }}>
              <p>{story.desc}</p>
              <p>Once upon a time in an enchanted realm, mysterious powers gathered to forge a brand new legend. Every creature in the kingdom listened intently as the ancient chronicles unfolded.</p>
              <p>Through courage, friendship, and determination, the heroes faced unexpected challenges and triumphed over darkness, leaving a lasting legacy of inspiration.</p>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <Link to={`/generate?prompt=${encodeURIComponent(story.title + ': ' + story.desc)}`} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                <i className="fas fa-magic" /> Convert to Animated Video
              </Link>
              <button className="btn btn-outline btn-lg" onClick={() => alert('Story bookmarked!')}>
                <i className="fas fa-bookmark" /> Bookmark
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
