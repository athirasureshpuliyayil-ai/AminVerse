import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [lockoutTime, setLockoutTime] = useState(null)

  useEffect(() => {
    if (localStorage.getItem('animverse_admin_token')) {
      navigate('/admin-dashboard', { replace: true })
    }
  }, [navigate])

  const showAlert = (type, msg) => {
    setAlert({ type, msg })
    setTimeout(() => setAlert(null), 6000)
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault()

    if (lockoutTime && Date.now() < lockoutTime) {
      const remaining = Math.ceil((lockoutTime - Date.now()) / 1000)
      showAlert('error', `Too many failed attempts. Try again in ${remaining} seconds.`)
      return
    }

    if (!email || !password) {
      showAlert('error', 'Please enter your admin email and password.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (data.success) {
        setAttempts(0)
        localStorage.setItem('animverse_admin_token', data.token)
        localStorage.setItem('animverse_admin', JSON.stringify(data.user))
        showAlert('success', `✅ Welcome, ${data.user.name}! Redirecting to Admin Panel...`)
        setTimeout(() => navigate('/admin-dashboard'), 1800)
      } else {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        if (newAttempts >= 5) {
          setLockoutTime(Date.now() + 60000)
          showAlert('error', 'Too many failed attempts. Account temporarily locked for 60 seconds.')
        } else {
          showAlert('error', data.message || `Invalid credentials. Attempt ${newAttempts}/5.`)
        }
      }
    } catch {
      showAlert('error', 'Cannot connect to server. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-page">
      {/* Background Orbs & Particles */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="admin-container">
        <div className="admin-login-card">
          {/* Header */}
          <div className="admin-header">
            <div className="admin-shield-wrap">
              <div className="admin-shield-bg">🛡️</div>
            </div>

            <div className="security-badge">
              <div className="security-dot" />
              SECURED ADMIN PORTAL
            </div>

            <h1>Admin Access</h1>
            <p>Authorized personnel only. All sessions are monitored and logged.</p>
          </div>

          {/* Alert Box */}
          {alert && (
            <div className={`dark-alert dark-alert-${alert.type} show`}>
              <i className={`fas fa-${alert.type === 'error' ? 'exclamation-triangle' : 'check-circle'}`} />
              <span>{alert.msg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminLogin} noValidate>
            <div className="dark-input-group">
              <label htmlFor="adminEmail">Admin Email Address</label>
              <div className="dark-input-wrap">
                <i className="fas fa-user-shield dark-icon" />
                <input
                  type="email"
                  className="dark-input"
                  id="adminEmail"
                  placeholder="admin@animverse.ai"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="dark-input-group">
              <label htmlFor="adminPassword">Admin Password</label>
              <div className="dark-input-wrap">
                <i className="fas fa-key dark-icon" />
                <input
                  type={showPw ? 'text' : 'password'}
                  className="dark-input"
                  id="adminPassword"
                  placeholder="Enter your admin password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <i
                  className={`fas fa-${showPw ? 'eye-slash' : 'eye'} dark-toggle-pw`}
                  onClick={() => setShowPw(!showPw)}
                />
              </div>
            </div>

            <div className="admin-form-row">
              <label>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                Keep me signed in
              </label>
              <a href="#" onClick={e => { e.preventDefault(); alert('Please contact system administrator to reset admin password.') }} className="admin-forgot">Forgot password?</a>
            </div>

            {/* Security Tips */}
            <div className="security-tips">
              <div className="security-tips-title"><i className="fas fa-info-circle" /> Security Notice</div>
              <ul>
                <li>Never share your admin credentials</li>
                <li>Use a private/incognito browser on shared devices</li>
                <li>Sessions expire after 24 hours of inactivity</li>
              </ul>
            </div>

            <button type="submit" className="admin-submit-btn" disabled={loading}>
              {loading ? (
                <><span className="spinner" /> Verifying...</>
              ) : (
                <><i className="fas fa-sign-in-alt" /> Access Admin Panel</>
              )}
            </button>
          </form>

          <hr className="dark-divider" />

          <div className="admin-footer-links">
            <Link to="/login" className="admin-user-link">
              <i className="fas fa-user" /> Login as Regular User
            </Link>
            <Link to="/" className="admin-back-home">
              <i className="fas fa-home" /> Back to AnimVerse AI Home
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.18)' }}>AnimVerse AI Admin Portal v1.0 — MCA Capstone 2025</span>
          </div>
        </div>
      </div>

      <style>{`
        .admin-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0D0D1A 0%, #1A0A00 50%, #2D0000 100%);
          overflow: hidden;
          position: relative;
          width: 100%;
        }
        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.25;
          pointer-events: none;
          animation: orbPulse 8s ease-in-out infinite;
        }
        .orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #E63946, transparent);
          top: -150px; right: -100px;
        }
        .orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #FF9F1C, transparent);
          bottom: -100px; left: -100px;
          animation-delay: 4s;
        }
        .orb-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #FFD60A, transparent);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 2s;
          opacity: 0.08;
        }
        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(1.3); opacity: 0.15; }
        }
        .admin-container {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .admin-login-card {
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.10);
          border-radius: 28px;
          padding: 56px 48px;
          width: 100%;
          max-width: 460px;
          box-shadow: 0 40px 80px rgba(0,0,0,0.50);
          animation: scaleIn 0.5s ease;
        }
        .admin-header { text-align: center; margin-bottom: 40px; }
        .admin-shield-wrap {
          position: relative;
          width: 88px; height: 88px;
          margin: 0 auto 20px;
        }
        .admin-shield-bg {
          width: 88px; height: 88px;
          background: linear-gradient(135deg, #E63946, #FF9F1C);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 2.2rem;
          box-shadow: 0 0 0 8px rgba(230,57,70,0.15), 0 0 0 16px rgba(230,57,70,0.08), 0 16px 48px rgba(230,57,70,0.40);
          animation: shieldPulse 3s ease-in-out infinite;
        }
        @keyframes shieldPulse {
          0%, 100% { box-shadow: 0 0 0 8px rgba(230,57,70,0.15), 0 0 0 16px rgba(230,57,70,0.08), 0 16px 48px rgba(230,57,70,0.40); }
          50% { box-shadow: 0 0 0 12px rgba(230,57,70,0.20), 0 0 0 24px rgba(230,57,70,0.10), 0 20px 60px rgba(230,57,70,0.50); }
        }
        .admin-header h1 { font-size: 1.8rem; font-weight: 800; color: white; margin-bottom: 6px; }
        .admin-header p { font-size: 0.85rem; color: rgba(255,255,255,0.45); }
        .security-badge {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: rgba(255,214,10,0.10);
          border: 1px solid rgba(255,214,10,0.25);
          border-radius: 50px;
          padding: 7px 16px;
          margin: 0 auto 28px;
          width: fit-content;
          font-size: 0.75rem; font-weight: 700;
          color: #FFD60A; letter-spacing: 0.5px;
        }
        .security-dot {
          width: 7px; height: 7px;
          background: #4CAF50; border-radius: 50%;
          box-shadow: 0 0 6px #4CAF50;
          animation: blink 2s infinite;
        }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0.3} }
        .dark-input-group { margin-bottom: 20px; }
        .dark-input-group label {
          display: block; margin-bottom: 8px;
          font-size: 0.82rem; font-weight: 600;
          color: rgba(255,255,255,0.70); letter-spacing: 0.3px;
        }
        .dark-input-wrap { position: relative; }
        .dark-input {
          width: 100%;
          padding: 14px 18px 14px 48px;
          background: rgba(255,255,255,0.07);
          border: 1.5px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          font-size: 0.9rem; color: white;
          transition: all 0.3s ease; outline: none;
        }
        .dark-input::placeholder { color: rgba(255,255,255,0.28); }
        .dark-input:focus {
          border-color: #E63946; background: rgba(255,255,255,0.10);
          box-shadow: 0 0 0 4px rgba(230,57,70,0.15);
        }
        .dark-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.35); font-size: 0.95rem; }
        .dark-toggle-pw { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.35); cursor: pointer; font-size: 0.9rem; }
        .dark-toggle-pw:hover { color: rgba(255,255,255,0.70); }
        .admin-form-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
        .admin-form-row label { display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: rgba(255,255,255,0.55); cursor: pointer; }
        .admin-form-row input[type=checkbox] { width: 15px; height: 15px; accent-color: #E63946; }
        .admin-forgot { font-size: 0.82rem; color: #FFD60A; font-weight: 600; }
        .admin-forgot:hover { color: #FF9F1C; }
        .admin-submit-btn {
          width: 100%; padding: 16px;
          background: linear-gradient(135deg, #E63946, #FF9F1C);
          border: none; border-radius: 12px;
          color: white; font-size: 0.98rem; font-weight: 700;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all 0.3s ease; box-shadow: 0 8px 32px rgba(230,57,70,0.40);
        }
        .admin-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 48px rgba(230,57,70,0.55); }
        .dark-alert { padding: 13px 16px; border-radius: 10px; font-size: 0.85rem; font-weight: 500; margin-bottom: 20px; display: none; align-items: center; gap: 10px; }
        .dark-alert.show { display: flex; }
        .dark-alert-error { background: rgba(230,57,70,0.15); border: 1px solid rgba(230,57,70,0.35); color: #FF8080; }
        .dark-alert-success { background: rgba(76,175,80,0.15); border: 1px solid rgba(76,175,80,0.35); color: #80E880; }
        .admin-footer-links { margin-top: 28px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .admin-user-link, .admin-back-home { font-size: 0.82rem; color: rgba(255,255,255,0.45); display: flex; align-items: center; gap: 6px; }
        .admin-user-link:hover, .admin-back-home:hover { color: #FFD60A; }
        .dark-divider { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0; }
        .security-tips { background: rgba(255,214,10,0.06); border: 1px solid rgba(255,214,10,0.15); border-radius: 10px; padding: 14px 16px; margin-bottom: 20px; }
        .security-tips-title { font-size: 0.75rem; font-weight: 700; color: #FFD60A; display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
        .security-tips ul { list-style: none; padding: 0; margin: 0; }
        .security-tips ul li { font-size: 0.73rem; color: rgba(255,255,255,0.45); margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
        .security-tips ul li::before { content: '▹'; color: #FFD60A; }
      `}</style>
    </div>
  )
}
