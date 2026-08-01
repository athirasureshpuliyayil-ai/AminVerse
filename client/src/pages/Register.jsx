import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  const [showPw1, setShowPw1] = useState(false)
  const [showPw2, setShowPw2] = useState(false)
  const [role, setRole] = useState('user')
  const [terms, setTerms] = useState(false)
  const [strength, setStrength] = useState({ width: '0%', bg: '#eee', label: '' })
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    if (localStorage.getItem('animverse_token')) navigate('/dashboard', { replace: true })
  }, [navigate])

  const showAlert = (type, msg) => {
    setAlert({ type, msg })
    setTimeout(() => setAlert(null), 6000)
  }

  const checkStrength = (pw) => {
    let s = 0
    if (pw.length >= 6) s++; if (pw.length >= 10) s++
    if (/[A-Z]/.test(pw)) s++; if (/[0-9]/.test(pw)) s++; if (/[^A-Za-z0-9]/.test(pw)) s++
    const levels = [
      { width: '0%', bg: '#eee', label: '' },
      { width: '25%', bg: '#E63946', label: 'Weak' },
      { width: '50%', bg: '#FF9F1C', label: 'Fair' },
      { width: '75%', bg: '#FFD60A', label: 'Good' },
      { width: '90%', bg: '#4CAF50', label: 'Strong' },
      { width: '100%', bg: '#2E7D32', label: 'Very Strong' },
    ]
    setStrength(levels[Math.min(s, 5)])
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setForm(f => ({ ...f, [id]: value }))
    if (id === 'password') checkStrength(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { firstName, email, password, confirm } = form
    if (!firstName || !email || !password) return showAlert('error', 'Please fill in all required fields.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showAlert('error', 'Please enter a valid email address.')
    if (password.length < 6) return showAlert('error', 'Password must be at least 6 characters long.')
    if (password !== confirm) return showAlert('error', 'Passwords do not match. Please re-enter.')
    if (!terms) return showAlert('error', 'Please agree to our Terms of Service to continue.')

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: firstName + (form.lastName ? ' ' + form.lastName : ''), email, password, role: 'user' }),
      })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem('animverse_token', data.token)
        localStorage.setItem('animverse_user', JSON.stringify(data.user))
        showAlert('success', `🎉 Welcome to AnimVerse AI, ${firstName}! Redirecting to dashboard...`)
        setTimeout(() => navigate('/dashboard'), 2000)
      } else {
        const errMsg = data.errors ? data.errors[0].msg : (data.message || 'Registration failed.')
        showAlert('error', errMsg)
      }
    } catch {
      showAlert('error', 'Cannot connect to server. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      {/* Left Visual */}
      <div className="reg-visual">
        <div className="reg-visual-content">
          <div className="reg-brand">
            <div className="reg-brand-icon">🎬</div>
            <div className="reg-brand-name">AnimVerse AI</div>
          </div>
          <span className="big-emoji">🚀</span>
          <h2>Join 25,000+<br />Creators Today!</h2>
          <p>Create your free account and start generating stunning animated videos from your stories in just minutes.</p>
          <div className="reg-steps">
            {['Create your free account in 30 seconds','Enter your story prompt or pick from library','AI generates your animation with voices & music','Download your MP4 video and share!'].map((t,i) => (
              <div className="reg-step" key={i}>
                <div className="reg-step-num">{i+1}</div>
                <div className="reg-step-text">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="reg-form-panel">
        <div className="reg-form-inner">
          <Link to="/" className="back-link"><i className="fas fa-arrow-left" /> Back to Home</Link>
          <h1 className="reg-title">Create Account</h1>
          <p className="reg-subtitle">It's free! No credit card required.</p>

          {alert && (
            <div className={`alert alert-${alert.type} show`}>
              <i className={`fas fa-${alert.type === 'error' ? 'exclamation-circle' : 'check-circle'}`} />
              <span>{alert.msg}</span>
            </div>
          )}

          <button className="google-btn" type="button"
            onClick={() => showAlert('error', 'Google Sign-up coming soon! Please use email registration.')}>
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,19.001,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
            Sign up with Google
          </button>
          <div className="auth-divider">or register with email</div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <div className="input-icon-wrap">
                  <i className="fas fa-user input-icon" />
                  <input type="text" className="form-control" id="firstName" placeholder="Athira"
                    value={form.firstName} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <div className="input-icon-wrap">
                  <i className="fas fa-user input-icon" />
                  <input type="text" className="form-control" id="lastName" placeholder="K"
                    value={form.lastName} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-icon-wrap">
                <i className="fas fa-envelope input-icon" />
                <input type="email" className="form-control" id="email" placeholder="you@example.com"
                  value={form.email} onChange={handleChange} required autoComplete="email" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-icon-wrap">
                <i className="fas fa-lock input-icon" />
                <input type={showPw1 ? 'text' : 'password'} className="form-control" id="password"
                  placeholder="At least 6 characters" value={form.password} onChange={handleChange}
                  required autoComplete="new-password" />
                <i className={`fas fa-${showPw1 ? 'eye-slash' : 'eye'} toggle-pw`} onClick={() => setShowPw1(p => !p)} />
              </div>
              <div className="password-strength"><div className="password-strength-bar" style={{width:strength.width,background:strength.bg}} /></div>
              {strength.label && <div className="strength-text" style={{color:strength.bg}}>{strength.label}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="confirm">Confirm Password</label>
              <div className="input-icon-wrap">
                <i className="fas fa-lock input-icon" />
                <input type={showPw2 ? 'text' : 'password'} className="form-control" id="confirm"
                  placeholder="Re-enter your password" value={form.confirm} onChange={handleChange}
                  required autoComplete="new-password" />
                <i className={`fas fa-${showPw2 ? 'eye-slash' : 'eye'} toggle-pw`} onClick={() => setShowPw2(p => !p)} />
              </div>
            </div>

            <div className="form-group">
              <label>I am a:</label>
              <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                {['user','parent','teacher','author'].map(r => (
                  <button key={r} type="button"
                    className={`prompt-option-btn${role === r ? ' active' : ''}`}
                    onClick={() => setRole(r)}>
                    {r === 'user' ? '👤 Creator / User' : r === 'parent' ? '👨‍👧 Parent' : r === 'teacher' ? '🎓 Teacher' : '✍️ Author'}
                  </button>
                ))}
              </div>
            </div>

            <div className="terms-check">
              <input type="checkbox" id="termsAgree" checked={terms} onChange={e => setTerms(e.target.checked)} required />
              <label htmlFor="termsAgree">
                I agree to AnimVerse AI's <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>. I confirm I am 13+ years old.
              </label>
            </div>

            <button type="submit" className="btn-register" disabled={loading}>
              {loading
                ? <><span className="spinner" /> Creating account...</>
                : <><i className="fas fa-user-plus" /> Create Free Account</>
              }
            </button>
          </form>

          <div className="login-link-row">Already have an account? <Link to="/login">Sign in here</Link></div>
        </div>
      </div>

      <style>{`
        .register-page { min-height:100vh; display:grid; grid-template-columns:1fr 1.2fr; }
        .reg-visual { background:linear-gradient(160deg,#FF9F1C 0%,#E63946 50%,#C1121F 100%); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 48px; position:relative; overflow:hidden; color:white; }
        .reg-visual::before { content:''; position:absolute; inset:0; background:url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.05'%3E%3Crect width='60' height='60' rx='12' x='10' y='10'/%3E%3C/g%3E%3C/svg%3E") repeat; }
        .reg-visual-content { position:relative; z-index:1; text-align:center; width:100%; max-width:340px; }
        .reg-brand { display:flex; align-items:center; justify-content:center; gap:10px; margin-bottom:40px; }
        .reg-brand-icon { width:48px; height:48px; background:rgba(255,255,255,0.20); border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:1.5rem; border:2px solid rgba(255,255,255,0.30); }
        .reg-brand-name { font-size:1.5rem; font-weight:800; }
        .big-emoji { font-size:5rem; margin-bottom:24px; display:block; animation:float 4s ease-in-out infinite; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        .reg-visual h2 { font-size:1.9rem; font-weight:800; margin-bottom:12px; }
        .reg-visual p { font-size:0.9rem; opacity:0.85; line-height:1.7; margin-bottom:32px; }
        .reg-steps { display:flex; flex-direction:column; gap:12px; text-align:left; }
        .reg-step { display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.20); border-radius:12px; padding:12px 16px; }
        .reg-step-num { width:28px; height:28px; background:var(--secondary); color:var(--text-primary); border-radius:50%; font-size:0.75rem; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .reg-step-text { font-size:0.82rem; font-weight:600; }
        .reg-form-panel { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:48px; background:#FFFBF0; overflow-y:auto; }
        .reg-form-inner { width:100%; max-width:480px; }
        .back-link { display:inline-flex; align-items:center; gap:8px; color:var(--text-muted); font-size:0.85rem; font-weight:500; margin-bottom:24px; transition:var(--transition); }
        .back-link:hover { color:var(--primary); }
        .reg-title { font-size:1.9rem; font-weight:800; margin-bottom:4px; }
        .reg-subtitle { font-size:0.9rem; color:var(--text-muted); margin-bottom:28px; }
        .form-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .google-btn { display:flex; align-items:center; justify-content:center; gap:10px; width:100%; padding:13px; border:2px solid #FFE0B2; border-radius:var(--radius-sm); background:white; font-weight:600; font-size:0.88rem; cursor:pointer; transition:var(--transition); color:var(--text-primary); margin-bottom:4px; }
        .google-btn:hover { border-color:var(--secondary); box-shadow:0 4px 16px rgba(255,152,0,0.20); }
        .password-strength { height:4px; background:#eee; border-radius:4px; margin-top:8px; overflow:hidden; }
        .password-strength-bar { height:100%; width:0%; border-radius:4px; transition:width 0.3s,background 0.3s; }
        .strength-text { font-size:0.72rem; margin-top:4px; font-weight:600; }
        .terms-check { display:flex; align-items:flex-start; gap:10px; margin-bottom:20px; }
        .terms-check input { width:16px; height:16px; accent-color:var(--primary); margin-top:2px; flex-shrink:0; }
        .terms-check label { font-size:0.82rem; color:var(--text-secondary); cursor:pointer; }
        .terms-check label a { color:var(--primary); font-weight:600; }
        .btn-register { width:100%; padding:15px; border-radius:var(--radius-sm); background:linear-gradient(135deg,var(--primary),var(--primary-dark)); color:white; font-weight:700; font-size:1rem; display:flex; align-items:center; justify-content:center; gap:10px; transition:var(--transition); border:none; cursor:pointer; }
        .btn-register:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(230,57,70,0.40); }
        .btn-register:disabled { opacity:0.65; transform:none; cursor:not-allowed; }
        .login-link-row { text-align:center; margin-top:20px; font-size:0.85rem; color:var(--text-muted); }
        .login-link-row a { color:var(--primary); font-weight:700; }
        @media(max-width:768px){ .register-page{grid-template-columns:1fr;} .reg-visual{display:none;} .reg-form-panel{padding:40px 24px;} .form-row{grid-template-columns:1fr;} }
      `}</style>
    </div>
  )
}
