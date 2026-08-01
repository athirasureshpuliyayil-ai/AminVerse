import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [alert, setAlert]       = useState(null)

  useEffect(() => {
    if (localStorage.getItem('animverse_token')) navigate('/dashboard', { replace: true })
  }, [navigate])

  const showAlertMsg = (type, msg) => {
    setAlert({ type, msg })
    setTimeout(() => setAlert(null), 5000)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) return showAlertMsg('error', 'Please fill in all fields.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showAlertMsg('error', 'Please enter a valid email address.')
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ email, password }) })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem('animverse_token', data.token)
        localStorage.setItem('animverse_user', JSON.stringify(data.user))
        showAlertMsg('success', `Welcome back, ${data.user.name}!`)
        setTimeout(() => navigate(data.user.role === 'admin' ? '/admin' : '/dashboard'), 1400)
      } else {
        showAlertMsg('error', data.message || 'Login failed. Please try again.')
      }
    } catch { showAlertMsg('error', 'Cannot connect to server.') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr', fontFamily:"'Poppins', -apple-system, sans-serif" }}>

      {/* ── LEFT VISUAL PANEL ── */}
      <div style={{
        background:'linear-gradient(160deg,#C1121F 0%,#E63946 45%,#FF9F1C 100%)',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        padding:'60px 48px', position:'relative', overflow:'hidden',
      }}>
        {/* Background pattern */}
        <div style={{ position:'absolute', inset:0, backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.06'%3E%3Ccircle cx='30' cy='30' r='24'/%3E%3C/g%3E%3C/svg%3E\")", backgroundRepeat:'repeat', pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:1, textAlign:'center', color:'white', maxWidth:360 }}>
          <Link to="/" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, marginBottom:48, textDecoration:'none' }}>
            <div style={{ width:50, height:50, background:'rgba(255,255,255,0.20)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', border:'2px solid rgba(255,255,255,0.30)' }}>🎬</div>
            <span style={{ fontSize:'1.5rem', fontWeight:800, color:'white' }}>AnimVerse AI</span>
          </Link>

          <div style={{ fontSize:'5rem', marginBottom:24, display:'block',
            animation:'float 4s ease-in-out infinite' }}>🌟</div>

          <h2 style={{ fontSize:'2rem', fontWeight:800, marginBottom:12, lineHeight:1.2 }}>
            Welcome Back,<br />Storyteller!
          </h2>
          <p style={{ fontSize:'0.92rem', opacity:0.85, lineHeight:1.7, marginBottom:40 }}>
            Log in and continue creating amazing animated videos from your stories and imagination.
          </p>

          {[
            ['🎨','7 Professional Animation Styles'],
            ['🎙️','AI Voice & Emotion Generation'],
            ['📖','10,000+ Stories in Library'],
            ['📥','Download MP4, PDF & SRT'],
          ].map(([icon,text],i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.20)', borderRadius:12, padding:'13px 18px', marginBottom:12, textAlign:'left' }}>
              <span style={{ fontSize:'1.4rem' }}>{icon}</span>
              <span style={{ fontSize:'0.85rem', fontWeight:600 }}>{text}</span>
            </div>
          ))}
        </div>

        <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}`}</style>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 48px', background:'#FFFBF0', overflowY:'auto' }}>
        <div style={{ width:'100%', maxWidth:420 }}>
          <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:8, color:'#9090A0', fontSize:'0.85rem', fontWeight:500, marginBottom:32, textDecoration:'none' }}>
            ← Back to Home
          </Link>

          <h1 style={{ fontSize:'2rem', fontWeight:800, color:'#1A1A2E', marginBottom:6 }}>Sign In</h1>
          <p style={{ fontSize:'0.9rem', color:'#9090A0', marginBottom:32 }}>Enter your credentials to access your AnimVerse dashboard</p>

          {alert && (
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 16px', borderRadius:10, marginBottom:20, fontSize:'0.88rem', fontWeight:500,
              background: alert.type==='error' ? '#FFEBEE' : '#E8F5E9',
              border: `1px solid ${alert.type==='error' ? '#FFCDD2' : '#A5D6A7'}`,
              color: alert.type==='error' ? '#C1121F' : '#1B5E20',
            }}>
              {alert.type==='error' ? '⚠️' : '✅'} {alert.msg}
            </div>
          )}

          <button type="button" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, width:'100%', padding:13, border:'2px solid #FFE0B2', borderRadius:10, background:'white', fontWeight:600, fontSize:'0.9rem', cursor:'pointer', marginBottom:4, fontFamily:'inherit' }}>
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,19.001,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
            Continue with Google
          </button>

          <div style={{ textAlign:'center', margin:'16px 0', color:'#9090A0', fontSize:'0.82rem', position:'relative' }}>
            <span style={{ background:'#FFFBF0', padding:'0 12px', position:'relative', zIndex:1 }}>or sign in with email</span>
            <div style={{ position:'absolute', top:'50%', left:0, right:0, height:1, background:'#FFE0B2', zIndex:0 }} />
          </div>

          <form onSubmit={handleLogin} noValidate>
            <div style={{ marginBottom:18 }}>
              <label style={{ display:'block', marginBottom:7, fontWeight:600, fontSize:'0.9rem' }}>Email Address</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:'1rem', color:'#9090A0' }}>✉️</span>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ width:'100%', padding:'13px 14px 13px 44px', border:'2px solid #FFE0B2', borderRadius:10, fontSize:'0.95rem', background:'white', color:'#1A1A2E', boxSizing:'border-box', fontFamily:'inherit', outline:'none', transition:'border-color 0.2s' }}
                  onFocus={e=>e.target.style.borderColor='#E63946'} onBlur={e=>e.target.style.borderColor='#FFE0B2'} />
              </div>
            </div>

            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', marginBottom:7, fontWeight:600, fontSize:'0.9rem' }}>Password</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:'1rem', color:'#9090A0' }}>🔒</span>
                <input type={showPw?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{ width:'100%', padding:'13px 44px 13px 44px', border:'2px solid #FFE0B2', borderRadius:10, fontSize:'0.95rem', background:'white', color:'#1A1A2E', boxSizing:'border-box', fontFamily:'inherit', outline:'none', transition:'border-color 0.2s' }}
                  onFocus={e=>e.target.style.borderColor='#E63946'} onBlur={e=>e.target.style.borderColor='#FFE0B2'} />
                <button type="button" onClick={()=>setShowPw(p=>!p)}
                  style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:'1.1rem', color:'#9090A0' }}>
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.85rem', color:'#4A4A6A', cursor:'pointer' }}>
                <input type="checkbox" style={{ accentColor:'#E63946' }} /> Remember me
              </label>
              <Link to="/forgot-password" style={{ fontSize:'0.85rem', color:'#E63946', fontWeight:600, textDecoration:'none' }}>Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading} style={{
              width:'100%', padding:15, borderRadius:10, border:'none', cursor:'pointer', fontFamily:'inherit',
              background: loading ? '#ccc' : 'linear-gradient(135deg,#E63946,#C1121F)',
              color:'white', fontWeight:700, fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center', gap:10,
              boxShadow: loading ? 'none' : '0 8px 30px rgba(230,57,70,0.35)', transition:'transform 0.2s',
            }}>
              {loading ? <>⏳ Signing in...</> : <>🔑 Sign In</>}
            </button>
          </form>

          <div style={{ textAlign:'center', marginTop:24, fontSize:'0.88rem', color:'#9090A0' }}>
            Don't have an account? <Link to="/register" style={{ color:'#E63946', fontWeight:700, textDecoration:'none' }}>Create one free</Link>
          </div>
          <div style={{ textAlign:'center', marginTop:12 }}>
            <Link to="/admin-login" style={{ fontSize:'0.8rem', color:'#9090A0', textDecoration:'none' }}>🛡️ Admin Login</Link>
          </div>
        </div>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media(max-width:768px){
          div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}
          div[style*="padding: 60px 48px"]:first-child{display:none!important}
          div[style*="padding: 60px 48px"]:last-child{padding:40px 24px!important}
        }
      `}</style>
    </div>
  )
}
