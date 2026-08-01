import { useParams, Link, useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { LIBRARY_STORIES } from './StoryLibrary'

export default function StoryDetail() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const story     = LIBRARY_STORIES.find(s => s.id === parseInt(id)) || LIBRARY_STORIES[0]

  const badge = (bg, color, text) => (
    <span style={{ display:'inline-block', padding:'4px 12px', borderRadius:50, fontSize:'0.75rem', fontWeight:700, background:bg, color }}>{text}</span>
  )

  return (
    <AppShell title={`Story — ${story.title}`}>
      <div style={{ marginBottom:20 }}>
        <button onClick={() => navigate('/stories')}
          style={{ padding:'9px 18px', border:'2px solid #FFE0B2', borderRadius:10, background:'white', color:'#4A4A6A', fontWeight:600, fontSize:'0.85rem', cursor:'pointer', fontFamily:'inherit' }}>
          ← Back to Story Library
        </button>
      </div>

      <div style={{ background:'white', borderRadius:20, border:'1px solid #FFE0B2', boxShadow:'0 4px 20px rgba(230,57,70,0.06)', padding:40, maxWidth:800, margin:'0 auto' }}>
        {/* Hero banner */}
        <div style={{ height:200, borderRadius:16, background:`linear-gradient(135deg,${story.color}60,${story.color})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'5rem', marginBottom:24 }}>
          {story.icon}
        </div>

        {/* Badges */}
        <div style={{ display:'flex', gap:10, marginBottom:14, flexWrap:'wrap' }}>
          {badge('#FFF9C4','#D97706', story.genre)}
          {badge('#F0FDF4','#15803d', story.ageGroup)}
          {badge('#FFEBEE','#C1121F', `⏱️ ${story.readTime || '10 min'}`)}
        </div>

        <h1 style={{ fontSize:'2.2rem', fontWeight:900, margin:'0 0 8px', color:'#1A1A2E' }}>{story.title}</h1>
        <p style={{ color:'#9090A0', marginBottom:28, fontSize:'0.9rem' }}>Written by {story.author}</p>

        <div style={{ fontSize:'1.05rem', lineHeight:1.85, color:'#1A1A2E', marginBottom:36 }}>
          <p>{story.desc}</p>
          <p>Once upon a time in an enchanted realm, mysterious powers gathered to forge a brand new legend. Every creature in the kingdom listened intently as the ancient chronicles unfolded.</p>
          <p>Through courage, friendship, and determination, the heroes faced unexpected challenges and triumphed over darkness, leaving a lasting legacy of inspiration for generations to come.</p>
        </div>

        {/* Action buttons */}
        <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
          <Link to={`/generate?prompt=${encodeURIComponent(story.title + ': ' + story.desc)}`}
            style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'16px 24px', background:'linear-gradient(135deg,#E63946,#C1121F)', color:'white', borderRadius:12, fontWeight:700, fontSize:'1rem', textDecoration:'none', boxShadow:'0 6px 20px rgba(230,57,70,0.30)' }}>
            ✨ Convert to Animated Video
          </Link>
          <button onClick={() => alert('Story bookmarked!')}
            style={{ padding:'16px 24px', border:'2px solid #FFE0B2', borderRadius:12, background:'white', color:'#4A4A6A', fontWeight:700, fontSize:'1rem', cursor:'pointer', fontFamily:'inherit' }}>
            🔖 Bookmark
          </button>
        </div>
      </div>
    </AppShell>
  )
}
