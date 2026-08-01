import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)

  const showAlert = (type, msg) => {
    setAlert({ type, msg })
  }

  const handleForgot = async (e) => {
    e.preventDefault()
    if (!email) {
      showAlert('error', 'Please enter your email address.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (data.success) {
        showAlert('success', 'Password reset link sent! Please check your email inbox.')
      } else {
        showAlert('error', data.message || 'Email not found in our system.')
      }
    } catch {
      showAlert('error', 'Server error. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fp-page-wrapper">
      <div className="fp-card">
        <div className="fp-icon">🔑</div>
        <h1 className="fp-title">Forgot Password?</h1>
        <p className="fp-desc">Enter your email address and we'll send you a link to reset your password.</p>
        
        {alert && (
          <div className={`alert alert-${alert.type} show`} style={{ textAlign: 'left' }}>
            <i className={`fas fa-${alert.type === 'error' ? 'exclamation-circle' : 'check-circle'}`} />
            <span>{alert.msg}</span>
          </div>
        )}

        <form onSubmit={handleForgot}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label htmlFor="fpEmail">Email Address</label>
            <div className="input-icon-wrap">
              <i className="fas fa-envelope input-icon" />
              <input 
                type="email" 
                className="form-control" 
                id="fpEmail" 
                placeholder="you@example.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>
          <button type="submit" className="btn-fp" disabled={loading}>
            {loading ? <><span className="spinner" /> Sending...</> : <><i className="fas fa-paper-plane" /> Send Reset Link</>}
          </button>
        </form>
        <div className="back-to-login">
          Remember your password? <Link to="/login">Sign in</Link>
        </div>
      </div>

      <style>{`
        .fp-page-wrapper {
          min-height: 100vh;
          background: var(--off-white);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .fp-card {
          background: white;
          border-radius: var(--radius-lg);
          padding: 56px 48px;
          max-width: 440px;
          width: 100%;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border);
          text-align: center;
        }
        .fp-icon {
          width: 72px; height: 72px;
          background: linear-gradient(135deg, var(--secondary), var(--secondary-dark));
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem;
          margin: 0 auto 24px;
          box-shadow: 0 8px 24px rgba(255,214,10,0.35);
        }
        .fp-title { font-size: 1.6rem; font-weight: 800; margin-bottom: 8px; }
        .fp-desc { font-size: 0.88rem; color: var(--text-muted); margin-bottom: 32px; line-height: 1.6; }
        .btn-fp {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          border: none;
          border-radius: var(--radius-sm);
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
          font-family: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .btn-fp:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(230,57,70,0.40); }
        .back-to-login { display: block; margin-top: 20px; font-size: 0.85rem; color: var(--text-muted); }
        .back-to-login a { color: var(--primary); font-weight: 600; }
      `}</style>
    </div>
  )
}
