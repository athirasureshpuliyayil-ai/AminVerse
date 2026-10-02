import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { setAuth, getToken, getUser } from '../utils/authStorage'

const pwStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '#ddd' }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const map = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const clr = ['#ddd', '#E63946', '#FF9F1C', '#FFD60A', '#22c55e']
  return { score, label: map[score], color: clr[score] }
}

export default function Register() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect')

  const [form, setForm]       = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', role: 'author' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert]     = useState(null)

  useEffect(() => {
    if (getToken() && getUser()) {
      navigate(redirect || '/dashboard', { replace: true })
    }
  }, [navigate, redirect])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const showAlertMsg = (type, msg) => {
    setAlert({ type, msg })
    setTimeout(() => setAlert(null), 5000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.firstName.trim() || !form.lastName.trim()) return showAlertMsg('error', 'Please enter your first and last name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return showAlertMsg('error', 'Please enter a valid email address.')
    if (form.password.length < 6) return showAlertMsg('error', 'Password must be at least 6 characters long.')
    if (form.password !== form.confirmPassword) return showAlertMsg('error', 'Passwords do not match.')

    setLoading(true)
    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`
    try {
      const res  = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email: form.email.trim(),
          password: form.password,
          role: form.role
        })
      })
      const data = await res.json()
      if (data.success) {
        const registeredUser = {
          id: data.user.id || data.user._id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role || form.role,
          createdAt: new Date().toISOString().split('T')[0]
        }
        
        // Save to animverse_users in localStorage
        const stored = JSON.parse(localStorage.getItem('animverse_users') || '[]')
          .filter(u => u.email !== form.email && !['u_101', 'u_102', 'u_103', 'u_104'].includes(u.id))
        localStorage.setItem('animverse_users', JSON.stringify([registeredUser, ...stored]))

        setAuth(data.token, registeredUser, true)
        showAlertMsg('success', `Welcome ${registeredUser.name}! Account registered successfully.`)
        setTimeout(() => navigate(redirect || `/dashboard/${form.role}`), 1000)
      } else {
        showAlertMsg('error', data.message || 'Registration failed.')
      }
    } catch {
      showAlertMsg('error', 'Cannot connect to AnimVerse. Your account was not created; check that the server is running and try again.')
    } finally {
      setLoading(false)
    }
  }

  const pw = pwStrength(form.password)

  const INPUT = {
    width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 10,
    fontSize: '0.92rem', background: 'var(--card-bg)', color: 'var(--text-primary)', boxSizing: 'border-box',
    fontFamily: 'inherit', outline: 'none', transition: 'var(--transition)',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* LEFT VISUAL PANEL */}
      <div style={{ background: 'linear-gradient(160deg,#0B0F19 0%,#1E1B4B 50%,#4F46E5 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='24'/%3E%3C/g%3E%3C/svg%3E\")", backgroundRepeat: 'repeat', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, color: 'white', textAlign: 'center', maxWidth: 380 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 40, textDecoration: 'none' }}>
            <div style={{ width: 50, height: 50, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid rgba(255,255,255,0.20)', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>🎬</div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', letterSpacing: '-0.01em' }}>AnimVerse AI</span>
          </Link>

          <div style={{ fontSize: '4.5rem', marginBottom: 20 }}>🚀</div>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em' }}>Join the Story Universe</h2>
          <p style={{ opacity: 0.85, lineHeight: 1.7, marginBottom: 32, fontSize: '0.9rem' }}>
            Create one account and access all three experiences — Parent, Adult, and Author — by choosing your role at login.
          </p>

          {[
            ['👨‍👩‍👧 Parent Mode', 'Safe kids books, quizzes & audio read-aloud'],
            ['🧔 Adult Fiction Mode', 'Mature sci-fi, thrillers & zen brain games'],
            ['✍️ Author Studio', 'Story uploading & instant AI animation pipeline'],
          ].map(([title, text], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, textAlign: 'left', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)', backdropFilter:'blur(10px)', padding:'10px 14px', borderRadius:12 }}>
              <span style={{ fontSize: '1.2rem' }}>✨</span>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700 }}>{title}</div>
                <div style={{ fontSize: '0.74rem', opacity: 0.8 }}>{text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 48px', background: 'var(--off-white)', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 20, textDecoration: 'none' }}>
            ← Back to Home
          </Link>

          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4, letterSpacing: '-0.02em' }}>Create Account</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 20 }}>One account — access Parent, Adult & Author dashboards at login</p>



          {/* Floating Toast Notification */}
          {alert && (
            <div style={{
              position: 'fixed', top: 24, right: 24, zIndex: 9999,
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderRadius: 12,
              background: alert.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              border: `1.5px solid ${alert.type === 'error' ? '#EF4444' : '#10B981'}`,
              color: alert.type === 'error' ? '#F87171' : '#34D399',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)', fontWeight: 700, fontSize: '0.92rem',
            }}>
              <span style={{ fontSize: '1.2rem' }}>{alert.type === 'error' ? '⚠️' : '✅'}</span>
              <span>{alert.msg}</span>
              <button onClick={() => setAlert(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', marginLeft: 8, color: 'inherit' }}>✕</button>
            </div>
          )}

          {alert && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 10, marginBottom: 16, fontSize: '0.86rem', fontWeight: 600,
              background: alert.type === 'error' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
              border: `1.5px solid ${alert.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
              color: alert.type === 'error' ? '#F87171' : '#34D399',
            }}>
              {alert.type === 'error' ? '⚠️' : '✅'} {alert.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Name Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              {[['firstName', 'First Name'], ['lastName', 'Last Name']].map(([k, lbl]) => (
                <div key={k}>
                  <label style={{ display: 'block', marginBottom: 5, fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-primary)' }}>{lbl}</label>
                  <input
                    type="text" value={form[k]} onChange={e => set(k, e.target.value)} placeholder={lbl}
                    style={INPUT}
                  />
                </div>
              ))}
            </div>

            {/* Role / Experience Selector */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-primary)' }}>Account Role / Portal</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {[
                  { key: 'parent', label: '🧸 Parent', desc: 'Kids Hub' },
                  { key: 'adult', label: '📚 Adult', desc: 'Fiction' },
                  { key: 'author', label: '✍️ Author', desc: 'Studio' }
                ].map(r => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => set('role', r.key)}
                    style={{
                      padding: '10px 8px', borderRadius: 10,
                      border: `1.5px solid ${form.role === r.key ? '#F59E0B' : 'rgba(255,255,255,0.1)'}`,
                      background: form.role === r.key ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.03)',
                      color: form.role === r.key ? '#F59E0B' : 'var(--text-secondary)',
                      cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s'
                    }}>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{r.label}</div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-primary)' }}>Email Address</label>
              <input
                type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com"
                style={INPUT}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-primary)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 6 characters"
                  style={{ ...INPUT, paddingRight: 40 }}
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--text-muted)' }}>
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
              {form.password && (
                <div style={{ marginTop: 4 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 3 }}>
                    {[1, 2, 3, 4].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= pw.score ? pw.color : 'var(--border)' }} />)}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: pw.color, fontWeight: 600 }}>Strength: {pw.label}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-primary)' }}>Confirm Password</label>
              <input
                type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Repeat your password"
                style={{ ...INPUT, borderColor: form.confirmPassword && form.password !== form.confirmPassword ? '#EF4444' : 'var(--border)' }}
              />
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              background: loading ? '#ccc' : 'linear-gradient(135deg,#6366F1,#4F46E5)',
              color: 'white', fontWeight: 700, fontSize: '0.95rem',
              boxShadow: loading ? 'none' : '0 6px 24px rgba(99,102,241,0.35)'
            }}>
              {loading ? '⏳ Creating Account...' : '🚀 Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 18, fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Already have an account? <Link to={`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} style={{ color: 'var(--primary-light)', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}
