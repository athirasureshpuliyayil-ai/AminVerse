import { useLocation } from 'react-router-dom'
import AppShell from '../components/AppShell'

export default function AdminPortal() {
  const location = useLocation()
  const path     = location.pathname

  const stats = [
    { label:'Total Users',        value:142,   color:'#E63946', bg:'#FFEBEE', icon:'👥' },
    { label:'Library Stories',    value:10450, color:'#FF9F1C', bg:'#FFF3E0', icon:'📚' },
    { label:'Animations Rendered',value:840,   color:'#7C3AED', bg:'#F5F3FF', icon:'🎬' },
    { label:'Game Sessions',      value:3200,  color:'#22c55e', bg:'#F0FDF4', icon:'🎮' },
  ]

  const users = [
    { id:'1', name:'Athira K',    email:'athira@example.com',  role:'user',  date:'2026-08-01' },
    { id:'2', name:'Arjun Mehta', email:'arjun@example.com',   role:'user',  date:'2026-07-29' },
    { id:'3', name:'Sara Ahmed',  email:'sara@example.com',    role:'admin', date:'2026-07-25' },
  ]

  const games = [
    { id:'g1', name:'Memory Match',   category:'Kids',     plays:1200, status:'Active' },
    { id:'g2', name:'Calm Breathing', category:'Everyone', plays:850,  status:'Active' },
    { id:'g3', name:'Puzzle Garden',  category:'Everyone', plays:640,  status:'Active' },
    { id:'g4', name:'Color Flow',     category:'Adults',   plays:420,  status:'Active' },
  ]

  const C = {
    card: { background:'white', borderRadius:16, border:'1px solid #FFE0B2', boxShadow:'0 2px 12px rgba(230,57,70,0.06)', padding:24, marginBottom:24 },
    th: { padding:'12px 16px', fontSize:'0.78rem', fontWeight:700, color:'#9090A0', textTransform:'uppercase', letterSpacing:1, textAlign:'left' },
    td: { padding:'14px 16px', fontSize:'0.88rem', color:'#1A1A2E' },
    tr: { borderBottom:'1px solid #FFF3E0' },
    badge: (green) => ({ display:'inline-block', padding:'4px 10px', borderRadius:50, fontSize:'0.72rem', fontWeight:700, background: green?'#F0FDF4':'#F5F3FF', color: green?'#15803d':'#7C3AED', border: `1px solid ${green?'#A7F3D0':'#DDD6FE'}` }),
    btnOutline: { padding:'8px 16px', border:'1.5px solid #FFE0B2', borderRadius:8, background:'white', color:'#4A4A6A', fontWeight:600, fontSize:'0.8rem', cursor:'pointer', fontFamily:'inherit' },
    btnRed: { padding:'8px 16px', border:'none', borderRadius:8, background:'#FFEBEE', color:'#E63946', fontWeight:600, fontSize:'0.8rem', cursor:'pointer', fontFamily:'inherit' },
  }

  return (
    <AppShell title="Admin Management Console">

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:28 }}>
        {stats.map((s,i) => (
          <div key={i} style={C.card}>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:48, height:48, borderRadius:14, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', flexShrink:0 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize:'0.75rem', color:'#9090A0', marginBottom:2 }}>{s.label}</div>
                <div style={{ fontSize:'1.8rem', fontWeight:900, color:s.color, lineHeight:1 }}>{s.value.toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      {(path === '/admin' || path === '/admin/users') && (
        <div style={C.card}>
          <h2 style={{ fontSize:'1.25rem', fontWeight:800, margin:'0 0 18px', color:'#1A1A2E' }}>👥 Registered Users</h2>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead style={{ background:'#FFF8E7' }}>
                <tr>
                  {['Name','Email','Role','Joined','Actions'].map(h => <th key={h} style={C.th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={C.tr}>
                    <td style={{ ...C.td, fontWeight:700 }}>{u.name}</td>
                    <td style={C.td}>{u.email}</td>
                    <td style={C.td}><span style={C.badge(u.role==='user')}>{u.role}</span></td>
                    <td style={{ ...C.td, color:'#9090A0' }}>{u.date}</td>
                    <td style={{ ...C.td, display:'flex', gap:8 }}>
                      <button style={C.btnOutline}>Edit Role</button>
                      <button style={C.btnRed}>Suspend</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Games Table */}
      {(path === '/admin' || path === '/admin/games') && (
        <div style={C.card}>
          <h2 style={{ fontSize:'1.25rem', fontWeight:800, margin:'0 0 18px', color:'#1A1A2E' }}>🎮 Relax & Play Games</h2>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead style={{ background:'#FFF8E7' }}>
                <tr>
                  {['Game Name','Audience','Play Sessions','Status','Actions'].map(h => <th key={h} style={C.th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {games.map(g => (
                  <tr key={g.id} style={C.tr}>
                    <td style={{ ...C.td, fontWeight:700 }}>{g.name}</td>
                    <td style={C.td}>{g.category}</td>
                    <td style={{ ...C.td, fontWeight:700, color:'#E63946' }}>{g.plays.toLocaleString()}</td>
                    <td style={C.td}><span style={C.badge(true)}>{g.status}</span></td>
                    <td style={C.td}><button style={C.btnOutline}>Configure</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppShell>
  )
}
