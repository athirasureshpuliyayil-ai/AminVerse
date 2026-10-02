import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { setAuth, getToken, getUser } from '../utils/authStorage'

export default function ParentLogin() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    if (getToken() && getUser()) {
      navigate(redirect || '/dashboard/parent', { replace: true })
    }
  }, [navigate, redirect])

  const showAlertMsg = (type, msg) => {
    setAlert({ type, msg })
    setTimeout(() => setAlert(null), 5000)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) return showAlertMsg('error', 'Please fill in all fields.')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (data.success) {
        setAuth(data.token, data.user, true)
        showAlertMsg('success', `Welcome back, ${data.user.name}!`)
        setTimeout(() => navigate(redirect || '/dashboard/parent'), 800)
      } else {
        showAlertMsg('error', data.message || 'Login failed')
      }
    } catch {
      showAlertMsg('error', 'Cannot connect to AnimVerse right now. Check that the server is running, then try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* LEFT VISUAL PANEL */}
      <div style={{
        background: 'linear-gradient(160deg, #0B0F19 0%, #1E1B4B 50%, #4F46E5 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '60px 48px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', maxWidth: 400 }}>
          <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 40, textDecoration: 'none' }}>
            <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'white' }}>🎬</div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>AnimVerse AI</span>
          </Link>

          <div style={{ fontSize: '4.5rem', marginBottom: 20 }}>👨‍👩‍👧</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em' }}>Parent & Kids Hub</h2>
          <p style={{ fontSize: '0.92rem', opacity: 0.85, lineHeight: 1.7, marginBottom: 32 }}>
            Access curated bedtime stories, interactive read-aloud audiobooks, safety controls, and level-based arcade games for kids.
          </p>

          <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '18px 20px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 8, color: '#818CF8' }}>✨ Parent Hub Highlights</div>
            <ul style={{ fontSize: '0.82rem', opacity: 0.9, lineHeight: 1.8, paddingLeft: 18 }}>
              <li>Child screen-time monitor & age safety filters</li>
              <li>AnimVerse Radio 📻 Bedtime audio stories & lullabies</li>
              <li>Literature Museum 🏛️ Fairy tales & moral fable wings</li>
              <li>Read-Aloud story narrator with synchronized text</li>
              <li>Level-based educational puzzle games</li>
            </ul>
          </div>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '50px 48px', background: 'var(--off-white)' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Link to={`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 24, textDecoration: 'none' }}>
            ← Back to Portal Directory
          </Link>

          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 50, background: 'rgba(99,102,241,0.12)', color: '#6366F1', fontWeight: 700, fontSize: '0.78rem', marginBottom: 12 }}>
            PARENT PORTAL LOGIN
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Sign In to Parent Portal</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 28 }}>Manage your family library and kids learning arcade</p>

          {alert && (
            <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 20, background: alert.type === 'error' ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)', color: alert.type === 'error' ? '#F87171' : '#34D399', fontWeight: 600, fontSize: '0.88rem' }}>
              {alert.msg}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.86rem', color: 'var(--text-primary)' }}>Parent Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 10, background: 'var(--card-bg)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.86rem', color: 'var(--text-primary)' }}>Password</label>
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 10, background: 'var(--card-bg)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: 14, borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#6366F1,#4F46E5)', color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}>
              {loading ? 'Entering Parent Portal...' : '👨‍👩‍👧 Enter Parent Portal'}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Switch Portal: <Link to={`/login/adult${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} style={{ color: '#8B5CF6', fontWeight: 700 }}>Adult Fiction</Link> • <Link to={`/login/author${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} style={{ color: '#6366F1', fontWeight: 700 }}>Author Studio</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
