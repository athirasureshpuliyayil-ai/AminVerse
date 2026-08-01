import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null) // { type: 'error'|'success', msg }

  /* Redirect if already logged in */
  useEffect(() => {
    if (localStorage.getItem('animverse_token')) navigate('/dashboard', { replace: true })
  }, [navigate])

  const showAlert = (type, msg) => {
    setAlert({ type, msg })
    setTimeout(() => setAlert(null), 5000)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) return showAlert('error', 'Please fill in all fields.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showAlert('error', 'Please enter a valid email address.')

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (data.success) {
        localStorage.setItem('animverse_token', data.token)
        localStorage.setItem('animverse_user', JSON.stringify(data.user))
        if (data.user.role === 'admin') {
          localStorage.setItem('animverse_admin_token', data.token)
          localStorage.setItem('animverse_admin', JSON.stringify(data.user))
          showAlert('success', `Welcome back, Admin! Redirecting...`)
          setTimeout(() => navigate('/admin-dashboard'), 1500)
        } else {
          showAlert('success', `Welcome back, ${data.user.name}! Redirecting...`)
          setTimeout(() => navigate('/dashboard'), 1500)
        }
      } else {
        showAlert('error', data.message || 'Login failed. Please try again.')
      }
    } catch {
      showAlert('error', 'Cannot connect to server. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* Left Visual */}
      <div className="login-visual">
        <div className="login-visual-content">
          <div className="visual-brand">
            <div className="visual-brand-icon">🎬</div>
            <div className="visual-brand-name">AnimVerse AI</div>
          </div>
          <div className="visual-hero-emoji">🌟</div>
          <h2>Welcome Back,<br />Storyteller!</h2>
          <p>Log in to your account and continue creating amazing animated videos from your stories and imagination.</p>
          <div className="visual-features">
            {[['🎨','7 Professional Animation Styles'],['🎙️','AI Voice & Emotion Generation'],['📖','10,000+ Stories in Library'],['📥','Download MP4, PDF Storyboard & SRT']].map(([icon,text],i) => (
              <div className="visual-feat" key={i}><div className="visual-feat-icon">{icon}</div><div className="visual-feat-text">{text}</div></div>
            ))}
          </div>
        </div>
        <div className="deco-dots">
          {Array(25).fill(0).map((_,i) => <div className="deco-dot" key={i} />)}
        </div>
      </div>

      {/* Right Form */}
      <div className="login-form-panel">
        <div className="login-form-inner">
          <Link to="/" className="back-link"><i className="fas fa-arrow-left" /> Back to Home</Link>
          <h1 className="form-title">Sign In</h1>
          <p className="form-subtitle">Enter your credentials to access your AnimVerse dashboard</p>

          {alert && (
            <div className={`alert alert-${alert.type} show`}>
              <i className={`fas fa-${alert.type === 'error' ? 'exclamation-circle' : 'check-circle'}`} />
              <span>{alert.msg}</span>
            </div>
          )}

          <button className="google-btn" type="button" onClick={() => showAlert('error', 'Google Login will be available soon! Please use email login.')}>
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,19.001,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
            Continue with Google
          </button>

          <div className="auth-divider">or sign in with email</div>

          <form onSubmit={handleLogin} noValidate>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-icon-wrap">
                <i className="fas fa-envelope input-icon" />
                <input type="email" className="form-control" id="email" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-icon-wrap">
                <i className="fas fa-lock input-icon" />
                <input type={showPw ? 'text' : 'password'} className="form-control" id="password"
                  placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)}
                  required autoComplete="current-password" />
                <i className={`fas fa-${showPw ? 'eye-slash' : 'eye'} toggle-pw`} onClick={() => setShowPw(p => !p)} />
              </div>
            </div>
            <div className="remember-row">
              <label><input type="checkbox" id="remember" /> Remember me</label>
              <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
            </div>
            <button type="submit" className="btn-login" id="loginBtn" disabled={loading}>
              {loading
                ? <><span className="spinner" /> Signing in...</>
                : <><i className="fas fa-sign-in-alt" /> Sign In</>
              }
            </button>
          </form>

          <div className="register-link-row">
            Don't have an account? <Link to="/register">Create one free</Link>
          </div>
          <Link to="/admin-login" className="admin-link">
            <i className="fas fa-shield-alt" /> Admin Login
          </Link>
        </div>
      </div>

      <style>{`
        .login-page { min-height:100vh; display:grid; grid-template-columns:1fr 1fr; }
        .login-visual {
          background:linear-gradient(160deg,#C1121F 0%,#E63946 45%,#FF9F1C 100%);
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          padding:60px 48px; position:relative; overflow:hidden;
        }
        .login-visual::before { content:''; position:absolute; inset:0; background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.06'%3E%3Ccircle cx='30' cy='30' r='24'/%3E%3C/g%3E%3C/svg%3E") repeat; }
        .login-visual-content { position:relative; z-index:1; text-align:center; color:white; }
        .visual-brand { display:flex; align-items:center; justify-content:center; gap:12px; margin-bottom:48px; }
        .visual-brand-icon { width:52px; height:52px; background:rgba(255,255,255,0.20); border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:1.6rem; border:2px solid rgba(255,255,255,0.30); }
        .visual-brand-name { font-size:1.6rem; font-weight:800; color:white; }
        .visual-hero-emoji { font-size:5rem; margin-bottom:24px; animation:float 4s ease-in-out infinite; display:block; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        .login-visual h2 { font-size:2rem; font-weight:800; margin-bottom:14px; line-height:1.2; }
        .login-visual p { font-size:0.95rem; opacity:0.85; line-height:1.7; max-width:320px; margin:0 auto 40px; }
        .visual-features { display:flex; flex-direction:column; gap:16px; text-align:left; width:100%; max-width:320px; }
        .visual-feat { display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.20); border-radius:12px; padding:14px 18px; }
        .visual-feat-icon { font-size:1.4rem; }
        .visual-feat-text { font-size:0.85rem; font-weight:600; color:white; }
        .deco-dots { position:absolute; bottom:40px; left:40px; display:grid; grid-template-columns:repeat(5,1fr); gap:6px; }
        .deco-dot { width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,0.25); }
        .login-form-panel { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 48px; background:#FFFBF0; overflow-y:auto; }
        .login-form-inner { width:100%; max-width:420px; }
        .back-link { display:inline-flex; align-items:center; gap:8px; color:var(--text-muted); font-size:0.85rem; font-weight:500; margin-bottom:32px; transition:var(--transition); }
        .back-link:hover { color:var(--primary); }
        .form-title { font-size:2rem; font-weight:800; color:var(--text-primary); margin-bottom:6px; }
        .form-subtitle { font-size:0.92rem; color:var(--text-muted); margin-bottom:32px; }
        .google-btn { display:flex; align-items:center; justify-content:center; gap:10px; width:100%; padding:13px; border:2px solid #FFE0B2; border-radius:var(--radius-sm); background:white; font-weight:600; font-size:0.9rem; cursor:pointer; transition:var(--transition); color:var(--text-primary); }
        .google-btn:hover { border-color:var(--secondary); box-shadow:0 4px 16px rgba(255,152,0,0.20); transform:translateY(-1px); }
        .remember-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; }
        .remember-row label { display:flex; align-items:center; gap:8px; font-size:0.85rem; color:var(--text-secondary); cursor:pointer; margin:0; }
        .remember-row input[type=checkbox] { width:16px; height:16px; accent-color:var(--primary); }
        .forgot-link { font-size:0.85rem; color:var(--primary); font-weight:600; transition:var(--transition); }
        .forgot-link:hover { text-decoration:underline; }
        .btn-login { width:100%; padding:15px; font-size:1rem; border-radius:var(--radius-sm); background:linear-gradient(135deg,var(--primary),var(--primary-dark)); color:white; font-weight:700; display:flex; align-items:center; justify-content:center; gap:10px; transition:var(--transition); border:none; cursor:pointer; }
        .btn-login:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(230,57,70,0.40); }
        .btn-login:disabled { opacity:0.65; transform:none; cursor:not-allowed; }
        .register-link-row { text-align:center; margin-top:24px; font-size:0.88rem; color:var(--text-muted); }
        .register-link-row a { color:var(--primary); font-weight:700; }
        .admin-link { display:flex; align-items:center; justify-content:center; gap:6px; margin-top:20px; font-size:0.82rem; color:var(--text-muted); transition:var(--transition); }
        .admin-link:hover { color:var(--primary); }
        @media(max-width:768px){ .login-page{grid-template-columns:1fr;} .login-visual{display:none;} .login-form-panel{padding:40px 24px;} }
      `}</style>
    </div>
  )
}
