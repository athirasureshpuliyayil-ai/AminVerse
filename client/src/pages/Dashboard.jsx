import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('animverse_user') || 'null')
    const token = localStorage.getItem('animverse_token')
    if (!saved || !token) { navigate('/login'); return }
    setUser(saved)
  }, [navigate])

  const stats = [
    { label:'Total Projects',       value:3,  icon:'🎬', color:'#E63946',  bg:'#FFEBEE' },
    { label:'Videos Generated',     value:2,  icon:'🎞️', color:'#FF9F1C',  bg:'#FFF3E0' },
    { label:'Stories Read',         value:7,  icon:'📖', color:'#22c55e',  bg:'#F0FDF4' },
    { label:'Relaxation Sessions',  value:4,  icon:'🎮', color:'#7C3AED',  bg:'#F5F3FF' },
  ]

  const projects = [
    { title:'The Legend of Brave Rabbit', style:'Kids Cartoon', status:'completed', img:'https://images.unsplash.com/photo-1511497584788-876761c119ef?w=300&q=70' },
    { title:'Stars of Deep Ocean',        style:'Cinematic',    status:'completed', img:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=70' },
    { title:'Mystery at Blackwood',       style:'Comic Book',   status:'processing',img:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&q=70' },
  ]

  const games = [
    { id:'memory-match',   name:'Memory Match',   icon:'🧠' },
    { id:'calm-breathing', name:'Calm Breathing', icon:'🫁' },
    { id:'puzzle-garden',  name:'Puzzle Garden',  icon:'🪴' },
  ]

  if (!user) return null

  const C = {
    card: { background:'white', borderRadius:16, border:'1px solid #FFE0B2', boxShadow:'0 2px 12px rgba(230,57,70,0.06)', padding:24 },
    badge: (status) => ({
      display:'inline-block', padding:'3px 10px', borderRadius:50, fontSize:'0.72rem', fontWeight:700,
      background: status==='completed' ? '#F0FDF4' : status==='processing' ? '#FFF9C4' : '#F5F3FF',
      color: status==='completed' ? '#15803d' : status==='processing' ? '#D97706' : '#7C3AED',
      border: `1px solid ${status==='completed' ? '#A7F3D0' : status==='processing' ? '#FDE68A' : '#DDD6FE'}`,
    }),
    h2: { fontSize:'1.15rem', fontWeight:700, margin:'0 0 16px', color:'#1A1A2E' },
    link: { color:'#E63946', fontWeight:600, fontSize:'0.82rem', textDecoration:'none' },
    btn: (bg,color='white',shadow='none') => ({
      padding:'10px 20px', borderRadius:10, border:'none', cursor:'pointer', fontFamily:'inherit',
      background:bg, color, fontWeight:700, fontSize:'0.88rem', boxShadow:shadow,
    }),
  }

  return (
    <AppShell title="My Creative Studio">
      {/* Welcome Banner */}
      <div style={{
        background:'linear-gradient(135deg,#E63946,#C1121F,#FF9F1C)',
        borderRadius:20, padding:'32px 36px', marginBottom:28, color:'white',
        display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:20,
        boxShadow:'0 12px 40px rgba(230,57,70,0.30)',
        position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', top:-60, right:-60, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
        <div style={{ position:'absolute', bottom:-40, left:200, width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontSize:'0.8rem', opacity:0.8, marginBottom:6, textTransform:'uppercase', letterSpacing:1 }}>Welcome back 👋</div>
          <h1 style={{ fontSize:'2rem', fontWeight:900, margin:'0 0 8px' }}>
            Hello, {user.name.split(' ')[0]}!
          </h1>
          <p style={{ opacity:0.85, margin:0, fontSize:'0.95rem' }}>
            Ready to turn another story into an animated world today?
          </p>
        </div>
        <Link to="/generate" style={{ ...C.btn('white','#E63946'), position:'relative', zIndex:1, padding:'14px 28px', borderRadius:50, boxShadow:'0 4px 20px rgba(0,0,0,0.15)', textDecoration:'none', fontSize:'0.95rem' }}>
          ✨ Start Generating
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:28 }}>
        {stats.map((s,i) => (
          <div key={i} style={C.card}>
            <div style={{ display:'flex', gap:14, alignItems:'center' }}>
              <div style={{ width:50, height:50, borderRadius:14, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize:'0.75rem', color:'#9090A0', fontWeight:500, marginBottom:2 }}>{s.label}</div>
                <div style={{ fontSize:'2rem', fontWeight:900, color:s.color, lineHeight:1 }}>{s.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:24 }}>

        {/* Projects */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <h2 style={{ ...C.h2, margin:0 }}>Recent Projects</h2>
            <Link to="/projects" style={C.link}>View All →</Link>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {projects.map((p,i) => (
              <div key={i} style={{ ...C.card, padding:16, display:'flex', gap:14, alignItems:'center' }}>
                <img src={p.img} alt={p.title} style={{ width:80, height:58, borderRadius:10, objectFit:'cover', flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:'0.95rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.title}</div>
                  <div style={{ fontSize:'0.77rem', color:'#9090A0', marginTop:3 }}>{p.style}</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:8, alignItems:'flex-end', flexShrink:0 }}>
                  <span style={C.badge(p.status)}>{p.status}</span>
                  <Link to="/generate" style={C.link}>Continue →</Link>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{ display:'flex', gap:12, marginTop:20, flexWrap:'wrap' }}>
            <button style={C.btn('linear-gradient(135deg,#E63946,#C1121F)','white','0 4px 16px rgba(230,57,70,0.35)')} onClick={()=>navigate('/generate')}>
              ➕ New Animation
            </button>
            <button style={C.btn('#FFF8E7','#1A1A2E')} onClick={()=>navigate('/stories')}>
              📚 Browse Stories
            </button>
            <button style={C.btn('linear-gradient(135deg,#22c55e,#15803d)','white','0 4px 16px rgba(34,197,94,0.30)')} onClick={()=>navigate('/relax')}>
              🎮 Relax & Play
            </button>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

          {/* Relax & Play widget */}
          <div style={C.card}>
            <h2 style={C.h2}>🎮 Relax & Play</h2>
            <p style={{ fontSize:'0.83rem', color:'#9090A0', marginBottom:16, lineHeight:1.5 }}>
              Take a mindful break. Come back refreshed and creative.
            </p>
            {games.map(g => (
              <Link key={g.id} to={`/relax/${g.id}`}
                style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', marginBottom:8, borderRadius:10, border:'1.5px solid #FFE0B2', background:'#FFFBF0', textDecoration:'none', color:'#1A1A2E', fontWeight:600, fontSize:'0.85rem', transition:'all 0.2s' }}>
                <span style={{ fontSize:'1.2rem' }}>{g.icon}</span>
                {g.name}
              </Link>
            ))}
            <Link to="/relax" style={{ display:'block', textAlign:'center', marginTop:8, fontSize:'0.8rem', color:'#22c55e', fontWeight:600, textDecoration:'none' }}>
              Explore All 8 Games →
            </Link>
          </div>

          {/* Story Library teaser */}
          <div style={{ ...C.card, background:'linear-gradient(135deg,#FFF8E7,#FFEDE3)', border:'1px solid #FFD180' }}>
            <h2 style={C.h2}>📚 Story Library</h2>
            <p style={{ fontSize:'0.83rem', color:'#9090A0', marginBottom:16, lineHeight:1.5 }}>
              10,000+ stories — kids, teens &amp; adults. Pick one and animate it.
            </p>
            <Link to="/stories"
              style={{ display:'block', textAlign:'center', padding:'12px', background:'linear-gradient(135deg,#E63946,#C1121F)', color:'white', borderRadius:12, fontWeight:700, fontSize:'0.88rem', textDecoration:'none', boxShadow:'0 4px 14px rgba(230,57,70,0.30)' }}>
              Browse Stories
            </Link>
          </div>

        </div>
      </div>
    </AppShell>
  )
}
