import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AppSidebar from '../components/AppSidebar'
import AppHeader from '../components/AppHeader'

export const LIBRARY_STORIES = [
  { id: 1, title: "The Brave Little Rabbit", author: "AnimVerse Team", audience: "Kids", genre: "Fairy Tale", ageGroup: "Children", icon: "🐇", color: "#FFD60A", desc: "A tiny rabbit discovers courage when the forest is threatened by a fearsome dragon.", readTime: "8 min", rating: 4.9 },
  { id: 2, title: "The Golden Lantern", author: "Folk Tales Press", audience: "Kids", genre: "Moral Story", ageGroup: "Children", icon: "🏮", color: "#FF9F1C", desc: "A poor boy's honesty earns him a magical lantern that can fulfill one wish.", readTime: "6 min", rating: 4.8 },
  { id: 3, title: "Stars of the Deep Ocean", author: "Marina Blue", audience: "Teens", genre: "Adventure", ageGroup: "All Ages", icon: "🐬", color: "#4FC3F7", desc: "An oceanographer dives into unexplored underwater caves and discovers a lost civilization.", readTime: "15 min", rating: 4.7 },
  { id: 4, title: "The Dragon's Secret Garden", author: "Elara Moonwhisper", audience: "Teens", genre: "Fantasy", ageGroup: "Teens", icon: "🐉", color: "#CE93D8", desc: "A young mage uncovers a hidden garden guarded by a lonely dragon with a painful past.", readTime: "12 min", rating: 4.9 },
  { id: 5, title: "Midnight at Blackwood Manor", author: "A.K. Vortex", audience: "Adults", genre: "Mystery", ageGroup: "Adults", icon: "🏚️", color: "#546E7A", desc: "A detective is called to investigate the mysterious disappearance of a billionaire in a cursed mansion.", readTime: "20 min", rating: 4.6 },
  { id: 6, title: "Echo of the Cosmos", author: "Dr. Nebula", audience: "Adults", genre: "Sci-Fi", ageGroup: "Adults", icon: "🚀", color: "#26C6DA", desc: "Earth's last astronaut discovers an alien message that could save — or end — all civilization.", time: "25 min", rating: 4.9 }
]

export default function StoryLibrary() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialSearch = searchParams.get('search') || ''

  const [search, setSearch] = useState(initialSearch)
  const [audienceFilter, setAudienceFilter] = useState('All')

  const filtered = LIBRARY_STORIES.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.genre.toLowerCase().includes(search.toLowerCase())
    const matchesAudience = audienceFilter === 'All' || s.audience === audienceFilter
    return matchesSearch && matchesAudience
  })

  return (
    <AppShell title="Digital Story Library">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Explore 10,000+ Stories & Novels</h1>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Select any story to read or convert directly into an animated video.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              {['All', 'Kids', 'Teens', 'Adults'].map(aud => (
                <button 
                  key={aud} 
                  className={`btn ${audienceFilter === aud ? 'btn-primary' : 'btn-outline'} btn-sm`}
                  onClick={() => setAudienceFilter(aud)}
                >
                  {aud === 'Kids' ? '🧒 Children' : aud === 'Teens' ? '🧑 Teens' : aud === 'Adults' ? '🧔 Adults' : '📚 All Ages'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {filtered.map(story => (
              <div key={story.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{
                    height: '160px', background: `linear-gradient(135deg, ${story.color}40, ${story.color}90)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem'
                  }}>
                    {story.icon}
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span className="badge badge-yellow">{story.genre}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>⭐ {story.rating}</span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', margin: '0 0 4px 0' }}>{story.title}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>by {story.author}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{story.desc}</p>
                  </div>
                </div>

                <div style={{ padding: '0 20px 20px', display: 'flex', gap: '10px' }}>
                  <Link to={`/stories/${story.id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                    <i className="fas fa-book-open" /> Read
                  </Link>
                  <Link to={`/generate?storyId=${story.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    <i className="fas fa-magic" /> Animate
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </AppShell>
  )
}


